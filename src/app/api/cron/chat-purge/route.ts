import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PURGE_DAYS, purgeAnonThreads } from "@/lib/chat-store";

/**
 * 90-day purge of signed-out conversations with nothing saved (Decision B). Vercel Cron calls GET with
 * `Authorization: Bearer $CRON_SECRET`. ?dryRun=1 (or BUNGAH_PURGE_DRY_RUN=true) only counts. Signed-in and
 * legacy unowned threads are never candidates. No CRON_SECRET → 503; wrong token → 401.
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
    const out = await purgeAnonThreads(prisma, { dryRun, days: PURGE_DAYS });
    console.log(`[chat-purge] ${JSON.stringify(out)}`);
    return NextResponse.json(out, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("[chat-purge] failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Purge failed." }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
