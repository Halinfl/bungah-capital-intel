import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveChatIdea } from "@/lib/chat-ideas";
import { anonFromRequest } from "@/lib/chat-anon";

const NO_STORE = { "Cache-Control": "no-store" };

/** Share an idea to improve Chat. Signed-in ideas are saved only on this explicit post. */
export async function POST(req: Request) {
  const { userId } = await auth();
  const body = (await req.json().catch(() => null)) as { text?: unknown; threadId?: unknown } | null;
  const text = typeof body?.text === "string" ? body.text : "";
  const threadId = typeof body?.threadId === "string" ? body.threadId : null;
  const source = userId ? "signed-in" : "signed-out";
  if (!userId && !anonFromRequest(req) && source === "signed-out") {
    // Still allow a signed-out share without a cookie; the idea is just unattached to a thread.
  }
  const out = await saveChatIdea(prisma, { text, threadId, source });
  if (!out.ok) return NextResponse.json({ error: "Couldn't save that idea." }, { status: 400, headers: NO_STORE });
  return NextResponse.json({ ok: true, id: out.id }, { headers: NO_STORE });
}
