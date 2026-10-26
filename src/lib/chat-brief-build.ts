/**
 * Brief builders per answer path (deterministic; see chat-brief.ts for the format and rules).
 */
import type { ChatIntent } from "./chat-intent";
import type { MarketRow } from "./chat";
import type { DigestHit } from "./chat-retrieve";
import type { UncoveredPlace } from "./chat-coverage";
import { nearestCoveredMarkets } from "./chat-coverage";
import { coverageInProgressLine, isSeedMarket } from "./format";
import { getMsaRegistryEntry } from "@/data/msa-registry";
import { publisherName, scrubInternal } from "./public-text";
import {
  chipKind,
  coverageLine,
  dateShown,
  digestDate,
  furtherReadingSection,
  inRange,
  periodOf,
  RANGE_LABEL,
  signalCites,
  windowSignal,
  withDate,
  type Citation,
  type DateRange,
  dateKey,
  dedupeParagraphs,
  digestFacts,
  fitFact,
  fmtAsOf,
  makeBrief,
  pickReads,
  plain,
  signalFacts,
  signalSections,
  toRead,
  type BriefRead,
  type BriefSection,
  type BriefSource,
  type ChatBrief,
  type Fact,
  type Lens,
  type SignalLike,
} from "./chat-brief";

export function lensFor(intent: ChatIntent | undefined): Lens {
  if (intent === "supply_pipeline" || intent === "supply_ranking") return "supply";
  if (intent === "debt_overlay" || intent === "rates") return "debt";
  if (intent === "talent_greenlight") return "talent";
  return "demand";
}

export function shortName(m: { name: string }): string {
  return m.name.split(/[–—]/)[0].replace(/\s+MSA$/, "").trim();
}

/** Publisher part of a market snapshot label ("Choose Chicago Hotel Performance 2025 PDF (CBD; STR)"). */
function snapshotLabel(label: string): string {
  let t = label.split(" — ")[0];
  t = t.replace(/\s*\([^()]{21,}\)/g, "");
  // First "; "-separated citation, ignoring semicolons inside parentheses.
  let depth = 0;
  for (let i = 0; i < t.length; i++) {
    if (t[i] === "(") depth++;
    else if (t[i] === ")") depth--;
    else if (t[i] === ";" && depth === 0) {
      t = t.slice(0, i);
      break;
    }
  }
  return scrubInternal(t.trim());
}

/** The snapshot's own date, as written in its first citation ("YE 2025", "2025"); null if none. */
function snapshotDate(m: MarketRow): string | null {
  const p = periodOf(snapshotLabel(m.sourceLabel));
  return p ? p.label : null;
}

function snapshotSource(m: MarketRow): BriefSource {
  const label = snapshotLabel(m.sourceLabel);
  return { kind: chipKind(undefined, label), label, title: label || undefined, date: snapshotDate(m) ?? undefined };
}

/* ------------------------------------------------------------------ */
/* Date windows                                                        */
/* ------------------------------------------------------------------ */

type WindowInfo = { range: DateRange; snapshotOut: boolean };
const WINDOWED = new WeakMap<object, WindowInfo>();

/** Window a market row has been restricted to (undefined = All). */
function windowOf(m: MarketRow): WindowInfo | undefined {
  return WINDOWED.get(m);
}

/** The market snapshot (OCC / ADR / summary) is a citation of this answer. */
function snapOK(m: MarketRow): boolean {
  return !isSeedMarket(m) && !windowOf(m)?.snapshotOut;
}

/**
 * A copy of a market restricted to a date window: only signals whose cited date falls in it
 * (undated rows drop out), the snapshot only if its own date does, no undated assets. Every
 * later step (answer line, reads, detail, sources, count and span) uses only what is left.
 */
export function windowMarket(m: MarketRow, range: DateRange): MarketRow {
  if (range === "all") return m;
  const snapshotOut = isSeedMarket(m) || !inRange(snapshotLabel(m.sourceLabel), range);
  const out: MarketRow = {
    ...m,
    signals: m.signals.map((s) => windowSignal(s as SignalLike & typeof s, range)).filter((s): s is NonNullable<typeof s> => Boolean(s)),
    assets: [],
    ...(snapshotOut
      ? { occupancy: null, adr: null, visitorsM: null, roomsK: null, midweekOcc: null, weekendOcc: null, summary: "", nuanceNote: null }
      : {}),
  };
  WINDOWED.set(out, { range, snapshotOut });
  return out;
}

