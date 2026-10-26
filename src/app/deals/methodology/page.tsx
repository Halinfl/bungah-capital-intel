import type { Metadata } from "next";
import { DealsSubnav } from "@/components/deals/DealsSubnav";
import { UnderwriteNote } from "@/components/deals/DotBar";
import { RUBRIC, fmtDate } from "@/lib/deals";

export const metadata: Metadata = {
  title: "Recent Deals methodology · Bungah Capital Intel",
  description: "How Recent Deals grades US hotel sales: the inclusion rule, rubric v1 factors, weights and bands, the missing-factor rule and the no-look-ahead rule.",
  alternates: { canonical: "/deals/methodology" },
};

const SOURCES: Record<string, { source: string; asOf: string }> = {
  replacement_cost: {
    source:
      "HVS U.S. Hotel Development Cost Survey (free): median total development cost per key, including land, blended by keys across the HVS classes of the hotels in the deal; edition and classes stated",
    asOf: "Latest edition published before the announcement",
  },
  spread: {
    source:
      "Cap rate on NOI for the trailing 12 months through the last quarter before the announcement (disclosed, or disclosed NOI divided by price); other bases are shown but not graded; 10-year yield from the U.S. Treasury daily par yield curve",
    asOf: "10-year yield at the close on the announcement date",
  },
  supply: {
    source:
      "One public source (CBRE or PwC outlooks, other free publications, or our supply radars) giving the total pipeline, under construction plus planned, as a share of existing rooms; never combined across sources or stages; partial-stage figures are context only",
    asOf: "Published before the announcement",
  },
  demand: {
    source:
      "Published lodging tax receipts, trailing 12 months vs the prior 12 months (fiscal year to date only if a 12-month series can't be built from public numbers); single months are context, never scored; Tuesday Trends forward curve as context for deals from October 2026",
    asOf: "Latest month published by the announcement date",
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
        <p className={p}>US means the 50 states and DC. Puerto Rico and other US territories are excluded.</p>
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
        <ul className="space-y-3 md:hidden">
          {r.factors.map((f) => (
            <li key={`${f.id}-m`} className="rounded-xl border border-white/10 p-3 text-sm">
              <div className="font-medium text-white">
                {f.label} <span className="font-normal text-slate-400">{Math.round(f.weight * 100)}%</span>
              </div>
              <p className="mt-1 text-[13px] text-slate-200">{SOURCES[f.id].source}</p>
              <p className="mt-1 text-[13px] text-slate-300">As of: {SOURCES[f.id].asOf}</p>
            </li>
          ))}
        </ul>
        <div className="hidden md:block">
          <table className="w-full text-left text-sm">
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
        <p className="max-w-3xl text-sm text-slate-300">Score 5 is the top band set by the editor. Scores 4 to 1 step down evenly from it.</p>
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
                      <span className="text-xs text-slate-400"> · {b.set_by === "Hal" ? "top band" : "stepped down"}</span>
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
            Rubric {r.rubric_version}, {fmtDate(r.drafted_on)}: first version, approved and published before any deal was graded. Same day, before
            any grade: named the cap-rate basis (trailing-12-month NOI), the 10-year timing (close on the announcement date), the demand measure
            (trailing 12 vs prior 12 months), the replacement-cost basis (HVS median including land, blended by keys), the supply source rule (one
            source, total pipeline) and the geography (50 states and DC).
          </li>
        </ul>
        <p className={p}>{r.versioning} The original grade is never overwritten.</p>
      </section>
    </div>
  );
}
