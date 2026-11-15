import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PURGE_DAYS, SIGNED_OUT_LOG_RETENTION_DAYS, purgeAnonThreads, purgeSignedOutLogs } from "@/lib/chat-store";

/**
 * Chat cleanup: (1) 90-day purge of signed-out conversations with nothing saved (Decision B);
 * (2) 12-month deletion of signed-out question logs (Hal, 15 Nov 2026). Vercel Cron calls GET with
 * `Authorization: Bearer $CRON_SECRET`. ?dryRun=1 (or BUNGAH_PURGE_DRY_RUN=true) only counts. Signed-in and
 * legacy unowned threads are never thread candidates; signed-in private logs are never log candidates.
 * No CRON_SECRET → 503; wrong token → 401.
 */
export const dynamic = "force-dynamic";

function authorized(req: Request): "ok" | "no-secret" | "bad" {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return "no-secret";
  const got = Buffer.from(req.headers.get("authorization") ?? "");
  const want = Buffer.from(`Bearer ${secret}`);
  return got.length === want.length && timingSafeEqual(got, want) ? "ok" : "bad";
}

export async function GET(req: Request) {
  const a = authorized(req);
  if (a !== "ok") return NextResponse.json({ error: a === "no-secret" ? "Cron not configured." : "Unauthorized." }, { status: a === "no-secret" ? 503 : 401, headers: { "Cache-Control": "no-store" } });
  const url = new URL(req.url);
  const dryRun = ["1", "true"].includes(url.searchParams.get("dryRun") ?? "") || process.env.BUNGAH_PURGE_DRY_RUN?.trim().toLowerCase() === "true";
  try {
    const threads = await purgeAnonThreads(prisma, { dryRun, days: PURGE_DAYS });
    const logs = await purgeSignedOutLogs(prisma, { dryRun, days: SIGNED_OUT_LOG_RETENTION_DAYS });
    const out = { threads, logs };
    console.log(`[chat-purge] ${JSON.stringify(out)}`);
    return NextResponse.json(out, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("[chat-purge] failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Purge failed." }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
