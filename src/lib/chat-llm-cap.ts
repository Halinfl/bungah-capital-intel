/**
 * In-app caps and a 429 circuit breaker for Groq Chat.
 * Soft, in-process (same limits as signed-out chat rate limiting): each instance counts
 * separately, and counts reset on a cold start. They sit below Groq's free-tier ceiling
 * (1,000 RPD / 200,000 TPD / 8,000 TPM for openai/gpt-oss-120b).
 */
import { createHash } from "node:crypto";

const DAY_MS = 24 * 60 * 60 * 1000;

export const LLM_DAILY_REQUEST_CAP = Number(process.env.BUNGAH_LLM_DAILY_CAP || 400);
export const LLM_DAILY_TOKEN_CAP = Number(process.env.BUNGAH_LLM_DAILY_TOKEN_CAP || 180_000);
export const LLM_USER_DAILY_CAP = Number(process.env.BUNGAH_LLM_USER_DAILY_CAP || 20);
export const LLM_TIMEOUT_MS = Number(process.env.BUNGAH_LLM_TIMEOUT_MS || 2500);

type DayBucket = { start: number; requests: number; tokens: number };
const ORG: DayBucket = { start: 0, requests: 0, tokens: 0 };
const USERS = new Map<string, DayBucket>();
const MAX_USERS = 20_000;
let blockedUntil = 0;

export type LlmSkipReason =
  | "cap_org_requests"
  | "cap_org_tokens"
  | "cap_user"
  | "rate_limited"
  | "private"
  | "disabled"
  | "no_model"
  | "no_credentials";

function dayStart(now: number): number {
  return now - (now % DAY_MS);
}

function roll(b: DayBucket, now: number): DayBucket {
  const start = dayStart(now);
  if (b.start !== start) {
    b.start = start;
    b.requests = 0;
    b.tokens = 0;
  }
  return b;
}

function userKey(id: string): string {
  return createHash("sha256").update(`${process.env.VERCEL_DEPLOYMENT_ID ?? "local"}:llm:${id}`).digest("hex").slice(0, 20);
}

/** True when a previous 429's retry-after has not yet elapsed. */
export function groqIsCoolingDown(now = Date.now()): boolean {
  return now < blockedUntil;
}

export function markGroqRateLimited(retryAfterSec?: number, now = Date.now()): void {
  const wait = Math.max(1, Math.min(120, Number(retryAfterSec) || 15));
  blockedUntil = now + wait * 1000;
}

export function checkLlmCap(userOrIp: string, now = Date.now()): { ok: true } | { ok: false; reason: LlmSkipReason } {
  if (groqIsCoolingDown(now)) return { ok: false, reason: "rate_limited" };
  const org = roll(ORG, now);
  if (org.requests >= LLM_DAILY_REQUEST_CAP) return { ok: false, reason: "cap_org_requests" };
  if (org.tokens >= LLM_DAILY_TOKEN_CAP) return { ok: false, reason: "cap_org_tokens" };
  const k = userKey(userOrIp || "unknown");
  let u = USERS.get(k);
  if (!u) {
    if (USERS.size >= MAX_USERS) {
      const start = dayStart(now);
      for (const [key, v] of USERS) if (v.start !== start) USERS.delete(key);
      if (USERS.size >= MAX_USERS) USERS.delete(USERS.keys().next().value as string);
    }
    u = { start: dayStart(now), requests: 0, tokens: 0 };
    USERS.set(k, u);
  } else {
    roll(u, now);
  }
  if (u.requests >= LLM_USER_DAILY_CAP) return { ok: false, reason: "cap_user" };
  return { ok: true };
}

/** Reserve a slot after a successful check, before the Groq call. */
export function reserveLlmCall(userOrIp: string, estimatedTokens: number, now = Date.now()): void {
  const org = roll(ORG, now);
  org.requests += 1;
  org.tokens += Math.max(0, estimatedTokens);
  const k = userKey(userOrIp || "unknown");
  let u = USERS.get(k);
  if (!u) {
    u = { start: dayStart(now), requests: 0, tokens: 0 };
    USERS.set(k, u);
  } else {
    roll(u, now);
  }
  u.requests += 1;
  u.tokens += Math.max(0, estimatedTokens);
}

/** Adjust the token estimate once usage is known (never negative). */
export function reconcileLlmTokens(actualTokens: number, estimatedTokens: number, now = Date.now()): void {
  const delta = Math.max(0, actualTokens) - Math.max(0, estimatedTokens);
  if (!delta) return;
  roll(ORG, now).tokens = Math.max(0, ORG.tokens + delta);
}

/** Test helper: clear in-memory state. */
export function resetLlmCapsForTests(now = Date.now()): void {
  ORG.start = dayStart(now);
  ORG.requests = 0;
  ORG.tokens = 0;
  USERS.clear();
  blockedUntil = 0;
}

export function estimateTokensFromText(text: string, outputCap: number): number {
  // ~4 characters per token, plus the planned completion budget.
  return Math.ceil(Math.max(0, text.length) / 4) + outputCap;
}

export function parseRetryAfter(err: unknown): number | undefined {
  const msg = err instanceof Error ? err.message : String(err ?? "");
  const header = /retry-after["'\s:]+(\d+)/i.exec(msg);
  if (header) return Number(header[1]);
  if (/\b429\b|rate[_ ]limit|too many requests/i.test(msg)) return 15;
  return undefined;
}

export function isGroqRateLimitError(err: unknown): boolean {
  return parseRetryAfter(err) !== undefined && /429|rate[_ ]limit|too many requests|blocked_api_access/i.test(
    err instanceof Error ? err.message : String(err ?? "")
  );
}
