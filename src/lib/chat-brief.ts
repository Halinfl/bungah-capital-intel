/**
 * Short-answer format for Chat (Eric's spec, Hal approved 2026-10-25).
 *
 * Fully deterministic, no model calls. Every value shown is copied from an existing cited row
 * (Capital Graph signal, market snapshot, authored REIT digest, REIT property schedule or a
 * curated public-source property file): facts are picked, never paraphrased or computed.
 *
 *   answer   one templated line with the intent's headline metrics, date and source
 *   reads    at most 3 one-line facts (<= 140 chars), each with a source chip, chosen by a fixed
 *            rule per intent; a slot with no matching fact is left out (never filler)
 *   coverage muted line: number of cited sources, latest date, coverage gaps
 *   sections detail, collapsed by default, each with its own count
 *   footer   one decision-support line for the whole answer
 */
import type { DigestHit } from "./chat-retrieve";
import { parseSourceUrls, type SourceLink } from "./source-links";
import { cleanSourceLabel, publisherName, scrubInternal } from "./public-text";

export type ChipKind = "Filing" | "Press" | "Record" | "Data";
/**
 * A cited source. `title`, `publisher` and `date` are filled only from real fields of the cited
 * row (link label, URL host, row as-of date); a field with nothing behind it stays undefined.
 */
export type BriefSource = { kind: ChipKind; label: string; url?: string; title?: string; publisher?: string; date?: string };
export type BriefRead = { text: string; asOf: string | null; source: BriefSource };
export type BriefSection = { id: string; title: string; count: number; markdown: string };
export type ChatBrief = {
  /** Fixed decline for buy/sell or staff-cut requests, shown above the answer. */
  decline?: string;
  answer: string;
  reads: BriefRead[];
  coverage: string;
  /** First sentence of the coverage line ("Based on 4 cited sources, Jan–Sep 2026."). */
  basedOn?: string;
  /** Rest of the coverage line (coverage gaps etc.). */
  coverageNotes?: string[];
  /** Count and date span of the citations actually in the answer (never estimated). */
  span?: DataSpan;
  /** Date window this answer was built for; `filterable` false hides the re-ask chip. */
  window?: { range: DateRange; filterable: boolean };
  /** The citations the count and span were computed from (one row per source and cited date). */
  cited?: Citation[];
  sections: BriefSection[];
  footer: string;
  /** Visible characters of the collapsed view (decline + answer + reads + coverage). */
  collapsedChars: number;
};

export type DateRange = "90d" | "12m" | "all";
export const DATE_RANGES: DateRange[] = ["90d", "12m", "all"];
export const RANGE_LABEL: Record<DateRange, string> = { "90d": "Last 90 days", "12m": "Last 12 months", all: "All" };
export function parseRange(v: unknown): DateRange {
  return v === "90d" || v === "12m" ? v : "all";
}
/** One citation behind an answer: a dedupe key (URL, else label) and the cited row's date. */
export type Citation = { key: string; label: string; asOf: string | null | undefined };
export type DataSpan = { sources: number; dated: number; from: string | null; to: string | null; label: string | null };

export const DECISION_LINE = "Decision support, not a recommendation. You make the call.";
export const READ_MAX = 140;

/* ------------------------------------------------------------------ */
/* Text helpers                                                        */
/* ------------------------------------------------------------------ */

