import rubricJson from "@/data/deals/rubric-v1.1.json";
import rubricV1Json from "@/data/deals/rubric-v1.json";
import salesJson from "@/data/deals/graded_sales.json";
import gradesJson from "@/data/deals/sale_grades.json";
import anniversariesJson from "@/data/deals/sale_anniversaries.json";
import entriesJson from "@/data/deals/entries.json";
import logJson from "@/data/deals/deal_log.json";
import type { FactorResult, GradeResult, Rubric } from "@/lib/deals-grade";

export type Sale = {
  sale_id: string;
  log_id?: string;
  slug: string;
  property: string;
  market: string;
  market_slug: string | null;
  buyer: string;
  buyer_tickers: string[];
  seller: string;
  seller_note?: string;
  seller_tickers: string[];
  price: number | null;
  /** Shown instead of "Unpriced" when a range or a non-price status is the honest label (never an estimate). */
  price_display?: string;
  price_qualifier?: string;
  price_per_key: number | null;
  /** Rubric v1.1 price-range rule: the date the price was first confirmed, when only a range was public at announcement. */
  price_confirmed_on?: string;
  keys: number | null;
  keys_detail?: string;
  announced_on: string;
  closed_on: string | null;
  /** When the close date isn't company-confirmed: the dated press report of the close. */
  close_report?: { by: "press"; date: string; url: string; source: string };
  status: "announced" | "closed" | "terminated";
  inclusion_basis: "reit" | "100m+" | "both";
  price_source_kind: "filing" | "press" | "record";
  source_uris: string[];
};
export type Source = { kind: "filing" | "record" | "press"; title: string; publisher: string; date: string; url: string };
export type ContextItem = { text: string; url: string; date: string };
export type Entry = {
  tape: string | null;
  factor_context?: Record<string, ContextItem[]>;
  baseline?: ContextItem[];
  financing_tags: string[];
  watches_for: string | null;
  related: { href: string; label: string }[];
  sources: Source[];
};
export type Anniversary = { sale_id: string; horizon: "T+1" | "T+2"; market_metric: string; value: string; source_uri: string; recorded_on: string };
export type LogRow = {
  log_id: string;
  announce_date: string;
  close_date: string;
  hotel: string;
  market: string;
  keys: string;
  buyer: string;
  seller: string;
  price_usd: string;
  disclosed_metric: string;
  inclusion_basis: string;
  source_url: string;
  graded: string;
};

/** Current rubric (v1.1, approved 2026-11-01). Earlier versions stay importable for the version history. */
export const RUBRIC = rubricJson as unknown as Rubric;
export const RUBRIC_HISTORY = [rubricV1Json as unknown as Rubric, RUBRIC];
export const DISCLAIMER = RUBRIC.disclaimer;
const SALES = salesJson as Sale[];
const GRADES = gradesJson as unknown as GradeResult[];
/** Labels for context sections that aren't rubric factors. */
export const CONTEXT_LABELS: Record<string, string> = {
  access: "Access: airlift and drive (not a rubric factor; no weight)",
};
const ANNIVERSARIES = anniversariesJson as Anniversary[];
const ENTRIES = entriesJson as Record<string, Entry>;

/** Newest announcement first. Never sorted by grade. */
export function sales(): Sale[] {
  return [...SALES].sort((a, b) => b.announced_on.localeCompare(a.announced_on));
}
export function saleBySlug(slug: string): Sale | undefined {
  return SALES.find((s) => s.slug === slug);
}
/** All grades for a sale, current rubric version first. Originals are kept, never overwritten. */
export function gradesFor(saleId: string): GradeResult[] {
  return GRADES.filter((g) => g.sale_id === saleId).sort((a, b) => b.rubric_version.localeCompare(a.rubric_version));
}
export function entryFor(saleId: string): Entry {
  return ENTRIES[saleId] ?? { tape: null, financing_tags: [], watches_for: null, related: [], sources: [] };
}
export function anniversariesFor(saleId: string): Anniversary[] {
  return ANNIVERSARIES.filter((a) => a.sale_id === saleId);
}
/** Every qualifying deal seen (append-only log), newest announcement first. Excluded rows stay in the CSV, not on the page. */
export function dealLog(): LogRow[] {
  return [...(logJson as unknown as LogRow[])].filter((r) => !r.inclusion_basis.startsWith("excluded")).sort((a, b) => b.announce_date.localeCompare(a.announce_date) || b.log_id.localeCompare(a.log_id));
}

export function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}
export function fmtMonthYear(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}
export function fmtPrice(n: number | null): string {
  if (n === null) return "Unpriced";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2).replace(/\.?0+$/, "")}B`;
  if (n >= 1e6) return `$${Math.round(n / 1e6).toLocaleString("en-US")}M`;
  return `$${n.toLocaleString("en-US")}`;
}
/** Overall grade label, "X.X of 5" (Hal, 2026-10-25). */
export function fmtOverall(g: GradeResult): string {
  return g.overall === null ? RUBRIC.missing_factor_rule.insufficient_label : `${g.overall.toFixed(1)} of ${RUBRIC.scale.max}`;
}
export function salePrice(s: Sale): string {
  return s.price === null && s.price_display ? s.price_display : fmtPrice(s.price);
}
export function fmtPerKey(n: number | null): string {
  if (n === null) return "Not disclosed";
  return n >= 1e6 ? `$${(n / 1e6).toFixed(2)}M per key` : `$${Math.round(n / 1000).toLocaleString("en-US")}k per key`;
}
/** Key count for running text: "520 keys", or "Keys not disclosed". */
export const fmtKeys = (n: number | null) => (n === null ? "Keys not disclosed" : `${n.toLocaleString("en-US")} keys`);
/** Card-style "City, ST" for display only; the append-only deal log keeps its recorded market text. */
const STATE_FOR_CITY: Record<string, string> = { Orlando: "FL", Scottsdale: "AZ", "Las Vegas": "NV", Philadelphia: "PA" };
export function displayMarket(m: string): string {
  if (/,\s*[A-Z]{2}\b/.test(m)) return m;
  const st = STATE_FOR_CITY[m.trim()];
  return st ? `${m.trim()}, ${st}` : m;
}
/** Status text. A close with no company-confirmed date says who reported it and when. */
export function closeLabel(s: Sale): string {
  if (s.status !== "closed") return statusLabel(s.status);
  if (s.closed_on) return `Closed ${fmtDate(s.closed_on)}`;
  if (s.close_report?.date) return `Closed (reported by press, ${fmtDate(s.close_report.date)})`;
  return "Close reported by press, not company-confirmed";
}
export const basisLabel = (b: string) =>
  b === "reit" ? "REIT" : b === "100m+" || b.startsWith("included") ? "$100M+" : b === "both" ? "Both" : b;
export const statusLabel = (s: Sale["status"]) => (s === "closed" ? "Closed" : s === "terminated" ? "Terminated" : "Announced");

/** Anniversary horizons, derived from the announcement date (never data). */
export function horizons(announced: string): { horizon: "T+1" | "T+2"; lands: string }[] {
  const [y, m, d] = announced.split("-");
  return [
    { horizon: "T+1", lands: `${Number(y) + 1}-${m}-${d}` },
    { horizon: "T+2", lands: `${Number(y) + 2}-${m}-${d}` },
  ];
}

export function factorMeta(id: string) {
  return RUBRIC.factors.find((f) => f.id === id)!;
}
export type { FactorResult, GradeResult };
