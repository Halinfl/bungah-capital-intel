/** Canonical origin for metadata, canonicals, robots and the sitemap. */
export const SITE_URL = "https://bungah.io";

/**
 * Sign-in, account and private workspace paths: never listed in the sitemap, and the pages carry noindex.
 * /login and /signup stay crawlable (not in ROBOTS_DISALLOW) so crawlers can see their noindex tag.
 */
export const PRIVATE_PATHS = ["/api/", "/login", "/signup", "/account", "/workspace", "/invite"];

/** robots.txt Disallow list: private paths except the sign-in pages, which rely on noindex. */
export const ROBOTS_DISALLOW = PRIVATE_PATHS.filter((p) => p !== "/login" && p !== "/signup");

export function isPrivatePath(path: string): boolean {
  return PRIVATE_PATHS.some((p) => path === p.replace(/\/$/, "") || path.startsWith(p.endsWith("/") ? p : `${p}/`));
}

/** Robots value for sign-in, account and invite pages. */
export const NOINDEX = { index: false, follow: false } as const;