export function plain(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/(^|\s)_(.+?)_(?=\s|$|[.,;:])/g, "$1$2")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/** Remove per-row "Decision support…" boilerplate (one decision-support line ends the answer). */
export function stripDecisionBoilerplate(s: string): string {
  return s
    .replace(/\s*\.?\s*\b[Ll]abor underwritten at the new floors(?: with no staff cuts)?\.?/g, ".")
    .replace(/\.\s*\./g, ".")
    .replace(/\s*\bDecision support(?:[;,][^.|\n]*)?\.(?=\s|$|\s*\|)/g, "")
    .replace(/\s*\bDecision support\s*$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Investment-committee thresholds and "below Treasuries" framing never reach the public answer. */
const OFF_LIMITS = /\b(house )?IC (pack|hurdle|threshold)s?\b|\bhurdles?\b|\bthresholds?\b|\bbelow (the )?treasur|\bpropose-only\b|\bwave \d\b/i;

/** Drop sentences carrying off-limits framing (house IC thresholds etc.); facts elsewhere stay. */
export function dropOffLimitsSentences(s: string): string {
  if (!OFF_LIMITS.test(s)) return s;
  return s
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"$~(])/)
    .filter((x) => !OFF_LIMITS.test(x))
    .join(" ");
}

function norm(s: string): string[] {
  return plain(s)
    .toLowerCase()
    .replace(/[’']/g, "")
    .split(/[^a-z0-9.$%]+/)
    .filter((w) => w.length > 2);
}

/** Near-duplicate test: most of the shorter text's words already appear in the other. */
export function nearDuplicate(a: string, b: string): boolean {
  const A = new Set(norm(a));
  const B = new Set(norm(b));
  if (!A.size || !B.size) return false;
  let both = 0;
  for (const w of A) if (B.has(w)) both += 1;
  return both / Math.min(A.size, B.size) >= 0.6;
}

/** Drop repeated / near-duplicate paragraphs, keeping the first occurrence. */
export function dedupeParagraphs(paras: string[]): string[] {
  const out: string[] = [];
  for (const p of paras.map((x) => x.trim()).filter(Boolean)) {
    if (out.some((q) => nearDuplicate(p, q))) continue;
    out.push(p);
  }
  return out;
}

/** Same as dedupeParagraphs for a whole markdown text (tables and lists are compared as blocks). */
export function dedupeMarkdown(md: string): string {
  const blocks = md.split(/\n{2,}/);
  const out: string[] = [];
  for (const b of blocks) {
    const t = b.trim();
    if (!t) continue;
    const isProse = !/^(\||- |#)/.test(t) && t.length > 80;
    if (isProse && out.some((q) => !/^(\||- |#)/.test(q) && nearDuplicate(t, q))) continue;
    if (out.includes(t)) continue;
    out.push(t);
  }
  return out.join("\n\n");
}

/** Split on "; " / " · " separators that sit outside parentheses. */
function splitTopLevel(t: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (c === "(") depth++;
    if (c === ")") depth = Math.max(0, depth - 1);
    if (depth === 0 && c === ";" && t[i + 1] === " ") {
      out.push(cur.trim());
      cur = "";
      i++;
      continue;
    }
    if (depth === 0 && c === " " && t.slice(i, i + 3) === " · ") {
      out.push(cur.trim());
      cur = "";
      i += 2;
      continue;
    }
    cur += c;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** Shorten a fact to <= max chars only at clause boundaries (no mid-clause cuts, no ellipsis). */
export function fitFact(text: string, max = READ_MAX): string | null {
  let t = plain(text).replace(/\s*\(\s*(company release|source:[^)]*)\s*\)/gi, "").trim();
  t = t.replace(/[\s;,]+$/, "");
  if (t.length <= max) return t;
  // Drop trailing parentheticals.
  for (let k = 0; k < 3 && t.length > max; k++) {
    const m = /\s*\([^()]*\)\s*$/.exec(t);
    if (!m) break;
    t = t.slice(0, m.index).trim();
  }
  if (t.length <= max) return t;
  // Keep whole leading clauses split by "; " or " · " (never inside parentheses).
  const parts = splitTopLevel(t);
  let acc = "";
  for (const p of parts) {
    const next = acc ? `${acc}; ${p}` : p;
    if (next.length > max) break;
    acc = next;
  }
  return acc && acc.length >= 30 ? acc : null;
}

/* ------------------------------------------------------------------ */
/* Dates                                                               */
/* ------------------------------------------------------------------ */

const MONTHS: Record<string, number> = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Sortable yyyymmdd key for a free-form "as of" string (0 when undated). */
export function dateKey(s: string | null | undefined): number {
  if (!s) return 0;
  let m = /(20\d{2})-(\d{2})(?:-(\d{2}))?/.exec(s);
  if (m) return +m[1] * 10000 + +m[2] * 100 + +(m[3] ?? 15);
  m = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(?:(\d{1,2}),?\s+)?(20\d{2})\b/i.exec(s);
  if (m) return +m[3] * 10000 + MONTHS[m[1].toLowerCase()] * 100 + +(m[2] ?? 15);
  m = /\bQ([1-4])[\s-]?(?:FY)?(20\d{2})\b|\b(20\d{2})[\s-]?Q([1-4])\b/i.exec(s);
  if (m) {
    const q = +(m[1] ?? m[4]);
    const y = +(m[2] ?? m[3]);
    return y * 10000 + q * 300 + 30;
  }
  m = /\b(?:YE|CY)\s?(20\d{2})\b/i.exec(s);
  if (m) return +m[1] * 10000 + 1231;
  m = /\bFY\s?(20\d{2})\b/i.exec(s);
  if (m) return +m[1] * 10000 + 630;
  m = /\b(20\d{2})\b/.exec(s);
  if (m) return +m[1] * 10000 + 701;
  return 0;
}

/** Display date: "2026-10-19" → "Oct 19, 2026"; anything else as written (trimmed of asides). */
export function fmtAsOf(s: string | null | undefined): string | null {
  if (!s) return null;
  const t = s.replace(/\s*\(.*$/, "").trim();
  const m = /^(20\d{2})-(\d{2})-(\d{2})$/.exec(t);
  if (m) return `${MONTH_NAMES[+m[2] - 1]} ${+m[3]}, ${m[1]}`;
  const m2 = /^(20\d{2})-(\d{2})$/.exec(t);
  if (m2) return `${MONTH_NAMES[+m2[2] - 1]} ${m2[1]}`;
  return t || null;
}

/** A date as a period (yyyymmdd keys) at the granularity it was written; null when undated. */
export type Period = { start: number; end: number; startLabel: string; endLabel: string; gran: "day" | "month" | "quarter" | "year" };
const DIM = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const monthPeriod = (y: number, mo: number): Period => ({
  start: y * 10000 + mo * 100 + 1,
  end: y * 10000 + mo * 100 + DIM[mo - 1],
  startLabel: `${MONTH_NAMES[mo - 1]} ${y}`,
  endLabel: `${MONTH_NAMES[mo - 1]} ${y}`,
  gran: "month",
});
const yearPeriod = (y: number, prefix = ""): Period => ({ start: y * 10000 + 101, end: y * 10000 + 1231, startLabel: `${prefix}${y}`, endLabel: `${prefix}${y}`, gran: "year" });

export function periodOf(raw: string | null | undefined): Period | null {
  if (!raw) return null;
  // Ignore access stamps ("accessed 2026-10-11"): they date the lookup, not the data.
  const s = raw.replace(/\(?\baccessed\b[^);]*\)?/gi, " ");
  let m = /\b(20\d{2})-(\d{2})-(\d{2})\b/.exec(s);
  if (m) {
    const k = +m[1] * 10000 + +m[2] * 100 + +m[3];
    const l = `${MONTH_NAMES[+m[2] - 1]} ${m[1]}`;
    return { start: k, end: k, startLabel: l, endLabel: l, gran: "day" };
  }
  m = /\b(20\d{2})-(\d{2})\b/.exec(s);
  if (m && +m[2] >= 1 && +m[2] <= 12) return monthPeriod(+m[1], +m[2]);
  m = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2}),?\s+(20\d{2})\b/i.exec(s);
  if (m) {
    const mo = MONTHS[m[1].toLowerCase()];
    const k = +m[3] * 10000 + mo * 100 + +m[2];
    const l = `${MONTH_NAMES[mo - 1]} ${m[3]}`;
    return { start: k, end: k, startLabel: l, endLabel: l, gran: "day" };
  }
  m = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(20\d{2})\b/i.exec(s);
  if (m) return monthPeriod(+m[2], MONTHS[m[1].toLowerCase()]);
  m = /\bQ([1-4])[\s-]?(?:FY)?(20\d{2})\b|\b(20\d{2})[\s-]?Q([1-4])\b/i.exec(s);
  if (m) {
    const q = +(m[1] ?? m[4]);
    const y = +(m[2] ?? m[3]);
    const l = `Q${q} ${y}`;
    return { start: y * 10000 + (q * 3 - 2) * 100 + 1, end: y * 10000 + q * 300 + DIM[q * 3 - 1], startLabel: l, endLabel: l, gran: "quarter" };
  }
  m = /\b(?:YE|CY)\s?(20\d{2})\b/i.exec(s);
  if (m) return yearPeriod(+m[1]);
  m = /\bFY\s?(20\d{2})\b/i.exec(s);
  if (m) return yearPeriod(+m[1], "FY ");
  m = /\b(20\d{2})\b/.exec(s);
  if (m) return yearPeriod(+m[1]);
  return null;
}

function keyMinusDays(k: number, days: number): number {
  const d = new Date(Date.UTC(Math.floor(k / 10000), (Math.floor(k / 100) % 100) - 1, k % 100));
  d.setUTCDate(d.getUTCDate() - days);
  return d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
}

/** First day (yyyymmdd) of a date window; 0 for All. */
export function rangeCutoff(range: DateRange, today = todayKey()): number {
  if (range === "90d") return keyMinusDays(today, 90);
  if (range === "12m") return keyMinusDays(today, 365);
  return 0;
}

/**
 * True when a cited date falls in the window: its period overlaps [cutoff, today]. Undated or
 * future-dated rows are outside any window (we can't show they're in it); All keeps every row.
 */
export function inRange(asOf: string | null | undefined, range: DateRange, today = todayKey()): boolean {
  if (range === "all") return true;
  const p = periodOf(asOf);
  if (!p) return false;
  return p.end >= rangeCutoff(range, today) && p.start <= today;
}

/** Count and date span of the citations in an answer, from their own dates. */
export function dataSpan(cites: Citation[]): DataSpan {
  const byKey = new Map<string, Period[]>();
  for (const c of cites) {
    if (!c.key) continue;
    const list = byKey.get(c.key) ?? [];
    const p = periodOf(c.asOf);
    if (p) list.push(p);
    byKey.set(c.key, list);
  }
  let first: Period | null = null;
  let last: Period | null = null;
  let dated = 0;
  for (const ps of byKey.values()) {
    if (ps.length) dated += 1;
    for (const p of ps) {
      if (!first || p.start < first.start) first = p;
      if (!last || p.end > last.end) last = p;
    }
  }
  let label: string | null = null;
  if (first && last) {
    const a = first.startLabel;
    const b = last.endLabel;
    const ma = /^([A-Z][a-z]{2}) (20\d{2})$/.exec(a);
    const mb = /^([A-Z][a-z]{2}) (20\d{2})$/.exec(b);
    label = a === b ? a : ma && mb && ma[2] === mb[2] ? `${ma[1]}–${mb[1]} ${mb[2]}` : `${a}–${b}`;
  }
  return { sources: byKey.size, dated, from: first?.startLabel ?? null, to: last?.endLabel ?? null, label };
}

function todayKey(): number {
  const d = new Date();
  return d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
}

/* ------------------------------------------------------------------ */
/* Source chips                                                        */
/* ------------------------------------------------------------------ */

/** Filing / Record / Data / Press, from the source URL and label (same chip names as Recent Deals). */
export function chipKind(url: string | undefined, label: string): ChipKind {
  const u = (url ?? "").toLowerCase();
  const l = label.toLowerCase();
  if (/sec\.gov|edgar/.test(u) || /\b(10-k|10-q|8-k|20-f|s-11|proxy|annual report|sec filing|property schedule|emma|bondholder disclosure)\b/.test(l)) return "Filing";
  if (
    /\.gov\b|\.gov\/|\.us\/|federalreserve|treasury|occompt|comptroller|countyclerk|courts?\./.test(u) ||
    /\b(county|city of|comptroller|department of|dept of|budget|ordinance|ord\.|court|deed|recorder|idor|nys dtf|dof|omb|federal reserve|u\.s\. treasury|bls)\b/.test(l)
  )
    return "Record";
  if (
    /fred\.stlouisfed|trepp|costar|str\.com|lodgingeconometrics|cbre|jll|airportdata|bts\.gov|kalibri|hotstats|visit|cvb|tourism|lvcva|choosechicago|airport|flymco|aviation/.test(u) ||
    /\b(fred|trepp|trepptalk|costar|str|lodging econometrics|cbre|jll|cvb|gmcvb|lvcva|choose chicago|visit [a-z]+|tourism|airport|bts|data|research|survey|index|hotel performance)\b/.test(l)
  )
    return "Data";
  return "Press";
}

function sourceFrom(link: SourceLink | undefined, fallbackLabel: string): BriefSource {
  if (link) {
    // Link labels are "<item> — <publisher>"; without a publisher part, name the publisher by URL.
    const parts = link.label.split(/\s+—\s+/);
    const raw = scrubInternal(parts.length > 1 ? parts[parts.length - 1] : publisherName(link.url)) || publisherName(link.url);
    // The read shows its own date, so drop a trailing "(Oct 13)" from the publisher.
    const label = raw.replace(/\s*\((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.? \d{1,2}(, ?20\d{2})?\)$/, "") || raw;
    // Popover fields, only from the link itself: title = the label's item part, publisher = its
    // publisher part (else the URL's publisher). A host-only label is not a title.
    const host = hostOf(link.url);
    const titleRaw = parts.length > 1 ? parts.slice(0, -1).join(" — ") : link.label;
    const title = scrubInternal(titleRaw).trim();
    const publisher = label || publisherName(link.url);
    return {
      kind: chipKind(link.url, link.label),
      label,
      url: link.url,
      title: title && title !== host && title !== publisher ? title : undefined,
      publisher: publisher || undefined,
    };
  }
  const cleaned = cleanSourceLabel(fallbackLabel).replace(/\s*https?:\/\/\S+/g, "").replace(/\s*\(accessed [^)]*\)\s*$/i, "").trim();
  const label = cleaned || "Cited source";
  return { kind: chipKind(undefined, label), label, title: cleaned || undefined };
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** Attach the cited row's own date to a source (for the source preview). */
export function withDate(src: BriefSource, asOf: string | null | undefined): BriefSource {
  const d = fmtAsOf(asOf);
  return d ? { ...src, date: d } : src;
}

/* ------------------------------------------------------------------ */
/* Facts from Capital Graph signals                                    */
/* ------------------------------------------------------------------ */

export type SignalLike = {
  id?: string;
  kind: string;
  title: string;
  body: string;
  magnitude: string | null;
  asOf: string | null;
  sourceLabel: string;
  sourceUrls?: unknown;
};

export type Fact = {
  text: string;
  asOf: string | null;
  key: number;
  source: BriefSource;
  kind: string;
  title: string;
  /** Detail topic of the source row (Demand, Supply & pipeline, Debt & deals…). */
  topic?: string;
  /** Eligible for a key read (dated, sourced, not a gap / rule row, fits 140 chars). */
  readable: boolean;
};

const NO_READ = /no public read|\bn\/a\b|\bgaps?\b.*no public read|\btag:\s*none\b|\(none: national applies\)/i;
const INLINE_DATE = /\b20\d{2}-\d{2}(-\d{2})?\b|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.? (\d{1,2},? )?20\d{2}\b/;
/** A fact worth a key read carries a figure (%, $, counts, keys, bp…), not just a year. */
const METRIC = /\d(\.\d+)?\s?%|\$\s?\d|\b\d{1,3}(,\d{3})+\b|\b\d+(\.\d+)?\s?(M|B|k|K|x|bp|bps|pts?|keys|rooms|projects|hotels|visitors|passengers)\b|[+−]\s?\d|\b\d+\s?\/\s?\d+\b/;
const RULE_ROW = /\bis not the same as\b|\brule\b|\bNOT RevPAR\b/i;

/** Strip a leading "Chicago — debt & deals: Title." restatement of the title. */
function stripRestatedTitle(title: string, body: string): string {
  // "Nashville — Supply-pressure score: 4 / 5 (heavy). UC intensity: …" → "UC intensity: …"
  const t = title.toLowerCase();
  let b = body;
  for (let k = 0; k < 2; k++) {
    const stop = b.search(/\.\s/);
    if (stop <= 0 || stop >= 120) break;
    const head = b.slice(0, stop).toLowerCase().replace(/\([^)]*\)/g, "");
    const words = head.split(/[^a-z0-9]+/).filter((w) => w.length > 2);
    if (!words.length || !words.every((w) => t.includes(w))) break;
    b = b.slice(stop + 2).trim();
  }
  if (b !== body) return b;
  const tail = title.split(":").pop()!.trim();
  if (tail.length < 4) return body;
  const i = body.indexOf(tail);
  if (i < 0 || i > 160) return body;
  const after = body.slice(i + tail.length);
  const m = /^\s*(\([^)]*\))?\s*[.:]\s*/.exec(after);
  return m ? after.slice(m[0].length) : body;
}

/** Split a signal into one row per item (bodies join items with " | "). */
export function signalItems(s: SignalLike): { text: string; asOf: string | null }[] {
  const body = dropOffLimitsSentences(stripDecisionBoilerplate(scrubInternal(s.body)));
  const parts = body.split(/\s+\|\s+/).map((x) => x.trim()).filter(Boolean);
  if (parts.length < 2) return [];
  parts[0] = stripRestatedTitle(s.title, parts[0]);
  // Items keep their own "·" segments verbatim; their date is the cited row's as-of date.
  return parts.map((p) => ({ text: p.replace(/\.$/, ""), asOf: null }));
}

function specificLink(item: string, links: SourceLink[]): SourceLink | undefined {
  const it = item.toLowerCase();
  for (const l of links) {
    const head = l.label.split(/\s+—\s+|:\s/)[0].toLowerCase().trim();
    if (head.length >= 6 && it.startsWith(head.slice(0, Math.min(24, head.length)))) return l;
  }
  return undefined;
}

function linkFor(item: string, links: SourceLink[]): SourceLink | undefined {
  return specificLink(item, links) ?? links[0];
}

/** Every fact a signal carries: the signal headline, plus one fact per " | " item. */
export function signalFacts(s: SignalLike): Fact[] {
  return signalFactsRaw(s).map((f) => ({ ...f, topic: topicOf(s) }));
}

function signalFactsRaw(s: SignalLike): Fact[] {
  const links = parseSourceUrls(s.sourceUrls);
  const items = signalItems(s);
  const title = scrubInternal(s.title);
  const sigBad = NO_READ.test(`${title} ${s.magnitude ?? ""}`) || RULE_ROW.test(`${title} ${s.magnitude ?? ""}`) || /gaps?\b/i.test(title);
  const out: Fact[] = [];
  if (!items.length) {
    const mag = s.magnitude && !METRIC.test(title) && !title.includes(s.magnitude) && METRIC.test(s.magnitude) && !/^(rule|none|—)$/i.test(s.magnitude) ? s.magnitude : null;
    const withMag = mag ? fitFact(`${title}: ${mag}`) : null;
    const head = withMag ?? title;
    const text = fitFact(dropOffLimitsSentences(head));
    out.push({
      text: text ?? plain(head),
      asOf: s.asOf,
      key: dateKey(s.asOf),
      source: withDate(sourceFrom(links[0], s.sourceLabel), s.asOf),
      kind: s.kind,
      title,
      readable: Boolean(text) && !sigBad && !NO_READ.test(`${title} ${s.body}`.slice(0, 400)) && METRIC.test(text ?? "") && !OFF_LIMITS.test(head),
    });
    return out;
  }
  for (const it of items) {
    const text = fitFact(it.text);
    // An item that carries its own date ("… · 2025-11-05", "Sep 2026") sorts by it and shows no second date.
    const inline = INLINE_DATE.exec(text ?? it.text)?.[0] ?? null;
    const asOf = inline ? null : it.asOf ?? s.asOf;
    out.push({
      text: text ?? plain(it.text),
      asOf,
      key: dateKey(inline ?? asOf),
      source: withDate(sourceFrom(linkFor(it.text, links), s.sourceLabel), s.asOf),
      kind: s.kind,
      title,
      readable: Boolean(text) && !sigBad && !NO_READ.test(it.text) && !RULE_ROW.test(it.text) && METRIC.test(it.text) && !OFF_LIMITS.test(it.text),
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Read selection: fixed rule per intent                                */
/* ------------------------------------------------------------------ */

export type Lens = "demand" | "supply" | "debt" | "talent";
type Slot = (f: Fact) => boolean;

const has = (re: RegExp): Slot => (f) => re.test(f.text);
const kindIn = (...k: string[]): Slot => (f) => k.includes(f.kind);
const any = (...s: Slot[]): Slot => (f) => s.some((x) => x(f));
const not = (s: Slot): Slot => (f) => !s(f);
const all = (...s: Slot[]): Slot => (f) => s.every((x) => x(f));

const TAXY = any(kindIn("tax"), has(/\b(tax|TDT|TOT|HOT|CDT|collections?)\b/i), (f) => f.topic === "Tax & CVB");
const topicIn = (...t: string[]): Slot => (f) => t.includes(f.topic ?? "");
const SUPPLYISH = any(kindIn("supply", "pipeline"), topicIn("Supply & pipeline"), (f) => /supply|pipeline|construction|new keys|absorption/i.test(f.title));

export const SLOT_RULES: Record<Lens, { name: string; test: Slot }[]> = {
  // demand: RevPAR or OCC trend, the driver, and one risk
  demand: [
    { name: "trend", test: all(has(/\b(RevPAR|OCC|occupancy|ADR)\b/i), has(/[+−-]\s?\d|\d(\.\d+)?\s?%/), not(TAXY), not(topicIn("Labor & talent"))) },
    {
      name: "driver",
      test: all(
        has(/\b(driven by|driver|demand|visitors?|visitation|group|convention|meetings?|citywides?|airlift|passengers?|pax|seats?|routes?|World Cup|leisure|attendance)\b/i),
        not(TAXY),
        topicIn("Demand", "Performance", "Other signals")
      ),
    },
    {
      name: "risk",
      test: all(
        has(/\b(risk|distress|foreclos\w*|default|special servic\w*|delinquen\w*|strike|soft\w*|weak\w*|fell|declin\w*|drop\w*|lags?|lagging|negative|shutdown|ceased|won't repeat|only top-25 market down)\b/i),
        not(TAXY)
      ),
    },
  ],
  // supply: pipeline as a share of rooms, next openings, and the source date (score row)
  supply: [
    { name: "share", test: all(SUPPLYISH, has(/% of (inventory|supply|rooms|existing)|share of|under construction|\bUC\b|inventory/i)) },
    { name: "openings", test: all(SUPPLYISH, has(/\b(open\w*|reopen\w*|deliver\w*|new keys|keys|conversions?|supply-return|late 20\d\d)\b/i)) },
    { name: "dated", test: SUPPLYISH },
  ],
  // debt: delinquency, refinancing wall and rate
  debt: [
    { name: "delinquency", test: has(/\b(delinquen\w*|DQ|special[- ]servic\w*|non-performing|NPL|distress|foreclos\w*|default)\b/i) },
    { name: "wall", test: all(has(/\b(matur\w*|refinanc\w*|wall|loans?|CMBS|SASB|takeout|mortgage)\b/i), not(TAXY)) },
    { name: "rate", test: all(has(/\b(10-year|10Y|Treasury|SOFR|fed funds|rates?|spreads?|cap rate|yields?)\b/i), not(TAXY)) },
  ],
  // talent: wage floor / contract, labor supply, one risk (labor rows only)
  talent: [
    { name: "wage", test: all(topicIn("Labor & talent"), has(/\b(wage|minimum|union|UNITE HERE|Local \d+|collective|ordinance)\b|\$\d+(\.\d+)?\/hr/i)) },
    { name: "labor", test: all(topicIn("Labor & talent"), has(/\b(construction jobs|craft|jobs|employment|OEWS|housekeep\w*|staffing|workers)\b/i)) },
    { name: "risk", test: all(topicIn("Labor & talent"), has(/\b(strike|pre-open|shortage|turnover|re-bid)\b/i)) },
  ],
};

/**
 * Pick at most `max` reads: one per slot, in slot order, newest matching fact first; a slot with
 * no matching fact is skipped. Reads are then shown most recent first.
 */
export function pickReads(facts: Fact[], lens: Lens, max = 3, used: Set<string> = new Set()): Fact[] {
  const pool = facts.filter((f) => f.readable).sort((a, b) => b.key - a.key);
  const out: Fact[] = [];
  for (const slot of SLOT_RULES[lens]) {
    if (out.length >= max) break;
    const f = pool.find((x) => slot.test(x) && !used.has(x.text) && !out.includes(x));
    if (f) out.push(f);
  }
  return out.sort((a, b) => b.key - a.key);
}

export function toRead(f: Fact): BriefRead {
  return { text: f.text, asOf: fmtAsOf(f.asOf), source: f.source };
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

const TOPIC_BY_KIND: Record<string, string> = {
  supply: "Supply & pipeline",
  pipeline: "Supply & pipeline",
  demand: "Demand",
  visitation: "Demand",
  airlift: "Demand",
  citywide_calendar: "Demand",
  drive: "Demand",
  world_cup: "Demand",
  performance: "Performance",
  talent: "Labor & talent",
  debt: "Debt & deals",
  deal: "Debt & deals",
  transaction: "Debt & deals",
  cmbs: "Debt & deals",
  cap_rate: "Debt & deals",
  rates: "Debt & deals",
  tax: "Tax & CVB",
};

export function topicOf(s: SignalLike): string {
  const t = s.title.toLowerCase();
  if (/debt & deals|cmbs|loan|transaction/.test(t)) return "Debt & deals";
  if (/tax & cvb|hotel-tax|occupancy tax|\btax\b/.test(t)) return "Tax & CVB";
  if (/talent|labor|wage|staffing/.test(t)) return "Labor & talent";
  if (/supply|pipeline|construction|openings?/.test(t)) return "Supply & pipeline";
  return TOPIC_BY_KIND[s.kind] ?? "Other signals";
}

const LENS_TOPIC: Record<Lens, string> = {
  demand: "Demand",
  supply: "Supply & pipeline",
  debt: "Debt & deals",
  talent: "Labor & talent",
};

function itemLine(text: string, asOf: string | null, src: BriefSource): string {
  // One row per item; its own source only when it differs from the row's primary source.
  const date = fmtAsOf(asOf);
  const s = src.url ? `[${src.label}](${src.url})` : src.label;
  return `- ${plain(text)}${date ? ` · ${date}` : ""} · ${src.kind}: ${s}`;
}

/** Signals grouped by topic, one row per item (no "|" run-ons), lens topic first. */
export function signalSections(signals: SignalLike[], lens: Lens | null, idPrefix = "sig"): BriefSection[] {
  const groups = new Map<string, SignalLike[]>();
  for (const s of signals) {
    const k = topicOf(s);
    groups.set(k, [...(groups.get(k) ?? []), s]);
  }
  const order = [...groups.keys()].sort((a, b) => {
    const la = lens && a === LENS_TOPIC[lens] ? -1 : 0;
    const lb = lens && b === LENS_TOPIC[lens] ? -1 : 0;
    return la - lb;
  });
  return order.map((topic) => {
    const list = groups.get(topic)!;
    let count = 0;
    const blocks = list.map((s) => {
      const links = parseSourceUrls(s.sourceUrls);
      const items = signalItems(s);
      const title = scrubInternal(s.title);
      const date = fmtAsOf(s.asOf);
      if (!items.length) {
        count += 1;
        const body = dropOffLimitsSentences(stripDecisionBoilerplate(scrubInternal(s.body)));
        const src = sourceFrom(links[0], s.sourceLabel);
        return [
          `**${title}**${s.magnitude && !/^(rule|—)$/i.test(s.magnitude) ? ` (${s.magnitude}${date ? `, ${date}` : ""})` : date ? ` (${date})` : ""}`,
          "",
          `- ${plain(body)} · ${src.kind}: ${src.url ? `[${src.label}](${src.url})` : src.label}`,
        ].join("\n");
      }
      count += items.length;
      const primary = sourceFrom(links[0], s.sourceLabel);
      return [
        `**${title}**${date ? ` (${date})` : ""} · ${primary.kind}: ${primary.url ? `[${primary.label}](${primary.url})` : primary.label}`,
        "",
        ...items.map((it) => {
          const own = specificLink(it.text, links);
          return own && own.url !== links[0]?.url ? itemLine(it.text, null, sourceFrom(own, s.sourceLabel)) : `- ${plain(it.text)}`;
        }),
      ].join("\n");
    });
    return { id: `${idPrefix}-${topic.toLowerCase().replace(/[^a-z]+/g, "-")}`, title: topic, count, markdown: blocks.join("\n\n") };
  });
}

/** Clickable source list for a set of signals / reads (deduped by URL). */
export function sourcesSection(links: { url: string; label: string }[], extra: string[] = []): BriefSection | null {
  const seen = new Set<string>();
  const rows: string[] = [];
  for (const l of links) {
    if (!l.url || seen.has(l.url)) continue;
    seen.add(l.url);
    rows.push(`- [${scrubInternal(l.label)}](${l.url})`);
  }
  for (const e of extra) {
    const t = scrubInternal(e).trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    rows.push(`- ${t}`);
  }
  if (!rows.length) return null;
  return { id: "sources", title: "Sources", count: rows.length, markdown: rows.join("\n") };
}

export function signalLinks(signals: SignalLike[]): { url: string; label: string }[] {
  return signals.flatMap((s) => parseSourceUrls(s.sourceUrls).map((l) => ({ url: l.url, label: l.label })));
}

/* ------------------------------------------------------------------ */
/* Coverage + assembly                                                 */
/* ------------------------------------------------------------------ */

export type Coverage = { text: string; basedOn: string; notes: string[]; span: DataSpan; cited: Citation[] };

/**
 * "Based on N cited sources, <date span>." N and the span come from the answer's own citations
 * (distinct URL / label, each with its cited row's date); nothing is estimated. Undated sources
 * count toward N but not the span, and the line says how many were dated.
 */
export function coverageLine(opts: { cites: Citation[]; notes?: string[]; range?: DateRange }): Coverage {
  const span = dataSpan(opts.cites);
  const range = opts.range ?? "all";
  const n = span.sources;
  const win = range === "all" ? "" : ` (${RANGE_LABEL[range].toLowerCase()})`;
  const basedOn =
    n > 0
      ? `Based on ${n} cited source${n === 1 ? "" : "s"}${span.dated && span.dated < n ? ` (${span.dated} dated)` : ""}${span.label ? `, ${span.label}` : ""}${win}.`
      : range === "all"
        ? "No cited figures for this question."
        : `No cited sources dated in the ${RANGE_LABEL[range].toLowerCase()} for this question.`;
  const notes = (opts.notes ?? []).filter(Boolean);
  const seen = new Set<string>();
  const cited = opts.cites
    .filter((c) => c.key)
    .map((c) => ({ key: c.key, label: scrubInternal(c.label), asOf: c.asOf ?? null }))
    .filter((c) => {
      const k = `${c.key}\u0000${c.asOf ?? ""}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  return { text: [basedOn, ...notes].join(" "), basedOn, notes, span, cited };
}

function readVisible(r: BriefRead): string {
  return `${r.text}${r.asOf ? ` · ${r.asOf}` : ""} ${r.source.kind}`;
}

export function collapsedLength(b: Pick<ChatBrief, "decline" | "answer" | "reads" | "coverage">): number {
  return [b.decline ? plain(b.decline) : "", plain(b.answer), ...b.reads.map(readVisible), plain(b.coverage)].filter(Boolean).join("\n").length;
}

export function makeBrief(
  input: Omit<ChatBrief, "collapsedChars" | "footer" | "coverage"> & { footer?: string; coverage: string | Coverage }
): ChatBrief {
  const cov = typeof input.coverage === "string" ? null : input.coverage;
  const b = { ...input, coverage: cov ? cov.text : (input.coverage as string) };
  const clean: ChatBrief = {
    ...(cov ? { basedOn: scrubInternal(cov.basedOn), coverageNotes: cov.notes.map(scrubInternal), span: cov.span, cited: cov.cited } : {}),
    ...(b.window ? { window: b.window } : {}),
    decline: b.decline ? scrubInternal(b.decline) : undefined,
    answer: scrubInternal(b.answer),
    reads: b.reads.slice(0, 3).map((r) => ({
      ...r,
      text: scrubInternal(r.text),
      source: {
        ...r.source,
        label: scrubInternal(r.source.label),
        ...(r.source.title ? { title: scrubInternal(r.source.title) } : {}),
        ...(r.source.publisher ? { publisher: scrubInternal(r.source.publisher) } : {}),
      },
    })),
    coverage: scrubInternal(b.coverage),
    sections: b.sections
      .filter((s) => s.count > 0 && s.markdown.trim())
      .map((s) => ({ ...s, title: scrubInternal(s.title), markdown: dedupeMarkdown(scrubInternal(s.markdown)) })),
    footer: b.footer ?? DECISION_LINE,
    collapsedChars: 0,
  };
  clean.collapsedChars = collapsedLength(clean);
  return clean;
}

/** Markdown rendering of a brief: stored as the answer text (threads / logs) and used without JS. */
export function briefMarkdown(b: ChatBrief): string {
  const read = (r: BriefRead) =>
    `- ${r.text}${r.asOf ? ` · ${r.asOf}` : ""} · ${r.source.kind}: ${r.source.url ? `[${r.source.label}](${r.source.url})` : r.source.label}`;
  return [
    ...(b.decline ? [b.decline, ""] : []),
    b.answer,
    "",
    ...(b.reads.length ? [b.reads.map(read).join("\n"), ""] : []),
    `_${b.coverage}_`,
    "",
    ...b.sections.flatMap((s) => [`### ${s.title} (${s.count})`, "", s.markdown, ""]),
    b.footer,
  ].join("\n");
}

/* ------------------------------------------------------------------ */
/* REIT digests                                                        */
/* ------------------------------------------------------------------ */

function section(md: string, heading: RegExp): string {
  const lines = md.split("\n");
  const start = lines.findIndex((l) => /^## /.test(l) && heading.test(l));
  if (start < 0) return "";
  const end = lines.findIndex((l, i) => i > start && /^## /.test(l));
  return lines.slice(start + 1, end < 0 ? undefined : end).join("\n").trim();
}

function tableRows(md: string): string[][] {
  return md
    .split("\n")
    .filter((l) => l.startsWith("|") && !/^\|\s*-/.test(l))
    .map((l) => l.split("|").slice(1, -1).map((c) => plain(c)));
}

function bullets(md: string): string[] {
  return md
    .split("\n")
    .filter((l) => /^- /.test(l))
    .map((l) =>
      plain(l.slice(2)).replace(/\s*\((?:\s*\/?\s*(?:slides|company release|supplement|8-K|highlights?(?: PDF)?|stats table|release))+\s*\)\s*$/i, "")
    );
}

export type DigestFacts = {
  name: string;
  ticker: string;
  period: string;
  headline: string | null;
  guidance: Fact | null;
  capital: Fact | null;
  color: Fact | null;
  /** Development pipeline and net-unit-growth facts (brand REITs / C-corps). */
  pipeline: Fact | null;
  nugGuide: Fact | null;
  source: BriefSource;
  links: { url: string; label: string }[];
  guidanceMd: string;
  balanceMd: string;
  excerpt: string;
};

/** Release / call date written in a digest ("Call / release date: Release 2026-08-05"); null if none. */
export function digestDate(d: DigestHit, raw?: string): string | null {
  const md = raw ?? d.raw ?? d.excerpt;
  return /(?:release|call)[^\n]*?(20\d{2}-\d{2}-\d{2})/i.exec(md)?.[1] ?? null;
}

/** Structured facts from one authored digest (company-reported figures, copied as written). */
export function digestFacts(d: DigestHit, raw: string): DigestFacts {
  const md = scrubInternal(raw);
  const period = /(20\d{2})-Q([1-4])/.exec(d.citePath);
  const periodLabel = period ? `Q${period[2]} ${period[1]}` : d.period;
  const release = digestDate(d, md);

  const srcLines = section(md, /Sources/)
    .split("\n")
    .filter((l) => /https?:\/\//.test(l) && !/_raw\//.test(l));
  const links = srcLines
    .map((l) => {
      const url = /(https?:\/\/[^\s)`]+)/.exec(l)?.[1] ?? "";
      const label = plain(l.replace(/^-\s*/, "").replace(/https?:\/\/\S+/g, "").replace(/\(`[^`]*`\)/g, "").replace(/[—:\s]+$/, "")) || publisherName(url);
      return { url, label };
    })
    .filter((l) => l.url);
  const filing = links.find((l) => /sec\.gov/.test(l.url));
  const releaseLink = links.find((l) => /release/i.test(l.label)) ?? links[0];
  const relDate = fmtAsOf(release) ?? undefined;
  const source: BriefSource = filing
    ? { kind: "Filing", label: `${d.name} ${periodLabel} earnings release (8-K)`, url: filing.url, title: filing.label || undefined, publisher: d.name, date: relDate }
    : { kind: "Press", label: `${d.name} ${periodLabel} earnings release`, url: releaseLink?.url, title: releaseLink?.label || undefined, publisher: d.name, date: relDate };

  const fact = (text: string | null): Fact | null => {
    if (!text) return null;
    const t = fitFact(text);
    return t ? { text: t, asOf: release, key: dateKey(release), source, kind: "reit", title: d.name, readable: true } : null;
  };

  // Headline: the first RevPAR row of the operating KPI table (value and change as reported).
  const kpis = tableRows(section(md, /Operating KPIs/));
  const valued = kpis.slice(1).filter((r) => /RevPAR/i.test(r[0] ?? "") && r[1] && r[1] !== "—");
  const kpiHead = valued.find((r) => !/Total/i.test(r[0])) ?? valued[0];
  let headline: string | null = null;
  if (kpiHead && kpis[0]) {
    const hdr = kpis[0];
    const ci = hdr.findIndex((h, i) => i > 1 && /change|y\/y|^vs\b/i.test(h));
    const vs = ci > 0 && /^vs\b/i.test(hdr[ci]) ? hdr[ci] : `vs ${hdr[2] ?? "prior year"}`;
    const change = ci > 0 ? kpiHead[ci] : null;
    headline = `${kpiHead[0]} ${kpiHead[1]}${change && change !== "—" ? ` (${change} ${vs})` : ""}`;
  }

  // Guidance: the guide row / bullet for RevPAR (non-Total first), under its heading.
  const guideMd = section(md, /Outlook/);
  const guideHead = plain(/^\*\*([^*]+)\*\*/m.exec(guideMd)?.[1] ?? "FY guidance").replace(/:$/, "");
  const gRows = tableRows(guideMd);
  let guidance: string | null = null;
  const gRow = gRows.slice(1).find((r) => /RevPAR/i.test(r[0]) && !/Total/i.test(r[0])) ?? gRows.slice(1).find((r) => /RevPAR/i.test(r[0]));
  if (gRow) {
    const hdr = gRows[0];
    const pi = hdr.findIndex((h) => /prior/i.test(h));
    guidance = hdr[1] && /low/i.test(hdr[1]) && hdr[2] && /high/i.test(hdr[2])
      ? `${guideHead}: ${gRow[0]} ${gRow[1]} to ${gRow[2]}`
      : `${guideHead}: ${gRow[0]} ${gRow[1]}${pi > 0 && gRow[pi] && gRow[pi] !== "—" ? ` (prior ${gRow[pi]})` : ""}`;
  } else {
    const b = bullets(guideMd).find((x) => /RevPAR/i.test(x));
    if (b) guidance = `${guideHead}: ${b}`;
  }

  // Capital allocation: capital return / buyback / dividend facts, guidance bullets first.
  const balMd = section(md, /Balance sheet/);
  const capCands = [
    ...bullets(guideMd).filter((x) => /capital return/i.test(x)),
    ...bullets(balMd).filter((x) => /^(Q\d |1H |YTD )?(buybacks?|repurchas\w*|capital return|dividend)/i.test(x)),
    ...bullets(balMd).filter((x) => /buyback|repurchas|capital return|dividend/i.test(x)),
    ...bullets(balMd).filter((x) => /matur/i.test(x)),
  ];
  const capital = capCands.map((c) => fact(c)).find(Boolean) ?? null;

  // Market color: the "Market color" line, else the first urban / market segment bullet.
  const color =
    bullets(md).find((x) => /\burban\b/i.test(x) && /RevPAR/i.test(x)) ??
    /\*\*Market color[^*]*\*\*\s*([^\n]+)/.exec(md)?.[0] ??
    bullets(section(md, /Operating KPIs/)).find((x) => /urban|market|San Francisco|resort/i.test(x)) ??
    bullets(section(md, /Segment|geography/)).find((x) => /urban|market|region|U\.S\.|MEA|Americas/i.test(x)) ??
    null;

  const supplyB = bullets(section(md, /^## Supply/));
  const pipeline = fact(supplyB.find((x) => /^pipeline\b/i.test(x)) ?? supplyB.find((x) => /\bpipeline\b/i.test(x)) ?? null);
  const nugB = bullets(guideMd).find((x) => /net unit growth/i.test(x));
  const nugGuide = fact(nugB ? `${guideHead}: ${nugB}` : supplyB.find((x) => /net unit growth/i.test(x)) ?? null);
  const headlinePara = section(md, /Capital headline/);
  return {
    name: d.name,
    ticker: d.ticker,
    period: periodLabel,
    headline,
    guidance: fact(guidance),
    capital,
    pipeline,
    nugGuide,
    color: fact(color ? color.replace(/\((`?company release`?)[^)]*\)/g, "") : null),
    source,
    links,
    guidanceMd: guideMd.replace(/\(`([^`]*)`\)/g, "($1)").replace(/`[^`]*_raw\/[^`]*`/g, ""),
    balanceMd: balMd.replace(/\(`([^`]*)`\)/g, "($1)").replace(/^\*\*capital note:\*\*.*$/im, "").trim(),
    excerpt: headlinePara,
  };
}
