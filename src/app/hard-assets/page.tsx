import type { Metadata } from "next";
import Link from "next/link";
import { HardAssetsTabs } from "@/components/sound-assets/HardAssetsTabs";
import { ThesisBand } from "@/components/sound-assets/ThesisBand";
import { DraftNote } from "@/components/sound-assets/DraftNote";
import { REGISTER, SCORECARD, SHOW_DRAFTS } from "@/lib/sound-assets";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Sound Assets · Bungah Capital Intel",
  description:
    "An editorial thesis section: how we define soundness, how five assets score on the same eight criteria, and the evidence for and against.",
  alternates: { canonical: "/hard-assets" },
};

const card =
  "group relative block rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/30 hover:bg-white/[0.05]";

export default function HardAssetsPage() {
  const supporting = REGISTER.entries.filter((e) => e.direction === "supports").length;
  const opposing = REGISTER.entries.filter((e) => e.direction === "opposes").length;
  const nCells = SCORECARD.cells.length;
  const weakSpots = SCORECARD.btc_weak_spots.length;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <HardAssetsTabs active="thesis" />
        <ThesisBand />
      </div>

      <header className="space-y-3">
        <h1 className="t-h1 max-w-3xl">Bitcoin is the most sound asset humans have ever had access to.</h1>
        <p className="max-w-3xl t-lead">
          This is our thesis. We test it by defining soundness in operational terms, scoring five assets on the same
          criteria, and keeping a public register of the evidence for and against.
        </p>
        <DraftNote />
      </header>

      <section aria-labelledby="define" className="space-y-3">
        <h2 id="define" className="t-h2">
          How we define soundness
        </h2>
        <p className="max-w-3xl text-[15px] text-slate-200">
          An asset is sound to the extent it meets these eight criteria. Each one is scored for every asset on the
          scorecard, and every score links to its evidence.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SCORECARD.criteria.map((c, i) => (
            <li key={c.id}>
              <Link href={`/hard-assets/scorecard#${c.id}`} className={`${card} h-full`}>
                <div className="text-xs text-slate-400">{String(i + 1).padStart(2, "0")}</div>
                <div className="mt-1 font-medium text-white">{c.name}</div>
                <p className="mt-1 text-[13px] leading-snug text-slate-300">{c.definition}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Scorecard, evidence and method" className="grid gap-3 md:grid-cols-3">
        <Link href="/hard-assets/scorecard" className={card}>
          <div className="text-xs font-medium uppercase tracking-wider text-slate-300">Soundness scorecard</div>
          <div className="mt-1 text-lg font-semibold text-white">8 criteria × 5 assets</div>
          <p className="mt-1 text-[13px] text-slate-300">
            Bitcoin, gold, hotel real estate, U.S. T-bills and the U.S. dollar. {nCells} cells, each with a cited source,
            including Bitcoin&rsquo;s weak spots.{SHOW_DRAFTS ? ` ${SCORECARD.status}.` : ""}
          </p>
          <p className="mt-2 text-[13px] font-medium text-slate-200">Includes {weakSpots} weak spots</p>
        </Link>
        <Link href="/hard-assets/evidence" className={card}>
          <div className="text-xs font-medium uppercase tracking-wider text-slate-300">Evidence register</div>
          <div className="mt-1 text-lg font-semibold text-white">
            {supporting} supporting · {opposing} opposing
          </div>
          <p className="mt-1 text-[13px] text-slate-300">
            Every item of evidence for and against the thesis, graded by strength. Append-only.
          </p>
        </Link>
        <Link href="/hard-assets/methodology" className={card}>
          <div className="text-xs font-medium uppercase tracking-wider text-slate-300">Methodology</div>
          <div className="mt-1 text-lg font-semibold text-white">Scale, sources, vintages</div>
          <p className="mt-1 text-[13px] text-slate-300">
            How cells are scored, where each number comes from, and how corrections are logged.
          </p>
        </Link>
      </section>

      <section aria-labelledby="related" className="space-y-3">
        <h2 id="related" className="text-lg font-semibold text-white">
          Related section
        </h2>
        <Link href="/sound-money-lodging" className={`${card} max-w-xl`}>
          <div className="font-medium text-white">Sound Asset Lodging</div>
          <p className="mt-1 text-[13px] text-slate-300">
            Treasury, capital stack and operations tools for hotel investors. A separate section.
          </p>
        </Link>
      </section>
    </div>
  );
}
