/**
 * Lead stats for Radars cards. A stat is shown only if its exact value was re-read on the linked
 * page (checked 2026-10-20); a finding whose figures are not in this list gets no stat tile.
 * An arrow needs a prior-period change stated by a cited source; none is ever computed or guessed.
 */
import type { StatChange } from "@/components/StatCard";

export const RADAR_SOURCE_URLS: { match: RegExp; url: string }[] = [
  { match: /^Visit Orlando Data & Trends/i, url: "https://www.visitorlando.org/about/resources/data-trends/" },
  {
    match: /^PR Newswire 2026-05-07/i,
    url: "https://www.prnewswire.com/news-releases/orlando-welcomed-record-76-7-million-visitors-in-2025--remaining-no-1-most-visited-destination-in-the-us-302766198.html",
  },
  { match: /^LVCVA FAQ/i, url: "https://www.lvcva.com/research/faqs/" },
];

type VerifiedStat = {
  market: string;
  /** Pattern the finding title or summary must contain for this stat to apply. */
  pattern: RegExp;
  label: string;
  value: string;
  hint: string;
  source: string;
  change?: StatChange;
};

const VERIFIED: VerifiedStat[] = [
  {
    market: "orlando",
    pattern: /\bVisitors 76\.7M\b/,
    label: "Visitors, 2025",
    value: "76.7M",
    hint: "Record year · Visit Orlando",
    source: "PR Newswire 2026-05-07",
    change: { direction: "up", text: "+1.8% vs 2024" },
  },
  {
    market: "orlando",
    pattern: /\bOCC 71\.4%/,
    label: "Metro occupancy, 2025",
    value: "71.4%",
    hint: "Year-end · Visit Orlando Data & Trends",
    source: "Visit Orlando Data & Trends YE 2025",
  },
  {
    market: "las-vegas",
    pattern: /\bvisitors 38\.5M\b/i,
    label: "Visitors, 2025",
    value: "38.5M",
    hint: "Year-end · LVCVA",
    source: "LVCVA FAQ YE 2025",
  },
  {
    market: "las-vegas",
    pattern: /\bmidweek (?:OCC|occupancy) 76\.6%/i,
    label: "Midweek occupancy, 2025",
    value: "76.6%",
    hint: "Weekends 88.8% · LVCVA",
    source: "LVCVA FAQ YE 2025",
  },
];

/** Figures removed in the 2026-10-20 source check (not on their cited pages). Never a stat tile. */
export const UNVERIFIED_FIGURES: { market: string; pattern: RegExp; note: string }[] = [
  { market: "orlando", pattern: /\$98\.6\s*B/i, note: "$98.6B economic impact is not on the cited Visit Orlando pages" },
  { market: "las-vegas", pattern: /[−-]7\.5%/, note: "visitors −7.5% is not on the cited LVCVA FAQ page" },
];

export function unverifiedFiguresIn(market: string | null, text: string): string[] {
  return UNVERIFIED_FIGURES.filter((u) => u.market === market && u.pattern.test(text)).map((u) => u.note);
}

/**
 * Lead stat for a finding: the first verified stat whose figure appears in the title, else in the
 * summary. Visitors lead the Orlando refresh because that is the only figure with a cited change.
 */
export function leadStat(market: string | null, title: string, summary: string, used: Set<string>): VerifiedStat | null {
  const pool = VERIFIED.filter((v) => v.market === market);
  const pick = (text: string) => pool.find((v) => v.pattern.test(text) && !used.has(v.label));
  const s = pick(summary.startsWith("Visitors") ? summary : title) ?? pick(title) ?? pick(summary);
  if (s) used.add(s.label);
  return s ?? null;
}

export function sourceUrlFor(segment: string): string | null {
  return RADAR_SOURCE_URLS.find((s) => s.match.test(segment.trim()))?.url ?? null;
}
