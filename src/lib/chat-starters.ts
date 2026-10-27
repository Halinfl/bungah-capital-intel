/**
 * Starter questions for an empty chat. Only questions that scripts/chat/verify-starters.ts proved, at build
 * time, route to the expected intent and return a summary card with at least one key read for that item
 * are offered; the verified list lives in src/data/chat-starters.json (written by that script).
 */
import type { DateRange } from "./chat-brief";
import type { ChatIntent } from "./chat-intent";
import type { ChatScope, ScopeKind } from "./chat-scope";
import verified from "@/data/chat-starters.json";

export type Starter = { q: string; range?: DateRange };
export type StarterCandidate = Starter & { expect: ChatIntent[] };

/** Per item type, in display order (3–4 shown). */
export const ITEM_CANDIDATES: Record<ScopeKind, StarterCandidate[]> = {
  market: [
    { q: "How has RevPAR moved here over the last 12 months?", range: "12m", expect: ["revpar_metrics", "demand_visitation"] },
    { q: "How much new supply is coming?", expect: ["supply_pipeline"] },
    { q: "What's happening with hotel debt here?", expect: ["debt_overlay"] },
    { q: "Is labor a risk to the thesis here?", expect: ["talent_greenlight"] },
  ],
  reit: [
    { q: "What did they guide on the last call?", expect: ["reit_call"] },
    { q: "Where are they putting capital?", expect: ["reit_call"] },
    { q: "How did RevPAR, ADR and occupancy move last quarter?", expect: ["reit_reported"] },
  ],
  deal: [
    { q: "What did the buyer pay per key, and how does that compare?", expect: ["deal_sale"] },
    { q: "Why did this grade the way it did?", expect: ["deal_grade"] },
    { q: "What's demand doing in this market?", expect: ["demand_visitation", "revpar_metrics"] },
  ],
};

/** Plain /chat: one starter per topic (markets, supply, debt, a REIT call); first verified option wins. */
export const GENERAL_CANDIDATES: { topic: string; options: StarterCandidate[] }[] = [
  {
    topic: "markets",
    options: [
      { q: "What's the RevPAR and occupancy read for Orlando?", expect: ["revpar_metrics", "demand_visitation"] },
      { q: "What's the RevPAR and occupancy read for Nashville?", expect: ["revpar_metrics", "demand_visitation"] },
    ],
  },
  {
    topic: "supply",
    options: [
      { q: "How much new supply is coming in Nashville?", expect: ["supply_pipeline"] },
      { q: "How much new supply is coming in Austin?", expect: ["supply_pipeline"] },
      { q: "How much new supply is coming in Orlando?", expect: ["supply_pipeline"] },
    ],
  },
  {
    topic: "debt",
    options: [
      { q: "What's the national hotel debt and refinancing picture?", expect: ["debt_overlay", "rates"] },
      { q: "Where are hotel CMBS delinquencies heading?", expect: ["debt_overlay"] },
    ],
  },
  {
    topic: "reit call",
    options: [
      { q: "What did Host Hotels guide on the Q2 2026 call?", expect: ["reit_call"] },
      { q: "What did Pebblebrook guide on the Q2 2026 call?", expect: ["reit_call"] },
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
