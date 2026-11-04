import data from "@/data/market-history/bts-airport-passengers.json";

export type AirportSeries = { airports: { code: string; name: string }[]; note: string | null; months: [number, number, number][] };
export const PAX_META = { metric: data.metric, publisher: data.publisher, sourceUrl: data.sourceUrl, accessed: data.accessed, lag: data.lag };
const MARKETS = data.markets as unknown as Record<string, AirportSeries>;

export function airportSeries(slug: string): AirportSeries | null {
  const m = MARKETS[slug];
  return m && m.months.length ? m : null;
}

/** Latest month, its passengers and YoY vs the same month a year earlier. */
export function latestPax(s: AirportSeries) {
  const [y, mo, v] = s.months[s.months.length - 1];
  const prev = s.months.find((r) => r[0] === y - 1 && r[1] === mo);
  return { year: y, month: mo, value: v, yoy: prev && prev[2] ? (v - prev[2]) / prev[2] : null };
}

/** Calendar-year totals for complete years only. */
export function annualPax(s: AirportSeries): { year: number; value: number }[] {
  const by = new Map<number, { n: number; v: number }>();
  for (const [y, , v] of s.months) { const e = by.get(y) ?? { n: 0, v: 0 }; e.n++; e.v += v; by.set(y, e); }
  return [...by].filter(([, e]) => e.n === 12).map(([year, e]) => ({ year, value: e.v }));
}
