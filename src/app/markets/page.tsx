import { prisma } from "@/lib/prisma";
import { MarketsBrowser } from "@/components/MarketsBrowser";

export const dynamic = "force-dynamic";

export default async function MarketsPage() {
  const markets = await prisma.market.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { assets: true, signals: true } } },
  });

  const items = markets.map((m) => ({
    id: m.id,
    slug: m.slug,
    name: m.name,
    region: m.region,
    summary: m.summary,
    visitorsM: m.visitorsM,
    roomsK: m.roomsK,
    occupancy: m.occupancy,
    adr: m.adr,
    midweekOcc: m.midweekOcc,
    sourceLabel: m.sourceLabel,
    assetCount: m._count.assets,
    signalCount: m._count.signals,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Markets</h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          Capital Graph market spines — {markets.length} US travel & hospitality destinations.
          Numbers lead; every figure carries a source label.
        </p>
      </div>

      <MarketsBrowser markets={items} />
    </div>
  );
}
