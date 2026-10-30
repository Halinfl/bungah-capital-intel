/**
 * "Swipe through this week" (mobile, optional): pure card builder for the Tuesday Trends swipe deck.
 * Built only from `issue.moves()`: no weekly writing, no new data, no generated text. Safe for client components.
 */
import { HORIZONS, STAYS, fmtPct, fmtRate, fmtStayRange, wowAria, type Horizon, type TTMove } from "@/lib/tuesday-trends-shared";
import { parseScope } from "@/lib/chat-scope";

/** The deck (and its entry pill) exists only with at least this many moves. */
export const SWIPE_MIN_MOVES = 3;
/** At most this many move cards; the closing card comes on top. Never padded. */
export const SWIPE_MAX_MOVES = 4;
/** Chat `source` tag (ChatQuestionLog.source) for questions asked from a card. */
export const SWIPE_SOURCE = "tt-swipe";

/** The four fixed "what it means" sentences (decision, Oct 30 2026). Picked by stay horizon and direction only. */
export const WHAT_IT_MEANS = {
  nearUp: "Same hotels are asking more for stays soon: a read on near-term demand, not a forecast.",
  nearDown: "Same hotels are asking less for stays soon: a read on near-term demand, not a forecast.",
  farUp: "Same hotels priced this stay higher than last week: early pricing intent, still far from the date.",
  farDown: "Same hotels priced this stay lower than last week: early pricing intent, still far from the date.",
} as const;

/** Up to 1 month out is near-term; 3 months and beyond is far. */
const NEAR: ReadonlySet<Horizon> = new Set<Horizon>(["7d", "30d"]);
const FAR: ReadonlySet<Horizon> = new Set<Horizon>(["91d", "182d", "325d"]);

/**
 * The "what it means" line for a move, or null when the direction is flat or missing (never guess). Flat means the
 * change shows as "0%" on the board (fmtPct), so the sentence never contradicts the number next to it.
 */
export function whatItMeans(horizon: Horizon | string | null | undefined, pct: number | null | undefined): string | null {
  if (pct == null || !Number.isFinite(pct) || fmtPct(pct) === "0%") return null;
  const up = pct > 0;
  if (NEAR.has(horizon as Horizon)) return up ? WHAT_IT_MEANS.nearUp : WHAT_IT_MEANS.nearDown;
  if (FAR.has(horizon as Horizon)) return up ? WHAT_IT_MEANS.farUp : WHAT_IT_MEANS.farDown;
  return null;
}

export type SwipeMoveCard = {
  kind: "move";
  key: string;
  market: string;
  slug: string;
  /** "1 wk out · Weekend Nov 6–8" */
  basis: string;
  /** "+76%" (true minus sign for falls); neutral gray in the UI, the sign carries the direction. */
  change: string;
  /** "$163 → $276 a night (median)" */
  rates: string;
  meaning: string | null;
  /** "Same 46 hotels, cheapest refundable, pre-tax" */
  basedOn: string;
  /** Screen-reader summary, same wording as the moves strip. */
  aria: string;
  /** Primary action: "Ask about this" in Chat (market chip + tt-swipe tag), or "Open market" if the slug isn't a valid scope. */
  action: { label: string; href: string; aria: string };
};

export type SwipeEndCard = { kind: "end"; key: "end"; text: string };
export type SwipeCard = SwipeMoveCard | SwipeEndCard;

/** Chat link for a card: the existing "Ask about this" scope plus `via=tt-swipe` (the only tracking). */
export function swipeAskHref(slug: string): string | null {
  const scope = parseScope(`market:${slug}`);
  if (!scope) return null;
  return `/chat?about=${encodeURIComponent(`${scope.kind}:${scope.id}`)}&via=${SWIPE_SOURCE}`;
}

