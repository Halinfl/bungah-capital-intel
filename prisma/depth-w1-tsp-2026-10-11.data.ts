import type { LinkedSignal } from "./linked-signal";

// Herald talent (deepen/talent/depth-w1-*), Atlas supply + pipeline (markets/ + pipeline/ depth-w1-*) with
// supply-pressure scores (markets/_supply-pressure.md), 15 Tier 1 markets. One signal per cited table;
// sourceUrls = each row's original article. Gap notes ("no public read") kept as written, no link.
// Rows tagged verify/not pulled/not captured/unverified, or with no URL, excluded. Decision support.
// Labor underwritten at the new floors with no staff cuts (human touch first).
export const DEPTH_W1_TSP_2026_10_11: LinkedSignal[] = [
  {
    "id": "w1t-atlanta-1-wage-floor",
    "marketSlug": "atlanta",
    "kind": "talent",
    "title": "Atlanta talent: 1. Wage floor",
    "body": "Atlanta — 1. Wage floor. Georgia / Atlanta minimum wage: $7.25/hr federal applies (GA statute lower) · current 2026 | Atlanta hotel wage ordinance: None found — no public read | UNITE HERE Local 23 Atlanta: Affiliate exists · accessed 2026-10-11 | Hyatt Regency Atlanta (1,260 keys) — Local 23: Last public contract: 5-yr agreement ratified Oct 2015 (job security, sub-contracting rollback, HK workload relief on heavy checkout days); current contract terms no public read · 2015-10-05 | Recent strikes / settlements: None found for Atlanta hotels 2025–26. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "U.S. Dept. of Labor · UNITE HERE (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.dol.gov/agencies/whd/minimum-wage/state",
        "label": "Georgia / Atlanta minimum wage",
        "secondary": false
      },
      {
        "url": "https://unitehere.org/affiliates/local-23-atlanta/",
        "label": "UNITE HERE Local 23 Atlanta",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-atlanta-1-1-bls-oews-hotel-occupations",
    "marketSlug": "atlanta",
    "kind": "talent",
    "title": "Atlanta talent: 1.1 BLS OEWS — hotel occupations (MSA)",
    "body": "Atlanta — 1.1 BLS OEWS — hotel occupations (MSA). Maids & housekeeping cleaners (all industries) (37-2012): 9030 · $16.15 · $16.31 | Hotel, motel & resort desk clerks (43-4081): 4620 · $15.31 · $15.25 | Lodging managers (11-9081): 920 · $30.80 · $36.68 | Cooks, restaurant (all industries) (35-2014): 29040 · $17.90 · $17.20. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "U.S. BLS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.bls.gov/oes/current/oes_12060.htm",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      },
      {
        "url": "https://www.bls.gov/oes/special-requests/oesm25ma.zip",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-atlanta-2-build-talent",
    "marketSlug": "atlanta",
    "kind": "talent",
    "title": "Atlanta talent: 2. Build talent (summary — detail in atlanta-build.md)",
    "body": "Atlanta — 2. Build talent (summary — detail in atlanta-build.md). MSA construction jobs: 158,300 → 154,900 (−3,400, −2%) · Aug 2025 → Aug 2026 | Atlanta–Sandy Springs–Roswell division: 109,900 → 105,000 (−4,900, −4%; largest loss of 360) · same | National craft difficulty: 88% as hard/harder; electricians 81% · 2026-09-03. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "AGC of America (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.agc.org/sites/default/files/users/user21902/Metro%20Empl%202026_August_Alpha.pdf",
        "label": "MSA construction jobs",
        "secondary": false
      },
      {
        "url": "https://www.agc.org/news/2026/09/30/only-half-metro-areas-add-construction-jobs-over-past-12-months-data-centers-power-and-factories",
        "label": "Atlanta–Sandy Springs–Roswell division",
        "secondary": false
      },
      {
        "url": "https://www.agc.org/sites/default/files/users/user21902/2026%20Workforce%20Survey%20Analysis%20(4",
        "label": "National craft difficulty",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-atlanta-3-operator-bench",
    "marketSlug": "atlanta",
    "kind": "talent",
    "title": "Atlanta talent: 3. Operator bench",
    "body": "Atlanta — 3. Operator bench (D11). Peachtree Group (HQ One Alliance Center, Atlanta): O/M/D — 112 managed hotels, 13,882 keys (as of Jun 30 2026); third-party + owned; pre-opening & technical services · Portfolio lists Homewood Suites Buckhead, Courtyard Kennesaw, HGI Atlanta North/Johns Creek, SpringHill Perimeter Center, Canopy by Hilton Atlanta Midtown, Embassy Suites Kennesaw Town Center, Home2 Lawrenceville Sugarloaf, The Hamilton Alpharetta (Curio) · not on page | Hotel Equities (HQ Alpharetta / Atlanta): M/D — 70+ brands, 60+ markets; divisions incl. Springboard Hospitality, Destination Collection · Home-market HQ; merged with Springboard Hospitality eff. May 1 2025 · Ben Rafter, CEO; Brad Rahinsky, Chairman; Joseph Reardon, Vice Chairman; Albert Smith, COO (Jul 2025) | Noble Investment Group (Atlanta): Owner/investor (AM overlay) — 14-property WoodSpring buy (Jan 2026); 10-hotel upscale select/ES portfolio (Apr 2026); ~150 hotels in 18 months · Atlanta-HQ capital; operators per deal | Virgin Hotels (brand) + Drew Company (Boston-HQ developer/operator partner): Lifestyle · Virgin Hotels Atlanta, Centennial Yards (261 keys, 2027); Drew = \"second major development in Downtown Atlanta\" · Joe Margison, CEO Virgin Hotels; John P. Drew, CEO Drew Co.; Brian McGowan, President Centennial Yards Co.. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "peachtreegroup.com · hotelequities.com · Skift · nobleinvestment.com · virginhotels.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.peachtreegroup.com/hotel-management",
        "label": "Peachtree Group (HQ One Alliance Center, Atlanta)",
        "secondary": false
      },
      {
        "url": "https://www.hotelequities.com/meet-our-team.htm",
        "label": "Hotel Equities (HQ Alpharetta / Atlanta) — hotelequities.com",
        "secondary": false
      },
      {
        "url": "https://www.hotelequities.com/blog/hotel-equities-announces-key-leadership-appointments-after-strategic-merger-with-springboard-hospitality/",
        "label": "Hotel Equities (HQ Alpharetta / Atlanta) — hotelequities.com",
        "secondary": false
      },
      {
        "url": "https://skift.com/2026/07/02/noble-investment-groups-extended-stay-bet-is-behind-a-149-hotel-buying-spree/",
        "label": "Noble Investment Group (Atlanta) — skift.com",
        "secondary": false
      },
      {
        "url": "https://www.nobleinvestment.com/noble-insights/noble-acquires-ten-hotel-upscale-select-service-and-upscale-extended-stay-portfolio",
        "label": "Noble Investment Group (Atlanta) — nobleinvestment.com",
        "secondary": false
      },
      {
        "url": "https://virginhotels.com/press-releases/atlanta-2027/",
        "label": "Virgin Hotels (brand) + Drew Company (Boston-HQ developer/operator par",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-atlanta-3-2-pre-open-risk-named-openings",
    "marketSlug": "atlanta",
    "kind": "talent",
    "title": "Atlanta talent: 3.2 Pre-open risk — named openings",
    "body": "Atlanta — 3.2 Pre-open risk — named openings. The Pursuit at The Henry (Autograph) @ The Battery: pipeline lists 250 · 2027 · No public read (developers Goldenrod / SK Commercial Realty / Braves Development per https://www.connectcre.com/stories/trio-constructing-atlanta-hotel-apartments/) · Med: GC JE Dunn on site; operator unnamed = bench gap | Motto by Hilton Old Fourth Ward (Waldo's, 40 Boulevard NE): key count inconsistent across sources: 125 (2019 signing) → 146–147 → 170 planned (Oct 2024) · Stalled: garage built; crane removed Oct 2024 for redesign/re-permit/reprice; restart \"early 2025\" target — current status no public read · Originally HVMG (2019 signing); current operator no public read · https://atlanta.urbanize.city/post/waldos-project-old-fourth-ward-development-not-dead-despite-crane-removal-officials (2024-10-07) · https://stories.hilton.com/releases/motto-by-hilton-announces-first-us-hotel-signing-in-atlantas-old-fourth-ward-neighborhood. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "2 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "connectcre.com · atlanta.urbanize.city · stories.hilton.com (accessed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1t-atlanta-5-gaps",
    "marketSlug": "atlanta",
    "kind": "talent",
    "title": "Atlanta talent: 5. Gaps (no public read)",
    "body": "Atlanta — 5. Gaps (no public read). Current Local 23 Atlanta contracts (Hyatt Regency or other): No public read | Operator for The Pursuit at The Henry; Motto O4W: No public read | Hotel Equities current CEO: Resolved: Ben Rafter (company team page) | Atlanta hotel-specific trade shortage: No public read. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1s-atlanta-snapshot",
    "marketSlug": "atlanta",
    "kind": "supply",
    "title": "Atlanta supply: Snapshot",
    "body": "Atlanta — Snapshot. City of Atlanta inventory: 117 hotels / 27,810 rooms · 2025 | Metro inventory: 107,560 rooms · 1Q 2025 | Metro OCC / ADR / RevPAR: 66.9% / $134.10 / $89.66 · 1Q 2025 (TTM) (source: Same). Decision support.",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Georgia World Congress Center · nmrk.imgix.net (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.gwcca.org/wp-content/uploads/2025/12/12-09-2025-Board-Presentation_FINALFINAL.pdf",
        "label": "City of Atlanta inventory",
        "secondary": false
      },
      {
        "url": "https://nmrk.imgix.net/uploads/documents/hotel-nsights/Newmark_VA_Hotel-Nsights-Report_Atlanta_GA.PDF",
        "label": "Metro inventory",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-atlanta-latest-monthly-weekly-pulse",
    "marketSlug": "atlanta",
    "kind": "supply",
    "title": "Atlanta supply: Latest monthly / weekly pulse",
    "body": "Atlanta — Latest monthly / weekly pulse (D2). C&W MarketBeat Q2 2026 (STR/CoStar): OCC 65.9% (+0.5%), ADR $133 (+5.0%), RevPAR $88 (+5.5%); supply +0.9%; implied ~115k rooms | CoStar wk ending 2026-01-03: ADR −8.3% to $98.19 (largest Top-25 decline) | CoStar wk ending 2026-04-11: RevPAR −21.3% to $76.03 | CoStar wk ending 2026-04-18: OCC +20.7% to 72.5% (Easter/calendar shift likely) | HVS World Cup window: OCC −2.6 pt vs counterfactual; RevPAR +9.4% (+$1.96) | FIFA block release: ~1,000 rooms (source: Same note (Lighthouse)) | HVS 2026 read: Slight ADR gain from WC; OCC decline from displaced groups and weak commercial demand. Decision support.",
    "magnitude": "7 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Cushman & Wakefield · CoStar · HVS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "C&W MarketBeat Q2 2026 (STR/CoStar)",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-3-january",
        "label": "CoStar wk ending 2026-01-03",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-11-april",
        "label": "CoStar wk ending 2026-04-11",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-18-april",
        "label": "CoStar wk ending 2026-04-18",
        "secondary": false
      },
      {
        "url": "https://www.hvs.com/article/10529-how-the-2026-fifa-world-cup-changed-us-hotel-markets",
        "label": "HVS World Cup window",
        "secondary": false
      },
      {
        "url": "https://hvi.hvs.com/market/united-states/Atlanta",
        "label": "HVS 2026 read",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-atlanta-supply-pressure-score",
    "marketSlug": "atlanta",
    "kind": "supply",
    "title": "Atlanta supply-pressure score 4/5",
    "body": "Atlanta — Supply-pressure score: 4 / 5. UC intensity: 22 / 3,020 rooms UC (tied #4 nationally) | Starts vs history: #2 total pipeline 157 / 17,423; #2 starts next 12 mo 61 / 6,761; #2 early planning 74 / 8,351 (source: Same) | Openings: 2027e 22 / 2,145 (#2); 2028e #1 25 / 2,345 (source: Same) | Conversion share: Top-5 reno+conversion: 31 / 5,258 (source: Same) | Build-talent friction: No public read yet (source: TBD). Score 4/5 (1–2 tailwind; 3 mixed, underwrite by submarket; 4–5 no ground-up without hard barriers). Mobility read: City rooms +20% since 2018, OCC 74%→65%; 2028 openings leader. Decision support.",
    "magnitude": "score 4/5",
    "asOf": "2026-10-11",
    "sourceLabel": "Lodging Econometrics (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/",
        "label": "UC intensity",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-atlanta-stage-rollup",
    "marketSlug": "atlanta",
    "kind": "pipeline",
    "title": "Atlanta pipeline: Stage rollup (LE Q2 2026 public)",
    "body": "Atlanta — Stage rollup (LE Q2 2026 public). Total pipeline: 157 · 17,423 | Under construction: 22 · 3,020 (source: Same) | Start next 12 mo: 61 · 6,761 (source: Same) | Early planning: 74 · 8,351 (source: Same) | Renovation + conversion: 31 · 5,258 (source: Same) | Openings 2027e / 2028e: 22 / 25 · 2,145 / 2,345 (source: Same). Decision support.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Lodging Econometrics (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/",
        "label": "Total pipeline",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-atlanta-named-projects",
    "marketSlug": "atlanta",
    "kind": "pipeline",
    "title": "Atlanta pipeline: Named projects",
    "body": "Atlanta — Named projects. Signia by Hilton Atlanta (GWCC): 976 · Opened Jan 2024 · GWCC · Delivered | Hotel Phoenix @ Centennial Yards: 292 · Opened Dec 2025 · Downtown · Delivered | Virgin Hotels Atlanta @ Centennial Yards (CIM / Drew): 261 · UC · Downtown · Completion ~Dec 2027 | Second Battery hotel: 130 · Planning · Cobb · TBD (source: Same). Decision support.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "HVS · pro.groundbreak.city · groundbreak.city · cimgroup.com · stayinthenew.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://hvi.hvs.com/market/united-states/Atlanta",
        "label": "Signia by Hilton Atlanta (GWCC)",
        "secondary": false
      },
      {
        "url": "https://pro.groundbreak.city/atlanta/projects/6b966062-12a2-48af-8d9b-26994fb64061",
        "label": "Hotel Phoenix @ Centennial Yards",
        "secondary": false
      },
      {
        "url": "https://www.groundbreak.city/atlanta/virgin-hotels-atlanta-under-construction-centennial-yards",
        "label": "Virgin Hotels Atlanta @ Centennial Yards (CIM / Drew) — groundbreak.city",
        "secondary": false
      },
      {
        "url": "https://www.cimgroup.com/press-releases/cim-group-centennial-yards-company-and-the-drew-company-announce-partnership-to-bring-award-winning-virgin-hotel-to-downtown-atlanta",
        "label": "Virgin Hotels Atlanta @ Centennial Yards (CIM / Drew) — cimgroup.com",
        "secondary": false
      },
      {
        "url": "https://www.stayinthenew.com/new-hotels-atlanta-ga",
        "label": "Second Battery hotel",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-boston-1-wage-floor",
    "marketSlug": "boston",
    "kind": "talent",
    "title": "Boston talent: 1. Wage floor",
    "body": "Boston — 1. Wage floor. Massachusetts minimum wage: $15.00/hr; tipped service rate $6.75 (tips must lift to $15) · current 2026 | Boston city hotel wage ordinance: None found — no public read of a Boston hotel-specific minimum | UNITE HERE Local 26 citywide contracts: +$10/hr non-tipped and +$5/hr tipped over 4 years; ratification bonus $1,000 / $500; pension contributions up. 28 of 36 Local 26 hotels signed (90% of union rooms) by Dec 12 2024. Prior contract expired Aug 31 2024 · Dec 2024 | 2024 strikes: Indefinite strikes at 2 Hilton + 2 Omni hotels, ended Oct 2024; strike authorization Aug 8 2024 · Sep–Oct 2024 | Seaport Hotel Boston (banquets & convention services): First Local 26 contract; raises \"on par with the citywide hotel union standard\" (rates not published); unit certified Jan 2024 · 2026-03-02 | Current Local 26 hourly scale / exact expiry: No public read (term implies ~2028). Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Commonwealth of Massachusetts · Boston Globe · UNITE HERE · NLRB (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.mass.gov/info-details/massachusetts-law-about-minimum-wage",
        "label": "Massachusetts minimum wage",
        "secondary": false
      },
      {
        "url": "https://www.bostonglobe.com/2024/12/12/business/hotel-workers-union-strike-wages/",
        "label": "UNITE HERE Local 26 citywide contracts",
        "secondary": false
      },
      {
        "url": "https://unitehere.org/seaport-hotel-workers-win-first-local-26-contract-of-2026/",
        "label": "Seaport Hotel Boston (banquets & convention services) — unitehere.org",
        "secondary": false
      },
      {
        "url": "https://www.nlrb.gov/case/01-RC-321092",
        "label": "Seaport Hotel Boston (banquets & convention services) — nlrb.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-boston-1-1-bls-oews-hotel-occupations",
    "marketSlug": "boston",
    "kind": "talent",
    "title": "Boston talent: 1.1 BLS OEWS — hotel occupations (MSA)",
    "body": "Boston — 1.1 BLS OEWS — hotel occupations (MSA). Maids & housekeeping cleaners (all industries) (37-2012): 10920 · $18.98 · $20.85 | Hotel, motel & resort desk clerks (43-4081): 2980 · $19.22 · $20.98 | Lodging managers (11-9081): not published · $47.05 · $53.21 | Cooks, restaurant (all industries) (35-2014): 22900 · $22.03 · $22.06. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "U.S. BLS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.bls.gov/oes/current/oes_14460.htm",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      },
      {
        "url": "https://www.bls.gov/oes/special-requests/oesm25ma.zip",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-boston-2-build-talent",
    "marketSlug": "boston",
    "kind": "talent",
    "title": "Boston talent: 2. Build talent (summary — detail in boston-build.md)",
    "body": "Boston — 2. Build talent (summary — detail in boston-build.md). Boston–Cambridge–Nashua NECTA construction (mining/logging/construction): 123,500 → 126,000 (+2,500, +2%) · Aug 2025 → Aug 2026 | Cambridge–Newton–Framingham division: 60,500 → 63,200 (+4%, rank 18/360) · same | Boston division: 52,100 → 52,100 (0%) · same | National craft difficulty: 88% as hard/harder; electricians 81% · 2026-09-03. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "AGC of America (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.agc.org/sites/default/files/users/user21902/Metro%20Empl%202026_August_Alpha.pdf",
        "label": "Boston–Cambridge–Nashua NECTA construction (mining/logging/constructio",
        "secondary": false
      },
      {
        "url": "https://www.agc.org/sites/default/files/users/user21902/2026%20Workforce%20Survey%20Analysis%20(4",
        "label": "National craft difficulty",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-boston-3-operator-bench",
    "marketSlug": "boston",
    "kind": "talent",
    "title": "Boston talent: 3. Operator bench",
    "body": "Boston — 3. Operator bench (D11). Pyramid Global Hospitality (HQ 30 Rowes Wharf, Boston): M + AM (§2.3) · Corporate HQ in MSA = home-market float for openings/transitions · Warren Fields, CEO (§2.3) | Saunders Hotel Group: O/M — 4-generation family owner-operator; \"operates all of the assets that it acquires\"; luxury downtown + Logan-area hotel · Boston-only footprint · not named on home page | HHM Hotels: M · Managing Strider Hotel, Curio Collection (Boston Landing, 170–175 keys, 2027); live GM hiring per source | Sonesta: M/brand · Opened The Midtown Hotel, MOD Collection (159 keys, Back Bay) | GHIG (JV partner per hotelbusiness.com): O/M · Manages existing Seaport Aloft/Element; approved all-electric Seaport hotel. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "pyramidglobal.com · saundershotelgroup.com · NewHotels · hotelmanagement.dev.qtxquartz.com · Hotel Business (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.pyramidglobal.com/",
        "label": "Pyramid Global Hospitality (HQ 30 Rowes Wharf, Boston)",
        "secondary": false
      },
      {
        "url": "https://saundershotelgroup.com/",
        "label": "Saunders Hotel Group",
        "secondary": false
      },
      {
        "url": "https://www.newhotels.io/hotels/strider-hotel-boston",
        "label": "HHM Hotels",
        "secondary": false
      },
      {
        "url": "https://hotelmanagement.dev.qtxquartz.com/openings/sonesta-opens-midtown-hotel-mod-collection-sonesta-bostons-back-bay",
        "label": "Sonesta",
        "secondary": false
      },
      {
        "url": "https://hotelbusiness.com/ghig-jv-approved-for-all-electric-hotel-in-bostons-seaport-district/",
        "label": "GHIG (JV partner per hotelbusiness.com)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-boston-3-2-pre-open-risk-named-openings",
    "marketSlug": "boston",
    "kind": "talent",
    "title": "Boston talent: 3.2 Pre-open risk — named openings (no pipeline review yet)",
    "body": "Boston — 3.2 Pre-open risk — named openings (no pipeline review yet). Strider Hotel, Curio (Boston Landing): 170–175 · 2027 · HHM · Med: lifestyle F&B + new neighborhood; GM search live → named GM ≥12 mo pre-CO is on track only if filled by ~early 2027 | New Seaport hotel near BCEC (438 keys): 438 · approved; no start date · No public read · High if it proceeds: large FS in Local 26 market with no named operator. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "2 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Boston Globe (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.bostonglobe.com/2026/02/19/business/new-boston-seaport-hotel/",
        "label": "Strider Hotel, Curio (Boston Landing)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-boston-5-gaps",
    "marketSlug": "boston",
    "kind": "talent",
    "title": "Boston talent: 5. Gaps (no public read)",
    "body": "Boston — 5. Gaps (no public read). Local 26 current hourly scale & exact expiry: No public read | Boston hotel-specific trade shortage / union scale sheets: No public read | Operator for 438-key Seaport project: No public read | Saunders/Pyramid named Boston-property rosters: Not inventoried. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1s-boston-snapshot",
    "marketSlug": "boston",
    "kind": "supply",
    "title": "Boston supply: Snapshot",
    "body": "Boston — Snapshot. Existing rooms: ~62,737 (~63,000) · Jan 2026 report | Implied rooms (STR market): ~61,770 (Q2 supply room-nights ÷ 91, derived) · Q2 2026 | Rooms UC: 13 hotels / 1,556 rooms = +1.8% (US ~2.5%) · report says \"through November 2026\"; likely Nov 2025, so treat as late-2025 | Final planning / proposed: 2,199 / 2,856 rooms · same | Build pace: ~1,900 rooms UC/yr over 10 yrs; 3-yr avg 840; ~8,100 delivered pre-COVID · same | Peak-season OCC: can approach 80% Apr–Oct · same. Decision support.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Wronka Ltd · Cushman & Wakefield (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.wronkaltd.com/wp-content/uploads/2026/01/Boston-MA-USA-Hospitality-Market-January-3-2026.pdf",
        "label": "Existing rooms",
        "secondary": false
      },
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "Implied rooms (STR market)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-boston-submarket-basemap",
    "marketSlug": "boston",
    "kind": "supply",
    "title": "Boston supply: Submarket basemap (v0)",
    "body": "Boston — Submarket basemap (v0). Boston CBD / Airport: Highest development concentration; >2x Cambridge/Waltham | Seaport / South Boston (convention): 438-room GHIG hotel approved Feb 2026; MCCA study: convention center could support 800–1,000 more rooms; $1.9B expansion deferred | Intown–East Boston: Only submarket with 2025 ADR growth; largest projected 2026 ADR gain | Cambridge / Waltham: #2 development concentration; life-science demand exposure | Woburn–Lowell: Only outer submarket with a projected 2026 OCC gain (heritage/America250) | Brighton (Boston Landing): Strider (Curio) 170–175, 2027. Decision support.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Wronka Ltd · Boston Globe · Marcus & Millichap · NewHotels (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.wronkaltd.com/wp-content/uploads/2026/01/Boston-MA-USA-Hospitality-Market-January-3-2026.pdf",
        "label": "Boston CBD / Airport",
        "secondary": false
      },
      {
        "url": "https://www.bostonglobe.com/2026/02/19/business/new-boston-seaport-hotel/",
        "label": "Seaport / South Boston (convention)",
        "secondary": false
      },
      {
        "url": "https://www.marcusmillichap.com/research/market-report/boston/boston-2026-investment-forecast-hospitality-market-report",
        "label": "Intown–East Boston",
        "secondary": false
      },
      {
        "url": "https://www.newhotels.io/hotels/strider-hotel-boston",
        "label": "Brighton (Boston Landing)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-boston-latest-pulse",
    "marketSlug": "boston",
    "kind": "supply",
    "title": "Boston supply: Latest pulse",
    "body": "Boston — Latest pulse (D2). C&W Q2 2026 (STR/CoStar): OCC 77.0%, ADR $273, RevPAR $210 (+2.8%); supply +1.8% | CoStar wk ending Jul 11: ADR +21.8% to $279.21 (France–Morocco quarterfinal) | CoStar wk ending May 23: Steepest ADR (−5.4% to $267.34) and RevPAR (−14.7% to $204.10) drops | CoStar wk ending May 9: Only double-digit OCC drop (−10.4% to 74.3%) | CoStar wk ending Feb 21: Steepest drops: OCC −14.4% to 56.1%, ADR −6.7% to $158.28, RevPAR −20.1% to $88.75 | CoStar Feb 2026 monthly: Largest OCC drop (−7.8% to 58.0%) | HVS WC window (custom market incl. Providence/Foxborough): OCC −0.5 pt; ADR +$43.76; RevPAR +22.0%. Decision support.",
    "magnitude": "7 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Cushman & Wakefield · CoStar · HVS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "C&W Q2 2026 (STR/CoStar)",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-11-july",
        "label": "CoStar wk ending Jul 11",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-23-may",
        "label": "CoStar wk ending May 23",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-9-may",
        "label": "CoStar wk ending May 9",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-21-february",
        "label": "CoStar wk ending Feb 21",
        "secondary": false
      },
      {
        "url": "https://www.costar.com/products/str-benchmark/resources/press-releases/us-hotel-performance-february-2026",
        "label": "CoStar Feb 2026 monthly",
        "secondary": false
      },
      {
        "url": "https://www.hvs.com/article/10529-how-the-2026-fifa-world-cup-changed-us-hotel-markets",
        "label": "HVS WC window (custom market incl. Providence/Foxborough)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-boston-supply-pressure-score",
    "marketSlug": "boston",
    "kind": "supply",
    "title": "Boston supply-pressure score 2/5",
    "body": "Boston — Supply-pressure score: 2 / 5 (supply tailwind). UC intensity: 1.8%, below the U.S. ~2.5% | Starts vs history: 3-yr avg 840 vs 10-yr ~1,900/yr; lenders hesitant (labor, immigration policy) | Conversion share: Low; upper-midscale/upscale branded ground-up | Submarket concentration: CBD/Airport/Seaport; convention district under-roomed per MCCA study | Build-talent friction: Construction labor tight (Wronka). Score 2/5 (1–2 tailwind; 3 mixed, underwrite by submarket; 4–5 no ground-up without hard barriers). Mobility read: UC 1.8% vs US ~2.5%; build pace 840/yr vs ~1,900; demand hole (life sciences, Hynes). Decision support.",
    "magnitude": "score 2/5",
    "asOf": "2026-10-11",
    "sourceLabel": "Wronka Ltd · Boston Globe (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.wronkaltd.com/wp-content/uploads/2026/01/Boston-MA-USA-Hospitality-Market-January-3-2026.pdf",
        "label": "UC intensity",
        "secondary": false
      },
      {
        "url": "https://www.bostonglobe.com/2026/02/19/business/new-boston-seaport-hotel/",
        "label": "Submarket concentration",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-boston-stage-rollup",
    "marketSlug": "boston",
    "kind": "pipeline",
    "title": "Boston pipeline: Stage rollup (Wronka, Jan 2026 report)",
    "body": "Boston — Stage rollup (Wronka, Jan 2026 report). UC: 13 · 1,556 | Final planning: ~20 · 2,199 | Proposed: 2,856 | Opened in report year: 4 · 407 (+106 scheduled). Decision support.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Wronka Ltd (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.wronkaltd.com/wp-content/uploads/2026/01/Boston-MA-USA-Hospitality-Market-January-3-2026.pdf",
        "label": "UC",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-boston-named-projects",
    "marketSlug": "boston",
    "kind": "pipeline",
    "title": "Boston pipeline: Named projects",
    "body": "Boston — Named projects. The Atlas Hotel, 40 Western Ave: 246 · Opened 2026-01-28 · Allston · Delivered | Seaport hotel, Butler St / 391–403 D St (GHIG; brand TBD, LDG lists Moxy \"?\"): 438 · Zoning approved Feb 2026; groundbreaking timing TBD with MCCA · Seaport · TBD; ~$110M | Strider Hotel (Curio by Hilton, HHM): 170–175 · UC since mid-2025 · Brighton / Boston Landing · 2027 | Hamilton Place Hotel: 80 · UC · Downtown | Harrison Hotel, 15–25 Harrison Ave: 106 · Final planning · Chinatown | Causeway Hotel & Residences, 251 Causeway St: 300 · TBD · West End / North Station. Decision support.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Lodging Development · Boston Globe · NewHotels (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.lodgingdevelopment.com/Hotel-Development-Boston",
        "label": "The Atlas Hotel, 40 Western Ave",
        "secondary": false
      },
      {
        "url": "https://www.bostonglobe.com/2026/02/19/business/new-boston-seaport-hotel/",
        "label": "Seaport hotel, Butler St / 391–403 D St (GHIG; brand TBD, LDG lists Mo",
        "secondary": false
      },
      {
        "url": "https://www.newhotels.io/hotels/strider-hotel-boston",
        "label": "Strider Hotel (Curio by Hilton, HHM)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-chicago-1-wage-floor",
    "marketSlug": "chicago",
    "kind": "talent",
    "title": "Chicago talent: 1. Wage floor",
    "body": "Chicago — 1. Wage floor. Chicago minimum wage (4+ employees): $17.05/hr; tipped cash $12.96 · eff. 2026-07-01 | Tipped-wage phase-out: Next step (84%) delayed Jul 1 2026 → Jul 1 2028; full minimum Jul 1 2030 (small employers 2033) · Council vote late May 2026 (source: same CBS) | Local 1 2023 contract (Marriott/Hilton/Hyatt-operated): 3-yr; $25/hr minimum non-tipped; daily room cleaning restored; health preserved; pension strengthened; expiry Aug 31 2026 · 2023-08-17 | Local 1 2026 strike: Started Oct 9 2026, 6 hotels; demands: wages, health, pension, civil-rights protections, safer workloads; union seeks a 5-yr contract · 2026-10-09 | Strike status: Second day (Oct 10) with no negotiations scheduled; workers to stay out \"until an agreement is reached\"; Marriott says it remains available to meet; 40 more hotels could be struck without notice · 2026-10-11 | Dispute scope / sticking point: 46 hotels, 7,000+ workers; Hyatt has the most of the 46 but none struck; hotels bargaining separately; per a source familiar with hotels' position, talks stalled on a clause extending union representation to a signatory's other commonly owned/managed hotels in IL/IN/WI/IA; economics not substantively discussed · 2026-10-09 | Labor-risk row: RSNA overlap: RSNA 2026 at McCormick Nov 29 – Dec 3 (exhibits Nov 29–Dec 2) falls inside the open-ended dispute window; Local 1 says additional hotels \"could be on strike at any moment.\" Whether action extends to RSNA week: no public read — treat as live risk for McCormick-adjacent and downtown FS comp sets (Hyatt Regency McCormick, Marriott Marquis, Palmer House, Hilton Chicago, Sheraton Grand). · RSNA dates (https://www.rsna.org/news/2026/october/rsna-2026-technical-exhibits) (source: Strike sources above) | Holiday Inn & Suites Chicago-Downtown: Local 1 boycott; HK paid $19 (2024, per union) · 2024-06. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "8 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "CBS News · City of Chicago · unitehere1.org · Chicago Sun-Times · nbcchicago.com · nonrevtravelnews.com · Skift (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.cbsnews.com/chicago/news/chicago-minimum-wage-july-1-2026-tipped-workers-delayed/",
        "label": "Chicago minimum wage (4+ employees) — cbsnews.com",
        "secondary": false
      },
      {
        "url": "https://www.chicago.gov/city/en/depts/bacp/supp_info/minimumwageinformation.html",
        "label": "Chicago minimum wage (4+ employees) — chicago.gov",
        "secondary": false
      },
      {
        "url": "https://www.unitehere1.org/2023/08/chicago-hotel-workers-at-marriott-hilton-and-hyatt-properties-reach-historic-deal-ahead-of-2023-contract-expiration/",
        "label": "Local 1 2023 contract (Marriott/Hilton/Hyatt-operated)",
        "secondary": false
      },
      {
        "url": "https://chicago.suntimes.com/business/2026/10/09/hotel-workers-strike-chicago-marathon-weekend",
        "label": "Local 1 2026 strike",
        "secondary": false
      },
      {
        "url": "https://www.nbcchicago.com/news/local/chicago-hotel-workers-strike-for-second-day-as-fight-continues-for-new-contract/4000651/",
        "label": "Strike status — nbcchicago.com",
        "secondary": false
      },
      {
        "url": "https://nonrevtravelnews.com/2026/10/11/chicago-hotel-strike-runs-through-a-second-day-with-no-talks-scheduled/",
        "label": "Strike status — nonrevtravelnews.com",
        "secondary": false
      },
      {
        "url": "https://skift.com/2026/10/09/chicago-hotel-strike-hits-marriott-and-hilton-hotels-during-marathon-weekend/",
        "label": "Dispute scope / sticking point",
        "secondary": false
      },
      {
        "url": "https://www.unitehere1.org/2024/06/7646/",
        "label": "Holiday Inn & Suites Chicago-Downtown",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-chicago-1-1-bls-oews-hotel-occupations",
    "marketSlug": "chicago",
    "kind": "talent",
    "title": "Chicago talent: 1.1 BLS OEWS — hotel occupations",
    "body": "Chicago — 1.1 BLS OEWS — hotel occupations. Maids & housekeeping cleaners (all industries) (37-2012): 18260 · $17.94 · $19.57 | Hotel, motel & resort desk clerks (43-4081): 4260 · $17.37 · $18.42 | Lodging managers (11-9081): 550 · $30.12 · $35.33 | Cooks, restaurant (all industries) (35-2014): 41690 · $18.72 · $19.45. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "U.S. BLS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.bls.gov/oes/current/oes_16980.htm",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      },
      {
        "url": "https://www.bls.gov/oes/special-requests/oesm25ma.zip",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-chicago-2-build-talent",
    "marketSlug": "chicago",
    "kind": "talent",
    "title": "Chicago talent: 2. Build talent (summary — detail in chicago-build.md)",
    "body": "Chicago — 2. Build talent (summary — detail in chicago-build.md). Chicago–Naperville–Elgin construction: 193,900 → 199,700 (+5,800, +3%) · Aug 2025 → Aug 2026 | Chicago–Naperville–Schaumburg div.: +4% (rank 8 by % among divisions per AGC) · same. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "2 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "AGC of America (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.agc.org/sites/default/files/users/user21902/Metro%20Empl%202026_August_Alpha.pdf",
        "label": "Chicago–Naperville–Elgin construction",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-chicago-3-operator-bench",
    "marketSlug": "chicago",
    "kind": "talent",
    "title": "Chicago talent: 3. Operator bench",
    "body": "Chicago — 3. Operator bench (D11). Davidson Hospitality Group / Pivot: M · Hotel Lincoln, JdV (182) for Jordache Enterprises; also Hotel Zachary (Tribute), Hyatt Centric Mag Mile, Hyatt Lodge Oak Brook · Nick Gregory, EVP Operations, Pivot | Remington Hospitality: M · Sofitel Chicago Magnificent Mile (415) — from May 2025, franchise under Braemar master HMA; all staff retained · Jason Reader, COO | Marriott (Marquis Chicago, 1,205): M (QMA) · MPEA-owned; QMA expires Sep 20 2027; MPEA RFP #2026-15-M seeks national-brand convention operator, key money; MPEA approves GM, DOSM, DOF, DRM; planned full rooms + meeting-space renovation (timing TBD) | Hyatt (Regency McCormick, 1,258): M · MPEA-owned, Hyatt-operated (source: same RFP). Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "traveldailynews.com · Hotel Online · govcb.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.traveldailynews.com/uncategorized/pivot-selected-to-manage-hotel-lincoln-jdv-by-hyatt/",
        "label": "Davidson Hospitality Group / Pivot",
        "secondary": false
      },
      {
        "url": "https://www.hotel-online.com/news/remington-hospitality-to-manage-sofitel-chicago-magnificent-mile",
        "label": "Remington Hospitality",
        "secondary": false
      },
      {
        "url": "https://www.govcb.com/government-bids/HOTEL-OPERATOR-23514963.htm",
        "label": "Marriott (Marquis Chicago, 1,205)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-chicago-3-2-pre-open-transition-risk",
    "marketSlug": "chicago",
    "kind": "talent",
    "title": "Chicago talent: 3.2 Pre-open / transition risk",
    "body": "Chicago — 3.2 Pre-open / transition risk. Marriott Marquis operator transition (if incumbent not renewed): 1,205 · QMA ends 2027-09-20 · Key personnel subject to MPEA approval; no public read of award · Medium–high — convention HQ transition + renovation + Local 1 successor contract in same window | Ground-up openings 2026–28: No public read. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "2 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1t-chicago-5-gaps",
    "marketSlug": "chicago",
    "kind": "talent",
    "title": "Chicago talent: 5. Gaps (no public read)",
    "body": "Chicago — 5. Gaps (no public read). Local 1 settlement terms / strike end date: No public read (live) | Whether strike extends into RSNA week: No public read | MPEA Marquis operator award: No public read | Illinois hotel-specific ordinances (panic button etc.): Not checked this pass | Chicago hotel GC roster / openings: No public read. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1s-chicago-snapshot",
    "marketSlug": "chicago",
    "kind": "supply",
    "title": "Chicago supply: Snapshot",
    "body": "Chicago — Snapshot. CBD daily room supply: 46,901 (2025) → 46,857 (2026, −0.1%) → 47,583 (2027, +1.5%) · Aug 2026 | CBD properties: 161 → 158 → 160 (year-end) · Aug 2026 | Updates: Bally's pushed to end of Q1/Q2 (2027); 8 Sonder properties removed; KASA (ex-Sonder) opened Jul 2026 · Aug 2026 | Implied rooms (C&W STR market, metro): ~121,756 · Q2 2026 | LE renovation + conversion: 31 projects / 5,732 rooms · Q2 2026. Decision support.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Choose Chicago · Cushman & Wakefield · Lodging Econometrics (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://cdn.choosechicago.com/uploads/2026/08/Hotel-Capacity-Update-August-2026.pdf",
        "label": "CBD daily room supply",
        "secondary": false
      },
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "Implied rooms (C&W STR market, metro)",
        "secondary": false
      },
      {
        "url": "https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/",
        "label": "LE renovation + conversion",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-chicago-submarket-basemap",
    "marketSlug": "chicago",
    "kind": "supply",
    "title": "Chicago supply: Submarket basemap (v0)",
    "body": "Chicago — Submarket basemap (v0). Loop: Office-to-hotel conversions: Monroe (327 keys), Burnham Center (250–300, proposed) | River North / Streeterville / Mag Mile: Ruby (412-key conversion of the Inn of Chicago); strike hotels (Westin River North, Westin Michigan Ave) | River West: Bally's 500-room casino tower. Decision support.",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "primegroupinc.com · Hoodline · hotelnewsresource.com · Choose Chicago · stayinthenew.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.primegroupinc.com/current-projects/the-monroe-hotel",
        "label": "Loop — primegroupinc.com",
        "secondary": false
      },
      {
        "url": "https://hoodline.com/2026/03/loop-power-move-reschke-grabs-burnham-center-in-16-million-shakeup/",
        "label": "Loop — hoodline.com",
        "secondary": false
      },
      {
        "url": "https://www.hotelnewsresource.com/article139695.html",
        "label": "River North / Streeterville / Mag Mile",
        "secondary": false
      },
      {
        "url": "https://cdn.choosechicago.com/uploads/2026/08/Hotel-Capacity-Update-August-2026.pdf",
        "label": "River West — cdn.choosechicago.com",
        "secondary": false
      },
      {
        "url": "https://www.stayinthenew.com/new-hotels-chicago",
        "label": "River West — stayinthenew.com",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-chicago-latest-pulse",
    "marketSlug": "chicago",
    "kind": "supply",
    "title": "Chicago supply: Latest pulse",
    "body": "Chicago — Latest pulse (D2). C&W Q2 2026: OCC 75.8% (+5.2%), ADR $197 (+8.1%), RevPAR $149 (+13.6%) | CoStar wk ending Jun 6: Top-25 leader: ADR +14.5% to $237.53, RevPAR +23.9% to $198.21 (USMNT send-off) | CoStar wk ending Aug 8: Largest ADR lift, +15.2% to $206.21; RevPAR +23.8% | CoStar wk ending Sep 19: Top-25 leader: ADR +28.2% to $257.66, RevPAR +41.8% to $226.18. Decision support.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Cushman & Wakefield · CoStar (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "C&W Q2 2026",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-6-june",
        "label": "CoStar wk ending Jun 6",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-8-august",
        "label": "CoStar wk ending Aug 8",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-19-september",
        "label": "CoStar wk ending Sep 19",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-chicago-supply-pressure-score",
    "marketSlug": "chicago",
    "kind": "supply",
    "title": "Chicago supply-pressure score 2/5",
    "body": "Chicago — Supply-pressure score: 2 / 5 (supply tailwind). UC intensity: CBD net change −0.1% (2026) and +1.5% (2027) | Starts vs history: Ground-up is rare; Bally's is the one large new build | Conversion share: High: LE counts 31 reno/conversion projects / 5,732 rooms; the Loop office conversions add keys | Submarket concentration: 2027 adds land in the Loop / River North / River West | Build-talent friction: Local 1 strike; old contract floor $25 non-tipped; successor terms no public read. Score 2/5 (1–2 tailwind; 3 mixed, underwrite by submarket; 4–5 no ground-up without hard barriers). Mobility read: CBD supply −0.1% in 2026, +1.5% in 2027; new keys mostly conversions; Local 1 strike. Decision support.",
    "magnitude": "score 2/5",
    "asOf": "2026-10-11",
    "sourceLabel": "Choose Chicago · Lodging Econometrics · primegroupinc.com · Hoodline (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://cdn.choosechicago.com/uploads/2026/08/Hotel-Capacity-Update-August-2026.pdf",
        "label": "UC intensity",
        "secondary": false
      },
      {
        "url": "https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/",
        "label": "Conversion share — lodgingeconometrics.com",
        "secondary": false
      },
      {
        "url": "https://www.primegroupinc.com/current-projects/the-monroe-hotel",
        "label": "Conversion share — primegroupinc.com",
        "secondary": false
      },
      {
        "url": "https://hoodline.com/2026/03/loop-power-move-reschke-grabs-burnham-center-in-16-million-shakeup/",
        "label": "Conversion share — hoodline.com",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-chicago-stage-rollup",
    "marketSlug": "chicago",
    "kind": "pipeline",
    "title": "Chicago pipeline: Stage rollup",
    "body": "Chicago — Stage rollup. CBD net daily supply 2026 / 2027: −44 / +726 rooms | LE renovation + conversion: 31 projects / 5,732 rooms. Decision support.",
    "magnitude": "2 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Choose Chicago · Lodging Econometrics (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://cdn.choosechicago.com/uploads/2026/08/Hotel-Capacity-Update-August-2026.pdf",
        "label": "CBD net daily supply 2026 / 2027",
        "secondary": false
      },
      {
        "url": "https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/",
        "label": "LE renovation + conversion",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-chicago-named-projects",
    "marketSlug": "chicago",
    "kind": "pipeline",
    "title": "Chicago pipeline: Named projects",
    "body": "Chicago — Named projects. Bally's Chicago Casino + Hotel: 500 · UC · River West · Moved to end of Q1/Q2 2027 | Ruby Hotel Chicago (conversion of the Inn of Chicago; IHG franchise): 412 · Renovation from H2 2026 · Streeterville / Mag Mile · 2027 | The Monroe Hotel (111 W Monroe; adaptive reuse): 327 · Proposed / in development · Loop · 2027 | Burnham Center luxury hotel (111 W Washington; Reschke): 250–300 · Proposed; no operator or timeline · Loop | The Duke of Wells (Unbound Collection by Hyatt): 203 · Coming · Old Town | The Neighborhood Hotel – West Loop: 76 suites · Coming · Fulton Market · 2027 | KASA (ex-Sonder): Opened Jul 2026 · CBD · Delivered. Decision support.",
    "magnitude": "7 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Choose Chicago · stayinthenew.com · hotelnewsresource.com · primegroupinc.com · Hoodline (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://cdn.choosechicago.com/uploads/2026/08/Hotel-Capacity-Update-August-2026.pdf",
        "label": "Bally's Chicago Casino + Hotel — cdn.choosechicago.com",
        "secondary": false
      },
      {
        "url": "https://www.stayinthenew.com/new-hotels-chicago",
        "label": "Bally's Chicago Casino + Hotel — stayinthenew.com",
        "secondary": false
      },
      {
        "url": "https://www.hotelnewsresource.com/article139695.html",
        "label": "Ruby Hotel Chicago (conversion of the Inn of Chicago; IHG franchise)",
        "secondary": false
      },
      {
        "url": "https://www.primegroupinc.com/current-projects/the-monroe-hotel",
        "label": "The Monroe Hotel (111 W Monroe; adaptive reuse)",
        "secondary": false
      },
      {
        "url": "https://hoodline.com/2026/03/loop-power-move-reschke-grabs-burnham-center-in-16-million-shakeup/",
        "label": "Burnham Center luxury hotel (111 W Washington; Reschke)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-dallas-1-wage-floor",
    "marketSlug": "dallas",
    "kind": "talent",
    "title": "Dallas talent: 1. Wage floor",
    "body": "Dallas — 1. Wage floor. Texas / federal minimum: $7.25/hr (tipped cash $2.13) · current 2026 | Local hotel wage ordinance: None — no public read of any Dallas/Fort Worth/Arlington hotel ordinance · 2026-10-11 | UNITE HERE Local 23 — Dallas hotel contracts: No public read (searches return Houston only) · 2026-10-11 | Texas reference union rate: Hilton Americas–Houston $20 → $22 by contract end (Oct 2025) · 2025-10. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "U.S. Dept. of Labor · UNITE HERE (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.dol.gov/agencies/whd/minimum-wage/state",
        "label": "Texas / federal minimum",
        "secondary": false
      },
      {
        "url": "https://unitehere.org/press-releases/on-day-40-of-hilton-americas-hotel-strike-workers-reach-an-agreement/",
        "label": "Texas reference union rate",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-dallas-1-1-bls-oews-hotel-occupations",
    "marketSlug": "dallas",
    "kind": "talent",
    "title": "Dallas talent: 1.1 BLS OEWS — hotel occupations",
    "body": "Dallas — 1.1 BLS OEWS — hotel occupations. Maids & housekeeping cleaners (all industries) (37-2012): 17480 · $15.22 · $15.61 | Hotel, motel & resort desk clerks (43-4081): 6150 · $16.87 · $16.38 | Lodging managers (11-9081): 1140 · $31.87 · $40.21 | Cooks, restaurant (all industries) (35-2014): 34430 · $17.54 · $17.24. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "U.S. BLS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.bls.gov/oes/current/oes_19100.htm",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      },
      {
        "url": "https://www.bls.gov/oes/special-requests/oesm25ma.zip",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-dallas-2-build-talent",
    "marketSlug": "dallas",
    "kind": "talent",
    "title": "Dallas talent: 2. Build talent (summary — detail in dallas-build.md)",
    "body": "Dallas — 2. Build talent (summary — detail in dallas-build.md). DFW–Arlington construction: 268,100 → 276,200 (+8,100, +3%) · Aug 2025 → Aug 2026 | Dallas–Plano–Irving div.: +2% · same | Fort Worth–Arlington–Grapevine div.: +5% · same | Americana by Loews GC: JE Dunn Construction (Dallas office) — confirmed by OSHA Fort Worth Area Office strategic partnership agreement #1458 covering the \"Loews American[a] Project in Arlington\"; JE Dunn project executive Jason Parker · agreement file dated 2026-04-07 (posted 2026-05). Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "AGC of America · osha.gov (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.agc.org/sites/default/files/users/user21902/Metro%20Empl%202026_August_Alpha.pdf",
        "label": "DFW–Arlington construction",
        "secondary": false
      },
      {
        "url": "https://www.osha.gov/sites/default/files/2026-05/1458-agreement-20260407.pdf",
        "label": "Americana by Loews GC",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-dallas-3-operator-bench",
    "marketSlug": "dallas",
    "kind": "talent",
    "title": "Dallas talent: 3. Operator bench",
    "body": "Dallas — 3. Operator bench (D11). Aimbridge Hospitality (Plano): M — largest US third-party · Assumed 10-hotel portfolio for Prospect Ridge / Fulcrum (7 states incl. TX) | Remington Hospitality (Dallas): M — Ashford-affiliated · Named Nick Clark VP operations (Feb; per Hotel Investment Today headline/summary) · Nick Clark (VP Ops) | Dreamscape Hospitality (Dallas): M · Hilton Garden Inn Dallas/Market Center (240), under public-space renovation · Adam Patenaude, President | Auberge Collection: M (brand-managed) · The Knox (140 + 48 residences), opening ~Dec 2026 · Rick Fidel, RVP & GM | Loews Hotels: Owner-operator · Americana by Loews Arlington (507). Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "aimbridgehospitality.com · Hotel Investment Today · hotelsmag.com · auberge.com · loewshotels.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.aimbridgehospitality.com/news/aimbridge-hospitality-selected-by-prospect-ridge-and-fulcrum-hospitality-to-manage-10-hotel-portfolio/",
        "label": "Aimbridge Hospitality (Plano)",
        "secondary": false
      },
      {
        "url": "https://www.hotelinvestmenttoday.com/Development/Owners/Hotel-executive-moves-Aimbridge-Concord-Iconic-Remington",
        "label": "Remington Hospitality (Dallas)",
        "secondary": false
      },
      {
        "url": "https://hotelsmag.com/news/dreamscape-hospitality-adds-dallas-hilton-garden-inn/",
        "label": "Dreamscape Hospitality (Dallas)",
        "secondary": false
      },
      {
        "url": "https://auberge.com/the-knox/press/",
        "label": "Auberge Collection",
        "secondary": false
      },
      {
        "url": "https://www.loewshotels.com/press/news/dallas-morning-news-loews-details-americana-arlington-hotel",
        "label": "Loews Hotels",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-dallas-3-2-pre-open-risk-named-openings",
    "marketSlug": "dallas",
    "kind": "talent",
    "title": "Dallas talent: 3.2 Pre-open risk — named openings",
    "body": "Dallas — 3.2 Pre-open risk — named openings. The Knox (Auberge): 140 · ~Dec 2026 · Auberge; GM Rick Fidel named Nov 2025 · Low–med — GM ~13 mo ahead; dept heads no public read | Dallas EDITION @ Chalk Hill: 214 · End 2028 · Marriott (EDITION) · Leadership no public read — early | Americana by Loews (Arlington): 507 · Late 2028 / early 2029 · Loews · Leadership no public read; GC JE Dunn (OSHA partnership, Apr 2026) | Washburne 1,000-key: ≥2030 · No public read · Concept only. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1t-dallas-5-gaps",
    "marketSlug": "dallas",
    "kind": "talent",
    "title": "Dallas talent: 5. Gaps (no public read)",
    "body": "Dallas — 5. Gaps (no public read). Any DFW hotel union contract / Local 23 Dallas unit: No public read | EDITION / Americana pre-open leaders: No public read | Washburne operator: No public read | Hotel-specific GC/trade data beyond Americana: No public read. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1s-dallas-snapshot",
    "marketSlug": "dallas",
    "kind": "supply",
    "title": "Dallas supply: Snapshot",
    "body": "Dallas — Snapshot. DFW room inventory (submarket table sum): ~111,285 rooms · Q3 2025 | City of Dallas tax-registry rooms: 38,733 (−30 YoY) · 2026 filings | DFW occupancy / ADR / RevPAR: 63.0% / $124.87 / $78.55 · Q3 2025 | Rooms under construction (DFW): 4,600 rooms / 38 projects · Q3 2025 (source: Same). Decision support.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Matthews · texashotelsearch.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://cms.matthews.com/wp-content/uploads/2025/10/Q325-DFW-Hospitality.pdf",
        "label": "DFW room inventory (submarket table sum)",
        "secondary": false
      },
      {
        "url": "https://www.texashotelsearch.com/markets/dallas",
        "label": "City of Dallas tax-registry rooms",
        "secondary": false
      },
      {
        "url": "https://www.matthews.com/insights/dallas-fort-worth-tx-hospitality-market-report-q3-2025",
        "label": "DFW occupancy / ADR / RevPAR",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-dallas-submarket-basemap",
    "marketSlug": "dallas",
    "kind": "supply",
    "title": "Dallas supply: Submarket basemap (v0, Matthews Q3 2025 table: rooms / RevPAR / ADR )",
    "body": "Dallas — Submarket basemap (v0, Matthews Q3 2025 table: rooms / RevPAR / ADR ). Dallas CBD / Market Center: 10,144 · $75.65 · $164.14 · KBHCC rebuild = group hole to 2029–30; Westin Downtown (326) and Virgin (268) dropped off city tax filings (ownership change vs. exit not determinable) | West Plano / Frisco: 14,080 · $63.78 · $130.69 · Luxury/upscale pipeline concentration (Matthews: >60% of active dev in Frisco, Las Colinas, Uptown) | Irving North (Las Colinas): 13,828 · $58.36 · $130.10 · Same corridor pressure | East Plano / Richardson: 21,058 · $95.34 · $90.63 · As printed; corporate-transient | Farmers Branch / Stemmons N: 11,677 · $77.12 · $95.62 · Commodity select-service | Dallas South / East: 9,272 · $69.07 · $90.22 · Value | Denton / Lewisville / McKinney: 8,607 · $97.34 · $104.09 · Matthews Q1 2025: largest supply increase, 1,504 rooms coming — https://www.matthews.com/insights/q125-hospitality-market-report-dallas-tx | Addison / LBJ: 7,590 · $125.91 · $96.89 | Irving South / Grand Prairie: 6,189 · $64.21 · $115.95 · Airport/Arlington adjacency. Decision support.",
    "magnitude": "9 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Matthews (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://cms.matthews.com/wp-content/uploads/2025/10/Q325-DFW-Hospitality.pdf",
        "label": "Dallas CBD / Market Center",
        "secondary": false
      },
      {
        "url": "https://www.matthews.com/insights/q125-hospitality-market-report-dallas-tx",
        "label": "Denton / Lewisville / McKinney",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-dallas-latest-monthly-weekly-pulse",
    "marketSlug": "dallas",
    "kind": "supply",
    "title": "Dallas supply: Latest monthly / weekly pulse",
    "body": "Dallas — Latest monthly / weekly pulse (D2). C&W MarketBeat Q2 2026 (STR/CoStar): OCC 68.4% (+0.4%), ADR $139 (+5.9%), RevPAR $95 (+6.3%); supply +0.5%; implied ~97k rooms | CoStar week ending 2026-07-18 (WC semifinal): ADR +21.5% to $144.41; RevPAR +26.6% to $96.81 | HVS World Cup window (Jun 11–Jul 19): OCC +0.7 pt vs counterfactual; RevPAR +30.1%; ~$60.8M incremental rooms revenue | City of Dallas hotel revenue, Jan–May 2026: $611.7M (STR/short-term rental share 8.7%) | HVS 2026 read: OCC \"relatively stable,\" rate uptick from World Cup. Decision support.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Cushman & Wakefield · CoStar · HVS · texashotelsearch.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "C&W MarketBeat Q2 2026 (STR/CoStar)",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-18-july",
        "label": "CoStar week ending 2026-07-18 (WC semifinal)",
        "secondary": false
      },
      {
        "url": "https://www.hvs.com/article/10529-how-the-2026-fifa-world-cup-changed-us-hotel-markets",
        "label": "HVS World Cup window (Jun 11–Jul 19)",
        "secondary": false
      },
      {
        "url": "https://www.texashotelsearch.com/markets/dallas",
        "label": "City of Dallas hotel revenue, Jan–May 2026",
        "secondary": false
      },
      {
        "url": "https://hvi.hvs.com/market/united-states/Dallas",
        "label": "HVS 2026 read",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-dallas-supply-pressure-score",
    "marketSlug": "dallas",
    "kind": "supply",
    "title": "Dallas supply-pressure score 4/5",
    "body": "Dallas — Supply-pressure score: 4 / 5. UC intensity: #1 U.S. UC by projects: 38 / 4,184 rooms (Q2 2026) | Starts vs history: #1 next-12-mo starts: 68 / 7,885; #1 early planning 77 / 10,771; total pipeline 183 / 22,840 (source: Same) | Openings: 2026e 20 / 2,332; 2027e #1 27 / 2,486; 2028e 19 / 2,042 (source: Same) | Conversion share: Not in LE public top-5 reno/conversion list (source: Same) | Submarket concentration: Luxury/upscale in Frisco / Las Colinas / Uptown; CBD demand hole to 2029–30. Score 4/5 (1–2 tailwind; 3 mixed, underwrite by submarket; 4–5 no ground-up without hard barriers). Mobility read: #1 US UC + starts (LE Q2 2026); CBD convention hole to 2029–30 while suburbs flood. Decision support.",
    "magnitude": "score 4/5",
    "asOf": "2026-10-11",
    "sourceLabel": "Lodging Econometrics · Matthews · HVS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/",
        "label": "UC intensity",
        "secondary": false
      },
      {
        "url": "https://cms.matthews.com/wp-content/uploads/2025/10/Q325-DFW-Hospitality.pdf",
        "label": "Submarket concentration — cms.matthews.com",
        "secondary": false
      },
      {
        "url": "https://hvi.hvs.com/market/united-states/Dallas",
        "label": "Submarket concentration — hvi.hvs.com",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-dallas-stage-rollup",
    "marketSlug": "dallas",
    "kind": "pipeline",
    "title": "Dallas pipeline: Stage rollup (LE Q2 2026 public)",
    "body": "Dallas — Stage rollup (LE Q2 2026 public). Total pipeline: 183 · 22,840 | Under construction: 38 · 4,184 (source: Same) | Start next 12 mo: 68 · 7,885 (source: Same) | Early planning: 77 · 10,771 (source: Same) | Openings 2026e / 2027e / 2028e: 20 / 27 / 19 · 2,332 / 2,486 / 2,042 (source: Same) | Conversions / renos: Not in public top 5 (source: Same). Decision support.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Lodging Econometrics (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/",
        "label": "Total pipeline",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-dallas-named-projects",
    "marketSlug": "dallas",
    "kind": "pipeline",
    "title": "Dallas pipeline: Named projects",
    "body": "Dallas — Named projects. The Knox (Auberge Resorts Collection) + 48 residences: 140 · UC, topped out Feb 2026 · Knox District / Uptown · Open ~Dec 2026 | The Dallas EDITION @ Chalk Hill (Kaizen) + 60 residences: 214 · UC (site work since mid-2025) · Uptown, 3031 N. Harwood · End 2028 | Americana by Loews (replaces 311-key Sheraton Arlington): 507 · Implosion Jun 2026, construction summer 2026 · Arlington entertainment district · Late 2028 / early 2029 | Washburne convention hotel, 508 Young St.: 1,000 (proposed) · Concept; no city deal; earliest start ~2027 · CBD / KBHCC · Not before 2030 | KBHCC rebuild (demand anchor, not supply): UC · CBD · Reopen 2029 (Bisnow) / 2030 (HVS). Decision support.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "oftmw.com · wincwire.com · loewshotels.com · Bisnow · HVS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.oftmw.com/projects/the-knox/",
        "label": "The Knox (Auberge Resorts Collection) + 48 residences",
        "secondary": false
      },
      {
        "url": "https://wincwire.com/edition-hotels-makes-texas-debut-with-214-key-hotel-and-branded-residences-at-uptown-dallas/",
        "label": "The Dallas EDITION @ Chalk Hill (Kaizen) + 60 residences",
        "secondary": false
      },
      {
        "url": "https://www.loewshotels.com/press/news/dallas-morning-news-loews-details-americana-arlington-hotel",
        "label": "Americana by Loews (replaces 311-key Sheraton Arlington)",
        "secondary": false
      },
      {
        "url": "https://www.bisnow.com/news/dallas-ft-worth/hospitality-entertainment/ray-washburne-wants-to-build-800m-hotel-near-dallas-convention-center-project-133583",
        "label": "Washburne convention hotel, 508 Young St.",
        "secondary": false
      },
      {
        "url": "https://hvi.hvs.com/market/united-states/Dallas",
        "label": "KBHCC rebuild (demand anchor, not supply)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-honolulu-1-wage-floor",
    "marketSlug": "honolulu",
    "kind": "talent",
    "title": "Honolulu talent: 1. Wage floor",
    "body": "Honolulu — 1. Wage floor. Hawaii minimum wage: $16.00/hr; next step $18.00 on 2028-01-01 · eff. 2026-01-01 | Local 5 — Hilton Hawaiian Village: 40-day strike (Sep 24 → Nov 4 2024), 1,800+ workers; ratified · 2024-11-04 | HHV contract terms: 4-yr; \"up to $10 per hour in wage increases over four years\" (confirmed on free reprint). Star-Advertiser estimate: avg Local 5 HK ~$28/hr pre-strike → ~$38/hr; front desk ~$31 → ~$41; bartender ~$35 → ~$45 (all-in HK employer cost >$121k/yr). Tipped vs uniformed raise split: no public read (paywalled) · 2024-11-06 | Local 5 — Kyo-ya / Marriott (Royal Hawaiian, Sheraton Princess Kaiulani, Sheraton Waikiki, Waikiki Beach Marriott, Moana Surfrider): 2,500+ workers ratified \"similar agreements\"; wages, job security, workload/staffing commitments · Nov 2024 | Local 5 — DoubleTree Alana: Ratified 100%; \"all Local 5 hotel properties in Waikiki have successfully secured new contracts\" · 2026-06-13 | Local 5 — Ilikai: Ratified · 2026-06-25 | Off-MSA watch: Royal Kona Resort (Big Island): No contract since Feb 2025; 1-day strike Dec 2025; rally Jul 2026 · 2026-07-18 | Exact contract expiry dates / hourly scale: No public read (4-yr terms from late 2024 imply ~2028 — not confirmed). Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "8 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "State of Hawaii · UNITE HERE Local 5 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://governor.hawaii.gov/newsroom/news-release-hawai%ca%bbis-minimum-wage-increases-to-16-00-on-january-1/",
        "label": "Hawaii minimum wage — governor.hawaii.gov",
        "secondary": false
      },
      {
        "url": "https://www.capitol.hawaii.gov/hrscurrent/vol07_ch0346-0398/hrs0387/HRS_0387-0002.htm",
        "label": "Hawaii minimum wage — capitol.hawaii.gov",
        "secondary": false
      },
      {
        "url": "https://www.unitehere5.org/over-1800-hotel-workers-strike-hawaiis-largest-hotel-and-worlds-largest-hilton/",
        "label": "Local 5 — Hilton Hawaiian Village",
        "secondary": false
      },
      {
        "url": "https://www.unitehere5.org/over-2500-hotel-workers-ratify-new-contract-at-five-marriott-operated-hotels-in-waikiki-votes-scheduled-on-maui-and-kauai-later-this-week/",
        "label": "Local 5 — Kyo-ya / Marriott (Royal Hawaiian, Sheraton Princess Kaiulan",
        "secondary": false
      },
      {
        "url": "https://www.unitehere5.org/doubletree-workers-vote-100-yes-to-ratify-new-contract-06-13-26/",
        "label": "Local 5 — DoubleTree Alana",
        "secondary": false
      },
      {
        "url": "https://www.unitehere5.org/ilikai-hotel-workers-ratify-new-contract-06-25-26/",
        "label": "Local 5 — Ilikai",
        "secondary": false
      },
      {
        "url": "https://www.unitehere5.org/royal-kona-resort-workers-to-rally-for-a-fair-contract-after-16-months-of-unsuccesful-negotiations-07-18-26/",
        "label": "Off-MSA watch: Royal Kona Resort (Big Island)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-honolulu-1-1-bls-oews-hotel-occupations",
    "marketSlug": "honolulu",
    "kind": "talent",
    "title": "Honolulu talent: 1.1 BLS OEWS — hotel occupations",
    "body": "Honolulu — 1.1 BLS OEWS — hotel occupations. Maids & housekeeping cleaners (all industries) (37-2012): 6540 · $25.89 · $25.13 | Hotel, motel & resort desk clerks (43-4081): 1360 · $28.82 · $28.19 | Lodging managers (11-9081): 70 · $55.38 · $57.02 | Cooks, restaurant (all industries) (35-2014): 6960 · $20.41 · $21.45. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "U.S. BLS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.bls.gov/oes/current/oes_46520.htm",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      },
      {
        "url": "https://www.bls.gov/oes/special-requests/oesm25ma.zip",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-honolulu-2-build-talent",
    "marketSlug": "honolulu",
    "kind": "talent",
    "title": "Honolulu talent: 2. Build talent (summary — detail in honolulu-build.md)",
    "body": "Honolulu — 2. Build talent (summary — detail in honolulu-build.md). Urban Honolulu construction: 29,300 → 29,500 (+1%) · Aug 2025 → Aug 2026. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "1 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "AGC of America (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.agc.org/sites/default/files/users/user21902/Metro%20Empl%202026_August_Alpha.pdf",
        "label": "Urban Honolulu construction",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-honolulu-3-operator-bench",
    "marketSlug": "honolulu",
    "kind": "talent",
    "title": "Honolulu talent: 3. Operator bench",
    "body": "Honolulu — 3. Operator bench (D11). Highgate: M · Major Hawaii operator since 2011 (Courtyard Waikiki); lost Renaissance Honolulu; Romer House Waikiki remains | Crescent Hotels & Resorts: M · Renaissance Honolulu (299) — Hawaii debut, replaced Highgate · Michael George, CEO (per Crescent releases) | Outrigger (KSL Capital-owned): M/brand · Waikiki legacy operator | Aqua-Aston (Marriott Vacations): M · Waikiki | Springboard (Hotel Equities): M · Hawaii, incl. Maui Seaside | Castle Resorts & Hotels · MacNaughton: M · Cited as remaining truly local managers. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "hawaiihotelhui.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://hawaiihotelhui.com/brand-changes-management-swaps-and-the-loss-of-local-control/",
        "label": "Highgate",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-honolulu-5-gaps",
    "marketSlug": "honolulu",
    "kind": "talent",
    "title": "Honolulu talent: 5. Gaps (no public read)",
    "body": "Honolulu — 5. Gaps (no public read). Waikiki Standard hourly scale + expiry dates: No public read (paywalled Star-Advertiser) | Hyatt Regency Waikiki settlement details: Implied settled per Jun 2026 Local 5 statement; terms no public read | Oahu pipeline + pre-open leaders: No public read | Hotel GC roster: No public read. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1s-honolulu-snapshot",
    "marketSlug": "honolulu",
    "kind": "supply",
    "title": "Honolulu supply: Snapshot",
    "body": "Honolulu — Snapshot. Oʻahu rooms (implied): ~31,600 (Jul supply 979.6k room-nights ÷ 31, derived); Waikīkī ~26,300 (814.6k ÷ 31) · Jul 2026 | Implied rooms (C&W): ~31,519 · Q2 2026 | Oʻahu rooms UC: 0 (statewide 430, on Kauaʻi and Maui only) · Sep 14 2026 | Oʻahu final planning: 1,181 rooms / 5 projects (2027–28) · Sep 2026 | LE Oahu pipeline: Record 11 projects / 2,850 rooms (all stages) · Q2 2026 | STR forecast (Oʻahu): 2026F OCC 78.9%, ADR $283.90, RevPAR $223.86 (+0.3%); 2027F RevPAR $227.36 (+1.6%) · Aug 2026. Decision support.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "State of Hawaii · Cushman & Wakefield · Hawaii Tourism Authority · Lodging Econometrics (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/dbedt/economic/tourism/hotel-performance/Hotel-performance-2026-07.pdf",
        "label": "Oʻahu rooms (implied)",
        "secondary": false
      },
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "Implied rooms (C&W)",
        "secondary": false
      },
      {
        "url": "https://hta.hawaii.gov/wp-content/uploads/2026/09/Hawaii_HTA2026_AccommodationsPanel_v2.pdf",
        "label": "Oʻahu rooms UC",
        "secondary": false
      },
      {
        "url": "https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/",
        "label": "LE Oahu pipeline",
        "secondary": false
      },
      {
        "url": "https://hta.hawaii.gov/wp-content/uploads/2026/08/Handout-14-Monthly-Highlights-for-Board-Meeting-August-27-2026.pdf",
        "label": "STR forecast (Oʻahu)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-honolulu-submarket-basemap",
    "marketSlug": "honolulu",
    "kind": "supply",
    "title": "Honolulu supply: Submarket basemap (v0)",
    "body": "Honolulu — Submarket basemap (v0). Waikīkī: OCC 80.0% (−2.4 pts), ADR $277.89 (+2.3%), RevPAR $222.27 (−0.7%) | Other Oʻahu (outside Waikīkī): OCC 75.4% (+3.4 pts), ADR $382.08 (−2.0%), RevPAR $288.19 (+2.7%) | Downtown Honolulu / Kakaʻako: Hampton 133 + Home2 295 + 1500 Kapiʻolani 444 in final planning | Kapolei (West Oʻahu): Element 207 in final planning (2028). Decision support.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "hawaiihotelhui.com · Hawaii Tourism Authority (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://hawaiihotelhui.com/wp-content/uploads/HHH-August-2026-Market-Intelligence-Report.pdf",
        "label": "Waikīkī",
        "secondary": false
      },
      {
        "url": "https://hta.hawaii.gov/wp-content/uploads/2026/09/Hawaii_HTA2026_AccommodationsPanel_v2.pdf",
        "label": "Downtown Honolulu / Kakaʻako",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-honolulu-latest-pulse",
    "marketSlug": "honolulu",
    "kind": "supply",
    "title": "Honolulu supply: Latest pulse",
    "body": "Honolulu — Latest pulse (D2). Aug 2026 Oʻahu: OCC 79.2% (−1.5 pts), ADR $294.58 (+1.9%), RevPAR $233.37 (+0.1%); YTD RevPAR +0.3% | Jul 2026 Oʻahu: OCC 87.8% (+4.4 pts), ADR $307.45 (+0.7%), RevPAR $270.04 (+6.0%) | Aug 2026 Oʻahu visitors: 474,742 (−6.0%); spend $754.5M (−6.8%); YTD arrivals +0.6%, spend +6.3% | Honolulu air seats: Aug −0.9%, Sep −2.9%, Oct −2.0% | C&W Q2 2026: OCC 79.3%, ADR $276 (−1.0%), RevPAR $219 (+0.7%). Decision support.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "hawaiihotelhui.com · State of Hawaii · Cushman & Wakefield (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://hawaiihotelhui.com/wp-content/uploads/HHH-August-2026-Market-Intelligence-Report.pdf",
        "label": "Aug 2026 Oʻahu",
        "secondary": false
      },
      {
        "url": "https://files.hawaii.gov/dbedt/economic/tourism/hotel-performance/Hotel-performance-2026-07.pdf",
        "label": "Jul 2026 Oʻahu",
        "secondary": false
      },
      {
        "url": "https://dbedt.hawaii.gov/blog/26-62/",
        "label": "Aug 2026 Oʻahu visitors",
        "secondary": false
      },
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "C&W Q2 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-honolulu-supply-pressure-score",
    "marketSlug": "honolulu",
    "kind": "supply",
    "title": "Honolulu supply-pressure score 1/5",
    "body": "Honolulu — Supply-pressure score: 1 / 5 (strong supply tailwind). UC intensity: 0 rooms | Starts vs history: 1,181 final-planning rooms, none started; 2027 supply +0.7% forecast | Conversion share: Vacation-rental supply −13.8% (Aug), and hotels didn't capture the demand | Submarket concentration: Planned keys in Downtown/Kakaʻako and Kapolei, not Waikīkī (except Residence Inn 162) | Build-talent friction: No public read. Score 1/5 (1–2 tailwind; 3 mixed, underwrite by submarket; 4–5 no ground-up without hard barriers). Mobility read: 0 rooms UC; 1,181 final planning; demand/airlift soft (Aug arrivals −6%). Decision support.",
    "magnitude": "score 1/5",
    "asOf": "2026-10-11",
    "sourceLabel": "Hawaii Tourism Authority · hawaiihotelhui.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://hta.hawaii.gov/wp-content/uploads/2026/09/Hawaii_HTA2026_AccommodationsPanel_v2.pdf",
        "label": "UC intensity",
        "secondary": false
      },
      {
        "url": "https://hawaiihotelhui.com/wp-content/uploads/HHH-August-2026-Market-Intelligence-Report.pdf",
        "label": "Conversion share",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-honolulu-stage-rollup",
    "marketSlug": "honolulu",
    "kind": "pipeline",
    "title": "Honolulu pipeline: Stage rollup",
    "body": "Honolulu — Stage rollup. Oʻahu UC: 0 · 0 | Oʻahu final planning: 5 · 1,181 | LE Oahu total pipeline (all stages): 11 · 2,850 (record). Decision support.",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Hawaii Tourism Authority · Lodging Econometrics (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://hta.hawaii.gov/wp-content/uploads/2026/09/Hawaii_HTA2026_AccommodationsPanel_v2.pdf",
        "label": "Oʻahu UC",
        "secondary": false
      },
      {
        "url": "https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/",
        "label": "LE Oahu total pipeline (all stages)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-honolulu-named-projects",
    "marketSlug": "honolulu",
    "kind": "pipeline",
    "title": "Honolulu pipeline: Named projects",
    "body": "Honolulu — Named projects. Hampton Inn by Hilton Honolulu Downtown: 133 · Final planning · Downtown · 2027 | Home2 Suites by Hilton Honolulu Downtown: 295 · Final planning · Downtown · 2027 | 1500 Kapiʻolani Hotel: 444 · Final planning · Ala Moana / Kakaʻako · 2028 | Element by Marriott Oʻahu Kapolei: 207 · Final planning · Kapolei · 2028 | Residence Inn by Marriott Waikīkī Beach: 162 · Final planning · Waikīkī · 2028. Decision support.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Hawaii Tourism Authority (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://hta.hawaii.gov/wp-content/uploads/2026/09/Hawaii_HTA2026_AccommodationsPanel_v2.pdf",
        "label": "Hampton Inn by Hilton Honolulu Downtown",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-houston-1-wage-floor",
    "marketSlug": "houston",
    "kind": "talent",
    "title": "Houston talent: 1. Wage floor",
    "body": "Houston — 1. Wage floor. Texas / Houston minimum wage: $7.25/hr (federal; no state or city premium) · current 2026 | Hilton Americas-Houston (Local 23; ~400 workers; Houston First-owned, Hilton-managed): 40-day strike Sep 1 → Oct 10 2025; base $16.50 → $20/hr immediately, then +$2 over 3 yrs; lighter HK workloads, job security · settled 2025-10-10 | Ripple: GRB Convention Center F&B (Levy, ~100) and IAH lounges (~200): Same $20 + $2/3-yr pattern · 2025-11-07; 2025-12-05 | Aggregate: ~700 unionized hospitality workers at 4 sites won ~25% raises in late 2025 · 2025-12-28 | Marriott Marquis Houston (Local 23; ~350 workers): Ratified contract through 2028; minimum $22/hr by end of term; lower health costs, paid Juneteenth · ratified Jun 2026 | Pending (as of Dec 2025): ~600 IAH food workers (OTG) — outcome no public read · 2025-12-28 (source: HPM (above)). Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "U.S. Dept. of Labor · houstonpublicmedia.org · UNITE HERE (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.dol.gov/agencies/whd/minimum-wage/state",
        "label": "Texas / Houston minimum wage",
        "secondary": false
      },
      {
        "url": "https://www.houstonpublicmedia.org/articles/news/business/2025/10/10/533145/striking-hilton-americas-houston-workers-negotiate-agreement-to-immediately-raise-minimum-wage-to-20/",
        "label": "Hilton Americas-Houston (Local 23; ~400 workers; Houston First-owned,  — houstonpublicmedia.org",
        "secondary": false
      },
      {
        "url": "https://unitehere.org/press-releases/on-day-40-of-hilton-americas-hotel-strike-workers-reach-an-agreement/",
        "label": "Hilton Americas-Houston (Local 23; ~400 workers; Houston First-owned,  — unitehere.org",
        "secondary": false
      },
      {
        "url": "https://www.houstonpublicmedia.org/articles/news/business/2025/12/28/539584/houston-labor-union-workers-strike-unite-here-local/",
        "label": "Ripple: GRB Convention Center F&B (Levy, ~100) and IAH lounges (~200)",
        "secondary": false
      },
      {
        "url": "https://www.houstonpublicmedia.org/articles/news/business/2026/06/05/553800/marriott-marquis-houston-workers-wage-increase-union-contract/",
        "label": "Marriott Marquis Houston (Local 23; ~350 workers)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-houston-1-1-bls-oews-hotel-occupations",
    "marketSlug": "houston",
    "kind": "talent",
    "title": "Houston talent: 1.1 BLS OEWS — hotel occupations (MSA)",
    "body": "Houston — 1.1 BLS OEWS — hotel occupations (MSA). Maids & housekeeping cleaners (all industries) (37-2012): 12900 · $14.30 · $14.72 | Hotel, motel & resort desk clerks (43-4081): 4410 · $14.37 · $15.00 | Lodging managers (11-9081): 750 · $31.23 · $35.96 | Cooks, restaurant (all industries) (35-2014): 32710 · $16.85 · $15.85. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "U.S. BLS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.bls.gov/oes/current/oes_26420.htm",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      },
      {
        "url": "https://www.bls.gov/oes/special-requests/oesm25ma.zip",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-houston-2-build-talent",
    "marketSlug": "houston",
    "kind": "talent",
    "title": "Houston talent: 2. Build talent (summary — detail in houston-build.md)",
    "body": "Houston — 2. Build talent (summary — detail in houston-build.md). MSA construction jobs: 254,900 → 269,000 (+14,100, +6%; #1 of 360 in absolute gain) · Aug 2025 → Aug 2026 | Driver: AGC: gains concentrated in data centers, power, factories nationally · 2026-09-30 | National craft difficulty: 88% as hard/harder; electricians 81% · 2026-09-03 | Hotel-specific Houston trade shortage: No public read. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "AGC of America (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.agc.org/news/2026/09/30/only-half-metro-areas-add-construction-jobs-over-past-12-months-data-centers-power-and-factories",
        "label": "MSA construction jobs — agc.org",
        "secondary": false
      },
      {
        "url": "https://www.agc.org/sites/default/files/users/user21902/Metro%20Empl%202026_August_Alpha.pdf",
        "label": "MSA construction jobs — agc.org",
        "secondary": false
      },
      {
        "url": "https://www.agc.org/sites/default/files/users/user21902/2026%20Workforce%20Survey%20Analysis%20(4",
        "label": "National craft difficulty",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-houston-3-operator-bench",
    "marketSlug": "houston",
    "kind": "talent",
    "title": "Houston talent: 3. Operator bench",
    "body": "Houston — 3. Operator bench (D11). Frontera Hotel Group: M · Selected by SLTX Capital to manage Canopy by Hilton, Scanlan Building (405 Main; 138–140 keys; office→hotel) · Zuhair Bheda, SVP & CDO | Dreamscape Hospitality: M · Assumed management of Hyatt Regency Houston West (400 keys, Energy Corridor) · Adam Patenaude, President | Oldham Goodwin: M · Added Element by Westin Houston Katy to third-party portfolio (143 rooms; effective Jan 1 2026 per company release; owner partner Houston Affiliates, Ltd.) | Atrium Hospitality: M · Portfolio lists Houston Marriott South at Hobby Airport. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Hotel Management · oldhamgoodwin.com · atriumhospitality.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.hotelmanagement.net/operate/frontera-manage-houston-canopy-hilton",
        "label": "Frontera Hotel Group",
        "secondary": false
      },
      {
        "url": "https://www.hotelmanagement.net/operate/dreamscape-manage-houston-hyatt-regency",
        "label": "Dreamscape Hospitality",
        "secondary": false
      },
      {
        "url": "https://oldhamgoodwin.com/oldham-goodwin-welcomes-element-by-westin-houston-katy-to-third-party-management-portfolio/",
        "label": "Oldham Goodwin",
        "secondary": false
      },
      {
        "url": "https://www.atriumhospitality.com/our-hotels/our-portfolio",
        "label": "Atrium Hospitality",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-houston-3-2-pre-open-risk-named-openings",
    "marketSlug": "houston",
    "kind": "talent",
    "title": "Houston talent: 3.2 Pre-open risk — named openings",
    "body": "Houston — 3.2 Pre-open risk — named openings. HIE + Staybridge, 1319 Texas Ave: 275 · Opened Apr 2026 · No public read · Ramp risk only. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "1 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1t-houston-5-gaps",
    "marketSlug": "houston",
    "kind": "talent",
    "title": "Houston talent: 5. Gaps (no public read)",
    "body": "Houston — 5. Gaps (no public read). Local 23 full scale tables by classification / exact expiry dates: No public read (only base + steps) | IAH OTG food-worker contract outcome (2026): No public read | Operator for 1319 Texas Ave HIE/Staybridge: No public read | Houston hotel-specific trade shortage: No public read | Oldham Goodwin Element Katy effective date: Resolved: Jan 1 2026 (company page). Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1s-houston-snapshot",
    "marketSlug": "houston",
    "kind": "supply",
    "title": "Houston supply: Snapshot",
    "body": "Houston — Snapshot. Metro inventory: \">100,000 rooms\" (Woodlands to Texas City) · 2026 | Implied rooms (STR market): ~106,941 (Q2 supply room-nights ÷ 91, derived) · Q2 2026 | OCC / ADR / RevPAR: 59% / $120 / $71 (OCC −~9%, RevPAR −9%) · YE 2025 | City tax-registry rooms: 68,260 · 2026. Decision support.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Houston First · Cushman & Wakefield · texashotelsearch.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "http://www.houstonfirst.com/news/houston-hotel-market-posts-record-breaking-q1?news_type=PRESS_RELEASE",
        "label": "Metro inventory",
        "secondary": false
      },
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "Implied rooms (STR market)",
        "secondary": false
      },
      {
        "url": "https://www.houstonfirst.com/news/hotel-occupancy-finished-2025-at-59",
        "label": "OCC / ADR / RevPAR",
        "secondary": false
      },
      {
        "url": "https://www.texashotelsearch.com/markets/houston",
        "label": "City tax-registry rooms",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-houston-submarket-basemap",
    "marketSlug": "houston",
    "kind": "supply",
    "title": "Houston supply: Submarket basemap (v0, Houston First monthly releases — Aug 2026: · Jul 2026: · Dec 2025 notes: )",
    "body": "Houston — Submarket basemap (v0, Houston First monthly releases — Aug 2026: · Jul 2026: · Dec 2025 notes: ). Downtown / CBD: OCC 52%, ADR $191, RevPAR $100 · OCC 53%, ADR $205, RevPAR $108 (+17%) · Dec 2025: OCC 45% on supply growth while demand rose 1.7%. New 275-key HIE/Staybridge opened Apr 2026. | Uptown / Galleria: OCC 54% (−7%), RevPAR $85 (−5%) · OCC 56%, RevPAR $93 · Weakest Aug trend | Medical Center / NRG: OCC 57%, ADR $136, RevPAR $77 · OCC 58%, ADR $145 · TMC is the steady base; NRG for events | North / Woodlands: OCC 58% (+4 pts), RevPAR $68 (+7%) · Corporate suburban | Katy Fwy West: OCC 59%, RevPAR $61 (+7%) · Energy corridor | Hobby / NASA: OCC 65% (+6%) · Highest Jul OCC | Bush IAH: Dec 2025 OCC 53% · Airport. Decision support.",
    "magnitude": "7 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Houston First (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.houstonfirst.com/news/houston-hotels-showed-modest-demand-growth-in-august",
        "label": "Downtown / CBD — houstonfirst.com",
        "secondary": false
      },
      {
        "url": "https://www.houstonfirst.com/news/houston-hotels-showed-solid-rates-and-demand-in-july",
        "label": "Downtown / CBD — houstonfirst.com",
        "secondary": false
      },
      {
        "url": "https://www.houstonfirst.com/news/hotel-occupancy-finished-2025-at-59",
        "label": "Downtown / CBD — houstonfirst.com",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-houston-latest-monthly-pulse",
    "marketSlug": "houston",
    "kind": "supply",
    "title": "Houston supply: Latest monthly pulse",
    "body": "Houston — Latest monthly pulse (D2). Aug 2026: OCC 56% (flat), ADR $114 (+1.5%), RevPAR $64 (+~1%); YTD OCC ~61% flat, ADR $129 (+5.5%), RevPAR $78 (+6%), revenue +~7% | Jul 2026: OCC 59% (+1.2%), ADR $122 (+6%), RevPAR $72 (+7%) | Jun 2026: OCC 61% (−~2%; supply +1 pt), ADR $141 (+16%), RevPAR $86 (+14%) | CoStar wk ending 2026-06-20: RevPAR +28.1% to $100.01 (3 WC matches) | C&W Q2 2026: OCC 60.9% (−1.7%), ADR $131 (+6.8%), RevPAR $80 (+5.0%); supply +1.0%, demand −0.7% | HVS WC window: OCC −1.8 pt vs counterfactual; RevPAR +22.2% (+$7.85). Decision support.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Houston First · CoStar · Cushman & Wakefield · HVS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.houstonfirst.com/news/houston-hotels-showed-modest-demand-growth-in-august",
        "label": "Aug 2026",
        "secondary": false
      },
      {
        "url": "https://www.houstonfirst.com/news/houston-hotels-showed-solid-rates-and-demand-in-july",
        "label": "Jul 2026",
        "secondary": false
      },
      {
        "url": "https://www.houstonfirst.com/news/houston-hotels-saw-flat-occupancy-but-higher-rates-and-revenue-in-june",
        "label": "Jun 2026",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-20-june",
        "label": "CoStar wk ending 2026-06-20",
        "secondary": false
      },
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "C&W Q2 2026",
        "secondary": false
      },
      {
        "url": "https://www.hvs.com/article/10529-how-the-2026-fifa-world-cup-changed-us-hotel-markets",
        "label": "HVS WC window",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-houston-supply-pressure-score",
    "marketSlug": "houston",
    "kind": "supply",
    "title": "Houston supply-pressure score 2/5",
    "body": "Houston — Supply-pressure score: 2 / 5 (supply tailwind, demand headwind). UC intensity: Not in LE public top-5 UC; Cornovus: supply growth \"limited,\" concentrated in CBD and southern submarkets | Starts vs history: Not in LE top-5 starts or early planning | Conversion share: #1 U.S. reno + conversion: 35 / 4,841 rooms (reflag ≠ net supply) | Build-talent friction: No public read (source: TBD). Score 2/5 (1–2 tailwind; 3 mixed, underwrite by submarket; 4–5 no ground-up without hard barriers). Mobility read: Supply tailwind but demand headwind (OCC 59–61%); #1 U.S. reno/conversion; ground-up still not justified. Decision support.",
    "magnitude": "score 2/5",
    "asOf": "2026-10-11",
    "sourceLabel": "Lodging Econometrics · Cornovus Capital (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/",
        "label": "UC intensity — lodgingeconometrics.com",
        "secondary": false
      },
      {
        "url": "https://cornovuscapital.com/southwest-hospitality-market-report-q1-2026/",
        "label": "UC intensity — cornovuscapital.com",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-houston-stage-rollup",
    "marketSlug": "houston",
    "kind": "pipeline",
    "title": "Houston pipeline: Stage rollup",
    "body": "Houston — Stage rollup. Renovation + conversion: 35 · 4,841 (#1 U.S.) | UC / starts / early planning: Not in LE public top-5 lists. Decision support.",
    "magnitude": "2 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Lodging Econometrics (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/",
        "label": "Renovation + conversion",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-houston-named-projects",
    "marketSlug": "houston",
    "kind": "pipeline",
    "title": "Houston pipeline: Named projects",
    "body": "Houston — Named projects. Holiday Inn Express + Staybridge Suites, 1319 Texas Ave. (17 stories): 275 · Opened Apr 2026 · Downtown / ballpark · Delivered | Canopy by Hilton, Scanlan Building, 405 Main St. (conversion): 138 · Broke ground · Downtown · Fall/winter 2027 | George R. Brown convention district transformation (demand anchor): UC · Downtown · Opens May 2028. Decision support.",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Houston Chronicle · Hoodline · Houston First (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.houstonchronicle.com/business/real-estate/article/downtown-hotel-staybridge-holiday-inn-express-open-22220406.php",
        "label": "Holiday Inn Express + Staybridge Suites, 1319 Texas Ave. (17 stories) — houstonchronicle.com",
        "secondary": false
      },
      {
        "url": "https://hoodline.com/2026/04/new-downtown-hotel-muscles-into-minute-maid-park-s-backyard/",
        "label": "Holiday Inn Express + Staybridge Suites, 1319 Texas Ave. (17 stories) — hoodline.com",
        "secondary": false
      },
      {
        "url": "https://www.houstonchronicle.com/business/article/hilton-canopy-scanlan-houston-22290048.php",
        "label": "Canopy by Hilton, Scanlan Building, 405 Main St. (conversion)",
        "secondary": false
      },
      {
        "url": "https://www.houstonfirst.com/convention-district-transformation-1/",
        "label": "George R. Brown convention district transformation (demand anchor)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-los-angeles-1-wage-floor",
    "marketSlug": "los-angeles",
    "kind": "talent",
    "title": "Los Angeles talent: 1. Wage floor",
    "body": "Los Angeles — 1. Wage floor. LA CHMWO hotel minimum (≥60 rooms; ≥50 in AHEZ): $25.00 cash (Jul 1 2026–Jun 30 2027); prior $22.50 (Sep 8 2025), $20.32 (Jul 2024) · chart rev. 2026-03-31 | CHMWO health-benefit payment: $4.25/hr (paid as wage if no benefit) — amended by Ord. 188944 (Council File 25-1466), eff. Jun 29 2026; pre-amendment chart showed $8.15 · 2026-05-26 approval | $30 Olympic Wage timing: Delayed to 2030 (was Jul 1 2028); \"yearly incremental increases through 2030\" — interim steps in next row · 2026-05-21 | Hotel minimum steps (Ord. 188944, eff. 2026-06-29): $25.00 Jul 1 2026 · $25.50 Jul 1 2027 · $28.50 Jul 1 2028 · $29.00 Jul 1 2029 · $30.00 Jan 1 2030 · CPI-W (LA) annually from Jul 1 2030 · 2026-05-19 (amending motion 26A, adopted) | Hotel health benefit payment (or equivalent wage): $4.25/hr Jul 1 2026 → $6.00/hr Jul 1 2027 → tied to airport-worker health payment from Jul 1 2028 · 2026-05-28 | Referendum on Ord. 188610: Failed (84,007 valid signatures; ~93,000 needed) → ordinance effective Sep 8 2025 · 2025-09-08 | Hotel Worker Training Ordinance: Room attendants: certified 5 hrs training (employer-paid), from Dec 1 2025 · 2025-12-01 | Hotel Worker Protection Ordinance: Panic devices + premium pay above workload limits (since Aug 12 2022) · 2022-08-12 | LA City general minimum: $18.42 · eff. 2026-07-01 | Local 11 – Disneyland Resort: ~3,000 workers; contract expired Jan 2026, extended by mutual agreement; next session Oct 12 2026; Disney: ~96% earn >$22 base · Oct 2026 | Local 11 LA-area hotel contracts (2023–24 strike wave; Hilton, Hyatt, Marriott-operated and others — e.g., Beverly Hilton, Waldorf Astoria BH, InterContinental DTLA): Ratified by 98% at 34 hotels (Mar 2024), later 46 agreements (incl. Proper Santa Monica, Proper DTLA, Viceroy SM, Le Méridien Delfina, Hotel June, Four Points LAX) · 2024-03-25 → 2024 | — wages: +$5.00/hr in year 1 (~20%); +$10.00/hr total for room attendants, cooks and other non-tipped (40–50% over term, ~8.9%/yr avg); tipped: double-time holidays/vacation/sick, higher service-charge share, auto 20% gratuity in FS restaurants · 2024-04-17 (union highlights PDF) | — path to top HK rate: Room attendants at most hotels reach $35.00/hr (~$73,000/yr) by Jul 1 2027; top cooks $41/hr; union says all-in cost ~$100,000/yr per room attendant. Year-by-year steps between yr-1 (+$5) and Jul 2027: no public read · 2024-04-17 (source: same PDF) | — benefits / workload: Family health ≤$20/month worker cost; employer pension contribution up 600% since 2018 (union figure); mandatory daily room cleaning + guaranteed pre-pandemic staffing · 2024-04-17 (source: same PDF) | — expiry: January 15, 2028 (≈4.5-yr term; before LA28) · 2024-03-25 | — vs ordinance: Union room-attendant rate ($35 by Jul 2027) sits above the CHMWO cash floor ($25 Jul 2026) — union hotels pay above the ordinance; full classification scale sheets no public read | LA County / Long Beach / West Hollywood / Anaheim hotel ordinances: Not checked this pass. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "17 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "City of Los Angeles · Hotel Dive · natlawreview.com · Los Angeles Times · disneyexperiences.com · UNITE HERE Local 11 · AP News (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://wagesla.lacity.gov/sites/g/files/wph1941/files/2026-04/2026%20CHMWO%20Wage%20Chart%20wHB%20FINAL%2004-01-26%20ADA.pdf",
        "label": "LA CHMWO hotel minimum (≥60 rooms; ≥50 in AHEZ)",
        "secondary": false
      },
      {
        "url": "https://wagesla.lacity.gov/hotel-worker-ordinances",
        "label": "CHMWO health-benefit payment",
        "secondary": false
      },
      {
        "url": "https://www.hoteldive.com/news/los-angeles-city-council-votes-to-delay-hotel-minimum-wage-ordinance/820848/",
        "label": "$30 Olympic Wage timing",
        "secondary": false
      },
      {
        "url": "https://cityclerk.lacity.org/onlinedocs/2025/25-1466_misc_26A_Amd%20Mot%20MHD-Lee_5-19-26.pdf",
        "label": "Hotel minimum steps (Ord. 188944, eff. 2026-06-29) — cityclerk.lacity.org",
        "secondary": false
      },
      {
        "url": "https://cityclerk.lacity.org/lacityclerkconnect/index.cfm?cfnumber=25-1466&fa=ccfi.viewrecord",
        "label": "Hotel minimum steps (Ord. 188944, eff. 2026-06-29) — cityclerk.lacity.org",
        "secondary": false
      },
      {
        "url": "https://natlawreview.com/article/los-angeles-amends-hotel-worker-minimum-wage-ordinance-advance-july-2026",
        "label": "Hotel health benefit payment (or equivalent wage)",
        "secondary": false
      },
      {
        "url": "https://www.latimes.com/california/story/2025-09-08/bid-to-repeal-l-a-s-30-hotel-minimum-wage-fails-to-qualify-for-the-ballot",
        "label": "Referendum on Ord. 188610",
        "secondary": false
      },
      {
        "url": "https://wagesla.lacity.gov/sites/g/files/wph1941/files/2026-04/2026%20MWR%20Increase%20Memo%2001-30-26%20ADA%20Final.pdf",
        "label": "LA City general minimum",
        "secondary": false
      },
      {
        "url": "https://disneyexperiences.com/disneyland/our-cast/our-work-with-unions/negotiations-underway-with-unite-here-local-11/",
        "label": "Local 11 – Disneyland Resort — disneyexperiences.com",
        "secondary": false
      },
      {
        "url": "https://www.unitehere11.org/first-bargaining-session-for-the-2026-disney-contract-fight/",
        "label": "Local 11 – Disneyland Resort — unitehere11.org",
        "secondary": false
      },
      {
        "url": "https://www.unitehere11.org/press-release-unite-here-local-11-unveils-results-and-terms-of-historic-deal-reached-at-34-hotels/",
        "label": "Local 11 LA-area hotel contracts (2023–24 strike wave; Hilton, Hyatt,  — unitehere11.org",
        "secondary": false
      },
      {
        "url": "https://www.unitehere11.org/press-release-five-more-including-viceroy-le-meridien-delfina-hampton-inn-and-courtyard-santa-monica-sign-with-unite-here-local-11-raising-the-total-to-46-agreements/",
        "label": "Local 11 LA-area hotel contracts (2023–24 strike wave; Hilton, Hyatt,  — unitehere11.org",
        "secondary": false
      },
      {
        "url": "https://www.unitehere11.org/wp-content/uploads/Local-11-2023-LA-contract-2-page-2024-04-17.pdf",
        "label": "— wages",
        "secondary": false
      },
      {
        "url": "https://apnews.com/article/california-hotel-strike-contract-ratification-cce82d9fe9b0d2c3137929cc60f4b2f1",
        "label": "— expiry",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-los-angeles-1-1-bls-oews-hotel-occupations",
    "marketSlug": "los-angeles",
    "kind": "talent",
    "title": "Los Angeles talent: 1.1 BLS OEWS — hotel occupations",
    "body": "Los Angeles — 1.1 BLS OEWS — hotel occupations. Maids & housekeeping cleaners (all industries) (37-2012): 34440 · $20.93 · $21.71 | Hotel, motel & resort desk clerks (43-4081): 7830 · $19.05 · $20.82 | Lodging managers (11-9081): 1480 · $36.51 · $42.81 | Cooks, restaurant (all industries) (35-2014): 54320 · $21.38 · $21.52. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "U.S. BLS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.bls.gov/oes/current/oes_31080.htm",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      },
      {
        "url": "https://www.bls.gov/oes/special-requests/oesm25ma.zip",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-los-angeles-2-build-talent",
    "marketSlug": "los-angeles",
    "kind": "talent",
    "title": "Los Angeles talent: 2. Build talent (summary — detail in los-angeles-build.md)",
    "body": "Los Angeles — 2. Build talent (summary — detail in los-angeles-build.md). LA–Long Beach–Anaheim construction: 254,500 → 252,600 (−1%) · Aug 2025 → Aug 2026 | LA–Long Beach–Glendale div.: −0.1% · same | Anaheim–Santa Ana–Irvine div.: −2% · same | Hotel development trend: AHLA (Apr 2026): LA hotel development slowed; layoffs reported (industry claim) · 2026-05-21. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "AGC of America · Hotel Dive (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.agc.org/sites/default/files/users/user21902/Metro%20Empl%202026_August_Alpha.pdf",
        "label": "LA–Long Beach–Anaheim construction",
        "secondary": false
      },
      {
        "url": "https://www.hoteldive.com/news/los-angeles-city-council-votes-to-delay-hotel-minimum-wage-ordinance/820848/",
        "label": "Hotel development trend",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-los-angeles-3-operator-bench",
    "marketSlug": "los-angeles",
    "kind": "talent",
    "title": "Los Angeles talent: 3. Operator bench",
    "body": "Los Angeles — 3. Operator bench (D11). Dreamscape Hospitality: M · The Georgian, Santa Monica (joining Hyatt soft brand); owner JB Hotel Group (Jon Blanchard) · Adam Patenaude, President | Stonebridge (Denver): M · The Anthem LA Stadium District, Tapestry (179, Inglewood) · Rob Smith, CEO | Crescent Hotels & Resorts (Latitudes): M · The Mayfair Hotel (295, DTLA); cites \"extensive experience in Los Angeles\" · Michael George, CEO | Palisociety (LA): Owner/operator lifestyle · Deal with Design Hotels (per Timberlane post) | Disneyland Resort: Owner-operator · 3 Anaheim hotels; Local 11 unit ~3,000 (source: Disney page above). Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Hotel Management · Hotel Online · crescenthotels.com · timberlanepartners.com · disneyexperiences.com · UNITE HERE Local 11 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.hotelmanagement.net/operate/dreamscape-manage-californias-georgian-hotel",
        "label": "Dreamscape Hospitality",
        "secondary": false
      },
      {
        "url": "https://www.hotel-online.com/news/stonebridge-adds-the-anthem-los-angeles-stadium-district-tapestry-by-hilton-to-management-portfolio",
        "label": "Stonebridge (Denver)",
        "secondary": false
      },
      {
        "url": "https://www.crescenthotels.com/press/crescent-hotels-resorts-to-manage-the-mayfair-hote",
        "label": "Crescent Hotels & Resorts (Latitudes)",
        "secondary": false
      },
      {
        "url": "https://timberlanepartners.com/2026/06/17/l-a-s-palisociety-inks-deal-with-design-hotels-amid-historic-tourism-super-cycle/",
        "label": "Palisociety (LA)",
        "secondary": false
      },
      {
        "url": "https://disneyexperiences.com/disneyland/our-cast/our-work-with-unions/negotiations-underway-with-unite-here-local-11/",
        "label": "Disneyland Resort — disneyexperiences.com",
        "secondary": false
      },
      {
        "url": "https://www.unitehere11.org/first-bargaining-session-for-the-2026-disney-contract-fight/",
        "label": "Disneyland Resort — unitehere11.org",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-los-angeles-5-gaps",
    "marketSlug": "los-angeles",
    "kind": "talent",
    "title": "Los Angeles talent: 5. Gaps (no public read)",
    "body": "Los Angeles — 5. Gaps (no public read). CHMWO 2027–2029 step rates under Ord. 188944: Filled 2026-10-11 — see wage table rows above (motion 26A) | Local 11 LA contract classification scale (annual steps): No public read (totals, $35 HK target and Jan 15 2028 expiry resolved) | Long Beach / Anaheim / WeHo / LA County hotel ordinances: Not checked | LA28 hotel openings + leaders: No public read | LA hotel GC roster: No public read. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1s-los-angeles-snapshot",
    "marketSlug": "los-angeles",
    "kind": "supply",
    "title": "Los Angeles supply: Snapshot",
    "body": "Los Angeles — Snapshot. Implied rooms (STR market): ~112,390 (Q2 supply room-nights ÷ 91, derived) · Q2 2026 | LA County rooms UC: 19 hotels / 2,311 rooms (CA #1) · mid-2026 | LA County planning: 136 hotels / 20,454 rooms (planning pipeline contracting statewide 4th straight period) · mid-2026 | YE 2025: 18 UC / 2,172 rooms; 138 planning / 20,557; 7 openings (CA #1) · YE 2025 | Metro active construction: 2,285 rooms; CBD + South Bay = 60%; >1,400 open in 2026 (3-yr high) · Feb 2026 | CA mid-scale build cost: $250k–$300k/key · 2026. Decision support.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Cushman & Wakefield · pressdemocrat.com · LA Business Journal · sccai.org · Marcus & Millichap (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "Implied rooms (STR market)",
        "secondary": false
      },
      {
        "url": "https://www.pressdemocrat.com/2026/07/24/north-bay-hotel-projects-advance-despite-market-headwinds/",
        "label": "LA County rooms UC",
        "secondary": false
      },
      {
        "url": "https://labusinessjournal.com/special-reports/hospitality-luxury-styles/",
        "label": "YE 2025 — labusinessjournal.com",
        "secondary": false
      },
      {
        "url": "https://www.sccai.org/wp-content/uploads/2026/06/Hotel-Motel-Market-Overview.pdf",
        "label": "YE 2025 — sccai.org",
        "secondary": false
      },
      {
        "url": "https://www.marcusmillichap.com/-/media/Files/MM/Research%20Reports/Market%20Reports/2026/2026%20Hospitality%20Market%20Reports/Los%20Angeles%20Hospitality%20Market%20Report%20pdf.pdf?rev=06f22dbd0a954227bdcb346770f35d55",
        "label": "Metro active construction",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-los-angeles-submarket-basemap",
    "marketSlug": "los-angeles",
    "kind": "supply",
    "title": "Los Angeles supply: Submarket basemap (v0)",
    "body": "Los Angeles — Submarket basemap (v0). Downtown LA / CBD: Largest share of construction (with South Bay ~60%); convention + Crypto.com | South Bay / LAX corridor / Inglewood (SoFi): Kali Hotel (Autograph) near SoFi among UC; LAX pax −3.74% Aug | Hollywood / Burbank / Glendale: Upper-midscale/upscale focus (Matthews via LABJ) | Beverly Hills / Westside: Aman Beverly Hills 78 suites (2027); barrier-protected luxury. Decision support.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Marcus & Millichap · LA Business Journal (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.marcusmillichap.com/-/media/Files/MM/Research%20Reports/Market%20Reports/2026/2026%20Hospitality%20Market%20Reports/Los%20Angeles%20Hospitality%20Market%20Report%20pdf.pdf?rev=06f22dbd0a954227bdcb346770f35d55",
        "label": "Downtown LA / CBD",
        "secondary": false
      },
      {
        "url": "https://labusinessjournal.com/special-reports/hospitality-luxury-styles/",
        "label": "South Bay / LAX corridor / Inglewood (SoFi)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-los-angeles-latest-pulse",
    "marketSlug": "los-angeles",
    "kind": "supply",
    "title": "Los Angeles supply: Latest pulse",
    "body": "Los Angeles — Latest pulse (D2). C&W Q2 2026 (STR/CoStar): OCC 72.7%, ADR $215, RevPAR $156 (+5.8%) | CoStar wk ending Feb 14: NBA All-Star: ADR +18.2% to $225.66, RevPAR +26.5% to $173.40 (Top-25 leader) | CoStar wk ending Jun 13: Named as World Cup opener host (USA match); no metric captured in public text | HVS WC window: OCC +1.0 pt; RevPAR +15.5% (+$18.64). Decision support.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Cushman & Wakefield · CoStar · HVS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "C&W Q2 2026 (STR/CoStar)",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-14-february",
        "label": "CoStar wk ending Feb 14",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-13-june",
        "label": "CoStar wk ending Jun 13",
        "secondary": false
      },
      {
        "url": "https://www.hvs.com/article/10529-how-the-2026-fifa-world-cup-changed-us-hotel-markets",
        "label": "HVS WC window",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-los-angeles-supply-pressure-score",
    "marketSlug": "los-angeles",
    "kind": "supply",
    "title": "Los Angeles supply-pressure score 3/5",
    "body": "Los Angeles — Supply-pressure score: 3 / 5 (mixed). UC intensity: 2,311 / ~112k ≈ 2.1% (supply derivation) | Starts vs history: UC roughly flat to up (2,172 → 2,311); planning flat (~20.5k) but mostly paper | Openings: >1,400 rooms in 2026, a 3-yr high | Submarket concentration: CBD + South Bay = 60% of construction | Build-talent friction: Highest ops floors in the U.S.; $250–300k/key mid-scale. Score 3/5 (1–2 tailwind; 3 mixed, underwrite by submarket; 4–5 no ground-up without hard barriers). Mobility read: 2,311 rooms UC (CA #1); CBD + South Bay 60%; event-stacked 2026–28; $25+$4.25→$30 floor, union $35. Decision support.",
    "magnitude": "score 3/5",
    "asOf": "2026-10-11",
    "sourceLabel": "pressdemocrat.com · Cushman & Wakefield · LA Business Journal · Marcus & Millichap · sccai.org (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.pressdemocrat.com/2026/07/24/north-bay-hotel-projects-advance-despite-market-headwinds/",
        "label": "UC intensity — pressdemocrat.com",
        "secondary": false
      },
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "UC intensity — cushmanwakefield.com",
        "secondary": false
      },
      {
        "url": "https://labusinessjournal.com/special-reports/hospitality-luxury-styles/",
        "label": "Starts vs history",
        "secondary": false
      },
      {
        "url": "https://www.marcusmillichap.com/-/media/Files/MM/Research%20Reports/Market%20Reports/2026/2026%20Hospitality%20Market%20Reports/Los%20Angeles%20Hospitality%20Market%20Report%20pdf.pdf?rev=06f22dbd0a954227bdcb346770f35d55",
        "label": "Openings",
        "secondary": false
      },
      {
        "url": "https://www.sccai.org/wp-content/uploads/2026/06/Hotel-Motel-Market-Overview.pdf",
        "label": "Build-talent friction",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-los-angeles-stage-rollup",
    "marketSlug": "los-angeles",
    "kind": "pipeline",
    "title": "Los Angeles pipeline: Stage rollup",
    "body": "Los Angeles — Stage rollup. LA County UC (mid-2026): 19 · 2,311 | LA County planning (mid-2026): 136 · 20,454 | LA County UC (YE 2025): 18 · 2,172 | Openings 2025: 7 | Metro opening in 2026: >1,400. Decision support.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "pressdemocrat.com · LA Business Journal · sccai.org · Marcus & Millichap (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.pressdemocrat.com/2026/07/24/north-bay-hotel-projects-advance-despite-market-headwinds/",
        "label": "LA County UC (mid-2026)",
        "secondary": false
      },
      {
        "url": "https://labusinessjournal.com/special-reports/hospitality-luxury-styles/",
        "label": "LA County UC (YE 2025)",
        "secondary": false
      },
      {
        "url": "https://www.sccai.org/wp-content/uploads/2026/06/Hotel-Motel-Market-Overview.pdf",
        "label": "Openings 2025",
        "secondary": false
      },
      {
        "url": "https://www.marcusmillichap.com/-/media/Files/MM/Research%20Reports/Market%20Reports/2026/2026%20Hospitality%20Market%20Reports/Los%20Angeles%20Hospitality%20Market%20Report%20pdf.pdf?rev=06f22dbd0a954227bdcb346770f35d55",
        "label": "Metro opening in 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-los-angeles-named-projects",
    "marketSlug": "los-angeles",
    "kind": "pipeline",
    "title": "Los Angeles pipeline: Named projects",
    "body": "Los Angeles — Named projects. Aman Beverly Hills (One Beverly Hills): 78 suites · UC · Beverly Hills · 2027 | Kali Hotel & Rooftop, Autograph Collection: no public key count in source · UC (YE 2025) · Inglewood / SoFi. Decision support.",
    "magnitude": "2 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "LA Business Journal (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://labusinessjournal.com/special-reports/hospitality-luxury-styles/",
        "label": "Aman Beverly Hills (One Beverly Hills)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-miami-1-wage-floor",
    "marketSlug": "miami",
    "kind": "talent",
    "title": "Miami talent: 1. Wage floor",
    "body": "Miami — 1. Wage floor. Florida minimum wage: $15.00/hr; tipped cash $11.98; annual inflation indexing resumes (natlawreview: from Sep 30 2027) · eff. 2026-09-30 | Local hotel wage ordinance: FL preempts local minimums; Miami Beach living-wage (city contractors) not checked | UNITE HERE Local 355 activity: Hilton Marina (Fort Lauderdale) first contract; MBCC workers (Sodexo) formed union Oct 2025; organizing support at a Hyatt hotel (contract fight) · Feb 2026 newsletter | Fontainebleau Miami Beach: Local 355 CBA (term cited 2017-07-01 → 2022-06-30 in federal case); current contract terms no public read; open NLRB charge vs Local 355 (filed 2026-01-06) · 2020-12-16 / 2026-01-06 | Diplomat Beach Resort (Hollywood) reference: ~450 workers; starting wage $13.95 → $17 → $20 by 2025 (3-yr deal, Sep 2022) — successor contract no public read · 2022-09-13 | Recent hotel strikes: No public read of a 2025–26 Miami hotel strike · 2026-10-11. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "natlawreview.com · fox13news.com · unitehere355.org (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://natlawreview.com/article/increased-minimum-wage-florida-employees",
        "label": "Florida minimum wage — natlawreview.com",
        "secondary": false
      },
      {
        "url": "https://www.fox13news.com/news/florida-minimum-wage-what-workers-need-to-know",
        "label": "Florida minimum wage — fox13news.com",
        "secondary": false
      },
      {
        "url": "https://www.unitehere355.org/wp-content/uploads/L355-Newsletter-February-2026-web.pdf",
        "label": "UNITE HERE Local 355 activity",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-miami-1-1-bls-oews-hotel-occupations",
    "marketSlug": "miami",
    "kind": "talent",
    "title": "Miami talent: 1.1 BLS OEWS — hotel occupations",
    "body": "Miami — 1.1 BLS OEWS — hotel occupations. Maids & housekeeping cleaners (all industries) (37-2012): 22370 · $16.52 · $16.81 | Hotel, motel & resort desk clerks (43-4081): 6860 · $17.07 · $17.53 | Lodging managers (11-9081): 1160 · $36.95 · $44.31 | Cooks, restaurant (all industries) (35-2014): 37210 · $17.75 · $18.41. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "U.S. BLS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.bls.gov/oes/current/oes_33100.htm",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      },
      {
        "url": "https://www.bls.gov/oes/special-requests/oesm25ma.zip",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-miami-2-build-talent",
    "marketSlug": "miami",
    "kind": "talent",
    "title": "Miami talent: 2. Build talent (summary — detail in miami-build.md)",
    "body": "Miami — 2. Build talent (summary — detail in miami-build.md). Miami–Ft Laud–WPB construction: 160,200 → 159,700 (−0.3%) · Aug 2025 → Aug 2026 | Miami–Miami Beach–Kendall div.: −1% · same | Fort Lauderdale div.: +1% · same | West Palm Beach div.: −2% · same | Grand Hyatt Miami Beach GC: Balfour Beatty; architect Arquitectonica (Bernardo Fort-Brescia) · 2026-07-27. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "AGC of America · Miami Beach Convention Center (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.agc.org/sites/default/files/users/user21902/Metro%20Empl%202026_August_Alpha.pdf",
        "label": "Miami–Ft Laud–WPB construction",
        "secondary": false
      },
      {
        "url": "https://www.miamibeachconvention.com/center-info/press/grand-hyatt-miami-beach-topping-off",
        "label": "Grand Hyatt Miami Beach GC",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-miami-3-operator-bench",
    "marketSlug": "miami",
    "kind": "talent",
    "title": "Miami talent: 3. Operator bench",
    "body": "Miami — 3. Operator bench (D11). Davidson Hospitality Group (incl. Pivot): M · Cadillac Hotel & Beach Club, Autograph (357) selected by Hersha, phased reno late 2026–27; also Eden Roc Miami Beach, Nobu Hotel Miami Beach, Royal Palm South Beach, Singer Oceanfront (Curio), Le Méridien Dania Beach, Margaritaville Hollywood Beach, The Sunny Sunny Isles (Curio) debuting later 2026 | Evolution Hospitality (Aimbridge): M · Balfour Miami Beach (82, Registry Collection); asset manager FullG CRE | Club Quarters (Stamford CT): M · Sherry Frontenac Hotel (269 rooms, Miami Beach) — third-party management, branding unchanged; Club Quarters' first Miami-market hotel · John Paul Nichols, President & CEO. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Morningstar DBRS · aimbridgehospitality.com · Hotel Online (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.morningstar.com/news/pr-newswire/20260505la48357/davidson-hospitality-group-tapped-to-manage-cadillac-hotel-beach-club-autograph-collection",
        "label": "Davidson Hospitality Group (incl. Pivot)",
        "secondary": false
      },
      {
        "url": "https://www.aimbridgehospitality.com/news/evolution-hospitality-selected-to-manage-balfour-miami-beach/",
        "label": "Evolution Hospitality (Aimbridge)",
        "secondary": false
      },
      {
        "url": "https://www.hotel-online.com/news/club-quarters-expands-third-party-management-portfolio-with-addition-of-sherry-frontenac-hotel",
        "label": "Club Quarters (Stamford CT)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-miami-3-2-pre-open-risk-named-openings",
    "marketSlug": "miami",
    "kind": "talent",
    "title": "Miami talent: 3.2 Pre-open risk — named openings",
    "body": "Miami — 3.2 Pre-open risk — named openings. Grand Hyatt Miami Beach (MBCC HQ, 1701 Convention Center Dr): 800 (50–52 suites) · Late 2027 per MBCC release (2026-07-27); Nov 2027 per GMCVB listing · Hyatt brand; developers Terra + Turnberry; management agreement holder, GM and pre-open team: no public read · No public read (no job count published) · High — 800 keys + 110,000 sf meeting space + skybridge group ops; ~13 mo to open with no named GM; Miami Beach line labor shared with Fontainebleau/Eden Roc/Cadillac (Cadillac under reno same window); MBCC F&B newly unionized next door | The Sunny Miami Sunny Isles Beach (Curio): no public read · later 2026 · Davidson · no public read · Medium. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "2 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1t-miami-5-gaps",
    "marketSlug": "miami",
    "kind": "talent",
    "title": "Miami talent: 5. Gaps (no public read)",
    "body": "Miami — 5. Gaps (no public read). Grand Hyatt MB: manager of record, GM, pre-open team, hiring count: No public read | Fontainebleau / Loews / Diplomat current contract terms: No public read | Miami Beach / Miami-Dade living-wage applicability to hotels: Not checked | Brickell / downtown pipeline + operators: No public read (no pipeline review yet). Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1s-miami-snapshot",
    "marketSlug": "miami",
    "kind": "supply",
    "title": "Miami supply: Snapshot",
    "body": "Miami — Snapshot. Miami-Dade inventory: 575 hotels / 64,719 rooms · Jan 2026 | Implied rooms (C&W STR market): ~65,162 · Q2 2026 | Under construction: 3,575 rooms (~5.5% of inventory, MFR calc) · Jul 1 2026 | Final planning: 4,334 rooms; total 7,909 / 36 projects (~12.2%) · Jul 1 2026 | Openings by year: 2026: 1,135 · 2027: 1,789 · 2028: 2,511 · 2029: 2,300 · 2030: 174 · Jul 1 2026 | Trend: +2,075 rooms in the construction pipeline YoY while U.S. construction fell 15 straight months (CoStar) · May 27 2026. Decision support.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "miamifinancereview.com · Cushman & Wakefield · Greater Miami CVB · miamitodaynews.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://miamifinancereview.com/miami-hotel-market-2026/",
        "label": "Miami-Dade inventory",
        "secondary": false
      },
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "Implied rooms (C&W STR market)",
        "secondary": false
      },
      {
        "url": "https://www.miamiandbeaches.com/getmedia/d76f30f6-3519-40b8-8fe8-48269a9cb73d/2026_Jan_5_pipeline.pdf",
        "label": "Under construction",
        "secondary": false
      },
      {
        "url": "https://www.miamitodaynews.com/2026/05/27/more-rooms-in-miami-pipeline-as-nation-cuts-back-hotel-construction/",
        "label": "Trend",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-miami-submarket-basemap",
    "marketSlug": "miami",
    "kind": "supply",
    "title": "Miami supply: Submarket basemap (GMCVB Jul 1 2026)",
    "body": "Miami — Submarket basemap (GMCVB Jul 1 2026). Downtown Miami: 1,772 · 1,986 · 3,758 | Miami Beach: 1,102 · 1,232 · 2,334 | Miami Airport: 886 · 133 · 1,019 | Downtown South: 277 · 277 | North Dade & Doral: 175 · 126 · 301 | South Dade: 122 · 98 · 220. Decision support.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Greater Miami CVB (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.miamiandbeaches.com/getmedia/d76f30f6-3519-40b8-8fe8-48269a9cb73d/2026_Jan_5_pipeline.pdf",
        "label": "Downtown Miami",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-miami-latest-pulse",
    "marketSlug": "miami",
    "kind": "supply",
    "title": "Miami supply: Latest pulse",
    "body": "Miami — Latest pulse (D2). C&W Q2 2026: OCC 71.4% (−3.8%), ADR $251 (+15.2%), RevPAR $180 (+10.8%) | CoStar wk ending Jun 27: Top-25 leader: ADR +51.1% to $267.87, RevPAR +51.6% (3 World Cup matches) | CoStar wk ending Aug 8: Steepest Top-25 declines: OCC −7.2% to 65.8%, RevPAR −8.5% to $107.60 | CoStar wk ending Sep 26: Highest ADR rise, +19.8% to $177.65 | Aug 2026 Miami-Dade: OCC 63.6% (−7.6%) | HVS WC window: OCC −4.6 pt; RevPAR +18.9%. Decision support.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Cushman & Wakefield · CoStar · Miami Business · HVS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "C&W Q2 2026",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-27-june",
        "label": "CoStar wk ending Jun 27",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-8-august",
        "label": "CoStar wk ending Aug 8",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-26-september",
        "label": "CoStar wk ending Sep 26",
        "secondary": false
      },
      {
        "url": "https://miamibusiness.com/miami-hospitality-industry-report-august-2026/",
        "label": "Aug 2026 Miami-Dade",
        "secondary": false
      },
      {
        "url": "https://www.hvs.com/article/10529-how-the-2026-fifa-world-cup-changed-us-hotel-markets",
        "label": "HVS WC window",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-miami-supply-pressure-score",
    "marketSlug": "miami",
    "kind": "supply",
    "title": "Miami supply-pressure score 4/5",
    "body": "Miami — Supply-pressure score: 4 / 5. UC intensity: ~5.5% of inventory, close to Phoenix (5.7%) | Starts vs history: Rising against the national trend (+2,075 YoY) | Openings: 2027 is the peak UC delivery year (1,789), including the Grand Hyatt's 800 | Submarket concentration: Downtown + Beach = 90% of UC. Score 4/5 (1–2 tailwind; 3 mixed, underwrite by submarket; 4–5 no ground-up without hard barriers). Mobility read: 3,575 rooms UC (~5.5% of stock); 90% in Downtown + Beach; Grand Hyatt 800 keys Nov 2027; Aug OCC −7.6%. Decision support.",
    "magnitude": "score 4/5",
    "asOf": "2026-10-11",
    "sourceLabel": "miamifinancereview.com · miamitodaynews.com · Greater Miami CVB · Miami Beach Convention Center (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://miamifinancereview.com/miami-hotel-market-2026/",
        "label": "UC intensity",
        "secondary": false
      },
      {
        "url": "https://www.miamitodaynews.com/2026/05/27/more-rooms-in-miami-pipeline-as-nation-cuts-back-hotel-construction/",
        "label": "Starts vs history",
        "secondary": false
      },
      {
        "url": "https://www.miamiandbeaches.com/getmedia/d76f30f6-3519-40b8-8fe8-48269a9cb73d/2026_Jan_5_pipeline.pdf",
        "label": "Openings — miamiandbeaches.com",
        "secondary": false
      },
      {
        "url": "https://www.miamibeachconvention.com/center-info/press/grand-hyatt-miami-beach-topping-off",
        "label": "Openings — miamibeachconvention.com",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-miami-stage-rollup",
    "marketSlug": "miami",
    "kind": "pipeline",
    "title": "Miami pipeline: Stage rollup",
    "body": "Miami — Stage rollup. Under construction: 3,575 | Final planning: 4,334 | Total (36 projects): 7,909. Decision support.",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Greater Miami CVB (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.miamiandbeaches.com/getmedia/d76f30f6-3519-40b8-8fe8-48269a9cb73d/2026_Jan_5_pipeline.pdf",
        "label": "Under construction",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-miami-named-projects-under-construction",
    "marketSlug": "miami",
    "kind": "pipeline",
    "title": "Miami pipeline: Named projects — under construction",
    "body": "Miami — Named projects — under construction. E11EVEN Hotel & Residences: 449 · Upscale · Downtown | Hilton Miami Bayfront: 372 · Upper upscale · Downtown | Hilton Miami Beach: 289 · Upper upscale · Miami Beach | HOO Miami Legacy: 219 · Upper upscale · Downtown | Waldorf Astoria Miami: 205 · Luxury · Downtown | Anantara Miami Resort & Residences: 174 · Luxury · Edgewater | Treehouse Brickell: 174 · Upper midscale · Brickell | Dream Hotels Miami at Riverside Wharf: 167 · Upper upscale · Downtown | Holiday Inn Express & Suites MIA – 36th St: 133 · Upper midscale · Airport | Hyatt House Doral: 126 · Upscale · Doral | Vida Edgewater Miami Midtown: 121 · Upscale · Edgewater | Baccarat Hotel & Residences: 105 · Luxury · Brickell | Homewood Suites Homestead: 98 · Upscale · South Dade | Collins Court South Beach: 95 · Midscale · Miami Beach | Miami Beach Boutique Hotel: 48 · Upper midscale · Miami Beach. Decision support.",
    "magnitude": "15 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Greater Miami CVB (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.miamiandbeaches.com/getmedia/d76f30f6-3519-40b8-8fe8-48269a9cb73d/2026_Jan_5_pipeline.pdf",
        "label": "E11EVEN Hotel & Residences",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-miami-named-projects-final-planning",
    "marketSlug": "miami",
    "kind": "pipeline",
    "title": "Miami pipeline: Named projects — final planning (largest)",
    "body": "Miami — Named projects — final planning (largest). House of Wellness: 832 · Brickell (Miami Today notes a residential core; may not be a true hotel) | The Westin Miami Airport: 546 · Airport | Watson Harbor Resort (luxury 105 + lifestyle 300): 405 · Watson Island | Unnamed luxury full-service, 1700 Biscayne: 289 · Downtown | The Cloud One Miami Beach: 262 · Miami Beach | Virgin Hotels Miami: 250 · Brickell area (1040 S Miami Ave). Decision support.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Greater Miami CVB (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.miamiandbeaches.com/getmedia/d76f30f6-3519-40b8-8fe8-48269a9cb73d/2026_Jan_5_pipeline.pdf",
        "label": "House of Wellness",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-nashville-1-wage-floor",
    "marketSlug": "nashville",
    "kind": "talent",
    "title": "Nashville talent: 1. Wage floor",
    "body": "Nashville — 1. Wage floor. Tennessee / federal minimum: $7.25/hr (tipped cash $2.13) · current 2026 | Local hotel wage ordinance: None — no public read · 2026-10-11 | UNITE HERE — Nashville hotel contracts / strikes: No public read (Local 23 lists Nashville location; no unit/contract found) · 2026-10-11 | Other 2026 local labor action: Starbucks baristas strike (not hotel) · 2026-08-15. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "U.S. Dept. of Labor · nashvillebanner.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.dol.gov/agencies/whd/minimum-wage/state",
        "label": "Tennessee / federal minimum",
        "secondary": false
      },
      {
        "url": "https://nashvillebanner.com/2026/08/15/starbucks-nashville-strike-workers-pay-expansion-goodlettsville/",
        "label": "Other 2026 local labor action",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-nashville-1-1-bls-oews-hotel-occupations",
    "marketSlug": "nashville",
    "kind": "talent",
    "title": "Nashville talent: 1.1 BLS OEWS — hotel occupations",
    "body": "Nashville — 1.1 BLS OEWS — hotel occupations. Maids & housekeeping cleaners (all industries) (37-2012): 7100 · $16.44 · $16.14 | Hotel, motel & resort desk clerks (43-4081): 2430 · $16.69 · $16.35 | Lodging managers (11-9081): 190 · $29.25 · $37.83 | Cooks, restaurant (all industries) (35-2014): 10420 · $18.35 · $18.77. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "U.S. BLS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.bls.gov/oes/current/oes_34980.htm",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      },
      {
        "url": "https://www.bls.gov/oes/special-requests/oesm25ma.zip",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-nashville-2-build-talent",
    "marketSlug": "nashville",
    "kind": "talent",
    "title": "Nashville talent: 2. Build talent (summary — detail in nashville-build.md)",
    "body": "Nashville — 2. Build talent (summary — detail in nashville-build.md). Nashville MSA construction: 67,400 → 65,600 (−1,800, −3%; rank 350/360) · Aug 2025 → Aug 2026 | Hotel GC example: Crain Construction (Nashville) — Hilton at BNA (292 keys; 2022 release) · 2022-07-25 | SongTeller project manager: AOA (design/production/PM, with Herschend) · 2026-10-06. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "AGC of America · chartwellhospitality.com · dollyparton.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.agc.org/sites/default/files/users/user21902/Metro%20Empl%202026_August_Alpha.pdf",
        "label": "Nashville MSA construction",
        "secondary": false
      },
      {
        "url": "https://www.chartwellhospitality.com/chartwell-hospitality-and-rockbridge-secure-hotel-development-at-nashville-international-airport/",
        "label": "Hotel GC example",
        "secondary": false
      },
      {
        "url": "https://www.dollyparton.com/news/dolly-partons-songteller-hotel-and-dollys-life-of-many-colors-museum-now-open-in-downtown-nashville",
        "label": "SongTeller project manager",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-nashville-3-operator-bench",
    "marketSlug": "nashville",
    "kind": "talent",
    "title": "Nashville talent: 3. Operator bench",
    "body": "Nashville — 3. Operator bench (D11). Marriott (Gaylord Opryland): M · Ryman-owned; Marriott manages; 10-K FY2025: each Gaylord management agreement other than Gaylord Rockies \"has a term expiring in 2047, with three automatic 10-year renewal periods\" (performance-conditioned) — read on the filing 2026-10-11 | Chartwell Hospitality (Franklin TN): Dev + M · Developer/manager, Hilton at BNA (292 keys, ~150 FT jobs) · Rob Schaedle (CEO), Will Schaedle (EVP) — as of 2022 release | Herschend (with Dolly Parton): Owner-operator · SongTeller Hotel (240) — open (Oct 2026) · Shannon Foster, GM | Pivot (Davidson Hospitality Group): M · Hutton Hotel, Tribute Portfolio (246 rooms) — selected by Georgetown Company-led JV. (Earlier \"Sage manages Hutton\" claim was wrong — corrected.) · Nick Gregory, EVP Ops, Pivot; Michael Fishbin (Georgetown, owner side) | Pendry (Montage International): M · Pendry Nashville, 180 keys, Gulch — \"Debuting in 2028\" · GM no public read | Peachtree / Hotel Equities / Noble: M · Southeast select-service benches (see §8.5 Atlanta) — Nashville-specific assets: no public read this pass. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "SEC EDGAR · chartwellhospitality.com · dollyparton.com · Hotel Management (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sec.gov/Archives/edgar/data/1040829/000110465926019035/rhp-20251231x10k.htm",
        "label": "Marriott (Gaylord Opryland)",
        "secondary": false
      },
      {
        "url": "https://www.chartwellhospitality.com/chartwell-hospitality-and-rockbridge-secure-hotel-development-at-nashville-international-airport/",
        "label": "Chartwell Hospitality (Franklin TN)",
        "secondary": false
      },
      {
        "url": "https://www.dollyparton.com/news/dolly-partons-songteller-hotel-and-dollys-life-of-many-colors-museum-now-open-in-downtown-nashville",
        "label": "Herschend (with Dolly Parton)",
        "secondary": false
      },
      {
        "url": "https://www.hotelmanagement.net/property-management/pivot-manage-nashville-tribute-portfolio-hotel",
        "label": "Pivot (Davidson Hospitality Group)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-nashville-3-2-pre-open-risk-named-openings",
    "marketSlug": "nashville",
    "kind": "talent",
    "title": "Nashville talent: 3.2 Pre-open risk — named openings",
    "body": "Nashville — 3.2 Pre-open risk — named openings. Pendry Nashville: 180 · 2028 per pendry.com (earlier pipeline read: spring 2027) · Pendry/Montage; GM no public read · Schedule slip → flag for pipeline update | Moxy Capitol / Nashville Bonvoy-branded 144: 185 / 144 · 2027 · No public read of operator · Medium. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "2 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1t-nashville-5-gaps",
    "marketSlug": "nashville",
    "kind": "talent",
    "title": "Nashville talent: 5. Gaps (no public read)",
    "body": "Nashville — 5. Gaps (no public read). Any Nashville hotel union unit: No public read | Pendry / Moxy / EDITION leadership: No public read | Nashville-based third-party firms beyond Chartwell (current 2026 rosters): No public read | Hutton manager: Resolved: Pivot (Sep 17 2026). Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1s-nashville-snapshot",
    "marketSlug": "nashville",
    "kind": "supply",
    "title": "Nashville supply: Snapshot",
    "body": "Nashville — Snapshot. Metro Nashville (Davidson) rooms: 42,241 (supply +3.4% YoY) · Dec 2025 | Greater Nashville rooms: 61,179 (Top-25 U.S. market) · Dec 2025 (source: Same) | Downtown core rooms: 14,295 (+1,300 scheduled) per NCVC; 14,129 per Nashville Downtown Partnership · Dec 2025 / Q2 2026 | Pipeline \"in development\": 13,316 rooms · Dec 2025 | 2025 county OCC / ADR: 67.0% / $199.20 (ADR −1.3%); demand +2.6% (record); RevPAR −2.1% · YE 2025 | NCVC 2026 forecast: OCC −1.3% as supply grows another 2.6% · Dec 2025. Decision support.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Metro Nashville · ctycms.com · roadgenius.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.nashville.gov/sites/default/files/2026-02/Tourism-and-Convention-Commission-Minutes-120225.pdf",
        "label": "Metro Nashville (Davidson) rooms",
        "secondary": false
      },
      {
        "url": "https://ctycms.com/tn-nashville/docs/2026-market-conditions-report-q2-1.pdf",
        "label": "Downtown core rooms",
        "secondary": false
      },
      {
        "url": "https://roadgenius.com/statistics/tourism/usa/tennessee/nashville/",
        "label": "2025 county OCC / ADR",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-nashville-latest-pulse",
    "marketSlug": "nashville",
    "kind": "supply",
    "title": "Nashville supply: Latest pulse",
    "body": "Nashville — Latest pulse (D2). County YTD through Sep 12 2026: OCC 69.4% (+3.2%); demand +5% (~3x supply growth); room revenue ~$1.5B (+5.9%) (source: NCVC via RoadGenius (above)) | C&W Q2 2026 (STR/CoStar): OCC 71.7% (−0.2%), ADR $186 (+1.2%), RevPAR $133 (+1.0%); supply +2.4% (top-25 high, tied with Phoenix) | CoStar wk ending 2026-08-08: ADR −4.1% to $158.12 (Top-25 largest drop) | CoStar wk ending 2026-01-31: OCC +24.1% to 71.0%, ADR −13.8% (Winter Storm Fern displaced residents) | Event weekends 2026: Alan Jackson finale 98% downtown / 92% county (78,433 room nights); CMA Fest 89.4% downtown; July 4 74.6% county. Decision support.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "roadgenius.com · Cushman & Wakefield · CoStar · fort-nash.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://roadgenius.com/statistics/tourism/usa/tennessee/nashville/",
        "label": "County YTD through Sep 12 2026",
        "secondary": false
      },
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "C&W Q2 2026 (STR/CoStar)",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-8-august",
        "label": "CoStar wk ending 2026-08-08",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-31-january",
        "label": "CoStar wk ending 2026-01-31",
        "secondary": false
      },
      {
        "url": "https://www.fort-nash.com/post/alan-jackson-s-final-show-outpaced-cma-fest-and-july-fourth-in-downtown-hotel-occupancy",
        "label": "Event weekends 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-nashville-supply-pressure-score",
    "marketSlug": "nashville",
    "kind": "supply",
    "title": "Nashville supply-pressure score 4/5",
    "body": "Nashville — Supply-pressure score: 4 / 5. UC intensity: Not in LE top-5 UC; downtown alone 1,515 UC | Starts vs history: #3 total pipeline 122 / 16,281; #4 starts next 12 mo 49 / 6,623; #5 early planning 53 / 7,023; NPAs 7 / 844 | Openings: 2027e 16 / 1,853 | Supply growth: +3.4% (2025), +2.4% Q2 2026, +2.6% forecast for 2026 | Submarket concentration: Downtown planned rooms are ~55% of current downtown stock | Build-talent friction: No public read (source: TBD). Score 4/5 (1–2 tailwind; 3 mixed, underwrite by submarket; 4–5 no ground-up without hard barriers). Mobility read: Supply +2.4–3.4%/yr; downtown planned ≈55% of current stock; event weekends ≠ base. Decision support.",
    "magnitude": "score 4/5",
    "asOf": "2026-10-11",
    "sourceLabel": "Lodging Econometrics · ctycms.com · Metro Nashville · Cushman & Wakefield (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/",
        "label": "UC intensity — lodgingeconometrics.com",
        "secondary": false
      },
      {
        "url": "https://ctycms.com/tn-nashville/docs/2026-market-conditions-report-q2-1.pdf",
        "label": "UC intensity — ctycms.com",
        "secondary": false
      },
      {
        "url": "https://www.nashville.gov/sites/default/files/2026-02/Tourism-and-Convention-Commission-Minutes-120225.pdf",
        "label": "Supply growth — nashville.gov",
        "secondary": false
      },
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "Supply growth — cushmanwakefield.com",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-nashville-stage-rollup",
    "marketSlug": "nashville",
    "kind": "pipeline",
    "title": "Nashville pipeline: Stage rollup",
    "body": "Nashville — Stage rollup. Total pipeline (LE MSA): 122 · 16,281 | Start next 12 mo: 49 · 6,623 | Early planning: 53 · 7,023 | NPAs Q2 2026: 7 · 844 | Openings 2027e: 16 · 1,853 | Downtown UC (NDP): 1,515 | Downtown planned (NDP): 31 hotels · 7,907. Decision support.",
    "magnitude": "7 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Lodging Econometrics · ctycms.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/",
        "label": "Total pipeline (LE MSA)",
        "secondary": false
      },
      {
        "url": "https://ctycms.com/tn-nashville/docs/2026-market-conditions-report-q2-1.pdf",
        "label": "Downtown UC (NDP)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-nashville-named-projects",
    "marketSlug": "nashville",
    "kind": "pipeline",
    "title": "Nashville pipeline: Named projects",
    "body": "Nashville — Named projects. Tempo by Hilton Nashville Midtown: 161 · Opening Mar 2026 (per NCVC) · Midtown · 2026 | Dolly Parton's SongTeller Hotel: 240 · Opened (announced Oct 6 2026; was listed at 245 by NCVC/NDP) · Downtown · 2026 | Pendry Nashville: 180 · Pipeline; pendry.com says \"Debuting in 2028\" · The Gulch · 2028 (slipped from spring 2027) | Moxy Nashville – Capitol: 185 · Planned · Downtown · 2027 | Nashville Bonvoy (144 rooms + 168 hybrid units): 144 · UC · Downtown · 2027 | InnCahoots: 17 · UC · Downtown · 2027 | Nashville Downtown EDITION: 282 · Planned · The Gulch · 2029 | Sports Illustrated Resorts Nashville: 52 · Listed for 2026 · 2026. Decision support.",
    "magnitude": "8 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Metro Nashville · dollyparton.com · pendry.com · ctycms.com · visitmusiccity.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.nashville.gov/sites/default/files/2026-02/Tourism-and-Convention-Commission-Minutes-120225.pdf",
        "label": "Tempo by Hilton Nashville Midtown",
        "secondary": false
      },
      {
        "url": "https://www.dollyparton.com/news/dolly-partons-songteller-hotel-and-dollys-life-of-many-colors-museum-now-open-in-downtown-nashville",
        "label": "Dolly Parton's SongTeller Hotel",
        "secondary": false
      },
      {
        "url": "https://www.pendry.com/nashville/",
        "label": "Pendry Nashville",
        "secondary": false
      },
      {
        "url": "https://ctycms.com/tn-nashville/docs/2026-market-conditions-report-q2-1.pdf",
        "label": "Moxy Nashville – Capitol",
        "secondary": false
      },
      {
        "url": "https://www.visitmusiccity.com/about/nashville-developments-renovations",
        "label": "Sports Illustrated Resorts Nashville",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-new-york-city-1-wage-floor",
    "marketSlug": "new-york-city",
    "kind": "talent",
    "title": "New York City talent: 1. Wage floor",
    "body": "New York City — 1. Wage floor. HTC IWA (HANYC bargaining group): Jul 1 2026 – Jun 30 2034 (8 yrs); replaces 2012 IWA that expired Jun 30 2026 · MOU eff. 2026-07-01 | IWA economics: +$21.20/hr non-tipped over life (avg >5%/yr per HANYC); free family health; Health Fund contributions up; pension +0.5 pt Jan 1 2027; housing + childcare funds; Juneteenth; paid parental leave; tech/job-security language · 2026-05-22 | Ratification: 6,050 yes / 11 no; ~27,000 workers, 200+ hotels · 2026-05-21 | HANYC position: \"lost 20,000 hotel rooms since COVID… still below pre-pandemic demand\" (Vijay Dandapani) · 2026-05-22 | NYC Hotel Licensing Law (Safe Hotels Act): License required; core employees directly employed (no subcontracting); panic buttons; 24-hr desk; security guard; trafficking training · in force; DCWP warnings 2026-03-26 | DCWP compliance warnings: 760+ licensed hotels · 2026-03-26 | NY State minimum (NYC): $17.00/hr; tipped service $14.15 cash; no increase on Jan 1 2027 (statutory \"off-ramp\" triggered; stays $17.00) · page read 2026-10-11 | IWA classification hourly scale (HK, etc.): No public read in summary pages (MOU PDF has wage section — not parsed this pass) (source: MOU PDF above). Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "8 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "htc-hotel-workers-production.s3.us-east-1.amazonaws.com · hotelworkers.org · Hotel Dive · NYC government · dol.ny.gov (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://htc-hotel-workers-production.s3.us-east-1.amazonaws.com/assets2/Files/2026-IWA-MOU-English.pdf",
        "label": "HTC IWA (HANYC bargaining group) — htc-hotel-workers-production.s3.us-east-1.amazonaws.com",
        "secondary": false
      },
      {
        "url": "https://hotelworkers.org/news/iwa-contract-summary",
        "label": "HTC IWA (HANYC bargaining group) — hotelworkers.org",
        "secondary": false
      },
      {
        "url": "https://www.hoteldive.com/news/nyc-hotel-workers-ratify-historic-wage-contract/820972/",
        "label": "IWA economics",
        "secondary": false
      },
      {
        "url": "https://www.nyc.gov/site/dca/news/29-26/dcwp-touts-nation-leading-hotel-consumer-worker-protections-reaffirms-safety-transparency",
        "label": "NYC Hotel Licensing Law (Safe Hotels Act)",
        "secondary": false
      },
      {
        "url": "https://dol.ny.gov/minimum-wage-0",
        "label": "NY State minimum (NYC) — dol.ny.gov",
        "secondary": false
      },
      {
        "url": "https://nyc-business.nyc.gov/nycbusiness/description/wage-regulations-in-new-york-state",
        "label": "NY State minimum (NYC) — nyc-business.nyc.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-new-york-city-1-1-bls-oews-hotel-occupations",
    "marketSlug": "new-york-city",
    "kind": "talent",
    "title": "New York City talent: 1.1 BLS OEWS — hotel occupations",
    "body": "New York City — 1.1 BLS OEWS — hotel occupations. Maids & housekeeping cleaners (all industries) (37-2012): 40030 · $21.16 · $24.25 | Hotel, motel & resort desk clerks (43-4081): 8470 · $20.91 · $22.84 | Lodging managers (11-9081): 1910 · $45.21 · $47.68 | Cooks, restaurant (all industries) (35-2014): 69250 · $21.03 · $20.77. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "U.S. BLS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.bls.gov/oes/current/oes_35620.htm",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      },
      {
        "url": "https://www.bls.gov/oes/special-requests/oesm25ma.zip",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-new-york-city-2-build-talent",
    "marketSlug": "new-york-city",
    "kind": "talent",
    "title": "New York City talent: 2. Build talent (summary — detail in new-york-city-build.md)",
    "body": "New York City — 2. Build talent (summary — detail in new-york-city-build.md). NY–Newark–Jersey City construction: 390,100 → 383,700 (−6,400, −2%) · Aug 2025 → Aug 2026 | New York City div.: 138,000 → 139,500 (+1%) · same | Jersey City–White Plains div.: −4,300 (−6%) · same | Newark div.: +3% · same. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "AGC of America (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.agc.org/sites/default/files/users/user21902/Metro%20Empl%202026_August_Alpha.pdf",
        "label": "NY–Newark–Jersey City construction",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-new-york-city-3-operator-bench",
    "marketSlug": "new-york-city",
    "kind": "talent",
    "title": "New York City talent: 3. Operator bench",
    "body": "New York City — 3. Operator bench (D11). Highgate (NY HQ): M · Lotte New York Palace (909) — took management Jun 2026 incl. labor relations; also InterContinental NY Times Square, Public Hotel, The Row relaunch · Richard Russo, principal | Crescent Hotels & Resorts: M · NH Collection New York Madison Avenue (288) | Lotte Hotels & Resorts: Owner · Lotte NY Palace (owns land + building); The New Yorker Hotel by Lotte (source: same HM article) | Meyer Jabara: M · Abbey Inn & Spa (NY State, outside MSA core — per Hotel Online headline). Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Hotel Management · crescenthotels.com · Hotel Online (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.hotelmanagement.net/transactions/highgate-manage-lotte-new-york-palace-after-deal-lotte-hotels",
        "label": "Highgate (NY HQ)",
        "secondary": false
      },
      {
        "url": "https://www.crescenthotels.com/newsroom/press/crescent-hotels-resorts-assumes-management-of-nh-collection-new-york-madison-avenue",
        "label": "Crescent Hotels & Resorts",
        "secondary": false
      },
      {
        "url": "https://www.hotel-online.com/news/meyer-jabara-hotels-expands-boutique-portfolio-with-management-of-the-abbey-inn-spa-in-new-york",
        "label": "Meyer Jabara",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-new-york-city-5-gaps",
    "marketSlug": "new-york-city",
    "kind": "talent",
    "title": "New York City talent: 5. Gaps (no public read)",
    "body": "New York City — 5. Gaps (no public read). IWA HK/desk hourly rates by year: MOU PDF not parsed this pass | Non-HANYC independent HTC contracts: No public read | NYC pipeline + pre-open leaders: No public read | Hotel GC roster: No public read. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1s-new-york-city-snapshot",
    "marketSlug": "new-york-city",
    "kind": "supply",
    "title": "New York City supply: Snapshot",
    "body": "New York City — Snapshot. Active rooms (avg monthly): 124,000 (+1.9% YoY); 1,003 hotels · 2025 | Implied rooms (STR market, C&W): ~124,793 · Q2 2026 | 2026 openings: 4,852 rooms (#1 U.S., 2nd straight year) · 2026 projection | Active development pipeline: 24 projects / 5,778 rooms through 2028 (vs 15,777 UC in 2020) · 2026 | LE UC: 29 projects / 5,811 rooms; #1 for new-project announcements · Q2 2026 | 2025 openings: 6 hotels / 992 rooms · 2025 | Shelter rooms: ~16,000 hotel rooms used as emergency shelters; HANYC contract renewal exercised Mar 2026; avg $159/room · May–Jun 2026 | Supply forecast: +0.9% 2026, +0.9% 2027, +0.7% 2028 (Tourism Economics/CoStar) · Jun 2026. Decision support.",
    "magnitude": "8 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "NY State Comptroller · Cushman & Wakefield · CoStar · Lodging Econometrics (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.osc.ny.gov/files/reports/osdc/2026/pdf/nyc-hotel-industry-report-july-2026.pdf",
        "label": "Active rooms (avg monthly)",
        "secondary": false
      },
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "Implied rooms (STR market, C&W)",
        "secondary": false
      },
      {
        "url": "https://www.costar.com/products/benchmark/resources/press-releases/nyc-phoenix-projected-open-most-hotel-rooms-2026",
        "label": "2026 openings",
        "secondary": false
      },
      {
        "url": "https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/",
        "label": "LE UC",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-new-york-city-submarket-basemap",
    "marketSlug": "new-york-city",
    "kind": "supply",
    "title": "New York City supply: Submarket basemap (v0)",
    "body": "New York City — Submarket basemap (v0). Manhattan: 567 → 597 (+5.3%) · Slowest growth; 75% of hotel-tax liability; most union hotels | Queens: 160 → 197 (+23.1%) · Outer-borough build (cheaper sites); shelter-heavy | Brooklyn: 115 → 147 (+27.8%) · Same | Bronx: 31 → 52 (+67.7%) · Fastest growth | Staten Island: 11 → 10 · Only decline. Decision support.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "NY State Comptroller (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.osc.ny.gov/files/reports/osdc/2026/pdf/nyc-hotel-industry-report-july-2026.pdf",
        "label": "Manhattan",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-new-york-city-latest-pulse",
    "marketSlug": "new-york-city",
    "kind": "supply",
    "title": "New York City supply: Latest pulse",
    "body": "New York City — Latest pulse (D2). C&W Q2 2026: OCC 85.6%, ADR $355 (+6.2%), RevPAR $304 (+4.3%) | CoStar wk ending Jun 13: Top-25 leader: ADR +17.1% to $399.15, RevPAR +18.9% to $358.00 | Jul 2026 (CoStar monthly): RevPAR +27.1% to $305.74; Sat Jul 18 ADR $610.48, OCC 95.7% (record for a host market) | Aug 2026 (CoStar monthly): Largest Top-25 ADR drop, −3.3% (source: same note) | HVS WC window: RevPAR +23.5% (+$55.51) | Forecast: RevPAR +4.8% 2026, +0.9% 2027, +3.0% 2028. Decision support.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Cushman & Wakefield · NY State Comptroller · CoStar · HVS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "C&W Q2 2026",
        "secondary": false
      },
      {
        "url": "https://www.osc.ny.gov/files/reports/osdc/2026/pdf/nyc-hotel-industry-report-july-2026.pdf",
        "label": "CoStar wk ending Jun 13 — osc.ny.gov",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-13-june",
        "label": "CoStar wk ending Jun 13 — costar-na-prod.acquia.dshrp.com",
        "secondary": false
      },
      {
        "url": "https://www.costar.com/article/1261496447/world-cup-concludes-with-record-host-market-hotel-rates",
        "label": "Jul 2026 (CoStar monthly)",
        "secondary": false
      },
      {
        "url": "https://www.hvs.com/article/10529-how-the-2026-fifa-world-cup-changed-us-hotel-markets",
        "label": "HVS WC window",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-new-york-city-supply-pressure-score",
    "marketSlug": "new-york-city",
    "kind": "supply",
    "title": "New York City supply-pressure score 3/5",
    "body": "New York City — Supply-pressure score: 3 / 5 (mixed). UC intensity: ~5.8k / 124k ≈ 4.7% through 2028 (supply derivation) | Starts vs history: Down sharply from 15.8k UC in 2020 | Openings: 4,852 in 2026 (#1); supply forecast +0.9% a year | Submarket concentration: Building shifting to the outer boroughs; shelter rooms coming back is a midscale overhang there. Score 3/5 (1–2 tailwind; 3 mixed, underwrite by submarket; 4–5 no ground-up without hard barriers). Mobility read: 4,852 rooms open in 2026 (#1 U.S.); 5,778 rooms in active development through 2028; ~16k shelter rooms could return; Manhattan acts like a 2, outer-borough midscale like a 4. Decision support.",
    "magnitude": "score 3/5",
    "asOf": "2026-10-11",
    "sourceLabel": "NY State Comptroller (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.osc.ny.gov/files/reports/osdc/2026/pdf/nyc-hotel-industry-report-july-2026.pdf",
        "label": "UC intensity",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-new-york-city-stage-rollup",
    "marketSlug": "new-york-city",
    "kind": "pipeline",
    "title": "New York City pipeline: Stage rollup",
    "body": "New York City — Stage rollup. Projected 2026 openings: 4,852 | Active development through 2028: 24 · 5,778 | LE under construction: 29 · 5,811 | 2025 openings: 6 · 992 | 2020 UC (reference): 15,777 | Shelter-held hotel rooms (not pipeline; return risk): ~16,000. Decision support.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "NY State Comptroller · CoStar · Lodging Econometrics (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.osc.ny.gov/files/reports/osdc/2026/pdf/nyc-hotel-industry-report-july-2026.pdf",
        "label": "Projected 2026 openings — osc.ny.gov",
        "secondary": false
      },
      {
        "url": "https://www.costar.com/products/benchmark/resources/press-releases/nyc-phoenix-projected-open-most-hotel-rooms-2026",
        "label": "Projected 2026 openings — costar.com",
        "secondary": false
      },
      {
        "url": "https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/",
        "label": "LE under construction",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-phoenix-1-wage-floor",
    "marketSlug": "phoenix",
    "kind": "talent",
    "title": "Phoenix talent: 1. Wage floor",
    "body": "Phoenix — 1. Wage floor. Arizona minimum wage: $15.15/hr (from $14.70; CPI) · eff. 2026-01-01 | Tipped cash wage: $12.15 (up to a $3.00 tip credit off $15.15; employer must top up if tips fall short and give written notice) · 2026 | Phoenix city / hotel ordinance: None found | UNITE HERE Local 11 – Arizona: ~2,000 members (hotels, airport, catering, ASU, Phoenix Convention Center); union hotels listed above · accessed 2026-10-11 | Sheraton Phoenix Downtown (Marriott): CBAs expired Jun 2023; strikes 2023 and 2-hr strike Apr 9 2024 (Final Four); current contract: no public read · 2024-04-09 | Phoenix Sky Harbor — AA Admirals Club (Compass Eurest): Walkout over first-contract talks (wages, pension, staffing) · Sep 2026 (post on Local 11 AZ page dated ~2026-09-28) | Phoenix Convention Center (Aramark food service, UNITE HERE Local 11): Ratified 2023-03-24: catering service workers up to $20/hr, raises of $4+/hr for all classifications by Feb 2025, union health insurance. Expiry date and current rates: no public read · 2023-03-24. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "7 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "azica.gov · azleg.gov · UNITE HERE Local 11 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.azica.gov/sites/default/files/2025-10/2026%20Minimum%20Wage.pdf",
        "label": "Arizona minimum wage",
        "secondary": false
      },
      {
        "url": "https://azleg.gov/ars/23/00363.htm",
        "label": "Tipped cash wage — azleg.gov",
        "secondary": false
      },
      {
        "url": "https://www.azica.gov/sites/default/files/media/Public%20FREQUENTLY%20ASKED%20QUESTIONS_MasterwTOC_treated.pdf",
        "label": "Tipped cash wage — azica.gov",
        "secondary": false
      },
      {
        "url": "https://www.unitehere11.org/regions-2/arizona/",
        "label": "UNITE HERE Local 11 – Arizona",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-phoenix-1-1-bls-oews-hotel-occupations",
    "marketSlug": "phoenix",
    "kind": "talent",
    "title": "Phoenix talent: 1.1 BLS OEWS — hotel occupations (MSA)",
    "body": "Phoenix — 1.1 BLS OEWS — hotel occupations (MSA). Maids & housekeeping cleaners (all industries) (37-2012): 14250 · $17.38 · $18.18 | Hotel, motel & resort desk clerks (43-4081): 2960 · $17.72 · $17.91 | Lodging managers (11-9081): 360 · $37.50 · $39.46 | Cooks, restaurant (all industries) (35-2014): 21780 · $18.83 · $19.67. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "U.S. BLS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.bls.gov/oes/current/oes_38060.htm",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      },
      {
        "url": "https://www.bls.gov/oes/special-requests/oesm25ma.zip",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-phoenix-2-build-talent",
    "marketSlug": "phoenix",
    "kind": "talent",
    "title": "Phoenix talent: 2. Build talent (summary — detail in phoenix-build.md)",
    "body": "Phoenix — 2. Build talent (summary — detail in phoenix-build.md). MSA construction jobs: 178,800 → 185,600 (+6,800, +4%; rank 5/360 by gain) · Aug 2025 → Aug 2026 | National craft difficulty: 88% as hard/harder; electricians 81% · 2026-09-03. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "2 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "AGC of America (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.agc.org/sites/default/files/users/user21902/Metro%20Empl%202026_August_Alpha.pdf",
        "label": "MSA construction jobs",
        "secondary": false
      },
      {
        "url": "https://www.agc.org/sites/default/files/users/user21902/2026%20Workforce%20Survey%20Analysis%20(4",
        "label": "National craft difficulty",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-phoenix-3-operator-bench",
    "marketSlug": "phoenix",
    "kind": "talent",
    "title": "Phoenix talent: 3. Operator bench",
    "body": "Phoenix — 3. Operator bench (D11). Pyramid Global Hospitality: M (§2.3) · Will operate Wrigley Mansion with Arizona Biltmore after Henderson Park JV unifies ownership; \"retain-the-team\" language · Warren Fields, CEO | Dreamscape Hospitality (Dallas): M · Manages Hotel Solaya (194 keys, ex-Monarch, Old Town Scottsdale) — reopened under JdV by Hyatt | Pacific Hospitality Group (Irvine; Meritage Collection): O/M/D · Denū Hotel & Spa (236 keys, downtown; opening Sep 2026) — first FS independent in Phoenix; also franchisee of AC Phoenix Tempe Downtown, Hyatt Place Phoenix · Garrett Busch, President; Linda Ding, GM Denū | Peachtree Group: M · Portfolio lists HGI North Phoenix Scottsdale; SpringHill Phoenix West/Avondale | Braemar (BHR): Owner · Four Seasons Resort Scottsdale under contract for $372M (disposition) | Accor / Fairmont: brand-managed · Fairmont Phoenix (225 + 34 suites; developer Thunderbird Legacy Development). Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "azbigmedia.com · thehospitalitynewsletter.com · meritagecollection.com · peachtreegroup.com · Hotel Dive · NewHotels (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://azbigmedia.com/business/arizona-biltmore-wrigley-mansion-reunite-under-ownership/",
        "label": "Pyramid Global Hospitality",
        "secondary": false
      },
      {
        "url": "https://www.thehospitalitynewsletter.com/news/hyatt-opens-194-room-hotel-solaya-scottsdale-jdv-collection/",
        "label": "Dreamscape Hospitality (Dallas)",
        "secondary": false
      },
      {
        "url": "https://cms.meritagecollection.com/content/denu/denu-hotel-spa-to-debut-september-2026-as-downtown-phoenixs-first-upscale-urban-retreat",
        "label": "Pacific Hospitality Group (Irvine; Meritage Collection)",
        "secondary": false
      },
      {
        "url": "https://www.peachtreegroup.com/hotel-management",
        "label": "Peachtree Group",
        "secondary": false
      },
      {
        "url": "https://www.hoteldive.com/news/braemar-advances-ashford-spinout-sells-four-seasons-scottsdale/832650/",
        "label": "Braemar (BHR)",
        "secondary": false
      },
      {
        "url": "https://www.newhotels.io/hotels/fairmont-phoenix",
        "label": "Accor / Fairmont",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-phoenix-3-2-pre-open-risk-named-openings",
    "marketSlug": "phoenix",
    "kind": "talent",
    "title": "Phoenix talent: 3.2 Pre-open risk — named openings",
    "body": "Phoenix — 3.2 Pre-open risk — named openings. Hyatt Studios Phoenix (TSMC-oriented): 114 · Q2 2027 · No public read · Low: lean ES model | Hyatt Place @ Arizona Boardwalk: 142 · late 2027 · No public read · Low. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "2 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1t-phoenix-5-gaps",
    "marketSlug": "phoenix",
    "kind": "talent",
    "title": "Phoenix talent: 5. Gaps (no public read)",
    "body": "Phoenix — 5. Gaps (no public read). Sheraton/Westin/Renaissance downtown Local 11 contract status since 2023: No public read | Operator for Fairmont Phoenix leadership (GM/chef): No public read | Four Seasons Scottsdale buyer/operator: No public read | Phoenix hotel trade shortage quantified vs TSMC: No public read. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1s-phoenix-snapshot",
    "marketSlug": "phoenix",
    "kind": "supply",
    "title": "Phoenix supply: Snapshot",
    "body": "Phoenix — Snapshot. Implied rooms (STR market): ~73,137 (Q2 supply room-nights ÷ 91, derived) · Q2 2026 | UC as % of inventory: 4,200 rooms UC = 5.7% of inventory (10-yr high) · YE 2025 | T12 OCC: 66.0% (−3.3 pts); RevPAR −3.0%; transient demand −2.3% · T12 Nov 2025 (source: Same) | Transactions: ~$1B H1 2025 (largest U.S. single market), led by JW Desert Ridge $865M · 2025 (source: Same). Decision support.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Cushman & Wakefield · Cornovus Capital (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "Implied rooms (STR market)",
        "secondary": false
      },
      {
        "url": "https://cornovuscapital.com/southwest-hospitality-market-report-q1-2026/",
        "label": "UC as % of inventory",
        "secondary": true
      }
    ]
  },
  {
    "id": "w1s-phoenix-submarket-basemap",
    "marketSlug": "phoenix",
    "kind": "supply",
    "title": "Phoenix supply: Submarket basemap (v0)",
    "body": "Phoenix — Submarket basemap (v0). Scottsdale / Paradise Valley / N. Scottsdale: Resort and luxury rate holds; flat to slightly positive RevPAR | Tempe: Steady (ASU / corporate) | Black Canyon / North (TSMC): RevPAR declines with new supply; extended-stay targeted near TSMC (Hyatt Studios 114) | Mesa: RevPAR declines with new supply | Southeast / Chandler–Sky Harbor Airport: RevPAR declines with new supply. Decision support.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Cornovus Capital (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://cornovuscapital.com/southwest-hospitality-market-report-q1-2026/",
        "label": "Scottsdale / Paradise Valley / N. Scottsdale",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-phoenix-latest-pulse",
    "marketSlug": "phoenix",
    "kind": "supply",
    "title": "Phoenix supply: Latest pulse",
    "body": "Phoenix — Latest pulse (D2). C&W Q2 2026 (STR/CoStar): OCC 66.2% (+1.2%), ADR $164 (+2.0%), RevPAR $108 (+3.3%); supply +2.4% (tied highest in top 25) | CoStar wk ending 2026-09-26: Only Top-25 market with RevPAR down (−0.5% to $99.09). Decision support.",
    "magnitude": "2 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Cushman & Wakefield · CoStar (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "C&W Q2 2026 (STR/CoStar)",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-26-september",
        "label": "CoStar wk ending 2026-09-26",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-phoenix-supply-pressure-score",
    "marketSlug": "phoenix",
    "kind": "supply",
    "title": "Phoenix supply-pressure score 5/5",
    "body": "Phoenix — Supply-pressure score: 5 / 5. UC intensity: #2 U.S. UC: 31 / 4,621 rooms (most rooms UC of any market except NYC); 5.7% of inventory at YE 2025 | Starts vs history: Pipeline 115 / 16,136 (#5); NPAs 8 / 1,641 (#3); LE Q1 2026 had UC projects +19% YoY | Openings: 2026e #1: 26 / 3,615; 2027e 16 / 1,989 | Submarket concentration: Delivery in Mesa, Black Canyon, Chandler/Airport and downtown full-service. Score 5/5 (1–2 tailwind; 3 mixed, underwrite by submarket; 4–5 no ground-up without hard barriers). Mobility read: #1 2026 openings (3,615), UC 5.7% of inventory, only Top-25 RevPAR decline wk 9/26. Decision support.",
    "magnitude": "score 5/5",
    "asOf": "2026-10-11",
    "sourceLabel": "Lodging Econometrics · Cornovus Capital (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/",
        "label": "UC intensity — lodgingeconometrics.com",
        "secondary": false
      },
      {
        "url": "https://cornovuscapital.com/southwest-hospitality-market-report-q1-2026/",
        "label": "UC intensity — cornovuscapital.com",
        "secondary": false
      },
      {
        "url": "https://lodgingeconometrics.com/dallas-pheonix-top-us-hotel-pipeline-q1-2026/",
        "label": "Starts vs history",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-phoenix-stage-rollup",
    "marketSlug": "phoenix",
    "kind": "pipeline",
    "title": "Phoenix pipeline: Stage rollup (LE Q2 2026 public)",
    "body": "Phoenix — Stage rollup (LE Q2 2026 public). Total pipeline: 115 · 16,136 | Under construction: 31 · 4,621 | NPAs Q2 2026: 8 · 1,641 | Openings 2026e / 2027e: 26 / 16 · 3,615 / 1,989. Decision support.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Lodging Econometrics (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/",
        "label": "Total pipeline",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-phoenix-named-projects",
    "marketSlug": "phoenix",
    "kind": "pipeline",
    "title": "Phoenix pipeline: Named projects",
    "body": "Phoenix — Named projects. Denū Hotel & Spa (Meritage Collection): 236 · Opening Sep 16 2026 · Downtown · 2026 | Fairmont Phoenix (25 stories): 225 rooms + 34 suites · UC · Downtown · Early 2027 | Hyatt Studios Phoenix (TSMC-oriented): 114 · UC · North / TSMC · Q2 2027 | Hyatt Place @ Arizona Boardwalk: 142 · Pipeline · Scottsdale (Talking Stick) · Late 2027 | Scottsdale Golf Retreat @ Troon North: 26 suites · Pipeline · N. Scottsdale · Fall 2026 (source: Same). Decision support.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Arizona Republic · NewHotels · caliberco.com · stayinthenew.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.azcentral.com/story/travel/arizona/2026/07/21/denu-hotel-downtown-phoenix-opening-september/90949505007/",
        "label": "Denū Hotel & Spa (Meritage Collection)",
        "secondary": false
      },
      {
        "url": "https://www.newhotels.io/hotels/fairmont-phoenix",
        "label": "Fairmont Phoenix (25 stories)",
        "secondary": false
      },
      {
        "url": "https://www.caliberco.com/assets/hyatt-studios-tsmc-fundco-llc/",
        "label": "Hyatt Studios Phoenix (TSMC-oriented)",
        "secondary": false
      },
      {
        "url": "https://www.stayinthenew.com/new-hotels-scottsdale",
        "label": "Hyatt Place @ Arizona Boardwalk",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-san-diego-1-wage-floor",
    "marketSlug": "san-diego",
    "kind": "talent",
    "title": "San Diego talent: 1. Wage floor",
    "body": "San Diego — 1. Wage floor. City of San Diego minimum wage: $17.75/hr (tips don't count); next $18.35 on 2027-01-01 · eff. 2026-01-01 | Hospitality Minimum Wage Ordinance (SDMC §§312.0101–312.0112) — hotels ≥150 rooms & amusement parks: $19.00 (7/1/26) → $20.50 (7/1/27) → $22.00 (7/1/28) → $23.50 (7/1/29) → $25.00 (7/1/30); CPI from 2031 · in force 2026-07-01 | — event centers: $21.06 (2026) → $25.00 (2030) · same | — coverage & passage: Council 8-0, Sep 16 2025; ~103 hotels (~27% of 385 city lodging properties); named: Manchester Grand Hyatt, Marriott Marquis, Convention Center, Petco Park, SeaWorld · 2025-09-16; count restated 2026-07-01 | — list of covered hotels: No public read. City does not publish a hotel list: its \"Covered Employers\" link is an employer fact sheet (≥150 rooms; 4 named event centers; amusement parks ≥75 acres) and the FAQ tells workers to contact the Enforcement Office to confirm coverage. The 103 count comes from KPBS (City News Service), 2026-07-01 · 2026-08 (fact sheet) / 2026-06 (FAQ) | Referendum threat (2025): Business groups threatened referendum; ordinance nonetheless took effect Jul 1 2026 · 2025-06-24 → 2026-07-01 | California state minimum (context): $16.90/hr all employers (CPI-indexed, max +3.5%/yr) · eff. 2026-01-01 | UNITE HERE Local 30 — Hilton San Diego Bayfront: 38-day strike ended; 4-yr contract ratified (94%) with wage, pension, health, workload gains; final hourly scale not published; pre-strike HK ~$24/hr; Hilton had offered +$5.50 over 4 yrs · strike Sep–Oct 2024; ratified 2024-10-09 | Local 30 — Hotel del Coronado (Hilton-managed): 2-yr contract expired Oct 31 2024; strike authorized; settlement: no public read · 2024-10 | Open NLRB charge (Local 30 / Hilton Bayfront): case open · 2025. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "10 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "City of San Diego · timesofsandiego.com · KPBS · voiceofsandiego.org · dir.ca.gov · San Diego Union-Tribune · NLRB (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiego.gov/labor-and-wage/minimum-wage/earned-sick-leave",
        "label": "City of San Diego minimum wage — sandiego.gov",
        "secondary": false
      },
      {
        "url": "https://www.sandiego.gov/sites/default/files/2025-12/2025-12-31-city-of-san-diego-hourly-minimum-wage-will-increase-to-17.75-effective-jan-1-2026.pdf",
        "label": "City of San Diego minimum wage — sandiego.gov",
        "secondary": false
      },
      {
        "url": "https://www.sandiego.gov/labor-and-wage/minimum-wage/hospitality",
        "label": "Hospitality Minimum Wage Ordinance (SDMC §§312.0101–312.0112) — hotels",
        "secondary": false
      },
      {
        "url": "https://timesofsandiego.com/politics/2025/09/16/council-oks-minimum-wage-of-25-for-some-hospitality-workers/",
        "label": "— coverage & passage — timesofsandiego.com",
        "secondary": false
      },
      {
        "url": "https://www.kpbs.org/news/economy/2026/07/01/san-diego-hospitality-workers-get-a-raise-thanks-to-new-wage-ordinance",
        "label": "— coverage & passage — kpbs.org",
        "secondary": false
      },
      {
        "url": "https://voiceofsandiego.org/2025/06/24/businesses-threaten-referendum-as-minimum-wage-for-hotels-amusement-parks-and-event-venues-moves-forward/",
        "label": "Referendum threat (2025)",
        "secondary": false
      },
      {
        "url": "https://www.dir.ca.gov/dlse/faq_minimumwage.htm",
        "label": "California state minimum (context)",
        "secondary": false
      },
      {
        "url": "https://timesofsandiego.com/business/2024/10/09/workers-at-hilton-san-diego-bayfront-agree-to-new-contract-ending-38-day-strike/",
        "label": "UNITE HERE Local 30 — Hilton San Diego Bayfront — timesofsandiego.com",
        "secondary": false
      },
      {
        "url": "https://www.kpbs.org/news/economy/2024/10/10/hotel-workers-at-hilton-san-diego-bayfront-approve-contract-ending-strike",
        "label": "UNITE HERE Local 30 — Hilton San Diego Bayfront — kpbs.org",
        "secondary": false
      },
      {
        "url": "https://www.sandiegouniontribune.com/2024/09/04/san-diego-hilton-workers-continue-to-strike-with-no-end-in-sight/",
        "label": "UNITE HERE Local 30 — Hilton San Diego Bayfront — sandiegouniontribune.com",
        "secondary": false
      },
      {
        "url": "https://www.nlrb.gov/case/21-CB-373707",
        "label": "Open NLRB charge (Local 30 / Hilton Bayfront)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-san-diego-1-1-bls-oews-hotel-occupations",
    "marketSlug": "san-diego",
    "kind": "talent",
    "title": "San Diego talent: 1.1 BLS OEWS — hotel occupations (MSA)",
    "body": "San Diego — 1.1 BLS OEWS — hotel occupations (MSA). Maids & housekeeping cleaners (all industries) (37-2012): 10400 · $20.26 · $21.43 | Hotel, motel & resort desk clerks (43-4081): 2980 · $18.75 · $20.38 | Lodging managers (11-9081): 500 · $37.89 · $45.57 | Cooks, restaurant (all industries) (35-2014): 15670 · $22.33 · $22.00. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "U.S. BLS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.bls.gov/oes/current/oes_41740.htm",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      },
      {
        "url": "https://www.bls.gov/oes/special-requests/oesm25ma.zip",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-san-diego-2-build-talent",
    "marketSlug": "san-diego",
    "kind": "talent",
    "title": "San Diego talent: 2. Build talent (summary — detail in san-diego-build.md)",
    "body": "San Diego — 2. Build talent (summary — detail in san-diego-build.md). MSA construction jobs: 89,800 → 86,600 (−3,200, −4%; rank 354/360) · Aug 2025 → Aug 2026 | National craft difficulty: 88% as hard/harder to fill; electricians 81% · AGC/NCCER rel. 2026-09-03 | SD hotel-specific trade shortage: No public read. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "AGC of America (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.agc.org/sites/default/files/users/user21902/Metro%20Empl%202026_August_Alpha.pdf",
        "label": "MSA construction jobs",
        "secondary": false
      },
      {
        "url": "https://www.agc.org/sites/default/files/users/user21902/2026%20Workforce%20Survey%20Analysis%20(4",
        "label": "National craft difficulty",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-san-diego-3-operator-bench",
    "marketSlug": "san-diego",
    "kind": "talent",
    "title": "San Diego talent: 3. Operator bench",
    "body": "San Diego — 3. Operator bench (D11). Evolution Hospitality (Aimbridge; San Clemente, CA): M — lifestyle/independent · Managing Hotel Z → Stellen San Diego Gaslamp (100 keys, Series by Marriott; owner Stoa Lodging) · Michael Murray, VP Operations | Bartell Hotels (San Diego HQ, since 1967): O/M — family owner-operator; branded + independent; 7 restaurants, 3 marinas, Humphreys Concerts by the Bay · \"one of San Diego's largest independent hotel owners and operators\" (company) · Richard Bartell, President & CEO | CH Projects (owner-operator, F&B-led): O · 68-room Little Italy hotel + wellness center in permitting; The Baby Grand, Coronado (31 rooms) opened May 14 2026 (operated by Consortium Holdings/CH Projects; founder Arsalun Tafazoli) — https://coronadotimes.com/news/2026/05/12/the-baby-grand-hotel-aims-to-feel-like-a-place-lost-to-time/ (2026-05-12) · https://www.cbs8.com/article/news/local/baby-grand-opens-in-coronado-after-18m-renovation/509-0671efa7-81ff-407c-84b0-1e1b663dd6ea | Aimbridge / Highgate / Pyramid / Crescent etc.: national · SD property rosters no public read this pass · §2. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Hotel Dive · LinkedIn · bartellhotels.com · coronadotimes.com · cbs8.com · Hotel Online (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.hoteldive.com/news/series-by-marriott-adds-san-diego-boutique-lifestyle-hotel/827993/",
        "label": "Evolution Hospitality (Aimbridge; San Clemente, CA) — hoteldive.com",
        "secondary": false
      },
      {
        "url": "https://www.linkedin.com/posts/aimbridge-hospitality_aimbridge-hotelportfolio-sandiego-activity-7440027034275299328-9W6I",
        "label": "Evolution Hospitality (Aimbridge; San Clemente, CA) — linkedin.com",
        "secondary": false
      },
      {
        "url": "https://www.bartellhotels.com/about-us",
        "label": "Bartell Hotels (San Diego HQ, since 1967)",
        "secondary": false
      },
      {
        "url": "https://coronadotimes.com/news/2026/05/12/the-baby-grand-hotel-aims-to-feel-like-a-place-lost-to-time/",
        "label": "CH Projects (owner-operator, F&B-led) — coronadotimes.com",
        "secondary": false
      },
      {
        "url": "https://www.cbs8.com/article/news/local/baby-grand-opens-in-coronado-after-18m-renovation/509-0671efa7-81ff-407c-84b0-1e1b663dd6ea",
        "label": "CH Projects (owner-operator, F&B-led) — cbs8.com",
        "secondary": false
      },
      {
        "url": "https://www.hotel-online.com/news/new-little-italy-hotel-and-wellness-center-from-well-known-restaurateur-could-break-ground-this-year",
        "label": "CH Projects (owner-operator, F&B-led) — hotel-online.com",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-san-diego-3-2-pre-open-risk-named-openings",
    "marketSlug": "san-diego",
    "kind": "talent",
    "title": "San Diego talent: 3.2 Pre-open risk — named openings",
    "body": "San Diego — 3.2 Pre-open risk — named openings. Le Méridien San Diego Pinnacle / Downtown (501 W A St) — https://www.sandiego.org/members/le-meridien-pinnacle-san-diego/7952 · https://buildsd.org/projects/columbia-a: 231 · Not open — \"Opening January 2027\" per San Diego Tourism Authority member listing (accessed 2026-10-11); BuildSD (2026-07-25) reports slip from Oct 2026 to Jan 2027 — pipeline list still shows Jun 2026 · Operator / GM no public read · Medium: ≥150 rooms in City of SD → HMWO $19 → $25 applies from day one | Tru + Home2 Suites, 5th & Ash: 271 combined · Apr 2026 per forecast; city lists UC Jul 2026 → slip possible · Operator no public read · Medium: HMWO coverage of a dual-brand building as one ≥150-room hotel — no public read (City FAQ https://www.sandiego.gov/sites/default/files/2026-06/hmwo-faqs.pdf, 2026-06, defines a 'lodging facility' and sends borderline cases to its Office of Labor Standards and Enforcement); underwrite as covered | Element Mission Valley: 150 · Feb 2026 (scheduled) · Operator no public read · Covered: HMWO applies at 'at least 150' rooms, and Mission Valley is inside city limits (City FAQ https://www.sandiego.gov/sites/default/files/2026-06/hmwo-faqs.pdf, 2026-06); $19 → $25 by 2030 | Fairfield + SpringHill Suites Airport: 128 / 119 · May 2027 · Operator no public read · Low–med: select-service, <150 each | Element Chula Vista: 156 · Jul 2026 · Operator no public read · Chula Vista — outside City of SD HMWO | Home2 Suites San Diego Downtown: Dec 2026 (Hilton shelf) · No public read · Select; lean model. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "San Diego Tourism Authority · buildsd.org · City of San Diego (accessed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1t-san-diego-5-gaps",
    "marketSlug": "san-diego",
    "kind": "talent",
    "title": "San Diego talent: 5. Gaps (no public read)",
    "body": "San Diego — 5. Gaps (no public read). Local 30 current scale table (Bayfront contract rates by year; exact expiry date): No public read | Hotel del Coronado post-2024 contract outcome: No public read | List of 103 covered hotels: No public read — city publishes no list (fact sheet + FAQ only); 103 count = KPBS 2026-07-01 | 2026 CA state minimum: Resolved: $16.90 (CA DIR) | SD-specific hotel trade shortage / union scale sheets: No public read | Operators for Home2 Downtown, other 2027 openings: No public read. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1s-san-diego-snapshot",
    "marketSlug": "san-diego",
    "kind": "supply",
    "title": "San Diego supply: Snapshot",
    "body": "San Diego — Snapshot. Implied rooms (STR market): ~66,731 (Q2 supply room-nights ÷ 91, derived) · Q2 2026 | Rooms UC (county): 13 hotels / 2,211 rooms, ~2x YoY (2025: 10 / 1,106); #2 in CA behind LA · H1 2026 | Openings H1 2026: 4 hotels / 333 rooms (CA leader) · H1 2026 | Openings history: 0 (2022), 2 / 269 (2023), 1 / 179 (2024) | Gaylord Pacific Resort & Convention Center: ~1,600 rooms; weighed on 2025 occupancy · 1Q 2026. Decision support.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Cushman & Wakefield · us.headtopics.com · Hotel Online · Marcus & Millichap (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "Implied rooms (STR market)",
        "secondary": false
      },
      {
        "url": "https://us.headtopics.com/news/san-diego-hotel-development-doubles-in-a-single-year-85447446",
        "label": "Rooms UC (county)",
        "secondary": true
      },
      {
        "url": "https://www.hotel-online.com/index.php/news/2026-lodging-forecast-san-diego",
        "label": "Openings history",
        "secondary": false
      },
      {
        "url": "https://www.marcusmillichap.com/research/market-report/san-diego/san-diego-2026-investment-forecast-hospitality-market-report",
        "label": "Gaylord Pacific Resort & Convention Center",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-san-diego-latest-pulse",
    "marketSlug": "san-diego",
    "kind": "supply",
    "title": "San Diego supply: Latest pulse",
    "body": "San Diego — Latest pulse (D2). C&W Q2 2026 (STR/CoStar): OCC 77.8%, ADR $228, RevPAR $178 (+6.3%); supply +1.6% | CoStar wk ending Aug 15: Top-25 highest ADR gain (+12.6% to $249.71) and RevPAR gain (+22.8% to $201.10) | CoStar wk ending Jun 27: OCC +13.1% to 91.9% (BIO International Convention) | CoStar wk ending May 16: Steepest ADR (−4.6% to $209.08) and RevPAR (−10.3% to $151.15) declines | CoStar wk ending Mar 7: OCC +12.5% to 73.5%; RevPAR +20.7% to $153.11 | CoStar wk ending Jan 10: ADR −9.5% to $161.76; RevPAR −22.5% to $82.72. Decision support.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Cushman & Wakefield · CoStar (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "C&W Q2 2026 (STR/CoStar)",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-15-august",
        "label": "CoStar wk ending Aug 15",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-27-june",
        "label": "CoStar wk ending Jun 27",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-16-may",
        "label": "CoStar wk ending May 16",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-7-march",
        "label": "CoStar wk ending Mar 7",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-10-january",
        "label": "CoStar wk ending Jan 10",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-san-diego-supply-pressure-score",
    "marketSlug": "san-diego",
    "kind": "supply",
    "title": "San Diego supply-pressure score 3/5",
    "body": "San Diego — Supply-pressure score: 3 / 5 (mixed). UC intensity: 2,211 / ~66.7k ≈ 3.3% of implied inventory (supply derivation) | Starts vs history: UC doubled YoY, compared with near-zero openings 2022–24; statewide planning volume fell | Conversion share: Low; mostly ground-up branded upscale/upper-midscale and extended-stay | Submarket concentration: CBD and South/East each >20% inventory growth projected | Build-talent friction: City HMWO (150+ rooms): $19 (2026) to $25 (2030); plus high construction cost. Score 3/5 (1–2 tailwind; 3 mixed, underwrite by submarket; 4–5 no ground-up without hard barriers). Mobility read: UC doubled to 2,211 rooms (CBD + South Bay focused/ext-stay); Gaylord 1,600 is a campus, coastal barriers hold; HMWO $19→$25 by 2030 for hotels with 150+ rooms. Decision support.",
    "magnitude": "score 3/5",
    "asOf": "2026-10-11",
    "sourceLabel": "us.headtopics.com · Cushman & Wakefield · Hotel Online · City of San Diego (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://us.headtopics.com/news/san-diego-hotel-development-doubles-in-a-single-year-85447446",
        "label": "UC intensity — us.headtopics.com",
        "secondary": false
      },
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "UC intensity — cushmanwakefield.com",
        "secondary": false
      },
      {
        "url": "https://www.hotel-online.com/index.php/news/2026-lodging-forecast-san-diego",
        "label": "Starts vs history",
        "secondary": false
      },
      {
        "url": "https://www.sandiego.gov/labor-and-wage/minimum-wage/hospitality",
        "label": "Build-talent friction",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-san-diego-stage-rollup",
    "marketSlug": "san-diego",
    "kind": "pipeline",
    "title": "San Diego pipeline: Stage rollup",
    "body": "San Diego — Stage rollup. UC (county): 13 · 2,211 | Opened H1 2026: 4 · 333 | Downtown UC (city Civic SD report; hotel rooms): 620 rooms UC; 502 rooms in a second table (approximate, per permits). Decision support.",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "us.headtopics.com · City of San Diego (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://us.headtopics.com/news/san-diego-hotel-development-doubles-in-a-single-year-85447446",
        "label": "UC (county)",
        "secondary": false
      },
      {
        "url": "https://www.sandiego.gov/sites/default/files/2026-06/july-2026_final.pdf",
        "label": "Downtown UC (city Civic SD report; hotel rooms)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-san-diego-named-projects",
    "marketSlug": "san-diego",
    "kind": "pipeline",
    "title": "San Diego pipeline: Named projects",
    "body": "San Diego — Named projects. Gaylord Pacific Resort & Convention Center: ~1,600 · Open · Chula Vista Bayfront · Opened 2025 | Le Méridien San Diego Pinnacle, 501 W A St (Columbia & A tower): 231 · UC; not open. SDTA lists \"Opening January 2027\"; BuildSD (2026-07-25) reports slip from Oct 2026 · CBD · Jan 2027 (was Jun 2026) | Tru + Home2 Suites, 5th & Ash (16 stories; Vanderval): 271 (133 + 130 per Hotel Online) · UC per city report · CBD · Apr 2026 per forecast; city still lists UC Jul 2026, so slip possible | Element Chula Vista: 156 · Scheduled · South · Jul 2026 | Element Mission Valley: 150 · Scheduled · Mission Valley · Feb 2026 | Fairfield by Marriott Airport: 128 · UC · Airport · May 2027 | SpringHill Suites Airport: 119 · UC · Airport · May 2027 | Tempo by Hilton San Diego/Del Mar: 127 · Opened · North County · Oct 2025 | WoodSpring Suites Santee: 122 · Scheduled · East · Dec 2025 | Autograph Collection Carlsbad: 32 · Scheduled · Carlsbad · May 2026. Decision support.",
    "magnitude": "10 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Marcus & Millichap · San Diego Tourism Authority · buildsd.org · City of San Diego · Hotel Online (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.marcusmillichap.com/research/market-report/san-diego/san-diego-2026-investment-forecast-hospitality-market-report",
        "label": "Gaylord Pacific Resort & Convention Center",
        "secondary": false
      },
      {
        "url": "https://www.sandiego.org/members/le-meridien-pinnacle-san-diego/7952",
        "label": "Le Méridien San Diego Pinnacle, 501 W A St (Columbia & A tower) — sandiego.org",
        "secondary": false
      },
      {
        "url": "https://buildsd.org/projects/columbia-a",
        "label": "Le Méridien San Diego Pinnacle, 501 W A St (Columbia & A tower) — buildsd.org",
        "secondary": false
      },
      {
        "url": "https://www.sandiego.gov/sites/default/files/2026-06/july-2026_final.pdf",
        "label": "Tru + Home2 Suites, 5th & Ash (16 stories; Vanderval) — sandiego.gov",
        "secondary": false
      },
      {
        "url": "https://www.hotel-online.com/index.php/news/2026-lodging-forecast-san-diego",
        "label": "Tru + Home2 Suites, 5th & Ash (16 stories; Vanderval) — hotel-online.com",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-san-francisco-bay-1-wage-floor",
    "marketSlug": "san-francisco-bay",
    "kind": "talent",
    "title": "SF Bay Area talent: 1. Wage floor",
    "body": "SF Bay Area — 1. Wage floor. San Francisco minimum wage: $19.61/hr · eff. 2026-07-01 | Oakland hotel minimum (Measure Z, OMC 5.93; hotels ≥50 rooms): $18.85 w/ health benefits · $25.14 without; max 4,000 sf cleaned per 8 hrs; consent for >10 hrs; panic buttons · eff. 2026-01-01 | Oakland general minimum (Measure FF): $17.34/hr — city page: \"Effective January 1, 2026, the Oakland Minimum Wage Rate goes up to $17.34\"; same page confirms Measure Z $18.85 / $25.14 (accessed 2026-10-11) · 2026-01-01 | UNITE HERE Local 2 — SF citywide (Hilton, Hyatt, Marriott): 4-yr term expiring 2028; +$3/hr immediate + raises over term; union health plan preserved; pensions up; new understaffing/workload protections. Strike from Sep 22 2024: 2,500 workers / 27.5% of SF rooms; Hilton (≈900 workers, Union Square + Parc 55) ratified 99.4% after 93 days · 2024-12-24 | Local 2 stated next target: \"other full-service hotels\" to accept same standard (2025 talks) — outcomes no public read · 2024-12-24 | Current Local 2 hourly scale table: No public read. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "mcguirewoods.com · City of San Francisco · oaklandca.gov · unitehere2.org · CBS News (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.mcguirewoods.com/client-resources/alerts/2026/6/san-francisco-hourly-minimum-wage-increases-to-19-61-on-july-1-how-employers-should-prepare/",
        "label": "San Francisco minimum wage — mcguirewoods.com",
        "secondary": false
      },
      {
        "url": "https://www.sf.gov/information--minimum-wage-ordinance",
        "label": "San Francisco minimum wage — sf.gov",
        "secondary": false
      },
      {
        "url": "https://www.oaklandca.gov/Government/Departments/Workplace-Employment-Standards/Oakland-Hotel-Minimum-Wage-and-Working-Conditions",
        "label": "Oakland hotel minimum (Measure Z, OMC 5.93; hotels ≥50 rooms)",
        "secondary": false
      },
      {
        "url": "https://www.oaklandca.gov/Government/Departments/Workplace-Employment-Standards/Download-Minimum-Wage-and-Hotel-Wage-Posters",
        "label": "Oakland general minimum (Measure FF)",
        "secondary": false
      },
      {
        "url": "https://www.unitehere2.org/2024/12/sf-hotel-workers-win-new-contracts-end-strikes/",
        "label": "UNITE HERE Local 2 — SF citywide (Hilton, Hyatt, Marriott) — unitehere2.org",
        "secondary": false
      },
      {
        "url": "https://www.cbsnews.com/sanfrancisco/news/san-francisco-hilton-hotel-workers-approve-new-contract-ending-93-day-strike/",
        "label": "UNITE HERE Local 2 — SF citywide (Hilton, Hyatt, Marriott) — cbsnews.com",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-san-francisco-bay-1-1-bls-oews-hotel-occupations",
    "marketSlug": "san-francisco-bay",
    "kind": "talent",
    "title": "SF Bay Area talent: 1.1 BLS OEWS — hotel occupations",
    "body": "SF Bay Area — 1.1 BLS OEWS — hotel occupations. Maids & housekeeping cleaners (all industries) (37-2012): 12990 · $22.40 · $25.31 | Hotel, motel & resort desk clerks (43-4081): 3390 · $21.48 · $23.64 | Lodging managers (11-9081): 660 · $42.80 · $48.44 | Cooks, restaurant (all industries) (35-2014): 20540 · $22.13 · $23.38. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "U.S. BLS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.bls.gov/oes/current/oes_41860.htm",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      },
      {
        "url": "https://www.bls.gov/oes/special-requests/oesm25ma.zip",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      },
      {
        "url": "https://www.bls.gov/oes/current/oes_41940.htm",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-san-francisco-bay-1-1-bls-oews-hotel-occupations-2",
    "marketSlug": "san-francisco-bay",
    "kind": "talent",
    "title": "SF Bay Area talent: 1.1 BLS OEWS — hotel occupations",
    "body": "SF Bay Area — 1.1 BLS OEWS — hotel occupations. Maids & housekeeping cleaners (all industries) (37-2012): 5620 · $23.17 · $28.05 | Hotel, motel & resort desk clerks (43-4081): 1360 · $21.75 · $22.64 | Lodging managers (11-9081): 190 · $45.42 · $48.05 | Cooks, restaurant (all industries) (35-2014): 8900 · $22.68 · $23.75. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "U.S. BLS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.bls.gov/oes/current/oes_41860.htm",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      },
      {
        "url": "https://www.bls.gov/oes/special-requests/oesm25ma.zip",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      },
      {
        "url": "https://www.bls.gov/oes/current/oes_41940.htm",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-san-francisco-bay-2-build-talent",
    "marketSlug": "san-francisco-bay",
    "kind": "talent",
    "title": "SF Bay Area talent: 2. Build talent (summary — detail in san-francisco-bay-build.md)",
    "body": "SF Bay Area — 2. Build talent (summary — detail in san-francisco-bay-build.md). SF–Oakland–Fremont construction: 119,000 → 116,000 (−3,000, −3%) · Aug 2025 → Aug 2026 | Oakland–Fremont–Berkeley div.: 72,800 → 68,800 (−4,000, −5%; rank 357/360) · same | SF–San Mateo–Redwood City div.: 38,600 → 39,700 (+3%) · same | San Jose–Sunnyvale–Santa Clara: 54,100 → 58,300 (+4,200, +8%) · same. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "AGC of America (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.agc.org/sites/default/files/users/user21902/Metro%20Empl%202026_August_Alpha.pdf",
        "label": "SF–Oakland–Fremont construction",
        "secondary": false
      },
      {
        "url": "https://www.agc.org/news/2026/09/30/only-half-metro-areas-add-construction-jobs-over-past-12-months-data-centers-power-and-factories",
        "label": "Oakland–Fremont–Berkeley div.",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-san-francisco-bay-3-operator-bench",
    "marketSlug": "san-francisco-bay",
    "kind": "talent",
    "title": "SF Bay Area talent: 3. Operator bench",
    "body": "SF Bay Area — 3. Operator bench (D11). Crestline Hotels & Resorts: M · Selected to manage Hotel Spero, Vignette Collection (236 keys, Union Square) · James Carroll, President & CEO (per Crestline releases) | Engage Hospitality (SF): M/AM — Personality Hotels Collection; CA hotels · SF-based | Pacific Hotel Management (San Mateo): M — CA hotels · Bay-based | Hilton (brand-managed): M · Hilton SF Union Square (1,921) + Parc 55 (1,024): receivership since Oct 2023; sale closed Nov 21 2025 to a Newbond Holdings + Conversant Capital partnership, price $408M per the Business Wire close release headline (release page returned an error on direct fetch, so the price is not confirmed on a live page); Hilton continues to manage; management agreements run past 2040 with options to extend for decades (SF Standard 2025-09-02). Exact post-close term/amendments: no public read (buyers' filings not public) | Peachtree Group: M · Portfolio lists Spark by Hilton San Jose Airport; Hyatt Place/House San Jose Airport. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "GlobeNewswire · engagehospitality.com · phmhotels.com · peachtreegroup.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.globenewswire.com/news-release/2026/01/22/3223519/19716/en/Crestline-to-Manage-the-Hotel-Spero-Vignette-Collection-an-IHG-Hotel-at-Union-Square-San-Francisco.html",
        "label": "Crestline Hotels & Resorts",
        "secondary": false
      },
      {
        "url": "https://www.engagehospitality.com/",
        "label": "Engage Hospitality (SF)",
        "secondary": false
      },
      {
        "url": "https://www.phmhotels.com/about-phm-hotels.php",
        "label": "Pacific Hotel Management (San Mateo)",
        "secondary": false
      },
      {
        "url": "https://www.peachtreegroup.com/hotel-management",
        "label": "Peachtree Group",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-san-francisco-bay-5-gaps",
    "marketSlug": "san-francisco-bay",
    "kind": "talent",
    "title": "SF Bay Area talent: 5. Gaps (no public read)",
    "body": "SF Bay Area — 5. Gaps (no public read). Local 2 hourly scale by classification; 2025 non-big-3 FS outcomes: No public read | Hilton management term at Union Square/Parc 55 post-sale: Partly resolved: past 2040 + extension options (SF Standard 2025-09-02); amended post-close terms no public read | SF/Oakland hotel openings 2026–28 + operators: No public read | San Jose hotel wage ordinance (if any): Not checked this pass | Bay hotel GC names / trade scale sheets: No public read. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1s-san-francisco-bay-snapshot",
    "marketSlug": "san-francisco-bay",
    "kind": "supply",
    "title": "SF Bay Area supply: Snapshot",
    "body": "SF Bay Area — Snapshot. Implied rooms (STR SF/San Mateo market): ~54,849 (Q2 supply room-nights ÷ 91, derived) · Q2 2026 | 2026 new rooms (metro): 91 (Hampton by Hilton Redwood City only notable opening); lowest supply growth of major U.S. markets · 2026 forecast | SF city rooms UC: 0 (vs 169 in 2024) · 2025 | Bay Area rooms UC: 15 hotels / 1,610 rooms (2024: 21 / 2,452; rooms −34.3%) · 2025 | SF Travel 2026 forecast: OCC 69%, ADR $257.81, RevPAR $177.85 (+7.9%); 24.2M visitors; $9.9B spend · 2026 forecast | Moscone: 25 events / 399k RN (2024) → 34 / 635k (2025) → 38 / 674k (2026e) · 2026 | OCC gap vs 2019: ~10% below, the widest of major U.S. markets · 1Q 2026. Decision support.",
    "magnitude": "7 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Cushman & Wakefield · The Registry SF · Hotel Online · City of San Francisco · Marcus & Millichap (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "Implied rooms (STR SF/San Mateo market)",
        "secondary": false
      },
      {
        "url": "https://news.theregistrysf.com/san-francisco-hotels-poised-to-lead-nation-in-revenue-growth-as-muted-supply-and-major-events-fuel-recovery/",
        "label": "2026 new rooms (metro)",
        "secondary": false
      },
      {
        "url": "https://www.hotel-online.com/news/hotel-development-plummets-in-bay-area-as-lodging-uncertainties-linger",
        "label": "SF city rooms UC",
        "secondary": false
      },
      {
        "url": "https://www.sf.gov/news-mayor-lurie-celebrates-visitors-coming-back-to-san-francisco-in-record-numbers",
        "label": "SF Travel 2026 forecast",
        "secondary": false
      },
      {
        "url": "https://www.marcusmillichap.com/research/market-report/san-francisco/san-francisco-2026-investment-forecast-hospitality-market-report",
        "label": "OCC gap vs 2019",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-san-francisco-bay-submarket-basemap",
    "marketSlug": "san-francisco-bay",
    "kind": "supply",
    "title": "SF Bay Area supply: Submarket basemap (v0)",
    "body": "SF Bay Area — Submarket basemap (v0). SF Union Square / Moscone / SoMa: Convention-driven recovery; distressed trades (Parc 55 / Hilton Union Square) | San Mateo / SFO / Peninsula: Hampton Redwood City is the only 2026 opening of note | San Jose / Santa Clara (Levi's): Supply +13% since 2016; Super Bowl Sunday OCC 82.6% | Oakland / East Bay: Values \"well below financing costs\" (Reay); airport −15.6% pax. Decision support.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "City of San Francisco · Hotel Online · The Registry SF · newgenadv.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sf.gov/news-mayor-lurie-celebrates-visitors-coming-back-to-san-francisco-in-record-numbers",
        "label": "SF Union Square / Moscone / SoMa — sf.gov",
        "secondary": false
      },
      {
        "url": "https://www.hotel-online.com/news/hotel-development-plummets-in-bay-area-as-lodging-uncertainties-linger",
        "label": "SF Union Square / Moscone / SoMa — hotel-online.com",
        "secondary": false
      },
      {
        "url": "https://news.theregistrysf.com/san-francisco-hotels-poised-to-lead-nation-in-revenue-growth-as-muted-supply-and-major-events-fuel-recovery/",
        "label": "San Mateo / SFO / Peninsula",
        "secondary": false
      },
      {
        "url": "https://newgenadv.com/can-hotels-capitalize-on-event-driven-demand-as-supply-growth-falters/",
        "label": "San Jose / Santa Clara (Levi's)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-san-francisco-bay-latest-pulse",
    "marketSlug": "san-francisco-bay",
    "kind": "supply",
    "title": "SF Bay Area supply: Latest pulse: SF led the Top 25 most of 2026",
    "body": "SF Bay Area — Latest pulse: SF led the Top 25 most of 2026. CoStar Aug 2026 monthly: Led Top 25: OCC +6.6% to 79.3%, ADR +8.7% to $216.77, RevPAR +15.8% to $171.84 | CoStar Jun 2026 monthly (SF/San Mateo): OCC +7.9% to 80.5%; RevPAR +31.2% to $212.87 (the 2027 hard-comp window) | CoStar Mar / Feb 2026 monthly: RevPAR +38.8% to $200.06 / +51.0% to $198.99 | CoStar wk ending Sep 26: Largest RevPAR lift (+35.1% to $223.16) | CoStar wk ending Aug 29: OCC +25.0% to 82.8%, ADR +28.0% to $231.82, RevPAR +59.9% to $191.87 | CoStar wk ending May 2: Steepest drops, ADR −28.2%, RevPAR −31.2% (RSA calendar shift) | CoStar wk ending Feb 7: Super Bowl LX: ADR +108.3% to $409.25, RevPAR +178.1% to $322.07 | C&W Q2 2026 (SF/San Mateo): OCC 76.0%, ADR $236, RevPAR $179 (+13.0%) | HVS WC window: OCC +0.3 pt; RevPAR +13.4%; easy 2025 comp per CoStar. Decision support.",
    "magnitude": "9 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "CoStar · Cushman & Wakefield · Hotel Dive (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.costar.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026",
        "label": "CoStar Aug 2026 monthly",
        "secondary": false
      },
      {
        "url": "https://www.costar.com/products/str-benchmark/resources/press-releases/us-hotel-performance-june-2026",
        "label": "CoStar Jun 2026 monthly (SF/San Mateo)",
        "secondary": false
      },
      {
        "url": "https://www.costar.com/products/str-benchmark/resources/press-releases/us-hotel-performance-march-2026",
        "label": "CoStar Mar / Feb 2026 monthly — costar.com",
        "secondary": false
      },
      {
        "url": "https://www.costar.com/products/str-benchmark/resources/press-releases/us-hotel-performance-february-2026",
        "label": "CoStar Mar / Feb 2026 monthly — costar.com",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-26-september",
        "label": "CoStar wk ending Sep 26",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-29-august",
        "label": "CoStar wk ending Aug 29",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-2-may",
        "label": "CoStar wk ending May 2",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-7-february",
        "label": "CoStar wk ending Feb 7",
        "secondary": false
      },
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "C&W Q2 2026 (SF/San Mateo)",
        "secondary": false
      },
      {
        "url": "https://www.hoteldive.com/news/hotels-world-cup-host-cities-exceed-revpar-forecast/824474/",
        "label": "HVS WC window",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-san-francisco-bay-supply-pressure-score",
    "marketSlug": "san-francisco-bay",
    "kind": "supply",
    "title": "SF Bay Area supply-pressure score 1/5",
    "body": "SF Bay Area — Supply-pressure score: 1 / 5 (strong supply tailwind). UC intensity: SF city 0; metro 2026 adds 91 rooms | Starts vs history: Bay Area rooms UC −34.3% YoY (2025) | Conversion share: No public read | Submarket concentration: Residual building in South Bay / Peninsula, not SF | Build-talent friction: Construction labor shortages and among the highest U.S. operating costs (M&M); ops floors in the talent read. Score 1/5 (1–2 tailwind; 3 mixed, underwrite by submarket; 4–5 no ground-up without hard barriers). Mobility read: SF city 0 rooms UC; metro +91 rooms 2026; trades below replacement; Jun–Jul 2027 hard ADR comp. Decision support.",
    "magnitude": "score 1/5",
    "asOf": "2026-10-11",
    "sourceLabel": "Hotel Online · The Registry SF · newgenadv.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.hotel-online.com/news/hotel-development-plummets-in-bay-area-as-lodging-uncertainties-linger",
        "label": "UC intensity — hotel-online.com",
        "secondary": false
      },
      {
        "url": "https://news.theregistrysf.com/san-francisco-hotels-poised-to-lead-nation-in-revenue-growth-as-muted-supply-and-major-events-fuel-recovery/",
        "label": "UC intensity — news.theregistrysf.com",
        "secondary": false
      },
      {
        "url": "https://newgenadv.com/can-hotels-capitalize-on-event-driven-demand-as-supply-growth-falters/",
        "label": "Submarket concentration",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-san-francisco-bay-stage-rollup",
    "marketSlug": "san-francisco-bay",
    "kind": "pipeline",
    "title": "SF Bay Area pipeline: Stage rollup",
    "body": "SF Bay Area — Stage rollup. Bay Area UC (2025): 15 · 1,610 | Bay Area UC (2024): 21 · 2,452 | SF city UC (2025 / 2024): 0 / — · 0 / 169 | Metro openings 2026e: 91. Decision support.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Hotel Online · The Registry SF (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.hotel-online.com/news/hotel-development-plummets-in-bay-area-as-lodging-uncertainties-linger",
        "label": "Bay Area UC (2025)",
        "secondary": false
      },
      {
        "url": "https://news.theregistrysf.com/san-francisco-hotels-poised-to-lead-nation-in-revenue-growth-as-muted-supply-and-major-events-fuel-recovery/",
        "label": "Metro openings 2026e",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-san-francisco-bay-named-projects",
    "marketSlug": "san-francisco-bay",
    "kind": "pipeline",
    "title": "SF Bay Area pipeline: Named projects",
    "body": "SF Bay Area — Named projects. Hampton by Hilton Redwood City: no public read on key count (metro total 91) · Opening · Peninsula · 2026 | Parc 55 + Hilton SF Union Square (existing; distressed sale): no key count in source · Sold Nov 2025 at ~75% below 2016 value; Hilton-managed past 2040 · Union Square. Decision support.",
    "magnitude": "2 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Hotel Online (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.hotel-online.com/news/hotel-development-plummets-in-bay-area-as-lodging-uncertainties-linger",
        "label": "Parc 55 + Hilton SF Union Square (existing; distressed sale)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-seattle-1-wage-floor",
    "marketSlug": "seattle",
    "kind": "talent",
    "title": "Seattle talent: 1. Wage floor",
    "body": "Seattle — 1. Wage floor. Seattle minimum wage: $21.30/hr (all employer sizes) · eff. 2026-01-01 | SeaTac hospitality & transportation minimum: $20.74/hr (tips/service charges cannot offset) · 2026 | Seattle hotel health-care expenditure ordinance (Improving Access to Medical Care for Hotel Employees): Monthly: $612 single · $1,043 w/ dependents · $1,225 w/ spouse · $1,837 family (via pay, insurance or HRA) · 2026 | Embassy Suites Seattle Pioneer Square (Local 8; Hilton-managed, Steinhauer-owned; 117 workers): Struck Jun 18 2026 (World Cup); ratified 4-yr deal Sep 10, back Sep 15 after 85 days (longest WA hotel strike). HK start $31.03/hr from Jan 1 2027 (+6.9% yr 1, +23.3% over term); year-round healthcare at 1,250 hrs; lower quotas; immigrant-worker recall mechanism · 2026-09-16 | Edgewater Hotel (Local 8): Unanimous ratification; +$9/hr over term; workload protections; pension up · 2025-07-15 | SeaTac hotels (Local 8): Contracts with \"significant wage increases\" after striking twice (2024) — rates not in source · 2024 | Motif / Westin Seattle etc.: No public read of 2025–26 contracts. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "7 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "City of Seattle · lni.wa.gov · Hotel Dive · NW Labor Press · thestand.org (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.seattle.gov/documents/Departments/LaborStandards/2026_OLS_MW_FactSheet_Contrast_ADA.pdf",
        "label": "Seattle minimum wage — seattle.gov",
        "secondary": false
      },
      {
        "url": "https://laborstandards.seattle.gov/2025/09/30/office-of-labor-standards-announces-seattles-2026-minimum-wage/",
        "label": "Seattle minimum wage — laborstandards.seattle.gov",
        "secondary": false
      },
      {
        "url": "https://www.lni.wa.gov/workers-rights/wages/minimum-wage/local-minimum-wage-rates",
        "label": "SeaTac hospitality & transportation minimum",
        "secondary": false
      },
      {
        "url": "https://www.seattle.gov/laborstandards/ordinances/hotel-employee-protections/improving-access-to-medical-care-for-hotel-employees-ordinance",
        "label": "Seattle hotel health-care expenditure ordinance (Improving Access to M — seattle.gov",
        "secondary": false
      },
      {
        "url": "https://www.seattle.gov/documents/Departments/LaborStandards/AHEP_Poster2026_En_contrast_ADA.pdf",
        "label": "Seattle hotel health-care expenditure ordinance (Improving Access to M — seattle.gov",
        "secondary": false
      },
      {
        "url": "https://www.hoteldive.com/news/union-workers-at-seattle-hilton-reach-deal-to-end-85-day-strike/830486/",
        "label": "Embassy Suites Seattle Pioneer Square (Local 8; Hilton-managed, Steinh — hoteldive.com",
        "secondary": false
      },
      {
        "url": "https://nwlaborpress.org/2026/07/seattle-hotel-strike-during-world-cup/",
        "label": "Embassy Suites Seattle Pioneer Square (Local 8; Hilton-managed, Steinh — nwlaborpress.org",
        "secondary": false
      },
      {
        "url": "https://www.thestand.org/2025/07/edgewater-hotel-workers-ratify-contract/",
        "label": "Edgewater Hotel (Local 8)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-seattle-1-1-bls-oews-hotel-occupations",
    "marketSlug": "seattle",
    "kind": "talent",
    "title": "Seattle talent: 1.1 BLS OEWS — hotel occupations (MSA)",
    "body": "Seattle — 1.1 BLS OEWS — hotel occupations (MSA). Maids & housekeeping cleaners (all industries) (37-2012): 9030 · $21.59 · $21.91 | Hotel, motel & resort desk clerks (43-4081): 2470 · $21.40 · $21.91 | Lodging managers (11-9081): 220 · $62.13 · $63.31 | Cooks, restaurant (all industries) (35-2014): 20850 · $22.95 · $23.56. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "U.S. BLS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.bls.gov/oes/current/oes_42660.htm",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      },
      {
        "url": "https://www.bls.gov/oes/special-requests/oesm25ma.zip",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-seattle-2-build-talent",
    "marketSlug": "seattle",
    "kind": "talent",
    "title": "Seattle talent: 2. Build talent (summary — detail in seattle-build.md)",
    "body": "Seattle — 2. Build talent (summary — detail in seattle-build.md). MSA construction: 124,300 → 124,000 (−300, −0.2%) · Aug 2025 → Aug 2026 | Seattle–Bellevue–Kent division: 71,900 → 70,900 (−1%) · same | Tacoma–Lakewood division: 26,100 → 26,900 (+3%) · same | National craft difficulty: 88% as hard/harder; electricians 81% · 2026-09-03. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "AGC of America (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.agc.org/sites/default/files/users/user21902/Metro%20Empl%202026_August_Alpha.pdf",
        "label": "MSA construction",
        "secondary": false
      },
      {
        "url": "https://www.agc.org/sites/default/files/users/user21902/2026%20Workforce%20Survey%20Analysis%20(4",
        "label": "National craft difficulty",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-seattle-3-operator-bench",
    "marketSlug": "seattle",
    "kind": "talent",
    "title": "Seattle talent: 3. Operator bench",
    "body": "Seattle — 3. Operator bench (D11). Columbia Hospitality (Seattle HQ): M — hotels, venues, golf, residential · Took over all lodging + dining at Hotel 1000 (120 keys) eff. Feb 1 2026; joining Unbound Collection by Hyatt; leadership team \"with direct experience working at Hotel 1000\" · John Oppenheimer, Founder & Chairman | Puget Sound Hospitality: M · Manages Element by Westin Seattle Downtown (Lower Queen Anne), opened Jan 29 2026 | Hilton (brand-managed): M · Embassy Suites Pioneer Square (owner Steinhauer) — Local 8 unit (source: Hotel Dive (above)) | Noble House Hotels & Resorts: O/M · Expansion via acquisitions/third-party — Seattle-MSA asset: no public read this pass. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Lodging Magazine · seattlechamber.com · Hotel Dive · NW Labor Press (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://lodgingmagazine.com/columbia-hospitality-adds-seattles-hotel-1000-to-its-portfolio/",
        "label": "Columbia Hospitality (Seattle HQ)",
        "secondary": false
      },
      {
        "url": "https://www.seattlechamber.com/news/2026/01/30/member-news/element-by-westin-seattle-downtown-opening-in-the-heart-of-lower-queen-anne/",
        "label": "Puget Sound Hospitality",
        "secondary": false
      },
      {
        "url": "https://www.hoteldive.com/news/union-workers-at-seattle-hilton-reach-deal-to-end-85-day-strike/830486/",
        "label": "Hilton (brand-managed) — hoteldive.com",
        "secondary": false
      },
      {
        "url": "https://nwlaborpress.org/2026/07/seattle-hotel-strike-during-world-cup/",
        "label": "Hilton (brand-managed) — nwlaborpress.org",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-seattle-3-2-pre-open-risk-named-openings",
    "marketSlug": "seattle",
    "kind": "talent",
    "title": "Seattle talent: 3.2 Pre-open risk — named openings (no pipeline review yet)",
    "body": "Seattle — 3.2 Pre-open risk — named openings (no pipeline review yet). Other 2027 Seattle openings: No public read · pipeline review needed. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "1 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1t-seattle-5-gaps",
    "marketSlug": "seattle",
    "kind": "talent",
    "title": "Seattle talent: 5. Gaps (no public read)",
    "body": "Seattle — 5. Gaps (no public read). Local 8 contracts at other downtown Seattle hotels (Motif, Westin, Sheraton Grand etc.): No public read | SeaTac hotel contract rates (2024): No public read | Seattle 2027 hotel openings + operators: No public read (no pipeline review yet) | Seattle hotel-specific trade shortage: No public read. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1s-seattle-snapshot",
    "marketSlug": "seattle",
    "kind": "supply",
    "title": "Seattle supply: Snapshot",
    "body": "Seattle — Snapshot. Implied rooms (STR market): ~51,345 (Q2 supply room-nights ÷ 91, derived) · Q2 2026 | Rooms UC: 2 projects / 249 rooms ≈ 0.5% of inventory; both 2027; others proposed, none broken ground · mid-2026 | T12 OCC: 68.6% (vs 69.7% a year earlier) · Q2 2026 | T12 composite (secondary): OCC 68–69%, ADR low-to-mid $180s, RevPAR mid-$120s ~flat; cap rates 8.5–9% · T12 Jul 2026 | Last cycle supply wave: +5.2% (2018), +5.7% (2019); Hyatt Regency 1,260 keys (2018) | Canadian border crossings (vehicles into WA): −24% Jan–Oct 2025 YoY · 2025. Decision support.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Cushman & Wakefield · Kidder Mathews · cmrepartners.com · mmcginvest.com · Marcus & Millichap (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "Implied rooms (STR market)",
        "secondary": false
      },
      {
        "url": "https://kidder.com/wp-content/uploads/market_report/hotel-market-research-seattle-2026-2q.pdf",
        "label": "Rooms UC",
        "secondary": false
      },
      {
        "url": "https://cmrepartners.com/blog/seattle-bellevue-hotels-2026/",
        "label": "T12 composite (secondary)",
        "secondary": true
      },
      {
        "url": "https://www.mmcginvest.com/post/seattle-hotel-development-pipeline-outlook",
        "label": "Last cycle supply wave",
        "secondary": false
      },
      {
        "url": "https://www.marcusmillichap.com/research/market-report/seattle/seattle-tacoma-2026-investment-forecast-hospitality-market-report",
        "label": "Canadian border crossings (vehicles into WA)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-seattle-submarket-basemap",
    "marketSlug": "seattle",
    "kind": "supply",
    "title": "Seattle supply: Submarket basemap (v0)",
    "body": "Seattle — Submarket basemap (v0). Downtown / Lumen–Convention: June downtown room nights ~9% above June 2019; group displaced during Cup, then 90.5% first post-Cup week | Eastside / Bellevue: A few hundred rooms opened in the past year; none UC now | South (SeaTac / Lakewood): SpringHill Suites Lakewood 128 (2027); airport full-service traded ~$45k/key in 2026. Decision support.",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "cmrepartners.com · Kidder Mathews (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://cmrepartners.com/blog/seattle-bellevue-hotels-2026/",
        "label": "Downtown / Lumen–Convention",
        "secondary": false
      },
      {
        "url": "https://kidder.com/wp-content/uploads/market_report/hotel-market-research-seattle-2026-2q.pdf",
        "label": "South (SeaTac / Lakewood)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-seattle-latest-pulse",
    "marketSlug": "seattle",
    "kind": "supply",
    "title": "Seattle supply: Latest pulse",
    "body": "Seattle — Latest pulse (D2). C&W Q2 2026 (STR/CoStar): OCC 71.8%, ADR $193, RevPAR $138 (+2.3%); supply +1.4% | CoStar wk ending Jun 20: ADR +30.5% to $271.80 (2 WC matches) | HVS WC window: OCC −6.3 pt (worst of hosts); RevPAR +15.7% | Post-Cup first full week: OCC 90.5% (+3.3 pts); lux/UU group +41.5%. Decision support.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Cushman & Wakefield · CoStar · HVS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "C&W Q2 2026 (STR/CoStar)",
        "secondary": false
      },
      {
        "url": "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-20-june",
        "label": "CoStar wk ending Jun 20",
        "secondary": false
      },
      {
        "url": "https://www.hvs.com/article/10529-how-the-2026-fifa-world-cup-changed-us-hotel-markets",
        "label": "HVS WC window",
        "secondary": false
      },
      {
        "url": "https://www.costar.com/article/1261496447/world-cup-concludes-with-record-host-market-hotel-rates",
        "label": "Post-Cup first full week",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-seattle-supply-pressure-score",
    "marketSlug": "seattle",
    "kind": "supply",
    "title": "Seattle supply-pressure score 1/5",
    "body": "Seattle — Supply-pressure score: 1 / 5 (strong supply tailwind). UC intensity: 0.5% of inventory | Starts vs history: No other groundbreakings; compare 2018–19 at 5%+ per year | Conversion share: Aerolux (121) is an STR-unit building, not a hotel | Submarket concentration: None; deliveries split Downtown / Lakewood | Build-talent friction: Ops labor floor up ($31.03 HK Jan 2027); build-labor no public read. Score 1/5 (1–2 tailwind; 3 mixed, underwrite by submarket; 4–5 no ground-up without hard barriers). Mobility read: 249 rooms UC (~0.5%); demand gap is Canada + corporate; union floor $31.03 Jan 2027. Decision support.",
    "magnitude": "score 1/5",
    "asOf": "2026-10-11",
    "sourceLabel": "Kidder Mathews · mmcginvest.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://kidder.com/wp-content/uploads/market_report/hotel-market-research-seattle-2026-2q.pdf",
        "label": "UC intensity",
        "secondary": false
      },
      {
        "url": "https://www.mmcginvest.com/post/seattle-hotel-development-pipeline-outlook",
        "label": "Starts vs history",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-seattle-stage-rollup",
    "marketSlug": "seattle",
    "kind": "pipeline",
    "title": "Seattle pipeline: Stage rollup",
    "body": "Seattle — Stage rollup. UC (Kidder, mid-2026): 2 · 249 | UC (CMRE composite, secondary): ~100–150 metro-wide | Total pipeline (MMCG, mid-2025, older): several dozen · ~4,500 (UC ~750; final planning ~1,600; proposed ~1,900). Decision support.",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Kidder Mathews · cmrepartners.com · mmcginvest.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://kidder.com/wp-content/uploads/market_report/hotel-market-research-seattle-2026-2q.pdf",
        "label": "UC (Kidder, mid-2026)",
        "secondary": false
      },
      {
        "url": "https://cmrepartners.com/blog/seattle-bellevue-hotels-2026/",
        "label": "UC (CMRE composite, secondary)",
        "secondary": false
      },
      {
        "url": "https://www.mmcginvest.com/post/seattle-hotel-development-pipeline-outlook",
        "label": "Total pipeline (MMCG, mid-2025, older)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-seattle-named-projects",
    "marketSlug": "seattle",
    "kind": "pipeline",
    "title": "Seattle pipeline: Named projects",
    "body": "Seattle — Named projects. SpringHill Suites, 11711 Pacific Hwy: 128 · UC · Lakewood · 2027 | Aerolux, 1200 Stewart St (short-term-rental units): 121 · UC · Downtown / Denny Triangle · 2027. Decision support.",
    "magnitude": "2 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Kidder Mathews (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://kidder.com/wp-content/uploads/market_report/hotel-market-research-seattle-2026-2q.pdf",
        "label": "SpringHill Suites, 11711 Pacific Hwy",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-washington-dc-1-wage-floor",
    "marketSlug": "washington-dc",
    "kind": "talent",
    "title": "Washington DC talent: 1. Wage floor",
    "body": "Washington DC — 1. Wage floor. DC minimum wage (all employers): $18.40/hr (from $17.95); CPI-indexed each Jul 1 · eff. 2026-07-01 | DC tipped base wage: $10.30/hr (56% of min, stepping to 75% cap by 2034) · eff. 2026-07-01 | UNITE HERE Local 25 master contract: 4-yr deal, >25% wage gains, +$7/hr over term (+$1.50 Sep 16 2024, +$1.50 Mar 2025 …); housekeepers projected ~$33/hr by 2028; free health care maintained; pension up. ~4,000 workers, 20+ hotels; ratified >99% · ratified Jun 2024; eff. 2024-09-16 → exp. 2028-09-15 | Local 25 membership: ~6,500 hotel/restaurant workers represented · 2024 (source: Washington Informer (above)) | Recent strikes / settlements: No 2026 DC hotel strike found. 2024 Grand Hyatt boycott call (Local 25) · 2024-08-02 | De-unionization tell: Sofitel Lafayette Square: ~60 F&B/FOH/HK workers decertified Local 25; engineers/painters decertified IUOE Local 99 (NLRB certified Mar 10–11 2026). Source is an anti-union legal foundation — fact of certification only · 2026-03-12 | Open NLRB charges vs Local 25 (DFR): Capital Hilton (filed 2026-07-20), Omni Shoreham (filed 2026-05-31) — individual charges, open · 2026. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "7 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "DC government · code.dccouncil.gov · wjla.com · washingtoninformer.com · dclabor.org · Business Wire · nrtw.org · NLRB (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://does.dc.gov/sites/default/files/dc/sites/does/publication/attachments/2026%20Minimum%20Wage%20Increase%20Notice.pdf",
        "label": "DC minimum wage (all employers)",
        "secondary": false
      },
      {
        "url": "https://oag.dc.gov/worker-rights/wage-and-hour-laws",
        "label": "DC tipped base wage — oag.dc.gov",
        "secondary": false
      },
      {
        "url": "https://code.dccouncil.gov/us/dc/council/code/sections/32-1003",
        "label": "DC tipped base wage — code.dccouncil.gov",
        "secondary": false
      },
      {
        "url": "https://wjla.com/news/local/hotel-workers-dc-union-labor-wages-victory-improved-benefits-contract-unionized-contributions-pensions-september-bargaining-pay-living-thousands-survive-contract-four-years",
        "label": "UNITE HERE Local 25 master contract — wjla.com",
        "secondary": false
      },
      {
        "url": "https://www.washingtoninformer.com/hospitality-workers-secure-new-contract-with-salary-increase-benefits/",
        "label": "UNITE HERE Local 25 master contract — washingtoninformer.com",
        "secondary": false
      },
      {
        "url": "https://www.dclabor.org/news/dc-hotel-workers-ratify-historic-contract",
        "label": "UNITE HERE Local 25 master contract — dclabor.org",
        "secondary": false
      },
      {
        "url": "https://www.businesswire.com/news/home/20240802080927/en/UNITE-HERE-Local-25-Hotel-Workers-Union-Calls-for-Boycott-of-Grand-Hyatt-Washington",
        "label": "Recent strikes / settlements",
        "secondary": false
      },
      {
        "url": "https://www.nrtw.org/news/dc-sofitel-unite-here-iuoe-03122026/",
        "label": "De-unionization tell",
        "secondary": false
      },
      {
        "url": "https://www.nlrb.gov/case/05-CB-391106",
        "label": "Open NLRB charges vs Local 25 (DFR) — nlrb.gov",
        "secondary": false
      },
      {
        "url": "https://www.nlrb.gov/case/05-CB-387965",
        "label": "Open NLRB charges vs Local 25 (DFR) — nlrb.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-washington-dc-1-1-bls-oews-hotel-occupations",
    "marketSlug": "washington-dc",
    "kind": "talent",
    "title": "Washington DC talent: 1.1 BLS OEWS — hotel occupations (MSA)",
    "body": "Washington DC — 1.1 BLS OEWS — hotel occupations (MSA). Maids & housekeeping cleaners (all industries) (37-2012): 15860 · $18.19 · $19.05 | Hotel, motel & resort desk clerks (43-4081): 4530 · $18.12 · $19.41 | Lodging managers (11-9081): 670 · $37.31 · $45.90 | Cooks, restaurant (all industries) (35-2014): 29670 · $20.64 · $20.48. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "U.S. BLS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.bls.gov/oes/current/oes_47900.htm",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      },
      {
        "url": "https://www.bls.gov/oes/special-requests/oesm25ma.zip",
        "label": "Maids & housekeeping cleaners (all industries) (37-2012) — bls.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-washington-dc-2-build-talent",
    "marketSlug": "washington-dc",
    "kind": "talent",
    "title": "Washington DC talent: 2. Build talent (summary — detail in washington-dc-build.md)",
    "body": "Washington DC — 2. Build talent (summary — detail in washington-dc-build.md). MSA construction jobs (mining/logging/construction, NSA): 175,400 → 172,300 (−3,100, −2%) · Aug 2025 → Aug 2026 | Arlington–Alexandria–Reston division: 95,600 → 92,800 (−3%, rank 353/360) · same | Frederick–Gaithersburg–Bethesda division: 32,300 → 31,800 (−2%) · same | National craft difficulty: 88% of firms with craft openings: as hard/harder to fill; electricians hardest (81%) · AGC/NCCER survey Jul–Aug 2026, rel. 2026-09-03 | DC-specific hotel trade shortage: No public read. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "AGC of America (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.agc.org/sites/default/files/users/user21902/Metro%20Empl%202026_August_Alpha.pdf",
        "label": "MSA construction jobs (mining/logging/construction, NSA)",
        "secondary": false
      },
      {
        "url": "https://www.agc.org/sites/default/files/users/user21902/2026%20Workforce%20Survey%20Analysis%20(4",
        "label": "National craft difficulty",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-washington-dc-3-operator-bench",
    "marketSlug": "washington-dc",
    "kind": "talent",
    "title": "Washington DC talent: 3. Operator bench",
    "body": "Washington DC — 3. Operator bench (D11). Donohoe Hospitality Services (DC-HQ; div. of Donohoe, est. 1884): M — FS + premium select; Marriott/Hilton/Hyatt/IHG/Choice approved · Portfolio lists Hotel Nell Union Market, Hyatt Place National Mall, Hyatt House Downtown Convention Center (184 keys, opened Jul 2025), Cambria Navy Yard, Residence Inn National Mall & Dupont, Holiday Inn Capitol; \"seven hotels in the pipeline in DC, MD, VA\" · Thomas Penny, President; Donte Johnson, Area GM (Hyatt House) | Crestline Hotels & Resorts (Fairfax, VA): M — 120 hotels / ~17k rooms, 25 states + DC (company, Nov 2025) · Selected by Georgetown University to manage The Hoya Hotel at Georgetown (146 keys, 13k sf meeting) — its 5th university hotel · James Carroll, President & CEO | HHM Hotels: M · Added Kimpton Banneker (144), Glover Park Hotel Georgetown (154), The Graham Georgetown (57) to managed portfolio · not named in post | Pyramid Global Hospitality: M (see §2.3) · Took management of The Potomac Hotel, Autograph Collection (373 keys; ex-Salamander Washington DC; Henderson Park owner) at Autograph flag-in · Warren Fields, CEO (§2.3). Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "donohoe.com · Hotel Online · Business Wire · GlobeNewswire · hotelmanagement-network.com · LinkedIn · prweb.com · hendersonpark.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.donohoe.com/hospitality/portfolio/",
        "label": "Donohoe Hospitality Services (DC-HQ; div. of Donohoe, est. 1884) — donohoe.com",
        "secondary": false
      },
      {
        "url": "https://www.hotel-online.com/news/frontier-development-hospitality-group-opens-new-hyatt-house-in-downtown-washington-d-c",
        "label": "Donohoe Hospitality Services (DC-HQ; div. of Donohoe, est. 1884) — hotel-online.com",
        "secondary": false
      },
      {
        "url": "https://www.businesswire.com/news/home/20250916046053/en/",
        "label": "Donohoe Hospitality Services (DC-HQ; div. of Donohoe, est. 1884) — businesswire.com",
        "secondary": false
      },
      {
        "url": "https://www.globenewswire.com/news-release/2025/11/18/3189784/19716/en/Crestline-to-Manage-the-Hoya-Hotel-at-Georgetown.html",
        "label": "Crestline Hotels & Resorts (Fairfax, VA) — globenewswire.com",
        "secondary": false
      },
      {
        "url": "https://www.hotelmanagement-network.com/news/the-hoya-hotel-at-georgetown-open-in-august/",
        "label": "Crestline Hotels & Resorts (Fairfax, VA) — hotelmanagement-network.com",
        "secondary": false
      },
      {
        "url": "https://www.linkedin.com/posts/hersha-hospitality_today-marks-an-incredibly-exciting-milestone-activity-7470502628762955778-35bU",
        "label": "HHM Hotels",
        "secondary": false
      },
      {
        "url": "https://www.prweb.com/releases/introducing-the-potomac-hotel-autograph-collection-a-new-chapter-for-washington-dcs-acclaimed-waterfront-destination-302843372.html",
        "label": "Pyramid Global Hospitality — prweb.com",
        "secondary": false
      },
      {
        "url": "https://hendersonpark.com/introducing-the-potomac-hotel-autograph-collection-a-new-chapter-for-washington-d-c-s-acclaimed-waterfront-destination/",
        "label": "Pyramid Global Hospitality — hendersonpark.com",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1t-washington-dc-3-2-pre-open-risk-named-openings",
    "marketSlug": "washington-dc",
    "kind": "talent",
    "title": "Washington DC talent: 3.2 Pre-open risk — named openings",
    "body": "Washington DC — 3.2 Pre-open risk — named openings. The Hoya Hotel at Georgetown: 146 · Opening Aug 2026 · Crestline · Low–med: campus hotel, operator with 4 prior university hotels; opening status post-Aug no public read | WaterWalk by Wyndham Navy Yard: 100 · Late 2026 · No public read · Extended-stay, lean staffing model; operator unnamed | MOB Hotel; Aloft Washington: Mid-2028 · No public read · Too early for named leadership | Redbrick Bridge District hotel (Anacostia): 160 · Construction target 2027 · No public read · Ground-up east of river: in-MSA hiring possible, but GM/DOS unnamed. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1t-washington-dc-5-gaps",
    "marketSlug": "washington-dc",
    "kind": "talent",
    "title": "Washington DC talent: 5. Gaps (no public read)",
    "body": "Washington DC — 5. Gaps (no public read). Local 25 exact current hourly scale table by classification: No public read (only \"+$7 over term\", \"~$33 HK by 2028\") | Which DC hotels are union vs non-union (current list): No public read | Lodging-only (NAICS 721) wage cut for DC MSA: No public read (OEWS MSA is all-industry) | DC hotel-build trade shortage specific to hospitality: No public read | Operators for WaterWalk Navy Yard, MOB, Aloft, Redbrick: No public read | Hoya Hotel actual open date: No public read in this pass. Decision support. Labor underwritten at the new floors with no staff cuts (human touch first).",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1s-washington-dc-snapshot",
    "marketSlug": "washington-dc",
    "kind": "supply",
    "title": "Washington DC supply: Snapshot",
    "body": "Washington DC — Snapshot. Implied rooms (STR market, DC-MD-VA): ~114,265 (Q2 supply room-nights ÷ 91, derived) · Q2 2026 | City pipeline (Destination DC): 25 new or renovated hotels, >3,600 rooms · 2026 | DC pipeline incl. conversions/renos: 98 projects / 12,335 rooms (LE via Hotel Business) · 2026 | STR pipeline (UC + final planning + proposed): >13,000 rooms · mid-2025 | Visitors / spend: ~27M visitors; $11.9B spend (+4%) · 2025 | Convention Center room nights: >470,000 expected · 2026 (source: Hotel Investment Today (above)). Decision support.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Cushman & Wakefield · Destination DC · Hotel Business · Hotel Investment Today · Bisnow (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "Implied rooms (STR market, DC-MD-VA)",
        "secondary": false
      },
      {
        "url": "https://washington.org/press/journalist-newsletter/hotel-happenings",
        "label": "City pipeline (Destination DC)",
        "secondary": false
      },
      {
        "url": "https://hotelbusiness.com/five-gateway-markets-have-234-companies-driving-1200-hotel-projects-worldwide/",
        "label": "DC pipeline incl. conversions/renos",
        "secondary": false
      },
      {
        "url": "https://www.hotelinvestmenttoday.com/Regions/North-America/Robust-March-America250-point-to-DC-recovery",
        "label": "STR pipeline (UC + final planning + proposed)",
        "secondary": false
      },
      {
        "url": "https://www.bisnow.com/news/washington-dc/hotel/hotel-execs-bullish-on-dc-market-but-opt-for-conversions-not-new-builds-134715",
        "label": "Visitors / spend",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-washington-dc-latest-pulse",
    "marketSlug": "washington-dc",
    "kind": "supply",
    "title": "Washington DC supply: Latest pulse",
    "body": "Washington DC — Latest pulse (D2). C&W Q2 2026 (STR/CoStar): OCC 77.2%, ADR $212, RevPAR $164 (+9.0%) | CoStar Jan 2026 monthly: ADR −25.8% to $151.99; RevPAR −31.3% to $76.36 (inauguration comp) | CoStar wk ending Jul 4: ADR +34.8% to $209.40; RevPAR +57.3% to $149.78 (America250) | CoStar wk ending Jul 18: OCC +7.0% to 78.3% | CoStar wk ending Sep 19: OCC +10.7% to 82.3%; RevPAR +23.9% to $194.23. Decision support.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Cushman & Wakefield · CoStar (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf",
        "label": "C&W Q2 2026 (STR/CoStar)",
        "secondary": false
      },
      {
        "url": "https://www.costar.com/products/str-benchmark/resources/press-releases/us-hotel-performance-january-2026",
        "label": "CoStar Jan 2026 monthly",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1s-washington-dc-supply-pressure-score",
    "marketSlug": "washington-dc",
    "kind": "supply",
    "title": "Washington DC supply-pressure score 3/5",
    "body": "Washington DC — Supply-pressure score: 3 / 5 (mixed). UC intensity: Not in LE public top-5 UC | Starts vs history: Ground-up deterred by costs (construction inputs +6.2% Jan–Apr 2026, ABC via Bisnow) | Conversion share: LE reno + conversion 33 / 4,669 (top-5 U.S.); office-to-hotel adds net keys | Openings: Lodging Development: 32 openings / 4,756 rooms across DC Metro in the past 24 months | Submarket concentration: Georgetown and Downtown absorbing 2026 deliveries | Build-talent friction: No public read (source: TBD). Score 3/5 (1–2 tailwind; 3 mixed, underwrite by submarket; 4–5 no ground-up without hard barriers). Mobility read: Conversion-led (office-to-hotel adds net keys); 2026 event-skewed (inauguration comp, America250). Decision support.",
    "magnitude": "score 3/5",
    "asOf": "2026-10-11",
    "sourceLabel": "Lodging Econometrics · Bisnow · Lodging Development · Destination DC (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/",
        "label": "UC intensity",
        "secondary": false
      },
      {
        "url": "https://www.bisnow.com/news/washington-dc/hotel/hotel-execs-bullish-on-dc-market-but-opt-for-conversions-not-new-builds-134715",
        "label": "Starts vs history",
        "secondary": false
      },
      {
        "url": "https://www.lodgingdevelopment.com/hotel-development/dc-metro",
        "label": "Openings",
        "secondary": false
      },
      {
        "url": "https://washington.org/press/journalist-newsletter/hotel-happenings",
        "label": "Submarket concentration",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-washington-dc-stage-rollup",
    "marketSlug": "washington-dc",
    "kind": "pipeline",
    "title": "Washington DC pipeline: Stage rollup",
    "body": "Washington DC — Stage rollup. DC pipeline (new + conversion + reno): 98 · 12,335 | Reno + conversion (LE MSA, Q2 2026): 33 · 4,669 | City pipeline (Destination DC): 25 · >3,600 | DC Metro openings, past 24 mo (DC-MD-VA incl. Richmond region): 32 · 4,756. Decision support.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Hotel Business · Lodging Econometrics · Destination DC · Lodging Development (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://hotelbusiness.com/five-gateway-markets-have-234-companies-driving-1200-hotel-projects-worldwide/",
        "label": "DC pipeline (new + conversion + reno)",
        "secondary": false
      },
      {
        "url": "https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/",
        "label": "Reno + conversion (LE MSA, Q2 2026)",
        "secondary": false
      },
      {
        "url": "https://washington.org/press/journalist-newsletter/hotel-happenings",
        "label": "City pipeline (Destination DC)",
        "secondary": false
      },
      {
        "url": "https://www.lodgingdevelopment.com/hotel-development/dc-metro",
        "label": "DC Metro openings, past 24 mo (DC-MD-VA incl. Richmond region)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1p-washington-dc-named-projects",
    "marketSlug": "washington-dc",
    "kind": "pipeline",
    "title": "Washington DC pipeline: Named projects",
    "body": "Washington DC — Named projects. Tempo by Hilton Washington DC Downtown, 1776 K St NW (office conversion): 278 · Opened Apr 2026 · Downtown · Delivered | citizenM Washington DC Georgetown, 3401 Water St NW (conversion): 230 · Opened Jun 2026 · Georgetown · Delivered | WaterWalk by Wyndham Capitol Hill / Navy Yard: 100 · UC · Navy Yard · Late 2026 | MOB Hotel: Pipeline · Mid-2028 | Aloft Hotel Washington (site TBD in source): Pipeline · Mid-2028 | Redbrick Bridge District hotel: 160 · Proposed · Anacostia / Bridge District · Construction target 2027. Decision support.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Destination DC · Lodging Development · Bisnow (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://washington.org/press/journalist-newsletter/hotel-happenings",
        "label": "Tempo by Hilton Washington DC Downtown, 1776 K St NW (office conversio — washington.org",
        "secondary": false
      },
      {
        "url": "https://www.lodgingdevelopment.com/hotel-development/dc-metro",
        "label": "Tempo by Hilton Washington DC Downtown, 1776 K St NW (office conversio — lodgingdevelopment.com",
        "secondary": false
      },
      {
        "url": "https://www.bisnow.com/news/washington-dc/hotel/hotel-execs-bullish-on-dc-market-but-opt-for-conversions-not-new-builds-134715",
        "label": "Redbrick Bridge District hotel",
        "secondary": false
      }
    ]
  }
];