export function windowSignals<T extends SignalLike>(rows: T[], range: DateRange): T[] {
  return range === "all" ? rows : rows.map((s) => windowSignal(s, range)).filter((s): s is T => Boolean(s));
}

/** A digest is dated by the quarter it reports (its data), not its release or load date. */
export function windowDigests(digests: DigestHit[], range: DateRange): DigestHit[] {
  return range === "all" ? digests : digests.filter((d) => inRange(digestQuarter(d) ?? digestDate(d), range));
}

function digestQuarter(d: DigestHit): string | null {
  const q = /(20\d{2})-Q([1-4])/.exec(d.citePath);
  return q ? `Q${q[2]} ${q[1]}` : null;
}

function inWindowWord(m: MarketRow): string {
  const w = windowOf(m);
  return w ? ` in the ${RANGE_LABEL[w.range].toLowerCase()}` : " on file yet";
}

/** The headline-metrics answer line, values as stored / as published in the snapshot label. */
function metricsLine(m: MarketRow): string | null {
  if (!snapOK(m) || m.occupancy == null || m.adr == null) return null;
  const cited = /RevPAR \$([\d,]+(?:\.\d+)?)/.exec(m.sourceLabel)?.[1];
  const revpar = cited ? `RevPAR $${cited}` : `RevPAR $${((m.occupancy / 100) * m.adr).toFixed(2)} (OCC×ADR)`;
  return `OCC ${m.occupancy.toFixed(1)}%, ADR $${m.adr.toFixed(2)}, ${revpar}`;
}

function metricsTable(m: MarketRow): BriefSection | null {
  if (!snapOK(m)) return null;
  const rows: [string, string][] = [];
  if (m.visitorsM != null) rows.push(["Visitors", `${m.visitorsM.toFixed(1)}M`]);
  if (m.roomsK != null) rows.push(["Rooms", `${m.roomsK.toFixed(1)}k`]);
  if (m.occupancy != null) rows.push(["OCC", `${m.occupancy.toFixed(1)}%`]);
  if (m.adr != null) rows.push(["ADR", `$${m.adr.toFixed(2)}`]);
  // One RevPAR: the cited source's own figure when its label carries one, else OCC×ADR (marked derived).
  const cited = /RevPAR \$([\d,]+(?:\.\d+)?)/.exec(m.sourceLabel)?.[1];
  if (cited) rows.push(["RevPAR (as published)", `$${cited}`]);
  else if (m.occupancy != null && m.adr != null) rows.push(["RevPAR (OCC×ADR, derived)", `$${((m.occupancy / 100) * m.adr).toFixed(2)}`]);
  if (m.midweekOcc != null) rows.push(["Midweek OCC", `${m.midweekOcc.toFixed(1)}%`]);
  if (m.weekendOcc != null) rows.push(["Weekend OCC", `${m.weekendOcc.toFixed(1)}%`]);
  if (!rows.length) return null;
  return {
    id: `metrics-${m.slug}`,
    title: "Metrics",
    count: rows.length,
    markdown: ["| Metric | Value |", "| --- | --- |", ...rows.map(([k, v]) => `| ${k} | ${v} |`), "", `_Source: ${fieldNames(scrubInternal(m.sourceLabel))}_`].join("\n"),
  };
}

/** Readers see "rooms", never a stored field name such as roomsK. */
function fieldNames(t: string): string {
  return t.replace(/\broomsK\b/g, "rooms").replace(/\bvisitorsM\b/g, "visitors").replace(/\bmidweekOcc\b/g, "midweek OCC").replace(/\bweekendOcc\b/g, "weekend OCC");
}

function contextSection(m: MarketRow): BriefSection | null {
  if (!snapOK(m)) return null;
  const paras = dedupeParagraphs([m.summary, m.nuanceNote ?? ""].map((x) => fieldNames(scrubInternal(x))));
  if (!paras.length) return null;
  return { id: `context-${m.slug}`, title: "Market context", count: paras.length, markdown: paras.join("\n\n") };
}

function assetsSection(m: MarketRow): BriefSection | null {
  if (!m.assets.length) return null;
  return {
    id: `assets-${m.slug}`,
    title: "Assets on file",
    count: m.assets.length,
    markdown: m.assets
      .map((a) => `- **${a.name}** (${a.keys ?? "?"} keys${a.submarket ? `, ${a.submarket}` : ""}) — ${a.notes ?? a.assetClass} · ${scrubInternal(a.sourceLabel)}`)
      .join("\n"),
  };
}

