/**
 * Sync content/ → src/generated/allowed-corpus.json so serverless always has digests.
 * Run: node scripts/embed-corpus.mjs  (also hooked via prebuild).
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const files = {
  "hilton/2026-Q2-digest.md": "content/earnings/hilton/2026-Q2-digest.md",
  "host-hotels/2026-Q2-digest.md": "content/earnings/host-hotels/2026-Q2-digest.md",
  "pebblebrook/2026-Q2-digest.md": "content/earnings/pebblebrook/2026-Q2-digest.md",
  "ideology/talent-human-touch.md": "content/ideology/talent-human-touch.md",
};
const payload = {};
for (const [key, rel] of Object.entries(files)) {
  payload[key] = readFileSync(join(root, rel), "utf8");
}
const outDir = join(root, "src/generated");
mkdirSync(outDir, { recursive: true });
const out = join(outDir, "allowed-corpus.json");
writeFileSync(out, JSON.stringify(payload, null, 2) + "\n");
console.log("[embed-corpus] wrote", out);
