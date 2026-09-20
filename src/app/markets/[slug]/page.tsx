import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/StatCard";
import { SourceChip } from "@/components/SourceChip";
import { fmtPct, fmtUsd, fmtVisitorsM, fmtRoomsK, severityClass } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MarketDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const market = await prisma.market.findUnique({
    where: { slug },
    include: {
      assets: { orderBy: { name: "asc" } },
      signals: { orderBy: { createdAt: "desc" } },
      findings: {
        include: { radar: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      },
    },
  });

  if (!market) notFound();

  const isOrlando = market.slug === "orlando";

  return (
    <div className="space-y-10">
      <div>
        <Link href="/markets" className="text-xs text-slate-500 hover:text-emerald-300">
          ← Markets
        </Link>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">{market.name}</h1>
        <p className="mt-1 text-sm text-slate-400">{market.region}</p>
        <p className="mt-4 max-w-3xl text-slate-300">{market.summary}</p>
        <div className="mt-3">
          <SourceChip label={market.sourceLabel} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Visitors" value={fmtVisitorsM(market.visitorsM)} sourceLabel={market.sourceLabel} />
        <StatCard label="Rooms" value={fmtRoomsK(market.roomsK)} sourceLabel={market.sourceLabel} />
        <StatCard label="Occupancy" value={fmtPct(market.occupancy)} sourceLabel={market.sourceLabel} />
        <StatCard label="ADR" value={fmtUsd(market.adr, 2)} sourceLabel={market.sourceLabel} />
        {market.midweekOcc != null ? (
          <StatCard label="Midweek OCC" value={fmtPct(market.midweekOcc)} sourceLabel={market.sourceLabel} />
        ) : null}
        {market.weekendOcc != null ? (
          <StatCard label="Weekend OCC" value={fmtPct(market.weekendOcc)} sourceLabel={market.sourceLabel} />
        ) : null}
      </div>

      {isOrlando && market.nuanceNote ? (
        <section className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-200">
            Which Orlando — impact ≠ scarcity
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-amber-50/90">{market.nuanceNote}</p>
          <div className="mt-3">
            <SourceChip label={market.sourceLabel} />
          </div>
        </section>
      ) : market.nuanceNote ? (
        <section className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-sky-200">Underwriting nuance</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-200">{market.nuanceNote}</p>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Assets</h2>
        <div className="grid gap-3">
          {market.assets.map((a) => (
            <div key={a.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-medium text-white">{a.name}</h3>
                <span className="text-xs text-slate-400">
                  {a.keys ? `${a.keys.toLocaleString()} keys` : "keys n/a"} · {a.assetClass}
                </span>
              </div>
              {a.submarket ? <p className="mt-1 text-xs text-emerald-300/80">{a.submarket}</p> : null}
              {a.notes ? <p className="mt-2 text-sm text-slate-300">{a.notes}</p> : null}
              <div className="mt-2">
                <SourceChip label={a.sourceLabel} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Signals</h2>
        <div className="grid gap-3">
          {market.signals.map((s) => (
            <div key={s.id} className="rounded-lg border border-white/10 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-400">
                  {s.kind}
                </span>
                {s.magnitude ? (
                  <span className="text-sm font-semibold tabular-nums text-emerald-300">{s.magnitude}</span>
                ) : null}
                {s.asOf ? <span className="text-xs text-slate-500">as of {s.asOf}</span> : null}
              </div>
              <h3 className="mt-2 font-medium text-white">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-300">{s.body}</p>
              <div className="mt-2">
                <SourceChip label={s.sourceLabel} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {market.findings.length ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Linked findings</h2>
          <div className="space-y-2">
            {market.findings.map((f) => (
              <div key={f.id} className={`rounded-lg border p-4 ${severityClass(f.severity)}`}>
                <div className="text-[11px] uppercase tracking-wider opacity-80">
                  {f.severity} · {f.radar.name}
                </div>
                <div className="mt-1 font-medium">{f.title}</div>
                <p className="mt-1 text-sm opacity-90">{f.summary}</p>
                <div className="mt-2">
                  <SourceChip label={f.sourceLabel} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/briefs?market=${market.slug}`}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400"
        >
          Generate IC one-pager
        </Link>
        <Link
          href="/chat"
          className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/5"
        >
          Ask about this market
        </Link>
      </div>
    </div>
  );
}
