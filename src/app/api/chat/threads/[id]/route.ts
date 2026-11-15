import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteThread, getOwnedThread } from "@/lib/chat-store";
import { NO_STORE, ownerFromRequest } from "@/lib/chat-owner";

/**
 * One conversation, owner only. Anything else (unknown id, someone else's thread, a legacy unowned thread,
 * or a database without the foundation schema) is the same 404, so no thread's existence leaks.
 */
const NOT_FOUND = () => NextResponse.json({ error: "Conversation not found." }, { status: 404, headers: NO_STORE });

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const t = await getOwnedThread(prisma, id, await ownerFromRequest(req));
    if (!t) return NOT_FOUND();
    return NextResponse.json({ thread: t }, { headers: NO_STORE });
  } catch (e) {
    console.error("[chat-thread] read failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Couldn't load that conversation. Try again in a moment." }, { status: 503, headers: NO_STORE });
  }
}

/** "Delete conversation": thread, messages, saved items and its private log rows (F5). */
export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const out = await deleteThread(prisma, id, await ownerFromRequest(req));
    if (!out.ok) return NOT_FOUND();
    return NextResponse.json({ ok: true, deleted: out }, { headers: NO_STORE });
  } catch (e) {
    console.error("[chat-thread] delete failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Couldn't delete that conversation. Try again in a moment." }, { status: 503, headers: NO_STORE });
  }
}
