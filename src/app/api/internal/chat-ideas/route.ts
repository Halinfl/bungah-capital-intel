import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { listChatIdeas } from "@/lib/chat-ideas";

/**
 * Internal export of saved Chat ideas. GET with Authorization: Bearer $CRON_SECRET.
 * Not a public page.
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
  if (a !== "ok") {
    return NextResponse.json(
      { error: a === "no-secret" ? "Export not configured." : "Unauthorized." },
      { status: a === "no-secret" ? 503 : 401, headers: { "Cache-Control": "no-store" } }
    );
  }
  const rows = await listChatIdeas(prisma);
  return NextResponse.json(
    { ok: true, count: rows.length, ideas: rows },
    { headers: { "Cache-Control": "no-store" } }
  );
}
