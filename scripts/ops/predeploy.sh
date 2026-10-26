#!/usr/bin/env bash
# Pre-deploy gate: type check -> production build (+ postbuild check-ic-frame guard) -> local smoke test.
# Run from the repo root before any `vercel deploy`. Exit nonzero on the first failure.
# Usage: bash scripts/ops/predeploy.sh            (needs DATABASE_URL for a realistic smoke; without one it
#        runs the DB-outage drill: an unreachable DB URL, pages must still render, health may be 503)
set -euo pipefail
cd "$(dirname "$0")/../.."
PORT="${SMOKE_PORT:-3123}"
echo "== 1/4 typecheck"; npx tsc --noEmit -p .
echo "== 2/4 build (includes postbuild check-ic-frame)"
if [ -z "${DATABASE_URL:-}" ]; then
  export DATABASE_URL="postgresql://outage:drill@127.0.0.1:1/none?connect_timeout=2"; MODE="--allow-degraded"
  echo "   (no DATABASE_URL: DB-outage drill mode)"
else MODE="${SMOKE_MODE:-}"; fi
npm run build
echo "== 3/4 ic-frame guard (explicit re-run)"; npm run -s test:ic-frame
echo "== 4/4 smoke on local next start :$PORT"
npx next start -p "$PORT" > /tmp/bungah-predeploy-server.log 2>&1 & PID=$!
trap 'kill $PID 2>/dev/null || true' EXIT
for i in $(seq 1 60); do curl -fs -o /dev/null "http://127.0.0.1:$PORT/robots.txt" && break; sleep 1; done
node scripts/ops/smoke.mjs "http://127.0.0.1:$PORT" $MODE
echo "predeploy OK"
