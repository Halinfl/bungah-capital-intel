/**
 * Follow-up questions in one chat thread (Eric, Nov 1, 2026: the starter "How has RevPAR moved here over the
 * last 12 months?" and the follow-up "What is the 12-month RevPAR trend?" returned byte-identical cards).
 *
 * The client sends `prev`, a short summary of the answer on screen: { question, intent, marketSlug, answerHash }.
 * The server uses it to:
 *   1. keep the market: a question that names no market (and no item is in scope) inherits prev.marketSlug, so
 *      "how does that compare to last year?" stays on Nashville instead of drifting to a national card;
 *   2. keep the topic: "compare that to last year" (one market, a time comparison) and wording-free follow-ups
 *      ("tell me more about that") continue prev.intent instead of becoming "name two markets";
 *   3. never repeat a card: if the card about to be returned hashes to prev.answerHash, reply with one line and
 *      2–3 chips for other angles (supply, demand, debt, last 90 days), each a real question.
 * `prev` is untrusted input: every field is type-checked and length-capped; anything invalid is dropped.
 * Pure helpers here; the route does the graph reads.
 */
import { createHash } from "node:crypto";
import { CHAT_INTENTS, classifyIntent, type ChatIntent } from "./chat-intent";
import type { DateRange } from "./chat-brief";
import type { ChatScope } from "./chat-scope";

export type Prev = { question: string | null; intent: ChatIntent | null; marketSlug: string | null; answerHash: string | null };
export type FollowUpChip = { label: string; question: string; range?: DateRange };

/** Caps for the untrusted `prev` object. */
export const PREV_MAX_QUESTION = 300;
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,80}$/;
const HASH_RE = /^[a-f0-9]{16}$/;
const INTENTS = new Set<string>(CHAT_INTENTS);

/** Validate `body.prev`. Returns null unless it is a plain object with at least one usable field. */
export function parsePrev(v: unknown): Prev | null {
  if (!v || typeof v !== "object" || Array.isArray(v)) return null;
  const o = v as Record<string, unknown>;
  const question =
    typeof o.question === "string" && o.question.trim() ? o.question.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, PREV_MAX_QUESTION) : null;
  const intent = typeof o.intent === "string" && o.intent.length <= 40 && INTENTS.has(o.intent) ? (o.intent as ChatIntent) : null;
  const slug = typeof o.marketSlug === "string" ? o.marketSlug.trim().toLowerCase() : "";
  const marketSlug = slug.length <= 81 && SLUG_RE.test(slug) ? slug : null;
  const hash = typeof o.answerHash === "string" ? o.answerHash.trim().toLowerCase() : "";
  const answerHash = HASH_RE.test(hash) ? hash : null;
  if (!question && !intent && !marketSlug && !answerHash) return null;
  return { question, intent, marketSlug, answerHash };
}

type CardLike = { content: string; brief?: unknown };

/**
 * Fingerprint of what a reader sees as "the card": for a summary card, its headline (as a bag of words, so the
 * same figures in another order still count as the same read) and the set of its key reads; the coverage line,
 * date window and collapsed sections are left out, so "Last 12 months" vs "All" of the same reads is the same
 * card. Without a summary card, the answer text itself. Equal hash = the same card.
 */
export function answerHash(a: CardLike | string): string {
  const x = typeof a === "string" ? { content: a } : a;
  const b = x.brief as { decline?: string; answer?: string; reads?: { text?: string }[] } | null | undefined;
  const words = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N}$%.+\-−]+/gu, " ").trim().split(/\s+/).filter(Boolean).sort();
  const basis = b && typeof b.answer === "string"
    ? JSON.stringify({ d: b.decline ?? "", h: words(b.answer), r: (b.reads ?? []).map((r) => String(r.text ?? "")).sort() })
    : x.content;
  return createHash("sha256").update(basis).digest("hex").slice(0, 16);
}

