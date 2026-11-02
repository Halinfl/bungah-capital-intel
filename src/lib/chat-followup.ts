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
 *   3. never repeat a card: if the card about to be returned hashes to prev.answerHash or to any answer already
 *      shown in this thread (prev.seen, the last ≤10 card fingerprints, newest first), reply with one line and
 *      chips for other angles (supply, demand, debt, labor, last 90 days), each a real question whose card is
 *      not one already shown.
 * `prev` is untrusted input: every field is type-checked and length-capped; anything invalid is dropped
 * (a malformed `seen` is ignored as a whole). `seen` never enters the answer cache key: the cache keys on the
 * question, item, intent and window only, and the repeat check runs after the cache lookup.
 * Pure helpers here; the route does the graph reads.
 */
import { createHash } from "node:crypto";
import { CHAT_INTENTS, classifyIntent, isBareRates, type ChatIntent } from "./chat-intent";
import type { DateRange } from "./chat-brief";
import type { ChatScope } from "./chat-scope";

export type Prev = {
  question: string | null;
  intent: ChatIntent | null;
  marketSlug: string | null;
  answerHash: string | null;
  /** Fingerprints of the answers already shown in this thread (newest first, ≤ SEEN_MAX); [] when absent or malformed. */
  seen?: string[];
};
export type FollowUpChip = { label: string; question: string; range?: DateRange };

/** Caps for the untrusted `prev` object. */
export const PREV_MAX_QUESTION = 300;
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,80}$/;
const HASH_RE = /^[a-f0-9]{16}$/;
const INTENTS = new Set<string>(CHAT_INTENTS);
/** The client sends the fingerprints of the last ~10 answers in the thread. */
export const SEEN_MAX = 10;

/** `prev.seen`: an array of ≤ SEEN_MAX 16-hex fingerprints. Anything else (wrong type, too long, one bad entry) is ignored. */
export function parseSeen(v: unknown): string[] {
  if (!Array.isArray(v) || v.length > SEEN_MAX) return [];
  const out: string[] = [];
  for (const x of v) {
    if (typeof x !== "string" || !HASH_RE.test(x)) return [];
    if (!out.includes(x)) out.push(x);
  }
  return out;
}

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
  const seen = parseSeen(o.seen);
  if (!question && !intent && !marketSlug && !answerHash && !seen.length) return null;
  return { question, intent, marketSlug, answerHash, seen };
}

/** Every fingerprint already shown in the thread: prev.answerHash plus prev.seen. */
export function shownHashes(prev: Prev | null | undefined): Set<string> {
  const out = new Set<string>(prev?.seen ?? []);
  if (prev?.answerHash) out.add(prev.answerHash);
  return out;
}

type CardLike = { content: string; brief?: unknown; marketSlug?: string | null };

/** The buy/sell (or staff-cut) decline and the decision-support footer: framing, never part of what the card says. */
const DECLINE_LINES = /^\s*(\*\*We don't (give buy or sell recommendations|recommend staff cuts)\.\*\*.*|Bungah Capital Intel gives decision support, not recommendations.*|_?Decision support[,:].*)$/gim;

/**
 * The data period a headline describes ("County YTD through Sep 12 2026", "Q2 2026", "Aug 2026"), from its own
 * words. This is the window the headline's figures cover, not the date filter the question was asked under:
 * the same county-YTD headline under "Last 90 days" is the same answer to a reader.
 */
function headlineWindow(head: string): string {
  const m = head.match(/\b(YTD( through [A-Z][a-z]{2,8}\.? \d{1,2},? 20\d\d)?|T12[^,;)]*|Q[1-4] 20\d\d|(FY|CY)\s?20?\d\d|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* 20\d\d|(week|wk) ending [\d-]+|20\d\d)\b/i);
  return m ? m[0].toLowerCase() : "";
}

/**
 * The card's own headline: the premise check it opens with ("Occupancy is actually up …", "Mixed: …") is framing
 * about the question, like the decline line, so it is removed.
 */
export function cardHeadline(answer: string, premise?: string | null): string {
  if (!premise) return answer;
  const i = answer.indexOf(premise);
  return i < 0 ? answer : `${answer.slice(0, i)}${answer.slice(i + premise.length)}`.replace(/\s{2,}/g, " ").trim();
}

