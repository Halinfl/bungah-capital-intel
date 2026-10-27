/**
 * Shared answer cache for deterministic chat. An answer depends only on the question (and so its intent),
 * the item it is scoped to, the date window, the graph data and the deployed code, so everyone asking the
 * same thing gets the same cached answer instead of a rebuild.
 *
 * Key: v1 · deployment · data version · ET day · intent · item · window · hash(normalized question)
 * Layers:
 *   L1 per-instance memory (Fluid compute serves many requests per instance), up to 10 min, 500 entries.
 *   L2 Next Data Cache (unstable_cache → Vercel Data Cache, regional, shared by instances; preview and
 *      production never share it), TTL = until the next 2:00 AM ET (the nightly data boundary), max 24 h.
 * Invalidation: the data version (a tiny aggregate over the graph tables, re-read every 5 min) changes as
 * soon as rows are added/edited, which changes every key; revalidateTag("db") (radar runs) purges L2 too;
 * a new deployment changes the key.
 * LLM answers are never cached here (BUNGAH_USE_LLM stays unset; if it were set the route bypasses this).
 */
import { createHash } from "node:crypto";
import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { cachedQuery, DB_TAG } from "./db-safe";
import { classifyIntent } from "./chat-intent";
import type { DateRange } from "./chat-brief";
import { scopeKey, type ChatScope } from "./chat-scope";

export const CHAT_CACHE_TAG = "chat-answers";
const L1_MAX = 500;
const L1_MAX_MS = 10 * 60 * 1000;
const L1 = new Map<string, { exp: number; value: string }>();

export type CacheStatus = "hit-mem" | "hit-shared" | "miss" | "bypass";

/** Seconds until the next 2:00 AM America/New_York (DST-aware), clamped to [60, 86400]. */
export function secondsUntilNightly(now = new Date()): number {
  const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const p = Object.fromEntries(fmt.formatToParts(now).map((x) => [x.type, x.value]));
  const h = Number(p.hour) % 24, m = Number(p.minute), s = Number(p.second);
  const sinceMidnight = h * 3600 + m * 60 + s;
  const target = 2 * 3600;
  let secs = target - sinceMidnight;
  if (secs <= 0) secs += 86400;
  return Math.max(60, Math.min(86400, secs));
}

/** ET calendar day: the 90-day / 12-month windows are computed from "today". */
export function etDay(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(now);
}

/** Cheap fingerprint of the graph tables (counts, newest rows, text length): changes when the data does. */
export async function dataVersion(): Promise<string> {
  const r = await cachedQuery(
    ["chat-data-version"],
    async () => {
      const rows = await prisma.$queryRaw<Record<string, unknown>[]>`
        SELECT (SELECT count(*) FROM "Signal")::text AS sc,
               (SELECT coalesce(max("createdAt")::text, '') FROM "Signal") AS sm,
               (SELECT coalesce(sum(length(title) + length(body)), 0) FROM "Signal")::text AS sl,
               (SELECT coalesce(max("updatedAt")::text, '') FROM "Market") AS mu,
               (SELECT count(*) FROM "Asset")::text AS ac,
               (SELECT count(*) FROM "Finding")::text AS fc,
               (SELECT coalesce(max("createdAt")::text, '') FROM "Finding") AS fm`;
      return createHash("sha256").update(JSON.stringify(rows[0] ?? {})).digest("hex").slice(0, 12);
    },
    "unknown",
    { revalidate: 300, memoMs: 60_000 }
  );
  return r.data;
}

export function normalizeQuestion(q: string): string {
  return q.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9$%.'&+-]+/g, " ").trim();
}

export function answerKey(parts: { version: string; question: string; scope: ChatScope | null; marketSlug: string | null; range: DateRange }): string {
  const deployment = process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "local";
  const nq = normalizeQuestion(parts.question);
  const intent = classifyIntent(nq);
  const item = parts.scope ? scopeKey(parts.scope) : parts.marketSlug ? `market:${parts.marketSlug}` : "none";
  const qh = createHash("sha256").update(nq).digest("hex").slice(0, 16);
  return ["v1", deployment, parts.version, etDay(), intent, item, parts.range, qh].join("|");
}

/**
 * Get-or-build a JSON-serializable answer. `build` runs only on a miss in both layers.
 * Concurrent misses for the same key on one instance share one build (no thundering herd per instance).
 */
const INFLIGHT = new Map<string, Promise<string>>();
export async function cachedAnswer<T>(key: string, build: () => Promise<T>): Promise<{ value: T; status: CacheStatus }> {
  const now = Date.now();
  const hit = L1.get(key);
  if (hit && hit.exp > now) return { value: JSON.parse(hit.value) as T, status: "hit-mem" };
  if (hit) L1.delete(key);

  let built = false;
  const ttl = secondsUntilNightly();
  const run = async () => {
    const shared = unstable_cache(
      async () => {
        built = true;
        return JSON.stringify(await build());
      },
      ["chat-answer", key],
      { revalidate: ttl, tags: [DB_TAG, CHAT_CACHE_TAG] }
    );
    return shared();
  };
  let p = INFLIGHT.get(key);
  const leader = !p;
  if (!p) {
    p = run().finally(() => INFLIGHT.delete(key));
    INFLIGHT.set(key, p);
  }
  const json = await p;
  if (L1.size >= L1_MAX) L1.delete(L1.keys().next().value as string);
  L1.set(key, { exp: now + Math.min(L1_MAX_MS, ttl * 1000), value: json });
  return { value: JSON.parse(json) as T, status: leader ? (built ? "miss" : "hit-shared") : "hit-mem" };
}
