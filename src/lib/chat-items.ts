/**
 * "Ask about this" briefs for items the Capital Graph chat did not cover on its own: a listed REIT's
 * filings (src/data/reits/snapshot.json) and a graded sale (src/data/deals/*). Static, cited data only:
 * every value below is copied from a filing / source row with its link. No DB reads, no model.
 */
import { reitByTicker, fmtQuarter, fmtRange, fmtDay } from "@/lib/reits";
import type { Reit, Cited, Guidance, Transaction } from "@/lib/reits-shared";
import { saleBySlug, gradesFor, entryFor, fmtPrice, fmtPerKey, fmtDate as dealDate, factorMeta, type Sale } from "@/lib/deals";
import {
  makeBrief,
  coverageLine,
  fitFact,
  periodOf,
  fmtAsOf,
  READ_MAX,
  type BriefRead,
  type BriefSection,
  type ChatBrief,
  type Citation,
  type ChipKind,
} from "./chat-brief";
import { publisherName } from "./public-text";

export type ItemAnswer = { brief: ChatBrief; citations: string[]; intent: "reit_reported" | "reit_call" | "deal_sale" | "deal_grade"; marketSlug: string | null };

const FILED = /(?:filed|released)\s+([A-Z][a-z]{2} \d{1,2}, \d{4})/;
const filedDate = (src: string): string | null => FILED.exec(src)?.[1] ?? null;

/** A read is a copied fact; if it can't fit READ_MAX without rewriting, it is not offered. */
function read(text: string, asOf: string | null, src: { kind: ChipKind; label: string; url: string; title?: string }): BriefRead | null {
  const t = fitFact(text, READ_MAX);
  if (!t) return null;
  const date = fmtAsOf(asOf);
  return { text: t, asOf: date && !t.includes(date) ? date : null, source: { ...src, publisher: publisherName(src.url) || undefined, ...(date ? { date } : {}) } };
}
const cite = (url: string, label: string, asOf: string | null): Citation => ({ key: url, url, label, text: label, asOf, period: periodOf(asOf) });
const money = (v: number, digits = 1) => `$${v.toLocaleString("en-US", { maximumFractionDigits: digits })}`;

/* ------------------------------------------------------------------ */
/* REITs                                                               */
/* ------------------------------------------------------------------ */

export type ReitLens = "reported" | "guidance" | "capital";

export function reitLens(question: string): ReitLens | null {
  const q = question.toLowerCase();
  if (/\b(guid\w*|outlook|forecast|call|earnings)\b/.test(q)) return "guidance";
  if (/\b(capital|allocat\w*|buy ?backs?|repurchas\w*|acqui\w*|dispos\w*|sold|sell\w*|bought|debt|maturit\w*|refinanc\w*)\b/.test(q)) return "capital";
  if (/\b(revpar|adr|occupancy|quarter|reported|results|rate|perform\w*)\b/.test(q)) return "reported";
  return null;
}

function reitSrc(c: { url: string; source: string }, r: Reit) {
  return { kind: "Filing" as const, label: `${r.ticker} ${c.source}`, url: c.url, title: `${r.name}: ${c.source}` };
}

function quarterRows(r: Reit): BriefSection | null {
  const rows = [...r.quarters].reverse().slice(0, 8).filter((q) => q.revpar || q.adr || q.occupancy);
  if (!rows.length) return null;
  const v = (c: Cited | null, f: (n: number) => string) => (c ? f(c.value) : "—");
  return {
    id: "reit-quarters",
    title: `${r.ticker} reported quarters`,
    count: rows.length,
    markdown: [
      "| Quarter | RevPAR | ADR | Occupancy | Filing |",
      "| --- | --- | --- | --- | --- |",
      ...rows.map((q) => {
        const src = q.revpar ?? q.adr ?? q.occupancy!;
        return `| ${fmtQuarter(q.quarter)} | ${v(q.revpar, (n) => money(n, 2))} | ${v(q.adr, (n) => money(n, 2))} | ${v(q.occupancy, (n) => `${n.toFixed(1)}%`)} | [${src.source}](${src.url}) |`;
      }),
    ].join("\n"),
  };
}

