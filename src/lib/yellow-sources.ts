/**
 * Yellow sources: not shown as raw licensed figures. Harvey's supply tiers: green = public counts;
 * yellow = STR/CoStar (or a republication of them) with no license notice — score bucket only; red = skip.
 *
 * roadgenius.com republishes the same Nashville county OCC/ADR figures that other public pages attribute
 * to STR data published by the Nashville Convention & Visitors Corp (e.g. 2025 OCC 67.0%, ADR $199.20).
 * We could not confirm a non-STR primary origin on roadgenius, so it is treated as Yellow.
 */
export const YELLOW_HOSTS = ["roadgenius.com"];

export function isYellowSource(label?: string | null, urls?: unknown): boolean {
  const blob = `${label ?? ""} ${typeof urls === "string" ? urls : JSON.stringify(urls ?? "")}`.toLowerCase();
  return YELLOW_HOSTS.some((h) => blob.includes(h));
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
      body: yellowBucketText(r.asOf ?? null),
      magnitude: "bucket: moderate band",
    };
  });
}
