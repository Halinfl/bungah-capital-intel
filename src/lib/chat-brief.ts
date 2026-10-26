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
export type Citation = {
  key: string;
  /** The row's source label (feeds the answer's `citations`). */
  label: string;
  asOf: string | null | undefined;
  /** Data period of what this source supports in the answer (null = undated; undefined = parse asOf). */
  period?: Period | null;
  /** Shown in Sources: the link's own label, else the source label. */
  text?: string;
  url?: string;
};
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

/* ------------------------------------------------------------------ */
/* Data periods                                                        */
/* ------------------------------------------------------------------ */

/**
 * The period a fact's DATA covers (yyyymmdd keys), read from the fact's own wording: week ending,
 * month, quarter, YE, an explicit range, YTD-through, a dated release. Sweep / load stamps and
 * "accessed" dates say when a row was collected, not what it measures, so they are never a data
 * period. `label` is the period as shown to readers.
 */
/**
 * A data period (yyyymmdd keys). `yearOnly`: the text gives just a year (or a fiscal year whose
 * end is unknown), so the period is only "sometime that year": it never counts for 90 days, counts
 * for 12 months only when Dec 31 of that year is inside the window, and never sets a date span.
 * `fiscal`: a fiscal year with a known end date.
 */
export type Period = { start: number; end: number; label: string; yearOnly?: boolean; fiscal?: boolean };

/**
 * Month (1–12) a fiscal year ends in, from what the text and its source say; null when unknown.
 * Company filings (10-K) are calendar years for the companies here; city and county budgets vary.
 */
function fiscalEndMonth(ctx: string): number | null {
  if (/\b(MPEA|Metropolitan Pier)\b/i.test(ctx)) return 6;
  if (/\b10-[KQ]\b|sec\.gov|edgar|annual report/i.test(ctx)) return 12;
  if (/\b(Orange County|Orlando|Osceola|Miami-Dade|Miami|Broward|Fort Lauderdale|Austin|Dallas|Houston|District of Columbia|Washington,? D\.?C\.?|\bDC\b|federal|U\.?S\.? Treasury)\b/i.test(ctx)) return 9;
  if (/\b(New York|NYC|nyc\.gov|Comptroller|Nashville|Davidson|LVCVA|Las Vegas|Clark County|Nevada|Phoenix|Arizona|San Diego|Los Angeles|San Francisco|California|Salt Lake|Utah|Boston|Massachusetts|Philadelphia|Portland|Oregon|Honolulu|Hawai.?i|Illinois)\b/i.test(ctx)) return 6;
  if (/\b(Chicago|Denver|Seattle)\b/i.test(ctx)) return 12;
  return null;
}

const MON = "(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\\.?";
const monNum = (s: string) => MONTHS[s.toLowerCase().slice(0, 3)];
const dim = (y: number, mo: number) => new Date(Date.UTC(y, mo, 0)).getUTCDate();
const k = (y: number, mo: number, d: number) => y * 10000 + mo * 100 + d;
const kY = (x: number) => Math.floor(x / 10000);
const kM = (x: number) => Math.floor(x / 100) % 100;
const kD = (x: number) => x % 100;
const dayLabel = (x: number) => `${MONTH_NAMES[kM(x) - 1]} ${kD(x)}, ${kY(x)}`;
const monLabel = (x: number) => `${MONTH_NAMES[kM(x) - 1]} ${kY(x)}`;

/** Load / sweep dates of the Capital Graph (seed files prisma/*-2026-10-11 etc.), plus any day stamp shared by many rows. */
const SWEEP_STAMPS = new Set<number>([20261011, 20261019, 20261020]);
export function registerSweepStamps(asOfs: (string | null | undefined)[]): void {
  const n = new Map<number, number>();
  for (const a of asOfs) {
    const m = /^\s*(20\d{2})-(\d{2})-(\d{2})\b/.exec(a ?? "");
    if (m) n.set(k(+m[1], +m[2], +m[3]), (n.get(k(+m[1], +m[2], +m[3])) ?? 0) + 1);
  }
  for (const [day, c] of n) if (c >= 25) SWEEP_STAMPS.add(day);
}
export function isSweepStamp(day: number): boolean {
  return SWEEP_STAMPS.has(day);
}

/** The row's load stamp (first ISO day in its as-of), used only to place a year-less "w/e 26 Sep". */
export function stampKey(asOf: string | null | undefined): number | null {
  const m = /(20\d{2})-(\d{2})-(\d{2})/.exec(asOf ?? "");
  return m ? k(+m[1], +m[2], +m[3]) : null;
}

function yearFor(mo: number, d: number, ref: number): number {
  const y = kY(ref);
  return k(y, mo, d) <= ref ? y : y - 1;
}

