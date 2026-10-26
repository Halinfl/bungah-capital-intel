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
  decisionSupportFooter,
  formatMarketMemo,
  formatSupplyRanking,
  isCoveredMarketPhrase,
  isSupplyRankingQuestion,
  namedCoveredMarkets,
  retrieveGraphContext,
  serializeGraphPack,
  type ChatAnswer,
  type GraphContext,
} from "./chat";
import { adviceDeclineLines, classifyAdviceRequest, type AdviceKind } from "./chat-advice";
import { detectUncoveredPlaces, uncoveredMarketLines, withoutPlaces, type UncoveredPlace } from "./chat-coverage";
import { scrubSeedLines } from "./format";
import { scrubInternal } from "./public-text";
import type { ChatIntent } from "./chat-intent";
import {
  formatDigestFallbackMemo,
  retrieveAllowedCorpus,
  type CorpusPack,
} from "./chat-retrieve";
import { radarChatAnswer } from "./radars-preview";

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
  if (/didn't match a market we cover/i.test(answer.content) && !hadMarket && !hadCorpus)
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

type FinalAnswer = ChatAnswer & { answeredWell: boolean };

/**
 * The single place an answer becomes final: display guards (seed wording, internal labels)
 * run once here, so the text returned, stored and rendered is the same text. Callers must not
 * rewrite `content` afterwards (one answer per question, no post-render swap).
 */
function finalize(answer: ChatAnswer, answeredWell: boolean): FinalAnswer {
  return {
    ...answer,
    content: scrubInternal(scrubSeedLines(answer.content)),
    answeredWell,
  };
}

/** Digests count as issuer-led only when the question names the issuer or asks about REITs / brands / earnings. */
const ISSUER_THEME =
  /\b(reits?|earnings|guidance|franchis(e|ee|or)|brands?|branded|fee platform|net unit growth|nug|buybacks?|capital return|owner[- ]operator)\b/i;

function issuerDigests(question: string, corpus: CorpusPack): CorpusPack["digests"] {
  if (ISSUER_THEME.test(question)) return corpus.digests;
  return corpus.digests.filter((d) => d.score >= 5);
}

/** Uncovered places named in the question, unless a covered market or deep-link is also in play. */
function uncoveredFor(
  question: string,
  ctx: GraphContext,
  marketSlug: string | null | undefined
): { places: UncoveredPlace[]; alsoCovered: boolean } {
  const places = detectUncoveredPlaces(question, (phrase) => isCoveredMarketPhrase(phrase, ctx.markets));
  if (!places.length) return { places, alsoCovered: false };
  const alsoCovered =
    Boolean(marketSlug) || namedCoveredMarkets(withoutPlaces(question, places), ctx.markets).length > 0;
  return { places, alsoCovered };
}

/** Buy / sell / should-I-invest (or staff-cut) request: fixed decline, then the relevant cited facts. */
function adviceAnswer(
  kind: AdviceKind,
  question: string,
  ctx: GraphContext,
  corpus: CorpusPack,
  marketSlug: string | null | undefined
): ChatAnswer {
  const lines = [...adviceDeclineLines(kind), ""];
  const citations: string[] = [];
  const { places, alsoCovered } = uncoveredFor(question, ctx, marketSlug);
  const market = ctx.matched && (!places.length || alsoCovered) ? ctx.matched : null;
  if (places.length && !alsoCovered) lines.push(...uncoveredMarketLines(places, ctx.markets), "");
  if (market) {
    const memo = formatMarketMemo(market, ctx.intent === "unknown" ? "general_thesis" : ctx.intent);
    lines.push(memo.content.replace(decisionSupportFooter(), "").trimEnd(), "");
    citations.push(...memo.citations);
  }
  const digests = issuerDigests(question, corpus);
  const digestMemo = formatDigestFallbackMemo(digests);
  if (digestMemo) {
    lines.push(digestMemo, "");
    citations.push(...digests.map((d) => d.citePath));
  }
  if (!market && !digestMemo && !(places.length && !alsoCovered)) {
    lines.push(
      "Name a market or a REIT (for example, [Nashville](/markets/nashville) or [Host Hotels](/reits)) and Chat will show its cited facts. Or [browse the markets we cover](/markets)."
    , "");
  }
  if (!digestMemo) lines.push(decisionSupportFooter());
  return {
    content: lines.join("\n").replace(/\n{3,}/g, "\n\n").trim(),
    citations: [...new Set(citations)],
    intent: "advice_declined",
    marketSlug: market?.slug ?? marketSlug ?? null,
    mode: "deterministic",
  };
}

/**
 * Primary chat entry. Order:
 *   1. Advice guard (buy / sell / should-I-invest, staff cuts) — classified before anything else.
 *   2. Radar "Ask Chat about this" detail.
 *   3. Uncovered market (Boise, London…) — not covered yet, closest covered markets, no figures.
 *   4. Supply-pipeline ranking across covered markets (cited score rows, or a plain "can't rank").
 *   5. LLM only when explicitly enabled; otherwise deterministic graph / digest memos.
 * Steps 1, 3 and 4 never call a model. Every path returns exactly one final answer.
 */
export async function answerChat(
  question: string,
  opts?: { marketSlug?: string | null }
): Promise<FinalAnswer> {
  const advice = classifyAdviceRequest(question);

  // Radar cards' "Ask Chat about this": answer with the full verified radar detail.
  const radar = advice ? null : radarChatAnswer(question);
  if (radar) {
    return finalize(
      {
        content: radar.content,
        citations: radar.sources.map((s) => s.label),
        sources: radar.sources,
        marketSlug: null,
        mode: "deterministic",
      },
      true
    );
  }
  const [ctx, corpus] = await Promise.all([
    retrieveGraphContext(question, opts?.marketSlug),
    retrieveAllowedCorpus(question),
  ]);

  if (advice) {
    return finalize(adviceAnswer(advice, question, ctx, corpus, opts?.marketSlug), true);
  }

  const { places, alsoCovered } = uncoveredFor(question, ctx, opts?.marketSlug);
  if (places.length && !alsoCovered) {
    return finalize(
      {
        content: [...uncoveredMarketLines(places, ctx.markets), "", decisionSupportFooter()].join("\n"),
        citations: [],
        sources: [],
        intent: "uncovered_market",
        marketSlug: null,
        mode: "deterministic",
      },
      // A coverage gap, not a served answer: keep it visible in the question log.
      false
    );
  }
  // A covered market named alongside an uncovered one: one answer, coverage note first.
  const coverageNote = places.length
    ? uncoveredMarketLines(places, ctx.markets).filter((l) => !/Browse every market/.test(l))
    : [];
  const withNote = (a: FinalAnswer): FinalAnswer =>
    coverageNote.length ? finalize({ ...a, content: [...coverageNote, a.content].join("\n") }, a.answeredWell) : a;

  // "Compare Boise and Denver": only one side is covered, so answer that market alone.
  if (coverageNote.length && ctx.intent === "compare_markets" && ctx.matched) {
    const memo = formatMarketMemo(ctx.matched, "general_thesis");
    return withNote(finalize({ ...memo, intent: "compare_markets" }, true));
  }

  if (!opts?.marketSlug && isSupplyRankingQuestion(question, ctx.matched)) {
    const ranked = formatSupplyRanking(ctx.markets, question);
    return withNote(finalize({ ...ranked, intent: "supply_ranking" }, ranked.citations.length > 0));
  }

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
        return withNote(
          finalize(answer, answeredWellHeuristic(answer, ctx.intent, Boolean(ctx.matched), hadCorpus))
        );
      }
    } catch (err) {
      console.error("[chat-llm] generateText failed; falling back", err);
    }
  }

  // Deterministic memo. REIT digests only when the question names the issuer or asks about
  // REITs / earnings — never as a soft pull onto market, supply or uncovered questions.
  const digests = issuerDigests(question, corpus);
  const digestMemo = formatDigestFallbackMemo(digests);
  const digestCites = digests.map((d) => d.citePath);
  // National debt questions answer from cited graph rows, not REIT digest soft-pulls.
  const nationalDebtFromGraph =
    ctx.intent === "debt_overlay" && !corpus.digests.some((d) => d.score >= 5);
  if (digestMemo && !ctx.matched && !nationalDebtFromGraph) {
    const answer: ChatAnswer = {
      content: digestMemo,
      citations: digestCites,
      intent: ctx.intent,
      marketSlug: opts?.marketSlug ?? null,
      mode: "deterministic",
    };
    return withNote(finalize(answer, answeredWellHeuristic(answer, ctx.intent, false, true)));
  }

  const fallback = await answerFromGraph(question, opts);
  // A named issuer alongside a market: one memo with a REIT section, not a second answer.
  if (digestMemo && ctx.matched) {
    const merged: ChatAnswer = {
      ...fallback,
      content: [
        fallback.content,
        "",
        "**Related REIT read (named in your question)**",
        "",
        digestMemo,
      ].join("\n"),
      citations: [...new Set([...fallback.citations, ...digestCites])],
      intent: fallback.intent ?? ctx.intent,
      marketSlug:
        fallback.marketSlug ?? ctx.matched?.slug ?? opts?.marketSlug ?? null,
      mode: "deterministic",
    };
    return withNote(
      finalize(merged, answeredWellHeuristic(merged, ctx.intent, Boolean(ctx.matched), true))
    );
  }

  const answer: ChatAnswer = {
    ...fallback,
    intent: fallback.intent ?? ctx.intent,
    marketSlug: fallback.marketSlug ?? ctx.matched?.slug ?? opts?.marketSlug ?? null,
    mode: "deterministic",
  };
  return withNote(
    finalize(answer, answeredWellHeuristic(fallback, ctx.intent, Boolean(ctx.matched), hadCorpus))
  );
}