/** "compared to last year", "year over year", "vs a year ago": a time comparison, not a second market. */
const TIME_COMPARE = /\b(last|prior|previous|a) year\b|\byear[- ]?(over|on)[- ]?year\b|\byoy\b|\ba year (ago|earlier|before)\b|\b(last|prior|previous) (quarter|month|season)\b|\b20\d\d\b/i;
/** Refers back to the answer above ("that", "it", "there", "what about …"). */
const ANAPHORA = /\b(that|this|it|its|those|these|there|here|same|then)\b|^\s*(and|so|what about|how about|why|more)\b/i;
/** Intents that describe one market and can carry over to a follow-up about it. */
const CARRY = new Set<ChatIntent>(["revpar_metrics", "supply_pipeline", "demand_visitation", "debt_overlay", "talent_greenlight", "which_submarket", "general_thesis"]);

/**
 * The intent a follow-up continues, or null to classify the question as usual.
 * `hasMarket`: a market is in play (named, in scope, or inherited); `namedMarkets`: covered markets the question names.
 */
export function followUpIntent(question: string, prev: Prev | null, hasMarket: boolean, namedMarkets: number): ChatIntent | null {
  if (!hasMarket) return null;
  const own = classifyIntent(question);
  const carried = prev?.intent && CARRY.has(prev.intent) ? prev.intent : null;
  // One market and a time comparison: continue the topic on screen (default: performance), never "name two markets".
  if (own === "compare_markets" && namedMarkets < 2 && TIME_COMPARE.test(question)) return carried ?? "revpar_metrics";
  // No topic words of its own, but clearly about the answer above.
  if (own === "unknown" && carried && ANAPHORA.test(question)) return carried;
  return null;
}

/** The one-line reply when a follow-up would return the card already on screen. */
export const NO_REPEAT_LINE = "That's the same cited read as above. Nothing more specific is on file for that.";

const LENS_OF: Partial<Record<ChatIntent, "perf" | "supply" | "demand" | "debt" | "labor">> = {
  revpar_metrics: "perf",
  supply_pipeline: "supply",
  supply_ranking: "supply",
  demand_visitation: "demand",
  debt_overlay: "debt",
  rates: "debt",
  talent_greenlight: "labor",
};

/**
 * 2–3 other angles for the no-repeat reply: each chip runs a real question (same market) that routes to a
 * different topic than the card on screen, plus the same question for the last 90 days when it wasn't already.
 */
export function followUpChips(opts: { intent: ChatIntent | null | undefined; market: string | null; question: string; range: DateRange }): FollowUpChip[] {
  const lens = (opts.intent && LENS_OF[opts.intent]) || "perf";
  const m = opts.market;
  const angles: { lens: string; chip: FollowUpChip }[] = m
    ? [
        { lens: "supply", chip: { label: `Supply pipeline in ${m}`, question: `What's the hotel supply pipeline in ${m}?` } },
        { lens: "demand", chip: { label: `Demand drivers in ${m}`, question: `What's driving hotel demand in ${m}?` } },
        { lens: "debt", chip: { label: `Debt and refinancing in ${m}`, question: `What's the hotel debt and refinancing picture in ${m}?` } },
      ]
    : [
        { lens: "supply", chip: { label: "Heaviest supply pipelines", question: "Which covered markets have the heaviest supply pipeline?" } },
        { lens: "debt", chip: { label: "National debt and refinancing", question: "What's the national hotel debt and refinancing picture?" } },
      ];
  const chips = angles.filter((a) => a.lens !== lens).map((a) => a.chip).slice(0, 2);
  // The same topic, last 90 days only, asked in plain words (not "12-month …" under a 90-day tag).
  const same = m ? (lens === "perf" ? `What's the RevPAR and occupancy read for ${m}?` : angles.find((a) => a.lens === lens)?.chip.question) : undefined;
  const q90 = (same ?? opts.question).trim();
  if (opts.range !== "90d" && q90) chips.push({ label: "Last 90 days", question: q90, range: "90d" });
  return chips.slice(0, 3);
}

