/**
 * National and City-center radars (preview).
 *
 * This content lives in code, not in the shared database: production's /radars lists every Radar
 * row to signed-in users, and the radar run route writes a finding for every Radar row, so any new
 * row would leak to live bungah.io before approval. Until approved, these radars render only on
 * preview/local builds. To publish: merge, then set RADARS_NATIONAL_PUBLISHED=1 on Production.
 *
 * Every figure below was re-read on its linked page on 2026-10-20 (ET). Stat tiles use only figures
 * carried by the originating source and at least one more; secondary or single-source items appear
 * in summaries only and are flagged in the source list. Metro figures are labeled "Metro".
 */
import type { StatChange } from "@/components/StatCard";

export function nationalRadarsVisible(): boolean {
  return process.env.VERCEL_ENV !== "production" || process.env.RADARS_NATIONAL_PUBLISHED === "1";
}

/** The old national radar row whose only findings were demo citations; superseded by NATIONAL_RADAR. */
export const SUPERSEDED_RADAR_SLUGS = ["national-lodging-debt-wall"];

export const PREVIEW_CHECKED = "Oct 20, 2026";

export type PreviewSource = { label: string; url: string; flag?: string };

export type PreviewFinding = {
  id: string;
  severity: "active" | "watch" | "alert";
  stat: { label: string; value: string; hint: string; change?: StatChange };
  title: string;
  summary: string;
  capital: string;
  sources: PreviewSource[];
};

export type PreviewRadar = {
  slug: string;
  tag: string;
  name: string;
  description: string;
  status: "active" | "watch" | "alert";
  chatQuestion: string;
  findings: PreviewFinding[];
};

