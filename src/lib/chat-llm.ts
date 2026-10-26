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
import {
  DATE_RANGES,
  registerSweepStamps,
  DECISION_LINE,
  RANGE_LABEL,
  briefMarkdown,
  coverageLine,
  makeBrief,
  type DateRange,
  dedupeMarkdown,
  dropOffLimitsSentences,
  stripDecisionBoilerplate,
  toRead,
  type ChatBrief,
} from "./chat-brief";
import {
  compareBrief,
  digestBrief,
  digestReads,
  marketBrief,
  nationalDebtBrief,
  ratesBrief,
  propertyBrief,
  uncoveredBrief,
  windowDigests,
  windowMarket,
  windowSignals,
  type BriefOpts,
} from "./chat-brief-build";
import { matchProperty } from "./chat-property";

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
    intent === "rates" ||
    intent === "talent_greenlight" ||
    intent === "compare_markets"
  ) {
    return true;
  }
  return (answer.citations?.length ?? 0) > 0;
}

type FinalAnswer = ChatAnswer & { answeredWell: boolean; brief?: ChatBrief };

const FOOTER_LINES =
  /^_Decision support:_.*$|^_Decision support:_ digest facts.*$|^Decision support, not a recommendation\. You make the call\.$/gm;

/** Answers without a brief: drop per-row "Decision support" repeats and duplicate paragraphs; one footer. */
function cleanLegacy(content: string): string {
  const body = dedupeMarkdown(
    dropOffLimitsSentences(stripDecisionBoilerplate(content.replace(FOOTER_LINES, "")))
  );
  return `${body}\n\n${DECISION_LINE}`;
}

/**
 * The single place an answer becomes final: display guards (seed wording, internal labels)
 * run once here, so the text returned, stored and rendered is the same text. Callers must not
 * rewrite `content` afterwards (one answer per question, no post-render swap).
 * With a brief, the stored text is the brief's own markdown (same facts, same order).
 */
function finalize(answer: ChatAnswer & { brief?: ChatBrief }, answeredWell: boolean): FinalAnswer {
  const content = answer.brief ? briefMarkdown(answer.brief) : cleanLegacy(answer.content);
  // Under a date window the answer's citations are exactly the windowed brief's citations.
  const windowed = answer.brief?.window && answer.brief.window.range !== "all";
  return {
    ...answer,
    ...(windowed ? { citations: [...new Set((answer.brief!.cited ?? []).map((c) => c.label))] } : {}),
    content: scrubInternal(scrubSeedLines(content)),
    answeredWell,
  };
}

function declineText(kind: AdviceKind): string {
  return kind === "staff_cut"
    ? "**We don't recommend staff cuts.** Labor is underwritten at the cited wage floors and contracts, human touch first. Here's what the data shows."
    : "**We don't give buy or sell recommendations.** Here's what the data shows.";
}

/** Brief for whatever the question names: a hotel, a market (+ named REIT), or REIT digests. */
function subjectBrief(
  question: string,
  ctx: GraphContext,
  corpus: CorpusPack,
  marketSlug: string | null | undefined,
  opts: BriefOpts
): ChatBrief | null {
  const prop = matchProperty(question);
  if (prop) {
    const market = ctx.markets.find((m) => m.slug === prop.marketSlug) ?? null;
    return propertyBrief(prop, market, opts);
  }
  const digests = issuerDigests(question, corpus);
  const { places, alsoCovered } = uncoveredFor(question, ctx, marketSlug);
  const market = ctx.matched && (!places.length || alsoCovered) ? ctx.matched : null;
  if (market) {
    const extra = digests.length ? digestReads(digests[0], question) : null;
    return marketBrief(market, ctx.intent, {
      ...opts,
      extraReads: extra?.reads[0] ? [toRead(extra.reads[0])] : undefined,
      extraSections: extra ? extra.sections : undefined,
      extraCites: extra?.cites,
    });
  }
  if (digests.length) return digestBrief(digests, question, opts);
  if (places.length) return uncoveredBrief(places, ctx.markets, opts);
  return null;
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
  marketSlug: string | null | undefined,
  range: DateRange = "all"
): ChatAnswer & { brief?: ChatBrief } {
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
  const brief = subjectBrief(question, ctx, corpus, marketSlug, { decline: declineText(kind), range });
  const prop = matchProperty(question);
  return {
    content: lines.join("\n").replace(/\n{3,}/g, "\n\n").trim(),
    citations: [...new Set(citations)],
    intent: "advice_declined",
    marketSlug: prop?.marketSlug ?? market?.slug ?? marketSlug ?? null,
    mode: "deterministic",
    ...(brief ? { brief } : {}),
  } as ChatAnswer & { brief?: ChatBrief };
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
  opts?: { marketSlug?: string | null; range?: DateRange }
): Promise<FinalAnswer> {
  const range = opts?.range ?? "all";
  const res = await answerChatIn(question, { marketSlug: opts?.marketSlug, range });
  if (range === "all") return res;
  if (!res.brief?.window?.filterable) {
    // Either an intent that can't filter by date (answered in full, no chip), or the window
    // removed everything the answer was built on (say so plainly, keep the chip).
    const full = await answerChatIn(question, { marketSlug: opts?.marketSlug, range: "all" });
    return full.brief?.window?.filterable ? emptyWindowAnswer(full, range) : full;
  }
  if (!res.brief.span?.sources) return emptyWindowAnswer(res, range);
  return res;
}

