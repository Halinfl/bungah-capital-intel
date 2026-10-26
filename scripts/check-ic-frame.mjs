#!/usr/bin/env node
/**
 * Build-output guard (runs as `postbuild`, after `next build`): fails if any internal
 * investment-committee (IC) frame string appears in the built output. Hal's standing lock:
 * IC thresholds stay off public pages, with no "below Treasuries" framing.
 *
 * Scans .next/server and .next/static (HTML, RSC/JSON payloads, JS chunks). JS/JSON escapes
 * (\u2264, \u2013, …) and HTML entities are decoded before matching.
 *
 *   npm run test:ic-frame            # scan ./.next
 *   node scripts/check-ic-frame.mjs path/to/.next
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative, extname } from "node:path";

const ROOT = process.argv[2] || join(process.cwd(), ".next");
const DIRS = ["server", "static"].map((d) => join(ROOT, d));
const EXTS = new Set([".html", ".json", ".rsc", ".js", ".mjs", ".cjs", ".body", ".txt", ".meta", ".map"]);

// Literal strings (case-insensitive) that only ever come from the internal IC frame.
const BANNED = [
  "hard watch",
  "hard-watch",
  "≤9%",
  "≤ 9%",
  "≤8%",
  "flag 9%",
  "flag ≤",
  "9% or less flagged",
  "debt yield of at least 10%",
  "target at least 10%",
  "target ≥10%",
  "DY ≥10%",
  "DY target",
  "7.5–8.0%",
  "7.5-8.0%",
  "house frame",
  "house takeout",
  "IC frame",
  "IC pack",
  "below Treasuries",
  "re-price wire",
  "at the lock",
];

function decode(s) {
  return s
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&le;/g, "≤").replace(/&ge;/g, "≥").replace(/&ndash;/g, "–").replace(/&amp;/g, "&")
    .replace(/\u00a0/g, " ");
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) yield* walk(p);
    else if (EXTS.has(extname(name)) && st.size < 20 * 1024 * 1024) yield p;
  }
}

if (!DIRS.some((d) => existsSync(d))) {
  console.error(`check-ic-frame: no build output under ${ROOT} (run next build first)`);
  process.exit(2);
}

const needles = BANNED.map((b) => b.toLowerCase());
const hits = [];
let files = 0;
for (const dir of DIRS.filter((d) => existsSync(d))) {
  for (const f of walk(dir)) {
    files++;
    const text = decode(readFileSync(f, "utf8")).toLowerCase();
    for (let i = 0; i < needles.length; i++) {
      const at = text.indexOf(needles[i]);
      if (at >= 0) {
        hits.push(`${relative(process.cwd(), f)}: "${BANNED[i]}" … ${text.slice(Math.max(0, at - 60), at + 80).replace(/\s+/g, " ")}`);
      }
    }
  }
}

if (hits.length) {
  console.error(`check-ic-frame: FAIL — ${hits.length} IC-frame string(s) in build output (${files} files scanned):`);
  for (const h of hits) console.error("  " + h);
  process.exit(1);
}
console.log(`check-ic-frame: OK — no IC-frame strings in ${files} build files.`);
