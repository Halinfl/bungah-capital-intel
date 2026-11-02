/**
 * House rule: LinkedIn and other social posts are never sources. Display-layer filter for graph signals read by
 * Chat: removes social links, the rows that rested on them, and any signal left with no non-social source. The
 * database is not changed (the rows stay; they just never reach a public answer).
 */
export const SOCIAL_HOST = /(^|\.)(linkedin\.com|lnkd\.in|x\.com|twitter\.com|facebook\.com|instagram\.com|threads\.net|tiktok\.com)$/i;

export function isSocialUrl(u: unknown): boolean {
  if (typeof u !== "string") return false;
  try {
    return SOCIAL_HOST.test(new URL(u).hostname);
  } catch {
    return false;
  }
}

type Link = { url: string; label?: string; secondary?: boolean };
type Sig = { title: string; body: string; sourceLabel: string; sourceUrls?: unknown; magnitude?: string | null };

const SOCIAL_WORD = /\b(LinkedIn|Twitter|Facebook|Instagram|Threads|TikTok)\b|\bon X\b/i;
const SOCIAL_URL_IN_TEXT = /https?:\/\/(?:[a-z0-9-]+\.)*(?:linkedin\.com|lnkd\.in|x\.com|twitter\.com|facebook\.com|instagram\.com|threads\.net|tiktok\.com)\//i;

/** Remove the " | "-separated row that starts with `label` (the row a social link backed). */
function dropRow(body: string, label: string): string {
  const rows = body.split(" | ");
  let k = rows.findIndex((r) => r.trim().startsWith(label));
  // The first row carries the signal's lead-in, so its label sits mid-row.
  if (k < 0 && rows[0]?.includes(label)) k = 0;
  if (k < 0) return body;
  const row = rows[k];
  const at = row.indexOf(label);
  if (at > 0) {
    // First row carries the signal's lead-in ("Chicago — debt & deals: Market-level reads. "): move it onto the next row.
    const lead = row.slice(0, at).trim();
    rows.splice(k, 1);
    if (rows[k] !== undefined) rows[k] = `${lead} ${rows[k]}`;
    else rows.push(lead);
  } else if (k === rows.length - 1) {
    // Last row may carry a trailing house note after its sentence; keep that note.
    const note = row.match(/\)\.\s+(.*)$/);
    rows.splice(k, 1);
    if (note && rows.length) rows[rows.length - 1] += `. ${note[1]}`;
  } else rows.splice(k, 1);
  return rows.join(" | ").trim();
}

/**
 * The signal without its social sources, or null when nothing citable is left (every link was social, or the only
 * attribution is a social post).
 */
export function stripSocial<T extends Sig>(s: T): T | null {
  const links = (Array.isArray(s.sourceUrls) ? s.sourceUrls : []) as Link[];
  const social = links.filter((l) => isSocialUrl(l?.url));
  if (!social.length && !SOCIAL_URL_IN_TEXT.test(s.sourceLabel) && !SOCIAL_URL_IN_TEXT.test(s.body)) return s;
  const kept = links.filter((l) => !isSocialUrl(l?.url));
  if (!kept.length) return null;
  let body = s.body;
  // Link labels can carry a host or qualifier suffix ("… — linkedin.com", "(self-reported)"); match on the head.
  const head = (label: string) => label.split(" — ")[0].replace(/\s*\([^)]*\)\s*$/, "").trim() || label;
  // A row that a non-social link also backs (same row label) stays; only its social link goes.
  const keptHeads = new Set(kept.map((l) => (l?.label ? head(l.label) : "")).filter(Boolean));
  for (const l of social) if (l.label && !keptHeads.has(head(l.label))) body = dropRow(body, head(l.label));
  // A row whose own inline "source: <social url>" is its only attribution goes too.
  body = body
    .split(" | ")
    .filter((row) => !SOCIAL_URL_IN_TEXT.test(row))
    .join(" | ");
  const sep = s.sourceLabel.includes("; ") ? "; " : " · ";
  // Keep a trailing "(accessed …)" note when its segment is dropped.
  const accessed = s.sourceLabel.match(/\s*\(accessed [^)]*\)\s*$/)?.[0] ?? "";
  const segs = s.sourceLabel.replace(/\s*\(accessed [^)]*\)\s*$/, "").split(sep);
  const sourceLabel = (segs.filter((p) => !SOCIAL_WORD.test(p) && !SOCIAL_URL_IN_TEXT.test(p)).join(sep).trim() + accessed).trim();
  const nRows = body.split(" | ").length;
  // A row count in the magnitude ("4 rows", "3 changes") follows the rows that are left.
  const nBefore = s.body.split(" | ").length;
  const mm = typeof s.magnitude === "string" ? s.magnitude.match(/^(\d+) (row|change|item)s?$/) : null;
  const magnitude = mm && Number(mm[1]) === nBefore ? `${nRows} ${mm[2]}${nRows === 1 ? "" : "s"}` : s.magnitude;
  return { ...s, body, magnitude, sourceLabel: sourceLabel || (kept[0].label ?? ""), sourceUrls: kept };
}

/** A signal list with social sources stripped (rows left with no non-social source are dropped). */
export function withoutSocial<T extends Sig>(rows: T[]): T[] {
  return rows.map((r) => stripSocial(r)).filter((r): r is T => r !== null);
}

const MD_LINK = /\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
const HTML_LINK = /<a\b[^>]*href=['"](https?:\/\/[^'"]+)['"][^>]*>[\s\S]*?<\/a>/gi;

/**
 * Markdown (stored memos, generated copy) without social citations: a line whose only links are social posts is
 * dropped (the claim rested on them); a line that also cites a non-social source just loses the social link.
 */
export function stripSocialMarkdown(md: string): string {
  return md
    .split("\n")
    .flatMap((line) => {
      const urls = [...line.matchAll(MD_LINK)].map((m) => m[2]).concat([...line.matchAll(HTML_LINK)].map((m) => m[1]));
      const social = urls.filter(isSocialUrl);
      if (!social.length && !SOCIAL_URL_IN_TEXT.test(line)) return [line];
      if (social.length === urls.length) return [];
      const cleaned = line
        .replace(MD_LINK, (all, _t, u) => (isSocialUrl(u) ? "\u0000" : all))
        .replace(HTML_LINK, (all, u) => (isSocialUrl(u) ? "\u0000" : all))
        .replace(/\s*(?:·|,|;)?\s*\u0000(?:\s*\{tag: self-reported\})?/g, "")
        .replace(/\s+$/, "");
      return SOCIAL_URL_IN_TEXT.test(cleaned) ? [] : [cleaned];
    })
    .join("\n");
}
