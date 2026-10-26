#!/usr/bin/env node
// DISASTER RECOVERY (WRITES): load a bungah-db dump into an EMPTY target database (schema.sql + all rows, one transaction).
// Fastest way back after a DB loss (keeps chat logs etc. that seeds cannot rebuild). Not scheduled; run by hand.
// Usage: BUNGAH_DB_URL_FILE=/path/to/target.url node db-load-dump.mjs [dumpDir] [--allow-production]
// Refuses: the dead host; the current production endpoint unless --allow-production; a target that already has tables.
import fs from "node:fs"; import path from "node:path"; import zlib from "node:zlib";
import { Pool } from "@neondatabase/serverless"; import "./lib/db.mjs"; import { loadUrl, hostLabel, PROD_URL_FILE } from "./lib/db.mjs";
const args = process.argv.slice(2); const allowProd = args.includes("--allow-production");
const dir = fs.realpathSync(args.find((a) => !a.startsWith("--")) || "/workspace/backups/bungah-db/latest");
if (!process.env.BUNGAH_DB_URL_FILE && !process.env.BUNGAH_DB_URL) { console.error("set BUNGAH_DB_URL_FILE to the TARGET url file (no default, on purpose)"); process.exit(2); }
const url = loadUrl(); const prodHost = hostLabel(fs.readFileSync(PROD_URL_FILE, "utf8").trim()).replace("-pooler", "");
if (hostLabel(url).replace("-pooler", "") === prodHost && !allowProd) { console.error(`REFUSING: target is the production endpoint (${prodHost}); pass --allow-production only with Hal's OK`); process.exit(3); }
const man = JSON.parse(fs.readFileSync(path.join(dir, "manifest.json"), "utf8"));
const pool = new Pool({ connectionString: url, max: 1 }); const c = await pool.connect(); const q = (t) => '"' + t + '"';
try {
  const existing = (await c.query(`select count(*)::int n from information_schema.tables where table_schema='public' and table_type='BASE TABLE'`)).rows[0].n;
  if (existing) throw new Error(`target already has ${existing} tables; load only into an empty branch/database`);
  const ddl = fs.readFileSync(path.join(dir, "schema.sql"), "utf8"); const i = ddl.indexOf("-- AddForeignKey");
  await c.query("BEGIN"); await c.query(i < 0 ? ddl : ddl.slice(0, i));
  for (const t of Object.keys(man.tables)) {
    const lines = zlib.gunzipSync(fs.readFileSync(path.join(dir, `${t}.jsonl.gz`))).toString("utf8").split("\n").filter(Boolean);
    for (let k = 0; k < lines.length; k += 200) await c.query(`insert into ${q(t)} select * from json_populate_recordset(null::${q(t)}, $1::json)`, ["[" + lines.slice(k, k + 200).join(",") + "]"]);
  }
  if (i >= 0) await c.query(ddl.slice(i));
  await c.query("COMMIT");
  for (const t of Object.keys(man.tables)) { const n = (await c.query(`select count(*)::int n from ${q(t)}`)).rows[0].n; console.log(`${t} ${n}/${man.tables[t].rows}${n === man.tables[t].rows ? "" : " MISMATCH"}`); }
  console.log(`loaded ${path.basename(dir)} into ${hostLabel(url)}`);
} catch (e) { try { await c.query("ROLLBACK"); } catch {} console.error("LOAD FAILED (rolled back):", e.message); process.exitCode = 1; }
finally { c.release(); await pool.end(); }
