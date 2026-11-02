/**
 * Wording fixes for Stack memos saved before a copy change. Stored memos are not rewritten in the DB; they are
 * rewritten here at render, so saved and newly generated memos read the same.
 */
import { TEN_YEAR, tenYearMemoText } from "./fed-policy";

export const MEMO_COPY_FIXES: [RegExp, string][] = [
  // r6d: saved memos carry the 10-year of their day ("10-year Treasury 5.09% (2026-10-16 close) · …"); every 10-year
  // mention reads the one data-layer value (latest FRED DGS10), so the saved line renders with it.
  [/^- 10-year Treasury \d+\.\d+% \([^)\n]*\) · .*$/gm, `- ${tenYearMemoText()} · [fred.stlouisfed.org ↗](${TEN_YEAR.url})`],
  // The +11.6% figure came only from a LinkedIn post (social posts are never sources): keep the point, drop the figure.
  [/A 2026 T12 carrying the \+11\.6% displaced-meeting lift \(CoStar, Sep 2026\) overstates debt yield\./g, "A 2026 T12 carrying World Cup-displaced meetings overstates debt yield."],
  [/\bNo greenlight\./g, "Debt test not yet cleared."],
  // Saved memos carry the old X-sourced capex line; it renders as the house rule (runs before the social strip).
  [
    /^- The apartment claim that Bitcoin covers capex and debt maturities does not carry over: .*$/gm,
    "- Bitcoin is never counted on to cover capex or debt maturities: the franchisor sets PIP timing, and a PIP can come due in a Bitcoin drawdown (house rule).",
  ],
];

export function fixMemoCopy(md: string): string {
  return MEMO_COPY_FIXES.reduce((t, [re, to]) => t.replace(re, to), md);
}
