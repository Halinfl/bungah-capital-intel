/**
 * "Ask about this": the item a chat is scoped to (a market, a REIT or a graded sale), set by the button
 * on that item's page and shown as a removable chip. Pure data, no DB: safe for client components too.
 */
export type ScopeKind = "market" | "reit" | "deal";
export type ChatScope = { kind: ScopeKind; id: string };

const ID_RE = /^[a-z0-9][a-z0-9-]{0,80}$/i;

/** `?about=market:chicago`, `?about=reit:HST`, `?about=deal:grande-lakes-orlando`. Anything else: no scope. */
export function parseScope(v: unknown): ChatScope | null {
  if (v && typeof v === "object") {
    const o = v as { kind?: unknown; id?: unknown };
    return parseScope(`${String(o.kind ?? "")}:${String(o.id ?? "")}`);
  }
  if (typeof v !== "string") return null;
  const m = /^(market|reit|deal):(.+)$/.exec(v.trim());
  if (!m || !ID_RE.test(m[2])) return null;
  const kind = m[1] as ScopeKind;
  return { kind, id: kind === "reit" ? m[2].toUpperCase() : m[2].toLowerCase() };
}

export function scopeParam(s: ChatScope): string {
  return `${s.kind}:${s.id}`;
}

/** Chat link for an item page's "Ask about this" button. */
export function askAboutHref(s: ChatScope): string {
  return `/chat?about=${encodeURIComponent(scopeParam(s))}`;
}

export function scopeKey(s: ChatScope | null): string {
  return s ? scopeParam(s) : "none";
}
