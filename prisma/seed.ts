import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.chatMessage.deleteMany();
  await prisma.chatThread.deleteMany();
  await prisma.artifact.deleteMany();
  await prisma.finding.deleteMany();
  await prisma.radar.deleteMany();
  await prisma.signal.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.market.deleteMany();

  const orlando = await prisma.market.create({
    data: {
      slug: "orlando",
      name: "Orlando–Kissimmee–Sanford MSA",
      region: "Florida / Southeast",
      summary:
        "Record visitation and economic impact coexist with mid-70s MSA occupancy. CapEx must clear hurdles by submarket and product class — not by MSA headlines.",
      nuanceNote:
        "Impact ≠ scarcity at MSA averages. Ask which Orlando: I-Drive/select-service is not scarce; Grande Lakes / Gaylord Palms-class group-resort + meeting campus can be. YE OCC 71.4% is the MSA underwriting tell — it does not flip for irreplaceable convention-resort campuses.",
      visitorsM: 76.7,
      roomsK: 132.7,
      occupancy: 71.4,
      adr: 202.71,
      sourceLabel:
        "Visit Orlando Data & Trends YE 2025; PR Newswire 2026-05-07 (76.7M visitors)",
    },
  });

  const vegas = await prisma.market.create({
    data: {
      slug: "las-vegas",
      name: "Las Vegas–Henderson–Paradise MSA",
      region: "Nevada / Southwest",
      summary:
        "2025 visitation soft (−7.5% YoY). Capital thesis shifts from unstoppable leisure machine to event- and airlift-dependent cyclical. Midweek OCC lags weekends.",
      nuanceNote:
        "Strip weekend strength (high-80s capable) masks softer midweek and already-soft Downtown (67.5% OCC). Hard Rock @ former Mirage (~3,600 keys, late 2027) is a discrete supply-return event into a softer demand tape.",
      visitorsM: 38.5,
      roomsK: 150.3,
      occupancy: 80.3,
      adr: 183.52,
      midweekOcc: 76.6,
      weekendOcc: 88.8,
      sourceLabel:
        "LVCVA FAQ YE 2025 (updated 06/2026); News3LV YE wrap citing LVCVA",
    },
  });

  await prisma.asset.createMany({
    data: [
      {
        marketId: orlando.id,
        name: "JW Marriott Orlando, Grande Lakes",
        assetClass: "full-service convention resort",
        keys: 1010,
        submarket: "Grande Lakes / south Orlando",
        notes:
          "Part of 1,592-key Grande Lakes campus (w/ Ritz-Carlton 582) on 409 acres. Scarcity layer — not MSA average.",
        sourceLabel: "Public property disclosures; Ryman Grande Lakes deal coverage Aug 2026",
      },
      {
        marketId: orlando.id,
        name: "The Ritz-Carlton Orlando, Grande Lakes",
        assetClass: "luxury resort",
        keys: 582,
        submarket: "Grande Lakes / south Orlando",
        notes: "Paired with JW on irreplaceable group-resort + meeting campus.",
        sourceLabel: "Public property disclosures",
      },
      {
        marketId: orlando.id,
        name: "Gaylord Palms Resort & Convention Center",
        assetClass: "group / convention resort",
        keys: 1406,
        submarket: "I-Drive / OCCC corridor",
        notes: "Competitive set for group spine with OCCC; network effect with Grande Lakes-class.",
        sourceLabel: "Public property / brand disclosures (approx keys)",
      },
      {
        marketId: vegas.id,
        name: "Hard Rock Las Vegas (former Mirage)",
        assetClass: "gaming resort (reopening)",
        keys: 3600,
        submarket: "Strip",
        notes:
          "Mirage closed mid-2024; Hard Rock targeting late 2027 incl. ~675 Guitar Hotel keys. Discrete ~2.4% inventory-class return.",
        sourceLabel: "Review-Journal / Hard Rock public coverage",
      },
    ],
  });

  await prisma.signal.createMany({
    data: [
      {
        marketId: orlando.id,
        kind: "visitation",
        title: "Orlando record visitors 2025",
        body: "76.7M visitors (70.3M domestic / 6.3M intl). Economic impact cited at $98.6B. Record impact ≠ MSA scarcity.",
        magnitude: "76.7M",
        asOf: "YE 2025",
        sourceLabel: "Visit Orlando / PR Newswire 2026-05-07",
      },
      {
        marketId: orlando.id,
        kind: "supply",
        title: "Orlando MSA room inventory",
        body: "132,685 hotel rooms YE 2025. OCC 71.4%, ADR $202.71, room-night demand 34.5M.",
        magnitude: "132.7k rooms",
        asOf: "YE 2025",
        sourceLabel: "Visit Orlando Data & Trends YE 2025",
      },
      {
        marketId: orlando.id,
        kind: "nuance",
        title: "Which Orlando — impact ≠ scarcity",
        body: "MSA averages (OCC 71.4%) are not scarce. Grande Lakes / Gaylord-class convention-resort campuses can be. Never underwrite 'Orlando is scarce' — ask which Orlando.",
        magnitude: "rule",
        asOf: "2026-09",
        sourceLabel: "Bungah Capital Intel Baseline (Visit Orlando YE corroboration)",
      },
      {
        marketId: vegas.id,
        kind: "visitation",
        title: "Las Vegas visitation softness 2025",
        body: "38,545,700 visitors (−7.5% vs ~41.7M in 2024). LVCVA framed 2025 as a complex post-COVID environment.",
        magnitude: "−7.5% YoY",
        asOf: "YE 2025",
        sourceLabel: "LVCVA FAQ YE 2025; News3LV YE wrap",
      },
      {
        marketId: vegas.id,
        kind: "occupancy",
        title: "Vegas OCC split — weekend vs midweek",
        body: "Total OCC 80.3% (−3.3 pp vs 2024). Weekend 88.8% / midweek 76.6%. Strip 83.2% vs Downtown 67.5%.",
        magnitude: "80.3% / midweek 76.6%",
        asOf: "YE 2025",
        sourceLabel: "LVCVA FAQ YE 2025",
      },
      {
        marketId: null,
        kind: "debt",
        title: "National lodging debt-wall stub",
        body: "Hotels ~30–35% of commercial real estate maturities in near-term wall narratives. Lodging CMBS 2026 maturities stub ~$18.7B. Watchlist: debt yield ≤8% and refinance greenlight risk.",
        magnitude: "~$18.7B lodging CMBS 2026",
        asOf: "2026 stub",
        sourceLabel: "Industry debt-wall stubs (Trepp/CRE public commentary aggregates — demo citation)",
      },
      {
        marketId: null,
        kind: "talent",
        title: "Talent / staffing greenlight note",
        body: "CapEx and refinance greenlights increasingly gated by staffing and GC/MEP capacity — not just demand and rates. Orlando Epic-adjacent delivery and Vegas Hard Rock peak crews compete for trades.",
        magnitude: "greenlight gate",
        asOf: "2026-09",
        sourceLabel: "Bungah Capital Intel talent synthesis (public construction/crew reporting)",
      },
    ],
  });

  const r1 = await prisma.radar.create({
    data: {
      slug: "orlando-msa-scarcity-watch",
      name: "Orlando MSA scarcity watch",
      description:
        "Monitors whether MSA impact headlines are misread as scarcity. Flags when underwriting ignores which-Orlando nuance (Grande Lakes / Gaylord-class vs corridor select-service).",
      marketSlug: "orlando",
      status: "active",
    },
  });

  const r2 = await prisma.radar.create({
    data: {
      slug: "vegas-visitation-softness",
      name: "Vegas visitation softness",
      description:
        "Tracks YE visitation give-back, midweek OCC lag, and discrete Strip supply-return events (Hard Rock 2027) against leisure/event demand.",
      marketSlug: "las-vegas",
      status: "active",
    },
  });

  const r3 = await prisma.radar.create({
    data: {
      slug: "national-lodging-debt-wall",
      name: "National lodging debt-wall / DY stress",
      description:
        "Stub radar for lodging maturity wall, CMBS refinance path, and debt-yield ≤8% watchlist names. Propose-only — no auto capital actions.",
      marketSlug: null,
      status: "active",
    },
  });

  await prisma.finding.createMany({
    data: [
      {
        radarId: r1.id,
        marketId: orlando.id,
        title: "MSA OCC 71.4% — impact ≠ scarcity",
        summary:
          "76.7M visitors and ~$98.6B impact coexist with YE OCC 71.4%. Do not greenlight ground-up on MSA averages. Ask which Orlando: Grande Lakes / Gaylord-class can be scarce.",
        severity: "watch",
        sourceLabel: "Visit Orlando Data & Trends YE 2025",
      },
      {
        radarId: r2.id,
        marketId: vegas.id,
        title: "Visitation −7.5% with midweek OCC 76.6%",
        summary:
          "38.5M visitors soft; total OCC 80.3% but midweek 76.6%. Thesis: event- and airlift-dependent cyclical, not unstoppable leisure.",
        severity: "alert",
        sourceLabel: "LVCVA FAQ YE 2025",
      },
      {
        radarId: r3.id,
        marketId: null,
        title: "Lodging CMBS maturity stub ~$18.7B (2026)",
        summary:
          "Hotels remain a material share (~30–35%) of near-term CRE maturity narratives. DY ≤8% names need refinance greenlight + staffing capacity.",
        severity: "info",
        sourceLabel: "Industry debt-wall stubs (demo citation)",
      },
    ],
  });

  console.log("Seeded markets:", orlando.slug, vegas.slug);
  console.log("Seeded 3 radars + findings, signals, assets.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
