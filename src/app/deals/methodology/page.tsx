import type { Metadata } from "next";
import { DealsSubnav } from "@/components/deals/DealsSubnav";
import { DealsDraftNote, UnderwriteNote } from "@/components/deals/DotBar";
import { RUBRIC, fmtDate } from "@/lib/deals";

export const metadata: Metadata = {
  title: "Recent Deals methodology · Bungah Capital Intel",
  description: "How Recent Deals grades US hotel sales: the inclusion rule, rubric v1 factors, weights and bands, the missing-factor rule and the no-look-ahead rule.",
  alternates: { canonical: "/deals/methodology" },
};

const SOURCES: Record<string, { source: string; asOf: string }> = {
  replacement_cost: {
    source: "HVS U.S. Hotel Development Cost Survey (free); class and edition stated; land excluded",
    asOf: "Latest edition published before the announcement",
  },
  spread: {
    source: "Cap rate or NOI as disclosed; 10-year yield from the U.S. Treasury daily par yield curve",
    asOf: "10-year yield on the announcement date (or the prior business day)",
  },
  supply: { source: "Public CBRE and PwC outlooks plus our supply radars", asOf: "Published before the announcement" },
  demand: {
    source: "Published lodging tax receipts; Tuesday Trends forward curve for deals announced from October 2026",
    asOf: "Only data that existed before the announcement",
  },
  debt_context: {
    source: "Filings, court and receiver records, public loan notices, press",
    asOf: "Public before the announcement",
  },
};

const h2 = "scroll-mt-24 text-xl font-semibold tracking-tight text-white";
const p = "max-w-3xl text-[15px] leading-relaxed text-slate-200";

export default function DealsMethodologyPage() {
  const r = RUBRIC;
  return (
    <div className="space-y-8">
      <DealsSubnav active="methodology" />
      <header className="space-y-3">
        <h1 className="t-h1">Recent Deals methodology</h1>
        <p className="max-w-3xl t-lead">
          How we choose deals and grade them. This page was published before the first grade. Decision support, not a recommendation.
        </p>
        <DealsDraftNote>Rubric {r.rubric_version}: top bands set by the editor; lower bands derived and awaiting sign-off.</DealsDraftNote>
        <UnderwriteNote text={r.disclaimer} />
      </header>

      <section className="space-y-3">
        <h2 id="inclusion-rule" className={h2}>
          Inclusion rule
        </h2>
        <p className={p}>A deal is added if EITHER:</p>
        <ul className="max-w-3xl list-disc space-y-1 pl-5 text-[15px] text-slate-200">
          <li>(a) one of our 13 tracked hotel REITs is buyer or seller, at any size; OR</li>
          <li>(b) it&rsquo;s a US hotel sale with a disclosed price of $100M or more.</li>
        </ul>
        <p className={p}>Tracked REITs: {r.inclusion_rule.tracked_reits.join(", ")}.</p>
        <ul className="max-w-3xl list-disc space-y-1 pl-5 text-[15px] text-slate-200">
          <li>Every qualifying deal is logged, including ones we haven&rsquo;t finished grading.</li>
          <li>Unpriced deals in non-disclosure states are listed as unpriced and never estimated. They&rsquo;re graded only if they qualify under (a).</li>
          <li>Event date = announcement date. A later close is a status update on the same entry.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 id="rubric" className={h2}>
          Rubric {r.rubric_version}
        </h2>
        <p className={p}>
          Each factor is scored {r.scale.min} to {r.scale.max}. Public data only: no Trepp loan-level data, CoStar, STR or CBRE Horizons, and no paid
          sources. Spreads are stated as a plain number of basis points.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-slate-400">
              <tr className="border-b border-white/10">
                <th className="py-2 pr-3 font-medium">Factor</th>
                <th className="py-2 pr-3 font-medium">Weight</th>
                <th className="py-2 pr-3 font-medium">Source (public only)</th>
                <th className="py-2 font-medium">As-of rule</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {r.factors.map((f) => (
                <tr key={f.id} className="border-b border-white/[0.06] align-top">
                  <td className="py-2 pr-3">{f.label}</td>
                  <td className="py-2 pr-3 tabular-nums">{Math.round(f.weight * 100)}%</td>
                  <td className="py-2 pr-3">{SOURCES[f.id].source}</td>
                  <td className="py-2">{SOURCES[f.id].asOf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="pt-2 text-lg font-semibold text-white">Bands</h3>
        <p className="max-w-3xl text-sm text-slate-300">Score 5 is the top band set by the editor. Scores 4 to 1 step down evenly and are marked derived.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {r.factors.map((f) => (
            <div key={f.id} className="rounded-xl border border-white/10 p-4">
              <div className="font-medium text-white">
                {f.label} <span className="text-sm font-normal text-slate-400">{Math.round(f.weight * 100)}%</span>
              </div>
              <p className="mt-1 text-[13px] text-slate-300">{f.metric_definition}</p>
              <ol className="mt-2 space-y-1 text-sm">
                {f.bands.map((b) => (
                  <li key={b.score} className="flex gap-2">
                    <span className="w-4 shrink-0 tabular-nums text-white">{b.score}</span>
                    <span className="text-slate-200">
                      {b.text}
                      <span className="text-xs text-slate-400"> · {b.set_by === "Hal" ? "top band" : "derived"}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 id="missing-factor" className={h2}>
          Missing factors and coverage
        </h2>
        <p className={p}>{r.missing_factor_rule.text}</p>
        <p className={p}>
          The overall score is the weighted mean of the graded factors, using their renormalized weights, rounded to one decimal and shown as
          &ldquo;X.X / {r.scale.max}&rdquo;. Each entry states its coverage, e.g. &ldquo;4 of 5 factors graded&rdquo;.
        </p>
      </section>

      <section className="space-y-3">
        <h2 id="no-look-ahead" className={h2}>
          No look-ahead
        </h2>
        <p className={p}>{r.no_look_ahead_rule.text}</p>
      </section>

      <section className="space-y-3">
        <h2 id="output" className={h2}>
          The output line
        </h2>
        <p className={p}>Every grade ends in one mechanical sentence built from the inputs, for example:</p>
        <p className="max-w-3xl rounded-md border border-white/10 px-3 py-2 text-sm text-slate-200">
          &ldquo;Underwritten at a [X]% discount (or premium) to replacement with a [N]bp spread; [k] of 5 factors graded.&rdquo;
        </p>
        <p className={p}>We grade deals, never buyers. Nothing here adds up or ranks grades by company.</p>
      </section>

      <section className="space-y-3">
        <h2 id="versions" className={h2}>
          Version history
        </h2>
        <ul className="max-w-3xl list-disc space-y-1 pl-5 text-[15px] text-slate-200">
          <li>
            Rubric {r.rubric_version}, {fmtDate(r.drafted_on)}: first version, published before any deal was graded.
          </li>
        </ul>
        <p className={p}>{r.versioning} The original grade is never overwritten.</p>
      </section>
    </div>
  );
}
