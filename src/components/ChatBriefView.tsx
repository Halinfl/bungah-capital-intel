"use client";

import { useEffect, useId, useState } from "react";
import { MarkdownLite } from "@/components/MarkdownLite";

export type BriefSource = { kind: "Filing" | "Press" | "Record" | "Data"; label: string; url?: string };
export type BriefRead = { text: string; asOf: string | null; source: BriefSource };
export type BriefSection = { id: string; title: string; count: number; markdown: string };
export type ChatBrief = {
  decline?: string;
  answer: string;
  reads: BriefRead[];
  coverage: string;
  sections: BriefSection[];
  footer: string;
  collapsedChars: number;
};

/** Neutral source chip (same chip names as Recent Deals); links to the original when there is one. */
function SourceKindChip({ source }: { source: BriefSource }) {
  const cls =
    "ml-1.5 inline-flex shrink-0 items-center rounded-full border border-white/25 px-2 py-0.5 align-middle text-xs leading-none text-slate-200";
  return source.url ? (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      title={source.label}
      aria-label={`${source.kind}: ${source.label} (opens original)`}
      className={`${cls} hover:border-white/50 hover:text-white`}
    >
      {source.kind}
    </a>
  ) : (
    <span title={source.label} aria-label={`${source.kind}: ${source.label}`} className={cls}>
      {source.kind}
    </span>
  );
}

function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return mobile;
}

/**
 * Short answer first, detail on tap: answer line, up to three key reads with source chips, a
 * coverage line, then collapsed detail sections (one open at a time on mobile), then one
 * decision-support line.
 */
export function ChatBriefView({ brief }: { brief: ChatBrief }) {
  const [open, setOpen] = useState<string[]>([]);
  const mobile = useIsMobile();
  const uid = useId();
  const toggle = (id: string) =>
    setOpen((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : mobile ? [id] : [...cur, id]));

  return (
    <div className="space-y-3 text-sm leading-relaxed text-slate-200">
      {brief.decline ? (
        <div className="rounded-md border border-white/15 bg-white/[0.03] px-3 py-2 text-slate-100">
          <MarkdownLite text={brief.decline} />
        </div>
      ) : null}
      <div className="text-[15px] leading-snug text-white">
        <MarkdownLite text={brief.answer} />
      </div>
      {brief.reads.length ? (
        <ul className="space-y-1.5" aria-label="Key reads">
          {brief.reads.map((r, i) => (
            <li key={i} className="flex gap-2 text-slate-200">
              <span aria-hidden className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-slate-400" />
              <span className="min-w-0">
                {r.text}
                {r.asOf ? <span className="text-slate-300"> · {r.asOf}</span> : null}
                <SourceKindChip source={r.source} />
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="text-xs leading-snug text-slate-300">
        <MarkdownLite text={brief.coverage} />
      </div>

      {brief.sections.length ? (
        <div className="divide-y divide-white/[0.06] rounded-lg border border-white/[0.08]">
          {brief.sections.map((s) => {
            const isOpen = open.includes(s.id);
            const panel = `${uid}-${s.id}`;
            return (
              <div key={s.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panel}
                  onClick={() => toggle(s.id)}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm text-slate-100 hover:bg-white/[0.03] focus-visible:bg-white/[0.04] focus-visible:outline-none"
                >
                  <span>
                    {s.title} <span className="text-slate-300">({s.count})</span>
                  </span>
                  <span aria-hidden className={`text-xs text-slate-300 transition-transform ${isOpen ? "rotate-90" : ""}`}>
                    ▸
                  </span>
                </button>
                {isOpen ? (
                  <div id={panel} className="px-3 pb-3 pt-1">
                    <MarkdownLite text={s.markdown} />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      <p className="text-xs text-slate-300">{brief.footer}</p>
    </div>
  );
}
