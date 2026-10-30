import Link from "next/link";
import { Suspense } from "react";
import { MarketsTabs } from "@/components/tuesday-trends/MarketsTabs";
import { TuesdayTrendsBoard, TuesdayTrendsBoardUrl } from "@/components/tuesday-trends/TuesdayTrendsBoard";
import { MovesStrip } from "@/components/tuesday-trends/MovesStrip";
import { SwipeDeckUrl, SwipePill, SwipePillStatic } from "@/components/tuesday-trends/SwipeDeck";
import { ttLatest, type TTIssue } from "@/lib/tuesday-trends";
import { SWIPE_MAX_MOVES, buildSwipeCards } from "@/lib/tuesday-trends-swipe";

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
  // Optional "Swipe through this week" deck (mobile): only with week-over-week figures and 3+ moves.
  const swipe = buildSwipeCards(moves, { hasWow: issue.hasWow }) ? Math.min(moves.length, SWIPE_MAX_MOVES) : 0;
  const deckProps = {
    moves,
    hasWow: issue.hasWow,
    date: issue.date,
    capturedLabel: issue.capturedLabel,
    prevCapturedLabel: issue.prevCapturedLabel,
    isLatest,
  };
  return (
    <div className="space-y-2 sm:space-y-6">
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
        {/* H1 row; the mobile "Swipe" pill sits inside the H1's line box (32px pill, 44px hit area), so the row grows 0px. */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="t-h1 min-w-0">Tuesday Trends{permalink ? <span className="text-slate-300"> · {issue.capturedLabel.replace(/^Tue, /, "")}</span> : null}</h1>
          {swipe ? (
            <Suspense fallback={<SwipePillStatic count={swipe} />}>
              <SwipePill count={swipe} />
            </Suspense>
          ) : null}
        </div>
        {/* Date line with its two links (44px targets); the "Indicative…" disclaimer sits under the list. */}
        <p className="mt-1 flex flex-wrap items-center gap-x-2.5 text-[13px] text-slate-200 sm:gap-x-4 sm:text-sm">
          <span>
            <span className="hidden sm:inline">Rates captured {issue.capturedLabel}</span>
            <span className="sm:hidden">Captured {issue.capturedLabel.replace(/^[A-Z][a-z]{2}, /, "")}</span>
          </span>
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
      {/* id: "Open the full board" on the deck's last card lands here (the controls). */}
      <div id="tt-board" tabIndex={-1} className="scroll-mt-4 outline-none">
        <Suspense fallback={<TuesdayTrendsBoard {...boardProps} />}>
          <TuesdayTrendsBoardUrl {...boardProps} />
        </Suspense>
      </div>

      {/* Renders only with ?view=swipe; with fewer than 3 moves it drops view/card from the URL silently. */}
      <Suspense fallback={null}>
        <SwipeDeckUrl {...deckProps} />
      </Suspense>

      {permalink && !isLatest ? (
        <p className="text-[13px] text-slate-300">Market pages show the latest issue&apos;s rates.</p>
      ) : null}
    </div>
  );
}
