/**
 * Licensed hotel-performance data (STR, the CoStar company's benchmark) never appears in a public answer (Hal, Nov 13
 * 2026, Chat Batch 1 r3). Display layer only; DB rows unchanged.
 *
 * - A row whose title cites STR/CoStar, or whose every source is STR/CoStar, is dropped.
 * - A mixed row keeps its other items: each " | " item (or, in a one-item body, each sentence) that cites STR/CoStar is
 *   removed, with its source link and source-label part. A mixed row that cites STR/CoStar in its sources but never says
 *   which item came from it is dropped (its figures can't be separated).
 * - "STR" meaning short-term rentals (Dallas STR ordinance, "STR TOT", "STR revenue share", "hotel vs STR remit") is
 *   NOT a licensed source: only the company / data product forms match.
 */

/** The STR company / CoStar data product, never bare "STR" (short-term rentals). */
export const LICENSED_TEXT = new RegExp(
  [
    String.raw`\bCo-?Star\b`,
    String.raw`\bSTR\s*\/\s*CoStar`,
    String.raw`\bSTR,?\s+Inc\b`,
    String.raw`\b(?:per|via|from|according to|source:?)\s+STR\b(?![\s-]*(?:units?|listings?|rentals?|ordinance|permits?|TOT|tax))`,
    String.raw`\bstr\.com\b`,
    // "(STR)", "(Visit Orlando / STR)", "(Simpleview PDF; STR)"
    String.raw`\((?:[^()]*[;\/,]\s*)?STR\)`,
    // STR's own products and market definitions: "STR market", "STR pipeline", "STR forecast", "STR Jan–Jul 2025"
    String.raw`\bSTR\s+(?:market|pipeline|benchmark|data|census|trend|weekly|monthly|report|chain|segment|figures|forecast|metrics|SF\b|Q[1-4]\b|20\d\d\b|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\b)`,
    String.raw`\bSTR\s*\/\s*Tourism Economics`,
  ].join("|"),
  "i"
);
/** Case matters for "STR" (the company is upper-case; "str" is never it), so the i flag is only for CoStar/str.com. */
const LICENSED_CS = new RegExp(LICENSED_TEXT.source.replace(/\\bCo-\?Star\\b\|/, "").replace(/\|\\bstr\\\.com\\b/, ""));
const COSTAR = /\bco-?star\b|\bstr\.com\b/i;

export function isLicensedText(t: string | null | undefined): boolean {
  if (!t) return false;
  return COSTAR.test(t) || LICENSED_CS.test(t);
}

/** Links to STR / CoStar, or to the C&W national hospitality MarketBeat (its hotel figures are STR/CoStar data). */
const LICENSED_URL = /costar|(?:^|[/.])str\.com\b|str-benchmark|national-hospitality-marketbeat/i;

type Link = { url?: string; label?: string; secondary?: boolean };

export function isLicensedLink(l: Link | null | undefined): boolean {
  if (!l) return false;
  return LICENSED_URL.test(l.url ?? "") || isLicensedText(l.label);
}

const hostKey = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./, "").split(".").slice(0, -1).join("").toLowerCase();
  } catch {
    return "";
  }
};
const letters = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

type Row = { title?: string | null; body?: string | null; sourceLabel?: string | null; sourceUrls?: unknown; magnitude?: string | null };

/** Result of the licensed-source pass for one row: the cleaned row, or null when it is dropped. */
/** Distinctive figures (dollar amounts with cents, "$206.21") that identify a licensed print republished elsewhere. */
const FIG = /\$\d{1,3}(?:,\d{3})*\.\d{2}\b/g;
const FIG_ANY = /\$\d{1,3}(?:,\d{3})*\.\d{1,2}\b/g;
const figuresIn = (s: string | null | undefined): string[] => (s ?? "").match(FIG) ?? [];
const figuresAny = (s: string | null | undefined): string[] => (s ?? "").match(FIG_ANY) ?? [];

