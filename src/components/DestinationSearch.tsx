"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type MarketSearchItem = {
  slug: string;
  name: string;
  region: string;
  visitorsM: number | null;
  roomsK: number | null;
  occupancy: number | null;
  adr: number | null;
};

function fmtVisitorsM(n: number | null): string {
  if (n == null) return "—";
  return `${n.toFixed(1)}M`;
}

function fmtRoomsK(n: number | null): string {
  if (n == null) return "—";
  return `${n.toFixed(1)}k`;
}

function fmtPct(n: number | null): string {
  if (n == null) return "—";
  return `${n.toFixed(1)}%`;
}

function fmtUsd(n: number | null): string {
  if (n == null) return "—";
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

export function DestinationSearch({
  markets,
  placeholder = "Search your destination…",
  maxResults = 12,
  compact = false,
}: {
  markets: MarketSearchItem[];
  placeholder?: string;
  maxResults?: number;
  compact?: boolean;
}) {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return markets
      .filter((m) => {
        const hay = `${m.name} ${m.region} ${m.slug}`.toLowerCase();
        return needle.split(/\s+/).every((tok) => hay.includes(tok));
      })
      .slice(0, maxResults);
  }, [markets, q, maxResults]);

  return (
    <div className={compact ? "space-y-3" : "mt-6 space-y-3"}>
      <label className="block">
        <span className="sr-only">Search your destination</span>
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
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
            placeholder={placeholder}
            autoComplete="off"
            className="w-full rounded-xl border border-white/15 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none ring-emerald-500/40 focus:border-emerald-500/40 focus:ring-2"
          />
        </div>
      </label>

      {q.trim() ? (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0d1218]">
          {results.length ? (
            <ul className="divide-y divide-white/5">
              {results.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/markets/${m.slug}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 transition hover:bg-emerald-500/5"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium text-white">{m.name}</div>
                      <div className="text-xs text-slate-400">{m.region}</div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs tabular-nums text-slate-300">
                      <span>
                        <span className="text-slate-500">Vis </span>
                        {fmtVisitorsM(m.visitorsM)}
                      </span>
                      <span>
                        <span className="text-slate-500">Rooms </span>
                        {fmtRoomsK(m.roomsK)}
                      </span>
                      <span>
                        <span className="text-slate-500">OCC </span>
                        {fmtPct(m.occupancy)}
                      </span>
                      <span>
                        <span className="text-slate-500">ADR </span>
                        {fmtUsd(m.adr)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-6 text-center text-sm text-slate-400">
              No markets match “{q.trim()}”. Try a city, MSA, or region.
            </p>
          )}
          {results.length >= maxResults ? (
            <div className="border-t border-white/5 px-4 py-2 text-center text-xs text-slate-500">
              Showing top {maxResults} — refine search or{" "}
              <Link href="/markets" className="text-emerald-300 hover:underline">
                browse all markets
              </Link>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-xs text-slate-500">
          Search {markets.length} US travel & hospitality markets by name, region, or slug.
        </p>
      )}
    </div>
  );
}
