import { NextResponse } from "next/server";

/**
 * Cookie-stub logout retired — use Clerk UserButton / signOut.
 */
function gone(req: Request) {
  const url = new URL("/login", req.url);
  const res = NextResponse.redirect(url, 303);
  return res;
}

export async function POST(req: Request) {
  // Prefer Clerk client sign-out; redirect old form posts to login.
  return gone(req);
}

export async function GET(req: Request) {
  return gone(req);
}
