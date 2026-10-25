"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SourceChip } from "@/components/SourceChip";
import { PEER_GROUPS, chipLabel, fmtInt, fmtMoney, fmtPct, fmtQuarter, peerLabel, type PeerGroup, type ReitSummary } from "@/lib/reits-shared";

type Filter = "all" | PeerGroup;

/** REIT index: same search + card list as the Markets index, plus peer-group chips. */
export function ReitsBrowser({ reits }: { reits: ReitSummary[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return reits.filter((r) => {
      if (filter !== "all" && r.peer !== filter) return false;
      if (!needle) return true;
      const hay = `${r.ticker} ${r.name} ${peerLabel(r.ticker)} ${r.marketLabels.join(" ")}`.toLowerCase();
      return needle.split(/\s+/).every((tok) => hay.includes(tok));
    });
  }, [reits, q, filter]);

  const chips: { value: Filter; label: string; n: number }[] = [
    { value: "all", label: "All", n: reits.length },
    ...PEER_GROUPS.map((g) => ({ value: g.key as Filter, label: g.label, n: reits.filter((r) => r.peer === g.key).length })),
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex min-w-[240px] flex-1 items-center gap-2">
            <span className="sr-only">Search REITs</span>
            <div className="relative w-full">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by ticker, name or market…"
                className="w-full rounded-xl border border-white/15 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 outline-none ring-emerald-500/40 focus:border-emerald-500/40 focus:ring-2"
              />
            </div>
          </label>
          <p className="text-xs text-slate-300">
            {filtered.length} of {reits.length} REITs
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((r) => {
          const src = r.latest.revpar ?? r.latest.adr ?? r.latest.hotels;
          const nMarkets = r.siteMarkets;
          return (
            <div
              key={r.ticker}
              className="relative rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-emerald-500/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    <Link href={`/reits/${r.ticker.toLowerCase()}`} className="outline-none focus-visible:underline">
                      <span aria-hidden="true" className="absolute inset-0 rounded-xl" />
                      {r.name} <span className="text-slate-300">({r.ticker})</span>
                    </Link>
                  </h2>
                  <p className="text-sm text-slate-300">{peerLabel(r.ticker)}</p>
                </div>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-300">
                  {[
                    r.hotelsListed ? `${r.hotelsListed} hotels listed` : null,
                    nMarkets ? `${nMarkets} site ${nMarkets === 1 ? "market" : "markets"}` : null,
                    r.quartersReported ? `${r.quartersReported} quarters reported` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-sm tabular-nums text-slate-200">
                <span className="text-slate-300">{fmtQuarter(r.latestQuarter)}</span>
                <span>
                  <span className="text-slate-300">RevPAR </span>
                  {r.latest.revpar ? fmtMoney(r.latest.revpar.value, 2) : "—"}
                </span>
                <span>
                  <span className="text-slate-300">ADR </span>
                  {r.latest.adr ? fmtMoney(r.latest.adr.value, 2) : "—"}
                </span>
                <span>
                  <span className="text-slate-300">OCC </span>
                  {r.latest.occupancy ? fmtPct(r.latest.occupancy.value) : "—"}
                </span>
                <span>
                  <span className="text-slate-300">Hotels </span>
                  {r.latest.hotels ? fmtInt(r.latest.hotels.value) : "—"}
                </span>
                <span>
                  <span className="text-slate-300">Rooms </span>
                  {r.latest.rooms ? fmtInt(r.latest.rooms.value) : "—"}
                </span>
              </div>
              {src ? (
                <div className="mt-3">
                  <SourceChip label={chipLabel(src)} />
                </div>
              ) : null}
            </div>
          );
        })}
        {!filtered.length ? <p className="text-slate-300">No REITs match this search.</p> : null}
      </div>
    </div>
  );
}
