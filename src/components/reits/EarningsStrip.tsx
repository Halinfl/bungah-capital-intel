import Link from "next/link";
import { fmtDate, type NextCall } from "@/lib/reits-shared";

type Call = NextCall & { ticker: string; name: string };

/** Next earnings call for each REIT, soonest first. Only company-announced dates are passed in. */
export function EarningsStrip({ calls, missing }: { calls: Call[]; missing: string[] }) {
  if (!calls.length) return null;
  return (
    <section aria-labelledby="earnings-cal" className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="earnings-cal" className="text-base font-semibold text-white">
          Earnings calendar
        </h2>
        <p className="text-[13px] text-slate-300">Next call per REIT, from company announcements. Times ET.</p>
      </div>
      <ul className="flex snap-x gap-2 overflow-x-auto pb-1">
        {calls.map((c) => (
          <li key={c.ticker} className="snap-start">
            <Link
              href={`/reits/${c.ticker.toLowerCase()}#earnings`}
              title={c.source ? `Source: ${c.source}` : undefined}
              className="block min-w-[112px] rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 hover:bg-white/[0.06]"
            >
              <span className="block text-[13px] font-semibold text-white">{c.ticker}</span>
              <span className="block whitespace-nowrap text-[13px] tabular-nums text-slate-200">
                {fmtDate(c.date)}
                {c.estimated ? <span className="ml-1 text-slate-300">est.</span> : null}
              </span>
              <span className="block whitespace-nowrap text-[12px] text-slate-300">
                {c.kind === "call" ? (c.time ?? "Call") : "Release only"}
              </span>
            </Link>
          </li>
        ))}
        {missing.map((t) => (
          <li key={t} className="snap-start">
            <Link
              href={`/reits/${t.toLowerCase()}`}
              className="block min-w-[112px] rounded-lg border border-dashed border-white/15 px-3 py-2 hover:bg-white/[0.04]"
            >
              <span className="block text-[13px] font-semibold text-white">{t}</span>
              <span className="block whitespace-nowrap text-[13px] text-slate-200">Not announced</span>
              <span className="block whitespace-nowrap text-[12px] text-slate-300">No company date</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
