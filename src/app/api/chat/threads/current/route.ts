import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentThread } from "@/lib/chat-store";
import { NO_STORE, ownerFromRequest } from "@/lib/chat-owner";

/**
 * The caller's current conversation, for restore after a reload (r4): signed in → the most recent owned
 * thread; signed out → this browser's own thread (anon cookie) if it hasn't been purged. Nothing → 404.
 */
export async function GET(req: Request) {
  try {
    const t = await getCurrentThread(prisma, await ownerFromRequest(req));
    if (!t) return NextResponse.json({ error: "Conversation not found." }, { status: 404, headers: NO_STORE });
    return NextResponse.json({ thread: t }, { headers: NO_STORE });
  } catch (e) {
    console.error("[chat-thread] current failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Couldn't load that conversation. Try again in a moment." }, { status: 503, headers: NO_STORE });
  }
}
