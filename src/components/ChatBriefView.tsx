"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { MarkdownLite } from "@/components/MarkdownLite";

export type DateRange = "90d" | "12m" | "all";
/** title / publisher / date are present only when the cited row has them (never invented). */
export type BriefSource = {
  kind: "Filing" | "Press" | "Record" | "Data";
  label: string;
  url?: string;
  title?: string;
  publisher?: string;
  date?: string;
};
export type BriefRead = { text: string; asOf: string | null; source: BriefSource };
export type BriefSection = { id: string; title: string; count: number; markdown: string };
export type ChatBrief = {
  decline?: string;
  answer: string;
  reads: BriefRead[];
  coverage: string;
  basedOn?: string;
  coverageNotes?: string[];
  span?: { sources: number; dated: number; from: string | null; to: string | null; label: string | null };
  window?: { range: DateRange; filterable: boolean };
  sections: BriefSection[];
  /** Section bodies were left off the response; `loadSections` fetches them on first open. */
  sectionsLazy?: boolean;
  footer: string;
  collapsedChars: number;
};

const RANGES: { id: DateRange; label: string }[] = [
  { id: "90d", label: "Last 90 days" },
  { id: "12m", label: "Last 12 months" },
  { id: "all", label: "All" },
];
const CHIP_LABEL: Record<DateRange, string> = { "90d": "Last 90 days", "12m": "Last 12 months", all: "All dates" };

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

/** Close on Escape (focus back to the opener) and on a press outside `box`. */
function useDismiss(open: boolean, close: () => void, box: React.RefObject<HTMLElement | null>, opener: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        opener.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (box.current?.contains(t) || opener.current?.contains(t)) return;
      close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, close, box, opener]);
}

/**
 * Chips look compact but are 44×44 px tap targets: the button is the hit area (negative vertical
 * margin keeps the line height), the inner pill is what you see. Pill border slate-400 on the
 * #1f2228 card is ≥3:1 contrast.
 */
const hitCls =
  "group -my-[13px] inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full align-middle focus-visible:outline-none";
const pillCls =
  "inline-flex items-center gap-1 rounded-full border border-slate-400 px-2 py-0.5 text-xs leading-none text-slate-100 group-hover:border-slate-200 group-hover:text-white group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-1 group-focus-visible:outline-slate-200";

/** Keep Tab / Shift+Tab inside a modal box. */
function trapTab(e: React.KeyboardEvent, box: HTMLElement | null) {
  if (e.key !== "Tab" || !box) return;
  const items = [...box.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement as HTMLElement | null;
  if (e.shiftKey && (active === first || !box.contains(active))) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && (active === last || !box.contains(active))) {
    e.preventDefault();
    first.focus();
  }
}

/**
 * Source chip (Filing / Press / Record / Data). Tapping opens a preview: a popover on desktop,
 * a bottom sheet on mobile, with the source title, publisher, date, the quoted fact and an
 * "Open source" link. Fields the source doesn't have are left out.
 */
