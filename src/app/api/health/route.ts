import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

/** Off production only: a one-way fingerprint of the DB host (never the URL), to tell whether two deployments share a database. */
function dbFingerprint(): { dbHostSha: string; dbPooled: boolean } | null {
  if (process.env.VERCEL_ENV === "production") return null;
  try {
    const host = new URL(process.env.DATABASE_URL ?? "").hostname;
    return { dbHostSha: createHash("sha256").update(host).digest("hex").slice(0, 10), dbPooled: host.includes("-pooler") };
  } catch {
    return null;
  }
}

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
    ...(dbFingerprint() ?? {}),
  };
  return NextResponse.json(body, { status: db === "ok" ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