/**
 * Fingerprint of what a reader sees as "the answer": the card's headline (as a bag of words, so the same figures
 * in another order still count), its market, and the data window the headline describes. Key reads, the coverage
 * line, the date filter, collapsed sections, the buy/sell decline line and the premise check are left out, so "Last 90 days" of the
 * same headline, or the same card with only the decline added, is the same answer. Without a summary card, the
 * answer text itself (decline and footer lines removed). Equal hash = the same answer.
 */
export function answerHash(a: CardLike | string): string {
  const x = typeof a === "string" ? { content: a } : a;
  const b = x.brief as { answer?: string; premise?: string } | null | undefined;
  const words = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N}$%.+\-−]+/gu, " ").trim().split(/\s+/).filter(Boolean).sort();
  const market = (typeof a === "string" ? null : a.marketSlug) ?? "";
  const head = b && typeof b.answer === "string" ? cardHeadline(b.answer, b.premise) : null;
  const basis = head !== null
    ? JSON.stringify({ m: market, h: words(head), w: headlineWindow(head) })
    : JSON.stringify({ m: market, c: x.content.replace(DECLINE_LINES, "").replace(/\n{2,}/g, "\n").trim() });
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

/** The one-line reply when a follow-up would return the card directly above (the last answer). */
export const NO_REPEAT_LINE = "That's the same answer as above. Nothing more specific is on file for that.";
/** The one-line reply when the matching answer was shown earlier in the thread, not directly above. */
export const NO_REPEAT_EARLIER_LINE = "That's the same answer as earlier in this chat. Nothing more specific is on file for that.";

/** After a premise or decline line on a repeat: the card itself is not shown again. */
export const CARD_ABOVE_LINE = "The full cited card is above.";

/**
 * The new line a repeated card carries, if any: the decline's first sentence ("We don't give buy or sell
 * recommendations.") and/or the premise check ("Mixed: occupancy is down 0.2% in Q2 2026 (Cushman & Wakefield) but
 * up 3.2% …"). Plain text (the note is shown as plain text above its chips). Empty when there is none.
 */
export function repeatExtraLine(brief: unknown): string {
  const b = brief as { decline?: string; premise?: string } | null | undefined;
  const decline = b?.decline ? (b.decline.match(/\*\*([^*]+)\*\*/)?.[1] ?? b.decline.split(/(?<=\.)\s/)[0]).trim() : "";
  const premise = b?.premise?.trim() ?? "";
  return [decline, premise].filter(Boolean).join(" ");
}

/** Which note: "as above" when the match is the last answer (prev.answerHash), else "earlier in this chat". */
export function noRepeatLine(hash: string, prev: Prev | null | undefined): string {
  return prev?.answerHash === hash ? NO_REPEAT_LINE : NO_REPEAT_EARLIER_LINE;
}

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
 * Candidate other angles for the no-repeat reply, best first: each chip runs a real question (same market) that
 * routes to a different topic than the card on screen, then the same topic for the last 90 days when it wasn't
 * already. applyNoRepeat drops any whose card was already shown and keeps up to 3.
 */
