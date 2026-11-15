/**
 * On-site markdown links inside plain answer text: "[label](/path)" → a link part; everything else is text.
 * Only a single-slash on-site path is accepted: "//host", "/\host" (browsers read it as //host), any
 * scheme (https:, javascript:, data:, …) and relative paths stay plain text.
 */
export type InlinePart = string | { label: string; href: string };

const LINK_RE = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;

export function isOnSitePath(href: string): boolean {
  return /^\/(?![/\\])[^\s\\]*$/.test(href);
}

export function parseInlineLinks(text: string): InlinePart[] {
  const out: InlinePart[] = [];
  let last = 0;
  let buf = "";
  LINK_RE.lastIndex = 0;
  for (let m = LINK_RE.exec(text); m; m = LINK_RE.exec(text)) {
    if (!isOnSitePath(m[2])) continue; // left in place as plain text
    buf += text.slice(last, m.index);
    if (buf) out.push(buf);
    buf = "";
    out.push({ label: m[1], href: m[2] });
    last = m.index + m[0].length;
  }
  buf += text.slice(last);
  if (buf) out.push(buf);
  return out;
}
