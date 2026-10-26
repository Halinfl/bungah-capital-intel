#!/usr/bin/env node
// Weekly setup check for bungah.io (READ ONLY). Exit 1 on any FAIL; WARNs are printed but exit 0.
// Checks: Vercel env vars per environment; Development DATABASE_URL not dead/prod; domain (RDAP) + SSL expiry;
// Neon production endpoint reachable (+ branch list if a Neon API key file exists); local env files; backup freshness.
// Usage: node /workspace/bungah-ops/setup-check.mjs        Never prints secret values.
import { execFileSync } from "node:child_process"; import fs from "node:fs"; import tls from "node:tls";
import { readOnly, hostLabel, loadUrl, DEAD_HOST } from "./lib/db.mjs";
const PROJECT = "prj_xnAQdPOrBUYUAY4mPCyiqKORiB5E", TEAM = "team_dhpF2cMUjiWlWhJpSWuyMdYM", DOMAINS = ["bungah.io", "www.bungah.io"];
const NEON_KEY_FILE = "/home/box/.secrets/neon-api.key", NEON_PROJECT = "fragrant-cell-74825853";
const PROD_EP = hostLabel(loadUrl()).replace("-pooler", "");
const res = []; const add = (lvl, msg) => res.push([lvl, msg]);
const vapi = (p) => JSON.parse(execFileSync("vercel", ["api", p, "--raw", "--scope", "bungah"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 60000 }));
const hostOf = (u) => { try { return new URL(u).hostname.split(".")[0]; } catch { return ""; } };

