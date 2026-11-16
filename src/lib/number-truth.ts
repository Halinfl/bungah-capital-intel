/**
 * r9 number-truth overlay (Eric r8 systemic fix). src/data/number-truth-r9.json lists, per signal row, the
 * figures the number-truth gate (recheck/number_truth.py) could not find with their period on a saved snapshot
 * of the page they cite. Each one is dropped here; nothing is re-pointed at another source. Display layer
 * only; DB rows unchanged.
 *
 *   rows:  { "<rowId>": "why" }                         drop the whole row
 *   items: { "<rowId>": [{ "match": "...", "why" }] }   drop each " | " item of the body containing match
 *   edits: { "<rowId>": [{ "find": "...", "replace": "", "why" }] }  remove a clause (title / body / magnitude)
 *   snapshotUrls: { "<market slug>": { "url", "label", "checked" } }  the market snapshot's own page, where its
 *         OCC / ADR and period were found on the snapshot (same source as its label; not a retarget)
 */
import data from "@/data/number-truth-r9.json";

type Row = { id?: string; title?: string | null; body?: string | null; magnitude?: string | null };
type Overlay = {
  rows?: Record<string, string>;
  items?: Record<string, { match: string; why?: string }[]>;
  edits?: Record<string, { find: string; replace?: string; why?: string }[]>;
  snapshotUrls?: Record<string, { url: string; label?: string; checked?: string }>;
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

export function withNumberTruth<T extends Row>(rows: T[]): T[] {
  const out: T[] = [];
  for (const r of rows) {
    const id = r.id ?? "";
    if (id && O.rows?.[id]) continue;
    const drops = (id && O.items?.[id]) || [];
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
    out.push({ ...r, body, ...(r.title !== undefined ? { title } : {}), ...(r.magnitude !== undefined ? { magnitude } : {}) });
  }
  return out;
}

export function numberTruthSnapshotUrl(slug: string, sourceLabel?: string | null): string | undefined {
  const hit = O.snapshotUrls?.[slug];
  if (!hit) return undefined;
  if (hit.label && sourceLabel && !sourceLabel.toLowerCase().startsWith(hit.label.toLowerCase())) return undefined;
  return hit.url;
}