/** The tourism bureau's research pages: background reading, not a source of any figure here. */
function registryLinks(m: MarketRow): { url: string; label: string }[] {
  if (windowOf(m)) return [];
  const reg = getMsaRegistryEntry(m.slug);
  if (!reg) return [];
  return [
    { url: reg.cvb_research_url, label: `${reg.cvb_name} research` },
    ...(reg.lodging_report_url ? [{ url: reg.lodging_report_url, label: `${reg.cvb_name} lodging report` }] : []),
  ];
}

function marketFacts(m: MarketRow): Fact[] {
  return m.signals.flatMap((s) => signalFacts(s as SignalLike));
}

/**
 * The citations behind an answer, each with its cited row's own date: the reads' sources, every
 * signal shown in the detail (one per original URL, else its source label) and extra sources
 * (market snapshots). Count and date span on the "based on" line are computed from this list.
 */
export function citationsOf(reads: BriefRead[], signals: SignalLike[], extra: Citation[] = []): Citation[] {
  const out: Citation[] = [];
  for (const s of signals) out.push(...signalCites(s));
  for (const r of reads) out.push(readCite(r));
  out.push(...extra);
  return out;
}

/** A read's own source, dated by the read's data period. */
export function readCite(r: BriefRead): Citation {
  const d = r.source.date ?? r.asOf;
  const text = r.source.url ? [r.source.title, r.source.publisher ?? r.source.label].filter(Boolean).join(" — ") || r.source.label : r.source.label;
  return { key: r.source.url ?? r.source.label, url: r.source.url, label: r.source.label, text, asOf: d, period: periodOf(d) };
}

function snapshotCite(m: MarketRow): Citation[] {
  if (!snapOK(m)) return [];
  const label = snapshotLabel(m.sourceLabel);
  return [{ key: label, label, text: fieldNames(scrubInternal(m.sourceLabel)), asOf: null, period: periodOf(label) }];
}

const LENS_WORD: Record<Lens, string> = { demand: "", supply: "supply", debt: "debt", talent: "labor" };

function headLine(scope: string, lens: Lens, f: Fact): string {
  const date = f.period ? dateShown(f.text, f.period) : f.asOf && !f.text.includes(f.asOf) ? fmtAsOf(f.asOf) : null;
  // "Orlando: Orlando week ending…" → "Orlando: week ending…" (the fact's own wording otherwise unchanged).
  const esc = scope.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const text = f.text.replace(new RegExp(`^${esc}\\s+(?=\\S)`, "i"), "");
  return `${scope}${LENS_WORD[lens] ? ` ${LENS_WORD[lens]}` : ""}: ${text} (${[date, f.source.label].filter(Boolean).join(", ")}).`;
}

export type BriefOpts = {
  decline?: string;
  /** Date window (All by default); market rows carry their own via windowMarket. */
  range?: DateRange;
  notes?: string[];
  extraReads?: BriefRead[];
  extraSections?: BriefSection[];
  /** Sources behind extraSections / extraReads (e.g. a named REIT's digest links). */
  extraCites?: Citation[];
  nationalOverlay?: SignalLike | null;
};

