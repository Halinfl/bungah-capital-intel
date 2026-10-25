"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  PEER_GROUPS,
  fmtDate,
  fmtInt,
  fmtMoney,
  fmtPct,
  fmtQuarter,
  type Cited,
  type PeerGroup,
  type ReitSummary,
} from "@/lib/reits-shared";
import { CitedValue } from "./CitedValue";

type SortKey = "ticker" | "revpar" | "adr" | "occupancy" | "hotels" | "rooms";
type Dir = "asc" | "desc";
type Filter = "all" | PeerGroup;

const COLS: { key: Exclude<SortKey, "ticker">; label: string; title: string; fmt: (v: number) => string }[] = [
  { key: "revpar", label: "RevPAR", title: "Revenue per available room, latest reported quarter", fmt: (v) => fmtMoney(v, 2) },
  { key: "adr", label: "ADR", title: "Average daily rate, latest reported quarter", fmt: (v) => fmtMoney(v, 2) },
  { key: "occupancy", label: "Occupancy", title: "Occupancy, latest reported quarter", fmt: fmtPct },
  { key: "hotels", label: "Hotels", title: "Hotels owned at quarter end", fmt: fmtInt },
  { key: "rooms", label: "Rooms", title: "Rooms owned at quarter end", fmt: fmtInt },
];

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

function CapturedTag() {
  return (
    <span className="ml-1.5 inline-block rounded border border-white/20 px-1 py-px align-middle text-[12px] font-normal normal-case tracking-normal text-slate-200">
      captured
    </span>
  );
}

const val = (r: ReitSummary, k: Exclude<SortKey, "ticker">): Cited | null => r.latest[k];