function guidanceLine(g: Guidance): string {
  return g.items.map((i) => `${g.period} ${i.label} ${fmtRange(i)}${i.change ? ` (${i.change})` : ""}`).join("; ");
}

function txLine(t: Transaction): string {
  const where = [t.city, t.state].filter(Boolean).join(", ");
  return `${t.kind === "acquisition" ? "Bought" : "Sold"} ${t.hotel}${where ? ` (${where})` : ""}${t.priceUsdM != null ? ` for ${money(t.priceUsdM)}M` : ""}${t.rooms ? `, ${t.rooms.toLocaleString("en-US")} rooms` : ""}${t.pending ? ", pending" : ""}`;
}

/** Within the capital lens: what the question is really about, so the headline leads with it. */
export function capitalFocus(question: string): "debt" | "deals" | null {
  const q = question.toLowerCase();
  if (/\b(debt|maturit\w*|maturing|refinanc\w*|loans?|notes due|coming due)\b/.test(q)) return "debt";
  if (/\b(acqui\w*|dispos\w*|sold|sell\w*|bought|buy(?!\s?backs?)|transactions?|deals?)\b/.test(q)) return "deals";
  return null;
}

export function reitBrief(ticker: string, lens: ReitLens, question = ""): ItemAnswer | null {
  const r = reitByTicker(ticker);
  if (!r) return null;
  const reads: BriefRead[] = [];
  const cites: Citation[] = [];
  const sections: BriefSection[] = [];
  let answer = "";
  const lq = r.latestQuarter ? fmtQuarter(r.latestQuarter) : null;
  const L = r.latest ?? ({} as Reit["latest"]);

  if (lens === "reported") {
    const head = [L.revpar && `RevPAR ${money(L.revpar.value, 2)}`, L.adr && `ADR ${money(L.adr.value, 2)}`, L.occupancy && `occupancy ${L.occupancy.value.toFixed(1)}%`].filter(Boolean);
    const src = L.revpar ?? L.adr ?? L.occupancy;
    if (!head.length || !src || !lq) return null;
    answer = `${r.name} (${r.ticker}) ${lq}: ${head.join(", ")} (${src.source}).`;
    const lqRaw = r.latestQuarter;
    const yearAgo = lqRaw ? r.quarters.find((q) => q.quarter === `${Number(lqRaw.slice(0, 4)) - 1}${lqRaw.slice(4)}`) : undefined;
    const add = (x: BriefRead | null, c: Citation) => {
      if (x) reads.push(x);
      cites.push(c);
    };
    if (L.revpar) add(read(`RevPAR ${money(L.revpar.value, 2)} in ${lq}`, filedDate(L.revpar.source), reitSrc(L.revpar, r)), cite(L.revpar.url, `${r.ticker} ${L.revpar.source}`, filedDate(L.revpar.source)));
    if (yearAgo?.revpar) add(read(`RevPAR ${money(yearAgo.revpar.value, 2)} in ${fmtQuarter(yearAgo.quarter)}, the same quarter a year earlier`, filedDate(yearAgo.revpar.source), reitSrc(yearAgo.revpar, r)), cite(yearAgo.revpar.url, `${r.ticker} ${yearAgo.revpar.source}`, filedDate(yearAgo.revpar.source)));
    if (L.occupancy) add(read(`Occupancy ${L.occupancy.value.toFixed(1)}% in ${lq}`, filedDate(L.occupancy.source), reitSrc(L.occupancy, r)), cite(L.occupancy.url, `${r.ticker} ${L.occupancy.source}`, filedDate(L.occupancy.source)));
    const qs = quarterRows(r);
    if (qs) sections.push(qs);
    for (const q of r.quarters.slice(-8)) for (const c of [q.revpar, q.adr, q.occupancy]) if (c) cites.push(cite(c.url, `${r.ticker} ${c.source}`, filedDate(c.source)));
  } else if (lens === "guidance") {
    const g = r.guidance.length ? r.guidance[r.guidance.length - 1] : null;
    if (!g || !g.items.length) return null;
    const d = fmtDay(g.date);
    answer = `${r.name} (${r.ticker}): latest guidance is ${g.period}, in the earnings release of ${d} (${g.source}).`;
    for (const i of g.items.slice(0, 3)) {
      const x = read(`${g.period} ${i.label} ${fmtRange(i)}${i.change ? `, ${i.change}` : ""}`, g.date, reitSrc(g, r));
      if (x) reads.push(x);
    }
    cites.push(cite(g.url, `${r.ticker} ${g.source}`, g.date));
    const hist = r.guidance.filter((x) => x.period === g.period);
    sections.push({
      id: "reit-guidance",
      title: `${r.ticker} ${g.period} guidance updates`,
      count: hist.length,
      markdown: [...hist].reverse().map((x) => `- ${fmtDay(x.date)}: ${guidanceLine(x)} · Filing: [${x.source}](${x.url})`).join("\n"),
    });
    for (const x of hist) cites.push(cite(x.url, `${r.ticker} ${x.source}`, x.date));
  } else {
    const tx = [...r.transactions].sort((a, b) => b.date.localeCompare(a.date));
    const bb = [...r.buybacks].reverse().find((b) => b.value > 0) ?? null;
    const nextMat = r.debt?.items.find((i) => i.value != null && i.label);
    if (!tx.length && !bb && !nextMat) return null;
    const lead = tx[0];
    const focus = capitalFocus(question);
    answer = `${r.name} (${r.ticker}) capital moves on file: ${tx.length} hotel transaction${tx.length === 1 ? "" : "s"}${bb ? `, ${money(bb.value)}M of buybacks ${bb.label}` : ""} (SEC filings).`;
    const txRead = lead ? read(`${txLine(lead)}`, lead.date, { kind: "Filing", label: `${r.ticker} ${lead.source}`, url: lead.url, title: `${r.name}: ${lead.source}` }) : null;
    const bbRead = bb ? read(`Share buybacks ${money(bb.value)}M, ${bb.label}`, filedDate(bb.source), reitSrc(bb, r)) : null;
    if (bb) cites.push(cite(bb.url, `${r.ticker} ${bb.source}`, filedDate(bb.source)));
    const debtRead = nextMat && r.debt ? read(`Debt maturing ${nextMat.label}: ${money(nextMat.value!)}M`, r.debt.asOf, reitSrc(r.debt, r)) : null;
    if (nextMat && r.debt) cites.push(cite(r.debt.url, `${r.ticker} ${r.debt.source}`, r.debt.asOf));
    // Lead with what was asked: a debt question opens on the maturity schedule, a deals question on the latest deal.
    let order = [txRead, bbRead, debtRead];
    if (focus === "debt" && debtRead && nextMat && r.debt) {
      answer = `${r.name} (${r.ticker}) debt maturities on file: ${money(nextMat.value!)}M due ${nextMat.label}, the nearest year on the schedule (${r.debt.source}).`;
      order = [debtRead, txRead, bbRead];
    } else if (focus === "deals" && txRead && lead) {
      answer = `${r.name} (${r.ticker}) hotel deals on file: ${tx.length} transaction${tx.length === 1 ? "" : "s"}; latest: ${txLine(lead)} (${lead.source}).`;
      order = [txRead, debtRead, bbRead];
    }
    for (const x of order) if (x) reads.push(x);
    if (tx.length) {
      sections.push({
        id: "reit-tx",
        title: `${r.ticker} hotel transactions`,
        count: Math.min(tx.length, 12),
        markdown: tx.slice(0, 12).map((t) => `- ${fmtDay(t.date)}: ${txLine(t)} · Filing: [${t.source}](${t.url})`).join("\n"),
      });
      for (const t of tx.slice(0, 12)) cites.push(cite(t.url, `${r.ticker} ${t.source}`, t.date.length === 7 ? `${t.date}-01` : t.date));
    }
    if (r.buybacks.length) {
      sections.push({ id: "reit-bb", title: `${r.ticker} share buybacks`, count: r.buybacks.length, markdown: r.buybacks.map((b) => `- ${b.label}: ${money(b.value)}M · Filing: [${b.source}](${b.url})`).join("\n") });
      for (const b of r.buybacks) cites.push(cite(b.url, `${r.ticker} ${b.source}`, filedDate(b.source)));
    }
    if (r.debt?.items.length) {
      sections.push({ id: "reit-debt", title: `${r.ticker} debt maturities`, count: r.debt.items.length, markdown: r.debt.items.map((i) => `- ${i.label || "Other"}: ${i.value != null ? `${money(i.value)}M` : "—"}`).join("\n") + `\n\nFiling: [${r.debt.source}](${r.debt.url})` });
    }
  }
  if (!reads.length) return null;
  sections.push({ id: "further", title: "Further reading", count: 1, markdown: `- [${r.name} (${r.ticker}): every filing on file](/reits/${r.ticker.toLowerCase()})` });
  const brief = makeBrief({
    answer,
    reads,
    coverage: coverageLine({ cites, notes: ["Company-reported figures from SEC filings; no licensed STR."] }),
    window: { range: "all", filterable: false },
    sections,
  });
  return { brief, citations: [...new Set(cites.map((c) => c.label))], intent: lens === "reported" ? "reit_reported" : "reit_call", marketSlug: null };
}

