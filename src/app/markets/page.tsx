import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SourceChip } from "@/components/SourceChip";
import { fmtPct, fmtUsd, fmtVisitorsM, fmtRoomsK } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MarketsPage() {
  const markets = await prisma.market.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { assets: true, signals: true } } },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Markets</h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          Capital Graph market spines. Numbers lead; every figure carries a source label.
        </p>
      </div>

      <div className="grid gap-4">
        {markets.map((m) => (
          <Link
            key={m.id}
            href={`/markets/${m.slug}`}
            className="block rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-emerald-500/40"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-white">{m.name}</h2>
                <p className="text-sm text-slate-400">{m.region}</p>
              </div>
              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-slate-400">
                {m._count.assets} assets · {m._count.signals} signals
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-300">{m.summary}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm tabular-nums text-slate-200">
              <span>
                <span className="text-slate-500">Visitors </span>
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
                {fmtUsd(m.adr, 0)}
              </span>
              {m.midweekOcc != null ? (
                <span>
                  <span className="text-slate-500">Midweek </span>
                  {fmtPct(m.midweekOcc)}
                </span>
              ) : null}
            </div>
            <div className="mt-3">
              <SourceChip label={m.sourceLabel} />
            </div>
          </Link>
        ))}
        {!markets.length ? (
          <p className="text-slate-400">No markets — run <code className="text-emerald-300">npm run db:seed</code>.</p>
        ) : null}
      </div>
    </div>
  );
}
