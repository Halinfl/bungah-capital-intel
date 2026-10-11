import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Clerk auth middleware.
 * Protect /workspace and /account. Public: /, /markets, /chat, /radars, /sound-money-lodging,
 * /podcast, /trust, /pricing, /login, /signup, /invite, static assets.
 */
function isProtectedPath(pathname: string): boolean {
  return pathname.startsWith("/workspace") || pathname.startsWith("/account");
}

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedPath(req.nextUrl.pathname)) {
    const { userId } = await auth();
    if (!userId) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect_url", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
