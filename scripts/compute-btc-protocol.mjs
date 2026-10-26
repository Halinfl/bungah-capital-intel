#!/usr/bin/env node
/**
 * Bitcoin supply schedule, computed deterministically (no price data, no forecasts).
 *
 * Rules taken from Bitcoin Core source (cited in the output):
 *   - src/consensus/amount.h: COIN = 100,000,000 satoshis; MAX_MONEY = 21,000,000 * COIN (sanity bound)
 *   - src/validation.cpp GetBlockSubsidy: subsidy = (50 * COIN) >> (height / 210,000)
 *   - src/kernel/chainparams.cpp: nSubsidyHalvingInterval = 210000
 * Halving block timestamps and the chain tip height are read from the public mempool.space API
 * (UTC block header times) and written into the output with their source URLs.
 *
 * Usage: node scripts/compute-btc-protocol.mjs
 */
import fs from "node:fs";

const COIN = 100_000_000n;
const INTERVAL = 210_000n;
const subsidy = (h) => {
  const halvings = h / INTERVAL;
  return halvings >= 64n ? 0n : (50n * COIN) >> halvings;
};

// Asymptotic total: sum over eras of INTERVAL * subsidy (integer satoshis, like the node).
let total = 0n;
const eras = [];
for (let e = 0n; e < 64n; e++) {
  const s = subsidy(e * INTERVAL);
  if (s === 0n) break;
  total += s * INTERVAL;
  if (e < 6n) eras.push({ era: Number(e), start_height: Number(e * INTERVAL), subsidy_btc: Number(s) / 1e8 });
}

const api = "https://mempool.space/api";
async function getJson(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return r.headers.get("content-type")?.includes("json") ? r.json() : r.text();
}
async function blockAt(height) {
  const hash = String(await getJson(`${api}/block-height/${height}`)).trim();
  const b = await getJson(`${api}/block/${hash}`);
  return { height, hash, timestamp_utc: new Date(b.timestamp * 1000).toISOString(), source: `https://mempool.space/block/${hash}` };
}

const genesis = await blockAt(0);
const halvings = [];
for (const h of [210000, 420000, 630000, 840000]) halvings.push(await blockAt(h));
const tip = Number(await getJson(`${api}/blocks/tip/height`));

// Issued by schedule through the tip (upper bound; a few early blocks claimed less, genesis output is unspendable).
let issued = 0n;
for (let e = 0n; e * INTERVAL <= BigInt(tip); e++) {
  const start = e * INTERVAL;
  const end = BigInt(tip) < start + INTERVAL - 1n ? BigInt(tip) : start + INTERVAL - 1n;
  issued += subsidy(start) * (end - start + 1n);
}
const curSubsidy = subsidy(BigInt(tip));
// Approximate annual issuance at the 10-minute target spacing (52,560 blocks/yr). Approximate by construction.
const annual = curSubsidy * 52_560n;
const nextHalving = (BigInt(tip) / INTERVAL + 1n) * INTERVAL;

const out = {
  computed_at: new Date().toISOString(),
  method: "Deterministic computation from Bitcoin Core consensus rules; block timestamps from mempool.space public API.",
  rules: {
    coin_satoshis: 100000000,
    max_money_btc: 21000000,
    halving_interval_blocks: 210000,
    initial_subsidy_btc: 50,
    sources: [
      "https://github.com/bitcoin/bitcoin/blob/master/src/consensus/amount.h",
      "https://github.com/bitcoin/bitcoin/blob/master/src/validation.cpp",
      "https://github.com/bitcoin/bitcoin/blob/master/src/kernel/chainparams.cpp",
    ],
  },
  asymptotic_supply_btc: Number(total) / 1e8,
  asymptotic_supply_note: "Sum of integer-satoshi subsidies over all eras; slightly below the 21,000,000 MAX_MONEY bound because of right-shift rounding.",
  eras,
  genesis,
  halvings,
  tip: { height: tip, source: `${api}/blocks/tip/height` },
  scheduled_issued_btc_at_tip: Number(issued) / 1e8,
  scheduled_issued_note: "Upper bound: some early blocks claimed less than the full subsidy and the genesis output is unspendable.",
  current_subsidy_btc: Number(curSubsidy) / 1e8,
  approx_annual_issuance_btc: Number(annual) / 1e8,
  approx_annual_issuance_pct_of_issued: Number(((Number(annual) / Number(issued)) * 100).toFixed(2)),
  approx_annual_note: "Assumes the 10-minute target block spacing (144 blocks/day x 365). Actual spacing varies.",
  next_halving_height: Number(nextHalving),
};
fs.writeFileSync("src/data/sound-assets/btc-protocol.json", JSON.stringify(out, null, 2) + "\n");
console.log(JSON.stringify(out, null, 2));
