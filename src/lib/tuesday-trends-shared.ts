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
/** At or above this many of 50 sold out, the sold-out badge gets a dot. */
export const SOLD_OUT_DOT_AT = 10;
export const LIST_SIZE = 50;

/** Labels for the current capture (Tue Oct 20, 2026, 9:33–9:40 PM ET) and list version. */
export const TT_CAPTURED_LABEL = "Tue, Oct 20, 2026";
export const TT_CAPTURE_TIME_LABEL = "9:33–9:40 PM ET";
export const TT_LIST_LABEL = "v1, effective Oct 20, 2026";

export type TTCell = {
  horizon: Horizon;
  stay: Stay;
  checkIn: string;
  checkOut: string;
  nights: number;
  refundable: number | null;
  nRefundable: number;
  lowest: number | null;
  nPriced: number;
  nSoldOut: number;
};

export type TTMarket = {
  key: string;
  slug: string;
  name: string;
  cells: TTCell[];
};

/* ---------- shared display helpers (safe for client use) ---------- */

export function cellValue(c: TTCell, metric: Metric): { value: number | null; n: number } {
  return metric === "refundable" ? { value: c.refundable, n: c.nRefundable } : { value: c.lowest, n: c.nPriced };
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
