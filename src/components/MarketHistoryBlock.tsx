import { HISTORY_META, marketHistory } from "@/lib/market-history";
import { PAX_META, airportSeries, annualPax, latestPax } from "@/lib/airport-passengers";

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const n = (x: number) => x.toLocaleString("en-US");
const compact = (x: number) =>
  x >= 1e6 ? `${(x / 1e6).toFixed(1)}M` : x >= 1e3 ? `${(x / 1e3).toFixed(1)}K` : String(x);
const usdM = (x: number) => `$${(x / 1e6).toLocaleString("en-US", { maximumFractionDigits: 1 })}M`;
const pct = (v: number | null) => (v == null ? "—" : `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v * 100).toFixed(1)}%`);
const ch = (a: number, b?: number) => (b ? (a - b) / b : null);
const linkCls = "inline-flex min-h-11 items-center text-emerald-300 underline-offset-2 hover:underline";
const cell = "py-2 pr-4";
const num = `${cell} text-right tabular-nums`;
const th = "text-left text-xs uppercase tracking-wider text-slate-300";
const summaryCls =
  "flex min-h-11 cursor-pointer list-none flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-lg px-1 py-2 hover:bg-white/[0.03] [&::-webkit-details-marker]:hidden";

function Chevron() {
  return <span aria-hidden className="text-slate-300 transition-transform group-open:rotate-90">›</span>;
}

