/**
 * Unscoped deal-name matching for Chat ("Tell me about The Wade"). Small and self-contained on purpose: it only reads
 * the deals data and returns a sale slug; chat-llm.ts decides whether to answer with the deal card.
 *
 * Aliases come from each sale's property name: the full name, the part before any "(...)", a "(former X)" name, and the
 * name without a leading "The" when at least two words remain. An alias must be at least two words, and must appear as
 * a whole phrase (case-insensitive), so "The Wade" matches but "wade" or "the hotel" alone never do.
 */
import { sales } from "@/lib/deals";

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9&' ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function dealAliases(property: string): string[] {
  const out = new Set<string>();
  const add = (a: string) => {
    const n = norm(a);
    if (n.split(" ").length >= 2) out.add(n);
  };
  add(property);
  const base = property.replace(/\s*\(.*?\)\s*/g, " ").trim();
  add(base);
  const former = property.match(/\(former ([^)]+)\)/i);
  if (former) add(former[1]);
  // Trailing property-type words: "The Bellmoor Inn & Spa" -> "The Bellmoor", "Tideline Palm Beach Resort" -> "Tideline Palm Beach".
  const bare = base.replace(/\s+(inn & spa|inn and spa|resort & spa|resort|hotel|inn)$/i, "");
  add(bare);
  for (const a of [property, base, bare]) if (/^the\s/i.test(a)) add(a.replace(/^the\s+/i, ""));
  return [...out];
}

let INDEX: { slug: string; alias: string }[] | null = null;
function index() {
  if (!INDEX) INDEX = sales().flatMap((s) => dealAliases(s.property).map((alias) => ({ slug: s.slug, alias })));
  return INDEX;
}

/** Slug of the one deal whose name the question contains (longest alias wins); null if none or ambiguous. */
export function matchDealName(question: string): string | null {
  const q = ` ${norm(question)} `;
  const hits = index().filter((x) => q.includes(` ${x.alias} `));
  if (!hits.length) return null;
  const best = Math.max(...hits.map((h) => h.alias.length));
  const slugs = new Set(hits.filter((h) => h.alias.length === best).map((h) => h.slug));
  return slugs.size === 1 ? [...slugs][0] : null;
}

/** Market-metric words: a question naming a deal but asking about these is left to the market answer. */
export const MARKET_TOPIC = /\b(revpar|occupancy|adr|pipeline|supply|demand|debt wall|talent|radar|radars|weather|airlift|forecast)\b/i;
