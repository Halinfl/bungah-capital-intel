/**
 * Graph-grounded LLM path for Bungah Capital Intel chat.
 *
 * SPEND LOCK (Hal): BUNGAH_USE_LLM defaults to false — no Groq / AI Gateway /
 * OpenAI inference until paying members. Chat uses deterministic graph+digest
 * memos. Flip BUNGAH_USE_LLM=true only when spend is approved.
 *
 * When enabled, provider order (OSS preferred):
 *   1. GROQ_API_KEY  → Groq OpenAI-compatible (llama-3.3-70b-versatile)
 *   2. AI_GATEWAY_API_KEY → Gateway OSS slug (default meta/llama-3.3-70b)
 *   3. OPENAI_API_KEY → direct OpenAI (gpt-4o-mini)
 *   4. Deterministic memo fallback (no key / call fails)
 *
 * Context = Capital Graph pack + allowed authored digests / ideology notes.
 * No fine-tune job yet — RAG + generateText only when LLM is on.
 * `npm run train:export` writes public-chat JSONL for a *future* OSS fine-tune
 * (see data/train/README.md); production stays graph+digest RAG.
 */
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import {
  answerFromGraph,
  retrieveGraphContext,
  serializeGraphPack,
  type ChatAnswer,
} from "./chat";
import type { ChatIntent } from "./chat-intent";
import {
  formatDigestFallbackMemo,
  retrieveAllowedCorpus,
} from "./chat-retrieve";

/** Confirmed via `vercel ai-gateway models ls` (meta/llama family). */
export const DEFAULT_GATEWAY_OSS_MODEL = "meta/llama-3.3-70b";
/** Groq OpenAI-compatible chat model id. */
export const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

const SYSTEM_PROMPT = `You are Bungah Capital Intel — a hotel / hospitality-capital IC analyst chat.

Rules (non-negotiable):
1. Answer ONLY from the Capital Graph facts and the allowed authored corpus (earnings digests / ideology notes) provided in the user message. Never invent STR, visitation, ADR, OCC, RevPAR, pipeline, or debt numbers.
2. Answer only from the cited rows in the pack. Seed / placeholder rows are excluded. If a market has few cited rows, say only what is cited and add: "Deeper cited coverage for <market> is in progress." Never invent figures.
3. Decision support: surface cited facts and so-whats for human decision. Never recommend auto-executing capital, never claim private CSP, never book or source meetings.
4. Human-touch / talent / staffing / GC-MEP capacity is a first-class greenlight gate alongside demand, supply, and debt.
5. When intent emphasizes a lens (supply, talent, RevPAR, which-submarket, debt, demand), lead with that lens — then support with the rest of the pack.
6. Use concise IC-memo markdown. Cite sources by repeating sourceLabel strings from the graph pack AND digest file paths (e.g. content/earnings/hilton/2026-Q2-digest.md).
7. Digests are editor-authored summaries of public IR — prefer them over inventing call color. Do not claim you read a paywalled transcript unless the digest cites it.
8. If the pack lacks enough to answer, say what is missing and invite a richer private workspace — do not hallucinate coverage.
9. Product name: Bungah Capital Intel. Never mention internal team or agent names.
10. When a Deep-link market slug or Primary market is present, lead with THAT market's dashboard memo (metrics, signals, nuance). Never open with National talent / Orlando Epic / Vegas Hard Rock copy unless the deep-linked market is orlando or las-vegas respectively. National signals are secondary one-liners only.
11. Do not privilege Orlando or Las Vegas when the question names another market.`;

/** Explicit opt-in; default false (Hal spend lock — no paid inference). */
export function isLlmEnabled(): boolean {
  const v = process.env.BUNGAH_USE_LLM?.trim().toLowerCase();
  // Deliberately require the explicit string `true`; aliases such as `1` or
  // `yes` make an accidental spend unlock too easy in a deployment env.
  return v === "true";
}

export function hasLlmCredentials(): boolean {
  if (!isLlmEnabled()) return false;
  return Boolean(
    process.env.GROQ_API_KEY?.trim() ||
      process.env.AI_GATEWAY_API_KEY?.trim() ||
      process.env.OPENAI_API_KEY?.trim()
  );
}

function bareModelId(modelId: string): string {
  return modelId.includes("/") ? modelId.split("/").pop()! : modelId;
}

/**
 * Resolve AI SDK model by provider preference.
 * Override any path with BUNGAH_CHAT_MODEL (gateway slug or bare id).
 */
function resolveModel() {
  // Spend lock: never resolve a paid/OSS remote model unless explicitly enabled.
  if (!isLlmEnabled()) return null;

  const groqKey = process.env.GROQ_API_KEY?.trim();
  const gatewayKey = process.env.AI_GATEWAY_API_KEY?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  const override = process.env.BUNGAH_CHAT_MODEL?.trim();

  if (groqKey) {
    const groq = createOpenAI({
      apiKey: groqKey,
      baseURL: GROQ_BASE_URL,
    });
    const modelId = override || DEFAULT_GROQ_MODEL;
    // Groq expects bare ids (llama-3.3-70b-versatile); strip provider prefix if set.
    return groq(bareModelId(modelId));
  }

  if (gatewayKey) {
    // AI SDK routes provider/model strings through AI Gateway when AI_GATEWAY_API_KEY is set.
    // Prefer OSS meta/llama over openai/* unless Hal overrides.
    const modelId = override || DEFAULT_GATEWAY_OSS_MODEL;
    return modelId.includes("/") ? modelId : `meta/${modelId}`;
  }

  if (openaiKey) {
    const openai = createOpenAI({ apiKey: openaiKey });
    const modelId = override || DEFAULT_OPENAI_MODEL;
    return openai(bareModelId(modelId));
  }

  return null;
}

