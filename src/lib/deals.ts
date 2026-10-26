import rubricJson from "@/data/deals/rubric-v1.json";
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
  price_qualifier?: string;
  price_per_key: number | null;
  keys: number | null;
  keys_detail?: string;
  announced_on: string;
  closed_on: string | null;
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

export const RUBRIC = rubricJson as unknown as Rubric;
export const DISCLAIMER = RUBRIC.disclaimer;
const SALES = salesJson as Sale[];
const GRADES = gradesJson as unknown as GradeResult[];
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
/** Every qualifying deal seen (append-only log), newest announcement first. */
export function dealLog(): LogRow[] {
  return [...(logJson as unknown as LogRow[])].sort((a, b) => b.announce_date.localeCompare(a.announce_date) || b.log_id.localeCompare(a.log_id));
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
export function fmtPerKey(n: number | null): string {
  if (n === null) return "n/d";
  return n >= 1e6 ? `$${(n / 1e6).toFixed(2)}M/key` : `$${Math.round(n / 1000).toLocaleString("en-US")}k/key`;
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
