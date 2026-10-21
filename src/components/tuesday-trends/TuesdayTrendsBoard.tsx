"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  HORIZONS,
  LIST_SIZE,
  NO_RATES_DOT_AT,
  THIN_BELOW,
  cellValue,
  fmtRate,
  isThin,
  type Horizon,
  type Metric,
  type Stay,
  type TTCell,
  type TTMarket,
} from "@/lib/tuesday-trends-shared";
import { Segmented } from "./Segmented";
import { NoRatesBadge, NoRatesText } from "./NoRatesBadge";
import { Thin } from "./Thin";

/** Sort column: market name, one horizon's rate, or the 1-week no-rates count. */
type SortKey = "name" | Horizon | "norates";
type Dir = "asc" | "desc";

const METRIC_OPTIONS: { value: Metric; label: string; aria: string }[] = [
  { value: "refundable", label: "Refundable", aria: "Cheapest refundable rate" },
  { value: "lowest", label: "Any rate", aria: "Lowest rate, refundable or not" },
];

/** No-rates counts are shown for 1 week out (far horizons mostly hit Google's ~330-day pricing limit). */
const NO_RATES_HORIZON: Horizon = "7d";

function coverageText(c: TTCell, metric: Metric): string {
  if (metric === "refundable") return `${c.nRefundable}/${LIST_SIZE} priced with a refundable rate`;
  const low = c.nLowConfidence ? ` (${c.nLowConfidence} low-confidence ${c.nLowConfidence === 1 ? "price" : "prices"} left out)` : "";
  return `${c.nUsed}/${LIST_SIZE} priced${low}`;
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

function Dot() {
  return <span aria-hidden="true" className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-slate-100" />;
}

/** One-line legend shown directly above the table/list. */
function Legend({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[13px] text-slate-300 ${className}`}>
      <span className="whitespace-nowrap">— thin: under {THIN_BELOW}/{LIST_SIZE}</span>
      <span className="mx-1.5">·</span>
      <span className="inline-flex items-center gap-1 whitespace-nowrap">
        <Dot /> {NO_RATES_DOT_AT}+ no rates on Google, 1 wk
      </span>
    </p>
  );
}

type Tip = { text: string; x: number; y: number; right?: boolean } | null;
type Row = { m: TTMarket; cells: TTCell[]; nr: TTCell };

export function TuesdayTrendsBoard({ markets }: { markets: TTMarket[] }) {
  const router = useRouter();
  const [stay, setStay] = useState<Stay>("weekday");
  const [metric, setMetric] = useState<Metric>("refundable");
  const [horizon, setHorizon] = useState<Horizon>("30d");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [dir, setDir] = useState<Dir>("asc");
  const [tip, setTip] = useState<Tip>(null);
  useEffect(() => {
    if (!tip) return;
    const clear = () => setTip(null);
    window.addEventListener("scroll", clear, { passive: true });
    return () => window.removeEventListener("scroll", clear);
  }, [tip]);

  const rows = useMemo<Row[]>(() => {
    const list = markets.map((m) => {
      const cells = HORIZONS.map((h) => m.cells.find((c) => c.horizon === h.key && c.stay === stay)!);
      const nr = cells[HORIZONS.findIndex((h) => h.key === NO_RATES_HORIZON)];
      return { m, cells, nr };
    });
    const byName = (a: Row, b: Row) => a.m.name.localeCompare(b.m.name);
    if (sortKey === "name") return list.sort((a, b) => (dir === "asc" ? byName(a, b) : byName(b, a)));
    if (sortKey === "norates")
      return list.sort((a, b) => (dir === "desc" ? b.nr.nNoRates - a.nr.nNoRates : a.nr.nNoRates - b.nr.nNoRates) || byName(a, b));
    const hi = HORIZONS.findIndex((h) => h.key === sortKey);
    const key = (r: Row) => {
      const { value, n } = cellValue(r.cells[hi], metric);
      return value == null || isThin(n) ? null : value;
    };
    return list.sort((a, b) => {
      const ka = key(a);
      const kb = key(b);
      if (ka == null && kb == null) return byName(a, b);
      if (ka == null) return 1; // thin cells always sort last
      if (kb == null) return -1;
      return dir === "desc" ? kb - ka : ka - kb;
    });
  }, [markets, stay, metric, sortKey, dir]);

  /** Desktop header click: new column starts high→low (A→Z for names); same column flips. */
  const clickSort = (k: SortKey) => {
    if (k === sortKey) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setDir(k === "name" ? "asc" : "desc");
    }
    if (k !== "name" && k !== "norates") setHorizon(k);
  };

  /** Mobile sort button cycles A–Z → highest → lowest, on the selected horizon. */
  const mobileMode: "az" | "high" | "low" = sortKey === "name" ? "az" : dir === "desc" ? "high" : "low";
  const cycleMobile = () => {
    if (mobileMode === "az") {
      setSortKey(horizon);
      setDir("desc");
    } else if (mobileMode === "high") {
      setSortKey(horizon);
      setDir("asc");
    } else {
      setSortKey("name");
      setDir("asc");
    }
  };
  const pickHorizon = (h: Horizon) => {
    setHorizon(h);
    if (sortKey !== "name" && sortKey !== "norates") setSortKey(h);
  };

  const hIdx = HORIZONS.findIndex((h) => h.key === horizon);
  const hLabel = HORIZONS[hIdx].label;
  const mobileSortLabel =
    mobileMode === "az" ? "Sorted A–Z" : mobileMode === "high" ? `Sorted highest rate, ${hLabel}` : `Sorted lowest rate, ${hLabel}`;
  /** `right`: anchor the tooltip's right edge to the cell (last column), so it never runs off-screen. */
  const showTip = (e: React.MouseEvent, text: string, right = false) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTip({ text, x: right ? r.right : r.left + r.width / 2, y: r.top, right });
  };
  const ariaSort = (k: SortKey) => (sortKey === k ? (dir === "asc" ? "ascending" : "descending") : undefined);
  const Arrow = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      <span aria-hidden="true" className="text-[12px] text-white">
        {dir === "asc" ? "▲" : "▼"}
      </span>
    ) : null;
  const headBtn = (k: SortKey) =>
    `inline-flex items-center gap-1 whitespace-nowrap uppercase tracking-wider ${sortKey === k ? "text-white" : "hover:text-white"}`;

  return (
    <div>
      {/* ---------- Mobile controls ---------- */}
      <div className="space-y-2 md:hidden">
        <Segmented
          label="Horizon"
          size="sm"
          value={horizon}
          onChange={pickHorizon}
          options={HORIZONS.map((h) => ({ value: h.key, label: h.chip, aria: h.long }))}
        />
        <div className="flex items-center gap-1.5">
          <Segmented
            label="Stay"
            size="sm"
            value={stay}
            onChange={setStay}
            options={[
              { value: "weekday", label: "Weekday", aria: "Weekday, Mon–Thu" },
              { value: "weekend", label: "Weekend", aria: "Weekend, Fri–Sun" },
            ]}
          />
          <Segmented label="Rate" size="sm" value={metric} onChange={setMetric} options={METRIC_OPTIONS} />
          <button
            type="button"
            onClick={cycleMobile}
            aria-label={`${mobileSortLabel}. Change sort`}
            title={mobileSortLabel}
            className={`ml-auto inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/[0.03] ${
              mobileMode === "az" ? "text-slate-300" : "text-white"
            }`}
          >
            {mobileMode === "az" ? (
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M3 5.25A.75.75 0 013.75 4.5h9.5a.75.75 0 010 1.5h-9.5A.75.75 0 013 5.25zm0 4.75a.75.75 0 01.75-.75h6.5a.75.75 0 010 1.5h-6.5A.75.75 0 013 10zm.75 4a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z" />
              </svg>
            ) : (
              <span aria-hidden="true" className="text-[13px] leading-none">
                {mobileMode === "high" ? "▼" : "▲"}
              </span>
            )}
          </button>
        </div>
        <Legend className="pt-0.5" />
      </div>

      {/* ---------- Desktop controls + legend ---------- */}
      <div className="hidden flex-wrap items-center gap-3 md:flex">
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
        <Legend className="ml-auto" />
      </div>

      {/* ---------- Desktop table ---------- */}
      <div className="mt-6 hidden overflow-x-auto rounded-xl border border-white/10 bg-[#353942] md:block">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <caption className="sr-only">
            Median {metric === "refundable" ? "cheapest refundable" : "lowest (any)"} nightly rate, pre-tax, 2 adults,{" "}
            {stay === "weekday" ? "weekday Mon–Thu" : "weekend Fri–Sun"} stays, by market and how far out. Column headers sort.
          </caption>
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-300">
              <th scope="col" aria-sort={ariaSort("name")} className="sticky left-0 z-10 bg-[#353942] px-4 py-3 font-medium">
                <button type="button" onClick={() => clickSort("name")} className={headBtn("name")}>
                  Market <Arrow k="name" />
                </button>
              </th>
              {HORIZONS.map((h) => (
                <th key={h.key} scope="col" aria-sort={ariaSort(h.key)} className="px-3 py-3 text-right font-medium">
                  <button type="button" onClick={() => clickSort(h.key)} title={`${h.long}. Click to sort.`} className={headBtn(h.key)}>
                    <Arrow k={h.key} />
                    {h.label}
                  </button>
                </th>
              ))}
              <th scope="col" aria-sort={ariaSort("norates")} className="w-52 px-3 py-3 text-right font-medium">
                <button
                  type="button"
                  onClick={() => clickSort("norates")}
                  title="Hotels of 50 with no rates on Google, 1 week out. Click to sort."
                  className={headBtn("norates")}
                >
                  <Arrow k="norates" />
                  No rates on Google · 1 wk
                </button>
              </th>
              <th scope="col" className="w-8 px-2 py-3">
                <span className="sr-only">Open</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ m, cells, nr }) => {
              const notOn = Math.max(...cells.map((c) => c.nNotOnGoogle));
              const nrTip = `No rates on Google, of ${LIST_SIZE}: ${HORIZONS.map((h, i) => `${h.label} ${cells[i].nNoRates}`).join(" · ")}${
                notOn ? ` (plus ${notOn} not on Google Hotels this week)` : ""
              }`;
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
                    const text = `${HORIZONS[i].long}: ${coverageText(c, metric)}${thin ? " (thin, median not shown)" : ""}`;
                    return (
                      <td
                        key={c.horizon}
                        className="px-3 py-2.5 text-right"
                        onMouseEnter={(e) => showTip(e, text)}
                        onMouseLeave={() => setTip(null)}
                      >
                        {thin ? <Thin /> : <span className="text-[15px] tabular-nums text-white">{fmtRate(value)}</span>}
                        <span className="sr-only">, {coverageText(c, metric)}</span>
                      </td>
                    );
                  })}
                  <td
                    className="w-52 px-3 py-2.5 text-right"
                    onMouseEnter={(e) => showTip(e, nrTip, true)}
                    onMouseLeave={() => setTip(null)}
                  >
                    <NoRatesBadge n={nr.nNoRates} dot={nr.noRatesDot} compact />
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

      {/* ---------- Mobile list: one row per market for the chosen horizon ---------- */}
      <ul className="mt-3 grid gap-2 md:hidden">
        {rows.map(({ m, cells, nr }) => {
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
                  <span className="flex items-center gap-1 text-xs tabular-nums text-slate-300">
                    {n}/{LIST_SIZE} priced · <NoRatesText n={nr.nNoRates} dot={nr.noRatesDot} />
                  </span>
                </span>
                <span className="text-right">
                  {thin ? <Thin /> : <span className="text-[15px] tabular-nums text-white">{fmtRate(value)}</span>}
                </span>
                <Chevron />
              </Link>
            </li>
          );
        })}
      </ul>

      {/* ---------- Footnotes ---------- */}
      <div className="mt-4 space-y-1.5 text-[13px] leading-relaxed text-slate-300">
        <p>
          {metric === "refundable"
            ? "Refundable: the median covers hotels with a free-cancellation rate, about 9 in 10 hotels at 1 week and about 2 in 3 at ~11 months."
            : "Any rate: Google's headline nightly price for each hotel, refundable or not."}{" "}
          Low-confidence prices (2 or fewer sellers and no official hotel site) are left out of medians.{" "}
          <span className="hidden md:inline">Hover a cell for its coverage, or the no-rates count for all five horizons.</span>
        </p>
        <p>
          No rates on Google means Google showed no bookable rates for the dates, which is not proof of a sell-out.
          Counts are 1 week out; at ~11 months most no-rates results reflect Google&apos;s ~330-day pricing limit.
        </p>
      </div>

      {tip ? (
        <div
          role="tooltip"
          style={{ left: tip.x, top: tip.y - 8 }}
          className={`pointer-events-none fixed z-50 -translate-y-full whitespace-nowrap ${tip.right ? "-translate-x-full" : "-translate-x-1/2"} rounded-md border border-white/15 bg-[#1f2228] px-2.5 py-1.5 text-xs text-slate-100 shadow-lg`}
        >
          {tip.text}
        </div>
      ) : null}
    </div>
  );
}
