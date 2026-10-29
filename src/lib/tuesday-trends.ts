/**
 * Tuesday Trends: weekly indicative hotel-rate board, read from static JSON committed in
 * src/data/tuesday-trends (no database reads or writes).
 *
 * Only the fields the UI shows are exported to client components. Method v2 (Oct 21, 2026): refundable
 * includes room-level refundable rates; low-confidence rows are left out of medians; "sold out" is
 * "no rates on Google". The tax-inclusive median is not passed through (see taxInclusive).
 * From Oct 27, 2026 each cell carries week-over-week matched-pair changes vs the previous Tuesday.
 *
 * Issues: every summary-YYYY-MM-DD*.json in src/data/tuesday-trends is one issue (indexed at build time by
 * scripts/tuesday-trends/build-index.mjs into issues.generated.ts). The newest issue is "latest": it drives
 * /tuesday-trends, the home card, market pages and Radars. Each issue also has a dated page /tuesday-trends/<date>.
 */
import { TT_ISSUE_FILES, TT_LIST_FILES } from "@/data/tuesday-trends/issues.generated";
import ttOwners from "@/data/reits/tt-owner-badges.json";
import { HORIZONS, STAYS, type Horizon, type Stay, type TTCell, type TTMarket, type TTMove } from "@/lib/tuesday-trends-shared";
export * from "@/lib/tuesday-trends-shared";

/** Tuesday Trends market key → site market slug (/markets/<slug>). */
const SITE_SLUG: Record<string, string> = {
  "new-york": "new-york-city",
  "san-francisco": "san-francisco-bay",
};

/* ---------- raw JSON shapes (only the fields read here; older captures lack the week-over-week fields) ---------- */
type RawCell = {
  market: string;
  horizon: string;
  stay_type: string;
  check_in: string;
  check_out: string;
  prev_check_in?: string;
  prev_check_out?: string;
  nights: number;
  median_cheapest_refundable_pretax: number | null;
  n_refundable: number;
  median_headline_pretax: number | null;
  n_used_in_medians: number;
  n_low_confidence_excluded: number;
  n_no_rates_signal: number;
  n_no_rates_not_on_google: number;
  no_rates_dot: boolean;
  no_rates_structural: boolean;
  wow_matched_pair_pct?: number | null;
  wow_n_pairs?: number;
  wow_headline_pct?: number | null;
  wow_headline_n_pairs?: number;
  n_incl_taxes_fees: number;
  median_incl_taxes_fees: number | null;
};
type RawMove = {
  market: string;
  horizon: string;
  stay: string;
  pct: number;
  n_pairs: number;
  pair_median_prev: number;
  pair_median_now: number;
  check_in: string;
  check_out: string;
};
type RawSummary = {
  capture_date: string;
  list_version: string;
  capture_batches?: Record<string, { capture_ts_min_utc?: string; capture_ts_max_utc?: string }>;
  not_on_google_hotels: { market: string; hotel_name: string }[];
  wow: { value: string | null; baseline_capture_date?: string; moves?: RawMove[]; holidays?: string[] };
  cells: RawCell[];
};
type RawList = { market: string; market_name: string; hotels: { hotel_id: string; name: string; rank: number }[] };

/* ---------- labels ---------- */
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** "2026-10-27" → "Tue, Oct 27, 2026". */
export function ttDateLabel(d: string): string {
  const t = new Date(`${d}T12:00:00Z`);
  return `${WD[t.getUTCDay()]}, ${MON[t.getUTCMonth()]} ${t.getUTCDate()}, ${t.getUTCFullYear()}`;
}
/** "2026-10-27" → "Oct 27". */
export function ttShortDate(d: string): string {
  const [, m, day] = d.split("-").map(Number);
  return `${MON[m - 1]} ${day}`;
}
/** "v2-2026-10-20" → "v2, effective Oct 20, 2026". */
function listLabel(v: string): string {
  const m = v.match(/^(v\d+)-(\d{4}-\d{2}-\d{2})$/);
  return m ? `${m[1]}, effective ${ttShortDate(m[2])}, ${m[2].slice(0, 4)}` : v;
}

