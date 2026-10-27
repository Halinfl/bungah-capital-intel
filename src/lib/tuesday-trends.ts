/**
 * Tuesday Trends: weekly indicative hotel-rate board, read from static JSON committed in
 * src/data/tuesday-trends (no database reads or writes).
 *
 * Only the fields the UI shows are exported to client components. Method v2 (Oct 21, 2026): refundable
 * includes room-level refundable rates; low-confidence rows are left out of medians; "sold out" is
 * "no rates on Google". The tax-inclusive median is not passed through (see TT_TAX_INCLUSIVE).
 * From Oct 27, 2026 each cell carries week-over-week matched-pair changes vs the previous Tuesday.
 */
import summary from "@/data/tuesday-trends/summary-2026-10-27-wow.json";
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

import ttOwners from "@/data/reits/tt-owner-badges.json";
import { HORIZONS, STAYS, type Horizon, type Stay, type TTCell, type TTMarket, type TTMove } from "@/lib/tuesday-trends-shared";
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

/** A cell's tax-inclusive median is usable when 15+ hotels and at least 9 in 10 of the hotels in its median have one. */
function taxOk(c: RawCell): boolean {
  return c.n_incl_taxes_fees >= 15 && c.n_incl_taxes_fees >= 0.9 * c.n_used_in_medians;
}
/**
 * Tax-inclusive figures are shown only when this week's HTML pass covered at least 9 in 10 of the priced hotels used in
 * medians overall (Oct 27, 2026: 7,803 of 7,803). Otherwise they are marked unavailable for the week.
 */
const TAX_N = summary.cells.reduce((a, c) => a + (c.n_incl_taxes_fees ?? 0), 0);
const USED_N = summary.cells.reduce((a, c) => a + c.n_used_in_medians, 0);
export const TT_TAX_INCLUSIVE = USED_N > 0 && TAX_N >= 0.9 * USED_N;

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
    wow: c.wow_matched_pair_pct ?? null,
    wowPairs: c.wow_n_pairs ?? 0,
    wowLowest: c.wow_headline_pct ?? null,
    wowLowestPairs: c.wow_headline_n_pairs ?? 0,
    inclTax: TT_TAX_INCLUSIVE && taxOk(c) ? c.median_incl_taxes_fees ?? null : null,
  };
}

const nameByKey = new Map(LISTS.map((l) => [l.market, l.market_name]));

export const TT_CAPTURE_DATE = summary.capture_date; // "2026-10-27"
/** Week-over-week figures exist (second capture onward, same method and list version). */
export const TT_HAS_WOW = summary.wow.value != null;

/** Up to 3 of this week's biggest matched-pair moves (one per market); empty until real moves exist. */
export function ttMoves(): TTMove[] {
  if (!TT_HAS_WOW) return [];
  return (summary.wow.moves ?? []).map((m) => ({
    market: m.market,
    marketName: nameByKey.get(m.market) ?? m.market,
    slug: SITE_SLUG[m.market] ?? m.market,
    horizon: m.horizon as Horizon,
    stay: m.stay as Stay,
    pct: m.pct,
    nPairs: m.n_pairs,
    prev: m.pair_median_prev,
    now: m.pair_median_now,
    checkIn: m.check_in,
    checkOut: m.check_out,
  }));
}

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


/**
 * REIT owner of a listed hotel, where the hotel's name and city match a REIT property schedule
 * in SEC filings with high confidence. Display only: lists, medians and coverage are unchanged.
 */
const OWNERS = ttOwners as unknown as Record<string, Record<string, { ticker: string }>>;

export function ttHotelOwners(): Record<string, Record<string, string>> {
  const out: Record<string, Record<string, string>> = {};
  for (const l of LISTS) {
    const m = OWNERS[l.market] ?? {};
    out[l.market] = {};
    for (const h of l.hotels) if (m[h.hotel_id]) out[l.market][h.name] = m[h.hotel_id].ticker;
  }
  return out;
}

const HOLIDAY_NAMES: Record<string, string> = {
  "11-11": "Veterans Day",
  "11-26": "Thanksgiving",
  "11-27": "Thanksgiving",
  "12-24": "Christmas",
  "12-25": "Christmas",
  "01-01": "New Year's Day",
  "01-18": "Martin Luther King Jr. Day",
  "02-15": "Presidents' Day",
  "05-31": "Memorial Day",
  "06-18": "Juneteenth",
  "07-05": "Independence Day",
  "09-06": "Labor Day",
  "10-11": "Columbus Day",
};

function addDay(d: string): string {
  const t = new Date(`${d}T12:00:00Z`);
  t.setUTCDate(t.getUTCDate() + 1);
  return t.toISOString().slice(0, 10);
}

/**
 * One sentence naming holidays inside this week's or last week's stays (stay dates move forward a week each Tuesday, so a
 * horizon that moves onto or off a holiday changes for that reason). Empty when none.
 */
export function ttHolidayNote(): string {
  if (!TT_HAS_WOW) return "";
  const hol: string[] = (summary.wow as { holidays?: string[] }).holidays ?? [];
  const hits = new Map<string, { side: "this" | "last"; labels: string[] }>();
  const seen = new Set<string>();
  for (const c of summary.cells) {
    const k = `${c.horizon}|${c.stay_type}`;
    if (seen.has(k)) continue;
    seen.add(k);
    const sides: ["this" | "last", string, string][] = [
      ["this", c.check_in, c.check_out],
      ["last", c.prev_check_in, c.prev_check_out],
    ];
    for (const [side, ci, co] of sides) {
      const h = hol.find((d) => ci <= d && d <= addDay(co));
      if (!h) continue;
      const name = HOLIDAY_NAMES[h.slice(5)] ?? "a holiday";
      const key = `${name}|${side}`;
      const hz = HORIZONS.find((x) => x.key === c.horizon)!.label;
      const st = STAYS.find((x) => x.key === c.stay_type)!.label.toLowerCase();
      const e = hits.get(key) ?? { side, labels: [] };
      e.labels.push(`${hz} ${st}`);
      hits.set(key, e);
    }
  }
  if (!hits.size) return "";
  const parts = [...hits.entries()].map(([k, v]) => {
    const name = k.split("|")[0];
    return `${name} falls in ${v.side === "this" ? "this" : "last"} week's ${v.labels.join(" and ")} ${v.labels.length > 1 ? "stays" : "stay"}`;
  });
  return `Stay dates move forward a week each Tuesday. ${parts.join("; ")}, so changes there mostly reflect the holiday calendar.`;
}
