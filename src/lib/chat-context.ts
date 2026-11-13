/**
 * Chat Batch 1: context-aware follow-ups (Eric's plan, Nov 11, 2026; Hal started it Nov 13, preview only).
 * Combines three roadmap items into one batch, all deterministic ($0, BUNGAH_USE_LLM unset):
 *   1. carry-over chip: after an answer, "Following up on <market · topic · period>", each part with an ×
 *      (the client keeps the parts; `prev.cleared` tells the server which ones the visitor dropped);
 *   2. "what changed" opener: one line at the top of each follow-up answer naming what is different from the
 *      answer before it. A data change is claimed only when the cited sources of the same market + topic +
 *      window now run later than before (span.to); otherwise the line names the new angle and never implies
 *      refreshed data. When the visitor narrows to a hotel segment the graph has no cut for, the line is
 *      "I don't have enough data to answer this confidently; here's what I do know.";
 *   3. next-best alternate: when the visitor adds a constraint (a segment, or a narrower date window), one
 *      alternate question with a one-line, factual why. The route drops it if its card was already shown.
 * Segment is never carried as context: the graph has no segment-level figures, so it is never shown in the chip.
 * Nothing here writes anywhere: the carried context is not stored on the question log (that needs Hal's schema
 * approval; deferred). Pure helpers; the route does the graph reads.
 */
import type { ChatIntent } from "./chat-intent";
import type { DateRange } from "./chat-brief";

export type ContextPart = "market" | "topic" | "period";
export const CONTEXT_PARTS: ContextPart[] = ["market", "topic", "period"];

/** What a follow-up carries: shown in the chip, one × per part. */
export type ChatContext = {
  market: { slug: string; label: string } | null;
  topic: { intent: ChatIntent; label: string } | null;
  /** null when the window is "all" (nothing narrower to carry). */
  period: { range: Exclude<DateRange, "all">; label: string } | null;
};

export type Opener = { kind: "unsupported" | "data" | "angle"; text: string };
export type Alternate = { label: string; question: string; range?: DateRange; why: string };

/** Topic names for the chip and the opener (lower-case in running text). Intents without one are never carried. */
export const TOPIC_LABEL: Partial<Record<ChatIntent, string>> = {
  revpar_metrics: "RevPAR and occupancy",
  supply_pipeline: "Supply pipeline",
  supply_ranking: "Supply pipeline",
  demand_visitation: "Demand drivers",
  debt_overlay: "Debt and refinancing",
  rates: "Interest rates",
  talent_greenlight: "Labor and staffing",
  which_submarket: "Submarkets",
  tax_collections: "Hotel tax collections",
  general_thesis: "Market overview",
  reit_reported: "Reported quarter",
  reit_call: "Earnings call",
  deal_sale: "Sale details",
  deal_grade: "Deal grade",
};

export const PERIOD_LABEL: Record<Exclude<DateRange, "all">, string> = { "90d": "Last 90 days", "12m": "Last 12 months" };
const RANGE_WORDS: Record<DateRange, string> = { "90d": "the last 90 days", "12m": "the last 12 months", all: "all dates" };
const RANGE_ORDER: Record<DateRange, number> = { "90d": 0, "12m": 1, all: 2 };

/**
 * Hotel segments / chain scales the graph has no figures for. "economy" alone is the macro economy, so only
 * "economy hotels / segment / class / tier" counts.
 */
const SEGMENT_RE =
  /\b(upper[- ]upscale|upscale|luxury|upper[- ]midscale|midscale|economy[- ](?:hotels?|segment|class|tier|properties)|select[- ]service|full[- ]service|limited[- ]service|focused[- ]service|extended[- ]stay|boutique|lifestyle)\b/i;

/** The segment a question narrows to ("upscale", "select-service"), normalized; null when it names none. */
export function segmentOf(question: string): string | null {
  const m = question.match(SEGMENT_RE);
  if (!m) return null;
  return m[1].toLowerCase().replace(/\s+/g, "-").replace(/^economy-.*/, "economy").replace(/^upper-(upscale|midscale)$/, "upper $1");
}

/** Strict: `prev.cleared` is ≤3 known parts; anything else is ignored as a whole. */
export function parseCleared(v: unknown): ContextPart[] {
  if (!Array.isArray(v) || v.length > CONTEXT_PARTS.length) return [];
  const out: ContextPart[] = [];
  for (const x of v) {
    if (typeof x !== "string" || !(CONTEXT_PARTS as string[]).includes(x)) return [];
    if (!out.includes(x as ContextPart)) out.push(x as ContextPart);
  }
  return out;
}

/** "Sep 2026" → 202609 (span.to is a month label); null for anything else. */
export function monthKey(label: string | null | undefined): number | null {
  const m = label?.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.? (20\d\d)$/);
  if (!m) return null;
  return Number(m[2]) * 100 + ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(m[1]) + 1;
}

export function contextOf(x: { marketSlug: string | null; marketLabel: string | null; intent: string | null | undefined; range: DateRange }): ChatContext {
  const label = x.intent ? TOPIC_LABEL[x.intent as ChatIntent] : undefined;
  return {
    market: x.marketSlug && x.marketLabel ? { slug: x.marketSlug, label: x.marketLabel } : null,
    topic: label ? { intent: x.intent as ChatIntent, label } : null,
    period: x.range !== "all" ? { range: x.range, label: PERIOD_LABEL[x.range] } : null,
  };
}

