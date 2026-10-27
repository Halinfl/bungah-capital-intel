#!/usr/bin/env node
// After a seed or errata write: purge the site's page + chat caches (POST /api/revalidate), so the fix shows
// now instead of at the next hourly refresh. $0: one request, no DB access.
// Needs BUNGAH_SITE_URL (e.g. https://bungah.io) and BUNGAH_REVALIDATE_SECRET (the same value set on that
// deployment). Without them it prints how to purge and exits 0, so a seed never fails because of the purge.
// Usage: node scripts/purge-cache.mjs [what-was-written]   (package.json db:seed* scripts call it)
import "dotenv/config";
const what = process.argv[2] || "data write";
const site = (process.env.BUNGAH_SITE_URL || "").replace(/\/$/, "");
const secret = process.env.BUNGAH_REVALIDATE_SECRET || "";
if (!site || !secret) {
  console.warn(`[purge-cache] ${what}: BUNGAH_SITE_URL / BUNGAH_REVALIDATE_SECRET not set; caches NOT purged. ` +
    "Pages and chat refresh within 1 h, or re-run: BUNGAH_SITE_URL=https://bungah.io BUNGAH_REVALIDATE_SECRET=… node scripts/purge-cache.mjs");
  process.exit(0);
}
try {
  const res = await fetch(`${site}/api/revalidate`, { method: "POST", headers: { authorization: `Bearer ${secret}` } });
  const body = await res.text();
  if (!res.ok) {
    console.error(`[purge-cache] ${what}: purge failed (${res.status}) ${body.slice(0, 200)}`);
    process.exit(1);
  }
  console.error(`[purge-cache] ${what}: purged page + chat caches on ${new URL(site).host} (${body.slice(0, 120)})`);
} catch (e) {
  console.error(`[purge-cache] ${what}: purge request failed: ${e instanceof Error ? e.message : e}`);
  process.exit(1);
}
