/** 5-segment score bar. Neutral gray only, identical for every asset. */
export function ScoreBar({ score, max = 5 }: { score: number; max?: number }) {
  return (
    <span aria-hidden className="inline-flex gap-0.5 align-middle">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`h-1.5 w-2.5 rounded-sm ${i < score ? "bg-slate-300" : "bg-white/15"}`} />
      ))}
    </span>
  );
}
