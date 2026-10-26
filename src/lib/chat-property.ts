/**
 * Named-hotel recognition for Chat (property / asset intent).
 *
 * Hotels come from the REIT property schedules already on the site (src/data/reits/market-owners.json,
 * SEC 10-K / filing schedules), plus curated public-source fact files in src/data/properties/.
 * Deterministic: longest whole-phrase name match wins; no fuzzy guessing.
 */
import owners from "@/data/reits/market-owners.json";
import snapshot from "@/data/reits/snapshot.json";
import hiltonLbv from "@/data/properties/hilton-orlando-lake-buena-vista.json";
import type { PropertyMatch } from "./chat-brief-build";

type OwnerHotel = { name: string; city: string | null; state: string | null; rooms: number | null; url: string; source: string; ticker: string };
type OwnerComp = PropertyMatch["comps"][number] & { city?: string | null; state?: string | null };
type OwnersFile = Record<string, { hotels: OwnerHotel[]; comps: OwnerComp[] }>;
type Curated = NonNullable<PropertyMatch["curated"]> & { aliases: string[]; marketSlug: string; ownerTicker: string };

const CURATED: Curated[] = [hiltonLbv as Curated];

const REIT_NAMES: Record<string, string> = Object.fromEntries(
  (snapshot as { reits: { ticker: string; name: string }[] }).reits.map((r) => [r.ticker, r.name])
);

function normalize(s: string): string {
  return ` ${s
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()} `;
}

type Entry = { key: string; hotel: OwnerHotel; marketSlug: string };

let INDEX: Entry[] | null = null;
function index(): Entry[] {
  if (INDEX) return INDEX;
  const out: Entry[] = [];
  const file = owners as unknown as OwnersFile;
  for (const [slug, v] of Object.entries(file)) {
    for (const h of v.hotels) {
      const key = normalize(h.name);
      // Specific names only: at least two words and 12 characters ("Hyatt Place Orlando" yes, "The Westin" no).
      if (key.trim().split(" ").length < 2 || key.trim().length < 12) continue;
      out.push({ key, hotel: h, marketSlug: slug });
    }
  }
  INDEX = out.sort((a, b) => b.key.length - a.key.length);
  return INDEX;
}

/** The named hotel in a question, or null. Ambiguous names (same name, different owners) are skipped. */
export function matchProperty(question: string): PropertyMatch | null {
  const q = normalize(question);
  const curated = CURATED.find((c) => c.aliases.some((a) => q.includes(normalize(a))));
  let hit: Entry | undefined;
  if (curated) {
    hit = index().find((e) => e.key === normalize(curated.name) && e.hotel.ticker === curated.ownerTicker);
  }
  if (!hit) {
    const found = index().filter((e) => q.includes(e.key));
    if (!found.length) return null;
    const best = found[0];
    const same = found.filter((e) => e.key === best.key);
    if (new Set(same.map((e) => e.hotel.ticker)).size > 1 || same.length > 1) return null;
    hit = best;
  }
  const file = owners as unknown as OwnersFile;
  const name = hit.hotel.name;
  const nk = normalize(name);
  const comps = (file[hit.marketSlug]?.comps ?? []).filter((c) => normalize(c.hotel).includes(nk));
  return {
    name,
    marketSlug: hit.marketSlug,
    rooms: hit.hotel.rooms,
    ticker: hit.hotel.ticker,
    reitName: REIT_NAMES[hit.hotel.ticker] ?? hit.hotel.ticker,
    url: hit.hotel.url,
    source: hit.hotel.source,
    comps,
    curated: curated && curated.ownerTicker === hit.hotel.ticker ? curated : null,
  };
}
