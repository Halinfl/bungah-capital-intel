import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTrainOptIn, setTrainOptIn } from "@/lib/chat-store";
import { NO_STORE } from "@/lib/chat-owner";

/** Signed-in Chat settings. trainOptIn (Decision C) is off unless the person turns it on here. */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in first." }, { status: 401, headers: NO_STORE });
  try {
    return NextResponse.json({ trainOptIn: await getTrainOptIn(prisma, userId) }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Couldn't load settings. Try again in a moment." }, { status: 503, headers: NO_STORE });
  }
}

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in first." }, { status: 401, headers: NO_STORE });
  const body = (await req.json().catch(() => null)) as { trainOptIn?: unknown } | null;
  if (typeof body?.trainOptIn !== "boolean") return NextResponse.json({ error: "trainOptIn must be true or false." }, { status: 400, headers: NO_STORE });
  try {
    return NextResponse.json({ trainOptIn: await setTrainOptIn(prisma, userId, body.trainOptIn) }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Couldn't save settings. Try again in a moment." }, { status: 503, headers: NO_STORE });
  }
}
