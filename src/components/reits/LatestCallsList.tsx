import Link from "next/link";
import { SourceChip } from "@/components/SourceChip";
import { callCiteLabel, fmtDate, fmtQuarter, type QuarterCall } from "@/lib/reits";

/** /reits: one cited line per REIT from its latest earnings call, linking to the full summary on its page. */
export function LatestCallsList({ calls, notReported }: { calls: QuarterCall[]; notReported: { ticker: string; note: string }[] }) {
  if (!calls.length) return null;
  const q = fmtQuarter(calls[0].quarter);
  return (
    <section aria-labelledby="latest-calls" className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="latest-calls" className="text-base font-semibold text-white">
          {q} calls
        </h2>
        <p className="text-[13px] text-slate-300">Headline results and guidance, from each company&apos;s release and call.</p>
      </div>
      <ul className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.03]">
        {calls.map((c) => (
          <li key={c.ticker} className="space-y-1.5 px-4 py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <Link
                href={`/reits/${c.ticker.toLowerCase()}#latest-call`}
                className="inline-flex min-h-11 items-center font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/80 sm:min-h-0"
              >
                {c.ticker}
              </Link>
              <span className="text-[12px] text-slate-300">
                {c.callDate ? `Call ${fmtDate(c.callDate, { year: true })}` : "Release only, no call"}
              </span>
            </div>
            <p className="text-[14px] leading-relaxed text-slate-100">{c.headline.text}</p>
            <SourceChip label={callCiteLabel(c, c.headline.cite)} />
          </li>
        ))}
        {notReported.map((n) => (
          <li key={n.ticker} className="space-y-1 px-4 py-3">
            <Link
              href={`/reits/${n.ticker.toLowerCase()}#earnings`}
              className="inline-flex min-h-11 items-center font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/80 sm:min-h-0"
            >
              {n.ticker}
            </Link>
            <p className="text-[14px] text-slate-300">{n.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
