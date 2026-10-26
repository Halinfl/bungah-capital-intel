#!/usr/bin/env node
// Uptime check for bungah.io (no DB access; plain HTTPS). Exit 0 = up; 1 = any key route down.
// Usage: node /workspace/bungah-ops/uptime-check.mjs [baseUrl] [--require-health]
//   /api/health: 200 = ok; 503 = site up but DB degraded (reported as FAIL: DB down); 404 = route not deployed yet
//   (warning only, unless --require-health; flip that on once the reliability branch is in production).
const args = process.argv.slice(2);
const base = (args.find((a) => !a.startsWith("--")) || "https://bungah.io").replace(/\/$/, "");
const requireHealth = args.includes("--require-health");
const PAGES = [["/", "Bungah"], ["/markets", "Markets"], ["/reits", "REIT"], ["/deals", "deal"], ["/radars", "Radars"]];
let fail = 0; const parts = [];
async function get(p) { const t = Date.now(); const r = await fetch(base + p, { headers: { "user-agent": "bungah-uptime/1.0" }, signal: AbortSignal.timeout(25000) }); return { r, body: await r.text(), ms: Date.now() - t }; }
for (const [p, must] of PAGES) {
  try { const { r, body, ms } = await get(p); const ok = r.status === 200 && body.toLowerCase().includes(must.toLowerCase()) && !/data-testid="data-unavailable"/.test(body);
    const note = /data-testid="data-unavailable"/.test(body) ? " fallback-notice" : "";
    parts.push(`${p}=${r.status}/${ms}ms${note}`); if (!ok) fail++; }
  catch (e) { parts.push(`${p}=ERR(${e.name})`); fail++; }
}
try { const { r, body } = await get("/api/health");
  if (r.status === 404) { parts.push("health=not-deployed"); if (requireHealth) fail++; }
  else { let j = {}; try { j = JSON.parse(body); } catch {} parts.push(`health=${r.status}/db:${j.db ?? "?"}`); if (r.status !== 200 || j.db !== "ok") fail++; } }
catch (e) { parts.push(`health=ERR(${e.name})`); fail++; }
console.log(`${new Date().toISOString()} uptime ${base} ${fail ? "DOWN" : "UP"} ${parts.join(" ")}`);
process.exit(fail ? 1 : 0);
