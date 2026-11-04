import Link from "next/link";
import { HISTORY_META, marketHistory, historySlugs } from "@/lib/market-history";
import { PAX_META, airportSeries, latestPax } from "@/lib/airport-passengers";

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const n = (x: number) => x.toLocaleString("en-US");
const usdM = (x: number) => `$${(x / 1e6).toLocaleString("en-US", { maximumFractionDigits: 1 })}M`;
const pct = (a: number, b: number) => {
  const v = ((a - b) / b) * 100;
  return `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v).toFixed(1)}%`;
};
const linkCls = "text-emerald-300 underline-offset-2 hover:underline";

/** Market page: annual accommodation employment and wages, one cited row per year. */
export function MarketHistory({ slug }: { slug: string }) {
  const h = marketHistory(slug);
  if (!h) return null;
  const rows = [...h.rows].reverse();
  return (
    <section className="space-y-3" aria-labelledby="history-h">
      <div>
        <h2 id="history-h" className="text-lg font-semibold text-white">Lodging history</h2>
        <p className="mt-1 max-w-3xl text-sm text-slate-300">
          {h.industry}, private sector, {h.area}. {HISTORY_META.note}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm text-slate-200">
          <thead className="text-left text-xs uppercase tracking-wider text-slate-300">
            <tr>
              <th className="py-2 pr-4">Year</th>
              <th className="py-2 pr-4 text-right">Jobs (annual avg)</th>
              <th className="py-2 pr-4 text-right">YoY</th>
              <th className="py-2 pr-4 text-right">Total wages</th>
              <th className="py-2 pr-4 text-right">Establishments</th>
              <th className="py-2">Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const prev = rows[i + 1];
              const yoy = prev && prev.year === r.year - 1 ? pct(r.employment, prev.employment) : "—";
              return (
                <tr key={r.year} className="border-t border-white/10">
                  <td className="py-2 pr-4">{r.year}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">{n(r.employment)}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">{yoy}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">{usdM(r.wagesUsd)}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">{n(r.establishments)}</td>
                  <td className="py-2">
                    <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-11 items-center ${linkCls}`}>
                      BLS QCEW {r.year}&nbsp;↗
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-300">
        Source: {HISTORY_META.publisher}, annual averages, accessed {HISTORY_META.accessed}. Years BLS withholds for
        confidentiality are left out.
      </p>
    </section>
  );
}

/** /markets index: latest year and change since the earliest year shown, linked to each market. */
export function MarketsHistoryIndex({ names }: { names: Record<string, string> }) {
  const items = historySlugs()
    .map((slug) => ({ slug, h: marketHistory(slug)! }))
    .filter((x) => names[x.slug])
    .sort((a, b) => names[a.slug].localeCompare(names[b.slug]));
  if (!items.length) return null;
  return (
    <section className="space-y-3" aria-labelledby="hist-idx-h">
      <div>
        <h2 id="hist-idx-h" className="text-lg font-semibold text-white">Lodging history by market</h2>
        <p className="mt-1 max-w-3xl text-sm text-slate-300">
          {HISTORY_META.metric}. {HISTORY_META.note} Source: {HISTORY_META.publisher}. Airport passengers: {PAX_META.publisher}, accessed {PAX_META.accessed}; {PAX_META.lag}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm text-slate-200">
          <thead className="text-left text-xs uppercase tracking-wider text-slate-300">
            <tr>
              <th className="py-2 pr-4">Market</th>
              <th className="py-2 pr-4">Years</th>
              <th className="py-2 pr-4 text-right">Latest jobs</th>
              <th className="py-2 pr-4 text-right">Change since first year</th>
              <th className="py-2 pr-4 text-right">Airport passengers, latest month (YoY)</th>
              <th className="py-2">Source</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ slug, h }) => {
              const first = h.rows[0];
              const last = h.rows[h.rows.length - 1];
              const ps = airportSeries(slug);
              const pax = ps ? latestPax(ps) : null;
              return (
                <tr key={slug} className="border-t border-white/10">
                  <td className="py-2 pr-4">
                    <Link href={`/markets/${slug}`} className={`inline-flex min-h-11 items-center ${linkCls}`}>{names[slug]}</Link>
                  </td>
                  <td className="py-2 pr-4">{first.year}–{last.year}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">{n(last.employment)}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">{pct(last.employment, first.employment)}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">{pax ? `${MON[pax.month - 1]} ${pax.year}: ${n(pax.value)} (${pax.yoy == null ? "—" : `${pax.yoy > 0 ? "+" : pax.yoy < 0 ? "−" : ""}${Math.abs(pax.yoy * 100).toFixed(1)}%`})` : "—"}</td>
                  <td className="py-2">
                    <a href={last.sourceUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-11 items-center ${linkCls}`}>BLS QCEW {last.year}&nbsp;↗</a>
                    {pax ? <> · <a href={PAX_META.sourceUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-11 items-center ${linkCls}`}>BTS&nbsp;↗</a></> : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
