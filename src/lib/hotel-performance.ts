import data from "@/data/market-history/hotel-performance.json";
import { isLicensedText } from "./licensed-sources";

export type HotelPerfRow = {
  period: string;
  occ: number;
  adr: number;
  /** Source RevPAR, or occupancy × ADR from this same row when revparCalc is true. Null when not shown. */
  revpar: number | null;
  revparCalc: boolean;
  source: string;
  url: string;
  note?: string;
};
export type HotelPerf = { area: string; rows: HotelPerfRow[] };

export const HOTEL_PERF_META = { metric: data.metric, accessed: data.accessed, note: data.note };

const RAW = data.markets as Record<string, HotelPerf>;
/** A row whose source credits STR or CoStar (Hal, Nov 13 2026): never shown. Display only; the JSON is unchanged. */
const licensedRow = (r: HotelPerfRow) => isLicensedText(`${r.source} ${r.note ?? ""}`) || /costar|str-benchmark/i.test(r.url);
const MARKETS: Record<string, HotelPerf> = Object.fromEntries(Object.entries(RAW).map(([k, m]) => [k, { ...m, rows: m.rows.filter((r) => !licensedRow(r)) }]));

/** Cited hotel occupancy / ADR / RevPAR for a market (free public sources), headline row first. */
export function hotelPerf(slug: string): HotelPerf | null {
  const m = MARKETS[slug];
  return m && m.rows.length ? m : null;
}

/** Hotel-performance rows on file for this market that are not shown because their source is licensed. */
export function hotelPerfLicensedHidden(slug: string): number {
  return (RAW[slug]?.rows ?? []).filter(licensedRow).length;
}

export function hotelPerfSlugs(): string[] {
  return Object.keys(MARKETS);
}

/** Headline row for the /markets card: latest full year when published, else the first row. */
export function headlinePerf(slug: string): (HotelPerfRow & { area: string }) | null {
  const m = hotelPerf(slug);
  return m ? { ...m.rows[0], area: m.area } : null;
}