export function ReitsBoard({ rows: all, firstCapture }: { rows: ReitSummary[]; firstCapture: string }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("ticker");
  const [dir, setDir] = useState<Dir>("asc");

  const rows = useMemo(() => {
    const list = all.filter((r) => filter === "all" || r.peer === filter);
    const byT = (a: ReitSummary, b: ReitSummary) => a.ticker.localeCompare(b.ticker);
    if (sortKey === "ticker") return [...list].sort((a, b) => (dir === "asc" ? byT(a, b) : byT(b, a)));
    return [...list].sort((a, b) => {
      const ka = val(a, sortKey)?.value ?? null;
      const kb = val(b, sortKey)?.value ?? null;
      if (ka == null && kb == null) return byT(a, b);
      if (ka == null) return 1;
      if (kb == null) return -1;
      return dir === "desc" ? kb - ka : ka - kb;
    });
  }, [all, filter, sortKey, dir]);

  const clickSort = (k: SortKey) => {
    if (k === sortKey) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setDir(k === "ticker" ? "asc" : "desc");
    }
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

  const chips: { value: Filter; label: string; n: number }[] = [
    { value: "all", label: "All", n: all.length },
    ...PEER_GROUPS.map((g) => ({ value: g.key as Filter, label: g.label, n: all.filter((r) => r.peer === g.key).length })),
  ];
  const capLabel = `First capture ${fmtDate(firstCapture, { year: true })}`;
  const quarters = [...new Set(rows.map((r) => r.latestQuarter).filter(Boolean))] as string[];

  return (
    <div>
      {/* Chips first, then the legend. */}
      <div role="group" aria-label="Peer group" className="flex flex-wrap gap-1.5">
        {chips.map((c) => {
          const on = c.value === filter;
          return (
            <button
              key={c.value}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(c.value)}
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-[13px] font-medium transition-colors ${
                on ? "border-white/30 bg-white/[0.14] text-white" : "border-white/15 bg-white/[0.03] text-slate-300 hover:text-white"
              }`}
            >
              {c.label} <span className={on ? "text-slate-200" : "text-slate-300"}>{c.n}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-slate-300">
        <span className="font-medium text-slate-200">Reported</span>: latest quarter in each REIT&apos;s SEC filings; every
        value links to its filing.
        <span className="mx-1.5">·</span>
        <span className="font-medium text-slate-200">Captured</span>: Google Hotels rates for each REIT&apos;s hotels, every
        Tuesday; {capLabel.charAt(0).toLowerCase() + capLabel.slice(1)}.
        <span className="mx-1.5">·</span>
        Occupancy is reported only; it cannot be captured.
        <span className="mx-1.5">·</span>
        n/r: not reported by the company (RHP states rooms, not a hotel count).
      </p>

      {/* ---------- Desktop table ---------- */}
      <div className="mt-4 hidden overflow-x-auto rounded-xl border border-white/10 bg-[#353942] md:block">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <caption className="sr-only">
            Hotel REITs: latest reported quarter from SEC filings, and Google Hotels captures (not yet run). Column headers
            sort.
          </caption>
          <thead>
            <tr className="text-[12px] uppercase tracking-wider text-slate-300">
              <th scope="col" rowSpan={2} aria-sort={ariaSort("ticker")} className="sticky left-0 z-10 border-b border-white/10 bg-[#353942] px-4 py-3 align-bottom font-medium">
                <button type="button" onClick={() => clickSort("ticker")} className={headBtn("ticker")}>
                  REIT <Arrow k="ticker" />
                </button>
              </th>
              <th scope="colgroup" colSpan={COLS.length + 1} className="border-b border-l border-white/10 px-3 pb-1.5 pt-3 text-center font-medium text-slate-200">
                Reported (SEC filings)
              </th>
              <th scope="colgroup" colSpan={3} className="border-b border-l border-white/10 px-3 pb-1.5 pt-3 text-center font-medium text-slate-200">
                Captured (Google, Tuesdays)
                <CapturedTag />
              </th>
              <th scope="col" rowSpan={2} className="w-8 border-b border-white/10 px-2">
                <span className="sr-only">Open</span>
              </th>
            </tr>
            <tr className="border-b border-white/10 text-[12px] uppercase tracking-wider text-slate-300">
              <th scope="col" className="border-l border-white/10 px-3 py-2 text-right font-medium">
                Quarter
              </th>
              {COLS.map((c) => (
                <th key={c.key} scope="col" aria-sort={ariaSort(c.key)} className="px-3 py-2 text-right font-medium">
                  <button type="button" onClick={() => clickSort(c.key)} title={`${c.title}. Click to sort.`} className={headBtn(c.key)}>
                    <Arrow k={c.key} />
                    {c.label}
                  </button>
                </th>
              ))}
              <th scope="col" className="border-l border-white/10 px-3 py-2 text-right font-medium" title="Median captured nightly rate across the REIT's hotels">
                Median rate
              </th>
              <th scope="col" className="px-3 py-2 text-right font-medium" title="Hotels with a captured price, of the REIT's hotels">
                Priced
              </th>
              <th scope="col" className="px-3 py-2 text-right font-medium" title="Captured rate versus reported ADR">
                Tracking gap
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.ticker}
                onClick={() => router.push(`/reits/${r.ticker.toLowerCase()}`)}
                className="group cursor-pointer border-b border-white/[0.06] last:border-b-0 hover:bg-[#3b3f48]"
              >
                <th scope="row" className="sticky left-0 z-10 bg-[#353942] px-4 py-2.5 text-left font-medium group-hover:bg-[#3b3f48]">
                  <Link
                    href={`/reits/${r.ticker.toLowerCase()}`}
                    onClick={(e) => e.stopPropagation()}
                    className="block outline-none focus-visible:underline"
                  >
                    <span className="block text-[15px] text-white">{r.ticker}</span>
                    <span className="block max-w-[220px] truncate text-[12px] font-normal text-slate-300">{r.name}</span>
                  </Link>
                </th>
                <td className="border-l border-white/[0.06] px-3 py-2.5 text-right text-[13px] tabular-nums text-slate-300">
                  {fmtQuarter(r.latestQuarter)}
                </td>
                {COLS.map((c) => (
                  <td key={c.key} className="px-3 py-2.5 text-right text-[15px]">
                    {c.key === "hotels" && !r.latest.hotels ? (
                      <span className="text-slate-300" title="Not reported: the company states room counts only">n/r</span>
                    ) : (
                      <CitedValue c={val(r, c.key)} fmt={c.fmt} stop />
                    )}
                  </td>
                ))}
                {i === 0 ? (
                  <td
                    colSpan={3}
                    rowSpan={rows.length}
                    className="border-l border-white/[0.06] bg-white/[0.02] px-4 text-center align-middle text-[13px] text-slate-200"
                  >
                    <span className="block font-medium text-white">{capLabel}</span>
                    <span className="mt-1 block text-slate-300">No captured rates yet, so nothing is shown here.</span>
                  </td>
                ) : null}
                <td className="px-2 py-2.5">
                  <Chevron />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- Mobile list: ticker + RevPAR on line 1, secondary values on line 2 ---------- */}
      <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-[13px] text-slate-200 md:hidden">
        <span className="font-medium text-white">Captured columns</span>
        <CapturedTag />
        <span className="mt-0.5 block text-slate-300">{capLabel}. No captured rates yet, so none are shown.</span>
      </div>
      <ul className="mt-2 grid gap-2 md:hidden">
        {rows.map((r) => (
          <li key={r.ticker}>
            <Link
              href={`/reits/${r.ticker.toLowerCase()}`}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 hover:bg-white/[0.05]"
            >
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-[15px] font-semibold text-white">
                    {r.ticker} <span className="text-[12px] font-normal text-slate-300">{fmtQuarter(r.latestQuarter)}</span>
                  </span>
                  <span className="whitespace-nowrap text-[15px] tabular-nums text-white">
                    {r.latest.revpar ? fmtMoney(r.latest.revpar.value, 2) : "—"}
                    <span className="ml-1 text-[12px] text-slate-300">RevPAR</span>
                  </span>
                </span>
                <span className="mt-0.5 block truncate text-[12px] tabular-nums text-slate-300">
                  ADR {r.latest.adr ? fmtMoney(r.latest.adr.value, 2) : "—"} · Occ {r.latest.occupancy ? fmtPct(r.latest.occupancy.value) : "—"} ·{" "}
                  {r.latest.hotels ? `${fmtInt(r.latest.hotels.value)} hotels` : "hotels n/r"} · {r.latest.rooms ? fmtInt(r.latest.rooms.value) : "—"} rooms
                </span>
              </span>
              <Chevron />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-1.5 text-[13px] leading-relaxed text-slate-300">
        <p>
          Reported values are each REIT&apos;s own figures for {quarters.length === 1 ? fmtQuarter(quarters[0]) : "its latest filed quarter"}, as
          published; REITs define comparable portfolios differently, so cross-REIT comparisons are indicative.{" "}
          <span className="hidden md:inline">Hover a value for its filing; click it to open the filing.</span>
        </p>
      </div>
    </div>
  );
}
