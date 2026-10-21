import { SOLD_OUT_DOT_AT, LIST_SIZE } from "@/lib/tuesday-trends-shared";

/**
 * Neutral sold-out count badge; a small dot marks 10 or more of 50.
 * `where` names the horizon when the badge summarises a whole row (desktop table).
 */
export function SoldOutBadge({ n, where, compact = false }: { n: number; where?: string; compact?: boolean }) {
  const dot = n >= SOLD_OUT_DOT_AT;
  return (
    <span
      role="img"
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 px-2 py-0.5 text-xs tabular-nums text-slate-200"
      aria-label={`${n} of ${LIST_SIZE} sold out${where ? ` at ${where}` : ""}`}
    >
      {dot ? <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-slate-100" /> : null}
      <span aria-hidden="true">
        {compact ? n : `${n} sold out`}
        {where ? <span className="text-slate-300"> · {where}</span> : null}
      </span>
    </span>
  );
}