/** Every data period written in one text (future-starting ones dropped, ends capped at today). */
export function periodsIn(raw: string | null | undefined, ref: number = todayKey(), ctx = ""): Period[] {
  if (!raw) return [];
  const today = todayKey();
  let s = ` ${raw} `
    .replace(/\(?\b(accessed|reviewed|retrieved|pulled|as of)\b[^);|]*\)?/gi, " ")
    .replace(/https?:\/\/\S+/g, " ");
  const out: Period[] = [];
  const take = (re: RegExp, f: (m: RegExpExecArray) => Period | null | undefined) => {
    s = s.replace(re, (...args) => {
      const m = args.slice(0, -2) as unknown as RegExpExecArray;
      const p = f(m);
      // null: not a period here, leave the text for the next pattern; undefined: a load stamp, drop it.
      if (p === null) return m[0];
      if (!p) return " ";
      out.push(p);
      return " ";
    });
  };
  // Ranges: "Jul 2025–Jun 2026", "Jun 11–Jul 19, 2026", "Aug 2025 → Aug 2026", "Oct 29–31, 2026".
  take(new RegExp(`\\b${MON}\\s*(\\d{1,2}(?!\\d))?,?\\s*(20\\d{2})?\\s*(?:–|—|-|→|to)\\s*${MON}\\s*(\\d{1,2}(?!\\d))?,?\\s*(20\\d{2})\\b`, "gi"), (m) => {
    const m1 = monNum(m[1]), m2 = monNum(m[4]), y2 = +m[6];
    const y1 = m[3] ? +m[3] : m1 > m2 ? y2 - 1 : y2;
    const start = k(y1, m1, m[2] ? +m[2] : 1);
    const end = k(y2, m2, m[5] ? +m[5] : dim(y2, m2));
    const label = m[2] && m[5] ? `${MONTH_NAMES[m1 - 1]} ${+m[2]}${y1 !== y2 ? `, ${y1}` : ""}–${MONTH_NAMES[m2 - 1]} ${+m[5]}, ${y2}` : "";
    return { start, end, label };
  });
  take(new RegExp(`\\b${MON}\\s+(\\d{1,2})\\s*[–-]\\s*(\\d{1,2})[,:]?\\s+(20\\d{2})\\b`, "gi"), (m) => {
    const mo = monNum(m[1]), y = +m[4];
    return { start: k(y, mo, +m[2]), end: k(y, mo, +m[3]), label: `${MONTH_NAMES[mo - 1]} ${+m[2]}–${+m[3]}, ${y}` };
  });
  // Week ending / week of.
  take(new RegExp(`\\b(w\\/e|wk ending|week ending|week of)\\s+(?:(20\\d{2})-(\\d{2})-(\\d{2})|(\\d{1,2})\\s+${MON}|${MON}\\s+(\\d{1,2}))(?:,?\\s*(20\\d{2}))?`, "gi"), (m) => {
    let e: number;
    if (m[2]) e = k(+m[2], +m[3], +m[4]);
    else {
      const mo = monNum(m[6] ?? m[7]), d = +(m[5] ?? m[8]);
      e = k(m[9] ? +m[9] : yearFor(mo, d, ref), mo, d);
    }
    const end = new Date(Date.UTC(kY(e), kM(e) - 1, kD(e)));
    const other = new Date(end);
    other.setUTCDate(other.getUTCDate() + (/of/i.test(m[1]) ? 6 : -6));
    const ok = other.getUTCFullYear() * 10000 + (other.getUTCMonth() + 1) * 100 + other.getUTCDate();
    return /of/i.test(m[1]) ? { start: e, end: ok, label: "" } : { start: ok, end: e, label: `w/e ${dayLabel(e)}` };
  });
  // "FY2026 YTD through Apr 2026": the YTD part is the data period (from the fiscal year's start), not the full fiscal year.
  let fytd: { y: number; em: number | null } | null = null;
  take(/\bFY\s?'?(\d{2}|20\d{2})(?:\s?[-–]\s?(?:FY)?'?(\d{2}|20\d{2}))?\s+(?=YTD\b)/gi, (m) => {
    const x = m[2] ?? m[1];
    fytd = { y: x.length === 2 ? 2000 + +x : +x, em: fiscalEndMonth(`${raw} ${ctx}`) };
    return undefined;
  });
  // YTD through a month: "2026 YTD through Aug", "YTD Aug 2026", "through Aug 2026".
  take(new RegExp(`\\b(?:(20\\d{2})\\s+)?(?:YTD(?:\\s+(?:through|thru|to))?|through|thru)\\s+${MON}(?:\\s+(\\d{1,2})(?!\\d))?,?(?:\\s+(20\\d{2}))?`, "gi"), (m) => {
    const mo = monNum(m[2]);
    const y = m[4] ? +m[4] : m[1] ? +m[1] : null;
    if (!y) return null;
    const d = m[3] ? +m[3] : null;
    const f = fytd as { y: number; em: number | null } | null;
    if (f && /YTD/i.test(m[0])) {
      // Fiscal YTD: from the month after the prior fiscal year's end.
      const start = f.em && f.em !== 12 ? k(f.y - 1, f.em + 1, 1) : k(y, 1, 1);
      return { start: start <= k(y, mo, 1) ? start : k(y, 1, 1), end: k(y, mo, d ?? dim(y, mo)), label: `FY${f.y} YTD through ${MONTH_NAMES[mo - 1]}${d ? ` ${d},` : ""} ${y}` };
    }
    return { start: k(y, 1, 1), end: k(y, mo, d ?? dim(y, mo)), label: d ? `YTD through ${MONTH_NAMES[mo - 1]} ${d}, ${y}` : `Jan–${MONTH_NAMES[mo - 1]} ${y}` };
  });
  // Single days and months.
  take(/\b(20\d{2})-(\d{2})-(\d{2})\b/g, (m) => {
    const d = k(+m[1], +m[2], +m[3]);
    return isSweepStamp(d) ? undefined : { start: d, end: d, label: "" };
  });
  take(/\b(20\d{2})-(\d{2})\b(?!-)/g, (m) => (+m[2] >= 1 && +m[2] <= 12 ? { start: k(+m[1], +m[2], 1), end: k(+m[1], +m[2], dim(+m[1], +m[2])), label: "" } : null));
  take(new RegExp(`\\b${MON}\\s+(\\d{1,2}),?\\s+(20\\d{2})\\b`, "gi"), (m) => {
    const d = k(+m[3], monNum(m[1]), +m[2]);
    return isSweepStamp(d) ? undefined : { start: d, end: d, label: "" };
  });
  take(new RegExp(`\\b(\\d{1,2})\\s+${MON}\\s+(20\\d{2})\\b`, "gi"), (m) => {
    const d = k(+m[3], monNum(m[2]), +m[1]);
    return isSweepStamp(d) ? undefined : { start: d, end: d, label: "" };
  });
  take(new RegExp(`\\b${MON}\\s+(20\\d{2})\\b`, "gi"), (m) => {
    const mo = monNum(m[1]), y = +m[2];
    return { start: k(y, mo, 1), end: k(y, mo, dim(y, mo)), label: "" };
  });
  take(/\bQ([1-4])[\s-]?(?:FY)?(20\d{2})\b|\b(20\d{2})[\s-]?Q([1-4])\b/gi, (m) => {
    const q = +(m[1] ?? m[4]), y = +(m[2] ?? m[3]);
    return { start: k(y, q * 3 - 2, 1), end: k(y, q * 3, dim(y, q * 3)), label: `Q${q} ${y}` };
  });
  // Fiscal years ("FY2025", "FY2025-26", "FY26"), ending on the issuer's fiscal year end.
  take(/\bFY\s?'?(\d{2}|20\d{2})(?:\s?[-–]\s?(?:FY)?'?(\d{2}|20\d{2}))?\b(?![-–_.]?\d)/gi, (m) => {
    const yy = (x: string) => (x.length === 2 ? 2000 + +x : +x);
    const y = yy(m[2] ?? m[1]);
    const label = `FY${m[2] ? `${yy(m[1])}–${String(y).slice(-2)}` : y}`;
    const em = fiscalEndMonth(`${raw} ${ctx}`);
    if (!em) return { start: k(y, 1, 1), end: k(y, 12, 31), label, yearOnly: true };
    const sy = em === 12 ? (m[2] ? yy(m[1]) : y) : (m[2] ? yy(m[1]) : y - 1);
    return { start: em === 12 ? k(sy, 1, 1) : k(sy, em + 1, 1), end: k(y, em, dim(y, em)), label, fiscal: true };
  });
  // "YE 2025" is year-end data (as of Dec 31); "CY2026" is just a calendar year, so year-only.
  take(/\b(YE|CY)\s?(20\d{2})\b/gi, (m) =>
    m[1].toUpperCase() === "YE"
      ? { start: k(+m[2], 1, 1), end: k(+m[2], 12, 31), label: `YE ${m[2]}` }
      : { start: k(+m[2], 1, 1), end: k(+m[2], 12, 31), label: `${m[2]}`, yearOnly: true }
  );
  // A bare year counts only when nothing finer is written (fiscal years without months never do).
  if (!out.length) {
    take(/(?<![A-Za-z\d-])(?<!FY\s|TY\s)(20\d{2})\b(?![-–]\d)/g, (m) => ({ start: k(+m[1], 1, 1), end: k(+m[1], 12, 31), label: `${m[1]}`, yearOnly: true }));
  }
  return out
    .filter((p) => p.start <= today && p.start <= p.end)
    // A fiscal year still in progress (a budget year) has no data end yet: it is year-only.
    .map((p) => (p.fiscal && p.end > today ? { ...p, fiscal: false, yearOnly: true } : p))
    .map((p) => {
      // A year-only period keeps Dec 31 as its end (the window test needs it); others stop at today.
      const end = p.yearOnly ? p.end : Math.min(p.end, today);
      const label =
        p.label ||
        (p.start === p.end
          ? dayLabel(p.start)
          : kD(p.start) === 1 && kM(p.start) === kM(p.end) && kY(p.start) === kY(p.end)
            ? monLabel(p.start)
            : spanLabel(p.start, p.end));
      return { start: p.start, end, label, ...(p.yearOnly ? { yearOnly: true } : {}), ...(p.fiscal ? { fiscal: true } : {}) };
    });
}