/** One covered market, any intent. */
export function marketBrief(m: MarketRow, intent: ChatIntent | undefined, opts: BriefOpts = {}): ChatBrief {
  const lens = lensFor(intent);
  const facts = marketFacts(m);
  const short = shortName(m);
  const metrics = metricsLine(m);
  const snap = snapshotSource(m);

  let answer = "";
  let reads: Fact[];
  const scoreSig = m.signals.find((s) => /supply-pressure score\s*\d\s*\/\s*5/i.test(s.title));
  if (lens === "demand" && metrics) {
    answer = `${short}: ${metrics} (${snap.label}).`;
    reads = pickReads(facts, "demand", 3 - (opts.extraReads?.length ?? 0));
  } else if (lens === "supply" && scoreSig) {
    const head = signalFacts(scoreSig as SignalLike)[0];
    answer = headLine(short, "supply", { ...head, text: scrubInternal(scoreSig.title).replace(new RegExp(`^${short}\\s*`, "i"), "") });
    reads = pickReads(facts, "supply", 3 - (opts.extraReads?.length ?? 0), new Set([head.text]));
  } else {
    const first = pickReads(facts, lens, 1);
    const head = first[0];
    if (head) {
      answer = headLine(short, lens, head);
      reads = pickReads(facts, lens, 3 - (opts.extraReads?.length ?? 0), new Set([head.text]));
    } else if (metrics) {
      answer = `${short}: ${metrics} (${snap.label}).`;
      reads = pickReads(facts, "demand", 3 - (opts.extraReads?.length ?? 0));
    } else {
      answer = `${short}: no dated, cited ${LENS_WORD[lens] || "performance"} figure${inWindowWord(m)}; the cited rows we have are below.`;
      reads = pickReads(facts, "demand", 3 - (opts.extraReads?.length ?? 0));
    }
  }
  const readList = [...reads.map(toRead), ...(opts.extraReads ?? [])].slice(0, 3);

  const sections: BriefSection[] = [];
  const mt = metricsTable(m);
  if (mt) sections.push(mt);
  sections.push(...signalSections(m.signals as SignalLike[], lens, `sig-${m.slug}`));
  const ctx = contextSection(m);
  if (ctx) sections.push(ctx);
  const as = assetsSection(m);
  if (as) sections.push(as);
  if (opts.nationalOverlay) {
    sections.push(...signalSections([opts.nationalOverlay], null, "national").map((s) => ({ ...s, title: "National overlay" })));
  }
  sections.push(...(opts.extraSections ?? []));
  // Sources (the cited rows) are generated from the citations; bureau pages are further reading only.
  const further = furtherReadingSection(registryLinks(m));
  if (further) sections.push(further);

  const notes = [...(opts.notes ?? [])];
  if (!readList.length) {
    // Same wording in every window: the answer line says it when there is no head figure, else a note.
    if (answer.startsWith(`${short}: no dated, cited`)) answer = answer.replace(`${short}: `, `Limited recent data for ${short}: `);
    else notes.unshift(`Limited recent data for ${short}: no other dated key reads; the cited rows are in the sections below.`);
  }
  if (isSeedMarket(m)) notes.push(coverageInProgressLine(m.name));
  const cites = citationsOf(readList, [...(m.signals as SignalLike[]), ...(opts.nationalOverlay ? [opts.nationalOverlay] : [])], [...snapshotCite(m), ...(opts.extraCites ?? [])]);
  const range = windowOf(m)?.range ?? opts.range ?? "all";
  return makeBrief({
    decline: opts.decline,
    answer,
    reads: readList,
    coverage: coverageLine({ cites, notes, range }),
    window: { range, filterable: true },
    sections,
  });
}

/** Two covered markets side by side. */
export function compareBrief(a: MarketRow, b: MarketRow, question: string, intent: ChatIntent | undefined, opts: BriefOpts = {}): ChatBrief {
  const lens = /\b(supply|pipeline)\b/i.test(question) && !/\b(revpar|demand|occupancy|adr)\b/i.test(question) ? "supply" : lensFor(intent === "compare_markets" ? "revpar_metrics" : intent);
  const ma = metricsLine(a);
  const mb = metricsLine(b);
  const sa = shortName(a);
  const sb = shortName(b);
  const seedNames = [a, b].filter((m) => !metricsLine(m)).map(shortName);
  const answer =
    ma && mb
      ? `${sa}: ${ma} (${snapshotSource(a).label}) · ${sb}: ${mb} (${snapshotSource(b).label}).`
      : `${sa} vs ${sb}: no cited OCC/ADR snapshot${windowOf(a) && [a, b].some((m) => !metricsLine(m) && !isSeedMarket(m)) ? ` in the ${RANGE_LABEL[windowOf(a)!.range].toLowerCase()}` : ""} for ${seedNames.length === 2 ? "either" : seedNames[0]}, cited reads for each below.`;
  const fa = marketFacts(a);
  const fb = marketFacts(b);
  const label = (m: string, f: Fact): Fact => ({ ...f, text: `${m}: ${f.text}` });
  const ra = pickReads(fa, lens, 1).map((f) => label(sa, f));
  const rb = pickReads(fb, lens, 1).map((f) => label(sb, f));
  const used = new Set([...ra, ...rb].map((f) => f.text.replace(/^[^:]+:\s/, "")));
  const secondLens: Lens = /\bsupply|pipeline\b/i.test(question) && lens !== "supply" ? "supply" : "demand";
  const third = pickReads([...fa.map((f) => label(sa, f)), ...fb.map((f) => label(sb, f))], secondLens, 3, new Set([...ra, ...rb].map((f) => f.text)))
    .filter((f) => !used.has(f.text.replace(/^[^:]+:\s/, "")))
    .slice(0, 1);
  const reads = [...ra, ...rb, ...third].filter((f) => f.text.length <= 140).sort((x, y) => y.key - x.key).map(toRead);

  const sections: BriefSection[] = [];
  for (const m of [a, b]) {
    const s = shortName(m);
    const mt = metricsTable(m);
    if (mt) sections.push({ ...mt, title: `${s} · Metrics` });
    sections.push(...signalSections(m.signals as SignalLike[], lens, `sig-${m.slug}`).map((x) => ({ ...x, title: `${s} · ${x.title}` })));
    const c = contextSection(m);
    if (c) sections.push({ ...c, title: `${s} · Market context` });
  }
  const further = furtherReadingSection([...registryLinks(a), ...registryLinks(b)]);
  if (further) sections.push(further);
  const notes = [...(opts.notes ?? [])];
  const seeds = [a, b].filter((m) => isSeedMarket(m)).map(shortName);
  if (seeds.length) notes.push(`We haven't checked enough sources for ${seeds.join(" or ")} yet.`);
  return makeBrief({
    decline: opts.decline,
    answer,
    reads,
    coverage: coverageLine({
      cites: citationsOf(reads, [...a.signals, ...b.signals] as SignalLike[], [...snapshotCite(a), ...snapshotCite(b)]),
      notes,
      range: windowOf(a)?.range ?? opts.range,
    }),
    window: { range: windowOf(a)?.range ?? opts.range ?? "all", filterable: true },
    sections,
  });
}

