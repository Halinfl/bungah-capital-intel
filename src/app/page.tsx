import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/StatCard";
import { DestinationSearch } from "@/components/DestinationSearch";
import { PricingTiers } from "@/components/PricingTiers";
import { fmtPct, fmtUsd, fmtVisitorsM } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const markets = await prisma.market.findMany({ orderBy: { name: "asc" } });
  const orlando = markets.find((m) => m.slug === "orlando");
  const vegas = markets.find((m) => m.slug === "las-vegas");
  const radarCount = await prisma.radar.count();
  const briefCount = await prisma.artifact.count();

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
    <div className="space-y-14">
      {/* Hero — Capital Graph as the one picture (Silvia mirror · Quill voice) */}
      <section className="space-y-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
          Capital Graph
        </p>
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Bungah Capital Intel
        </h1>
        <p className="max-w-xl text-[15px] leading-relaxed text-slate-400">
          One picture of hospitality capital — markets, assets, debt, and talent gates. Ideate
          safely; we cite and propose — you decide.
        </p>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5">
          <DestinationSearch
            markets={searchItems}
            placeholder="Search markets by name, region, or slug"
          />
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/chat"
            className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-white"
          >
            Ask a capital question
          </Link>
          <Link
            href="/markets"
            className="rounded-lg border border-white/10 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-300 hover:border-white/20 hover:text-white"
          >
            Browse markets
          </Link>
        </div>
      </section>

      {/* Quiet Trust Contract line — before pricing & tools */}
      <section className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed text-slate-400">
            <span className="font-medium text-slate-200">Trust Contract.</span> Propose-only ·
            citations · not booking · not meeting-sourcing.
          </p>
          <Link
            href="/trust"
            className="shrink-0 text-sm text-slate-300 underline-offset-2 hover:text-white hover:underline"
          >
            Read the contract
          </Link>
        </div>
      </section>

      {/* Pricing — Free · Pro · Company (chrome mock; no Stripe) */}
      <PricingTiers />

      {/* Work products — Radars + Briefs (tools after trust + pricing) */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
          Work products
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/radars"
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition hover:border-white/15 hover:bg-white/[0.03]"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-base font-medium text-white">Radars</h3>
              <span className="text-xs tabular-nums text-slate-500">{radarCount} live</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Quiet monitors over the graph. Material findings only — no firehose.
            </p>
          </Link>
          <Link
            href="/briefs"
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition hover:border-white/15 hover:bg-white/[0.03]"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-base font-medium text-white">Briefs</h3>
              <span className="text-xs tabular-nums text-slate-500">
                {briefCount ? `${briefCount} recent` : "IC one-pagers"}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Forwardable IC memos from the Capital Graph. Cited. Propose-only — not a chatbot
              transcript.
            </p>
          </Link>
        </div>
      </section>

      {/* KPI strip — secondary only */}
      <section className="space-y-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
          Snapshot · secondary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
      </section>
    </div>
  );
}
