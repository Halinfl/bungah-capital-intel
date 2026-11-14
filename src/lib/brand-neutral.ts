/**
 * Brand-comparison wording (Hal, Nov 13 2026, Chat Batch 1 r3): the Trepp CMBS cut by brand flag is a loan-level read
 * of CMBS pools, so it is shown as neutral figures by flag ("Hilton-flagged 11.73%, Marriott-flagged 7.23%"), never as
 * one brand's distress "outpacing" another's, and it never leads a debt answer (chat-brief-build.ts). Display layer
 * only; DB rows unchanged.
 */

const REWRITES: [RegExp, string][] = [
  [/Trepp brand cut: Hilton-flagged CMBS distress outpaces Marriott/g, "Trepp: lodging CMBS non-performing rates by brand flag"],
  [/Hilton-flag(?:ged)? CMBS distress \(national; Palmer House drives it\)/g, "Lodging CMBS non-performing rates by brand flag (national, Trepp)"],
  [/Trepp brand cut \(via CRE Daily, Oct 1\): Hilton-flagged non-performing rate ([\d.]+%) vs Marriott ([\d.]+%)/g, "Trepp (via CRE Daily, Oct 1), lodging CMBS non-performing rate by brand flag: Hilton-flagged $1, Marriott-flagged $2"],
  [/Hilton full-service ([\d.]+%) \(Palmer House \$([\d.]+M) in foreclosure\)/g, "full-service: Hilton-flagged $1"],
  [/Marriott limited-service ([\d.]+%) vs Hilton limited-service ([\d.]+%)\.?/g, "limited-service: Hilton-flagged $2, Marriott-flagged $1. A read of CMBS loan pools, not of either brand."],
  [/Hilton NPL ([\d.]+%) vs Marriott ([\d.]+%)/g, "Hilton-flagged $1, Marriott-flagged $2"],
  [/; Hilton full-service ([\d.]+%)/g, "; full-service Hilton-flagged $1"],
  [/\s*\(Trepp brand cut: Hilton-flagged full-service NPL [\d.]+%\)/g, " (Trepp via CRE Daily, Oct 1)"],
  [/\(Trepp brand cut, /g, "(Trepp, "],
  [/\bTrepp brand cut\b/g, "Trepp"],
];

export function neutralBrandText(t: string): string {
  let s = t;
  for (const [re, to] of REWRITES) s = s.replace(re, to);
  return s;
}

/** A fact or row that compares hotel brands' loan performance: it may be read, never lead. */
export const BRAND_COMPARE = /\bby brand flag\b|\bHilton(?:-flag\w*)?\b[^.|]{0,80}\bMarriott\b|\bMarriott(?:-flag\w*)?\b[^.|]{0,80}\bHilton\b/i;

export function isBrandCompare(f: { text?: string; title?: string }): boolean {
  return BRAND_COMPARE.test(f.text ?? "") || BRAND_COMPARE.test(f.title ?? "");
}

type Row = { title?: string | null; body?: string | null; sourceLabel?: string | null; sourceUrls?: unknown; magnitude?: string | null };

export function withNeutralBrands<T extends Row>(rows: T[]): T[] {
  return rows.map((r) => {
    const txt = `${r.title ?? ""} ${r.body ?? ""} ${r.magnitude ?? ""} ${r.sourceLabel ?? ""}`;
    if (!/brand cut|outpaces Marriott|Hilton NPL|Hilton-flag/.test(txt)) return r;
    return {
      ...r,
      ...(typeof r.title === "string" ? { title: neutralBrandText(r.title) } : {}),
      ...(typeof r.body === "string" ? { body: neutralBrandText(r.body) } : {}),
      ...(typeof r.magnitude === "string" ? { magnitude: neutralBrandText(r.magnitude) } : {}),
      ...(typeof r.sourceLabel === "string" ? { sourceLabel: neutralBrandText(r.sourceLabel) } : {}),
    };
  });
}
