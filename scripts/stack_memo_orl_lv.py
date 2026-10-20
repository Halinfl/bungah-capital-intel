"""Orlando + Las Vegas Stack memo blocks (checked 2026-10-20).

Hand-assembled from the Orlando / Las Vegas supply, pipeline, demand, capital, operations and
hotel-tax research files. Every figure row below was re-read on its linked page or PDF on
2026-10-20; rows that did not reconcile were dropped (see DROPPED). Caution lines are written
from the research files' own wording, with no numbers. Same shape as the Tier 1 blocks.
"""

def R(t, u, d="", sec=False, **kw):
    x = {"t": t, "u": list(u), "sec": sec, "d": d}
    x.update(kw)
    return x

def EV(start, end, t, u):
    return R(f"{start} → {end} · {t} · attendance: no public read", u, start=start, end=end, gap=False)

# ---- sources (each fetched and checked 2026-10-20) ----
GOAA_AUG = "https://assets.ctfassets.net/qiecpoxp4bka/5fJzM0VXeVKYRbQUPUTPSz/9c7dd3d3684a38ecc9c9333cafd340bc/trfc202608.pdf"
GOAA_CY25 = "https://assets.ctfassets.net/qiecpoxp4bka/1MOLx11i86PzTaJbFMajq8/275542622f136c11bf36a0bdc4d7df35/mgtycy2025.pdf"
MCO_NEW = "https://flymco.com/new-resuming-service/"
VO_DT = "https://www.visitorlando.org/about/resources/data-trends/"
VO_PR = "https://www.prnewswire.com/news-releases/orlando-welcomed-record-76-7-million-visitors-in-2025--remaining-no-1-most-visited-destination-in-the-us-302766198.html"
OC_AUG = "https://www.occompt.com/DocumentCenter/View/60606/2026-08-August-TDT-Collection-PDF"
IACP = "https://www.theiacpconference.org/"
LE = "https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/"
LAKE = "https://disneyparksblog.com/wdw/lakeshore-lodge-disney-world-updates/"
IC = "https://www.growthspotter.com/2025/06/30/700-key-intercontinental-hotel-on-i-drive-set-to-break-ground-early-2026/"
TUSC = "https://www.growthspotter.com/2026/09/29/orange-county-reverses-tuscana-denial-as-costs-wetlands-split-board/"
APOP = "https://theapopkavoice.com/stories/marriott-hotel-moves-closer-to-construction-at-floridian-town-center,184463"
RHP_8K = "https://www.sec.gov/Archives/edgar/data/1040829/000110465926104349/tm2624390d1_8k.htm"
RHP_PR = "https://www.sec.gov/Archives/edgar/data/1040829/000110465926104349/tm2624390d1_ex99-1.htm"
FL_MW = "https://natlawreview.com/article/increased-minimum-wage-florida-employees"
UH_DIS = "https://unitehere.org/press-releases/disney-workers-won-a-raise/"
STCU = "https://www.uniteherelocal737.org/wp-content/uploads/2022-2027-Full-Time-STCU-Contract-with-MOUs-and-Letters.pdf"
OW_BVP = "https://www.orlandoweekly.com/news/hilton-hotel-workers-in-orlando-score-wage-increases-job-protections-in-new-union-contract-39785055/"