export function moveCard(m: TTMove): SwipeMoveCard {
  const h = HORIZONS.find((x) => x.key === m.horizon);
  const s = STAYS.find((x) => x.key === m.stay);
  const range = fmtStayRange(m.checkIn, m.checkOut);
  const ask = swipeAskHref(m.slug);
  return {
    kind: "move",
    key: `${m.market}-${m.horizon}-${m.stay}`,
    market: m.marketName,
    slug: m.slug,
    basis: `${h?.label ?? m.horizon} out · ${s?.label ?? m.stay} ${range}`,
    change: fmtPct(m.pct),
    rates: `${fmtRate(m.prev)} → ${fmtRate(m.now)} a night (median)`,
    meaning: whatItMeans(m.horizon, m.pct),
    basedOn: `Same ${m.nPairs} hotels, cheapest refundable, pre-tax`,
    aria: `${m.marketName}, ${h?.long ?? m.horizon}, ${s?.label ?? m.stay} ${s?.days ?? ""} (${range}): ${wowAria(m.pct)}, ${fmtRate(m.prev)} to ${fmtRate(m.now)}, median of ${m.nPairs} same hotels`,
    action: ask
      ? { label: "Ask about this", href: ask, aria: `Ask about ${m.marketName} in Chat` }
      : { label: "Open market", href: `/markets/${m.slug}`, aria: `Open ${m.marketName}` },
  };
}

/**
 * The deck's cards: the first 4 moves plus one closing card, or null (no deck, no pill) when the issue has no
 * week-over-week figures or fewer than 3 moves.
 */
export function buildSwipeCards(moves: TTMove[] | null | undefined, opts: { hasWow: boolean; fresh?: boolean }): SwipeCard[] | null {
  if (!opts.hasWow || !moves || moves.length < SWIPE_MIN_MOVES) return null;
  const cards: SwipeCard[] = moves.slice(0, SWIPE_MAX_MOVES).map(moveCard);
  const n = cards.length;
  cards.push({ kind: "end", key: "end", text: `That's ${whose(opts.fresh !== false)} ${n} biggest moves outside holiday weeks.` });
  return cards;
}

/** "this week's" only for the latest issue while it is at most 8 days old (same rule as the kicker); otherwise "this issue's". */
export function whose(fresh: boolean): string {
  return fresh ? "this week's" : "this issue's";
}

/** The latest issue, captured at most FRESH_DAYS ago (ET). Past issues are never fresh. */
export function isFresh(date: string, isLatest: boolean, now = new Date()): boolean {
  return isLatest && ageDays(date, now) <= FRESH_DAYS;
}

/** Entry pill's accessible name: "Swipe through this week's 3 moves" (or "this issue's" when stale or past). */
export function swipePillName(n: number, fresh: boolean): string {
  return `Swipe through ${whose(fresh)} ${n} moves`;
}

/** Dialog label: "This week's moves, Tuesday Trends · Oct 27" (or "This issue's moves, Latest · Tue, Oct 27"). */
export function swipeDialogLabel(fresh: boolean, kicker: string): string {
  const w = whose(fresh);
  return `${w[0].toUpperCase()}${w.slice(1)} moves, ${kicker}`;
}

/**
 * Chat source for a question in a Chat opened from a swipe card (`?via=tt-swipe`): only the FIRST new question is
 * tagged "tt-swipe"; later questions keep their normal source, and date-window re-asks always stay "reask".
 * Returns the source to send and whether the tag is still pending.
 */
export function chatSourceFor<S extends string>(requested: S, swipePending: boolean): { source: S | typeof SWIPE_SOURCE; pending: boolean } {
  if (!swipePending || requested === "reask") return { source: requested, pending: swipePending };
  return { source: SWIPE_SOURCE, pending: false };
}

/** `card` URL value → 1-based index; anything invalid or out of range is 1. */
export function clampCard(v: string | null | undefined, total: number): number {
  if (!v || !/^\d+$/.test(v)) return 1;
  const n = Number(v);
  return n >= 1 && n <= total ? n : 1;
}

/** Days from a capture date (YYYY-MM-DD) to today in ET: the same 8-day "Latest" rule as the home card. */
export function ageDays(date: string, now = new Date()): number {
  const today = now.toLocaleDateString("en-CA", { timeZone: "America/New_York" });
  return Math.round((Date.parse(`${today}T12:00:00Z`) - Date.parse(`${date}T12:00:00Z`)) / 86_400_000);
}
export const FRESH_DAYS = 8;