/** Capture-time windows checked by hand (API result timestamps incl. retries). Other issues use capture_batches. */
const CAPTURE_TIME_OVERRIDE: Record<string, string> = { "2026-10-27": "7:08–7:20 PM ET" };
function etTime(utc: string): string {
  const d = new Date(utc.replace(" +00:00", "Z").replace(" ", "T"));
  return d.toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit" });
}
function captureTimeLabel(s: RawSummary): string {
  if (CAPTURE_TIME_OVERRIDE[s.capture_date]) return CAPTURE_TIME_OVERRIDE[s.capture_date];
  const b = Object.values(s.capture_batches ?? {});
  const mins = b.map((x) => x.capture_ts_min_utc).filter(Boolean).sort() as string[];
  const maxs = b.map((x) => x.capture_ts_max_utc).filter(Boolean).sort() as string[];
  if (!mins.length || !maxs.length) return "";
  return `${etTime(mins[0])}–${etTime(maxs[maxs.length - 1])} ET`;
}

/* ---------- one issue ---------- */
export type TTIssue = {
  date: string;
  /** "Tue, Oct 27, 2026" */
  capturedLabel: string;
  captureTimeLabel: string;
  /** Capture the week-over-week changes compare against ("Tue, Oct 20, 2026"), or "" when there is none. */
  prevCapturedLabel: string;
  prevDate: string;
  listLabel: string;
  hasWow: boolean;
  taxInclusive: boolean;
  moves: () => TTMove[];
  markets: () => TTMarket[];
  notOnGoogle: () => { market: string; hotel: string }[];
  stays: () => { horizon: Horizon; stay: Stay; checkIn: string; checkOut: string; nights: number }[];
  hotelLists: () => { key: string; name: string; hotels: string[] }[];
  hotelOwners: () => Record<string, Record<string, string>>;
  holidayNote: () => string;
};

/** A cell's tax-inclusive median is usable when 15+ hotels and at least 9 in 10 of the hotels in its median have one. */
function taxOk(c: RawCell): boolean {
  return c.n_incl_taxes_fees >= 15 && c.n_incl_taxes_fees >= 0.9 * c.n_used_in_medians;
}

/**
 * REIT owner of a listed hotel, where the hotel's name and city match a REIT property schedule
 * in SEC filings with high confidence. Display only: lists, medians and coverage are unchanged.
 */
const OWNERS = ttOwners as unknown as Record<string, Record<string, { ticker: string }>>;

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

