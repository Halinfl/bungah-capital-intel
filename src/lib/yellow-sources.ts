/**
 * Yellow sources: not shown as raw licensed figures. Harvey's supply tiers: green = public counts;
 * yellow = STR/CoStar (or a republication of them) with no license notice — score bucket only; red = skip.
 *
 * Confirmed republications of STR or CoStar hotel-performance figures (OCC / ADR / RevPAR):
 * - roadgenius.com: Nashville county OCC/ADR also attributed to STR via the Nashville CVB.
 * - miamibusiness.com: the Aug 2026 Miami-Dade occupancy print is attributed on the page to
 *   "STR data reported through the Greater Miami Convention & Visitors Bureau" (GMCVB).
 * - miamiandbeaches.com / GMCVB industry updates and State of the Industry decks republish STR hotel metrics.
 * - lodgingmagazine.com: the CoStar weekly hotel-performance reprints (e.g. week of Aug 2–8).
 * - matthews.com: DFW hospitality "By the Numbers" (OCC / ADR / RevPAR) is labeled "Source: CoStar Group, Inc."
 * - kidder.com: Seattle hotel-market PDFs list "Data Sources: STR, CoStar, and Kidder Mathews Valuation."
 * - hvs.com / hvi.hvs.com: the World Cup market analysis relies on "CoStar data" for OCC / ADR / RevPAR.
 * - marcusmillichap.com: hospitality market reports cite "CoStar Group, Inc." among sources.
 * - wronkaltd.com: the Boston hospitality market PDF is a CoStar Group extract ("Licensed to Wronka").
 * - Newmark (nmrk.imgix.net): Hotel-Nsights charts labeled "Source: CoSTAR."
 * - sccai.org: the Inland Empire Hotel-Motel Market Overview reprints STR RevPAR and supply-pipeline figures.
 * - Hawaii DBEDT hotel-performance PDFs: "Source: STR, Inc."
 * Raw OCC/ADR/RevPAR from these hosts is reduced to a qualitative bucket. Other text is left alone.
 */
import { isLicensedAttributionUrl } from "./licensed-attribution";

export const YELLOW_HOSTS = [
  "roadgenius.com",
  "miamibusiness.com",
  "miamiandbeaches.com",
  "lodgingmagazine.com",
  "matthews.com",
  "kidder.com",
  "hvs.com",
  "marcusmillichap.com",
  "wronkaltd.com",
  "nmrk.imgix.net",
  "sccai.org",
];

/** Path-specific reprints whose host also publishes unrelated public documents (tax, etc.). */
export const YELLOW_URL_RE = [
  /files\.hawaii\.gov\/dbedt\/economic\/tourism\/hotel-performance/i,
];

/** Labels that mark the same reprint sources even when the URL is missing from the row. */
export const YELLOW_LABELS = [
  "miami business",
  "gmcvb",
  "greater miami convention",
  "lodging magazine",
  "matthews",
  "kidder mathews",
  "hvs",
  "marcus millichap",
  "marcus & millichap",
  "wronka",
  "newmark",
  "sccai",
];

export function isYellowSource(label?: string | null, urls?: unknown): boolean {
  const blob = `${label ?? ""} ${typeof urls === "string" ? urls : JSON.stringify(urls ?? "")}`.toLowerCase();
  if (YELLOW_HOSTS.some((h) => blob.includes(h))) return true;
  if (YELLOW_LABELS.some((s) => blob.includes(s))) return true;
  if (YELLOW_URL_RE.some((re) => re.test(blob))) return true;
  // A cited page whose own text credits STR / CoStar / Kalibri / HotStats is yellow for OCC / ADR / RevPAR.
  // Lodging Econometrics is licensed-stripped (counts are not quoted), not yellow-bucketed.
  const links = Array.isArray(urls) ? urls : [];
  for (const l of links) {
    const url = typeof l === "string" ? l : l && typeof l === "object" ? (l as { url?: string }).url : undefined;
    if (url && isLicensedAttributionUrl(url) && !/lodgingeconometrics\.com/i.test(url)) return true;
  }
  if (typeof urls === "string" && isLicensedAttributionUrl(urls) && !/lodgingeconometrics\.com/i.test(urls)) return true;
  return false;
}

