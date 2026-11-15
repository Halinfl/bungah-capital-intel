import { isSocialUrl } from "./social-sources";
/** Clickable original-article links for signals (Hal, 2026-10-11). Original URLs only — never local copies. */
export type SourceLink = { url: string; label: string; secondary?: boolean };

export const URL_RE = /https?:\/\/[^\s)<>|;,"']+[^\s)<>|;,."']/g;

export function isOriginalUrl(url: string): boolean {
  if (!/^https?:\/\//i.test(url)) return false;
  if (/(^|\/)_src\//.test(url) || /capital\/_src/.test(url)) return false;
  // House rule: LinkedIn and other social posts are never sources.
  if (isSocialUrl(url)) return false;
  return true;
}

/**
 * Host Q2 2026 comparable-hotel RevPAR ($251.53, +7.0%) is in exhibit 99.1 (the earnings release),
 * not the 8-K cover page (hst-20260805.htm) that only names the exhibits. Snapshot and the authored
 * digest treat exhibit 99.1 as the source of the figure; always cite that file.
 */
export function canonicalizeCiteUrl(url: string): string {
  return url.replace(
    /^(https:\/\/www\.sec\.gov\/Archives\/edgar\/data\/1070750\/000107075026000122\/)hst-20260805\.htm$/i,
    "$1hst-ex991.htm"
  );
}

export function parseSourceUrls(value: unknown): SourceLink[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: SourceLink[] = [];
  for (const v of value) {
    if (!v || typeof v !== "object") continue;
    const o = v as Record<string, unknown>;
    const url = typeof o.url === "string" ? canonicalizeCiteUrl(o.url.trim()) : "";
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
    const url = canonicalizeCiteUrl(m[0]);
    parts.push(isOriginalUrl(url) ? { text: hostLabel(url), url } : { text: url });
    last = i + url.length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}
