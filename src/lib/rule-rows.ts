/**
 * Internal working rules and methodology notes (Eric QA r5, Nov 2 2026). Rows of kind "nuance" ("Texas HOT ≠
 * RevPAR — … Do not overwrite seed lodging metrics from tax") and "labor_rule" are guidance for our own analysts, and
 * rows sourced to "Bungah Capital Intel …" cite our own site. Neither ever renders as an answer row or a citation:
 * they are filtered by record kind / source at load (display layer only; DB rows unchanged).
 */
export const RULE_KINDS = new Set(["nuance", "labor_rule"]);
/** Our own site as a source ("Bungah Capital Intel (Texas Comptroller HOT methodology)", "… talent synthesis"). */
export const OWN_SOURCE = /^\s*Bungah(?: Capital Intel)?\b/i;

export function isRuleRow(r: { kind?: string | null; sourceLabel?: string | null }): boolean {
  return (typeof r.kind === "string" && RULE_KINDS.has(r.kind)) || OWN_SOURCE.test(r.sourceLabel ?? "");
}

/** A source label / link label that is our own site or synthesis: never shown as a citation. */
export function isOwnSource(label: string | null | undefined): boolean {
  return OWN_SOURCE.test(label ?? "") || /\bBungah Capital Intel(?: Baseline)?\s*(?:\(|talent synthesis)/i.test(label ?? "");
}

/** Source links minus any that cite our own site. */
export function withoutOwnLinks<T extends { label?: string | null }>(links: T[]): T[] {
  return links.filter((l) => !isOwnSource(l.label));
}

export function withoutRules<T extends { kind?: string | null; sourceLabel?: string | null }>(rows: T[]): T[] {
  return rows.filter((r) => !isRuleRow(r));
}

/** Rule / methodology wording, for the leak test and the render guard's audit (never a figure). */
export const RULE_TEXT = /\(rule\b|\brule:\s|\bDo not (?:overwrite|invent|underwrite)\b|\bseed lodging metrics\b|\blicensed STR\b|\bNever underwrite\b|\bDecision-support rule\b/i;