/* ------------------------------------------------------------------ */
/* Server side: graph-aware resolution (route + tests)                 */
/* ------------------------------------------------------------------ */


export type FollowUpRoute = {
  /** Market to answer for (scope's, the request's, or inherited from prev). */
  marketSlug: string | null;
  /** Intent the follow-up continues (null: classify the question as usual). */
  intent: ChatIntent | null;
  /** True when the market came from prev (the question named none and nothing was in scope). */
  inherited: boolean;
};

/**
 * Where a question goes, given the answer on screen. A question that names its own market, an uncovered place,
 * a hotel, or asks for a cross-market ranking never inherits; an item chip (scope) always wins.
 */
export async function resolveFollowUp(x: { question: string; scope: ChatScope | null; marketSlug: string | null; prev: Prev | null }): Promise<FollowUpRoute> {
  const { question, scope, prev } = x;
  let marketSlug = x.marketSlug;
  if (scope?.kind === "reit") return { marketSlug, intent: null, inherited: false };
  const own = classifyIntent(question);
  const mayInherit = !scope && !marketSlug && Boolean(prev?.marketSlug);
  if (!mayInherit && own !== "compare_markets" && !(own === "unknown" && prev?.intent)) return { marketSlug, intent: null, inherited: false };

  const { retrieveGraphContext, namedCoveredMarkets, isCoveredMarketPhrase, isSupplyRankingQuestion } = await import("./chat");
  const { detectUncoveredPlaces } = await import("./chat-coverage");
  const { matchProperty } = await import("./chat-property");
  const ctx = await retrieveGraphContext(question, null);
  const named = namedCoveredMarkets(question, ctx.markets).length;
  let inherited = false;
  if (
    mayInherit &&
    !ctx.matched &&
    named === 0 &&
    !detectUncoveredPlaces(question, (p) => isCoveredMarketPhrase(p, ctx.markets)).length &&
    !matchProperty(question) &&
    !isSupplyRankingQuestion(question, null) &&
    ctx.markets.some((m) => m.slug === prev!.marketSlug)
  ) {
    marketSlug = prev!.marketSlug;
    inherited = true;
  }
  const hasMarket = Boolean(marketSlug || scope || ctx.matched);
  return { marketSlug, intent: followUpIntent(question, prev, hasMarket, Math.max(named, ctx.matched ? 1 : 0)), inherited };
}

/** Short display name for a market slug ("nashville" → "Nashville"), from the graph; null if unknown. */
export async function marketShortName(slug: string | null | undefined): Promise<string | null> {
  if (!slug) return null;
  const { retrieveGraphContext } = await import("./chat");
  const { shortName } = await import("./chat-brief-build");
  const m = (await retrieveGraphContext("markets")).markets.find((r) => r.slug === slug);
  return m ? shortName(m) : null;
}

/**
 * The no-repeat rule, applied to a built answer: if its card is the one on screen (prev.answerHash), return the
 * one-line reply with chips instead. `hash` is always the built card's hash (sent back as the next prev).
 */
export async function applyNoRepeat<A extends { content: string; brief?: unknown; intent?: string; marketSlug: string | null }>(
  answer: A,
  x: { prev: Prev | null; question: string; range: DateRange }
): Promise<{ answer: A; hash: string; repeat: boolean; followUps?: FollowUpChip[] }> {
  const hash = answerHash(answer);
  if (!x.prev?.answerHash || x.prev.answerHash !== hash) return { answer, hash, repeat: false };
  const followUps = followUpChips({ intent: answer.intent as ChatIntent | undefined, market: await marketShortName(answer.marketSlug), question: x.question, range: x.range });
  return {
    answer: { ...answer, content: NO_REPEAT_LINE, brief: null, citations: [], sources: [], answeredWell: false },
    hash,
    repeat: true,
    followUps,
  };
}
