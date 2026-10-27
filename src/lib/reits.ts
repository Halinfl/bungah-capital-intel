/**
 * REITs section: reported quarterly metrics for the 13 listed US hotel REITs, read from a static JSON
 * snapshot committed in src/data/reits (no database reads or writes). Every reported value carries the
 * SEC filing it came from. Captured (Google Hotels) columns are empty until the first weekly property
 * capture runs; nothing is filled in before then.
 */
import snapshot from "@/data/reits/snapshot.json";
import overlay from "@/data/reits/guidance-overlay.json";
import type { Guidance, Reit } from "@/lib/reits-shared";
export * from "@/lib/reits-shared";

type Snapshot = {
  built: string;
  as_of_label: string;
  target_quarters: string[];
  first_capture: string;
  captured: null;
  universe: { hotels: number | null; rooms: number | null; hotels_source: string };
  reits: Reit[];
};

const S = applyGuidanceOverlay(snapshot as unknown as Snapshot);

/**
 * Guidance corrections read from the cited SEC exhibits (src/data/reits/guidance-overlay.json): a missing
 * guided period, and releases newer than the cohort CSVs. Applied on load so a snapshot rebuild keeps them.
 */
function applyGuidanceOverlay(s: Snapshot): Snapshot {
  const o = overlay as { periods: { ticker: string; date: string; period: string }[]; add: (Guidance & { ticker: string })[] };
  return {
    ...s,
    reits: s.reits.map((r) => {
      const fix = o.periods.filter((p) => p.ticker === r.ticker);
      const add = o.add.filter((a) => a.ticker === r.ticker && !r.guidance.some((g) => g.date === a.date));
      if (!fix.length && !add.length) return r;
      const guidance = [
        ...r.guidance.map((g) => {
          const f = fix.find((p) => p.date === g.date);
          return f && !g.period ? { ...g, period: f.period } : g;
        }),
        ...add.map((a) => ({ date: a.date, period: a.period, url: a.url, source: a.source, items: a.items })),
      ].sort((a, b) => a.date.localeCompare(b.date));
      return { ...r, guidance };
    }),
  };
}

export const REITS_AS_OF = S.as_of_label;
export const REITS_QUARTERS = S.target_quarters;
/** ISO date of the first weekly property capture (Tuesday). */
export const REITS_FIRST_CAPTURE = S.first_capture;
/** False until the weekly property panel has run at least once. */
export const REITS_HAS_CAPTURES = S.captured != null;
export const REITS_UNIVERSE = S.universe;

export function reits(): Reit[] {
  return S.reits;
}

export function reitByTicker(ticker: string): Reit | null {
  return S.reits.find((r) => r.ticker.toLowerCase() === ticker.toLowerCase()) ?? null;
}

/** Each REIT's next announced earnings call (or results release, where no call is announced), soonest first. */
export function nextCalls() {
  return S.reits
    .filter((r) => r.nextCall)
    .map((r) => ({ ticker: r.ticker, name: r.name, ...r.nextCall! }))
    .sort((a, b) => a.date.localeCompare(b.date) || a.ticker.localeCompare(b.ticker));
}
