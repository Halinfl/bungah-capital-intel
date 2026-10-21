/**
 * 2026-10-11 off-cycle public-data sweep → Capital Graph Signals.
 *
 * Source library: /workspace/neo-capital-intel/
 *   capital/notes/2026-10-11-sweep.md   (Ledger)
 *   markets/notes/2026-10-11-sweep.md   (Atlas)
 *   demand/notes/2026-10-11-sweep.md    (Vectra)
 *   people/notes/2026-10-11-sweep.md    (Herald)
 *   product/earnings/_index/2026-10-11-weekly-scan.md + company files (Callbook)
 *
 * Rules: facts only from those notes, each with the note's source URL. Where a
 * note gives no URL for an item, sourceLabel names the note + date instead.
 * Public / free sources only (spend lock). Decision support — cited signals
 * for human decision, never auto capital actions.
 *
 * Stable ids (`sweep-20261011-*`) make the loader idempotent (upsert by id).
 * National kinds deliberately avoid "debt" / "talent" so the legacy national
 * debt-wall / talent stubs keep their deterministic roles in chat.
 */

export type SweepSignal = {
  id: string;
  /** Market slug from the 55-MSA registry; null = national / unscoped. */
  marketSlug: string | null;
  kind: string;
  title: string;
  body: string;
  magnitude: string | null;
  asOf: string;
  sourceLabel: string;
};

