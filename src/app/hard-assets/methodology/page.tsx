import type { Metadata } from "next";
import Link from "next/link";
import { HardAssetsTabs } from "@/components/sound-assets/HardAssetsTabs";
import { ThesisBand } from "@/components/sound-assets/ThesisBand";
import { DraftNote } from "@/components/sound-assets/DraftNote";
import { BTC, MACRO, MACRO_DERIVED, SCORECARD, SOURCES, fmtDate } from "@/lib/sound-assets";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Methodology · Sound Assets · Bungah Capital Intel",
  description: "How the soundness scorecard is scored, where every number comes from, data vintages and license notes.",
  alternates: { canonical: "/hard-assets/methodology" },
};

const p = "max-w-3xl text-[15px] leading-relaxed text-slate-200";
const h2 = "scroll-mt-24 text-xl font-semibold tracking-tight text-white";
const a = "underline decoration-white/30 underline-offset-2 hover:text-white hover:decoration-white";
const nf = (n: number, d = 0) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

export default function MethodologyPage() {
  const usedSources = Object.entries(SOURCES).sort((x, y) => x[1].publisher.localeCompare(y[1].publisher));
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <HardAssetsTabs active="methodology" />
        <ThesisBand />
      </div>
      <header className="space-y-3">
        <h1 className="t-h1">Methodology</h1>
        <p className="max-w-3xl t-lead">How the scorecard is scored, where every number comes from, and what we leave out.</p>
        <DraftNote />
      </header>

      <section className="space-y-3">
        <h2 id="scoring" className={h2}>Scoring</h2>
        <p className={p}>
          Each of the {SCORECARD.assets.length} assets is scored on each of the {SCORECARD.criteria.length} criteria on a{" "}
          {SCORECARD.scale.min}–{SCORECARD.scale.max} scale ({Object.entries(SCORECARD.scale.labels).reverse().map(([k, v]) => `${k} ${v.toLowerCase()}`).join(", ")}).{" "}
          {SCORECARD.scale.direction} A score is relative across the five assets on that one criterion; it is not a price
          view. Every cell names its rationale, links at least one public source, and carries the date it was scored.
          Re-scoring appends a new dated score and logs the change on the{" "}
          <Link href="/errata" className={a}>errata page</Link>.
        </p>
        <p className={p}>
          The criteria measure soundness as a store of value. They do not measure yield or investment return, so a
          hotel&rsquo;s cash yield is not scored here. We publish no composite total, because weighting the criteria is an
          editorial choice that has not been made.
        </p>
      </section>

      <section className="space-y-3">
        <h2 id="bitcoin-protocol" className={h2}>Bitcoin supply: computed, not fetched</h2>
        <p className={p}>
          The supply schedule is computed from Bitcoin Core&rsquo;s consensus rules: a {BTC.rules.initial_subsidy_btc} BTC
          initial block subsidy that halves every {nf(BTC.rules.halving_interval_blocks)} blocks, in integer satoshis (
          {nf(BTC.rules.coin_satoshis)} per BTC). Summed over all eras, issuance converges on{" "}
          {nf(BTC.asymptotic_supply_btc, 4)} BTC, just under the {nf(BTC.rules.max_money_btc)} BTC limit because of
          rounding. Rules:{" "}
          {BTC.rules.sources.map((u, i) => (
            <span key={u}>
              {i > 0 ? ", " : ""}
              <a href={u} target="_blank" rel="noopener noreferrer" className={a}>{u.split("/").pop()} ↗</a>
            </span>
          ))}
          .
        </p>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-wider text-slate-300">
                <th className="px-3 py-2 font-medium">Halving</th>
                <th className="px-3 py-2 font-medium">Block height</th>
                <th className="px-3 py-2 font-medium">Block time (UTC)</th>
                <th className="px-3 py-2 font-medium">Subsidy after</th>
              </tr>
            </thead>
            <tbody>
              {BTC.halvings.map((h, i) => (
                <tr key={h.height} className="border-b border-white/[0.08] last:border-0">
                  <td className="px-3 py-2 text-slate-200">{i + 1}</td>
                  <td className="px-3 py-2 tabular-nums text-slate-200">{nf(h.height)}</td>
                  <td className="px-3 py-2 text-slate-200">
                    <a href={h.source} target="_blank" rel="noopener noreferrer" className={a}>
                      {h.timestamp_utc.slice(0, 16).replace("T", " ")} ↗
                    </a>
                  </td>
                  <td className="px-3 py-2 tabular-nums text-slate-200">{BTC.eras[i + 1].subsidy_btc} BTC</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="max-w-3xl text-[13px] text-slate-300">
          At block {nf(BTC.tip.height)} (chain tip when computed, {fmtDate(BTC.computed_at)}), the schedule has issued at most{" "}
          {nf(BTC.scheduled_issued_btc_at_tip, 3)} BTC. The current subsidy is {BTC.current_subsidy_btc} BTC per block,
          about {nf(BTC.approx_annual_issuance_btc)} BTC a year ({BTC.approx_annual_issuance_pct_of_issued}% of issued
          supply) at the 10-minute target spacing, which actual block times only approximate. The next halving is at block{" "}
          {nf(BTC.next_halving_height)}. Block times are from the public{" "}
          <a href="https://mempool.space" target="_blank" rel="noopener noreferrer" className={a}>mempool.space ↗</a> API.
        </p>
      </section>

      <section className="space-y-3">
        <h2 id="macro" className={h2}>Macro series (primary federal sources)</h2>
        <p className={p}>
          {MACRO.series.length} series are stored as static files with source, vintage and license note, each downloaded
          directly from the agency that publishes it: the Bureau of Labor Statistics, the Federal Reserve Board (H.6 and H.15
          via its Data Download Program) and the U.S. Treasury. No agency endorses this site, its thesis or its conclusions.
        </p>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-wider text-slate-300">
                <th className="px-3 py-2 font-medium">Series</th>
                <th className="px-3 py-2 font-medium">Source</th>
                <th className="px-3 py-2 font-medium">Vintage</th>
                <th className="px-3 py-2 font-medium">Latest</th>
                <th className="px-3 py-2 font-medium">License</th>
              </tr>
            </thead>
            <tbody>
              {MACRO.series.map((s) => (
                <tr key={s.file} className="border-b border-white/[0.08] align-top last:border-0">
                  <td className="px-3 py-2 text-slate-100">
                    <a href={s.series_url} target="_blank" rel="noopener noreferrer" className={a}>{s.series_id} ↗</a>
                    <div className="text-xs text-slate-400">{s.units}, {s.frequency.toLowerCase()}</div>
                  </td>
                  <td className="px-3 py-2 text-[13px] text-slate-200">{s.source}</td>
                  <td className="px-3 py-2 text-[13px] text-slate-200">{s.vintage}</td>
                  <td className="whitespace-nowrap px-3 py-2 tabular-nums text-slate-200">
                    {s.latest_observation.value} <span className="text-xs text-slate-400">({s.latest_observation.date})</span>
                  </td>
                  <td className="px-3 py-2 text-[13px] text-slate-300">
                    <a href={s.terms_url} target="_blank" rel="noopener noreferrer" className={a}>
                      {s.terms_url.includes("newyorkfed") ? "Public, NY Fed reference-rate terms" : "Public domain, citation requested"} ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="max-w-3xl text-[13px] text-slate-300">
          Derived figures used on the scorecard: CPI {MACRO_DERIVED.usd_purchasing_power_since_1971_08.cpi_from} (Aug 1971) to{" "}
          {MACRO_DERIVED.usd_purchasing_power_since_1971_08.cpi_to} ({MACRO_DERIVED.usd_purchasing_power_since_1971_08.to.slice(0, 7)}) ={" "}
          {MACRO_DERIVED.usd_purchasing_power_since_1971_08.loss_pct}% loss of purchasing power; M2 $
          {nf(MACRO_DERIVED.m2_multiple_since_1959_01.m2_from_bn, 1)}B (Jan 1959) to ${nf(MACRO_DERIVED.m2_multiple_since_1959_01.m2_to_bn, 1)}B (
          {MACRO_DERIVED.m2_multiple_since_1959_01.to.slice(0, 7)}) = {MACRO_DERIVED.m2_multiple_since_1959_01.multiple}x; fed funds
          below CPI year-over-year inflation in {MACRO_DERIVED.months_fedfunds_below_cpi_yoy_since_2000.months_below} of{" "}
          {MACRO_DERIVED.months_fedfunds_below_cpi_yoy_since_2000.months_total} months since January 2000 (fed funds used as a
          proxy for T-bill yields). CPI is a consumer basket, not the price of any single asset. BLS published no CPI for
          October 2025, so year-over-year changes are taken against the same calendar month a year earlier, and that month
          is skipped.
        </p>
        <p className="max-w-3xl text-[12px] text-slate-400">
          The EFFR is subject to the Terms of Use posted at newyorkfed.org. The New York Fed is not responsible for
          publication of the EFFR by bungah.io, does not sanction or endorse any particular republication, and has no
          liability for your use.
        </p>
        <p className="max-w-3xl text-[13px] text-slate-300">
          Bitcoin and S&amp;P 500 price statistics (drawdowns, volatility) are computed from the Coinbase and S&amp;P Dow
          Jones Indices series as published on FRED. They are quoted with a link to the series and are not stored here.
        </p>
      </section>

      <section className="space-y-3">
        <h2 id="scope" className={h2}>What we use, and what we leave out</h2>
        <ul className="max-w-3xl list-disc space-y-1.5 pl-5 text-[15px] text-slate-200">
          <li>Data: BLS, the Federal Reserve Board, the U.S. Treasury, REIT filings on SEC EDGAR, and the public CBRE and PwC hotel outlooks. Nothing behind a login or sign-up.</li>
          <li>No price predictions, for Bitcoin or for hotels. Outlook figures from CBRE and PwC are quoted as theirs, with links.</li>
          <li>Bitcoin has under two decades of history; any statistic about it carries that caveat.</li>
          <li>Essays and judgments are the author&rsquo;s. Each is labeled as fact, judgment or speculation.</li>
          <li>At least one steel-man essay per quarter argues the strongest case against the thesis, published with equal billing alongside the latest essay.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 id="sources" className={h2}>Sources cited in this section</h2>
        <ul className="max-w-4xl space-y-1 text-[13px] text-slate-300">
          {usedSources.map(([id, s]) => (
            <li key={id}>
              <span className="text-slate-200">{s.publisher}</span>:{" "}
              <a href={s.url} target="_blank" rel="noopener noreferrer" className={a}>{s.title} ↗</a>{" "}
              <span className="text-slate-400">(accessed {fmtDate(s.accessed)})</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