/** A date window with no cited source in it: a plain statement, no figures, the chip stays. */
export function emptyWindowAnswer(full: FinalAnswer, range: DateRange): FinalAnswer {
  const label = RANGE_LABEL[range].toLowerCase();
  // Only wider windows can add older sources: 90 days → 12 months or All; 12 months → All.
  const wider = range === "90d" ? "Last 12 months or All" : "All";
  void DATE_RANGES;
  const brief = makeBrief({
    decline: full.brief?.decline,
    answer: `Nothing cited for this question is dated in the ${label}. Choose ${wider} to include older sources.`,
    reads: [],
    coverage: coverageLine({ cites: [], range }),
    window: { range, filterable: true },
    sections: [],
  });
  return finalize({ ...full, brief, citations: [], sources: [] }, full.answeredWell);
}

/** Restrict a retrieved graph to a date window (matching and intent are unchanged). */
function windowContext(ctx: GraphContext, range: DateRange): GraphContext {
  const markets = ctx.markets.map((m) => windowMarket(m, range));
  const byId = new Map(markets.map((m) => [m.id, m]));
  return {
    ...ctx,
    markets,
    matched: ctx.matched ? byId.get(ctx.matched.id) ?? null : null,
    secondary: ctx.secondary.map((m) => byId.get(m.id)!).filter(Boolean),
    nationalSignals: windowSignals(ctx.nationalSignals, range),
    // Radar findings carry no data date of their own, so a window leaves them out.
    radars: ctx.radars.map((r) => ({ ...r, findings: [] })),
  };
}

