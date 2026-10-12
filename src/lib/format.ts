export function fmtPct(n: number | null | undefined, digits = 1): string {
  if (n == null) return "—";
  return `${n.toFixed(digits)}%`;
}

export function fmtUsd(n: number | null | undefined, digits = 0): string {
  if (n == null) return "—";
  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

export function fmtVisitorsM(n: number | null | undefined): string {
  if (n == null) return "—";
  return `${n.toFixed(1)}M`;
}

export function fmtRoomsK(n: number | null | undefined): string {
  if (n == null) return "—";
  return `${n.toFixed(1)}k`;
}

/** Derived RevPAR = OCC% × ADR (not a stored column). */
export function fmtRevpar(
  occupancy: number | null | undefined,
  adr: number | null | undefined,
  digits = 2
): string {
  if (occupancy == null || adr == null) return "—";
  return fmtUsd((occupancy / 100) * adr, digits);
}

export function derivedRevpar(
  occupancy: number | null | undefined,
  adr: number | null | undefined
): number | null {
  if (occupancy == null || adr == null) return null;
  return (occupancy / 100) * adr;
}

export function severityClass(severity: string): string {
  switch (severity) {
    case "alert":
      return "text-rose-300 bg-rose-500/10 border-rose-500/30";
    case "watch":
      return "text-amber-300 bg-amber-500/10 border-amber-500/30";
    default:
      return "text-sky-300 bg-sky-500/10 border-sky-500/30";
  }
}

export function isIllustrativeSource(label: string | null | undefined): boolean {
  if (!label) return true;
  return /illustrative/i.test(label);
}

/**
 * Seed / demo / placeholder / stub content is never shown to users (Hal, 2026-10-11).
 * Rows stay in the DB; every read path filters them out with these helpers.
 */
const SEED_TEXT = /illustrative|\bdemo\b|\bplaceholder\b|\bstubs?\b|\bdummy\b|lorem ipsum/i;

/** True when any text carries seed / demo / placeholder / stub wording (never shown publicly). */
export function isPlaceholderText(...parts: (string | null | undefined)[]): boolean {
  return parts.some((t) => typeof t === "string" && SEED_TEXT.test(t));
}

/** Findings (radar output) filtered the same way as signals. */
export function citedFindings<T extends { title: string; summary: string; sourceLabel: string }>(rows: T[]): T[] {
  return rows.filter((f) => !isPlaceholderText(f.title, f.summary, f.sourceLabel));
}

/** Radar descriptions are config copy; drop placeholder wording rather than the radar. */
export function publicRadarDescription(d: string): string {
  return d.replace(/^\s*stub\s+radar\b/i, "Radar").replace(/\bstubs?\b\s*/gi, "").replace(/\bdemo\b\s*/gi, "").trim();
}

type SeedCheckable = {
  sourceLabel?: string | null;
  title?: string | null;
  body?: string | null;
  name?: string | null;
  notes?: string | null;
  magnitude?: string | null;
  asOf?: string | null;
};

/** True for illustrative seed rows (by source label or any visible text field). */
export function isSeedRow(r: SeedCheckable): boolean {
  if (!r.sourceLabel || SEED_TEXT.test(r.sourceLabel)) return true;
  return [r.title, r.body, r.name, r.notes, r.magnitude, r.asOf].some(
    (t) => typeof t === "string" && SEED_TEXT.test(t)
  );
}

/** Markets whose snapshot (summary, OCC/ADR/visitors, nuance) is an illustrative seed. */
export function isSeedMarket(m: { sourceLabel: string | null }): boolean {
  return isIllustrativeSource(m.sourceLabel);
}

export function citedOnly<T extends SeedCheckable>(rows: T[]): T[] {
  return rows.filter((r) => !isSeedRow(r));
}

export function coverageInProgressLine(marketName: string): string {
  return `Deeper cited coverage for ${marketName} is in progress.`;
}

/** Last-line guard: drop any line or citation that still carries seed wording. */
export function scrubSeedLines(text: string): string {
  return text
    .split("\n")
    .filter((line) => !SEED_TEXT.test(line))
    .join("\n");
}

export function scrubSeedCitations(labels: string[]): string[] {
  return labels.filter((l) => !SEED_TEXT.test(l));
}