/** National debt / rate overlay (no market named). */
export function nationalDebtBrief(
  signals: SignalLike[],
  findings: { title: string; summary: string; sourceLabel: string }[],
  opts: BriefOpts & { range?: DateRange } = {}
): ChatBrief {
  const debt = signals.filter((s) => ["debt", "rates", "cmbs", "cap_rate"].includes(s.kind));
  const facts = debt.flatMap((s) => signalFacts(s));
  const head = pickReads(facts, "debt", 1)[0];
  const reads = pickReads(facts, "debt", 3, new Set(head ? [head.text] : []));
  // The delinquency slot fed the answer line; the reads keep wall and rate, plus the next newest debt fact.
  const answer = head ? headLine("US hotel", "debt", head) : "US hotel debt: no cited national debt read on file yet.";
  const sections: BriefSection[] = [...signalSections(debt, "debt", "national")];
  if (findings.length) {
    sections.push({
      id: "radar-debt",
      title: "Debt radar findings",
      count: findings.length,
      markdown: findings.map((f) => `- **${scrubInternal(f.title)}** — ${plain(scrubInternal(f.summary))} · ${scrubInternal(f.sourceLabel)}`).join("\n"),
    });
  }
  return makeBrief({
    decline: opts.decline,
    answer,
    reads: reads.map(toRead),
    coverage: coverageLine({
      // Radar findings carry no data date of their own: they count as undated sources.
      cites: citationsOf(reads.map(toRead), debt, findings.map((f) => ({ key: f.sourceLabel, label: f.sourceLabel, asOf: null, period: null }))),
      notes: ["National reads, not a market read."],
      range: opts.range,
    }),
    window: { range: opts.range ?? "all", filterable: true },
    sections,
  });
}

const RATE_ROW = /\b(10-year|10Y|Treasury|SOFR|fed funds|FOMC)\b/i;

/** Which benchmark the question asks about (10-year Treasury by default). */
function rateSeries(question: string): { name: string; re: RegExp } {
  if (/\bsofr\b/i.test(question)) return { name: "SOFR", re: /\bSOFR\b/i };
  if (/\bfed funds|fomc|federal funds\b/i.test(question)) return { name: "Fed funds", re: /\bfed funds|FOMC\b/i };
  return { name: "10-year Treasury", re: /\b10-year|10Y\b/i };
}

