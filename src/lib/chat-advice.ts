/**
 * Advice guard for Chat. Runs before any retrieval or model call.
 *
 * Bungah Capital Intel gives decision support, not recommendations to buy or sell.
 * Buy / sell / hold / should-I-invest requests (stocks or hotels) and staff-cut requests
 * are declined with fixed wording; the caller then adds the relevant cited facts.
 */

export type AdviceKind = "buy_sell" | "staff_cut";

const BUY_SELL: RegExp[] = [
  // "should I/we buy|sell|short|invest|acquire|dispose…"
  /\bshould\s+(i|we|my\s+\w+|our\s+\w+)\s+(buy|sell|short|purchase|acquire|dispose|divest|exit|invest|put\s+(money|capital|cash)|hold|keep|add\s+to|load\s+up|go\s+long|go\s+short)\b/,
  // "buy recommendation", "buy or sell", "buy/sell/hold rating"
  /\b(buy|sell|hold|investment)\s+(recommendation|rating|call|advice|signal)s?\b/,
  /\b(recommend|advise|advice)\b.{0,40}\b(buy|sell|short|invest|purchase|acquire|stock|shares?)\b/,
  /\b(buy|sell)\s*(\/|or|vs\.?)\s*(sell|buy|hold)\b/,
  // "is X a buy / a good investment / worth buying"
  /\bis\s+.{1,60}\s+a\s+(good\s+|smart\s+|strong\s+)?(buy(?![- ]side)|sell(?![- ]side)|investment|bet)\b/,
  /\bworth\s+(buying|investing|selling|owning)\b/,
  /\bgood\s+(time|moment)\s+to\s+(buy|sell|invest|acquire)\b/,
  /\b(price\s+target|target\s+price)\b/,
  /\b(should|would)\s+(i|we|you)\s+(invest|be\s+investing)\b/,
  /\bwhat\s+(stock|stocks|reit|reits|hotel|hotels)\s+should\s+(i|we)\s+(buy|sell|own)\b/,
  /\bshould\s+(i|we)\s+.{0,40}\b(stock|shares|reit|equity)\b/,
  // "if I should buy", "whether we should sell", "I think we should acquire"
  /\b(i|we)\s+should\s+(buy|sell|short|purchase|acquire|dispose|divest|exit|invest|bid|hold|keep|go\s+long|go\s+short)\b/,
  // "trying to decide if/whether to buy", "deciding whether to sell"
  /\b(decid(e|ing)|choos(e|ing)|weigh(ing)?)\s+(if|whether)\s+(to|i|we)\b.{0,20}\b(buy|sell|short|purchase|acquire|dispose|divest|exit|invest|bid|hold)\b/,
  // "thinking about buying", "considering selling", "looking to acquire", "planning to buy"
  /\b(thinking|thought|considering|contemplating|looking|planning|hoping|weighing|tempted)\s+(about\s+|of\s+|to\s+)?(buy(ing)?|sell(ing)?|short(ing)?|purchas(e|ing)|acquir(e|ing)|divest(ing)?|invest(ing)?\s+in|bid(ding)?\s+on)\b/,
  // "a good buy", "a buy right now"
  /\b(good|great|smart|strong|bad)\s+(buy|sell|investment|bet)\b/,
  /\b(should|would|do)\s+you\s+(buy|sell|invest)\b/,
];

const STAFF_CUT: RegExp[] = [
  /\bshould\s+(i|we)\s+(cut|reduce|lay\s*off|trim|shed)\b.{0,40}\b(staff|fte|ftes|headcount|jobs|workers|employees|labor|labour|payroll)\b/,
  /\b(how\s+many|which)\s+(staff|ftes?|workers|employees|jobs|positions)\s+(should|can|could)\s+(i|we)\s+(cut|lay\s*off|eliminate)\b/,
  /\b(recommend|plan|suggest)\b.{0,30}\b(staff|headcount|fte|labor|labour)\s+(cuts?|reductions?)\b/,
];

/** Classify a question as an advice request we decline, or null. */
export function classifyAdviceRequest(question: string): AdviceKind | null {
  const q = question.toLowerCase().replace(/\s+/g, " ").trim();
  if (!q) return null;
  if (STAFF_CUT.some((re) => re.test(q))) return "staff_cut";
  if (BUY_SELL.some((re) => re.test(q))) return "buy_sell";
  return null;
}

/** Fixed decline wording (deterministic; the same for the memo path and any model path). */
export function adviceDeclineLines(kind: AdviceKind): string[] {
  if (kind === "staff_cut") {
    return [
      "**We don't recommend staff cuts.**",
      "",
      "Bungah Capital Intel gives decision support, not recommendations, and our house rule is human touch first: labor is underwritten at the cited wage floors and contracts, not cut to hit a number. Below are the relevant cited facts for your own decision.",
    ];
  }
  return [
    "**We don't give buy or sell recommendations.**",
    "",
    "Bungah Capital Intel gives decision support, not recommendations to buy or sell any stock, REIT or hotel, and it won't say whether you should invest. Below are the relevant cited facts for your own decision.",
  ];
}
