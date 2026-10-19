/** Clickable original-article links for signals (Hal, 2026-10-11). Original URLs only — never local copies. */
export type SourceLink = { url: string; label: string; secondary?: boolean };

export const URL_RE = /https?:\/\/[^\s)<>|;,"']+[^\s)<>|;,."']/g;

export function isOriginalUrl(url: string): boolean {
  if (!/^https?:\/\//i.test(url)) return false;
  if (/(^|\/)_src\//.test(url) || /capital\/_src/.test(url)) return false;
  return true;
}

export function parseSourceUrls(value: unknown): SourceLink[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: SourceLink[] = [];
  for (const v of value) {
    if (!v || typeof v !== "object") continue;
    const o = v as Record<string, unknown>;
    const url = typeof o.url === "string" ? o.url.trim() : "";
    const label = typeof o.label === "string" && o.label.trim() ? o.label.trim() : hostLabel(url);
    // Dedupe by url + label: two items citing one article each keep their own link.
    const key = `${url}\u0000${label}`;
    if (!isOriginalUrl(url) || seen.has(key)) continue;
    seen.add(key);
    out.push({ url, label, secondary: o.secondary === true });
  }
  return out;
}

export function hostLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Split text into plain / url parts for auto-linking labels. */
export function splitUrls(text: string): { text: string; url?: string }[] {
  const parts: { text: string; url?: string }[] = [];
  let last = 0;
  for (const m of text.matchAll(URL_RE)) {
    const i = m.index ?? 0;
    if (i > last) parts.push({ text: text.slice(last, i) });
    const url = m[0];
    parts.push(isOriginalUrl(url) ? { text: hostLabel(url), url } : { text: url });
    last = i + url.length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}