/** Lower-case the first word unless it is an acronym-style word ("RevPAR" stays). */
const lc = (s: string) => (/^[A-Z][a-z]+\b/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const UNSUPPORTED_LINE = "I don't have enough data to answer this confidently; here's what I do know.";

/**
 * The one line a follow-up answer opens with, or null (first question, a repeat, a prompt without a card, or
 * nothing changed that a reader could see). `prev*` describe the answer directly above, `cur*` this one.
 * `cardText`: the card's own words (headline + reads); a segment the card itself names is not "unsupported".
 */
export function whatChanged(x: {
  hasPrev: boolean;
  question: string;
  cleared: ContextPart[];
  prevMarket: string | null;
  prevMarketLabel: string | null;
  curMarket: string | null;
  curMarketLabel: string | null;
  prevIntent: string | null;
  curIntent: string | null | undefined;
  prevRange: DateRange | null;
  curRange: DateRange;
  prevDataTo: string | null;
  curDataTo: string | null;
  cardText: string;
  itemScoped: "market" | "reit" | "deal" | null;
}): Opener | null {
  if (!x.hasPrev) return null;
  const seg = x.itemScoped === "reit" || x.itemScoped === "deal" ? null : segmentOf(x.question);
  if (seg && !new RegExp(`\\b${seg.replace(/[- ]/g, "[- ]")}\\b`, "i").test(x.cardText)) {
    const where = x.curMarketLabel ? `${x.curMarketLabel} figures` : "figures";
    return { kind: "unsupported", text: `${UNSUPPORTED_LINE} There's no ${seg}-only cut on file, so the ${where} below cover all hotels.` };
  }
  const prevTopic = x.prevIntent ? TOPIC_LABEL[x.prevIntent as ChatIntent] ?? null : null;
  const curTopic = x.curIntent ? TOPIC_LABEL[x.curIntent as ChatIntent] ?? null : null;
  const sameMarket = (x.prevMarket ?? null) === (x.curMarket ?? null);
  const sameTopic = Boolean(prevTopic && curTopic && prevTopic === curTopic);
  const prevRange = x.prevRange ?? "all";

  // A real data change: the same market, topic and window, and the cited sources now run later than before.
  const a = monthKey(x.prevDataTo);
  const b = monthKey(x.curDataTo);
  if (sameMarket && sameTopic && prevRange === x.curRange && a && b && b > a) {
    return { kind: "data", text: `Newer cited data than your last answer: the sources now run through ${x.curDataTo} (they ran through ${x.prevDataTo}).` };
  }

  const parts: string[] = [];
  if (!sameMarket && x.prevMarketLabel && x.curMarketLabel) parts.push(`switched from ${x.prevMarketLabel} to ${x.curMarketLabel}`);
  else if (!sameMarket && x.prevMarketLabel && !x.curMarket && x.cleared.includes("market")) parts.push(`dropped ${x.prevMarketLabel}, so this is the national read`);
  else if (!sameMarket && !x.prevMarket && x.curMarketLabel) parts.push(`now on ${x.curMarketLabel}`);
  if (curTopic && prevTopic && !sameTopic) parts.push(`${sameMarket && x.curMarketLabel ? `still ${x.curMarketLabel}, ` : ""}now on ${lc(curTopic)} instead of ${lc(prevTopic)}`);
  else if (prevTopic && x.cleared.includes("topic") && curTopic !== prevTopic) {
    parts.push(`dropped ${lc(prevTopic)}${curTopic ? `, now on ${lc(curTopic)}` : sameMarket && x.curMarketLabel ? `, still ${x.curMarketLabel}` : ""}`);
  }
  if (prevRange !== x.curRange) {
    parts.push(RANGE_ORDER[x.curRange] < RANGE_ORDER[prevRange] ? `narrowed to ${RANGE_WORDS[x.curRange]}` : `widened to ${RANGE_WORDS[x.curRange]}`);
  }
  if (parts.length) return { kind: "angle", text: `${cap(parts.join("; "))}.` };
  if (sameMarket && sameTopic) {
    return { kind: "angle", text: `Same ${x.curMarketLabel ? `${x.curMarketLabel} ` : ""}${lc(curTopic!)} data as your last answer, read from the angle you asked about; nothing newer is on file.` };
  }
  return null;
}

/**
 * Candidate next-best alternates when the visitor added a constraint, best first; the route keeps the first
 * whose card is not one already shown. A segment narrowing gets the closest peer compare; a narrower window
 * gets the next-wider window on the same question.
 */
export function alternateCandidates(x: { question: string; prevRange: DateRange | null; curRange: DateRange; marketLabel: string | null; peers: string[]; unsupported: boolean }): Alternate[] {
  const out: Alternate[] = [];
  const prevRange = x.prevRange ?? "all";
  if (x.unsupported && x.marketLabel) {
    for (const p of x.peers.slice(0, 2)) {
      out.push({ label: `Compare ${x.marketLabel} with ${p}`, question: `Compare ${x.marketLabel} vs ${p}`, why: `${p} is the closest peer on file: same supply tier, nearest region.` });
    }
  }
  if (RANGE_ORDER[x.curRange] < RANGE_ORDER[prevRange]) {
    if (x.curRange === "90d") out.push({ label: "Last 12 months", question: x.question, range: "12m", why: "Twelve months covers every season; a 90-day window can reflect one." });
    out.push({ label: "All dates", question: x.question, range: "all", why: "All dates includes the older cited sources this window leaves out." });
  }
  return out;
}