async function answerChatIn(
  question: string,
  opts: { marketSlug?: string | null; range: DateRange }
): Promise<FinalAnswer> {
  const range = opts.range;
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
  const [ctxAll, corpusAll] = await Promise.all([
    retrieveGraphContext(question, opts?.marketSlug),
    retrieveAllowedCorpus(question),
  ]);
  // Load / sweep stamps (a date shared by many rows) are when rows were collected, never a data period.
  registerSweepStamps([...ctxAll.markets.flatMap((m) => m.signals.map((s) => s.asOf)), ...ctxAll.nationalSignals.map((s) => s.asOf)]);
  // Date window: every brief below is built only from rows dated inside it.
  const ctx = range === "all" ? ctxAll : windowContext(ctxAll, range);
  const corpus = range === "all" ? corpusAll : { ...corpusAll, digests: windowDigests(corpusAll.digests, range) };

  if (advice) {
    return finalize(adviceAnswer(advice, question, ctx, corpus, opts?.marketSlug, range), true);
  }

  const { places, alsoCovered } = uncoveredFor(question, ctx, opts?.marketSlug);
  if (places.length && !alsoCovered) {
    return finalize(
      {
        content: [...uncoveredMarketLines(places, ctx.markets), "", decisionSupportFooter()].join("\n"),
        brief: uncoveredBrief(places, ctx.markets),
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
  const noteText = places.map((p) => (p.kind === "international" ? `${p.label} isn't covered (US markets only).` : `${p.label} isn't covered yet.`));
  const withNote = (a: FinalAnswer): FinalAnswer => {
    if (!coverageNote.length) return a;
    if (a.brief) {
      const brief = { ...a.brief, coverage: `${a.brief.coverage} ${noteText.join(" ")}`, coverageNotes: [...(a.brief.coverageNotes ?? []), ...noteText] };
      return finalize({ ...a, brief: { ...brief, collapsedChars: a.brief.collapsedChars + noteText.join(" ").length + 1 } }, a.answeredWell);
    }
    return finalize({ ...a, content: [...coverageNote, a.content].join("\n") }, a.answeredWell);
  };

  // A named hotel from the REIT property schedules: owner, what's on file, submarket context.
  const prop = matchProperty(question);
  if (prop) {
    const market = ctxAll.markets.find((m) => m.slug === prop.marketSlug) ?? null;
    const brief = propertyBrief(prop, market);
    return withNote(
      finalize(
        { content: "", brief, citations: [prop.source, ...(prop.curated?.facts.map((f) => f.label) ?? [])], intent: "property_asset", marketSlug: prop.marketSlug, mode: "deterministic" },
        true
      )
    );
  }

  // "Compare Boise and Denver": only one side is covered, so answer that market alone.
  if (coverageNote.length && ctx.intent === "compare_markets" && ctx.matched) {
    const memo = formatMarketMemo(ctx.matched, "general_thesis");
    return withNote(finalize({ ...memo, brief: marketBrief(ctx.matched, "general_thesis"), intent: "compare_markets" }, true));
  }

  if (!opts?.marketSlug && isSupplyRankingQuestion(question, ctx.matched)) {
    const ranked = formatSupplyRanking(ctxAll.markets, question);
    return withNote(finalize({ ...ranked, intent: "supply_ranking" }, ranked.citations.length > 0));
  }

  const { pack, citations: packCitations } = serializeGraphPack(ctx);
  const allCitations = [
    ...new Set([...packCitations, ...corpus.citations]),
  ];
  const hadCorpus = corpus.digests.length > 0 || corpus.ideology.length > 0;

  const model = range === "all" ? resolveModel() : null;
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
    ctx.intent === "debt_overlay" && !corpusAll.digests.some((d) => d.score >= 5);
  if (digestMemo && !ctx.matched && !nationalDebtFromGraph) {
    const answer: ChatAnswer & { brief?: ChatBrief } = {
      content: digestMemo,
      brief: digestBrief(digests, question, { range }),
      citations: digestCites,
      // Earnings-call / REIT digest answer (a question naming Pebblebrook classifies as unknown otherwise).
      intent: ctx.intent === "unknown" || ctx.intent === "general_thesis" || ctx.intent === "revpar_metrics" ? "reit_call" : ctx.intent,
      marketSlug: opts?.marketSlug ?? null,
      mode: "deterministic",
    };
    return withNote(finalize(answer, answeredWellHeuristic(answer, ctx.intent, false, true)));
  }

  const fallback: ChatAnswer & { brief?: ChatBrief } = await answerFromGraph(question, opts);
  const graphBrief = briefForGraph(question, ctx, digestMemo && ctx.matched ? issuerDigests(question, corpus) : [], range);
  if (graphBrief) fallback.brief = graphBrief;
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
      brief: fallback.brief,
    } as ChatAnswer & { brief?: ChatBrief };
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

/** Brief for the deterministic graph answer (same branch order as answerFromGraph). */
function briefForGraph(question: string, ctx: GraphContext, namedDigests: CorpusPack["digests"], range: DateRange = "all"): ChatBrief | null {
  const { matched, intent, nationalSignals, radars } = ctx;
  if (!question.trim()) return null;
  if (intent === "compare_markets") {
    const unique = [matched, ...ctx.secondary].filter((m, i, arr): m is NonNullable<typeof m> => Boolean(m) && arr.findIndex((x) => x?.id === m!.id) === i);
    if (unique.length >= 2) return compareBrief(unique[0], unique[1], question, intent);
    return null;
  }
  // Hotel-tax series answers keep their newest-first table (no brief).
  if (intent === "tax_collections") return null;
  if (matched) {
    const overlay =
      intent === "talent_greenlight"
        ? nationalSignals.find((s) => s.kind === "talent") ?? null
        : intent === "debt_overlay"
          ? nationalSignals.find((s) => s.kind === "debt") ?? null
          : null;
    const extra = namedDigests.length ? digestReads(namedDigests[0], question) : null;
    return marketBrief(matched, intent, {
      nationalOverlay: overlay,
      extraReads: extra?.reads[0] ? [toRead(extra.reads[0])] : undefined,
      extraSections: extra?.sections,
      extraCites: extra?.cites,
    });
  }
  if (intent === "rates") return ratesBrief(nationalSignals, question, { range });
  if (intent === "debt_overlay") {
    const findings = radars.filter((r) => r.slug.includes("debt")).flatMap((r) => r.findings);
    return nationalDebtBrief(nationalSignals, findings, { range });
  }
  return null;
}
