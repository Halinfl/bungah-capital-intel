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
 * Raw OCC/ADR/RevPAR from these hosts is reduced to a qualitative bucket. Other text is left alone.
 */
export const YELLOW_HOSTS = [
  "roadgenius.com",
  "miamibusiness.com",
  "miamiandbeaches.com",
  "lodgingmagazine.com",
];

/** Labels that mark the same reprint sources even when the URL is missing from the row. */
export const YELLOW_LABELS = [
  "miami business",
  "gmcvb",
  "greater miami convention",
  "lodging magazine",
];

export function isYellowSource(label?: string | null, urls?: unknown): boolean {
  const blob = `${label ?? ""} ${typeof urls === "string" ? urls : JSON.stringify(urls ?? "")}`.toLowerCase();
  if (YELLOW_HOSTS.some((h) => blob.includes(h))) return true;
  if (YELLOW_LABELS.some((s) => blob.includes(s))) return true;
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
