/**
 * Supply-pressure score wording.
 *
 * The 1–5 score is Bungah's. Lodging Econometrics (and other pipeline publishers)
 * do not publish it, and LE pipeline counts are licensed — they are not quoted on
 * the public brief. Chat and market pages show only "Bungah supply-pressure score n/5"
 * with no LE credit and no LE counts.
 */
import { parseSourceUrls, type SourceLink } from "./source-links";
import { isLicensedAttributionUrl } from "./licensed-attribution";
import { isLicensedLink } from "./licensed-sources";

export const SUPPLY_SCORE_TITLE = /supply-pressure score\s*(\d)\s*\/\s*5/i;

export function supplyScoreOf(s: { title?: string | null; body?: string | null; magnitude?: string | null }): string | null {
  const blob = `${s.title ?? ""} ${s.body ?? ""} ${s.magnitude ?? ""}`;
  return SUPPLY_SCORE_TITLE.exec(blob)?.[1] ?? /\bscore:\s*(\d)\s*\/\s*5/i.exec(blob)?.[1] ?? null;
}

/** Chat lead: Bungah's score only. Never attributes the score to Lodging Econometrics or quotes LE counts. */
export function formatSupplyPressureLead(
  short: string,
  scoreSig: { title: string; body?: string | null; sourceLabel?: string | null; sourceUrls?: unknown }
): string {
  const score = supplyScoreOf(scoreSig);
  if (score) return `${short} supply: Bungah supply-pressure score ${score}/5.`;
  return `${short} supply: a Bungah supply-pressure score is on file.`;
}

/** Market-page / brief-section card title and body. */
export function formatSupplyPressureCard(s: {
  title: string;
  body?: string | null;
  sourceLabel?: string | null;
  sourceUrls?: unknown;
}): { title: string; body: string } {
  const score = supplyScoreOf(s) ?? "?";
  return {
    title: `Bungah supply-pressure score ${score}/5`,
    body: `Bungah supply-pressure score ${score}/5.`,
  };
}

function isLeOrLicensedLink(l: SourceLink): boolean {
  return isLicensedLink(l) || isLicensedAttributionUrl(l.url) || /lodgingeconometrics/i.test(l.url) || /lodging econometrics/i.test(l.label);
}

/**
 * Rewrite a supply-pressure score row before the licensed strip so the Bungah
 * score survives and no LE counts or LE credit remain on the public row.
 */
export function asBungahSupplyScoreRow<T extends {
  title: string;
  body?: string | null;
  sourceLabel?: string | null;
  sourceUrls?: unknown;
  magnitude?: string | null;
}>(r: T): T {
  if (!SUPPLY_SCORE_TITLE.test(r.title) && !SUPPLY_SCORE_TITLE.test(r.body ?? "")) return r;
  const card = formatSupplyPressureCard(r);
  const score = supplyScoreOf(r);
  const links = parseSourceUrls(r.sourceUrls).filter((l) => !isLeOrLicensedLink(l));
  const label = links.length
    ? links.map((l) => l.label || l.url).join(" · ")
    : "Bungah Capital Intel (derived score)";
  return {
    ...r,
    title: card.title,
    body: card.body,
    magnitude: score ? `${score}/5` : r.magnitude,
    sourceLabel: label,
    sourceUrls: links,
  };
}

export function withBungahSupplyScores<T extends {
  title: string;
  body?: string | null;
  sourceLabel?: string | null;
  sourceUrls?: unknown;
  magnitude?: string | null;
}>(rows: T[]): T[] {
  return rows.map((r) => asBungahSupplyScoreRow(r));
}
