import scorecardJson from "@/data/sound-assets/scorecard.json";
import sourcesJson from "@/data/sound-assets/sources.json";
import registerJson from "@/data/sound-assets/evidence-register.json";
import btcJson from "@/data/sound-assets/btc-protocol.json";
import macroManifest from "@/data/sound-assets/primary/manifest.json";
import macroDerived from "@/data/sound-assets/macro-derived.json";
import publishStatus from "@/data/sound-assets/publish-status.json";

export type Source = { title: string; publisher: string; url: string; accessed: string };
export type Cell = {
  asset: string;
  criterion: string;
  score: number;
  label: string;
  rationale: string;
  evidence: string[];
  scored_on: string;
};
export type RegisterEntry = {
  id: string;
  claim: string;
  direction: "supports" | "opposes";
  strength: string;
  evidence_uri: string;
  source_title: string;
  source_publisher: string;
  added_on: string;
};

export const SOURCES = sourcesJson as Record<string, Source>;
export const SCORECARD = scorecardJson as {
  status: string;
  scored_on: string;
  scale: { min: number; max: number; labels: Record<string, string>; direction: string };
  assets: { id: string; name: string }[];
  criteria: { id: string; name: string; definition: string }[];
  cells: Cell[];
  btc_weak_spots: { label: string; detail: string; evidence: string[] }[];
};
export const REGISTER = registerJson as {
  note: string;
  entries: RegisterEntry[];
  gaps?: { item: string; reason: string; url: string; logged_on: string }[];
};
export const BTC = btcJson;
export const MACRO = macroManifest;
export const MACRO_DERIVED = macroDerived;

export function cell(asset: string, criterion: string): Cell {
  const c = SCORECARD.cells.find((x) => x.asset === asset && x.criterion === criterion);
  if (!c) throw new Error(`missing scorecard cell ${asset}/${criterion}`);
  return c;
}

export function src(id: string): Source {
  const s = SOURCES[id];
  if (!s) throw new Error(`missing source ${id}`);
  return s;
}

/** Years since the genesis block, computed from its block timestamp (one decimal). */
export function btcHistoryYears(now = new Date()): string {
  const g = new Date(BTC.genesis.timestamp_utc).getTime();
  return ((now.getTime() - g) / (365.2425 * 86400_000)).toFixed(1);
}

export function fmtDate(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

export const HOLDINGS_PLACEHOLDER = "[Holdings disclosure pending, Hal to supply]";
/** Holdings wording from publish-status.json; null until Hal supplies it (production build is blocked until then). */
export const HOLDINGS_DISCLOSURE: string | null = publishStatus.holdings_disclosure;
/** DRAFT markers render only while drafts is true (production build is blocked until it is false). */
export const SHOW_DRAFTS: boolean = publishStatus.drafts;
