import data from "@/data/market-history/qcew-accommodation.json";

export type HistoryRow = { year: number; employment: number; wagesUsd: number; establishments: number; sourceUrl: string };
export type MarketHistory = { industry: string; area: string; rows: HistoryRow[] };

export const HISTORY_META = {
  metric: data.metric,
  publisher: data.publisher,
  accessed: data.accessed,
  note: data.note,
};

const MARKETS = data.markets as Record<string, MarketHistory>;

/** Annual lodging-employment history for a market (BLS QCEW, free public data), oldest first. */
export function marketHistory(slug: string): MarketHistory | null {
  const m = MARKETS[slug];
  return m && m.rows.length ? m : null;
}

export function historySlugs(): string[] {
  return Object.keys(MARKETS);
}
