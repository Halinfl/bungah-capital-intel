/**
 * Cited FAA / airlift / airport / air-travel signals (green/public only).
 * Reads every airlift-signals*.json in src/data and (locally) the audit signals folder,
 * so Vectra batch-2 files (airlift-signals-b2.json) are picked up automatically.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { isLicensedText } from "./licensed-sources";
import { isYellowSource } from "./yellow-sources";

export type AirliftSignal = {
  id?: string;
  market: string;
  airport_code?: string | null;
  category?: string | null;
  date?: string | null;
  headline: string;
  fact: string;
  source: string;
  url: string;
  as_of: string;
  status?: string | null;
  scope?: string | null;
};

/** Topic words, plus 'passengers'. Airport codes and names are matched separately. */
export const AIRLIFT_QUESTION =
  /\b(faa|airlift|air[- ]?travel|airports?|flights?|ground[\s-]?stop|air traffic|newark cap|passengers?|enplanements?)\b/i;

/** Airport codes in the shipped packs, plus common names (Dulles, O'Hare, Reagan, …). */
export const AIRPORT_ALIASES: Record<string, string[]> = {
  IAD: ["dulles", "washington dulles"],
  DCA: ["reagan", "reagan national", "washington national"],
  ORD: ["o'hare", "ohare", "o hare"],
  MDW: ["midway"],
  MCO: ["orlando international"],
  EWR: ["newark"],
  JFK: ["kennedy"],
  LGA: ["laguardia"],
  LAX: ["los angeles international"],
  SFO: ["san francisco international"],
  SEA: ["seatac", "sea-tac"],
  ATL: ["hartsfield"],
  DFW: ["dallas fort worth", "dallas/fort worth"],
  IAH: ["intercontinental", "bush intercontinental"],
  HOU: ["hobby"],
  BOS: ["logan"],
  MIA: ["miami international"],
  BNA: ["nashville international"],
  PHL: ["philadelphia international"],
  PHX: ["sky harbor"],
  LAS: ["harry reid", "mccarran"],
  SAN: ["san diego international"],
  HNL: ["honolulu international", "daniel k inouye"],
  TPA: ["tampa international"],
  AUS: ["austin bergstrom", "bergstrom"],
  DTW: ["detroit metro", "wayne county"],
  MSP: ["minneapolis saint paul", "minneapolis-st paul", "minneapolis-st. paul"],
  PBI: ["palm beach international"],
  FLL: ["fort lauderdale-hollywood", "fort lauderdale hollywood", "fort lauderdale airport", "fort lauderdale international"],
};

export function airportMentionedIn(question: string, code?: string | null): boolean {
  const q = question.toLowerCase();
  const codes = code ? [code.toUpperCase()] : Object.keys(AIRPORT_ALIASES);
  for (const c of codes) {
    if (!c) continue;
    if (new RegExp("\\b" + c.replace(/[^A-Z0-9]/g, "") + "\\b", "i").test(question)) return true;
    for (const alias of AIRPORT_ALIASES[c] ?? []) {
      if (alias && q.includes(alias.toLowerCase())) return true;
    }
  }
  return false;
}

export function isAirliftQuestion(question: string): boolean {
  return AIRLIFT_QUESTION.test(question) || airportMentionedIn(question);
}

const SHIPPED_DIR = path.join(process.cwd(), "src/data");
const AUDIT_DIR = "/workspace/bungah-audit/groq-prod/signals/airlift";

function jsonFilesIn(dir: string): string[] {
  if (!dir || !existsSync(dir)) return [];
  try {
    return readdirSync(dir)
      .filter((n) => /^airlift-signals.*\.json$/i.test(n))
      .map((n) => path.join(dir, n));
  } catch {
    return [];
  }
}

function readJson(file: string): unknown {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function asRows(raw: unknown): AirliftSignal[] {
  const list = Array.isArray(raw)
    ? raw
    : raw && typeof raw === "object" && Array.isArray((raw as { signals?: unknown }).signals)
      ? (raw as { signals: unknown[] }).signals
      : [];
  const out: AirliftSignal[] = [];
  for (const row of list) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const headline = String(r.headline ?? "").trim();
    const fact = String(r.fact ?? "").trim();
    const source = String(r.source ?? "").trim();
    const url = String(r.url ?? "").trim();
    const as_of = String(r.as_of ?? r.asOf ?? r.date ?? "").trim();
    const market = String(r.market ?? "").trim();
    const scope = r.scope != null ? String(r.scope) : null;
    if (!headline && !fact) continue;
    if (!source && !url) continue;
    out.push({
      id: r.id != null ? String(r.id).trim() : undefined,
      market,
      airport_code: r.airport_code != null ? String(r.airport_code) : null,
      category: r.category != null ? String(r.category) : null,
      date: r.date != null ? String(r.date) : null,
      headline,
      fact,
      source,
      url,
      as_of,
      status: r.status != null ? String(r.status) : null,
      scope,
    });
  }
  return out;
}

/** Every airlift pack file the loader reads at runtime (shipped, env dir, audit dir), de-duplicated. */
export function airliftPackFiles(): string[] {
  const dirs = [SHIPPED_DIR, process.env.BUNGAH_AIRLIFT_DIR?.trim() || "", AUDIT_DIR].filter(Boolean);
  const files: string[] = [];
  const seenPath = new Set<string>();
  for (const dir of dirs) {
    for (const f of jsonFilesIn(dir)) {
      if (seenPath.has(f)) continue;
      seenPath.add(f);
      files.push(f);
    }
  }
  return files;
}

