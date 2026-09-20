import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/StatCard";
import { DestinationSearch } from "@/components/DestinationSearch";
import { fmtPct, fmtUsd, fmtVisitorsM } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const markets = await prisma.market.findMany({ orderBy: { name: "asc" } });
  const orlando = markets.find((m) => m.slug === "orlando");
  const vegas = markets.find((m) => m.slug === "las-vegas");
  const radarCount = await prisma.radar.count();

  const searchItems = markets.map((m) => ({
    slug: m.slug,
    name: m.name,
    region: m.region,
    visitorsM: m.visitorsM,
    roomsK: m.roomsK,
    occupancy: m.occupancy,
    adr: m.adr,
  }));

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
          Build in public · v0.1 capital intel
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Bungah Capital Intel
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          Silvia-style hospitality capital intelligence for brand leaders, owners, asset managers,
          developers, and CVBs. Capital Graph + Radars + Chat + Artifacts —{" "}
          <strong className="text-white">propose-only</strong>, every number cited.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/markets"
            className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-emerald-950 hover:bg-emerald-400"
          >
            Explore markets
          </Link>
          <Link
            href="/chat"
            className="rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10"
          >
            Ask the graph
          </Link>
          <Link
            href="/radars"
            className="rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10"
          >
            View {radarCount} radars
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-400">
          Lead with numbers
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Orlando visitors"
            value={fmtVisitorsM(orlando?.visitorsM)}
            hint="YE 2025 · impact ≠ scarcity"
            sourceLabel={orlando?.sourceLabel}
          />
          <StatCard
            label="Orlando OCC / ADR"
            value={`${fmtPct(orlando?.occupancy)} · ${fmtUsd(orlando?.adr, 0)}`}
            hint="MSA average — ask which Orlando"
            sourceLabel={orlando?.sourceLabel}
          />
          <StatCard
            label="Vegas visitors"
            value={fmtVisitorsM(vegas?.visitorsM)}
            hint="Soft vs 2024 (−7.5%)"
            sourceLabel={vegas?.sourceLabel}
          />
          <StatCard
            label="Vegas OCC / midweek"
            value={`${fmtPct(vegas?.occupancy)} / ${fmtPct(vegas?.midweekOcc)}`}
            hint="Weekend strength masks midweek lag"
            sourceLabel={vegas?.sourceLabel}
          />
        </div>

        <DestinationSearch markets={searchItems} />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            t: "Capital Graph",
            d: "Markets, assets, signals, debt & talent stubs — ~50 US travel markets seeded.",
            href: "/markets",
          },
          {
            t: "Radars",
            d: "Plain-language monitors → findings feed. Orlando scarcity, Vegas softness, debt-wall.",
            href: "/radars",
          },
          {
            t: "Chat + Artifacts",
            d: "Deterministic cited answers from the graph. IC one-pagers on demand. No paid API keys.",
            href: "/chat",
          },
        ].map((c) => (
          <Link
            key={c.t}
            href={c.href}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-emerald-500/40 hover:bg-emerald-500/5"
          >
            <h3 className="font-semibold text-white">{c.t}</h3>
            <p className="mt-2 text-sm text-slate-400">{c.d}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm text-amber-100/90">
        <strong className="text-amber-200">Trust contract:</strong> citations required · no
        auto-executing capital · not a booking or meeting-sourcing product · auth stub only for v0.1.
      </section>
    </div>
  );
}