/* ------------------------------------------------------------------ */
/* Graded sales                                                        */
/* ------------------------------------------------------------------ */

export type DealLens = "price" | "grade";

export function dealLens(question: string): DealLens | null {
  const q = question.toLowerCase();
  if (/\b(grade[ds]?|grading|score[ds]?|rubric|rated|rating|why)\b/.test(q)) return "grade";
  if (/\b(pa(y|id)|price[ds]?|per key|per room|cost|compare[ds]?|comparison|cap rate|valuation|worth|bought|buyer|seller|terms?)\b/.test(q)) return "price";
  return null;
}

const SHORT: Record<string, string> = { replacement_cost: "Replacement cost", spread: "Spread", supply: "Supply", demand: "Demand", debt_context: "Debt context" };
const short = (id: string) => SHORT[id] ?? factorMeta(id)?.label ?? id;
function chipFor(url: string): ChipKind {
  return /sec\.gov/.test(url) ? "Filing" : /occompt|county|\.gov\b/.test(url) ? "Record" : "Data";
}
/** Drop parentheticals from a factor's input text so it fits a read (the full text stays in the table). */
function shortInput(t: string): string {
  return t.replace(/\s*\([^()]*\)/g, "").replace(/\s+;/g, ";").trim();
}

export function dealBrief(slug: string, lens: DealLens): ItemAnswer | null {
  const sale = saleBySlug(slug);
  if (!sale) return null;
  const grade = gradesFor(sale.sale_id)[0] ?? null;
  const entry = entryFor(sale.sale_id);
  const main = entry.sources.find((s) => s.kind === sale.price_source_kind) ?? entry.sources[0];
  const mainUrl = main?.url ?? sale.source_uris[0];
  const mainLabel = main ? `${main.publisher}: ${main.title}` : "Sale filing";
  const reads: BriefRead[] = [];
  const cites: Citation[] = [];
  if (mainUrl) cites.push(cite(mainUrl, mainLabel, main?.date ?? sale.announced_on));
  const factors = (grade?.factor_scores ?? []).filter((f) => f.graded && f.input_text && f.source_uri);
  const factorRead = (id: string, withScore: boolean) => {
    const f = factors.find((x) => x.factor === id);
    if (!f) return null;
    const label = short(f.factor);
    const text = `${withScore ? `${label} ${f.score}/5: ` : ""}${fitFact(f.input_text!) ?? shortInput(f.input_text!)}`;
    return read(text, f.as_of, { kind: chipFor(f.source_uri!), label: publisherName(f.source_uri!) || label, url: f.source_uri!, title: `${label}: ${shortInput(f.input_text!)}`.slice(0, 200) });
  };
  for (const f of factors) cites.push(cite(f.source_uri!, `${factorMeta(f.factor)?.label ?? f.factor}: ${publisherName(f.source_uri!)}`, f.as_of));

  let answer: string;
  if (lens === "price") {
    if (sale.price == null) return null;
    answer = `${dealShort(sale)}: ${sale.price_qualifier?.startsWith("approximately") ? "about " : ""}${fmtPrice(sale.price)}${sale.keys ? ` for ${sale.keys.toLocaleString("en-US")} keys, ${fmtPerKey(sale.price_per_key)}` : ""}, announced ${dealDate(sale.announced_on)} (${main ? `${main.title.split(":")[0]}` : "sale filing"}).`;
    for (const id of ["replacement_cost", "spread", "demand"]) {
      const x = factorRead(id, false);
      if (x) reads.push(x);
    }
  } else {
    if (!grade || grade.overall == null) return null;
    answer = `${dealShort(sale)}: graded ${grade.overall_label} (rubric ${grade.rubric_version}, ${dealDate(grade.graded_on)}). ${grade.output_text}`;
    const byWeight = [...factors].sort((a, b) => (b.effective_weight ?? 0) - (a.effective_weight ?? 0));
    for (const f of byWeight.slice(0, 3)) {
      const x = factorRead(f.factor, true);
      if (x) reads.push(x);
    }
  }
  if (!reads.length) return null;

  const sections: BriefSection[] = [];
  if (grade) {
    sections.push({
      id: "deal-factors",
      title: `Grade factors (${grade.overall_label})`,
      count: grade.factor_scores.length,
      markdown: [
        "| Factor | Score | Weight | Input | Source |",
        "| --- | --- | --- | --- | --- |",
        ...grade.factor_scores.map((f) => {
          const label = factorMeta(f.factor)?.label ?? f.factor;
          return f.graded
            ? `| ${label} | ${f.score}/5 | ${Math.round((f.effective_weight ?? f.weight) * 100)}% | ${f.input_text} | [${publisherName(f.source_uri!) || "Source"}](${f.source_uri}) |`
            : `| ${label} | Not graded | — | ${f.reason ?? "No qualifying public source."} | — |`;
        }),
      ].join("\n"),
    });
  }
  if (entry.tape) sections.push({ id: "deal-tape", title: "Deal terms", count: 1, markdown: entry.tape });
  if (entry.watches_for) sections.push({ id: "deal-watch", title: "What the price doesn't tell you", count: 1, markdown: entry.watches_for });
  sections.push({ id: "further", title: "Further reading", count: 1, markdown: `- [${sale.property}: full deal entry](/deals/${sale.slug})` });
  const ungraded = (lens === "price" ? [] : grade?.factor_scores ?? []).filter((f) => !f.graded).map((f) => `${factorMeta(f.factor)?.label ?? f.factor} not graded.`);
  const build = (n: number) =>
    makeBrief({
      answer,
      reads: reads.slice(0, n),
      coverage: coverageLine({ cites, notes: [...ungraded, "Public sources only; no licensed STR."] }),
      window: { range: "all", filterable: false },
      sections,
    });
  // Collapsed view stays under 600 characters: drop trailing reads (their facts stay in the factor table).
  let brief = build(3);
  for (let n = 2; n >= 1 && brief.collapsedChars >= 600; n--) brief = build(n);
  return { brief, citations: [...new Set(cites.map((c) => c.label))], intent: lens === "price" ? "deal_sale" : "deal_grade", marketSlug: sale.market_slug };
}

/** "grande-lakes-orlando" → "Grande Lakes" (same rule as the deal page breadcrumb). */
function dealShort(s: Sale): string {
  const base = s.market_slug && s.slug.endsWith(`-${s.market_slug}`) ? s.slug.slice(0, -(s.market_slug.length + 1)) : s.slug;
  return base.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") + (s.market ? `, ${s.market}` : "");
}

export function dealMarketSlug(slug: string): string | null {
  return saleBySlug(slug)?.market_slug ?? null;
}
export function dealName(slug: string): string | null {
  const s: Sale | undefined = saleBySlug(slug);
  return s ? s.property : null;
}
export function reitName(ticker: string): string | null {
  const r = reitByTicker(ticker);
  return r ? r.name : null;
}
