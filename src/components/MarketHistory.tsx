import Link from "next/link";
import { HISTORY_META, marketHistory, historySlugs } from "@/lib/market-history";
import { PAX_META, airportSeries, latestPax } from "@/lib/airport-passengers";

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const n = (x: number) => x.toLocaleString("en-US");
const pct = (v: number | null) => (v == null ? "—" : `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v * 100).toFixed(1)}%`);
const linkCls = "inline-flex min-h-11 items-center text-emerald-300 underline-offset-2 hover:underline";
const c = "py-2 pr-4";
const wide = "hidden sm:table-cell";
const pin = "sticky left-0 z-10 bg-[#2f333c]";

/**
 * /markets index: one row per market with history. Mobile shows Market, Passengers YoY, Hotel jobs YoY;
 * from 640px all columns, with the Market column pinned while the table scrolls.
 */
export function MarketsHistoryIndex({ names }: { names: Record<string, string> }) {
  const slugs = new Set([...historySlugs(), ...Object.keys(names).filter((s) => airportSeries(s))]);
  const items = [...slugs]
    .filter((s) => names[s])
    .sort((a, b) => names[a].localeCompare(names[b]))
    .map((slug) => {
      const h = marketHistory(slug);
      const ps = airportSeries(slug);
      const pax = ps ? latestPax(ps) : null;
      const last = h?.rows.at(-1);
      const prev = last ? h!.rows.find((r) => r.year === last.year - 1) : undefined;
      const jobsYoy = last && prev ? (last.employment - prev.employment) / prev.employment : null;
      return { slug, h, pax, last, jobsYoy };
    });
  if (!items.length) return null;
  return (
    <section className="space-y-3" aria-labelledby="hist-idx-h">
      <div>
        <h2 id="hist-idx-h" className="text-lg font-semibold text-white">History by market</h2>
        <p className="mt-1 max-w-3xl text-sm text-slate-300">
          Airport passengers: latest month vs the same month a year earlier ({PAX_META.publisher}, accessed{" "}
          {PAX_META.accessed}; {PAX_META.lag}) Hotel jobs: {HISTORY_META.metric.toLowerCase()}, latest year vs prior
          year ({HISTORY_META.publisher}). {HISTORY_META.note}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-slate-200 sm:min-w-[760px]">
          <thead className="text-left text-xs uppercase tracking-wider text-slate-300">
            <tr>
              <th className={`${c} ${pin}`}>Market</th>
              <th className={`${c} text-right`}>Passengers YoY</th>
              <th className={`${c} text-right`}>Hotel jobs YoY</th>
              <th className={`${c} ${wide} text-right`}>Latest month passengers</th>
              <th className={`${c} ${wide} text-right`}>Latest jobs</th>
              <th className={`${c} ${wide}`}>Years (jobs)</th>
              <th className={`py-2 ${wide}`}>Sources</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ slug, h, pax, last, jobsYoy }) => (
              <tr key={slug} className="border-t border-white/10">
                <td className={`${c} ${pin}`}>
                  <Link href={`/markets/${slug}#history`} className={linkCls}>{names[slug]}</Link>
                </td>
                <td className={`${c} text-right tabular-nums`}>
                  {pax ? <>{pct(pax.yoy)}<span className="block text-xs text-slate-300 sm:hidden">{MON[pax.month - 1]} {pax.year}</span></> : "—"}
                </td>
                <td className={`${c} text-right tabular-nums`}>
                  {last ? <>{pct(jobsYoy)}<span className="block text-xs text-slate-300 sm:hidden">{last.year}</span></> : "—"}
                </td>
                <td className={`${c} ${wide} text-right tabular-nums`}>{pax ? `${MON[pax.month - 1]} ${pax.year}: ${n(pax.value)}` : "—"}</td>
                <td className={`${c} ${wide} text-right tabular-nums`}>{last ? `${last.year}: ${n(last.employment)}` : "—"}</td>
                <td className={`${c} ${wide}`}>{h ? `${h.rows[0].year}–${last!.year}` : "—"}</td>
                <td className={`py-2 ${wide}`}>
                  {pax ? <a href={PAX_META.sourceUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>BTS&nbsp;↗</a> : null}
                  {pax && last ? " · " : null}
                  {last ? <a href={last.sourceUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>BLS QCEW {last.year}&nbsp;↗</a> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-300 sm:hidden">
        Sources: <a href={PAX_META.sourceUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>BTS&nbsp;↗</a> ·{" "}
        <a href="https://www.bls.gov/cew/" target="_blank" rel="noopener noreferrer" className={linkCls}>BLS QCEW&nbsp;↗</a>. Per-year source files are on each market&apos;s page.
      </p>
    </section>
  );
}
