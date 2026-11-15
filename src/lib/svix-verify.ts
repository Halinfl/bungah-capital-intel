/**
 * Svix webhook signature check (the scheme Clerk webhooks use), no dependency:
 * signature = base64(HMAC-SHA256(base64decode(secret without "whsec_"), `${svix-id}.${svix-timestamp}.${rawBody}`)),
 * sent in `svix-signature` as space-separated "v1,<sig>" entries. Timestamps more than 5 minutes off are rejected.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export const SVIX_TOLERANCE_S = 5 * 60;

export type SvixResult = { ok: true } | { ok: false; reason: "no-secret" | "missing-headers" | "bad-timestamp" | "bad-signature" };

export function svixSign(secret: string, id: string, timestamp: string, body: string): string {
  const key = Buffer.from(secret.startsWith("whsec_") ? secret.slice(6) : secret, "base64");
  return createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest("base64");
}

export function verifySvix(secret: string | undefined | null, headers: Headers, body: string, nowS = Math.floor(Date.now() / 1000)): SvixResult {
  if (!secret?.trim()) return { ok: false, reason: "no-secret" };
  const id = headers.get("svix-id");
  const ts = headers.get("svix-timestamp");
  const sigs = headers.get("svix-signature");
  if (!id || !ts || !sigs) return { ok: false, reason: "missing-headers" };
  const t = Number(ts);
  if (!/^\d+$/.test(ts) || !Number.isFinite(t) || Math.abs(nowS - t) > SVIX_TOLERANCE_S) return { ok: false, reason: "bad-timestamp" };
  const want = Buffer.from(svixSign(secret.trim(), id, ts, body));
  for (const entry of sigs.split(" ")) {
    const [ver, sig] = entry.split(",");
    if (ver !== "v1" || !sig) continue;
    const got = Buffer.from(sig);
    if (got.length === want.length && timingSafeEqual(got, want)) return { ok: true };
  }
  return { ok: false, reason: "bad-signature" };
}