/**
 * The data period of a fact: the latest period written in the first text that has one. Dates in
 * parentheses ("(2026-09-25; source: …)", "(report dated …)") are usually publication dates, so
 * the text outside parentheses is read first.
 */
export function dataPeriod(texts: (string | null | undefined)[], ref?: number | null, ctx?: string): Period | null {
  const r = periodPick(texts, ref, ctx);
  return r.explicit ?? r.yearOnly;
}

/**
 * The explicit data period of the first text that has one, and separately the first year-only
 * one. Explicit periods (a month, a week, a quarter, a fiscal year with a known end…) always win
 * over a bare year anywhere. Within one text a fiscal year beats a stray month, which is usually
 * the report's publication month ("FY2025 · Jul 2026").
 */
export function periodPick(texts: (string | null | undefined)[], ref?: number | null, ctx?: string): { explicit: Period | null; yearOnly: Period | null } {
  const rk = ref ?? todayKey();
  const context = ctx ?? texts.filter(Boolean).join(" ");
  const best = (ps: Period[]) => {
    const ex = ps.filter((p) => !p.yearOnly);
    const fy = ex.filter((p) => p.fiscal);
    const pool = fy.length ? fy : ex;
    return pool.length ? pool.reduce((a, b) => (b.end > a.end ? b : a)) : null;
  };
  const latestYear = (ps: Period[]) => {
    const ys = ps.filter((p) => p.yearOnly);
    return ys.length ? ys.reduce((a, b) => (b.end > a.end ? b : a)) : null;
  };
  let yearOnly: Period | null = null;
  for (const t of texts) {
    if (!t) continue;
    // A fiscal year with its months in parentheses ("FY2025 (Jul 2024–Jun 2025)") is those months.
    const t2 = t.replace(new RegExp(`\\bFY\\s?'?\\d{2,4}(?:[-–]\\d{2,4})?\\s*\\((${MON}\\s+20\\d{2}\\s*[–-]\\s*${MON}\\s+20\\d{2})\\)`, "gi"), " $1 ");
    // A forecast's own vintage ("(Jul 2025 vintage)") is when its numbers were set.
    let outside = t2.replace(/\(([^()]*\bvintage\b[^()]*)\)/gi, " $1 ").replace(/(?<![A-Za-z])20\d{2}(?=\s+(lodging\s+)?(forecast|outlook|projection))/gi, " ");
    for (let i = 0; i < 3; i++) outside = outside.replace(/\([^()]*\)/g, " ");
    const po = periodsIn(outside, rk, context);
    const pa = periodsIn(t2, rk, context);
    const ex = best(po) ?? best(pa);
    if (ex) return { explicit: ex, yearOnly };
    yearOnly ??= latestYear(po) ?? latestYear(pa);
  }
  return { explicit: null, yearOnly };
}

