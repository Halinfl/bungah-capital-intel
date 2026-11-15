/**
 * Cited FAA / airlift / airport / air-travel signals (green/public only).
 * Vectra's pack lives at bungah-audit/groq-prod/signals/airlift/airlift-signals.json during authoring
 * and is shipped as src/data/airlift-signals.json so the preview runtime has the file.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { isLicensedText } from "./licensed-sources";
import { isYellowSource } from "./yellow-sources";

export type AirliftSignal = {
  market: string;
  date?: string | null;
  headline: string;
  fact: string;
  source: string;
  url: string;
  as_of: string;
};

export const AIRLIFT_QUESTION =
  /\b(faa|airlift|air[- ]?travel|airports?|flights?)\b/i;

export function isAirliftQuestion(question: string): boolean {
  return AIRLIFT_QUESTION.test(question);
}

const SHIPPED = path.join(process.cwd(), "src/data/airlift-signals.json");
const AUDIT = "/workspace/bungah-audit/groq-prod/signals/airlift/airlift-signals.json";

function readJson(file: string): unknown {
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function asRows(raw: unknown): AirliftSignal[] {
  const list = Array.isArray(raw) ? raw : raw && typeof raw === "object" && Array.isArray((raw as { signals?: unknown }).signals) ? (raw as { signals: unknown[] }).signals : [];
  const out: AirliftSignal[] = [];
  for (const row of list) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const headline = String(r.headline ?? "").trim();
    const fact = String(r.fact ?? "").trim();
    const source = String(r.source ?? "").trim();
    const url = String(r.url ?? "").trim();
    const as_of = String(r.as_of ?? r.asOf ?? r.date ?? "").trim();
    const market = String(r.market ?? "national").trim() || "national";
    if (!headline && !fact) continue;
    if (!source && !url) continue;
    out.push({
      market,
      date: r.date != null ? String(r.date) : null,
      headline,
      fact,
      source,
      url,
      as_of,
    });
  }
  return out;
}

/** Green-only: drop licensed or yellow-unconfirmed sources. */
export function loadAirliftSignals(): AirliftSignal[] {
  const shipped = asRows(readJson(SHIPPED));
  const audit = asRows(readJson(process.env.BUNGAH_AIRLIFT_SIGNALS?.trim() || AUDIT));
  const seen = new Set<string>();
  const out: AirliftSignal[] = [];
  for (const row of [...shipped, ...audit]) {
    const blob = `${row.headline} ${row.fact} ${row.source} ${row.url}`;
    if (isLicensedText(blob) || isYellowSource(row.source, row.url)) continue;
    const key = `${row.market}|${row.headline}|${row.as_of}|${row.url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

export type AirliftFact = {
  title: string;
  body: string;
  sourceLabel: string;
  sourceUrls: { url: string; label: string }[];
  asOf: string;
  kind: "airlift";
  magnitude: null;
};

function toFact(row: AirliftSignal): AirliftFact {
  return {
    title: row.headline,
    body: row.fact,
    sourceLabel: row.source,
    sourceUrls: row.url ? [{ url: row.url, label: row.source }] : [],
    asOf: row.as_of || row.date || "date not on file",
    kind: "airlift",
    magnitude: null,
  };
}

function normMarket(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function airliftFactsFor(question: string, marketSlug?: string | null, marketName?: string | null): { national: AirliftFact[]; market: AirliftFact[] } {
  if (!isAirliftQuestion(question)) return { national: [], market: [] };
  const rows = loadAirliftSignals();
  const slug = normMarket(marketSlug ?? "");
  const name = normMarket(marketName ?? "");
  const national: AirliftFact[] = [];
  const market: AirliftFact[] = [];
  for (const row of rows) {
    const m = normMarket(row.market || "national");
    const isNat = !m || m === "national" || m === "us" || m === "united-states";
    if (isNat) national.push(toFact(row));
    else if (slug && (m === slug || m.includes(slug) || slug.includes(m))) market.push(toFact(row));
    else if (name && (m === name || m.includes(name) || name.includes(m))) market.push(toFact(row));
  }
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