const SRC = {
  ustravelDash: {
    label: "U.S. Travel Association, Travel Insights Dashboard, August 2026 data (Oct 2, 2026)",
    url: "https://www.ustravel.org/research/travel-recovery-insights-dashboard",
  },
  ustravelFcst: {
    label: "U.S. Travel Association, Travel Forecast (May 7, 2026)",
    url: "https://www.ustravel.org/research/travel-forecasts",
  },
  ntto: {
    label: "NTTO August 2026 travel exports, via International Inbound Travel Association (Oct 9, 2026)",
    url: "https://www.inboundtravel.org/news/ntto-us-travel-tourism-exports-august-26",
    flag: "Secondary · single-source",
  },
  ahla: {
    label: "AHLA, 2026 State of the Industry, full report (hosted by the NC Restaurant & Lodging Association)",
    url: "https://www.ncrla.org/wp-content/uploads/2026/07/State-of-the-Industry-2026.pdf",
    flag: "Secondary host · single-source",
  },
  treppSs: {
    label: "Trepp, CMBS special servicing report, September 2026",
    url: "https://www.trepp.com/trepptalk/cmbs-special-servicing-rate-september-2026",
  },
  connectSs: {
    label: "Connect CRE, “CMBS Special Servicing Rate Climbs to New Post-2013 High”",
    url: "https://www.connectcre.com/stories/cmbs-special-servicing-rate-climbs-to-new-post-2013-high/",
  },
  treppDq: {
    label: "Trepp, CMBS delinquency report, September 2026",
    url: "https://www.trepp.com/trepptalk/cmbs-delinquency-report-sept-2026",
  },
  kbra: {
    label: "KBRA Analytics, KCP credit alerts: Project Prime (Oct 16, 2026) and Chicago hotel strike",
    url: "https://www.kbra.com/analytics/products/kcp/research",
  },
  connectRtl: {
    label: "Connect CRE, “Return to Lender: Week of Oct. 15, 2026” (citing Morningstar Credit)",
    url: "https://www.connectcre.com/stories/return-to-lender-week-of-oct-15-2026/",
  },
  coWaikiki: {
    label: "Commercial Observer, Hyatt Regency Waikiki loan sent to special servicing (Oct 16, 2026)",
    url: "https://commercialobserver.com/2026/10/cmbs-loan-hyatt-regency-waikiki-beach-resort-special-servicing/",
    flag: "Single-source",
  },
  cw: {
    label: "Cushman & Wakefield, MarketBeat U.S. Hospitality Q2 2026 (STR/CoStar data; Metro)",
    url: "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
  },
  trdChi: {
    label: "The Real Deal, Royal Sonesta River North sale (Oct 8, 2026)",
    url: "https://therealdeal.com/chicago/2026/10/08/manga-hotel-group-snaps-up-discounted-chicago-loop-hotel/",
  },
  hotelRealtorChi: {
    label: "Hotel Realtor, “Manga buys Chicago Sonesta”",
    url: "https://hotelrealtor.biz/manga-buys-royal-sonesta-chicago/",
  },
  kbraChi: {
    label: "KBRA Analytics, KCP credit alert “Chicago Hotel Strike Reaches CMBS Collateral” (Palmer House appraisal)",
    url: "https://www.kbra.com/analytics/products/kcp/research",
    flag: "Single-source",
  },
  wttw: {
    label: "WTTW News, “Chicago Hotel Workers Expand Strike” (Oct 19, 2026)",
    url: "https://news.wttw.com/2026/10/19/chicago-hotel-workers-expand-strike-they-negotiate-wages-working-conditions",
  },
  cbsChi: {
    label: "CBS Chicago, workers at two more Chicago hotels strike (Oct 18, 2026)",
    url: "https://www.cbsnews.com/chicago/news/workers-chicago-hotels-strike-demand-better-pay-benefits/",
  },
  chooseChi: {
    label: "Choose Chicago, 2025 Hotel Performance, Central Business District (Jan 2026)",
    url: "https://cdn.choosechicago.com/uploads/2026/01/Hotel-Performance-2025.pdf",
  },
  peb: {
    label: "Pebblebrook Hotel Trust, Form 8-K Exhibit 99.1, sale of The Hotel Zags (Oct 9, 2026)",
    url: "https://www.sec.gov/Archives/edgar/data/1474098/000147409826000066/peb100926hotelzagssaleex991.htm",
  },
  hmZags: {
    label: "Hotel Management, “NewcrestImage buys Oregon hotel for $10M” (Oct 9, 2026)",
    url: "https://www.hotelmanagement.net/transactions/newcrestimage-buys-oregon-hotel-10m",
  },
  opb: {
    label: "OPB Think Out Loud (May 29, 2026), citing CoStar data reported by the Portland Business Journal",
    url: "https://www.opb.org/article/2026/05/29/think-out-loud-portland-downtown-hotels-pandemic/",
    flag: "Secondary · single-source",
  },
  costarAug: {
    label: "CoStar, U.S. hotel performance for August 2026 (press release)",
    url: "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026",
  },
  coJerseyCity: {
    label: "Commercial Observer, Hyatt Regency Jersey City loan sent to special servicing (Sep 15, 2026)",
    url: "https://commercialobserver.com/2026/09/cmbs-loan-hyatt-regency-jersey-city-special-servicing/",
    flag: "Single-source",
  },
  trdRitz: {
    label: "The Real Deal, Ritz-Carlton Central Park South sale (Feb 18, 2026)",
    url: "https://therealdeal.com/new-york/2026/02/18/gencom-pays-320m-for-ritz-carlton-central-park-south/",
    flag: "Single-source",
  },
  hdNyc: {
    label: "Hotel Dive, NYC hotel workers ratify contract (May 22, 2026)",
    url: "https://www.hoteldive.com/news/nyc-hotel-workers-ratify-historic-wage-contract/820972/",
    flag: "Single-source",
  },
  trdSantaMonica: {
    label: "The Real Deal, Goldman buys loan on Shutters on the Beach and Casa del Mar (Sep 30, 2026)",
    url: "https://therealdeal.com/la/2026/09/30/goldman-buys-slatkins-loan-on-santa-monica-hotels/",
    flag: "Single-source",
  },
  bisnowPerLa: {
    label: "Bisnow, Hotel Per La sale (Sep 14, 2026), citing The Real Deal",
    url: "https://www.bisnow.com/news/los-angeles/hotel/daniel-negari-buys-downtown-la-hotel-per-la",
    flag: "Secondary · single-source",
  },
  trdGoodtime: {
    label: "The Real Deal, CIM Group takes Goodtime Hotel in foreclosure auction (Jul 1, 2026)",
    url: "https://therealdeal.com/miami/2026/07/01/cim-group-takes-goodtime-hotel-in-foreclosure-auction/",
    flag: "Single-source",
  },
  coArlo: {
    label: "Commercial Observer, Arlo Wynwood sale (Sep 29, 2026, updated)",
    url: "https://commercialobserver.com/2026/09/arlo-wynwood-miami-dauntless-capital-partners-quadrum-global/",
    flag: "Single-source",
  },
  creGodfrey: {
    label: "Commercial Real Estate Direct, Godfrey Hotel Boston sale (May 15, 2026)",
    url: "https://crenews.com/2026/05/15/godfrey-hotel-in-boston-sells-for-124mln/",
    flag: "Single-source",
  },
  kidder: {
    label: "Kidder Mathews, Seattle hotel market report, mid-year 2026",
    url: "https://kidder.com/wp-content/uploads/market_report/hotel-market-research-seattle-2026-2q.pdf",
  },
  braemarSea: {
    label: "Braemar Hotels & Resorts, sale of Marriott Seattle Waterfront (PR Newswire, Aug 11, 2025)",
    url: "https://www.prnewswire.com/news-releases/braemar-hotels--resorts-announces-sale-of-marriott-seattle-waterfront-302526388.html",
  },
  hdSea: {
    label: "Hotel Dive, Seattle Embassy Suites workers end 85-day strike (Sep 16, 2026)",
    url: "https://www.hoteldive.com/news/union-workers-at-seattle-hilton-reach-deal-to-end-85-day-strike/830486/",
    flag: "Single-source",
  },
  parkSf: {
    label: "Park Hotels & Resorts, receiver completes sale of Hilton San Francisco hotels (Nov 24, 2025)",
    url: "https://www.pkhotelsandresorts.com/investors/news-and-events/press-releases/2025/11-24-2025-113016228",
  },
  sunstoneSf: {
    label: "Sunstone Hotel Investors, Form 8-K Exhibit 99.1, Hyatt Regency San Francisco sale agreement (Jun 23, 2026)",
    url: "https://www.sec.gov/Archives/edgar/data/1295810/000110465926076640/sho-20260623xex99d1.htm",
  },
  creDc: {
    label: "Commercial Real Estate Direct, Capitol Hill Hotel sale (Oct 17, 2025)",
    url: "https://crenews.com/2025/10/17/153-room-hotel-in-washington-d-c-sells-for-60mln/",
    flag: "Single-source",
  },
} satisfies Record<string, PreviewSource>;

