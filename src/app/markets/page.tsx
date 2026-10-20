import { prisma } from "@/lib/prisma";
import { MarketsBrowser } from "@/components/MarketsBrowser";
import { citedOnly, hasPublicCoverage, isSeedMarket } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MarketsPage() {
  const markets = await prisma.market.findMany({
    orderBy: { name: "asc" },
    include: {
      assets: { select: { sourceLabel: true, name: true, notes: true } },
      signals: { select: { sourceLabel: true, title: true, body: true, magnitude: true, asOf: true } },
    },
  });

  // Seed / illustrative snapshots are never rendered. Only markets with real cited data are listed
  // (a cited snapshot, or enough cited signals); thin markets are counted in a "more coming" line.
  const covered = markets.filter((m) => hasPublicCoverage(m, citedOnly(m.signals).length));
  const comingCount = markets.length - covered.length;
  const items = covered.map((m) => {
    const seed = isSeedMarket(m);
    const signalCount = citedOnly(m.signals).length;
    return {
      id: m.id,
      slug: m.slug,
      name: m.name,
      region: m.region,
      summary: seed
        ? `${signalCount} cited signals on demand, supply, debt and labor. Open the market for sources.`
        : m.summary,
      visitorsM: seed ? null : m.visitorsM,
      roomsK: seed ? null : m.roomsK,
      occupancy: seed ? null : m.occupancy,
      adr: seed ? null : m.adr,
      midweekOcc: seed ? null : m.midweekOcc,
      sourceLabel: seed ? "" : m.sourceLabel,
      assetCount: citedOnly(m.assets).length,
      signalCount,
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Markets</h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          {items.length} US hotel markets with cited coverage today. Numbers lead; every figure
          carries its source.
        </p>
      </div>

      <MarketsBrowser markets={items} />

      {comingCount > 0 ? (
        <p className="text-sm text-slate-300">
          More markets coming: {comingCount} more are listed here once their sources are checked.
        </p>
      ) : null}
    </div>
  );
}
