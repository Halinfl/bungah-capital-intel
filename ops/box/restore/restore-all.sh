#!/usr/bin/env bash
# restore-all: rebuild the bungah.io Capital Graph from repo seeds into an EMPTY Neon database, in order:
#   1 schema.sql  2 seeds (seed.ts + dated seeds)  3 load19  4 Orlando/Las Vegas tax loader  5 fixups  6 data-check
# Use this only when no usable dump exists; prefer /workspace/bungah-ops/db-load-dump.mjs (keeps chat logs).
# Runs over Neon's WebSocket driver (box allows outbound 443 only), from /workspace/restore/app.
#
# Usage: TARGET_URL_FILE=/path/to/target.url bash /workspace/restore/restore-all.sh [--dry-run] [--allow-production]
#   - No default target on purpose. Never prints the URL.
#   - Refuses the dead ep-fragrant-paper host, the production endpoint without --allow-production (Hal's OK only),
#     and any target that already has tables (seed.ts deleteMany()s every table, chat logs included).
set -euo pipefail
DRY=0; ALLOW_PROD=0
for a in "$@"; do case "$a" in --dry-run) DRY=1;; --allow-production) ALLOW_PROD=1;; *) echo "unknown arg $a"; exit 2;; esac; done
APP=/workspace/restore/app; OPS=/workspace/bungah-ops
: "${TARGET_URL_FILE:?set TARGET_URL_FILE to the target database url file}"
[ -s "$TARGET_URL_FILE" ] || { echo "TARGET_URL_FILE empty/missing"; exit 2; }
export DATABASE_URL="$(tr -d '\n\r' < "$TARGET_URL_FILE")"
HOST="$(python3 -c 'import os,urllib.parse as u;print((u.urlparse(os.environ["DATABASE_URL"]).hostname or "").split(".")[0])')"
PROD_EP="$(python3 -c 'import urllib.parse as u;print((u.urlparse(open("/home/box/.secrets/neon-new.url").read().strip()).hostname or "").split(".")[0].replace("-pooler",""))')"
case "$HOST" in *ep-fragrant-paper-b5rsdrke*) echo "REFUSING: dead host"; exit 3;; esac
if [ "${HOST%-pooler}" = "$PROD_EP" ] && [ $ALLOW_PROD -ne 1 ]; then echo "REFUSING: target is PRODUCTION ($PROD_EP). Needs --allow-production and Hal's OK."; exit 3; fi
STEPS=(
  "schema|node $APP/apply-sql.mjs /workspace/restore/schema.sql"
  "seed|npx tsx prisma/seed.ts"
  "seed:sweep|npx tsx prisma/seed-sweep-2026-10-11.ts"
  "seed:world-cup-atlas|npx tsx prisma/seed-world-cup-atlas-2026-10-11.ts"
  "seed:demand-w1|npx tsx prisma/seed-demand-w1-2026-10-11.ts"
  "seed:depth-w1-linked|npx tsx prisma/seed-depth-w1-linked-2026-10-11.ts"
  "seed:tax-series|npx tsx prisma/seed-tax-series-2026-10-11.ts"
  "load19|npx tsx load19.mts"
  "tax-orl-lv|npx tsx prisma/seed-tax-series-orl-lv-2026-10-20.ts"
  "fixups|npx tsx fixups.mts"
  "data-check|env BUNGAH_DB_URL_FILE=$TARGET_URL_FILE node $OPS/data-check.mjs"
)
echo "restore-all -> $HOST $( [ $DRY -eq 1 ] && echo '(dry run)')"
cd "$APP"
for s in "${STEPS[@]}"; do
  name="${s%%|*}"; cmd="${s#*|}"
  for f in $cmd; do case "$f" in *.ts|*.mts|*.mjs|*.sql) [ -f "$f" ] || { echo "missing file for $name: $f"; exit 4; };; esac; done
done
if [ $DRY -eq 1 ]; then for s in "${STEPS[@]}"; do echo "  would run [${s%%|*}] ${s#*|}"; done; echo "dry run OK (all files present, no DB contact)"; exit 0; fi
N="$(node $APP/apply-sql.mjs "select count(*)::int n from information_schema.tables where table_schema='public' and table_type='BASE TABLE'" | python3 -c 'import json,sys;print(json.load(sys.stdin)[0]["n"])')"
[ "$N" = "0" ] || { echo "REFUSING: target already has $N tables (seed.ts wipes them). Use an empty branch."; exit 3; }
for s in "${STEPS[@]}"; do name="${s%%|*}"; cmd="${s#*|}"; echo "== $name"; bash -c "$cmd"; done
echo "restore-all OK -> $HOST"
