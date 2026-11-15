/**
 * Signed-out conversation owner: a random id in an HttpOnly cookie, signed with BUNGAH_ANON_SECRET (HMAC-SHA256).
 * No account link and no IP. Without the secret (or with a short one) no anon id is issued or accepted, and
 * signed-out turns are written without a thread (log row only), so nothing unowned is ever created.
 */
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const ANON_COOKIE = "bci_anon";
/** Cookie lifetime; the thread itself is purged after 90 days without activity. */
export const ANON_MAX_AGE_S = 180 * 24 * 60 * 60;
const ID_RE = /^a_[0-9a-f]{32}$/;

function secret(): string | null {
  const s = process.env.BUNGAH_ANON_SECRET?.trim() ?? "";
  return s.length >= 32 ? s : null;
}
export function anonEnabled(): boolean {
  return secret() !== null;
}
function sign(id: string, key: string): string {
  return createHmac("sha256", key).update(`bci-anon:v1:${id}`).digest("base64url");
}

export function mintAnon(): { id: string; cookie: string } | null {
  const key = secret();
  if (!key) return null;
  const id = `a_${randomUUID().replace(/-/g, "")}`;
  return { id, cookie: `${id}.${sign(id, key)}` };
}

/** The verified anon id from a cookie value, or null (missing, malformed, tampered, or no secret). */
export function verifyAnon(value: string | null | undefined): string | null {
  const key = secret();
  if (!key || !value) return null;
  const dot = value.indexOf(".");
  if (dot < 0) return null;
  const id = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  if (!ID_RE.test(id)) return null;
  const want = Buffer.from(sign(id, key));
  const got = Buffer.from(sig);
  return want.length === got.length && timingSafeEqual(want, got) ? id : null;
}

export function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    if (part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return null;
}

export function anonFromRequest(req: Request): string | null {
  return verifyAnon(readCookie(req.headers.get("cookie"), ANON_COOKIE));
}

export function anonCookieOptions() {
  return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: ANON_MAX_AGE_S };
}