/** Back-compat: the data period of one string. */
export function periodOf(raw: string | null | undefined): Period | null {
  return dataPeriod([raw], stampKey(raw));
}

/** "Mon YYYY–Mon YYYY" (same year: "Jan–Sep 2026"); month and year at both ends. */
export function spanLabel(start: number, end: number): string {
  const a = monLabel(start);
  const b = monLabel(end);
  if (a === b) return a;
  return kY(start) === kY(end) ? `${MONTH_NAMES[kM(start) - 1]}–${b}` : `${a}–${b}`;
}

function keyMinusDays(x: number, days: number): number {
  const d = new Date(Date.UTC(kY(x), kM(x) - 1, kD(x)));
  d.setUTCDate(d.getUTCDate() - days);
  return k(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

/** First day (yyyymmdd) of a date window; 0 for All. */
export function rangeCutoff(range: DateRange, today = todayKey()): number {
  if (range === "90d") return keyMinusDays(today, 90);
  if (range === "12m") return keyMinusDays(today, 365);
  return 0;
}

/** A data period is in a window when it ends inside it. Undated facts are outside every window (All keeps them). */
export function periodInRange(p: Period | null | undefined, range: DateRange, today = todayKey()): boolean {
  if (range === "all") return true;
  if (!p) return false;
  // A year alone never counts for 90 days; for 12 months only if that year's Dec 31 is inside the window.
  if (p.yearOnly) return range === "12m" && p.end >= rangeCutoff(range, today) && p.end <= today;
  return p.end >= rangeCutoff(range, today) && p.start <= today;
}

export function inRange(text: string | null | undefined, range: DateRange, today = todayKey()): boolean {
  return periodInRange(periodOf(text), range, today);
}

/** Count and date span of the citations in an answer, from their data periods. */
export function dataSpan(cites: Citation[]): DataSpan {
  const byKey = new Map<string, Period[]>();
  for (const c of cites) {
    if (!c.key) continue;
    const list = byKey.get(c.key) ?? [];
    const p = c.period !== undefined ? c.period : periodOf(c.asOf);
    // A year alone has no month, so it never sets the span; that source counts as undated.
    if (p && !p.yearOnly) list.push(p);
    byKey.set(c.key, list);
  }
  // The span runs from the oldest to the newest data date (each source dated by the end of its period).
  let start = 0;
  let end = 0;
  let dated = 0;
  for (const ps of byKey.values()) {
    if (ps.length) dated += 1;
    for (const p of ps) {
      if (!start || p.end < start) start = p.end;
      if (p.end > end) end = p.end;
    }
  }
  const label = start ? spanLabel(start, end) : null;
  return { sources: byKey.size, dated, from: start ? monLabel(start) : null, to: end ? monLabel(end) : null, label };
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
    const parts = linkText(link).split(/\s+—\s+/);
    const raw = scrubInternal(parts.length > 1 ? parts[parts.length - 1] : publisherName(link.url)) || publisherName(link.url);
    // The read shows its own date, so drop a trailing "(Oct 13)" from the publisher.
    const label = raw.replace(/\s*\((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.? \d{1,2}(, ?20\d{2})?\)$/, "") || raw;
    // Popover fields, only from the link itself: title = the label's item part, publisher = its
    // publisher part (else the URL's publisher). A host-only label is not a title.
    const host = hostOf(link.url);
    const titleRaw = parts.length > 1 ? parts.slice(0, -1).join(" — ") : parts[0];
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
  /** Data period of the fact (not its load date); null when the fact carries none. */
  period?: Period | null;
  /** About a place in the metro but outside the market proper (e.g. Jersey City for NYC): ranked last. */
  offCore?: boolean;
};

const NO_READ = /no public read|\bn\/a\b|\bgaps?\b.*no public read|\btag:\s*none\b|\(none: national applies\)/i;
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

function rawItems(s: SignalLike): string[] {
  const body = dropOffLimitsSentences(stripDecisionBoilerplate(scrubInternal(s.body)));
  const parts = body.split(/\s+\|\s+/).map((x) => x.trim()).filter(Boolean);
  if (parts.length < 2) return [];
  parts[0] = stripRestatedTitle(s.title, parts[0]);
  return parts.map((p) => p.replace(/\.$/, ""));
}

/** Items a date window kept for a windowed copy of a signal. */
const KEPT = new WeakMap<object, string[]>();

/** Split a signal into one row per item (bodies join items with " | "). */
export function signalItems(s: SignalLike): { text: string; asOf: string | null }[] {
  const kept = KEPT.get(s);
  return (kept ?? rawItems(s)).map((text) => ({ text, asOf: null }));
}

/** Data period of a whole row: its title, magnitude and as-of (a load stamp is not a period). */
export function rowPeriod(s: SignalLike): Period | null {
  const links = parseSourceUrls(s.sourceUrls);
  return dataPeriod(rowTexts(s, links), stampKey(s.asOf), rowCtx(s, links));
}

function rowTexts(s: SignalLike, links: ReturnType<typeof parseSourceUrls>) {
  const single = rawItems(s).length === 0;
  return [s.title, s.magnitude, s.asOf, single ? s.body.slice(0, 240) : null, single ? links[0]?.label : null];
}

function rowCtx(s: SignalLike, links: ReturnType<typeof parseSourceUrls>) {
  return `${s.title} ${s.magnitude ?? ""} ${links.map((l) => `${l.label} ${l.url}`).join(" ")}`;
}

/** Data period of one item: its own text, then its own source link, then the row's. */
export function itemPeriod(s: SignalLike, text: string, links = parseSourceUrls(s.sourceUrls)): Period | null {
  const own = specificLink(text, links);
  const ref = stampKey(s.asOf);
  // Explicit periods first (the item's text, its own link, then the row); a bare year only after.
  const it = periodPick([text, own?.label], ref, `${text} ${own?.label ?? ""} ${own?.url ?? ""} ${s.title}`);
  if (it.explicit) return it.explicit;
  const row = periodPick(rowTexts(s, links), ref, rowCtx(s, links));
  return row.explicit ?? it.yearOnly ?? row.yearOnly;
}

/**
 * A copy of the signal holding only the items whose data period falls in the window (and only the
 * links those items cite); null when nothing is in it.
 */
export function windowSignal<T extends SignalLike>(s: T, range: DateRange): T | null {
  if (range === "all") return s;
  const links = parseSourceUrls(s.sourceUrls);
  const items = rawItems(s);
  if (!items.length) return periodInRange(rowPeriod(s), range) ? s : null;
  const kept = items.filter((t) => periodInRange(itemPeriod(s, t, links), range));
  if (!kept.length) return null;
  const used = new Set(kept.map((t) => linkFor(t, links)?.url).filter(Boolean) as string[]);
  const copy = { ...s, sourceUrls: links.filter((l) => used.has(l.url)) as unknown as T["sourceUrls"] };
  KEPT.set(copy, kept);
  return copy;
}

/** Labels that note a gap or a method, not a source; never counted or listed as a source. */
const NOT_A_SOURCE = /gap note|no public read|no linked public source|not (yet )?(linked|public)|synthesis|Bungah|Capital Intel|\breviewed\b|\brules?\b|methodology|internal/i;
export function isSourceLabel(label: string | null | undefined): boolean {
  const t = (label ?? "").trim();
  return Boolean(t) && !NOT_A_SOURCE.test(t);
}

/** One citation per source a signal's shown facts rest on (item-level, with each item's data period). */
export function signalCites(s: SignalLike): Citation[] {
  const links = parseSourceUrls(s.sourceUrls);
  const items = signalItems(s);
  if (!items.length) {
    const l = links[0];
    if (l) return [{ key: l.url, url: l.url, label: s.sourceLabel, text: linkText(l), asOf: s.asOf, period: rowPeriod(s) }];
    return isSourceLabel(s.sourceLabel) ? [{ key: s.sourceLabel, label: s.sourceLabel, text: cleanSourceLabel(s.sourceLabel), asOf: s.asOf, period: rowPeriod(s) }] : [];
  }
  return items.flatMap((it) => {
    const l = linkFor(it.text, links);
    const period = itemPeriod(s, it.text, links);
    if (l) return [{ key: l.url, url: l.url, label: s.sourceLabel, text: linkText(l), asOf: s.asOf, period }];
    return isSourceLabel(s.sourceLabel) ? [{ key: s.sourceLabel, label: s.sourceLabel, text: cleanSourceLabel(s.sourceLabel), asOf: s.asOf, period }] : [];
  });
}

/** A link's display label; a label naming three or more publishers is replaced by the URL's own publisher. */
export function linkText(l: { url: string; label: string }): string {
  const t = scrubInternal(l.label).replace(/\s*\((accessed|reviewed)[^)]*\)/gi, "").trim();
  const head = t.split(/\s+—\s+/).pop() ?? t;
  if (head.split(/\s+·\s+/).length >= 3) {
    const lead = t.split(/\s+—\s+/).length > 1 ? t.split(/\s+—\s+/).slice(0, -1).join(" — ") + " — " : "";
    return `${lead}${publisherName(l.url)}`;
  }
  return t || publisherName(l.url);
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
    const period = rowPeriod(s);
    out.push({
      text: text ?? plain(head),
      asOf: period?.label ?? null,
      period,
      key: period ? (period.yearOnly ? period.start : period.end) : 0,
      source: withDate(sourceFrom(links[0], s.sourceLabel), period?.label),
      kind: s.kind,
      title,
      readable: Boolean(text) && Boolean(period) && !sigBad && !NO_READ.test(`${title} ${s.body}`.slice(0, 400)) && METRIC.test(text ?? "") && !OFF_LIMITS.test(head),
    });
    return out;
  }
  for (const it of items) {
    const text = fitFact(it.text);
    // Each fact is dated by the period its data covers (week, month, quarter…), never the load date.
    const period = itemPeriod(s, it.text, links);
    out.push({
      text: text ?? plain(it.text),
      asOf: period?.label ?? null,
      period,
      key: period ? (period.yearOnly ? period.start : period.end) : 0,
      source: withDate(sourceFrom(linkFor(it.text, links), s.sourceLabel), period?.label),
      kind: s.kind,
      title,
      readable: Boolean(text) && Boolean(period) && !sigBad && !NO_READ.test(it.text) && !RULE_ROW.test(it.text) && METRIC.test(it.text) && !OFF_LIMITS.test(it.text),
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
/** Normalized text of a fact (case, punctuation and spacing folded) for duplicate checks. */
function normFact(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9%$.+-]+/g, " ").trim();
}

/** Headline figures of a fact ("+11.6%", "$206.21"), years and small counts left out. */
function factFigures(t: string): string[] {
  return [...t.matchAll(/[+\-−]?\$?\d[\d,]*(?:\.\d+)?\s?(?:%|pts?|bps|[MBK]\b)/g)].map((m) => m[0].replace(/[\s,−+]/g, "").replace(/^-/, "")).filter(Boolean);
}

/**
 * Two facts say the same thing when they come from the same source and either read the same
 * once normalized, or share a headline figure (one source restating "+11.6% YTD Aug").
 */
export function sameFact(a: Fact, b: Fact): boolean {
  const ua = a.source.url ?? a.source.label;
  const ub = b.source.url ?? b.source.label;
  if (ua !== ub) return false;
  if (normFact(a.text) === normFact(b.text)) return true;
  const fb = new Set(factFigures(b.text));
  return factFigures(a.text).some((x) => fb.has(x));
}

export function pickReads(facts: Fact[], lens: Lens, max = 3, used: Set<string> = new Set()): Fact[] {
  const pool = facts.filter((f) => f.readable).sort((a, b) => Number(Boolean(a.offCore)) - Number(Boolean(b.offCore)) || b.key - a.key);
  const out: Fact[] = [];
  // Facts already said (the answer line's own fact) are excluded, and so is anything restating them.
  const said = facts.filter((f) => used.has(f.text));
  const dup = (x: Fact) => said.some((y) => y === x || sameFact(x, y)) || out.some((y) => sameFact(x, y));
  for (const slot of SLOT_RULES[lens]) {
    if (out.length >= max) break;
    const f = pool.find((x) => slot.test(x) && !used.has(x.text) && !out.includes(x) && !dup(x));
    if (f) out.push(f);
  }
  return out.sort((a, b) => b.key - a.key);
}

/**
 * The date shown after a fact: its data period, unless the fact's own words already state that
 * period with its year ("Orlando August 2026 …"); a year-less "w/e 26 Sep" gets just the year.
 */
export function dateShown(text: string, p: Period | null | undefined, ref?: number | null): string | null {
  if (!p) return null;
  if (text.includes(p.label)) return null;
  const own = periodsIn(text, ref ?? p.end).some((q) => q.end === p.end || (q.start === p.start && Math.min(q.end, p.end) === p.end));
  // A single-day fact always carries its full date (e.g. a strike start), so the read is dated at a glance.
  // So does a weekly read ("w/e Sep 26, 2026"), not just its year.
  if (!own || p.start === p.end || /^w\/e /.test(p.label)) return p.label;
  const year = String(Math.floor(p.end / 10000));
  return text.includes(year) ? null : year;
}

export function toRead(f: Fact): BriefRead {
  const shown = f.period ? dateShown(f.text, f.period) : f.asOf && !f.text.includes(f.asOf) ? f.asOf : null;
  return { text: f.text, asOf: f.period === undefined ? fmtAsOf(f.asOf) : shown, source: f.source };
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
      const rp = rowPeriod(s);
      const date = rp && !title.includes(rp.label) && !(s.magnitude ?? "").includes(rp.label) ? rp.label : null;
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
/**
 * "We haven't checked enough sources…" is shown only below this many cited sources; at 14+ the
 * answer itself shows the market is covered, so the note would undercut it.
 */
export const SEED_NOTE_BELOW = 14;

export function coverageLine(opts: { cites: Citation[]; notes?: string[]; range?: DateRange; seedNote?: string }): Coverage {
  const range = opts.range ?? "all";
  // One entry per source; a gap note or method label is never a source.
  const byKey = new Map<string, Citation>();
  for (const c of opts.cites) {
    if (!c.key || (!c.url && !isSourceLabel(c.text ?? c.label))) continue;
    const p = c.period !== undefined ? c.period : periodOf(c.asOf);
    const prev = byKey.get(c.key);
    if (!prev) {
      byKey.set(c.key, { key: c.key, label: scrubInternal(c.label), text: scrubInternal(c.text ?? cleanSourceLabel(c.label)), ...(c.url ? { url: c.url } : {}), asOf: c.asOf ?? null, period: p ?? null });
      continue;
    }
    const q = prev.period;
    if (p && q && q.yearOnly && !p.yearOnly) {
      prev.period = p;
      continue;
    }
    if (p && q && p.yearOnly && !q.yearOnly) continue;
    if (p && (!q || p.start < q.start || p.end > q.end)) {
      const start = q ? Math.min(q.start, p.start) : p.start;
      const end = q ? Math.max(q.end, p.end) : p.end;
      prev.period = !q
        ? p
        : start === q.start && end === q.end
          ? q
          : start === p.start && end === p.end
            ? p
            : { start, end, label: p.yearOnly ? `${kY(start)}–${kY(end)}` : spanLabel(start, end), ...(p.yearOnly ? { yearOnly: true } : {}) };
    }
  }
  const cited = [...byKey.values()];
  const span = dataSpan(cited);
  const n = span.sources;
  const win = range === "all" ? "" : ` (${RANGE_LABEL[range].toLowerCase()})`;
  const basedOn =
    n > 0
      ? `Based on ${n} cited source${n === 1 ? "" : "s"}${span.dated && span.dated < n ? ` (${span.dated} dated)` : ""}${span.label ? `, ${span.label}` : ""}${win}.`
      : range === "all"
        ? "No cited figures for this question."
        : `0 cited sources (${RANGE_LABEL[range].toLowerCase()}).`;
  const notes = [...(opts.notes ?? []), ...(opts.seedNote && n < SEED_NOTE_BELOW ? [opts.seedNote] : [])].filter(Boolean);
  return { text: [basedOn, ...notes].join(" "), basedOn, notes, span, cited };
}

/** The Sources list: exactly the answer's cited sources, one row each (count = the based-on count). */
export function citedSourcesSection(cited: Citation[]): BriefSection | null {
  if (!cited.length) return null;
  const rows = cited.map((c) => {
    const t = scrubInternal(c.text ?? c.label).replace(/\s*\((accessed|reviewed)[^)]*\)/gi, "").trim() || "Cited source";
    const d = c.period && !t.includes(c.period.label) ? ` · ${c.period.label}` : "";
    return c.url ? `- [${t}](${c.url})${d}` : `- ${t}${d}`;
  });
  return { id: "sources", title: "Sources", count: rows.length, markdown: rows.join("\n") };
}

/** Background links that no figure in the answer rests on (not counted as sources). */
export function furtherReadingSection(links: { url: string; label: string }[], cited: Citation[] = []): BriefSection | null {
  const skip = new Set(cited.map((c) => c.key));
  const seen = new Set<string>();
  const rows: string[] = [];
  for (const l of links) {
    if (!l.url || skip.has(l.url) || seen.has(l.url)) continue;
    seen.add(l.url);
    rows.push(`- [${linkText(l)}](${l.url})`);
  }
  if (!rows.length) return null;
  return { id: "further", title: "Further reading", count: rows.length, markdown: rows.join("\n") };
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
    answer: balanceParens(scrubInternal(b.answer)),
    reads: b.reads.slice(0, 3).map((r) => ({
      ...r,
      text: balanceParens(scrubInternal(r.text)),
      source: {
        ...r.source,
        label: scrubInternal(r.source.label),
        ...(r.source.title ? { title: scrubInternal(r.source.title) } : {}),
        ...(r.source.publisher ? { publisher: scrubInternal(r.source.publisher) } : {}),
      },
    })),
    coverage: scrubInternal(b.coverage),
    sections: withCitedSources(b.sections, cov)
      .filter((s) => s.count > 0 && s.markdown.trim())
      .map((s) => ({ ...s, title: scrubInternal(s.title), markdown: dedupeMarkdown(scrubInternal(s.markdown)).replace(/\s*\(source: TBD\)/gi, "") })),
    footer: b.footer ?? DECISION_LINE,
    collapsedChars: 0,
  };
  clean.collapsedChars = collapsedLength(clean);
  // A declined question stays short: under 600 characters collapsed (drop trailing reads; their sources stay in the sections).
  while (clean.decline && clean.reads.length > 1 && clean.collapsedChars >= 590) {
    clean.reads = clean.reads.slice(0, -1);
    clean.collapsedChars = collapsedLength(clean);
  }
  return clean;
}

/** Drop stray closing parentheses copied from a source ("~$1.5B (+5.9%))"). */
function balanceParens(t: string): string {
  let depth = 0;
  let out = "";
  for (const ch of t) {
    if (ch === "(") depth++;
    if (ch === ")") {
      if (depth === 0) continue;
      depth--;
    }
    out += ch;
  }
  return out;
}

/** Sources always lists the cited rows (built from the coverage); Further reading stays last. */
function withCitedSources(sections: BriefSection[], cov: Coverage | null): BriefSection[] {
  if (!cov) return sections;
  const rest = sections.filter((x) => x.id !== "sources" && x.id !== "further");
  const further = sections.find((x) => x.id === "further");
  const furtherClean = further ? furtherReadingSection(
    [...further.markdown.matchAll(/\[([^\]]+)\]\((https?:[^)]+|\/[^)]+)\)/g)].map((m) => ({ label: m[1], url: m[2] })),
    cov.cited
  ) : null;
  const src = citedSourcesSection(cov.cited);
  return [...rest, ...(src ? [src] : []), ...(furtherClean ? [furtherClean] : [])];
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
  /** Operating KPIs, supply / pipeline and segment mix, as published (every read's number is in one of these). */
  kpiMd: string;
  supplyMd: string;
  segmentMd: string;
  /** The quarter the digest reports (its data period). */
  dataPeriod: Period | null;
  excerpt: string;
};

