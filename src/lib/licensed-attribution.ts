/**
 * Display-layer attribution index from Eric's 15 Nov 2026 source audit (c36995e).
 *
 * A cited page or PDF whose own text credits STR, CoStar, Kalibri, HotStats, or
 * Lodging Econometrics is licensed/yellow — by that attribution, not by host name
 * alone. The baked URL list is the audit's per-document classification (plus a
 * few must-fix republications whose packed row omits the credit).
 *
 * Unreachable URLs: a figure stays quotable only if a cached copy showed it.
 * Unverified tokens (not found in any fetched cited source) are dropped.
 * DB rows are unchanged.
 */
import data from "@/data/source-audit-r7.json";

export type UnverifiedFigure = {
  marketSlug?: string | null;
  title?: string | null;
  figure: string;
  kind?: string | null;
};

const INDEX = data as {
  licensedUrls: string[];
  licensedHosts: string[];
  extraLicensedUrls?: string[];
  unreachableUrls: string[];
  unverifiedFigures: UnverifiedFigure[];
};

/** Normalize for lookup: lowercase host (no www), no trailing slash, no query/hash. */
export function normalizeCiteUrl(url: string): string {
  const raw = (url || "").trim();
  if (!raw) return "";
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./i, "").toLowerCase();
    let path = u.pathname.replace(/\/{2,}/g, "/");
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
    const scheme = u.protocol === "http:" || u.protocol === "https:" ? "https" : u.protocol.replace(/:$/, "");
    return `${scheme}://${host}${path}`;
  } catch {
    return raw.toLowerCase().replace(/\/$/, "");
  }
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    const n = normalizeCiteUrl(url);
    return n.split("/")[2] ?? "";
  }
}

const LICENSED_URL_SET = new Set<string>([...INDEX.licensedUrls, ...(INDEX.extraLicensedUrls ?? [])].map(normalizeCiteUrl).filter(Boolean));
const LICENSED_HOST_SET = new Set((INDEX.licensedHosts ?? []).map((h) => h.replace(/^www\./i, "").toLowerCase()));
const UNREACHABLE_SET = new Set((INDEX.unreachableUrls ?? []).map(normalizeCiteUrl).filter(Boolean));
const UNVERIFIED = (INDEX.unverifiedFigures ?? []) as UnverifiedFigure[];

export function isLicensedAttributionUrl(url?: string | null): boolean {
  if (!url) return false;
  const n = normalizeCiteUrl(url);
  if (n && LICENSED_URL_SET.has(n)) return true;
  const host = hostOf(url);
  if (host && LICENSED_HOST_SET.has(host)) return true;
  return false;
}

export function isUnreachableSourceUrl(url?: string | null): boolean {
  if (!url) return false;
  return UNREACHABLE_SET.has(normalizeCiteUrl(url));
}

export function licensedAttributionUrlCount(): number {
  return LICENSED_URL_SET.size;
}

type Row = {
  title?: string | null;
  body?: string | null;
  sourceLabel?: string | null;
  sourceUrls?: unknown;
  magnitude?: string | null;
  marketSlug?: string | null;
};

function linksOf(urls: unknown): { url?: string; label?: string }[] {
  return Array.isArray(urls) ? (urls as { url?: string; label?: string }[]) : [];
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Remove one unverified token from a clause, or drop the clause if that is all it was carrying. */
function dropToken(text: string, token: string): string {
  if (!text || !token) return text;
  const re = new RegExp(escapeRe(token), "g");
  if (!re.test(text)) return text;
  const items = text.split(/\s*\|\s*/);
  const kept = items
    .map((item) => {
      if (!item.includes(token)) return item;
      const next = item.replace(new RegExp(escapeRe(token), "g"), "").replace(/\s{2,}/g, " ").replace(/[·,:;/]\s*$/g, "").trim();
      // If the clause was essentially just this figure, or only a year remains, drop it.
      const onlyYears = !/\d/.test(next.replace(/\b20\d{2}\b/g, ""));
      return /\d/.test(next) && next.length >= 24 && !onlyYears ? next : "";
    })
    .filter(Boolean);
  return kept.join(" | ");
}

/**
 * Drop figures the audit could not find in any fetched cited source, and drop
 * numeric items whose only cites are unreachable URLs with no cached text.
 */
export function withoutUnverifiedFigures<T extends Row>(rows: T[]): T[] {
  const out: T[] = [];
  for (const r of rows) {
    let title = r.title ?? "";
    let body = r.body ?? "";
    let magnitude = r.magnitude ?? "";
    const slug = (r.marketSlug ?? "").toLowerCase();
    for (const d of UNVERIFIED) {
      if (!d.figure) continue;
      const present = title.includes(d.figure) || body.includes(d.figure) || magnitude.includes(d.figure);
      if (!present) continue;
      const titleOk = !d.title || title.includes(d.title);
      const slugOk = !d.marketSlug || !slug || d.marketSlug === slug;
      if (!titleOk || !slugOk) continue;
      title = dropToken(title, d.figure);
      body = dropToken(body, d.figure);
      magnitude = dropToken(magnitude, d.figure);
    }

    const links = linksOf(r.sourceUrls);
    const reachable = links.filter((l) => l.url && !isUnreachableSourceUrl(l.url));
    const onlyUnreachable = links.length > 0 && reachable.length === 0;
    if (onlyUnreachable) {
      // No cached copy of any cited page: do not quote remaining figures from this row.
      const numeric = /\d{1,3}(?:\.\d+)?%|\$\d{1,3}(?:,\d{3})*(?:\.\d+)?/;
      if (numeric.test(`${title} ${body} ${magnitude}`)) {
        // Keep a supply-pressure score row (Bungah-computed) even if its only leftover links were dropped elsewhere.
        if (!/supply-pressure score/i.test(title)) {
          continue;
        }
      }
    }

    if (!title && !body) continue;
    out.push({
      ...r,
      title,
      body,
      ...(r.magnitude != null ? { magnitude: magnitude || null } : {}),
      ...(onlyUnreachable ? { sourceUrls: [] } : {}),
    });
  }
  return out;
}
