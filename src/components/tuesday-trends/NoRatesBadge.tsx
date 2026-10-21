import { LIST_SIZE } from "@/lib/tuesday-trends-shared";

/** Neutral "no rates on Google" count; a small dot marks the data's no-rates flag (1-week cells only). */
export function NoRatesBadge({ n, dot = false, compact = false }: { n: number; dot?: boolean; compact?: boolean }) {
  return (
    <span
      role="img"
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 px-2 py-0.5 text-xs tabular-nums text-slate-200"
      aria-label={`${n} of ${LIST_SIZE} with no rates on Google${dot ? ", 10 or more" : ""}`}
    >
      {dot ? <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-slate-100" /> : null}
      <span aria-hidden="true">{compact ? n : `${n} no rates on Google`}</span>
    </span>
  );
}

/** Plain-text variant for tight spaces (market Rates block, mobile sublines). */
export function NoRatesText({ n, dot = false }: { n: number; dot?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 tabular-nums">
      {dot ? <span aria-hidden="true" className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-slate-100" /> : null}
      {n} no rates on Google
    </span>
  );
}
