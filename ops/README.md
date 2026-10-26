# bungah.io reliability ops

Added on branch `reliability` (2026-10-26) after the Oct 25 outage (unclaimed Neon DB expired; data rebuilt from seeds).

## In the app (this branch)
| What | Where |
|---|---|
| DB-outage fallbacks: cached reads (Next Data Cache, tag `db`, 5 min) + friendly notice when no cache | `src/lib/db-safe.ts`, `src/components/DataUnavailableNotice.tsx`; used by `/`, `/markets`, `/markets/[slug]`, `/radars`, `/sound-money-lodging`, `sitemap.xml`, chat retrieval |
| Error pages | `src/app/error.tsx`, `src/app/global-error.tsx`, `src/app/not-found.tsx` |
| Health probe (200 ok / 503 DB down, no-store) | `GET /api/health` |
| Chat: 503 friendly message on DB outage, answer still returned if the log write fails | `src/app/api/chat/route.ts` |
| Radar run role check (allowlist `RADARS_RUN_USER_IDS`, deny by default) + cache refresh | `src/app/api/radars/run/route.ts`, `src/lib/radar-access.ts` |
| Seed/push/reset guard (refuses production unless `ALLOW_PROD_SEED=yes`) | `scripts/guard-seed.mjs`, `package.json`, `prisma/seed.ts` |
| Pre-deploy gate: typecheck, build (+ check-ic-frame), smoke on `next start` | `npm run predeploy` (`scripts/ops/predeploy.sh`) |
| Smoke test (nonzero on failure) | `node scripts/ops/smoke.mjs <url> [--allow-degraded]` |
| Smoke a protected Vercel preview (CLI OIDC token, never printed) | `bash scripts/ops/smoke-protected.sh <preview-url> [--allow-degraded]` |
| Post-deploy smoke + rollback command | `bash scripts/ops/postdeploy.sh <url> [previous-good-dpl]` |

## On the box (`/workspace/bungah-ops`, copies in `ops/box/`)
Read-only against production unless stated. The box only allows outbound 443, so DB access uses the Neon
serverless driver over WebSocket; URLs come from `/home/box/.secrets/neon-new*.url` and are never printed.

| Job | Command |
|---|---|
| nightly (export + restore test + data check) | `bash /workspace/bungah-ops/run.sh nightly` |
| weekly (setup check + research backup) | `bash /workspace/bungah-ops/run.sh weekly` |
| monthly (usage check + restore-all dry run + oldest-dump restore test) | `bash /workspace/bungah-ops/run.sh monthly` |
| uptime (every 5-15 min) | `bash /workspace/bungah-ops/run.sh uptime` |
| DR: load a dump into an EMPTY database (writes) | `BUNGAH_DB_URL_FILE=<target.url> node /workspace/bungah-ops/db-load-dump.mjs [dumpDir]` |
| DR: rebuild from seeds into an EMPTY database (writes) | `TARGET_URL_FILE=<target.url> bash /workspace/restore/restore-all.sh` |
