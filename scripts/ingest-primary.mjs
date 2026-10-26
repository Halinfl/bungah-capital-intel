#!/usr/bin/env node
/**
 * Primary-source macro ingest for the Sound Assets section (static files only; no DB writes, no keys,
 * no paid APIs). Replaces the earlier FRED ingest: every series comes straight from the publishing agency.
 *
 *   CPI-U (CUSR0000SA0 seasonally adjusted, CUUR0000SA0 not seasonally adjusted)
 *       BLS flat file https://download.bls.gov/pub/time.series/cu/cu.data.1.AllItems
 *   M2 (M2.M, seasonally adjusted, $bn)          Federal Reserve Board H.6 via the Data Download Program
 *   Effective fed funds (RIFSPFF_N.M), 3-month T-bill secondary market (RIFSGFSM03_N.M monthly,
 *       RIFSGFSM03_N.B daily from 2020)          Federal Reserve Board H.15 via the Data Download Program
 *   10-year par yield (daily, from 1990)          U.S. Treasury daily par yield curve CSVs, home.treasury.gov
 *
 * Output: src/data/sound-assets/primary/<file>.csv and manifest.json (source, vintage, license/terms per series).
 * Sequential requests with a pause: low-volume, non-disruptive use. Requires the `unzip` binary for DDP packages.
 * Usage: node scripts/ingest-primary.mjs
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const OUT = path.join(process.cwd(), "src/data/sound-assets/primary");
const UA = "bungah.io data ingest (contact via bungah.io)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const now = new Date().toISOString();
const today = now.slice(0, 10);

const TERMS = {
  bls: {
    terms_url: "https://www.bls.gov/opub/copyright-information.htm",
    license_note:
      "Public domain (U.S. Bureau of Labor Statistics: 'everything that we publish ... is in the public domain'); BLS asks that it be cited as the source.",
  },
  frb: {
    terms_url: "https://www.federalreserve.gov/disclaimer.htm",
    license_note:
      "Public domain unless otherwise indicated ('may be copied and distributed without permission'); cite the Board of Governors of the Federal Reserve System as the source.",
  },
  effr: {
    terms_url: "https://www.newyorkfed.org/privacy/termsofuse",
    license_note:
      "Published by the Board in H.15; since March 2016 the effective federal funds rate is calculated and administered by the Federal Reserve Bank of New York. Reference-rate terms require this notice with any presentation: 'The EFFR is subject to the Terms of Use posted at newyorkfed.org. The New York Fed is not responsible for publication of the EFFR by bungah.io, does not sanction or endorse any particular republication, and has no liability for your use.'",
  },
  ust: {
    terms_url: "https://home.treasury.gov/policy-issues/financing-the-government/interest-rate-statistics",
    license_note:
      "U.S. government work, not subject to copyright in the U.S. (17 U.S.C. § 105). Cite U.S. Department of the Treasury; do not imply Treasury endorsement (31 U.S.C. § 333).",
  },
};

async function get(url, binary = false) {
  for (let a = 1; a <= 3; a++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(120_000), headers: { "User-Agent": UA } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return binary ? Buffer.from(await res.arrayBuffer()) : await res.text();
    } catch (e) {
      if (a === 3) throw new Error(`${url}: ${e.message}`);
      await sleep(3000 * a);
    }
  }
}

const toCsv = (header, rows) => `${header}\n${rows.map((r) => r.join(",")).join("\n")}\n`;
const manifest = { retrieved_at: now, note: "Primary federal sources only. No FRED data is stored.", series: [] };
function write(file, header, rows, meta) {
  fs.writeFileSync(path.join(OUT, file), toCsv(header, rows));
  const last = rows.at(-1);
  manifest.series.push({ file, ...meta, first_observation: rows[0][0], latest_observation: { date: last[0], value: Number(last[1]) },
    observations: rows.length, vintage: `Retrieved ${today}; latest observation ${last[0]}` });
  console.log(`${file}: ${rows.length} rows, ${rows[0][0]} .. ${last[0]} = ${last[1]}`);
}

// --- BLS CPI-U
async function bls() {
  const url = "https://download.bls.gov/pub/time.series/cu/cu.data.1.AllItems";
  const txt = await get(url);
  for (const [id, adj] of [["CUSR0000SA0", "seasonally adjusted"], ["CUUR0000SA0", "not seasonally adjusted"]]) {
    const rows = txt.split("\n").map((l) => l.split("\t").map((s) => s.trim()))
      .filter((c) => c[0] === id && /^M(0[1-9]|1[0-2])$/.test(c[2]) && c[3] && c[3] !== "-")
      .map((c) => [`${c[1]}-${c[2].slice(1)}-01`, c[3]]).sort((a, b) => a[0].localeCompare(b[0]));
    write(`bls_${id}.csv`, `date,${id}`, rows, {
      series_id: id, name: `CPI for All Urban Consumers (CPI-U), U.S. city average, all items, ${adj}`,
      units: "Index 1982-84=100", frequency: "Monthly", source: "U.S. Bureau of Labor Statistics",
      series_url: `https://data.bls.gov/timeseries/${id}`, download_url: url, ...TERMS.bls });
  }
}

// --- Federal Reserve DDP packages
function ddpSeries(xml, name) {
  const i = xml.indexOf(`SERIES_NAME="${name}"`);
  if (i < 0) throw new Error(`series ${name} not found`);
  const body = xml.slice(i, xml.indexOf("</kf:Series>", i));
  return [...body.matchAll(/<frb:Obs OBS_STATUS="A" OBS_VALUE="([-0-9.]+)" TIME_PERIOD="(\d{4}-\d{2}-\d{2})"/g)].map((m) => [m[2], m[1]]);
}
async function ddp(rel) {
  const url = `https://www.federalreserve.gov/datadownload/Output.aspx?rel=${rel}&filetype=zip`;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `ddp-${rel}-`));
  fs.writeFileSync(path.join(tmp, "p.zip"), await get(url, true));
  execFileSync("unzip", ["-oq", "p.zip", `${rel}_data.xml`], { cwd: tmp });
  const xml = fs.readFileSync(path.join(tmp, `${rel}_data.xml`), "utf8");
  fs.rmSync(tmp, { recursive: true, force: true });
  return { xml, url };
}
const monthStart = (rows) => rows.map(([d, v]) => [`${d.slice(0, 7)}-01`, v]);

async function fed() {
  const h6 = await ddp("H6");
  write("frb_h6_M2.M.csv", "date,M2_SA_bn", monthStart(ddpSeries(h6.xml, "M2.M")), {
    series_id: "H6/M2.M", name: "M2, seasonally adjusted (H.6 Money Stock Measures)", units: "Billions of dollars",
    frequency: "Monthly (dated to month start)", source: "Board of Governors of the Federal Reserve System, H.6 release",
    series_url: "https://www.federalreserve.gov/releases/h6/", download_url: h6.url, ...TERMS.frb });
  await sleep(2000);
  const h15 = await ddp("H15");
  write("frb_h15_RIFSPFF_N.M.csv", "date,EFFR_pct", monthStart(ddpSeries(h15.xml, "RIFSPFF_N.M")), {
    series_id: "H15/RIFSPFF_N.M", name: "Federal funds effective rate, monthly average (H.15)", units: "Percent per year",
    frequency: "Monthly (dated to month start)", source: "Board of Governors of the Federal Reserve System, H.15 release (EFFR administered by the Federal Reserve Bank of New York)",
    series_url: "https://www.federalreserve.gov/releases/h15/", download_url: h15.url, ...TERMS.effr });
  write("frb_h15_RIFSGFSM03_N.M.csv", "date,TBILL3M_pct", monthStart(ddpSeries(h15.xml, "RIFSGFSM03_N.M")), {
    series_id: "H15/RIFSGFSM03_N.M", name: "3-month Treasury bill, secondary market, discount basis, monthly average (H.15)", units: "Percent per year",
    frequency: "Monthly (dated to month start)", source: "Board of Governors of the Federal Reserve System, H.15 release",
    series_url: "https://www.federalreserve.gov/releases/h15/", download_url: h15.url, ...TERMS.frb });
  write("frb_h15_RIFSGFSM03_N.B.csv", "date,TBILL3M_pct", ddpSeries(h15.xml, "RIFSGFSM03_N.B").filter(([d]) => d >= "2020-01-01"), {
    series_id: "H15/RIFSGFSM03_N.B", name: "3-month Treasury bill, secondary market, discount basis, daily (H.15), from 2020", units: "Percent per year",
    frequency: "Business day", source: "Board of Governors of the Federal Reserve System, H.15 release",
    series_url: "https://www.federalreserve.gov/releases/h15/", download_url: h15.url, ...TERMS.frb });
}

// --- Treasury daily par yield curve, 10-year
async function treasury() {
  const rows = [];
  const endYear = Number(today.slice(0, 4));
  for (let y = 1990; y <= endYear; y++) {
    const url = `https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/${y}/all?type=daily_treasury_yield_curve&field_tdr_date_value=${y}&page&_format=csv`;
    const lines = (await get(url)).trim().split("\n");
    const head = lines[0].split(",").map((s) => s.replace(/"/g, "").trim());
    const k = head.indexOf("10 Yr");
    for (const l of lines.slice(1)) {
      const c = l.split(",");
      const [m, d, yy] = c[0].split("/");
      if (c[k]) rows.push([`${yy}-${m}-${d}`, c[k]]);
    }
    await sleep(400);
  }
  rows.sort((a, b) => a[0].localeCompare(b[0]));
  write("ust_par_10y.csv", "date,UST10Y_par_pct", rows, {
    series_id: "Treasury par yield curve, 10 Yr", name: "Daily Treasury par yield curve rate, 10-year", units: "Percent",
    frequency: "Business day", source: "U.S. Department of the Treasury",
    series_url: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve",
    download_url: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/<YEAR>/all?type=daily_treasury_yield_curve&field_tdr_date_value=<YEAR>&_format=csv", ...TERMS.ust });
}

fs.mkdirSync(OUT, { recursive: true });
await bls(); await sleep(1500); await fed(); await treasury();
manifest.terms = Object.fromEntries(Object.entries(TERMS).map(([k, v]) => [k, v]));
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
