import type { Metadata } from "next";
import Link from "next/link";
import { HardAssetsTabs } from "@/components/sound-assets/HardAssetsTabs";
import { ThesisBand } from "@/components/sound-assets/ThesisBand";
import { DraftNote } from "@/components/sound-assets/DraftNote";
import { EvidenceRegister } from "@/components/sound-assets/EvidenceRegister";
import { REGISTER } from "@/lib/sound-assets";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Evidence register · Sound Assets · Bungah Capital Intel",
  description: "Every item of evidence for and against the thesis, graded by strength, with its source. Append-only.",
};

export default function EvidencePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <HardAssetsTabs active="evidence" />
        <ThesisBand />
      </div>
      <header className="space-y-3">
        <h1 className="t-h1">Evidence register</h1>
        <p className="max-w-3xl t-lead">
          The standing catalog of evidence for and against the thesis. Each entry carries a direction, a strength grade, a
          source and the date it was added.
        </p>
        <DraftNote>Strength grades are a draft, for Hal&rsquo;s review.</DraftNote>
        <p className="max-w-3xl text-[13px] text-slate-300">
          Append-only: entries are never edited or deleted. If an entry turns out to be wrong, the correction is logged on
          the{" "}
          <Link href="/errata" className="underline underline-offset-2 hover:text-white">
            errata page
          </Link>{" "}
          and a new entry is added. Strength: <em>strong</em> = verifiable source, directly tests a soundness criterion; <em>moderate</em> =
          relevant but partial, indirect or secondary-sourced; <em>weak</em> = suggestive only.
        </p>
      </header>
      <EvidenceRegister entries={REGISTER.entries} />
      {REGISTER.gaps?.length ? (
        <section aria-labelledby="gaps" className="max-w-3xl space-y-2">
          <h2 id="gaps" className="text-lg font-semibold text-white">
            Gaps
          </h2>
          <p className="text-[13px] text-slate-300">Evidence we looked for but could not read from a public source. Not counted above.</p>
          <ul className="space-y-1.5 text-[13px] text-slate-200">
            {REGISTER.gaps.map((g) => (
              <li key={g.item}>
                <a href={g.url} target="_blank" rel="noopener noreferrer" className="underline decoration-white/30 underline-offset-2 hover:text-white">
                  {g.item} ↗
                </a>
                : {g.reason}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
