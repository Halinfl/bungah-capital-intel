/**
 * Fed policy (chat r6, Nov 2 2026): the current fed funds target range and the latest FOMC decisions, from a
 * code/JSON data layer (src/data/fed-policy.json), not the DB. Public figures only (FRED DFEDTARU/DFEDTARL and the
 * federalreserve.gov FOMC statements), each with its citation and as-of date. Facts only: no forecast of the Fed.
 */
import data from "@/data/fed-policy.json";

export type FedDecision = { date: string; action: "held" | "raised" | "lowered"; changeBp?: number; lower: number; upper: number; vote?: string; source: string; title: string; url: string };
export type FedPolicy = {
  checkedAt: string;
  targetRange: { lower: number; upper: number; asOf: string; source: string; urls: string[] };
  decisions: FedDecision[];
  /** Scheduled FOMC meetings, from the federalreserve.gov calendar (checked date and URL kept). */
  upcomingMeetings?: { start: string; end: string; sep?: boolean; source: string; url: string; checkedAt: string }[];
  /** The 10-year Treasury (a market rate, not Fed policy): latest FRED DGS10 print with its as-of date (r6c). */
  tenYear?: { value: number; asOf: string; series: string; source: string; url: string; checkedAt: string; note?: string };
};

export const FED_POLICY = data as unknown as FedPolicy;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2026-10-28" → "Oct 28, 2026". */
export function fedDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
/** 3.75 → "3.75%", 4 → "4.00%". */
export const pct = (n: number) => `${n.toFixed(2)}%`;
export const rangeText = (lo: number, hi: number) => `${lo.toFixed(2)}–${pct(hi)}`;

/** Newest decision first. */
export function fedDecisions(p: FedPolicy = FED_POLICY): FedDecision[] {
  return [...p.decisions].sort((a, b) => b.date.localeCompare(a.date));
}

/** "held the range at 3.75–4.00%" / "raised the range 0.25 point to 3.75–4.00%". */
export function decisionText(d: FedDecision): string {
  const r = rangeText(d.lower, d.upper);
  if (d.action === "held") return `held the target range at ${r}`;
  const amt = d.changeBp ? ` ${(d.changeBp / 100).toFixed(2)} point` : "";
  return `${d.action} the target range${amt} to ${r}`;
}

/**
 * A question about Fed policy (the Fed / FOMC / fed funds, or rate cuts / hikes with no other benchmark named).
 * SOFR, Treasury, mortgage or bond questions keep their own benchmark.
 */
export function isFedPolicyQuestion(q: string): boolean {
  if (/\b(sofr|treasur(y|ies)|10[- ]?(year|yr)|2[- ]?(year|yr)|mortgages?|bonds?|yields?|cap rates?|tax rates?)\b/i.test(q)) return false;
  if (/\b(fed|feds|federal reserve|fomc|fed funds|federal funds|policy rate|powell)\b/i.test(q)) return true;
  return /\b(rate (cut|hike|increase|decrease)s?|cut(ting|s)? rates|(rais|hik)(e|es|ing) rates)\b/i.test(q) && !/\b(room|hotel|nightly|adr|average daily)\b/i.test(q);
}

/** The next scheduled FOMC meeting on or after `today` (ISO date), or null when none is on file. */
export function nextFomcMeeting(today: string, p: FedPolicy = FED_POLICY) {
  return [...(p.upcomingMeetings ?? [])].sort((a, b) => a.start.localeCompare(b.start)).find((m) => m.end >= today) ?? null;
}

/** "Dec 8–9, 2026" (same month) or "Jan 31–Feb 1, 2027". */
export function meetingDates(m: { start: string; end: string }): string {
  const [s, e] = [fedDate(m.start), fedDate(m.end)];
  const [sm, sd] = s.replace(/,.*/, "").split(" ");
  const [em, ed] = e.replace(/,.*/, "").split(" ");
  return sm === em ? `${sm} ${sd}–${ed}, ${m.end.slice(0, 4)}` : `${sm} ${sd}–${em} ${ed}, ${m.end.slice(0, 4)}`;
}

