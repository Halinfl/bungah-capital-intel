/**
 * Retrieval pack sent to Groq: green/public cited rows and our derived score buckets only.
 * No STR/CoStar or other licensed raw figures. Yellow → bucket only; red → skip the factor and say so.
 * A few facts, each with source name, link, and as-of date. No whole tables.
 */
import type { GraphContext, MarketRow } from "./chat";
import { isLicensedText, withoutLicensedSources, withoutLicensedSnapshot } from "./licensed-sources";
import { parseSourceUrls } from "./source-links";

export const LLM_PACK_MAX_FACTS = 8;

const RED_NOTICE =
  /republication prohibited|reproduction prohibited|not for republication|proprietary and confidential|confidential\b.{0,40}(not for|do not) (copy|distribute|reproduce)/i;

export type LlmPack = {
  pack: string;
  citations: string[];
  factCount: number;
  redSkipped: string[];
};

type FactRow = {
  title?: string | null;
  body?: string | null;
  sourceLabel?: string | null;
  sourceUrls?: unknown;
  magnitude?: string | null;
  asOf?: string | null;
  kind?: string | null;
};


/** Prefer the canonical Host Q2 2026 8-K earnings-release label when that is the source. */
function displaySourceLabel(row: FactRow, url: string, fallback: string): string {
  const blob = `${row.sourceLabel ?? ""} ${url}`;
  if (/1070750|hst-ex991|hst-20260805/i.test(blob) || (/host hotels/i.test(blob) && /8-?k|earnings release/i.test(blob))) {
    return "Q2 2026 8-K earnings release";
  }
  return fallback;
}

function firstLink(row: FactRow): { url: string; label: string } | null {
  const links = parseSourceUrls(row.sourceUrls);
  return links[0] ?? null;
}

function isRed(row: FactRow): boolean {
  const text = `${row.title ?? ""} ${row.body ?? ""} ${row.sourceLabel ?? ""} ${row.magnitude ?? ""}`;
  return RED_NOTICE.test(text);
}

/** A derived score bucket: qualitative band, no raw totals or ratios to quote as licensed figures. */
function isBucketOnly(text: string): boolean {
  return /\b(score )?bucket\b|\bband\b:\s*(in line|cheap|rich|low|moderate|high|tight|loose)\b/i.test(text);
}

function formatFact(row: FactRow, prefix: string): string | null {
  if (isRed(row)) return null;
  const blob = `${row.title ?? ""} ${row.body ?? ""} ${row.sourceLabel ?? ""} ${row.magnitude ?? ""}`;
  if (isLicensedText(blob) && !isBucketOnly(`${row.title ?? ""} ${row.body ?? ""} ${row.magnitude ?? ""}`)) {
    return null;
  }
  const link = firstLink(row);
  // Harvey: if there's no source, the model must say it doesn't know — omit unsourced rows from the pack.
  if (!link && !row.sourceLabel) return null;
  const asOf = (row.asOf ?? "").trim() || "date not on file";
  const source = displaySourceLabel(row, link?.url ?? "", (row.sourceLabel ?? link?.label ?? "source").trim());
  const url = link?.url ?? "";
  const mag = (row.magnitude ?? "").trim();
  const body = (row.body ?? "").replace(/\s+/g, " ").trim();
  const title = (row.title ?? "").trim();
  const kind = row.kind ? `[${row.kind}] ` : "";
  const src = url ? `${source} | ${url} | as-of ${asOf}` : `${source} | as-of ${asOf}`;
  return `- ${prefix}${kind}${title}${mag ? ` | ${mag}` : ""}${body ? ` — ${body}` : ""} (source: ${src})`.replace(/\s+/g, " ");
}

function takeFacts(rows: FactRow[], citations: Set<string>, redSkipped: string[], budget: { left: number }): string[] {
  const clean = withoutLicensedSources(rows);
  const lines: string[] = [];
  for (const row of clean) {
    if (budget.left <= 0) break;
    if (isRed(row)) {
      redSkipped.push((row.title ?? row.sourceLabel ?? "a factor").trim());
      continue;
    }
    const line = formatFact(row, "");
    if (!line) continue;
    const lineSource = displaySourceLabel(row, firstLink(row)?.url ?? "", (row.sourceLabel ?? "").trim());
    if (lineSource) citations.add(lineSource);
    else if (row.sourceLabel) citations.add(row.sourceLabel);
    lines.push(line);
    budget.left -= 1;
  }
  return lines;
}

export function serializeLlmPack(ctx: GraphContext): LlmPack {
  const citations = new Set<string>();
  const redSkipped: string[] = [];
  const budget = { left: LLM_PACK_MAX_FACTS };
  const chunks: string[] = [];

  chunks.push(`Classified intent: ${ctx.intent}`);
  chunks.push(
    "Use only the facts below. Each fact already includes its source name, a link when we have one, and an as-of date. Write a short answer in your own words (a few cited data points, never a table). If a fact is missing or has no source, say you don't know. Never invent a figure or a source."
  );

  const pushMarket = (m: MarketRow, label: string) => {
    const safe = withoutLicensedSnapshot(m);
    const lines = takeFacts(safe.signals as FactRow[], citations, redSkipped, budget);
    const head = [`### ${label}: ${safe.name} (slug: ${safe.slug})`, `Region: ${safe.region}`];
    // Do not send raw OCC/ADR/RevPAR snapshot tables to the model (those are often licensed).
    if (lines.length) head.push("Cited facts:", ...lines);
    else head.push("Cited facts: (none on file for this market in this pack)");
    chunks.push(head.join("\n"));
  };

  if (ctx.matched) pushMarket(ctx.matched, "Primary market");
  for (const m of ctx.secondary) {
    if (budget.left <= 0) break;
    pushMarket(m, "Related market");
  }

  if (budget.left > 0 && ctx.nationalSignals.length) {
    const lines = takeFacts(ctx.nationalSignals as FactRow[], citations, redSkipped, budget);
    if (lines.length) chunks.push(["### National / unscoped cited facts", ...lines].join("\n"));
  }

  if (budget.left > 0 && ctx.radars.length) {
    const findings = ctx.radars.flatMap((r) =>
      r.findings.map((f) => ({
        title: f.title,
        body: f.summary,
        sourceLabel: f.sourceLabel,
        sourceUrls: (f as { sourceUrls?: unknown }).sourceUrls,
        asOf: (f as { asOf?: string | null }).asOf,
        kind: "radar",
      }))
    );
    const lines = takeFacts(findings, citations, redSkipped, budget);
    if (lines.length) chunks.push(["### Active radar findings", ...lines].join("\n"));
  }

  if (redSkipped.length) {
    chunks.push(
      "### Factors skipped (source restricts republication or is confidential)\n" +
        redSkipped
          .map((n) => `- ${n} — this factor is not shown because the source restricts republication.`)
          .join("\n")
    );
  }

  return {
    pack: chunks.join("\n\n"),
    citations: [...citations],
    factCount: LLM_PACK_MAX_FACTS - budget.left,
    redSkipped,
  };
}
