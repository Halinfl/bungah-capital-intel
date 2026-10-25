import type { Metadata } from "next";
import { ReitsTabs } from "@/components/reits/ReitsTabs";
import { ReitsBrowser } from "@/components/reits/ReitsBrowser";
import { EarningsStrip } from "@/components/reits/EarningsStrip";
import { Independence } from "@/components/reits/Independence";
import { reitsTabs } from "@/lib/reits-tabs";
import { REITS_AS_OF, nextCalls, reits, summarize } from "@/lib/reits";

export const metadata: Metadata = {
  title: "Hotel REITs · Bungah Capital Intel",
  description:
    "The 13 US-listed hotel REITs, one page each like a market: reported RevPAR, ADR, occupancy, portfolio by market and earnings calls, every figure linked to its SEC filing.",
};

export default function ReitsIndexPage() {
  const all = reits();
  const calls = nextCalls();
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

      <EarningsStrip calls={calls} missing={missing} />
    </div>
  );
}
