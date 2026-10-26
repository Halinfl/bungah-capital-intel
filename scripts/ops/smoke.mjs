#!/usr/bin/env node
// Smoke test for bungah.io (local build, preview, or production). Exit 0 = all key routes OK; 1 = any failure.
// Usage: node scripts/ops/smoke.mjs <baseUrl> [--allow-degraded]
//   --allow-degraded: /api/health may return 503 (DB down) as long as pages still render (DB-outage drill).
// Env: SMOKE_HEADERS='{"x-vercel-protection-bypass":"..."}' for protected previews (never printed).
const args = process.argv.slice(2);
const base = (args.find((a) => !a.startsWith("--")) || process.env.SMOKE_BASE_URL || "https://bungah.io").replace(/\/$/, "");
const allowDegraded = args.includes("--allow-degraded");
const extra = process.env.SMOKE_HEADERS ? JSON.parse(process.env.SMOKE_HEADERS) : {};
const H = { "user-agent": "bungah-smoke/1.0", ...extra };
// [path, expected status(es), text that must appear]
const CHECKS = [
  ["/", [200], "Bungah"],
  ["/markets", [200], "Markets"],
  ["/markets/orlando", [200], "Orlando"],
  ["/reits", [200], "REIT"],
  ["/deals", [200], "deal"],
  ["/radars", [200], "Radars"],
  ["/sound-money-lodging", [200], "Sound Asset Lodging"],
  ["/tuesday-trends", [200], ""],
  ["/chat", [200], ""],
  ["/sitemap.xml", [200], "<urlset"],
  ["/robots.txt", [200], ""],
  ["/this-page-does-not-exist-smoke", [404], "Page not found"],
  ["/api/health", allowDegraded ? [200, 503] : [200], '"status"'],
];
const BAD = [/Application error: a server-side exception/i, /Internal Server Error/i, /This page hit a snag/];
let failed = 0; const out = [];
for (const [p, ok, must] of CHECKS) {
  const t0 = Date.now(); let line;
  try {
    const r = await fetch(base + p, { headers: H, redirect: "manual", signal: AbortSignal.timeout(30000) });
    const body = await r.text(); const ms = Date.now() - t0;
    const errs = [];
    if (r.status >= 300 && r.status < 400) errs.push(`redirect to ${(r.headers.get("location") || "").slice(0, 60)} (Vercel Deployment Protection? use scripts/ops/smoke-protected.sh)`);
    if (!ok.includes(r.status)) errs.push(`status ${r.status} (want ${ok.join("/")})`);
    if (must && !body.toLowerCase().includes(must.toLowerCase())) errs.push(`missing "${must}"`);
    if (p !== "/api/health" && BAD.some((re) => re.test(body))) errs.push("error page content");
    let note = "";
    if (p === "/api/health") { try { const j = JSON.parse(body); note = ` db=${j.db} status=${j.status}`; if (!allowDegraded && j.db !== "ok") errs.push("db not ok"); } catch { errs.push("health not JSON"); } }
    if (/data-testid="data-unavailable"/.test(body)) note += " [fallback notice shown]";
    line = `${errs.length ? "FAIL" : "ok  "} ${r.status} ${String(ms).padStart(5)}ms ${p}${note}${errs.length ? "  <- " + errs.join("; ") : ""}`;
    if (errs.length) failed++;
  } catch (e) { failed++; line = `FAIL ---       ${p}  <- ${e.message}`; }
  out.push(line); console.log(line);
}
console.log(`smoke ${base}: ${CHECKS.length - failed}/${CHECKS.length} ok${allowDegraded ? " (degraded allowed)" : ""}`);
process.exit(failed ? 1 : 0);
