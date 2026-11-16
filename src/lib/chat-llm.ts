/**
 * Graph-grounded LLM path for Bungah Capital Intel chat.
 *
 * SPEND LOCK (Hal): BUNGAH_USE_LLM defaults to false — no Groq / AI Gateway /
 * OpenAI inference until paying members. Chat uses deterministic graph+digest
 * memos. Flip BUNGAH_USE_LLM=true only when spend is approved.
 *
 * When enabled, provider order (OSS preferred):
 *   1. GROQ_API_KEY  → Groq OpenAI-compatible (openai/gpt-oss-120b, Production only)
 *   2. AI_GATEWAY_API_KEY → Gateway OSS slug (default meta/llama-3.3-70b)
 *   3. OPENAI_API_KEY → direct OpenAI (gpt-4o-mini)
 *   4. Deterministic memo fallback (no key / call fails / cap / 429 / private thread)
 *
 * Signed-in private threads never call Groq. Preview/Beta Groq models are refused.
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
  formatTaxMemo,
  formatSupplyRanking,
  inMentionOrder,
  isCoveredMarketPhrase,
  isSupplyRankingQuestion,
  namedCoveredMarkets,
  retrieveGraphContext,
  type ChatAnswer,
  type GraphContext,
} from "./chat";
import { adviceDeclineLines, classifyAdviceRequest, type AdviceKind } from "./chat-advice";
import { isBareRates } from "./chat-intent";
import { detectUncoveredPlaces, uncoveredMarketLines, withoutPlaces, type UncoveredPlace } from "./chat-coverage";
import { scrubSeedLines } from "./format";
import { isFedPolicyQuestion } from "./fed-policy";
import { guardPublic, scrubInternal } from "./public-text";
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
  askedMarketMetric,
  askedMarketFigure,
  hasPublicTaxFigure,
  isMarketFigureQuestion,
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
import { dealAdviceBrief, dealBrief, dealLens, dealMarketSlug, matchReitTicker, reitBrief, reitLens, reitName, type ItemAnswer } from "./chat-items";
import { isOfferedStarter } from "./chat-starters";
import type { ChatScope } from "./chat-scope";
import { digestTickers } from "./chat-retrieve";
import { MARKET_TOPIC, matchDealName } from "./chat-deal-match";
import { resolveGroqModelId } from "./chat-llm-models";
import {
  checkLlmCap,
  estimateTokensFromText,
  isGroqRateLimitError,
  LLM_TIMEOUT_MS,
  LLM_SEARCH_TIMEOUT_MS,
  markGroqRateLimited,
  parseRetryAfter,
  reconcileLlmTokens,
  reserveLlmCall,
} from "./chat-llm-cap";
import { serializeLlmPack } from "./chat-llm-pack";
import { inspectLlmAnswer, scrubShowboatForeclosure } from "./chat-llm-guard";
import { citationsUsedInAnswer, stripCitationBrackets } from "./chat-llm-citations";
import { NO_PROPERTY_FACTS, resolveNamedAsset } from "./chat-named-asset";
import { checkSearchCap, freeLiveSearch, isCurrentEventsQuestion, isWebSearchEnabled, needsCurrentFacts, reserveSearch } from "./chat-web-search";
import { STR_TABLE_REFUSAL, LICENSED_DATA_REFUSAL, asksForStrTable, asksForLicensedData } from "./chat-str";
import { UNCITABLE_REFUSAL, asksForUncitableSource } from "./chat-uncitable";

/** Confirmed via `vercel ai-gateway models ls` (meta/llama family). */
export const DEFAULT_GATEWAY_OSS_MODEL = "meta/llama-3.3-70b";
export { DEFAULT_GROQ_MODEL } from "./chat-llm-models";
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

