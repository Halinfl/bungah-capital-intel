/**
 * Deterministic intent classifier for Capital Graph chat.
 * Intents drive memo lead styles (fallback) and retrieval emphasis (LLM pack).
 */

export const CHAT_INTENTS = [
  "revpar_metrics",
  "supply_pipeline",
  "demand_visitation",
  "which_submarket",
  "talent_greenlight",
  "debt_overlay",
  "rates",
  "tax_collections",
  "compare_markets",
  "general_thesis",
  // Set by guards in chat-llm.ts (not by RULES below).
  "advice_declined",
  "uncovered_market",
  "supply_ranking",
  "property_asset",
  "reit_call",
  // "Ask about this" item scopes (chat-items.ts): a REIT's reported quarter, a graded sale.
  "reit_reported",
  "deal_sale",
  "deal_grade",
  "unknown",
] as const;

export type ChatIntent = (typeof CHAT_INTENTS)[number];

type Rule = { intent: ChatIntent; weight: number; test: (q: string) => boolean };

/**
 * "Rates" (Eric QA r2, Nov 1 2026). Interest wording (Fed, SOFR, Treasury, interest, mortgage…) → the rates card;
 * room-rate wording (room / hotel / nightly rates, ADR, average daily rate) → the RevPAR / ADR card; bare "rates"
 * → room rates when a market is in play, else a clarifying prompt (chat-llm.ts) offering both.
 */
export const INTEREST_RATE_WORDS = /\b10[- ]?(year|yr)\b|\b10y\b|\btreasur(y|ies)\b|\byield curve\b|\bsofr\b|\bfed funds\b|\binterest\b|\bbond yields?\b|\bfomc\b|\bfed\b|\bfederal reserve\b|\bmortgages?\b|\brate (cut|hike)s?\b|\bcentral bank\b/i;
export const ROOM_RATE_WORDS = /\b(room|hotel|nightly|daily|average daily|lodging) rates?\b|\badr\b/i;
/** Other "rate(s)" that are neither (cap rates, tax rates, occupancy rate, exchange rates…). */
const OTHER_RATE_WORDS = /\b(cap|capitali[sz]ation|tax|occupancy|occ|exchange|vacancy|delinquency|default|growth|wage|hourly|tariff|conversion|special[- ]servicing)\s+rates?\b|\brate of\b/i;
/** "Why are rates up?": "rates" with neither interest nor room-rate wording (nor another kind of rate). */
export function isBareRates(question: string): boolean {
  const q = question.toLowerCase();
  return /\brates\b/.test(q) && !INTEREST_RATE_WORDS.test(q) && !ROOM_RATE_WORDS.test(q) && !OTHER_RATE_WORDS.test(q);
}

