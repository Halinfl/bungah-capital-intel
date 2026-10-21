/**
 * Tuesday Trends: weekly indicative hotel-rate board, read from static JSON committed in
 * src/data/tuesday-trends (no database reads or writes).
 *
 * Only the fields the UI shows are exported to client components. Method v2 (Oct 21, 2026): refundable
 * includes room-level refundable rates; low-confidence rows are left out of medians; "sold out" is
 * "no rates on Google". The tax-inclusive median is unavailable for Oct 20 and is never passed through.
 */
import summary from "@/data/tuesday-trends/summary-2026-10-20-v2final-r3-method2.json";
import atlanta from "@/data/tuesday-trends/lists/v2-2026-10-20/atlanta.json";
import boston from "@/data/tuesday-trends/lists/v2-2026-10-20/boston.json";
import chicago from "@/data/tuesday-trends/lists/v2-2026-10-20/chicago.json";
import dallas from "@/data/tuesday-trends/lists/v2-2026-10-20/dallas.json";
import honolulu from "@/data/tuesday-trends/lists/v2-2026-10-20/honolulu.json";
import houston from "@/data/tuesday-trends/lists/v2-2026-10-20/houston.json";
import lasVegas from "@/data/tuesday-trends/lists/v2-2026-10-20/las-vegas.json";
import losAngeles from "@/data/tuesday-trends/lists/v2-2026-10-20/los-angeles.json";
import miami from "@/data/tuesday-trends/lists/v2-2026-10-20/miami.json";
import nashville from "@/data/tuesday-trends/lists/v2-2026-10-20/nashville.json";
import newYork from "@/data/tuesday-trends/lists/v2-2026-10-20/new-york.json";
import orlando from "@/data/tuesday-trends/lists/v2-2026-10-20/orlando.json";
import phoenix from "@/data/tuesday-trends/lists/v2-2026-10-20/phoenix.json";
import sanDiego from "@/data/tuesday-trends/lists/v2-2026-10-20/san-diego.json";
import sanFrancisco from "@/data/tuesday-trends/lists/v2-2026-10-20/san-francisco.json";
import seattle from "@/data/tuesday-trends/lists/v2-2026-10-20/seattle.json";
import washingtonDc from "@/data/tuesday-trends/lists/v2-2026-10-20/washington-dc.json";

import type { Horizon, Stay, TTCell, TTMarket } from "@/lib/tuesday-trends-shared";
export * from "@/lib/tuesday-trends-shared";

/** Tuesday Trends market key → site market slug (/markets/<slug>). */
const SITE_SLUG: Record<string, string> = {
  "new-york": "new-york-city",
  "san-francisco": "san-francisco-bay",
};

const LISTS = [
  atlanta, boston, chicago, dallas, honolulu, houston, lasVegas, losAngeles, miami, nashville,
  newYork, orlando, phoenix, sanDiego, sanFrancisco, seattle, washingtonDc,
];

type RawCell = (typeof summary.cells)[number];

function toCell(c: RawCell): TTCell {
  return {
    horizon: c.horizon as Horizon,
    stay: c.stay_type as Stay,
    checkIn: c.check_in,
    checkOut: c.check_out,
    nights: c.nights,
    refundable: c.median_cheapest_refundable_pretax ?? null,
    nRefundable: c.n_refundable,
    lowest: c.median_headline_pretax ?? null,
    nUsed: c.n_used_in_medians,
    nLowConfidence: c.n_low_confidence_excluded,
    nNoRates: c.n_no_rates_signal,
    nNotOnGoogle: c.n_no_rates_not_on_google,
    noRatesDot: c.no_rates_dot && !c.no_rates_structural,
  };
}

const nameByKey = new Map(LISTS.map((l) => [l.market, l.market_name]));

export const TT_CAPTURE_DATE = summary.capture_date; // "2026-10-20"
/** First capture: no prior week to compare, so no week-over-week figures anywhere. */
export const TT_HAS_WOW = summary.wow.value != null;

export function ttMarkets(): TTMarket[] {
  const byKey = new Map<string, TTCell[]>();
  for (const c of summary.cells) {
    const arr = byKey.get(c.market) ?? [];
    arr.push(toCell(c));
    byKey.set(c.market, arr);
  }
  return [...byKey.entries()]
    .map(([key, cells]) => ({
      key,
      slug: SITE_SLUG[key] ?? key,
      name: nameByKey.get(key) ?? key,
      cells,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Hotels with no priced cell anywhere in this capture (listed on the methodology page only). */
export function ttNotOnGoogle(): { market: string; hotel: string }[] {
  return summary.not_on_google_hotels
    .map((h) => ({ market: nameByKey.get(h.market) ?? h.market, hotel: h.hotel_name }))
    .sort((a, b) => a.market.localeCompare(b.market));
}

export function ttMarketBySiteSlug(slug: string): TTMarket | null {
  return ttMarkets().find((m) => m.slug === slug) ?? null;
}

/** Stay dates per horizon (identical across markets). */
export function ttStays(): { horizon: Horizon; stay: Stay; checkIn: string; checkOut: string; nights: number }[] {
  const seen = new Map<string, TTCell>();
  for (const c of summary.cells) {
    const k = `${c.horizon}|${c.stay_type}`;
    if (!seen.has(k)) seen.set(k, toCell(c));
  }
  return [...seen.values()];
}

export function ttHotelLists(): { key: string; name: string; hotels: string[] }[] {
  return LISTS.map((l) => ({
    key: l.market,
    name: l.market_name,
    hotels: [...l.hotels].sort((a, b) => a.rank - b.rank).map((h) => h.name),
  })).sort((a, b) => a.name.localeCompare(b.name));
}

