/**
 * r9 number-truth overlay (Eric r8 systemic fix). src/data/number-truth-r9.json lists, per signal row, the
 * figures the number-truth gate (recheck/number_truth.py) could not find with their period on a saved snapshot
 * of the page they cite. Each one is dropped here; nothing is re-pointed at another source. Display layer
 * only; DB rows unchanged.
 *
 *   rows:  { "<rowId>": "why" }                         drop the whole row
 *   items: { "<rowId>": [{ "match": "...", "why" }] }   drop each " | " item of the body containing match
 *   edits: { "<rowId>": [{ "find": "...", "replace": "", "why" }] }  remove a clause (title / body / magnitude)
 *   stripUrls: ["<url prefix>"]                           never cited: the link leaves the row, and every item that
 *         came from it (or names it inline) leaves with it (Eric r8: simpleviewinc.com Boston TDMD / Phoenix PDFs)
 *   snapshotUrls: { "<market slug>": { "url", "label", "checked" } }  the market snapshot's own page, where its
 *         OCC / ADR and period were found on the snapshot (same source as its label; not a retarget)
 */
import data from "@/data/number-truth-r9.json";
import { withoutOrphanedFigures, itemOrigins, canonUrl } from "./source-provenance";

type Row = { id?: string; title?: string | null; body?: string | null; magnitude?: string | null; sourceUrls?: unknown; sourceLabel?: string | null };
type Overlay = {
  rows?: Record<string, string>;
  items?: Record<string, { match: string; why?: string }[]>;
  edits?: Record<string, { find: string; replace?: string; why?: string }[]>;
  snapshotUrls?: Record<string, { url: string; label?: string; checked?: string }>;
  stripUrls?: string[];
  dropItemPatterns?: { re: string; why?: string }[];
  /** r10: { "<rowId>": [{ from, url, label, why }] } a row's link replaced by the page that actually prints the figure
   *  (checked by the number-truth gate), e.g. NYC 5.875% → Form NYC-HTX 2025, not the 2021 EO page. */
  relink?: Record<string, { from: string; url: string; label: string; why?: string }[]>;
};

const O = data as unknown as Overlay;

function edit(s: string | null | undefined, eds: { find: string; replace?: string }[]): string | null | undefined {
  if (typeof s !== "string") return s;
  let out = s;
  for (const e of eds) out = out.split(e.find).join(e.replace ?? "");
  return out;
}

function stripPrefix(item: string): string {
  return item.replace(/^[^|]{0,120}?\s—\s[^|]{0,120}?\.\s+(?=\S)/, "").trim();
}

