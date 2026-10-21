import Link from "next/link";
import {
  HORIZONS,
  LIST_SIZE,
  STAYS,
  TT_CAPTURED_LABEL,
  fmtRate,
  isThin,
  type TTCell,
  type TTMarket,
} from "@/lib/tuesday-trends-shared";
import { NoRatesText } from "./NoRatesBadge";
import { Thin } from "./Thin";

function Value({ c }: { c: TTCell }) {
  const thin = isThin(c.nRefundable);
  return (
    <>
      <div className="flex items-baseline gap-1.5">
        {thin ? (
          <Thin size="lg" />
        ) : (
          <span className="text-[18px] font-semibold leading-tight tabular-nums text-white">{fmtRate(c.refundable)}</span>
        )}
      </div>
      <div className="mt-1 text-xs tabular-nums text-slate-300">
        {c.nRefundable}/{LIST_SIZE} priced
      </div>
      {c.nNoRates > 0 ? (
        <div className="mt-0.5 text-xs text-slate-300">
          <NoRatesText n={c.nNoRates} dot={c.horizon === "7d" && c.noRatesDot} />
        </div>
      ) : null}
    </>
  );
}

/**
 * "Rates" block on a market page: this market's Tuesday Trends row (cheapest refundable,
 * both stay types, all five horizons). The whole card links to the board.
 */
export function MarketRatesBlock({ market }: { market: TTMarket }) {
  return (
    <section aria-labelledby="rates-heading">
      <Link
        href="/tuesday-trends"
        className="group block rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/25 hover:bg-white/[0.05] sm:p-5"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id="rates-heading" className="text-lg font-semibold text-white">
            Rates
          </h2>
          <span className="inline-flex items-center gap-1 text-sm text-slate-200 group-hover:text-white">
            Tuesday Trends board
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-300">
          Captured {TT_CAPTURED_LABEL}. Median cheapest refundable nightly rate, 2 adults, pre-tax, across{" "}
          {LIST_SIZE} hotels. Indicative Google Hotels prices; decision support, not a quote.
        </p>

        {/* Mobile: one row per horizon, weekday and weekend side by side */}
        <table className="mt-4 w-full text-left sm:hidden">
          <caption className="sr-only">Median cheapest refundable nightly rate by horizon and stay</caption>
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-300">
              <th scope="col" className="py-2 pr-2 font-medium">Out</th>
              {STAYS.map((s) => (
                <th key={s.key} scope="col" className="px-2 py-2 font-medium">
                  {s.label}
                  <span className="block text-[12px] normal-case tracking-normal">{s.days}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HORIZONS.map((h) => (
              <tr key={h.key} className="border-b border-white/[0.06] last:border-b-0 align-top">
                <th scope="row" className="py-2.5 pr-2 text-sm font-medium text-slate-200">
                  {h.label}
                </th>
                {STAYS.map((s) => {
                  const c = market.cells.find((x) => x.horizon === h.key && x.stay === s.key)!;
                  return (
                    <td key={s.key} className="px-2 py-2.5">
                      <Value c={c} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* sm and up: two rows of five tiles */}
        <div className="mt-4 hidden space-y-4 sm:block">
          {STAYS.map((s) => (
            <div key={s.key}>
              <div className="text-xs font-medium uppercase tracking-wider text-slate-300">
                {s.label} ({s.days})
              </div>
              <div className="mt-2 grid grid-cols-5 gap-2">
                {HORIZONS.map((h) => {
                  const c = market.cells.find((x) => x.horizon === h.key && x.stay === s.key)!;
                  return (
                    <div key={h.key} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
                      <div className="text-xs text-slate-300">{h.label}</div>
                      <div className="mt-0.5">
                        <Value c={c} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-300">
          Coverage counts hotels with a refundable rate; low-confidence prices (2 or fewer sellers and no
          official hotel site) are left out. Thin: under 15 of 50. ● 10+ no rates on Google at 1 wk. At ~11
          months, no rates largely reflect Google&apos;s ~330-day pricing limit.
        </p>
      </Link>
    </section>
  );
}
