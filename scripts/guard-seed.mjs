#!/usr/bin/env node
// Refuses to let seed / push / reset scripts touch the PRODUCTION database unless explicitly allowed.
// Allowed only with ALLOW_PROD_SEED=yes (e.g. `ALLOW_PROD_SEED=yes npm run db:seed`), and only with Hal's OK.
// Always refuses the dead ep-fragrant-paper host. Loads .env like Prisma does. Never prints the URL.
import "dotenv/config";
const PROD_ENDPOINTS = (process.env.BUNGAH_PROD_DB_ENDPOINTS || "ep-bold-bread-b52z5l38").split(",").map((s) => s.trim()).filter(Boolean);
const DEAD = "ep-fragrant-paper-b5rsdrke";
const what = process.argv[2] || "db script";
const url = process.env.DATABASE_URL || "";
if (!url) { console.error(`[guard-seed] DATABASE_URL is not set; refusing ${what}`); process.exit(1); }
let host = ""; try { host = new URL(url).hostname; } catch { console.error("[guard-seed] DATABASE_URL is not a valid URL"); process.exit(1); }
if (host.includes(DEAD)) { console.error(`[guard-seed] REFUSING ${what}: DATABASE_URL points at the dead ep-fragrant-paper database`); process.exit(1); }
const isProd = PROD_ENDPOINTS.some((e) => host.startsWith(e)) || process.env.VERCEL_ENV === "production";
if (isProd && process.env.ALLOW_PROD_SEED !== "yes") {
  console.error(`[guard-seed] REFUSING ${what}: DATABASE_URL is the PRODUCTION database (${host.split(".")[0]}).\n` +
    "  Point DATABASE_URL at a dev branch, or re-run with ALLOW_PROD_SEED=yes only with Hal's explicit OK.");
  process.exit(1);
}
console.error(`[guard-seed] ok: ${what} -> ${host.split(".")[0]}${isProd ? " (PRODUCTION, ALLOW_PROD_SEED=yes)" : ""}`);
