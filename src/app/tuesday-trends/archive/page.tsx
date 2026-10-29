import Link from "next/link";
import type { Metadata } from "next";
import { MarketsTabs } from "@/components/tuesday-trends/MarketsTabs";
import { HORIZONS, STAYS, fmtPct, ttIssues } from "@/lib/tuesday-trends";

export const metadata: Metadata = {
  title: "Tuesday Trends past issues · Bungah Capital Intel",
  description: "Every Tuesday Trends issue: weekly indicative Google Hotels rates for US hotel markets, one dated page per capture.",
  alternates: { canonical: "/tuesday-trends/archive" },
};

/** Past issues, newest first. A new capture's summary JSON adds a row and a dated page at the next build. */
export default function TuesdayTrendsArchivePage() {
  const issues = ttIssues();
  return (
    <div className="space-y-6">
      <MarketsTabs active="tuesday-trends" />
      <div>
        <h1 className="t-h1">Tuesday Trends: past issues</h1>
        <p className="mt-1.5 text-sm text-slate-300">One page per weekly capture of indicative Google Hotels prices.</p>
        <Link
          href="/tuesday-trends"
          className="inline-flex min-h-11 items-center text-sm text-slate-200 underline decoration-white/30 underline-offset-4 hover:text-white"
        >
          Latest issue →
        </Link>
      </div>
      <ul className="grid gap-2">
        {issues.map((i, k) => {
          const top = [...i.moves()].sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct))[0];
          const h = top ? HORIZONS.find((x) => x.key === top.horizon)! : null;
          const s = top ? STAYS.find((x) => x.key === top.stay)! : null;
          return (
            <li key={i.date}>
              <Link
                href={`/tuesday-trends/${i.date}`}
                className="block min-h-11 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 hover:border-white/25 hover:bg-white/[0.05]"
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-[15px] font-medium text-white">Rates captured {i.capturedLabel}</span>
                  {k === 0 ? <span className="shrink-0 text-[12px] text-slate-300">Latest</span> : null}
                </span>
                <span className="mt-0.5 block text-[13px] tabular-nums text-slate-300">
                  {i.markets().length} markets
                  {top && h && s
                    ? ` · Biggest move vs ${i.prevCapturedLabel.replace(/^Tue, /, "")}: ${top.marketName} ${fmtPct(top.pct)} (${h.label}, ${s.label.toLowerCase()}, same ${top.nPairs} hotels)`
                    : i.hasWow
                      ? ""
                      : " · No week-over-week comparison"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
