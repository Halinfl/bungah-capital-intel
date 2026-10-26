import type { Metadata } from "next";
import { DraftNote } from "@/components/sound-assets/DraftNote";
import errata from "@/data/errata.json";

export const metadata: Metadata = {
  title: "Errata · Bungah Capital Intel",
  description: "Every correction to anything we have published: what was wrong, how we found it, and what we changed.",
  alternates: { canonical: "/errata" },
};

type Erratum = { entry_date: string; what_was_wrong: string; how_discovered: string; correction: string; page?: string };

export default function ErrataPage() {
  const entries = (errata.entries as Erratum[]).slice().sort((a, b) => b.entry_date.localeCompare(a.entry_date));
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="t-h1">Errata</h1>
        <p className="max-w-3xl t-lead">
          Every correction to anything we publish, logged in public. Nothing is quietly edited.
        </p>
      </header>

      {entries.length === 0 ? (
        <div className="max-w-3xl rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="font-medium text-white">No corrections logged yet.</div>
          <p className="mt-1 text-[13px] text-slate-300">When one is needed, it appears here first, newest on top.</p>
        </div>
      ) : (
        <ul className="max-w-3xl space-y-3">
          {entries.map((e, i) => (
            <li key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-200">
              <div className="text-xs text-slate-400">{e.entry_date}{e.page ? ` · ${e.page}` : ""}</div>
              <p className="mt-1"><span className="text-slate-400">What was wrong:</span> {e.what_was_wrong}</p>
              <p><span className="text-slate-400">How we found it:</span> {e.how_discovered}</p>
              <p><span className="text-slate-400">Correction:</span> {e.correction}</p>
            </li>
          ))}
        </ul>
      )}

      <section className="max-w-3xl space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-white">How corrections are logged</h2>
        <ol className="list-decimal space-y-1.5 pl-5 text-[15px] text-slate-200">
          <li>Each correction records the date, what was wrong, how it was discovered and what was changed, plus the page affected.</li>
          <li>The log is append-only. Entries are never edited or removed.</li>
          <li>The corrected page links back here. The original claim stays visible as corrected; it is not silently rewritten.</li>
          <li>Published calls and register entries are never edited in place. A correction is a new, dated entry.</li>
          <li>Spot an error? Tell us and we will log it, including when the report turns out to be right.</li>
        </ol>
        <div className="pt-1"><DraftNote /></div>
      </section>
    </div>
  );
}
