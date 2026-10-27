import { unstable_cache } from "next/cache";

/**
 * DB-outage resilience for public pages.
 *
 * cachedQuery() runs a Prisma read through Next's Data Cache (unstable_cache, tag "db"):
 *  - DB up: results are cached for `revalidate` seconds (default GRAPH_REFRESH_S = 3600) and refreshed in the background.
 *  - DB down, cache warm: the last good result keeps being served (a failed background refresh keeps the stale entry).
 *  - DB down, cache cold: returns { ok: false, data: fallback } so the page renders a friendly notice instead of a 500.
 * Dates survive the JSON round-trip (tagged on write, revived on read). Each read is capped at DB_TIMEOUT_MS so a
 * hung connection cannot hold the function open until Vercel's timeout.
 */
export const DB_TAG = "db";
const DB_TIMEOUT_MS = Number(process.env.DB_TIMEOUT_MS || 8000);
const DATE_KEY = "__date";

function encode(v: unknown): string {
  return JSON.stringify(v, function (this: Record<string, unknown>, k, val) {
    const raw = this[k];
    return raw instanceof Date ? { [DATE_KEY]: raw.toISOString() } : val;
  });
}
function decode<T>(s: string): T {
  return JSON.parse(s, (_k, v) =>
    v && typeof v === "object" && typeof v[DATE_KEY] === "string" && Object.keys(v).length === 1 ? new Date(v[DATE_KEY]) : v
  ) as T;
}
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`DB read timed out after ${ms}ms`)), ms);
    p.then((v) => (clearTimeout(t), resolve(v)), (e) => (clearTimeout(t), reject(e)));
  });
}

export type DbResult<T> = { ok: true; data: T } | { ok: false; data: T; error: string };

/**
 * Per-instance memo in front of the Data Cache (opt-in per call, `memoMs`). A Fluid compute instance serves
 * many concurrent requests, so a hot key (the chat graph, ~1.2 MB) is decoded once per instance per window
 * instead of being re-read from the Data Cache (8 KB read units) on every request. Never shared across
 * instances; a revalidateTag("db") reaches it within `memoMs`.
 */
const MEMO = new Map<string, { at: number; value: unknown }>();

/**
 * Script mode (build-time starter check, local QA): Next's incremental cache does not exist outside a Next
 * server, so BUNGAH_NO_NEXT_CACHE=1 runs reads directly (memoized for the process). With
 * BUNGAH_GRAPH_FIXTURE=<nightly dump dir>, reads come from that read-only dump instead of the database.
 */
const SCRIPT_MODE = process.env.BUNGAH_NO_NEXT_CACHE === "1";

/**
 * Graph refresh: hourly, for every cachedQuery (chat graph and the DB-backed pages). Radar runs call
 * revalidateTag("db") (src/app/api/radars/run), which purges these entries at once. Manual seed scripts run
 * off-Vercel and do NOT purge, so a seeded edit shows within 1 h (was 5 min); a redeploy does not flush the
 * Data Cache. At 300 s a busy site re-read about 6 MB of graph from Neon per 5-minute window (chat 2.2 MB +
 * pages 3.8 MB, bungah-audit/chat-ask-spike/neon-read-sizes.json).
 */
export const GRAPH_REFRESH_S = 3600;

export async function cachedQuery<T>(
  key: string[],
  fn: () => Promise<T>,
  fallback: T,
  opts: { revalidate?: number; memoMs?: number } = {}
): Promise<DbResult<T>> {
  const memoKey = key.join("\u0000");
  if (SCRIPT_MODE || opts.memoMs) {
    const hit = MEMO.get(memoKey);
    if (hit && (SCRIPT_MODE || Date.now() - hit.at < opts.memoMs!)) return { ok: true, data: hit.value as T };
  }
  if (SCRIPT_MODE) {
    try {
      const data = await withTimeout(fn(), Number(process.env.DB_TIMEOUT_MS || 60000));
      MEMO.set(memoKey, { at: Date.now(), value: data });
      return { ok: true, data };
    } catch (e) {
      const error = e instanceof Error ? e.message.split("\n").filter(Boolean).slice(-1)[0] ?? e.name : String(e);
      return { ok: false, data: fallback, error };
    }
  }
  const cached = unstable_cache(async () => encode(await withTimeout(fn(), DB_TIMEOUT_MS)), ["db-safe", ...key], {
    revalidate: opts.revalidate ?? GRAPH_REFRESH_S,
    tags: [DB_TAG],
  });
  try {
    const data = decode<T>(await cached());
    if (opts.memoMs) MEMO.set(memoKey, { at: Date.now(), value: data });
    return { ok: true, data };
  } catch (e) {
    const error = e instanceof Error ? e.message.split("\n").filter(Boolean).slice(-1)[0] ?? e.name : String(e);
    console.error(`[db-safe] ${key.join(":")} unavailable, serving fallback: ${error}`);
    return { ok: false, data: fallback, error };
  }
}

/** Uncached DB call with a friendly failure (for request-specific reads that must not be cached). */
export async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<DbResult<T>> {
  try {
    return { ok: true, data: await withTimeout(fn(), DB_TIMEOUT_MS) };
  } catch (e) {
    const error = e instanceof Error ? e.message.split("\n").filter(Boolean).slice(-1)[0] ?? e.name : String(e);
    console.error(`[db-safe] uncached read unavailable, serving fallback: ${error}`);
    return { ok: false, data: fallback, error };
  }
}