LAS_AUG = "https://assets.ctfassets.net/2pnrhs9eukyp/37v7s6EInxXWtkLlyKUa7l/c62686f7797f3c8107181a2ff1f2b8bc/August_2026_Passengers_Press_Release.pdf"
RJ_LAS = "https://www.reviewjournal.com/business/tourism/las-vegas-airport-passenger-traffic-plunges-9-2-in-august-3893051/"
LV_FAQ = "https://www.lvcva.com/research/faqs/"
N3_AUG = "https://news3lv.com/news/local/las-vegas-tourism-drops-august-2026-lvcva-convention-visitation-hotel-hospitality-southern-nevada"
FOX5_JUL = "https://www.fox5vegas.com/2026/08/28/las-vegas-visitor-volume-rises-july-convention-attendance-falls/"
NACS_FAQ = "https://nacsshow.com/attendee-faq"
M2020 = "https://us.money2020.com/"
SSG = "https://www.supplysideglobal.com/"
SEMA = "https://www.sema.org/event/sema-show-0"
HLTH = "https://hlth.com/2026event"
REPLUS = "https://re-plus.events/"
ISSA = "https://www.issashow.com/"
F1 = "https://www.f1lasvegasgp.com/"
REINV = "https://reinvent.awsevents.com/"
MJBIZ = "https://mjbizconference.com/"
RJ_HR = "https://www.reviewjournal.com/business/casinos-gaming/guitar-tower-exterior-nearing-completion-hard-rock-pacing-toward-27-opening-3867603/"
MORT = "https://www.mortenson.com/news-insights/marriott-hotel-las-vegas-convention-center-construction"
RJ_MORT = "https://www.reviewjournal.com/business/tourism/new-hotel-to-be-built-near-las-vegas-convention-center-3835622/"
FOX5_HEART = "https://www.fox5vegas.com/2026/07/22/clark-county-approves-heart-shaped-hotel-las-vegas-strip-site-failed-ferris-wheel/"
ENR_DREAM = "https://www.enr.com/articles/61274-mccarthy-buys-partly-built-vegas-dream-resort-from-failed-developer"
AHT_8K = "https://www.sec.gov/Archives/edgar/data/1232582/000123258226000199/aht-20260925.htm"
HREALTOR = "https://hotelrealtor.biz/ashford-sells-las-vegas-embassy-suites/"
CRE_DAILY = "https://finance.yahoo.com/real-estate/articles/four-las-vegas-casino-loans-163035320.html"
FOX5_HR = "https://www.fox5vegas.com/2026/01/29/hard-rock-las-vegas-tower-construction-brings-more-than-600-new-workers-site/"

