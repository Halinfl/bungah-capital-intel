import { SourceChip } from "./SourceChip";

export function StatCard({
  label,
  value,
  hint,
  sourceLabel,
}: {
  label: string;
  value: string;
  hint?: string;
  sourceLabel?: string;
}) {
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