/** Benchmark rate question: the newest cited row for that rate leads, with its date and source. */
export function ratesBrief(signals: SignalLike[], question: string, opts: BriefOpts = {}): ChatBrief {
  const rows = signals.filter((s) => RATE_ROW.test(s.title));
  const series = rateSeries(question);
  const facts = rows.flatMap((s) => signalFacts(s).slice(0, 1).map((f) => ({ f, s })));
  const byNewest = (a: { f: Fact }, b: { f: Fact }) => b.f.key - a.f.key;
  const head = facts.filter((x) => x.f.period && series.re.test(x.s.title)).sort(byNewest)[0];
  const range = opts.range ?? "all";
  const answer = head
    ? `${head.f.text.replace(/\.$/, "")} (${[head.f.asOf, head.f.source.label].filter(Boolean).join(", ")}).`
    : `US ${series.name}: no cited, dated read${range === "all" ? " on file yet" : ` in the ${RANGE_LABEL[range].toLowerCase()}`}.`;
  // Reads: the newest row of each other benchmark (one per series), then the next-newest of the asked one.
  const seen = new Set<string>([head ? rateSeries(head.s.title).name : series.name]);
  const others: Fact[] = [];
  for (const x of facts.filter((y) => y !== head && y.f.readable).sort(byNewest)) {
    const name = /SOFR/i.test(x.s.title) ? "SOFR" : /fed funds|FOMC/i.test(x.s.title) ? "Fed funds" : /10-year|10Y/i.test(x.s.title) ? "10-year Treasury" : x.s.title;
    if (seen.has(name)) continue;
    seen.add(name);
    others.push(x.f);
  }
  const debt = signals.filter((s) => ["debt", "rates", "cmbs", "cap_rate"].includes(s.kind) || RATE_ROW.test(s.title));
  // "How are rates affecting debt / refinancing?": the newest cited debt read comes first, then the other rates.
  const debtRead = /\b(debt|refinanc\w*|cmbs|loans?|lend\w*|maturit\w*)\b/i.test(question)
    ? pickReads(debt.filter((s) => !RATE_ROW.test(s.title)).flatMap((s) => signalFacts(s)), "debt", 1)
    : [];
  const reads = [...debtRead, ...others].slice(0, 3).map(toRead);
  const ordered = [...debt].sort((a, b) => Number(RATE_ROW.test(b.title)) - Number(RATE_ROW.test(a.title)));
  return makeBrief({
    decline: opts.decline,
    answer,
    reads,
    coverage: coverageLine({
      cites: citationsOf([...(head ? [toRead(head.f)] : []), ...reads], debt),
      notes: ["National benchmark rates, not a market read."],
      range,
    }),
    window: { range, filterable: true },
    sections: signalSections(ordered, "debt", "national"),
  });
}

/* ------------------------------------------------------------------ */
/* REIT digests                                                        */
/* ------------------------------------------------------------------ */

const PIPELINE_Q = /\b(pipeline|net unit growth|nug|development|openings|signings)\b/i;

export function digestReads(d: DigestHit, question: string): { answer: string; reads: Fact[]; sections: BriefSection[]; links: { url: string; label: string }[]; date: string | null; period: ReturnType<typeof periodOf>; cites: Citation[] } {
  const f = digestFacts(d, d.raw ?? d.excerpt);
  const asked = PIPELINE_Q.test(question);
  // REIT call rule: guidance, capital allocation, market color (pipeline questions: NUG guide and pipeline).
  const slots = asked ? [f.nugGuide ?? f.guidance, f.pipeline ?? f.capital, f.color] : [f.guidance, f.capital, f.color];
  const reads = slots.filter((x): x is Fact => Boolean(x)).filter((x, i, arr) => arr.findIndex((y) => y.text === x.text) === i);
  const raised = /\braised\b/i.test(f.guidance?.text ?? "");
  const answer = `${f.name} (${f.ticker}) ${f.period}: ${f.headline ?? "company-reported results"}${raised ? "; FY 2026 guidance raised" : ""} (${f.source.label.replace(`${f.name} `, "")}).`;
  const sections: BriefSection[] = [
    { id: `digest-${d.slug}`, title: `${f.name}: capital headline`, count: 1, markdown: f.excerpt },
  ];
  if (f.guidanceMd) {
    const n = f.guidanceMd.split("\n").filter((l) => /^(- |\|(?!\s*-)(?!\s*(Item|Metric)\b))/.test(l)).length;
    sections.push({ id: `guide-${d.slug}`, title: `${f.name}: outlook & guidance`, count: n || 1, markdown: f.guidanceMd });
  }
  const rowsIn = (md: string) => md.split("\n").filter((l) => /^(- |\*\*|\|(?!\s*-)(?!\s*(Item|Metric)\b))/.test(l)).length || 1;
  if (f.kpiMd) sections.splice(1, 0, { id: `kpi-${d.slug}`, title: `${f.name}: operating KPIs`, count: rowsIn(f.kpiMd), markdown: f.kpiMd });
  if (f.balanceMd) {
    sections.push({ id: `bal-${d.slug}`, title: `${f.name}: balance sheet & capital`, count: f.balanceMd.split("\n").filter((l) => /^- /.test(l)).length || 1, markdown: f.balanceMd });
  }
  if (f.supplyMd) sections.push({ id: `sup-${d.slug}`, title: `${f.name}: supply & pipeline`, count: rowsIn(f.supplyMd), markdown: f.supplyMd });
  if (f.segmentMd) sections.push({ id: `seg-${d.slug}`, title: `${f.name}: segment & geography mix`, count: rowsIn(f.segmentMd), markdown: f.segmentMd });
  return { answer, reads, sections, links: f.links, date: f.guidance?.asOf ?? null, period: f.dataPeriod, cites: f.links.map((l) => ({ key: l.url, url: l.url, label: l.label, text: l.label, asOf: digestDate(d), period: f.dataPeriod })) };
}

