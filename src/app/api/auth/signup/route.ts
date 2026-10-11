import { NextResponse } from "next/server";

/**
 * Cookie-stub signup retired — Clerk owns sign-up at /signup.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "Stub auth retired. Use /signup (Clerk SignUp).",
      redirect: "/signup",
    },
    { status: 410 },
  );
}
