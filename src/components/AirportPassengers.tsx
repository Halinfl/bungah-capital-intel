import { PAX_META, airportSeries, annualPax } from "@/lib/airport-passengers";

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const n = (x: number) => x.toLocaleString("en-US");
const pct = (v: number | null) => (v == null ? "—" : `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v * 100).toFixed(1)}%`);
const linkCls = "text-emerald-300 underline-offset-2 hover:underline";

/** Market page: monthly airport passengers (last 13 months) and calendar-year totals, with YoY. */
export function AirportPassengers({ slug }: { slug: string }) {
  const s = airportSeries(slug);
  if (!s) return null;
  const idx = new Map(s.months.map(([y, m, v]) => [`${y}-${m}`, v]));
  const recent = s.months.slice(-13).reverse();
  const years = annualPax(s).reverse();
  const last = s.months[s.months.length - 1];
  const airports = s.airports.map((a) => `${a.name} (${a.code})`).join(" + ");
  const cell = "py-2 pr-4";
  return (
    <section className="space-y-3" aria-labelledby="pax-h">
      <div>
        <h2 id="pax-h" className="text-lg font-semibold text-white">Airport passengers</h2>
        <p className="mt-1 max-w-3xl text-sm text-slate-300">
          Passengers boarding flights (enplanements), all carriers, at {airports}.{s.note ? ` ${s.note}` : ""}
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[300px] text-sm text-slate-200">
            <caption className="pb-1 text-left text-xs uppercase tracking-wider text-slate-300">Monthly</caption>
            <thead className="text-left text-xs uppercase tracking-wider text-slate-300">
              <tr><th className={cell}>Month</th><th className={`${cell} text-right`}>Passengers</th><th className={`${cell} text-right`}>YoY</th></tr>
            </thead>
            <tbody>
              {recent.map(([y, m, v]) => {
                const p = idx.get(`${y - 1}-${m}`);
                return (
                  <tr key={`${y}-${m}`} className="border-t border-white/10">
                    <td className={cell}>{MON[m - 1]} {y}</td>
                    <td className={`${cell} text-right tabular-nums`}>{n(v)}</td>
                    <td className={`${cell} text-right tabular-nums`}>{pct(p ? (v - p) / p : null)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[300px] text-sm text-slate-200">
            <caption className="pb-1 text-left text-xs uppercase tracking-wider text-slate-300">Calendar year</caption>
            <thead className="text-left text-xs uppercase tracking-wider text-slate-300">
              <tr><th className={cell}>Year</th><th className={`${cell} text-right`}>Passengers</th><th className={`${cell} text-right`}>YoY</th></tr>
            </thead>
            <tbody>
              {years.map((r, i) => {
                const p = years[i + 1];
                return (
                  <tr key={r.year} className="border-t border-white/10">
                    <td className={cell}>{r.year}</td>
                    <td className={`${cell} text-right tabular-nums`}>{n(r.value)}</td>
                    <td className={`${cell} text-right tabular-nums`}>{pct(p && p.year === r.year - 1 ? (r.value - p.value) / p.value : null)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-slate-300">
        Source:{" "}
        <a href={PAX_META.sourceUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-11 items-center ${linkCls}`}>
          {PAX_META.publisher}&nbsp;↗
        </a>
        , airports {s.airports.map((a) => a.code).join(", ")}, Jan 2015–{MON[last[1] - 1]} {last[0]}, accessed {PAX_META.accessed}. {PAX_META.lag}
      </p>
    </section>
  );
}
