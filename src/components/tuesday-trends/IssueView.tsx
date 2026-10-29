import Link from "next/link";
import { Suspense } from "react";
import { MarketsTabs } from "@/components/tuesday-trends/MarketsTabs";
import { TuesdayTrendsBoard, TuesdayTrendsBoardUrl } from "@/components/tuesday-trends/TuesdayTrendsBoard";
import { MovesStrip } from "@/components/tuesday-trends/MovesStrip";
import { ttLatest, type TTIssue } from "@/lib/tuesday-trends";

const linkCls =
  "inline-flex min-h-11 items-center text-sm text-slate-200 underline decoration-white/30 underline-offset-4 hover:text-white";

/**
 * One Tuesday Trends issue: /tuesday-trends (latest) and /tuesday-trends/<date> (permalink, any issue).
 * Static: rendered from the committed summary JSON at build time.
 */
export function IssueView({ issue, permalink = false }: { issue: TTIssue; permalink?: boolean }) {
  const latest = ttLatest();
  const isLatest = latest?.date === issue.date;
  const moves = issue.moves();
  const boardProps = {
    markets: issue.markets(),
    hasWow: issue.hasWow,
    taxShown: issue.taxInclusive,
    note: issue.holidayNote(),
  };
  return (
    <div className="space-y-6">
      <MarketsTabs active="tuesday-trends" />

      {permalink && !isLatest && latest ? (
        <p className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-slate-200">
          Past issue.{" "}
          <Link href="/tuesday-trends" className={linkCls}>
            Latest: rates captured {latest.capturedLabel}
          </Link>
        </p>
      ) : null}

      <div>
        <h1 className="t-h1">Tuesday Trends{permalink ? <span className="text-slate-300"> · {issue.capturedLabel.replace(/^Tue, /, "")}</span> : null}</h1>
        {/* Date line with its two links (44px targets); the "Indicative…" disclaimer sits under the list. */}
        <p className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-slate-200">
          <span>Rates captured {issue.capturedLabel}</span>
          <Link href="/tuesday-trends/methodology" className={linkCls}>
            Methodology
          </Link>
          <Link href="/tuesday-trends/archive" className={linkCls}>
            Past issues
          </Link>
        </p>
      </div>

      {/* Moves strip: matched-pair week-over-week moves; neutral gray, no red/green. */}
      {issue.hasWow && moves.length ? (
        <MovesStrip moves={moves} prevLabel={issue.prevCapturedLabel} />
      ) : (
        <div className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-slate-200">
          {issue.hasWow
            ? `No week-over-week moves with enough matched hotels vs ${issue.prevCapturedLabel}.`
            : isLatest
              ? "Week-over-week changes start next Tuesday."
              : "No week-over-week comparison for this issue."}
        </div>
      )}

      {/* View (horizon, stay, rate, sort) lives in the URL; the fallback is the same board at the default view. */}
      <Suspense fallback={<TuesdayTrendsBoard {...boardProps} />}>
        <TuesdayTrendsBoardUrl {...boardProps} />
      </Suspense>

      {permalink && !isLatest ? (
        <p className="text-[13px] text-slate-300">Market pages show the latest issue&apos;s rates.</p>
      ) : null}
    </div>
  );
}