export const NATIONAL_RADAR: PreviewRadar = {
  slug: "national-inbound-and-refinance",
  tag: "National",
  name: "U.S. hotel capital: inbound demand and refinance stress",
  description:
    "Two national reads that set the backdrop for city and market underwriting: international inbound demand and the lodging CMBS refinance test. Cited sources only. Decision support.",
  status: "watch",
  chatQuestion: "What should an investor take from the national inbound demand and lodging refinance findings?",
  findings: [
    {
      id: "n1-overseas-arrivals",
      severity: "watch",
      stat: {
        label: "Overseas arrivals, Aug 2026",
        value: "−11.8%",
        hint: "vs Aug 2025 · −5.8% year to date · U.S. Travel (NTTO data)",
      },
      title: "Overseas arrivals fell 11.8% in August; the 2026 international rebound is not showing up",
      summary:
        "U.S. Travel reports overseas arrivals down 11.8% in August and 5.8% lower year to date. Its May forecast called for international visits to grow 3.4% to 70.6 million in 2026. International visitors’ travel purchases in the U.S. were nearly $10.8 billion in August, against $11.8 billion a year earlier. AHLA’s 2026 State of the Industry says downtown and airport submarkets “remained the furthest from recovery.” Domestic reads are firmer: August RevPAR rose 2.0%, led by airport, urban and suburban hotels, and corporate hotel bookings were running ahead of last year for October (+5.2%), November (+7.7%) and December (+11.2%).",
      capital:
        "For hotels that lean on international guests, typically gateway city-center full-service, underwrite the trailing twelve months and 2027 budgets without an international rebound. Size debt on domestic and corporate demand, which current data supports better. Decision support.",
      sources: [SRC.ustravelDash, SRC.ustravelFcst, SRC.ntto, SRC.ahla],
    },
    {
      id: "n2-lodging-special-servicing",
      severity: "watch",
      stat: {
        label: "Lodging CMBS special servicing, Sep 2026",
        value: "8.95%",
        hint: "Trepp · also reported by Connect CRE",
        change: { direction: "up", text: "+21 bp vs August" },
      },
      title: "Lodging special servicing rose to 8.95%; October adds Project Prime ($745.7M) and Hyatt Regency Waikiki ($302M)",
      summary:
        "Trepp’s September reads: lodging special servicing rose 21 basis points to 8.95%, and lodging delinquency rose 34 basis points to 6.18%, with a $280.0M Santa Monica beachfront hotel loan among the new delinquencies. October added two maturity-driven transfers: Project Prime, a $745.7M loan on 72 hotels (7,008 keys) that matures in December 2026, and the $302M Hyatt Regency Waikiki loan after a missed final maturity payment. Together that is about $1.05B across two named loans; this is our sum, not a Trepp total. JLL, writing in AHLA’s 2026 State of the Industry, counts $46 billion of hotel loans set to mature in 2026.",
      capital:
        "Maturity, not missed payments, is driving these transfers, so the refinance test decides outcomes: takeout at 7.5–8.0% or higher, and a debt yield of at least 10% on a normalized trailing twelve months, with 9% or less flagged. Expect more lender-led sales through year end, and keep labor underwritten at current contract levels. Decision support.",
      sources: [SRC.treppSs, SRC.connectSs, SRC.treppDq, SRC.kbra, SRC.connectRtl, SRC.coWaikiki, SRC.ahla],
    },
  ],
};

