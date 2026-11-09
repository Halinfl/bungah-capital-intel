import type { Metadata } from "next";
import { ReitsTabs } from "@/components/reits/ReitsTabs";
import { ReitsBrowser } from "@/components/reits/ReitsBrowser";
import { EarningsStrip } from "@/components/reits/EarningsStrip";
import { LatestCallsList } from "@/components/reits/LatestCallsList";
import { Independence } from "@/components/reits/Independence";
import { reitsTabs } from "@/lib/reits-tabs";
import { LATEST_CALLS_QUARTER, REITS_AS_OF, latestCalls, nextCalls, reits, summarize } from "@/lib/reits";

export const metadata: Metadata = {
  title: "Hotel REITs · Bungah Capital Intel",
  description:
    "The 13 US-listed hotel REITs, one page each like a market: reported RevPAR, ADR, occupancy, portfolio by market and earnings calls, every figure linked to its SEC filing.",
  alternates: { canonical: "/reits" },
};

/** "2026Q3" -> "Q4 2026"; "2026Q4" -> "Q1 2027". */
function nextQuarterLabel(q: string): string {
  const y = Number(q.slice(0, 4));
  const n = Number(q.slice(-1));
  return n === 4 ? `Q1 ${y + 1}` : `Q${n + 1} ${y}`;
}

export default function ReitsIndexPage() {
  const all = reits();
  const calls = nextCalls();
  const latest = latestCalls();
  const missing = all.filter((r) => !r.nextCall).map((r) => r.ticker);
  return (
    <div className="space-y-8">
      <ReitsTabs active="reits" tabs={reitsTabs()} />
      <div>
        <h1 className="t-h1">REITs</h1>
        <p className="mt-2 max-w-2xl t-lead">
          {all.length} US-listed hotel REITs, from their SEC filings as of {REITS_AS_OF}. Numbers lead; every figure links
          to its filing.
        </p>
        <Independence className="mt-2" />
      </div>

      <ReitsBrowser reits={all.map(summarize)} />

      <LatestCallsList calls={latest.calls} notReported={latest.notReported} />

      <EarningsStrip calls={calls} missing={missing} missingLabel={`${nextQuarterLabel(LATEST_CALLS_QUARTER)} dates not announced yet`} />
    </div>
  );
}