const DROP_RE = (O.dropItemPatterns ?? []).map((d) => new RegExp(d.re, "i"));
const STRIP = (O.stripUrls ?? []).map((u) => u.toLowerCase());
const stripped = (u: unknown) => typeof u === "string" && STRIP.some((p) => u.toLowerCase().startsWith(p));
/** r10: a link the overlay strips (never cited anywhere, including the answer's sources list). */
export function isStrippedUrl(u: unknown): boolean {
  return stripped(u);
}
const hostOf = (u: string) => {
  try {
    return new URL(u).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
};
/** r10: hosts whose every link in this row was stripped ("simpleviewinc.com"): their name leaves the row's label too. */
function goneHosts(links: { url?: string }[]): string[] {
  const hosts = new Set(links.filter((l) => stripped(l?.url)).map((l) => hostOf(l.url!)).filter(Boolean));
  for (const l of links) if (!stripped(l?.url) && typeof l?.url === "string") hosts.delete(hostOf(l.url));
  return [...hosts];
}

function withoutStrippedUrls<T extends Row>(rows: T[]): T[] {
  if (!STRIP.length) return rows;
  const after = rows.map((r) => {
    const links = Array.isArray(r.sourceUrls) ? (r.sourceUrls as { url?: string; label?: string }[]) : [];
    // A link label that lists several hosts + URLs ("a.com https://a…; simpleviewinc.com https://assets…") loses the stripped one.
    const relabel = (l: { url?: string; label?: string }) => {
      if (typeof l?.label !== "string" || !STRIP.some((p) => l.label!.toLowerCase().includes(p))) return l;
      const label = l.label.split(/;\s*/).filter((seg) => !STRIP.some((p) => seg.toLowerCase().includes(p))).join("; ");
      return { ...l, label };
    };
    const keep = links.filter((l) => !stripped(l?.url)).map(relabel);
    const relabeled = keep.some((l, i) => l !== links.filter((x) => !stripped(x?.url))[i]);
    const body = r.body ?? "";
    const named = STRIP.some((p) => body.toLowerCase().includes(p));
    const sl = r.sourceLabel;
    const gone = goneHosts(links);
    // A label segment names a gone host by its full host or registrable domain ("simpleviewinc.com" for assets.simpleviewinc.com).
    const named2 = (seg: string, h: string) => {
      const x = seg.toLowerCase().trim();
      const reg = h.split(".").slice(-2).join(".");
      return x.includes(h) || x.includes(reg);
    };
    const slGone = (seg: string) => STRIP.some((p) => seg.toLowerCase().includes(p)) || gone.some((h) => named2(seg, h));
    const slHit = typeof sl === "string" && (STRIP.some((p) => sl.toLowerCase().includes(p)) || gone.some((h) => named2(sl, h)));
    if (keep.length === links.length && !named && !relabeled && !slHit) return r;
    const items = body.split(/\s+\|\s+/);
    const kept = items.filter((it) => !STRIP.some((p) => it.toLowerCase().includes(p)));
    if (items.length && !kept.length) return null;
    // r10: label segments are split on ";" and " · " ("City of Boston · Commonwealth of Massachusetts · simpleviewinc.com").
    const sourceLabel = slHit
      ? sl!
          .split(/;\s*/)
          .map((part) => {
            const tail = part.match(/\s*\((?:accessed|as of)[^)]*\)\s*$/i)?.[0] ?? "";
            const segs = part.slice(0, part.length - tail.length).split(/\s+·\s+/).filter((seg) => !slGone(seg));
            return segs.length ? segs.join(" · ") + tail : "";
          })
          .filter((x) => x.trim())
          .join("; ")
      : sl;
    return { ...r, sourceUrls: keep, body: kept.join(" | "), ...(sl !== undefined ? { sourceLabel } : {}) } as T;
  });
  const survivors = after.filter((r): r is T => r !== null && (!Array.isArray(r.sourceUrls) || (r.sourceUrls as unknown[]).length > 0));
  return withoutOrphanedFigures(rows as never, survivors as never) as unknown as T[];
}

/** r10: a row's links after the overlay's relinks (same order; the replaced link takes the old one's place). */
export function relinked<L extends { url?: string; label?: string }>(id: string | undefined, links: L[]): L[] {
  const rl = (id && O.relink?.[id]) || [];
  if (!rl.length) return links;
  return links.map((l) => {
    const hit = rl.find((x) => x.from === l?.url);
    return hit ? ({ ...l, url: hit.url, label: hit.label } as L) : l;
  });
}

function withRelinks<T extends Row>(rows: T[]): T[] {
  if (!O.relink) return rows;
  return rows.map((r) => (r.id && O.relink![r.id] && Array.isArray(r.sourceUrls) ? ({ ...r, sourceUrls: relinked(r.id, r.sourceUrls as { url?: string }[]) } as T) : r));
}

/**
 * r10b (row-level citation lists): after the overlay drops or rewrites a row's items, a link that some original item
 * came from (its label prefix, inline "source:" URL, or a URL named in the item) and that no kept item comes from
 * leaves the row's sourceUrls, so the answer's sources list never names a page whose figures were all dropped
 * (e.g. Houston First's strategic summary PDF on Houston visitation). Links no item was attributed to stay.
 */
