"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  HORIZONS,
  LIST_SIZE,
  SOLD_OUT_DOT_AT,
  cellValue,
  fmtRate,
  isThin,
  type Horizon,
  type Metric,
  type Stay,
  type TTMarket,
} from "@/lib/tuesday-trends-shared";
import { Segmented } from "./Segmented";
import { SoldOutBadge } from "./SoldOutBadge";

type Sort = "az" | "high" | "low";

const METRIC_OPTIONS: { value: Metric; label: string }[] = [
  { value: "refundable", label: "Cheapest refundable" },
  { value: "lowest", label: "Lowest rate" },
];

function coverageText(n: number, metric: Metric): string {
  return metric === "refundable" ? `${n}/${LIST_SIZE} priced with a refundable rate` : `${n}/${LIST_SIZE} priced`;
}

function Chevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-slate-300">
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Thin() {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="text-[15px] text-slate-300">—</span>
      <span className="rounded border border-white/15 px-1 text-[12px] leading-4 text-slate-300">thin</span>
    </span>
  );
}

type Tip = { text: string; x: number; y: number } | null;

export function TuesdayTrendsBoard({ markets }: { markets: TTMarket[] }) {
  const router = useRouter();
  const [stay, setStay] = useState<Stay>("weekday");
  const [metric, setMetric] = useState<Metric>("refundable");
  const [sort, setSort] = useState<Sort>("az");
  const [horizon, setHorizon] = useState<Horizon>("30d");
  const [tip, setTip] = useState<Tip>(null);
  useEffect(() => {
    if (!tip) return;
    const clear = () => setTip(null);
    window.addEventListener("scroll", clear, { passive: true });
    return () => window.removeEventListener("scroll", clear);
  }, [tip]);

  const rows = useMemo(() => {
    const withCells = markets.map((m) => {
      const cells = HORIZONS.map((h) => m.cells.find((c) => c.horizon === h.key && c.stay === stay)!);
      return { m, cells };
    });
    if (sort === "az") return withCells.sort((a, b) => a.m.name.localeCompare(b.m.name));
    const hi = HORIZONS.findIndex((h) => h.key === horizon);
    const key = (r: (typeof withCells)[number]) => {
      const { value, n } = cellValue(r.cells[hi], metric);
      return value == null || isThin(n) ? null : value;
    };
    return withCells.sort((a, b) => {
      const ka = key(a);
      const kb = key(b);
      if (ka == null && kb == null) return a.m.name.localeCompare(b.m.name);
      if (ka == null) return 1; // thin cells always sort last
      if (kb == null) return -1;
      return sort === "high" ? kb - ka : ka - kb;
    });
  }, [markets, stay, metric, sort, horizon]);

  const hIdx = HORIZONS.findIndex((h) => h.key === horizon);
  const hLabel = HORIZONS[hIdx].label;
  const showTip = (e: React.MouseEvent | React.FocusEvent, text: string) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTip({ text, x: r.left + r.width / 2, y: r.top });
  };

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          label="Stay"
          value={stay}
          onChange={setStay}
          options={[
            { value: "weekday", label: "Weekday", sub: "Mon–Thu" },
            { value: "weekend", label: "Weekend", sub: "Fri–Sun" },
          ]}
        />
        <Segmented label="Rate" value={metric} onChange={setMetric} options={METRIC_OPTIONS} />
        <label className="flex items-center gap-2 text-sm text-slate-300 sm:ml-auto">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-lg border border-white/15 bg-[#353942] px-2.5 py-1.5 text-sm text-white outline-none focus:border-white/40"
          >
            <option value="az">Market A–Z</option>
            <option value="high">Highest rate ({hLabel})</option>
            <option value="low">Lowest rate ({hLabel})</option>
          </select>
        </label>
      </div>

      {/* Mobile horizon chips */}
      <div className="md:hidden">
        <Segmented
          label="Horizon"
          size="sm"
          value={horizon}
          onChange={setHorizon}
          options={HORIZONS.map((h) => ({ value: h.key, label: h.chip }))}
        />
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-white/10 bg-[#353942] md:block">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <caption className="sr-only">
            Median {metric === "refundable" ? "cheapest refundable" : "lowest"} nightly rate, pre-tax, 2 adults,{" "}
            {stay === "weekday" ? "weekday Mon–Thu" : "weekend Fri–Sun"} stays, by market and how far out
          </caption>
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-300">
              <th scope="col" className="sticky left-0 z-10 bg-[#353942] px-4 py-3 font-medium">
                Market
              </th>
              {HORIZONS.map((h) => (
                <th key={h.key} scope="col" className="px-3 py-3 text-right font-medium">
                  <button
                    type="button"
                    onClick={() => setHorizon(h.key)}
                    aria-pressed={h.key === horizon}
                    title={`${h.long}. Sort by this column with Highest or Lowest rate.`}
                    className={`uppercase tracking-wider ${
                      h.key === horizon && sort !== "az"
                        ? "text-white underline decoration-white/50 underline-offset-4"
                        : "hover:text-white"
                    }`}
                  >
                    {h.label}
                  </button>
                </th>
              ))}
              <th scope="col" className="px-3 py-3 text-right font-medium">
                Sold out
              </th>
              <th scope="col" className="w-8 px-2 py-3">
                <span className="sr-only">Open</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ m, cells }) => {
              const peak = cells.reduce((best, c, i) => (c.nSoldOut > cells[best].nSoldOut ? i : best), 0);
              const peakN = cells[peak].nSoldOut;
              const soldTip = `Sold out of ${LIST_SIZE}: ${HORIZONS.map((h, i) => `${h.label} ${cells[i].nSoldOut}`).join(" · ")}`;
              return (
                <tr
                  key={m.key}
                  onClick={() => router.push(`/markets/${m.slug}`)}
                  className="group cursor-pointer border-b border-white/[0.06] last:border-b-0 hover:bg-[#3b3f48]"
                >
                  <th scope="row" className="sticky left-0 z-10 bg-[#353942] px-4 py-2.5 text-left font-medium group-hover:bg-[#3b3f48]">
                    <Link
                      href={`/markets/${m.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[15px] text-white outline-none focus-visible:underline"
                    >
                      {m.name}
                    </Link>
                  </th>
                  {cells.map((c, i) => {
                    const { value, n } = cellValue(c, metric);
                    const thin = isThin(n);
                    const text = `${HORIZONS[i].long}: ${coverageText(n, metric)}${thin ? " (thin, median not shown)" : ""}`;
                    return (
                      <td
                        key={c.horizon}
                        className="px-3 py-2.5 text-right"
                        onMouseEnter={(e) => showTip(e, text)}
                        onMouseLeave={() => setTip(null)}
                      >
                        {thin ? <Thin /> : <span className="text-[15px] tabular-nums text-white">{fmtRate(value)}</span>}
                        <span className="sr-only">, {coverageText(n, metric)}</span>
                      </td>
                    );
                  })}
                  <td
                    className="px-3 py-2.5 text-right"
                    onMouseEnter={(e) => showTip(e, soldTip)}
                    onMouseLeave={() => setTip(null)}
                  >
                    <SoldOutBadge n={peakN} where={peakN > 0 ? HORIZONS[peak].label : undefined} compact />
                  </td>
                  <td className="px-2 py-2.5">
                    <Chevron />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile list: one row per market for the chosen horizon */}
      <ul className="grid gap-2 md:hidden">
        {rows.map(({ m, cells }) => {
          const c = cells[hIdx];
          const { value, n } = cellValue(c, metric);
          const thin = isThin(n);
          return (
            <li key={m.key}>
              <Link
                href={`/markets/${m.slug}`}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 hover:bg-white/[0.05]"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium text-white">{m.name}</span>
                  <span className="block text-xs text-slate-300">{n}/{LIST_SIZE} priced</span>
                </span>
                <SoldOutBadge n={c.nSoldOut} />
                <span className="w-16 text-right">
                  {thin ? <Thin /> : <span className="text-[15px] tabular-nums text-white">{fmtRate(value)}</span>}
                </span>
                <Chevron />
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Footnotes */}
      <div className="space-y-1.5 text-[13px] leading-relaxed text-slate-300">
        <p>
          {metric === "refundable"
            ? "Cheapest refundable: only hotels with a free-cancellation rate count toward the median, so coverage falls from about 3 in 4 hotels at 1 week to about 1 in 3 at ~11 months."
            : "Lowest rate: Google's headline nightly price for each hotel, refundable or not."}{" "}
          <span className="hidden md:inline">Hover a cell for its coverage.</span>
        </p>
        <p>
          <Thin /> fewer than 15 of 50 hotels priced for the rate shown; the median is not shown.{" "}
          <span className="inline-flex items-center gap-1 align-middle">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-slate-100" />
          </span>{" "}
          {SOLD_OUT_DOT_AT} or more of 50 sold out.
          <span className="hidden md:inline"> The Sold out column shows the highest count at any horizon.</span>
        </p>
        <p>~11-month sold-outs largely reflect Google&apos;s ~330-day pricing limit, not hotels selling out.</p>
      </div>

      {tip ? (
        <div
          role="tooltip"
          style={{ left: tip.x, top: tip.y - 8 }}
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-white/15 bg-[#1f2228] px-2.5 py-1.5 text-xs text-slate-100 shadow-lg"
        >
          {tip.text}
        </div>
      ) : null}
    </div>
  );
}
