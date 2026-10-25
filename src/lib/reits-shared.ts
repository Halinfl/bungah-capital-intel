/** REITs section: types and display helpers. No data imports, so client components can use it. */

export type PeerGroup = "luxury" | "select" | "other";

export const PEER_GROUPS: { key: PeerGroup; label: string; short: string }[] = [
  { key: "luxury", label: "Luxury & upper-upscale", short: "Luxury & upper-upscale" },
  { key: "select", label: "Select-service", short: "Select-service" },
  { key: "other", label: "Other", short: "Other" },
];

/** Peer groups as approved for the section. RHP is a group-resort owner; AHT is under distress. */
export const PEER_OF: Record<string, PeerGroup> = {
  HST: "luxury",
  PK: "luxury",
  PEB: "luxury",
  DRH: "luxury",
  SHO: "luxury",
  XHR: "luxury",
  BHR: "luxury",
  APLE: "select",
  INN: "select",
  CLDT: "select",
  RHP: "other",
  RLJ: "other",
  AHT: "other",
};

export const PEER_NOTE: Record<string, string> = {
  RHP: "Other: group-oriented convention resorts",
  RLJ: "Other",
  AHT: "Other",
};

export function peerLabel(ticker: string): string {
  if (PEER_NOTE[ticker]) return PEER_NOTE[ticker];
  const g = PEER_OF[ticker];
  return PEER_GROUPS.find((p) => p.key === g)?.label ?? "";
}

export const INDEPENDENCE_LINE = "Independent research; not affiliated with or endorsed by any REIT.";

/** A reported value with the filing it came from. */
export type Cited = {
  value: number;
  /** Direct link to the filing document (or its EDGAR index). */
  url: string;
  /** e.g. "8-K EX-99.1, filed Jul 30, 2026" */
  source: string;
};

export type QuarterRow = {
  quarter: string; // "2026Q2"
  adr: Cited | null;
  revpar: Cited | null;
  occupancy: Cited | null;
};

export type Property = {
  name: string;
  city: string | null;
  state: string | null;
  rooms: number | null;
  url: string | null;
  source: string | null;
};

export type NextCall = {
  /** "call": a conference call is announced; "release": only a results-release date is announced. */
  kind: "call" | "release";
  date: string; // ISO yyyy-mm-dd
  estimated: boolean;
  time: string | null;
  url: string | null;
  source: string | null;
  releaseDate: string | null;
  releaseTiming: string | null;
};

export type GuidanceItem = { metric: string; label: string; low: number | null; high: number | null; units: string; change?: "raised" | "lowered" | "maintained" };
export type Guidance = { date: string; period: string; url: string; source: string; items: GuidanceItem[] };
export type Debt = { asOf: string; url: string; source: string; items: { label: string; value: number | null }[] };
export type Buyback = { label: string; value: number; url: string; source: string };

export type MarketGroup = {
  /** Site market slug when the hotels sit in a market the site covers, else null. */
  slug: string | null;
  label: string;
  properties: Property[];
};

export type Transaction = {
  /** "yyyy-mm-dd" or "yyyy-mm" when the filing gives only the month. */
  date: string;
  kind: "acquisition" | "disposition";
  pending?: boolean;
  hotel: string;
  city: string | null;
  state: string | null;
  counterparty: string | null;
  priceUsdM: number | null;
  rooms: number | null;
  url: string;
  source: string;
};

export type EarningsRelease = {
  quarter: string;
  filingDate: string;
  url: string;
  source: string;
  callDate: string | null;
  eventUrl: string | null;
};

export type Reit = {
  ticker: string;
  name: string;
  peer: PeerGroup;
  latestQuarter: string | null;
  latest: {
    revpar: Cited | null;
    adr: Cited | null;
    occupancy: Cited | null;
    hotels: Cited | null;
    rooms: Cited | null;
  };
  quarters: QuarterRow[];
  properties: Property[];
  markets: MarketGroup[];
  dividends: (Cited & { quarter: string })[];
  transactions: Transaction[];
  guidance: Guidance[];
  debt: Debt | null;
  buybacks: Buyback[];
  releases: EarningsRelease[];
  nextCall: NextCall | null;
};

/** Source label for SourceChip: text, then the URL (rendered as a link). */
export function chipLabel(c: { source: string; url: string }): string {
  return `${c.source} ${c.url}`;
}

/* ---------- display helpers ---------- */

export function fmtMoney(v: number | null | undefined, digits = 0): string {
  if (v == null) return "—";
  return `$${v.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

export function fmtPct(v: number | null | undefined): string {
  if (v == null) return "—";
  return `${v.toFixed(1)}%`;
}

export function fmtInt(v: number | null | undefined): string {
  if (v == null) return "—";
  return Math.round(v).toLocaleString("en-US");
}

/** "2026Q2" → "Q2 2026" */
export function fmtQuarter(q: string | null): string {
  if (!q) return "—";
  const m = /^(\d{4})Q([1-4])$/.exec(q);
  return m ? `Q${m[2]} ${m[1]}` : q;
}

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** "2024-04" → "Apr 2024"; full dates as fmtDate with year, no weekday. */
export function fmtDay(iso: string): string {
  const p = iso.split("-");
  if (p.length === 2) return `${MON[Number(p[1]) - 1]} ${p[0]}`;
  return fmtDate(iso, { year: true, dow: false });
}

/** Guidance range: "2.0% to 3.5%", "$1,615M to $1,675M", "$1.90 to $1.98". */
export function fmtRange(i: { low: number | null; high: number | null; units: string }): string {
  const f = (v: number | null) =>
    v == null
      ? "—"
      : i.units === "percent"
        ? `${v > 0 ? "+" : ""}${v.toFixed(1)}%`
        : i.units === "USD millions"
          ? `$${Math.round(v).toLocaleString("en-US")}M`
          : `$${v.toFixed(2)}`;
  if (i.low != null && i.high != null && i.low === i.high) return f(i.low);
  return `${f(i.low)} to ${f(i.high)}`;
}

/** "2026-11-05" → "Thu, Nov 5" (UTC-safe: parsed as a calendar date). */
export function fmtDate(iso: string, { year = false, dow = true }: { year?: boolean; dow?: boolean } = {}): string {
  const [y, m, d] = iso.split("-").map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${dow ? `${DOW[wd]}, ` : ""}${MON[m - 1]} ${d}${year ? `, ${y}` : ""}`;
}

/** The subset of a REIT the index and board send to the browser. */
export type ReitSummary = Pick<Reit, "ticker" | "name" | "peer" | "latestQuarter" | "latest"> & {
  hotelsListed: number;
  siteMarkets: number;
  marketLabels: string[];
  quartersReported: number;
};

export function summarize(r: Reit): ReitSummary {
  return {
    ticker: r.ticker,
    name: r.name,
    peer: r.peer,
    latestQuarter: r.latestQuarter,
    latest: r.latest,
    hotelsListed: r.properties.length,
    siteMarkets: r.markets.filter((m) => m.slug).length,
    marketLabels: r.markets.filter((m) => m.slug).map((m) => m.label),
    quartersReported: r.quarters.length,
  };
}
