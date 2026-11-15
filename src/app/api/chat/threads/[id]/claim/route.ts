import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { claimThread, recordAnonLink } from "@/lib/chat-store";
import { NO_STORE, ownerFromRequest } from "@/lib/chat-owner";

/**
 * Claim a signed-out conversation after sign-in (F8): same browser (anon cookie), within 24h, once.
 * /api/chat also claims on the first signed-in follow-up; this is the explicit call for "Save, sign in, keep it".
 */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const owner = await ownerFromRequest(req);
    if (!owner.userId) return NextResponse.json({ error: "Sign in to keep this conversation." }, { status: 401, headers: NO_STORE });
    // S6: this browser's signed-out id now belongs to the account too (account deletion removes its threads).
    await recordAnonLink(prisma, owner).catch((e) => console.error("[chat-thread] anon link failed:", e instanceof Error ? e.message : e));
    const r = await claimThread(prisma, id, owner);
    if (!r.ok) return NextResponse.json({ error: "Conversation not found." }, { status: 404, headers: NO_STORE });
    return NextResponse.json({ ok: true, threadId: id }, { headers: NO_STORE });
  } catch (e) {
    console.error("[chat-thread] claim failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Couldn't keep that conversation. Try again in a moment." }, { status: 503, headers: NO_STORE });
  }
}
