import Link from "next/link";
import { fmtDate, type NextCall } from "@/lib/reits-shared";

type Call = NextCall & { ticker: string; name: string };

/** Minutes after midnight for "9:00 a.m. ET"-style times; releases without a call sort after calls. */
function minutes(c: Call): number {
  const m = c.kind === "call" && c.time ? c.time.match(/^(\d{1,2}):(\d{2})\s*(a|p)/i) : null;
  if (!m) return 24 * 60;
  return ((Number(m[1]) % 12) + (m[3].toLowerCase() === "p" ? 12 : 0)) * 60 + Number(m[2]);
}

/**
 * Next earnings call for each REIT as a compact list grouped by day, soonest first. Only company-announced
 * dates are passed in; REITs without one are listed under "Not announced".
 */
export function EarningsStrip({ calls, missing }: { calls: Call[]; missing: string[] }) {
  if (!calls.length && !missing.length) return null;
  const days = new Map<string, Call[]>();
  for (const c of [...calls].sort((a, b) => a.date.localeCompare(b.date) || minutes(a) - minutes(b) || a.ticker.localeCompare(b.ticker))) {
    days.set(c.date, [...(days.get(c.date) ?? []), c]);
  }
  const next = calls.filter((c) => c.kind === "call").sort((a, b) => a.date.localeCompare(b.date) || minutes(a) - minutes(b))[0];
  const row = "flex items-baseline justify-between gap-3 py-0.5 text-[13px]";
  const tick = "font-semibold text-white underline decoration-white/0 underline-offset-4 hover:decoration-white/60";

  return (
    <section aria-labelledby="earnings-cal" className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="earnings-cal" className="text-base font-semibold text-white">
          Earnings calendar
        </h2>
        <p className="text-[13px] text-slate-300">Next call per REIT, from company announcements. Times ET.</p>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:grid-cols-2 lg:grid-cols-4">
        {[...days.entries()].map(([date, list]) => (
          <div key={date}>
            <h3 className="border-b border-white/10 pb-1 text-[12px] font-medium uppercase tracking-wider text-slate-300">
              {fmtDate(date)}
            </h3>
            <ul className="mt-1">
              {list.map((c) => {
                const isNext = next && c.ticker === next.ticker;
                return (
                  <li key={c.ticker} className={row}>
                    <span className="flex items-baseline gap-1.5">
                      <Link href={`/reits/${c.ticker.toLowerCase()}#earnings`} title={c.source ? `Source: ${c.source}` : undefined} className={tick}>
                        {c.ticker}
                      </Link>
                      {isNext ? (
                        <span className="inline-flex items-center gap-1 text-[12px] text-slate-200">
                          <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-slate-200" />
                          Next
                        </span>
                      ) : null}
                    </span>
                    <span className="whitespace-nowrap tabular-nums text-slate-200">
                      {c.kind === "call" ? (c.time ?? "Call") : "Release only"}
                      {c.estimated ? <span className="ml-1 text-slate-300">est.</span> : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {missing.length ? (
          <div>
            <h3 className="border-b border-white/10 pb-1 text-[12px] font-medium uppercase tracking-wider text-slate-300">
              No date yet
            </h3>
            <ul className="mt-1">
              {missing.map((t) => (
                <li key={t} className={row}>
                  <Link href={`/reits/${t.toLowerCase()}#earnings`} className={tick}>
                    {t}
                  </Link>
                  <span className="whitespace-nowrap text-slate-300">Not announced</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
