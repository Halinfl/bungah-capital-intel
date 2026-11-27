import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Clerk auth middleware.
 * Protect /workspace and /account. Public: /, /markets, /chat, /radars, /sound-money-lodging,
 * /podcast, /trust, /login, /signup, /invite, static assets.
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
    // Skips static assets and the public, cache-served content pages (home, markets, REITs, deals, Tuesday Trends,
    // Sound Assets, podcast, trust, errata, privacy, sponsorship policy, robots, sitemap). None of them reads the session on
    // the server (the nav reads it in the browser), so running Clerk there only spent Vercel Active CPU on every view.
    // Chat, radars, sound-money-lodging, login/signup/invite, workspace/account and all /api routes keep the middleware.
    // .php/.asp(x) bot probes are skipped too (they only ever 404).
    "/((?!$|_next|(?:markets|reits|deals|tuesday-trends|hard-assets|podcast|trust|errata|privacy|sponsorship-policy)(?:/|$)|robots\\.txt$|sitemap\\.xml$|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|php|aspx?)).*)",
    "/(api|trpc)(.*)",
  ],
};