function SourceChip({ read, open, onOpen, onClose, mobile }: { read: BriefRead; open: boolean; onOpen: () => void; onClose: () => void; mobile: boolean }) {
  const s = read.source;
  const btn = useRef<HTMLButtonElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const id = useId();
  const [alignRight, setAlignRight] = useState(false);
  // On mobile the sheet is modal: closing it (backdrop, outside press, ✕, Esc) returns focus to the chip.
  const closeToChip = useCallback(() => {
    onClose();
    if (mobile) window.setTimeout(() => btn.current?.focus(), 0);
  }, [onClose, mobile]);
  useDismiss(open, closeToChip, box, btn);
  useEffect(() => {
    if (!open) return;
    const r = btn.current?.getBoundingClientRect();
    if (r) setAlignRight(r.left + 304 > window.innerWidth - 12);
    // Move focus into the preview so keyboard and screen-reader users land on it.
    const t = window.setTimeout(() => box.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  const title = s.title ?? s.label;
  const publisher = s.publisher && s.publisher !== title ? s.publisher : null;
  const date = s.date ?? read.asOf ?? null;

  const body = (
    <div
      ref={box}
      id={`${id}-dlg`}
      role="dialog"
      aria-modal={mobile ? true : undefined}
      aria-labelledby={`${id}-t`}
      data-testid="source-preview"
      onKeyDown={mobile ? (e) => trapTab(e, box.current) : undefined}
      className={
        mobile
          ? "fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-2xl border-t border-white/15 bg-[#2b2f37] px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] text-left shadow-2xl"
          : `absolute top-full z-40 mt-1.5 w-[19rem] rounded-xl border border-white/15 bg-[#2b2f37] p-3.5 text-left shadow-2xl ${alignRight ? "right-0" : "left-0"}`
      }
    >
      {mobile ? <div aria-hidden className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/25" /> : null}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-[0.12em] text-slate-300">{s.kind}</div>
          <div id={`${id}-t`} className="mt-0.5 text-sm font-medium leading-snug text-white [overflow-wrap:anywhere]">
            {title}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            onClose();
            btn.current?.focus();
          }}
          aria-label="Close source preview"
          data-autofocus={s.url ? undefined : true}
          className="-mr-2.5 -mt-2.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-base text-slate-300 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-300"
        >
          ✕
        </button>
      </div>
      {publisher || date ? (
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs text-slate-300">
          {publisher ? (
            <>
              <dt className="text-slate-400">Publisher</dt>
              <dd className="text-slate-200 [overflow-wrap:anywhere]">{publisher}</dd>
            </>
          ) : null}
          {date ? (
            <>
              <dt className="text-slate-400">As of</dt>
              <dd className="text-slate-200">{date}</dd>
            </>
          ) : null}
        </dl>
      ) : null}
      <blockquote className="mt-2.5 border-l-2 border-white/20 pl-2.5 text-sm leading-snug text-slate-100 [overflow-wrap:anywhere]">{read.text}</blockquote>
      {s.url ? (
        <a
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          data-autofocus
          className="mt-3 inline-flex min-h-11 items-center gap-1 rounded-md border border-slate-400 px-3 py-2 text-sm text-slate-100 hover:border-white/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-300"
        >
          Open source <span aria-hidden>↗</span>
        </a>
      ) : null}
    </div>
  );

  return (
    <span
      className="relative inline-block align-middle"
      // Desktop popover is not modal: tabbing out of it (and off its chip) closes it.
      onBlur={(e) => {
        if (!mobile && open && e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) onClose();
      }}
    >
      <button
        ref={btn}
        type="button"
        onClick={() => (open ? onClose() : onOpen())}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? `${id}-dlg` : undefined}
        aria-label={`${s.kind}: ${s.label}. Preview source`}
        className={`ml-0.5 ${hitCls}`}
      >
        <span className={pillCls}>{s.kind}</span>
      </button>
      {open ? (
        mobile ? (
          <>
            <span aria-hidden className="fixed inset-0 z-40 bg-black/50" onClick={closeToChip} />
            {body}
          </>
        ) : (
          body
        )
      ) : null}
    </span>
  );
}

/** The date-window chip on the "based on" line: re-asks the same question for that window. */
function RangeChip({ range, onPick }: { range: DateRange; onPick: (r: DateRange) => void }) {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const id = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, box, btn);
  useEffect(() => {
    if (open) box.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus();
  }, [open]);
  const onMenuKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = [...(box.current?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? [])];
    const i = items.indexOf(document.activeElement as HTMLElement);
    items[(i + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length]?.focus();
  };
  return (
    <span className="relative inline-block align-baseline">
      <button
        ref={btn}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${id}-m` : undefined}
        aria-label={`Date range: ${CHIP_LABEL[range]}. Change and ask again`}
        data-testid="range-chip"
        onClick={() => setOpen((o) => !o)}
        className={`ml-0.5 ${hitCls}`}
      >
        <span className={pillCls}>
          {CHIP_LABEL[range]} <span aria-hidden>▾</span>
        </span>
      </button>
      {open ? (
        <div
          ref={box}
          id={`${id}-m`}
          role="menu"
          aria-label="Ask again for"
          onKeyDown={onMenuKey}
          className="absolute left-0 top-full z-40 mt-1 w-44 rounded-lg border border-white/15 bg-[#2b2f37] p-1 shadow-2xl"
        >
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              role="menuitemradio"
              aria-checked={r.id === range}
              onClick={() => {
                setOpen(false);
                if (r.id !== range) onPick(r.id);
              }}
              className="flex min-h-11 w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-sm text-slate-100 hover:bg-white/[0.06] focus-visible:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-slate-300"
            >
              {r.label}
              {r.id === range ? <span aria-hidden className="text-slate-300">✓</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </span>
  );
}

/**
 * Short answer first, detail on tap: answer line, up to three key reads with source chips, a
 * coverage line ("based on" count and date span, with the date-window chip), then collapsed
 * detail sections (one open at a time on mobile), then one decision-support line.
 */
export function ChatBriefView({
  brief,
  onReask,
  loadSections,
}: {
  brief: ChatBrief;
  onReask?: (range: DateRange) => void;
  /** Lazy section bodies (brief.sectionsLazy): fetched once, the first time a section is opened. */
  loadSections?: () => Promise<BriefSection[]>;
}) {
  const [open, setOpen] = useState<string[]>([]);
  const [full, setFull] = useState<BriefSection[] | null>(null);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "error">("idle");
  const fetchSections = useCallback(() => {
    if (!brief.sectionsLazy || !loadSections || full || loadState === "loading") return;
    setLoadState("loading");
    loadSections().then(
      (x) => {
        setFull(x);
        setLoadState("idle");
      },
      () => setLoadState("error")
    );
  }, [brief.sectionsLazy, loadSections, full, loadState]);
  const [preview, setPreview] = useState<number | null>(null);
  const mobile = useIsMobile();
  const uid = useId();
  const toggle = (id: string) => {
    if (!open.includes(id)) fetchSections();
    setOpen((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : mobile ? [id] : [...cur, id]));
  };
  const closePreview = useCallback(() => setPreview(null), []);
  const showChip = Boolean(brief.window?.filterable && onReask);

  return (
    <div className="min-w-0 space-y-3 text-sm leading-relaxed text-slate-200 [overflow-wrap:anywhere]">
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
                <SourceChip read={r} mobile={mobile} open={preview === i} onOpen={() => setPreview(i)} onClose={closePreview} />
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="text-xs leading-snug text-slate-300" data-testid="based-on">
        {brief.basedOn ? (
          <p>
            {/* With the chip shown, the window is on the chip itself. */}
            {showChip ? brief.basedOn.replace(/ \((last 90 days|last 12 months)\)\.$/, ".") : brief.basedOn}
            {showChip ? <RangeChip range={brief.window!.range} onPick={(r) => onReask!(r)} /> : null}
            {brief.coverageNotes?.length ? (
<span> {brief.coverageNotes.join(" ").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")}</span>
            ) : null}
          </p>
        ) : (
          <MarkdownLite text={brief.coverage} />
        )}
      </div>

      {brief.sections.length ? (
        <div className="divide-y divide-white/[0.06] rounded-lg border border-white/[0.08]">
          {brief.sections.map((s) => {
            const isOpen = open.includes(s.id);
            const md = !brief.sectionsLazy ? s.markdown : full ? (full.find((x) => x.id === s.id)?.markdown ?? "") : null;
            const panel = `${uid}-${s.id}`;
            return (
              <div key={s.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panel}
                  onClick={() => toggle(s.id)}
                  className="flex min-h-11 w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm text-slate-100 hover:bg-white/[0.03] focus-visible:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-slate-300"
                >
                  <span>
                    {s.title} <span className="text-slate-300">({s.count})</span>
                  </span>
                  <span aria-hidden className={`text-xs text-slate-300 transition-transform ${isOpen ? "rotate-90" : ""}`}>
                    ▸
                  </span>
                </button>
                {isOpen ? (
                  <div id={panel} aria-busy={md === null && loadState === "loading"} className="min-w-0 overflow-x-auto px-3 pb-3 pt-1 [overflow-wrap:anywhere]">
                    {md !== null ? (
                      <MarkdownLite text={md} />
                    ) : loadState === "error" ? (
                      <p className="text-slate-300">
                        Couldn&apos;t load this section.{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setLoadState("idle");
                            setTimeout(fetchSections, 0);
                          }}
                          className="min-h-11 underline decoration-white/40 underline-offset-2 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-200"
                        >
                          Try again
                        </button>
                      </p>
                    ) : (
                      <p className="text-slate-300" role="status">Loading…</p>
                    )}
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