/** A question asking what the Fed WILL do (a forecast): "Will the Fed cut in December?", "Odds of a hike?". */
export function isFedForecastQuestion(q: string): boolean {
  if (!isFedPolicyQuestion(q)) return false;
  return /\b(will|won't|going to|gonna|expect(ed|s)?|likely|odds|chance|probabilit(y|ies)|forecast|predict(ion)?|next (meeting|move|cut|hike)|in (january|february|march|april|may|june|july|august|september|october|november|december|20\d\d)|(this|next) (month|year|meeting)|by (year[- ]end|the end of))\b/i.test(q);
}

/** The opening line for a Fed forecast question: no forecast, plus the next scheduled meeting (cited). */
export function fedForecastLine(today: string, p: FedPolicy = FED_POLICY): string {
  const m = nextFomcMeeting(today, p);
  return m ? `We don't forecast Fed decisions. The next FOMC meeting is ${meetingDates(m)} (Federal Reserve FOMC calendar).` : "We don't forecast Fed decisions.";
}

/**
 * The 10-year Treasury, from one place (r6d): the latest FRED DGS10 print in src/data/fed-policy.json. Every 10-year
 * mention (the Fed card, the rates / SOFR answer, the refinancing lead, Stack memos) reads it from here, so none can
 * disagree. Update `tenYear` in fed-policy.json (value + asOf, checked on fred.stlouisfed.org) and they all move.
 */
export const TEN_YEAR = FED_POLICY.tenYear!;
/** "4.98%". */
export const tenYearPct = () => pct(TEN_YEAR.value);
/** Memo line: "10-year Treasury 4.98% (2026-10-29, FRED DGS10)". */
export const tenYearMemoText = () => `10-year Treasury ${tenYearPct()} (${TEN_YEAR.asOf}, FRED ${TEN_YEAR.series})`;
const SHORT = (iso: string) => fedDate(iso).replace(/, \d{4}$/, "");

/**
 * The data-layer 10-year as a national graph row (display layer only; the DB is unchanged). It stands in for the
 * stored 10-year rows (e.g. "US 10-year Treasury 5.09% (Oct 16 close)"), which are dropped at load when older.
 */
export function tenYearSignal<T>(): T {
  const short = SHORT(TEN_YEAR.asOf);
  return {
    id: `data-layer-${TEN_YEAR.series.toLowerCase()}-${TEN_YEAR.asOf}`,
    marketId: null,
    kind: "rates",
    title: `US 10-year Treasury ${tenYearPct()}`,
    body: `US 10-year Treasury ${tenYearPct()} (FRED ${TEN_YEAR.series}). National rate read for the refinance test.`,
    magnitude: tenYearPct(),
    asOf: TEN_YEAR.asOf,
    sourceLabel: TEN_YEAR.source,
    sourceUrls: [{ url: TEN_YEAR.url, label: `10-year ${tenYearPct()}, ${short} — FRED ${TEN_YEAR.series}`, secondary: false }],
    createdAt: new Date(`${TEN_YEAR.checkedAt}T12:00:00Z`),
  } as unknown as T;
}

/** A stored 10-year Treasury rate row (any date): replaced by the data-layer read. */
export const isTenYearRow = (s: { kind?: string; title: string }) => /\b(10-year|10Y)\b/i.test(s.title) && /Treasury|\b10Y\b/i.test(s.title) && (s.kind ?? "rates") === "rates";

/** National rows with every stored 10-year row replaced by the one data-layer 10-year. */
export function withDataLayerTenYear<T extends { kind?: string; title: string }>(rows: T[]): T[] {
  return [tenYearSignal<T>(), ...rows.filter((s) => !isTenYearRow(s))];
}
