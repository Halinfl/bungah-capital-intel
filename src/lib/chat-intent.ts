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
  "compare_markets",
  "general_thesis",
  "unknown",
] as const;

export type ChatIntent = (typeof CHAT_INTENTS)[number];

type Rule = { intent: ChatIntent; weight: number; test: (q: string) => boolean };

const RULES: Rule[] = [
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
      /\blabor\b/.test(q),
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
    intent: "supply_pipeline",
    weight: 7,
    test: (q) =>
      /\bsupply\b/.test(q) ||
      /\bpipeline\b/.test(q) ||
      /\bnew keys?\b/.test(q) ||
      /\broom(s)? (stock|growth|delivery)\b/.test(q) ||
      /\bconstruction\b/.test(q) ||
      /\bhard rock\b/.test(q) ||
      /\babsorption\b/.test(q),
  },
  {
    intent: "demand_visitation",
    weight: 7,
    test: (q) =>
      /\bdemand\b/.test(q) ||
      /\bvisit(or|ation|s)\b/.test(q) ||
      /\bleisure\b/.test(q) ||
      /\btouris[mt]\b/.test(q) ||
      /\battendance\b/.test(q),
  },
  {
    intent: "revpar_metrics",
    weight: 6,
    test: (q) =>
      /\brevpar\b/.test(q) ||
      /\badr\b/.test(q) ||
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
