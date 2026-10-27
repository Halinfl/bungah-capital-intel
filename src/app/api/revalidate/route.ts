import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createHash, timingSafeEqual } from "node:crypto";
import { DB_TAG } from "@/lib/db-safe";
import { CHAT_CACHE_TAG } from "@/lib/chat-cache";

/**
 * Cache purge after a data write (seed or errata script): drops every DB-backed page read and every cached
 * chat answer, so a correction shows at once instead of at the next hourly refresh.
 *
 * Secret-protected and deny-by-default: needs BUNGAH_REVALIDATE_SECRET set on the deployment (a server-only
 * env var) and `Authorization: Bearer <that secret>`. Unset → 503, wrong secret → 401. No DB access, no
 * writes; it only marks cache entries stale.
 */
export async function POST(req: Request) {
  const secret = process.env.BUNGAH_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ error: "Cache purge is not configured on this deployment" }, { status: 503 });
  const got = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const h = (s: string) => createHash("sha256").update(s).digest();
  if (!got || !timingSafeEqual(h(got), h(secret))) return NextResponse.json({ error: "Not allowed" }, { status: 401 });
  revalidateTag(DB_TAG);
  revalidateTag(CHAT_CACHE_TAG);
  return NextResponse.json({ ok: true, purged: [DB_TAG, CHAT_CACHE_TAG], at: new Date().toISOString() });
}