function buildIssue(summary: RawSummary): TTIssue {
  const LISTS = (TT_LIST_FILES[summary.list_version] ?? []) as RawList[];
  const nameByKey = new Map(LISTS.map((l) => [l.market, l.market_name]));
  const hasWow = summary.wow?.value != null;
  /**
   * Tax-inclusive figures are shown only when this week's HTML pass covered at least 9 in 10 of the priced hotels used in
   * medians overall (Oct 27, 2026: 7,803 of 7,803). Otherwise they are marked unavailable for the week.
   */
  const TAX_N = summary.cells.reduce((a, c) => a + (c.n_incl_taxes_fees ?? 0), 0);
  const USED_N = summary.cells.reduce((a, c) => a + c.n_used_in_medians, 0);
  const taxInclusive = USED_N > 0 && TAX_N >= 0.9 * USED_N;

  const toCell = (c: RawCell): TTCell => ({
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
    wow: hasWow ? c.wow_matched_pair_pct ?? null : null,
    wowPairs: hasWow ? c.wow_n_pairs ?? 0 : 0,
    wowLowest: hasWow ? c.wow_headline_pct ?? null : null,
    wowLowestPairs: hasWow ? c.wow_headline_n_pairs ?? 0 : 0,
    inclTax: taxInclusive && taxOk(c) ? c.median_incl_taxes_fees ?? null : null,
  });

  const prevDate = hasWow ? summary.wow.baseline_capture_date ?? "" : "";

  return {
    date: summary.capture_date,
    capturedLabel: ttDateLabel(summary.capture_date),
    captureTimeLabel: captureTimeLabel(summary),
    prevCapturedLabel: prevDate ? ttDateLabel(prevDate) : "",
    prevDate,
    listLabel: listLabel(summary.list_version),
    hasWow,
    taxInclusive,

    /** Up to 3 of this week's biggest matched-pair moves (one per market); empty until real moves exist. */
    moves: () =>
      !hasWow
        ? []
        : (summary.wow.moves ?? []).map((m) => ({
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
          })),

    markets: () => {
      const byKey = new Map<string, TTCell[]>();
      for (const c of summary.cells) {
        const arr = byKey.get(c.market) ?? [];
        arr.push(toCell(c));
        byKey.set(c.market, arr);
      }
      return [...byKey.entries()]
        .map(([key, cells]) => ({ key, slug: SITE_SLUG[key] ?? key, name: nameByKey.get(key) ?? key, cells }))
        .sort((a, b) => a.name.localeCompare(b.name));
    },

    /** Hotels with no priced cell anywhere in this capture (listed on the methodology page only). */
    notOnGoogle: () =>
      summary.not_on_google_hotels
        .map((h) => ({ market: nameByKey.get(h.market) ?? h.market, hotel: h.hotel_name }))
        .sort((a, b) => a.market.localeCompare(b.market)),

    /** Stay dates per horizon (identical across markets). */
    stays: () => {
      const seen = new Map<string, TTCell>();
      for (const c of summary.cells) {
        const k = `${c.horizon}|${c.stay_type}`;
        if (!seen.has(k)) seen.set(k, toCell(c));
      }
      return [...seen.values()];
    },

    hotelLists: () =>
      LISTS.map((l) => ({
        key: l.market,
        name: l.market_name,
        hotels: [...l.hotels].sort((a, b) => a.rank - b.rank).map((h) => h.name),
      })).sort((a, b) => a.name.localeCompare(b.name)),

    hotelOwners: () => {
      const out: Record<string, Record<string, string>> = {};
      for (const l of LISTS) {
        const m = OWNERS[l.market] ?? {};
        out[l.market] = {};
        for (const h of l.hotels) if (m[h.hotel_id]) out[l.market][h.name] = m[h.hotel_id].ticker;
      }
      return out;
    },

    /**
     * One sentence naming holidays inside this week's or last week's stays (stay dates move forward a week each Tuesday, so a
     * horizon that moves onto or off a holiday changes for that reason). Empty when none.
     */
    holidayNote: () => {
      if (!hasWow) return "";
      const hol: string[] = summary.wow.holidays ?? [];
      const hits = new Map<string, { side: "this" | "last"; labels: string[] }>();
      const seen = new Set<string>();
      for (const c of summary.cells) {
        const k = `${c.horizon}|${c.stay_type}`;
        if (seen.has(k)) continue;
        seen.add(k);
        const sides: ["this" | "last", string, string][] = [["this", c.check_in, c.check_out]];
        if (c.prev_check_in && c.prev_check_out) sides.push(["last", c.prev_check_in, c.prev_check_out]);
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
    },
  };
}

/* ---------- all issues, newest first ---------- */
const ISSUES: TTIssue[] = TT_ISSUE_FILES.map((f) => buildIssue(f.summary as RawSummary));
const LATEST: TTIssue | null = ISSUES[0] ?? null;

/** Every published issue, newest first. */
export function ttIssues(): TTIssue[] {
  return ISSUES;
}
/** One issue by capture date ("2026-10-20"), or null. */
export function ttIssue(date: string): TTIssue | null {
  return ISSUES.find((i) => i.date === date) ?? null;
}
export function ttLatest(): TTIssue | null {
  return LATEST;
}

/* ---------- latest issue (the board, home, market pages, Radars) ---------- */
export const TT_CAPTURE_DATE = LATEST?.date ?? ""; // "2026-10-27"
export const TT_CAPTURED_LABEL = LATEST?.capturedLabel ?? "";
export const TT_CAPTURE_TIME_LABEL = LATEST?.captureTimeLabel ?? "";
/** The capture the week-over-week changes compare against. */
export const TT_PREV_CAPTURED_LABEL = LATEST?.prevCapturedLabel ?? "";
export const TT_LIST_LABEL = LATEST?.listLabel ?? "";
/** Week-over-week figures exist (second capture onward, same method and list version). */
export const TT_HAS_WOW = LATEST?.hasWow ?? false;
export const TT_TAX_INCLUSIVE = LATEST?.taxInclusive ?? false;

export const ttMoves = (): TTMove[] => LATEST?.moves() ?? [];
export const ttMarkets = (): TTMarket[] => LATEST?.markets() ?? [];
export const ttNotOnGoogle = () => LATEST?.notOnGoogle() ?? [];
export const ttMarketBySiteSlug = (slug: string): TTMarket | null => ttMarkets().find((m) => m.slug === slug) ?? null;
export const ttStays = () => LATEST?.stays() ?? [];
export const ttHotelLists = () => LATEST?.hotelLists() ?? [];
export const ttHotelOwners = () => LATEST?.hotelOwners() ?? {};
export const ttHolidayNote = () => LATEST?.holidayNote() ?? "";
