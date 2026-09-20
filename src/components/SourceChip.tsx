export function SourceChip({ label }: { label: string }) {
  return (
    <span
      className="inline-flex max-w-full items-start gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] leading-snug text-slate-400"
      title={label}
    >
      <span className="shrink-0 font-medium text-emerald-400/90">src</span>
      <span className="truncate">{label}</span>
    </span>
  );
}
