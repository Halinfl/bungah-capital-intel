import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  const orlando = await prisma.market.findUnique({ where: { slug: "orlando" } });
  const vegas = await prisma.market.findUnique({ where: { slug: "las-vegas" } });
  const radars = await prisma.radar.findMany();

  for (const radar of radars) {
    let title = "";
    let summary = "";
    let severity = "info";
    let marketId: string | null = null;
    let sourceLabel = "Bungah Capital Intel radar run";

    if (radar.slug === "orlando-msa-scarcity-watch" && orlando) {
      marketId = orlando.id;
      severity = "watch";
      title = `Radar refresh: Orlando OCC ${orlando.occupancy?.toFixed(1)}% — still impact≠scarcity`;
      summary = `Visitors ${orlando.visitorsM?.toFixed(1)}M / rooms ${orlando.roomsK?.toFixed(1)}k / ADR $${orlando.adr?.toFixed(2)}. MSA averages remain non-scarce; Grande Lakes / Gaylord-class can be. ${orlando.nuanceNote ?? ""}`;
      sourceLabel = orlando.sourceLabel;
    } else if (radar.slug === "vegas-visitation-softness" && vegas) {
      marketId = vegas.id;
      severity = "alert";
      title = `Radar refresh: Vegas visitors ${vegas.visitorsM?.toFixed(1)}M soft; midweek OCC ${vegas.midweekOcc?.toFixed(1)}%`;
      summary = `Total OCC ${vegas.occupancy?.toFixed(1)}% / weekend ${vegas.weekendOcc?.toFixed(1)}%. Watch Hard Rock ~3.6k-key late-2027 return into softer demand.`;
      sourceLabel = vegas.sourceLabel;
    } else if (radar.slug === "national-lodging-debt-wall") {
      severity = "info";
      title = "Radar refresh: lodging debt-wall / DY ≤8% stub";
      summary =
        "Hotels ~30–35% of near-term CRE maturity narratives; lodging CMBS 2026 stub ~$18.7B. Pair refinance greenlight with staffing capacity. Propose-only.";
      sourceLabel = "Industry debt-wall stubs (demo citation)";
    } else {
      title = `Radar refresh: ${radar.name}`;
      summary = radar.description;
    }

    await prisma.finding.create({
      data: {
        radarId: radar.id,
        marketId,
        title,
        summary,
        severity,
        sourceLabel,
      },
    });

    console.log(`Wrote finding for ${radar.slug}: ${title}`);
  }
}

run()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
