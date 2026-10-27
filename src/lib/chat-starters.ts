/**
 * Starter questions for an empty chat. Only questions that scripts/chat/verify-starters.ts proved, at build
 * time, route to the expected intent and return a summary card with at least one key read for that item,
 * whose headline or a key read is on the starter's topic (and, where set, whose headline leads with it),
 * are offered; the verified list lives in src/data/chat-starters.json (written by that script).
 */
import type { DateRange } from "./chat-brief";
import type { ChatIntent } from "./chat-intent";
import type { ChatScope, ScopeKind } from "./chat-scope";
import verified from "@/data/chat-starters.json";

export type Starter = { q: string; range?: DateRange };
/**
 * `topic`: the headline or at least one key read must match, or the starter is dropped (an on-intent card
 * about something else, e.g. a debt question answered with the OCC/ADR card, does not count).
 * `lead`: the headline itself (the one-line summary) must carry this, e.g. a RevPAR figure for a RevPAR question.
 */
export type StarterCandidate = Starter & {
  expect: ChatIntent[];
  topic: RegExp;
  lead?: RegExp;
  /** Backfill that stands in for another candidate: offered only when that one was dropped. */
  altOf?: string;
};

const T = {
  revpar: /\bRevPAR\b/i,
  /** A RevPAR figure (value or change) in the headline. */
  revparLead: /\bRevPAR\b[^.;]{0,40}?[+\-−]?\$?\d/,
  supply: /\b(supply|pipeline|under construction|new (hotels?|rooms|keys)|openings?|rooms? (added|planned|proposed))\b/i,
  debt: /\b(debt|CMBS|loans?|refinanc\w*|maturit\w*|delinquen\w*|lenders?|special servicing|Treasury|10-year)\b/i,
  labor: /\b(labor|wages?|union|strikes?|staff\w*|workforce|workers?|employment|jobs|hiring|minimum wage|tipped)\b/i,
  demand: /\b(demand|visitors?|visitation|OCC|occupancy|RevPAR|passengers?|airport|room nights?|tourism)\b/i,
  guidance: /\b(guid\w*|outlook|raised|lowered|reaffirm\w*)\b/i,
  capital: /\b(bought|sold|acqui\w*|dispos\w*|buybacks?|repurchas\w*|maturing|maturit\w*|capital|transactions?)\b/i,
  debtDue: /\b(maturing|maturit\w*|debt)\b/i,
  deals: /\b(bought|sold|acqui\w*|dispos\w*|transactions?)\b/i,
  reported: /\b(RevPAR|ADR|occupancy)\b/i,
  price: /(per key|\/key|\$[\d.,]+\s?[MK]?)/i,
  grade: /\b(grade[ds]?|rubric)\b/i,
};

/**
 * Per item type, in display order; the first 4 that pass for an item are shown. Candidates after the
 * core set are backfill (they fill the list up to 4 when a core starter fails or there are only 3).
 */
export const ITEM_CANDIDATES: Record<ScopeKind, StarterCandidate[]> = {
  market: [
    { q: "How has RevPAR moved here over the last 12 months?", range: "12m", expect: ["revpar_metrics", "demand_visitation"], topic: T.revpar, lead: T.revparLead },
    { q: "How much new supply is coming?", expect: ["supply_pipeline"], topic: T.supply },
    { q: "What's happening with hotel debt here?", expect: ["debt_overlay"], topic: T.debt },
    { q: "Is labor a risk to the thesis here?", expect: ["talent_greenlight"], topic: T.labor },
    // backfill
    { q: "What's the RevPAR and occupancy read here?", expect: ["revpar_metrics", "demand_visitation"], topic: T.reported, lead: T.revparLead, altOf: "How has RevPAR moved here over the last 12 months?" },
    { q: "What's demand doing here?", expect: ["demand_visitation", "revpar_metrics"], topic: T.demand },
  ],
  reit: [
    { q: "What did they guide on the last call?", expect: ["reit_call"], topic: T.guidance },
    { q: "Where are they putting capital?", expect: ["reit_call"], topic: T.capital },
    { q: "How did RevPAR, ADR and occupancy move last quarter?", expect: ["reit_reported"], topic: T.reported },
    // backfill
    { q: "What debt is coming due?", expect: ["reit_call"], topic: T.debtDue, lead: T.debtDue },
    { q: "Which hotels have they bought or sold lately?", expect: ["reit_call"], topic: T.deals, lead: T.deals },
  ],
  deal: [
    { q: "What did the buyer pay per key, and how does that compare?", expect: ["deal_sale"], topic: T.price },
    { q: "Why did this grade the way it did?", expect: ["deal_grade"], topic: T.grade },
    { q: "What's demand doing in this market?", expect: ["demand_visitation", "revpar_metrics"], topic: T.demand },
  ],
};

/** Plain /chat: one starter per topic (markets, supply, debt, a REIT call); first verified option wins. */
export const GENERAL_CANDIDATES: { topic: string; options: StarterCandidate[] }[] = [
  {
    topic: "markets",
    options: [
      { q: "What's the RevPAR and occupancy read for Orlando?", expect: ["revpar_metrics", "demand_visitation"], topic: T.reported },
      { q: "What's the RevPAR and occupancy read for Nashville?", expect: ["revpar_metrics", "demand_visitation"], topic: T.reported },
    ],
  },
  {
    topic: "supply",
    options: [
      { q: "How much new supply is coming in Nashville?", expect: ["supply_pipeline"], topic: T.supply },
      { q: "How much new supply is coming in Austin?", expect: ["supply_pipeline"], topic: T.supply },
      { q: "How much new supply is coming in Orlando?", expect: ["supply_pipeline"], topic: T.supply },
    ],
  },
  {
    topic: "debt",
    options: [
      { q: "What's the national hotel debt and refinancing picture?", expect: ["debt_overlay", "rates"], topic: T.debt },
      { q: "Where are hotel CMBS delinquencies heading?", expect: ["debt_overlay"], topic: T.debt },
    ],
  },
  {
    topic: "reit call",
    options: [
      { q: "What did Host Hotels guide on the Q2 2026 call?", expect: ["reit_call"], topic: T.guidance },
      { q: "What did Pebblebrook guide on the Q2 2026 call?", expect: ["reit_call"], topic: T.guidance },
    ],
  },
];

export type VerifiedStarters = {
  verifiedAt: string;
  basis: string;
  /** Market slug → short display name (chip label), from the same graph read. */
  marketLabels?: Record<string, string>;
  general: Starter[];
  market: Record<string, Starter[]>;
  reit: Record<string, Starter[]>;
  deal: Record<string, Starter[]>;
  dropped: { scope: string; q: string; reason: string }[];
};

const V = verified as unknown as VerifiedStarters;

/** Verified starters for this chat (item ones when scoped, else the general four). */
export function startersFor(scope: ChatScope | null): Starter[] {
  if (!scope) return V.general ?? [];
  const table = V[scope.kind] ?? {};
  return (table[scope.id] ?? []).slice(0, 4);
}

export function marketLabel(slug: string): string | null {
  return V.marketLabels?.[slug] ?? null;
}