const RULES: Rule[] = [
  {
    intent: "tax_collections",
    weight: 9,
    test: (q) =>
      /\b(hotel|occupancy|lodging|room|bed|tourist|transient|accommodations?|excise)[- ]+(occupancy |development |accommodations? )?tax(es)?\b/.test(q) ||
      /\b(hot|tot|tat|tdt|cdt|hmt)\b/.test(q) && /\btax|collections?|revenue|receipts?|series\b/.test(q) ||
      /\btax (collections?|receipts?|revenue|series)\b/.test(q) ||
      /\bhotel[- ]motel tax\b/.test(q) ||
      /\b(tat|tot|tdt)\b/.test(q),
  },
  {
    intent: "compare_markets",
    weight: 10,
    test: (q) =>
      /\bcompar(e|ison|ing)\b/.test(q) ||
      /\bvs\.?\b/.test(q) ||
      /\bversus\b/.test(q) ||
      /\bboth markets?\b/.test(q) ||
      (/\borlando\b/.test(q) && /\bvegas|las vegas\b/.test(q)),
  },
  {
    intent: "which_submarket",
    weight: 9,
    test: (q) =>
      /\bwhich (orlando|vegas|nashville|austin|miami|market|submarket)\b/.test(q) ||
      /\bwhich[- ]orlando\b/.test(q) ||
      /\bsubmarket\b/.test(q) ||
      /\bnuance\b/.test(q) ||
      /\bimpact\b/.test(q) && /\bscarc/.test(q) ||
      /\bnot the msa\b/.test(q) ||
      /\bbroadway\b/.test(q) && /\bnashville\b/.test(q),
  },
  {
    intent: "talent_greenlight",
    weight: 8,
    test: (q) =>
      /\btalent\b/.test(q) ||
      /\bstaff(ing)?\b/.test(q) ||
      /\bgreenlight\b/.test(q) ||
      /\bcrew\b/.test(q) ||
      /\bhuman[- ]touch\b/.test(q) ||
      /\bgc\/mep\b/.test(q) ||
      /\blabou?r\b/.test(q) ||
      /\bstrikes?\b/.test(q) ||
      /\bunion\b/.test(q) ||
      /\bwages?\b/.test(q),
  },
  {
    intent: "debt_overlay",
    weight: 8,
    test: (q) =>
      /\bdebt\b/.test(q) ||
      /\bcmbs\b/.test(q) ||
      /\bmaturit(y|ies)\b/.test(q) ||
      /\brefinanc/.test(q) ||
      /\b\bdy\b/.test(q) ||
      /\bdebt[- ]wall\b/.test(q),
  },
  {
    // Benchmark rates: answered from the cited national rate rows (10-year by default).
    intent: "rates",
    weight: 8.5,
    test: (q) =>
      /\b10[- ]?(year|yr)\b|\b10y\b|\btreasur(y|ies)\b|\byield curve\b|\bsofr\b|\bfed funds\b|\binterest rates?\b|\bbond yields?\b|\bfomc\b/.test(q) ||
      // "Is the Fed cutting?", "mortgage rates", "why are rates up, is it interest?"
      /\bfed\b|\bfederal reserve\b|\bmortgages?\b|\brate (cut|hike)s?\b|\bcentral bank\b/.test(q) ||
      (/\binterest\b/.test(q) && /\brates?\b|\bcost of (debt|capital)\b/.test(q)),
  },
  {
    intent: "supply_pipeline",
    weight: 7,
    test: (q) =>
      /\bsupply\b/.test(q) ||
      /\bpipeline\b/.test(q) ||
      /\bnew keys?\b/.test(q) ||
      /\broom(s)? (stock|growth|delivery)\b/.test(q) ||
      /\bconstruction\b/.test(q) ||
      /\bhard rock\b/.test(q) ||
      /\babsorption\b/.test(q) ||
      /\bcancell?(ed|ation)\b/.test(q) ||
      /\bgroundbreak|\bbroke ground\b/.test(q),
  },
  {
    intent: "demand_visitation",
    weight: 7,
    test: (q) =>
      /\bdemand\b/.test(q) ||
      /\bvisit(ors?|ation|s)\b/.test(q) ||
      // "Why is occupancy down?", "what's driving RevPAR?": the drivers card, not the performance card again.
      // A "why" about rates (room rates / ADR, or bare "rates") is not a demand question: its own card answers it.
      ((/\bwhy\b/.test(q) || /\bdriv(ing|ers?|es|en)\b/.test(q)) && !ROOM_RATE_WORDS.test(q) && !isBareRates(q)) ||
      /\bleisure\b/.test(q) ||
      /\btouris[mt]\b/.test(q) ||
      /\battendance\b/.test(q) ||
      /\bairlift\b/.test(q) ||
      /\bpassengers?\b/.test(q) ||
      /\bcitywides?\b/.test(q),
  },
  {
    intent: "revpar_metrics",
    weight: 6,
    test: (q) =>
      // "How is Chicago CBD doing?", "how's the Strip performing", "how are Miami hotels holding up"
      /\bhow(['’]s| is| are| has| have)\b.{1,60}\b(doing|performing|faring|trending|holding up|shaping up|going)\b/.test(q) ||
      /\b(cbd|downtown|midtown|uptown|the strip|central business district)\b.{0,40}\b(doing|now|today|lately|this year|right now)\b/.test(q) ||
      /\brevpar\b/.test(q) ||
      /\badr\b/.test(q) ||
      ROOM_RATE_WORDS.test(q) ||
      // Bare "rates" ("why are rates up in Nashville?"): room rates; with no market, chat-llm.ts asks which.
      isBareRates(q) ||
      /\boccupanc(?:y|ies)?\b|\bocc\b/.test(q) ||
      /\bmetrics?\b/.test(q) ||
      /\bkpi\b/.test(q) ||
      /\bperformance\b/.test(q),
  },
  {
    intent: "general_thesis",
    weight: 3,
    test: (q) =>
      /\bthesis\b/.test(q) ||
      /\bunderwrite\b/.test(q) ||
      /\bdeploy\b/.test(q) ||
      /\bcapital\b/.test(q) ||
      /\bhold\b/.test(q) ||
      /\bflag\b/.test(q) ||
      /\binvest(ment|ing)?\b/.test(q),
  },
];

/** Map free-text question → ChatIntent (highest-weight matching rule). */
export function classifyIntent(question: string): ChatIntent {
  const q = question.toLowerCase().trim();
  if (!q) return "unknown";
  // Uppercase acronyms (HOT / TOT / TAT / TDT) are tax questions even without the word "tax".
  if (/\b(HOT|TOT|TAT|TDT)\b/.test(question)) return "tax_collections";

  let best: ChatIntent = "unknown";
  let bestWeight = 0;
  for (const rule of RULES) {
    if (rule.test(q) && rule.weight > bestWeight) {
      best = rule.intent;
      bestWeight = rule.weight;
    }
  }
  return best;
}