/**
 * fp: figures from STR/CoStar items elsewhere in the same set of rows; an item quoting one ("Week Aug 2–8: ADR +15.2%
 * to $206.21", republished from the CoStar weekly) goes too. removedOut collects the text that was taken out.
 */
export function stripLicensed<T extends Row>(r: T, fp: Set<string> = new Set(), removedOut?: string[]): T | null {
  const hasFp = (t: string | null | undefined) => figuresAny(t).some((x) => fp.has(x));
  const res = stripLicensedInner(r, hasFp, removedOut);
  if (res === null) removedOut?.push(`${r.title ?? ""} ${r.body ?? ""} ${r.magnitude ?? ""} ${r.sourceLabel ?? ""}`);
  return res;
}

function stripLicensedInner<T extends Row>(r: T, hasFp: (t: string | null | undefined) => boolean, removedOut?: string[]): T | null {
  const links: Link[] = Array.isArray(r.sourceUrls) ? (r.sourceUrls as Link[]) : [];
  const licLinks = links.filter(isLicensedLink);
  const label = r.sourceLabel ?? "";
  const labelLicensed = isLicensedText(label) || LICENSED_URL.test(label);
  const body = r.body ?? "";
  const touched = licLinks.length > 0 || labelLicensed || isLicensedText(body) || isLicensedText(r.title) || isLicensedText(r.magnitude) || hasFp(body) || hasFp(r.title);
  if (!touched) return r;
  if (isLicensedText(r.title) || hasFp(r.title)) return null;

  // Items that came from a licensed source: they cite it, or start with a licensed link's label.
  // A link label is "Item" or "Item — domain"; an item co-cited by a public link still goes (its figure may be the
  // licensed one).
  const licLabels = licLinks.map((l) => (l.label ?? "").split(/\s+—\s+/)[0].trim()).filter((x) => x.length >= 6);
  const fromLicensed = (item: string) => {
    const it = item.replace(/^[^.|]*?\(D\d\)\.\s*/, "").trim();
    return isLicensedText(item) || hasFp(item) || licLabels.some((lab) => item.includes(`${lab}:`) || it.startsWith(lab.slice(0, Math.min(24, lab.length))));
  };
  let parts = body.split(/\s+\|\s+/);
  let removed = 0;
  if (parts.length > 1) {
    // The first item carries the "Market — Latest pulse (D2). " prefix; keep the prefix when the item goes.
    const kept: string[] = [];
    parts.forEach((p, i) => {
      if (!fromLicensed(p)) return kept.push(p);
      removed++;
      removedOut?.push(p);
      if (i === 0) {
        const pre = p.match(/^[^.|]*?\(D\d\)\.\s*/)?.[0];
        if (pre) kept.push(pre.trim());
      }
    });
    parts = kept;
  } else {
    const sentences = body.split(/(?<=[.!?])\s+(?=[A-Z(])/);
    const kept = sentences.filter((s) => !fromLicensed(s));
    removedOut?.push(...sentences.filter((s) => fromLicensed(s)));
    removed = sentences.length - kept.length;
    parts = [kept.join(" ")];
  }
  // Sources that are all STR/CoStar, or STR/CoStar cited with no item to take out: the figures can't be separated.
  const okLinks = links.filter((l) => !isLicensedLink(l));
  const labelParts = splitLabel(label);
  const deadHosts = licLinks.map((l) => hostKey(l.url ?? "")).filter(Boolean);
  const liveHosts = new Set(okLinks.map((l) => hostKey(l.url ?? "")));
  const okLabelParts = labelParts.parts.filter((p) => {
    if (isLicensedText(p) || LICENSED_URL.test(p)) return false;
    const k = letters(p.replace(/https?:\/\/\S+/g, ""));
    return !(k.length >= 5 && deadHosts.some((h) => h.includes(k) || k.includes(h)) && ![...liveHosts].some((h) => h.includes(k) || k.includes(h)));
  });
  if (links.length ? okLinks.length === 0 : okLabelParts.length === 0) return null;
  if (removed === 0 && (licLinks.length > 0 || labelLicensed)) return null;
  if (removed === 0) return r;
  const newBody = parts.join(" | ").replace(/\s{2,}/g, " ").trim();
  if (!newBody || isLicensedText(newBody)) return null;
  const sourceLabel = labelParts.parts.length ? okLabelParts.join(labelParts.sep) + labelParts.tail : label;
  let magnitude = r.magnitude ?? null;
  if (typeof magnitude === "string") {
    const n = newBody.split(/\s+\|\s+/).length;
    if (/^\d+ rows$/.test(magnitude)) magnitude = `${n} rows`;
    else if (isLicensedText(magnitude) || (/\d/.test(magnitude) && !numbersIn(magnitude).every((x) => newBody.includes(x)))) magnitude = null;
  }
  return {
    ...r,
    body: newBody,
    sourceLabel,
    ...(Array.isArray(r.sourceUrls) ? { sourceUrls: okLinks } : {}),
    ...(r.magnitude !== undefined ? { magnitude } : {}),
  };
}

function numbersIn(s: string): string[] {
  return s.match(/\d[\d,.]*/g) ?? [];
}

function splitLabel(label: string): { parts: string[]; sep: string; tail: string } {
  const tailM = label.match(/\s*\(accessed [^)]*\)\s*$/);
  const tail = tailM ? tailM[0] : "";
  const core = tailM ? label.slice(0, tailM.index) : label;
  const sep = core.includes(" · ") ? " · " : "; ";
  const parts = core.split(sep === " · " ? /\s+·\s+/ : /;\s+/).map((x) => x.trim()).filter(Boolean);
  return { parts, sep, tail };
}

