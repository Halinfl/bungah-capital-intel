import { SourceChip } from "./SourceChip";

export type StatChange = {
  direction: "up" | "down";
  /** Cited prior-period comparison, e.g. "+1.8% vs 2024". Only pass one the source states. */
  text: string;
};

export function StatCard({
  label,
  value,
  hint,
  sourceLabel,
  change,
  size = "md",
}: {
  label: string;
  value: string;
  hint?: string;
  sourceLabel?: string;
  /** Up/down arrow; render only with a cited prior-period figure. */
  change?: StatChange;
  /**
   * "md": boxed tile (market pages). "flat": no box, for number-first finding cards; the change
   * row is always reserved so numbers and titles line up across a row of cards.
   */
  size?: "md" | "flat";
}) {
  if (size === "flat") {
    return (
      <div>
        <div className="text-xs uppercase tracking-wider text-slate-300">{label}</div>
        <div className="mt-1 text-4xl font-semibold leading-none tracking-tight text-white tabular-nums sm:text-5xl">
          {value}
        </div>
        <div className="mt-2 flex h-5 items-center text-sm font-medium text-slate-200 tabular-nums">
          {change ? (
            <span className="inline-flex items-center gap-1">
              <span aria-hidden="true">{change.direction === "up" ? "▲" : "▼"}</span>
              <span className="sr-only">{change.direction === "up" ? "Up" : "Down"}</span>
              {change.text}
            </span>
          ) : null}
        </div>
        {hint ? <div className="mt-0.5 text-xs text-slate-300">{hint}</div> : null}
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-4">
      <div className="text-xs uppercase tracking-wider text-slate-300">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-white tabular-nums">{value}</div>
      {hint ? <div className="mt-1 text-xs text-slate-300">{hint}</div> : null}
      {sourceLabel ? (
        <div className="mt-3">
          <SourceChip label={sourceLabel} />
        </div>
      ) : null}
    </div>
  );
}
