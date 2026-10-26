import type { Metadata } from "next";
import Link from "next/link";
import { HardAssetsTabs } from "@/components/sound-assets/HardAssetsTabs";
import { ThesisBand } from "@/components/sound-assets/ThesisBand";
import { DraftNote } from "@/components/sound-assets/DraftNote";
import { SourceLink } from "@/components/sound-assets/SourceLink";
import { ScoreBar } from "@/components/sound-assets/ScoreBar";
import { AnchorScroll } from "@/components/sound-assets/AnchorScroll";
import { SCORECARD, cell, fmtDate, type Cell } from "@/lib/sound-assets";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Soundness scorecard · Sound Assets · Bungah Capital Intel",
  description:
    "Bitcoin, gold, hotel real estate, U.S. T-bills and the U.S. dollar scored on eight soundness criteria, every cell linked to evidence.",
};

/*
 * Sticky stack: site nav is 61px (py-3 + 36px controls + 1px border). Mobile adds the criterion chip row
 * (49px); desktop adds the sticky table header (~41px). Anchors use scroll-margin-top 118px, which clears
 * the taller of the two stacks (61 + 49 = 110) with 8px to spare.
 */
const ANCHOR_MT = "scroll-mt-[118px]";

/** Full evidence for one cell, same disclosure pattern as sources on Radars. */
function Evidence({ c, withRationale = true }: { c: Cell; withRationale?: boolean }) {
  return (
    <>
      {withRationale ? <p className="mb-1.5 text-[13px] leading-snug text-slate-200">{c.rationale}</p> : null}
      <ul className="space-y-1 border-l border-white/10 pl-3 text-xs leading-snug">
        {c.evidence.map((id) => (
          <li key={id}>
            <SourceLink id={id} />
          </li>
        ))}
      </ul>
      {c.scored_on !== SCORECARD.scored_on ? (
        <div className="mt-1 text-xs text-slate-400">Scored {fmtDate(c.scored_on)}</div>
      ) : null}
    </>
  );
}

/** Score and dots on one line (never wraps), label on its own line underneath: same shape in every cell. */
function ScoreLine({ c }: { c: Cell }) {
  return (
    <div>
      <div className="flex items-center gap-2 whitespace-nowrap">
        <span className="text-base font-semibold leading-6 tabular-nums text-white">
          {c.score}
          <span className="text-xs font-normal text-slate-400">/{SCORECARD.scale.max}</span>
        </span>
        <ScoreBar score={c.score} max={SCORECARD.scale.max} />
      </div>
      <div className="text-[13px] leading-5 text-slate-200">{c.label}</div>
    </div>
  );
}

/**
 * Desktop cell: score + bar, label, then the full rationale, wrapping to as many lines as it needs. Nothing on
 * this page is truncated. Sources sit behind the disclosure. Neutral gray for all assets.
 */
function DesktopCell({ c }: { c: Cell }) {
  return (
    <div className="space-y-1.5">
      <ScoreLine c={c} />
      <p className="text-[13px] leading-snug text-slate-300">{c.rationale}</p>
      <details className="group text-xs text-slate-200">
        <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded text-slate-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60 [&::-webkit-details-marker]:hidden">
          <span aria-hidden="true" className="transition-transform group-open:rotate-90">›</span>
          Evidence ({c.evidence.length})
        </summary>
        <div className="mt-1.5">
          <Evidence c={c} withRationale={false} />
        </div>
      </details>
    </div>
  );
}