function Table({ caption, head, rows }: { caption?: string; head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[300px] text-sm text-slate-200">
        {caption ? <caption className="pb-1 text-left text-xs uppercase tracking-wider text-slate-300">{caption}</caption> : null}
        <thead className={th}>
          <tr>{head.map((h, i) => <th key={h} className={i ? `${cell} text-right` : cell}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={String(r[0])} className="border-t border-white/10">
              {r.map((c, i) => <td key={i} className={i ? num : cell}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Airport({ slug }: { slug: string }) {
  const s = airportSeries(slug);
  if (!s) {
    return (
      <div id="history-airport" className="scroll-mt-36 rounded-lg border border-dashed border-white/15 px-3 py-3 text-sm text-slate-300">
        <span className="font-medium text-slate-200">Airport passengers.</span> No monthly airport data for this market yet (BTS).
      </div>
    );
  }
  const idx = new Map(s.months.map(([y, m, v]) => [`${y}-${m}`, v]));
  const L = latestPax(s);
  const recent = s.months.slice(-13).reverse().map(([y, m, v]) => [`${MON[m - 1]} ${y}`, n(v), pct(ch(v, idx.get(`${y - 1}-${m}`)))]);
  const yearsAsc = annualPax(s);
  const years = [...yearsAsc].reverse().map((r) => {
    const p = yearsAsc.find((x) => x.year === r.year - 1);
    return [r.year, n(r.value), pct(ch(r.value, p?.value))];
  });
  const airports = s.airports.map((a) => `${a.name} (${a.code})`).join(" + ");
  return (
    <details id="history-airport" className="group scroll-mt-36 border-t border-white/10 pt-1">
      <summary className={summaryCls}>
        <span className="flex items-center gap-2 font-medium text-white"><Chevron />Airport passengers</span>
        <span className="text-sm tabular-nums text-slate-300">
          {MON[L.month - 1]} {L.year}: {compact(L.value)} passengers, {pct(L.yoy)} YoY
        </span>
      </summary>
      <div className="space-y-3 px-1 pb-3 pt-2">
        <p className="text-sm text-slate-300">
          Passengers boarding flights (enplanements), all carriers, at {airports}.{s.note ? ` ${s.note}` : ""}
        </p>
        <Table caption="Last 13 months" head={["Month", "Passengers", "YoY"]} rows={recent} />
        <details className="group/y">
          <summary className={`${summaryCls} text-sm text-emerald-300`}>Show yearly ({yearsAsc[0]?.year}–{yearsAsc.at(-1)?.year})</summary>
          <Table head={["Year", "Passengers", "YoY"]} rows={years} />
        </details>
      </div>
    </details>
  );
}

/** Latest year in the series is 2025 unless BLS has not published or has withheld later years. */
const LATEST_PUBLISHED = 2025;
const METRO_LATEST = 2024;
function yearLabel(y: number, metro: boolean) {
  const top = metro ? METRO_LATEST : LATEST_PUBLISHED;
  if (y >= LATEST_PUBLISHED) return String(y);
  if (y >= top) return `${y} (latest published for metro areas)`;
  const gap = y + 1 === top ? `${top}` : `${y + 1}–${top}`;
  return `${y} (latest; BLS withheld ${gap})`;
}

function Lodging({ slug }: { slug: string }) {
  const h = marketHistory(slug);
  if (!h) {
    return (
      <div id="history-lodging" className="scroll-mt-36 rounded-lg border border-dashed border-white/15 px-3 py-3 text-sm text-slate-300">
        <span className="font-medium text-slate-200">Lodging jobs &amp; wages.</span> No yearly lodging-employment series for this market yet (BLS QCEW withholds most years).
      </div>
    );
  }
  const r = h.rows;
  const last = r[r.length - 1];
  const prev = r.find((x) => x.year === last.year - 1);
  const yrs = [...r].reverse().map((x) => {
    const p = r.find((y) => y.year === x.year - 1);
    return [x.year, n(x.employment), pct(ch(x.employment, p?.employment)), usdM(x.wagesUsd), n(x.establishments)];
  });
  return (
    <details id="history-lodging" className="group scroll-mt-36 border-t border-white/10 pt-1">
      <summary className={summaryCls}>
        <span className="flex items-center gap-2 font-medium text-white"><Chevron />Lodging jobs &amp; wages</span>
        <span className="text-sm tabular-nums text-slate-300">
          {yearLabel(last.year, /^C/.test(last.sourceUrl.split("/").pop() ?? ""))}: {n(last.employment)} jobs, {pct(ch(last.employment, prev?.employment))} YoY
        </span>
      </summary>
      <div className="space-y-3 px-1 pb-3 pt-2">
        <p className="text-sm text-slate-300">{h.industry}, private sector, {h.area}. {HISTORY_META.note}</p>
        <Table caption="Latest years" head={["Year", "Jobs", "YoY", "Wages", "Estab."]} rows={yrs.slice(0, 3)} />
        {yrs.length > 3 ? (
          <details>
            <summary className={`${summaryCls} text-sm text-emerald-300`}>Show yearly ({r[0].year}–{last.year})</summary>
            <Table head={["Year", "Jobs", "YoY", "Wages", "Estab."]} rows={yrs} />
          </details>
        ) : null}
        <p className="text-xs text-slate-300">
          Per-year files:{" "}
          {[...r].reverse().map((x, i) => (
            <span key={x.year}>
              {i ? " · " : ""}
              <a href={x.sourceUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>{x.year}&nbsp;↗</a>
            </span>
          ))}
        </p>
      </div>
    </details>
  );
}

/** Market page History block: two collapsed rows (airport, lodging), each with a one-line summary when closed. */
export function MarketHistoryBlock({ slug }: { slug: string }) {
  const s = airportSeries(slug);
  return (
    <section id="history" aria-labelledby="history-h" className="scroll-mt-36 space-y-2">
      <h2 id="history-h" className="text-lg font-semibold text-white">History</h2>
      <Airport slug={slug} />
      <Lodging slug={slug} />
      <p className="border-t border-white/10 pt-2 text-xs text-slate-300">
        Sources:{" "}
        <a href={PAX_META.sourceUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>{PAX_META.publisher}&nbsp;↗</a>
        {s ? `, airports ${s.airports.map((a) => a.code).join(", ")}, Jan 2015–${MON[s.months.at(-1)![1] - 1]} ${s.months.at(-1)![0]}` : ""}, accessed {PAX_META.accessed}. {PAX_META.lag}{" "}
        <a href={`https://www.bls.gov/cew/`} target="_blank" rel="noopener noreferrer" className={linkCls}>{HISTORY_META.publisher}&nbsp;↗</a>
        , annual averages, accessed {HISTORY_META.accessed}; withheld years left out.
      </p>
    </section>
  );
}

export function hasAirportData(slug: string) {
  return !!airportSeries(slug);
}
