import Link from "next/link";
import { HORIZONS, STAYS, fmtPct, fmtRate, fmtStayRange, wowAria, type TTMove } from "@/lib/tuesday-trends-shared";
import { TT_PREV_CAPTURED_LABEL } from "@/lib/tuesday-trends";

function label(m: TTMove) {
  const h = HORIZONS.find((x) => x.key === m.horizon)!;
  const s = STAYS.find((x) => x.key === m.stay)!;
  return { h, s, range: fmtStayRange(m.checkIn, m.checkOut) };
}

/**
 * This week's biggest week-over-week moves (matched pairs, cheapest refundable). Neutral gray only: direction is
 * carried by the sign and the words, never by red/green.
 */
export function MovesStrip({ moves, prevLabel = TT_PREV_CAPTURED_LABEL }: { moves: TTMove[]; prevLabel?: string }) {
  if (!moves.length) return null;
  return (
    <section aria-labelledby="moves-heading" className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="moves-heading" className="text-sm font-semibold text-white">
          Biggest moves outside holiday weeks · vs {prevLabel.replace(/^Tue, /, "")}
        </h2>
        <span className="text-[13px] text-slate-300">Same hotels both weeks, cheapest refundable · horizon and stay on each card</span>
      </div>
      <ul className="mt-2 grid gap-2 md:grid-cols-3">
        {moves.map((m) => {
          const { h, s, range } = label(m);
          return (
            <li key={`${m.market}-${m.horizon}-${m.stay}`}>
              <Link
                href={`/markets/${m.slug}`}
                className="block rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 hover:border-white/25 hover:bg-white/[0.05]"
                aria-label={`${m.marketName}, ${h.long}, ${s.label} ${s.days} (${range}): ${wowAria(m.pct)}, ${fmtRate(m.prev)} to ${fmtRate(m.now)}, median of ${m.nPairs} same hotels`}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[15px] font-medium text-white">{m.marketName}</span>
                  <span className="shrink-0 text-[15px] font-semibold tabular-nums text-white">{fmtPct(m.pct)}</span>
                </span>
                <span className="mt-0.5 block text-xs tabular-nums text-slate-300">
                  {h.label} · {s.label} {range} · {fmtRate(m.prev)} → {fmtRate(m.now)} · {m.nPairs} hotels
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Radars: compact "This Tuesday's rate moves" cards; each whole card opens the board. Max 3. */
export function RateMovesCards({ moves }: { moves: TTMove[] }) {
  if (!moves.length) return null;
  return (
    <section aria-labelledby="rate-moves" className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="rate-moves" className="text-base font-semibold text-white">
          This Tuesday&apos;s rate moves
        </h2>
        <span className="text-[13px] text-slate-300">vs {TT_PREV_CAPTURED_LABEL.replace(/^Tue, /, "")}, same hotels, outside holiday weeks</span>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {moves.slice(0, 3).map((m) => {
          const { h, s, range } = label(m);
          return (
            <Link
              key={`${m.market}-${m.horizon}-${m.stay}`}
              href="/tuesday-trends"
              className="block rounded-xl border border-white/10 bg-white/[0.03] p-3 hover:border-white/25 hover:bg-white/[0.05] sm:p-4"
              aria-label={`${m.marketName}, ${h.long}, ${s.label} ${s.days}: ${wowAria(m.pct)}, ${fmtRate(m.prev)} to ${fmtRate(m.now)}. Open Tuesday Trends`}
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="truncate text-[15px] font-medium text-white">{m.marketName}</span>
                <span className="shrink-0 text-lg font-semibold tabular-nums text-white">{fmtPct(m.pct)}</span>
              </span>
              <span className="mt-1 block text-xs tabular-nums text-slate-300">
                {h.long}, {s.label.toLowerCase()} {range} · {fmtRate(m.prev)} → {fmtRate(m.now)}
              </span>
              <span className="mt-2 block text-xs text-slate-200">Tuesday Trends →</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
