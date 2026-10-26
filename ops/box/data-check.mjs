#!/usr/bin/env node
// Daily data check (READ ONLY): row counts vs minimums + key rows present. Exit 1 on any failure.
// Usage: node /workspace/bungah-ops/data-check.mjs
import { readOnly, loadUrl, hostLabel } from "./lib/db.mjs";
// Minimums = post-restore baseline 2026-10-26 (Market 55, Asset 55, Signal 896, Radar 3, Artifact 4 stack memos).
const MIN = { Market: 55, Asset: 55, Signal: 896, Radar: 3, Artifact: 4, Finding: 0, ChatThread: 0, ChatMessage: 0, ChatQuestionLog: 0 };
const KEY_MARKETS = ["orlando", "las-vegas", "honolulu", "chicago"];
const fails = []; const lines = [];
await readOnly(async (c) => {
  for (const [t, min] of Object.entries(MIN)) {
    let n; try { n = (await c.query(`select count(*)::int n from "${t}"`)).rows[0].n; } catch (e) { fails.push(`${t}: query failed (${e.message})`); continue; }
    lines.push(`${t}=${n} (min ${min})`); if (n < min) fails.push(`${t}: ${n} < min ${min}`);
  }
  const ms = (await c.query(`select slug from "Market" where slug = any($1)`, [KEY_MARKETS])).rows.map((r) => r.slug);
  for (const s of KEY_MARKETS) if (!ms.includes(s)) fails.push(`Market ${s} missing`);
  const memos = (await c.query(`select count(*)::int n from "Artifact" where kind='stack-memo'`)).rows[0].n;
  lines.push(`stack-memos=${memos} (min 4)`); if (memos < 4) fails.push(`stack-memo artifacts ${memos} < 4`);
  const nyc = (await c.query(`select count(*)::int n from "Signal" where title like 'NYC HTX Tax Year 2024%' and "sourceUrls" is not null`)).rows[0].n;
  if (nyc < 1) fails.push("NYC HTX signal missing sourceUrls (fixups not applied?)");
});
console.log(`data-check ${new Date().toISOString()} ${hostLabel(loadUrl())}: ${lines.join(" ")}`);
if (fails.length) { console.error("DATA CHECK FAILED: " + fails.join("; ")); process.exit(1); }
console.log("data-check OK");