function prunedLinks(r: Row, body: string, title: string | null | undefined): unknown {
  const links = Array.isArray(r.sourceUrls) ? (r.sourceUrls as { url?: string; label?: string }[]) : null;
  if (!links || links.length < 2) return r.sourceUrls;
  const named = (txt: string) => (txt.match(/https?:\/\/[^\s);·|]+/g) ?? []).map((u) => canonUrl(u.replace(/[.,]+$/, "")));
  const used = (txt: string, after = false) => {
    const set = new Set<string>();
    for (const o of itemOrigins(txt, links)) {
      // A kept item with no link of its own and no figure ("Boston city hotel wage ordinance: None found") holds no link.
      if (after && !o.specific && !/\d/.test(o.item.replace(/^[^|]{0,120}?\s—\s[^|]{0,120}?\.\s+/, ""))) continue;
      if (o.origin) set.add(o.origin);
      for (const u of named(o.item)) set.add(u);
    }
    return set;
  };
  const before = used(r.body ?? "");
  for (const u of named(r.title ?? "")) before.add(u);
  const after = used(body, true);
  for (const u of named(title ?? "")) after.add(u);
  const keep = links.filter((l) => {
    const c = canonUrl(l?.url);
    return !c || !before.has(c) || after.has(c);
  });
  if (keep.length === links.length || !keep.length) return r.sourceUrls;
  // With one link left, a kept figure that names no link of its own would read as that link's (memos attribute a
  // lone link to every item): that is a retarget, so the row keeps its links instead.
  if (keep.length === 1 && itemOrigins(body, links).some((o) => !o.specific && /\d/.test(o.item.replace(/^[^|]{0,120}?\s—\s[^|]{0,120}?\.\s+/, "").replace(/\s·\s(?:accessed\s)?20\d{2}-\d{2}-\d{2}.*$/, ""))))
    return r.sourceUrls;
  return keep;
}

export function withNumberTruth<T extends Row>(rows0: T[]): T[] {
  const rows = withoutStrippedUrls(withRelinks(rows0));
  const out: T[] = [];
  for (const r of rows) {
    const id = r.id ?? "";
    if (id && O.rows?.[id]) continue;
    const drops = [...((id && O.items?.[id]) || [])];
    if (DROP_RE.length) for (const it of (r.body ?? "").split(/\s+\|\s+/)) if (DROP_RE.some((re) => re.test(it))) drops.push({ match: it });
    const eds = (id && O.edits?.[id]) || [];
    if (!drops.length && !eds.length) {
      out.push(r);
      continue;
    }
    let body = r.body ?? "";
    let title = r.title;
    let magnitude = r.magnitude;
    if (eds.length) {
      body = edit(body, eds) ?? "";
      title = edit(title, eds) as typeof title;
      magnitude = edit(magnitude, eds) as typeof magnitude;
    }
    if (drops.length) {
      const items = body.split(/\s+\|\s+/);
      const kept: string[] = [];
      items.forEach((it, i) => {
        if (!drops.some((d) => it.includes(d.match))) {
          kept.push(it);
          return;
        }
        // Keep a row's lead-in ("Dallas — tax & CVB: Lodging tax stack (City of Dallas).") on the next item.
        if (i === 0) {
          const head = it.match(/^([^|]{0,120}?\s—\s[^|]{0,120}?\.)\s+(?=\S)/);
          if (head && items.length > 1) items[1] = `${head[1]} ${stripPrefix(items[1])}`;
        }
      });
      if (!kept.length || !/\d|\w{4}/.test(stripPrefix(kept.join(" ")))) continue;
      if (kept.length !== items.length) {
        body = kept.join(" | ");
        if (typeof magnitude === "string" && /^\d+ rows$/.test(magnitude)) magnitude = `${kept.length} rows`;
        else if (typeof magnitude === "string" && drops.some((d) => magnitude!.includes(d.match))) magnitude = null;
      }
    }
    if (!body.trim()) continue;
    const sourceUrls = prunedLinks(r, body, title);
    out.push({ ...r, body, ...(r.title !== undefined ? { title } : {}), ...(r.magnitude !== undefined ? { magnitude } : {}), ...(sourceUrls !== r.sourceUrls ? { sourceUrls } : {}) });
  }
  return out;
}

export function numberTruthSnapshotUrl(slug: string, sourceLabel?: string | null): string | undefined {
  const hit = O.snapshotUrls?.[slug];
  if (!hit) return undefined;
  if (hit.label && sourceLabel && !sourceLabel.toLowerCase().startsWith(hit.label.toLowerCase())) return undefined;
  return hit.url;
}

/** r10c: a REIT transaction price its cited filing does not print (src/data/number-truth-r9.json "reitTxPrice"):
 *  the price leaves the chat line; the sale itself stays on its filing. */
const TX_PRICE_DROP = ((O as unknown as { reitTxPrice?: Record<string, string> }).reitTxPrice ?? {}) as Record<string, string>;
export function reitTxPrice(t: { url?: string | null; hotel?: string | null; priceUsdM?: number | null }): number | null {
  if (t.priceUsdM == null) return null;
  return TX_PRICE_DROP[`${t.url ?? ""}|${t.hotel ?? ""}`] ? null : t.priceUsdM;
}