/** A digest section as shown to readers: no file paths, backticked notes or internal lines. */
export function cleanDigestMd(md: string): string {
  return md
    .split("\n")
    .filter((l) => !/Capital Graph|\bHal\b|decision support|_raw\//i.test(l))
    .join("\n")
    .replace(/\(`([^`]*)`\)/g, "($1)")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\s*\|\s*Source\s*\|\s*$/gim, " |")
    .trim();
}

/** A link label as a title: drop dangling separators left by markdown ("8-K Item 2.02: — exhibits…"). */
export function tidyTitle(t: string | undefined): string | undefined {
  const x = (t ?? "").replace(/\s*:\s*—\s*/g, " — ").replace(/^[\s:—-]+|[\s:—-]+$/g, "").trim();
  return x || undefined;
}

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
    ? { kind: "Filing", label: `${d.name} ${periodLabel} earnings release (8-K)`, url: filing.url, title: tidyTitle(filing.label), publisher: d.name, date: relDate }
    : { kind: "Press", label: `${d.name} ${periodLabel} earnings release`, url: releaseLink?.url, title: tidyTitle(releaseLink?.label), publisher: d.name, date: relDate };

  const qp = periodOf(periodLabel);
  const fact = (text: string | null): Fact | null => {
    if (!text) return null;
    const t = fitFact(text);
    return t ? { text: t, asOf: qp?.label ?? release, period: qp, key: qp?.end ?? dateKey(release), source: { ...source, date: qp?.label ?? source.date }, kind: "reit", title: d.name, readable: true } : null;
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
    kpiMd: cleanDigestMd(section(md, /Operating KPIs/)),
    supplyMd: cleanDigestMd(section(md, /^## Supply/)),
    segmentMd: cleanDigestMd(section(md, /Segment|geography/)),
    dataPeriod: qp,
    excerpt: headlinePara,
  };
}
