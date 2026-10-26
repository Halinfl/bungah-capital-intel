// Shared read-only Neon access for box ops scripts (outbound 443 only -> Neon serverless driver over WebSocket).
// Never prints the connection string. Refuses the dead ep-fragrant-paper host.
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import fs from "node:fs";
neonConfig.webSocketConstructor = ws;

export const DEAD_HOST = "ep-fragrant-paper-b5rsdrke";
export const PROD_URL_FILE = "/home/box/.secrets/neon-new.url";

export function loadUrl() {
  const file = process.env.BUNGAH_DB_URL_FILE || PROD_URL_FILE;
  const u = (process.env.BUNGAH_DB_URL || fs.readFileSync(file, "utf8")).replace(/[\r\n]/g, "");
  if (!u) throw new Error("no DB url");
  if (u.includes(DEAD_HOST)) throw new Error("refusing: dead ep-fragrant-paper host");
  return u;
}
/** Host label safe to print: endpoint id only, no credentials. */
export function hostLabel(u) {
  try { const h = new URL(u).hostname; return h.split(".")[0]; } catch { return "?"; }
}
/** Run fn(client) inside a READ ONLY, REPEATABLE READ transaction (consistent snapshot, no writes possible). */
export async function readOnly(fn, url = loadUrl()) {
  const pool = new Pool({ connectionString: url, max: 1 });
  const c = await pool.connect();
  try {
    await c.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
    const out = await fn(c);
    await c.query("COMMIT");
    return out;
  } catch (e) { try { await c.query("ROLLBACK"); } catch {} throw e; }
  finally { c.release(); await pool.end(); }
}
export async function listTables(c) {
  const r = await c.query(`select table_name from information_schema.tables where table_schema='public' and table_type='BASE TABLE' and table_name <> '_prisma_migrations' order by 1`);
  return r.rows.map((x) => x.table_name);
}
export const q = (t) => '"' + t.replace(/"/g, '""') + '"';
