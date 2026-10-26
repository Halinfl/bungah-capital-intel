import type { Metadata } from "next";
import { DraftNote } from "@/components/sound-assets/DraftNote";
import { MarketsTabs } from "@/components/tuesday-trends/MarketsTabs";
import ledger from "@/data/ledger/entries.json";

export const metadata: Metadata = {
  title: "Monday Ledger · Markets · Bungah Capital Intel",
  description: "Every hotel-data call we make, timestamped before the data arrives, graded against Tuesday Trends actuals.",
};

export default function LedgerPage() {
  const entries = ledger.entries as unknown[];
  return (
    <div className="space-y-8">
      <MarketsTabs active="ledger" />
      <header className="space-y-3">
        <h1 className="t-h1">Monday Ledger</h1>
        <p className="max-w-3xl t-lead">
          Falsifiable, numeric hotel-data calls, timestamped before each Tuesday Trends run and graded against what the
          data shows.
        </p>
      </header>

      <div className="max-w-3xl rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="text-xs font-medium uppercase tracking-wider text-slate-300">Running tally</div>
        <div className="mt-1 text-2xl font-semibold text-white">
          {entries.length === 0 ? "First calls coming" : `${entries.length} calls`}
        </div>
        <p className="mt-1 text-[13px] text-slate-300">
          No calls have been made yet. The tally starts with the first graded week.
        </p>
      </div>

      <section className="max-w-3xl space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-white">How the ledger works</h2>
        <ol className="list-decimal space-y-1.5 pl-5 text-[15px] text-slate-200">
          <li>Each call names a metric, a threshold and a direction, tied to the next Tuesday Trends release.</li>
          <li>Calls are timestamped and published before Tuesday&rsquo;s data run.</li>
          <li>The following Monday, each call is graded hit or miss against Tuesday&rsquo;s actuals, with a link to the data.</li>
          <li>Append-only: a call is never edited after publication and a miss is never deleted. Misses carry the same weight as hits.</li>
          <li>Corrections go to the errata log.</li>
        </ol>
        <div className="pt-1"><DraftNote /></div>
      </section>
    </div>
  );
}
