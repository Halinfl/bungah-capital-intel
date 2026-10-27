/**
 * Per-IP rate limit for signed-out chat (free, no external store).
 *
 * Store: in-process memory, fixed window, keyed by a salted hash of the client IP (the raw IP is never
 * stored or logged). On Vercel Fluid compute one instance serves many concurrent requests, so a burst from
 * one IP mostly lands on the same warm instance and is counted; but each instance (and each region) counts
 * separately, and counts reset on a cold start, so this is a soft limit: effective limit = LIMIT × number of
 * warm instances serving that IP. For a hard, global limit use the free Vercel WAF rate-limit rule (Hobby:
 * 1 rule, fixed window 10 s–10 min, keyed by IP; 1,000,000 allowed requests included), which runs before the
 * function is invoked. Upstash Redis would be global too but is a third-party account (free tier exists);
 * not used.
 */
import { createHash } from "node:crypto";

const WINDOW_MS = Number(process.env.BUNGAH_CHAT_RATE_WINDOW_MS || 10 * 60 * 1000);
export const LIMIT = Number(process.env.BUNGAH_CHAT_RATE_LIMIT || 30);
const MAX_KEYS = 20_000;
const HITS = new Map<string, { start: number; n: number }>();

export const RATE_LIMIT_MESSAGE = "Sign in to keep asking.";

export function clientIp(req: Request): string {
  const h = req.headers;
  return (h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0] || "unknown").trim();
}

function keyFor(ip: string): string {
  return createHash("sha256").update(`${process.env.VERCEL_DEPLOYMENT_ID ?? "local"}:${ip}`).digest("hex").slice(0, 20);
}

export function checkRateLimit(ip: string, limit = LIMIT, now = Date.now()): { ok: boolean; remaining: number; resetMs: number; limit: number } {
  const k = keyFor(ip);
  let e = HITS.get(k);
  if (!e || now - e.start >= WINDOW_MS) {
    if (!e && HITS.size >= MAX_KEYS) {
      // Bound memory: drop expired windows, then the oldest if still full.
      for (const [key, v] of HITS) if (now - v.start >= WINDOW_MS) HITS.delete(key);
      if (HITS.size >= MAX_KEYS) HITS.delete(HITS.keys().next().value as string);
    }
    e = { start: now, n: 0 };
    HITS.set(k, e);
  }
  e.n += 1;
  return { ok: e.n <= limit, remaining: Math.max(0, limit - e.n), resetMs: e.start + WINDOW_MS - now, limit };
}