export const CITY_CENTER_RADAR: PreviewRadar = {
  slug: "city-center-repricing",
  tag: "City-center",
  name: "City-center hotels: repricing driven by debt and costs",
  description:
    "Downtown hotels in the cities we track are repricing, driven mostly by debt and costs (loan maturities, rates and labor contracts), with demand weakness in specific cities rather than everywhere. This radar follows trades, distress and labor, and shows demand where a free source reports it. Decision support.",
  status: "alert",
  chatQuestion: "What should an investor take from the City-center hotel repricing findings?",
  findings: [
    {
      id: "c1-chicago",
      severity: "alert",
      stat: {
        label: "Royal Sonesta River North sale, Oct 2026",
        value: "$21.0M",
        hint: "261 keys · −62% vs 2019 price · The Real Deal",
      },
      title: "Chicago: a River North hotel trades 62% below its 2019 price as the Palmer House stays in foreclosure and the strike widens",
      summary:
        "A Manga Hotel Group venture paid $21.0M for the 261-key Royal Sonesta River North, 62% below the $55M paid in 2019 (The Real Deal, citing Crain’s). The Palmer House Hilton’s $328.9M CMBS loan remains in foreclosure, with a March 2026 appraisal of $295.0M, and KBRA counts five CMBS loans totaling $513.6M exposed to the labor dispute. On Oct. 18, workers at the Hilton Chicago and Hyatt Regency Chicago joined workers at six hotels on strike since Oct. 9; more than 7,000 workers at 46 hotels have been without a contract since Sept. 1. Demand is not the driver here: Metro RevPAR rose 13.6% in Q2.",
      capital:
        "This is a capital-structure and cost reset, not a demand collapse. Recovery on foreclosed collateral falls as strike days add up. Underwrite labor at the contract that is eventually settled; the strike is a cost and recovery input, not a reason to plan on fewer staff. Decision support.",
      sources: [SRC.trdChi, SRC.hotelRealtorChi, SRC.kbraChi, SRC.wttw, SRC.cbsChi, SRC.cw],
    },
    {
      id: "c2-portland",
      severity: "alert",
      stat: {
        label: "The Hotel Zags sale, Oct 8, 2026",
        value: "$10.0M",
        hint: "174 rooms · trailing EBITDA ($0.6)M · Pebblebrook",
      },
      title: "Portland: a downtown hotel sells for $10.0M with negative trailing EBITDA, and downtown occupancy sat near 62% in 2025",
      summary:
        "Pebblebrook sold the 174-room Hotel Zags for $10.0M on Oct. 8. For the twelve months to Aug. 31, the hotel’s estimated EBITDA was ($0.6)M and its net operating loss ($0.8)M. CoStar data reported by the Portland Business Journal, as discussed on OPB, put downtown Portland hotel occupancy at roughly 62% in 2025, nearly 10 percentage points below 2019. The reporting points to business travelers and visitors staying outside downtown.",
      capital:
        "Of the cities we track, this is the clearest case of demand driving distress. A hotel with negative net operating income has no debt yield, so it fails the 10% test outright. Price on land, conversion or repositioning value rather than a pre-2020 stabilized income. Decision support.",
      sources: [SRC.peb, SRC.hmZags, SRC.opb],
    },
  ],
};

