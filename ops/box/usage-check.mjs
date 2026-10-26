#!/usr/bin/env node
// Read-only usage / limits check across bungah.io's free-tier services. Exit 1 if any metric crosses its alert line.
// Usage: node /workspace/bungah-ops/usage-check.mjs      Never prints secret values.
// Coverage (where an API allows on the free tiers; everything else is "see dashboard" in ops/owners-and-limits.md):
//   Vercel (Hobby): plan, prod deployment state, deploys in last 24h. Usage metrics need Observability Plus (paid) -> dashboard.
//   Neon (Free): database size vs 1 GB; compute-hours + branches only with a Neon API key file.
//   Clerk: total users (Backend API, key from the app's .env.local). DataForSEO: prepaid balance.
//   Groq / AI Gateway: chat LLM spend-locked off (BUNGAH_USE_LLM unset, no GROQ_API_KEY) -> nothing to meter.
import { execFileSync } from "node:child_process"; import fs from "node:fs";
import { readOnly } from "./lib/db.mjs";
const TEAM = "team_dhpF2cMUjiWlWhJpSWuyMdYM", PROJECT = "prj_xnAQdPOrBUYUAY4mPCyiqKORiB5E", NEON_PROJECT = "fragrant-cell-74825853";
const out = []; let alerts = 0; const line = (lvl, m) => { out.push(`${lvl.padEnd(5)} ${m}`); if (lvl === "ALERT") alerts++; };
const vapi = (p) => JSON.parse(execFileSync("vercel", ["api", p, "--raw", "--scope", "bungah"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 60000 }));
const envFile = (f) => Object.fromEntries((fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "").split("\n").map((l) => l.match(/^([A-Z0-9_]+)=(.*)$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, "")]));

try {
  const t = vapi(`/v2/teams/${TEAM}`); line("info", `vercel team bungah plan=${t.billing?.plan} (Hobby: 100 GB fast data transfer, 1M edge requests, 4 CPU-h active CPU / month; non-commercial use)`);
  const d = vapi(`/v6/deployments?projectId=${PROJECT}&limit=50&teamId=${TEAM}`).deployments;
  const prod = d.find((x) => x.target === "production"); const day = d.filter((x) => x.created > Date.now() - 864e5).length;
  line(prod?.readyState === "READY" ? "ok" : "ALERT", `vercel latest prod ${prod?.uid} ${prod?.readyState}; deployments last 24h=${day} (Hobby cap 100/day)`);
  if (day > 80) line("ALERT", "vercel deployments near Hobby daily cap");
} catch (e) { line("warn", "vercel api failed: " + e.message.split("\n")[0]); }

try {
  const r = await readOnly((c) => c.query("select pg_database_size(current_database())::bigint b"));
  const mb = Number(r.rows[0].b) / 1048576; line(mb > 800 ? "ALERT" : "ok", `neon db size ${mb.toFixed(1)} MB of 1024 MB free-plan storage (1 GB/project since 2026-10-02)`);
} catch (e) { line("ALERT", "neon size query failed: " + e.message); }
const NK = "/home/box/.secrets/neon-api.key";
if (fs.existsSync(NK)) {
  try { const key = fs.readFileSync(NK, "utf8").trim();
    const p = (await (await fetch(`https://console.neon.tech/api/v2/projects/${NEON_PROJECT}`, { headers: { authorization: `Bearer ${key}` } })).json()).project;
    const h = (p.compute_time_seconds || 0) / 3600; line(h > 80 ? "ALERT" : "ok", `neon compute ${h.toFixed(1)} of 100 CU-h this month (project-level)`);
  } catch (e) { line("warn", "neon api failed: " + e.message); }
} else line("info", "neon compute-hours: no API key on box -> Neon console > Billing/Usage (alert line: 80 of 100 CU-h)");

const clerk = envFile("/workspace/bungah-capital-intel/.env.local").CLERK_SECRET_KEY;
if (clerk) { try { const r = await fetch("https://api.clerk.com/v1/users/count", { headers: { authorization: `Bearer ${clerk}` } }); const j = await r.json();
  line(r.ok ? (j.total_count > 40000 ? "ALERT" : "ok") : "warn", r.ok ? `clerk users total=${j.total_count} (Hobby: 50,000 monthly retained users per app)` : `clerk api ${r.status}`); } catch (e) { line("warn", "clerk api failed: " + e.message); } }
else line("info", "clerk: no key on box -> dashboard.clerk.com > Users");

const df = envFile("/home/box/.secrets/dataforseo.env");
if (df.DATAFORSEO_LOGIN) { try { const r = await fetch("https://api.dataforseo.com/v3/appendix/user_data", { headers: { authorization: "Basic " + Buffer.from(`${df.DATAFORSEO_LOGIN}:${df.DATAFORSEO_PASSWORD}`).toString("base64") } });
  const m = (await r.json()).tasks?.[0]?.result?.[0]?.money; line(m.balance < 10 ? "ALERT" : "ok", `dataforseo balance $${m.balance.toFixed(2)} (deposited $${m.total}); prepaid, no auto-charge`); } catch (e) { line("warn", "dataforseo api failed: " + e.message); } }
line("info", "groq: not configured in Vercel (no GROQ_API_KEY), chat LLM spend-locked off; AI_GATEWAY_API_KEY present but unused while BUNGAH_USE_LLM is unset");
console.log(out.join("\n")); console.log(`usage-check ${new Date().toISOString()}: ${alerts} alert(s)`); process.exit(alerts ? 1 : 0);
