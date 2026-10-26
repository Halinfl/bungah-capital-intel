"use client";

import { useState } from "react";
import type { RegisterEntry } from "@/lib/sound-assets";

type Filter = "all" | "supports" | "opposes";
const CHIPS: { key: Filter; label: string }[] = [
  { key: "supports", label: "For" },
  { key: "opposes", label: "Against" },
  { key: "all", label: "All" },
];

function fmt(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

/** Direction as text + icon. Same color and weight both ways: opposing entries are never de-emphasized. */
function Direction({ d }: { d: RegisterEntry["direction"] }) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap text-[13px] text-slate-200">
      <span aria-hidden>{d === "supports" ? "▲" : "▼"}</span>
      {d === "supports" ? "Supports" : "Opposes"}
    </span>
  );
}

function Source({ e }: { e: RegisterEntry }) {
  return (
    <a
      href={e.evidence_uri}
      target="_blank"
      rel="noopener noreferrer"
      title={e.source_title}
      className="text-slate-200 underline decoration-white/30 underline-offset-2 hover:text-white hover:decoration-white"
    >
      {e.source_publisher} ↗
    </a>
  );
}

export function EvidenceRegister({ entries }: { entries: RegisterEntry[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  // Newest first: by date added, then by id (ids are assigned in append order).
  const rows = [...entries]
    .filter((e) => filter === "all" || e.direction === filter)
    .sort((a, b) => b.added_on.localeCompare(a.added_on) || b.id.localeCompare(a.id));
  const count = (f: Filter) => (f === "all" ? entries.length : entries.filter((e) => e.direction === f).length);

  return (
    <div className="space-y-4">
      <div role="group" aria-label="Filter by direction" className="flex flex-wrap gap-2">
        {CHIPS.map((c) => {
          const on = filter === c.key;
          return (
            <button
              key={c.key}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(c.key)}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                on ? "border-white bg-white/10 text-white" : "border-white/15 text-slate-200 hover:border-white/40"
              }`}
            >
              {c.label} <span className="tabular-nums text-slate-400">{count(c.key)}</span>
            </button>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-white/10 md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-wider text-slate-300">
              <th scope="col" className="px-3 py-2.5 font-medium">Claim</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Direction</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Strength</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Added</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} id={e.id} className="border-b border-white/[0.08] align-top last:border-0">
                <td className="px-3 py-3 text-slate-100">
                  <div className="text-xs text-slate-400">{e.id}</div>
                  {e.claim}
                </td>
                <td className="px-3 py-3"><Direction d={e.direction} /></td>
                <td className="px-3 py-3 capitalize text-slate-200">{e.strength}</td>
                <td className="whitespace-nowrap px-3 py-3 text-slate-300">{fmt(e.added_on)}</td>
                <td className="px-3 py-3 text-[13px]"><Source e={e} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: compact tap-to-expand rows, same pattern as the scorecard. The full claim is always visible;
          strength, id, date and source open underneath. Nothing is truncated. */}
      <ul className="divide-y divide-white/[0.08] rounded-xl border border-white/10 bg-white/[0.03] px-4 md:hidden">
        {rows.map((e) => (
          <li key={e.id} id={`m-${e.id}`}>
            <details className="group">
              <summary className="flex cursor-pointer list-none gap-2 py-2.5 [&::-webkit-details-marker]:hidden">
                <p className="text-sm leading-snug text-slate-100">
                  <span className="mr-1 whitespace-nowrap text-[13px] text-slate-300">
                    <span aria-hidden>{e.direction === "supports" ? "▲" : "▼"}</span> {e.direction === "supports" ? "For" : "Against"} ·
                  </span>
                  {e.claim}
                </p>
                <span aria-hidden className="ml-auto pt-0.5 text-slate-300 transition-transform group-open:rotate-90">›</span>
              </summary>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pb-3 text-[13px]">
                <span className="capitalize text-slate-200">{e.strength}</span>
                <span className="text-xs text-slate-400">{e.id} · added {fmt(e.added_on)}</span>
                <Source e={e} />
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