export type CityRow = {
  city: string;
  status: "active" | "watch" | "alert";
  coverage: "Real" | "Partial";
  metro: string;
  other: string;
  distress: string;
  trades: string;
  labor: string;
};

const NONE = "No item checked yet";

/** Ordered Alert → Watch → Active. Status follows the city-level triggers in the proposal. */
export const CITY_ROWS: CityRow[] = [
  {
    city: "Chicago",
    status: "alert",
    coverage: "Real",
    metro: "Metro OCC 75.8% · RevPAR $149 (+13.6%) · demand +5.1%",
    other: "Downtown (CBD) 2025: OCC 69.2%, ADR $243.10, RevPAR $168.15 (Choose Chicago)",
    distress: "Palmer House Hilton: $328.9M loan in foreclosure; March 2026 appraisal $295.0M (KBRA)",
    trades: "Royal Sonesta River North: $21.0M / 261 keys, −62% vs 2019 (The Real Deal)",
    labor: "Strike at 8 hotels (6 since Oct. 9, 2 since Oct. 18); 7,000+ workers at 46 hotels without a contract since Sept. 1 (WTTW)",
  },
  {
    city: "Los Angeles",
    status: "alert",
    coverage: "Partial",
    metro: "Metro OCC 72.7% · RevPAR $156 (+5.8%) · demand −2.2%",
    other: "No free downtown read",
    distress:
      "Shutters on the Beach and Casa del Mar (Santa Monica): $280M CMBS loan sent to special servicing this summer; Goldman Sachs bought the loan (The Real Deal). Trepp lists a $280.0M Santa Monica beachfront hotel loan as newly delinquent in September",
    trades: "Hotel Per La (Downtown LA): $34M / 241 rooms, sold by lender Waterfall after the debt topped $134M (Bisnow)",
    labor: NONE,
  },
  {
    city: "Portland, OR",
    status: "alert",
    coverage: "Partial",
    metro: "Not in the Q2 metro table",
    other: "Downtown 2025: occupancy roughly 62%, nearly 10 points below 2019 (OPB, citing CoStar via the Portland Business Journal)",
    distress: NONE,
    trades: "The Hotel Zags: $10.0M / 174 rooms; trailing EBITDA ($0.6)M (Pebblebrook)",
    labor: NONE,
  },
  {
    city: "New York",
    status: "watch",
    coverage: "Real",
    metro: "Metro OCC 85.6% · RevPAR $304 (+4.3%) · demand +0.2%",
    other: "August: ADR −3.3% to $275.07, the largest ADR drop among the Top 25 markets (CoStar)",
    distress:
      "Hyatt Regency Jersey City (351 keys, New Jersey side of the metro): $100M loan sent to special servicing ahead of its October 2026 maturity (Commercial Observer)",
    trades: "Ritz-Carlton Central Park South: $320M (The Real Deal, Feb 2026)",
    labor: "Eight-year HTC contract ratified May 21, 2026; non-tipped wages rise $21.20 over its life, more than 5% a year on average (Hotel Dive)",
  },
  {
    city: "Seattle",
    status: "watch",
    coverage: "Real",
    metro: "Metro OCC 71.8% · RevPAR $138 (+2.3%) · demand −0.7%",
    other: "Downtown (CBD) 2Q26: OCC 70.7%, ADR $239, RevPAR $169, vs 72.2% / $236 / $170 in 2Q25 (Kidder Mathews)",
    distress: "No named hotel loan in free sources",
    trades: "Marriott Seattle Waterfront: $145M / 369 rooms, 8.1% cap rate (Braemar, Aug 2025)",
    labor: "Embassy Suites Pioneer Square: 85-day strike ended Sept. 15; housekeepers’ starting pay $31.03/hr from Jan. 1, 2027 (Hotel Dive)",
  },
  {
    city: "Boston",
    status: "watch",
    coverage: "Partial",
    metro: "Metro OCC 77.0% · RevPAR $210 (+2.8%) · demand −1.1%",
    other: "No free downtown read",
    distress: "No named hotel loan in free sources",
    trades: "Godfrey Hotel: $124M ($512,397 per room) (Commercial Real Estate Direct, May 2026)",
    labor: NONE,
  },
  {
    city: "Miami",
    status: "watch",
    coverage: "Partial",
    metro: "Metro OCC 71.4% · RevPAR $180 (+10.8%) · demand −3.5%",
    other: "No free downtown read",
    distress: "Goodtime Hotel (Miami Beach): lender CIM Group took it with a $100 credit bid after a $205M foreclosure judgment (The Real Deal, Jul 2026)",
    trades: "Arlo Wynwood: about $65M (Commercial Observer, Sep 2026)",
    labor: NONE,
  },
  {
    city: "San Francisco",
    status: "active",
    coverage: "Partial",
    metro: "Metro (SF/San Mateo) OCC 76.0% · RevPAR $179 (+13.0%) · demand +4.8%",
    other: "August: largest Top 25 gains; OCC 79.3%, RevPAR $171.84 (+15.8%) (CoStar)",
    distress: "Hilton SF Union Square and Parc 55 ($725M CMBS loan): court-appointed receiver completed the sale in Nov 2025 (Park Hotels & Resorts)",
    trades: "Hyatt Regency SF: $279M / 821 rooms agreed at a 3.5% cap rate, 21.4x EBITDA, below a 7.5% takeout (Sunstone, Jun 2026)",
    labor: NONE,
  },
  {
    city: "Washington, DC",
    status: "active",
    coverage: "Partial",
    metro: "Metro OCC 77.2% · RevPAR $164 (+9.0%) · demand +4.8%",
    other: "No free downtown read",
    distress: NONE,
    trades: "Capitol Hill Hotel: $60M / 153 rooms ($392,156 per room) (Commercial Real Estate Direct, Oct 2025)",
    labor: NONE,
  },
];

