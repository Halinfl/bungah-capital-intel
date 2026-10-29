/** Tuesday Trends types and display helpers. No data imports, so client components can use it. */
export type Horizon = "7d" | "30d" | "91d" | "182d" | "325d";
export type Stay = "weekday" | "weekend";
export type Metric = "refundable" | "lowest";

export const HORIZONS: { key: Horizon; label: string; chip: string; long: string }[] = [
  { key: "7d", label: "1 wk", chip: "1W", long: "1 week out" },
  { key: "30d", label: "1 mo", chip: "1M", long: "1 month out" },
  { key: "91d", label: "3 mo", chip: "3M", long: "3 months out" },
  { key: "182d", label: "6 mo", chip: "6M", long: "6 months out" },
  { key: "325d", label: "~11 mo", chip: "11M", long: "About 11 months out" },
];

export const STAYS: { key: Stay; label: string; days: string }[] = [
  { key: "weekday", label: "Weekday", days: "Mon–Thu" },
  { key: "weekend", label: "Weekend", days: "Fri–Sun" },
];

/** Below this many of 50 hotels with the displayed rate, the cell shows "—" and "thin". */
export const THIN_BELOW = 15;
/** At or above this many of 50 with no rates on Google (1-week cells), the count gets a dot. */
export const NO_RATES_DOT_AT = 10;
export const LIST_SIZE = 50;

/** Capture and list labels are derived per issue from the data: see TTIssue in "@/lib/tuesday-trends" (server only). */

export type TTCell = {
  horizon: Horizon;
  stay: Stay;
  checkIn: string;
  checkOut: string;
  nights: number;
  refundable: number | null;
  nRefundable: number;
  lowest: number | null;
  /** Priced hotels used in medians (low-confidence prices left out); coverage for "Any rate". */
  nUsed: number;
  nLowConfidence: number;
  /** Hotels with no rates on Google for these dates, excluding hotels not on Google at all this week. */
  nNoRates: number;
  nNotOnGoogle: number;
  /** Data flag: 10+ no-rates hotels, never at the structural ~11-month horizon. Shown on 1-week cells only. */
  noRatesDot: boolean;
  /** Week-over-week, matched pairs (same hotels both Tuesdays): % change on the refundable rate, null when under 15 pairs. */
  wow: number | null;
  wowPairs: number;
  /** The same on the headline ("Any rate") price. */
  wowLowest: number | null;
  wowLowestPairs: number;
  /** Median "Any rate" price incl. taxes + fees (Google's stay total / nights); null unless 9 in 10 used hotels have it. */
  inclTax: number | null;
  /**
   * Holidays behind the capture's holiday flag (wow_holiday) for this cell: in this week's stay ("this") or only in
   * last week's ("last"). The moves strip leaves these cells out; the board names them in its basis line.
   */
  holidays: { name: string; side: "this" | "last" }[];
};

/** One of this week's biggest matched-pair moves (cheapest refundable rate). */
export type TTMove = {
  market: string;
  marketName: string;
  slug: string;
  horizon: Horizon;
  stay: Stay;
  pct: number;
  nPairs: number;
  prev: number;
  now: number;
  checkIn: string;
  checkOut: string;
};

export type TTMarket = {
  key: string;
  slug: string;
  name: string;
  cells: TTCell[];
};

/* ---------- shared display helpers (safe for client use) ---------- */

export function cellValue(c: TTCell, metric: Metric): { value: number | null; n: number } {
  return metric === "refundable" ? { value: c.refundable, n: c.nRefundable } : { value: c.lowest, n: c.nUsed };
}

export function isThin(n: number): boolean {
  return n < THIN_BELOW;
}

export function fmtRate(v: number | null): string {
  if (v == null) return "—";
  return `$${Math.round(v).toLocaleString("en-US")}`;
}

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-10-26","2026-10-29" → "Oct 26–29"; across months "Oct 30–Nov 1". */
export function fmtStayRange(checkIn: string, checkOut: string): string {
  const [, m1, d1] = checkIn.split("-").map(Number);
  const [, m2, d2] = checkOut.split("-").map(Number);
  return m1 === m2 ? `${MON[m1 - 1]} ${d1}–${d2}` : `${MON[m1 - 1]} ${d1}–${MON[m2 - 1]} ${d2}`;
}

export function stayYear(checkIn: string): string {
  return checkIn.slice(0, 4);
}

/** Week-over-week for the metric shown; null when thin (under 15 matched hotels). */
export function cellWow(c: TTCell, metric: Metric): { pct: number | null; n: number } {
  return metric === "refundable" ? { pct: c.wow, n: c.wowPairs } : { pct: c.wowLowest, n: c.wowLowestPairs };
}

/** "+4%", "−3%", "0%" (true minus sign; one decimal under 1%). Neutral text only: no color for direction. */
export function fmtPct(v: number | null): string {
  if (v == null) return "";
  const a = Math.abs(v);
  const r = a < 1 && a > 0 ? a.toFixed(1) : Math.round(a).toString();
  if (r === "0" || r === "0.0") return "0%";
  return `${v > 0 ? "+" : "−"}${r}%`;
}

export function wowAria(v: number | null): string {
  if (v == null) return "";
  const a = Math.abs(v);
  const r = a < 1 && a > 0 ? a.toFixed(1) : Math.round(a).toString();
  if (r === "0" || r === "0.0") return "unchanged vs last Tuesday";
  return `${v > 0 ? "up" : "down"} ${r}% vs last Tuesday`;
}