// 1. Vercel env matrix
const REQUIRED = {
  production: ["DATABASE_URL", "CLERK_SECRET_KEY", "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "AI_GATEWAY_API_KEY", "BUNGAH_CHAT_MODEL", "NEXT_PUBLIC_CLERK_SIGN_IN_URL", "NEXT_PUBLIC_CLERK_SIGN_UP_URL"],
  preview: ["DATABASE_URL", "CLERK_SECRET_KEY", "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "BUNGAH_CHAT_MODEL"],
  development: ["DATABASE_URL", "CLERK_SECRET_KEY", "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "AI_GATEWAY_API_KEY"],
};
try {
  const envs = vapi(`/v9/projects/${PROJECT}/env?teamId=${TEAM}`).envs;
  for (const [t, keys] of Object.entries(REQUIRED)) {
    const have = new Set(envs.filter((e) => e.target.includes(t)).map((e) => e.key));
    const miss = keys.filter((k) => !have.has(k));
    add(miss.length ? "FAIL" : "ok", `vercel env ${t}: ${miss.length ? "missing " + miss.join(",") : keys.length + " required present"}`);
  }
  const dev = envs.find((e) => e.key === "DATABASE_URL" && e.target.includes("development"));
  if (dev && dev.type !== "sensitive") {
    const v = vapi(`/v1/projects/${PROJECT}/env/${dev.id}?teamId=${TEAM}`).value || ""; const h = hostOf(v);
    if (h.includes(DEAD_HOST)) add("WARN", "vercel env development DATABASE_URL -> dead ep-fragrant-paper DB (needs a Neon dev branch)");
    else if (h.replace("-pooler", "") === PROD_EP) add("FAIL", "vercel env development DATABASE_URL points at PRODUCTION");
    else add("ok", `vercel env development DATABASE_URL -> ${h}`);
  }
  for (const t of ["production", "preview"]) { const e = envs.find((x) => x.key === "DATABASE_URL" && x.target.includes(t)); add(e?.type === "sensitive" ? "ok" : "WARN", `vercel env ${t} DATABASE_URL type=${e?.type}`); }
} catch (e) { add("FAIL", "vercel env check failed: " + e.message.split("\n")[0]); }

// 2. Domain + SSL
try {
  const r = await (await fetch("https://rdap.identitydigital.services/rdap/domain/bungah.io", { signal: AbortSignal.timeout(20000) })).json();
  const exp = new Date(r.events.find((x) => x.eventAction === "expiration").eventDate); const days = Math.round((exp - Date.now()) / 864e5);
  add(days < 30 ? "FAIL" : days < 60 ? "WARN" : "ok", `domain bungah.io expires ${exp.toISOString().slice(0, 10)} (${days}d; registrar Namecheap; confirm auto-renew)`);
} catch (e) { add("WARN", "RDAP lookup failed: " + e.message); }
for (const d of DOMAINS) {
  try {
    const cert = await new Promise((ok, no) => { const s = tls.connect({ host: d, port: 443, servername: d, timeout: 15000 }, () => { ok(s.getPeerCertificate()); s.end(); }); s.on("error", no); s.on("timeout", () => no(new Error("timeout"))); });
    const days = Math.round((new Date(cert.valid_to) - Date.now()) / 864e5);
    add(days < 14 ? "FAIL" : days < 21 ? "WARN" : "ok", `ssl ${d} valid to ${new Date(cert.valid_to).toISOString().slice(0, 10)} (${days}d, ${cert.issuer?.O}; Vercel auto-renews)`);
  } catch (e) { add("FAIL", `ssl ${d}: ${e.message}`); }
}

// 3. Neon
try { const r = await readOnly((c) => c.query("select current_database() db, current_setting('server_version') v")); add("ok", `neon production endpoint ${PROD_EP} reachable (db ${r.rows[0].db}, PG ${r.rows[0].v.split(" ")[0]})`); }
catch (e) { add("FAIL", "neon production endpoint unreachable: " + e.message); }
if (fs.existsSync(NEON_KEY_FILE)) {
  try {
    const key = fs.readFileSync(NEON_KEY_FILE, "utf8").trim();
    const b = await (await fetch(`https://console.neon.tech/api/v2/projects/${NEON_PROJECT}/branches`, { headers: { authorization: `Bearer ${key}` } })).json();
    const names = (b.branches || []).map((x) => x.name);
    for (const n of ["production", "dev"]) add(names.includes(n) ? "ok" : "FAIL", `neon branch ${n} ${names.includes(n) ? "exists" : "MISSING"}`);
  } catch (e) { add("WARN", "neon API branch check failed: " + e.message); }
} else add("WARN", `no Neon API key (${NEON_KEY_FILE}); branch existence not checked, and no dev branch yet`);

// 4. Local env files still on the dead DB
for (const f of ["/workspace/bungah-capital-intel/.env", "/workspace/bungah-capital-intel/.env.production.local", "/workspace/bungah-capital-intel/.env.local"]) {
  if (!fs.existsSync(f)) continue; const s = fs.readFileSync(f, "utf8");
  if (s.includes(DEAD_HOST)) add("WARN", `${f} DATABASE_URL -> dead ep-fragrant-paper DB`);
  else if (s.includes(PROD_EP)) add("WARN", `${f} points at PRODUCTION DB`);
}
// 5. Backups fresh
const age = (p) => { try { return (Date.now() - fs.statSync(p).mtimeMs) / 36e5; } catch { return Infinity; } };
const dbAge = age("/workspace/backups/bungah-db/latest/manifest.json");
add(dbAge > 26 ? "FAIL" : "ok", `latest DB dump ${dbAge === Infinity ? "missing" : dbAge.toFixed(1) + "h old"}`);
const rs = fs.existsSync("/workspace/backups/research") ? fs.readdirSync("/workspace/backups/research").filter((x) => x.endsWith(".tar.gz")).sort() : [];
const rAge = rs.length ? age("/workspace/backups/research/" + rs.at(-1)) : Infinity;
add(rAge > 8 * 24 ? "WARN" : "ok", `latest research tarball ${rs.at(-1) ?? "missing"} ${rAge === Infinity ? "" : (rAge / 24).toFixed(1) + "d old"}`);

for (const [l, m] of res) console.log(`${l.padEnd(4)} ${m}`);
const f = res.filter((x) => x[0] === "FAIL").length, w = res.filter((x) => x[0] === "WARN").length;
console.log(`setup-check ${new Date().toISOString()}: ${f} fail, ${w} warn`); process.exit(f ? 1 : 0);
