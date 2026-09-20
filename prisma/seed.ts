import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ILLUSTRATIVE =
  "Illustrative seed — replace with licensed STR/Tourism Economics";

type MarketSeed = {
  slug: string;
  name: string;
  region: string;
  summary: string;
  nuanceNote?: string;
  visitorsM?: number;
  roomsK?: number;
  occupancy?: number;
  adr?: number;
  midweekOcc?: number;
  weekendOcc?: number;
  sourceLabel: string;
};

/** Top US travel / hospitality destination markets (~50). */
const MARKETS: MarketSeed[] = [
  {
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
  {
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
  {
    slug: "new-york-city",
    name: "New York–Newark–Jersey City MSA",
    region: "Northeast / Mid-Atlantic",
    summary:
      "Largest US lodging MSA by rooms and ADR power. International recovery, group calendar, and Midtown vs outer-borough spreads dominate underwriting.",
    visitorsM: 64.5,
    roomsK: 135.0,
    occupancy: 82.0,
    adr: 310.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "miami",
    name: "Miami–Fort Lauderdale–West Palm Beach MSA",
    region: "Florida / Southeast",
    summary:
      "International gateway + leisure/group hybrid. South Beach luxury ADR vs inland select-service; hurricane and insurance cost overlays matter.",
    visitorsM: 28.0,
    roomsK: 58.0,
    occupancy: 74.5,
    adr: 215.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "los-angeles",
    name: "Los Angeles–Long Beach–Anaheim MSA",
    region: "California / West",
    summary:
      "Diverse demand stack: leisure, entertainment, international, and corporate. Submarket selection (LAX, Hollywood, Downtown, beach) drives outcomes.",
    visitorsM: 50.0,
    roomsK: 100.0,
    occupancy: 73.0,
    adr: 195.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "chicago",
    name: "Chicago–Naperville–Elgin MSA",
    region: "Midwest",
    summary:
      "Convention + corporate spine with strong summer leisure. Loop/River North vs suburban O'Hare corridors underwrite differently.",
    visitorsM: 55.0,
    roomsK: 45.0,
    occupancy: 71.0,
    adr: 185.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "san-francisco-bay",
    name: "San Francisco–Oakland–Berkeley MSA",
    region: "California / West",
    summary:
      "Tech corporate + international leisure. Post-pandemic occupancy recovery uneven; Union Square vs Peninsula vs East Bay spreads persist.",
    visitorsM: 24.0,
    roomsK: 35.0,
    occupancy: 72.0,
    adr: 240.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "seattle",
    name: "Seattle–Tacoma–Bellevue MSA",
    region: "Pacific Northwest",
    summary:
      "Tech + leisure gateway with cruise and Alaska airlift. Downtown vs Bellevue vs airport corridors.",
    visitorsM: 40.0,
    roomsK: 28.0,
    occupancy: 73.5,
    adr: 200.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "boston",
    name: "Boston–Cambridge–Newton MSA",
    region: "Northeast",
    summary:
      "Education, healthcare, biotech, and leisure. Constrained supply supports ADR; seasonality and group calendar matter.",
    visitorsM: 22.0,
    roomsK: 22.0,
    occupancy: 75.0,
    adr: 255.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "washington-dc",
    name: "Washington–Arlington–Alexandria MSA",
    region: "Mid-Atlantic",
    summary:
      "Government, associations, and international tourism. Weekday group strength; weekend leisure fill strategies vary by submarket.",
    visitorsM: 26.0,
    roomsK: 48.0,
    occupancy: 70.5,
    adr: 210.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "atlanta",
    name: "Atlanta–Sandy Springs–Alpharetta MSA",
    region: "Southeast",
    summary:
      "Hartsfield hub + corporate/group demand. Buckhead, Downtown, and airport corridors underwrite as separate theses.",
    visitorsM: 55.0,
    roomsK: 50.0,
    occupancy: 68.5,
    adr: 155.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "dallas",
    name: "Dallas–Fort Worth–Arlington MSA",
    region: "Texas / South",
    summary:
      "Large diversified MSA with strong corporate and leisure. Supply growth historically elevated — underwrite absorption carefully.",
    visitorsM: 50.0,
    roomsK: 55.0,
    occupancy: 69.0,
    adr: 145.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "houston",
    name: "Houston–The Woodlands–Sugar Land MSA",
    region: "Texas / South",
    summary:
      "Energy, medical, and international demand. Downtown Medical Center and Energy Corridor spreads; hurricane/insurance overlays.",
    visitorsM: 22.0,
    roomsK: 48.0,
    occupancy: 67.0,
    adr: 135.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "denver",
    name: "Denver–Aurora–Lakewood MSA",
    region: "Mountain West",
    summary:
      "Mountain gateway + corporate. Feeder for ski resorts; downtown vs airport vs foothills product mix.",
    visitorsM: 35.0,
    roomsK: 30.0,
    occupancy: 72.0,
    adr: 175.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "phoenix",
    name: "Phoenix–Mesa–Chandler MSA",
    region: "Southwest",
    summary:
      "Sunbelt leisure + golf/resort + corporate. Seasonal (snowbird) demand; Scottsdale luxury vs metro select-service.",
    visitorsM: 45.0,
    roomsK: 42.0,
    occupancy: 70.0,
    adr: 160.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "san-diego",
    name: "San Diego–Chula Vista–Carlsbad MSA",
    region: "California / West",
    summary:
      "Leisure, military, biotech, and convention. Waterfront and Mission Bay resort product vs inland limited-service.",
    visitorsM: 35.0,
    roomsK: 32.0,
    occupancy: 74.0,
    adr: 205.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "honolulu",
    name: "Urban Honolulu MSA / Oahu",
    region: "Hawaii / Pacific",
    summary:
      "Resort destination with high ADR and international mix. Waikiki inventory concentration; airlift and yen/won sensitivity.",
    visitorsM: 10.0,
    roomsK: 30.0,
    occupancy: 78.0,
    adr: 320.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "new-orleans",
    name: "New Orleans–Metairie MSA",
    region: "Gulf / Southeast",
    summary:
      "Leisure + group + cultural events. French Quarter / CBD vs suburban; hurricane and insurance cost overlays.",
    visitorsM: 19.0,
    roomsK: 25.0,
    occupancy: 71.0,
    adr: 170.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "nashville",
    name: "Nashville–Davidson–Murfreesboro MSA",
    region: "Southeast",
    summary:
      "Music leisure + corporate growth market. Downtown entertainment district ADR power; supply growth watch.",
    visitorsM: 16.0,
    roomsK: 28.0,
    occupancy: 72.5,
    adr: 185.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "austin",
    name: "Austin–Round Rock–Georgetown MSA",
    region: "Texas / South",
    summary:
      "Tech + leisure + SXSW/ACL event spikes. Downtown vs Domain vs airport; supply absorption key.",
    visitorsM: 32.0,
    roomsK: 26.0,
    occupancy: 70.0,
    adr: 175.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "san-antonio",
    name: "San Antonio–New Braunfels MSA",
    region: "Texas / South",
    summary:
      "Leisure (River Walk, theme parks) + military + group. ADR below coastal peers; stable leisure spine.",
    visitorsM: 37.0,
    roomsK: 30.0,
    occupancy: 68.0,
    adr: 130.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "tampa",
    name: "Tampa–St. Petersburg–Clearwater MSA",
    region: "Florida / Southeast",
    summary:
      "Gulf leisure + corporate + cruise. Beach vs downtown Tampa; insurance and storm cost overlays.",
    visitorsM: 26.0,
    roomsK: 35.0,
    occupancy: 71.0,
    adr: 155.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "jacksonville",
    name: "Jacksonville MSA",
    region: "Florida / Southeast",
    summary:
      "Coastal leisure + logistics/corporate. Beaches vs downtown; lower ADR than South Florida peers.",
    visitorsM: 12.0,
    roomsK: 18.0,
    occupancy: 66.0,
    adr: 125.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "charlotte",
    name: "Charlotte–Concord–Gastonia MSA",
    region: "Southeast",
    summary:
      "Banking/corporate hub with growing leisure. Uptown vs South End vs airport corridors.",
    visitorsM: 30.0,
    roomsK: 22.0,
    occupancy: 68.5,
    adr: 145.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "raleigh",
    name: "Raleigh–Cary MSA / Research Triangle",
    region: "Southeast",
    summary:
      "Research Triangle corporate + university demand. Stable weekday; leisure weekends growing.",
    visitorsM: 18.0,
    roomsK: 16.0,
    occupancy: 67.5,
    adr: 140.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "philadelphia",
    name: "Philadelphia–Camden–Wilmington MSA",
    region: "Northeast / Mid-Atlantic",
    summary:
      "Historic leisure + corporate + university/medical. Center City vs airport/King of Prussia.",
    visitorsM: 45.0,
    roomsK: 28.0,
    occupancy: 70.0,
    adr: 175.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "detroit",
    name: "Detroit–Warren–Dearborn MSA",
    region: "Midwest",
    summary:
      "Auto/corporate + casino leisure. Downtown revitalization vs suburban corridors; ADR discount to coastal MSAs.",
    visitorsM: 16.0,
    roomsK: 22.0,
    occupancy: 64.0,
    adr: 120.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "minneapolis",
    name: "Minneapolis–St. Paul–Bloomington MSA",
    region: "Midwest",
    summary:
      "Corporate + medical + leisure gateway. Strong weekday; winter leisure strategies matter.",
    visitorsM: 32.0,
    roomsK: 24.0,
    occupancy: 68.0,
    adr: 150.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "portland-or",
    name: "Portland–Vancouver–Hillsboro MSA",
    region: "Pacific Northwest",
    summary:
      "Leisure + tech/corporate with outdoor tourism feeder. Downtown vs airport vs suburban.",
    visitorsM: 12.0,
    roomsK: 16.0,
    occupancy: 69.0,
    adr: 155.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "salt-lake-city",
    name: "Salt Lake City MSA",
    region: "Mountain West",
    summary:
      "Ski gateway + corporate + outdoor leisure. Winter peak; summer national-park flywheel.",
    visitorsM: 15.0,
    roomsK: 14.0,
    occupancy: 71.0,
    adr: 165.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "kansas-city",
    name: "Kansas City MSA",
    region: "Midwest",
    summary:
      "Corporate + sports/leisure. Downtown entertainment district growth; ADR mid-market.",
    visitorsM: 12.0,
    roomsK: 18.0,
    occupancy: 65.0,
    adr: 125.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "st-louis",
    name: "St. Louis MSA",
    region: "Midwest",
    summary:
      "Corporate + leisure/attractions. Downtown vs Clayton vs airport; stable mid-market lodging.",
    visitorsM: 25.0,
    roomsK: 20.0,
    occupancy: 64.5,
    adr: 120.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "indianapolis",
    name: "Indianapolis–Carmel–Anderson MSA",
    region: "Midwest",
    summary:
      "Convention + sports + corporate. Downtown circle hotels vs airport; group calendar sensitive.",
    visitorsM: 28.0,
    roomsK: 22.0,
    occupancy: 66.0,
    adr: 130.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "columbus-oh",
    name: "Columbus OH MSA",
    region: "Midwest",
    summary:
      "State capital + university + corporate. Stable weekday demand; growing leisure.",
    visitorsM: 14.0,
    roomsK: 16.0,
    occupancy: 65.5,
    adr: 125.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "cleveland",
    name: "Cleveland–Elyria MSA",
    region: "Midwest",
    summary:
      "Medical/corporate + leisure revitalization. Downtown vs suburbs; ADR discount to coastal.",
    visitorsM: 18.0,
    roomsK: 14.0,
    occupancy: 63.0,
    adr: 115.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "pittsburgh",
    name: "Pittsburgh MSA",
    region: "Mid-Atlantic / Midwest",
    summary:
      "Healthcare, education, and leisure. Downtown + North Shore event demand; stable mid-market.",
    visitorsM: 12.0,
    roomsK: 14.0,
    occupancy: 66.0,
    adr: 135.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "cincinnati",
    name: "Cincinnati MSA",
    region: "Midwest",
    summary:
      "Corporate + leisure riverfront. CBD vs Northern Kentucky vs suburbs.",
    visitorsM: 10.0,
    roomsK: 15.0,
    occupancy: 64.0,
    adr: 120.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "baltimore",
    name: "Baltimore–Columbia–Towson MSA",
    region: "Mid-Atlantic",
    summary:
      "Inner Harbor leisure + medical/corporate. DC spillover on some weekends; waterfront product mix.",
    visitorsM: 26.0,
    roomsK: 16.0,
    occupancy: 67.0,
    adr: 145.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "virginia-beach-norfolk",
    name: "Virginia Beach–Norfolk–Newport News MSA",
    region: "Mid-Atlantic / Southeast",
    summary:
      "Beach leisure + military + ports. Seasonal occupancy; oceanfront resort vs inland limited-service.",
    visitorsM: 18.0,
    roomsK: 20.0,
    occupancy: 62.0,
    adr: 140.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "charleston-sc",
    name: "Charleston–North Charleston MSA",
    region: "Southeast",
    summary:
      "Historic leisure + culinary destination. Constrained peninsula supply supports ADR; hurricane overlay.",
    visitorsM: 8.0,
    roomsK: 12.0,
    occupancy: 74.0,
    adr: 210.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "savannah",
    name: "Savannah MSA",
    region: "Southeast",
    summary:
      "Historic leisure destination with strong weekend ADR. Historic district scarcity vs suburban supply.",
    visitorsM: 15.0,
    roomsK: 10.0,
    occupancy: 72.0,
    adr: 185.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "myrtle-beach",
    name: "Myrtle Beach–Conway–North Myrtle Beach MSA",
    region: "Southeast / Carolinas",
    summary:
      "Drive-to leisure beach market. Highly seasonal; oceanfront vs highway corridors.",
    visitorsM: 18.0,
    roomsK: 35.0,
    occupancy: 58.0,
    adr: 125.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "florida-keys",
    name: "Key West / Florida Keys",
    region: "Florida / Southeast",
    summary:
      "High-ADR leisure destination with constrained Keys inventory. Airlift + drive demand; storm risk elevated.",
    visitorsM: 5.0,
    roomsK: 8.0,
    occupancy: 76.0,
    adr: 340.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "palm-beach",
    name: "West Palm Beach / Palm Beach County",
    region: "Florida / Southeast",
    summary:
      "Affluent leisure + seasonal snowbird. Luxury ADR corridor; insurance and storm overlays.",
    visitorsM: 9.0,
    roomsK: 14.0,
    occupancy: 72.0,
    adr: 240.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "fort-lauderdale",
    name: "Fort Lauderdale / Broward",
    region: "Florida / Southeast",
    summary:
      "Beach leisure + cruise + corporate. Las Olas / beach vs airport; part of broader South Florida thesis.",
    visitorsM: 16.0,
    roomsK: 22.0,
    occupancy: 73.0,
    adr: 190.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "anaheim-orange-county",
    name: "Anaheim / Orange County (Disney corridor)",
    region: "California / West",
    summary:
      "Theme-park leisure + convention. Anaheim resort district vs coastal OC; Disney demand flywheel.",
    visitorsM: 25.0,
    roomsK: 28.0,
    occupancy: 76.0,
    adr: 195.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "palm-springs",
    name: "Palm Springs / Coachella Valley",
    region: "California / Southwest",
    summary:
      "Resort leisure + events (Coachella/Stagecoach spikes). Seasonal desert demand; midweek vs weekend spreads.",
    visitorsM: 8.0,
    roomsK: 16.0,
    occupancy: 65.0,
    adr: 210.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "reno-tahoe",
    name: "Reno / Lake Tahoe",
    region: "Nevada / California mountain",
    summary:
      "Gaming + mountain leisure corridor. Reno midweek gaming vs Tahoe resort seasonality.",
    visitorsM: 10.0,
    roomsK: 18.0,
    occupancy: 68.0,
    adr: 155.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "aspen-vail",
    name: "Aspen / Vail–class Colorado mountain",
    region: "Mountain West",
    summary:
      "Ultra-high ADR ski/resort destinations. Extreme seasonality; Denver airlift feeder; limited keys.",
    visitorsM: 4.5,
    roomsK: 8.0,
    occupancy: 62.0,
    adr: 450.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "gatlinburg-pigeon-forge",
    name: "Gatlinburg / Pigeon Forge / Smokies",
    region: "Southeast / Appalachia",
    summary:
      "Drive-to leisure mountain market. Cabin/STR competition; seasonal peaks around holidays and leaf season.",
    visitorsM: 14.0,
    roomsK: 22.0,
    occupancy: 60.0,
    adr: 140.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "branson",
    name: "Branson MSA",
    region: "Midwest / Ozarks",
    summary:
      "Drive-to leisure entertainment destination. Highly seasonal; theater/attraction demand spine.",
    visitorsM: 9.0,
    roomsK: 12.0,
    occupancy: 55.0,
    adr: 110.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "williamsburg-va",
    name: "Williamsburg / Historic Triangle VA",
    region: "Mid-Atlantic / Southeast",
    summary:
      "Historic leisure + family attractions. Seasonal school calendar; Colonial Williamsburg / Busch Gardens demand.",
    visitorsM: 7.0,
    roomsK: 10.0,
    occupancy: 58.0,
    adr: 135.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "outer-banks",
    name: "Outer Banks / Dare County NC",
    region: "Southeast / Carolinas",
    summary:
      "Drive-to barrier-island leisure. Extreme seasonality; cottage/STR inventory dominates vs hotels.",
    visitorsM: 6.0,
    roomsK: 5.0,
    occupancy: 55.0,
    adr: 200.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "napa-sonoma",
    name: "Napa / Sonoma Wine Country",
    region: "California / West",
    summary:
      "High-ADR leisure wine destination. Constrained inn/resort inventory; weekend leisure vs midweek group.",
    visitorsM: 5.5,
    roomsK: 6.0,
    occupancy: 70.0,
    adr: 380.0,
    sourceLabel: ILLUSTRATIVE,
  },
  {
    slug: "sedona-grand-canyon",
    name: "Sedona / Grand Canyon corridor",
    region: "Southwest / Arizona",
    summary:
      "Scenic leisure drive + fly market. Sedona resort ADR premium; Grand Canyon gateway rooms more midscale.",
    visitorsM: 8.0,
    roomsK: 9.0,
    occupancy: 68.0,
    adr: 220.0,
    sourceLabel: ILLUSTRATIVE,
  },
];

async function main() {
  await prisma.chatMessage.deleteMany();
  await prisma.chatThread.deleteMany();
  await prisma.artifact.deleteMany();
  await prisma.finding.deleteMany();
  await prisma.radar.deleteMany();
  await prisma.signal.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.market.deleteMany();

  const created = new Map<string, { id: string; slug: string }>();

  for (const m of MARKETS) {
    const row = await prisma.market.create({
      data: {
        slug: m.slug,
        name: m.name,
        region: m.region,
        summary: m.summary,
        nuanceNote: m.nuanceNote ?? null,
        visitorsM: m.visitorsM ?? null,
        roomsK: m.roomsK ?? null,
        occupancy: m.occupancy ?? null,
        adr: m.adr ?? null,
        midweekOcc: m.midweekOcc ?? null,
        weekendOcc: m.weekendOcc ?? null,
        sourceLabel: m.sourceLabel,
      },
    });
    created.set(m.slug, { id: row.id, slug: row.slug });
  }

  const orlando = created.get("orlando")!;
  const vegas = created.get("las-vegas")!;

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

  console.log(`Seeded ${MARKETS.length} markets (incl. ${orlando.slug}, ${vegas.slug}).`);
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
