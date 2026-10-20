"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SourceChip } from "./SourceChip";

type MarketItem = {
  id: string;
  slug: string;
  name: string;
  region: string;
  summary: string;
  visitorsM: number | null;
  roomsK: number | null;
  occupancy: number | null;
  adr: number | null;
  midweekOcc: number | null;
  sourceLabel: string;
  assetCount: number;
  signalCount: number;
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

const PAGE_SIZE = 20;

export function MarketsBrowser({ markets }: { markets: MarketItem[] }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return markets;
    return markets.filter((m) => {
      const hay = `${m.name} ${m.region} ${m.slug}`.toLowerCase();
      return needle.split(/\s+/).every((tok) => hay.includes(tok));
    });
  }, [markets, q]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const slice = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex min-w-[240px] flex-1 items-center gap-2">
          <span className="sr-only">Search markets</span>
          <div className="relative w-full">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
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
              onChange={(e) => {
                setQ(e.target.value);
                setPage(0);
              }}
              placeholder="Search your destination…"
              className="w-full rounded-xl border border-white/15 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 outline-none ring-emerald-500/40 focus:border-emerald-500/40 focus:ring-2"
            />
          </div>
        </label>
        <p className="text-xs text-slate-400">
          {filtered.length} of {markets.length} markets
          {pageCount > 1 ? ` · page ${safePage + 1}/${pageCount}` : ""}
        </p>
      </div>

      <div className="grid gap-4">
        {slice.map((m) => (
          <Link
            key={m.id}
            href={`/markets/${m.slug}`}
            className="block rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-emerald-500/40"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-white">{m.name}</h2>
                <p className="text-sm text-slate-300">{m.region}</p>
              </div>
              <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-300">
                {[
                  m.assetCount ? `${m.assetCount} ${m.assetCount === 1 ? "asset" : "assets"}` : null,
                  `${m.signalCount} cited ${m.signalCount === 1 ? "signal" : "signals"}`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-300">{m.summary}</p>
            {m.occupancy == null && m.adr == null && m.visitorsM == null && m.roomsK == null ? null : (
            <div className="mt-4 flex flex-wrap gap-4 text-sm tabular-nums text-slate-200">
              <span>
                <span className="text-slate-400">Visitors </span>
                {fmtVisitorsM(m.visitorsM)}
              </span>
              <span>
                <span className="text-slate-400">Rooms </span>
                {fmtRoomsK(m.roomsK)}
              </span>
              <span>
                <span className="text-slate-400">OCC </span>
                {fmtPct(m.occupancy)}
              </span>
              <span>
                <span className="text-slate-400">ADR </span>
                {fmtUsd(m.adr)}
              </span>
              {m.midweekOcc != null ? (
                <span>
                  <span className="text-slate-400">Midweek </span>
                  {fmtPct(m.midweekOcc)}
                </span>
              ) : null}
            </div>
            )}
            {m.sourceLabel ? (
              <div className="mt-3">
                <SourceChip label={m.sourceLabel} />
              </div>
            ) : null}
          </Link>
        ))}
        {!filtered.length ? (
          <p className="text-slate-300">No markets match this search.</p>
        ) : null}
      </div>

      {pageCount > 1 ? (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={safePage <= 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 disabled:opacity-40 hover:bg-white/5"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 disabled:opacity-40 hover:bg-white/5"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
