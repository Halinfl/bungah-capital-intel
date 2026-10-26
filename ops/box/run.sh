#!/usr/bin/env bash
# Single entry point for scheduled ops. Logs to /workspace/backups/logs/<job>-YYYYMMDD.log; exit nonzero if any step failed.
# Usage: bash /workspace/bungah-ops/run.sh nightly|weekly|monthly|uptime
#   nightly : db-export -> db-restore-test (latest) -> data-check
#   weekly  : setup-check -> research-backup
#   monthly : usage-check -> restore-all --dry-run (scratch target) -> db-restore-test on the oldest kept dump
#   uptime  : uptime-check https://bungah.io
set -uo pipefail
JOB="${1:?nightly|weekly|monthly|uptime}"; OPS=/workspace/bungah-ops; LOGD=/workspace/backups/logs; mkdir -p "$LOGD"
LOG="$LOGD/$JOB-$(date +%Y%m%d).log"; RC=0
step() { echo "== $(date -Is) $*" >> "$LOG"; "$@" >> "$LOG" 2>&1 || { RC=1; echo "!! FAILED: $*" >> "$LOG"; echo "FAILED: $*" >&2; }; }
cd "$OPS"
case "$JOB" in
  nightly) step node db-export.mjs; step node db-restore-test.mjs /workspace/backups/bungah-db/latest; step node data-check.mjs ;;
  weekly)  step node setup-check.mjs; step bash research-backup.sh ;;
  monthly) step node usage-check.mjs
           printf 'postgresql://dry:run@ep-dry-run-0.us-east-2.aws.neon.tech/neondb\n' > /tmp/bungah-dryrun.url
           step env TARGET_URL_FILE=/tmp/bungah-dryrun.url bash /workspace/restore/restore-all.sh --dry-run; rm -f /tmp/bungah-dryrun.url
           OLDEST="$(ls -1d /workspace/backups/bungah-db/2*Z 2>/dev/null | head -1)"; [ -n "$OLDEST" ] && step node db-restore-test.mjs "$OLDEST" ;;
  uptime)  step node uptime-check.mjs https://bungah.io ;;
  *) echo "unknown job $JOB"; exit 2 ;;
esac
tail -n 3 "$LOG"; exit $RC