const SYSTEM_PROMPT = `You are Bungah Capital Intel — a normal, conversational chat about hotel and hospitality capital, and a helpful general assistant when the visitor asks about something else. Answer follow-ups using the thread context. Be concise and clear.

Rules (non-negotiable):
1. Do not refuse a question just because it is outside our loaded data. Use your general knowledge for conversation, explanations, and definitions. Never invent a number, a statistic, a source, a link, or a date.
2. When the question asks for a specific figure or a current fact: use the cited fact pack first (those facts already have source, link, and as-of). If the pack does not have it, you may be given live web-search results — use only those cited pages. If neither has a good source, say you do not have a cited source and do not guess.
3. Write in your own words. Use only a few cited data points. Never reproduce a whole table. Do not use 【】 citation markers. Cite in prose: source name, URL, and as-of or published date. When a pack fact is from Host Hotels' Q2 2026 8-K earnings release, cite it as "Q2 2026 8-K earnings release", not as an earnings call unless the pack source is a transcript.
4. Never give a buy, sell, or hold recommendation, and never recommend a deal, a stock, or a hotel purchase. If asked, refuse and offer information instead.
5. Never say Showboat (or any named property) is "in foreclosure". If a cited fact supports a legal proceeding, use only "the subject of reported lender or court proceedings". If there is no cited fact about that property, say exactly: "I don't have cited information on that property." Do not echo the user's characterization.
6. Never include raw STR or CoStar figures, licensed tables, or internal team or agent names. Do not use LinkedIn, X/Twitter, Facebook, Instagram, TikTok, Reddit, or other social sites as sources.
7. Do not provide personal, private, or contact information about a named person. If we have no cited public fact about them, say you don't know.
8. If the pack marks a factor as skipped because the source restricts republication, say that factor is not shown for that reason. Do not fill it in.
9. Product name: Bungah Capital Intel.
10. When a Deep-link market slug or Primary market is present, lead with THAT market. Do not privilege Orlando or Las Vegas when the question names another market.
11. If you used our cited pack for figures, you may start with "From our cited data:". If you used cited open sources from a live search (Wikipedia, Wikidata, GDELT, or official government feeds), start with "From cited open sources:". Keep source name, link, and as-of attached to each figure. Do not use Groq browser search or social sites.
12. Wikipedia: paraphrase in your own words (do not copy passages), link the article, and say "CC BY-SA 4.0". Wikidata is CC0; link the item. GDELT: cite the GDELT Project and https://www.gdeltproject.org/ plus the publisher URL. Official government feeds: cite the agency and a link.`;

export const CITED_SOURCE_MISS = "I couldn't find a cited source right now.";

/** Drop leftover leading commas/colons/dots (e.g. the FAA answer that started with ","). */
export function stripLeadingPunctuation(text: string): string {
  return text
    .replace(/^[\s,;:.·•…]+/u, "")
    .replace(/^(From (?:our cited data|cited open sources):\s*)[,;:.·•…]+/i, "$1")
    .trimStart();
}

const CITED_MISS_PREFIX = /^\s*I couldn't find a cited source right now\.?\s*/i;

/** Drop the canned cited-source-miss sentence from the start of an answer. */
export function stripCitedMissPreface(text: string): string {
  return text.replace(CITED_MISS_PREFIX, "").trimStart();
}

/**
 * Meaning / definition asks ("what does ADR mean", "what is RevPAR", "define cap rate"),
 * not figure or market-trend questions ("What is RevPAR doing in Miami?").
 */
