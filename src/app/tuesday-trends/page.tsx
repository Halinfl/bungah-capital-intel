import Link from "next/link";
import type { Metadata } from "next";
import { MarketsTabs } from "@/components/tuesday-trends/MarketsTabs";
import { TuesdayTrendsBoard } from "@/components/tuesday-trends/TuesdayTrendsBoard";
import { MovesStrip } from "@/components/tuesday-trends/MovesStrip";
import { TT_CAPTURED_LABEL, TT_HAS_WOW, TT_PREV_CAPTURED_LABEL, TT_TAX_INCLUSIVE, ttHolidayNote, ttMarkets, ttMoves } from "@/lib/tuesday-trends";

export const metadata: Metadata = {
  title: "Tuesday Trends · Bungah Capital Intel",
  description:
    "Weekly indicative Google Hotels rates for 17 US markets: median cheapest refundable nightly rate, 2 adults, pre-tax, five horizons. Decision support, not a quote.",
  alternates: { canonical: "/tuesday-trends" },
};

export default function TuesdayTrendsPage() {
  const markets = ttMarkets();
  const moves = ttMoves();
  return (
    <div className="space-y-6">
      <MarketsTabs active="tuesday-trends" />

      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div>
          <h1 className="t-h1">Tuesday Trends</h1>
          <p className="mt-1.5 text-sm text-slate-200">Rates captured {TT_CAPTURED_LABEL}</p>
          <p className="mt-1 text-sm text-slate-300">
            Indicative Google Hotels prices. Median of the cheapest refundable rate, 2 adults, pre-tax. Decision
            support, not a quote.
          </p>
        </div>
        <Link
          href="/tuesday-trends/methodology"
          className="shrink-0 pt-1 text-sm text-slate-200 underline decoration-white/30 underline-offset-4 hover:text-white"
        >
          Methodology
        </Link>
      </div>

      {/* Moves strip: matched-pair week-over-week moves; neutral gray, no red/green. */}
      {TT_HAS_WOW && moves.length ? (
        <MovesStrip moves={moves} />
      ) : (
        <div className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-slate-200">
          {TT_HAS_WOW ? `No week-over-week moves with enough matched hotels vs ${TT_PREV_CAPTURED_LABEL}.` : "Week-over-week changes start next Tuesday."}
        </div>
      )}

      <TuesdayTrendsBoard markets={markets} hasWow={TT_HAS_WOW} taxShown={TT_TAX_INCLUSIVE} note={ttHolidayNote()} />
    </div>
  );
}
