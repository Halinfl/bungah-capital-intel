/**
 * Fed policy (chat r6, Nov 2 2026): the current fed funds target range and the latest FOMC decisions, from a
 * code/JSON data layer (src/data/fed-policy.json), not the DB. Public figures only (FRED DFEDTARU/DFEDTARL and the
 * federalreserve.gov FOMC statements), each with its citation and as-of date. Facts only: no forecast of the Fed.
 */
import data from "@/data/fed-policy.json";

export type FedDecision = { date: string; action: "held" | "raised" | "lowered"; changeBp?: number; lower: number; upper: number; vote?: string; source: string; title: string; url: string };
export type FedPolicy = {
  checkedAt: string;
  targetRange: { lower: number; upper: number; asOf: string; source: string; urls: string[] };
  decisions: FedDecision[];
};

export const FED_POLICY = data as unknown as FedPolicy;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2026-10-28" → "Oct 28, 2026". */
export function fedDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
/** 3.75 → "3.75%", 4 → "4.00%". */
export const pct = (n: number) => `${n.toFixed(2)}%`;
export const rangeText = (lo: number, hi: number) => `${lo.toFixed(2)}–${pct(hi)}`;

/** Newest decision first. */
export function fedDecisions(p: FedPolicy = FED_POLICY): FedDecision[] {
  return [...p.decisions].sort((a, b) => b.date.localeCompare(a.date));
}

/** "held the range at 3.75–4.00%" / "raised the range 0.25 point to 3.75–4.00%". */
export function decisionText(d: FedDecision): string {
  const r = rangeText(d.lower, d.upper);
  if (d.action === "held") return `held the target range at ${r}`;
  const amt = d.changeBp ? ` ${(d.changeBp / 100).toFixed(2)} point` : "";
  return `${d.action} the target range${amt} to ${r}`;
}

/**
 * A question about Fed policy (the Fed / FOMC / fed funds, or rate cuts / hikes with no other benchmark named).
 * SOFR, Treasury, mortgage or bond questions keep their own benchmark.
 */
export function isFedPolicyQuestion(q: string): boolean {
  if (/\b(sofr|treasur(y|ies)|10[- ]?(year|yr)|2[- ]?(year|yr)|mortgages?|bonds?|yields?|cap rates?|tax rates?)\b/i.test(q)) return false;
  if (/\b(fed|feds|federal reserve|fomc|fed funds|federal funds|policy rate|powell)\b/i.test(q)) return true;
  return /\b(rate (cut|hike|increase|decrease)s?|cut(ting|s)? rates|(rais|hik)(e|es|ing) rates)\b/i.test(q) && !/\b(room|hotel|nightly|adr|average daily)\b/i.test(q);
}