export function followUpChips(opts: { intent: ChatIntent | null | undefined; market: string | null; question: string; range: DateRange; peers?: string[] }): FollowUpChip[] {
  const lens = (opts.intent && LENS_OF[opts.intent]) || "perf";
  const m = opts.market;
  // Best first; the performance angle comes last for a market (its card is usually the one already shown).
  const angles: { lens: string; chip: FollowUpChip }[] = m
    ? [
        { lens: "supply", chip: { label: `Supply pipeline in ${m}`, question: `What's the hotel supply pipeline in ${m}?` } },
        { lens: "demand", chip: { label: `Demand drivers in ${m}`, question: `What's driving hotel demand in ${m}?` } },
        { lens: "debt", chip: { label: `Debt and refinancing in ${m}`, question: `What's the hotel debt and refinancing picture in ${m}?` } },
        { lens: "labor", chip: { label: `Labor and staffing in ${m}`, question: `What's the hotel labor and staffing picture in ${m}?` } },
        { lens: "perf", chip: { label: `RevPAR and occupancy in ${m}`, question: `What's the RevPAR and occupancy read for ${m}?` } },
      ]
    : [
        { lens: "supply", chip: { label: "Heaviest supply pipelines", question: "Which covered markets have the heaviest supply pipeline?" } },
        { lens: "debt", chip: { label: "National debt and refinancing", question: "What's the national hotel debt and refinancing picture?" } },
        { lens: "perf", chip: { label: "National RevPAR and occupancy", question: "What's the national RevPAR and occupancy picture?" } },
        { lens: "labor", chip: { label: "National labor and staffing", question: "What's the national hotel labor and staffing picture?" } },
      ];
  const chips = angles.filter((a) => a.lens !== lens).map((a) => a.chip);
  // The same topic, last 90 days only, asked in plain words (not "12-month …" under a 90-day tag).
  const same = m ? (lens === "perf" ? `What's the RevPAR and occupancy read for ${m}?` : angles.find((a) => a.lens === lens)?.chip.question) : undefined;
  const q90 = (same ?? opts.question).trim();
  if (opts.range !== "90d" && q90) chips.push({ label: "Last 90 days", question: q90, range: "90d" });
  // Backfill for a market thread whose own angles were all shown already: a peer compare (same supply tier, nearest
  // region), then national reads, so a note always has at least 2 chips (applyNoRepeat drops any already shown).
  if (m) {
    for (const p of (opts.peers ?? []).slice(0, 2)) chips.push({ label: `Compare with ${p}`, question: `Compare ${m} vs ${p}` });
    chips.push(
      { label: "National RevPAR and occupancy", question: "What's the national RevPAR and occupancy picture?" },
      { label: "Heaviest supply pipelines", question: "Which covered markets have the heaviest supply pipeline?" },
      { label: "National debt and refinancing", question: "What's the national hotel debt and refinancing picture?" }
    );
  }
  return chips;
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
  // Bare "rates" after a national answer: interest rates after a rates / debt card, room rates after a national
  // performance card (no clarifying prompt then). After a market's card, the market is inherited below (room rates).
  if (isBareRates(question) && !scope && !marketSlug && !prev?.marketSlug && prev?.intent) {
    if (prev.intent === "rates" || prev.intent === "debt_overlay") return { marketSlug, intent: "rates", inherited: false };
    if (prev.intent === "revpar_metrics") return { marketSlug, intent: "revpar_metrics", inherited: false };
  }
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

/** Compare peers for a market (chat.ts comparePeers: same supply tier, nearest region), as compare-chip names. */
export async function peerNames(slug: string | null | undefined): Promise<string[]> {
  if (!slug) return [];
  const { retrieveGraphContext, comparePeers, compareName } = await import("./chat");
  const markets = (await retrieveGraphContext("markets")).markets;
  const m = markets.find((r) => r.slug === slug);
  return m ? comparePeers(markets, m).map(compareName) : [];
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
 * The no-repeat rule, applied to a built answer (after the cache lookup): if its card matches any answer already
 * shown in the thread (prev.answerHash or prev.seen), return the one-line reply with chips instead. Chips whose
 * card would match an answer already shown (or each other) are dropped; `hashOf` builds a chip's card (cached,
 * deterministic) and returns its fingerprint. `hash` is always the built card's hash (sent back as the next prev).
 */
export async function applyNoRepeat<A extends { content: string; brief?: unknown; intent?: string; marketSlug: string | null }>(
  answer: A,
  x: { prev: Prev | null; question: string; range: DateRange; hashOf?: (chip: FollowUpChip) => Promise<string | null> }
): Promise<{ answer: A; hash: string; repeat: boolean; followUps?: FollowUpChip[] }> {
  const hash = answerHash(answer);
  const shown = shownHashes(x.prev);
  if (!shown.has(hash)) return { answer, hash, repeat: false };
  const extra = repeatExtraLine(answer.brief);
  const candidates = followUpChips({ intent: answer.intent as ChatIntent | undefined, market: await marketShortName(answer.marketSlug), question: x.question, range: x.range, peers: await peerNames(answer.marketSlug) });
  const taken = new Set<string>([...shown, hash]);
  const followUps: FollowUpChip[] = [];
  for (const c of candidates) {
    if (followUps.length >= 3) break;
    if (x.hashOf) {
      const h = await x.hashOf(c).catch(() => null);
      if (!h || taken.has(h)) continue;
      taken.add(h);
    }
    followUps.push(c);
  }
  return {
    // Never lose a new line: a premise or decline line is shown first, then "The full cited card is above.";
    // the bare note only when the repeat adds nothing.
    answer: { ...answer, content: extra ? `${extra} ${CARD_ABOVE_LINE}` : noRepeatLine(hash, x.prev), brief: null, citations: [], sources: [], answeredWell: false },
    hash,
    repeat: true,
    followUps,
  };
}
