#!/usr/bin/env bash
# Back up the box-only research folders to /workspace/backups/research/research-<UTC stamp>.tar.gz (+ .sha256 + file list).
# Folders: /workspace/neo-capital-intel/markets, product/*/contrib, deepen/talent. Keeps the newest KEEP (default 12).
# Usage: bash /workspace/bungah-ops/research-backup.sh
set -euo pipefail
ROOT=/workspace/neo-capital-intel; OUT=/workspace/backups/research; KEEP="${KEEP:-12}"
mkdir -p "$OUT"; STAMP="$(date -u +%Y%m%dT%H%M%SZ)"; T="$OUT/research-$STAMP.tar.gz"
cd "$ROOT"
mapfile -t PATHS < <( { ls -d markets deepen/talent 2>/dev/null; ls -d product/*/contrib 2>/dev/null; } )
[ "${#PATHS[@]}" -gt 0 ] || { echo "nothing to back up"; exit 1; }
tar -czf "$T.partial" "${PATHS[@]}"
tar -tzf "$T.partial" > "$OUT/research-$STAMP.files.txt"   # also proves the archive reads back
mv "$T.partial" "$T"; (cd "$OUT" && sha256sum "$(basename "$T")" > "$(basename "$T").sha256")
ls -1t "$OUT"/research-*.tar.gz | tail -n +$((KEEP+1)) | while read -r old; do rm -f "$old" "$old.sha256" "${old%.tar.gz}.files.txt"; done
echo "research-backup OK $T $(du -h "$T" | cut -f1) files=$(grep -vc '/$' "$OUT/research-$STAMP.files.txt") paths=${PATHS[*]}"