MARKETS = {
 "orlando": {
  "supply": {
   "score": 3,
   "caution": "Ask which Orlando: a meeting-campus resort and an I-Drive box are different supply stories.",
   "rows": [
    R("Inventory 2025: 132,685 hotel rooms; occupancy 71.4%, ADR $202.71, 34.5M room nights", [VO_DT], "YE 2025", k="Inventory"),
    R("Early-planning pipeline: 54 projects / 5,474 rooms; new project announcements 8 / 1,292 rooms", [LE], "Q2 2026", k="Pipeline"),
    R("Under construction and starts across the metro: no public read", [], k="Under construction"),
   ],
   "projects": [
    R("Disney's Lakeshore Lodge · 967 keys · opens 2027-07-01 · Walt Disney World", [LAKE]),
    R("InterContinental Orlando (I-Drive) · 700 keys · planned; groundbreaking targeted Q1 2026, start not confirmed · open target 2028", [IC], "reported 2025-06-30"),
    R("Tuscana · 1,291 keys · entitlement only (county approved 2026-09-29) · timing: no public read", [TUSC]),
    R("Fairfield Inn + TownePlace Suites, Floridian Town Center (Apopka) · 137 keys · major plan approved 2026-09-03 · timing: no public read", [APOP]),
   ],
   "rollup": [],
  },
  "demand": {
   "caution": "Record visitors are not room scarcity; ask which Orlando before reading the average.",
   "visitation": R("Visitors 2025: 76.7M (70.3M domestic, 6.3M international)", [VO_DT, VO_PR], "YE 2025", k="Visitors 2025"),
   "airlift": [
    R("MCO Aug 2026 total passengers: 4,375,567 (−6.89%)", [GOAA_AUG], "Aug 2026 report", k="MCO Aug 2026"),
    R("MCO calendar year to date through Aug: 38,961,312 (+0.04%); rolling 12 months 57,687,961 (+1.68%)", [GOAA_AUG], "Aug 2026 report", k="MCO year to date"),
    R("MCO 2025 total: 57,675,573 (+0.81%); scheduled international 8,454,834 (+8.21%)", [GOAA_CY25], "CY 2025", k="MCO 2025"),
    R("New route: TAP Air Portugal Lisbon (LIS) starts 2026-10-29", [MCO_NEW], "", k="New routes"),
   ],
   "seats": [R("Nov 2026–Mar 2027 seat schedule: no public read (no free schedule source)", [], k="Seat schedule")],
   "anchors": [
    R("Orange County Convention Center 2025: 187 events, 2,047,768 attendees", [VO_DT], "YE 2025", k="Convention center"),
    R("Latest month (Aug 2026, Orange County hotels): occupancy 62.4% (−5.8%), ADR $174.95 (−3.2%)", [OC_AUG], "released 2026-10-06", k="Latest month"),
   ],
   "events": [
    EV("2026-10-24", "2026-10-27", "IACP 2026 annual conference (International Association of Chiefs of Police), Orlando", [IACP]),
    R("November to mid-December convention-center calendar: no public read (the official calendar could not be pulled)", [], start=None, end=None, gap=True),
   ],
   "pace": R("2027 citywide pace / gains-losses: no public read", [], "", k="2027 pace"),
   "normalize": None,
  },
  "capital": {
   "caution": "Grande Lakes prices a group-resort campus, not the Orlando average.",
   "cautionSecondary": False,
   "comps": [
    R("Grande Lakes Orlando (JW Marriott 1,010 + Ritz-Carlton 582 = 1,592 keys) · closed 2026-09-01 · ~$1.38B (Ryman, equity-funded) · ~$867K per key (our arithmetic) · cap rate not disclosed", [RHP_8K, RHP_PR], "2026-09-01", cap=None, dk=20260901),
   ],
   "loans": [R("Named Orlando hotel loans in special servicing or foreclosure: no public read", [], watch=False)],
   "holdability": "",
  },
  "ops": {
   "caution": "Disney sets the wage floor here, not Florida's minimum.",
   "flag": "Disney's union contract (Service Trades Council) runs to Oct 2, 2027, inside the hold; Orlando hotel union pay is compared against Disney scale",
   "flagLinks": [STCU, UH_DIS],
   "wage": [
    R("Florida minimum wage: $15.00/hr; tipped cash $11.98; $15.00 is the last scheduled step; annual inflation increases start 2027-09-30", [FL_MW], "eff. 2026-09-30", k="Florida minimum wage", union=False, gap=False),
    R("Disney union scale: housekeepers reach $24/hr and the current-worker minimum $20.50 at the final scheduled step (Oct 2026); contract expires 2027-10-02", [UH_DIS, STCU], "Oct 2026", k="Disney union scale", union=True, gap=False),
    R("Hilton Buena Vista Palace (UNITE HERE Local 737): housekeepers $16 → $21/hr at ratification, $24 by June 2028", [OW_BVP], "2025", k="Hotel union contract", union=True, gap=False),
   ],
   "oews": None,
   "build": None,
   "operators": [
    R("Grande Lakes Orlando: Ryman's hotel portfolio is managed by Marriott International (company statement)", [RHP_PR], "2026-09-01"),
    R("Named third-party operator moves in Orlando: no public read", []),
   ],
   "change": None, "changeLinks": [],
   "preopen": [R("Disney's Lakeshore Lodge (opens 2027-07-01): named pre-open leadership: no public read", [])],
   "gaps": ["Property-level union contract status", "Construction-labor supply for the metro"],
  },
 },
 "las-vegas": {
  "supply": {
   "score": 4,
   "caution": "Hard Rock's return adds Strip rooms into soft demand, and Downtown is already soft.",
   "rows": [
    R("Inventory 2025: 150,300 hotel rooms", [LV_FAQ], "YE 2025", k="Inventory"),
    R("Weighted room inventory Jul 2026: 150,608 (+0.8%)", [FOX5_JUL], "Jul 2026", k="Inventory, latest month"),
   ],
   "projects": [
    R("Hard Rock Las Vegas (former Mirage) · ~3,600 keys (Guitar Hotel 675) · under construction · Strip · late second half of 2027", [RJ_HR]),
    R("AC Hotel + Residence Inn (Mortenson) · 397 keys · broke ground 2026-06-15 · next to the convention center · completion Summer 2028", [MORT, RJ_MORT]),
    R("Heart-shaped resort, former SkyVue site (south Strip) · room count: no public read · zoning approved 2026-07-22, entitlement only · timing: no public read", [FOX5_HEART]),
    R("Dream Las Vegas · 527 keys · stalled at about 20% complete; McCarthy bought the site · timing: no public read", [ENR_DREAM]),
   ],
   "rollup": [],
  },
  "demand": {
   "caution": "Conventions are holding while leisure softens; underwrite each segment on its own.",
   "visitation": R("Visitors 2025: 38,545,700; convention delegates 5,988,200", [LV_FAQ], "YE 2025", k="Visitors 2025"),
   "airlift": [
    R("LAS Aug 2026 total passengers: 4,149,332 (−9.2% vs 4,567,908)", [LAS_AUG], "Aug 2026 report", k="LAS Aug 2026"),
    R("LAS year to date through Aug: 34,353,312 (−7.2%); August domestic −10.2%, international +3.9%", [LAS_AUG, RJ_LAS], "Aug 2026 report", k="LAS year to date"),
    R("LAS 2025 total: 54,988,547 passengers", [LV_FAQ], "YE 2025", k="LAS 2025"),
   ],
   "seats": [R("Nov 2026–Mar 2027 seat schedule: no public read (no free schedule source)", [], k="Seat schedule")],
   "anchors": [
    R("2025 hotels: occupancy 80.3% (weekend 88.8%, midweek 76.6%; Strip 83.2%, Downtown 67.5%); average nightly rate $184", [LV_FAQ], "YE 2025", k="2025 hotels"),
    R("Latest month (Aug 2026): visitors about 3.03M (−4.3%); occupancy 74.1% (−3.4 pts); ADR about $150 (−7.4%); convention attendance 622,700 (+6%)", [N3_AUG], "Aug 2026", k="Latest month"),
    R("Drive market: I-15 at the Nevada–California border averages 43,301 vehicles a day", [LV_FAQ], "2025", k="Drive"),
   ],
   "events": [
    EV("2026-10-18", "2026-10-21", "Money20/20 USA", [M2020]),
    EV("2026-10-26", "2026-10-30", "SupplySide Global (Mandalay Bay)", [SSG]),
    EV("2026-11-03", "2026-11-06", "SEMA Show", [SEMA]),
    EV("2026-11-15", "2026-11-18", "HLTH (Venetian Expo)", [HLTH]),
    EV("2026-11-16", "2026-11-19", "RE+ (Las Vegas Convention Center)", [REPLUS]),
    EV("2026-11-16", "2026-11-19", "ISSA Show North America (Mandalay Bay)", [ISSA]),
    EV("2026-11-21", "2026-11-21", "Las Vegas Grand Prix race weekend (post-race show Saturday Nov 21)", [F1]),
    EV("2026-11-30", "2026-12-04", "AWS re:Invent", [REINV]),
    EV("2026-12-01", "2026-12-04", "MJBizCon (Las Vegas Convention Center)", [MJBIZ]),
   ],
   "pace": R("2027 citywide change: the NACS Show moves to Atlanta (Oct 5–8, 2027), an October 2027 gap for Las Vegas", [NACS_FAQ], "", k="2027 pace"),
   "normalize": None,
  },
  "capital": {
   "caution": "A few big casino loans make the national hotel-loan numbers look healthier than a typical hotel.",
   "cautionSecondary": False,
   "comps": [
    R("Embassy Suites Las Vegas (220 keys, near UNLV, about five minutes from the Strip) · closed 2026-09-25 · ~$43.5M cash (Ashford seller) · ~$198K per key (our arithmetic) · cap rate not disclosed", [AHT_8K, HREALTOR], "2026-09-25", cap=None, dk=20260925),
   ],
   "loans": [
    R("Four Las Vegas casino resort CMBS loans: $12.01B, 13.0% of the $92.18B securitized lodging market, all current with debt yields of 13.38%–27.90%; without them the nonperforming rate is 6.87% instead of 5.98%", [CRE_DAILY], "2026-10-06", watch=False),
    R("Named non-casino Las Vegas hotel loans in special servicing or foreclosure: no public read", [], watch=False),
   ],
   "holdability": "",
  },
  "ops": {
   "caution": "Casino owners run most big hotels in-house; supervisors, engineers and F&B leaders are the scarce hires.",
   "flag": "None public at market level; check each asset's union contract status in diligence",
   "flagLinks": [],
   "wage": [],
   "oews": None,
   "build": R("Hard Rock Las Vegas: about 1,500–1,800 construction workers at peak", [FOX5_HR], "2026-01-29"),
   "operators": [R("Named third-party operator moves in Las Vegas: no public read", [])],
   "change": None, "changeLinks": [],
   "preopen": [R("Hard Rock Las Vegas (late 2027): named pre-open leadership: no public read", [])],
   "gaps": ["Nevada and Clark County wage-floor steps", "Property-level union contract status"],
  },
 },
}

