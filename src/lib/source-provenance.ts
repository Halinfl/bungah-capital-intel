/**
 * r9 (Eric r8 must-fix, systemic): a figure belongs to the source it came from.
 *
 * Rows join items with " | " and cite one link per item (the link label is the item's own label), with
 * "(source: Same)" / "source: same → URL" / "source: URL" carried inline. When a later pass drops a link
 * (licensed, yellow broker, unreachable), every item that came from that link goes with it. An item is
 * never re-pointed at a link that survived (the Dallas Matthews ~111,285-room total was shown as
 * texashotelsearch.com because the brief falls back to the row's first remaining link).
 *
 * Display layer only; DB rows unchanged.
 */
import { canonicalizeCiteUrl } from "./source-links";

type Link = { url?: string; label?: string };
type Row = { id?: string; title?: string | null; body?: string | null; sourceUrls?: unknown; magnitude?: string | null };

const MONTHS: [RegExp, string][] = [
  [/\bjan(?:uary)?\b/i, "jan"], [/\bfeb(?:ruary)?\b/i, "feb"], [/\bmar(?:ch)?\b/i, "mar"], [/\bapr(?:il)?\b/i, "apr"],
  [/\bmay\b/i, "may"], [/\bjune?\b/i, "jun"], [/\bjuly?\b/i, "jul"], [/\baug(?:ust)?\b/i, "aug"],
  [/\bsep(?:t(?:ember)?)?\b/i, "sep"], [/\boct(?:ober)?\b/i, "oct"], [/\bnov(?:ember)?\b/i, "nov"], [/\bdec(?:ember)?\b/i, "dec"],
];
const URL_MONTH: [RegExp, string][] = [
  [/january/i, "jan"], [/february/i, "feb"], [/march/i, "mar"], [/april/i, "apr"], [/-may\b|\/may\b/i, "may"], [/-june\b|june/i, "jun"],
  [/-july\b|july/i, "jul"], [/august/i, "aug"], [/september/i, "sep"], [/october/i, "oct"], [/november/i, "nov"], [/december/i, "dec"],
];

function linksOf(v: unknown): Link[] {
  return Array.isArray(v) ? (v as Link[]).filter((l) => l && typeof l === "object") : [];
}

