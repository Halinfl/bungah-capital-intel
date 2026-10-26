import Link from "next/link";
import type { Metadata } from "next";
import { ReitsTabs } from "@/components/reits/ReitsTabs";
import { ReitsBoard } from "@/components/reits/ReitsBoard";
import { EarningsStrip } from "@/components/reits/EarningsStrip";
import { Independence } from "@/components/reits/Independence";
import { reitsTabs } from "@/lib/reits-tabs";
import { REITS_AS_OF, REITS_FIRST_CAPTURE, REITS_UNIVERSE, boardHotels, fmtDate, fmtInt, nextCalls, reits, summarize } from "@/lib/reits";

export const metadata: Metadata = {
  title: "Hotel REITs board · Bungah Capital Intel",
  description:
    "The 13 listed US hotel REITs: latest reported RevPAR, ADR, occupancy and portfolio from SEC filings, each linked to its filing, plus the earnings calendar. Decision support.",
  alternates: { canonical: "/reits/board" },
};

export default function ReitsBoardPage() {
  const all = reits();
  const calls = nextCalls();
  const next = calls.find((c) => c.kind === "call") ?? null;
  const missing = all.filter((r) => !r.nextCall).map((r) => r.ticker);

  const stats: { n: string; label: string; sub?: string }[] = [
    { n: String(all.length), label: "REITs tracked", sub: "US-listed hotel REITs" },
  ];
  if (REITS_UNIVERSE.hotels != null)
    stats.push({ n: fmtInt(REITS_UNIVERSE.hotels), label: "Hotels in universe", sub: REITS_UNIVERSE.hotels_source });
  if (next)
    stats.push({
      n: fmtDate(next.date, { dow: false }),
      label: "Next earnings call",
      sub: `${calls.filter((c) => c.kind === "call" && c.date === next.date).map((c) => c.ticker).join(", ")}${next.estimated ? " (est.)" : ""}`,
    });

  return (
    <div className="space-y-6">
      <ReitsTabs active="board" tabs={reitsTabs()} />

      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div>
          <h1 className="t-h1">REITs board</h1>
          {/* Mobile: one-line intro so the first rows fit on the first screen; the full intro sits in "How to read this". */}
          <p className="mt-1 text-[13px] text-slate-300 sm:hidden">
            SEC filings as of {REITS_AS_OF}; captures start {fmtDate(REITS_FIRST_CAPTURE)}.
          </p>
          <p className="mt-1.5 hidden text-sm text-slate-200 sm:block">Reported data as of {REITS_AS_OF}</p>
          <p className="mt-1 hidden max-w-3xl text-sm text-slate-300 sm:block">
            The 13 US-listed hotel REITs, from their SEC filings. Weekly Google Hotels captures for every REIT-owned hotel
            start {fmtDate(REITS_FIRST_CAPTURE)}. Decision support, not investment advice.
          </p>
        </div>
        <Link
          href="/reits/methodology"
          className="shrink-0 pt-1 text-sm text-slate-200 underline decoration-white/30 underline-offset-4 hover:text-white"
        >
          Methodology
        </Link>
      </div>

      <dl className="grid grid-cols-3 gap-2 sm:gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 sm:px-4 sm:py-3">
            <dd className="text-xl font-semibold tabular-nums text-white sm:text-2xl">{s.n}</dd>
            <dt className="mt-0.5 text-[13px] text-slate-200">{s.label}</dt>
            {s.sub ? <p className="mt-0.5 hidden text-[12px] text-slate-300 sm:block">{s.sub}</p> : null}
          </div>
        ))}
      </dl>

      <ReitsBoard
        rows={all.map(summarize)}
        firstCapture={REITS_FIRST_CAPTURE}
        mobileIntro={
          <>
            Reported data as of {REITS_AS_OF}. The 13 US-listed hotel REITs, from their SEC filings. Weekly Google Hotels
            captures for every REIT-owned hotel start {fmtDate(REITS_FIRST_CAPTURE)}. Decision support, not investment advice.
          </>
        }
        hotelLists={Object.fromEntries(all.map((r) => [r.ticker, boardHotels(r)]))}
      />

      <EarningsStrip calls={calls} missing={missing} />

      <Independence />
    </div>
  );
}
