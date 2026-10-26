import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Uptime/health probe. 200 {status:"ok"} when the app and DB answer; 503 {status:"degraded"} when the DB is
 * unreachable (pages still render from cache/fallbacks). Never cached; no secrets or hostnames in the body.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const started = Date.now();
  let db: "ok" | "down" = "down";
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 5000)),
    ]);
    db = "ok";
  } catch (e) {
    console.error("[health] db check failed:", e instanceof Error ? e.message.split("\n").slice(-1)[0] : e);
  }
  const body = {
    status: db === "ok" ? "ok" : "degraded",
    db,
    dbLatencyMs: Date.now() - started,
    deployment: process.env.VERCEL_DEPLOYMENT_ID ?? null,
    env: process.env.VERCEL_ENV ?? "local",
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    time: new Date().toISOString(),
  };
  return NextResponse.json(body, { status: db === "ok" ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