function canon(u?: string): string {
  if (!u) return "";
  try {
    return canonicalizeCiteUrl(u.trim()).replace(/[?#].*$/, "").replace(/\/$/, "").toLowerCase();
  } catch {
    return u.trim().toLowerCase();
  }
}

function monthOfLeadingDate(item: string): string | null {
  // "Aug 2026: OCC 56%…" / "Jul 2026: …" — only a leading month, not one mentioned in a note.
  const m = item.match(/^\s*([A-Za-z]{3,9})\.?\s+20\d{2}\s*:/);
  if (!m) return null;
  for (const [re, k] of MONTHS) if (re.test(m[1])) return k;
  return null;
}

function stripRowPrefix(item: string): string {
  // "Dallas — Snapshot. DFW room inventory…" → "DFW room inventory…"; "(D3). " too.
  return item.replace(/^[^|]{0,120}?\s—\s[^|]{0,120}?\.\s+(?=\S)/, "").replace(/^[^.|]*?\(D\d\)\.\s*/, "").trim();
}

function labelHead(l: Link): string {
  return (l.label ?? "").split(/\s+—\s+|:\s/)[0].toLowerCase().trim();
}

/**
 * The link each item came from, by the same rules the brief uses (inline source URL, "(source: Same)",
 * label prefix, leading month) and, last, the row's first link. Returns canonical URLs ("" when the
 * row has no links).
 */
export function itemOrigins(body: string, links: Link[]): { item: string; origin: string; specific: boolean }[] {
  const items = body.split(/\s+\|\s+/);
  const out: { item: string; origin: string; specific: boolean }[] = [];
  let prev = "";
  for (const raw of items) {
    const item = stripRowPrefix(raw);
    const low = item.toLowerCase();
    let origin = "";
    let specific = true;
    const inline = item.match(/source:\s*(?:same\s*→\s*)?(https?:\/\/[^\s);·]+)/i);
    if (inline) origin = canon(inline[1]);
    else if (/\(source:\s*same\)|source:\s*same\b/i.test(item) && prev) origin = prev;
    if (!origin) {
      const hit = links.find((l) => {
        const head = labelHead(l);
        return head.length >= 6 && low.startsWith(head.slice(0, Math.min(24, head.length)));
      });
      if (hit) origin = canon(hit.url);
    }
    if (!origin) {
      const mon = monthOfLeadingDate(item);
      if (mon) {
        const hit = links.find((l) => URL_MONTH.some(([re, k]) => k === mon && re.test(l.url ?? "")) || (monthOfLeadingDate(`${l.label ?? ""}:`) === mon));
        if (hit) origin = canon(hit.url);
      }
    }
    if (!origin) {
      origin = canon(links[0]?.url);
      specific = false;
    }
    out.push({ item: raw, origin, specific });
    prev = origin;
  }
  return out;
}

const NUMERIC = /\d/;

/**
 * Drop items whose origin link was removed between `before` and `after`. Items whose text changed
 * (a later pass rewrote them) are matched by their own label; an unmatched rewritten item keeps the
 * origin of the row's first original link. A row left with no item is dropped.
 */
export function withoutOrphanedFigures<T extends Row>(before: T[], after: T[]): T[] {
  const orig = new Map<string, T>();
  for (const r of before) if (r.id) orig.set(r.id, r);
  const out: T[] = [];
  for (const r of after) {
    const o = r.id ? orig.get(r.id) : undefined;
    // Bungah supply-pressure score rows are rebuilt by chat-supply-score.ts (LE links and counts already gone).
    if (!o || /supply-pressure score/i.test(`${r.title ?? ""} ${o.title ?? ""}`)) {
      out.push(r);
      continue;
    }
    const origLinks = linksOf(o.sourceUrls);
    const kept = new Set(linksOf(r.sourceUrls).map((l) => canon(l.url)).filter(Boolean));
    const removed = origLinks.map((l) => canon(l.url)).filter((u) => u && !kept.has(u));
    if (!removed.length || !Array.isArray(r.sourceUrls)) {
      out.push(r);
      continue;
    }
    // Every cited link was removed: nothing on the row is attributable any more.
    if (!kept.size) continue;
    const origItems = itemOrigins(o.body ?? "", origLinks);
    const byText = new Map(origItems.map((x) => [stripRowPrefix(x.item).replace(/\.$/, "").trim(), x.origin]));
    const removedSet = new Set(removed);
    const curItems = (r.body ?? "").split(/\s+\|\s+/);
    const keptItems: string[] = [];
    for (const it of curItems) {
      const key = stripRowPrefix(it).replace(/\.$/, "").trim();
      let origin = byText.get(key);
      if (origin === undefined) {
        // Rewritten item: resolve against the original links, never against the survivors only.
        origin = itemOrigins(it, origLinks)[0]?.origin ?? "";
      }
      if (origin && removedSet.has(origin) && NUMERIC.test(key)) continue;
      // A qualitative-band sentence that describes a dropped source must not read as the survivor's.
      // (The band only exists because the row cited a yellow source, and that source is the one removed.)
      if (/republishes STR-derived/i.test(it)) continue;
      keptItems.push(it);
    }
    if (keptItems.length === curItems.length) {
      out.push(r);
      continue;
    }
    const body = keptItems.join(" | ").trim();
    if (!body || !/\w/.test(stripRowPrefix(body))) continue;
    let magnitude = r.magnitude ?? null;
    if (typeof magnitude === "string" && /^\d+ rows$/.test(magnitude)) magnitude = `${keptItems.length} rows`;
    else if (typeof magnitude === "string" && /\d/.test(magnitude) && !(magnitude.match(/\d[\d,.]*/g) ?? []).every((x) => body.includes(x))) magnitude = null;
    out.push({ ...r, body, ...(r.magnitude !== undefined ? { magnitude } : {}) });
  }
  return out;
}

/**
 * r9: each " | " item of a row with the one link it came from (never a fallback to another item's link when
 * the row cites several and the item names none). Used to show one cited link per figure in memos.
 */
export function itemLinks(body: string, links: Link[]): { item: string; text: string; link: { url: string; label?: string } | null }[] {
  const origins = itemOrigins(body, links);
  return origins.map((o) => {
    const text = stripRowPrefix(o.item)
      .replace(/\s*Decision support[^|]*$/i, "")
      .replace(/\s*\((?:[^()]*?;\s*)?source:[^)]*\)/gi, "")
      .replace(/\s*\(source:[^)]*\)/gi, "")
      .replace(/\.$/, "")
      .trim();
    let link: { url: string; label?: string } | null = null;
    if (o.origin) {
      const hit = links.find((l) => canon(l.url) === o.origin);
      if (hit?.url) link = { url: hit.url, label: hit.label };
      else {
        const inline = o.item.match(/source:\s*(?:same\s*→\s*)?(https?:\/\/[^\s);·]+)/i);
        if (inline && canon(inline[1]) === o.origin) link = { url: inline[1] };
      }
    }
    // A row citing several links: an item that names none of them is not tied to the first by default.
    if (!o.specific && links.length > 1) link = null;
    return { item: o.item, text, link };
  });
}
