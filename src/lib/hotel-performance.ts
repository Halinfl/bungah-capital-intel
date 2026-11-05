import data from "@/data/market-history/hotel-performance.json";

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

const MARKETS = data.markets as Record<string, HotelPerf>;

/** Cited hotel occupancy / ADR / RevPAR for a market (free public sources), headline row first. */
export function hotelPerf(slug: string): HotelPerf | null {
  const m = MARKETS[slug];
  return m && m.rows.length ? m : null;
}

export function hotelPerfSlugs(): string[] {
  return Object.keys(MARKETS);
}

/** Headline row for the /markets card: latest full year when published, else the first row. */
export function headlinePerf(slug: string): (HotelPerfRow & { area: string }) | null {
  const m = hotelPerf(slug);
  return m ? { ...m.rows[0], area: m.area } : null;
}