export function isDefinitionalQuestion(question: string): boolean {
  let q = question.trim().toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ");
  if (!q) return false;
  q = q
    .replace(/^(please |can you |could you |would you )/i, "")
    .replace(/^in (one|a|two|three|\d+) sentences?,?\s+/i, "")
    .replace(/^in a few words,?\s+/i, "")
    .replace(/[,;]?\s+in (one|a|two|three|\d+) sentences?$/i, "")
    .replace(/[,;]?\s+in a few words$/i, "")
    .replace(/\s+in (hotels?|hospitality|lodging|real estate)\b/gi, "")
    .replace(/[?.!,;:]+$/g, "")
    .trim();
  if (!q) return false;
  if (
    /\b(doing|trend|latest|ytd|yoy|compared|versus|\bvs\b|how (much|many|is|are|has|have)|read for|picture|collections?|visitation|traffic|passengers?)\b/i.test(
      q
    )
  ) {
    return false;
  }
  if (
    /\b(nyc|n\.?y\.?c\.?|new york|miami|dallas|houston|nashville|chicago|boston|atlanta|orlando|seattle|honolulu|phoenix|tampa|los angeles|san francisco|denver|austin|washington|fll|pbi)\b/i.test(
      q
    )
  ) {
    return false;
  }
  return /^(what does .+ (mean|stand for)|what(?:'s| is| are) (?:a |an |the )?.+|what's .+|define(?: the)? .+|definition of(?: the)? .+|meaning of(?: the)? .+)$/i.test(
    q
  );
}

const DEFINITIONAL_INSTRUCTIONS =
  "This is a definitional question. Answer the definition plainly in ordinary language. Do not start with 'I couldn't find a cited source right now.' If the answer carries no figures, it needs no citation. Do not invent numbers, dates, or sources.";

export function isNoMarketMemo(content: string): boolean {
  return /didn't match a market we cover/i.test(content);
}

async function currentEventsAnswer(question: string, subject: string): Promise<FinalAnswer> {
  let live: Awaited<ReturnType<typeof freeLiveSearch>> = null;
  if (isWebSearchEnabled()) {
    const capS = checkSearchCap(subject);
    if (capS.ok) {
      reserveSearch(subject);
      live = await freeLiveSearch(question);
    }
  }
  if (live?.facts.length) {
    const lines = live.facts.map((f) => {
      const title = f.text.replace(/\s+/g, " ").trim();
      return `- ${title} — [${f.label}](${f.url}) (${f.asOf})`;
    });
    const sources = live.facts.map((f) => ({ url: f.url, label: f.label, secondary: false, signal: f.text }));
    return finalize(
      {
        content: ["From cited open sources:", "", ...lines, "", "Sources include the GDELT Project (https://www.gdeltproject.org/) and official public feeds.", "", decisionSupportFooter()].join("\n"),
        citations: live.citations,
        sources,
        intent: "unknown",
        marketSlug: null,
        mode: "deterministic",
      },
      true
    );
  }
  return finalize(
    {
      content: softCitedMiss(),
      citations: [],
      sources: [],
      intent: "unknown",
      marketSlug: null,
      mode: "deterministic",
    },
    false
  );
}

function softCitedMiss(background?: string): string {
  const bg = (background ?? "").trim();
  return [
    CITED_SOURCE_MISS,
    bg || "I can still offer general background, without inventing figures, dates, or sources. You can also rephrase or ask again.",
    "Decision support, not a recommendation. You make the call.",
  ].join("\n\n");
}

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
    // Keep the openai/ prefix on gpt-oss ids; refuse Preview/Beta and retired Llama ids.
    const modelId = resolveGroqModelId(override);
    if (!modelId) return null;
    return groq(modelId);
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
function finalize(answer0: ChatAnswer & { brief?: ChatBrief }, answeredWell: boolean): FinalAnswer {
  // "From our cited data" is only honest when the figures come from the brief.
  if (!answer0.brief?.answer && typeof answer0.content === "string" && /from our cited data/i.test(answer0.content)) {
    answer0 = { ...answer0, content: answer0.content.replace(/^\s*From our cited data:?\s*/i, "").trimStart() };
  }
  // LLM answers: drop a leftover leading comma/colon after a prefix strip or a model stutter.
  if (answer0.mode === "llm" && typeof answer0.content === "string") {
    answer0 = { ...answer0, content: stripLeadingPunctuation(answer0.content) };
  }
  // Render-time leak guard (public-text.ts guardPublic): no file path, dataset ID label or internal code in any string.
  const answer = guardPublic(answer0);
  // A one-line prompt with chips ("Which two markets should I compare?") is shown as is, without the footer.
  const content = answer.brief ? briefMarkdown(answer.brief) : answer.prompt ? answer.content : cleanLegacy(answer.content);
  // Under a date window the answer's citations are exactly the windowed brief's citations.
  const windowed = answer.brief?.window && answer.brief.window.range !== "all";
  return {
    ...answer,
    ...(windowed ? { citations: [...new Set((answer.brief!.cited ?? []).map((c) => c.label))] } : {}),
    content: scrubInternal(scrubSeedLines(content)),
    // Stored field names never reach readers ("roomsK" → "rooms").
    ...(answer.citations ? { citations: (windowed ? [...new Set((answer.brief!.cited ?? []).map((c) => c.label))] : answer.citations).map((c) => c.replace(/\broomsK\b/g, "rooms")) } : {}),
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
      question,
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
    // No facts follow: don't promise them.
    for (let i = 0; i < lines.length; i++) lines[i] = lines[i].replace(/\s*Below are the relevant cited facts for your own decision\./, "");
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

/** Bare "rates" with nothing to go on (chat-intent.ts isBareRates). */
export const RATES_PROMPT = "Do you mean hotel room rates or interest rates?";
export const RATES_CHIPS: { label: string; question: string }[] = [
  { label: "Room rates (ADR)", question: "What's the national RevPAR and ADR picture?" },
  { label: "Interest rates", question: "Where are interest rates now?" },
];

/**
 * Primary chat entry. Order:
 *   1. Advice guard (buy / sell / should-I-invest, staff cuts) — classified before anything else.
 *   2. Radar "Ask Chat about this" detail.
 *   3. Uncovered market (Boise, London…) — not covered yet, closest covered markets, no figures.
 *   4. Supply-pipeline ranking across covered markets (cited score rows, or a plain "can't rank").
 *   5. LLM only when explicitly enabled; otherwise deterministic graph / digest memos.
 * Steps 1, 3 and 4 never call a model. Every path returns exactly one final answer.
 */
export type AnswerChatOpts = {
  marketSlug?: string | null;
  range?: DateRange;
  scope?: ChatScope | null;
  intent?: ChatIntent | null;
  /** Signed-in private threads never call Groq. */
  isPrivate?: boolean;
  /** Hashed later; IP or user id for the per-user daily cap. */
  llmSubject?: string | null;
  /** Prior turns in this owned thread (follow-ups). */
  history?: { role: "user" | "assistant"; content: string }[];
  /** r10: answer from cited rows / filings only (no Groq). Set for offered starters and named-REIT questions. */
  noLlm?: boolean;
  /** Internal: already routed through a REIT item (no second REIT redirect). */
  reitRouted?: boolean;
};

/** r10: a filing / digest brief's citations are its cited sources (label + URL), never an internal file path. */
function citedOf(brief: ChatBrief): { citations: string[]; sources: NonNullable<ChatAnswer["sources"]> } {
  const cited = brief.cited ?? [];
  const citations = [...new Set(cited.map((c) => (c.url ? `${c.label} ${c.url}` : c.label)).filter((c) => c.trim()))];
  const seen = new Set<string>();
  const sources: NonNullable<ChatAnswer["sources"]> = [];
  for (const c of cited) {
    if (!c.url || seen.has(c.url)) continue;
    seen.add(c.url);
    sources.push({ url: c.url, label: c.text ?? c.label, secondary: false, signal: c.label });
  }
  return { citations, sources };
}

export async function answerChat(
  question: string,
  opts?: AnswerChatOpts
): Promise<FinalAnswer> {
  const range = opts?.range ?? "all";
  const scope = opts?.scope ?? null;
  // Fake / un-citable source (a DOI, an invented paper) beats market or item routing.
  if (asksForUncitableSource(question)) {
    return finalize(
      {
        content: [UNCITABLE_REFUSAL, "", decisionSupportFooter()].join("\n"),
        citations: [],
        sources: [],
        intent: "uncitable_source",
        marketSlug: null,
        mode: "deterministic",
      },
      false
    );
  }
  // "Ask about this": an item chip routes the question to that item first.
  if (scope?.kind === "deal") {
    // Buy / sell about this deal: decline, then the deal's cited facts.
    const adv = classifyAdviceRequest(question);
    const advItem = adv ? dealAdviceBrief(scope.id, declineText(adv)) : null;
    if (advItem) return finalizeItem(advItem);
    const lens = dealLens(question);
    const item = lens ? dealBrief(scope.id, lens) : null;
    if (item) return finalizeItem(item);
    // Not about the sale itself: answer for the sale's market.
    return answerChat(question, { marketSlug: dealMarketSlug(scope.id) ?? opts?.marketSlug, range, intent: opts?.intent, isPrivate: opts?.isPrivate, llmSubject: opts?.llmSubject });
  }
  if (scope?.kind === "reit") {
    const lens = reitLens(question);
    const name = reitName(scope.id);
    const hasDigest = digestTickers().includes(scope.id.toLowerCase());
    if (name && (lens === "guidance" || lens === null || (lens === "capital" && !reitBrief(scope.id, "capital"))) && hasDigest) {
      // The authored call digest leads for issuers that have one (guidance, capital allocation, market color).
      const corpus = await retrieveAllowedCorpus(`${question} ${name} ${scope.id}`);
      const own = corpus.digests.filter((d) => d.ticker.toLowerCase() === scope.id.toLowerCase());
      if (own.length) {
        const brief = digestBrief(own, question, { range: "all" });
        if (brief.reads.length) {
          return finalize({ content: "", brief, ...citedOf(brief), intent: "reit_call", marketSlug: null, mode: "deterministic" }, true);
        }
      }
    }
    const item = lens ? reitBrief(scope.id, lens, question) ?? (lens !== "reported" ? reitBrief(scope.id, "reported") : null) : null;
    if (item) return finalizeItem(item);
    // r10: a REIT item never hands its question to Groq.
    return answerChat(name ? `${question} (${name})` : question, { range, isPrivate: opts?.isPrivate, llmSubject: opts?.llmSubject, noLlm: true, reitRouted: true });
  }
  // Unscoped deal name ("Tell me about The Wade"): answer with the deal card, unless it's an advice question or a
  // market-metric question that only mentions the deal.
  if (!scope) {
    const dealSlug = matchDealName(question);
    const adv = dealSlug ? classifyAdviceRequest(question) : null;
    // "Should I buy The Wade?" / "Is it worth buying The Wade?": decline, then the deal's cited facts.
    const advItem = dealSlug && adv ? dealAdviceBrief(dealSlug, declineText(adv)) : null;
    if (advItem) return finalizeItem(advItem);
    const dl = dealSlug ? dealLens(question) : null;
    if (dealSlug && !adv && (dl || !MARKET_TOPIC.test(question))) {
      const item = dealBrief(dealSlug, dl ?? "grade") ?? (dl ? null : dealBrief(dealSlug, "price"));
      if (item) return finalizeItem(item);
    }
  }
  // r10 (Eric r9 must-fix): an unscoped question naming a covered hotel REIT ("What did Host Hotels guide on the
  // Q2 2026 call?", "What's Park's outlook?") takes the same deterministic REIT path as the REIT's own chip:
  // the issuer's call digest / 8-K exhibit, cited by URL. Never Groq. Advice and market-figure questions that only
  // mention a REIT keep their own routes.
  if (!scope && !opts?.marketSlug && !opts?.reitRouted && !classifyAdviceRequest(question)) {
    const ticker = matchReitTicker(question);
    if (ticker && (reitLens(question) || !MARKET_TOPIC.test(question))) {
      return answerChat(question, { ...opts, scope: { kind: "reit", id: ticker } });
    }
  }
  const marketSlug = scope?.kind === "market" ? scope.id : opts?.marketSlug;
  const intent = opts?.intent ?? null;
  // r10: an offered /chat starter is answered exactly the way verify-starters.ts verified it (no Groq).
  const noLlm = Boolean(opts?.noLlm) || isOfferedStarter(question, scope);
  const res = await answerChatIn(question, { marketSlug, range, intent, isPrivate: opts?.isPrivate, llmSubject: opts?.llmSubject, history: opts?.history, noLlm });
  if (range === "all") return res;
  if (!res.brief?.window?.filterable) {
    // Either an intent that can't filter by date (answered in full, no chip), or the window
    // removed everything the answer was built on (say so plainly, keep the chip).
    const full = await answerChatIn(question, { marketSlug, range: "all", intent, isPrivate: opts?.isPrivate, llmSubject: opts?.llmSubject, history: opts?.history, noLlm });
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

function finalizeItem(item: ItemAnswer): FinalAnswer {
  return finalize({ content: "", brief: item.brief, citations: item.citations, sources: [], intent: item.intent as ChatIntent, marketSlug: item.marketSlug, mode: "deterministic" }, true);
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
  opts: { marketSlug?: string | null; range: DateRange; intent?: ChatIntent | null; isPrivate?: boolean; llmSubject?: string | null; history?: { role: "user" | "assistant"; content: string }[]; noLlm?: boolean }
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
    retrieveGraphContext(question, opts?.marketSlug, opts?.intent),
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
  const wantsMarketData = /\b(revpar|occupancy|adr|pipeline|supply|demand|hotel tax|how is\b.{0,40}\bdoing)\b/i.test(question);
  if (places.length && !alsoCovered && wantsMarketData) {
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

  if (asksForStrTable(question) || asksForLicensedData(question)) {
    const marketName = ctx.matched?.name ?? null;
    const publicHint = places.length
      ? uncoveredMarketLines(places, ctx.markets).join("\n")
      : marketName
        ? `For ${marketName}, we can cite public sources on file instead — airport traffic, CVB or hotel-tax releases, and company filings. Ask about one of those and I'll cite it.`
        : "When we have public sources on file for the market you asked about — airports, CVBs, government releases, or company filings — we can share those instead.";
    const refusal = asksForStrTable(question) ? STR_TABLE_REFUSAL : LICENSED_DATA_REFUSAL;
    const extra = asksForStrTable(question)
      ? "We do not provide STR tables or workbooks."
      : "We do not provide licensed comps, cap rates, or price-per-key figures.";
    return finalize(
      {
        content: [refusal, "", publicHint.trim(), "", extra, "", decisionSupportFooter()].join("\n"),
        citations: [],
        sources: [],
        intent: ctx.intent ?? "revpar_metrics",
        marketSlug: ctx.matched?.slug ?? opts?.marketSlug ?? null,
        mode: "deterministic",
      },
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

  // "Why are rates up?" with no market, no item and no thread context: room rates or interest rates? Ask, with
  // one chip for each (each a real question). With a market in play, bare "rates" is room rates (RevPAR / ADR card).
  if (!opts.intent && !opts.marketSlug && !ctx.matched && isBareRates(question) && !matchProperty(question)) {
    return finalize(
      {
        content: RATES_PROMPT,
        citations: [],
        sources: [],
        intent: "unknown",
        marketSlug: null,
        mode: "deterministic",
        prompt: true,
        followUps: RATES_CHIPS,
      },
      false
    );
  }

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

  const named = resolveNamedAsset(question, ctx);
  if (named && !named.hasFacts) {
    return withNote(
      finalize(
        {
          content: NO_PROPERTY_FACTS + "\n\nDecision support, not a recommendation. You make the call.",
          citations: [],
          sources: [],
          intent: "property_asset",
          marketSlug: named.marketSlug,
          mode: "deterministic",
        },
        false
      )
    );
  }


  // News / sports current-events: run the free GDELT / Wikimedia / gov path (no paid Groq browser_search,
  // and no Groq spend for the compose). Do not fall through to a World Cup hotel digest.
  if (isCurrentEventsQuestion(question) && !ctx.matched && !isMarketFigureQuestion(question, ctx.intent)) {
    return withNote(await currentEventsAnswer(question, opts.llmSubject ?? "anon"));
  }

  // Covered-market figure questions (RevPAR / OCC / ADR / supply / tax / visitation and other
  // market intents): use the deterministic brief or tax memo. When licensed or unverified strips
  // left no public figure, lead with the Chicago-style gap. Never call Groq for market figures
  // or unsourced color, and never say "From our cited data" for a reconstructed amount.
  if (ctx.matched && isMarketFigureQuestion(question, ctx.intent)) {
    if (ctx.intent === "tax_collections" || askedMarketFigure(question, ctx.intent) === "tax") {
      if (hasPublicTaxFigure(ctx.matched)) {
        return withNote(finalize({ ...formatTaxMemo(ctx.matched) }, true));
      }
      const taxBrief = marketBrief(ctx.matched, "tax_collections", { question, range });
      return withNote(
        finalize(
          {
            content: "",
            brief: taxBrief,
            citations: [...new Set((taxBrief.cited ?? []).map((c) => c.label))],
            intent: "tax_collections",
            marketSlug: ctx.matched.slug,
            mode: "deterministic",
          },
          true
        )
      );
    }
    const graphBrief = briefForGraph(question, ctx, issuerDigests(question, corpus), range);
    if (graphBrief) {
      return withNote(
        finalize(
          {
            content: "",
            brief: graphBrief,
            citations: [...new Set((graphBrief.cited ?? []).map((c) => c.label))],
            intent: ctx.intent,
            marketSlug: ctx.matched.slug,
            mode: "deterministic",
          },
          true
        )
      );
    }
  }

  const hadCorpus = corpus.digests.length > 0 || corpus.ideology.length > 0;
  const digestCitesForPack = issuerDigests(question, corpus).map((d) => d.citePath);

  // r10: figure questions we can answer from cited filings / graph rows never go to Groq: a named issuer's call,
  // guidance or earnings (digest / 8-K exhibit), national debt or benchmark rates with no market, and a covered
  // market's debt / labor / rates overlay. Groq is for general questions only.
  const issuerLed = !ctx.matched && issuerDigests(question, corpus).some((d) => d.score >= 5);
  const nationalFigures = !ctx.matched && (ctx.intent === "debt_overlay" || ctx.intent === "rates");
  const marketOverlay = Boolean(ctx.matched) && (ctx.intent === "debt_overlay" || ctx.intent === "talent_greenlight" || ctx.intent === "rates");
  const deterministicOnly = Boolean(opts.noLlm) || issuerLed || nationalFigures || marketOverlay;
  // Private threads, date windows, missing Production model, caps, or a 429 cooldown: no Groq call.
  const allowLlm = range === "all" && !deterministicOnly;
  const model = allowLlm ? resolveModel() : null;
  const cap = model ? checkLlmCap(opts.llmSubject ?? "anon") : { ok: false as const, reason: "disabled" as const };
  if (model && cap.ok) {
    const llmPack = serializeLlmPack(ctx);
    const history = opts.history ?? [];
    const historyBlock = history.length
      ? ["=== PRIOR TURNS IN THIS CONVERSATION ===", ...history.map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content}`), "=== END PRIOR TURNS ===", ""].join("\n")
      : "";
    const packHasFacts = llmPack.factCount > 0;
    // Current-fact questions: run open search BEFORE the first LLM call so a pack timeout
    // cannot fall through to the canned no-market memo without searching.
    let live: Awaited<ReturnType<typeof freeLiveSearch>> = null;
    const wantSearchFirst = isWebSearchEnabled() && needsCurrentFacts(question) && !packHasFacts && !isDefinitionalQuestion(question);
    if (wantSearchFirst) {
      const capS = checkSearchCap(opts.llmSubject ?? "anon");
      if (capS.ok) {
        reserveSearch(opts.llmSubject ?? "anon");
        live = await freeLiveSearch(question);
      }
    }
    const prompt = [
      historyBlock,
      `User question: ${question}`,
      opts?.marketSlug ? `Deep-link market slug: ${opts.marketSlug}` : "",
      `Classified intent: ${ctx.intent}`,
      "",
      "=== CITED FACT PACK (use these first for any specific figure; each fact has source, link, as-of) ===",
      llmPack.pack,
      "=== END FACT PACK ===",
      "",
      live?.pack ?? "",
      hadCorpus
        ? [
            "=== ALLOWED AUTHORED CORPUS (digests / ideology — cite by file path already in the pack or here) ===",
            corpus.pack,
            "=== END CORPUS ===",
            "",
          ].join("\n")
        : "=== ALLOWED AUTHORED CORPUS ===\n(none matched this question)\n=== END CORPUS ===\n",
      isDefinitionalQuestion(question)
        ? DEFINITIONAL_INSTRUCTIONS
        : "Answer the visitor now. If the pack has the facts, lead with them (From our cited data). If you used cited open sources, start with From cited open sources and follow the license rules. If this is a general or conversational question, just answer helpfully without inventing figures.",
    ]
      .filter(Boolean)
      .join("\n");
    const outputCap = 800;
    const callTimeout = live || wantSearchFirst ? LLM_SEARCH_TIMEOUT_MS : LLM_TIMEOUT_MS;
    const estimated = estimateTokensFromText(SYSTEM_PROMPT + "\n" + prompt, outputCap);
    reserveLlmCall(opts.llmSubject ?? "anon", estimated);
    const sourceList = [...llmPack.citations, ...digestCitesForPack, ...(live?.citations ?? [])];
    try {
      const { text, usage } = await generateText({
        model: model as Parameters<typeof generateText>[0]["model"],
        system: SYSTEM_PROMPT,
        prompt,
        temperature: 0.3,
        maxOutputTokens: outputCap,
        abortSignal: AbortSignal.timeout(callTimeout),
      });
      const used = Number(usage?.totalTokens ?? 0);
      if (used) reconcileLlmTokens(used, estimated);
      let content = stripLeadingPunctuation(stripCitationBrackets(scrubShowboatForeclosure((text ?? "").trim())));
      let citations = citationsUsedInAnswer(content, sourceList);
      const packHasAnswer = packHasFacts && citations.length > 0 && !live && !isDefinitionalQuestion(question);
      // If the pack-first call (no pre-search) still lacks a cited current-fact answer, search now and retry once.
      if (
        isWebSearchEnabled() &&
        !live &&
        !packHasAnswer &&
        (needsCurrentFacts(question) || /don't have (any )?(a )?cited|no cited source/i.test(content))
      ) {
        const capS = checkSearchCap(opts.llmSubject ?? "anon");
        if (capS.ok) {
          reserveSearch(opts.llmSubject ?? "anon");
          live = await freeLiveSearch(question);
          if (live?.pack) {
            const { text: liveText, usage: liveUsage } = await generateText({
              model: model as Parameters<typeof generateText>[0]["model"],
              system: SYSTEM_PROMPT,
              prompt: [historyBlock, `User question: ${question}`, "", live.pack, "", "Answer from these cited open sources in your own words. Follow the license rules. If they do not actually answer the question, say you do not have a cited source. Never invent figures."].join("\n"),
              maxOutputTokens: 800,
              abortSignal: AbortSignal.timeout(LLM_SEARCH_TIMEOUT_MS),
            });
            const usedLive = Number(liveUsage?.totalTokens ?? 0);
            if (usedLive) reconcileLlmTokens(usedLive, usedLive);
            const liveContent = stripLeadingPunctuation(stripCitationBrackets(scrubShowboatForeclosure((liveText ?? "").trim())));
            const liveFail = inspectLlmAnswer(liveContent);
            if (liveContent && !liveFail) {
              content = /^from cited open sources/i.test(liveContent) ? liveContent : `From cited open sources:\n\n${liveContent}`;
              citations = citationsUsedInAnswer(content, [...citations, ...live.citations]);
            }
          }
        }
      }
      const fail = inspectLlmAnswer(content);
      if (content && !fail) {
        if (isDefinitionalQuestion(question)) {
          content = stripCitedMissPreface(content);
        }
        if (packHasAnswer && !/^from our cited data/i.test(content) && !/^from cited open sources/i.test(content)) {
          content = `From our cited data:\n\n${content}`;
        }
        if (live && /^from cited open sources/i.test(content) === false && citations.some((c) => /wikipedia|wikidata|gdelt|federal reserve|bureau of labor|aviation administration/i.test(c))) {
          content = `From cited open sources:\n\n${content}`;
        }
        const answer: ChatAnswer = {
          content,
          citations,
          intent: ctx.intent,
          marketSlug: ctx.matched?.slug ?? opts?.marketSlug ?? null,
          mode: "llm",
        };
        return withNote(
          finalize(answer, answeredWellHeuristic(answer, ctx.intent, Boolean(ctx.matched), hadCorpus))
        );
      }
      if (fail) console.error("[chat-llm] output guard failed; falling back", fail);
    } catch (err) {
      if (isGroqRateLimitError(err)) markGroqRateLimited(parseRetryAfter(err));
      console.error("[chat-llm] generateText failed; falling back", err instanceof Error ? err.message : "error");
    }
    // Last-resort LLM: general background, never the canned no-market memo.
    try {
      const { text: bg } = await generateText({
        model: model as Parameters<typeof generateText>[0]["model"],
        system: SYSTEM_PROMPT,
        prompt: [historyBlock, `User question: ${question}`, "", isDefinitionalQuestion(question) ? DEFINITIONAL_INSTRUCTIONS : "I couldn't complete a fully cited answer. Start with exactly: I couldn't find a cited source right now. Then give brief general background. Do not invent figures, dates, or sources."].join("\n"),
        maxOutputTokens: 400,
        abortSignal: AbortSignal.timeout(LLM_TIMEOUT_MS),
      });
      const bgContent = stripLeadingPunctuation(stripCitationBrackets(scrubShowboatForeclosure((bg ?? "").trim())));
      // Last-resort background must not invent figures (cap rates, percents, dollar amounts).
      const inventedBg = /\$[\d,]+|\b\d+(?:\.\d+)?\s*%|\bcap rates?\b|\bprice per key\b|\bmid-single digits?\b/i.test(bgContent);
      if (bgContent && !inspectLlmAnswer(bgContent) && !isNoMarketMemo(bgContent) && !inventedBg) {
        const content = isDefinitionalQuestion(question)
          ? stripCitedMissPreface(bgContent)
          : bgContent.toLowerCase().includes("couldn't find a cited source")
            ? bgContent
            : softCitedMiss(bgContent);
        return withNote(
          finalize(
            { content, citations: [], intent: ctx.intent, marketSlug: ctx.matched?.slug ?? opts?.marketSlug ?? null, mode: "llm" },
            false
          )
        );
      }
    } catch {
      // static miss below
    }
    if (isDefinitionalQuestion(question)) {
      return withNote(
        finalize(
          { content: "I couldn't complete a definition just now. Please try again. I won't invent figures.", citations: [], intent: ctx.intent, marketSlug: ctx.matched?.slug ?? opts?.marketSlug ?? null, mode: "llm" },
          false
        )
      );
    }
    if (history.length || !/\b(revpar|occupancy|adr|pipeline|supply|demand|hotel tax|how is\b.{0,40}\bdoing)\b/i.test(question)) {
      return withNote(
        finalize(
          { content: softCitedMiss(), citations: [], intent: ctx.intent, marketSlug: ctx.matched?.slug ?? opts?.marketSlug ?? null, mode: "llm" },
          false
        )
      );
    }
  }

  // Deterministic memo. REIT digests only when the question names the issuer or asks about
  // REITs / earnings — never as a soft pull onto market, supply or uncovered questions.
  const digests = issuerDigests(question, corpus);
  const digestMemo = formatDigestFallbackMemo(digests);
  // National debt questions answer from cited graph rows, not REIT digest soft-pulls.
  const nationalDebtFromGraph =
    ctx.intent === "debt_overlay" && !corpusAll.digests.some((d) => d.score >= 5);
  if (digestMemo && !ctx.matched && !nationalDebtFromGraph) {
    const dBrief = digestBrief(digests, question, { range });
    const answer: ChatAnswer & { brief?: ChatBrief } = {
      content: digestMemo,
      brief: dBrief,
      ...citedOf(dBrief),
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
  // r10: national debt / rates answers cite exactly their brief's sources, each with its URL.
  if (graphBrief && !ctx.matched && (ctx.intent === "debt_overlay" || ctx.intent === "rates")) Object.assign(fallback, citedOf(graphBrief));
  // A Fed policy answer cites exactly what it shows (FRED, the FOMC statements, the 10-year row), not the debt memo's list.
  if (graphBrief && ctx.intent === "rates" && isFedPolicyQuestion(question)) fallback.citations = [...new Set((graphBrief.cited ?? []).map((c) => c.label))];
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
      citations: [...new Set([...fallback.citations, ...citedOf(digestBrief(digests, question, { range })).citations])],
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
  // Never return the canned "we don't cover that market" memo for a general question or a follow-up.
  if (isNoMarketMemo(answer.content) && ((opts.history && opts.history.length > 0) || !wantsMarketData) && !isDefinitionalQuestion(question)) {
    answer.content = softCitedMiss();
    answer.brief = undefined;
    answer.citations = [];
  }
  return withNote(
    finalize(answer, answeredWellHeuristic(fallback, ctx.intent, Boolean(ctx.matched), hadCorpus))
  );
}

/** Brief for the deterministic graph answer (same branch order as answerFromGraph). */
function briefForGraph(question: string, ctx: GraphContext, namedDigests: CorpusPack["digests"], range: DateRange = "all"): ChatBrief | null {
  const { matched, intent, nationalSignals, radars } = ctx;
  if (!question.trim()) return null;
  if (intent === "compare_markets") {
    // The user's order: "Compare Nashville vs Charlotte" leads with Nashville (scoped or not).
    const unique = inMentionOrder(question, [matched, ...ctx.secondary].filter((m, i, arr): m is NonNullable<typeof m> => Boolean(m) && arr.findIndex((x) => x?.id === m!.id) === i));
    if (unique.length >= 2) return compareBrief(unique[0], unique[1], question, intent);
    return null;
  }
  // Hotel-tax series answers keep their newest-first table (no brief).
  if (intent === "tax_collections") return null;
  // Fed policy questions answer from the Fed's own figures, even inside a market's chat.
  if (intent === "rates" && isFedPolicyQuestion(question)) return ratesBrief(nationalSignals, question, { range });
  if (matched) {
    const overlay =
      intent === "talent_greenlight"
        ? nationalSignals.find((s) => s.kind === "talent") ?? null
        : intent === "debt_overlay"
          ? nationalSignals.find((s) => s.kind === "debt") ?? null
          : null;
    const extra = namedDigests.length ? digestReads(namedDigests[0], question) : null;
    // Refinancing questions lead with the 10-year Treasury (same rule as the rates answers).
    const rateLead = intent === "debt_overlay" && /\b(refinanc\w*|refi)\b/i.test(question) ? nationalSignals.filter((s) => s.kind === "rates" || /\b(10-year|10Y)\b/i.test(s.title)) : undefined;
    return marketBrief(matched, intent, {
      question,
      nationalOverlay: overlay,
      rateLead,
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
