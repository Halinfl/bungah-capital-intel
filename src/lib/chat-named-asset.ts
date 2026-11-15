/**
 * Named-asset handling for Chat (Harvey): if we recognize a property and have no cited facts,
 * answer with a fixed sentence and do not echo the user's characterization (e.g. "foreclosure").
 * When facts are on file, use only approved neutral litigation wording — never "in foreclosure".
 */
import type { GraphContext } from "./chat";

export const NO_PROPERTY_FACTS = "I don't have cited information on that property.";
export const SHOWBOAT_NEUTRAL_WORDING = "the subject of reported lender or court proceedings";

type KnownAsset = {
  id: string;
  /** Whole-word / phrase test on the raw question. */
  test: (q: string) => boolean;
  marketSlug: string | null;
  token: string;
};

const KNOWN: KnownAsset[] = [
  {
    id: "showboat",
    // Atlantic City Showboat; not the General Jackson Showboat (Nashville entertainment vessel).
    test: (q) => /\bshowboat\b/i.test(q) && !/general\s+jackson/i.test(q),
    marketSlug: "atlantic-city",
    token: "showboat",
  },
];

export type NamedAssetHit = {
  id: string;
  marketSlug: string | null;
  hasFacts: boolean;
};

function packMentions(ctx: GraphContext, token: string): boolean {
  const t = token.toLowerCase();
  const blob = (rows: { title?: string | null; body?: string | null; name?: string | null }[]) =>
    rows.some((r) => `${r.title ?? ""} ${r.body ?? ""} ${r.name ?? ""}`.toLowerCase().includes(t));
  if (ctx.matched && (ctx.matched.slug === "atlantic-city" || blob(ctx.matched.signals) || blob(ctx.matched.assets))) {
    if (blob(ctx.matched.signals) || blob(ctx.matched.assets) || ctx.matched.name.toLowerCase().includes(t)) {
      // A market match alone is not a fact about the property.
    }
  }
  if (blob(ctx.nationalSignals)) return true;
  if (ctx.matched && (blob(ctx.matched.signals) || blob(ctx.matched.assets))) return true;
  for (const m of ctx.secondary) {
    if (blob(m.signals) || blob(m.assets)) return true;
  }
  return false;
}

export function resolveNamedAsset(question: string, ctx: GraphContext): NamedAssetHit | null {
  for (const a of KNOWN) {
    if (!a.test(question)) continue;
    return { id: a.id, marketSlug: a.marketSlug, hasFacts: packMentions(ctx, a.token) };
  }
  return null;
}
