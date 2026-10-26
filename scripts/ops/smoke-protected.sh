#!/usr/bin/env bash
# Smoke a protected Vercel PREVIEW using the CLI's short-lived OIDC token (Trusted Sources header); never prints it.
# Usage: bash scripts/ops/smoke-protected.sh <preview-url> [--allow-degraded]     (run from the linked repo dir)
set -euo pipefail
cd "$(dirname "$0")/../.."
exec vercel env run --scope bungah -- sh -c 'test -n "$VERCEL_OIDC_TOKEN" || { echo "no VERCEL_OIDC_TOKEN from vercel env run"; exit 2; }; SMOKE_HEADERS="{\"x-vercel-trusted-oidc-idp-token\":\"$VERCEL_OIDC_TOKEN\"}" node scripts/ops/smoke.mjs "$@"' sh "$@"