/**
 * Two passes: the first finds the STR/CoStar items and their distinctive figures (plus any extra licensed text, e.g. a
 * market snapshot label cited to STR); the second also removes items elsewhere that republish one of those figures.
 */
export function withoutLicensedSources<T extends Row>(rows: T[], extraLicensed: (string | null | undefined)[] = []): T[] {
  const removed: string[] = extraLicensed.filter((x): x is string => typeof x === "string" && isLicensedText(x));
  for (const r of rows) stripLicensed(r, new Set(), removed);
  // Each figure also in its one-decimal rounding ("$293.67" is republished as "$293.7").
  const fp = new Set(removed.flatMap(figuresIn).flatMap((x) => [x, `$${(Math.round(Number(x.slice(1).replace(/,/g, "")) * 10) / 10).toFixed(1)}`]));
  const out: T[] = [];
  for (const r of rows) {
    const k = stripLicensed(r, fp);
    if (k) out.push(k);
  }
  return out;
}

/**
 * A market snapshot (OCC / ADR / rooms on the Market row) cited to STR ("Choose Chicago … (CBD; STR)", "GMCVB … (STR)")
 * is not shown: its figures are cleared and its label becomes a seed label, so pages and Chat treat it as "no public
 * snapshot" (the same path as an illustrative seed). Display layer only; the Market row is unchanged.
 */
export const LICENSED_SNAPSHOT_LABEL = "Illustrative seed — licensed snapshot not shown";
export function withoutLicensedSnapshot<M extends { sourceLabel: string; occupancy?: number | null; adr?: number | null; roomsK?: number | null; midweekOcc?: number | null; weekendOcc?: number | null }>(m: M): M {
  if (!isLicensedText(m.sourceLabel) || /^\s*Illustrative seed\b/i.test(m.sourceLabel)) return m;
  return { ...m, occupancy: null, adr: null, roomsK: null, midweekOcc: null, weekendOcc: null, sourceLabel: LICENSED_SNAPSHOT_LABEL };
}
