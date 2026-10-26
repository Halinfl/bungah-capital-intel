/** Canonical origin for metadata, canonicals, robots and the sitemap. */
export const SITE_URL = "https://bungah.io";

/**
 * Sign-in, account and private workspace paths. Disallowed in robots.txt, never listed in the
 * sitemap, and the pages themselves carry noindex.
 */
export const PRIVATE_PATHS = ["/api/", "/login", "/signup", "/account", "/workspace", "/invite"];

export function isPrivatePath(path: string): boolean {
  return PRIVATE_PATHS.some((p) => path === p.replace(/\/$/, "") || path.startsWith(p.endsWith("/") ? p : `${p}/`));
}

/** Robots value for sign-in, account and invite pages. */
export const NOINDEX = { index: false, follow: false } as const;
