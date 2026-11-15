import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteUserData } from "@/lib/chat-store";
import { verifySvix } from "@/lib/svix-verify";

/**
 * Clerk webhook (svix-signed; secret in CLERK_WEBHOOK_SECRET). user.deleted → every thread, message, saved
 * item, private log row and setting for that user (F6), plus unclaimed signed-out threads from the browsers
 * the user signed in on (r4 S6, ChatAnonLink). Other events are acknowledged and ignored.
 * No secret configured → 503 (nothing is processed unsigned).
 */
/**
 * r4 replay guard: a svix-id already processed (within the signature's 5-minute window, kept 10 minutes) is
 * acknowledged without running again. Per instance (in memory, $0); the delete is idempotent anyway, so this
 * is hardening only. Recorded only after success, so a failed delivery is still retried.
 */
const SEEN_TTL_MS = 10 * 60 * 1000;
const seen = new Map<string, number>();
function seenRecently(id: string, now = Date.now()): boolean {
  for (const [k, at] of seen) if (now - at > SEEN_TTL_MS) seen.delete(k);
  return seen.has(id);
}
function markSeen(id: string): void {
  if (!id) return;
  seen.set(id, Date.now());
  if (seen.size > 5000) seen.delete(seen.keys().next().value as string);
}

export async function POST(req: Request) {
  const body = await req.text();
  const v = verifySvix(process.env.CLERK_WEBHOOK_SECRET, req.headers, body);
  if (!v.ok) {
    const status = v.reason === "no-secret" ? 503 : 401;
    return NextResponse.json({ error: v.reason === "no-secret" ? "Webhook not configured." : "Invalid signature." }, { status, headers: { "Cache-Control": "no-store" } });
  }
  const svixId = (req.headers.get("svix-id") ?? "").slice(0, 200);
  if (svixId && seenRecently(svixId)) return NextResponse.json({ ok: true, duplicate: true });
  let evt: { type?: unknown; data?: { id?: unknown; deleted?: unknown } } | null = null;
  try {
    evt = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Bad payload." }, { status: 400 });
  }
  if (evt?.type !== "user.deleted") {
    markSeen(svixId);
    return NextResponse.json({ ok: true, ignored: String(evt?.type ?? "unknown") });
  }
  const userId = typeof evt.data?.id === "string" ? evt.data.id : "";
  if (!userId) return NextResponse.json({ error: "user.deleted without a user id." }, { status: 400 });
  try {
    const out = await deleteUserData(prisma, userId);
    console.log(`[clerk-webhook] user.deleted: threads=${"threads" in out ? out.threads : 0} saved=${"saved" in out ? out.saved : 0} privateLogs=${"privateLogs" in out ? out.privateLogs : 0}`);
    markSeen(svixId);
    return NextResponse.json({ ok: true, deleted: out });
  } catch (e) {
    // 5xx → svix retries the delivery.
    console.error("[clerk-webhook] delete failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Delete failed; will retry." }, { status: 500 });
  }
}
