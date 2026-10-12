import type { SweepSignal } from "./sweep-2026-10-11.data";

// Vectra wave-1 demand (D3/D6/D7/D8 table rows, 15 Tier 1 markets) + Wave 1 90-day compression calendar,
// cross-market demand flags, Atlas San Diego supply/pipeline, Atlas Dallas rows (Matthews Q3 2025, Quill-cleared),
// Houston submarket rows (Houston First Aug/Jul/YE2025, Quill-cleared), Grand Hyatt Miami Beach pipeline row (deduped).
// Vectra hold (8:47 PM ET): citywide rows tagged verify / not pulled / not captured, or with no cited URL, excluded.
// Verdict bullets not loaded (uncited). "No public read" rows kept as written. Decision support. Human touch first.
export const DEMAND_W1_2026_10_11: SweepSignal[] = [
  {
    "id": "w1d-atlanta-d3",
    "marketSlug": "atlanta",
    "kind": "visitation",
    "title": "Atlanta visitation / demand volume (D3) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Atlanta visitation / demand volume (D3). Atlanta visitors 2024 (latest ACVB): ~51M (est.); $20B hospitality industry (page fetched 2026-10-11; source: https://discoveratlanta.com/acvb/) | Georgia statewide visitors 2025: 175.6M; $46.2B spend; $84.1B impact (2026-09-30; source: https://gov.georgia.gov/press-releases/2026-09-30/gov-kemp-georgia-breaks-tourism-records-four-years-straight) | GWCCA campus FY25 (Jul 24–Jun 25): 1.15M out-of-state visitors; $1.94B economic impact (2025-10; source: https://www.gwcca.org/wp-content/uploads/2025/10/GWCCA-FY25-Economic-Impact-Study.pdf) | World Cup room nights: ~442,000 booked by Cup visitors; OCC down ~4% vs 2025 (2026-09; source: https://www.ajc.com/business/2026/09/new-data-hotel-occupancy-dipped-year-over-year-during-world-cup/) | Atlanta 2025 visitor count: no public read (ACVB page still cites 2024) | Leisure vs group split: no public read. Decision support; 'no public read' rows are kept as written.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-atlanta.md 2026-10-11; https://discoveratlanta.com/acvb/; https://gov.georgia.gov/press-releases/2026-09-30/gov-kemp-georgia-breaks-tourism-records-four-years-straight; https://www.gwcca.org/wp-content/uploads/2025/10/GWCCA-FY25-Economic-Impact-Study.pdf; https://www.ajc.com/business/2026/09/new-data-hotel-occupancy-dipped-year-over-year-during-world-cup/"
  },
  {
    "id": "w1d-atlanta-d6",
    "marketSlug": "atlanta",
    "kind": "airlift",
    "title": "Atlanta airlift / air access demand (D6) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Atlanta airlift / air access demand (D6). Jul 2026 total pax: 9,760,810 (−2.25% YoY) (2026-08; source: https://www.atl.com/wp-content/uploads/2026/08/ATL-ATR-2607.pdf) | Jul 2026 dom / intl: 8,376,798 (−2.05%) / 1,384,012 (−3.48%) (2026-08; source: same → https://www.atl.com/wp-content/uploads/2026/08/ATL-ATR-2607.pdf) | YTD Jul 2026 total: 61,719,824 (−0.59%); intl 8,730,897 (−1.96%) = 14.1% share (2026-08; source: same → https://www.atl.com/wp-content/uploads/2026/08/ATL-ATR-2607.pdf) | Carrier share Jul / YTD: Delta 76.04% / 75.52% (+Endeavor 3.91%); Frontier 6.97%; Southwest 3.51%; AA 2.34% (2026-08; source: same → https://www.atl.com/wp-content/uploads/2026/08/ATL-ATR-2607.pdf) | Spirit: 503,941 YTD pax; 0 in Jul 2026 (exit) (2026-08; source: same → https://www.atl.com/wp-content/uploads/2026/08/ATL-ATR-2607.pdf) | BTS T12 to Jul 2026 (US carriers): Arrivals 43,998k (−2.28%); Delta 74.88% (data as of 2026-10-11; source: https://www.transtats.bts.gov/airports.asp?Airport=ATL) | Aug 2026 total / YTD: 9,214,729 (−0.88% vs 9,296,701); YTD Aug 70,934,553 (−0.63%); intl Aug 1,287,616 (−1.76%) = 14.0%; Delta mainline 76.93% of Aug pax (Aug 2026 report; source: https://www.atl.com/wp-content/uploads/2026/09/ATL-ATR-2608_revA.pdf (accessed 2026-10-11)) | Winter 2026–27 adds/cuts: no public read this pass. Decision support; 'no public read' rows are kept as written.",
    "magnitude": "8 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-atlanta.md 2026-10-11; https://www.atl.com/wp-content/uploads/2026/08/ATL-ATR-2607.pdf; https://www.transtats.bts.gov/airports.asp?Airport=ATL; https://www.atl.com/wp-content/uploads/2026/09/ATL-ATR-2608_revA.pdf"
  },
  {
    "id": "w1d-atlanta-d7",
    "marketSlug": "atlanta",
    "kind": "citywide_calendar",
    "title": "Atlanta group / citywide demand calendar (D7) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Atlanta group / citywide demand calendar (D7). Dec 5, 2026: SEC Championship (MBS) + Dr Pepper SEC FanFare (GWCC) · no public read for 2026 (source: https://www.mercedesbenzstadium.com/events/sec-championship-4 · https://www.ncaa.com/news/football/article/2026-06-01/2026-sec-championship-game-date-time-tv-channel-history) | Jan 1, 2027: Chick-fil-A Peach Bowl — CFP Quarterfinal (MBS) · no public read; prior Peach Bowl (Jan 9, 2026) drew 75,604 (source: https://chick-fil-apeachbowl.com/news/2026/2/3/general-chick-fil-a-peach-bowl-dates-announced-for-2026-2027.aspx · https://en.wikipedia.org/wiki/2026_Peach_Bowl) | Nov 13–15, 2026: MagicCon: Atlanta (GWCC Bldg C) · no public read (source: https://mcatlanta.mtgfestivals.com/en-us/info/faq.html (accessed 2026-10-11)) | Nov 19–22, 2026: Anime Weekend Atlanta (GWCC Bldg C) · no public read (source: https://awa-con.com/ (accessed 2026-10-11)) | Dec 9–13, 2026 (exhibits Dec 9–12): NeurIPS 2026 Atlanta satellite (GWCC Hall C2; NeurIPS 2026 split across Sydney / Atlanta / Paris) · no public read (source: https://neurips.cc/Conferences/2026/VenueInformation (accessed 2026-10-11)) | Other GWCC Nov–Dec dates (Nov 4–6, Nov 8, Nov 18, Dec 14): no public read: names surfaced only in search summaries of the official calendar; gwcca.org and gwcc.com both blocked on fetch (Cloudflare challenge / SSL 526), so they are not confirmed · https://www.gwcca.org/event-calendar (source: checked 2026-10-11) | 2027 citywide gains/losses: no public read | 2028 anchor: Super Bowl LXII at MBS, Feb 13, 2028 (NFL announced Oct 15, 2024) · https://www.nfl.com/news/mercedes-benz-stadium-in-atlanta-to-host-super-bowl-lxii-in-2028 · https://www.mercedesbenzstadium.com/events/super-bowl-lxii (accessed 2026-10-11) (source: 2024-10-15). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "8 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-atlanta.md 2026-10-11; https://www.mercedesbenzstadium.com/events/sec-championship-4; https://www.ncaa.com/news/football/article/2026-06-01/2026-sec-championship-game-date-time-tv-channel-history; https://chick-fil-apeachbowl.com/news/2026/2/3/general-chick-fil-a-peach-bowl-dates-announced-for-2026-2027.aspx; https://en.wikipedia.org/wiki/2026_Peach_Bowl; https://mcatlanta.mtgfestivals.com/en-us/info/faq.html; https://awa-con.com/; https://neurips.cc/Conferences/2026/VenueInformation; https://www.gwcca.org/event-calendar; https://www.nfl.com/news/mercedes-benz-stadium-in-atlanta-to-host-super-bowl-lxii-in-2028; https://www.mercedesbenzstadium.com/events/super-bowl-lxii"
  },
  {
    "id": "w1d-atlanta-d8",
    "marketSlug": "atlanta",
    "kind": "drive",
    "title": "Atlanta drive + attraction demand anchors (D8) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Atlanta drive + attraction demand anchors (D8). Drive catchment: Southeast hub: I-75 (Chattanooga/Knoxville, Macon/FL), I-85 (Charlotte/Greenville, Montgomery), I-20 (Birmingham, Augusta) (source: geography) | Attractions: Georgia Aquarium, World of Coca-Cola, Centennial Olympic Park (GWCCA campus); MBS, State Farm Arena, Truist Park (2025-10; source: GWCCA FY25 study (above) → https://www.gwcca.org/wp-content/uploads/2025/10/GWCCA-FY25-Economic-Impact-Study.pdf) | Gas: National $4.36 (Oct 8). Georgia typically below national (GA figure not pulled). Regional drive-in for college football weekends is gas-sensitive at the margin (2026-10-08; source: https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-atlanta.md 2026-10-11; https://www.gwcca.org/wp-content/uploads/2025/10/GWCCA-FY25-Economic-Impact-Study.pdf; https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/"
  },
  {
    "id": "w1d-boston-d3",
    "marketSlug": "boston",
    "kind": "visitation",
    "title": "Boston visitation / demand volume (D3) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Boston visitation / demand volume (D3). Domestic visitors 2025: 38.7M (Longwoods) (2026 (page fetched 2026-10-11); source: https://www.meetboston.com/press-room/statistics-and-reports/) | Domestic spend 2025: $14.08B (2026; source: same → https://www.meetboston.com/press-room/statistics-and-reports/) | Domestic avg stay / repeat: 3.2 days / 62% (2026; source: same → https://www.meetboston.com/press-room/statistics-and-reports/) | International visitors 2025: 2.2M (2026; source: same → https://www.meetboston.com/press-room/statistics-and-reports/) | 2025 citywide hotel OCC: 72.5% (−2%) (early 2026 (pub. date not captured); source: https://bankerandtradesman.com/for-boston-hotels-2026-is-a-year-of-cautious-optimism/) | Convention attendance 2025 vs 2019: <700,000 vs 830,000 (early 2026; source: same → https://bankerandtradesman.com/for-boston-hotels-2026-is-a-year-of-cautious-optimism/) | Canadian visitors 2025 / 2026 proj.: ~650–700k / ~600k (2026 (pub. date not captured); source: https://bankerandtradesman.com/boston-lodging-industry-covets-canadian-comeback/) | 2027 forecast (Greater Boston): OCC 78%, ADR +1.6%, RevPAR ~+1.8% (Pinnacle) (2026-10 (MLA Annual Outlook); source: https://www.hospitalitynet.org/news/4134047/pinnacle-advisory-group-forecasts-continued-growth-for-greater-boston-lodging-market-in-2027) | Leisure vs business vs group RN split: no public read (Meet Boston publishes visitor counts, not a segment RN split). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "9 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-boston.md 2026-10-11; https://www.meetboston.com/press-room/statistics-and-reports/; https://bankerandtradesman.com/for-boston-hotels-2026-is-a-year-of-cautious-optimism/; https://bankerandtradesman.com/boston-lodging-industry-covets-canadian-comeback/; https://www.hospitalitynet.org/news/4134047/pinnacle-advisory-group-forecasts-continued-growth-for-greater-boston-lodging-market-in-2027"
  },
  {
    "id": "w1d-boston-d6",
    "marketSlug": "boston",
    "kind": "airlift",
    "title": "Boston airlift / air access demand (D6) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Boston airlift / air access demand (D6). 2025 total pax: 43,236,013; domestic 33,135,252; international 10,030,775 (~23%) (2026; source: https://www.meetboston.com/press-room/statistics-and-reports/) | 2025 flights: 407,116 (2026; source: same → https://www.meetboston.com/press-room/statistics-and-reports/) | Jul 2026: 4.2M pax, a monthly record (Massport board) (2026-09-10; source: https://massportcac.org/wp-content/uploads/2026/09/Massport-Board-Meeting-9-10-26.pdf) | Massport cruise pax: 480,000 (board summary; period not specified) (2026-09-10; source: same → https://massportcac.org/wp-content/uploads/2026/09/Massport-Board-Meeting-9-10-26.pdf) | Latest-month YoY / YTD 2026: no public read (Massport stats page did not return to curl; aggregator PDFs mislabeled, not used) (source: https://www.massport.com/logan-airport/about-logan/airport-statistics) | Carrier mix: no public read this pass (JetBlue/Delta are the major BOS carriers by schedule; share % not pulled) | Winter 2026–27 route adds/cuts: no public read this pass. Decision support; 'no public read' rows are kept as written.",
    "magnitude": "7 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-boston.md 2026-10-11; https://www.meetboston.com/press-room/statistics-and-reports/; https://massportcac.org/wp-content/uploads/2026/09/Massport-Board-Meeting-9-10-26.pdf; https://www.massport.com/logan-airport/about-logan/airport-statistics"
  },
  {
    "id": "w1d-boston-d7",
    "marketSlug": "boston",
    "kind": "citywide_calendar",
    "title": "Boston group / citywide demand calendar (D7) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Boston group / citywide demand calendar (D7). Oct 12–13, 2026: AHCA/NCAL Convention (BCEC) · no public read (source: https://www.signatureboston.com/events) | Oct 14–15: World Patient Safety Congress Americas (BCEC) · no public read (source: same → https://www.signatureboston.com/events) | Oct 15–17: ASCO Quality Care Symposium (Hynes) · no public read (source: same → https://www.signatureboston.com/events) | Oct 18–20: Veeva R&D and Quality Summit (BCEC) · no public read (source: same → https://www.signatureboston.com/events) | Oct 19–21: AdvaMed MedTech Conference (BCEC) · 4,000+ expected (source: https://www.tradeshoweventdirectory.com/shows/the-medtech-conference-boston) | Dec 10, 2026: Massachusetts Conference for Women (MCEC, formerly BCEC; 415 Summer St; one-day, 8am–5pm; tickets sold out) · Organizer page gives no count (no public read). ~15,000 expected per SUCCESS Events listing (secondary) (source: https://www.conferencesforwomen.org/ma/ (accessed 2026-10-11) · https://www.success.events/events/massachusetts-conference-for-women-2026) | Nov 2026 – Jan 2027 BCEC citywides: no public read (Signature Boston listing returned only Oct rows on fetch) | 2027 citywide gains/losses: no public read. Decision support; 'no public read' rows are kept as written.",
    "magnitude": "8 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-boston.md 2026-10-11; https://www.signatureboston.com/events; https://www.tradeshoweventdirectory.com/shows/the-medtech-conference-boston; https://www.conferencesforwomen.org/ma/; https://www.success.events/events/massachusetts-conference-for-women-2026"
  },
  {
    "id": "w1d-boston-d8",
    "marketSlug": "boston",
    "kind": "drive",
    "title": "Boston drive + attraction demand anchors (D8) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Boston drive + attraction demand anchors (D8). Drive catchment: New England via I-90/I-93/I-95; NYC via I-95 plus Amtrak NEC (rail substitute); Montreal/Quebec drive market (Canada hole) (source: geography) | Attractions: Universities (move-in/graduation/parents' weekends), Fenway, TD Garden, Freedom Trail/A250 (source: geography) | Cruise: Flynn Cruiseport; 480,000 cruise pax (Massport board) (2026-09-10; source: Massport board PDF above → https://massportcac.org/wp-content/uploads/2026/09/Massport-Board-Meeting-9-10-26.pdf) | Gas: National $4.36 (Oct 8, first October >$4). New England drive weekends feel it; rail dampens for NYC (2026-10-08; source: https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-boston.md 2026-10-11; https://massportcac.org/wp-content/uploads/2026/09/Massport-Board-Meeting-9-10-26.pdf; https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/"
  },
  {
    "id": "w1d-chicago-d3",
    "marketSlug": "chicago",
    "kind": "visitation",
    "title": "Chicago visitation / demand volume (D3) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Chicago visitation / demand volume (D3). Visitors 2025: 56.8M (+nearly 1.5M vs 2024) (2026-06-25; source: https://www.choosechicago.com/press-media/press-releases/chicago-welcomes-56-8-million-tourists-in-2025-generating-a-record-breaking-21-5-billion-in-spending/) | Spend / jobs 2025: $21.5B record direct spend; 135,360 jobs (2026-06-25; source: same → https://www.choosechicago.com/press-media/press-releases/chicago-welcomes-56-8-million-tourists-in-2025-generating-a-record-breaking-21-5-billion-in-spending/) | Leisure repeat intent: 92% of leisure travelers plan to return within 3 years (2026-06-25; source: same → https://www.choosechicago.com/press-media/press-releases/chicago-welcomes-56-8-million-tourists-in-2025-generating-a-record-breaking-21-5-billion-in-spending/) | Leisure / group / business mix: no public read (the release links to a data page; no free mix split pulled) | CBD hotel 2025: OCC 69.2%; ADR $243.10; RevPAR $168.15 (2026-01; source: https://cdn.choosechicago.com/uploads/2026/01/Hotel-Performance-2025.pdf (registry)) | 2026 RevPAR YTD Aug: +11.6% (2nd of top markets after SF), attributed to World Cup-displaced meetings (2026-09 (CoStar post); source: https://www.linkedin.com/posts/costar_top-us-hotel-markets-in-2026-activity-7506699098205585408-so1V) | Week Aug 2–8, 2026: ADR +15.2% to $206.21 (largest of Top 25); RevPAR +23.8% to $176.93 (2026-08-13; source: https://www.htrends.com/trends-detail-sid-142497.html) | 2026 YTD OCC level: no public read (CoStar post gives % change only). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "8 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-chicago.md 2026-10-11; https://www.choosechicago.com/press-media/press-releases/chicago-welcomes-56-8-million-tourists-in-2025-generating-a-record-breaking-21-5-billion-in-spending/; https://cdn.choosechicago.com/uploads/2026/01/Hotel-Performance-2025.pdf; https://www.linkedin.com/posts/costar_top-us-hotel-markets-in-2026-activity-7506699098205585408-so1V; https://www.htrends.com/trends-detail-sid-142497.html"
  },
  {
    "id": "w1d-chicago-d6",
    "marketSlug": "chicago",
    "kind": "airlift",
    "title": "Chicago airlift / air access demand (D6) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Chicago airlift / air access demand (D6). ORD July 2026 pax: 8,540,764 (+3.21%) (report dated 2026-09-25; source: https://www.flychicago.com/SiteCollectionDocuments/Business/AccessiblePDFs/FactsandFigures/AirTraffic/0726%20ORD%20SUMMARY.pdf) | ORD YTD Jul 2026: 51,331,341 (+6.1%) (2026-09-25; source: same → https://www.flychicago.com/SiteCollectionDocuments/Business/AccessiblePDFs/FactsandFigures/AirTraffic/0726%20ORD%20SUMMARY.pdf) | ORD international: Jul 1,610,207 (+4.29%) = 18.9% of pax; YTD 9,309,569 (+8.19%); customs YTD 3,803,697 (+8.12%) (2026-09-25; source: same (share computed) → https://www.flychicago.com/SiteCollectionDocuments/Business/AccessiblePDFs/FactsandFigures/AirTraffic/0726%20ORD%20SUMMARY.pdf) | ORD operations: Jul 82,365 (+5.52%); YTD +10.57%; intl air-carrier ops YTD +9.83% (2026-09-25; source: same → https://www.flychicago.com/SiteCollectionDocuments/Business/AccessiblePDFs/FactsandFigures/AirTraffic/0726%20ORD%20SUMMARY.pdf) | MDW July 2026 pax: 2,095,965 (+1.95%); YTD 11,370,176 (+2.62%) (2026-09-25; source: https://www.flychicago.com/SiteCollectionDocuments/Business/AccessiblePDFs/FactsandFigures/AirTraffic/0726%20MDW%20SUMMARY.pdf) | MDW international: YTD 391,748 (−11.8%); Jul −10.31% (2026-09-25; source: same → https://www.flychicago.com/SiteCollectionDocuments/Business/AccessiblePDFs/FactsandFigures/AirTraffic/0726%20MDW%20SUMMARY.pdf) | Aug 2026 ORD/MDW: no public read yet (CDA's latest posted is July). Do NOT use the ctfassets \"Aug 2026 4,149,332\" PDF that search labels as O'Hare: it's Las Vegas Harry Reid (2026-10-11; source: flychicago air-traffic page https://www.flychicago.com/business/CDA/factsfigures/Pages/airtraffic.aspx) | Carrier mix (United/American share): no public read (CDA summaries are by class, not carrier) | Oct 2026–Mar 2027 route adds/cuts: no public read (no free schedule source pulled). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "9 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-chicago.md 2026-10-11; https://www.flychicago.com/SiteCollectionDocuments/Business/AccessiblePDFs/FactsandFigures/AirTraffic/0726%20ORD%20SUMMARY.pdf; https://www.flychicago.com/SiteCollectionDocuments/Business/AccessiblePDFs/FactsandFigures/AirTraffic/0726%20MDW%20SUMMARY.pdf; https://www.flychicago.com/business/CDA/factsfigures/Pages/airtraffic.aspx"
  },
  {
    "id": "w1d-chicago-d7",
    "marketSlug": "chicago",
    "kind": "citywide_calendar",
    "title": "Chicago group / citywide demand calendar (D7) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Chicago group / citywide demand calendar (D7). PACK EXPO International: Oct 18–21 · McCormick; ~48,000 projected attendees (source: https://www.packexpointernational.com/the-show?pr=MED1) | ANCC Magnet & Pathway Conference: Oct 29–31, 2026 (exhibits Oct 29–30) · McCormick; attendance no public read (source: https://magnetpathwaycon.nursingworld.org/faqs-2026-magnet-pathway-conference (accessed 2026-10-11)) | Resuscitation Science Symposium (AHA ReSS): Nov 7–8, 2026 · McCormick; attendance no public read (source: https://professional.heart.org/en/meetings/resuscitation-science-symposium (accessed 2026-10-11)) | RSNA 2026: Nov 29–Dec 3 (exhibits Nov 29–Dec 2) · McCormick; 700+ exhibiting companies; attendee count no public read (source: https://www.rsna.org/news/2026/october/rsna-2026-technical-exhibits) | Midwest Clinic: Dec 16–18 · McCormick; 18,000+ annual attendees (source: https://www.midwestclinic.org/Conference_Dates) | ABCA Convention (incl. trade show): Jan 7–10, 2027 · McCormick; attendance no public read (source: https://www.abca.org/convention (accessed 2026-10-11)) | 2027 gains: RSNA 2027 Nov 14–18; ASTA Feb 24–27; IFT FIRST Jul 11–14; AAP Oct 15–19 (listing) · https://www.rsna.org/annual-meeting/future-and-past-meetings ; expofp listing (source: 2026-10) | 2027 pace / losses: no public read (no McCormick/Choose Chicago 2027 pace release found). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "8 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-chicago.md 2026-10-11; https://www.packexpointernational.com/the-show?pr=MED1; https://magnetpathwaycon.nursingworld.org/faqs-2026-magnet-pathway-conference; https://professional.heart.org/en/meetings/resuscitation-science-symposium; https://www.rsna.org/news/2026/october/rsna-2026-technical-exhibits; https://www.midwestclinic.org/Conference_Dates; https://www.abca.org/convention; https://www.rsna.org/annual-meeting/future-and-past-meetings"
  },
  {
    "id": "w1d-chicago-d8",
    "marketSlug": "chicago",
    "kind": "drive",
    "title": "Chicago drive + attraction demand anchors (D8) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Chicago drive + attraction demand anchors (D8). Drive arteries: I-90/94, I-55, I-57, I-65 (NW Indiana), I-88, I-294 tollway ring; Midwest catchment (Milwaukee, Indianapolis, Detroit, St. Louis); Amtrak Midwest hub (source: general geography; no number) | Anchors: Museum Campus, Navy Pier, Art Institute, Magnificent Mile, Bears/Bulls/Blackhawks, United Center, Chicago Marathon (Oct 11) | Illinois/Chicago gas price: no public read pulled (looked only at national) | National gas context: $4.36 national avg Oct 8, 2026; first October ever above $4. That's a drive-in headwind from the Midwest catchment in Q4 (2026-10-08; source: https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/) | Mobility: Overlay only, not underwritten (source: rules). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-chicago.md 2026-10-11; https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/"
  },
  {
    "id": "w1d-dallas-d3",
    "marketSlug": "dallas",
    "kind": "visitation",
    "title": "Dallas visitation / demand volume (D3) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Dallas visitation / demand volume (D3). Dallas visitors 2024 (latest): 27.7M (record); $10.9B economic impact; $649M state/local tax (2025-11-14; source: https://www.dallasexaminer.com/business-news/dallas-tourism-record-year-283652 · https://municue.com/tx/dallas-county/dallas/events/2025-11-14-dallas-tourism-reaches-new-heights-as-city-steps-onto-the-global-stage) | Visit Dallas FY2025 bookings: >1,400 events; $1.56B economic impact (2025-11; source: same → https://www.dallasexaminer.com/business-news/dallas-tourism-record-year-283652 https://municue.com/tx/dallas-county/dallas/events/2025-11-14-dallas-tourism-reaches-new-heights-as-city-steps-onto-the-global-stage) | City of Dallas HOT FY2025 (registry): Ch.351 7% / $79.31M; Ch.334 venue 2% / $23.87M (tax proxy, not RevPAR) (2026-09-28; source: /workspace/bungah-capital-intel/src/data/msa-registry.ts (Texas HOT SODA er34-v24h)) | 2025 visitor count: no public read (Visit Dallas 2025 release not found) | Leisure vs business vs group split: no public read. Decision support; 'no public read' rows are kept as written.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-dallas.md 2026-10-11; https://www.dallasexaminer.com/business-news/dallas-tourism-record-year-283652; https://municue.com/tx/dallas-county/dallas/events/2025-11-14-dallas-tourism-reaches-new-heights-as-city-steps-onto-the-global-stage"
  },
  {
    "id": "w1d-dallas-d6",
    "marketSlug": "dallas",
    "kind": "airlift",
    "title": "Dallas airlift / air access demand (D6) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Dallas airlift / air access demand (D6). DFW Aug 2026 total: 7,381,566 (−0.1% vs 7,390,151) (2026-09/10; source: https://assets.ctfassets.net/m2p70vmwc019/2w5QLr9LCBpHOPqGJ3B7nt/9108370d5ec32612e661d990bccaeb1f/Aug_2026_Pax_Report.pdf) | DFW Aug dom / intl: 6,283,542 (−0.5%) / 1,098,024 (+2.4%); intl share 14.9% (same; source: same → https://assets.ctfassets.net/m2p70vmwc019/2w5QLr9LCBpHOPqGJ3B7nt/9108370d5ec32612e661d990bccaeb1f/Aug_2026_Pax_Report.pdf) | DFW CYTD Aug: 56,823,397 (−1.0%); intl 8,715,631 (+1.5%) (same; source: same → https://assets.ctfassets.net/m2p70vmwc019/2w5QLr9LCBpHOPqGJ3B7nt/9108370d5ec32612e661d990bccaeb1f/Aug_2026_Pax_Report.pdf) | DFW T12 Aug: 85,091,608 (−1.7%) (same; source: same → https://assets.ctfassets.net/m2p70vmwc019/2w5QLr9LCBpHOPqGJ3B7nt/9108370d5ec32612e661d990bccaeb1f/Aug_2026_Pax_Report.pdf) | American (incl. regional): 6,075,847 Aug (−1.2%); share 82.3% (83.2% LY) (same; source: same → https://assets.ctfassets.net/m2p70vmwc019/2w5QLr9LCBpHOPqGJ3B7nt/9108370d5ec32612e661d990bccaeb1f/Aug_2026_Pax_Report.pdf) | Love Field (DAL) 2026: no public read this pass (passenger-stats page lists annual totals; no 2026 monthly pulled) (source: https://www.dallas-lovefield.com/airport-info/airport-news/passenger-statistics) | Winter 2026–27 adds/cuts: no public read this pass. Decision support; 'no public read' rows are kept as written.",
    "magnitude": "7 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-dallas.md 2026-10-11; https://assets.ctfassets.net/m2p70vmwc019/2w5QLr9LCBpHOPqGJ3B7nt/9108370d5ec32612e661d990bccaeb1f/Aug_2026_Pax_Report.pdf; https://www.dallas-lovefield.com/airport-info/airport-news/passenger-statistics"
  },
  {
    "id": "w1d-dallas-d7",
    "marketSlug": "dallas",
    "kind": "citywide_calendar",
    "title": "Dallas group / citywide demand calendar (D7) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Dallas group / citywide demand calendar (D7). through Oct 18, 2026: State Fair of Texas (Fair Park; listed Oct 11–18 window) · no public read (source: https://www.fairparkdallas.com/events) | Nov 18–22, 2026: HYROX Dallas 2026 (KBHCCD) · no public read (source: https://www.dallasconventioncenter.com/events/detail/hyrox-dallas-2026) | Jan 1, 2027: Cotton Bowl, CFP Quarterfinal (AT&T Stadium, Arlington) · no public read (source: https://www.ncaa.com/news/football/article/2026-08-04/2026-27-college-football-playoff-schedule-dates-tv-channel-sites) | KBHCCD construction: Halls D–F demolition through Dec 2026; Halls A–C operating; foundations late 2026 → 2028; expanded center 2030 · https://content.govdelivery.com/accounts/TXDALLAS/bulletins/40b8764 · https://www.dallasccmasterplan.com/conventioncenterexpansion (source: 2026) | 2027 citywide losses from reduced halls: no public read (no list of displaced citywides found) | Full KBHCCD Oct–Jan calendar: no public read this pass. Decision support; 'no public read' rows are kept as written.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-dallas.md 2026-10-11; https://www.fairparkdallas.com/events; https://www.dallasconventioncenter.com/events/detail/hyrox-dallas-2026; https://www.ncaa.com/news/football/article/2026-08-04/2026-27-college-football-playoff-schedule-dates-tv-channel-sites; https://content.govdelivery.com/accounts/TXDALLAS/bulletins/40b8764; https://www.dallasccmasterplan.com/conventioncenterexpansion"
  },
  {
    "id": "w1d-dallas-d8",
    "marketSlug": "dallas",
    "kind": "drive",
    "title": "Dallas drive + attraction demand anchors (D8) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Dallas drive + attraction demand anchors (D8). Drive catchment: Texas Triangle via I-35 (Austin/San Antonio, Oklahoma City), I-45 (Houston), I-20/I-30 (Shreveport, Fort Worth/West TX) (source: geography) | Stadiums: AT&T Stadium (Cowboys, Cotton Bowl, WC), Globe Life Field, American Airlines Center; Arlington entertainment district (source: geography) | State Fair: Multi-week drive-in event at Fair Park (2026; source: Fair Park (above) → https://www.fairparkdallas.com/events) | Gas: National $4.36 (Oct 8, first October >$4). TX usually below national (TX figure not pulled). A drive-heavy regional market; friction hits weekend leisure first (2026-10-08; source: https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-dallas.md 2026-10-11; https://www.fairparkdallas.com/events; https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/"
  },
  {
    "id": "w1d-honolulu-d3",
    "marketSlug": "honolulu",
    "kind": "visitation",
    "title": "Honolulu visitation / demand volume (D3) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Honolulu visitation / demand volume (D3). Oʻahu arrivals Aug 2026: 474,742 (−6.0%) (2026-09-30; source: https://files.hawaii.gov/dbedt/economic/tourism/monthly-highlights/press-release-2026-08.pdf) | Oʻahu spend Aug 2026: $754.5M (−6.8%) (2026-09-30; source: same → https://files.hawaii.gov/dbedt/economic/tourism/monthly-highlights/press-release-2026-08.pdf) | Oʻahu YTD Aug arrivals / spend: 3,861,872 (+0.6%) / $6,789.9M (+6.3%) (2026-09-30; source: same → https://files.hawaii.gov/dbedt/economic/tourism/monthly-highlights/press-release-2026-08.pdf) | Oʻahu avg daily census YTD: 110,322 (−0.5%) (2026-09-30; source: same → https://files.hawaii.gov/dbedt/economic/tourism/monthly-highlights/press-release-2026-08.pdf) | Oʻahu LOS YTD / per-person-per-day spend YTD: 6.94 days (−1.2%) / $253.3 (+6.9%) (2026-09-30; source: same → https://files.hawaii.gov/dbedt/economic/tourism/monthly-highlights/press-release-2026-08.pdf) | Statewide Aug / YTD visitors: 772,039 (−5.6%) / 6,693,107 (+1.8%) (2026-09-30; source: same → https://files.hawaii.gov/dbedt/economic/tourism/monthly-highlights/press-release-2026-08.pdf) | Statewide Aug by market: US West 399,695 (−4.5%); US East 185,962 (−4.5%); Japan 81,814 (−9.7%); Canada 24,041 (+0.6%); other intl 78,650 (−12.5%) (2026-09-30; source: same → https://files.hawaii.gov/dbedt/economic/tourism/monthly-highlights/press-release-2026-08.pdf) | Leisure vs MCI split (Oʻahu): no public read this pass (HTA publishes purpose-of-trip in its tables; not parsed) | Oʻahu hotel OCC/ADR 2026: no public read this pass (HTA hotel report not pulled). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "9 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-honolulu.md 2026-10-11; https://files.hawaii.gov/dbedt/economic/tourism/monthly-highlights/press-release-2026-08.pdf"
  },
  {
    "id": "w1d-honolulu-d6",
    "marketSlug": "honolulu",
    "kind": "airlift",
    "title": "Honolulu airlift / air access demand (D6) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Honolulu airlift / air access demand (D6). Statewide transpacific seats Aug 2026: 1,106,477 (−0.7%); flights 5,038 (+0.7%) (2026-09-30; source: DBEDT Aug release (above) → https://files.hawaii.gov/dbedt/economic/tourism/monthly-highlights/press-release-2026-08.pdf) | Japan nonstop seats Q4 2026 (HNL only): Oct 98,568 / Nov 103,512 / Dec 107,718 (preliminary) (as of 2026-08-14; source: https://assets.simpleviewinc.com/simpleview/image/upload/v1/clients/hawaii/12_Air_Service_Grid_December_2026_as_of_08_14_26_55e9fdb3-b738-4089-a9a8-1fa08577fa2c.pdf (and Oct/Nov grids)) | Canada nonstop seats Q4 2026 (statewide): Oct 18,231 / Nov 38,724 / Dec 46,846 (preliminary) (as of 2026-08-14; source: same grids → https://assets.simpleviewinc.com/simpleview/image/upload/v1/clients/hawaii/12_Air_Service_Grid_December_2026_as_of_08_14_26_55e9fdb3-b738-4089-a9a8-1fa08577fa2c.pdf) | HNL monthly airport pax: no public read this pass (HDOT stats not pulled; HTA seats used instead) | YoY for Q4 seat grids: no public read (the grids give 2026 schedules without a prior-year column in the parsed text) | Carrier mix: US mainland: Alaska/Hawaiian, United, Southwest, American, Delta (from grids). Share % no public read (as of 2026-08-14; source: HVCB grids). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-honolulu.md 2026-10-11; https://files.hawaii.gov/dbedt/economic/tourism/monthly-highlights/press-release-2026-08.pdf; https://assets.simpleviewinc.com/simpleview/image/upload/v1/clients/hawaii/12_Air_Service_Grid_December_2026_as_of_08_14_26_55e9fdb3-b738-4089-a9a8-1fa08577fa2c.pdf"
  },
  {
    "id": "w1d-honolulu-d7",
    "marketSlug": "honolulu",
    "kind": "citywide_calendar",
    "title": "Honolulu group / citywide demand calendar (D7) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Honolulu group / citywide demand calendar (D7). Oct 24–25, 2026: Spotlight Card Show · 8,000 | Nov 6–8: Nā Lehua Marketplace & Festival · 5,000 | Dec 1–Jan 3: 'Twas the Light Before Christmas on Ice · 20,000 | Dec 10–13: 2026 Honolulu Marathon Expo (race Sun Dec 13) · 60,000 | Jan 13–19, 2027: TransPacific Volleyball Championships · 15,000 | HCC status: Two-year rooftop terrace deck project since Jan 2, 2026; \"modified event schedule\"; garage used for staging · same page | Honolulu Marathon: Dec 13, 2026 (JAL); Japan-heavy field historically · https://www.honolulumarathon.org/our-events/jal-honolulu-marathon | 2027 citywide gains/losses: no public read (renovation suppresses MCI; no pace release found). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "8 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-honolulu.md 2026-10-11; https://events.hawaiiconvention.com/; https://www.honolulumarathon.org/our-events/jal-honolulu-marathon"
  },
  {
    "id": "w1d-honolulu-d8",
    "marketSlug": "honolulu",
    "kind": "drive",
    "title": "Honolulu drive + attraction demand anchors (D8) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Honolulu drive + attraction demand anchors (D8). Drive catchment: None. Island market; the drive residual is only Oʻahu residents' staycations (no read) | Cruise: Aug 2026: 4,312 visitors flew to HNL to board turnaround trips (Pride of America); out-of-state ships seasonal (slow Jun–Aug) (2026-09-30; source: DBEDT Aug release) | Anchors: Waikīkī beach, Pearl Harbor, North Shore surf season (winter), Honolulu Marathon (Dec) (source: geography) | Gas / friction: National $4.36 (Oct 8) doesn't bind a fly-in market. The friction is jet fuel → fares, and Japan's FX (2026-10-08; source: https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-honolulu.md 2026-10-11; https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/"
  },
  {
    "id": "w1d-houston-d3",
    "marketSlug": "houston",
    "kind": "visitation",
    "title": "Houston visitation / demand volume (D3) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Houston visitation / demand volume (D3). Metro visitors 2025: 90.1M (day + overnight); ~3M international (2026-08-07; source: https://www.houstonfirst.com/news/houston-visitor-economy-continues-growth-as-global-tourism-investment-surpasses-1-trillion) | Metro travel spending / total impact 2025: $16.2B / $26.8B (2026-08-07; source: same → https://www.houstonfirst.com/news/houston-visitor-economy-continues-growth-as-global-tourism-investment-surpasses-1-trillion) | Metro hotel room bookings 2025: 22.8M (2026-08-07; source: same → https://www.houstonfirst.com/news/houston-visitor-economy-continues-growth-as-global-tourism-investment-surpasses-1-trillion) | Houston First-booked event attendees 2025: 730,000 (2026-08-07; source: same → https://www.houstonfirst.com/news/houston-visitor-economy-continues-growth-as-global-tourism-investment-surpasses-1-trillion) | City visitors 2024 / 2025 projection: 53.9M (52.6M dom / 1.3M intl) / 52M+ (2025 / late 2025; source: https://www.houstonfirst.com/news/visitors-to-the-city-of-houston-spent-nearly-11b-in-2024?news_type=PRESS_RELEASE · https://www.houstonfirst.com/media/uploads/strategicsummary2026_sm.pdf) | City hotel 2025 (YTD Sep): 17.3M RN; OCC 60%, ADR $121, RevPAR $73, revenue $2.1B (late 2025; source: https://www.houstonfirst.com/media/uploads/strategicsummary2026_sm.pdf) | Houston First RN booked 9M 2025: >545,000 (+44% YoY) (late 2025; source: same (via search summary of HF strategic summary) → https://www.houstonfirst.com/media/uploads/strategicsummary2026_sm.pdf) | Leisure vs business vs group split: no public read (looked in the HF strategic summary and press; only a spend-by-sector split is published) | 2026 YTD visitation: no public read. Decision support; 'no public read' rows are kept as written.",
    "magnitude": "9 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-houston.md 2026-10-11; https://www.houstonfirst.com/news/houston-visitor-economy-continues-growth-as-global-tourism-investment-surpasses-1-trillion; https://www.houstonfirst.com/news/visitors-to-the-city-of-houston-spent-nearly-11b-in-2024?news_type=PRESS_RELEASE; https://www.houstonfirst.com/media/uploads/strategicsummary2026_sm.pdf"
  },
  {
    "id": "w1d-houston-d6",
    "marketSlug": "houston",
    "kind": "airlift",
    "title": "Houston airlift / air access demand (D6) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Houston airlift / air access demand (D6). Aug 2026 system pax: ~5.0M (−5.2%); dom ~3.9M (−5%), intl 1.1M (−5.5%) (2026-10-02; source: https://www.houstonfirst.com/news/houston-air-traffic-dipped-5-in-august?news_type=BLOG) | YTD Aug 2026 system: 40.8M (~−1%); dom 32M (~−1%), intl 8.8M (−3%) (2026-10-02; source: same → https://www.houstonfirst.com/news/houston-air-traffic-dipped-5-in-august?news_type=BLOG) | IAH Aug: 3.9M (~−4%); intl ~1M (−5.6%); >60% of intl Mexico/C&S America, Canada ~10% (2026-10-02; source: same → https://www.houstonfirst.com/news/houston-air-traffic-dipped-5-in-august?news_type=BLOG) | HOU Aug: ~1.0M (−10%); intl ~61,400 (−4%) (2026-10-02; source: same → https://www.houstonfirst.com/news/houston-air-traffic-dipped-5-in-august?news_type=BLOG) | Carrier share: United 59%, Southwest 20% of system pax (2026-10-02; source: same → https://www.houstonfirst.com/news/houston-air-traffic-dipped-5-in-august?news_type=BLOG) | International share YTD: 8.8M / 40.8M ≈ 21.6% (computed from cited figures) (2026-10-02; source: same → https://www.houstonfirst.com/news/houston-air-traffic-dipped-5-in-august?news_type=BLOG) | 2025 system pax: 62M (2026-08-07; source: https://www.houstonfirst.com/news/houston-visitor-economy-continues-growth-as-global-tourism-investment-surpasses-1-trillion) | Winter adds: United IAH–Cartagena 4x weekly from Dec 17 (year-round) (2026-06-29; source: https://united.mediaroom.com/2026-06-29-United-Announces-New-Nonstop-Flights-from-Houston-and-Washington,-D-C-to-Cartagena) | Winter cuts / Hobby schedule cause: no public read (HF blog gives no reason for HOU −10%). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "9 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-houston.md 2026-10-11; https://www.houstonfirst.com/news/houston-air-traffic-dipped-5-in-august?news_type=BLOG; https://www.houstonfirst.com/news/houston-visitor-economy-continues-growth-as-global-tourism-investment-surpasses-1-trillion; https://united.mediaroom.com/2026-06-29-United-Announces-New-Nonstop-Flights-from-Houston-and-Washington"
  },
  {
    "id": "w1d-houston-d7",
    "marketSlug": "houston",
    "kind": "citywide_calendar",
    "title": "Houston group / citywide demand calendar (D7) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Houston group / citywide demand calendar (D7). International Quilt Festival (GRB): Nov 12–15, 2026 (classes from Nov 10); 500+ booths; attendance no public read on the 2026 page (2026-10-11 fetch; source: https://www.quilts.com/quilt-festival/quilt-festival-houston/media-resources/) | Collect-A-Con Houston (GRB Hall B): Nov 7–8, 2026; attendance no public read (2026-10-11; source: https://collectaconusa.com/houston2/ (accessed 2026-10-11)) | GRB South expansion: Opens May 2028; +337,400 CBD group RN/yr at stabilization (2032); citywide-equivalent meetings +62%; dark days −66% (2025-08-22; source: https://houstonfirst.com/static/media/uploads/hfc_grb_south_expansion_analysis_082225_final.pdf · https://www.houstonfirst.com/convention-district-transformation-1/) | GRB construction displacement 2026–28: no public read on lost/relocated citywides (HBJ Sep 18 2026 headline reports early benefit; paywalled) (2026-09-18; source: https://www.bizjournals.com/houston/news/2026/09/18/convention-center-expansion-early-economic-benefit.html) | Full GRB Oct–Jan calendar with attendance: no public read this pass | 2027 citywide gains/losses: no public read. Decision support; 'no public read' rows are kept as written.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-houston.md 2026-10-11; https://www.quilts.com/quilt-festival/quilt-festival-houston/media-resources/; https://collectaconusa.com/houston2/; https://houstonfirst.com/static/media/uploads/hfc_grb_south_expansion_analysis_082225_final.pdf; https://www.houstonfirst.com/convention-district-transformation-1/; https://www.bizjournals.com/houston/news/2026/09/18/convention-center-expansion-early-economic-benefit.html"
  },
  {
    "id": "w1d-houston-d8",
    "marketSlug": "houston",
    "kind": "drive",
    "title": "Houston drive + attraction demand anchors (D8) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Houston drive + attraction demand anchors (D8). Drive catchment: Texas Triangle via I-10 (San Antonio, Beaumont/LA), I-45 (Dallas), I-69/US-59; Gulf Coast/Galveston leisure (source: geography) | Attractions / sports: NRG Stadium (Texans; WC host), Minute Maid/Daikin Park, Toyota Center, Space Center Houston, Texas Medical Center (medical-visitor demand) (source: geography) | Cruise: Galveston (Port of Galveston) is a drive-to cruise anchor for Houston pre/post stays; 2026 counts not pulled | Gas: National $4.36 (Oct 8). Texas typically below national; TX figure not pulled. A heavy drive-in market, so friction applies to leisure weekends (2026-10-08; source: https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-houston.md 2026-10-11; https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/"
  },
  {
    "id": "w1d-los-angeles-d3",
    "marketSlug": "los-angeles",
    "kind": "visitation",
    "title": "Los Angeles visitation / demand volume (D3) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Los Angeles visitation / demand volume (D3). Visitors 2025: 49.5M (43.1M domestic / 6.4M international) (2026-07-29; source: https://www.discoverlosangeles.com/visitors-to-los-angeles-generated-426-billion-in-business-sales-and-supported-more-than-530000-jobs) | Business sales / jobs 2025: $42.6B / 530,000+; $3.4B state+local tax (2026-07-29; source: same → https://www.discoverlosangeles.com/visitors-to-los-angeles-generated-426-billion-in-business-sales-and-supported-more-than-530000-jobs) | LACC 2025: 19 citywides; 260,000+ attendees; 209,000+ RN (2026-07-29; source: same → https://www.discoverlosangeles.com/visitors-to-los-angeles-generated-426-billion-in-business-sales-and-supported-more-than-530000-jobs) | Self-contained hotel meetings 2025: 470+ events; 254,000 RN (2026-07-29; source: same → https://www.discoverlosangeles.com/visitors-to-los-angeles-generated-426-billion-in-business-sales-and-supported-more-than-530000-jobs) | Hotel OCC 2025 (thru Nov): 71.6%; ADR $196; RevPAR flat YoY (2026 (secondary); source: https://www.hotel-online.com/news/hotel-market-outlook-2026-a-market-by-market-analysis) | 2026 visitation update: no public read | Leisure vs business split: no public read (LA Tourism gives group RN, not total segment mix). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "7 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-los-angeles.md 2026-10-11; https://www.discoverlosangeles.com/visitors-to-los-angeles-generated-426-billion-in-business-sales-and-supported-more-than-530000-jobs; https://www.hotel-online.com/news/hotel-market-outlook-2026-a-market-by-market-analysis"
  },
  {
    "id": "w1d-los-angeles-d6",
    "marketSlug": "los-angeles",
    "kind": "airlift",
    "title": "Los Angeles airlift / air access demand (D6) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Los Angeles airlift / air access demand (D6). Aug 2026 total: 6,441,757 (−3.74%) (2026-09; source: https://www.lawa.org/sites/lawa/files/2026-09/Tcom%200826.pdf) | Aug 2026 dom / intl: 4,352,933 (−3.65%) / 2,088,824 (−3.92%); intl share ~32% (2026-09; source: same → https://www.lawa.org/sites/lawa/files/2026-09/Tcom%200826.pdf) | YTD Aug 2026: 48,917,650 (−1.46%); intl 15,589,567 (−2.58%) (2026-09; source: same → https://www.lawa.org/sites/lawa/files/2026-09/Tcom%200826.pdf) | Atlanta→LAX US-carrier pax T12 Jul: 897.83k vs 987.36k (−9%), one of the largest drops among ATL's top 10 (2026-10-11; source: https://www.transtats.bts.gov/airports.asp?Airport=ATL (fetched 2026-10-11)) | Carrier share: no public read this pass (LAWA carrier tables not parsed) (source: https://www.lawa.org/sites/lawa/files/2026-09/Ptcom%200826.pdf) | Winter 2026–27 adds/cuts: no public read this pass. Decision support; 'no public read' rows are kept as written.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-los-angeles.md 2026-10-11; https://www.lawa.org/sites/lawa/files/2026-09/Tcom%200826.pdf; https://www.transtats.bts.gov/airports.asp?Airport=ATL; https://www.lawa.org/sites/lawa/files/2026-09/Ptcom%200826.pdf"
  },
  {
    "id": "w1d-los-angeles-d7",
    "marketSlug": "los-angeles",
    "kind": "citywide_calendar",
    "title": "Los Angeles group / citywide demand calendar (D7) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Los Angeles group / citywide demand calendar (D7). Oct 30–Nov 1, 2026: L.A. Comic Con (LACC) · no public read (source: https://www.laconventioncenter.com/events/detail/la-comic-con-2026) | Nov 19 / Nov 20–29: AutoMobility LA (industry) / LA Auto Show public days (LACC) · \"hundreds of thousands\" (no exact figure) (source: https://laautoshow.com/press_releases/2026automobilityla/ · https://www.prnewswire.com/news-releases/los-angeles-auto-show-tickets-now-on-sale-ten-days-hundreds-of-new-vehicles-and-unlimited-test-drives-for-socal-302842906.html) | Dec 19–20: Collect-A-Con LA (LACC) · no public read (source: https://www.laconventioncenter.com/events/detail/collect-a-con-los-angeles-december-2026) | Jan 1, 2027: Rose Bowl, CFP Quarterfinal (Pasadena) · no public read (source: https://www.ncaa.com/news/football/article/2026-08-04/2026-27-college-football-playoff-schedule-dates-tv-channel-sites) | 2027 gains: Super Bowl LXI (Feb 2027, SoFi Stadium); LACC expansion underway · Discover LA release (above) (source: 2026-07-29 → https://www.discoverlosangeles.com/visitors-to-los-angeles-generated-426-billion-in-business-sales-and-supported-more-than-530000-jobs) | 2027 citywide losses: no public read. Decision support; 'no public read' rows are kept as written.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-los-angeles.md 2026-10-11; https://www.laconventioncenter.com/events/detail/la-comic-con-2026; https://laautoshow.com/press_releases/2026automobilityla/; https://www.prnewswire.com/news-releases/los-angeles-auto-show-tickets-now-on-sale-ten-days-hundreds-of-new-vehicles-and-unlimited-test-drives-for-socal-302842906.html; https://www.laconventioncenter.com/events/detail/collect-a-con-los-angeles-december-2026; https://www.ncaa.com/news/football/article/2026-08-04/2026-27-college-football-playoff-schedule-dates-tv-channel-sites; https://www.discoverlosangeles.com/visitors-to-los-angeles-generated-426-billion-in-business-sales-and-supported-more-than-530000-jobs"
  },
  {
    "id": "w1d-los-angeles-d8",
    "marketSlug": "los-angeles",
    "kind": "drive",
    "title": "Los Angeles drive + attraction demand anchors (D8) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Los Angeles drive + attraction demand anchors (D8). Drive catchment: SoCal basin + Inland Empire, San Diego (I-5), Las Vegas/Phoenix (I-15/I-10), Central Valley (I-5/CA-99) (source: geography) | Attractions: Universal Studios Hollywood (Fast & Furious: Hollywood Drift), Disneyland (Anaheim lane), LACMA Geffen Galleries, Lucas Museum, beaches (2026-07-29; source: Discover LA release (above) → https://www.discoverlosangeles.com/visitors-to-los-angeles-generated-426-billion-in-business-sales-and-supported-more-than-530000-jobs) | Stadiums / ports: SoFi (Rams/Chargers; Super Bowl LXI), Dodger Stadium, Crypto.com Arena, Rose Bowl; Port of LA/Long Beach cruise (2026 pax not pulled) (source: geography) | Gas: National $4.36 (Oct 8, first October >$4). CA well above national (CA figure not pulled). A large drive-in base; friction is highest of the Wave 1 West Coast markets (2026-10-08; source: https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-los-angeles.md 2026-10-11; https://www.discoverlosangeles.com/visitors-to-los-angeles-generated-426-billion-in-business-sales-and-supported-more-than-530000-jobs; https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/"
  },
  {
    "id": "w1d-miami-d3",
    "marketSlug": "miami",
    "kind": "visitation",
    "title": "Miami visitation / demand volume (D3) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Miami visitation / demand volume (D3). Visitors 2025 (Miami-Dade): 28.3M (record); $32.2B total economic impact (2026-06-04; source: https://www.prnewswire.com/news-releases/greater-miami-convention--visitors-bureau-reports-strong-tourism-performance-positioning-miami-dade-county-for-continued-growth-302791987.html) | Visitor spend 2025: $22.7B (+4.1%); lodging $10.4B (nearly half) (2026-06-04; source: same → https://www.prnewswire.com/news-releases/greater-miami-convention--visitors-bureau-reports-strong-tourism-performance-positioning-miami-dade-county-for-continued-growth-302791987.html) | International: Spend >$1,150 per person per trip; top markets Colombia, Brazil, UK, Canada, Mexico (2026-06-04; source: same → https://www.prnewswire.com/news-releases/greater-miami-convention--visitors-bureau-reports-strong-tourism-performance-positioning-miami-dade-county-for-continued-growth-302791987.html) | Overnight vs day / leisure-group-business mix: no public read (searched the GMCVB release and SOTI deck headline; the mix wasn't in the free release text) | Hotel 2025 (Oct YTD): OCC 73.5%; ADR $220.21; RevPAR $161.85 (2025-12; source: https://www.miamiandbeaches.com/getmedia/b4f3673d-c9b4-4f06-bd2f-7321e223b822/2025_dec_Miami-Dade_Industry_Updates.pdf) | Hotel 2026 Jan–May: OCC 79.9%; ADR $293.67; RevPAR $237.57; led the Top 25 on OCC, ADR and RevPAR through April (2026-06; source: GMCVB June 2026 SOTI https://www.miamiandbeaches.com/getmedia/76091a1b-d61a-4db5-9dce-c0015c628830/2026_June_3_State_of_the_Industry.pdf ; PR Newswire above) | Hotel Aug 2026: Miami-Dade OCC 63.6% (−7.6% YoY); week of Aug 2–8 RevPAR −8.5% to $107.60 (2026-08/09; source: https://miamibusiness.com/miami-hospitality-industry-report-august-2026/ ; https://lodgingmagazine.com/costar-u-s-hotel-industry-reports-positive-year-over-year-comparisons-18/ (via Atlas WC supply note)) | Cruise (PortMiami FY2025): 8,564,225 passengers (+4.02%), port record (2025-12; source: https://www.miamidade.gov/global/release.page?Mduid_release=rel1764622080449470). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "8 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-miami.md 2026-10-11; https://www.prnewswire.com/news-releases/greater-miami-convention--visitors-bureau-reports-strong-tourism-performance-positioning-miami-dade-county-for-continued-growth-302791987.html; https://www.miamiandbeaches.com/getmedia/b4f3673d-c9b4-4f06-bd2f-7321e223b822/2025_dec_Miami-Dade_Industry_Updates.pdf; https://www.miamiandbeaches.com/getmedia/76091a1b-d61a-4db5-9dce-c0015c628830/2026_June_3_State_of_the_Industry.pdf; https://miamibusiness.com/miami-hospitality-industry-report-august-2026/; https://lodgingmagazine.com/costar-u-s-hotel-industry-reports-positive-year-over-year-comparisons-18/; https://www.miamidade.gov/global/release.page?Mduid_release=rel1764622080449470"
  },
  {
    "id": "w1d-miami-d6",
    "marketSlug": "miami",
    "kind": "airlift",
    "title": "Miami airlift / air access demand (D6) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Miami airlift / air access demand (D6). MIA Aug 2026 total pax: 4,289,986 (−5.69% vs 4,548,858) (Aug 2026 report; source: https://www.miami-airport.com/library/pdfdoc/Airport%20Stats/FY%202025-2026/August%202026%20Monthly%20%20Calendar%20Yr%20Traffic%20Report.pdf) | MIA CYTD Aug 2026: 37,467,769 (−1.14%) (Aug 2026 report; source: same → https://www.miami-airport.com/library/pdfdoc/Airport%20Stats/FY%202025-2026/August%202026%20Monthly%20%20Calendar%20Yr%20Traffic%20Report.pdf) | MIA international: Aug 2,044,562 (−4.44%) = 47.7% of pax; CYTD 16,996,723 (−0.48%) = 45.4% (Aug 2026 report; source: same (share computed from report) → https://www.miami-airport.com/library/pdfdoc/Airport%20Stats/FY%202025-2026/August%202026%20Monthly%20%20Calendar%20Yr%20Traffic%20Report.pdf) | MIA domestic: Aug 2,245,424 (−6.80%); CYTD 20,471,046 (−1.68%) (Aug 2026 report; source: same → https://www.miami-airport.com/library/pdfdoc/Airport%20Stats/FY%202025-2026/August%202026%20Monthly%20%20Calendar%20Yr%20Traffic%20Report.pdf) | FLL Aug 2026 total pax: 2,375,538 (−5.8%); YTD 21,757,164 (−0.8%) (Aug 2026 report; source: https://www.browardcdn.org/api/public/content/b2853a1460f1436d9a8319d32d140323?v=50854f0e) | FLL international: Aug 425,608 (−21.2%); YTD 3,795,281 (−11.1%), 17.4% of pax (Aug 2026 report; source: same → https://www.browardcdn.org/api/public/content/b2853a1460f1436d9a8319d32d140323?v=50854f0e) | FLL carrier mix: JetBlue YTD pax +39.8% (Aug share 39.3%); Spirit YTD −51.8% (13.8% YTD share, zero after shutdown); Southwest YTD −2.8% (8.4% Aug share) (Aug 2026 report; source: same → https://www.browardcdn.org/api/public/content/b2853a1460f1436d9a8319d32d140323?v=50854f0e) | Spirit shutdown: Ceased operations ~May 2, 2026. 11M FLL pax in 2024 (31.4% share). JetBlue added BWI/CLT (Jul), CMH/IND (Nov 2026), plus 5 more cities from Jul 9. Breeze FLL–JAX daily from Jul (2026-05-05; source: https://www.wlrn.org/light/business/2026-05-05/spirit-fort-lauderdale-hollywood-airport-fll) | MIA carrier mix (American share): no public read (the MIA traffic report doesn't publish carrier share; looked at the Aug PDF) | Oct 2026–Mar 2027 seat schedule: no public read (no free schedule source; only the JetBlue FLL Nov adds above). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "10 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-miami.md 2026-10-11; https://www.miami-airport.com/library/pdfdoc/Airport%20Stats/FY%202025-2026/August%202026%20Monthly%20%20Calendar%20Yr%20Traffic%20Report.pdf; https://www.browardcdn.org/api/public/content/b2853a1460f1436d9a8319d32d140323?v=50854f0e; https://www.wlrn.org/light/business/2026-05-05/spirit-fort-lauderdale-hollywood-airport-fll"
  },
  {
    "id": "w1d-miami-d7",
    "marketSlug": "miami",
    "kind": "citywide_calendar",
    "title": "Miami group / citywide demand calendar (D7) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Miami group / citywide demand calendar (D7). Main convention venue: Miami Beach Convention Center. HQ hotel: 800-room Grand Hyatt Miami Beach, connected by skybridge, opening November 2027 (MBCC, 2026-07-27 https://www.miamibeachconvention.com/center-info/press/grand-hyatt-miami-beach-topping-off) (source: GMCVB PR (2026-06-04) above → https://www.prnewswire.com/news-releases/greater-miami-convention--visitors-bureau-reports-strong-tourism-performance-positioning-miami-dade-county-for-continued-growth-302791987.html) | The Hospitality Show 2026 (AHLA): Nov 2–4 · MBCC; attendance no public read (source: https://www.ahla.com/news/hospitality-show-opens-registration-industry-event-focused-hotel-operations-and-performance · https://www.miamibeachconvention.com/events/hospitality-show-2026 (accessed 2026-10-11)) | NASCAR Championship Weekend: Nov 6–8 (Cup race Nov 8) · Homestead-Miami Speedway; attendance no public read (source: https://www.homesteadmiamispeedway.com/2025/05/06/2026-nascar-championship-weekend-moves-to-homestead-miami-speedway-on-nov-6-8/) | Design Miami (Miami Art Week): Dec 1–6 (preview Dec 1; public Dec 2–6) · Convention Center Dr & 19th St, Miami Beach (source: designmiami.com https://designmiami.com/fair/miami-2026 (accessed 2026-10-11)) | Art Basel Miami Beach: Dec 4–6 (VIP Dec 2–3) · MBCC; reconfigured showfloor; attendance no public read for 2026 (source: https://www.artbasel.com/miami-beach/at-the-show ; https://www.artbasel.com/stories/art-basel-announces-exhibitors-and-a-reconfigured-showfloor-for-miami-beach-2026) | G20 Leaders' Summit: Dec 14–15 · Trump National Doral; delegations + security perimeter (Doral/Airport submarket) (source: https://www.cityofdoral.com/Elected-officials/Christi-Fraga/Doral-at-the-Center-of-G20 ; https://g20.org/location/) | Xenom Miami: Dec 19–20 · MBCC (source: https://www.miamibeachconvention.com/events/xenom-miami) | Orange Bowl (CFP semifinal): Jan 14, 2027 (outside window) · Hard Rock Stadium (source: https://www.ncaa.com/news/football/article/2026-08-04/2026-27-college-football-playoff-schedule-dates-tv-channel-sites) | 2027 citywide pace / gains-losses: no public read (looked for a GMCVB/MBCC pace release; none free). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "9 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-miami.md 2026-10-11; https://www.prnewswire.com/news-releases/greater-miami-convention--visitors-bureau-reports-strong-tourism-performance-positioning-miami-dade-county-for-continued-growth-302791987.html; https://www.miamibeachconvention.com/center-info/press/grand-hyatt-miami-beach-topping-off; https://www.ahla.com/news/hospitality-show-opens-registration-industry-event-focused-hotel-operations-and-performance; https://www.miamibeachconvention.com/events/hospitality-show-2026; https://www.homesteadmiamispeedway.com/2025/05/06/2026-nascar-championship-weekend-moves-to-homestead-miami-speedway-on-nov-6-8/; https://designmiami.com/fair/miami-2026; https://www.artbasel.com/miami-beach/at-the-show; https://www.artbasel.com/stories/art-basel-announces-exhibitors-and-a-reconfigured-showfloor-for-miami-beach-2026; https://www.cityofdoral.com/Elected-officials/Christi-Fraga/Doral-at-the-Center-of-G20; https://g20.org/location/; https://www.miamibeachconvention.com/events/xenom-miami; https://www.ncaa.com/news/football/article/2026-08-04/2026-27-college-football-playoff-schedule-dates-tv-channel-sites"
  },
  {
    "id": "w1d-miami-d8",
    "marketSlug": "miami",
    "kind": "drive",
    "title": "Miami drive + attraction demand anchors (D8) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Miami drive + attraction demand anchors (D8). Drive arteries: I-95, Florida's Turnpike, I-75 (Alligator Alley), US-1 to the Keys; Brightline rail to Orlando (ridership: no public read pulled) (source: general geography; no number) | Anchors: Beaches/Art Deco district, PortMiami cruise (8.56M FY2025 pax), Wynwood/Art Week, Hard Rock Stadium, Homestead-Miami Speedway (2025-12; source: PortMiami release above → https://www.miamidade.gov/global/release.page?Mduid_release=rel1764622080449470) | Florida/Miami gas price: no public read pulled (looked only at national) | National gas context: $4.36 national avg Oct 8, 2026; first October ever above $4. That's a headwind for the drive market from Orlando/Tampa/Palm Beach (2026-10-08; source: https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/) | Spillover read: Orlando OCC fell ~11% during the Cup, and the Brightline spillover from Miami didn't show up (2026-07-06; source: notes/2026-10-11-world-cup-demand.md (Skift 2026-07-06)). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-miami.md 2026-10-11; https://www.miamidade.gov/global/release.page?Mduid_release=rel1764622080449470; https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/"
  },
  {
    "id": "w1d-nashville-d3",
    "marketSlug": "nashville",
    "kind": "visitation",
    "title": "Nashville visitation / demand volume (D3) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Nashville visitation / demand volume (D3). Visitors 2025 (50+ mi, Tourism Economics): 17.39M (+2.7%) (2026-03-03; source: https://www.nashville.gov/sites/default/files/2026-05/Tourism-and-Convention-Commission-Minutes-030326.pdf) | Overnight visitors 2025: 11.55M (2026; source: https://www.newschannel5.com/news/nashville-tourism-hits-record-11-6-billion-in-visitor-spending-in-2025) | Visitor spending 2025: $11.64B (record) (2026; source: same → https://www.newschannel5.com/news/nashville-tourism-hits-record-11-6-billion-in-visitor-spending-in-2025) | 2026 plan: 17.8M visitors / 11.8M overnight (2026-03-03; source: TCC minutes (above) → https://www.nashville.gov/sites/default/files/2026-05/Tourism-and-Convention-Commission-Minutes-030326.pdf) | Hotel 2025: 10.2M rooms sold (record); OCC ~67%; ADR ~−1.3%; RevPAR ~−2%; supply +3.4%; room revenue +1.2% (2026-03-03; source: same → https://www.nashville.gov/sites/default/files/2026-05/Tourism-and-Convention-Commission-Minutes-030326.pdf) | Downtown cluster 2025: Supply +4.9%, demand +5%, 3.9M rooms sold, just over half of city room revenue (2026-03-03; source: same → https://www.nashville.gov/sites/default/files/2026-05/Tourism-and-Convention-Commission-Minutes-030326.pdf) | STR share: $540M = 21% of $2.6B total lodging revenue; ~9,500 listings; STR demand +6.9% (2026-03-03; source: same → https://www.nashville.gov/sites/default/files/2026-05/Tourism-and-Convention-Commission-Minutes-030326.pdf) | International 2025: 364,000 (−13.4%; 2024 record 420,000); over half Canadian (2026-03-03; source: same → https://www.nashville.gov/sites/default/files/2026-05/Tourism-and-Convention-Commission-Minutes-030326.pdf) | Leisure vs group split: no public read (looked in TCC minutes and Visit Music City research). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "9 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-nashville.md 2026-10-11; https://www.nashville.gov/sites/default/files/2026-05/Tourism-and-Convention-Commission-Minutes-030326.pdf; https://www.newschannel5.com/news/nashville-tourism-hits-record-11-6-billion-in-visitor-spending-in-2025"
  },
  {
    "id": "w1d-nashville-d6",
    "marketSlug": "nashville",
    "kind": "airlift",
    "title": "Nashville airlift / air access demand (D6) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Nashville airlift / air access demand (D6). Aug 2026 total pax: 2,389,896 (+4.9%) (2026-09; source: https://flynashville.com/wp-content/uploads/2026/09/082026_AviationStat.pdf) | Aug 2026 seats / load factor: 3,118,674 (+5.9%) / 76.6% (−0.7 pts) (2026-09; source: same → https://flynashville.com/wp-content/uploads/2026/09/082026_AviationStat.pdf) | FYTD (Jul–Aug 2026): 4,987,461 pax (+6.2%); seats 6,367,904 (+6.1%) (2026-09; source: same → https://flynashville.com/wp-content/uploads/2026/09/082026_AviationStat.pdf) | FY26 (Jul 2025–Jun 2026): 26.7M pax (record) (2026; source: https://flynashville.com/news/press-releases/fy26-mnaa-marks-transformative-year) | Long-term parking tickets Aug: −34.5% (a local-originating signal, mixed with mode shift) (2026-09; source: AviationStat PDF) | Carrier share: no public read this pass (Southwest is largest at BNA; % not pulled) (source: https://flynashville.com/wp-content/uploads/2026/09/082026_TrafficReport.pdf (not parsed)) | International share: no public read this pass (small; intl cargo only in summary) | Winter 2026–27 adds/cuts: no public read this pass. Decision support; 'no public read' rows are kept as written.",
    "magnitude": "8 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-nashville.md 2026-10-11; https://flynashville.com/wp-content/uploads/2026/09/082026_AviationStat.pdf; https://flynashville.com/news/press-releases/fy26-mnaa-marks-transformative-year; https://flynashville.com/wp-content/uploads/2026/09/082026_TrafficReport.pdf"
  },
  {
    "id": "w1d-nashville-d7",
    "marketSlug": "nashville",
    "kind": "citywide_calendar",
    "title": "Nashville group / citywide demand calendar (D7) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Nashville group / citywide demand calendar (D7). Oct 11–14, 2026: American College of Gastroenterology · 10,000 | Nov 5–7: US Trail Running Conference · not listed | Nov 18–21: National League of Cities City Summit · 4,000 | Nov 18: 60th CMA Awards (Bridgestone Arena, not MCC) · no public read; https://www.bridgestonearena.com/events/detail/the-60th-annual-cma-awards | Dec 1–3: Travel South USA Intl Showcase (500) / DOCKS Expo (500) · 500 / 500 | Dec 9–13: HYROX Fitness Event · 30,000 | Jan 7–10, 2027: Antiques & Garden Show of Nashville · not listed | 2027 anchors: Safari Club Intl (Jan 20–23); NCBA Cattle Industry (Feb 1–4, 9,000); 3DEXPERIENCE World (Feb 14–17, 4,500); Bitcoin Conference (Jul 15–17) · MCC calendar | 2027 citywide gains/losses vs 2026: no public read (no NCVC pace release found). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "9 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-nashville.md 2026-10-11; https://nashvillemcc.com/calendar; https://www.bridgestonearena.com/events/detail/the-60th-annual-cma-awards"
  },
  {
    "id": "w1d-nashville-d8",
    "marketSlug": "nashville",
    "kind": "drive",
    "title": "Nashville drive + attraction demand anchors (D8) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Nashville drive + attraction demand anchors (D8). Drive catchment: Three-interstate hub: I-65 (Louisville/Indianapolis, Birmingham), I-40 (Memphis, Knoxville), I-24 (Chattanooga/Atlanta, St. Louis) (source: geography) | Attractions: Broadway honky-tonks, Grand Ole Opry/Opryland, Ryman, Bridgestone Arena, Nissan Stadium (Titans; new stadium under construction), Geodis Park (source: geography) | Gas: National $4.36 (Oct 8, first October >$4). TN typically below national (TN figure not pulled). Drive weekends are a big share of Nashville's leisure (2026-10-08; source: https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-nashville.md 2026-10-11; https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/"
  },
  {
    "id": "w1d-new-york-city-d3",
    "marketSlug": "new-york-city",
    "kind": "visitation",
    "title": "New York City visitation / demand volume (D3) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), New York City visitation / demand volume (D3). Visitors 2025: 65.0M (+0.7%) (2026-03-24; source: https://business.nyctourism.com/press-media/press-releases/NYC-Tourism-Annual-Report-March-2026) | Domestic / international 2025: 52.4M (+1.7%) / 12.5M (−3.2%); international = 50% of tourism spend (2026-03-24; source: same → https://business.nyctourism.com/press-media/press-releases/NYC-Tourism-Annual-Report-March-2026) | Leisure / business 2025: 52.4M leisure (99% of 2019) / 12.6M business (2026-03-24; source: same → https://business.nyctourism.com/press-media/press-releases/NYC-Tourism-Annual-Report-March-2026) | Group booked by NYC T+C 2025: 1,515 meetings; ~345,000 definite RN (2026-03-24; source: same → https://business.nyctourism.com/press-media/press-releases/NYC-Tourism-Annual-Report-March-2026) | Hotel 2025: OCC 84.2%; ADR $334 (+5%); 38.1M RN (+2%); ~124,000 rooms (2026-03-24; source: same → https://business.nyctourism.com/press-media/press-releases/NYC-Tourism-Annual-Report-March-2026) | OCC by class 2025: Luxury 82.2% / upscale 87.5% / midscale 76.7% (−7%) (2026-03-24; source: same → https://business.nyctourism.com/press-media/press-releases/NYC-Tourism-Annual-Report-March-2026) | OSC hotel read: 2025 OCC 84.1%, ADR $333.71, RevPAR $280.71 (+4.5%); 2026 openings 4,852 rooms (nation-leading); 24 projects / 5,778 rooms through 2028 (2026-07; source: https://www.osc.ny.gov/files/reports/osdc/2026/pdf/nyc-hotel-industry-report-july-2026.pdf) | 2026 forecast: 66.3M (+2%); domestic 53.4M; intl 12.9M; business 12.8M (2026-03-24; source: NYC T+C (above) → https://business.nyctourism.com/press-media/press-releases/NYC-Tourism-Annual-Report-March-2026) | HTX room-rent base (registry): TY2024 total rent $11.777B; 832 hotels (tax proxy) (2025-07; source: msa-registry.ts / https://www.nyc.gov/assets/finance/downloads/pdf/reports/reports_htx/2024_htx_report.pdf). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "9 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-new-york-city.md 2026-10-11; https://business.nyctourism.com/press-media/press-releases/NYC-Tourism-Annual-Report-March-2026; https://www.osc.ny.gov/files/reports/osdc/2026/pdf/nyc-hotel-industry-report-july-2026.pdf; https://www.nyc.gov/assets/finance/downloads/pdf/reports/reports_htx/2024_htx_report.pdf"
  },
  {
    "id": "w1d-new-york-city-d6",
    "marketSlug": "new-york-city",
    "kind": "airlift",
    "title": "New York City airlift / air access demand (D6) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), New York City airlift / air access demand (D6). PANYNJ airports H1 2026: 67M pax (−2%) (2026-08-03; source: https://www.roi-nj.com/2026/08/03/transportation/port-authority-reports-path-system-had-busiest-first-half-since-the-pandemic/) | By airport H1 2026: EWR 22.8M (+3%, recovered from 2025 FAA staffing); LGA 15.3M (−3%); JFK −5% (2026-08; source: same; https://binje.com/sectors/transportation/port-newark-passenger-volume-has-recovered-from-2025-faa-staffing-challenges/) | International H1 2026: −4% YoY (2026-08; source: same → https://binje.com/sectors/transportation/port-newark-passenger-volume-has-recovered-from-2025-faa-staffing-challenges/) | Latest month (Jul/Aug 2026) by airport: no public read (panynj.gov blocked to curl; aggregator PDFs mislabeled, not used) (source: https://www.panynj.gov/airports/en/statistics-general-info.html) | Carrier mix: no public read this pass (JFK Delta/JetBlue/AA; EWR United; LGA Delta/AA) | Winter 2026–27 adds/cuts: no public read this pass. Decision support; 'no public read' rows are kept as written.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-new-york-city.md 2026-10-11; https://www.roi-nj.com/2026/08/03/transportation/port-authority-reports-path-system-had-busiest-first-half-since-the-pandemic/; https://binje.com/sectors/transportation/port-newark-passenger-volume-has-recovered-from-2025-faa-staffing-challenges/; https://www.panynj.gov/airports/en/statistics-general-info.html"
  },
  {
    "id": "w1d-new-york-city-d7",
    "marketSlug": "new-york-city",
    "kind": "citywide_calendar",
    "title": "New York City group / citywide demand calendar (D7) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), New York City group / citywide demand calendar (D7). Nov 1, 2026: TCS NYC Marathon (nearly 60,000 runners expected per NYRR) · ~60,000 runners (source: https://www.nyrr.org/media-center/news/2026/10/07/new-york-road-runners-reveals-2026-tcs-new-york-city-marathon-finisher-medal (accessed 2026-10-11)) | Nov 3–5, 2026 (exhibits Nov 4–5): ISC East (Javits) · no public read (source: https://www.discoverisc.com/east/en-us.html (accessed 2026-10-11)) | Nov 26: Thanksgiving / Macy's Parade · no public read (source: national holiday) | Nov 27–Dec 1, 2026 (exhibits Nov 29–Dec 1): Greater New York Dental Meeting (Javits) · no public read (source: https://www.gnydm.com/attendee-information/general-information/ (accessed 2026-10-11)) | Dec 2–4, 2026 (Javits trade show Dec 3; sessions also at Sheraton Times Square): New York Produce Show & Conference · no public read (source: https://www.nyproduceshow.com/ (accessed 2026-10-11)) | Dec 9–10, 2026: The AI Summit New York (Javits) · no public read (source: https://newyork.theaisummit.com/about/faqs/ (accessed 2026-10-11)) | Dec 31: Times Square NYE · no public read | Oct 8–11 (just ended): New York Comic Con (2025: 250,000) · context (source: https://www.newyorkcomiccon.com/ · https://en.wikipedia.org/wiki/New_York_Comic_Con) | 2027 citywide gains/losses: no public read. Decision support; 'no public read' rows are kept as written.",
    "magnitude": "9 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-new-york-city.md 2026-10-11; https://www.nyrr.org/media-center/news/2026/10/07/new-york-road-runners-reveals-2026-tcs-new-york-city-marathon-finisher-medal; https://www.discoverisc.com/east/en-us.html; https://www.gnydm.com/attendee-information/general-information/; https://www.nyproduceshow.com/; https://newyork.theaisummit.com/about/faqs/; https://www.newyorkcomiccon.com/; https://en.wikipedia.org/wiki/New_York_Comic_Con"
  },
  {
    "id": "w1d-new-york-city-d8",
    "marketSlug": "new-york-city",
    "kind": "drive",
    "title": "New York City drive + attraction demand anchors (D8) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), New York City drive + attraction demand anchors (D8). Drive / rail catchment: Tri-state is the #1 feeder, then Philadelphia, DC, LA, Boston. Domestic overnight trips are 51% of domestic visits; \"regional drive markets\" called out (2026-03-24; source: NYC T+C (above) → https://business.nyctourism.com/press-media/press-releases/NYC-Tourism-Annual-Report-March-2026) | Anchors: Broadway, museums, MSG, Yankee/Citi Field, Barclays; holiday window (Rockefeller tree, retail) (source: geography) | Cruise: Manhattan/Brooklyn cruise terminals (2026 pax not pulled) | Gas: National $4.36 (Oct 8, first October >$4). Rail/transit substitution (NJ Transit, Amtrak, LIRR) dampens drive friction. Congestion pricing is a separate overlay (not pulled) (2026-10-08; source: https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-new-york-city.md 2026-10-11; https://business.nyctourism.com/press-media/press-releases/NYC-Tourism-Annual-Report-March-2026; https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/"
  },
  {
    "id": "w1d-phoenix-d3",
    "marketSlug": "phoenix",
    "kind": "visitation",
    "title": "Phoenix visitation / demand volume (D3) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Phoenix visitation / demand volume (D3). Metro visitors 2025: 47.7M (incl. day trips); 1.7M international (fetched 2026-10-11; source: https://www.visitphoenix.com/about-us/phoenix-facts/) | Direct spend / total impact 2025: >$13.4B / $23.6B (Tourism Economics) (2026; source: same → https://www.visitphoenix.com/about-us/phoenix-facts/) | Avg overnights / party size: 3.1 / 2.7 (Longwoods 2025) (2026; source: same → https://www.visitphoenix.com/about-us/phoenix-facts/) | Hotel inventory: >73,000 rooms, 560+ hotels, 40 full-service resorts (Greater Phoenix) (Dec 2025; source: same → https://www.visitphoenix.com/about-us/phoenix-facts/) | Hotel 2025 (Greater Phoenix): OCC 66.5%, ADR $173.29, RevPAR $115.27, room revenue $3.0B (2026; source: https://assets.simpleviewinc.com/simpleview/image/upload/v1/clients/phoenix/SV_08449394_compressed_ec37a28f-3d6e-4138-b9b2-24b8b6b0d425.pdf (Visit Phoenix FY25-26 Annual Report)) | Hotel 2026 through June: OCC 72.3%, ADR $201, RevPAR $145 (2026; source: same → https://assets.simpleviewinc.com/simpleview/image/upload/v1/clients/phoenix/SV_08449394_compressed_ec37a28f-3d6e-4138-b9b2-24b8b6b0d425.pdf) | Leisure vs group RN split: no public read (Visit Phoenix gives booked group RN only, not the share of total). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "7 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-phoenix.md 2026-10-11; https://www.visitphoenix.com/about-us/phoenix-facts/; https://assets.simpleviewinc.com/simpleview/image/upload/v1/clients/phoenix/SV_08449394_compressed_ec37a28f-3d6e-4138-b9b2-24b8b6b0d425.pdf"
  },
  {
    "id": "w1d-phoenix-d6",
    "marketSlug": "phoenix",
    "kind": "airlift",
    "title": "Phoenix airlift / air access demand (D6) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Phoenix airlift / air access demand (D6). Jul 2026 total pax: 4,193,673 (+0.4% YoY) (2026-08/09; source: https://www.skyharbor.com/media/pscmshlb/monthly-stats-july-2026.pdf) | CYTD Jul 2026: 30,846,557 (+0.8%) (same; source: same → https://www.skyharbor.com/media/pscmshlb/monthly-stats-july-2026.pdf) | Intl Jul 2026: 221,805 enplaned+deplaned (~5.3% of total); CYTD intl enplaned −3.5%, deplaned −5.8% (same; source: same → https://www.skyharbor.com/media/pscmshlb/monthly-stats-july-2026.pdf) | Carrier Jul 2026: American 1,886,037 (+5.3%, ~45% share); Southwest 1,325,990 (−6.0%, ~32% share) (shares computed from cited totals) (same; source: same → https://www.skyharbor.com/media/pscmshlb/monthly-stats-july-2026.pdf) | 2025 total pax: >51M (2026; source: https://www.visitphoenix.com/about-us/phoenix-facts/) | Winter 2026–27 adds/cuts: no public read this pass. Decision support; 'no public read' rows are kept as written.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-phoenix.md 2026-10-11; https://www.skyharbor.com/media/pscmshlb/monthly-stats-july-2026.pdf; https://www.visitphoenix.com/about-us/phoenix-facts/"
  },
  {
    "id": "w1d-phoenix-d7",
    "marketSlug": "phoenix",
    "kind": "citywide_calendar",
    "title": "Phoenix group / citywide demand calendar (D7) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Phoenix group / citywide demand calendar (D7). Nov 2026: Arizona International Auto Show not held in 2026 (VADA decision; returns Nov 25–28, 2027 at PCC). Removes the usual Thanksgiving-weekend PCC event (source: https://autoshowphoenix.com/ (accessed 2026-10-11)) | Dec 11–15, 2026: National Athletic Directors Conference & Exhibit Show (NFHS/NIAAA; PCC) · no public read (source: https://nfhs.org/about/future-conference (accessed 2026-10-11)) | Dec 30, 2026: Vrbo Fiesta Bowl, CFP Quarterfinal (State Farm Stadium) · no public read (source: https://www.fiestasportsfoundation.org/news/2026/7/9/vrbo-fiesta-bowl-announces-dates-to-host-college-football-playoff-matchups-through-2032.aspx) | FY25/26 PCC bookings: 85 meetings; 383,613 definite RN; 317,351 future delegates · Visit Phoenix FY25-26 Annual Report (above) (source: 2026 → https://assets.simpleviewinc.com/simpleview/image/upload/v1/clients/phoenix/SV_08449394_compressed_ec37a28f-3d6e-4138-b9b2-24b8b6b0d425.pdf) | FY25/26 hotel/resort bookings: 671 meetings; 416,153 definite RN · same (source: 2026 → https://assets.simpleviewinc.com/simpleview/image/upload/v1/clients/phoenix/SV_08449394_compressed_ec37a28f-3d6e-4138-b9b2-24b8b6b0d425.pdf) | 2027 gains: NBA All-Star Game, Feb 2027 (Mortgage Matchup Center); WM Phoenix Open Feb 8–14, 2027 · https://www.visitphoenix.com/about-us/phoenix-facts/ · https://wmphoenixopen.com/featured/2027-general-admission-tickets-now-on-sale/ (source: 2026) | 2027 citywide losses: no public read. Decision support; 'no public read' rows are kept as written.",
    "magnitude": "7 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-phoenix.md 2026-10-11; https://autoshowphoenix.com/; https://nfhs.org/about/future-conference; https://www.fiestasportsfoundation.org/news/2026/7/9/vrbo-fiesta-bowl-announces-dates-to-host-college-football-playoff-matchups-through-2032.aspx; https://assets.simpleviewinc.com/simpleview/image/upload/v1/clients/phoenix/SV_08449394_compressed_ec37a28f-3d6e-4138-b9b2-24b8b6b0d425.pdf; https://www.visitphoenix.com/about-us/phoenix-facts/; https://wmphoenixopen.com/featured/2027-general-admission-tickets-now-on-sale/"
  },
  {
    "id": "w1d-phoenix-d8",
    "marketSlug": "phoenix",
    "kind": "drive",
    "title": "Phoenix drive + attraction demand anchors (D8) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Phoenix drive + attraction demand anchors (D8). Drive catchment: Southern California via I-10 (LA/IE), Tucson (I-10), Las Vegas (US-93), San Diego (I-8); Sonora/Mexico drive-in (source: geography) | Spring training: 15 Cactus League teams; 1.7M fans 2025 (2026; source: https://www.visitphoenix.com/about-us/phoenix-facts/) | Golf / resorts: 185+ courses; WM Phoenix Open averages 700k+ spectators (2026; source: same → https://www.visitphoenix.com/about-us/phoenix-facts/) | Stadiums: State Farm Stadium (Cardinals, Fiesta Bowl), Chase Field, Mortgage Matchup Center; Phoenix Raceway (2 NASCAR weekends) (2026; source: same → https://www.visitphoenix.com/about-us/phoenix-facts/) | Gas: National $4.36 (Oct 8, first October >$4). The SoCal drive feeder pays CA prices, so friction matters for weekend drive-in (2026-10-08; source: https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-phoenix.md 2026-10-11; https://www.visitphoenix.com/about-us/phoenix-facts/; https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/"
  },
  {
    "id": "w1d-san-diego-d3",
    "marketSlug": "san-diego",
    "kind": "visitation",
    "title": "San Diego visitation / demand volume (D3) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), San Diego visitation / demand volume (D3). Total visitors CY2025: 32.4M (32.5M 2024) (2026-04-30; source: https://www.sandiego.org/about/san-diego-tourism-fast-facts) | Overnight / day visitors 2025: 17.8M / 14.6M (incl. 3.8M Mexican day visitors) (2026-04-30; source: same → https://www.sandiego.org/about/san-diego-tourism-fast-facts) | Overnight in hotel/motel 2025: 10.0M (2026-04-30; source: same → https://www.sandiego.org/about/san-diego-tourism-fast-facts) | Hotel nights sold / available 2025: 17.4M / 24.1M (OCC 72.2%, ADR $213) (2026-04-30; source: same → https://www.sandiego.org/about/san-diego-tourism-fast-facts) | Direct visitor spending 2025: $14.4B (−2.7% vs $14.8B) (2026-04-30; source: same → https://www.sandiego.org/about/san-diego-tourism-fast-facts) | Visitor purpose (all visitors): ~81% transient / 13% business / 6% other (2026-04-30; source: same → https://www.sandiego.org/about/san-diego-tourism-fast-facts) | Rooms: county / city / downtown: 68,954 / 40,158 / 14,878 (2026-04-30; source: same → https://www.sandiego.org/about/san-diego-tourism-fast-facts) | SDTA-generated room nights FY25: 6.5M (2026-04-30; source: same → https://www.sandiego.org/about/san-diego-tourism-fast-facts) | 2026 lodging forecast (Jul 2025 vintage): Demand +1.5%, ADR +0.6%; leisure +1.2%, group −0.4% (2025-07; source: https://www.sandiego.org/sites/default/files/2025-07/San%20Diego%20Lodging%20Forecast%20-%20July%202025_0.pdf) | 2026 YTD visitation: no public read (looked for a newer SDTA forecast or 2026 YTD release). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "10 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-san-diego.md 2026-10-11; https://www.sandiego.org/about/san-diego-tourism-fast-facts; https://www.sandiego.org/sites/default/files/2025-07/San%20Diego%20Lodging%20Forecast%20-%20July%202025_0.pdf"
  },
  {
    "id": "w1d-san-diego-d6",
    "marketSlug": "san-diego",
    "kind": "airlift",
    "title": "San Diego airlift / air access demand (D6) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), San Diego airlift / air access demand (D6). Aug 2026 total pax: 2,489,753 (+7.5% YoY) (2026-10; source: https://www.san.org/wp-content/uploads/2026/10/8-AUG-2026.pdf) | CYTD Aug 2026 pax: 18,328,887 (+9.8%) (2026-10; source: same → https://www.san.org/wp-content/uploads/2026/10/8-AUG-2026.pdf) | 12ME Aug 2026 pax: 26,958,785 (+7.2%) (2026-10; source: same → https://www.san.org/wp-content/uploads/2026/10/8-AUG-2026.pdf) | Scheduled seats Aug / 12ME: 3,249,874 (+15.5%) / 34,419,079 (+8.3%) (2026-10; source: same → https://www.san.org/wp-content/uploads/2026/10/8-AUG-2026.pdf) | Seat factor Aug: 77.7% (−5.2 pts) (2026-10; source: same → https://www.san.org/wp-content/uploads/2026/10/8-AUG-2026.pdf) | International share: Aug 111,244 intl pax = ~4.5% of total (+2.9% YoY); CYTD intl 764,823 (+4.2%) (2026-10; source: same → https://www.san.org/wp-content/uploads/2026/10/8-AUG-2026.pdf) | Winter adds: Southwest SAN–FLL Nov 21; Alaska SAN–FLL resumes Nov 20; Alaska SAN–Loreto Dec 19 (new); Alaska ski seasonals (SUN/EGE/HDN) Dec 18–19; Southwest Kona/Lihue resume Mar 13, 2027; Delta SAN–AUS Apr 12, 2027 (2026-10; source: same → https://www.san.org/wp-content/uploads/2026/10/8-AUG-2026.pdf) | Carrier market share: no public read in the monthly (Southwest is the largest carrier by route list; share % not printed) (source: same → https://www.san.org/wp-content/uploads/2026/10/8-AUG-2026.pdf). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "8 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-san-diego.md 2026-10-11; https://www.san.org/wp-content/uploads/2026/10/8-AUG-2026.pdf"
  },
  {
    "id": "w1d-san-diego-d7",
    "marketSlug": "san-diego",
    "kind": "citywide_calendar",
    "title": "San Diego group / citywide demand calendar (D7) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), San Diego group / citywide demand calendar (D7). Oct 16–20, 2026: American Society of Anesthesiologists Annual · 16,000 | Oct 31–Nov 3: CRF TCT 2026 · 11,000 | Nov 13–15: TwitchCon 2026 · 25,000 | Nov 27–29: 2026 San Diego International Convention · 30,000 | Dec 3–5: CSBA Annual Education Conf · 4,500 | Dec 12–16: American Society for Cell Biology · 6,000 | Dec 31–Jan 3: SD International Auto Show · not listed | CY2025 primary conventions / attendees / contracted RN: 61 / 551,659 / 1,285,811 · https://www.sandiego.org/about/san-diego-tourism-fast-facts (2026-04-30) | 2027 anchors on calendar: Comic-Con Jul 22–25, 2027 (135,000); ESRI Jul 12–16 (21,000); AUA May 21–24 (18,000); ACS Fall Aug 22–26 (17,000) · visitsandiego.com/calendar | 2027 citywide gains/losses vs 2026: no public read (no SDTA pace release found). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "10 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-san-diego.md 2026-10-11; https://www.visitsandiego.com/calendar; https://www.sandiego.org/about/san-diego-tourism-fast-facts"
  },
  {
    "id": "w1d-san-diego-d8",
    "marketSlug": "san-diego",
    "kind": "drive",
    "title": "San Diego drive + attraction demand anchors (D8) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), San Diego drive + attraction demand anchors (D8). Drive catchment: LA/Orange County via I-5 and I-15, Inland Empire, Phoenix via I-8, Tijuana/Baja (3.8M Mexican day visitors) (2026-04-30; source: https://www.sandiego.org/about/san-diego-tourism-fast-facts) | Major attractions attendance: 13.4M 2025 (14.4M 2024, −7%) (2026-04-30; source: same → https://www.sandiego.org/about/san-diego-tourism-fast-facts) | Cruise: 315,451 total cruise pax 2025 (258,572 2024); 128,157 embarking (2026-04-30; source: same → https://www.sandiego.org/about/san-diego-tourism-fast-facts) | Sports: Petco Park (Padres), Snapdragon Stadium (source: geography) | Gas: National $4.36 (Oct 8, first October >$4). CA prices run above national (CA-specific figure not pulled). With an LA/OC drive base, friction matters for weekend leisure (2026-10-08; source: https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-san-diego.md 2026-10-11; https://www.sandiego.org/about/san-diego-tourism-fast-facts; https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/"
  },
  {
    "id": "w1d-san-francisco-bay-d3",
    "marketSlug": "san-francisco-bay",
    "kind": "visitation",
    "title": "SF Bay Area visitation / demand volume (D3) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), SF Bay Area visitation / demand volume (D3). Visitors 2025 actual: 23.7M; spend $9.4B; OCC 67.2% (2026-05 / 2026-07; source: https://www.sftravel.com/media/press-release/san-francisco-travel-reports-visitor-spending-milestone-projects-continued · https://www.sftravel.com/sites/default/files/2026-07/sft%202025%20annual%20report.pdf) | 2026 forecast: 24.4M visitors; $9.94B spend; OCC 70.7%; ADR $266.16; RevPAR $188.06 (+14.1%) (2026-08-26; source: https://www.sftravel.com/media/press-release/san-francisco-travel-forecasts-third-straight-year-growth-2027) | 2027 forecast: 25M visitors; $10.6B; OCC 72.1%; ADR $271.43; RevPAR $195.61 (2026-08-26; source: same → https://www.sftravel.com/media/press-release/san-francisco-travel-forecasts-third-straight-year-growth-2027) | Intl overnight (SF + San Mateo) 2027: 2.42M (+5.2%); spend $5.46B (+7.3%) (TE) (2026-08-26; source: same → https://www.sftravel.com/media/press-release/san-francisco-travel-forecasts-third-straight-year-growth-2027) | June 2026: \"Best occupancy month since the pandemic\" (no % given) (2026-08-26; source: same → https://www.sftravel.com/media/press-release/san-francisco-travel-forecasts-third-straight-year-growth-2027) | Leisure vs business vs group RN split: no public read (SF Travel cites \"steady gains in business and leisure,\" no shares) | San Jose / East Bay visitation: no public read this pass. Decision support; 'no public read' rows are kept as written.",
    "magnitude": "7 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-san-francisco-bay.md 2026-10-11; https://www.sftravel.com/media/press-release/san-francisco-travel-reports-visitor-spending-milestone-projects-continued; https://www.sftravel.com/sites/default/files/2026-07/sft%202025%20annual%20report.pdf; https://www.sftravel.com/media/press-release/san-francisco-travel-forecasts-third-straight-year-growth-2027"
  },
  {
    "id": "w1d-san-francisco-bay-d6",
    "marketSlug": "san-francisco-bay",
    "kind": "airlift",
    "title": "SF Bay Area airlift / air access demand (D6) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), SF Bay Area airlift / air access demand (D6). SFO Aug 2026 total: 5,033,894 (+4.1%) (2026-10; source: https://www.flysfo.com/sites/default/files/2026-10/Aug%202026%20and%20CYTD%20SFO%20Air%20Traffic%20Summary.pdf) | SFO Aug dom / intl: 3,611,762 (+7.7%) / 1,396,180 (−4.3%), so intl ≈ 28% (2026-10; source: same → https://www.flysfo.com/sites/default/files/2026-10/Aug%202026%20and%20CYTD%20SFO%20Air%20Traffic%20Summary.pdf) | SFO CYTD Aug: 37,220,885 (+2.1%); intl 10,663,746 (−1.2%) (2026-10; source: same → https://www.flysfo.com/sites/default/files/2026-10/Aug%202026%20and%20CYTD%20SFO%20Air%20Traffic%20Summary.pdf) | SFO T12 Aug: 55.31M (+1.7%); −3.8% vs 2019 (2026-10-08; source: https://www.siliconvalley.com/2026/10/08/economy-travel-airport-airline-flight-fly-soccer-san-jose-oakland/) | OAK Aug / YTD: 684,346 (−15.57%) / 5,302,998 (−15.09%) (2026-09; source: https://www.iflyoak.com/wp-content/uploads/2026/09/August-2026-Monthly-Statistical-report.pdf) | SJC Aug / T12: ~865,000 (−11.2%) / 9.91M (−11.5%); −36.7% vs 2019 (2026-10-08; source: siliconvalley.com (above) → https://www.siliconvalley.com/2026/10/08/economy-travel-airport-airline-flight-fly-soccer-san-jose-oakland/) | SFO mainline vs commuter landings Aug: +6.2% / −9.7% (upgauge) (2026-10; source: SFO PDF) | Carrier share: no public read this pass (United hub at SFO; Southwest-dominant OAK/SJC) | Winter 2026–27 adds/cuts: no public read this pass. Decision support; 'no public read' rows are kept as written.",
    "magnitude": "9 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-san-francisco-bay.md 2026-10-11; https://www.flysfo.com/sites/default/files/2026-10/Aug%202026%20and%20CYTD%20SFO%20Air%20Traffic%20Summary.pdf; https://www.siliconvalley.com/2026/10/08/economy-travel-airport-airline-flight-fly-soccer-san-jose-oakland/; https://www.iflyoak.com/wp-content/uploads/2026/09/August-2026-Monthly-Statistical-report.pdf"
  },
  {
    "id": "w1d-san-francisco-bay-d7",
    "marketSlug": "san-francisco-bay",
    "kind": "citywide_calendar",
    "title": "SF Bay Area group / citywide demand calendar (D7) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), SF Bay Area group / citywide demand calendar (D7). Oct 13–15, 2026: TechCrunch Disrupt (Moscone West) · ~10,000 founders/investors per organizer (TechCrunch, 2026-10-09) (source: https://www.moscone.com/events/techcrunch-disrupt-2026 · https://techcrunch.com/2026/10/09/techcrunch-disrupt-2026-starts-in-4-days-lock-in-your-pass-savings-of-up-to-100-before-prices-rise/ (accessed 2026-10-11)) | Oct 13–15, 2026 (Market Symposium Oct 12): SEMICON West (Moscone North + South; returns from Phoenix) · no public read (source: https://moscone.com/events/semicon-west-2026 · https://www.semiconwest.org/ (accessed 2026-10-11)) | Oct 19–21, 2026: Cloudflare Connect (Moscone West) · no public read (source: https://www.moscone.com/events/cloudflare-connect-2026 · https://www.cloudflare.com/connect/ (accessed 2026-10-11)) | Nov 1–4, 2026 (pre-meeting Oct 31): INFORMS Annual Meeting (Moscone South + Marriott Marquis; block at Marriott Marquis & InterContinental) · 6,000+ expected per organizer (source: https://www.informs.org/Meetings-Conferences/INFORMS-Conference-Calendar/2026-INFORMS-Annual-Meeting · https://meetings.informs.org/wordpress/annual/ (accessed 2026-10-11)) | Nov 17–20, 2026 (pre-day Nov 16): Microsoft Ignite (Moscone North, South, West; keynote at Chase Center) · no public read (source: https://www.moscone.com/events/microsoft-ignite-2026 · https://www.microsoft.com/en-us/security/blog/2026/09/30/secure-whats-next-your-guide-to-microsoft-security-at-microsoft-ignite-2026/ (accessed 2026-10-11)) | Dec 7–11: AGU Fall Meeting 2026 · no public read (source: https://www.moscone.com/events/american-geophysical-union-fall-meeting-2026) | 2026 Moscone: 38 events, >656,000 RN · https://www.sftravel.com/media/press-release/san-francisco-travel-forecasts-third-straight-year-growth-2027 (source: 2026-08-26) | 2027 Moscone: 33 events, >640,000 RN (−5 events, ~−2% RN) · same (source: 2026-08-26 → https://www.moscone.com/events/american-geophysical-union-fall-meeting-2026) | Dreamforce 2027: Sep 21–23, 2027, Moscone (2026 attendance: no public read on Salesforce page) · https://www.salesforce.com/dreamforce/df27-save-the-date/ (accessed 2026-10-11) (source: 2026). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "9 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-san-francisco-bay.md 2026-10-11; https://www.moscone.com/events/techcrunch-disrupt-2026; https://techcrunch.com/2026/10/09/techcrunch-disrupt-2026-starts-in-4-days-lock-in-your-pass-savings-of-up-to-100-before-prices-rise/; https://moscone.com/events/semicon-west-2026; https://www.semiconwest.org/; https://www.moscone.com/events/cloudflare-connect-2026; https://www.cloudflare.com/connect/; https://www.informs.org/Meetings-Conferences/INFORMS-Conference-Calendar/2026-INFORMS-Annual-Meeting; https://meetings.informs.org/wordpress/annual/; https://www.moscone.com/events/microsoft-ignite-2026; https://www.microsoft.com/en-us/security/blog/2026/09/30/secure-whats-next-your-guide-to-microsoft-security-at-microsoft-ignite-2026/; https://www.moscone.com/events/american-geophysical-union-fall-meeting-2026; https://www.sftravel.com/media/press-release/san-francisco-travel-forecasts-third-straight-year-growth-2027; https://www.salesforce.com/dreamforce/df27-save-the-date/"
  },
  {
    "id": "w1d-san-francisco-bay-d8",
    "marketSlug": "san-francisco-bay",
    "kind": "drive",
    "title": "SF Bay Area drive + attraction demand anchors (D8) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), SF Bay Area drive + attraction demand anchors (D8). Drive catchment: Sacramento/Central Valley (I-80, I-5/I-580), Monterey/Santa Cruz (US-101), Wine Country (napa-sonoma lane); BART/Caltrain substitutes in-region (source: geography) | Anchors: Chase Center, Oracle Park, Levi's Stadium (WC host), Golden Gate/Alcatraz, cable cars (source: geography) | Gas: National $4.36 (Oct 8, first October >$4). CA runs well above national (CA figure not pulled). Drive-in weekend leisure is the most exposed (2026-10-08; source: https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-san-francisco-bay.md 2026-10-11; https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/"
  },
  {
    "id": "w1d-seattle-d3",
    "marketSlug": "seattle",
    "kind": "visitation",
    "title": "Seattle visitation / demand volume (D3) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Seattle visitation / demand volume (D3). Visitors 2025 (Seattle + King County): 39.7M (−0.6%) (2026-03-26 (upd. 2026-05-13); source: https://visitseattle.org/press/press-releases/visit-seattle-2025-annual-meeting-data/) | Visitor spending 2025: $8.8B (−0.3%) (same; source: same → https://visitseattle.org/press/press-releases/visit-seattle-2025-annual-meeting-data/) | State/local taxes 2025: $840M (+0.1%) (same; source: same → https://visitseattle.org/press/press-releases/visit-seattle-2025-annual-meeting-data/) | Hotel OCC TTM Q2 2026: 68.6% vs 69.7% (overall Seattle market) (2026 Q2; source: https://kidder.com/wp-content/uploads/market_report/hotel-market-research-seattle-2026-2q.pdf) | Hotel OCC Q4 2025: 69.0% vs 70.4% (2025 Q4; source: https://kidder.com/wp-content/uploads/market_report/hotel-market-research-seattle-2025-4q.pdf) | Overnight vs day; leisure vs group: no public read (Visit Seattle said visitor profiles and 2025 international data come \"later this year\"; not found). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-seattle.md 2026-10-11; https://visitseattle.org/press/press-releases/visit-seattle-2025-annual-meeting-data/; https://kidder.com/wp-content/uploads/market_report/hotel-market-research-seattle-2026-2q.pdf; https://kidder.com/wp-content/uploads/market_report/hotel-market-research-seattle-2025-4q.pdf"
  },
  {
    "id": "w1d-seattle-d6",
    "marketSlug": "seattle",
    "kind": "airlift",
    "title": "Seattle airlift / air access demand (D6) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Seattle airlift / air access demand (D6). 2025 total pax: 52,715,181 (record; +0.08%) (fetched 2026-10-11; source: https://www.portseattle.org/page/airport-statistics) | 2025 international: ~7.1M (+7.8%), ~13.5% share (same; source: same → https://www.portseattle.org/page/airport-statistics) | Q2 2026 pax: +0.1% YoY; domestic −0.4%, intl +2.9% (2026-09; source: https://www.portseattle.org/sites/default/files/2026-09/Q2%202026%20Financial%20Performance.pdf) | 2026 forecast: ~53.1M pax (+0.8%) (2026-09; source: same → https://www.portseattle.org/sites/default/files/2026-09/Q2%202026%20Financial%20Performance.pdf) | International network: 62 international options to 36 destinations on 29 airlines; Alaska new London, Reykjavik, Rome (summer seasonal) (2026-09; source: same → https://www.portseattle.org/sites/default/files/2026-09/Q2%202026%20Financial%20Performance.pdf) | Latest month (Jul/Aug 2026) YoY: no public read (Port dashboard is JS-rendered; aggregator PDFs mislabeled, not used) | Carrier share: no public read this pass (Alaska + Delta hubs) | Winter 2026–27 adds/cuts: no public read this pass. Decision support; 'no public read' rows are kept as written.",
    "magnitude": "8 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-seattle.md 2026-10-11; https://www.portseattle.org/page/airport-statistics; https://www.portseattle.org/sites/default/files/2026-09/Q2%202026%20Financial%20Performance.pdf"
  },
  {
    "id": "w1d-seattle-d7",
    "marketSlug": "seattle",
    "kind": "citywide_calendar",
    "title": "Seattle group / citywide demand calendar (D7) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Seattle group / citywide demand calendar (D7). Summit first full year: 350,837 attendees; 68 Summit events (2026-08; source: https://architectureassociate.com/2026/08/seattle-convention-center-summit/) | INTERFACE Seattle (Arch): Dec 3, 2026; attendance no public read (2026; source: https://f2fevents.com/event/sea26/) | Halo Fest (Arch): Dec 12–13, 2026; attendance no public read (2026; source: https://www.halowaypoint.com/en/esports/halo-fest-faq) | SCC Oct–Jan citywide list: no public read (seattlecc.com/upcoming-events renders via JS; no event data in HTML) (2026-10-11; source: https://www.seattlecc.com/upcoming-events) | 2027 citywide gains/losses: no public read. Decision support; 'no public read' rows are kept as written.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-seattle.md 2026-10-11; https://architectureassociate.com/2026/08/seattle-convention-center-summit/; https://f2fevents.com/event/sea26/; https://www.halowaypoint.com/en/esports/halo-fest-faq; https://www.seattlecc.com/upcoming-events"
  },
  {
    "id": "w1d-seattle-d8",
    "marketSlug": "seattle",
    "kind": "drive",
    "title": "Seattle drive + attraction demand anchors (D8) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Seattle drive + attraction demand anchors (D8). Drive catchment: I-5 corridor (Portland, Vancouver BC via border), I-90 (Spokane, eastern WA); ferries/Olympic Peninsula (source: geography) | Cruise: 2026: 330 vessel calls, 2.1M revenue pax (record); NCLH homeport extended through 2035 (2026-09; source: Port Q2 2026 PDF (above) → https://www.portseattle.org/sites/default/files/2026-09/Q2%202026%20Financial%20Performance.pdf) | Sports / venues: Lumen Field (Seahawks, Sounders; WC host), T-Mobile Park, Climate Pledge Arena (source: geography) | Gas: National $4.36 (Oct 8, first October >$4). WA prices typically above national (WA figure not pulled). The BC cross-border drive is also FX/policy-sensitive (2026-10-08; source: https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-seattle.md 2026-10-11; https://www.portseattle.org/sites/default/files/2026-09/Q2%202026%20Financial%20Performance.pdf; https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/"
  },
  {
    "id": "w1d-washington-dc-d3",
    "marketSlug": "washington-dc",
    "kind": "visitation",
    "title": "Washington DC visitation / demand volume (D3) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Washington DC visitation / demand volume (D3). Total visitors 2025: 27.2M (+0.1% YoY; +20k) (2026-05-06; source: https://washington.org/research) | Domestic / international 2025: 25.1M (+0.4%) / 2.1M (−4.0%) (2026-05-06; source: https://washington.org/press/washington-dc-sees-slight-growth-visitation-2025-record-economic-impact-tourism) | Visitor spending / tax 2025: $11.9B (+4.0%) / $2.4B (+4.4%) (2026-05-06; source: https://washington.org/research) | Top intl origins 2025: Canada, India, UK, Germany, China (in order) (2026-05-06; source: https://www.washingtontimes.com/news/2026/may/6/dc-20000-tourists-2025-generating-24-billion-revenue/) | Convention-center vs non-CC meetings RN (2026 plan): 470,316 CC RN / 227,885 non-CC RN (2025-08; source: https://washington.org/press/destination-dc-announces-sales-and-marketing-strategies-meet-moment) | STR Jan–Jul 2025 (DDC cite): Demand \"relatively flat,\" revenue +6%; 21 hotels / 3,000+ rooms in pipeline (2025-08; source: same as above → https://washington.org/press/destination-dc-announces-sales-and-marketing-strategies-meet-moment) | Leisure vs business room-night mix: no public read (looked for a DDC segment split; DDC publishes only visitor and group-RN totals) | 2026 visitation update: no public read (DDC 2026 YTD not published; the Sep 2 2026 release repeats 2025) (2026-09-02; source: https://washington.org/destination-dc-announces-game-plan-leverage-sports-capital-momentum-foster-visitation-and-create-0). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "8 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-washington-dc.md 2026-10-11; https://washington.org/research; https://washington.org/press/washington-dc-sees-slight-growth-visitation-2025-record-economic-impact-tourism; https://www.washingtontimes.com/news/2026/may/6/dc-20000-tourists-2025-generating-24-billion-revenue/; https://washington.org/press/destination-dc-announces-sales-and-marketing-strategies-meet-moment; https://washington.org/destination-dc-announces-game-plan-leverage-sports-capital-momentum-foster-visitation-and-create-0"
  },
  {
    "id": "w1d-washington-dc-d6",
    "marketSlug": "washington-dc",
    "kind": "airlift",
    "title": "Washington DC airlift / air access demand (D6) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Washington DC airlift / air access demand (D6). Jul 2026 total pax DCA / IAD / system: 2.2M (+0.8%) / 2.8M (−0.1%) / 5.0M (+0.3%) (2026-09-08; source: https://www.mwaa.com/sites/mwaa.com/files/2026-09/7-26%20ATS%20%289.8.26%29.pdf) | YTD Jul 2026 DCA / IAD / system: 14.4M (+0.2%) / 16.5M (−2.6%) / 30.9M (−1.4%) (2026-09-08; source: same → https://www.mwaa.com/sites/mwaa.com/files/2026-09/7-26%20ATS%20%289.8.26%29.pdf) | IAD int'l commercial pax Jul / YTD: 1.1M (−1.9%) / 5.9M (−3.1%) (2026-09-08; source: same → https://www.mwaa.com/sites/mwaa.com/files/2026-09/7-26%20ATS%20%289.8.26%29.pdf) | Carrier share: DCA: American 52.1% (52.8% LY). IAD: United 66.3% (63.8% LY) (2026-09-08; source: same → https://www.mwaa.com/sites/mwaa.com/files/2026-09/7-26%20ATS%20%289.8.26%29.pdf) | IAD intl carrier moves Jul: Qatar −30.5% (geopolitical), BA −15.8% (downgauge), KLM +9.0% (2026-09-08; source: same → https://www.mwaa.com/sites/mwaa.com/files/2026-09/7-26%20ATS%20%289.8.26%29.pdf) | DCA 2025 full year: ~24.9M pax, −5.3% vs 26.3M 2024 (2026-07-19; source: https://www.arlnow.com/2026/07/19/reagan-national-targets-summer-rebound-after-rocky-start-to-2026/) | IAD YTD May ex-United Newark shift: +0.7% (headline ~−2%) (2026-07-19; source: same → https://www.arlnow.com/2026/07/19/reagan-national-targets-summer-rebound-after-rocky-start-to-2026/) | Winter adds: United IAD–Cartagena 4x weekly from Dec 17 (year-round); IAD–Liberia CR daily Dec 17–Jan 4 (seasonal) (2026-06-29 / 2026-07-15; source: https://united.mediaroom.com/2026-06-29-United-Announces-New-Nonstop-Flights-from-Houston-and-Washington,-D-C-to-Cartagena · https://ticotimes.net/2026/07/15/united-washington-guanacaste-direct-flights) | Winter 2026–27 seat totals: no public read (no free forward-schedule source; adds above are outbound leisure, not inbound demand) | BWI monthly 2026: not pulled this pass (gap). Decision support; 'no public read' rows are kept as written.",
    "magnitude": "10 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-washington-dc.md 2026-10-11; https://www.mwaa.com/sites/mwaa.com/files/2026-09/7-26%20ATS%20%289.8.26%29.pdf; https://www.arlnow.com/2026/07/19/reagan-national-targets-summer-rebound-after-rocky-start-to-2026/; https://united.mediaroom.com/2026-06-29-United-Announces-New-Nonstop-Flights-from-Houston-and-Washington; https://ticotimes.net/2026/07/15/united-washington-guanacaste-direct-flights"
  },
  {
    "id": "w1d-washington-dc-d7",
    "marketSlug": "washington-dc",
    "kind": "citywide_calendar",
    "title": "Washington DC group / citywide demand calendar (D7) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Washington DC group / citywide demand calendar (D7). Citywides 2026 / 2027 booked (DDC): 390,000 RN, $317M / 459,000 RN, ~$371M (+18% RN) (2026-09-02; source: https://washington.org/destination-dc-announces-game-plan-leverage-sports-capital-momentum-foster-visitation-and-create-0) | Events DC citywides FY2027 booked: 19 (as of May 2026); 9 held in 1H FY2026 (2026-07; source: https://eventsdc.com/sites/default/files/2026-07/FY2027%20Events%20DC%20Revenue%20Sufficiency%20Certifcation.pdf) | CNS Annual Meeting (WEWCC): Oct 31–Nov 4, 2026; attendance no public read (2026-10-11; source: https://www.cns.org/annualmeeting · https://www.cns.org/annualmeeting/travel-hotel/location (accessed 2026-10-11)) | SfN Neuroscience 2026 (WEWCC): Nov 14–18, 2026 (exhibits Nov 15–18); attendance no public read (2026-10-11; source: https://www.sfn.org/meetings/neuroscience-2026 (accessed 2026-10-11)) | NWSL Championship (Audi Field): Nov 21, 2026 (2026-09; source: https://www.travelmonitor.com.au/destination-dc-targets-sports-events-to-drive-visitation/) | National Air & Space Museum completes renovation: Nov 11, 2026 (2026-09; source: same → https://www.travelmonitor.com.au/destination-dc-targets-sports-events-to-drive-visitation/) | 2027 gains: NFL Draft Apr 29–May 1, 2027 (~1M expected); Men's Frozen Four (Apr 2027); 100th Cherry Blossom Festival (2026-09-02; source: https://washington.org/destination-dc-announces-game-plan-leverage-sports-capital-momentum-foster-visitation-and-create-0) | 2027 citywide losses: no public read. Decision support; 'no public read' rows are kept as written.",
    "magnitude": "8 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-washington-dc.md 2026-10-11; https://washington.org/destination-dc-announces-game-plan-leverage-sports-capital-momentum-foster-visitation-and-create-0; https://eventsdc.com/sites/default/files/2026-07/FY2027%20Events%20DC%20Revenue%20Sufficiency%20Certifcation.pdf; https://www.cns.org/annualmeeting; https://www.cns.org/annualmeeting/travel-hotel/location; https://www.sfn.org/meetings/neuroscience-2026; https://www.travelmonitor.com.au/destination-dc-targets-sports-events-to-drive-visitation/"
  },
  {
    "id": "w1d-washington-dc-d8",
    "marketSlug": "washington-dc",
    "kind": "drive",
    "title": "Washington DC drive + attraction demand anchors (D8) — Vectra wave 1",
    "body": "Vectra depth wave 1 (2026-10-11), Washington DC drive + attraction demand anchors (D8). Drive catchment: I-95 corridor (Baltimore, Philadelphia, Richmond), I-66/I-270/I-81 feeders; Amtrak NEC substitutes for car (source: geography, no number) | Attractions: Free Smithsonian/national museums; Air & Space reopens fully Nov 11, 2026 (2026-09; source: travelmonitor (above) → https://www.travelmonitor.com.au/destination-dc-targets-sports-events-to-drive-visitation/) | Sports: Nationals Park, Capital One Arena (renovation reveal fall 2027), Audi Field; Commanders to RFK indoor stadium ~2030 (2026-09-02; source: washington.org Sep 2 release) | Gas: National avg $4.36 (Oct 8), first October ever above $4. DC is a mixed fly/drive/rail market, so friction is moderate; the rail substitute dampens it (2026-10-08; source: https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/) | DC-specific drive share: no public read. Decision support; 'no public read' rows are kept as written.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/depth-w1-washington-dc.md 2026-10-11; https://www.travelmonitor.com.au/destination-dc-targets-sports-events-to-drive-visitation/; https://newsroom.aaa.com/2026/10/pump-prices-remain-at-record-highs-for-autumn/"
  },
  {
    "id": "w1d-washington-dc-compression-90d",
    "marketSlug": "washington-dc",
    "kind": "citywide_calendar",
    "title": "Washington DC 90-day compression calendar (Oct 12 2026 → Jan 10 2027) — demand, Vectra wave 1",
    "body": "Rolling 90-day compression calendar, Wave 1 (Vectra, 2026-10-11). Cited rows only (Vectra hold applied); attendance not invented. 2026-10-31 → 2026-11-04: CNS Annual Meeting (WEWCC) [Citywide / medical] — Confirmed https://www.cns.org/annualmeeting (accessed 2026-10-11); next pull: Attendance | 2026-11-14 → 2026-11-18: SfN Neuroscience 2026 (WEWCC; exhibits Nov 15–18) [Citywide / association] — Confirmed https://www.sfn.org/meetings/neuroscience-2026 (accessed 2026-10-11); next pull: sfn.org housing block | 2026-11-21: NWSL Championship (Audi Field) + Legends Ball (WEWCC) [Sports / gala] — https://www.travelmonitor.com.au/destination-dc-targets-sports-events-to-drive-visitation/ · https://eventsdc.com/venue/walter-e-washington-convention-center; next pull: Weekend compression only. Decision support.",
    "magnitude": "3 events",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/_compression-90d.md (Wave 1) 2026-10-11; https://www.cns.org/annualmeeting; https://www.sfn.org/meetings/neuroscience-2026; https://www.travelmonitor.com.au/destination-dc-targets-sports-events-to-drive-visitation/; https://eventsdc.com/venue/walter-e-washington-convention-center"
  },
  {
    "id": "w1d-san-diego-compression-90d",
    "marketSlug": "san-diego",
    "kind": "citywide_calendar",
    "title": "San Diego 90-day compression calendar (Oct 12 2026 → Jan 10 2027) — demand, Vectra wave 1",
    "body": "Rolling 90-day compression calendar, Wave 1 (Vectra, 2026-10-11). Cited rows only (Vectra hold applied); attendance not invented. 2026-10-16 → 2026-10-20: American Society of Anesthesiologists Annual (SDCC), 16,000 listed [Citywide / medical] — Official SDCC calendar https://www.visitsandiego.com/calendar; next pull: Organizer housing | 2026-10-31 → 2026-11-03: CRF TCT 2026 (SDCC), 11,000 listed [Citywide / medical] — Official SDCC calendar https://www.visitsandiego.com/calendar | 2026-11-13 → 2026-11-15: TwitchCon 2026 (SDCC), 25,000 listed [Citywide / consumer-tech] — Official SDCC calendar https://www.visitsandiego.com/calendar | 2026-11-27 → 2026-11-29: 2026 San Diego International Convention (SDCC), 30,000 listed [Citywide / Thanksgiving weekend] — Official SDCC calendar https://www.visitsandiego.com/calendar; next pull: Stacks on holiday leisure | 2026-12-12 → 2026-12-16: ASCB Cell Bio (SDCC), 6,000 listed [Association] — Official SDCC calendar https://www.visitsandiego.com/calendar. Decision support.",
    "magnitude": "5 events",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/_compression-90d.md (Wave 1) 2026-10-11; https://www.visitsandiego.com/calendar"
  },
  {
    "id": "w1d-houston-compression-90d",
    "marketSlug": "houston",
    "kind": "citywide_calendar",
    "title": "Houston 90-day compression calendar (Oct 12 2026 → Jan 10 2027) — demand, Vectra wave 1",
    "body": "Rolling 90-day compression calendar, Wave 1 (Vectra, 2026-10-11). Cited rows only (Vectra hold applied); attendance not invented. 2026-11-07 → 2026-11-08: Collect-A-Con Houston (GRB Hall B) [Consumer] — Confirmed https://collectaconusa.com/houston2/ (accessed 2026-10-11); next pull: Weekend only | 2026-11-10 → 2026-11-15: International Quilt Festival (GRB; show Nov 12–15) [Citywide-class consumer/trade] — Organizer https://www.quilts.com/quilt-festival/quilt-festival-houston/media-resources/; next pull: Attendance not published on the 2026 page. Decision support.",
    "magnitude": "2 events",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/_compression-90d.md (Wave 1) 2026-10-11; https://collectaconusa.com/houston2/; https://www.quilts.com/quilt-festival/quilt-festival-houston/media-resources/"
  },
  {
    "id": "w1d-boston-compression-90d",
    "marketSlug": "boston",
    "kind": "citywide_calendar",
    "title": "Boston 90-day compression calendar (Oct 12 2026 → Jan 10 2027) — demand, Vectra wave 1",
    "body": "Rolling 90-day compression calendar, Wave 1 (Vectra, 2026-10-11). Cited rows only (Vectra hold applied); attendance not invented. 2026-10-12 → 2026-10-21: BCEC/Hynes medical-tech stack: AHCA/NCAL, Patient Safety Congress, ASCO Quality, Veeva R&D, AdvaMed MedTech (4,000+) [Citywide / medical] — Official Signature Boston calendar https://www.signatureboston.com/events; next pull: Attendance per event | 2026-12-10: Massachusetts Conference for Women (MCEC, formerly BCEC; sold out) [Regional / day event] — Confirmed https://www.conferencesforwomen.org/ma/ (accessed 2026-10-11); ~15,000 per secondary https://www.success.events/events/massachusetts-conference-for-women-2026; next pull: Low overnight share. Decision support.",
    "magnitude": "2 events",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/_compression-90d.md (Wave 1) 2026-10-11; https://www.signatureboston.com/events; https://www.conferencesforwomen.org/ma/; https://www.success.events/events/massachusetts-conference-for-women-2026"
  },
  {
    "id": "w1d-atlanta-compression-90d",
    "marketSlug": "atlanta",
    "kind": "citywide_calendar",
    "title": "Atlanta 90-day compression calendar (Oct 12 2026 → Jan 10 2027) — demand, Vectra wave 1",
    "body": "Rolling 90-day compression calendar, Wave 1 (Vectra, 2026-10-11). Cited rows only (Vectra hold applied); attendance not invented. 2026-12-05: SEC Championship (Mercedes-Benz Stadium) + SEC FanFare (GWCC) [Sports / weekend] — https://www.mercedesbenzstadium.com/events/sec-championship-4; next pull: Downtown weekend compression | 2027-01-01: Chick-fil-A Peach Bowl, CFP Quarterfinal (MBS) [Sports / holiday] — Organizer https://chick-fil-apeachbowl.com/news/2026/2/3/general-chick-fil-a-peach-bowl-dates-announced-for-2026-2027.aspx; next pull: Prior edition 75,604 attendance | 2026-11-13 → 2026-11-15: MagicCon: Atlanta (GWCC Bldg C) [Consumer / fan] — Confirmed https://mcatlanta.mtgfestivals.com/en-us/info/faq.html (accessed 2026-10-11); next pull: Attendance | 2026-11-19 → 2026-11-22: Anime Weekend Atlanta (GWCC Bldg C) [Consumer / fan] — Confirmed https://awa-con.com/ (accessed 2026-10-11); next pull: Attendance | 2026-12-09 → 2026-12-13: NeurIPS 2026 Atlanta satellite (GWCC Hall C2) [Citywide-class academic / tech] — Confirmed https://neurips.cc/Conferences/2026/VenueInformation (accessed 2026-10-11); next pull: Downtown OCC; attendance split across 3 sites. Decision support.",
    "magnitude": "5 events",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/_compression-90d.md (Wave 1) 2026-10-11; https://www.mercedesbenzstadium.com/events/sec-championship-4; https://chick-fil-apeachbowl.com/news/2026/2/3/general-chick-fil-a-peach-bowl-dates-announced-for-2026-2027.aspx; https://mcatlanta.mtgfestivals.com/en-us/info/faq.html; https://awa-con.com/; https://neurips.cc/Conferences/2026/VenueInformation"
  },
  {
    "id": "w1d-phoenix-compression-90d",
    "marketSlug": "phoenix",
    "kind": "citywide_calendar",
    "title": "Phoenix 90-day compression calendar (Oct 12 2026 → Jan 10 2027) — demand, Vectra wave 1",
    "body": "Rolling 90-day compression calendar, Wave 1 (Vectra, 2026-10-11). Cited rows only (Vectra hold applied); attendance not invented. 2026-12-11 → 2026-12-15: National Athletic Directors Conference & Exhibit Show (PCC) [Association] — Confirmed https://nfhs.org/about/future-conference (accessed 2026-10-11); next pull: Attendance | 2026-12-30: Vrbo Fiesta Bowl, CFP Quarterfinal (State Farm Stadium, Glendale) [Sports / holiday] — Organizer https://www.fiestasportsfoundation.org/news/2026/7/9/vrbo-fiesta-bowl-announces-dates-to-host-college-football-playoff-matchups-through-2032.aspx; next pull: Stacks on NYE resort peak. Decision support.",
    "magnitude": "2 events",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/_compression-90d.md (Wave 1) 2026-10-11; https://nfhs.org/about/future-conference; https://www.fiestasportsfoundation.org/news/2026/7/9/vrbo-fiesta-bowl-announces-dates-to-host-college-football-playoff-matchups-through-2032.aspx"
  },
  {
    "id": "w1d-seattle-compression-90d",
    "marketSlug": "seattle",
    "kind": "citywide_calendar",
    "title": "Seattle 90-day compression calendar (Oct 12 2026 → Jan 10 2027) — demand, Vectra wave 1",
    "body": "Rolling 90-day compression calendar, Wave 1 (Vectra, 2026-10-11). Cited rows only (Vectra hold applied); attendance not invented. 2026-12-03: INTERFACE Seattle (SCC Arch) [Tech / day event] — Organizer https://f2fevents.com/event/sea26/; next pull: Low overnight share | 2026-12-12 → 2026-12-13: Halo Fest (SCC Arch) [Consumer / esports] — Organizer https://www.halowaypoint.com/en/esports/halo-fest-faq; next pull: Weekend; attendance not published. Decision support.",
    "magnitude": "2 events",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/_compression-90d.md (Wave 1) 2026-10-11; https://f2fevents.com/event/sea26/; https://www.halowaypoint.com/en/esports/halo-fest-faq"
  },
  {
    "id": "w1d-san-francisco-bay-compression-90d",
    "marketSlug": "san-francisco-bay",
    "kind": "citywide_calendar",
    "title": "SF Bay 90-day compression calendar (Oct 12 2026 → Jan 10 2027) — demand, Vectra wave 1",
    "body": "Rolling 90-day compression calendar, Wave 1 (Vectra, 2026-10-11). Cited rows only (Vectra hold applied); attendance not invented. 2026-10-13 → 2026-10-15: TechCrunch Disrupt (Moscone West; ~10,000) + SEMICON West (Moscone N+S) [Citywide / tech] — Confirmed https://www.moscone.com/events/techcrunch-disrupt-2026 · https://moscone.com/events/semicon-west-2026 · count https://techcrunch.com/2026/10/09/techcrunch-disrupt-2026-starts-in-4-days-lock-in-your-pass-savings-of-up-to-100-before-prices-rise/ (accessed 2026-10-11); next pull: SEMICON attendance | 2026-11-01 → 2026-11-04: INFORMS Annual Meeting (Moscone South + Marriott Marquis; 6,000+) [Association] — Confirmed https://meetings.informs.org/wordpress/annual/ (accessed 2026-10-11) | 2026-11-17 → 2026-11-20: Microsoft Ignite (Moscone N/S/W; pre-day Nov 16) [Citywide / tech] — Confirmed https://www.moscone.com/events/microsoft-ignite-2026 (accessed 2026-10-11); next pull: Room-block size | 2026-12-07 → 2026-12-11: AGU Fall Meeting 2026 (Moscone) [Citywide / association] — Official Moscone event page https://www.moscone.com/events/american-geophysical-union-fall-meeting-2026; next pull: Attendance. Decision support.",
    "magnitude": "4 events",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/_compression-90d.md (Wave 1) 2026-10-11; https://www.moscone.com/events/techcrunch-disrupt-2026; https://moscone.com/events/semicon-west-2026; https://techcrunch.com/2026/10/09/techcrunch-disrupt-2026-starts-in-4-days-lock-in-your-pass-savings-of-up-to-100-before-prices-rise/; https://meetings.informs.org/wordpress/annual/; https://www.moscone.com/events/microsoft-ignite-2026; https://www.moscone.com/events/american-geophysical-union-fall-meeting-2026"
  },
  {
    "id": "w1d-dallas-compression-90d",
    "marketSlug": "dallas",
    "kind": "citywide_calendar",
    "title": "Dallas 90-day compression calendar (Oct 12 2026 → Jan 10 2027) — demand, Vectra wave 1",
    "body": "Rolling 90-day compression calendar, Wave 1 (Vectra, 2026-10-11). Cited rows only (Vectra hold applied); attendance not invented. → 2026-10-18: State Fair of Texas (Fair Park) [Regional drive-in / leisure] — Fair Park events https://www.fairparkdallas.com/events; next pull: Attendance | 2026-11-18 → 2026-11-22: HYROX Dallas 2026 (KBHCCD) [Consumer sports] — Official KBHCCD page https://www.dallasconventioncenter.com/events/detail/hyrox-dallas-2026; next pull: Participant + spectator counts | 2027-01-01: Cotton Bowl, CFP Quarterfinal (AT&T Stadium, Arlington) [Sports / holiday] — https://www.ncaa.com/news/football/article/2026-08-04/2026-27-college-football-playoff-schedule-dates-tv-channel-sites; next pull: Arlington compression. Decision support.",
    "magnitude": "3 events",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/_compression-90d.md (Wave 1) 2026-10-11; https://www.fairparkdallas.com/events; https://www.dallasconventioncenter.com/events/detail/hyrox-dallas-2026; https://www.ncaa.com/news/football/article/2026-08-04/2026-27-college-football-playoff-schedule-dates-tv-channel-sites"
  },
  {
    "id": "w1d-nashville-compression-90d",
    "marketSlug": "nashville",
    "kind": "citywide_calendar",
    "title": "Nashville 90-day compression calendar (Oct 12 2026 → Jan 10 2027) — demand, Vectra wave 1",
    "body": "Rolling 90-day compression calendar, Wave 1 (Vectra, 2026-10-11). Cited rows only (Vectra hold applied); attendance not invented. 2026-10-11 → 2026-10-14: American College of Gastroenterology (MCC), 10,000 listed [Citywide / medical] — Official MCC calendar https://nashvillemcc.com/calendar; next pull: Window start overlap | 2026-11-18 → 2026-11-21: NLC City Summit (MCC), 4,000 listed + 60th CMA Awards (Bridgestone, Nov 18) [Association + entertainment] — MCC calendar; https://www.bridgestonearena.com/events/detail/the-60th-annual-cma-awards; next pull: Stacked week | 2026-12-09 → 2026-12-13: HYROX Fitness Event (MCC), 30,000 listed [Consumer sports] — Official MCC calendar https://nashvillemcc.com/calendar; next pull: Overnight share | 2027-01-07 → 2027-01-10: Antiques & Garden Show of Nashville (MCC) [Consumer] — Official MCC calendar https://nashvillemcc.com/calendar; next pull: Attendance. Decision support.",
    "magnitude": "4 events",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/_compression-90d.md (Wave 1) 2026-10-11; https://nashvillemcc.com/calendar; https://www.bridgestonearena.com/events/detail/the-60th-annual-cma-awards"
  },
  {
    "id": "w1d-los-angeles-compression-90d",
    "marketSlug": "los-angeles",
    "kind": "citywide_calendar",
    "title": "Los Angeles 90-day compression calendar (Oct 12 2026 → Jan 10 2027) — demand, Vectra wave 1",
    "body": "Rolling 90-day compression calendar, Wave 1 (Vectra, 2026-10-11). Cited rows only (Vectra hold applied); attendance not invented. 2026-10-30 → 2026-11-01: L.A. Comic Con (LACC) [Consumer] — Official LACC page https://www.laconventioncenter.com/events/detail/la-comic-con-2026; next pull: Attendance | 2026-11-19 → 2026-11-29: AutoMobility LA (Nov 19) + LA Auto Show (Nov 20–29) (LACC) [Consumer / trade] — Organizer https://laautoshow.com/press_releases/2026automobilityla/; next pull: Overlaps Thanksgiving | 2027-01-01: Rose Bowl, CFP Quarterfinal (Pasadena) [Sports / holiday] — https://www.ncaa.com/news/football/article/2026-08-04/2026-27-college-football-playoff-schedule-dates-tv-channel-sites; next pull: Pasadena + Rose Parade. Decision support.",
    "magnitude": "3 events",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/_compression-90d.md (Wave 1) 2026-10-11; https://www.laconventioncenter.com/events/detail/la-comic-con-2026; https://laautoshow.com/press_releases/2026automobilityla/; https://www.ncaa.com/news/football/article/2026-08-04/2026-27-college-football-playoff-schedule-dates-tv-channel-sites"
  },
  {
    "id": "w1d-honolulu-compression-90d",
    "marketSlug": "honolulu",
    "kind": "citywide_calendar",
    "title": "Honolulu 90-day compression calendar (Oct 12 2026 → Jan 10 2027) — demand, Vectra wave 1",
    "body": "Rolling 90-day compression calendar, Wave 1 (Vectra, 2026-10-11). Cited rows only (Vectra hold applied); attendance not invented. 2026-12-10 → 2026-12-13: Honolulu Marathon Expo (HCC; 60,000 listed) + JAL Honolulu Marathon (Dec 13) [Sports / Japan-heavy] — Official HCC listing https://events.hawaiiconvention.com/ · https://www.honolulumarathon.org/our-events/jal-honolulu-marathon; next pull: Japan seats into Dec | 2026-12-01 → 2027-01-03: 'Twas the Light Before Christmas on Ice (HCC; 20,000 listed) [Local / holiday] — Official HCC listing https://events.hawaiiconvention.com/; next pull: Low overnight share | 2027-01-13 → 2027-01-19: TransPacific Volleyball Championships (HCC; 15,000 listed) [Youth sports] — Official HCC listing https://events.hawaiiconvention.com/; next pull: Just past window (context). Decision support.",
    "magnitude": "3 events",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/_compression-90d.md (Wave 1) 2026-10-11; https://events.hawaiiconvention.com/; https://www.honolulumarathon.org/our-events/jal-honolulu-marathon"
  },
  {
    "id": "w1d-new-york-city-compression-90d",
    "marketSlug": "new-york-city",
    "kind": "citywide_calendar",
    "title": "New York City 90-day compression calendar (Oct 12 2026 → Jan 10 2027) — demand, Vectra wave 1",
    "body": "Rolling 90-day compression calendar, Wave 1 (Vectra, 2026-10-11). Cited rows only (Vectra hold applied); attendance not invented. 2026-11-03 → 2026-11-05: ISC East (Javits; exhibits Nov 4–5) [Trade] — Confirmed https://www.discoverisc.com/east/en-us.html (accessed 2026-10-11) | 2026-11-27 → 2026-12-01: Greater New York Dental Meeting (Javits; exhibits Nov 29–Dec 1) [Citywide / medical; Thanksgiving weekend] — Confirmed https://www.gnydm.com/attendee-information/general-information/ (accessed 2026-10-11); next pull: Attendance + block | 2026-12-02 → 2026-12-04: New York Produce Show & Conference (Javits floor Dec 3) [Trade] — Confirmed https://www.nyproduceshow.com/ (accessed 2026-10-11) | 2026-12-09 → 2026-12-10: The AI Summit New York (Javits) [Tech] — Confirmed https://newyork.theaisummit.com/about/faqs/ (accessed 2026-10-11). Decision support.",
    "magnitude": "4 events",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/_compression-90d.md (Wave 1) 2026-10-11; https://www.discoverisc.com/east/en-us.html; https://www.gnydm.com/attendee-information/general-information/; https://www.nyproduceshow.com/; https://newyork.theaisummit.com/about/faqs/"
  },
  {
    "id": "w1d-miami-compression-90d",
    "marketSlug": "miami",
    "kind": "citywide_calendar",
    "title": "Miami 90-day compression calendar (Oct 12 2026 → Jan 10 2027) — demand, Vectra wave 1",
    "body": "Rolling 90-day compression calendar, Wave 1 (Vectra, 2026-10-11). Cited rows only (Vectra hold applied); attendance not invented. 2026-11-02 → 2026-11-04: The Hospitality Show 2026 (AHLA; MBCC) [Trade show] — Confirmed https://www.ahla.com/news/hospitality-show-opens-registration-industry-event-focused-hotel-operations-and-performance · https://www.miamibeachconvention.com/events/hospitality-show-2026 (accessed 2026-10-11); attendance not public | 2026-11-06 → 2026-11-08: NASCAR Championship Weekend (Homestead-Miami) [Sports] — Confirmed https://www.homesteadmiamispeedway.com/2025/05/06/2026-nascar-championship-weekend-moves-to-homestead-miami-speedway-on-nov-6-8/; next pull: Check attendance and South Dade OCC | 2026-12-02 → 2026-12-06: Miami Art Week: Art Basel Miami Beach Dec 4–6 (VIP Dec 2–3); Design Miami Dec 1–6 [Cultural / citywide-scale] — Art Basel https://www.artbasel.com/miami-beach/at-the-show ; Design Miami https://designmiami.com/fair/miami-2026 (2026-10-11); next pull: Miami Beach OCC/ADR week | 2026-12-14 → 2026-12-15: G20 Leaders' Summit (Trump National Doral) [Government / security] — Confirmed https://g20.org/location/; next pull: Airport/Doral blocks; displacement | 2027-01-14 (just outside): Orange Bowl CFP semifinal (Hard Rock Stadium) [Sports] — Confirmed https://www.ncaa.com/news/football/article/2026-08-04/2026-27-college-football-playoff-schedule-dates-tv-channel-sites; next pull: Next window. Decision support.",
    "magnitude": "5 events",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/_compression-90d.md (Wave 1) 2026-10-11; https://www.ahla.com/news/hospitality-show-opens-registration-industry-event-focused-hotel-operations-and-performance; https://www.miamibeachconvention.com/events/hospitality-show-2026; https://www.homesteadmiamispeedway.com/2025/05/06/2026-nascar-championship-weekend-moves-to-homestead-miami-speedway-on-nov-6-8/; https://www.artbasel.com/miami-beach/at-the-show; https://designmiami.com/fair/miami-2026; https://g20.org/location/; https://www.ncaa.com/news/football/article/2026-08-04/2026-27-college-football-playoff-schedule-dates-tv-channel-sites"
  },
  {
    "id": "w1d-chicago-compression-90d",
    "marketSlug": "chicago",
    "kind": "citywide_calendar",
    "title": "Chicago 90-day compression calendar (Oct 12 2026 → Jan 10 2027) — demand, Vectra wave 1",
    "body": "Rolling 90-day compression calendar, Wave 1 (Vectra, 2026-10-11). Cited rows only (Vectra hold applied); attendance not invented. 2026-10-18 → 2026-10-21: PACK EXPO International (McCormick Place) [Citywide trade show] — Confirmed; ~48,000 projected https://www.packexpointernational.com/the-show?pr=MED1; next pull: South Loop/CBD OCC that week | 2026-10-29 → 2026-10-31: ANCC Magnet & Pathway Conference (McCormick) [Medical / nursing] — Confirmed https://magnetpathwaycon.nursingworld.org/faqs-2026-magnet-pathway-conference (accessed 2026-10-11); next pull: Attendance | 2026-11-07 → 2026-11-08: AHA Resuscitation Science Symposium (McCormick) [Medical] — Confirmed https://professional.heart.org/en/meetings/resuscitation-science-symposium (accessed 2026-10-11) | 2026-11-29 → 2026-12-03: RSNA 2026 (McCormick); 700+ exhibitors [Citywide medical] — Confirmed https://www.rsna.org/news/2026/october/rsna-2026-technical-exhibits ; attendance not public; next pull: Watch Local 1 strike risk in peak week | 2026-12-16 → 2026-12-18: Midwest Clinic (McCormick); 18,000+ annual attendees [Convention] — Confirmed https://www.midwestclinic.org/Conference_Dates | 2027-01-07 → 2027-01-10: ABCA Convention (McCormick) [Convention] — Confirmed https://www.abca.org/convention (accessed 2026-10-11). Decision support.",
    "magnitude": "6 events",
    "asOf": "2026-10-11",
    "sourceLabel": "Vectra demand/_compression-90d.md (Wave 1) 2026-10-11; https://www.packexpointernational.com/the-show?pr=MED1; https://magnetpathwaycon.nursingworld.org/faqs-2026-magnet-pathway-conference; https://professional.heart.org/en/meetings/resuscitation-science-symposium; https://www.rsna.org/news/2026/october/rsna-2026-technical-exhibits; https://www.midwestclinic.org/Conference_Dates; https://www.abca.org/convention"
  },
  {
    "id": "w1-sd-supply-score",
    "marketSlug": "san-diego",
    "kind": "supply",
    "title": "San Diego supply pressure 3/5 (Atlas wave 1) — CBD + South Bay focused-service, coast protected",
    "body": "Atlas supply-pressure score 3/5 (mixed). UC intensity: 2,211 rooms under construction on ~66.7k implied rooms ≈ 3.3% (Atlas derivation). Starts vs history: UC doubled YoY (13 hotels / 2,211 rooms in H1 2026 vs 10 / 1,106 in 2025; #2 in California behind LA) after near-zero openings 2022–24 (0 in 2022, 2 / 269 in 2023, 1 / 179 in 2024); statewide planning volume fell. Conversion share low — mostly ground-up branded upscale/upper-midscale and extended-stay. CBD and South/East each projected >20% inventory growth. Build-talent friction: the city's $25 hotel-worker minimum wage plus high construction cost. Call: no focused-service ground-up downtown; coastal or luxury needs a site barrier (Ledger owns $/key).",
    "magnitude": "3/5",
    "asOf": "2026-10-11",
    "sourceLabel": "Atlas depth-w1 2026-10-11 (markets/depth-w1-san-diego-supply.md); Atlas Hospitality Group mid-year report via HeadTopics (secondary) https://us.headtopics.com/news/san-diego-hotel-development-doubles-in-a-single-year-85447446; Hotel Online 2026 forecast https://www.hotel-online.com/index.php/news/2026-lodging-forecast-san-diego; C&W MarketBeat Q2 2026 https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf"
  },
  {
    "id": "w1-sd-rule",
    "marketSlug": "san-diego",
    "kind": "nuance",
    "title": "Which San Diego — rule: the Gaylord is not San Diego",
    "body": "The 1,600-room Gaylord Pacific in Chula Vista is a single self-contained group campus. It pulled down metro occupancy in 2025 and may again in 2026 (Marcus & Millichap). Read it as a South Bay group-box absorption story, not coastal or CBD dilution. Coastal and CBD barriers stay high: construction cost, the Coastal Commission and environmental review, community resistance, and the city's $25 hotel-worker minimum wage. Human touch first: underwrite labor at that floor, not FTE cuts.",
    "magnitude": "rule",
    "asOf": "2026-10-11",
    "sourceLabel": "Atlas depth-w1 2026-10-11; Marcus & Millichap San Diego 2026 hospitality forecast https://www.marcusmillichap.com/research/market-report/san-diego/san-diego-2026-investment-forecast-hospitality-market-report; Hotel Online https://www.hotel-online.com/index.php/news/2026-lodging-forecast-san-diego"
  },
  {
    "id": "w1-sd-snapshot",
    "marketSlug": "san-diego",
    "kind": "supply",
    "title": "San Diego supply snapshot and submarket basemap (Atlas wave 1)",
    "body": "Implied rooms ~66,731 (C&W Q2 2026 supply room-nights ÷ 91, Atlas derivation). Rooms under construction (county) 13 hotels / 2,211, ~2x YoY; openings H1 2026 4 hotels / 333 rooms (California leader). Submarkets (v0): Downtown/CBD/Gaslamp — Convention Center + leisure, projected >20% inventory growth (Tru/Home2 271, Le Méridien 231); South/East (Chula Vista, Santee) — Gaylord group campus and extended-stay, >20% growth (Element Chula Vista 156); Airport/Harbor Island — Airport T1 full completion 2028 (Fairfield 128 + SpringHill 119, May 2027); Mission Valley — focused-service/extended-stay (Element 150, Feb 2026); North County — leisure, LEGOLAND LEGO Galaxy Mar 2026 (Autograph Carlsbad 32; Tempo Del Mar 127); La Jolla/coastal — barrier-protected luxury, no new supply found.",
    "magnitude": "~66.7k rooms / 2,211 UC",
    "asOf": "H1 2026",
    "sourceLabel": "Atlas depth-w1 2026-10-11; C&W https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf; HeadTopics (secondary) https://us.headtopics.com/news/san-diego-hotel-development-doubles-in-a-single-year-85447446; Hotel Online https://www.hotel-online.com/index.php/news/2026-lodging-forecast-san-diego; Marcus & Millichap https://www.marcusmillichap.com/research/market-report/san-diego/san-diego-2026-investment-forecast-hospitality-market-report"
  },
  {
    "id": "w1-sd-pulse",
    "marketSlug": "san-diego",
    "kind": "occupancy",
    "title": "San Diego pulse 2026: Q2 RevPAR $178 (+6.3%, C&W); BIO week OCC 91.9%",
    "body": "C&W MarketBeat Q2 2026 (STR/CoStar): OCC 77.8%, ADR $228, RevPAR $178 (+6.3%); supply +1.6%. CoStar week ending Aug 15: Top-25 highest ADR gain (+12.6% to $249.71) and RevPAR gain (+22.8% to $201.10). Week ending Jun 27: OCC +13.1% to 91.9% (BIO International Convention). Week ending May 16: steepest ADR (−4.6% to $209.08) and RevPAR (−10.3% to $151.15) declines. Week ending Mar 7: OCC +12.5% to 73.5%, RevPAR +20.7% to $153.11. Week ending Jan 10: ADR −9.5% to $161.76, RevPAR −22.5% to $82.72. San Diego was not a World Cup host city.",
    "magnitude": "Q2 RevPAR $178 (+6.3%)",
    "asOf": "Q2 2026 / w/e 2026-08-15",
    "sourceLabel": "C&W https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf; CoStar w/e 15 Aug https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-15-august; w/e 27 Jun https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-27-june; w/e 16 May https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-16-may; w/e 7 Mar https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-7-march; w/e 10 Jan https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-10-january"
  },
  {
    "id": "w1-sd-pipeline",
    "marketSlug": "san-diego",
    "kind": "supply",
    "title": "San Diego pipeline: named projects (Atlas wave 1)",
    "body": "Stage rollup: UC (county) 13 hotels / 2,211 rooms; opened H1 2026 4 / 333; Downtown UC per city Civic SD report 620 rooms (502 in a second table, approximate, per permits). Named: Gaylord Pacific Resort & Convention Center ~1,600, open 2025 (Chula Vista Bayfront); Le Méridien Downtown 231, scheduled Jun 2026 (CBD); Tru + Home2 Suites, 5th & Ash (16 stories; Vanderval) 271 (133 + 130 per Hotel Online), UC per city report — Apr 2026 per forecast but still listed UC Jul 2026, so a slip is possible; Element Chula Vista 156, Jul 2026; Element Mission Valley 150, Feb 2026; Fairfield by Marriott Airport 128, UC, May 2027; SpringHill Suites Airport 119, UC, May 2027; Tempo by Hilton San Diego/Del Mar 127, opened Oct 2025; WoodSpring Suites Santee 122, Dec 2025; Autograph Collection Carlsbad 32, May 2026.",
    "magnitude": "2,211 rooms UC",
    "asOf": "2026-10-11",
    "sourceLabel": "Atlas depth-w1 2026-10-11 (pipeline/depth-w1-san-diego-pipeline.md); HeadTopics (secondary) https://us.headtopics.com/news/san-diego-hotel-development-doubles-in-a-single-year-85447446; City of San Diego Civic SD report https://www.sandiego.gov/sites/default/files/2026-06/july-2026_final.pdf; Hotel Online https://www.hotel-online.com/index.php/news/2026-lodging-forecast-san-diego; Marcus & Millichap https://www.marcusmillichap.com/research/market-report/san-diego/san-diego-2026-investment-forecast-hospitality-market-report"
  },
  {
    "id": "w1-dal-rule",
    "marketSlug": "dallas",
    "kind": "nuance",
    "title": "Which Dallas — rule: never underwrite a CBD box on DFW averages",
    "body": "CBD group demand is in a convention-center hole (KBHCC closed for a $3.7B rebuild, reopen 2029–30) while the northern suburbs (Frisco / Las Colinas / Uptown) absorb the luxury/upscale pipeline. Arlington is its own event campus (Loews). Never underwrite a CBD box on DFW averages, and never call suburban pipeline 'CBD supply.'",
    "magnitude": "rule",
    "asOf": "2026-10-11",
    "sourceLabel": "Atlas depth-w1 2026-10-11 (markets/depth-w1-dallas-supply.md); Matthews DFW Q3 2025 https://cms.matthews.com/wp-content/uploads/2025/10/Q325-DFW-Hospitality.pdf; HVS https://hvi.hvs.com/market/united-states/Dallas"
  },
  {
    "id": "w1-dal-snapshot",
    "marketSlug": "dallas",
    "kind": "supply",
    "title": "Dallas–Fort Worth supply snapshot (Atlas wave 1): ~111k rooms, low-60s OCC",
    "body": "DFW room inventory ~111,285 (Matthews Q3 2025 submarket table sum). City of Dallas tax-registry rooms 38,733 (−30 YoY; 2026 state HOT filings). DFW OCC / ADR / RevPAR 63.0% / $124.87 / $78.55 (Q3 2025, Matthews). Rooms under construction 4,600 / 38 projects (Q3 2025, Matthews). City of Dallas hotel revenue $1.4B (2025); $611.7M (2026, 5 months). CVB annual OCC/ADR: No free public read found (Visit Dallas does not publish an open YE STR sheet). Read: DFW is a ~111k-room metro running low-60s OCC with the #1 U.S. pipeline — not scarce at the MSA level.",
    "magnitude": "~111,285 rooms",
    "asOf": "Q3 2025 / 2026",
    "sourceLabel": "Atlas depth-w1 2026-10-11; Matthews DFW Q3 2025 https://cms.matthews.com/wp-content/uploads/2025/10/Q325-DFW-Hospitality.pdf; Matthews Q3 2025 report https://www.matthews.com/insights/dallas-fort-worth-tx-hospitality-market-report-q3-2025; TexasHotelSearch (state HOT filings) https://www.texashotelsearch.com/markets/dallas"
  },
  {
    "id": "w1-dal-submarkets",
    "marketSlug": "dallas",
    "kind": "supply",
    "title": "Dallas submarket basemap (Matthews Q3 2025): rooms by submarket",
    "body": "Rooms (Matthews Q3 2025): Dallas CBD / Market Center 10,144 (RevPAR $75.65, ADR $164.14; KBHCC rebuild = group hole to 2029–30; Westin Downtown 326 and Virgin 268 dropped off city tax filings — ownership change vs exit not determinable); West Plano / Frisco 14,080 ($63.78 / $130.69; luxury/upscale pipeline concentration — Matthews: >60% of active development in Frisco, Las Colinas, Uptown); Irving North (Las Colinas) 13,828 ($58.36 / $130.10); East Plano / Richardson 21,058 (corporate-transient); Farmers Branch / Stemmons N 11,677 (commodity select-service); Dallas South / East 9,272 (value); Denton / Lewisville / McKinney 8,607 (Matthews Q1 2025: largest supply increase, 1,504 rooms coming); Addison / LBJ 7,590; Irving South / Grand Prairie 6,189 ($64.21 / $115.95; airport/Arlington adjacency). Matthews' column labels look swapped on some rows (RevPAR > ADR is impossible), so per-submarket RevPAR/ADR are unverified; room counts are the usable layer.",
    "magnitude": "9 submarkets",
    "asOf": "Q3 2025",
    "sourceLabel": "Atlas depth-w1 2026-10-11; Matthews DFW Q3 2025 https://cms.matthews.com/wp-content/uploads/2025/10/Q325-DFW-Hospitality.pdf; Matthews Q1 2025 https://www.matthews.com/insights/q125-hospitality-market-report-dallas-tx"
  },
  {
    "id": "w1-dal-pulse",
    "marketSlug": "dallas",
    "kind": "occupancy",
    "title": "Dallas 2026 pulse: World Cup semifinal week RevPAR +26.6% (CoStar); HVS window RevPAR +30.1%",
    "body": "CoStar week ending 2026-07-18 (World Cup semifinal): ADR +21.5% to $144.41; RevPAR +26.6% to $96.81. HVS World Cup window (Jun 11–Jul 19): OCC +0.7 pt vs counterfactual; RevPAR +30.1%; ~$60.8M incremental rooms revenue. City of Dallas hotel revenue Jan–May 2026 $611.7M (short-term rental share 8.7%). HVS 2026 read: OCC 'relatively stable,' rate uptick from the World Cup. Dallas was not in the CoStar Aug 2026 Top-25 callouts. (C&W Q2 2026 line loaded separately.)",
    "magnitude": "w/e Jul 18 RevPAR +26.6%",
    "asOf": "2026-07-18",
    "sourceLabel": "Atlas depth-w1 2026-10-11; CoStar w/e 18 Jul https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/resources/press-releases/us-hotel-results-week-ending-18-july; HVS https://www.hvs.com/article/10529-how-the-2026-fifa-world-cup-changed-us-hotel-markets; TexasHotelSearch https://www.texashotelsearch.com/markets/dallas; HVS https://hvi.hvs.com/market/united-states/Dallas"
  },
  {
    "id": "w1-dal-supply-score",
    "marketSlug": "dallas",
    "kind": "supply",
    "title": "Dallas supply pressure 4/5 (Atlas wave 1) — #1 U.S. pipeline, suburban flood layer",
    "body": "Atlas supply-pressure score 4/5. UC: #1 U.S. by projects, 38 / 4,184 rooms (Q2 2026). Next-12-month starts #1 at 68 / 7,885; early planning #1 at 77 / 10,771; total pipeline 183 / 22,840. Openings 2026e 20 / 2,332; 2027e #1 at 27 / 2,486; 2028e 19 / 2,042. Not in LE public top-5 renovation/conversion list. Concentration: luxury/upscale in Frisco / Las Colinas / Uptown; CBD demand hole to 2029–30 (Matthews Q3 2025; HVS). Build-talent friction: no public Dallas-specific read yet. Call: no ground-up without a hard barrier (a campus/event anchor like Loews Arlington, or a CBD-convention bet timed to the 2029–30 KBHCC reopen). Suburban select-service is the flood layer.",
    "magnitude": "4/5",
    "asOf": "2026-10-11",
    "sourceLabel": "Atlas depth-w1 2026-10-11; LE Summer 2026 https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/; Matthews DFW Q3 2025 https://cms.matthews.com/wp-content/uploads/2025/10/Q325-DFW-Hospitality.pdf; HVS https://hvi.hvs.com/market/united-states/Dallas"
  },
  {
    "id": "w1-dal-comps",
    "marketSlug": "dallas",
    "kind": "transaction",
    "title": "Dallas replacement-cost / sale comps (public anchors, thin)",
    "body": "Ledger owns $/key; public anchors only. Matthews Q3 2025: sale price per room $162,044, cap rate 9.5% — one quarter, $52.5M volume (thin). Americana by Loews: $500M+ / 507 keys (~$986k/key headline, includes 83k sf of meeting space).",
    "magnitude": "$162,044/key; 9.5% cap",
    "asOf": "Q3 2025",
    "sourceLabel": "Atlas depth-w1 2026-10-11; Matthews DFW Q3 2025 https://cms.matthews.com/wp-content/uploads/2025/10/Q325-DFW-Hospitality.pdf"
  },
  {
    "id": "w1-hou-submarkets",
    "marketSlug": "houston",
    "kind": "occupancy",
    "title": "Houston submarket split (Houston First, Aug + Jul 2026, Dec 2025)",
    "body": "Aug 2026 / Jul 2026: Downtown/CBD OCC 52%, ADR $191, RevPAR $100 / OCC 53%, ADR $205, RevPAR $108 (+17%) — Dec 2025 OCC 45% on supply growth while demand rose 1.7%; new 275-key HIE/Staybridge opened Apr 2026. Uptown/Galleria OCC 54% (−7%), RevPAR $85 (−5%) / OCC 56%, RevPAR $93 — weakest Aug trend. Medical Center/NRG OCC 57%, ADR $136, RevPAR $77 / OCC 58%, ADR $145 — TMC is the steady base, NRG for events. North/Woodlands OCC 58% (+4 pts), RevPAR $68 (+7%) — corporate suburban. Katy Fwy West OCC 59%, RevPAR $61 (+7%) — energy corridor. Hobby/NASA Jul OCC 65% (+6%), highest Jul OCC. Bush IAH Dec 2025 OCC 53%. City tax-registry rooms 68,260 (TexasHotelSearch, 2026).",
    "magnitude": "Downtown Aug RevPAR $100",
    "asOf": "Aug 2026",
    "sourceLabel": "Houston First Aug 2026 (2026-09-28) https://www.houstonfirst.com/news/houston-hotels-showed-modest-demand-growth-in-august; Houston First Jul 2026 (2026-08-24) https://www.houstonfirst.com/news/houston-hotels-showed-solid-rates-and-demand-in-july; Houston First YE 2025 (2026-01-23) https://www.houstonfirst.com/news/hotel-occupancy-finished-2025-at-59; TexasHotelSearch https://www.texashotelsearch.com/markets/houston; Atlas depth-w1 2026-10-11 (markets/depth-w1-houston-supply.md)"
  },
  {
    "id": "w1-mia-grand-hyatt-mb",
    "marketSlug": "miami",
    "kind": "supply",
    "title": "Miami pipeline: Grand Hyatt Miami Beach (MBCC HQ hotel) 800 keys, topped off Jul 27 2026, opens Nov 2027",
    "body": "800-room headquarters hotel connected by skybridge to the Miami Beach Convention Center (17th St & Convention Center Dr), 50 suites, 110,000 sf of meeting space. Topped off Jul 27, 2026; opens Nov 2027 per the GMCVB listing — the MBCC release says 'late 2027'. Developers Terra + Turnberry; GC Balfour Beatty; architect Arquitectonica. GMCVB: it 'has opened the door for literally dozens of major conventions and trade shows that have never convened here.' Read: a Miami Beach group-capacity step-up for 2028+ citywides, not 2026–27 supply. GM, pre-open team and hiring: no public read.",
    "magnitude": "800 keys, Nov 2027",
    "asOf": "2026-07-27",
    "sourceLabel": "MBCC press release 2026-07-27 https://www.miamibeachconvention.com/center-info/press/grand-hyatt-miami-beach-topping-off; GMCVB listing https://www.miamiandbeaches.com/l/hotels/grand-hyatt-miami-beach/59878; Vectra demand/depth-w1-miami.md 2026-10-11"
  },
  {
    "id": "w1x-fll-spirit",
    "marketSlug": "fort-lauderdale",
    "kind": "airlift",
    "title": "Fort Lauderdale airlift: Spirit shutdown (~May 2 2026) — FLL Aug pax −5.8%, intl −21.2%",
    "body": "Spirit ceased operations ~May 2, 2026; it carried 11M FLL passengers in 2024 (31.4% share, FLL's #1 carrier). FLL Aug 2026 total pax 2,375,538 (−5.8%), YTD 21,757,164 (−0.8%); international Aug 425,608 (−21.2%), YTD 3,795,281 (−11.1%). Carrier mix: JetBlue YTD pax +39.8% (Aug share 39.3%); Spirit YTD −51.8% (13.8% YTD share, zero after shutdown); Southwest YTD −2.8%. Backfill is partial: JetBlue added BWI/CLT (Jul), CMH/IND (Nov 2026) plus 5 more cities from Jul 9; Breeze FLL–JAX daily from Jul. Read: low-fare leisure seats into Broward are down; don't underwrite fly-in leisure growth on 2025 seats.",
    "magnitude": "FLL Aug −5.8%; Spirit 0",
    "asOf": "Aug 2026",
    "sourceLabel": "Broward County FLL Aug 2026 traffic report https://www.browardcdn.org/api/public/content/b2853a1460f1436d9a8319d32d140323?v=50854f0e; WLRN 2026-05-05 https://www.wlrn.org/light/business/2026-05-05/spirit-fort-lauderdale-hollywood-airport-fll; Vectra demand/depth-w1-miami.md 2026-10-11"
  },
  {
    "id": "w1x-nyc-supply-2026",
    "marketSlug": "new-york-city",
    "kind": "supply",
    "title": "New York City: 4,852 rooms opening in 2026 — most in the nation (OSC)",
    "body": "NY State Comptroller (OSC) hotel report: 2026 openings 4,852 rooms (nation-leading); 24 projects / 5,778 rooms through 2028. 2025 OCC 84.1%, ADR $333.71, RevPAR $280.71 (+4.5%). Vectra flag: the supply wave lands against midscale OCC −7%; hand off to Atlas (pipeline) and Ledger (midscale debt).",
    "magnitude": "4,852 rooms in 2026",
    "asOf": "2026-07",
    "sourceLabel": "OSC NYC hotel industry report Jul 2026 https://www.osc.ny.gov/files/reports/osdc/2026/pdf/nyc-hotel-industry-report-july-2026.pdf; Vectra demand/depth-w1-new-york-city.md 2026-10-11"
  },
  {
    "id": "w1x-dal-convention-gap",
    "marketSlug": "dallas",
    "kind": "citywide_calendar",
    "title": "Dallas convention gap to 2030: KBHCCD Halls D–F demolished, expanded center 2030",
    "body": "Kay Bailey Hutchison Convention Center Dallas: Halls D–F demolition through Dec 2026; Halls A–C operating; foundations late 2026 → 2028; expanded center 2030. 2027 citywide losses from reduced halls: no public read (no list of displaced citywides found). Read: CBD group demand has a hole until 2030; downtown full-service is most exposed. Radar: any named citywide moving from Dallas to Houston/San Antonio/Austin.",
    "magnitude": "CBD group gap to 2030",
    "asOf": "2026",
    "sourceLabel": "City of Dallas bulletin https://content.govdelivery.com/accounts/TXDALLAS/bulletins/40b8764; Dallas CC master plan https://www.dallasccmasterplan.com/conventioncenterexpansion; Vectra demand/depth-w1-dallas.md 2026-10-11"
  },
  {
    "id": "w1x-hou-grb-2028",
    "marketSlug": "houston",
    "kind": "citywide_calendar",
    "title": "Houston GRB South expansion opens May 2028 (+337,400 CBD group RN/yr at stabilization)",
    "body": "George R. Brown South expansion opens May 2028; projected +337,400 CBD group room nights a year at stabilization (2032); citywide-equivalent meetings +62%; dark days −66%. GRB construction displacement 2026–28: no public read on lost/relocated citywides (HBJ Sep 18 2026 headline reports early benefit; paywalled). Read: Houston CBD group is a 2028+ story.",
    "magnitude": "Opens May 2028",
    "asOf": "2025-08-22",
    "sourceLabel": "Houston First GRB South expansion analysis https://houstonfirst.com/static/media/uploads/hfc_grb_south_expansion_analysis_082225_final.pdf; Houston First https://www.houstonfirst.com/convention-district-transformation-1/; HBJ https://www.bizjournals.com/houston/news/2026/09/18/convention-center-expansion-early-economic-benefit.html; Vectra demand/depth-w1-houston.md 2026-10-11"
  },
  {
    "id": "w1x-nash-str-share",
    "marketSlug": "nashville",
    "kind": "demand",
    "title": "Nashville short-term rentals: 21% of lodging revenue ($540M of $2.6B)",
    "body": "STR revenue $540M = 21% of Nashville's $2.6B total lodging revenue; ~9,500 active listings (29% are 4-bedroom units, which compete for group/bachelorette demand); STR demand +6.9% (2025). Radar: an STR revenue share above 21% means Broadway leisure is being captured outside hotels.",
    "magnitude": "21% of lodging revenue",
    "asOf": "2026-03-03",
    "sourceLabel": "Metro Nashville Tourism & Convention Commission minutes 2026-03-03 https://www.nashville.gov/sites/default/files/2026-05/Tourism-and-Convention-Commission-Minutes-030326.pdf; Vectra demand/depth-w1-nashville.md 2026-10-11"
  },
  {
    "id": "w1x-chi-displaced-meetings",
    "marketSlug": "chicago",
    "kind": "demand",
    "title": "Chicago RevPAR +11.6% YTD Aug from World Cup-displaced meetings — normalize the T12",
    "body": "CoStar: Chicago RevPAR through Aug 2026 +11.6% (2nd of top markets after SF), attributed to World Cup-displaced meetings — Chicago was the largest U.S. city not hosting. Week of Aug 2–8: ADR +15.2% to $206.21, RevPAR +23.8% to $176.93. Normalization flag: tagged 'none / national applies' for the Cup, but Chicago gained from displaced group, so 2027 Jun–Jul faces a tougher group comp. Normalize the trailing 12 months: underwrite 2027 without the 2026 displacement bump.",
    "magnitude": "RevPAR +11.6% YTD Aug",
    "asOf": "2026-09",
    "sourceLabel": "CoStar post https://www.linkedin.com/posts/costar_top-us-hotel-markets-in-2026-activity-7506699098205585408-so1V; Vectra demand/depth-w1-chicago.md 2026-10-11"
  },
  {
    "id": "w1x-mia-aug-occ",
    "marketSlug": "miami",
    "kind": "occupancy",
    "title": "Miami August 2026: Miami-Dade OCC 63.6% (−7.6% YoY)",
    "body": "August 2026 Miami-Dade OCC fell to 63.6% (−7.6% YoY) after a World Cup lift that was all rate; week of Aug 2–8 RevPAR −8.5% to $107.60. Context: Jan–May 2026 OCC 79.9% at ADR $293.67 (GMCVB). Read: the summer cracked — treat Q4 2026 rate as event-supported, not airlift-supported.",
    "magnitude": "Aug OCC 63.6% (−7.6%)",
    "asOf": "Aug 2026",
    "sourceLabel": "Miami Business Aug 2026 report https://miamibusiness.com/miami-hospitality-industry-report-august-2026/; Lodging Magazine (CoStar) https://lodgingmagazine.com/costar-u-s-hotel-industry-reports-positive-year-over-year-comparisons-18/; Vectra demand/depth-w1-miami.md 2026-10-11"
  },
  {
    "id": "w1x-la-super-bowl-2027",
    "marketSlug": "los-angeles",
    "kind": "event",
    "title": "Los Angeles: Super Bowl LXI, Feb 2027 (SoFi) — normalization flag",
    "body": "Super Bowl LXI is at SoFi Stadium in February 2027 (Discover LA), followed by LA28. Normalization flag: watch Inglewood/LAX/Downtown room blocks and ADR in Feb 2027 and expect a T12 distortion like Arlington's World Cup HOT record; strip the Super Bowl week out of 2027 T12s before underwriting. LAX seats are declining (Aug 2026 −3.74%), so event peaks will be served by charters and upgauges, not structural seat growth.",
    "magnitude": "Feb 2027",
    "asOf": "2026-07-29",
    "sourceLabel": "Discover LA 2026-07-29 https://www.discoverlosangeles.com/visitors-to-los-angeles-generated-426-billion-in-business-sales-and-supported-more-than-530000-jobs; Vectra demand/depth-w1-los-angeles.md 2026-10-11"
  },
  {
    "id": "w1x-chi-rsna-labor",
    "marketSlug": "chicago",
    "kind": "talent",
    "title": "Chicago labor risk in RSNA peak week (Nov 29–Dec 3): Local 1 dispute covers 46 hotels",
    "body": "RSNA 2026 runs Nov 29–Dec 3 at McCormick Place (exhibits Nov 29–Dec 2; 700+ exhibiting companies; attendance not public). UNITE HERE Local 1 struck 6 downtown hotels incl. Palmer House Hilton and Waldorf Astoria on marathon weekend (Oct 9–11); the dispute covers 7,000+ workers / 46 hotels. Risk: a repeat strike during RSNA turns a peak citywide week into a service-quality hit, not clean compression. Human touch first: settlement terms go to the 2027 labor-cost line; never cut FTE to hit numbers.",
    "magnitude": "Nov 29–Dec 3",
    "asOf": "2026-10-09",
    "sourceLabel": "RSNA https://www.rsna.org/news/2026/october/rsna-2026-technical-exhibits; Chicago Sun-Times 2026-10-09 https://chicago.suntimes.com/business/2026/10/09/hotel-workers-strike-chicago-marathon-weekend; Vectra demand/_compression-90d.md (Wave 1, labor overlay) 2026-10-11"
  }
];
