#!/usr/bin/env node
// Restore test for a bungah-db dump: loads it into a throwaway in-process Postgres (PGlite, PG17-compatible WASM;
// nothing touches Neon), then compares per-table row counts and content hashes with the dump manifest,
// checks every live column exists in the restored schema, and validates foreign keys.
// Usage: node /workspace/bungah-ops/db-restore-test.mjs [dumpDir]   (default: /workspace/backups/bungah-db/latest)
// Exit 0 = restorable and counts match; nonzero = failure (details printed).
import fs from "node:fs"; import path from "node:path"; import zlib from "node:zlib"; import crypto from "node:crypto";
import { PGlite } from "@electric-sql/pglite";

const dir = fs.realpathSync(process.argv[2] || "/workspace/backups/bungah-db/latest");
const man = JSON.parse(fs.readFileSync(path.join(dir, "manifest.json"), "utf8"));
const db = new PGlite();
const fail = []; const q = (t) => '"' + t.replace(/"/g, '""') + '"';
const ddl = fs.readFileSync(path.join(dir, "schema.sql"), "utf8");
const [createPart, fkPart = ""] = ddl.split(/(?=-- AddForeignKey)/).reduce((a, s, i) => (i === 0 ? [s] : [a[0], (a[1] || "") + s]), []);
await db.exec(createPart);

for (const [t, meta] of Object.entries(man.tables)) {
  const cols = (await db.query(`select column_name from information_schema.columns where table_schema='public' and table_name=$1`, [t])).rows.map((r) => r.column_name);
  if (!cols.length) { fail.push(`${t}: table missing from schema.sql`); continue; }
  const missing = meta.columns.map((c) => c.column_name).filter((c) => !cols.includes(c));
  if (missing.length) fail.push(`${t}: live columns missing from schema.sql: ${missing.join(",")}`);
  const body = zlib.gunzipSync(fs.readFileSync(path.join(dir, `${t}.jsonl.gz`))).toString("utf8");
  if (crypto.createHash("sha256").update(body).digest("hex") !== meta.sha256) fail.push(`${t}: dump file hash mismatch (corrupt?)`);
  const lines = body.split("\n").filter(Boolean);
  for (let i = 0; i < lines.length; i += 200) {
    const batch = "[" + lines.slice(i, i + 200).join(",") + "]";
    await db.query(`insert into ${q(t)} select * from json_populate_recordset(null::${q(t)}, $1::json)`, [batch]);
  }
}
try { await db.exec(fkPart); } catch (e) { fail.push("foreign keys failed to validate: " + e.message); }

const rows = [];
for (const [t, meta] of Object.entries(man.tables)) {
  let got = -1; try { got = (await db.query(`select count(*)::int n from ${q(t)}`)).rows[0].n; } catch {}
  rows.push(`${t} dump=${meta.rows} restored=${got}${got === meta.rows ? "" : "  <-- MISMATCH"}`);
  if (got !== meta.rows) fail.push(`${t}: count ${got} != ${meta.rows}`);
}
await db.close();
console.log(`restore-test ${path.basename(dir)} (snapshot ${man.snapshotAt}) into PGlite:\n  ` + rows.join("\n  "));
if (fail.length) { console.error("RESTORE TEST FAILED:\n  " + fail.join("\n  ")); process.exit(1); }
console.log("restore-test OK");