export function digestBrief(digests: DigestHit[], question: string, opts: BriefOpts & { range?: DateRange } = {}): ChatBrief {
  const parts = digests.map((d) => digestReads(d, question));
  const links = parts.flatMap((p) => p.links);
  let answer: string;
  let reads: Fact[];
  if (parts.length === 1) {
    answer = parts[0].answer;
    reads = parts[0].reads;
  } else {
    answer = `REIT and brand Q2 2026 digests on file: ${digests.map((d) => `${d.name} (${d.ticker})`).join(", ")}; each one's guidance read is below.`;
    reads = parts.map((p) => p.reads[0]).filter(Boolean);
  }
  const readList = reads.slice(0, 3).map(toRead);
  const sections = parts.flatMap((p) => p.sections);
  void links;
  return makeBrief({
    decline: opts.decline,
    answer,
    reads: readList,
    coverage: coverageLine({
      // Each digest's source links, dated by that digest's release date.
      // Each digest's source links, dated by the quarter the digest reports.
      cites: [
        ...digests.flatMap((d, i) => parts[i].links.map((l) => ({ key: l.url, url: l.url, label: l.label, text: l.label, asOf: digestDate(d), period: parts[i].period }))),
        ...readList.map(readCite),
      ],
      notes: ["Editor-authored digests of company-reported results; no licensed STR."],
      range: opts.range,
    }),
    window: { range: opts.range ?? "all", filterable: true },
    sections,
  });
}

/* ------------------------------------------------------------------ */
/* Uncovered markets                                                   */
/* ------------------------------------------------------------------ */

export function uncoveredBrief<T extends { slug: string; name: string }>(places: UncoveredPlace[], markets: T[], opts: BriefOpts = {}): ChatBrief {
  const lines = places.map((p) => {
    if (p.kind === "international") return `We don't cover ${p.label}: Bungah Capital Intel covers US hotel markets only.`;
    const near = nearestCoveredMarkets(p.at, markets, 3);
    return `We don't cover ${p.label} yet.${near.length ? ` Closest covered markets: ${near.map((m) => `[${shortName(m)}](/markets/${m.slug})`).join(", ")}.` : ""}`;
  });
  return makeBrief({
    decline: opts.decline,
    answer: lines.join(" "),
    reads: [],
    coverage: `No cited figures for ${places.map((p) => p.label).join(" or ")}, and none are estimated. [Browse every market we cover](/markets).`,
    // Nothing is cited, so there is nothing to filter by date.
    window: { range: "all", filterable: false },
    sections: [],
  });
}

/* ------------------------------------------------------------------ */
/* Named hotels (property / asset intent)                              */
/* ------------------------------------------------------------------ */

export type PropertyMatch = {
  name: string;
  marketSlug: string;
  rooms: number | null;
  ticker: string;
  reitName: string;
  url: string;
  source: string;
  comps: { date: string; kind: string; hotel: string; counterparty: string | null; priceUsdM: number | null; rooms: number | null; url: string; source: string; ticker: string; pending?: boolean }[];
  curated: {
    name: string;
    submarket?: string;
    facts: { slot: string; text: string; asOf: string | null; chip: string; label: string; url: string }[];
  } | null;
};

