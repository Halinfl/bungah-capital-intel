#!/usr/bin/env node
/**
 * Derived figures for the Sound Assets scorecard / evidence register, computed only from the primary-source
 * files written by scripts/ingest-primary.mjs (BLS, Federal Reserve Board H.6/H.15, U.S. Treasury).
 * Re-run after each ingest. No forecasts. Output: src/data/sound-assets/macro-derived.json
 */
import fs from "node:fs";
const dir = "src/data/sound-assets/primary";
const load = (f) => Object.fromEntries(fs.readFileSync(`${dir}/${f}`, "utf8").trim().split("\n").slice(1)
  .map((l) => l.split(",")).filter(([, v]) => v !== "").map(([d, v]) => [d, Number(v)]));
const cpi = load("bls_CUSR0000SA0.csv"), m2 = load("frb_h6_M2.M.csv"), ff = load("frb_h15_RIFSPFF_N.M.csv"),
  tb = load("frb_h15_RIFSGFSM03_N.M.csv"), tbd = load("frb_h15_RIFSGFSM03_N.B.csv"), t10 = load("ust_par_10y.csv");
const last = (o) => Object.keys(o).sort().at(-1);
const r1 = (x) => +x.toFixed(1), r2 = (x) => +x.toFixed(2);
const cl = last(cpi), ml = last(m2);
const pp = (from) => ({ from, cpi_from: cpi[from], to: cl, cpi_to: cpi[cl], purchasing_power_remaining: +(cpi[from] / cpi[cl]).toFixed(3), loss_pct: r1((1 - cpi[from] / cpi[cl]) * 100) });
const ks = Object.keys(cpi).sort();
const yoy = {};
// Year-over-year by calendar date, not by row offset: BLS published no October 2025 CPI (lapse in
// appropriations), so a row offset would silently compare against the wrong base month after the gap.
const yearAgo = (k) => `${Number(k.slice(0, 4)) - 1}${k.slice(4)}`;
ks.forEach((k) => { if (yearAgo(k) in cpi) yoy[k] = (cpi[k] / cpi[yearAgo(k)] - 1) * 100; });
const cpiGaps = []; for (let y = 1947; y <= Number(cl.slice(0, 4)); y++) for (let m = 1; m <= 12; m++) {
  const k = `${y}-${String(m).padStart(2, "0")}-01`; if (k <= cl && !(k in cpi)) cpiGaps.push(k.slice(0, 7)); }
const peak = Object.entries(yoy).filter(([k]) => k > "2021" && k < "2024").sort((a, b) => b[1] - a[1])[0];
const since2000 = Object.keys(yoy).filter((k) => k >= "2000-01-01" && k in ff);
const m2chg = (a, b) => ({ from: a, m2_from_bn: m2[a], to: b, m2_to_bn: m2[b], change_pct: r1((m2[b] / m2[a] - 1) * 100) });
// Real 3-month T-bill return: compound monthly-average yield /12 over [start, end] months, deflate by CPI start->end.
function realBill(start, end) {
  // Hold from the start of `start` to the start of `end`: interest for months in [start, end), CPI index start -> end.
  const months = Object.keys(tb).filter((k) => k >= start && k < end).sort();
  const nominal = months.reduce((g, k) => g * (1 + tb[k] / 1200), 1);
  const infl = cpi[end] / cpi[start];
  const real = nominal / infl, yrs = months.length / 12;
  return { start, end, months: months.length, nominal_pct: r1((nominal - 1) * 100), cpi_pct: r1((infl - 1) * 100),
    real_pct: r1((real - 1) * 100), real_annualized_pct: r2((real ** (1 / yrs) - 1) * 100) };
}
const tbdl = last(tbd), t10l = last(t10);
const out = {
  computed_at: new Date().toISOString(),
  inputs: "src/data/sound-assets/primary/*.csv (see manifest.json for source, vintage, license/terms)",
  cpi_missing_months: cpiGaps,
  usd_purchasing_power_since_1971_08: { ...pp("1971-08-01"), series: "BLS CUSR0000SA0", note: "CPI is a consumer basket, seasonally adjusted; it is not a measure of any single asset price." },
  usd_purchasing_power_since_1947_01: { ...pp("1947-01-01"), series: "BLS CUSR0000SA0" },
  m2_multiple_since_1959_01: { from: "1959-01-01", m2_from_bn: m2["1959-01-01"], to: ml, m2_to_bn: m2[ml], multiple: r1(m2[ml] / m2["1959-01-01"]), series: "FRB H.6 M2.M" },
  m2_2020_surge: { ...m2chg("2020-02-01", "2020-06-01"), series: "FRB H.6 M2.M" },
  m2_2022_2023_contraction: { ...m2chg("2022-03-01", "2023-10-01"), series: "FRB H.6 M2.M" },
  cpi_yoy_peak_2021_2023: { month: peak[0], cpi_yoy_pct: r1(peak[1]), fedfunds_pct_same_month: ff[peak[0]], series: ["BLS CUSR0000SA0", "FRB H.15 RIFSPFF_N.M"] },
  months_fedfunds_below_cpi_yoy_since_2000: { months_below: since2000.filter((k) => ff[k] < yoy[k]).length, months_total: since2000.length, through: since2000.at(-1), note: "Effective fed funds (H.15 monthly average) used as a cash/T-bill yield proxy; CPI year-over-year change computed from BLS CUSR0000SA0." },
  real_tbill_2000_2026: { ...realBill("2000-01-01", cl), series: ["FRB H.15 RIFSGFSM03_N.M", "BLS CUSR0000SA0"], note: "Monthly-average discount-basis yield compounded monthly; an approximation, not an investable total return." },
  real_tbill_2009_2022: { ...realBill("2009-01-01", "2022-01-01"), series: ["FRB H.15 RIFSGFSM03_N.M", "BLS CUSR0000SA0"] },
  real_tbill_2023_2026: { ...realBill("2023-01-01", cl), series: ["FRB H.15 RIFSGFSM03_N.M", "BLS CUSR0000SA0"] },
  latest_bill_vs_cpi: { tbill3m_monthly: { month: last(tb), pct: tb[last(tb)] }, tbill3m_daily: { date: tbdl, pct: tbd[tbdl] }, cpi_yoy: { month: cl, pct: r2(yoy[cl]) }, series: ["FRB H.15", "BLS CUSR0000SA0"] },
  ust10y_latest: { date: t10l, pct: t10[t10l], series: "U.S. Treasury daily par yield curve" },
};
fs.writeFileSync("src/data/sound-assets/macro-derived.json", JSON.stringify(out, null, 2) + "\n");
console.log(JSON.stringify(out, null, 1));