export const CITY_TABLE_NOTE =
  "Metro figures are Q2 2026 (three months) from Cushman & Wakefield’s MarketBeat, using STR/CoStar data, with year-over-year change. They cover the whole metro, not downtown, and June includes World Cup host-city effects. Downtown figures appear only where a free source reports them. Coverage: Real means cited demand, debt or deal, and labor items; Partial means two of the three.";

export const THIN_CITIES_LINE =
  "Data is thin for Philadelphia, San Diego, Denver, Minneapolis and New Orleans. We have a metro read for each but no downtown distress, trade or labor item checked against its source yet, so they have no row.";

export const CITY_TABLE_SOURCES: PreviewSource[] = [
  SRC.cw,
  SRC.chooseChi,
  SRC.kbraChi,
  SRC.trdChi,
  SRC.wttw,
  SRC.trdSantaMonica,
  SRC.treppDq,
  SRC.bisnowPerLa,
  SRC.peb,
  SRC.opb,
  SRC.costarAug,
  SRC.coJerseyCity,
  SRC.trdRitz,
  SRC.hdNyc,
  SRC.kidder,
  SRC.braemarSea,
  SRC.hdSea,
  SRC.creGodfrey,
  SRC.trdGoodtime,
  SRC.coArlo,
  SRC.parkSf,
  SRC.sunstoneSf,
  SRC.creDc,
];