export function propertyBrief(p: PropertyMatch, market: MarketRow | null, opts: BriefOpts = {}): ChatBrief {
  const scheduleDate = /as of ([A-Z][a-z]{2} \d{1,2}, \d{4})/.exec(p.source)?.[1] ?? null;
  const scheduleLabel = /as of\s*$/.test(p.source) ? "Property schedule, SEC filing" : p.source;
  const ownerSrc: BriefSource = { kind: "Filing", label: `${p.reitName} ${scheduleLabel.replace(/^Property schedule, /, "property schedule, ")}`, url: p.url };
  const schedShort = /10-K/.test(scheduleLabel) ? `10-K property schedule${scheduleDate ? `, ${scheduleDate}` : ""}` : "SEC filing property schedule";
  const answer = `${p.name}: owned by ${p.reitName} (${p.ticker})${p.rooms ? `, ${p.rooms.toLocaleString("en-US")} rooms` : ""} (${schedShort}).`;

  const curated: Fact[] = (p.curated?.facts ?? []).map((f) => ({
    text: f.text,
    asOf: f.asOf,
    key: dateKey(f.asOf),
    source: withDate({ kind: (["Filing", "Press", "Record", "Data"].includes(f.chip) ? f.chip : chipKind(f.url, f.label)) as BriefSource["kind"], label: f.label, url: f.url, title: f.label, publisher: publisherName(f.url) || undefined }, f.asOf),
    kind: f.slot,
    title: p.name,
    readable: (fitFact(f.text) ?? "") === f.text,
  }));
  // Property rule: owner status, what's on file for the hotel, submarket context (first fact per slot).
  const pick = (slot: string) => curated.find((f) => f.kind === slot && f.readable);
  const marketFactsList = market ? marketFacts(market) : [];
  const submarketFact = pick("submarket") ?? pickReads(marketFactsList, "demand", 1)[0];
  const reads = [pick("owner"), pick("hotel"), submarketFact].filter((x): x is Fact => Boolean(x)).map(toRead);

  const sections: BriefSection[] = [];
  const ownerRows = [
    `- ${p.name}: ${p.rooms ?? "—"} rooms · Filing: [${ownerSrc.label}](${p.url})`,
    ...curated.filter((f) => f.kind === "owner").map((f) => `- ${f.text}${f.asOf ? ` · ${fmtAsOf(f.asOf)}` : ""} · ${f.source.kind}: [${f.source.label}](${f.source.url})`),
  ];
  sections.push({ id: "owner", title: "Owner & filings", count: ownerRows.length, markdown: ownerRows.join("\n") });
  if (p.comps.length) {
    sections.push({
      id: "comps",
      title: "Recorded transactions",
      count: p.comps.length,
      markdown: p.comps
        .map((c) => `- ${fmtAsOf(c.date)} · ${c.kind}${c.pending ? " (pending)" : ""} · ${c.hotel}${c.priceUsdM != null ? ` · $${c.priceUsdM}M` : ""}${c.rooms ? ` · ${c.rooms} rooms` : ""}${c.counterparty ? ` · counterparty ${c.counterparty}` : ""} · Filing: [${c.source}](${c.url})`)
        .join("\n"),
    });
  }
  const hotelRows = curated.filter((f) => f.kind === "hotel");
  if (hotelRows.length) {
    sections.push({
      id: "hotel",
      title: "On file for this hotel",
      count: hotelRows.length,
      markdown: hotelRows.map((f) => `- ${f.text}${f.asOf ? ` · ${fmtAsOf(f.asOf)}` : ""} · ${f.source.kind}: [${f.source.label}](${f.source.url})`).join("\n"),
    });
  }
  const subRows = curated.filter((f) => f.kind === "submarket");
  if (subRows.length) {
    sections.push({
      id: "submarket",
      title: `${p.curated?.submarket ?? "Submarket"} context`,
      count: subRows.length,
      markdown: subRows.map((f) => `- ${f.text}${f.asOf ? ` · ${fmtAsOf(f.asOf)}` : ""} · ${f.source.kind}: [${f.source.label}](${f.source.url})`).join("\n"),
    });
  }
  if (market) {
    const ml = metricsLine(market);
    const mt = metricsTable(market);
    if (mt) sections.push({ ...mt, title: `${shortName(market)} market metrics`, markdown: (ml ? `${shortName(market)}: ${ml}.\n\n` : "") + mt.markdown });
    // The market's own signal rows are not what this hotel answer rests on: link the market page instead.
    sections.push({ id: "further", title: "Further reading", count: 1, markdown: `- [${shortName(market)} market: every cited read](/markets/${market.slug})` });
  }
  const cites: Citation[] = [
    { key: p.url, url: p.url, label: ownerSrc.label, text: ownerSrc.label, asOf: scheduleDate, period: periodOf(scheduleDate) },
    ...curated.map((f) => ({ key: f.source.url!, url: f.source.url, label: f.source.label, text: f.source.label, asOf: f.asOf, period: periodOf(f.asOf) })),
    ...p.comps.map((c) => ({ key: c.url, url: c.url, label: c.source, text: c.source, asOf: c.date, period: periodOf(c.date) })),
    ...(market && metricsTable(market) ? snapshotCite(market) : []),
    ...reads.map(readCite),
  ];
  return makeBrief({
    decline: opts.decline,
    answer,
    reads,
    coverage: coverageLine({
      cites,
      notes: [...(opts.notes ?? []), "Public sources only; no licensed STR."],
    }),
    // Anchored on the owner's property schedule (a standing fact, not a dated series): no date chip.
    window: { range: "all", filterable: false },
    sections,
  });
}