export function loadAirliftSignals(): AirliftSignal[] {
  const files = airliftPackFiles();
  const seen = new Set<string>();
  const out: AirliftSignal[] = [];
  for (const file of files) {
    for (const row of asRows(readJson(file))) {
      const blob = `${row.headline} ${row.fact} ${row.source} ${row.url}`;
      if (isLicensedText(blob) || isYellowSource(row.source, row.url)) continue;
      const key = row.id ? `id:${row.id}` : `${row.market}|${row.headline}|${row.as_of}|${row.url}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(row);
    }
  }
  return applyAirliftSupersedes(out);
}

/** Later batches replace specific earlier ids (Vectra: was-003 replaces was-001, orl-004 replaces orl-002). */
export const AIRLIFT_SUPERSEDES: Record<string, string> = {
  "airlift-was-001": "airlift-was-003",
  "airlift-orl-002": "airlift-orl-004",
};

export function applyAirliftSupersedes(rows: AirliftSignal[]): AirliftSignal[] {
  const present = new Set(rows.map((r) => r.id).filter((id): id is string => Boolean(id)));
  return rows.filter((r) => {
    if (!r.id) return true;
    const replacement = AIRLIFT_SUPERSEDES[r.id];
    return !(replacement && present.has(replacement));
  });
}

export type AirliftFact = {
  title: string;
  body: string;
  sourceLabel: string;
  sourceUrls: { url: string; label: string }[];
  asOf: string;
  kind: "airlift";
  magnitude: string | null;
};

function toFact(row: AirliftSignal): AirliftFact {
  const extra = [
    row.airport_code ? `airport ${row.airport_code}` : "",
    row.status ? `status: ${row.status}` : "",
    row.date ? `event date: ${row.date}` : "",
  ]
    .filter(Boolean)
    .join("; ");
  const body = extra ? `${row.fact} (${extra})` : row.fact;
  return {
    title: row.headline,
    body,
    sourceLabel: row.source,
    sourceUrls: row.url ? [{ url: row.url, label: row.source }] : [],
    asOf: row.as_of || row.date || "date not on file",
    kind: "airlift",
    magnitude: null,
  };
}

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const NAME_TO_SLUG: Record<string, string> = {
  "new-york": "new-york-city",
  "new-york-city": "new-york-city",
  nyc: "new-york-city",
  "washington-dc": "washington-dc",
  "washington-d-c": "washington-dc",
  dc: "washington-dc",
  "las-vegas": "las-vegas",
  vegas: "las-vegas",
  "san-francisco": "san-francisco-bay",
  "san-francisco-bay": "san-francisco-bay",
  "los-angeles": "los-angeles",
};

/** Row markets that are their own covered market and must never ride along with a neighbor's slug. */
const OTHER_MARKET_ROW = /^(palm-beach|west-palm-beach|fort-lauderdale|broward)$/;

function isNational(row: AirliftSignal): boolean {
  const m = norm(row.market || "");
  const scope = (row.scope || "").toLowerCase();
  return scope === "national" || !m || m === "national" || m === "us" || m === "united-states";
}

function marketMatches(row: AirliftSignal, slug?: string | null, name?: string | null): boolean {
  if (isNational(row)) return false;
  const m = norm(row.market);
  const mapped = NAME_TO_SLUG[m] || m;
  const s = norm(slug ?? "");
  const n = norm(name ?? "");
  const sMapped = NAME_TO_SLUG[s] || s;
  const nMapped = NAME_TO_SLUG[n] || n;
  // r10 (Eric r9 Miami/FLL/PBI): a row belongs to exactly one market. Its market must BE this market (slug, mapped
  // name, or the first segment of the market's name, e.g. "Miami" for "Miami–Fort Lauderdale–West Palm Beach MSA"),
  // never a substring of it: a "Palm Beach" (PBI) row must not attach to the Miami MSA because the MSA name lists it.
  const firstOf = (x: string) => x.split("-msa")[0];
  return Boolean(
    (s && (mapped === s || mapped === sMapped || (m.length >= 4 && s.startsWith(m + "-") && !OTHER_MARKET_ROW.test(m)))) ||
      (n && (mapped === n || mapped === nMapped || firstOf(n) === mapped || (m.length >= 4 && n.startsWith(m + "-"))))
  );
}

export function airliftFactsFor(
  question: string,
  marketSlug?: string | null,
  marketName?: string | null
): { national: AirliftFact[]; market: AirliftFact[] } {
  if (!isAirliftQuestion(question)) return { national: [], market: [] };
  const rows = loadAirliftSignals();
  const national: AirliftFact[] = [];
  const market: AirliftFact[] = [];
  for (const row of rows) {
    if (isNational(row)) national.push(toFact(row));
    else if (marketMatches(row, marketSlug, marketName) || airportMentionedIn(question, row.airport_code)) market.push(toFact(row));
  }
  // A national FAA question with no matched market still gets the national facts (and not every city row).
  return { national, market };
}

/** Shape compatible with Prisma Signal rows so retrieval can unshift these into the graph context. */
export function asSignalRow(fact: AirliftFact, marketId: string | null = null) {
  return {
    id: `airlift:${fact.asOf}:${fact.title}`.slice(0, 80),
    marketId,
    kind: fact.kind,
    title: fact.title,
    body: fact.body,
    magnitude: fact.magnitude,
    asOf: fact.asOf,
    sourceLabel: fact.sourceLabel,
    sourceUrls: fact.sourceUrls,
    createdAt: new Date(0),
  };
}
