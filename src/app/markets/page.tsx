import { prisma } from "@/lib/prisma";
import { MarketsBrowser } from "@/components/MarketsBrowser";
import { citedOnly, coverageInProgressLine, isSeedMarket } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MarketsPage() {
  const markets = await prisma.market.findMany({
    orderBy: { name: "asc" },
    include: {
      assets: { select: { sourceLabel: true, name: true, notes: true } },
      signals: { select: { sourceLabel: true, title: true, body: true, magnitude: true, asOf: true } },
    },
  });

  // Seed / illustrative snapshots are never rendered; seed markets show cited counts + a coverage line.
  const items = markets.map((m) => {
    const seed = isSeedMarket(m);
    return {
      id: m.id,
      slug: m.slug,
      name: m.name,
      region: m.region,
      summary: seed ? coverageInProgressLine(m.name) : m.summary,
      visitorsM: seed ? null : m.visitorsM,
      roomsK: seed ? null : m.roomsK,
      occupancy: seed ? null : m.occupancy,
      adr: seed ? null : m.adr,
      midweekOcc: seed ? null : m.midweekOcc,
      sourceLabel: seed ? "" : m.sourceLabel,
      assetCount: citedOnly(m.assets).length,
      signalCount: citedOnly(m.signals).length,
    };
  });

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
