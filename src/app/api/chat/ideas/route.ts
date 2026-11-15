import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveChatIdea } from "@/lib/chat-ideas";
import { anonFromRequest } from "@/lib/chat-anon";
import { ownsThread } from "@/lib/chat-store";

const NO_STORE = { "Cache-Control": "no-store" };

/** Share an idea to improve Chat. Signed-in ideas are saved only on this explicit post. */
export async function POST(req: Request) {
  const { userId } = await auth();
  const body = (await req.json().catch(() => null)) as { text?: unknown; threadId?: unknown } | null;
  const text = typeof body?.text === "string" ? body.text : "";
  let threadId = typeof body?.threadId === "string" && body.threadId.trim() ? body.threadId.trim() : null;
  const source = userId ? "signed-in" : "signed-out";
  if (threadId) {
    const owner = { userId: userId ?? null, anonId: anonFromRequest(req) };
    try {
      const t = await prisma.chatThread.findUnique({ where: { id: threadId }, select: { userId: true, anonOwnerId: true } });
      if (!t || !ownsThread(t, owner)) {
        return NextResponse.json({ error: "Couldn't save that idea.", code: "not-owner" }, { status: 403, headers: NO_STORE });
      }
    } catch {
      threadId = null;
    }
  }
  const out = await saveChatIdea(prisma, { text, threadId, source, userId: userId ?? null });
  if (!out.ok) return NextResponse.json({ error: "Couldn't save that idea." }, { status: 400, headers: NO_STORE });
  return NextResponse.json({ ok: true, id: out.id }, { headers: NO_STORE });
}