DROPPED = [
 "Orlando: MCO 'last 12 months 58,206,242' (airport stats page did not show it; the Aug traffic PDF's rolling 12 months is 57,687,961, used instead)",
 "Orlando: $98.6B economic impact (not on the cited Visit Orlando pages; economic impact is not demand anyway)",
 "Orlando: Grande Lakes '~12.5x Adj. EBITDAre' multiple (the SEC filings show $12.5M partial-year operating-income guidance, not a multiple; only the trade-press piece states it)",
 "Orlando: OCCC events other than IACP (secondary listings; official calendar blocked) and the Nov–Dec calendar (no pull)",
 "Orlando: IACP dates corrected to Oct 24–27 per the organizer (file said Oct 25–27)",
 "Orlando: 'Unicorp up to 2,000 entitled rooms' (entitlement bank, not a project; not restated on a checked page)",
 "Orlando: Epic Universe opening date (no checked link in the files)",
 "Orlando: Disney 2023 '$18/hr' floor (superseded by the 2026 step)",
 "Las Vegas: LVCVA ADR $183.52, 44.0M room nights, visitor −7.5% YoY (not on the LVCVA FAQ page; FAQ shows $184 and visitor count only)",
 "Las Vegas: heart-shaped resort '752 rooms' (the cited article says the room count was reduced but gives no number)",
 "Las Vegas: Dream '~527–531' range and Hard Rock Wikipedia links (Wikipedia is not a primary source; ENR gives 527)",
 "Las Vegas: KiTalent supervisory-scarcity figures (page did not carry the cited text)",
 "Las Vegas: Penta 'thousands of workers' (no figure; FOX5 used for 1,500–1,800)",
 "Las Vegas: NBAA-BACE, FABTECH, AAPEX, LDI, Gartner, PRINTING United, NFR dates (aggregator-only or not confirmed on an organizer page)",
 "Las Vegas: TSA screening counts via Flightline Intel, CoStar week figures, Truist room-rate survey (secondary or single-week reads)",
 "Both: Jul–Aug 2026 LVCVA room-tax estimates; Orange County budget figures (budgets are not collections)",
]
