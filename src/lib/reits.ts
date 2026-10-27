/**
 * REITs section: reported quarterly metrics for the 13 listed US hotel REITs, read from a static JSON
 * snapshot committed in src/data/reits (no database reads or writes). Every reported value carries the
 * SEC filing it came from. Captured (Google Hotels) columns are empty until the first weekly property
 * capture runs; nothing is filled in before then.
 */
import snapshot from "@/data/reits/snapshot.json";
import overlay from "@/data/reits/guidance-overlay.json";
import panelSummary from "@/data/reits/panel-summary.json";
import type { CapturedCell, Guidance, PanelCapture, Reit } from "@/lib/reits-shared";
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

/**
 * Weekly REIT property panel (Google Hotels), exported by scripts/reits/export_panel_summary.py after a Tuesday capture.
 * The committed file is `null` until the first capture, and every captured field stays absent until then.
 */
type PanelReit = {
  medianRate: number | null;
  thin: boolean;
  nUsed: number;
  priced: number;
  of: number | null;
  panelHotels: number;
  cells: CapturedCell[];
  hotelRates: Record<string, number>;
};
type PanelFile = (PanelCapture & { reits: Record<string, PanelReit> }) | null;
const PANEL = panelSummary as unknown as PanelFile;

/** The latest REIT panel capture (date, stay, method link), or null before the first capture. */
export const REITS_PANEL: PanelCapture | null = PANEL
  ? { captureDate: PANEL.captureDate, methodVersion: PANEL.methodVersion, listVersion: PANEL.listVersion, methodUrl: PANEL.methodUrl, headline: PANEL.headline, thinBelow: PANEL.thinBelow }
  : null;

function withCapture(r: Reit): Reit {
  const p = PANEL?.reits[r.ticker];
  if (!PANEL || !p) return r;
  return {
    ...r,
    captured: {
      date: PANEL.captureDate,
      trackingGapPct: null, // computed only once a quarter's captures and its reported ADR both exist
      medianRate: p.thin ? null : p.medianRate,
      thin: p.thin,
      nUsed: p.nUsed,
      priced: p.priced,
      of: p.of ?? r.properties.length,
      cells: p.cells,
    },
    // Rates join on the hotel name; a name filed twice by the same REIT (e.g. two "Hampton Phoenix") gets no rate.
    properties: r.properties.map((h) =>
      p.hotelRates[h.name] != null && r.properties.filter((x) => x.name === h.name).length === 1 ? { ...h, rate: p.hotelRates[h.name] } : h
    ),
  };
}

export const REITS_AS_OF = S.as_of_label;
export const REITS_QUARTERS = S.target_quarters;
/** ISO date of the first weekly property capture (Tuesday). */
export const REITS_FIRST_CAPTURE = S.first_capture;
/** False until the weekly property panel has run at least once. */
export const REITS_HAS_CAPTURES = PANEL != null;
export const REITS_UNIVERSE = S.universe;

const ALL = S.reits.map(withCapture);

export function reits(): Reit[] {
  return ALL;
}

export function reitByTicker(ticker: string): Reit | null {
  return ALL.find((r) => r.ticker.toLowerCase() === ticker.toLowerCase()) ?? null;
}

/** Each REIT's next announced earnings call (or results release, where no call is announced), soonest first. */
export function nextCalls() {
  return S.reits
    .filter((r) => r.nextCall)
    .map((r) => ({ ticker: r.ticker, name: r.name, ...r.nextCall! }))
    .sort((a, b) => a.date.localeCompare(b.date) || a.ticker.localeCompare(b.ticker));
}