export default function ScorecardPage() {
  const { assets, criteria, scale } = SCORECARD;
  return (
    <div className="space-y-8">
      <AnchorScroll />
      <HardAssetsTabs active="scorecard" />

      {/* Mobile: sticky criterion chips under the sub-tabs; right-edge fade signals the row scrolls. */}
      <div className="sticky top-[61px] z-30 -mx-4 -mt-6 border-b border-white/10 bg-[#2f333c]/95 backdrop-blur-md lg:hidden">
        <nav aria-label="Jump to criterion" className="overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex gap-2 whitespace-nowrap pr-8">
            {criteria.map((cr) => (
              <li key={cr.id}>
                <a
                  href={`#${cr.id}`}
                  className="inline-block rounded-full border border-white/15 px-3 py-1 text-[13px] text-slate-200 hover:border-white/40 hover:text-white"
                >
                  {cr.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#2f333c] to-transparent" />
      </div>

      <ThesisBand />

      <header className="space-y-3">
        <h1 className="t-h1">Soundness scorecard</h1>
        <p className="max-w-3xl t-lead">
          Five assets, eight criteria, one scale. Scores run from {scale.min} (very weak) to {scale.max} (very strong) on
          each criterion. Every cell links to the source behind it.
        </p>
        <div className="flex flex-wrap gap-2">
          <DraftNote>Scores are a draft, for Hal&rsquo;s review.</DraftNote>
        </div>
        <p className="max-w-3xl text-[13px] text-slate-300">
          There is no composite total: how to weight the criteria is an editorial choice we have not made yet. Criteria are
          defined on the{" "}
          <Link href="/hard-assets" className="underline underline-offset-2 hover:text-white">
            thesis page
          </Link>
          ; scoring rules are in the{" "}
          <Link href="/hard-assets/methodology" className="underline underline-offset-2 hover:text-white">
            methodology
          </Link>
          .
        </p>
      </header>

      <div className="space-y-2">
        <p className="text-[13px] text-slate-300">Scored {fmtDate(SCORECARD.scored_on)}</p>

        {/* Desktop matrix. No overflow wrapper, so the header row sticks to the viewport under the nav. */}
        <div className="hidden rounded-xl border border-white/10 lg:block">
          <table className="w-full table-fixed border-separate border-spacing-0 text-left">
            <caption className="sr-only">Soundness scores by criterion and asset</caption>
            <colgroup>
              <col className="w-[150px]" />
              {assets.map((a) => (
                <col key={a.id} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 top-[61px] z-20 rounded-tl-xl border-b border-white/10 bg-[#363a43] px-3 py-2.5 text-xs font-medium uppercase tracking-wider text-slate-300"
                >
                  Criterion
                </th>
                {assets.map((a, i) => (
                  <th
                    key={a.id}
                    scope="col"
                    className={`sticky top-[61px] z-10 border-b border-white/10 bg-[#363a43] px-3 py-2.5 text-sm font-semibold text-white ${
                      i === assets.length - 1 ? "rounded-tr-xl" : ""
                    }`}
                  >
                    {a.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criteria.map((cr, ri) => (
                <tr key={cr.id} data-anchor={cr.id} className={`${ANCHOR_MT} align-top`}>
                  <th
                    scope="row"
                    className={`sticky left-0 z-[5] bg-[#30343d] px-3 py-3 text-sm font-medium text-white ${
                      ri < criteria.length - 1 ? "border-b border-white/10" : ""
                    }`}
                  >
                    {cr.name}
                  </th>
                  {assets.map((a) => (
                    <td
                      key={a.id}
                      className={`border-l border-white/[0.06] px-3 py-3 ${ri < criteria.length - 1 ? "border-b border-b-white/10" : ""}`}
                    >
                      <DesktopCell c={cell(a.id, cr.id)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: one card per criterion, one compact row per asset; tap a row for evidence. */}
        <ul className="space-y-3 lg:hidden">
          {criteria.map((cr) => (
            <li key={cr.id} id={cr.id} className={`${ANCHOR_MT} rounded-xl border border-white/10 bg-white/[0.03] px-4 pb-2 pt-3`}>
              <h2 className="font-semibold text-white">{cr.name}</h2>
              <p className="mt-0.5 text-[13px] leading-snug text-slate-300">{cr.definition}</p>
              <ul className="mt-2 divide-y divide-white/[0.08]">
                {assets.map((a) => {
                  const c = cell(a.id, cr.id);
                  return (
                    <li key={a.id}>
                      <details className="group">
                        <summary className="flex cursor-pointer list-none items-center gap-2 py-2.5 text-sm [&::-webkit-details-marker]:hidden">
                          <span className="font-medium text-white">{a.name}</span>
                          <span className="text-slate-400">·</span>
                          <span className="tabular-nums font-semibold text-white">
                            {c.score}/{SCORECARD.scale.max}
                          </span>
                          <span className="text-slate-200">{c.label}</span>
                          <span className="ml-auto flex items-center gap-2">
                            <ScoreBar score={c.score} max={SCORECARD.scale.max} />
                            <span aria-hidden className="text-slate-300 transition-transform group-open:rotate-90">›</span>
                          </span>
                        </summary>
                        <div className="pb-3">
                          <Evidence c={c} />
                        </div>
                      </details>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <section aria-labelledby="weak" className="space-y-3">
        <h2 id="weak" className="t-h2">
          Bitcoin&rsquo;s weak spots, stated plainly
        </h2>
        <p className="max-w-3xl text-[15px] text-slate-200">
          Some risks sit outside the eight criteria or cut across them. They count against the thesis and are logged in the{" "}
          <Link href="/hard-assets/evidence" className="underline underline-offset-2 hover:text-white">
            evidence register
          </Link>
          .
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SCORECARD.btc_weak_spots.map((w) => (
            <li key={w.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="font-medium text-white">{w.label}</div>
              <p className="mt-1 text-[13px] leading-snug text-slate-300">{w.detail}</p>
              <div className="mt-2 flex flex-col gap-0.5 text-xs">
                {w.evidence.map((id) => (
                  <SourceLink key={id} id={id} short />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
