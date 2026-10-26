#!/usr/bin/env node
// bungah.io nightly DB export (READ ONLY). Dumps every public table to JSONL.gz + manifest + schema.sql,
// under /workspace/backups/bungah-db/<UTC stamp>/, then prunes dumps older than KEEP_DAYS (default 30).
// Usage: node /workspace/bungah-ops/db-export.mjs            (exit 0 ok, nonzero on any failure)
import fs from "node:fs"; import path from "node:path"; import zlib from "node:zlib"; import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { readOnly, listTables, q, loadUrl, hostLabel } from "./lib/db.mjs";

const ROOT = process.env.BUNGAH_BACKUP_DIR || "/workspace/backups/bungah-db";
const KEEP_DAYS = Number(process.env.KEEP_DAYS || 30);
const SCHEMA_PRISMA = process.env.BUNGAH_SCHEMA_PRISMA || "/workspace/bungah-capital-intel/prisma/schema.prisma";
const PRISMA_BIN = "/workspace/restore/app/node_modules/.bin/prisma";

const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "Z"); // 20261026T153000Z
const dir = path.join(ROOT, stamp), tmp = dir + ".partial";
fs.mkdirSync(tmp, { recursive: true, mode: 0o700 });
const url = loadUrl();
const manifest = { stamp, createdAt: new Date().toISOString(), source: { endpoint: hostLabel(url), database: new URL(url).pathname.slice(1) }, format: "jsonl.gz (one row_to_json per line)", tables: {} };

await readOnly(async (c) => {
  const v = await c.query("select current_setting('server_version') v, current_setting('transaction_read_only') ro, now() snap");
  if (v.rows[0].ro !== "on") throw new Error("transaction not read-only; aborting");
  manifest.source.serverVersion = v.rows[0].v; manifest.snapshotAt = v.rows[0].snap;
  for (const t of await listTables(c)) {
    const cols = await c.query(`select column_name, data_type, udt_name, is_nullable from information_schema.columns where table_schema='public' and table_name=$1 order by ordinal_position`, [t]);
    const pk = await c.query(`select a.attname from pg_index i join pg_attribute a on a.attrelid=i.indrelid and a.attnum = any(i.indkey) where i.indrelid = ('public.' || $1)::regclass and i.indisprimary`, [q(t)]);
    const order = pk.rows.length ? pk.rows.map((r) => q(r.attname)).join(",") : "1";
    const r = await c.query(`select row_to_json(t)::text j from ${q(t)} t order by ${order}`);
    const body = r.rows.map((x) => x.j).join("\n") + (r.rows.length ? "\n" : "");
    const gz = zlib.gzipSync(body);
    fs.writeFileSync(path.join(tmp, `${t}.jsonl.gz`), gz, { mode: 0o600 });
    manifest.tables[t] = { rows: r.rows.length, sha256: crypto.createHash("sha256").update(body).digest("hex"), bytesGz: gz.length, columns: cols.rows };
  }
});

// Schema DDL generated offline from the repo's prisma schema (db push project; no migrations). No DB contact.
try {
  const ddl = execFileSync(PRISMA_BIN, ["migrate", "diff", "--from-empty", "--to-schema-datamodel", SCHEMA_PRISMA, "--script"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  fs.writeFileSync(path.join(tmp, "schema.sql"), ddl, { mode: 0o600 });
  fs.copyFileSync(SCHEMA_PRISMA, path.join(tmp, "schema.prisma"));
  manifest.schema = { from: SCHEMA_PRISMA, sha256: crypto.createHash("sha256").update(ddl).digest("hex") };
} catch (e) { throw new Error("schema generation failed: " + (e.stderr || e.message)); }

fs.writeFileSync(path.join(tmp, "manifest.json"), JSON.stringify(manifest, null, 2), { mode: 0o600 });
fs.renameSync(tmp, dir);
fs.rmSync(path.join(ROOT, "latest"), { force: true }); fs.symlinkSync(stamp, path.join(ROOT, "latest"));

// Retention: delete stamped dumps older than KEEP_DAYS (never the one just written).
const cutoff = Date.now() - KEEP_DAYS * 864e5; const pruned = [];
for (const d of fs.readdirSync(ROOT)) {
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z(\.partial)?$/.exec(d); if (!m || d === stamp) continue;
  const t = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
  if (t < cutoff || (m[7] && t < Date.now() - 864e5)) { fs.rmSync(path.join(ROOT, d), { recursive: true, force: true }); pruned.push(d); }
}
const total = Object.values(manifest.tables).reduce((a, x) => a + x.rows, 0);
console.log(`db-export OK ${dir} tables=${Object.keys(manifest.tables).length} rows=${total} ` + Object.entries(manifest.tables).map(([k, v]) => `${k}=${v.rows}`).join(" ") + (pruned.length ? ` pruned=${pruned.join(",")}` : ""));
