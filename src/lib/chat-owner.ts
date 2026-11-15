import { auth } from "@clerk/nextjs/server";
import { anonFromRequest } from "@/lib/chat-anon";
import type { Owner } from "@/lib/chat-store";

/** The caller as a thread owner: Clerk userId when signed in, plus the verified anon cookie id. */
export async function ownerFromRequest(req: Request): Promise<Owner> {
  const { userId } = await auth();
  return { userId: userId ?? null, anonId: anonFromRequest(req) };
}

export const NO_STORE = { "Cache-Control": "no-store" } as const;
