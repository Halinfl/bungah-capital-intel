import Link from "next/link";
import type { Metadata } from "next";
import { ReitsTabs } from "@/components/reits/ReitsTabs";
import { Independence } from "@/components/reits/Independence";
import { reitsTabs } from "@/lib/reits-tabs";
import { HORIZONS } from "@/lib/tuesday-trends-shared";
import {
  PEER_GROUPS,
  PEER_OF,
  REITS_FIRST_CAPTURE,
  REITS_QUARTERS,
  REITS_UNIVERSE,
  fmtDate,
  fmtInt,
  fmtQuarter,
  reits,
} from "@/lib/reits";

export const metadata: Metadata = {
  title: "Hotel REITs methodology · Bungah Capital Intel",
  description:
    "How the Hotel REITs section is built: SEC EDGAR sources, the property universe, weekly Google Hotels captures, the tracking gap, and what is never captured.",
};

const SECTIONS = [
  { id: "what-this-is", title: "What this is" },
  { id: "cohort", title: "The 13 REITs" },
  { id: "sources", title: "Reported data: sources" },
  { id: "universe", title: "Property universe" },
  { id: "captures", title: "Captured rates" },
  { id: "tracking-gap", title: "Tracking gap" },
  { id: "is-and-isnt", title: "What it is and isn’t" },
  { id: "change-log", title: "Change log" },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-xl font-semibold tracking-tight text-white">
      {children}
    </h2>
  );
}

const p = "text-[15px] leading-relaxed text-slate-200";

