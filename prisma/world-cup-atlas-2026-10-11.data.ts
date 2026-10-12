import type { SweepSignal } from "./sweep-2026-10-11.data";

// World Cup 2026 post-Cup read (all 55 markets), Atlas wave-1 supply/pipeline (Houston, Nashville, Phoenix, Washington DC),
// C&W Q2 2026 lines (Dallas, Atlanta), Herald wage floors (Seattle, Philadelphia), national Cup/budget/labor rows,
// and Callbook Tier 1 REIT ownership rows (15 markets). Facts only from the 2026-10-11 source files; fixed ids for upsert.
// Decision support. Human touch first.
export const WORLD_CUP_ATLAS_2026_10_11: SweepSignal[] = [
  {
    "id": "wc2026-miami",
    "marketSlug": "miami",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Miami (host)",
    "body": "World Cup 2026 (Jun 11–Jul 19) — host market. Key numbers (lift vs hype): HVS: OCC −4.6 pt, ADR +$26.30, RevPAR +18.9%, $34.2M incremental. CoStar Jun ADR +23.2% to $218.37. Aug Miami-Dade OCC 63.6% (−7.6% YoY). 2027 Jun–Jul comp: Hard ADR comp. Airlift / international: No market-specific public read; national applies. Underwriting (Ledger): Normalize Jun 11–Jul 19 2026 out of T12; DY roll-off risk Jun–Jul 2027 (Piccard, secondary). Brand / REIT / labor: HST named Miami a lead Cup market; PK Royal Palm had no Cup benefit (third-party transcript, unverified). Ledger: peak ADR +51.1% on flat OCC (secondary).",
    "magnitude": "host",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "HVS https://www.hvs.com/article/10529-how-the-2026-fifa-world-cup-changed-us-hotel-markets 2026-08-06; Miami Business https://miamibusiness.com/miami-hospitality-industry-report-august-2026/; Hectocorn https://hectocorngroup.com/96m-hotel-development-finance-miami-beach/ (secondary); Piccard https://piccardfinancial.com/insights/hotel-bridge-loans-2026"
  },
  {
    "id": "wc2026-new-york-city",
    "marketSlug": "new-york-city",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — New York / NJ (host)",
    "body": "World Cup 2026 (Jun 11–Jul 19) — host market. Key numbers (lift vs hype): HVS match-week: OCC ~flat, ADR +$62.27, RevPAR +$55.51 / +23.5%, $339.2M incremental (largest $). Final added ~$123M (TE). CoStar Jul RevPAR +27.1% to $305.74; Jul 18 ADR $610.48 / OCC 95.7% (host single-day record). Aug ADR −3.3% to $275.07. 2027 Jun–Jul comp: Hard ADR comp. Airlift / international: No market-specific public airlift read; national applies. Underwriting (Ledger): Normalize Jun 11–Jul 19 2026 out of T12; DY roll-off risk Jun–Jul 2027 (Piccard, secondary). Brand / REIT / labor: HST/H/PK named NY as a lead Cup market (third-party transcript, unverified; verify vs webcast). PK 2027 NY group pace double-digit.",
    "magnitude": "host",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "HVS https://www.hvs.com/article/10529-how-the-2026-fifa-world-cup-changed-us-hotel-markets 2026-08-06; CoStar Jul https://www.costar.com/products/str-benchmark/resources/press-releases/us-hotel-performance-july-2026 2026-08-25; CoStar record https://www.costar.com/article/1261496447/world-cup-concludes-with-record-host-market-hotel-rates; CoStar Aug https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026 2026-09-28; TE https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf 2026-09; Piccard https://piccardfinancial.com/insights/hotel-bridge-loans-2026"
  },
  {
    "id": "wc2026-los-angeles",
    "marketSlug": "los-angeles",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Los Angeles (host)",
    "body": "World Cup 2026 (Jun 11–Jul 19) — host market. Key numbers (lift vs hype): HVS: OCC +1.0 pt, RevPAR +$18.64 / +15.5%, $77.2M incremental. No Aug market read. 2027 Jun–Jul comp: Moderate. Airlift / international: No market-specific public read; national applies. Underwriting (Ledger): Normalize Jun 11–Jul 19 2026 out of T12; DY roll-off risk Jun–Jul 2027 (Piccard, secondary). Brand / REIT / labor: PEB: concerts layered on Cup, no lift figure (third-party transcript, unverified). Labor: NYT Westin Bonaventure worker's expected Cup hours never came; SoFi Local 11 deal (stadium, context only).",
    "magnitude": "host",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "HVS https://www.hvs.com/article/10529-how-the-2026-fifa-world-cup-changed-us-hotel-markets 2026-08-06; NYT https://www.nytimes.com/2026/07/10/business/hotel-workers-world-cup.html 2026-07-10; Guardian https://www.theguardian.com/football/2026/jun/09/stadium-hotel-workers-strike-world-cup 2026-06-09; Piccard https://piccardfinancial.com/insights/hotel-bridge-loans-2026"
  },
  {
    "id": "wc2026-san-francisco-bay",
    "marketSlug": "san-francisco-bay",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — SF Bay (host; 2027 comp by window)",
    "body": "World Cup 2026 (Jun 11–Jul 19) — host market. Key numbers (lift vs hype): HVS: OCC +0.3 pt, RevPAR +13.4%, <$25M incremental. CoStar Jun OCC 80.5% (+7.9%), RevPAR +31.2% to $212.87; Aug RevPAR +15.8% to $171.84 (led Top 25). 2027 Jun–Jul comp: By window (Vectra proposal 2026-10-11, Ledger concurs; Atlas sign-off pending): Jun 11–Jul 19 2027 hard ADR comp (Jun RevPAR +31.2%); rest of 2027 easy on soft 2025 base. Airlift / international: No market-specific public read; national applies. Underwriting (Ledger): Normalize Jun 11–Jul 19 2026 out of T12; DY roll-off risk Jun–Jul 2027 (Piccard, secondary). Brand / REIT / labor: PEB/PK: modest match-date rate benefit (third-party transcript, unverified). PK 2027 SF group pace double-digit.",
    "magnitude": "host",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "HVS https://www.hvs.com/article/10529-how-the-2026-fifa-world-cup-changed-us-hotel-markets 2026-08-06; CoStar Jun https://www.costar.com/products/str-benchmark/resources/press-releases/us-hotel-performance-june-2026 2026-07-27; Hotel Dive https://www.hoteldive.com/news/hotels-world-cup-host-cities-exceed-revpar-forecast/824474/; Piccard https://piccardfinancial.com/insights/hotel-bridge-loans-2026"
  },
  {
    "id": "wc2026-seattle",
    "marketSlug": "seattle",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Seattle (host)",
    "body": "World Cup 2026 (Jun 11–Jul 19) — host market. Key numbers (lift vs hype): HVS: OCC −6.3 pt (worst), ADR +$26.56, RevPAR +15.7%, <$25M. Match-period OCC 73.9% (−6.9 pts); first week after 90.5%. Visit Seattle/TE total impact $889M vs $846M Mar forecast; $109M tax. 2027 Jun–Jul comp: Easy OCC/group comp; groups delayed, not lost. Airlift / international: No market-specific public read; national applies. Underwriting (Ledger): Normalize Jun 11–Jul 19 2026 out of T12; DY roll-off risk Jun–Jul 2027 (Piccard, secondary). Brand / REIT / labor: Labor: Embassy Suites Pioneer Square 85-day strike; housekeeper start $31.03/hr from Jan 1 2027 (+23.3% over term). No REIT named Seattle in Cup context.",
    "magnitude": "host",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "HVS https://www.hvs.com/article/10529-how-the-2026-fifa-world-cup-changed-us-hotel-markets 2026-08-06; Visit Seattle https://visitseattle.org/press/press-releases/visit-seattle-economic-impact-fifa-2026/ 2026-09-22; CoStar https://www.costar.com/article/1261496447/world-cup-concludes-with-record-host-market-hotel-rates; Hotel Dive https://www.hoteldive.com/news/union-workers-at-seattle-hilton-reach-deal-to-end-85-day-strike/830486/ 2026-09-16; Piccard https://piccardfinancial.com/insights/hotel-bridge-loans-2026"
  },
  {
    "id": "wc2026-boston",
    "marketSlug": "boston",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Boston (host)",
    "body": "World Cup 2026 (Jun 11–Jul 19) — host market. Key numbers (lift vs hype): HVS (custom market incl. I-95, Providence, Foxborough): OCC −0.5 pt, ADR +$43.76, RevPAR +$32.80 / +22.0%, $69.3M incremental. 2027 Jun–Jul comp: Hard ADR comp. Airlift / international: No market-specific public read; national applies. Underwriting (Ledger): Normalize Jun 11–Jul 19 2026 out of T12; DY roll-off risk Jun–Jul 2027 (Piccard, secondary). Brand / REIT / labor: PK: Hyatt Regency Boston Q2 RevPAR ~+9% incl. Marathon + Cup; PEB >½ of $1.9M Cup group revenue in Boston (third-party transcript, unverified).",
    "magnitude": "host",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "HVS https://www.hvs.com/article/10529-how-the-2026-fifa-world-cup-changed-us-hotel-markets 2026-08-06; PK Q2 release https://www.sec.gov/Archives/edgar/data/1617406/000161740626000038/earningsreleaseex991-live.htm 2026-08-06; Piccard https://piccardfinancial.com/insights/hotel-bridge-loans-2026"
  },
  {
    "id": "wc2026-atlanta",
    "marketSlug": "atlanta",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Atlanta (host)",
    "body": "World Cup 2026 (Jun 11–Jul 19) — host market. Key numbers (lift vs hype): HVS: OCC −2.6 pt, ADR +$8.31, RevPAR +$1.96 / +9.4% (smallest), <$25M. Semifinal week OCC −8.2 pts, RevPAR −6.4%, group −41.4%. FIFA released ~1,000 block rooms. 2027 Jun–Jul comp: Easy group comp if GWCC citywides return. Airlift / international: No market-specific public read; national applies. Underwriting (Ledger): Normalize Jun 11–Jul 19 2026 out of T12; DY roll-off risk Jun–Jul 2027 (Piccard, secondary). Brand / REIT / labor: APLE lists Atlanta above-average Q2 (not Cup-attributed). Supply risk is structural pipeline, not Cup.",
    "magnitude": "host",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "HVS https://www.hvs.com/article/10529-how-the-2026-fifa-world-cup-changed-us-hotel-markets 2026-08-06; CoStar https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities 2026-07; Lighthouse https://www.mylighthouse.com/resources/blog/fifa-room-cancellations-world-cup-2026; Piccard https://piccardfinancial.com/insights/hotel-bridge-loans-2026"
  },
  {
    "id": "wc2026-dallas",
    "marketSlug": "dallas",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Dallas / Arlington / Fort Worth (host)",
    "body": "World Cup 2026 (Jun 11–Jul 19) — host market. Key numbers (lift vs hype): HVS: OCC +0.7 pt, RevPAR +30.1%, $60.8M incremental; 9 matches (most). CBD match-window RevPAR +50.4% (TE). Arlington HOT June $31M (+39%, all-time record), July $25.9M (+11%). APLE Fort Worth/Arlington Q2 RevPAR +16% / ADR +14%. 2027 Jun–Jul comp: Hard comp (Arlington/CBD); 9 matches won't repeat. Airlift / international: No market-specific public airlift read; national applies. Underwriting (Ledger): Normalize Jun 11–Jul 19 2026 out of T12; DY roll-off risk Jun–Jul 2027 (Piccard, secondary). Brand / REIT / labor: RHP: Gaylord Texan Q2 upside from Cup rate compression (third-party transcript, unverified). Supply: Caravan Court 145 keys opened Jun 1 — no Cup oversupply.",
    "magnitude": "host",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "HVS https://www.hvs.com/article/10529-how-the-2026-fifa-world-cup-changed-us-hotel-markets 2026-08-06; Fort Worth Report https://fortworthreport.org/2026/09/30/world-cup-brought-nearly-30-more-sales-tax-to-arlington-though-most-money-was-spent-around-stadium/ 2026-09-30; APLE Q2 release https://www.sec.gov/Archives/edgar/data/1418121/000119312526335144/aple-ex99_1.htm 2026-08-05; Hotel Online https://www.hotel-online.com/news/new-hotel-in-arlington-transforms-historic-caravan-motel-into-upscale-concept; Piccard https://piccardfinancial.com/insights/hotel-bridge-loans-2026"
  },
  {
    "id": "wc2026-houston",
    "marketSlug": "houston",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Houston (host)",
    "body": "World Cup 2026 (Jun 11–Jul 19) — host market. Key numbers (lift vs hype): HVS: OCC −1.8 pt, ADR +$17.1, RevPAR +$7.85 / +22.2% off lowest base (61.2% counterfactual OCC); <$25M incremental. Week ending Jun 20 RevPAR +28.1% to $100.01. 2027 Jun–Jul comp: Moderate. Airlift / international: IAH+HOU ~4.5M pax Jun 12–Jul 6; CBP intl arrivals 439k (+2% YoY); 60 FIFA charters. Underwriting (Ledger): Normalize Jun 11–Jul 19 2026 out of T12; DY roll-off risk Jun–Jul 2027 (Piccard, secondary). Brand / REIT / labor: APLE lists Houston above-average Q2 (not Cup-attributed).",
    "magnitude": "host",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "HVS https://www.hvs.com/article/10529-how-the-2026-fifa-world-cup-changed-us-hotel-markets 2026-08-06; Houston Airports https://www.fly2houston.com/airport-business/newsroom/press-releases/item/houston-airports-delivers-strong-passenger-experience-during-world-cup-travel-period/; CoStar wk Jun 20 https://costar-na-dev.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-20-june; Piccard https://piccardfinancial.com/insights/hotel-bridge-loans-2026"
  },
  {
    "id": "wc2026-philadelphia",
    "marketSlug": "philadelphia",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Philadelphia (host)",
    "body": "World Cup 2026 (Jun 11–Jul 19) — host market. Key numbers (lift vs hype): HVS: OCC −3.5 pt, RevPAR ~$19 / +14.8%, <$25M. Projection $770M gross vs Economy League $30–90M staying local. PHLCVB match-date hotel revenue +50.3%. Post-Cup week Aug 2–8 OCC +14.2%, RevPAR +27.4%. FIFA released ~2,000 block rooms. 2027 Jun–Jul comp: Easy group comp. Airlift / international: PHL intl arrivals +8.3% in June. Underwriting (Ledger): Normalize Jun 11–Jul 19 2026 out of T12; DY roll-off risk Jun–Jul 2027 (Piccard, secondary). Brand / REIT / labor: Labor: Local 274 settled 7 of 8 downtown hotels to $30/hr by 2028 (wage floor, D10).",
    "magnitude": "host",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "HVS https://www.hvs.com/article/10529-how-the-2026-fifa-world-cup-changed-us-hotel-markets 2026-08-06; Inquirer https://www.inquirer.com/business/world-cup-philly-economic-impact-20260806.html 2026-08-06; Lighthouse https://www.mylighthouse.com/resources/blog/fifa-room-cancellations-world-cup-2026; Labor Notes https://www.labornotes.org/2026/07/world-cup-leverage-california-stadium-workers-win-right-strike-over-ice?language=en 2026-07; Piccard https://piccardfinancial.com/insights/hotel-bridge-loans-2026"
  },
  {
    "id": "wc2026-kansas-city",
    "marketSlug": "kansas-city",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Kansas City (host)",
    "body": "World Cup 2026 (Jun 11–Jul 19) — host market. Key numbers (lift vs hype): HVS: OCC −4.6 pt, ADR +$41.14, RevPAR +$20.04 / +43.1% (top %), <$25M incremental. CBD match-window RevPAR +83.0% (TE). STR listings ~+80%, STR OCC ~−20%. APLE KC Q2 RevPAR +17% / ADR +16%. 2027 Jun–Jul comp: Hard comp (rate). Airlift / international: KCI busiest June since new terminal: 1,130,528 pax; charters >3,000 (5x LY). Underwriting (Ledger): Normalize Jun 11–Jul 19 2026 out of T12; DY roll-off risk Jun–Jul 2027 (Piccard, secondary). Brand / REIT / labor: Supply: Hilton Garden Inn Riverside opened pre-Cup (keys n/d); oversupply was STR, not hotel keys.",
    "magnitude": "host",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "HVS https://www.hvs.com/article/10529-how-the-2026-fifa-world-cup-changed-us-hotel-markets 2026-08-06; KC Star https://www.kansascity.com/sports/fifa-world-cup/article316675906.html 2026-07-27; AirDNA via FOX4 https://www.aol.com/articles/world-cup-kc-saw-record-231152000.html; APLE Q2 release https://www.sec.gov/Archives/edgar/data/1418121/000119312526335144/aple-ex99_1.htm 2026-08-05; Piccard https://piccardfinancial.com/insights/hotel-bridge-loans-2026"
  },
  {
    "id": "wc2026-orlando",
    "marketSlug": "orlando",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Orlando (spillover (negative))",
    "body": "World Cup 2026 — spillover (negative) market. Key read: Theme-park destination OCC fell nearly 11% and RevPAR >10% during the tournament; Brightline spillover from Miami didn't show. Aug OCC 62.4% (−5.8%). 2027 comp: Easy comp off a depressed 2026 Jun–Jul base (inference; no per-market read). Underwriting (Ledger): No Cup normalization needed; national rate frame applies.",
    "magnitude": "spillover (negative)",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Skift https://skift.com/2026/07/06/world-cup-ripple-effect-non-host-markets/ 2026-07-06; Deep Arrival https://deeparrival.com/news/orlando-hotels-world-cup-miami-spillover/"
  },
  {
    "id": "wc2026-san-diego",
    "marketSlug": "san-diego",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — San Diego (spillover)",
    "body": "World Cup 2026 — spillover market. Key read: Base camps: Switzerland (Fairmont Grand Del Mar), New Zealand (Hyatt Regency La Jolla); no hotel KPI read. 2027 comp: no market-specific public read; national applies. Underwriting (Ledger): No Cup normalization needed; national rate frame applies.",
    "magnitude": "spillover",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "US Soccer https://ussoccer.com/stories/2026/06/usmnt/where-are-fifa-world-cup-2026-team-base-camp-training-sites; LSU NCBRT map https://ncbrt.lsu.edu/programs/worldcup/wclocations.php?embed=true&type=Basecamp"
  },
  {
    "id": "wc2026-nashville",
    "marketSlug": "nashville",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Nashville (spillover)",
    "body": "World Cup 2026 — spillover market. Key read: Japan base camp; trailing-12 RevPAR −1.2% pre-Cup; no Cup-period KPI read. 2027 comp: no market-specific public read; national applies. Underwriting (Ledger): No Cup normalization needed; national rate frame applies.",
    "magnitude": "spillover",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "ICM Group https://www.icmgroup.us/fifa-world-cup-base-camps-could-boost-smaller-us-hotel-markets-this-summer/; US Soccer"
  },
  {
    "id": "wc2026-san-antonio",
    "marketSlug": "san-antonio",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — San Antonio (spillover)",
    "body": "World Cup 2026 — spillover market. Key read: Hotel-search growth and 'concrete returns' from targeted marketing (qualitative, no KPI). 2027 comp: no market-specific public read; national applies. Underwriting (Ledger): No Cup normalization needed; national rate frame applies.",
    "magnitude": "spillover",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Skift https://skift.com/2026/07/06/world-cup-ripple-effect-non-host-markets/ 2026-07-06"
  },
  {
    "id": "wc2026-fort-lauderdale",
    "marketSlug": "fort-lauderdale",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Fort Lauderdale (spillover)",
    "body": "World Cup 2026 — spillover market. Key read: AHLA April survey named Miami/Ft. Lauderdale region among markets with an uptick (pre-Cup, qualitative). 2027 comp: no market-specific public read; national applies. Underwriting (Ledger): No Cup normalization needed; national rate frame applies.",
    "magnitude": "spillover",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "AP https://apnews.com/article/world-cup-hotel-demand-airbnb-fifa-1698651dcf37cbba09f3183b218d54fb"
  },
  {
    "id": "wc2026-anaheim-orange-county",
    "marketSlug": "anaheim-orange-county",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Anaheim / Orange County (spillover)",
    "body": "World Cup 2026 — spillover market. Key read: USMNT base camp (Great Park, Irvine); no hotel KPI read. 2027 comp: no market-specific public read; national applies. Underwriting (Ledger): No Cup normalization needed; national rate frame applies.",
    "magnitude": "spillover",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "US Soccer https://ussoccer.com/stories/2026/06/usmnt/where-are-fifa-world-cup-2026-team-base-camp-training-sites"
  },
  {
    "id": "wc2026-las-vegas",
    "marketSlug": "las-vegas",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Las Vegas (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. Note: Non-Cup library reads (LVCVA Jul OCC 77.2%; LAS Aug pax −9.2%) are not Cup-attributed — Spirit and international, not displacement. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-chicago",
    "marketSlug": "chicago",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Chicago (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-washington-dc",
    "marketSlug": "washington-dc",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Washington, DC (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. Note: PK ARS ties Cup + America 250 to DC (context, not a Cup KPI); see DC depth-w1 note on A250 distortion. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-denver",
    "marketSlug": "denver",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Denver (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-phoenix",
    "marketSlug": "phoenix",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Phoenix (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-honolulu",
    "marketSlug": "honolulu",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Honolulu (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-new-orleans",
    "marketSlug": "new-orleans",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — New Orleans (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-austin",
    "marketSlug": "austin",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Austin (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-tampa",
    "marketSlug": "tampa",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Tampa (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-jacksonville",
    "marketSlug": "jacksonville",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Jacksonville (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-charlotte",
    "marketSlug": "charlotte",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Charlotte (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-raleigh",
    "marketSlug": "raleigh",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Raleigh (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-detroit",
    "marketSlug": "detroit",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Detroit (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-minneapolis",
    "marketSlug": "minneapolis",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Minneapolis (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-portland-or",
    "marketSlug": "portland-or",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Portland, OR (none: national applies)",
    "body": "World Cup 2026 — tag: none. Jordan base camp (Univ. of Portland / The Nines) confirmed (FIFA; OregonLive 2026-06). Single-asset effect, no Cup-tied market KPI; Vectra keeps none (2026-10-11). no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11; FIFA https://www.fifa.com/en/tournaments/mens/worldcup/articles/team-base-camps-finalised; OregonLive https://www.oregonlive.com/soccer/2026/06/jordanian-community-gathers-as-national-team-trains-in-portland-for-world-cup.html"
  },
  {
    "id": "wc2026-salt-lake-city",
    "marketSlug": "salt-lake-city",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Salt Lake City (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-st-louis",
    "marketSlug": "st-louis",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — St. Louis (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-indianapolis",
    "marketSlug": "indianapolis",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Indianapolis (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-columbus-oh",
    "marketSlug": "columbus-oh",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Columbus, OH (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-cleveland",
    "marketSlug": "cleveland",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Cleveland (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-pittsburgh",
    "marketSlug": "pittsburgh",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Pittsburgh (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-cincinnati",
    "marketSlug": "cincinnati",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Cincinnati (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-baltimore",
    "marketSlug": "baltimore",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Baltimore (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-virginia-beach-norfolk",
    "marketSlug": "virginia-beach-norfolk",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Virginia Beach–Norfolk (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-charleston-sc",
    "marketSlug": "charleston-sc",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Charleston, SC (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-savannah",
    "marketSlug": "savannah",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Savannah (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-myrtle-beach",
    "marketSlug": "myrtle-beach",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Myrtle Beach (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-florida-keys",
    "marketSlug": "florida-keys",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Florida Keys (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-palm-beach",
    "marketSlug": "palm-beach",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Palm Beach (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-palm-springs",
    "marketSlug": "palm-springs",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Palm Springs (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-reno-tahoe",
    "marketSlug": "reno-tahoe",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Reno–Tahoe (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-aspen-vail",
    "marketSlug": "aspen-vail",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Aspen–Vail (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-gatlinburg-pigeon-forge",
    "marketSlug": "gatlinburg-pigeon-forge",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Gatlinburg–Pigeon Forge (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-branson",
    "marketSlug": "branson",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Branson (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-williamsburg-va",
    "marketSlug": "williamsburg-va",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Williamsburg, VA (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-outer-banks",
    "marketSlug": "outer-banks",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Outer Banks (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-napa-sonoma",
    "marketSlug": "napa-sonoma",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Napa–Sonoma (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "wc2026-sedona-grand-canyon",
    "marketSlug": "sedona-grand-canyon",
    "kind": "event",
    "title": "World Cup 2026 post-Cup demand read — Sedona–Grand Canyon (none: national applies)",
    "body": "World Cup 2026 — tag: none. no market-specific public read; national applies. National read: CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Company-attributed Cup lift clustered at ~50–160 bp of Q2 RevPAR by company (Callbook; several figures from third-party transcripts, unverified). Ledger: No Cup normalization needed; national rate frame applies.",
    "magnitude": "none",
    "asOf": "2026-10-11 (event Jun 11–Jul 19, 2026)",
    "sourceLabel": "Quill post-Cup demand matrix 2026-10-11; CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Callbook World Cup deep dive 2026-10-11"
  },
  {
    "id": "w1-hou-supply-score",
    "marketSlug": "houston",
    "kind": "supply",
    "title": "Houston supply pressure 2/5 (Atlas wave 1) — low pressure ≠ ground-up",
    "body": "Atlas supply-pressure score 2/5: supply tailwind, demand headwind. Not in Lodging Econometrics' public top-5 under-construction, starts or early-planning lists; #1 U.S. renovation + conversion market at 35 projects / 4,841 rooms (reflag ≠ net supply). Cornovus: supply growth 'limited', concentrated in CBD and southern submarkets. Metro inventory '>100,000 rooms' (Houston First); ~106,941 implied rooms (C&W Q2 supply room-nights ÷ 91, Atlas derivation). Build-talent friction: no public read. Call: pipeline pressure is low but the risk is demand (59–61% OCC), so even a 2 doesn't greenlight ground-up; value-add conversion is the play.",
    "magnitude": "2/5",
    "asOf": "2026-10-11",
    "sourceLabel": "Atlas depth-w1 2026-10-11 (markets/depth-w1-houston-supply.md); LE Summer 2026 https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/; Cornovus Q1 2026 https://cornovuscapital.com/southwest-hospitality-market-report-q1-2026/; Houston First http://www.houstonfirst.com/news/houston-hotel-market-posts-record-breaking-q1?news_type=PRESS_RELEASE; C&W MarketBeat Q2 2026 https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf"
  },
  {
    "id": "w1-hou-rule",
    "marketSlug": "houston",
    "kind": "nuance",
    "title": "Which Houston — rule: low supply pressure is not a green light",
    "body": "Houston is a demand problem, not a supply problem. Occupancy finished 2025 at 59% (down about 9%) and is flat at ~61% YTD 2026. New-build supply is thin; activity is renovation and conversion (LE #1 nationally). Rate was the only lever that moved in 2026, and it was event-led (World Cup, OTC, CERAWeek). Underwrite repositioning, not ground-up. Downtown/CBD convention district is a 2028 story (George R. Brown expansion opens May 2028).",
    "magnitude": "rule",
    "asOf": "2026-10-11",
    "sourceLabel": "Atlas depth-w1 2026-10-11; Houston First YE 2025 https://www.houstonfirst.com/news/hotel-occupancy-finished-2025-at-59; Houston First Aug 2026 https://www.houstonfirst.com/news/houston-hotels-showed-modest-demand-growth-in-august; LE Summer 2026 https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/; Houston First convention district https://www.houstonfirst.com/convention-district-transformation-1/"
  },
  {
    "id": "w1-hou-monthly",
    "marketSlug": "houston",
    "kind": "occupancy",
    "title": "Houston monthly pulse 2026 (Houston First): Aug OCC 56%, YTD ~61%",
    "body": "Aug 2026: OCC 56% (flat), ADR $114 (+1.5%), RevPAR $64 (+~1%); YTD OCC ~61% flat, ADR $129 (+5.5%), RevPAR $78 (+6%), revenue +~7%. Jul 2026: OCC 59% (+1.2%), ADR $122 (+6%), RevPAR $72 (+7%). Jun 2026: OCC 61% (−~2%; supply +1 pt), ADR $141 (+16%), RevPAR $86 (+14%). YE 2025: OCC 59%, ADR $120, RevPAR $71 (OCC −~9%, RevPAR −9%).",
    "magnitude": "Aug OCC 56% / YTD ~61%",
    "asOf": "Aug 2026",
    "sourceLabel": "Houston First 2026-09-28 https://www.houstonfirst.com/news/houston-hotels-showed-modest-demand-growth-in-august; Houston First 2026-08-24 https://www.houstonfirst.com/news/houston-hotels-showed-solid-rates-and-demand-in-july; Houston First 2026-07-13 https://www.houstonfirst.com/news/houston-hotels-saw-flat-occupancy-but-higher-rates-and-revenue-in-june; Houston First 2026-01-23 https://www.houstonfirst.com/news/hotel-occupancy-finished-2025-at-59"
  },
  {
    "id": "w1-hou-submarkets",
    "marketSlug": "houston",
    "kind": "occupancy",
    "title": "Houston submarket split (Houston First, Aug 2026)",
    "body": "Aug 2026: Downtown/CBD OCC 52%, ADR $191, RevPAR $100 (Jul RevPAR $108, +17%); Uptown/Galleria OCC 54% (−7%), RevPAR $85 (−5%), weakest Aug trend; Medical Center/NRG OCC 57%, ADR $136, RevPAR $77; North/Woodlands OCC 58% (+4 pts), RevPAR $68 (+7%); Katy Fwy West OCC 59%, RevPAR $61 (+7%). Jul: Hobby/NASA OCC 65% (+6%), highest. Dec 2025: Downtown OCC 45% on supply growth; Bush IAH OCC 53%.",
    "magnitude": "Downtown Aug RevPAR $100",
    "asOf": "Aug 2026",
    "sourceLabel": "Houston First https://www.houstonfirst.com/news/houston-hotels-showed-modest-demand-growth-in-august; Houston First https://www.houstonfirst.com/news/houston-hotels-showed-solid-rates-and-demand-in-july"
  },
  {
    "id": "w1-hou-cw-q2",
    "marketSlug": "houston",
    "kind": "occupancy",
    "title": "Houston Q2 2026 (C&W MarketBeat, STR/CoStar): OCC 60.9%, RevPAR $80",
    "body": "Cushman & Wakefield MarketBeat Q2 2026 (STR/CoStar-sourced, 3-month): OCC 60.9% (−1.7%), ADR $131 (+6.8%), RevPAR $80 (+5.0%); supply +1.0%, demand −0.7%.",
    "magnitude": "OCC 60.9% / ADR $131 / RevPAR $80",
    "asOf": "Q2 2026",
    "sourceLabel": "C&W MarketBeat U.S. Hospitality Q2 2026 https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf"
  },
  {
    "id": "w1-hou-pipeline",
    "marketSlug": "houston",
    "kind": "supply",
    "title": "Houston pipeline: named projects (Atlas wave 1)",
    "body": "Holiday Inn Express + Staybridge Suites, 1319 Texas Ave. (17 stories, 275 keys) opened Apr 2026, Downtown/ballpark. Canopy by Hilton, Scanlan Building, 405 Main St. (conversion, 138 keys) broke ground, opening fall/winter 2027. George R. Brown convention district transformation (demand anchor) under construction, opens May 2028. Renovation + conversion: 35 projects / 4,841 rooms (#1 U.S.). No cancellations or slips found in free sources for 2026.",
    "magnitude": "+275 opened; +138 conversion",
    "asOf": "2026-10-11",
    "sourceLabel": "Atlas depth-w1 2026-10-11 (pipeline/depth-w1-houston-pipeline.md); Houston Chronicle https://www.houstonchronicle.com/business/real-estate/article/downtown-hotel-staybridge-holiday-inn-express-open-22220406.php; Hoodline https://hoodline.com/2026/04/new-downtown-hotel-muscles-into-minute-maid-park-s-backyard/; Houston Chronicle https://www.houstonchronicle.com/business/article/hilton-canopy-scanlan-houston-22290048.php; Houston First https://www.houstonfirst.com/convention-district-transformation-1/; LE https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/"
  },
  {
    "id": "w1-nash-supply-score",
    "marketSlug": "nashville",
    "kind": "supply",
    "title": "Nashville supply pressure 4/5 (Atlas wave 1) — downtown dilution",
    "body": "Atlas supply-pressure score 4/5. Lodging Econometrics Q2 2026: #3 total pipeline 122 projects / 16,281 rooms; #4 starts next 12 months 49 / 6,623; #5 early planning 53 / 7,023; NPAs 7 / 844; 2027e openings 16 / 1,853. Supply +3.4% (2025), +2.4% Q2 2026 (top-25 high, tied with Phoenix), +2.6% forecast for 2026. Downtown: 1,515 rooms under construction; planned rooms ~55% of current downtown stock. Build-talent friction: no public read. Call: demand is real (record room nights, +5% YTD) but supply keeps pace and ADR is flat to down; downtown ground-up needs a hard barrier — a true luxury slot with an in-MSA leadership bench, or a campus anchor.",
    "magnitude": "4/5",
    "asOf": "2026-10-11",
    "sourceLabel": "Atlas depth-w1 2026-10-11 (markets/depth-w1-nashville-supply.md); LE Summer 2026 https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/; NCVC in Metro Tourism & Convention Commission minutes 2025-12-02 https://www.nashville.gov/sites/default/files/2026-02/Tourism-and-Convention-Commission-Minutes-120225.pdf; Nashville Downtown Partnership Q2 2026 https://ctycms.com/tn-nashville/docs/2026-market-conditions-report-q2-1.pdf; C&W MarketBeat Q2 2026 https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf"
  },
  {
    "id": "w1-nash-rule",
    "marketSlug": "nashville",
    "kind": "nuance",
    "title": "Which Nashville — rule: event weekends are not the base",
    "body": "Nashville prints 90%+ downtown on marquee weekends (Alan Jackson finale 98% downtown / 92% county, 78,433 room nights; CMA Fest 89.4% downtown; July 4 74.6% county). Underwrite the ~67–69% county average and midweek, because supply has grown about 3%+ a year. Downtown has 14,295 rooms with 7,907 more planned (~55% of current), so the CBD is where dilution lands.",
    "magnitude": "rule",
    "asOf": "2026-10-11",
    "sourceLabel": "Atlas depth-w1 2026-10-11; NCVC via Fort Nash https://www.fort-nash.com/post/alan-jackson-s-final-show-outpaced-cma-fest-and-july-fourth-in-downtown-hotel-occupancy; NCVC https://www.nashville.gov/sites/default/files/2026-02/Tourism-and-Convention-Commission-Minutes-120225.pdf; Nashville Downtown Partnership https://ctycms.com/tn-nashville/docs/2026-market-conditions-report-q2-1.pdf"
  },
  {
    "id": "w1-nash-inventory",
    "marketSlug": "nashville",
    "kind": "supply",
    "title": "Nashville room inventory (NCVC, Dec 2025): 42,241 Davidson / 61,179 greater",
    "body": "Metro Nashville (Davidson) 42,241 rooms (supply +3.4% YoY); greater Nashville 61,179 rooms (Top-25 U.S. market); downtown core 14,295 (+1,300 scheduled) per NCVC, 14,129 per Nashville Downtown Partnership (Q2 2026). Pipeline 'in development' 13,316 rooms. NCVC 2026 forecast: OCC −1.3% as supply grows another 2.6%.",
    "magnitude": "42,241 / 61,179 rooms",
    "asOf": "Dec 2025",
    "sourceLabel": "NCVC report in Metro Tourism & Convention Commission minutes 2025-12-02 https://www.nashville.gov/sites/default/files/2026-02/Tourism-and-Convention-Commission-Minutes-120225.pdf; Nashville Downtown Partnership Q2 2026 https://ctycms.com/tn-nashville/docs/2026-market-conditions-report-q2-1.pdf"
  },
  {
    "id": "w1-nash-pulse",
    "marketSlug": "nashville",
    "kind": "occupancy",
    "title": "Nashville 2026 pulse: county YTD OCC 69.4% through Sep 12",
    "body": "County YTD through Sep 12 2026: OCC 69.4% (+3.2%); demand +5% (~3x supply growth); room revenue ~$1.5B (+5.9%). YE 2025 county: OCC 67.0%, ADR $199.20 (−1.3%), demand +2.6% (record), RevPAR −2.1%. CoStar week ending Jun 6: RevPAR −7.5% to $138.99 despite CMA Fest. Week ending Aug 8: ADR −4.1% to $158.12 (Top-25 largest drop).",
    "magnitude": "YTD OCC 69.4% (+3.2%)",
    "asOf": "2026-09-12",
    "sourceLabel": "NCVC via RoadGenius https://roadgenius.com/statistics/tourism/usa/tennessee/nashville/; CoStar w/e 6 Jun https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-6-june; CoStar w/e 8 Aug https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-8-august"
  },
  {
    "id": "w1-nash-cw-q2",
    "marketSlug": "nashville",
    "kind": "occupancy",
    "title": "Nashville Q2 2026 (C&W MarketBeat, STR/CoStar): OCC 71.7%, RevPAR $133",
    "body": "Cushman & Wakefield MarketBeat Q2 2026 (STR/CoStar-sourced, 3-month): OCC 71.7% (−0.2%), ADR $186 (+1.2%), RevPAR $133 (+1.0%); supply +2.4% (top-25 high, tied with Phoenix).",
    "magnitude": "OCC 71.7% / ADR $186 / RevPAR $133",
    "asOf": "Q2 2026",
    "sourceLabel": "C&W MarketBeat U.S. Hospitality Q2 2026 https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf"
  },
  {
    "id": "w1-nash-pipeline",
    "marketSlug": "nashville",
    "kind": "supply",
    "title": "Nashville pipeline: named projects (Atlas wave 1)",
    "body": "Tempo by Hilton Nashville Midtown 161 keys (opening Mar 2026 per NCVC). Dolly Parton's Songteller Hotel 245, under construction, 'fall' 2026 opening per NDP (NCVC said Jun 2026 — slipped). Pendry Nashville 180, spring 2027. Moxy Nashville – Capitol 185, planned 2027. Nashville Bonvoy 144 rooms + 168 hybrid units, under construction, 2027. InnCahoots 17, under construction, 2027. Nashville Downtown EDITION 282, planned 2029 (The Gulch). Sports Illustrated Resorts Nashville 52, listed for 2026. Downtown (NDP): 1,515 rooms UC; 31 planned hotels / 7,907 rooms.",
    "magnitude": "Downtown 1,515 UC / 7,907 planned",
    "asOf": "2026-10-11",
    "sourceLabel": "Atlas depth-w1 2026-10-11 (pipeline/depth-w1-nashville-pipeline.md); NCVC https://www.nashville.gov/sites/default/files/2026-02/Tourism-and-Convention-Commission-Minutes-120225.pdf; Nashville Downtown Partnership Q2 2026 https://ctycms.com/tn-nashville/docs/2026-market-conditions-report-q2-1.pdf; Visit Music City https://www.visitmusiccity.com/about/nashville-developments-renovations; LE https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/"
  },
  {
    "id": "w1-phx-supply-score",
    "marketSlug": "phoenix",
    "kind": "supply",
    "title": "Phoenix supply pressure 5/5 (Atlas wave 1) — 2026 delivery peak, no ground-up",
    "body": "Atlas supply-pressure score 5/5. #2 U.S. under construction: 31 projects / 4,621 rooms (most rooms UC of any market except NYC); 4,200 rooms UC = 5.7% of inventory at YE 2025 (10-year high, Cornovus). Pipeline 115 / 16,136 (#5); NPAs 8 / 1,641 (#3); LE Q1 2026 had UC projects +19% YoY. Openings: 2026e #1 at 26 / 3,615; 2027e 16 / 1,989. Q2 2026 supply +2.4% (tied highest in top 25). Delivery concentrated in Mesa, Black Canyon, Chandler/Airport and downtown full-service. Build-talent: competes with TSMC/semiconductor construction labor (not quantified). Call: no ground-up; buy stabilized resort product in Scottsdale or Paradise Valley. Cornovus: 11 Phoenix hotel CMBS loans mature within 2 years, 9 at-risk — Ledger owns that read.",
    "magnitude": "5/5",
    "asOf": "2026-10-11",
    "sourceLabel": "Atlas depth-w1 2026-10-11 (markets/depth-w1-phoenix-supply.md); LE Summer 2026 https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/; LE Q1 2026 https://lodgingeconometrics.com/dallas-pheonix-top-us-hotel-pipeline-q1-2026/; Cornovus Southwest Q1 2026 (broker publication) https://cornovuscapital.com/southwest-hospitality-market-report-q1-2026/; C&W MarketBeat Q2 2026 https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf"
  },
  {
    "id": "w1-phx-rule",
    "marketSlug": "phoenix",
    "kind": "nuance",
    "title": "Which Phoenix, and which season — rule: MSA averages ≠ resort performance",
    "body": "Scottsdale, Paradise Valley and Tempe resorts hold rate, with RevPAR flat to slightly up. Black Canyon, Mesa and the Southeast/Chandler-Airport submarkets take the new supply and the rate cuts. Summer is the trough. TSMC's north-Phoenix fab is the one new structural driver, and it favors extended-stay, not resorts. Never read Phoenix MSA averages as resort performance.",
    "magnitude": "rule",
    "asOf": "2026-10-11",
    "sourceLabel": "Atlas depth-w1 2026-10-11; Cornovus Southwest Q1 2026 https://cornovuscapital.com/southwest-hospitality-market-report-q1-2026/"
  },
  {
    "id": "w1-phx-pulse",
    "marketSlug": "phoenix",
    "kind": "occupancy",
    "title": "Phoenix Q2 2026 (C&W): OCC 66.2%; only Top-25 RevPAR decline w/e Sep 26",
    "body": "C&W MarketBeat Q2 2026 (STR/CoStar): OCC 66.2% (+1.2%), ADR $164 (+2.0%), RevPAR $108 (+3.3%); supply +2.4%. CoStar week ending 2026-09-26: only Top-25 market with RevPAR down (−0.5% to $99.09). T12 Nov 2025 (Cornovus): OCC 66.0% (−3.3 pts), RevPAR −3.0%, transient demand −2.3%. No free Visit Phoenix monthly STR print found.",
    "magnitude": "OCC 66.2% / RevPAR $108",
    "asOf": "Q2 2026",
    "sourceLabel": "C&W MarketBeat Q2 2026 https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf; CoStar w/e 26 Sep https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-26-september; Cornovus https://cornovuscapital.com/southwest-hospitality-market-report-q1-2026/"
  },
  {
    "id": "w1-phx-pipeline",
    "marketSlug": "phoenix",
    "kind": "supply",
    "title": "Phoenix pipeline: named projects (Atlas wave 1)",
    "body": "Denū Hotel & Spa (Meritage Collection) 236 keys, Downtown, opening Sep 16 2026. Fairmont Phoenix (25 stories) 225 rooms + 34 suites, under construction, Downtown, early 2027. Hyatt Studios Phoenix (TSMC-oriented) 114, under construction, North/TSMC, Q2 2027. Hyatt Place @ Arizona Boardwalk 142, pipeline, Scottsdale (Talking Stick), late 2027. Scottsdale Golf Retreat @ Troon North 26 suites, fall 2026. No cancellations or slips found in free sources for 2026.",
    "magnitude": "Downtown full-service wave",
    "asOf": "2026-10-11",
    "sourceLabel": "Atlas depth-w1 2026-10-11 (pipeline/depth-w1-phoenix-pipeline.md); azcentral 2026-07-21 https://www.azcentral.com/story/travel/arizona/2026/07/21/denu-hotel-downtown-phoenix-opening-september/90949505007/; newhotels.io https://www.newhotels.io/hotels/fairmont-phoenix; Caliber https://www.caliberco.com/assets/hyatt-studios-tsmc-fundco-llc/; Stay in the New https://www.stayinthenew.com/new-hotels-scottsdale"
  },
  {
    "id": "w1-phx-transactions",
    "marketSlug": "phoenix",
    "kind": "transaction",
    "title": "Phoenix transactions: ~$1B in H1 2025, led by JW Desert Ridge $865M",
    "body": "Phoenix was the largest U.S. single market for hotel transactions in H1 2025 at ~$1B, led by the $865M JW Marriott Desert Ridge sale (Cornovus, broker publication citing industry data).",
    "magnitude": "~$1B H1 2025",
    "asOf": "2025",
    "sourceLabel": "Cornovus Southwest Q1 2026 https://cornovuscapital.com/southwest-hospitality-market-report-q1-2026/"
  },
  {
    "id": "w1-dc-supply-score",
    "marketSlug": "washington-dc",
    "kind": "supply",
    "title": "Washington DC supply pressure 3/5 (Atlas wave 1) — conversion-led",
    "body": "Atlas supply-pressure score 3/5 (mixed). Not in LE public top-5 under construction. LE renovation + conversion 33 projects / 4,669 rooms (top-5 U.S.); office-to-hotel conversions add net keys. DC pipeline incl. conversions/renovations 98 projects / 12,335 rooms (LE via Hotel Business); Destination DC city pipeline 25 new or renovated hotels, >3,600 rooms; STR pipeline >13,000 rooms (mid-2025). DC Metro openings past 24 months 32 / 4,756 (Lodging Development). Ground-up deterred by costs (construction inputs +6.2% Jan–Apr 2026, ABC via Bisnow). Build-talent: no public read. Call: pipeline ~11% of implied inventory (12.3k on ~114k), conversion-heavy and spread across the region; ground-up only with a hard barrier; conversion basis below replacement cost is the default play (Ledger owns $/key).",
    "magnitude": "3/5",
    "asOf": "2026-10-11",
    "sourceLabel": "Atlas depth-w1 2026-10-11 (markets/depth-w1-washington-dc-supply.md); LE Summer 2026 https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/; Hotel Business https://hotelbusiness.com/five-gateway-markets-have-234-companies-driving-1200-hotel-projects-worldwide/; Destination DC https://washington.org/press/journalist-newsletter/hotel-happenings; Hotel Investment Today https://www.hotelinvestmenttoday.com/Regions/North-America/Robust-March-America250-point-to-DC-recovery; Lodging Development https://www.lodgingdevelopment.com/hotel-development/dc-metro; Bisnow https://www.bisnow.com/news/washington-dc/hotel/hotel-execs-bullish-on-dc-market-but-opt-for-conversions-not-new-builds-134715; C&W https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf"
  },
  {
    "id": "w1-dc-rule",
    "marketSlug": "washington-dc",
    "kind": "nuance",
    "title": "Which DC — rule: don't annualize 2026",
    "body": "2026 is distorted on both ends: January was down sharply against the 2025 inauguration comp, while April–July spiked on America250-period events. Strip out the events before underwriting a base year. New city supply is mostly office-to-hotel conversion, which still adds net rooms (Tempo 278, citizenM 230) — count those as supply, not as 'renovation.'",
    "magnitude": "rule",
    "asOf": "2026-10-11",
    "sourceLabel": "Atlas depth-w1 2026-10-11; CoStar Jan 2026 https://www.costar.com/products/str-benchmark/resources/press-releases/us-hotel-performance-january-2026; Destination DC https://washington.org/press/journalist-newsletter/hotel-happenings"
  },
  {
    "id": "w1-dc-pulse",
    "marketSlug": "washington-dc",
    "kind": "occupancy",
    "title": "Washington DC 2026 pulse: Q2 RevPAR +9.0% (C&W); event-skewed weeks",
    "body": "C&W MarketBeat Q2 2026 (STR/CoStar, DC-MD-VA): OCC 77.2%, ADR $212, RevPAR $164 (+9.0%); ~114,265 implied rooms (Atlas derivation). CoStar Jan 2026: ADR −25.8% to $151.99, RevPAR −31.3% to $76.36 (inauguration comp). Week ending Apr 18: ADR +30.7% to $231.77, RevPAR +57.7% to $184.25. Week ending Jul 4: ADR +34.8% to $209.40, RevPAR +57.3% to $149.78 (America250). Week ending Jul 18: OCC +7.0% to 78.3%. Week ending Sep 19: OCC +10.7% to 82.3%, RevPAR +23.9% to $194.23.",
    "magnitude": "Q2 RevPAR $164 (+9.0%)",
    "asOf": "Q2 2026 / w/e 2026-09-19",
    "sourceLabel": "C&W https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf; CoStar Jan 2026 https://www.costar.com/products/str-benchmark/resources/press-releases/us-hotel-performance-january-2026; CoStar w/e 18 Apr https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-18-april; w/e 4 Jul https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-4-july; w/e 18 Jul https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-18-july; w/e 19 Sep https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-19-september"
  },
  {
    "id": "w1-dc-visitation",
    "marketSlug": "washington-dc",
    "kind": "visitation",
    "title": "Washington DC visitation 2025: ~27M visitors, $11.9B spend",
    "body": "Destination DC: ~27M visitors and $11.9B visitor spend (+4%) in 2025. Walter E. Washington Convention Center expected to generate >470,000 room nights in 2026.",
    "magnitude": "~27M visitors / $11.9B",
    "asOf": "2025",
    "sourceLabel": "Destination DC via Bisnow https://www.bisnow.com/news/washington-dc/hotel/hotel-execs-bullish-on-dc-market-but-opt-for-conversions-not-new-builds-134715; Hotel Investment Today https://www.hotelinvestmenttoday.com/Regions/North-America/Robust-March-America250-point-to-DC-recovery"
  },
  {
    "id": "w1-dc-pipeline",
    "marketSlug": "washington-dc",
    "kind": "supply",
    "title": "Washington DC pipeline: named projects (Atlas wave 1)",
    "body": "Tempo by Hilton Washington DC Downtown, 1776 K St NW (office conversion) 278 keys, opened Apr 2026. citizenM Washington DC Georgetown, 3401 Water St NW (conversion) 230, opened Jun 2026. The Hoya Hotel at Georgetown, opening Aug 2026 (key count unverified in source excerpt). WaterWalk by Wyndham Capitol Hill / Navy Yard 100, under construction, late 2026. MOB Hotel and an Aloft, pipeline, mid-2028. Redbrick Bridge District hotel 160, proposed, construction target 2027. No cancellations or slips found in free sources for 2026.",
    "magnitude": "Conversions lead deliveries",
    "asOf": "2026-10-11",
    "sourceLabel": "Atlas depth-w1 2026-10-11 (pipeline/depth-w1-washington-dc-pipeline.md); Destination DC https://washington.org/press/journalist-newsletter/hotel-happenings; Lodging Development https://www.lodgingdevelopment.com/hotel-development/dc-metro; Bisnow https://www.bisnow.com/news/washington-dc/hotel/hotel-execs-bullish-on-dc-market-but-opt-for-conversions-not-new-builds-134715"
  },
  {
    "id": "w1-dal-cw-q2",
    "marketSlug": "dallas",
    "kind": "occupancy",
    "title": "Dallas Q2 2026 (C&W MarketBeat, STR/CoStar): OCC 68.4%, RevPAR $95 (+6.3%)",
    "body": "Cushman & Wakefield MarketBeat Q2 2026 (STR/CoStar-sourced, 3-month): OCC 68.4% (+0.4%), ADR $139 (+5.9%), RevPAR $95 (+6.3%); supply +0.5%, demand +0.9%; ~97,164 implied rooms (Q2 supply room-nights ÷ 91, Atlas derivation).",
    "magnitude": "OCC 68.4% / ADR $139 / RevPAR $95",
    "asOf": "Q2 2026",
    "sourceLabel": "C&W MarketBeat U.S. Hospitality Q2 2026 https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf; Atlas markets/notes/2026-q2-cw-marketbeat-top25.md 2026-10-11"
  },
  {
    "id": "w1-atl-cw-q2",
    "marketSlug": "atlanta",
    "kind": "occupancy",
    "title": "Atlanta Q2 2026 (C&W MarketBeat, STR/CoStar): OCC 65.9%, RevPAR $88 (+5.5%)",
    "body": "Cushman & Wakefield MarketBeat Q2 2026 (STR/CoStar-sourced, 3-month): OCC 65.9% (+0.5%), ADR $133 (+5.0%), RevPAR $88 (+5.5%); supply +0.9%, demand +1.4%; ~115,493 implied rooms (Q2 supply room-nights ÷ 91, Atlas derivation).",
    "magnitude": "OCC 65.9% / ADR $133 / RevPAR $88",
    "asOf": "Q2 2026",
    "sourceLabel": "C&W MarketBeat U.S. Hospitality Q2 2026 https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf; Atlas markets/notes/2026-q2-cw-marketbeat-top25.md 2026-10-11"
  },
  {
    "id": "wc2026-sea-wage-floor",
    "marketSlug": "seattle",
    "kind": "talent",
    "title": "Seattle labor: housekeeper wage floor $31.03/hr from Jan 1 2027 (Embassy Suites strike settled)",
    "body": "UNITE HERE Local 8 struck the Embassy Suites Pioneer Square (Hilton-managed, Steinhauer-owned) on June 18, the day before USA–Australia, 117 workers; daily housekeeping was suspended during the tournament. Ratified 4-year contract Sept 10, back Sept 15 after 85 days (longest Washington hotel strike). Housekeeper start $31.03/hr from Jan 1 2027 (+6.9% year 1, +23.3% over term), year-round healthcare at 1,250 hours, lower quotas, and an immigrant-worker recall/enforcement mechanism. Human touch first: underwrite 2027 Seattle labor at the new floor; a soft-June overstaff is not a reason to cut FTE.",
    "magnitude": "$31.03/hr from 2027-01-01",
    "asOf": "2026-09-16",
    "sourceLabel": "Hotel Dive 2026-09-16 https://www.hoteldive.com/news/union-workers-at-seattle-hilton-reach-deal-to-end-85-day-strike/830486/; NW Labor Press 2026-07 https://nwlaborpress.org/2026/07/seattle-hotel-strike-during-world-cup/; Herald people/notes/2026-10-11-world-cup-brand-labor.md"
  },
  {
    "id": "wc2026-phl-wage-floor",
    "marketSlug": "philadelphia",
    "kind": "talent",
    "title": "Philadelphia labor: downtown hotel wage floor to $30/hr by 2028 (Local 274)",
    "body": "UNITE HERE Local 274 (Sheraton + Warwick, ~200 workers): contracts to $30/hr by 2028, pension up, room-attendant quotas down; the Sheraton struck for 9 days. 7 of 8 downtown targets settled, aligned to a 2028 expiry. Set mid-World Cup when leverage peaked. Human touch first: underwrite 2027 Philadelphia labor at the new floor; don't cut FTE over a soft June.",
    "magnitude": "$30/hr by 2028",
    "asOf": "2026-07",
    "sourceLabel": "Labor Notes 2026-07 https://www.labornotes.org/2026/07/world-cup-leverage-california-stadium-workers-win-right-strike-over-ice?language=en; Herald people/notes/2026-10-11-world-cup-brand-labor.md"
  },
  {
    "id": "wc2026-us-lift-by-company",
    "marketSlug": null,
    "kind": "world_cup",
    "title": "World Cup 2026 lift by company: ~50–160 bp of Q2 RevPAR, ADR-led",
    "body": "Company-attributed World Cup contributions cluster at ~50–160 bp of Q2 RevPAR: HST 160 bp; HLT U.S. ~150–170 bp; MAR U.S.&C ~100 bp; PEB 60–100 bp; H U.S. ~70 bp; CHH 60 bp; APLE ~50 bp; WH U.S. ~25 bp. Full-year contributions cluster at ~30–70 bp (HST 70 bp gross, MAR ~45 bp global, CHH ~30 bp, PK ~30 bp, IHG ~0.4 pt Americas). The gain was almost entirely ADR, not occupancy. Confidence: HST, PEB, CHH, MAR, IHG and PK figures are filing-backed; HLT's 1.5–1.7 pts, WH's ~25 bp, APLE's call figures and H's segment detail come from third-party transcripts (unverified).",
    "magnitude": "~50–160 bp Q2 / ~30–70 bp FY",
    "asOf": "2026-10-11",
    "sourceLabel": "Callbook World Cup deep dive (product/earnings/_index/2026-10-11-world-cup.md) 2026-10-11; HST Q2 release https://www.sec.gov/Archives/edgar/data/1070750/000107075026000122/hst-ex991.htm; PEB Q2 release https://www.sec.gov/Archives/edgar/data/1474098/000147409826000056/a8kq2-2026erex991.htm; CHH Q2 10-Q https://www.sec.gov/Archives/edgar/data/1046311/000104631126000025/chh-20260630.htm; MAR Q2 10-Q https://www.sec.gov/Archives/edgar/data/1048286/000104828626000035/mar-20260630.htm; H Q2 release https://www.sec.gov/Archives/edgar/data/1468174/000146817426000021/q22026earningsrelease.htm; HLT Q2 release https://www.sec.gov/Archives/edgar/data/1585689/000158568926000042/q22026earningsrelease.htm; APLE Q2 release https://www.sec.gov/Archives/edgar/data/1418121/000119312526335144/aple-ex99_1.htm; IHG H1 6-K https://www.sec.gov/Archives/edgar/data/858446/000165495426007436/a0528q.htm; PK Q2 release https://www.sec.gov/Archives/edgar/data/1617406/000161740626000038/earningsreleaseex991-live.htm; stockanalysis.com third-party transcripts (unverified)"
  },
  {
    "id": "wc2026-us-nonhost-read",
    "marketSlug": null,
    "kind": "world_cup",
    "title": "World Cup 2026 national read for non-host markets",
    "body": "CoStar non-host demand +2.3% (non-host Top 25 +3.3%) from Jun 11; Tourism Economics non-host RevPAR +6.8% Jun–Jul; national RevPAR Jun +8.4%, Jul +8.2%, Aug +2.0%. Neither aggregate is per-market. Overseas arrivals −1.8% Jun, −7.0% Jul, −11.8% Aug — the Cup left no new seats. Ledger: no Cup normalization needed for non-host markets; national rate frame applies.",
    "magnitude": "Non-host demand +2.3%",
    "asOf": "2026-09-28",
    "sourceLabel": "CoStar 2026-07 https://www.costar.com/article/1466462996/world-cup-fuels-record-us-hotel-rates-as-demand-shifts-beyond-host-cities; Tourism Economics 2026-09 https://www.tourismeconomics.com/wp-content/uploads/2026/09/20260730-US-World-Cup-Bump-to-Overseas-Arrivals-and-Hotel-Performance.pdf; CoStar Aug 2026-09-28 https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-performance-august-2026; Quill post-Cup demand matrix 2026-10-11"
  },
  {
    "id": "wc2026-us-2027-comp",
    "marketSlug": null,
    "kind": "world_cup",
    "title": "2027 World Cup comp: ~30–70 bp FY headwind, concentrated Jun–Jul host-city ADR",
    "body": "Callbook inference from company figures (no company quantified a 2027 Cup headwind): FY26 Cup contributions of ~30–70 bp imply a similar FY27 drag, concentrated in June–July 2027; the Q2'27 comp headwind could be ~50–160 bp, July/Q3'27 smaller. The specific underwriting risk is June/July 2027 ADR comps in NY, Boston, SF, Miami, Dallas-FW and Kansas City; occupancy comp roughly neutral. Company views: MAR 'We will have the challenge of the comp of the World Cup next year'; PK 'not having some of those difficult comps'; PEB expects compression plus inbound recovery to 'more than offset' (quotes from third-party transcripts, unverified). Underwriting: normalize Jun 11–Jul 19 2026 out of host-market T12s and test DY on the normalized figure; never rebuild DY by cutting FTE (Ledger proposed rule, pending Neo/Hal).",
    "magnitude": "~30–70 bp FY27",
    "asOf": "2026-10-11",
    "sourceLabel": "Callbook World Cup deep dive 2026-10-11; MAR Q2 call https://stockanalysis.com/stocks/mar/transcripts/661378-q2-2026/ (third-party transcript); PK Q2 call https://stockanalysis.com/stocks/pk/transcripts/659223-q2-2026/ (third-party transcript); PEB Q2 call https://stockanalysis.com/stocks/peb/transcripts/656908-q2-2026/ (third-party transcript); Piccard (secondary) https://piccardfinancial.com/insights/hotel-bridge-loans-2026; Quill post-Cup demand matrix 2026-10-11"
  },
  {
    "id": "wc2026-us-2027-baseline",
    "marketSlug": null,
    "kind": "budget_baseline",
    "title": "2027 budget baseline: 2–2.5% underlying RevPAR (Nassetta, Hilton)",
    "body": "Hilton's Chris Nassetta: Q2 U.S. RevPAR +5.4% included ~2.7 pts from comps + World Cup; underlying run-rate ~2–2.5%, and budget season should start from a '2% to 2.5%' baseline (Q2 call, third-party transcript, unverified). Wyndham's underlying ~2% 2H guide is consistent. Brands disclose the Cup as a one-off to strip out — Nassetta's 2–2.5% is the 2027 budget anchor, not 2026 prints.",
    "magnitude": "2–2.5% baseline",
    "asOf": "2026-07-28",
    "sourceLabel": "Hilton Q2 transcript (goodmoat, third-party) https://goodmoat.com/stocks/hlt/transcripts/2026-year/2-quarter; HLT Q2 call (stockanalysis, third-party) https://stockanalysis.com/stocks/hlt/transcripts/656143-q2-2026/; HLT Q2 release https://www.sec.gov/Archives/edgar/data/1585689/000158568926000042/q22026earningsrelease.htm; Herald people/notes/2026-10-11-world-cup-brand-labor.md"
  },
  {
    "id": "wc2026-us-no-fte-cut-rule",
    "marketSlug": null,
    "kind": "labor_rule",
    "title": "Human touch first: don't cut FTE over a soft June",
    "body": "Decision-support rule (Herald): the Cup's labor legacy is higher contract floors in Seattle ($31.03/hr housekeeper start from 2027) and Philadelphia ($30/hr by 2028), set mid-event when leverage peaked. Underwrite 2027 host labor at the new floors; a soft-June overstaff is not a reason to cut FTE. The miss was hours, not headcount (NYT: a Westin Bonaventure LA worker's expected Cup hours never came). Planner win-back runs on sales and service people. No public post-event WARN/layoff data tied to Cup staffing was found.",
    "magnitude": "rule",
    "asOf": "2026-10-11",
    "sourceLabel": "Herald people/notes/2026-10-11-world-cup-brand-labor.md 2026-10-11; NYT 2026-07-10 https://www.nytimes.com/2026/07/10/business/hotel-workers-world-cup.html; Hotel Dive 2026-09-16 https://www.hoteldive.com/news/union-workers-at-seattle-hilton-reach-deal-to-end-85-day-strike/830486/; Labor Notes 2026-07 https://www.labornotes.org/2026/07/world-cup-leverage-california-stadium-workers-win-right-strike-over-ice?language=en"
  },
  {
    "id": "reit-t1-washington-dc",
    "marketSlug": "washington-dc",
    "kind": "reit_exposure",
    "title": "Washington DC REIT ownership (Callbook Tier 1): 8,734 rooms, all 5 REITs",
    "body": "Rooms owned (FY2025 10-K property items, adjusted for 2026 sales): HST 3,988 (46%; Grand Hyatt 902, Hyatt Regency Capitol Hill 840, JW Marriott 777, Hyatt Regency Reston 518, Ritz-Carlton Tysons 398, Gaithersburg Marriott 284, Westin Georgetown 269); RHP 2,188 (25%; Gaylord National 1,996 + AC National Harbor 192); PK 1,085 (Crystal City DoubleTree 627, Hilton McLean 458; was 1,373 at 10-K before the May 2026 sale of its Embassy Suites Alexandria Old Town JV interest); APLE 781 (5 hotels); PEB 692 (Zena, Monaco, Viceroy, George). The only Tier 1 market with all five REITs. Disclosed share of company: RHP 10.6% of 1H26 Hospitality Adj. EBITDAre; HST 6.8% of 1H26 comparable Hotel EBITDA (CBD + NoVA, Gaithersburg booked in 'Other'); PEB 4.3% of FY25 revenue; PK 3.1% of 1H26 Hotel Adj. EBITDA. APLE market earnings share not cited (Callbook: slide-18 map unlabeled, not citable). Q2 2026 (filings): HST DC CBD RevPAR +16.5%, Northern Virginia +15.8%; PK DC-area RevPAR +17%, group revenue 'over 56%'; Gaylord National RevPAR +11.9%, Adj. EBITDAre +14.3% to $29.1M; PEB DC RevPAR −9.9% (YTD −16.0%) on 'continued weakness in government-related demand.' Calls (third-party transcript, unverified): HST says DC banquet and catering revenue rose 45% after the renovated Hyatts (Grand Hyatt DC renovation finished Q2); PEB took its DC outlook down and flagged the 2027 NFL Draft in DC. Callbook read: the split is owner mix, not the market — renovated group boxes ran +12% to +17% while small government-transient lifestyle hotels ran −9.9%; don't price DC off one REIT's print. Decision support; shares are on different bases by company and must not be added across companies.",
    "magnitude": "8,734 rooms / 5 REITs",
    "asOf": "2026-10-11",
    "sourceLabel": "Callbook Tier-1 REIT exposure map (product/earnings/_index/reit-exposure-by-market.md) 2026-10-11; HST FY2025 10-K https://www.sec.gov/Archives/edgar/data/1070750/000107075026000054/hst-20251231.htm; PEB FY2025 10-K https://www.sec.gov/Archives/edgar/data/1474098/000147409826000015/peb-20251231.htm; RHP FY2025 10-K https://www.sec.gov/Archives/edgar/data/1040829/000110465926019035/rhp-20251231x10k.htm; APLE FY2025 10-K https://www.sec.gov/Archives/edgar/data/1418121/000119312526064008/aple-20251231.htm; PK FY2025 10-K https://www.sec.gov/Archives/edgar/data/1617406/000161740626000006/pk-20251231.htm; HST Q2 10-Q https://www.sec.gov/Archives/edgar/data/1070750/000107075026000126/hst-20260630.htm; PEB Q2 release https://www.sec.gov/Archives/edgar/data/1474098/000147409826000056/a8kq2-2026erex991.htm; RHP Q2 release https://www.sec.gov/Archives/edgar/data/1040829/000110465926092380/tmb-20260806xex99d1.htm; PK Q2 release https://www.sec.gov/Archives/edgar/data/1617406/000161740626000038/earningsreleaseex991-live.htm; PK Q2 supplement https://www.sec.gov/Archives/edgar/data/1617406/000161740626000038/supplementexhibit992-live.htm; HST Q2 call https://stockanalysis.com/stocks/hst/transcripts/662252-q2-2026/ (third-party transcript, unverified); PEB Q2 call https://stockanalysis.com/stocks/peb/transcripts/656908-q2-2026/ (third-party transcript, unverified)"
  },
  {
    "id": "reit-t1-san-diego",
    "marketSlug": "san-diego",
    "kind": "reit_exposure",
    "title": "San Diego REIT ownership (Callbook Tier 1): 7,715 rooms, 4 REITs",
    "body": "Rooms owned: HST 3,294 (43%); PEB 2,462 (32%); APLE 1,221; PK 738 (incl. non-core DoubleTree Mission Valley 300, whose disposition timing 'cannot be determined given ongoing litigation'). RHP's Gaylord Pacific (Chula Vista) is not RHP-owned. Disclosed share of company: PEB 22.4% of FY25 revenue (its #1 market); HST 9.5% of 1H26 comparable Hotel EBITDA; PK 1.7% (Mission Bay only). APLE market earnings share not cited (Callbook: slide-18 map unlabeled, not citable). Q2 2026 (filings): HST San Diego RevPAR +1.5%; PEB San Diego Downtown RevPAR −9.1% on a weaker convention calendar (ex-San Diego +8.6%); PK Hyatt Regency Mission Bay RevPAR +0.6%. Calls (third-party transcript, unverified): PEB — '120,000 less convention room nights in San Diego year to date … That reverses in 2027'; Paradise Point RevPAR +22%; HST's Manchester Grand Hyatt renovation 'substantially complete by the end of this year.' Read: 2026 is a trough for downtown group; 2027 comps are easy. These cited REIT rows lead; the San Diego seed rows remain illustrative. Decision support; shares are on different bases by company and must not be added across companies.",
    "magnitude": "7,715 rooms / 4 REITs",
    "asOf": "2026-10-11",
    "sourceLabel": "Callbook Tier-1 REIT exposure map (product/earnings/_index/reit-exposure-by-market.md) 2026-10-11; HST FY2025 10-K https://www.sec.gov/Archives/edgar/data/1070750/000107075026000054/hst-20251231.htm; PEB FY2025 10-K https://www.sec.gov/Archives/edgar/data/1474098/000147409826000015/peb-20251231.htm; APLE FY2025 10-K https://www.sec.gov/Archives/edgar/data/1418121/000119312526064008/aple-20251231.htm; PK FY2025 10-K https://www.sec.gov/Archives/edgar/data/1617406/000161740626000006/pk-20251231.htm; HST Q2 10-Q https://www.sec.gov/Archives/edgar/data/1070750/000107075026000126/hst-20260630.htm; PEB Q2 release https://www.sec.gov/Archives/edgar/data/1474098/000147409826000056/a8kq2-2026erex991.htm; PK Q2 release https://www.sec.gov/Archives/edgar/data/1617406/000161740626000038/earningsreleaseex991-live.htm; PK Q2 supplement https://www.sec.gov/Archives/edgar/data/1617406/000161740626000038/supplementexhibit992-live.htm; PEB Q2 call https://stockanalysis.com/stocks/peb/transcripts/656908-q2-2026/ (third-party transcript, unverified); HST Q2 call https://stockanalysis.com/stocks/hst/transcripts/662252-q2-2026/ (third-party transcript, unverified)"
  },
  {
    "id": "reit-t1-houston",
    "marketSlug": "houston",
    "kind": "reit_exposure",
    "title": "Houston REIT ownership (Callbook Tier 1): 2,285 rooms, 2 REITs (HST 75%)",
    "body": "Rooms owned: HST 1,710 (75%); APLE 575 (25%). CHH owns one Cambria (room count not disclosed). HST sold the St. Regis Houston in 2025, before the 10-K list. Disclosed share of company: HST 2.3% of 1H26 comparable Hotel EBITDA. APLE market earnings share not cited (Callbook: slide-18 map unlabeled, not citable). Q2 2026 (filings): HST Houston RevPAR +3.1%, after FY2025 −4.0%. APLE: no Houston-specific 2026 commentary found. Call (third-party transcript, unverified): HST said 2025 sales of 'the two Four Seasons and the St. Regis in Houston' removed $84M of EBITDA. Concentration: one owner holds three-quarters of REIT rooms. Decision support; shares are on different bases by company and must not be added across companies.",
    "magnitude": "2,285 rooms / 2 REITs",
    "asOf": "2026-10-11",
    "sourceLabel": "Callbook Tier-1 REIT exposure map (product/earnings/_index/reit-exposure-by-market.md) 2026-10-11; HST FY2025 10-K https://www.sec.gov/Archives/edgar/data/1070750/000107075026000054/hst-20251231.htm; APLE FY2025 10-K https://www.sec.gov/Archives/edgar/data/1418121/000119312526064008/aple-20251231.htm; CHH FY2025 10-K https://www.sec.gov/Archives/edgar/data/1046311/000104631126000008/chh-20251231.htm; HST Q2 10-Q https://www.sec.gov/Archives/edgar/data/1070750/000107075026000126/hst-20260630.htm; HST Q2 call https://stockanalysis.com/stocks/hst/transcripts/662252-q2-2026/ (third-party transcript, unverified)"
  },
  {
    "id": "reit-t1-boston",
    "marketSlug": "boston",
    "kind": "reit_exposure",
    "title": "Boston REIT ownership (Callbook Tier 1): 5,327 rooms, 4 REITs",
    "body": "Rooms owned: PEB 1,965 (37%); PK 1,536 (29%); HST 1,496; APLE 330. PK repaid the $120M Hyatt Regency Boston mortgage in June 2026. Disclosed share of company: PEB 18.7% of FY25 revenue (its #2 market); PK 4.5% (core only; Newton in non-core); HST 2.4%. APLE market earnings share not cited (Callbook: slide-18 map unlabeled, not citable). Q2 2026 (filings): PEB Boston RevPAR +6.3% (YTD +3.1%); PK Hyatt Regency Boston +8.7%, Hilton Boston Logan +0.3%; HST Boston +2.5%. Calls (third-party transcript, unverified): PEB's Q1 was −3% on a lighter citywide calendar, storms and a Revere renovation, and it expects 'more favorable convention calendars in San Diego and Boston' in 2027; PK put World Cup benefit across NY, Boston and SF at ~30 bp of full-year portfolio RevPAR; HST lists Boston among markets with 'meaningful total group revenue pace' for 2H26. Decision support; shares are on different bases by company and must not be added across companies.",
    "magnitude": "5,327 rooms / 4 REITs",
    "asOf": "2026-10-11",
    "sourceLabel": "Callbook Tier-1 REIT exposure map (product/earnings/_index/reit-exposure-by-market.md) 2026-10-11; HST FY2025 10-K https://www.sec.gov/Archives/edgar/data/1070750/000107075026000054/hst-20251231.htm; PEB FY2025 10-K https://www.sec.gov/Archives/edgar/data/1474098/000147409826000015/peb-20251231.htm; APLE FY2025 10-K https://www.sec.gov/Archives/edgar/data/1418121/000119312526064008/aple-20251231.htm; PK FY2025 10-K https://www.sec.gov/Archives/edgar/data/1617406/000161740626000006/pk-20251231.htm; HST Q2 10-Q https://www.sec.gov/Archives/edgar/data/1070750/000107075026000126/hst-20260630.htm; PEB Q2 release https://www.sec.gov/Archives/edgar/data/1474098/000147409826000056/a8kq2-2026erex991.htm; PK Q2 release https://www.sec.gov/Archives/edgar/data/1617406/000161740626000038/earningsreleaseex991-live.htm; PK Q2 supplement https://www.sec.gov/Archives/edgar/data/1617406/000161740626000038/supplementexhibit992-live.htm; PEB Q1 call https://stockanalysis.com/stocks/peb/transcripts/571810-q1-2026/ (third-party transcript, unverified); PEB Q2 call https://stockanalysis.com/stocks/peb/transcripts/656908-q2-2026/ (third-party transcript, unverified); PK Q2 call https://stockanalysis.com/stocks/pk/transcripts/659223-q2-2026/ (third-party transcript, unverified); HST Q2 call https://stockanalysis.com/stocks/hst/transcripts/662252-q2-2026/ (third-party transcript, unverified)"
  },
  {
    "id": "reit-t1-atlanta",
    "marketSlug": "atlanta",
    "kind": "reit_exposure",
    "title": "Atlanta REIT ownership (Callbook Tier 1): 1,189 rooms, 2 REITs + Hyatt 171",
    "body": "Rooms owned: HST 810 (68%); APLE 379 (32%). Hyatt owns/leases Hyatt Place Atlanta/Buckhead (171, finance lease). Disclosed share of company: HST 1.3% of 1H26 comparable Hotel EBITDA. APLE market earnings share not cited (Callbook: slide-18 map unlabeled, not citable). Q2 2026 (filings): HST Atlanta RevPAR +10.4%. Call (third-party transcript, unverified): HST's Grand Hyatt Atlanta in Buckhead transformational renovation is complete. Decision support; shares are on different bases by company and must not be added across companies.",
    "magnitude": "1,189 rooms / 2 REITs",
    "asOf": "2026-10-11",
    "sourceLabel": "Callbook Tier-1 REIT exposure map (product/earnings/_index/reit-exposure-by-market.md) 2026-10-11; HST FY2025 10-K https://www.sec.gov/Archives/edgar/data/1070750/000107075026000054/hst-20251231.htm; APLE FY2025 10-K https://www.sec.gov/Archives/edgar/data/1418121/000119312526064008/aple-20251231.htm; Hyatt FY2025 10-K https://www.sec.gov/Archives/edgar/data/1468174/000146817426000007/h-20251231.htm; HST Q2 10-Q https://www.sec.gov/Archives/edgar/data/1070750/000107075026000126/hst-20260630.htm; HST Q2 call https://stockanalysis.com/stocks/hst/transcripts/662252-q2-2026/ (third-party transcript, unverified)"
  },
  {
    "id": "reit-t1-phoenix",
    "marketSlug": "phoenix",
    "kind": "reit_exposure",
    "title": "Phoenix REIT ownership (Callbook Tier 1): 3,898 rooms, 3 REITs + Hyatt 693",
    "body": "Rooms owned: HST 1,545 (40%; 10-K property list); APLE 1,403 (36%); RHP 950 (JW Desert Ridge). Hyatt owns Hyatt Regency Phoenix (693). Room-count variance: HST's Q2 10-Q location table shows 1,565 Phoenix rooms vs 1,545 in the 10-K; the 20-room difference is not explained in the filing (TBD). Disclosed share of company: RHP 12.2% of 1H26 Hospitality Adj. EBITDAre; HST 9.6% of 1H26 comparable Hotel EBITDA (its largest Tier 1 market on a seasonally favorable 1H basis). APLE market earnings share not cited (Callbook: slide-18 map unlabeled, not citable). Q2 2026 (filings): HST Phoenix RevPAR +3.8%; RHP JW Desert Ridge 1H26 Adj. EBITDAre $53.1M, FY26 guide raised to $69–73M, meeting-space conversion completed Q2. Calls (third-party transcript, unverified): APLE — 'Phoenix was down slightly' in Q2, rebound expected; HST — Florida and Phoenix resorts generated ~60% of Q1 transient revenue growth; RHP bought Desert Ridge for $865M about a year earlier. Decision support; shares are on different bases by company and must not be added across companies.",
    "magnitude": "3,898 rooms / 3 REITs",
    "asOf": "2026-10-11",
    "sourceLabel": "Callbook Tier-1 REIT exposure map (product/earnings/_index/reit-exposure-by-market.md) 2026-10-11; HST FY2025 10-K https://www.sec.gov/Archives/edgar/data/1070750/000107075026000054/hst-20251231.htm; APLE FY2025 10-K https://www.sec.gov/Archives/edgar/data/1418121/000119312526064008/aple-20251231.htm; RHP FY2025 10-K https://www.sec.gov/Archives/edgar/data/1040829/000110465926019035/rhp-20251231x10k.htm; Hyatt FY2025 10-K https://www.sec.gov/Archives/edgar/data/1468174/000146817426000007/h-20251231.htm; HST Q2 10-Q https://www.sec.gov/Archives/edgar/data/1070750/000107075026000126/hst-20260630.htm; RHP Q2 release https://www.sec.gov/Archives/edgar/data/1040829/000110465926092380/tmb-20260806xex99d1.htm; APLE Q2 call https://stockanalysis.com/stocks/aple/transcripts/660661-q2-2026/ (third-party transcript, unverified); HST Q1 call https://stockanalysis.com/stocks/hst/transcripts/560347-q1-2026/ (third-party transcript, unverified); RHP REITweek https://stockanalysis.com/stocks/rhp/transcripts/682149-nareit-reitweek-2026-investor-conference/ (third-party transcript, unverified)"
  },
  {
    "id": "reit-t1-seattle",
    "marketSlug": "seattle",
    "kind": "reit_exposure",
    "title": "Seattle REIT ownership (Callbook Tier 1): 1,951 rooms, 2 REITs",
    "body": "Rooms owned: HST 1,315 (67%); APLE 636 (33%). PK sold the 396-room Hilton Seattle Airport & Conference Center in April 2026 for $18M (10-K count 396, now 0). PEB's Skamania Lodge sits in the Portland MSA and is excluded. Disclosed share of company: HST 0.5% of 1H26 comparable Hotel EBITDA (1H26 Seattle hotel EBITDA only $5.1M). APLE market earnings share not cited (Callbook: slide-18 map unlabeled, not citable). Q2 2026 (filings): HST Seattle RevPAR −2.6%, one of its four negative markets. Calls (third-party transcript, unverified): APLE — Q1 'Seattle grew 18% with the return of Boeing production business' and shipyard project work; its Seattle Lake Union hotel is being renovated and rebranded with a ramp 'factored into next year's guidance.' Read: industrial/suburban demand is outrunning the downtown core. Decision support; shares are on different bases by company and must not be added across companies.",
    "magnitude": "1,951 rooms / 2 REITs",
    "asOf": "2026-10-11",
    "sourceLabel": "Callbook Tier-1 REIT exposure map (product/earnings/_index/reit-exposure-by-market.md) 2026-10-11; HST FY2025 10-K https://www.sec.gov/Archives/edgar/data/1070750/000107075026000054/hst-20251231.htm; APLE FY2025 10-K https://www.sec.gov/Archives/edgar/data/1418121/000119312526064008/aple-20251231.htm; PK FY2025 10-K https://www.sec.gov/Archives/edgar/data/1617406/000161740626000006/pk-20251231.htm; HST Q2 supplemental https://www.sec.gov/Archives/edgar/data/1070750/000107075026000122/hst-supplementalfinanciali.htm; PK Q1 release https://www.sec.gov/Archives/edgar/data/1617406/000161740626000030/earningsreleaseex991-live.htm; APLE Q1 call https://stockanalysis.com/stocks/aple/transcripts/566589-q1-2026/ (third-party transcript, unverified); APLE Q2 call https://stockanalysis.com/stocks/aple/transcripts/660661-q2-2026/ (third-party transcript, unverified)"
  },
  {
    "id": "reit-t1-san-francisco-bay",
    "marketSlug": "san-francisco-bay",
    "kind": "reit_exposure",
    "title": "SF Bay Area REIT ownership (Callbook Tier 1): 6,833 rooms, 4 REITs + Hyatt 821",
    "body": "Rooms owned: HST 4,162 (61%; the largest single REIT block in any Tier 1 market); PEB 1,458 (21%); PK 1,073; APLE 140. Hyatt leases Hyatt Regency San Francisco (821). PK's Hilton SF Union Square and Parc 55 were sold by a receiver in Nov 2025, before the 10-K. Disclosed share of company: PEB 10.0% of FY25 revenue; HST 6.4% of 1H26 comparable Hotel EBITDA; PK 2.8% core. APLE market earnings share not cited (Callbook: slide-18 map unlabeled, not citable). Q2 2026 (filings): PEB SF RevPAR +16.0%, Hotel EBITDA +24.6%, YTD RevPAR +29.6%; HST SF/San Jose +9.8%; PK JW Marriott SF Union Square +5.4%, Juniper Cupertino +8.5%. Calls (third-party transcript, unverified): PEB — SF 'a multi-year growth story,' YTD EBITDA at seven SF hotels up 'more than $13 million, or 110%'; PK — 2027 group pace double-digit in San Francisco; the Super Bowl moves from the Bay Area to LA in 2027. Decision support; shares are on different bases by company and must not be added across companies.",
    "magnitude": "6,833 rooms / 4 REITs",
    "asOf": "2026-10-11",
    "sourceLabel": "Callbook Tier-1 REIT exposure map (product/earnings/_index/reit-exposure-by-market.md) 2026-10-11; HST FY2025 10-K https://www.sec.gov/Archives/edgar/data/1070750/000107075026000054/hst-20251231.htm; PEB FY2025 10-K https://www.sec.gov/Archives/edgar/data/1474098/000147409826000015/peb-20251231.htm; APLE FY2025 10-K https://www.sec.gov/Archives/edgar/data/1418121/000119312526064008/aple-20251231.htm; PK FY2025 10-K https://www.sec.gov/Archives/edgar/data/1617406/000161740626000006/pk-20251231.htm; Hyatt FY2025 10-K https://www.sec.gov/Archives/edgar/data/1468174/000146817426000007/h-20251231.htm; HST Q2 10-Q https://www.sec.gov/Archives/edgar/data/1070750/000107075026000126/hst-20260630.htm; PEB Q2 release https://www.sec.gov/Archives/edgar/data/1474098/000147409826000056/a8kq2-2026erex991.htm; PK Q2 release https://www.sec.gov/Archives/edgar/data/1617406/000161740626000038/earningsreleaseex991-live.htm; PK Q2 supplement https://www.sec.gov/Archives/edgar/data/1617406/000161740626000038/supplementexhibit992-live.htm; PEB Q1 call https://stockanalysis.com/stocks/peb/transcripts/571810-q1-2026/ (third-party transcript, unverified); PEB Q2 call https://stockanalysis.com/stocks/peb/transcripts/656908-q2-2026/ (third-party transcript, unverified); PK Q2 call https://stockanalysis.com/stocks/pk/transcripts/659223-q2-2026/ (third-party transcript, unverified)"
  },
  {
    "id": "reit-t1-dallas",
    "marketSlug": "dallas",
    "kind": "reit_exposure",
    "title": "Dallas REIT ownership (Callbook Tier 1): 3,218 rooms, 2 REITs (RHP 56%)",
    "body": "Rooms owned: RHP 1,814 (56%; Gaylord Texan); APLE 1,404 (44%). CHH owns a Cambria in Fort Worth (rooms not disclosed). HST, PEB and PK own no Dallas hotels. Disclosed share of company: RHP 14.3% of 1H26 Hospitality Adj. EBITDAre. APLE market earnings share not cited (Callbook: slide-18 map unlabeled, not citable). Q2 2026 (filings): Gaylord Texan RevPAR +2.9%, Adj. EBITDAre +0.2% to $31.2M; 1H26 RevPAR −2.7% during the rooms renovation. Calls (third-party transcript, unverified): RHP — 'Nearly all the upside was driven by performance at the Gaylord Texan, which benefited from market-wide World Cup-related rate compression'; rooms renovation completes August 2026; Texan expansion still under study. APLE: no Dallas-specific 2026 commentary found. Decision support; shares are on different bases by company and must not be added across companies.",
    "magnitude": "3,218 rooms / 2 REITs",
    "asOf": "2026-10-11",
    "sourceLabel": "Callbook Tier-1 REIT exposure map (product/earnings/_index/reit-exposure-by-market.md) 2026-10-11; RHP FY2025 10-K https://www.sec.gov/Archives/edgar/data/1040829/000110465926019035/rhp-20251231x10k.htm; APLE FY2025 10-K https://www.sec.gov/Archives/edgar/data/1418121/000119312526064008/aple-20251231.htm; CHH FY2025 10-K https://www.sec.gov/Archives/edgar/data/1046311/000104631126000008/chh-20251231.htm; RHP Q2 release https://www.sec.gov/Archives/edgar/data/1040829/000110465926092380/tmb-20260806xex99d1.htm; RHP Q2 call https://stockanalysis.com/stocks/rhp/transcripts/659152-q2-2026/ (third-party transcript, unverified)"
  },
  {
    "id": "reit-t1-nashville",
    "marketSlug": "nashville",
    "kind": "reit_exposure",
    "title": "Nashville REIT ownership (Callbook Tier 1): 4,836 rooms, 3 REITs (RHP 66%)",
    "body": "Rooms owned: RHP 3,191 (66%; Gaylord Opryland + Inn); APLE 924 (19%; incl. Motto by Hilton Nashville Downtown 260, acquired 2025-12-19); HST 721. Disclosed share of company: RHP 21.9% of 1H26 Hospitality Adj. EBITDAre (its #1 market); HST 2.4%. APLE market earnings share not cited (Callbook: slide-18 map unlabeled, not citable). Q2 2026 (filings): Opryland RevPAR +7.0%, Adj. EBITDAre +5.1% to $46.0M, 1H26 +15.4%; HST Nashville RevPAR +6.0%. Calls (third-party transcript, unverified): RHP — 'we estimate Gaylord Opryland will cross $200 million of adjusted EBITDAre' in 2026; meeting-space expansion completes mid-2027; 'corporate mix on the books for next year up 14%'; at REITweek RHP noted Nashville supply increases and a planned domed stadium; APLE — Motto RevPAR 'approaching $200.' Decision support; shares are on different bases by company and must not be added across companies.",
    "magnitude": "4,836 rooms / 3 REITs",
    "asOf": "2026-10-11",
    "sourceLabel": "Callbook Tier-1 REIT exposure map (product/earnings/_index/reit-exposure-by-market.md) 2026-10-11; RHP FY2025 10-K https://www.sec.gov/Archives/edgar/data/1040829/000110465926019035/rhp-20251231x10k.htm; APLE FY2025 10-K https://www.sec.gov/Archives/edgar/data/1418121/000119312526064008/aple-20251231.htm; HST FY2025 10-K https://www.sec.gov/Archives/edgar/data/1070750/000107075026000054/hst-20251231.htm; RHP Q2 release https://www.sec.gov/Archives/edgar/data/1040829/000110465926092380/tmb-20260806xex99d1.htm; HST Q2 10-Q https://www.sec.gov/Archives/edgar/data/1070750/000107075026000126/hst-20260630.htm; RHP Q2 call https://stockanalysis.com/stocks/rhp/transcripts/659152-q2-2026/ (third-party transcript, unverified); RHP REITweek https://stockanalysis.com/stocks/rhp/transcripts/682149-nareit-reitweek-2026-investor-conference/ (third-party transcript, unverified); APLE Q1 call https://stockanalysis.com/stocks/aple/transcripts/566589-q1-2026/ (third-party transcript, unverified)"
  },
  {
    "id": "reit-t1-los-angeles",
    "marketSlug": "los-angeles",
    "kind": "reit_exposure",
    "title": "Los Angeles REIT ownership (Callbook Tier 1): 4,554 rooms, 3 REITs + Hyatt 1,425",
    "body": "Rooms owned (Callbook defines Los Angeles to include Orange County): APLE 1,944 (43%; its only #1 Tier 1 market by rooms); PEB 1,543 (34%; was 1,658 at 10-K before the 115-room Chamberlain West Hollywood sale on 2026-05-27 for $43.5M); HST 1,067. Hyatt owns/leases 4 LA-MSA hotels (1,425); CHH owns Cambria Burbank and El Segundo (rooms not disclosed). PK sold Hilton Checkers in Jan 2026, before the 10-K list. Disclosed share of company: PEB 11.0% of FY25 revenue (includes Chamberlain); HST 1.5% of 1H26 comparable Hotel EBITDA. APLE market earnings share not cited (Callbook: slide-18 map unlabeled, not citable). Q2 2026 (filings): PEB LA RevPAR +8.6% (YTD +18.8%); HST LA/Orange County +6.7%. Calls (third-party transcript, unverified): PEB — YTD EBITDA +$6M (+73%) against a '$22 million upside opportunity'; 2027 catalysts include the Super Bowl and pre-Olympic travel; PK — 'L.A. certainly wouldn't be at the top of anybody's list' for non-core buyers. Decision support; shares are on different bases by company and must not be added across companies.",
    "magnitude": "4,554 rooms / 3 REITs",
    "asOf": "2026-10-11",
    "sourceLabel": "Callbook Tier-1 REIT exposure map (product/earnings/_index/reit-exposure-by-market.md) 2026-10-11; APLE FY2025 10-K https://www.sec.gov/Archives/edgar/data/1418121/000119312526064008/aple-20251231.htm; PEB FY2025 10-K https://www.sec.gov/Archives/edgar/data/1474098/000147409826000015/peb-20251231.htm; HST FY2025 10-K https://www.sec.gov/Archives/edgar/data/1070750/000107075026000054/hst-20251231.htm; Hyatt FY2025 10-K https://www.sec.gov/Archives/edgar/data/1468174/000146817426000007/h-20251231.htm; CHH FY2025 10-K https://www.sec.gov/Archives/edgar/data/1046311/000104631126000008/chh-20251231.htm; PEB Q2 release https://www.sec.gov/Archives/edgar/data/1474098/000147409826000056/a8kq2-2026erex991.htm; HST Q2 10-Q https://www.sec.gov/Archives/edgar/data/1070750/000107075026000126/hst-20260630.htm; PK Q1 release https://www.sec.gov/Archives/edgar/data/1617406/000161740626000030/earningsreleaseex991-live.htm; PEB Q2 call https://stockanalysis.com/stocks/peb/transcripts/656908-q2-2026/ (third-party transcript, unverified); PK Q1 call https://stockanalysis.com/stocks/pk/transcripts/562185-q1-2026/ (third-party transcript, unverified)"
  },
  {
    "id": "reit-t1-honolulu",
    "marketSlug": "honolulu",
    "kind": "reit_exposure",
    "title": "Honolulu REIT ownership (Callbook Tier 1): 3,748 rooms, 2 REITs (PK 77%)",
    "body": "Rooms owned: PK 2,872 (77%; Hilton Hawaiian Village, per 10-K); HST 876 (23%). Room-count variance: PK's 10-K shows HHV at 2,872 rooms, its Q2 supplement 2,886; not explained (TBD). PK repaid the $1.275B HHV CMBS on 2026-09-30, so HHV is unencumbered. Disclosed share of company: PK 21.1% of 1H26 Hotel Adj. EBITDA (HHV is its largest asset — more than PK's other seven Tier 1 markets combined); HST 2.1% (Oahu). Q2 2026 (filings): HHV RevPAR +11.8%, Hotel Adj. EBITDA +13.3% to $41M; HST Oahu RevPAR +0.4% but Total RevPAR +11.6%; HST Hawaii Kona Low property costs estimated ~$27–32M. Calls (third-party transcript, unverified): PK — ~$100M Ali'i Tower (348 rooms) renovation started Q3, finishing early 2027; the Honolulu Convention Center partial closure is 'expected to remain closed through 2027.' Decision support; shares are on different bases by company and must not be added across companies.",
    "magnitude": "3,748 rooms / 2 REITs",
    "asOf": "2026-10-11",
    "sourceLabel": "Callbook Tier-1 REIT exposure map (product/earnings/_index/reit-exposure-by-market.md) 2026-10-11; PK FY2025 10-K https://www.sec.gov/Archives/edgar/data/1617406/000161740626000006/pk-20251231.htm; HST FY2025 10-K https://www.sec.gov/Archives/edgar/data/1070750/000107075026000054/hst-20251231.htm; PK Q2 supplement https://www.sec.gov/Archives/edgar/data/1617406/000161740626000038/supplementexhibit992-live.htm; PK 8-K HHV CMBS repayment 2026-09-30 https://www.sec.gov/Archives/edgar/data/1617406/000161740626000045/pk-20260930.htm; HST Q2 10-Q https://www.sec.gov/Archives/edgar/data/1070750/000107075026000126/hst-20260630.htm; HST Q2 release https://www.sec.gov/Archives/edgar/data/1070750/000107075026000122/hst-ex991.htm; PK Q2 call https://stockanalysis.com/stocks/pk/transcripts/659223-q2-2026/ (third-party transcript, unverified); HST Q1 call https://stockanalysis.com/stocks/hst/transcripts/560347-q1-2026/ (third-party transcript, unverified)"
  },
  {
    "id": "reit-t1-new-york-city",
    "marketSlug": "new-york-city",
    "kind": "reit_exposure",
    "title": "New York City REIT ownership (Callbook Tier 1): 6,078 rooms, 3 REITs + Hyatt 1,509",
    "body": "Rooms owned (NY–Newark–Jersey City MSA): HST 3,311 (54%; after selling Sheraton Parsippany 370 for $12M in Q2 2026); PK 1,878 (31%; after selling Hilton Short Hills 314 for $12M in July 2026); APLE 889. Hyatt owns/leases Grand Central (1,298, under contract) and Park Hyatt NY (211). 5-borough subset: HST 2,720, PK 1,878, APLE 212, Hyatt 1,509. Disclosed share of company: HST 6.4% of 1H26 comparable Hotel EBITDA (3 Manhattan hotels; NY was HST's #1 FY25 revenue market at 8.6%); PK 3.7%. APLE market earnings share not cited (Callbook: slide-18 map unlabeled, not citable). Q2 2026 (filings): HST New York RevPAR +6.3%; PK NY Hilton Midtown RevPAR +0.2%, Hotel Adj. EBITDA $18M (+6.7%). Calls (third-party transcript, unverified): HST — NY Marriott Marquis 'had 14% business transient room night growth'; PK — 2027 group pace double-digit in New York; Hyatt — 'we no longer expect the transaction to close in 2026' for Grand Central, with a ~95% asset-light earnings target by end-2028. Decision support; shares are on different bases by company and must not be added across companies.",
    "magnitude": "6,078 rooms / 3 REITs",
    "asOf": "2026-10-11",
    "sourceLabel": "Callbook Tier-1 REIT exposure map (product/earnings/_index/reit-exposure-by-market.md) 2026-10-11; HST FY2025 10-K https://www.sec.gov/Archives/edgar/data/1070750/000107075026000054/hst-20251231.htm; PK FY2025 10-K https://www.sec.gov/Archives/edgar/data/1617406/000161740626000006/pk-20251231.htm; APLE FY2025 10-K https://www.sec.gov/Archives/edgar/data/1418121/000119312526064008/aple-20251231.htm; Hyatt FY2025 10-K https://www.sec.gov/Archives/edgar/data/1468174/000146817426000007/h-20251231.htm; HST Q2 10-Q https://www.sec.gov/Archives/edgar/data/1070750/000107075026000126/hst-20260630.htm; PK Q2 release https://www.sec.gov/Archives/edgar/data/1617406/000161740626000038/earningsreleaseex991-live.htm; PK Q2 supplement https://www.sec.gov/Archives/edgar/data/1617406/000161740626000038/supplementexhibit992-live.htm; HST Q2 call https://stockanalysis.com/stocks/hst/transcripts/662252-q2-2026/ (third-party transcript, unverified); PK Q2 call https://stockanalysis.com/stocks/pk/transcripts/659223-q2-2026/ (third-party transcript, unverified); Hyatt Q2 call https://stockanalysis.com/stocks/h/transcripts/658009-q2-2026/ (third-party transcript, unverified); Hyatt Investor Day https://stockanalysis.com/stocks/h/transcripts/671909-investor-day-2026/ (third-party transcript, unverified)"
  },
  {
    "id": "reit-t1-miami",
    "marketSlug": "miami",
    "kind": "reit_exposure",
    "title": "Miami REIT ownership (Callbook Tier 1): 2,662 rooms, 4 REITs",
    "body": "Rooms owned (Miami–Fort Lauderdale–West Palm Beach MSA): HST 1,038 (39%); APLE 862 (32%); PK 393 (Royal Palm South Beach, 10-K); PEB 369. Room-count variance: Royal Palm is 393 rooms in PK's 10-K vs 404 in its Q2 supplement; not explained (TBD). Royal Palm reopened 2026-07-22 after a >$100M renovation. Disclosed share of company: HST 6.9% of 1H26 comparable Hotel EBITDA; PK −0.8% (Royal Palm closed); PEB not separable from 'Southern Florida/Georgia.' APLE market earnings share not cited (Callbook: slide-18 map unlabeled, not citable). Q2 2026 (filings): HST Miami RevPAR +13.1% (YTD +14.1%). Calls (third-party transcript, unverified): PK — 'there are $4 billion± in development projects in Miami'; stabilized Royal Palm guided to ~$28M EBITDA 'over the next few years'; HST — 1 Hotel South Beach 'benefited from the F1 Grand Prix.' Decision support; shares are on different bases by company and must not be added across companies.",
    "magnitude": "2,662 rooms / 4 REITs",
    "asOf": "2026-10-11",
    "sourceLabel": "Callbook Tier-1 REIT exposure map (product/earnings/_index/reit-exposure-by-market.md) 2026-10-11; HST FY2025 10-K https://www.sec.gov/Archives/edgar/data/1070750/000107075026000054/hst-20251231.htm; APLE FY2025 10-K https://www.sec.gov/Archives/edgar/data/1418121/000119312526064008/aple-20251231.htm; PK FY2025 10-K https://www.sec.gov/Archives/edgar/data/1617406/000161740626000006/pk-20251231.htm; PEB FY2025 10-K https://www.sec.gov/Archives/edgar/data/1474098/000147409826000015/peb-20251231.htm; HST Q2 10-Q https://www.sec.gov/Archives/edgar/data/1070750/000107075026000126/hst-20260630.htm; PK Q2 supplement https://www.sec.gov/Archives/edgar/data/1617406/000161740626000038/supplementexhibit992-live.htm; PK Q2 call https://stockanalysis.com/stocks/pk/transcripts/659223-q2-2026/ (third-party transcript, unverified); PK Q1 call https://stockanalysis.com/stocks/pk/transcripts/562185-q1-2026/ (third-party transcript, unverified); HST Q2 call https://stockanalysis.com/stocks/hst/transcripts/662252-q2-2026/ (third-party transcript, unverified)"
  },
  {
    "id": "reit-t1-chicago",
    "marketSlug": "chicago",
    "kind": "reit_exposure",
    "title": "Chicago REIT ownership (Callbook Tier 1): 5,762 rooms, 4 REITs + Hyatt 182",
    "body": "Rooms owned: PK 2,467 (43%; incl. non-core The Wade and The Midland, 923 rooms targeted for sale); HST 1,562 (27%); APLE 1,379; PEB 354. Hyatt owns Park Hyatt Chicago (182). Disclosed share of company: PEB 5.3% of FY25 revenue; PK 1.7% (Hilton Chicago, 1H); HST 1.4%. APLE market earnings share not cited (Callbook: slide-18 map unlabeled, not citable). Q2 2026 (filings): PK Hilton Chicago RevPAR +14.0%, Hotel Adj. EBITDA +23.5%, transient demand up nearly 25%; PEB Chicago RevPAR +13.7% (YTD +11.3%); HST Chicago +11.9%. Calls (third-party transcript, unverified): PEB notes the 2027 MLB All-Star Game is in Chicago; PK — 'Chicago generally a more tougher market' for non-core buyers. Decision support; shares are on different bases by company and must not be added across companies.",
    "magnitude": "5,762 rooms / 4 REITs",
    "asOf": "2026-10-11",
    "sourceLabel": "Callbook Tier-1 REIT exposure map (product/earnings/_index/reit-exposure-by-market.md) 2026-10-11; PK FY2025 10-K https://www.sec.gov/Archives/edgar/data/1617406/000161740626000006/pk-20251231.htm; HST FY2025 10-K https://www.sec.gov/Archives/edgar/data/1070750/000107075026000054/hst-20251231.htm; APLE FY2025 10-K https://www.sec.gov/Archives/edgar/data/1418121/000119312526064008/aple-20251231.htm; PEB FY2025 10-K https://www.sec.gov/Archives/edgar/data/1474098/000147409826000015/peb-20251231.htm; Hyatt FY2025 10-K https://www.sec.gov/Archives/edgar/data/1468174/000146817426000007/h-20251231.htm; PK Q2 release https://www.sec.gov/Archives/edgar/data/1617406/000161740626000038/earningsreleaseex991-live.htm; PK Q2 supplement https://www.sec.gov/Archives/edgar/data/1617406/000161740626000038/supplementexhibit992-live.htm; PEB Q2 release https://www.sec.gov/Archives/edgar/data/1474098/000147409826000056/a8kq2-2026erex991.htm; HST Q2 10-Q https://www.sec.gov/Archives/edgar/data/1070750/000107075026000126/hst-20260630.htm; PEB Q2 call https://stockanalysis.com/stocks/peb/transcripts/656908-q2-2026/ (third-party transcript, unverified); PK Q1 call https://stockanalysis.com/stocks/pk/transcripts/562185-q1-2026/ (third-party transcript, unverified)"
  }
];
