import { NextResponse } from "next/server";

/**
 * Cookie-stub login retired — Clerk owns sign-in at /login.
 * Kept as a no-op so old clients get a clear signal.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "Stub auth retired. Use /login (Clerk SignIn).",
      redirect: "/login",
    },
    { status: 410 },
  );
}
