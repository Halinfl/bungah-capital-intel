import { hotelPerf, HOTEL_PERF_META } from "@/lib/hotel-performance";

const usd = (x: number, d = 2) => `$${x.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })}`;
const adrFmt = (x: number) => (Number.isInteger(x) ? usd(x, 0) : usd(x));
const linkCls = "inline-flex min-h-11 items-center text-emerald-300 underline-offset-2 hover:underline";

/** Market page: hotel occupancy, ADR and RevPAR rows, each with its own period and source link. */
export function HotelPerformanceBlock({ slug }: { slug: string }) {
  const m = hotelPerf(slug);
  if (!m) return null;
  return (
    <section id="hotel-performance" aria-labelledby="hp-h" className="scroll-mt-36 space-y-3">
      <div>
        <h2 id="hp-h" className="text-lg font-semibold text-white">Hotel performance</h2>
        <p className="mt-1 text-sm text-slate-300">{m.area}. Published figures, accessed {HOTEL_PERF_META.accessed}.</p>
      </div>
      <div className="grid gap-3">
        {m.rows.map((r) => (
          <div key={r.period} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-slate-300">{r.period}</p>
            <dl className="mt-2 grid grid-cols-3 gap-3 tabular-nums">
              <div><dt className="text-xs text-slate-300">Occupancy</dt><dd className="text-xl font-semibold text-white">{r.occ.toFixed(1)}%</dd></div>
              <div><dt className="text-xs text-slate-300">ADR</dt><dd className="text-xl font-semibold text-white">{adrFmt(r.adr)}</dd></div>
              <div>
                <dt className="text-xs text-slate-300">RevPAR</dt>
                <dd className="text-xl font-semibold text-white">{r.revpar == null ? "—" : adrFmt(r.revpar)}</dd>
                {r.revpar != null && r.revparCalc ? <dd className="text-xs text-slate-300">our calculation (OCC × ADR)</dd> : null}
              </div>
            </dl>
            {r.note ? <p className="mt-2 text-xs text-slate-300">{r.note}.</p> : null}
            <a href={r.url} target="_blank" rel="noopener noreferrer" className={`${linkCls} text-sm`}>
              {r.source}&nbsp;↗
            </a>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-300">{HOTEL_PERF_META.note}</p>
    </section>
  );
}