export const SWEEP_2026_10_11: SweepSignal[] = [
  {
    "id": "sweep-20261011-orl-aug-operating",
    "marketSlug": "orlando",
    "kind": "occupancy",
    "title": "Orlando August 2026 operating print — soft (Orange County)",
    "body": "Orange County August 2026 (Visit Orlando via Orange County Comptroller TDT report): OCC 62.4% (−5.8% YoY), room demand −5.7%, ADR $174.95 (−3.2%). Tourist development tax $24.83M (−3.2% YoY; −7.4% vs budget). September TDT report due early November. Two soft months out of three (June and August) on a ~132.7k-room base — impact ≠ scarcity; ask which Orlando, and watch whether fall pace (Halloween, Food & Wine, conventions) shows up in Sep/Oct TDT.",
    "magnitude": "OCC 62.4% (−5.8%) / ADR $174.95 (−3.2%)",
    "asOf": "Aug 2026",
    "sourceLabel": "Orange County Comptroller Aug 2026 TDT collection report https://www.occompt.com/DocumentCenter/View/60606/2026-08-August-TDT-Collection-PDF; Florida Politics https://floridapolitics.com/archives/823417-orange-county-hotel-tax-falls-3-as-some-theme-parks-acknowledge-economic-challenges/"
  },
  {
    "id": "sweep-20261011-orl-costar-wk-sep26",
    "marketSlug": "orlando",
    "kind": "occupancy",
    "title": "Orlando week ending 26 Sep — counter-signal (calendar shift)",
    "body": "CoStar week ending 26 Sep 2026: Orlando posted the largest Top 25 occupancy gain (+18.6% to 68.3%), with a Rosh Hashanah calendar shift lifting the comparison. Single holiday-shifted week — do not read as a trend reversal versus the soft August print.",
    "magnitude": "OCC 68.3% (+18.6%), w/e 26 Sep",
    "asOf": "w/e 2026-09-26",
    "sourceLabel": "CoStar US hotel results week ending 26 September https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-26-september"
  },
  {
    "id": "sweep-20261011-orl-mco-winter-routes",
    "marketSlug": "orlando",
    "kind": "demand",
    "title": "Orlando airlift: MCO winter route adds (incl. TAP Lisbon from Oct 29)",
    "body": "MCO October adds: Southwest ELP/JAN (Oct 3), Breeze BGR (Oct 21), Delta AMS resumes (Oct 24), TAP Lisbon (LIS) new 3x weekly A330-900neo from Oct 29, Canada resumes (YYZ/YHZ/YWG). November: Avelo McKinney (Nov 12), Concord (Nov 18), Southwest SJC/SLC (Nov 21), Frontier MCI/MDW/MSP resume; December Colombia adds. Route counts ≠ seats. Route backfill is forward-looking while the August softness is trailing.",
    "magnitude": "TAP LIS 3x weekly from Oct 29",
    "asOf": "2026-10-11",
    "sourceLabel": "MCO new & resuming service https://flymco.com/new-resuming-service/; Airport Routes (TAP LIS–MCO) https://www.airportroutes.com/news/tp-lis-mco-2026-10-29/; Deep Arrival https://deeparrival.com/news/orlando-airport-new-returning-flights-winter-2026-2027/"
  },
  {
    "id": "sweep-20261011-orl-disney-wage-floor",
    "marketSlug": "orlando",
    "kind": "talent",
    "title": "Orlando labor: Disney STCU wage floor — final scheduled step (Oct 2026)",
    "body": "Disney Service Trades Council Union (incl. UNITE HERE 362/737) final scheduled raises land Oct 2026: union housekeepers $24, dishwashers $22, Cook 1 $27.10, current-worker minimum $20.50 (post-Dec-3-2023 hires $20). Agreement runs Oct 2, 2022 through Oct 2, 2027, so the next Disney bargaining overlaps 2027 budgets. Raises the Orlando operating-cost floor just as August demand softened — a budget-pressure read, not a reason to staff thinner on the guest face.",
    "magnitude": "Housekeeping $24; contract through 2027-10-02",
    "asOf": "Oct 2026",
    "sourceLabel": "UNITE HERE (Mar 31 2023 wage schedule) https://unitehere.org/press-releases/disney-workers-won-a-raise/; STCU 2022–2027 full-time agreement (Local 737) https://www.uniteherelocal737.org/wp-content/uploads/2022-2027-Full-Time-STCU-Contract-with-MOUs-and-Letters.pdf"
  },
  {
    "id": "sweep-20261011-orl-rhp-grande-lakes",
    "marketSlug": "orlando",
    "kind": "transaction",
    "title": "Ryman (RHP) closed Grande Lakes Orlando — ~$1.38B / ~$867K per key",
    "body": "RHP closed ~$1.38B Grande Lakes Orlando (JW Marriott 1,010 + Ritz-Carlton 582 keys) — ~$867K per key (derived) ($1.38B / 1,592 keys). FY'26 Adj. EBITDAre guide raised to $908–945M (from $878–910M); same-store RevPAR guide unchanged at 3.5–4.5%; AFFO/share midpoint −$0.05 to $8.90–9.26. Scarcity-layer group-resort campus comp, not an MSA average.",
    "magnitude": "~$1.38B / ~$867K per key",
    "asOf": "2026-09-01",
    "sourceLabel": "RHP 8-K 2.01/7.01 (2026-09-01) https://www.sec.gov/Archives/edgar/data/1040829/000110465926104349/tm2624390d1_8k.htm; Ex. 99.1 https://www.sec.gov/Archives/edgar/data/1040829/000110465926104349/tm2624390d1_ex99-1.htm"
  },
  {
    "id": "sweep-20261011-orl-kissimmee-toho-square",
    "marketSlug": "orlando",
    "kind": "supply",
    "title": "Kissimmee Toho Square — entitlement watch (pipeline, not under construction)",
    "body": "Kissimmee master development agreement approved ~2026-10-06: 100–120-key select-service hotel + 18–20 condos; CRA incentive up to $4.3M. Site review, permits and acquisition still ahead — entitlement watch, not UC.",
    "magnitude": "100–120 keys (entitled, not UC)",
    "asOf": "2026-10-06",
    "sourceLabel": "Hoodline https://hoodline.com/2026/10/kissimmee-locks-in-toho-square-deal-hotel-condos-parks-near-sunrail/; Orlando Business Journal https://www.bizjournals.com/orlando/news/2026/10/07/kissimmee-downtown-cra-hotel-condo-project-clears.html"
  },
  {
    "id": "sweep-20261011-las-airport-pax",
    "marketSlug": "las-vegas",
    "kind": "demand",
    "title": "Las Vegas airlift: LAS passengers −9.2% in August, −7.2% YTD",
    "body": "Harry Reid (LAS) August 2026: 4.1M passengers, −9.2% YoY (domestic −10.2%, international +3.9%). YTD 34.4M, −7.2%. Carrier mix: Frontier +35.3%, Southwest −4.6%, Delta −8.8% — Frontier backfill is partial. September stats not yet posted. Seat-cliff read stays amber/red for Las Vegas.",
    "magnitude": "Aug −9.2% / YTD −7.2%",
    "asOf": "Aug 2026",
    "sourceLabel": "Las Vegas Review-Journal https://www.reviewjournal.com/business/tourism/las-vegas-airport-passenger-traffic-plunges-9-2-in-august-3893051/; LAS 2026 aviation statistics https://www.harryreidairport.com/business/airport-operations/financial-reporting-statistics/airport-activity/2026-aviation-statistics"
  },
  {
    "id": "sweep-20261011-las-nacs-2027-exit",
    "marketSlug": "las-vegas",
    "kind": "demand",
    "title": "Las Vegas loses NACS Show fall citywide in 2027 (moves to Atlanta)",
    "body": "NACS Show ran at LVCC Oct 6–9, 2026 (2025: 25,136 attendees; official block rates $97–$529 + resort fee). The 2027 show moves to Atlanta (Oct 5–8, 2027) — Las Vegas loses a fall citywide next year; mark the Oct 2027 convention-calendar gap.",
    "magnitude": "Oct 2027 citywide gap",
    "asOf": "2026-10-09",
    "sourceLabel": "NACS Show attendee FAQ https://nacsshow.com/attendee-faq; NACS 2026 hotel rates https://connectionshousingapps.com/documents/2026_NACS/NACS26HotelsRates.pdf"
  },
  {
    "id": "sweep-20261011-las-hard-rock-evac",
    "marketSlug": "las-vegas",
    "kind": "supply",
    "title": "Hard Rock Las Vegas construction — one-day evacuation, still late-2027",
    "body": "Hard Rock Las Vegas site evacuated 2026-10-05 over a vague threat; work resumed 10-06. Reopening still targeted late 2027 — no change to the supply-return timeline.",
    "magnitude": "late-2027 unchanged",
    "asOf": "2026-10-06",
    "sourceLabel": "News3LV https://news3lv.com/news/local/work-resumes-at-hard-rock-las-vegas-site-day-after-evacuation-over-vague-threat"
  },
  {
    "id": "sweep-20261011-las-skift-wk-oct3",
    "marketSlug": "las-vegas",
    "kind": "occupancy",
    "title": "Las Vegas only top-25 market down in week ending Oct 3 (RevPAR −18%)",
    "body": "Per the Skift Daily Lodging Report for the week ending Oct 3, Las Vegas was the only top-25 market down, with RevPAR −18% — consistent with the LAS passenger decline. Single-week read.",
    "magnitude": "RevPAR −18% (w/e Oct 3)",
    "asOf": "w/e 2026-10-03",
    "sourceLabel": "Skift Daily Lodging Report (week ending Oct 3) (accessed 2026-10-11)"
  },
  {
    "id": "sweep-20261011-atl-nacs-2027",
    "marketSlug": "atlanta",
    "kind": "demand",
    "title": "Atlanta gains NACS Show citywide (Oct 5–8, 2027)",
    "body": "The NACS Show moves from Las Vegas to Atlanta for 2027 (Oct 5–8, 2027). 2025 attendance was 25,136. A fall citywide add for Atlanta's convention calendar.",
    "magnitude": "Citywide add Oct 2027",
    "asOf": "2026-10-09",
    "sourceLabel": "NACS Show attendee FAQ https://nacsshow.com/attendee-faq"
  },
  {
    "id": "sweep-20261011-mia-westin-airport-cancel",
    "marketSlug": "miami",
    "kind": "supply",
    "title": "Miami pipeline: Westin at MIA (451 rooms) cancelled after FAA design rejection",
    "body": "Ross / Soffer JV (FDR Miami Hotel LLC) dropped the 451-room, 150-ft Westin at Miami International Airport after the FAA rejected the design over a radar blind spot; a redesign was not economically viable. Miami-Dade is terminating the 50-year lease (approved 2023) and plans an expedited RFP. The project had been slated for late-2027 completion. Remove from the Miami pipeline; FAA height/radar review is a reusable entitlement-risk gate for airport-adjacent hotels.",
    "magnitude": "−451 rooms from pipeline",
    "asOf": "2026-10-08",
    "sourceLabel": "The Real Deal https://therealdeal.com/miami/2026/10/08/steve-ross-jeffrey-soffer-miami-airport-hotel-project-dies/; Bisnow https://www.bisnow.com/news/south-florida/hotel/steve-ross-jeffrey-soffer-scrap-miami-airport-hotel-project-after-faa-pushback"
  },
  {
    "id": "sweep-20261011-mia-arlo-wynwood",
    "marketSlug": "miami",
    "kind": "transaction",
    "title": "Arlo Wynwood trade — about $65M, no cap disclosed",
    "body": "Arlo Wynwood: about $65M (Commercial Observer, updated article; the deed lists $44.3M, and the full price includes furniture, fixtures and business operations) with a $43M BMO loan. No cap rate disclosed.",
    "magnitude": "about $65M",
    "asOf": "2026-10-11 sweep",
    "sourceLabel": "Commercial Observer (2026-09-29)"
  },
  {
    "id": "sweep-20261011-chi-unite-here-strike",
    "marketSlug": "chicago",
    "kind": "talent",
    "title": "Chicago hotel labor: UNITE HERE Local 1 strike at 6 hotels (from Oct 9)",
    "body": "UNITE HERE Local 1 walkouts since Oct 9 at 6 downtown hotels: Millennium Knickerbocker, Palmer House Hilton, Sheraton Grand Riverwalk, Waldorf Astoria Chicago, Westin River North, Westin Michigan Ave — timed to Marathon weekend. Wider dispute covers 7,000+ workers at 46 hotels; contracts expired Aug 31; the union says more hotels could join. Asks: wages, health care, pension and safer workloads (union says staffing is still below pre-pandemic). Marriott says it has staffing protocols and remains available to meet. Read: gateway labor comp — a settled contract raises the labor floor in NOI; cutting guest-facing staff is not a way to rebuild debt yield.",
    "magnitude": "6 hotels striking; 7,000+ workers / 46 hotels in dispute",
    "asOf": "2026-10-09 → ongoing",
    "sourceLabel": "Chicago Sun-Times 2026-10-09 https://chicago.suntimes.com/business/2026/10/09/hotel-workers-strike-chicago-marathon-weekend; NBC Chicago 2026-10-10 https://www.nbcchicago.com/news/local/chicago-hotel-workers-strike-for-second-day-as-fight-continues-for-new-contract/4000651/"
  },
  {
    "id": "sweep-20261011-chi-palmer-house-foreclosure",
    "marketSlug": "chicago",
    "kind": "debt",
    "title": "Palmer House Hilton — $328.9M CMBS in foreclosure, now also on strike",
    "body": "Palmer House Hilton's $328.9M CMBS loan is in foreclosure (Trepp brand cut: Hilton-flagged full-service NPL 16.17%). It is also among the 6 Chicago hotels on strike since Oct 9, so the strike lands on the lender/receiver's NOI and lowers recovery rather than hitting the borrower. A recovery and labor-comp read, not a template for cutting staff.",
    "magnitude": "$328.9M in foreclosure",
    "asOf": "2026-10-09",
    "sourceLabel": "CRE Daily (Trepp brand cut, 2026-10-01) https://www.credaily.com/briefs/hilton-hotel-cmbs-distress-outpaces-marriotts-trepp-finds/; Chicago Sun-Times 2026-10-09 https://chicago.suntimes.com/business/2026/10/09/hotel-workers-strike-chicago-marathon-weekend"
  },
  {
    "id": "sweep-20261011-dal-cade-hotel-roanoke",
    "marketSlug": "dallas",
    "kind": "supply",
    "title": "Dallas MSA new construction: Cade Hotel by Hilton, Roanoke (205 rooms) broke ground",
    "body": "Roanoke's Cade Hotel by Hilton (205 rooms) plus a city-owned convention center: construction started in August, ceremonial groundbreaking 2026-10-07; the convention center is backed by a $62M bond. A small public-private start in the Dallas–Fort Worth MSA.",
    "magnitude": "+205 rooms (under construction)",
    "asOf": "2026-10-07",
    "sourceLabel": "Cross Timbers Gazette 2026-10-07 https://www.crosstimbersgazette.com/2026/10/07/roanoke-breaks-ground-on-convention-center-hilton-hotel/"
  },
  {
    "id": "sweep-20261011-nyc-hyatt-regency-jersey-city",
    "marketSlug": "new-york-city",
    "kind": "debt",
    "title": "Hyatt Regency Jersey City — $100M CMBS to special servicing",
    "body": "Hyatt Regency Jersey City ($100M CMBS, 351 keys) moved to special servicing for imminent October maturity default; net cash flow only met underwriting in 2016. Jersey City is in the New York–Newark–Jersey City MSA.",
    "magnitude": "$100M / 351 keys",
    "asOf": "Oct 2026",
    "sourceLabel": "Jersey Digs https://jerseydigs.com/hyatt-regency-jersey-city-loan-default/"
  },
  {
    "id": "sweep-20261011-phx-four-seasons-scottsdale",
    "marketSlug": "phoenix",
    "kind": "transaction",
    "title": "Four Seasons Scottsdale — 6.2% cap / $1.8M per key (Braemar → Evergreen)",
    "body": "Four Seasons Scottsdale (Braemar → Evergreen) at $372M ($1.8M per key) at a 6.2% cap on TTM August NOI including $23M capex; close ~Oct 22. A luxury-resort scarcity comp, not a market cap rate — the core band stays ~8.0–8.5%.",
    "magnitude": "6.2% cap / $1.8M per key",
    "asOf": "2026-10",
    "sourceLabel": "Hospitality Tribune https://thehospitalitytribune.com/braemar-four-seasons-scottsdale-sale-ashford-exit/"
  },
  {
    "id": "sweep-20261011-hnl-park-hhv-payoff",
    "marketSlug": "honolulu",
    "kind": "debt",
    "title": "Park (PK) repaid $1.275B Hilton Hawaiian Village CMBS ahead of maturity",
    "body": "Park Hotels & Resorts repaid the $1.275B Hilton Hawaiian Village CMBS (4.20%, due Nov 1) on Sep 30 using a $700M Bonnet Creek mortgage + $600M delayed-draw term loan. Weighted-average maturity extended to 3.1 years; under 11% of debt maturing through 2027; HHV now unencumbered; fixed debt moved to floating. Trophy-resort refinance works when the sponsor has balance-sheet levers.",
    "magnitude": "$1.275B payoff",
    "asOf": "2026-09-30",
    "sourceLabel": "PK 8-K 1.02 (2026-09-30) https://www.sec.gov/Archives/edgar/data/1617406/000161740626000045/pk-20260930.htm; Hotel Business https://hotelbusiness.com/park-repays-1-275b-loan-for-hilton-hawaiian-village-resort/"
  },
  {
    "id": "sweep-20261011-lax-santa-monica-sasb-dq",
    "marketSlug": "los-angeles",
    "kind": "debt",
    "title": "Santa Monica beachfront hotel $280M SASB loan newly delinquent",
    "body": "New lodging CMBS delinquency in the September TreppTalk report includes a $280M Santa Monica beachfront hotel SASB loan.",
    "magnitude": "$280M SASB",
    "asOf": "Sep 2026",
    "sourceLabel": "TreppTalk CMBS delinquency report Sep 2026 https://www.trepp.com/trepptalk/cmbs-delinquency-report-sept-2026"
  },
  {
    "id": "sweep-20261011-pdx-peb-hotel-zags",
    "marketSlug": "portland-or",
    "kind": "transaction",
    "title": "Pebblebrook sold The Hotel Zags (Portland) — $10.0M / ~$57K per room",
    "body": "Pebblebrook (PEB) sold The Hotel Zags (Portland, 174 rooms) for $10.0M (~$57K per key (derived)). TTM hotel EBITDA was ($0.6)M; proceeds may fund buybacks; no change to the Q3 Outlook. Exit of a loss-making urban asset — a distressed-looking per-key comp.",
    "magnitude": "$10.0M / ~$57K per key",
    "asOf": "2026-10-08",
    "sourceLabel": "PEB 8-K 7.01 Ex. 99.1 (2026-10-08) https://www.sec.gov/Archives/edgar/data/1474098/000147409826000066/peb100926hotelzagssaleex991.htm"
  },
  {
    "id": "sweep-20261011-nola-aug-steepest-drop",
    "marketSlug": "new-orleans",
    "kind": "occupancy",
    "title": "New Orleans posted the steepest US OCC / RevPAR drops in August",
    "body": "CoStar's August 2026 US results name New Orleans as posting the steepest occupancy and RevPAR declines among markets. No market-level figures in the note — read alongside the national August print (OCC 66.4%, RevPAR +2.0%).",
    "magnitude": "Steepest Aug OCC/RevPAR drop",
    "asOf": "Aug 2026",
    "sourceLabel": "CoStar US hotel performance August 2026 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026"
  },
  {
    "id": "sweep-20261011-nola-fairmont-opening",
    "marketSlug": "new-orleans",
    "kind": "supply",
    "title": "Fairmont New Orleans opening now expected in November",
    "body": "Hotel Dive notes Accor's Fairmont New Orleans is now expected to open in November.",
    "magnitude": "Opening expected November",
    "asOf": "2026-10-06",
    "sourceLabel": "Hotel Dive 2026-10-06 https://www.hoteldive.com/news/accor-appoints-chief-development-officer-luxury-north-america/832184/"
  },
  {
    "id": "sweep-20261011-us-10y-rates",
    "marketSlug": null,
    "kind": "rates",
    "title": "US 10Y Treasury 5.24% close Oct 9 (5.31% peak close Oct 5)",
    "body": "10Y closed 5.244% on Oct 9; intraweek peak close 5.311% on Oct 5 (intraday high ~5.365% Oct 7, a 24-year high per CNBC), then eased after a solid auction. 2Y 4.80%. +6 bp vs the 5.18% lock; peak +13 bp — under the ~25 bp / ~5.43% re-price wire. Next FOMC Oct 27–28. House IC pack holds (takeout ≥7.5–8.0%+, DY ≥10%).",
    "magnitude": "10Y 5.244% (peak 5.311%)",
    "asOf": "2026-10-09",
    "sourceLabel": "Advisor Perspectives Treasury snapshot 2026-10-09 https://www.advisorperspectives.com/dshort/updates/2026/10/09/treasury-yields-snapshot-october-9-2026; Investing.com 10Y history https://uk.investing.com/rates-bonds/u.s.-10-year-bond-yield-historical-data; CNBC US10Y https://www.cnbc.com/quotes/US10Y"
  },
  {
    "id": "sweep-20261011-us-lodging-dq-sep",
    "marketSlug": null,
    "kind": "cmbs",
    "title": "Lodging CMBS delinquency 6.18% (September) — no October read yet",
    "body": "TreppTalk September: lodging delinquency 6.18% (+34 bp); overall CMBS 8.02%, highest since Nov 2020. New lodging DQ includes a $280M Santa Monica beachfront hotel SASB loan. No October print yet — watch the early-November read (a third straight rise would trigger the hotel-type cut).",
    "magnitude": "Lodging DQ 6.18% (+34 bp)",
    "asOf": "Sep 2026",
    "sourceLabel": "TreppTalk CMBS delinquency report Sep 2026 https://www.trepp.com/trepptalk/cmbs-delinquency-report-sept-2026"
  },
  {
    "id": "sweep-20261011-us-trepp-brand-cut",
    "marketSlug": null,
    "kind": "cmbs",
    "title": "Trepp brand cut: Hilton-flagged CMBS distress outpaces Marriott",
    "body": "Trepp brand cut (via CRE Daily, Oct 1): Hilton-flagged non-performing rate 11.73% vs Marriott 7.23%; Hilton full-service 16.17% (Palmer House $328.9M in foreclosure); Marriott limited-service 16.66% vs Hilton limited-service 3.59%.",
    "magnitude": "Hilton NPL 11.73% vs Marriott 7.23%",
    "asOf": "2026-10-01",
    "sourceLabel": "CRE Daily (Trepp) 2026-10-01 https://www.credaily.com/briefs/hilton-hotel-cmbs-distress-outpaces-marriotts-trepp-finds/"
  },
  {
    "id": "sweep-20261011-us-cap-rate-band",
    "marketSlug": null,
    "kind": "cap_rate",
    "title": "Hotel cap rates: core band ~8.0–8.5% holds; DiamondRock Bellmoor 8.6%",
    "body": "DiamondRock's Bellmoor Inn & Spa trade: $31.0M / $392K per key at an 8.6% cap, 10.4x EBITDA, ~9.5% stabilized yield. Luxury-resort trophy trades price ~6% (Four Seasons Scottsdale 6.2%). Read: core band ~8.0–8.5% holds — bifurcation, not compression.",
    "magnitude": "Core 8.0–8.5%; Bellmoor 8.6%; trophy ~6%",
    "asOf": "2026-10-11",
    "sourceLabel": "DiamondRock release https://www.sec.gov/Archives/edgar/data/1298946/000129894626000043/exhibit99110126.htm (accessed 2026-10-11)"
  },
  {
    "id": "sweep-20261011-us-costar-aug",
    "marketSlug": null,
    "kind": "performance",
    "title": "US hotels August 2026: OCC 66.4%, ADR $161.78, RevPAR +2.0%",
    "body": "CoStar August 2026 US: OCC 66.4% (+0.5%), ADR $161.78 (+1.5%), RevPAR $107.43 (+2.0%) — growth slowing vs July; New Orleans posted the steepest drops. September weeks are holiday-distorted (w/e 19 Sep ADR $179.30, highest week on record, RevPAR +10.4%; w/e 26 Sep RevPAR +14.2%; w/e 12 Sep −6.2%) — read the September monthly, not single weeks.",
    "magnitude": "OCC 66.4% / ADR $161.78 / RevPAR +2.0%",
    "asOf": "Aug 2026",
    "sourceLabel": "CoStar US hotel performance August 2026 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; CoStar w/e 19 Sep https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-19-september"
  },
  {
    "id": "sweep-20261011-us-group-pace",
    "marketSlug": null,
    "kind": "group_pace",
    "title": "Group pace: unsold block 15% → 19%; lead times compressed to 2–3 weeks",
    "body": "Amadeus Demand360 worldwide October 2026 on-the-books (as of Sep 23) pacing moderately behind last year; unsold group block rose from 15% to 19% of mix (groups 18% vs 19%, transient flat) — read as later confirmations, not yet softer demand; Nov/Dec editions decide pickup vs wash. CoStar/Tourism Economics Q3 assumptions: in-the-quarter-for-the-quarter group lead times compressed from 30–60 days to 2–3 weeks. Staff for the late pickup — no rate- or FTE-cutting into business that is still landing.",
    "magnitude": "Unsold block 19% (from 15%)",
    "asOf": "2026-09-23",
    "sourceLabel": "Global Travel Post (Amadeus October pace) https://globaltravelpost.com/article/october-pace-report-visibility-reading-not-demand-reading; CoStar Q3 2026 forecast assumptions https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/data-insights-blog/us-hotel-forecast-assumptions-q3-2026"
  },
  {
    "id": "sweep-20261011-us-gas-price",
    "marketSlug": null,
    "kind": "drive",
    "title": "National gas average $4.36 — first October above $4 (drive friction)",
    "body": "AAA (Oct 8): national gas average $4.36, the first October above $4; crude back above $90. Drive-friction watch for drive-to markets (Orlando in-state leisure, SoCal → Las Vegas I-15).",
    "magnitude": "$4.36/gal",
    "asOf": "2026-10-08",
    "sourceLabel": "AAA newsroom 2026-10-08 https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/"
  },
  {
    "id": "sweep-20261011-us-ihg-owner-confidence",
    "marketSlug": null,
    "kind": "franchise_climate",
    "title": "IHG Owners Association confidence index first read: 45.2 (below 50)",
    "body": "IHG Owners Association launched a quarterly Owner Confidence Index; first read 45.2 (50 = neutral). Owners cite softer demand/economic uncertainty (53%), rising operating costs (45%) and fuel/gas (15%) [association survey]. Sentiment, not a demand print.",
    "magnitude": "45.2",
    "asOf": "2026-10-07",
    "sourceLabel": "Skift Daily Lodging Report 2026-10-07 https://dlr.skift.com/2026/10/07/accor-opens-first-emblems-collection-hotel-in-north-america/"
  },
  {
    "id": "sweep-20261011-us-randall-hilton-accor",
    "marketSlug": null,
    "kind": "brand_dev",
    "title": "Kara Randall moves from Hilton to Accor (CDO, Luxury Brands North America)",
    "body": "Accor named Kara Randall Chief Development Officer, Luxury Brands, North America (effective Oct 1), covering Raffles, Fairmont, Sofitel Legend, Sofitel, Emblems and MGallery. She spent 20 years at Hilton, most recently VP, luxury, residential & corporate development, North America (Waldorf, Conrad, LXR). Leaves a Hilton NA luxury-development seat to watch.",
    "magnitude": "Hilton → Accor",
    "asOf": "2026-10-05",
    "sourceLabel": "Hotel Business 2026-10-05 https://hotelbusiness.com/accor-names-kara-randall-cdo-north-america-luxury-hospitality-brands/; Hotel Dive 2026-10-06 https://www.hoteldive.com/news/accor-appoints-chief-development-officer-luxury-north-america/832184/"
  },
  {
    "id": "sweep-20261011-us-choice-ceo",
    "marketSlug": null,
    "kind": "leadership",
    "title": "Choice Hotels CEO is Dominic Dragisich (effective Aug 31, 2026)",
    "body": "Choice Hotels named Dominic Dragisich President & CEO and director effective Aug 31, 2026; he had been interim CEO since May 20, 2026 (prior roles include CFO, EVP Ops & Chief Global Brand Officer, and Chief Growth & Strategy Officer).",
    "magnitude": "CEO",
    "asOf": "2026-08-31",
    "sourceLabel": "Choice Hotels media center 2026-08-31 https://media.choicehotels.com/2026-08-31-Choice-Hotels-International-Appoints-Dominic-Dragisich-as-President-Chief-Executive-Officer"
  },
  {
    "id": "sweep-20261011-us-q3-earnings-calendar",
    "marketSlug": null,
    "kind": "earnings_calendar",
    "title": "Lodging Q3 2026 earnings dates (all 10 covered names confirmed)",
    "body": "WH Oct 21 AMC (call Oct 22 08:30 ET); HLT Oct 27 BMO; H Oct 29 BMO; PEB Oct 29 AMC (call Oct 30); MAR, CHH and RHP Nov 2 (MAR ~07:00 ET / call 08:00, CHH ~06:30 / call 10:00, RHP AMC / call Nov 3); HST and PK Nov 4 AMC (calls Nov 5); APLE Nov 5 AMC (call Nov 6). No Q3 print is out yet.",
    "magnitude": "First print WH Oct 21",
    "asOf": "2026-10-11",
    "sourceLabel": "MAR Q3 date PR Newswire 2026-10-09 https://www.prnewswire.com/news-releases/marriott-international-announces-release-date-for-third-quarter-2026-earnings-302901545.html; CHH Q3 date PR Newswire 2026-10-07 https://www.prnewswire.com/news-releases/choice-hotels-international-to-report-third-quarter-2026-earnings-on-november-2-2026-302900735.html (accessed 2026-10-11)"
  },
  {
    "id": "sweep-20261011-us-mar-revolver",
    "marketSlug": null,
    "kind": "capital_markets",
    "title": "Marriott amended and extended revolver to $5.0B / 2031",
    "body": "Marriott's 7th amended & restated revolver: $4.50B → $5.00B, accordion to $5.50B, maturity extended from 2027-12-14 to 2031-09-23, SOFR + rating-based spread. Liquidity runway extended.",
    "magnitude": "$5.0B to 2031-09-23",
    "asOf": "2026-09-24",
    "sourceLabel": "MAR 8-K 1.01/2.03 (2026-09-24) https://www.sec.gov/Archives/edgar/data/1048286/000119312526401051/d145370d8k.htm"
  },
  {
    "id": "sweep-20261011-us-hyatt-place-gen4",
    "marketSlug": null,
    "kind": "supply_economics",
    "title": "Hyatt Gen 4 Hyatt Place: ~25% lower building cost [est.]",
    "body": "Hyatt's owner-economics package: Gen 4 Hyatt Place goes from 140 to 127 keys, building area ~−20%, six-story steel/concrete to four-story wood, projected ~25% lower building cost [company estimate]. Hyatt Studios structured-loan program with HALL Structured Finance (70+ hotels / 8,200+ rooms pipeline). Helps new-build basis but does not on its own clear a ≥7.5–8.0% takeout or DY ≥10%.",
    "magnitude": "~25% lower build cost [est.]",
    "asOf": "2026-10-05",
    "sourceLabel": "Hyatt newsroom https://newsroom.hyatt.com/news-releases?item=124836; Hotel News Resource 2026-10-06 https://www.hotelnewsresource.com/article143218.html"
  },
  {
    "id": "sweep-20261011-us-aihg-stress-test",
    "marketSlug": null,
    "kind": "labor_stress_test",
    "title": "Stress test, not a template: AI-native operator labor thesis (AIHG / Sloan Dean)",
    "body": "Stress test only — not a template. Per Skift (Sep 21) via Hotelier Times, Sloan Dean's AI-native operator (AIHG) model requires \"destroying some jobs\", with middle management −20–30% and housekeeping/kitchen efficiency ~10% [secondary, est.]; AIHG says it automates back-of-house, non-customer-facing functions first. Bungah's house rule holds: human touch first — never cut guest-facing FTE to hit debt yield. Use this to pressure-test labor assumptions, not to plan cuts.",
    "magnitude": "stress test",
    "asOf": "2026-09-25",
    "sourceLabel": "Hotelier Times 2026-09-25 https://hoteliertimes.com/ai-native-hotel-operator/; Skift 2026-09-21 https://skift.com/2026/09/21/ex-remington-ceo-is-building-an-ai-native-hotel-operator-exclusive/; Hotel Management 2026-09-29 https://www.hotelmanagement.net/operate/ai-hospitality-group-reinvent-hotel-management-through-ai"
  }
];