export default function ReitsMethodologyPage() {
  const all = reits();
  const firstQ = REITS_QUARTERS[0];
  const lastQ = REITS_QUARTERS[REITS_QUARTERS.length - 1];
  const horizons = HORIZONS.map((h) => h.long.toLowerCase()).join(", ");

  return (
    <div className="space-y-6">
      <ReitsTabs active="methodology" tabs={reitsTabs()} />
      <div>
        <Link href="/reits" className="text-xs text-slate-300 hover:text-white">
          ← REITs
        </Link>
        <h1 className="mt-2 t-h1">Hotel REITs methodology</h1>
        <p className="mt-2 max-w-3xl t-lead">
          Where the reported numbers come from, how the property universe is built, and how weekly captured rates will be
          compared with what each REIT reports.
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-20">
            <div className="text-xs font-medium uppercase tracking-wider text-slate-300">On this page</div>
            <ul className="mt-3 space-y-2 text-sm">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-slate-200 hover:text-white">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <article className="max-w-3xl space-y-10">
          <section className="space-y-3">
            <H2 id="what-this-is">What this is</H2>
            <p className={p}>
              The REITs section follows the {all.length} US-listed hotel REITs one company at a time. Each REIT has two kinds
              of numbers, always kept apart: <span className="font-medium text-white">reported</span> figures from its SEC
              filings, and, from {fmtDate(REITS_FIRST_CAPTURE, { year: true })},{" "}
              <span className="font-medium text-white">captured</span> Google Hotels rates for the hotels it owns, taken
              every Tuesday with the same rules as{" "}
              <Link href="/tuesday-trends/methodology" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
                Tuesday Trends
              </Link>
              . Around each earnings call, the two are compared.
            </p>
            <p className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-[15px] text-slate-200">
              Decision support, not investment advice; no ratings or price targets.
            </p>
            <Independence />
          </section>

          <section className="space-y-3">
            <H2 id="cohort">The 13 REITs</H2>
            <p className={p}>
              Pure-play US hotel REITs listed on a US exchange. A diversified REIT that also owns hotels and a REIT in
              wind-down are excluded. Peer groups are used for the board filter:
            </p>
            <ul className={`${p} list-disc space-y-1.5 pl-5`}>
              {PEER_GROUPS.map((g) => (
                <li key={g.key}>
                  <span className="font-medium text-white">{g.label}</span>:{" "}
                  {Object.entries(PEER_OF)
                    .filter(([, v]) => v === g.key)
                    .map(([t]) => t)
                    .join(", ")}
                  {g.key === "other" ? " (a group-oriented convention-resort owner, and REITs that fit neither group)" : ""}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <H2 id="sources">Reported data: sources</H2>
            <p className={p}>
              All reported figures come from SEC EDGAR: quarterly reports (10-Q), annual reports (10-K), and the
              earnings releases each REIT files as an exhibit to a current report (8-K, exhibit 99.1).
              {firstQ && lastQ ? ` The archive covers ${REITS_QUARTERS.length} quarters, ${fmtQuarter(firstQ)} to ${fmtQuarter(lastQ)}.` : ""}
            </p>
            <ul className={`${p} list-disc space-y-2 pl-5`}>
              <li>
                <span className="font-medium text-white">Provenance on every value.</span> Each number on the board and on
                REIT pages links to the filing document it was read from.
              </li>
              <li>
                <span className="font-medium text-white">As each REIT reports it.</span> RevPAR, ADR and occupancy are the
                REIT&apos;s own figures for the portfolio it reports on (often a comparable or same-property set). REITs
                define those sets differently, so cross-REIT comparisons are indicative.
              </li>
              <li>
                <span className="font-medium text-white">Order of reading.</span> Structured XBRL data first, then the
                tables in the earnings release, then the report&apos;s discussion section. Supplemental PDF packages are
                not parsed; their links are kept.
              </li>
              <li>
                <span className="font-medium text-white">Checks.</span> Every value passes format and range checks, and a
                sample of values read from tables is checked by hand against the filing. Values that fail stay off the
                site until resolved.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <H2 id="universe">Property universe</H2>
            <p className={p}>
              The universe is every hotel the 13 REITs own, built from the property lists in their filings, with the
              owning REIT and the dates it bought or sold each hotel, so captured rates are always attributed to the owner
              at the time.
              {REITS_UNIVERSE.hotels != null ? ` It currently holds ${fmtInt(REITS_UNIVERSE.hotels)} hotels.` : ""}
            </p>
          </section>

          <section className="space-y-3">
            <H2 id="captures">Captured rates</H2>
            <p className={p}>
              From {fmtDate(REITS_FIRST_CAPTURE, { year: true })}, every REIT-owned hotel is priced on Google Hotels each
              Tuesday, in a separate run from Tuesday Trends but with the same rules:
            </p>
            <ul className={`${p} list-disc space-y-2 pl-5`}>
              <li>2 adults, nightly, in US dollars, before taxes and fees.</li>
              <li>The cheapest refundable rate for each hotel; low-confidence, reseller-only prices are left out of medians.</li>
              <li>Five horizons ({horizons}), each with a weekday stay (Mon–Thu) and a weekend stay (Fri–Sun).</li>
              <li>
                A hotel Google shows with no bookable rates is recorded as &ldquo;no rates on Google&rdquo;, never as sold
                out.
              </li>
              <li>
                Each REIT is captured on its own, so a failure for one REIT never holds up the others, and a re-run never
                double-counts.
              </li>
            </ul>
            <p className={p}>
              On the board each REIT will show its median captured rate and how many of its hotels were priced
              (&ldquo;X of N&rdquo;). Until the first capture, those columns stay empty rather than show an estimate.
            </p>
          </section>

          <section className="space-y-3">
            <H2 id="tracking-gap">Tracking gap</H2>
            <p className={p}>
              The tracking gap compares what a REIT&apos;s hotels were listed for on Google with the ADR the REIT later
              reports for the same quarter. Listed rates are what hotels ask; ADR is what guests paid, after group,
              contract and loyalty rates. A steady gap is normal. What matters is whether captured rates move ahead of
              reported ADR, and by how much. It is computed only once a quarter&apos;s captures and its reported ADR both
              exist.
            </p>
            <p className={p}>
              <span className="font-medium text-white">Occupancy is never captured.</span> Google shows prices, not how many
              rooms are sold, so occupancy appears only as a reported figure. &ldquo;No rates on Google&rdquo; is not an
              occupancy signal.
            </p>
          </section>

          <section className="space-y-3">
            <H2 id="is-and-isnt">What it is and isn&apos;t</H2>
            <ul className={`${p} list-disc space-y-2 pl-5`}>
              <li>It is decision support: a repeatable read of each REIT&apos;s reported results and, soon, its hotels&apos; listed rates.</li>
              <li>It is not investment advice. There are no buy or sell ratings and no price targets.</li>
              <li>It is not affiliated with or endorsed by any REIT.</li>
              <li>It does not forecast results; captured rates are listed prices, not bookings.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <H2 id="change-log">Change log</H2>
            <ul className={`${p} space-y-2`}>
              <li>
                <span className="font-medium tabular-nums text-white">Oct 25, 2026</span>: section launched in preview with
                reported data from SEC filings{lastQ ? ` through ${fmtQuarter(lastQ)}` : ""} and the earnings calendar.
                Weekly captures start {fmtDate(REITS_FIRST_CAPTURE, { year: true })}.
              </li>
            </ul>
            <p className={p}>
              See also the{" "}
              <Link href="/tuesday-trends/methodology" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
                Tuesday Trends methodology
              </Link>{" "}
              for the market-level weekly rate board these captures follow.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