const PERF = /\b(occupancy|occ(?:%|\b)|adr|revpar|average daily(?: rate)?|room demand|room revenue)\b/i;
const RAW = /\d{1,3}(?:\.\d+)?%|\$\d{1,3}(?:,\d{3})*(?:\.\d+)?/;

export function yellowBucketText(asOf?: string | null): string {
  const dated = (asOf ?? "").trim();
  return (
    "Hotel performance is in a qualitative band only; this source republishes STR-derived occupancy and ADR, so raw figures are not shown." +
    (dated ? ` (as-of ${dated})` : "")
  );
}

type Row = {
  title?: string | null;
  body?: string | null;
  sourceLabel?: string | null;
  sourceUrls?: unknown;
  magnitude?: string | null;
  asOf?: string | null;
};

/** Replace raw OCC/ADR/RevPAR (and similar) on a yellow row with a derived bucket. Other yellow text is left alone. */
export function withYellowBuckets<T extends Row>(rows: T[]): T[] {
  return rows.map((r) => {
    if (!isYellowSource(r.sourceLabel, r.sourceUrls)) return r;
    const text = `${r.title ?? ""} ${r.body ?? ""} ${r.magnitude ?? ""}`;
    if (!PERF.test(text) && !RAW.test(text)) return r;
    return {
      ...r,
      title: /occ|adr|revpar|occupancy/i.test(r.title ?? "") ? "Hotel performance (qualitative band only)" : r.title,
      body: yellowBucketText(r.asOf ?? null),
      magnitude: "bucket: moderate band",
    };
  });
}

const IMPLIED_ROOMS = /Implied rooms\s*\(\s*STR market\s*\)/i;

function labelParts(label: string): string[] {
  return label.split(/\s+·\s+/).map((p) => p.trim()).filter(Boolean);
}

/** Drop yellow broker names from a compound source label so they never appear on a public source list. */
export function stripYellowLabelParts(label?: string | null): string {
  if (!label) return "";
  const kept = labelParts(label).filter((p) => !isYellowSource(p, p));
  return kept.join(" · ");
}

function isYellowLink(l: { url?: string; label?: string } | string): boolean {
  if (typeof l === "string") return isYellowSource(l, l);
  return isYellowSource(l.label, l.url ?? l.label);
}

/**
 * Remove internal "Implied rooms (STR market)" pack labels and yellow broker hosts
 * from public source lists (Marcus & Millichap, Kidder, Matthews, and the rest of the yellow list).
 */
export function withoutYellowBrokerLists<T extends Row>(rows: T[]): T[] {
  const out: T[] = [];
  for (const r of rows) {
    const title = IMPLIED_ROOMS.test(r.title ?? "") ? (r.title ?? "").replace(IMPLIED_ROOMS, "Implied rooms").trim() : (r.title ?? "");
    const items = (r.body ?? "").split(/\s+\|\s+/);
    const body = items.filter((it) => !IMPLIED_ROOMS.test(it)).join(" | ");
    const links = Array.isArray(r.sourceUrls)
      ? (r.sourceUrls as { url?: string; label?: string }[]).filter((l) => l && !IMPLIED_ROOMS.test(`${l.label ?? ""} ${l.url ?? ""}`) && !isYellowLink(l))
      : r.sourceUrls;
    const sourceLabel = stripYellowLabelParts((r.sourceLabel ?? "").replace(IMPLIED_ROOMS, "").replace(/\s{2,}/g, " ").replace(/^[·,;\s]+|[·,;\s]+$/g, ""));
    if (!body.trim() && !title.trim()) continue;
    out.push({
      ...r,
      title,
      body,
      sourceLabel,
      ...(r.sourceUrls !== undefined ? { sourceUrls: links } : {}),
    });
  }
  return out;
}