function answeredWellHeuristic(
  answer: ChatAnswer,
  intent: ChatIntent,
  hadMarket: boolean,
  hadCorpus: boolean
): boolean {
  if (!answer.content || answer.content.length < 40) return false;
  if (/Create an account/i.test(answer.content) && !hadMarket && !hadCorpus)
    return false;
  if (answer.mode === "llm") return true;
  if (hadMarket || hadCorpus) return true;
  if (
    intent === "debt_overlay" ||
    intent === "talent_greenlight" ||
    intent === "compare_markets"
  ) {
    return true;
  }
  return (answer.citations?.length ?? 0) > 0;
}

/**
 * Primary chat entry: retrieve graph + digests → LLM only when explicitly enabled → otherwise deterministic graph/digest memos.
 */
export async function answerChat(
  question: string,
  opts?: { marketSlug?: string | null }
): Promise<ChatAnswer & { answeredWell: boolean }> {
  const [ctx, corpus] = await Promise.all([
    retrieveGraphContext(question, opts?.marketSlug),
    retrieveAllowedCorpus(question),
  ]);
  const { pack, citations: packCitations } = serializeGraphPack(ctx);
  const allCitations = [
    ...new Set([...packCitations, ...corpus.citations]),
  ];
  const hadCorpus = corpus.digests.length > 0 || corpus.ideology.length > 0;

  const model = resolveModel();
  if (model) {
    try {
      const { text } = await generateText({
        model: model as Parameters<typeof generateText>[0]["model"],
        system: SYSTEM_PROMPT,
        prompt: [
          `User question: ${question}`,
          opts?.marketSlug ? `Deep-link market slug: ${opts.marketSlug}` : "",
          `Classified intent: ${ctx.intent}`,
          "",
          "=== CAPITAL GRAPH PACK (cite only these facts) ===",
          pack,
          "=== END GRAPH PACK ===",
          "",
          hadCorpus
            ? [
                "=== ALLOWED AUTHORED CORPUS (digests / ideology — cite by file path) ===",
                corpus.pack,
                "=== END CORPUS ===",
                "",
              ].join("\n")
            : "=== ALLOWED AUTHORED CORPUS ===\n(none matched this question)\n=== END CORPUS ===\n",
          "Write the IC-style answer now.",
        ]
          .filter(Boolean)
          .join("\n"),
        temperature: 0.2,
        maxOutputTokens: 1400,
      });

      const content = (text ?? "").trim();
      if (content) {
        const answer: ChatAnswer = {
          content,
          citations: allCitations,
          intent: ctx.intent,
          marketSlug: ctx.matched?.slug ?? opts?.marketSlug ?? null,
          mode: "llm",
        };
        return {
          ...answer,
          answeredWell: answeredWellHeuristic(
            answer,
            ctx.intent,
            Boolean(ctx.matched),
            hadCorpus
          ),
        };
      }
    } catch (err) {
      console.error("[chat-llm] generateText failed; falling back", err);
    }
  }

  // Deterministic fallback: prefer digest headline memo when issuer-matched
  const digestMemo = formatDigestFallbackMemo(corpus.digests);
  if (digestMemo && !ctx.matched) {
    const answer: ChatAnswer = {
      content: digestMemo,
      citations: corpus.citations,
      intent: ctx.intent,
      marketSlug: opts?.marketSlug ?? null,
      mode: "deterministic",
    };
    return {
      ...answer,
      answeredWell: answeredWellHeuristic(
        answer,
        ctx.intent,
        false,
        true
      ),
    };
  }

  const fallback = await answerFromGraph(question, opts);
  // Append digest citations when we also matched digests alongside a market memo
  if (digestMemo && ctx.matched) {
    const merged: ChatAnswer = {
      ...fallback,
      content: [fallback.content, "", "---", "", digestMemo].join("\n"),
      citations: [...new Set([...fallback.citations, ...corpus.citations])],
      intent: fallback.intent ?? ctx.intent,
      marketSlug:
        fallback.marketSlug ?? ctx.matched?.slug ?? opts?.marketSlug ?? null,
      mode: "deterministic",
    };
    return {
      ...merged,
      answeredWell: answeredWellHeuristic(
        merged,
        ctx.intent,
        Boolean(ctx.matched),
        true
      ),
    };
  }

  return {
    ...fallback,
    intent: fallback.intent ?? ctx.intent,
    marketSlug: fallback.marketSlug ?? ctx.matched?.slug ?? opts?.marketSlug ?? null,
    mode: "deterministic",
    answeredWell: answeredWellHeuristic(
      fallback,
      ctx.intent,
      Boolean(ctx.matched),
      hadCorpus
    ),
  };
}
