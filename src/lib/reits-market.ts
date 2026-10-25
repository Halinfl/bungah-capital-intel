/**
 * REIT-owned hotels and REIT transactions by site market, from the REIT property schedules and
 * portfolio-change disclosures in SEC filings (static JSON in src/data/reits; no database).
 */
import owners from "@/data/reits/market-owners.json";
import type { Transaction } from "@/lib/reits-shared";

export type OwnedHotel = {
  name: string;
  city: string | null;
  state: string | null;
  rooms: number | null;
  url: string;
  source: string;
  ticker: string;
  match: "city" | "name";
};

export type MarketOwners = { hotels: OwnedHotel[]; comps: (Transaction & { ticker: string })[] };

const O = owners as unknown as Record<string, MarketOwners>;

/** Null when no REIT-owned hotel or REIT transaction matches the market. */
export function marketOwners(slug: string): MarketOwners | null {
  const m = O[slug];
  if (!m || (!m.hotels.length && !m.comps.length)) return null;
  return m;
}
