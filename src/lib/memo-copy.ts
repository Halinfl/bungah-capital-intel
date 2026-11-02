/**
 * Wording fixes for Stack memos saved before a copy change. Stored memos are not rewritten in the DB; they are
 * rewritten here at render, so saved and newly generated memos read the same.
 */
export const MEMO_COPY_FIXES: [RegExp, string][] = [
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
