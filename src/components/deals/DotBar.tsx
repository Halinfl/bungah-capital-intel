/**
 * 5-dot neutral bar, same visual language as the Sound Assets scorecard: filled vs hollow, gray only.
 * Ungraded = hollow dashed dots. Never colored, never arrows.
 */
export function DotBar({ score, max = 5, label }: { score: number | null; max?: number; label?: string }) {
  const ungraded = score === null;
  return (
    <span
      role="img"
      aria-label={label ?? (ungraded ? "Not graded" : `${score} of ${max}`)}
      className="inline-flex shrink-0 items-center gap-1 align-middle"
    >
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={
            ungraded
              ? "h-2.5 w-2.5 rounded-full border border-dashed border-white/40"
              : i < Math.round(score)
                ? "h-2.5 w-2.5 rounded-full bg-slate-300"
                : "h-2.5 w-2.5 rounded-full border border-white/30"
          }
        />
      ))}
    </span>
  );
}

/** Neutral outline chip (status, rubric version, source kind, financing tags). */
export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/25 px-2 py-0.5 text-xs text-slate-200">
      {children}
    </span>
  );
}

/** The mandatory disclosure, in the tight band style of the Sound Assets disclosure. */
export function UnderwriteNote({ text }: { text: string }) {
  return <p className="rounded-md border border-white/15 bg-white/[0.03] px-3 py-2 text-[13px] text-slate-200">{text}</p>;
}

/** Draft marker while rubric v1's lower bands await sign-off. */
export function DealsDraftNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-md border border-dashed border-white/25 px-2 py-1 text-xs text-slate-300">
      <span className="font-semibold uppercase tracking-wider text-slate-200">Draft</span>
      <span>{children}</span>
    </p>
  );
}
