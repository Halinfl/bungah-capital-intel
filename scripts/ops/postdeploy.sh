#!/usr/bin/env bash
# Post-deploy smoke: run right after a deploy/promote. Exit nonzero on failure and print the rollback command.
# Usage: bash scripts/ops/postdeploy.sh <url> [previous-good-deployment-id]
#   e.g. bash scripts/ops/postdeploy.sh https://bungah.io dpl_2xe3xS847UpYHdcxZULLipFGXimp
set -uo pipefail
cd "$(dirname "$0")/../.."
URL="${1:?usage: postdeploy.sh <url> [previous-good-dpl]}"; PREV="${2:-dpl_2xe3xS847UpYHdcxZULLipFGXimp}"
if node scripts/ops/smoke.mjs "$URL"; then echo "postdeploy OK: $URL"; exit 0; fi
cat <<MSG
POSTDEPLOY FAILED for $URL.
Roll back production (instant, no rebuild; needs Hal's OK as a prod change):
  vercel rollback $PREV --scope bungah --yes
  # or: vercel promote $PREV --scope bungah --yes
Then re-check:  node scripts/ops/smoke.mjs https://bungah.io
MSG
exit 1
