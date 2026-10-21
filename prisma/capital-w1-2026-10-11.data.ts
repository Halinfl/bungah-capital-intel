import type { LinkedSignal } from "./linked-signal";

// Ledger capital depth wave 1 (capital/depth-w1-<slug>.md), 15 Tier 1 markets, re-read fresh at load time
// (files updated 20:54–20:55 ET with inline URLs). Label swap: Ledger D9 = debt/deals (kind "debt", matrix D12);
// Ledger D12 = tax/CVB (kind "tax", matrix D9). One signal per cited table; sourceUrls per row, secondary = broker /
// advisor blog. Gap notes ("no public read") kept as written, no link. Never links to capital/_src copies.
// Fixed ids (w1c-<slug>-debt|tax-<table>) so a later Ledger revision re-upserts in place. Decision support.
export const CAPITAL_W1_2026_10_11: LinkedSignal[] = [
  {
    "id": "w1c-atlanta-debt-named-hotel-transactions-2025-2026",
    "marketSlug": "atlanta",
    "kind": "debt",
    "title": "Atlanta debt & deals: Named hotel transactions 2025–2026",
    "body": "Atlanta — debt & deals: Named hotel transactions 2025–2026. The Hotel at Avalon (Alpharetta): announced 2026-09-17 · Endeavor Real Estate Group & Cox (reported) / Crescent Real Estate · $220M (reported; Crescent release gives no price) · 330 · ~$667K (arithmetic) · cap not disclosed | Westin Peachtree Plaza (downtown): 2026 (Bisnow/REBusiness) · Portman Hospitality Fund I / Marriott International (its only wholly owned Westin) · undisclosed · 1,073 · n/a · cap not disclosed. Full renovation planned before Super Bowl LXII (2028). Marriott keeps management | Atlanta Airport Marriott: 2026-07-02 · Machine Investment Group + Lionshead Capital Partners / a Pennsylvania school pension fund · undisclosed · 641 · n/a · cap not disclosed. Broad capex program; rooms last renovated 2017 | Crowne Plaza / Staybridge Suites Midtown: 2025-10-14 · Monomoy + Axonic Capital / institutional seller · ~$35.5M (\"over $35M\") · 462 · ~$77K (arithmetic) · cap not disclosed | Courtyard Atlanta Buckhead: 2025-03-19 · Partners Capital Hospitality Fund I / n/a · $24.25M · 181 · ~$134K (arithmetic) · cap not disclosed. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "crescent.com · privaterealestatedaily.com · connectcre.com · Bisnow · Business Wire · PR Newswire · Commercial Real Estate Direct · partnersrealestate.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://crescent.com/news/crescent-announces-successful-sale-of-the-hotel-at-avalon/",
        "label": "The Hotel at Avalon (Alpharetta) — crescent.com",
        "secondary": false
      },
      {
        "url": "https://www.privaterealestatedaily.com/story/endeavor-and-cox-reported-buyers-of-alpharetta-s-hotel-at-avalon-for-220-million",
        "label": "The Hotel at Avalon (Alpharetta) — privaterealestatedaily.com",
        "secondary": false
      },
      {
        "url": "https://www.connectcre.com/stories/portman-buys-1073-room-westin-peachtree-plaza/",
        "label": "Westin Peachtree Plaza (downtown) — connectcre.com",
        "secondary": false
      },
      {
        "url": "https://www.bisnow.com/news/atlanta/hotel/portman-acquires-iconic-westin-peachtree-plaza-with-new-fund-134706",
        "label": "Westin Peachtree Plaza (downtown) — bisnow.com",
        "secondary": false
      },
      {
        "url": "https://www.businesswire.com/news/home/20260528102534/en/Portman-Hospitality-Fund-I-LP-Announces-Acquisition-of-the-Westin-Peachtree-Plaza",
        "label": "Westin Peachtree Plaza (downtown) — businesswire.com",
        "secondary": false
      },
      {
        "url": "https://www.prnewswire.com/news-releases/machine-investment-group-and-lionshead-capital-partners-acquire-atlanta-airport-marriott-302816998.html",
        "label": "Atlanta Airport Marriott — prnewswire.com",
        "secondary": false
      },
      {
        "url": "https://www.connectcre.com/stories/machine-led-team-acquires-641-room-atlanta-airport-hotel/",
        "label": "Atlanta Airport Marriott — connectcre.com",
        "secondary": false
      },
      {
        "url": "https://www.prnewswire.com/news-releases/hodges-ward-elliott-completes-the-sale-of-the-462-room-crowne-plazastaybridge-suites-midtown-atlanta-302583744.html",
        "label": "Crowne Plaza / Staybridge Suites Midtown — prnewswire.com",
        "secondary": false
      },
      {
        "url": "https://www.bisnow.com/news/atlanta/deal-sheet/midtowns-crowne-plaza-sells-for-over-35m-the-atlanta-deal-sheet-131550",
        "label": "Crowne Plaza / Staybridge Suites Midtown — bisnow.com",
        "secondary": false
      },
      {
        "url": "https://crenews.com/2025/03/19/courtyard-by-marriott-atlanta-buckhead-hotel-sells-for-24-25mln/",
        "label": "Courtyard Atlanta Buckhead — crenews.com",
        "secondary": false
      },
      {
        "url": "https://partnersrealestate.com/media-center/press-releases/partners-capitals-hospitality-fund-i-makes-second-acquisition-purchasing-the-courtyard-by-marriott-atlanta-buckhead/",
        "label": "Courtyard Atlanta Buckhead — partnersrealestate.com",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-atlanta-debt-cmbs-balance-sheet-loans",
    "marketSlug": "atlanta",
    "kind": "debt",
    "title": "Atlanta debt & deals: CMBS / balance-sheet loans",
    "body": "Atlanta — debt & deals: CMBS / balance-sheet loans. The Georgian Terrace (326 rooms; Sotherly; BofA 2015 CMBS loan, LNR special servicer): $37.7M at 2026-01-01 (pre-paydown) · Maturity default 2025-06-01 → SS. Notice of default 2025-06-26. Forbearance 2025-12-16: ~$3.8M paydown, cash management, no foreclosure before 2026-06-01. Default interest accrues. Post-June-2026 resolution: no public read · 2025-06 → 2026-06 | Named Atlanta hotel loan maturing 2026–27 beyond the above: no public read this pass. Trepp's free Jan–Sep 2026 PDFs name no Atlanta hotel loan · checked 2026-10-11 (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "2 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "No linked public source (reviewed 2026-10-11)",
    "sourceUrls": null
  },
  {
    "id": "w1c-atlanta-tax-lodging-tax-stack",
    "marketSlug": "atlanta",
    "kind": "tax",
    "title": "Atlanta tax & CVB: Lodging tax stack (City of Atlanta, Fulton side)",
    "body": "Atlanta — tax & CVB: Lodging tax stack (City of Atlanta, Fulton side). Sales & use tax, Fulton (Atlanta) code 060A: 8.9% (incl. 4% state + local/MARTA/MOST) · State + local · eff. 2026-10-01 | City hotel-motel tax: 8% (raised from 7% by Ord. 2011-32) · Statutory split of the 7%: 39.3% Mercedes-Benz Stadium (bonds up to $200M; tax extended to 2050), with GWCCA/ACVB shares. Of the 1% add-on, 80% goes to the ACVB convention marketing fund · 2016-10-25 | State hotel-motel fee: $5 per room-night · State transportation · accessed 2026-10-11 | Total: 16.9% + $5/night (DeKalb side: 8.9% sales tax per code 044A, same total) · 2026-10-11 (arithmetic). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "dor.georgia.gov · mcclibraryfunctions.azurewebsites.us · Georgia World Congress Center · atlantaga.gov · dca.georgia.gov (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://dor.georgia.gov/document/document/httpsdorgeorgiagovdocumentdocumentgeneral-rate-chart-effective-october-1-2026/download",
        "label": "Sales & use tax, Fulton (Atlanta) code 060A",
        "secondary": false
      },
      {
        "url": "https://mcclibraryfunctions.azurewebsites.us/api/ordinanceDownload/10376/495259/pdf?forceDownload=true",
        "label": "City hotel-motel tax — mcclibraryfunctions.azurewebsites.us",
        "secondary": false
      },
      {
        "url": "https://www.gwcca.org/wp-content/uploads/2016/02/10-25-16-Board-Meeting-Presentation.pdf",
        "label": "City hotel-motel tax — gwcca.org",
        "secondary": false
      },
      {
        "url": "https://www.atlantaga.gov/Home/Components/News/News/1783/",
        "label": "City hotel-motel tax — atlantaga.gov",
        "secondary": false
      },
      {
        "url": "https://dor.georgia.gov/state-hotel-motel-faq",
        "label": "State hotel-motel fee — dor.georgia.gov",
        "secondary": false
      },
      {
        "url": "https://dca.georgia.gov/document/presentations/hotel-motel-tax-full-presentation/download",
        "label": "State hotel-motel fee — dca.georgia.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-atlanta-tax-collections-and-dmo-budget",
    "marketSlug": "atlanta",
    "kind": "tax",
    "title": "Atlanta tax & CVB: Collections and DMO budget",
    "body": "Atlanta — tax & CVB: Collections and DMO budget. City Hotel/Motel Tax Fund revenue: no public read (FY2026 budget ordinance not opened; a search abstract shows $101.4M, which has not been confirmed in the document) · FY2026 · FY2026 (period) (source: no public read) | ACVB total budget: $47.17M revenue / $47.41M expense (2025 forecast: $46.0M revenue) · CY2026 budget · 2025-12-09 | ACVB public-sector revenue: $35.70M = city hotel tax $18.24M + STR hotel tax $3.59M + Atlanta Convention Marketing Fund (80%: $9.26M + $1.83M STR; 20%: $2.32M + $0.46M STR) · 2026 budget · 2026 budget (period) | ACVB private-sector: $11.48M (incl. $8.5M contributed services) · 2026 budget · 2026 budget (period) | GWCCA–ACVB hotel-tax contract: ACVB's strategic plan seeks to \"extend hotel tax contract beyond 2027\" · 2025-12 · 2025-12 (period). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Georgia World Congress Center (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.gwcca.org/wp-content/uploads/2025/12/12-09-2025-Board-Presentation_FINALFINAL.pdf",
        "label": "ACVB total budget",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-boston-debt-named-hotel-transactions-2025-2026",
    "marketSlug": "boston",
    "kind": "debt",
    "title": "Boston debt & deals: Named hotel transactions 2025–2026",
    "body": "Boston — debt & deals: Named hotel transactions 2025–2026. The Godfrey Hotel (505 Washington St, Downtown Crossing): closed 2026-04-27 · Lifestyle Hospitality Capital (London; B&T). CRE Direct's teaser names \"an affiliate of Elliott Management\" as the buyer. Seller: German investor (CRE Direct tag: Union Investment) · $124.5M (B&T, LWHA). CRE Direct: $124M · 242 · $514,460 (LWHA) · cap not disclosed. Athene Annuity $100.5M acquisition loan (~81% of price, arithmetic). Previous trade: $173.9M in 2015 (−28%, arithmetic) | Courtyard Boston Downtown (275 Tremont, Theater District): announced 2025-01-24 · n/a / Ashford Hospitality Trust · $123.0M · 315 · ~$390K (arithmetic) · cap not disclosed | Hilton Boston/Woburn (suburban): reported 2026-07-06 · JLK Global Fund US 4 Inc. / Davis Cos. & Rubicon Partners · $39.4M · 344 · ~$115K (arithmetic) · cap not disclosed | Residence Inn Boston North Shore/Danvers (hotel-to-multifamily conversion play): 2026-08-27 · Torrington / PEG Cos. affiliate · $13.5M · 96 · ~$141K (arithmetic) · cap not disclosed. Has approved conversion to 88 apartments. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Banker & Tradesman · Commercial Real Estate Direct · Hotel Online · JLL (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://bankerandtradesman.com/london-investor-buys-downtown-crossing-hotel-for-125m/",
        "label": "The Godfrey Hotel (505 Washington St, Downtown Crossing) — bankerandtradesman.com",
        "secondary": false
      },
      {
        "url": "https://crenews.com/2026/05/15/godfrey-hotel-in-boston-sells-for-124mln/",
        "label": "The Godfrey Hotel (505 Washington St, Downtown Crossing) — crenews.com",
        "secondary": false
      },
      {
        "url": "https://www.hotel-online.com/news/lw-hospitality-advisors-lwha-q2midyear-2026-major-us-hotel-sales-survey-lodging-sector-overview",
        "label": "The Godfrey Hotel (505 Washington St, Downtown Crossing) — hotel-online.com",
        "secondary": false
      },
      {
        "url": "https://www.jll.com/en-us/newsroom/sale-of-historic-courtyard-boston-downtown-closes",
        "label": "Courtyard Boston Downtown (275 Tremont, Theater District)",
        "secondary": false
      },
      {
        "url": "https://bankerandtradesman.com/after-upgrades-woburn-hotel-sold-for-39-4m/",
        "label": "Hilton Boston/Woburn (suburban)",
        "secondary": false
      },
      {
        "url": "https://www.jll.com/en-us/newsroom/jll-arranges-13-5m-sale-and-financing-of-96-room",
        "label": "Residence Inn Boston North Shore/Danvers (hotel-to-multifamily convers",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-boston-debt-cmbs-sasb-loans",
    "marketSlug": "boston",
    "kind": "debt",
    "title": "Boston debt & deals: CMBS / SASB loans",
    "body": "Boston — debt & deals: CMBS / SASB loans. InterContinental Boston, NCMS 2018-SOX (Extell): $110.0M fixed IO trust loan + $65M B note + $90M mezz outside the trust · Performing. Master-leased to IHG at $21.1M/yr (DSCR 3.94x). DBRS look-through value $169.2M at an 8.25% cap, vs a $340.6M issuance appraisal (−50.3%). Matures Jun 2028 · DBRS confirmation 2026-05-19 | Omni Boston Hotel at the Seaport (1,054 rooms): $307M JPMorgan loan · Performing (origination 2024; pre-window context) · 2024-09-24 | Godfrey acquisition loan (Athene): $100.5M · New 2026 acquisition debt · 2026-04-27 | Named Boston hotel CMBS loan in SS/DQ/foreclosure, 2026: no public read. Trepp's free Jan–Sep 2026 PDFs name no Boston hotel loan. Club Quarters (BX 2017-CQHP) was liquidated from the trust in Jan 2025 · checked 2026-10-11. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Morningstar DBRS · Commercial Real Estate Direct · Banker & Tradesman (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://dbrs.morningstar.com/research/481321/morningstar-dbrs-confirms-credit-ratings-on-all-classes-of-natixis-commercial-mortgage-securities-trust-2018-sox",
        "label": "InterContinental Boston, NCMS 2018-SOX (Extell)",
        "secondary": false
      },
      {
        "url": "https://crenews.com/2024/09/24/jpmorgan-lends-307mln-against-1054-room-hotel-in-boston/",
        "label": "Omni Boston Hotel at the Seaport (1,054 rooms)",
        "secondary": false
      },
      {
        "url": "https://bankerandtradesman.com/london-investor-buys-downtown-crossing-hotel-for-125m/",
        "label": "Godfrey acquisition loan (Athene)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-boston-tax-lodging-tax-stack",
    "marketSlug": "boston",
    "kind": "tax",
    "title": "Boston tax & CVB: Lodging tax stack (City of Boston)",
    "body": "Boston — tax & CVB: Lodging tax stack (City of Boston). MA state room occupancy excise: 5.7% · Commonwealth · FY26 | Boston local option room occupancy excise: 6.5% · City General Fund · FY26 | Convention Center Financing Fee: 2.75% · State Convention Center Fund (MCCA debt: BCEC/Hynes) · FY26 | Subtotal (tax): 14.95% · FY26 | Boston–Cambridge TDMD assessment: 1.5% of gross room revenue (hotels with 50+ rooms, Boston and Cambridge). Renewal plan dated Oct 2025 · Meet Boston (TDMD management entity) · accessed 2026-10-11 | Total (50+ room hotel): 16.45% · 2026-10-11 (arithmetic). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "City of Boston · Commonwealth of Massachusetts · simpleviewinc.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.boston.gov/departments/budget/fy26-local-revenue",
        "label": "MA state room occupancy excise — boston.gov",
        "secondary": false
      },
      {
        "url": "https://www.mass.gov/info-details/tourism-destination-marketing-district-tdmd-fund-faqs",
        "label": "MA state room occupancy excise — mass.gov",
        "secondary": false
      },
      {
        "url": "https://assets.simpleviewinc.com/sv-boston/image/upload/v1/clients/boston/BCTDMD_Plan_2025_a0f44d10-9f90-4d50-9c5c-e5e51ebb9aa3.pdf",
        "label": "Boston–Cambridge TDMD assessment",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-boston-tax-collections-and-dmo-budget",
    "marketSlug": "boston",
    "kind": "tax",
    "title": "Boston tax & CVB: Collections and DMO budget",
    "body": "Boston — tax & CVB: Collections and DMO budget. Boston local room occupancy excise: $144.6M actual (FY24); $134.5M budget (FY25); $148.8M budget (FY26; the narrative says $148.5M) · FY24–FY26 · FY26 | Short-term rental excise (city): $2.43M (FY24 actual); $1.8M (FY26 budget) · FY26 | BCTDMD (Meet Boston) first-year budget of the renewed district: ~$33.34M (vs $10.52M in the original 2021 plan) · renewal plan, Oct 2025 · renewal plan, Oct 2025 (period) | Meet Boston state RTC grant (MOTT): $2.44M · FY2025 · FY25 | Meet Boston 2025: \"challenging year\". Budgets were reforecast and expenses cut (hotel-incentive variance) · 2025 · 2025 (period) | State 5.7% + 2.75% CCFF collections attributable to Boston: no public read · 2026-10-11 (checked) (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "City of Boston · simpleviewinc.com · visitma.com · Meet Boston (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.boston.gov/departments/budget/fy26-local-revenue",
        "label": "Boston local room occupancy excise",
        "secondary": false
      },
      {
        "url": "https://assets.simpleviewinc.com/sv-boston/image/upload/v1/clients/boston/BCTDMD_Plan_2025_a0f44d10-9f90-4d50-9c5c-e5e51ebb9aa3.pdf",
        "label": "BCTDMD (Meet Boston) first-year budget of the renewed district — assets.simpleviewinc.com",
        "secondary": false
      },
      {
        "url": "https://assets.simpleviewinc.com/sv-boston/image/upload/v1/clients/boston/TDMD_District_Plan_6_15_21_769aa23c-7168-44a7-8375-dbf72470cf35.pdf",
        "label": "BCTDMD (Meet Boston) first-year budget of the renewed district — assets.simpleviewinc.com",
        "secondary": false
      },
      {
        "url": "https://www.visitma.com/wp-content/uploads/2026/07/FY25-RTC-Annual-Report.pdf.pdf",
        "label": "Meet Boston state RTC grant (MOTT)",
        "secondary": false
      },
      {
        "url": "https://www.meetboston.com/about-meet-boston/",
        "label": "Meet Boston 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-chicago-debt-named-hotel-transactions-2025-2026",
    "marketSlug": "chicago",
    "kind": "debt",
    "title": "Chicago debt & deals: Named hotel transactions 2025–2026",
    "body": "Chicago — debt & deals: Named hotel transactions 2025–2026. Royal Sonesta River North → Hotel 505 River North (505 N State): reported 2026-10-08 · Manga Hotel Group venture / Service Properties Trust · $21.0M / 261 keys (−62% vs the $55M 2019 price) · cap not disclosed · 2026-10-08 | Blackstone Hotel, Autograph Collection (636 S Michigan): May 2026 · Vinayaka Hospitality / Fundamental Advisors & Sage Hospitality (JLL) · $43.2M (−28% vs $59.5M in 2016) · 335 (CRE Direct) / 355 (TRD) · $128,955 (CRE Direct) / ~$121K (TRD) · cap not disclosed · 2026-05-20; 2026-05-19 | La Quinta Inn & Suites Chicago downtown: Jun 2026 · Jamp Hotels / Highgate–Cerberus (per tags) · $30.5M · 239 · $127,615 · cap not disclosed · 2026-06-18 | Homewood Suites downtown Chicago: May 2026 · Prakash Patel group / Brookfield (per tags) · $29.0M · 233 · $124,463 · cap not disclosed · 2026-05-14. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "The Real Deal · Commercial Real Estate Direct (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://therealdeal.com/chicago/2026/10/08/manga-hotel-group-snaps-up-discounted-chicago-loop-hotel/",
        "label": "Royal Sonesta River North → Hotel 505 River North (505 N State)",
        "secondary": false
      },
      {
        "url": "https://crenews.com/2026/05/20/chicagos-blackstone-hotel-sells-for-43-2mln/",
        "label": "Blackstone Hotel, Autograph Collection (636 S Michigan) — crenews.com",
        "secondary": false
      },
      {
        "url": "https://therealdeal.com/chicago/2026/05/19/hotel-of-presidents-sold-to-vinayaka-hospitality-for-43m/",
        "label": "Blackstone Hotel, Autograph Collection (636 S Michigan) — therealdeal.com",
        "secondary": false
      },
      {
        "url": "https://crenews.com/2026/06/18/la-quinta-hotel-in-chicago-sells-for-30-5mln/",
        "label": "La Quinta Inn & Suites Chicago downtown",
        "secondary": false
      },
      {
        "url": "https://crenews.com/2026/05/14/hotel-in-downtown-chicago-sells-for-29mln/",
        "label": "Homewood Suites downtown Chicago",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-chicago-debt-cmbs-sasb-loans-distress",
    "marketSlug": "chicago",
    "kind": "debt",
    "title": "Chicago debt & deals: CMBS / SASB loans & distress",
    "body": "Chicago — debt & deals: CMBS / SASB loans & distress. Palmer House Hilton (1,641 keys; Thor Equities; JPMBB 2015-C32 et al.): $328.9M (Trepp/CRE Daily); \"$332.2M mortgage\" (TRD) · In foreclosure since the 2022 default; the hotel foreclosure is held up by litigation over parcel-split disclosure (JPMorgan). The retail/office/garage parcel (17 E Monroe), taken by LNR at a $29.5M 2023 sheriff's sale, went to an online auction with a $1.9M starting bid (Aug 2026). The hotel is also one of 6 Local 1 strike hotels since 2026-10-09, so strike losses fall on lender/recovery NOI · 2026-10-01; 2026-07-28 · 2026-10-01; 2026-07-28; 2026-10-09 | MPEA Expansion Project Bonds (back the McCormick campus, including the Hyatt Regency McCormick (1,258) and Marriott Marquis (1,205)): Debt service FY26 $228.0M / FY27 $236.6M / FY28 $245.6M · Tax collections are expected to fall short of debt service FY26–FY28, and MPEA intends to refinance portions of the bonds · FY26–28 plan (Apr 2025) · 2025-04-14 | Named Chicago hotel loan with a 2026–27 maturity in SS/DQ (besides Palmer House): no public read (Trepp free PDFs and KBRA BusinessWire checked) · 2026-10-11 · 2026-10-11 (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "CRE Daily · The Real Deal · Chicago Sun-Times · MPEA (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.credaily.com/briefs/hilton-hotel-cmbs-distress-outpaces-marriotts-trepp-finds/",
        "label": "Palmer House Hilton (1,641 keys; Thor Equities; JPMBB 2015-C32 et al.) — credaily.com",
        "secondary": false
      },
      {
        "url": "https://therealdeal.com/chicago/2026/07/28/portion-of-palmer-house-hitting-auction-block-with-2m-bid/",
        "label": "Palmer House Hilton (1,641 keys; Thor Equities; JPMBB 2015-C32 et al.) — therealdeal.com",
        "secondary": false
      },
      {
        "url": "https://chicago.suntimes.com/business/2026/10/09/hotel-workers-strike-chicago-marathon-weekend",
        "label": "Palmer House Hilton (1,641 keys; Thor Equities; JPMBB 2015-C32 et al.) — chicago.suntimes.com",
        "secondary": false
      },
      {
        "url": "https://www.mpea.com/wp-content/uploads/2025/04/Financial-Plan_FY26-FY27-FY28.pdf",
        "label": "MPEA Expansion Project Bonds (back the McCormick campus, including the",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-chicago-debt-market-level-reads",
    "marketSlug": "chicago",
    "kind": "debt",
    "title": "Chicago debt & deals: Market-level reads",
    "body": "Chicago — debt & deals: Market-level reads. RevPAR YTD through Aug 2026: +11.6% (2nd after SF), driven by meetings displaced from World Cup host cities; won't repeat in 2027 · Sep 2026 | Host Hotels Chicago comparable RevPAR, Q3-2025: +2.0% YoY · 2025-11-05 | Hilton-flag CMBS distress (national; Palmer House drives it): Hilton NPL 11.73% vs Marriott 7.23%; Hilton full-service 16.17% · 2026-10-01 | Chicago transaction cap rate; Chicago lodging DQ cut: no public read · 2026-10-11 (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "LinkedIn · Host Hotels & Resorts · CRE Daily (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.linkedin.com/posts/costar_top-us-hotel-markets-in-2026-activity-7506699098205585408-so1V",
        "label": "RevPAR YTD through Aug 2026",
        "secondary": false
      },
      {
        "url": "https://www.hosthotels.com/Press-Releases/2025/PressRelease_27676",
        "label": "Host Hotels Chicago comparable RevPAR, Q3-2025",
        "secondary": false
      },
      {
        "url": "https://www.credaily.com/briefs/hilton-hotel-cmbs-distress-outpaces-marriotts-trepp-finds/",
        "label": "Hilton-flag CMBS distress (national; Palmer House drives it)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-chicago-tax-lodging-tax-stack",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago tax & CVB: Lodging tax stack (City of Chicago)",
    "body": "Chicago — tax & CVB: Lodging tax stack (City of Chicago). Illinois Hotel Operators' Occupation Tax (6% of 94%): 6.0% · 6.17% · IDOR · 2026-05; 2023-08-30 | Chicago Municipal HOOT: 1.0% · 1.08% · IDOR · same | Illinois Sports Facilities Authority (ISFA): 2.0% · 2.14% · IDOR · same | MPEA hotel tax: 2.5% · 2.50% · IDOR · same | Cook County hotel tax: 1.0% · 1.00% · Cook County · same | Chicago Hotel Accommodations Tax: 4.5% · 4.50% · City DOF · eff. 2026-05-01 | Composite: 17.39% (~17.4%) · 2026-05 | Chicago Tourism Improvement District (CTID), hotels with 100+ rooms in 16 designated ZIPs (Downtown, McCormick, IMD, Hyde Park): 1.5% transaction charge (not compounded with the 4.5%; excluded from the HOOT base) · City DOF (Form 7520T) · eff. 2026-05-01; 2026-04-20 | Total inside the CTID: ~18.9% (arithmetic: 17.39 + 1.5; the Sun-Times rounds to \"19%\") · 2026-04-30. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "9 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "civicfed.org · tax.illinois.gov · City of Chicago · Choose Chicago · Chicago Sun-Times (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://civicfed.org/civic-federation/blog/how-composite-effective-hotel-tax-rate-calculated-chicago",
        "label": "Illinois Hotel Operators' Occupation Tax (6% of 94%) — civicfed.org",
        "secondary": false
      },
      {
        "url": "https://tax.illinois.gov/content/dam/soi/en/web/taxarchive/research/legal/letter-rulings/sales-tax/2023/st23-0028-gil.pdf",
        "label": "Illinois Hotel Operators' Occupation Tax (6% of 94%) — tax.illinois.gov",
        "secondary": false
      },
      {
        "url": "https://www.chicago.gov/city/en/depts/fin/supp_info/revenue/tax_list/hotel_accommodationstax.html",
        "label": "Chicago Hotel Accommodations Tax",
        "secondary": false
      },
      {
        "url": "https://civicfed.org/sites/default/files/2026-05/ChicagoConsumerTaxReport2026_0.pdf",
        "label": "Composite",
        "secondary": false
      },
      {
        "url": "https://cdn.choosechicago.com/uploads/2026/04/IHLA-Memo-TID-April-20-2026.pdf",
        "label": "Chicago Tourism Improvement District (CTID), hotels with 100+ rooms in",
        "secondary": false
      },
      {
        "url": "https://chicago.suntimes.com/city-hall/2026/04/30/choose-chicago-strategic-plan-hotel-tax-windfall-marketing-tourism",
        "label": "Total inside the CTID",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-chicago-tax-collections-dmo-funding",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago tax & CVB: Collections & DMO funding",
    "body": "Chicago — tax & CVB: Collections & DMO funding. City business taxes (hotel accommodations tax + checkout bag tax, combined): $186.3M FY2026 budget (+$11.3M vs 2025), driven by room rates and demand. Hotel-only line: no public read in the overview · FY2026 · 2026 budget | Special Events & Municipal HOOT Fund: $70.2M (2025) → $72.9M (2026) · FY2025–26 · same | MPEA tax collections (all MPEA taxes: hotel, auto rental, F&B, airport departure, combined): FY23 $168.4M; FY24 $176.0M; FY25 est. $190.4M; FY26 budget $196.3M; FY27 $204.9M; FY28 $213.9M. The hotel-tax-only split: no public read in the plan · FY2023–28 · 2025-04-14 | Choose Chicago budget 2026: Revenue $34.70M: State of Illinois $22.0M (63%), MPEA $5.775M (17%), City $3.325M (10%), private $3.604M (10%). Expenses $35.13M (marketing $16.58M; convention sales $10.57M) · CY2026 budget · Feb 2026 | CTID uplift: ~$50M/yr to Choose Chicago (five-year district). Budget goes to \"about $90M\" · from 2026-05-01 · 2026-04-30. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "City of Chicago · Choose Chicago · Chicago Sun-Times (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.chicago.gov/content/dam/city/depts/obm/supp_info/2026Budget/2026%20Budget%20Overview.pdf",
        "label": "Special Events & Municipal HOOT Fund",
        "secondary": false
      },
      {
        "url": "https://cdn.choosechicago.com/uploads/2026/02/CC_AnnualReport_2025_Spreads-2.pdf",
        "label": "Choose Chicago budget 2026",
        "secondary": false
      },
      {
        "url": "https://chicago.suntimes.com/city-hall/2026/04/30/choose-chicago-strategic-plan-hotel-tax-windfall-marketing-tourism",
        "label": "CTID uplift",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-dallas-debt-named-hotel-transactions-2025-2026",
    "marketSlug": "dallas",
    "kind": "debt",
    "title": "Dallas debt & deals: Named hotel transactions 2025–2026",
    "body": "Dallas — debt & deals: Named hotel transactions 2025–2026. Fairmont Dallas (Arts District): 2025-04-11 · undisclosed / Xenia (XHR) · $111.0M · 545 · $203,670 · 10.0% cap on T12 NOI (to 2025-02-28), 8.6x EBITDA, excluding ~$80M near-term capex. Xenia cited convention-center redevelopment disruption | Embassy Suites Dallas Love Field: 2026-03-23 · Scenic Capital Advisors / FelCor Dallas Love Field Owner LLC · undisclosed · 248 · n/a · cap not disclosed. Renovation and repositioning planned | Embassy Suites Dallas Near the Galleria: closed 2026-05-06 · DG Lodging LLC (Ketan Keshav) / Ashford Hospitality Trust · $17.0M ($16.6M net). AHT paid ~$16.0M to the lender on a 10-hotel pool loan · 150 · ~$113K (AHT) · cap not disclosed. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "xeniareit.com · Hotel Online · ashfordhospitalitytrust.q4ir.com · stocktitan.net · The Real Deal (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://investors.xeniareit.com/news/news-details/2025/Xenia-Hotels--Resorts-Completes-Sale-of-Fairmont-Dallas/default.aspx",
        "label": "Fairmont Dallas (Arts District)",
        "secondary": false
      },
      {
        "url": "https://www.hotel-online.com/news/scenic-capital-advisors-acquires-embassy-suites-by-hilton-dallas-love-field",
        "label": "Embassy Suites Dallas Love Field",
        "secondary": false
      },
      {
        "url": "https://ashfordhospitalitytrust.q4ir.com/investor/news/press-releases/press-release/2026/ASHFORD-HOSPITALITY-TRUST-CONTINUES-STRATEGIC-PORTFOLIO-OPTIMIZATION-THROUGH-SALE-OF-SIX-HOTELS/default.aspx",
        "label": "Embassy Suites Dallas Near the Galleria — ashfordhospitalitytrust.q4ir.com",
        "secondary": false
      },
      {
        "url": "https://www.stocktitan.net/sec-filings/AHT/8-k-ashford-hospitality-trust-inc-reports-material-event-41fec8f6c0a7.html",
        "label": "Embassy Suites Dallas Near the Galleria — stocktitan.net",
        "secondary": false
      },
      {
        "url": "https://therealdeal.com/texas/2026/05/15/ashford-hospitality-sells-hotel-in-its-expansive-portfolio/",
        "label": "Embassy Suites Dallas Near the Galleria — therealdeal.com",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-dallas-debt-cmbs-sasb-loans",
    "marketSlug": "dallas",
    "kind": "debt",
    "title": "Dallas debt & deals: CMBS / SASB loans",
    "body": "Dallas — debt & deals: CMBS / SASB loans. Sheraton Dallas (1,841 keys; Chartres/Elliott), SDAL 2025-DAL: $300M senior (GS/JPM) + $35M Driftwood mezz · Refinanced Jun 2025: 2-yr initial term + three 1-yr extensions, so initial maturity ~mid-2027 (arithmetic). KBRA affirmed in Apr 2026: KNCF $33.7M, KBRA value $321.2M ($174K/key), in-trust KLTV 93.4% (85.9% at issuance) · 2025-06-26; Apr 2026 | Le Méridien Dallas by the Galleria (NB Holdings): $42.84M (MS 2019 CMBS) · Flagged for foreclosure (Roddy's) two years after a Ch. 11 exit (Mar 2024). About $170M of TX hotel loans were flagged in Jan 2026 · 2026-01-26 | AHT 10-hotel pool loan (incl. Embassy Suites Galleria): ~$16.0M paydown · Deleveraging release · 2026-05-06 | Other named Dallas hotel SS/DQ 2026: no public read (Trepp's free PDFs name none) · checked 2026-10-11 (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "The Real Deal · tradersunion.com · Hoodline · stocktitan.net (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://therealdeal.com/texas/dallas/2025/06/26/sheraton-dallas-hotel-lands-335-million-refinancing/",
        "label": "Sheraton Dallas (1,841 keys; Chartres/Elliott), SDAL 2025-DAL — therealdeal.com",
        "secondary": true
      },
      {
        "url": "https://tradersunion.com/news/financial-news/show/1943691-kbra-affirms-sdal-2025-dal-cmbs-ratings/",
        "label": "Sheraton Dallas (1,841 keys; Chartres/Elliott), SDAL 2025-DAL — tradersunion.com",
        "secondary": true
      },
      {
        "url": "https://therealdeal.com/texas/dallas/2026/01/26/le-meridien-dallas-by-the-galleria-faces-foreclosure/",
        "label": "Le Méridien Dallas by the Galleria (NB Holdings) — therealdeal.com",
        "secondary": false
      },
      {
        "url": "https://hoodline.com/2026/01/foreclosure-cloud-hangs-over-le-meridien-dallas-near-galleria-as-42-840-000-loan-falters/",
        "label": "Le Méridien Dallas by the Galleria (NB Holdings) — hoodline.com",
        "secondary": false
      },
      {
        "url": "https://www.stocktitan.net/sec-filings/AHT/8-k-ashford-hospitality-trust-inc-reports-material-event-41fec8f6c0a7.html",
        "label": "AHT 10-hotel pool loan (incl. Embassy Suites Galleria)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-dallas-debt-market-level-reads",
    "marketSlug": "dallas",
    "kind": "debt",
    "title": "Dallas debt & deals: Market-level reads",
    "body": "Dallas — debt & deals: Market-level reads. City HOT revenue (7% local): ~$89M projected FY26 (Cup-driven); ~$86M FY27 · FY2025-26 budget | Arlington June 2026 HOT: $31M (+39%, all-time record) · Jun 2026 | Sheraton Dallas appraisal: $523M (LW Hospitality Advisors, Mar 2025) vs KBRA $321.2M · 2025 / 2026 | HVS/CBRE Dallas cap read, lodging DQ cut: no public read (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "City of Dallas · fortworthreport.org · The Real Deal · tradersunion.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://dallascityhall.com/departments/budget/financialtransparency/AnnualBudget/5.%20Five%20Year%20Forecast.pdf",
        "label": "City HOT revenue (7% local)",
        "secondary": false
      },
      {
        "url": "https://fortworthreport.org/2026/09/30/world-cup-brought-nearly-30-more-sales-tax-to-arlington-though-most-money-was-spent-around-stadium/",
        "label": "Arlington June 2026 HOT",
        "secondary": false
      },
      {
        "url": "https://therealdeal.com/texas/dallas/2025/06/26/sheraton-dallas-hotel-lands-335-million-refinancing/",
        "label": "Sheraton Dallas appraisal — therealdeal.com",
        "secondary": false
      },
      {
        "url": "https://tradersunion.com/news/financial-news/show/1943691-kbra-affirms-sdal-2025-dal-cmbs-ratings/",
        "label": "Sheraton Dallas appraisal — tradersunion.com",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-dallas-tax-lodging-tax-stack",
    "marketSlug": "dallas",
    "kind": "tax",
    "title": "Dallas tax & CVB: Lodging tax stack (City of Dallas)",
    "body": "Dallas — tax & CVB: Lodging tax stack (City of Dallas). Texas state HOT: 6% · State. Captured for 30 years by the 2021 Project Financing Zone for the convention center expansion (plus hotel-related sales and mixed-beverage taxes) · FY2026 | City HOT: 7% · 67.4% KBHCC (bond ordinance) · 17.6% VisitDallas · 15.0% Office of Arts & Culture · FY2026 | Venue HOT (Prop A, Nov 2022; Brimer Bill): 2% (from CY2023, up to 30 years / while bonds are outstanding) · ~80% KBHCC master plan / ~20% Fair Park · FY2026 | Subtotal tax: 15% · 2026 | Dallas TPID assessment: 2% (hotels with 100+ rooms; renewed to Sep 2029) · VisitDallas-administered marketing · 2026 | Total (100+ rooms): 17% · 2026. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "City of Dallas · dallastpid.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://dallascityhall.com/departments/budget/financialtransparency/AnnualBudget/Budget%20Overview-FY2025-26.pdf",
        "label": "Texas state HOT",
        "secondary": false
      },
      {
        "url": "https://dallascityhall.com/departments/budget/financialtransparency/AnnualBudget/Revenue-FY2025-26.pdf",
        "label": "City HOT",
        "secondary": false
      },
      {
        "url": "https://dallascityhall.com/departments/controllersoffice/DCH%20Documents/pdf/city-code-hotel-occupancy-tax.pdf",
        "label": "Venue HOT (Prop A, Nov 2022; Brimer Bill)",
        "secondary": false
      },
      {
        "url": "https://dallascityhall.com/departments/controllersoffice/Pages/hotels-occupancy-tax.aspx",
        "label": "Subtotal tax",
        "secondary": false
      },
      {
        "url": "https://dallastpid.com/local-impact/faqs/",
        "label": "Dallas TPID assessment",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-dallas-tax-collections-and-dmo-budget",
    "marketSlug": "dallas",
    "kind": "tax",
    "title": "Dallas tax & CVB: Collections and DMO budget",
    "body": "Dallas — tax & CVB: Collections and DMO budget. City 7% HOT: ~$89M projected FY26 / ~$86M FY27 · FY2025-26 budget | VisitDallas allocation: ~$15.7M (17.6%) · FY2026 | Convention & Event Services: ~$60M HOT (67.4%). CES total revenues $131.5M (FY26) / $131.7M (FY27) / $118.0M (FY28) · FY2026–28 | Arts & Culture: ~$13.3M · FY2026 | KBHCC master plan financing: $1B JPMorgan bridge loan authorized Jun 2025; revenue bonds expected spring/summer 2026 (issuance status: no public read) · 2025-06 | TPID collections: no public read (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "City of Dallas · wfaa.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://dallascityhall.com/departments/budget/financialtransparency/AnnualBudget/5.%20Five%20Year%20Forecast.pdf",
        "label": "City 7% HOT",
        "secondary": false
      },
      {
        "url": "https://www.wfaa.com/article/news/local/dallas-county/visitdallas-contract-up-again-years-after-scathing-2019-audit-where-things-stand-now/287-3b3d23ab-9673-4b7e-8a29-35ac42d7ffdf",
        "label": "VisitDallas allocation",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-honolulu-debt-named-hotel-transactions-2025-2026",
    "marketSlug": "honolulu",
    "kind": "debt",
    "title": "Honolulu debt & deals: Named hotel transactions 2025–2026 (Waikīkī trades are mostly land/leased-fee)",
    "body": "Honolulu — debt & deals: Named hotel transactions 2025–2026 (Waikīkī trades are mostly land/leased-fee). Royal Hawaiian Hotel land (10.3-acre fee under the hotel; Kyo-ya keeps the hotel on a ground lease to 2076): closed ~2025-11-06 (\"Thursday\" before 2025-11-11) · Daisho Co. (Japan) / Kamehameha Schools · $510M (land only) · n/a (land) · n/a · cap not disclosed | Hyatt Regency Waikiki, leased-fee interest: Aug 2025 · Montgomery Street Partners / n/a · undisclosed · 1,230 (hotel) · n/a · cap not disclosed. A Mar-2025 report said Mirae Asset was seeking ~$650M for the hotel (no closing confirmed) | Oasis Hotel Waikiki, ground under the hotel: Jul 2025 (reported 2025-09-03) · Eagle Point Hotel Partners + Ben Rafter (hotel owners buying the fee) / n/a · $23M · 96 (hotel) · ~$240K (arithmetic, fee only) · cap not disclosed | Four Seasons Hualālai land (Big Island; context): Aug 2025 · Michael Dell (hotel owner) / Kamehameha Schools · ~$400M · n/a · n/a · n/a. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "staradvertiser.com · montgomerystreetpartners.com · akm.ru · Business Journals (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.staradvertiser.com/2025/11/11/hawaii-news/kamehameha-schools-cashes-in-on-waikiki-hotel-land/",
        "label": "Royal Hawaiian Hotel land (10.3-acre fee under the hotel; Kyo-ya keeps",
        "secondary": false
      },
      {
        "url": "https://montgomerystreetpartners.com/news/msp-acquires-the-leased-fee-interest-in-the-hyatt-regency-waikiki/",
        "label": "Hyatt Regency Waikiki, leased-fee interest — montgomerystreetpartners.com",
        "secondary": true
      },
      {
        "url": "https://www.akm.ru/eng/news/south-korean-mirae-asset-global-intends-to-sell-the-hyatt-regency-waikiki-hotel-for-650-million/",
        "label": "Hyatt Regency Waikiki, leased-fee interest — akm.ru",
        "secondary": true
      },
      {
        "url": "https://www.bizjournals.com/pacific/news/2025/09/03/waikiki-oasis-hotel-sale-investors.html",
        "label": "Oasis Hotel Waikiki, ground under the hotel",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-honolulu-debt-cmbs-sasb-loans",
    "marketSlug": "honolulu",
    "kind": "debt",
    "title": "Honolulu debt & deals: CMBS / SASB loans",
    "body": "Honolulu — debt & deals: CMBS / SASB loans. Hilton Hawaiian Village (Park; 2,860± keys), HHV 2016 CMBS: $1.275B · Repaid in full 2026-09-30, ahead of the 2026-11-01 maturity. Funded with $700M Bonnet Creek delayed-draw mortgage + $600M unsecured delayed-draw term loan; the resort is now unencumbered · 2026-09-30. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "1 row",
    "asOf": "2026-10-11",
    "sourceLabel": "SEC EDGAR · nasdaq.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sec.gov/Archives/edgar/data/1617406/000161740626000045/pk-20260930.htm",
        "label": "Hilton Hawaiian Village (Park; 2,860± keys), HHV 2016 CMBS — sec.gov",
        "secondary": false
      },
      {
        "url": "https://www.nasdaq.com/press-release/park-hotels-resorts-inc-successfully-repays-1275-billion-cmbs-loan-secured-hilton",
        "label": "Hilton Hawaiian Village (Park; 2,860± keys), HHV 2016 CMBS — nasdaq.com",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-honolulu-debt-market-level-reads",
    "marketSlug": "honolulu",
    "kind": "debt",
    "title": "Honolulu debt & deals: Market-level reads",
    "body": "Honolulu — debt & deals: Market-level reads. Host Oʻahu comparable RevPAR: +8.0% YoY · Q3-2025 | Honolulu union labor unrest cited nationally: Strikes \"in the recent past\" (Boston, SF, Seattle, Honolulu) · 2026-05-13 | HVS/CBRE Honolulu cap read, lodging DQ cut: no public read (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Host Hotels & Resorts · Hotel Online (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.hosthotels.com/Press-Releases/2025/PressRelease_27676",
        "label": "Host Oʻahu comparable RevPAR",
        "secondary": false
      },
      {
        "url": "https://www.hotel-online.com/news/q1-2026-major-us-hotel-sales-survey-lodging-sector-overview",
        "label": "Honolulu union labor unrest cited nationally",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-honolulu-tax-lodging-tax-stack",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu tax & CVB: Lodging tax stack (Oʻahu)",
    "body": "Honolulu — tax & CVB: Lodging tax stack (Oʻahu). State Transient Accommodations Tax (TAT): 11.00% from 2026-01-01 (was 10.25%; Act 96 \"green fee\") · State general fund (HTA now funded by general-fund appropriation) + earmarks incl. the Convention Center fund · eff. 2026-01-01 | Oʻahu TAT (OTAT): 3% · City & County of Honolulu · eff. 2021-12-14 | General Excise Tax + Oʻahu surcharge: 4.5% (max pass-on 4.712%) · State / county · 2026 | Total (visible pass-on): 18.712% · 2026. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "State of Hawaii · revds.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/legal/brochures/TAT_brochure-26.pdf",
        "label": "State Transient Accommodations Tax (TAT) — files.hawaii.gov",
        "secondary": false
      },
      {
        "url": "https://files.hawaii.gov/tax/news/announce/ann25-03.pdf",
        "label": "State Transient Accommodations Tax (TAT) — files.hawaii.gov",
        "secondary": false
      },
      {
        "url": "https://revds.com/taxpayerpdfs/CA-GA-LA-KY-TX-forms/Honolulu/OTAT%20FAQs.pdf",
        "label": "Oʻahu TAT (OTAT)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-honolulu-tax-collections-and-dmo-budget",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu tax & CVB: Collections and DMO budget",
    "body": "Honolulu — tax & CVB: Collections and DMO budget. HTA tourism budget (general funds): $63.0M (YTD actual + encumbered $46.5M at 2026-03-31). Branding & marketing $39.2M · FY2026 | Hawaii Convention Center Enterprise Special Fund: $26.98M budget, incl. $11.0M TAT-linked transfer to B&F, $5.79M operations, $8.61M repairs, $1.58M sales & marketing · FY2026 | HCC rooftop deck repair project: $108.7M budget / $94.0M spent · 2026-03-31 | State TAT collections, OTAT collections: no public read this pass (source: no public read) | Oʻahu Visitors Bureau budget: no public read (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Hawaii Tourism Authority (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://hta.hawaii.gov/wp-content/uploads/2026/07/handout-07-fy-2026-board-presentation.pdf",
        "label": "HTA tourism budget (general funds)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-houston-debt-named-hotel-transactions-2025-2026",
    "marketSlug": "houston",
    "kind": "debt",
    "title": "Houston debt & deals: Named hotel transactions 2025–2026",
    "body": "Houston — debt & deals: Named hotel transactions 2025–2026. St. Regis Houston (to become The Houston Grand Hotel, Luxury Collection): 2026-01-13 · Saddlebrook Equity & Mgmt / Host Hotels (HST) · $51.0M · 232 · $219.8K · cap not disclosed | Embassy Suites Houston Near the Galleria + Embassy Suites Austin Arboretum (pair): closed by 2026-02-24 · undisclosed / Ashford Trust (AHT) · $27.0M (pair) · 300 (pair) · $90K · 2.7% cap on TTM-Dec-2025 NOI (1.7% after $14.5M expected capex); 22.5x / 34.5x Hotel EBITDA | The Moran CityCentre: 2026-05-04 · MetroNational with Rockbridge / n/a · undisclosed · 244 · n/a · cap not disclosed | Sheraton Houston North (IAH): auction May 2025, close expected Jun 2025 · undisclosed / CMBS trust (special servicer GF Hotels) · $14.8M · 416 · <$36K · cap not disclosed. Loan-origination value $68M, latest appraisal $16.2M. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Hotel Dive · hoteliertimes.com · PR Newswire · Houston Chronicle · The Real Deal (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.hoteldive.com/news/saddlebrook-acquires-st-regis-houston/809460/",
        "label": "St. Regis Houston (to become The Houston Grand Hotel, Luxury Collectio — hoteldive.com",
        "secondary": false
      },
      {
        "url": "https://hoteliertimes.com/houston-hotel-market-2026/",
        "label": "St. Regis Houston (to become The Houston Grand Hotel, Luxury Collectio — hoteliertimes.com",
        "secondary": false
      },
      {
        "url": "https://www.prnewswire.com/news-releases/ashford-hospitality-trust-sees-strong-buyer-demand-in-multiple-hotel-transactions-and-closings-302695681.html",
        "label": "Embassy Suites Houston Near the Galleria + Embassy Suites Austin Arbor",
        "secondary": false
      },
      {
        "url": "https://www.houstonchronicle.com/business/real-estate/article/moran-citycentre-hotel-metronational-west-houston-22240238.php",
        "label": "The Moran CityCentre",
        "secondary": false
      },
      {
        "url": "https://therealdeal.com/texas/houston/2025/05/14/distressed-houston-hotel-sells-for-fraction-of-appraised-value/",
        "label": "Sheraton Houston North (IAH)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-houston-debt-cmbs-sasb-loans",
    "marketSlug": "houston",
    "kind": "debt",
    "title": "Houston debt & deals: CMBS / SASB loans",
    "body": "Houston — debt & deals: CMBS / SASB loans. Sheraton Houston North (416 keys): $34.4M CMBS · In SS since a 2020 default. Liquidated at a $14.8M auction · May–Jun 2025 | Hilton Houston Post Oak (448 keys), JPMBB 2014-C24 / C25: $50–100M band (CRE Direct tag) · Lender-owned (REO). JPMorgan marketing it for sale, targeting year-end 2025 · 2025-12-16 | Aloft Houston by the Galleria: ~$50.6M repurchase · In SS since 2020; court ordered Argentic to buy back the loan · Sep 2024 (pre-window, context) | Named Houston hotel loan maturing 2026–27 or newly transferred in 2026: no public read. Trepp's free monthly DQ/SS PDFs (Jan–Sep 2026) name no Houston hotel. Their Houston item is a two-tower office complex · checked 2026-10-11 (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "The Real Deal · Commercial Real Estate Direct · Business Journals (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://therealdeal.com/texas/houston/2025/05/14/distressed-houston-hotel-sells-for-fraction-of-appraised-value/",
        "label": "Sheraton Houston North (416 keys)",
        "secondary": false
      },
      {
        "url": "https://crenews.com/2025/12/16/lender-wants-to-sell-448-room-hilton-houston-post-oak-hotel/",
        "label": "Hilton Houston Post Oak (448 keys), JPMBB 2014-C24 / C25 — crenews.com",
        "secondary": false
      },
      {
        "url": "https://www.bizjournals.com/houston/news/2025/12/12/hilton-houston-post-oak-for-sale-industry-struggle.html",
        "label": "Hilton Houston Post Oak (448 keys), JPMBB 2014-C24 / C25 — bizjournals.com",
        "secondary": false
      },
      {
        "url": "https://www.bizjournals.com/houston/news/2024/09/13/aloft-galleria-delinquent-loan.html",
        "label": "Aloft Houston by the Galleria — bizjournals.com",
        "secondary": false
      },
      {
        "url": "https://therealdeal.com/texas/houston/2024/09/17/argentic-force-to-buy-back-houston-aloft-hotel-for-50-6m/",
        "label": "Aloft Houston by the Galleria — therealdeal.com",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-houston-tax-lodging-tax-stack",
    "marketSlug": "houston",
    "kind": "tax",
    "title": "Houston tax & CVB: Lodging tax stack (City of Houston)",
    "body": "Houston — tax & CVB: Lodging tax stack (City of Houston). Texas state HOT: 6% · 0.5 pt tourism, the rest to the general fund · accessed 2026-10-11 | City of Houston HOT (collected by Houston First): 7% · Convention/tourism. Historically funded ~90% of GHCVB operations · accessed 2026-10-11 | Harris County HOT: 2% · county · accessed 2026-10-11 | Harris County–Houston Sports Authority: 2% · stadium debt · accessed 2026-10-11 | Total: 17% · accessed 2026-10-11 | SB 1057 (2023) convention-district capture: not a rate · Houston First receives the state's share of incremental HOT within 3 miles of GRB for 30 years, est. ~$2B, for GRB South · accessed 2026-10-11 | TPID/TID: no public read of an active Houston hotel TPID this pass · 2026-10-11 (checked) (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "7 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Houston First (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.houstonfirst.com/hot/faqs/",
        "label": "Texas state HOT",
        "secondary": false
      },
      {
        "url": "https://www.houstonfirst.com/media/uploads/strategicsummary2026_sm.pdf",
        "label": "SB 1057 (2023) convention-district capture",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-houston-tax-collections-and-dmo-budget",
    "marketSlug": "houston",
    "kind": "tax",
    "title": "Houston tax & CVB: Collections and DMO budget",
    "body": "Houston — tax & CVB: Collections and DMO budget. City HOT to Houston First (current + delinquent): $112.0M actual / $114.5M forecast / $117.0M budget · CY2024 / CY2025 / CY2026 · CY2024 / CY2025 / CY2026 (period) | Houston First total revenue / expense (DMO + GRB + venues; Houston First is the merged CVB): $258.5M / $257.0M · CY2026 budget · CY2026 | Houston First debt service: $72.0M · CY2026 budget · CY2026 budget (period) | Transfer to Houston Arts Alliance (19.3% of HOT): $22.4M · CY2026 · CY2026 (period) | Harris County 2% and Sports Authority 2% collections: no public read this pass · 2026-10-11 (checked) (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Houston First · houstontx.gov (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.houstonfirst.com/media/uploads/strategicsummary2026_sm.pdf",
        "label": "City HOT to Houston First (current + delinquent)",
        "secondary": false
      },
      {
        "url": "https://houstontx.gov/council/committees/bfacommittee/20251209-joint-ed/2026-Houston-First-Budget.pdf",
        "label": "Houston First total revenue / expense (DMO + GRB + venues; Houston Fir",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-los-angeles-debt-named-hotel-transactions-2025-2026",
    "marketSlug": "los-angeles",
    "kind": "debt",
    "title": "Los Angeles debt & deals: Named hotel transactions 2025–2026",
    "body": "Los Angeles — debt & deals: Named hotel transactions 2025–2026. Chamberlain West Hollywood: 2026-05-27 · Daniel Negari (per Bisnow) / Pebblebrook (PEB) · $43.5M · 115 · ~$378K · 5.9% NOI cap (4% FF&E reserve), 14.5x EBITDA, on T12 to 2026-04-30 | Hotel Per La (ex-NoMad LA), 649 S Olive St, DTLA: closed 2026-09-02 · Daniel Negari (1922 XYZ LLC) / lender Waterfall (WF CREL 2020 GT; took control ~2025 with >$134M of debt outstanding) · $34.0M · 241 · ~$141K · cap not disclosed. Lender exit at ~25% of the debt (arithmetic) | Kimpton La Peer (West Hollywood): reported 2026-08-10 · APA Group / KHP Capital Partners · $63.0M · 105 · $600K · cap not disclosed | The Montrose (West Hollywood): late 2025 · Daniel Negari / Pebblebrook · ~$44M · ~132 (arithmetic from ~$333K/key) · ~$333K · cap not disclosed. PEB's Q4-2025 plus Chamberlain sales total ~$160M at 15.4x / 4.6% NOI cap | The Metric (DTLA boutique): 2026-05-28 · n/a / Patel family trust · $9.25M · 28 · ~$330K · cap not disclosed. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "pebblebrookhotels.com · Bisnow · atlasbrief.la · The Real Deal · Marcus & Millichap (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://investor.pebblebrookhotels.com/news-1/news-releases/news-details/2026/Pebblebrook-Hotel-Trust-Completes-43-5-Million-Sale-of-Chamberlain-West-Hollywood-Hotel/default.aspx",
        "label": "Chamberlain West Hollywood — investor.pebblebrookhotels.com",
        "secondary": false
      },
      {
        "url": "https://www.bisnow.com/news/los-angeles/hotel/daniel-negari-buys-downtown-la-hotel-per-la",
        "label": "Chamberlain West Hollywood — bisnow.com",
        "secondary": false
      },
      {
        "url": "https://atlasbrief.la/atlas-brief/649-s-olive-st",
        "label": "Hotel Per La (ex-NoMad LA), 649 S Olive St, DTLA",
        "secondary": true
      },
      {
        "url": "https://therealdeal.com/la/2026/08/10/khp-capital-partners-sells-kimpton-west-hollywood-hotel/",
        "label": "Kimpton La Peer (West Hollywood)",
        "secondary": false
      },
      {
        "url": "https://www.marcusmillichap.com/news-events/press/2026/05/05-28-the-metric-hotel",
        "label": "The Metric (DTLA boutique)",
        "secondary": true
      }
    ]
  },
  {
    "id": "w1c-los-angeles-debt-cmbs-sasb-loans",
    "marketSlug": "los-angeles",
    "kind": "debt",
    "title": "Los Angeles debt & deals: CMBS / SASB loans",
    "body": "Los Angeles — debt & deals: CMBS / SASB loans. Shutters on the Beach + Hotel Casa del Mar (Santa Monica; 327 keys), CALI 2024-SUN: $280M floating SASB (+$120M Goldman-linked mezz) · Transferred to SS in Jun–Jul 2026 for maturity default: \"unable to meet the maturity extension conditions\" (rate-cap dispute). Newly DQ in the Trepp Sep-2026 report. DSCR just below 1.0x (Morningstar). DBRS placed all classes Under Review–Negative (Aug 2026). Goldman bought the senior loan with borrower cooperation (2026-09-30). 2024 appraisal ~$605M (~$1.9M/key) · Jul–Sep 2026 | Hotel Per La (ex-NoMad): >$134M · Lender took control (~2025), then sold at $34M · 2025–2026-09 | Other named LA hotel SS/DQ 2026: no public read beyond the above · checked 2026-10-11 (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "The Real Deal · Trepp · Morningstar DBRS · Bisnow (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://therealdeal.com/la/2026/09/30/goldman-buys-slatkins-loan-on-santa-monica-hotels/",
        "label": "Shutters on the Beach + Hotel Casa del Mar (Santa Monica; 327 keys), C — therealdeal.com",
        "secondary": false
      },
      {
        "url": "https://www.trepp.com/hubfs/Trepp%20CMBS%20Delinquency%20Report%20September%202026.pdf",
        "label": "Shutters on the Beach + Hotel Casa del Mar (Santa Monica; 327 keys), C — trepp.com",
        "secondary": false
      },
      {
        "url": "https://www.trepp.com/hubfs/Trepp%20CMBS%20Special%20Servicing%20Report%20July%202026.pdf",
        "label": "Shutters on the Beach + Hotel Casa del Mar (Santa Monica; 327 keys), C — trepp.com",
        "secondary": false
      },
      {
        "url": "https://dbrs.morningstar.com/research/487994/morningstar-dbrs-places-all-classes-of-cali-commercial-mortgage-trust-2024-sun-under-review-with-negative-implications",
        "label": "Shutters on the Beach + Hotel Casa del Mar (Santa Monica; 327 keys), C — dbrs.morningstar.com",
        "secondary": false
      },
      {
        "url": "https://www.bisnow.com/news/los-angeles/hotel/daniel-negari-buys-downtown-la-hotel-per-la",
        "label": "Hotel Per La (ex-NoMad)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-los-angeles-debt-market-level-reads",
    "marketSlug": "los-angeles",
    "kind": "debt",
    "title": "Los Angeles debt & deals: Market-level reads",
    "body": "Los Angeles — debt & deals: Market-level reads. Host LA/Orange County comparable RevPAR: −4.9% YoY · Q3-2025 | Pebblebrook 2025–26 LA-area disposition pricing: 15.4x EBITDA / 4.6% NOI cap aggregate (~$160M) · 2026-05-27 | HVS/CBRE LA cap read, lodging DQ cut: no public read (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Host Hotels & Resorts · pebblebrookhotels.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.hosthotels.com/Press-Releases/2025/PressRelease_27676",
        "label": "Host LA/Orange County comparable RevPAR",
        "secondary": false
      },
      {
        "url": "https://investor.pebblebrookhotels.com/news-1/news-releases/news-details/2026/Pebblebrook-Hotel-Trust-Completes-43-5-Million-Sale-of-Chamberlain-West-Hollywood-Hotel/default.aspx",
        "label": "Pebblebrook 2025–26 LA-area disposition pricing",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-los-angeles-tax-lodging-tax-stack",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles tax & CVB: Lodging tax stack (City of Los Angeles)",
    "body": "Los Angeles — tax & CVB: Lodging tax stack (City of Los Angeles). State sales tax on lodging: 0% (CA does not tax transient lodging) (source: state citation: no public read this pass) | City TOT: 14% · 13 pts to the General Fund (incl. ~1 pt to Cultural Affairs) · 1 pt to the LA Convention & Visitors Bureau Trust Fund (LATCB) · FY2025-26 | LA Tourism Marketing District (LATMD): 2.0% of room revenue (hotels with 50+ rooms; up from 1.5% on 2022-05-01) · LATCB sales & marketing · eff. 2022-05-01 | Total (50+ room hotel, City of LA): 16.0% (arithmetic) · 2026 | Santa Monica / West Hollywood stacks: no public read this pass (separate cities) (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "City of Los Angeles · Discover Los Angeles (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://tourism.lacity.gov/sites/g/files/wph1946/files/2025-03/03-19-25%20Regular%20Meeting%20Packet_0.pdf",
        "label": "City TOT",
        "secondary": false
      },
      {
        "url": "https://www.discoverlosangeles.com/tmd/latmd-overview",
        "label": "LA Tourism Marketing District (LATMD)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-los-angeles-tax-collections-and-dmo-budget",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles tax & CVB: Collections and DMO budget",
    "body": "Los Angeles — tax & CVB: Collections and DMO budget. LATCB total budget: $62.92M = TMD $33.07M + TOT (1 pt) $23.67M + members $3.31M + TMD reserves $2.12M + LAWA $0.75M · FY2025-26 (preliminary) | Implied total City TOT: ~$331M (arithmetic: $23.67M × 14; before admin costs) · FY2025-26 | City Tourism Dept capital (LACC): ~$13.8M via MICLA · FY2025-26 | Exact City TOT budget/actual line: no public read (not pulled) (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "City of Los Angeles (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://tourism.lacity.gov/sites/g/files/wph1946/files/2025-03/03-19-25%20Regular%20Meeting%20Packet_0.pdf",
        "label": "LATCB total budget",
        "secondary": false
      },
      {
        "url": "https://cityclerk.lacity.org/onlinedocs/2025/25-0600_misc_4_04-22-25.pdf",
        "label": "City Tourism Dept capital (LACC)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-miami-debt-named-hotel-transactions-2025-2026",
    "marketSlug": "miami",
    "kind": "debt",
    "title": "Miami debt & deals: Named hotel transactions 2025–2026",
    "body": "Miami — debt & deals: Named hotel transactions 2025–2026. Mayfair House Hotel & Garden (Coconut Grove): Jun 2026 · Elliott Investment Mgmt affiliate + Lifestyle Hospitality Capital Group (the same pairing as Boston's Godfrey) / Brookfield · $110M all-in (deed/real-estate figure reported as $69M) · 179 · $614,525 (LWHA) · cap not disclosed · 2026-08-05; 2026-06-12; Jun 2026 | Sheraton Miami Airport Hotel (3900 NW 21st St): Jan 2026 · Bridgeton Holdings affiliate / HHM Hotels affiliate · $67.5M · 405 · $166,700 · cap not disclosed. Argentic $59.3M acquisition loan (~88% of price, arithmetic). HHM paid $42.3M in 2015 · 2026-01-28 | Arlo Wynwood (2217 NW Miami Ct): Sep 2026 · Dauntless Capital Partners / Quadrum Global (Eastdil) · ~$65M all-in (deed $44.3M) · 217 · ~$300K all-in (arithmetic) · cap not disclosed. BMO $43M acquisition loan · 2026-09-29 | Corendon South Beach (944 Collins, 97 rooms) + Corendon Beach Plaza (1401 Collins, 95 rooms): reported 2026-10-09 · Corendon Hotels & Resorts / LLC managed by Adam Nadler (Berkadia) · \"over $50M\" · 192 · >$260K (arithmetic) · cap not disclosed · 2026-10-09 | Tony Hotel (801 Collins): ~Sep 2026 · Le Guennec / Debard entity / n/a · $16.5M · 52 · ~$317K (arithmetic) · cap not disclosed · 2026-10-09 | East Miami (Brickell City Centre), context 2025: 2025 · Blackstone / n/a · $147.8M deed (~$300M with FF&E/non-RE per sources) · 352 · ~$420K deed (arithmetic) · cap not disclosed · 2026-01-28. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Hotel Online · The Real Deal · Commercial Observer (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.hotel-online.com/news/lw-hospitality-advisors-lwha-q2midyear-2026-major-us-hotel-sales-survey-lodging-sector-overview",
        "label": "Mayfair House Hotel & Garden (Coconut Grove) — hotel-online.com",
        "secondary": false
      },
      {
        "url": "https://therealdeal.com/miami/2026/06/12/brookfield-sells-mayfair-house-in-miami-for-69-million/",
        "label": "Mayfair House Hotel & Garden (Coconut Grove) — therealdeal.com",
        "secondary": false
      },
      {
        "url": "https://commercialobserver.com/2026/06/paul-singers-elliott-management-miami-coconut-grove-mayfair-house-hotel-garden/",
        "label": "Mayfair House Hotel & Garden (Coconut Grove) — commercialobserver.com",
        "secondary": false
      },
      {
        "url": "https://therealdeal.com/miami/2026/01/28/bridgeton-pays-68-million-for-miami-hotel/",
        "label": "Sheraton Miami Airport Hotel (3900 NW 21st St)",
        "secondary": false
      },
      {
        "url": "https://commercialobserver.com/2026/09/arlo-wynwood-miami-dauntless-capital-partners-quadrum-global/",
        "label": "Arlo Wynwood (2217 NW Miami Ct)",
        "secondary": false
      },
      {
        "url": "https://therealdeal.com/miami/2026/10/09/corendon-hotels-resorts-buys-south-beach-art-deco-hotels/",
        "label": "Corendon South Beach (944 Collins, 97 rooms) + Corendon Beach Plaza (1",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-miami-debt-cmbs-balance-sheet-loans",
    "marketSlug": "miami",
    "kind": "debt",
    "title": "Miami debt & deals: CMBS / balance-sheet loans: distress & maturities",
    "body": "Miami — debt & deals: CMBS / balance-sheet loans: distress & maturities. The Goodtime Hotel (601 Washington Ave, South Beach): $152M CIM loan (originally $164M in 2021) · Matured in 2024 unpaid; forbearance from 2023. $204.7M foreclosure judgment (May 2026); CIM took title by a $100 credit bid at the 2026-07-01 auction · 2026-07-01 · 2026-05-13; 2026-07-01 | Tides Hotel (Miami Beach; closed since Irma): $45M 2014 Ocean Bank loan, sold to Safe Harbor Equity · $95.6M final judgment (Jan 2026); foreclosure auction won by lender Mar 2026; Chetrit appeal pending · 2026-03-11 · 2026-03-11 | Hotel Breakwater (940/960 Ocean Dr, 100 keys): $28.2M CMBS · Third transfer to special servicing after maturity default in Sep 2025; DSCR near or below breakeven · 2025-10-02 · 2025-10-02 | Grand Hyatt Miami Beach (MBCC HQ hotel, 800 keys; under construction): $392M TYKO Capital construction loan (Elliott-backed), plus $75M Miami Beach RDA grant; ~$590M project cost; LTV ~50% per developer · Closed 2025-04-11; opening late 2027 / Nov 2027 · 2025-04-11 · 2025-04-11; Apr 2025 | Named Miami hotel CMBS loan with a 2026–27 maturity in SS: no public read beyond Breakwater (Trepp's free PDFs checked) · 2026-10-11 · 2026-10-11 (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "The Real Deal · Bisnow · PR Newswire · miamibeachfl.gov · Commercial Observer · Hotel Investment Today · Miami Beach Convention Center (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://therealdeal.com/miami/2026/05/13/cim-group-wins-205-million-foreclosure-on-goodtime-hotel/",
        "label": "The Goodtime Hotel (601 Washington Ave, South Beach) — therealdeal.com",
        "secondary": false
      },
      {
        "url": "https://therealdeal.com/miami/2026/07/01/cim-group-takes-goodtime-hotel-in-foreclosure-auction/",
        "label": "The Goodtime Hotel (601 Washington Ave, South Beach) — therealdeal.com",
        "secondary": false
      },
      {
        "url": "https://therealdeal.com/miami/2026/03/11/chetrits-lose-tides-hotel-miami-beach-in-foreclosure-case/",
        "label": "Tides Hotel (Miami Beach; closed since Irma) — therealdeal.com",
        "secondary": false
      },
      {
        "url": "https://www.bisnow.com/news/south-florida/hotel/shuttered-miami-beach-hotel-sells-auction-years-litigation-45m-mortgage-133565",
        "label": "Tides Hotel (Miami Beach; closed since Irma) — bisnow.com",
        "secondary": false
      },
      {
        "url": "https://therealdeal.com/miami/2025/10/02/south-beach-breakwater-hotel-defaults-on-loan/",
        "label": "Hotel Breakwater (940/960 Ocean Dr, 100 keys)",
        "secondary": false
      },
      {
        "url": "https://www.prnewswire.com/news-releases/terra-and-turnberry-to-begin-construction-of-grand-hyatt-miami-beach-with-392-million-in-financing-from-tyko-capital-302426117.html",
        "label": "Grand Hyatt Miami Beach (MBCC HQ hotel, 800 keys; under construction) — prnewswire.com",
        "secondary": false
      },
      {
        "url": "https://www.miamibeachfl.gov/grand-hyatt-miami-beach-reaches-financial-close/",
        "label": "Grand Hyatt Miami Beach (MBCC HQ hotel, 800 keys; under construction) — miamibeachfl.gov",
        "secondary": false
      },
      {
        "url": "https://commercialobserver.com/2025/04/terra-turnberry-miami-beach-convention-center-hotel-grand-hyatt/",
        "label": "Grand Hyatt Miami Beach (MBCC HQ hotel, 800 keys; under construction) — commercialobserver.com",
        "secondary": false
      },
      {
        "url": "https://www.hotelinvestmenttoday.com/Development/Owners/Inside-the-Grand-Hyatt-Miami-Beach-construction-loan",
        "label": "Grand Hyatt Miami Beach (MBCC HQ hotel, 800 keys; under construction) — hotelinvestmenttoday.com",
        "secondary": false
      },
      {
        "url": "https://www.miamibeachconvention.com/center-info/grand-hyatt-miami-beach",
        "label": "Grand Hyatt Miami Beach (MBCC HQ hotel, 800 keys; under construction) — miamibeachconvention.com",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-miami-debt-market-level-reads",
    "marketSlug": "miami",
    "kind": "debt",
    "title": "Miami debt & deals: Market-level reads",
    "body": "Miami — debt & deals: Market-level reads. Host Hotels Miami comparable RevPAR, Q3-2025: +5.6% YoY · 2025-11-05 | Miami-Dade Aug 2026 occupancy: 63.6% (−7.6% YoY) after an all-rate Cup lift · Sep 2026 | Miami-Dade ADR (period cited by CO): $293.7 (+11.2%); occupancy −0.1% · 2026-09-29 | Cup peak-period ADR: +51.1% to $267.87 at flat 73.5% occupancy (secondary) · 2026 | Disclosed Miami transaction cap rate: no public read · 2026-10-11 (source: no public read) | Miami lodging CMBS DQ cut: no public read · 2026-10-11 (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Host Hotels & Resorts · Miami Business · Commercial Observer · hectocorngroup.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.hosthotels.com/Press-Releases/2025/PressRelease_27676",
        "label": "Host Hotels Miami comparable RevPAR, Q3-2025",
        "secondary": false
      },
      {
        "url": "https://miamibusiness.com/miami-hospitality-industry-report-august-2026/",
        "label": "Miami-Dade Aug 2026 occupancy",
        "secondary": false
      },
      {
        "url": "https://commercialobserver.com/2026/09/arlo-wynwood-miami-dauntless-capital-partners-quadrum-global/",
        "label": "Miami-Dade ADR (period cited by CO)",
        "secondary": false
      },
      {
        "url": "https://hectocorngroup.com/96m-hotel-development-finance-miami-beach/",
        "label": "Cup peak-period ADR",
        "secondary": true
      }
    ]
  },
  {
    "id": "w1c-miami-tax-lodging-tax-stack",
    "marketSlug": "miami",
    "kind": "tax",
    "title": "Miami tax & CVB: Lodging tax stack",
    "body": "Miami — tax & CVB: Lodging tax stack. FL state sales tax: 6% · 6% · accessed 2026-10-11 | Miami-Dade discretionary surtax: 1% · 1% · eff. 2026-01-01 | Convention Development Tax (CDT): 3% · 3% · accessed 2026-10-11; FY2025-26 | Tourist Development Tax (TDT): 2% · — (excluded) · same | Professional Sports Franchise Facilities Tax: 1% · — (excluded) · same | Miami Beach Resort Tax (rooms): 4% · accessed 2026-10-11 | Total: 13% (arithmetic) · 14% (arithmetic) · 2026-10-11. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "7 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Miami-Dade County · thesalestaxlawyer.com · floridasalestax.com · floridarevenue.com · miamibeachfl.gov (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.miamidade.gov/global/service.page?Mduid_service=ser1499797928395868",
        "label": "FL state sales tax",
        "secondary": false
      },
      {
        "url": "https://www.thesalestaxlawyer.com/documents/Discretionary-Sales-Surtax-Information.pdf",
        "label": "Miami-Dade discretionary surtax — thesalestaxlawyer.com",
        "secondary": true
      },
      {
        "url": "https://www.floridasalestax.com/florida-tax-law-blog/2026/august/florida-county-surtax-rates-for-2026-the-complet/",
        "label": "Miami-Dade discretionary surtax — floridasalestax.com",
        "secondary": true
      },
      {
        "url": "https://floridarevenue.com/Forms_library/current/dr15dss_26.pdf",
        "label": "Miami-Dade discretionary surtax — floridarevenue.com",
        "secondary": true
      },
      {
        "url": "https://www.miamidade.gov/resources/budget/adopted/fy2025-26/appendix-n.pdf",
        "label": "Convention Development Tax (CDT)",
        "secondary": false
      },
      {
        "url": "https://www.miamibeachfl.gov/city-hall/finance/filepay-resort-tax/",
        "label": "Miami Beach Resort Tax (rooms)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-miami-tax-collections-dmo-funding",
    "marketSlug": "miami",
    "kind": "tax",
    "title": "Miami tax & CVB: Collections & DMO funding",
    "body": "Miami — tax & CVB: Collections & DMO funding. County 2% TDT (lodging): FY24 actual $47.945M; FY25 projected $48.978M; FY26 estimate $47.693M (budgeted at 95%) · FY2024–26 · FY2025-26 adopted | County 3% CDT: FY24 actual $126.178M; FY25 projected $128.423M; FY26 estimate $125.052M · FY2024–26 · same | County 1% Pro Sports tax: FY26 estimate $23.846M (debt service) · FY2026 · same | County 2% hotel F&B surtax: FY26 estimate $10.938M · FY2026 · same | TDT split: 60% less $1.35M to GMCVB; 20% Cultural Affairs; 20% City of Miami facilities; $1.325M TDC grants. CDT: 2/3 to the largest convention center, then county facilities; 1/3 to the most populous city · standing · same | GMCVB budget FY2025-26: Net revenue $49.55M; total expenses $58.01M. Public revenue: county TDT $27.95M, county F&B $11.32M, Miami Beach resort tax $7.08M, Miami Beach incentive $2.0M = $48.35M · FY2025-26 budget · 2026 | GMCVB FY2025 actual public revenue: $47.04M (TDT $27.00M; Miami Beach resort tax $9.10M; F&B $10.94M); total revenue $52.30M · FYE 2025-09-30 · 2026 | Miami Beach resort tax, total city collections: no public read (not pulled) · 2026-10-11 (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "8 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Miami-Dade County · Greater Miami CVB (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.miamidade.gov/resources/budget/adopted/fy2025-26/appendix-n.pdf",
        "label": "County 2% TDT (lodging)",
        "secondary": false
      },
      {
        "url": "https://www.miamidade.gov/global/service.page?Mduid_service=ser1499797928395868",
        "label": "TDT split",
        "secondary": false
      },
      {
        "url": "https://www.miamiandbeaches.com/getmedia/cc72ce01-0ca0-463d-9ea3-2f41f2feba48/GMCVB_Visit_Florida_Partner_Financial_Reporting_2026.pdf",
        "label": "GMCVB budget FY2025-26",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-nashville-debt-named-hotel-transactions-2025-2026",
    "marketSlug": "nashville",
    "kind": "debt",
    "title": "Nashville debt & deals: Named hotel transactions 2025–2026",
    "body": "Nashville — debt & deals: Named hotel transactions 2025–2026. Margaritaville Hotel Nashville (SoBro, opened 2019): recorded 2026-03-23 · EPR Properties (EPR Lodging LLC) / n/a · $70.0M · keys: no public read in the free text · n/a · cap not disclosed | Motto by Hilton Nashville Downtown (new build, take-out contract): Dec 2025 (announced 2025-12-22) · Apple Hospitality REIT (APLE) / developer · ~$98.2M · 260 · ~$378K · cap not disclosed | Embassy Suites Nashville at Vanderbilt: Apr 2025 · Reade Hotel Capital + Westport Capital JV / n/a · $57.5M · 208 · ~$276K · cap not disclosed. Mesa West first mortgage $45.36M (~79% of price, arithmetic) incl. capex funding | TownePlace Suites Nashville Midtown: 2025 · Bradford Allen / n/a · undisclosed · 193 · n/a · cap not disclosed. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Hotel Management · nasdaq.com · nashvillepost.com · Hotel Business · rebusinessonline.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.hotelmanagement.net/transactions/apple-hospitality-acquires-opens-tennessee-motto-98m",
        "label": "Motto by Hilton Nashville Downtown (new build, take-out contract) — hotelmanagement.net",
        "secondary": false
      },
      {
        "url": "https://www.nasdaq.com/press-release/apple-hospitality-reit-acquires-motto-hilton-nashville-downtown-2025-12-22",
        "label": "Motto by Hilton Nashville Downtown (new build, take-out contract) — nasdaq.com",
        "secondary": false
      },
      {
        "url": "https://www.nashvillepost.com/business/development/midtown-embassy-suites-property-sells-for-57-5m/article_d700bb71-b20f-463f-9238-019653417fb7.html",
        "label": "Embassy Suites Nashville at Vanderbilt — nashvillepost.com",
        "secondary": false
      },
      {
        "url": "https://hotelbusiness.com/embassy-suites-by-hilton-nashville-at-vanderbilt-acquired/",
        "label": "Embassy Suites Nashville at Vanderbilt — hotelbusiness.com",
        "secondary": false
      },
      {
        "url": "https://rebusinessonline.com/bradford-allen-acquires-193-room-towneplace-suites-hotel-in-nashville/",
        "label": "TownePlace Suites Nashville Midtown",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-nashville-debt-cmbs-sasb-balance-sheet-loans",
    "marketSlug": "nashville",
    "kind": "debt",
    "title": "Nashville debt & deals: CMBS / SASB / balance-sheet loans",
    "body": "Nashville — debt & deals: CMBS / SASB / balance-sheet loans. Renaissance Nashville (673–674 keys; Ashford Trust): $267.2M BAMLL 2024-NASH (SOFR+3.98%, 2+1+1+1) refinanced to $218.1M (SOFR+2.26%; final maturity Sep 2030) · Refinanced, with a ~$49M paydown funded by $53.0M more preferred equity at 11.14% · 2025-09-15 | Grand Hyatt Nashville (591 keys, Nashville Yards): $270.0M SWVP 2026-GRAND SASB, floating SOFR+2.150% WA spread, 2-yr IO + three 1-yr extensions (initial maturity ~2028) · New issue. Refinanced construction debt and returned equity. T12 Apr-2026 RevPAR $246.27; DBRS stabilized RevPAR $241.41 · 2026-07-23 | Unnamed \"recently upgraded Nashville hotel\": seeking $240M mortgage to pay off debt held in 4 conduit CMBS deals · Refi in market (maturity not public) · 2026-10-09 | Nashville hotel loan in SS/DQ/foreclosure in 2026: no public read (Trepp's free monthly PDFs, Jan–Sep 2026, name none). Last named: Ritz-Carlton Nashville construction loan foreclosure, Apr 2024 (pre-window) · checked 2026-10-11. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "SEC EDGAR · Morningstar DBRS · greenstreetnews.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sec.gov/Archives/edgar/data/1232582/000123258225000144/ahtnashvillerefi9-25pr.htm",
        "label": "Renaissance Nashville (673–674 keys; Ashford Trust) — sec.gov",
        "secondary": false
      },
      {
        "url": "https://dbrs.morningstar.com/research/433374/",
        "label": "Renaissance Nashville (673–674 keys; Ashford Trust) — dbrs.morningstar.com",
        "secondary": false
      },
      {
        "url": "https://dbrs.morningstar.com/research/485973/morningstar-dbrs-assigns-provisional-credit-ratings-to-swvp-trust-2026-grand",
        "label": "Grand Hyatt Nashville (591 keys, Nashville Yards)",
        "secondary": false
      },
      {
        "url": "https://greenstreetnews.com/article/owner-of-recently-upgraded-nashville-hotel-seeks-new-loan/",
        "label": "Unnamed \"recently upgraded Nashville hotel\"",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-nashville-tax-lodging-tax-stack",
    "marketSlug": "nashville",
    "kind": "tax",
    "title": "Nashville tax & CVB: Lodging tax stack (Davidson County / Metro Nashville)",
    "body": "Nashville — tax & CVB: Lodging tax stack (Davidson County / Metro Nashville). Tennessee state sales tax: 7.00% · FY2025 | Davidson local-option sales tax (2.25% + 0.5% transit surcharge eff. 2025-02-01): 2.75% · FY2025 | Metro hotel occupancy tax (6% + 1% added 2023-07-01, tied to the new enclosed Titans stadium bonds): 7.00% · 2023-06-14 | Metro per-room-night fee: $2.50 · 2023-06-14 | Total: 16.75% + $2.50/night (was 15.25% + $2.50 before Feb 2025, and before that 6% HOT) · 2026-10-11 (arithmetic) | TDZ (Tourist Development Zone): sales-tax increment capture for the Music City Center. Not a guest-facing rate · accessed 2026-10-11. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Metro Nashville (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.nashville.gov/sites/default/files/2026-05/FY25_RevenueManual_final.pdf",
        "label": "Tennessee state sales tax",
        "secondary": false
      },
      {
        "url": "https://www.nashville.gov/departments/finance/news/increase-hotel-occupancy-tax-metropolitan-nashville-davidson-county",
        "label": "Metro hotel occupancy tax (6% + 1% added 2023-07-01, tied to the new e",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-nashville-tax-collections-and-dmo-budget",
    "marketSlug": "nashville",
    "kind": "tax",
    "title": "Nashville tax & CVB: Collections and DMO budget",
    "body": "Nashville — tax & CVB: Collections and DMO budget. Metro total hotel tax collections: ~$152M · FY2025 · 2025-09-11 | Hotel Occupancy Tax (object 403207): $127.47M actual / $114.57M budget · FY2024 / FY2025 · FY2025 | Short-term-rental occupancy tax: $27.34M actual · FY2024 · FY2024 (period) | HOT share dedicated to tourism promotion: $44.08M · FY2025 · FY2025 (period) | NCVC (Visit Music City) Metro contract charged (reimbursement) / total revenue: $35.61M / ~$46M (incl. ~$10M other sources) · FY2025 · FY2025 (period) | Flows: Statutory uses: TDZ activities, NCVC, Music City Center operations, General Fund, stadium construction/operations · accessed 2026-10-11. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Metro Nashville (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.nashville.gov/sites/default/files/2025-11/Metro-Tourism-and-Convention-Commission-Meeting-Minutes---09112025.pdf",
        "label": "Metro total hotel tax collections",
        "secondary": false
      },
      {
        "url": "https://www.nashville.gov/sites/default/files/2026-05/FY25_RevenueManual_final.pdf",
        "label": "Hotel Occupancy Tax (object 403207)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-new-york-city-debt-named-hotel-transactions-2025-2026",
    "marketSlug": "new-york-city",
    "kind": "debt",
    "title": "New York City debt & deals: Named hotel transactions 2025–2026",
    "body": "New York City — debt & deals: Named hotel transactions 2025–2026. The Ritz-Carlton New York, Central Park (50 Central Park South): Feb 2026 (deed public 2026-02-18) · Gencom / Westbrook Partners (LWHA also lists KIC) · $321.1M (LWHA). TRD: ~$320M all-in. Deed: $269.7M real estate only · 253 · ~$1.27M (arithmetic on $321.1M) · cap not disclosed. Banco Inbursa $235M acquisition loan (~73% of $321.1M, arithmetic) · 2026-05-13; 2026-02-18; Feb 2026; Feb 2026 | INNSiDE New York NoMad: Q2 2026 · Meliá Hotels / Artimus · $203M · 313 · ~$649K (arithmetic) · cap not disclosed · 2026-08-05 | InterContinental New York Times Square: Dec 2025 · Gencom + Highgate + Argent Ventures / Tishman Realty & MetLife IM · $230M (reported) · 607 · ~$379K · cap not disclosed · Dec 2025; Feb 2026 | Thompson Central Park New York (context, pre-window): Sep 2024 · Gencom / Elliott Mgmt & GFI Hospitality · $300–310M (reported) · 588 (CO) / 587 (LWHA) · ~$510–527K (arithmetic) · cap not disclosed · Feb 2026. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Hotel Online · The Real Deal · Commercial Observer · Hotel Investment Today · hotelsmag.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.hotel-online.com/news/q1-2026-major-us-hotel-sales-survey-lodging-sector-overview",
        "label": "The Ritz-Carlton New York, Central Park (50 Central Park South) — hotel-online.com",
        "secondary": false
      },
      {
        "url": "https://therealdeal.com/new-york/2026/02/18/gencom-pays-320m-for-ritz-carlton-central-park-south/",
        "label": "The Ritz-Carlton New York, Central Park (50 Central Park South) — therealdeal.com",
        "secondary": false
      },
      {
        "url": "https://commercialobserver.com/2026/02/gencom-buys-nyc-ritz-carlton-hotel-westbrook/",
        "label": "The Ritz-Carlton New York, Central Park (50 Central Park South) — commercialobserver.com",
        "secondary": false
      },
      {
        "url": "https://www.hotelinvestmenttoday.com/Deals/Mergers-and-Acquistions/Price-of-Gencom-NYC-deal-another-PMG-tower-in-Miami-new-COO-at-Park-Hotels",
        "label": "The Ritz-Carlton New York, Central Park (50 Central Park South) — hotelinvestmenttoday.com",
        "secondary": false
      },
      {
        "url": "https://www.hotel-online.com/news/lw-hospitality-advisors-lwha-q2midyear-2026-major-us-hotel-sales-survey-lodging-sector-overview",
        "label": "INNSiDE New York NoMad",
        "secondary": false
      },
      {
        "url": "https://hotelsmag.com/news/intercontinental-ny-times-square-acquisition/",
        "label": "InterContinental New York Times Square",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-new-york-city-debt-cmbs-sasb-loans",
    "marketSlug": "new-york-city",
    "kind": "debt",
    "title": "New York City debt & deals: CMBS / SASB loans",
    "body": "New York City — debt & deals: CMBS / SASB loans. 20 Times Square ground-lease loan (99-yr ground lease on a 16,066 sf parcel; the hotel/retail tower improvements are excluded from the collateral): balance not captured in the free PDF text: no public read · Largest transfer to special servicing in May 2026, after failing to pay off at fully extended maturity. Now a nonperforming matured balloon and newly DQ in May. Pre-negotiation agreement executed. Complex modification in late 2023. 1Q–3Q 2025 DSCR (NCF) 4.06x · May 2026 remittance · May 2026 | Holiday Inn FiDi: n/a · Returned from special servicing (resolution in Jun 2026) · Jun 2026 · Jun 2026 | Hyatt Regency Jersey City (NY/NJ host submarket; 351 keys): $100M (CGCMT 2016-P5 / 2016-P6 / CMBX.10) · Sent to special servicing for imminent maturity default (Oct 2026 maturity). NCF met underwriting only in 2016. Negative cash flow in 2024; 2025 NCF 68% below underwriting. Morningstar expects an extension or forbearance. Taconic/HEI bought it for $117M in Dec 2022 · 2026-09-15 · 2026-09-15; Sep 2026 | 2 Washington St (former Sonder short-term-rental master lease; hotel-adjacent, not a hotel): $131.5M (BMARK 2021-B28/B29, 3650R 2021-PF1) · SS for cash-flow issues after Sonder's Nov 2025 bankruptcy. Matures 2031-08-06 · Jun 2026 · Jun 2026 | Named Manhattan full-service hotel CMBS loan with a 2026–27 maturity in SS/DQ/foreclosure: no public read beyond the items above (free sources checked 2026-10-11) · 2026-10-11 (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Trepp · Commercial Observer · jerseydigs.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.trepp.com/hubfs/Trepp%20CMBS%20Special%20Servicing%20Report%20June%202026.pdf",
        "label": "Holiday Inn FiDi",
        "secondary": false
      },
      {
        "url": "https://commercialobserver.com/2026/09/cmbs-loan-hyatt-regency-jersey-city-special-servicing/",
        "label": "Hyatt Regency Jersey City (NY/NJ host submarket; 351 keys) — commercialobserver.com",
        "secondary": false
      },
      {
        "url": "https://jerseydigs.com/hyatt-regency-jersey-city-loan-default/",
        "label": "Hyatt Regency Jersey City (NY/NJ host submarket; 351 keys) — jerseydigs.com",
        "secondary": false
      },
      {
        "url": "https://commercialobserver.com/2026/06/cmbs-loan-moinian-groups-2-washington-street-special-servicing/",
        "label": "2 Washington St (former Sonder short-term-rental master lease; hotel-a",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-new-york-city-debt-market-level-reads",
    "marketSlug": "new-york-city",
    "kind": "debt",
    "title": "New York City debt & deals: Market-level reads",
    "body": "New York City — debt & deals: Market-level reads. Host Hotels NYC comparable RevPAR, Q3-2025: +7.4% YoY · 2025-11-05 | NYC hotel occupancy-tax collections FY2025: $770M (+23.1% vs FY2019); total city tax from the hotel industry $2.4B · Jul 2026 | New rooms projected to open in 2026: 4,852 (most in the US; Phoenix 3,650) · 2026 projection, accessed 2026-10-11 | NYC IWA (HTC/HANYC) expiry: 2026-06-30, renewed to 2034-06-30 · 2026-05-21 ratification; 2026-05-13 | Manhattan transaction cap rate (public): no public read (no deal above disclosed a cap) · 2026-10-11 (source: no public read) | NYC lodging CMBS DQ rate cut: no public read (Trepp's free reports give national lodging only) · 2026-10-11 (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Host Hotels & Resorts · NY State Comptroller · CoStar · Hotel Investment Today · htc-hotel-workers-production.s3.us-east-1.amazonaws.com · Hotel Online (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.hosthotels.com/Press-Releases/2025/PressRelease_27676",
        "label": "Host Hotels NYC comparable RevPAR, Q3-2025",
        "secondary": false
      },
      {
        "url": "https://www.osc.ny.gov/files/reports/osdc/2026/pdf/nyc-hotel-industry-report-july-2026.pdf",
        "label": "NYC hotel occupancy-tax collections FY2025",
        "secondary": false
      },
      {
        "url": "https://www.costar.com/products/str-benchmark/resources/press-releases/nyc-phoenix-projected-open-most-hotel-rooms-2026",
        "label": "New rooms projected to open in 2026 — costar.com",
        "secondary": false
      },
      {
        "url": "https://www.hotelinvestmenttoday.com/Forecasts/NYC-leads-projections-for-new-US-hotels-in-2026",
        "label": "New rooms projected to open in 2026 — hotelinvestmenttoday.com",
        "secondary": false
      },
      {
        "url": "https://htc-hotel-workers-production.s3.us-east-1.amazonaws.com/assets2/Files/2026-IWA-MOU-English.pdf",
        "label": "NYC IWA (HTC/HANYC) expiry — htc-hotel-workers-production.s3.us-east-1.amazonaws.com",
        "secondary": false
      },
      {
        "url": "https://www.hotel-online.com/news/q1-2026-major-us-hotel-sales-survey-lodging-sector-overview",
        "label": "NYC IWA (HTC/HANYC) expiry — hotel-online.com",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-new-york-city-tax-lodging-tax-stack",
    "marketSlug": "new-york-city",
    "kind": "tax",
    "title": "New York City tax & CVB: Lodging tax stack (room ≥$40/night)",
    "body": "New York City — tax & CVB: Lodging tax stack (room ≥$40/night). NYS sales tax: 4.0% · NYS DTF · Feb 2026 | NYC local sales tax: 4.5% · NYS DTF · Feb 2026 | MCTD surcharge: 0.375% · NYS DTF · Feb 2026 | NYC hotel room occupancy tax: 5.875% + $2.00/room/night · NYC Dept of Finance · accessed 2026-10-11 | NYS hotel unit fee (Convention Center Hotel Unit Fee): $1.50/unit/night · NYS DTF · 2025; Feb 2026 | Total: 14.75% + $3.50/room/night (arithmetic: 8.875 + 5.875) · 2026-10-11. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "tax.ny.gov · NYC government (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.tax.ny.gov/pdf/2026/st/st810_5_1226.pdf",
        "label": "NYS sales tax",
        "secondary": false
      },
      {
        "url": "https://www.nyc.gov/site/finance/business/business-hotel-room-occupancy-tax.page",
        "label": "NYC hotel room occupancy tax — nyc.gov",
        "secondary": false
      },
      {
        "url": "https://portal.311.nyc.gov/article/?kanumber=KA-02794",
        "label": "NYC hotel room occupancy tax — portal.311.nyc.gov",
        "secondary": false
      },
      {
        "url": "https://home4.nyc.gov/assets/finance/downloads/pdf/25pdf/business_tax_forms/nyc-htx_2025.pdf",
        "label": "NYS hotel unit fee (Convention Center Hotel Unit Fee)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-new-york-city-tax-collections-dmo-funding",
    "marketSlug": "new-york-city",
    "kind": "tax",
    "title": "New York City tax & CVB: Collections & DMO funding",
    "body": "New York City — tax & CVB: Collections & DMO funding. Hotel room occupancy tax, actual: $770M · FY2025 · Jul 2026 | Hotel tax, OMB adopted plan: FY25 $785M / FY26 $811M / FY27 $811M / FY28 $838M / FY29 $866M · Adopted FY2026 plan · Jun 2025 | City sales tax from hotels (OSC estimate): $479M · FY2025 · Jul 2026 | NYC Tourism + Conventions, city baseline: $22.7M (flat since 2006; FY27 request $35M) · FY27 baseline · 2026 (FY27 budget cycle) | NYC T+C SBS marketing contract: $94.6M award ($99.1M current value), 2022-07-01 to 2026-06-30 · FY23–FY26 · accessed 2026-10-11 | Split of hotel tax to the DMO: None dedicated. Hotel tax goes to the General Fund and NYC T+C is funded by city contract. Total NYC T+C budget (all sources): no public read · 2026-10-11. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "NY State Comptroller · NYC government · qgazette.com · databook.nyc (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.osc.ny.gov/files/reports/osdc/2026/pdf/nyc-hotel-industry-report-july-2026.pdf",
        "label": "Hotel room occupancy tax, actual",
        "secondary": false
      },
      {
        "url": "https://www.nyc.gov/assets/omb/downloads/pdf/adopt25/adopt25-rfpd.pdf",
        "label": "Hotel tax, OMB adopted plan",
        "secondary": false
      },
      {
        "url": "https://www.qgazette.com/articles/increase-funding-for-tourism-promotion/",
        "label": "NYC Tourism + Conventions, city baseline",
        "secondary": false
      },
      {
        "url": "https://www.databook.nyc/procurement/contract/4660724",
        "label": "NYC T+C SBS marketing contract",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-phoenix-debt-named-hotel-transactions-2025-2026",
    "marketSlug": "phoenix",
    "kind": "debt",
    "title": "Phoenix debt & deals: Named hotel transactions 2025–2026",
    "body": "Phoenix — debt & deals: Named hotel transactions 2025–2026. Four Seasons Resort Scottsdale at Troon North: PSA 2026-09-23; close expected 2026-10-22 · Evergreen Acquisitions LLC / Braemar (BHR) · $372.0M · ~210 · $1.8M (BHR) · 6.2% on TTM-Aug-2026 NOI, incl. $23M expected capex | Fairmont Scottsdale Princess: reported 2026-10-08 · San Manuel Investment Authority / seller not named in the cited piece · $241.4M (hotel portion, per records) · 750 · $322K · cap not disclosed | JW Marriott Phoenix Desert Ridge Resort & Spa: closed 2025-06-10 · Ryman Hospitality (RHP) / Trinity Investments (Elliott-backed) · ~$865M · 950 · ~$911K (arithmetic) · cap not disclosed. Seller bought it for $602M in 2019 and spent ~$100M on renovation | Sheraton Phoenix Downtown: Nov 2025 · Brookfield / Blackstone · undisclosed · 1,003 · n/a · cap not disclosed. Blackstone paid $268M in 2020 | DoubleTree Phoenix Tempe: 2026-01-07 · not named in public excerpt · $27.5M · 270 · ~$102K (arithmetic) · cap not disclosed | Vīb Hotel by Best Western Phoenix-Tempe: 2026-01-22 · Opal Hospitality / n/a · $17.0M · 102 · ~$167K (arithmetic) · cap not disclosed | 5 Sonesta hotels (incl. Sonesta Select Tempe Downtown, Phoenix Chandler): Dec 2025 · Hospitality Capital Partners + National Property Advisors / Sonesta · $72M · 665 · ~$108K (arithmetic) · cap not disclosed | Sheraton Mesa + Courtyard Mesa: Feb 2025 · HSL Properties / n/a · $50.25M (2 hotels) · keys: no public read · n/a · cap not disclosed. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "8 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "stocktitan.net · Hotel Management · The Real Deal · SEC EDGAR · Business Wire · Hotel Dive · Arizona Republic · Lodging Development · yourvalley.net (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.stocktitan.net/sec-filings/BHR/8-k-braemar-hotels-resorts-inc-reports-material-event-be64f4004d56.html",
        "label": "Four Seasons Resort Scottsdale at Troon North — stocktitan.net",
        "secondary": false
      },
      {
        "url": "https://www.hotelmanagement.net/transactions/braemar-sell-arizona-four-seasons-372m",
        "label": "Four Seasons Resort Scottsdale at Troon North — hotelmanagement.net",
        "secondary": false
      },
      {
        "url": "https://therealdeal.com/national/phoenix/2026/10/08/fairmont-scottsdale-princess-hotel-sells-to-native-tribe/",
        "label": "Fairmont Scottsdale Princess",
        "secondary": false
      },
      {
        "url": "https://www.sec.gov/Archives/edgar/data/1040829/000110465925058162/tm2517566d1_8k.htm",
        "label": "JW Marriott Phoenix Desert Ridge Resort & Spa — sec.gov",
        "secondary": false
      },
      {
        "url": "https://www.businesswire.com/news/home/20250519761096/en/",
        "label": "JW Marriott Phoenix Desert Ridge Resort & Spa — businesswire.com",
        "secondary": false
      },
      {
        "url": "https://www.hoteldive.com/news/brookfield-acquires-sheraton-phoenix-downtown/805884/",
        "label": "Sheraton Phoenix Downtown — hoteldive.com",
        "secondary": false
      },
      {
        "url": "http://amp.azcentral.com/story/news/local/phoenix/2025/11/17/new-york-firm-buys-sheraton-phoenix-downtown/87326770007/",
        "label": "Sheraton Phoenix Downtown — amp.azcentral.com",
        "secondary": false
      },
      {
        "url": "https://www.lodgingdevelopment.com/hotel-development/arizona",
        "label": "DoubleTree Phoenix Tempe",
        "secondary": false
      },
      {
        "url": "https://www.yourvalley.net/tempe-independent/stories/phoenix-group-pays-72m-for-five-arizona-hotels",
        "label": "5 Sonesta hotels (incl. Sonesta Select Tempe Downtown, Phoenix Chandle",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-phoenix-debt-cmbs-sasb-loans",
    "marketSlug": "phoenix",
    "kind": "debt",
    "title": "Phoenix debt & deals: CMBS / SASB loans (2026–2027 maturities, SS, DQ, foreclosure, mods)",
    "body": "Phoenix — debt & deals: CMBS / SASB loans (2026–2027 maturities, SS, DQ, foreclosure, mods). Phoenix hotel CMBS cohort (unnamed): n/a · 11 hotel CMBS loans mature within 2 years; 9 properties identified as at-risk · 2026-05-06 | Named Phoenix-MSA hotel loan in SS/DQ in 2026: no public read: free sources (TreppTalk, KBRA/Fitch releases, CRE Direct headlines) show no Phoenix hotel loan named in 2026 SS/DQ/foreclosure. The last named one found is legacy (Phoenix Airport Marriott, $61.9M, BACM 2006-3, SS 2015–16) · checked 2026-10-11 | Four Seasons Scottsdale debt: no public read on existing loan payoff. The sale feeds BHR's Ashford separation fees · 2026-10. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Cornovus Capital (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://cornovuscapital.com/southwest-hospitality-market-report-q1-2026/",
        "label": "Phoenix hotel CMBS cohort (unnamed)",
        "secondary": true
      }
    ]
  },
  {
    "id": "w1c-phoenix-tax-lodging-tax-stack",
    "marketSlug": "phoenix",
    "kind": "tax",
    "title": "Phoenix tax & CVB: Lodging tax stack (stays of ≤29 nights)",
    "body": "Phoenix — tax & CVB: Lodging tax stack (stays of ≤29 nights). Arizona state TPT (transient lodging): 5.5% · eff. 2026-01-01 | Maricopa County (general excise + hotel; includes the 1% AzSTA bed tax from Prop 302): 1.77% · Nov 2025 | City of Phoenix TPT (2.8%, raised from 2.3% in 2025) + city transient lodging tax (3.0%): 5.8% · Nov 2025 | Total, City of Phoenix: 13.07% (was 12.57% under the Jan-2025 chart) · accessed 2026-10-11 | Scottsdale: city transient occupancy tax 5% (plus city TPT; Scottsdale all-in total: no public read) · FY25 | TIA (Tourism Improvement Area): none yet. HB 2950, signed June 2026, allows opt-in TIAs with assessments up to 5% per occupied room night. Visit Phoenix plans to form the first one · 2026-06-26. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "City of Phoenix · azauditor.gov · Visit Phoenix · Hoodline (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.phoenix.gov/content/dam/phoenix/financesite/documents/privilege-use-tax/Combined-Tax-Rate-Chart-0126.pdf",
        "label": "Arizona state TPT (transient lodging)",
        "secondary": false
      },
      {
        "url": "https://www.azauditor.gov/sites/default/files/2025-11/25-117.pdf",
        "label": "Maricopa County (general excise + hotel; includes the 1% AzSTA bed tax",
        "secondary": false
      },
      {
        "url": "https://www.phoenix.gov/content/dam/phoenix/financesite/documents/privilege-use-tax/Combined-Tax-Rate-Chart-0125.pdf",
        "label": "Total, City of Phoenix",
        "secondary": false
      },
      {
        "url": "https://www.visitphoenix.com/tourism-improvement-area/",
        "label": "TIA (Tourism Improvement Area) — visitphoenix.com",
        "secondary": false
      },
      {
        "url": "https://hoodline.com/2026/06/phoenix-hotels-win-power-to-add-tourist-surcharge-for-marketing-blitz/",
        "label": "TIA (Tourism Improvement Area) — hoodline.com",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-phoenix-tax-collections-cvb-budget-and-flows",
    "marketSlug": "phoenix",
    "kind": "tax",
    "title": "Phoenix tax & CVB: Collections, CVB budget, and flows",
    "body": "Phoenix — tax & CVB: Collections, CVB budget, and flows. Phoenix Convention Center fund, \"City Taxes and Related Fees\" (designated TPT shares incl. hotel/motel; not hotel-only): $85.05M actual / $94.19M est. / $96.76M budget · FY24-25 / FY25-26 / FY26-27 · FY24-25 / FY25-26 / FY26-27 (period) | Phoenix Sports Facilities, Bioscience & Tourism fund (designated hotel/motel + car-rental tax share; pays city share of downtown arena debt): $29.97M / $29.94M / $30.58M · same · same (period) | AzSTA 1% Maricopa County hotel bed tax (stadium/tourism; expires 2031): $28.47M · FY2025 · Nov 2025 | Scottsdale Tourism Fund (5% bed tax): $34.60M actual / $33.81M forecast / $33.0M proposed · FY23/24 / FY24/25 / FY25/26 · FY2025-26 | Visit Phoenix revenue: $25.8M (87% public, $22.4M; 13% private, $3.4M) · FY25/26 · FY25/26 (period) | City of Phoenix Tourism & Hospitality Advisory Board contract with Visit Phoenix: up to $590K/yr, from the SFBT fund · 5-yr from FY24-25 · 5-yr from FY24-25 (period) | Experience Scottsdale share of the bed tax: no public read (a third-party summary cites a %, but the contract was not found) · 2026-10-11 (checked) (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "7 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "City of Phoenix · azauditor.gov · scottsdaleaz.gov · simpleviewinc.com · phoenix.legistar.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.phoenix.gov/content/dam/phoenix/budgetsite/budget-books/2026-27-Detail-Budget.pdf",
        "label": "Phoenix Convention Center fund, \"City Taxes and Related Fees\" (designa",
        "secondary": false
      },
      {
        "url": "https://www.azauditor.gov/sites/default/files/2025-11/25-117.pdf",
        "label": "AzSTA 1% Maricopa County hotel bed tax (stadium/tourism; expires 2031)",
        "secondary": false
      },
      {
        "url": "https://www.scottsdaleaz.gov/docs/default-source/scottsdaleaz/finance/budget-reports/fy2025-26/b-revenue-and-five-year-forecast.pdf",
        "label": "Scottsdale Tourism Fund (5% bed tax)",
        "secondary": false
      },
      {
        "url": "https://assets.simpleviewinc.com/simpleview/image/upload/v1/clients/phoenix/SV_08449394_compressed_ec37a28f-3d6e-4138-b9b2-24b8b6b0d425.pdf",
        "label": "Visit Phoenix revenue",
        "secondary": false
      },
      {
        "url": "https://phoenix.legistar.com/ViewReport.ashx?G=3F9B5896-D56F-4AD3-85AD-A8E5E58DD74C&GID=485&GUID=LATEST&ID=30129&M=R&N=TextL5&Title=City+Council+Report+%28pdf%29",
        "label": "City of Phoenix Tourism & Hospitality Advisory Board contract with Vis",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-san-diego-debt-named-hotel-transactions-2025-2026",
    "marketSlug": "san-diego",
    "kind": "debt",
    "title": "San Diego debt & deals: Named hotel transactions 2025–2026",
    "body": "San Diego — debt & deals: Named hotel transactions 2025–2026. Pendry San Diego (Gaslamp), leasehold (99-yr ground lease from 2012): recorded Jul 2026; reported 2026-08-07 · 5J Hospitality LLC (controlled by Montage International) / RGC Gaslamp LLC (Robert Green Co.-managed; Kloiber family, Montage partners) · $147.0M (declared consideration; $161,700 documentary transfer tax) · 317 · ~$464K (arithmetic) · cap not disclosed. A partner buyout at a declared price, not a marketed sale | Embassy Suites by Hilton San Diego La Jolla (UTC): closed 2025-12-05; JLL release 2026-01-07 · Ascendant Capital Partners (with Highgate) / BioMed Realty · $111.0M · 340 · ~$326K (arithmetic) · cap not disclosed. Price was \"slightly more than half\" of BioMed's purchase four years earlier. It was the largest San Diego County hotel sale of 2025 | Sheraton San Diego Mission Valley: closed 2026-06-09 · Hotel Circle Holdings / Ashford Hospitality Trust (AHT) · ~$45.25M gross ($45.0M net of selling costs). AHT paid $35.9M to the lender on a 15-hotel pool loan · 260 · ~$174K (arithmetic) · cap not disclosed (8-K pro forma only). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "San Diego Union-Tribune · JLL · SEC EDGAR · theregistrysocal.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiegouniontribune.com/2026/08/07/prominent-downtown-san-diego-hotel-changes-hands-for-147m/",
        "label": "Pendry San Diego (Gaslamp), leasehold (99-yr ground lease from 2012)",
        "secondary": false
      },
      {
        "url": "https://www.sandiegouniontribune.com/2026/02/13/hotel-sales-in-san-diego-fall-in-2025-even-as-they-climb-statewide/",
        "label": "Embassy Suites by Hilton San Diego La Jolla (UTC) — sandiegouniontribune.com",
        "secondary": false
      },
      {
        "url": "https://www.jll.com/en-us/newsroom/embassy-suites-by-hilton-san-diego-la-jolla-sold",
        "label": "Embassy Suites by Hilton San Diego La Jolla (UTC) — jll.com",
        "secondary": false
      },
      {
        "url": "https://www.sec.gov/Archives/edgar/data/1232582/000123258226000145/ahtsheratonmissionvalley.htm",
        "label": "Sheraton San Diego Mission Valley — sec.gov",
        "secondary": false
      },
      {
        "url": "https://theregistrysocal.com/ashford-sells-260-room-sheraton-mission-valley-to-hotel-circle-holdings-for-45-25mm-in-san-diego/",
        "label": "Sheraton San Diego Mission Valley — theregistrysocal.com",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-san-diego-debt-cmbs-sasb-loans",
    "marketSlug": "san-diego",
    "kind": "debt",
    "title": "San Diego debt & deals: CMBS / SASB loans",
    "body": "San Diego — debt & deals: CMBS / SASB loans. Hotel del Coronado, BX Trust 2025-DELC (Blackstone): $970M SASB, 2-yr floating IO + three 1-yr extensions, SOFR + 2.604% WA spread, 4.25% SOFR cap · Performing. Refinanced $950M of BX 2023-DELC, cash-neutral. Sponsor basis: $569M capex since 2015 (~$607K/key per DBRS). Initial maturity ~Dec 2027 (2-yr term from the Dec 2025 close, arithmetic) · DBRS final ratings 2025-12-16 | AHT 15-hotel pool loan (incl. Sheraton Mission Valley): $35.9M paydown on the release · Deleveraging sale; not a SS event · 2026-06-09 | Named San Diego hotel CMBS loan in SS/DQ/foreclosure, 2026: no public read. Trepp's free Jan–Sep 2026 DQ and SS PDFs name no San Diego hotel loan · checked 2026-10-11 (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Morningstar DBRS · SEC EDGAR (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://dbrs.morningstar.com/research/469910/morningstar-dbrs-finalizes-provisional-credit-ratings-on-bx-trust-2025-delc",
        "label": "Hotel del Coronado, BX Trust 2025-DELC (Blackstone)",
        "secondary": false
      },
      {
        "url": "https://www.sec.gov/Archives/edgar/data/1232582/000123258226000145/ahtsheratonmissionvalley.htm",
        "label": "AHT 15-hotel pool loan (incl. Sheraton Mission Valley)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-san-diego-tax-lodging-tax-stack",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego tax & CVB: Lodging tax stack (City of San Diego)",
    "body": "San Diego — tax & CVB: Lodging tax stack (City of San Diego). State sales tax on lodging: 0% (California does not apply sales tax to transient lodging) · accessed 2026-10-11 (source: state citation: no public read this pass) | City TOT, base: 10.5% (through 2025-04-30) · 5.5¢ General Fund · 4.0¢ Special Promotional Programs · 1.0¢ Council discretionary · FY2026 | City TOT after Measure C (effective 2025-05-01): 11.75% (Zone 1) / 12.75% (Zone 2) / 13.75% (Zone 3, nearest the Convention Center) · The Measure C increment goes 59% to the TOT Convention Center Fund (expansion/modernization) and 41% to the TOT Homelessness Fund. From FY2031, 10% of the homelessness share moves to street repair · 2025-06-03 | Tourism Marketing District (TMD) assessment: 2.00% (lodging with 70+ rooms; may be passed to the guest as a separate folio line) · SDTMD → San Diego Tourism Authority (SDTA) and event grants · accessed 2026-10-11 | Total (70+ room hotel): 13.75% (Zone 1) / 14.75% (Zone 2) / 15.75% (Zone 3) · 2026-10-11 (arithmetic). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "City of San Diego (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiego.gov/sites/default/files/2025-08/fy26ab_v1generalfundrevenues.pdf",
        "label": "City TOT, base",
        "secondary": false
      },
      {
        "url": "https://www.sandiego.gov/treasurer/taxesfees/tot",
        "label": "City TOT after Measure C (effective 2025-05-01) — sandiego.gov",
        "secondary": false
      },
      {
        "url": "https://www.sandiego.gov/sites/default/files/2025-12/25-37-review-of-the-fy-2026-first-quarter-budget-monitoring-report.pdf",
        "label": "City TOT after Measure C (effective 2025-05-01) — sandiego.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-san-diego-tax-collections-and-dmo-budget",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego tax & CVB: Collections and DMO budget",
    "body": "San Diego — tax & CVB: Collections and DMO budget. Total TOT, base 10.5¢ (GF + TOT Fund): $323.6M adopted / $318.1M Q1 projection · FY2026 · FY2026 | General Fund share (5.5¢): $170.3M adopted / $167.4M projected; $165.6M FY2025 unaudited actual · FY2026 / FY2025 · FY2026 / FY2025 (period) | Special Promotional Programs (4.0¢) / Council discretionary (1.0¢): $122.7M / $30.7M adopted · FY2026 · FY2026 (period) | Measure C increment: $80.3M adopted ($47.7M Convention Center Fund + $32.6M Homelessness Fund) / $76.9M projected · FY2026 · FY2026 (period) | All-in city TOT: $403.9M adopted / $395.0M projected · FY2026 · FY2026 (period) | SDTMD marketing grants: $50.47M total (FY2025: $50.9M) · FY2026 (Jul 2025–Jun 2026) · 2025-07-07 | San Diego Tourism Authority (DMO): >$47.9M from SDTMD. SDTMD FY2026 Report of Activities line items: no public read (PDF blocked from the box) · FY2026 · 2025-07-07 | Sports San Diego: $1.76M · FY2026 · FY2026 (period). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "8 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "City of San Diego · sdtmd.org (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiego.gov/sites/default/files/2025-12/25-37-review-of-the-fy-2026-first-quarter-budget-monitoring-report.pdf",
        "label": "Total TOT, base 10.5¢ (GF + TOT Fund) — sandiego.gov",
        "secondary": false
      },
      {
        "url": "https://www.sandiego.gov/sites/default/files/2025-08/fy26ab_v1generalfundrevenues.pdf",
        "label": "Total TOT, base 10.5¢ (GF + TOT Fund) — sandiego.gov",
        "secondary": false
      },
      {
        "url": "https://sdtmd.org/fy26-contractor-funding-announcement/",
        "label": "SDTMD marketing grants",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-san-francisco-bay-debt-named-hotel-transactions-2025-2026",
    "marketSlug": "san-francisco-bay",
    "kind": "debt",
    "title": "SF Bay Area debt & deals: Named hotel transactions 2025–2026",
    "body": "SF Bay Area — debt & deals: Named hotel transactions 2025–2026. Hyatt Regency San Francisco (Embarcadero): PSA 2026-06-23; close expected late Jul/early Aug 2026 · Blackstone Real Estate funds / Sunstone (SHO) · $279.0M · 821 · ~$340K · 3.5% cap on T12 Hotel NOI to 2026-05-31; 21.4x Hotel Adj. EBITDAre | Hilton SF Union Square + Parc 55 (receiver sale): completed 2025-11-24 · Newbond Holdings + Conversant Capital / court-appointed receiver (Park's former hotels; $725M CMBS default) · $408M · 2,945 (1,921 + 1,024) · ~$139K (arithmetic) · cap not disclosed. ~75% below the 2016 appraisal | The Barnes San Francisco: reported 2026-03-26 · EOS Investors / borrower in default on a $68M loan · no public read (paywalled) · n/a · n/a · n/a | Hyatt Regency SF Downtown SoMa (686 keys): marketed 2026 · no buyer or price · 686 (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "SEC EDGAR · pkhotelsandresorts.com · finance.yahoo.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sec.gov/Archives/edgar/data/1295810/000110465926076640/sho-20260623xex99d1.htm",
        "label": "Hyatt Regency San Francisco (Embarcadero)",
        "secondary": false
      },
      {
        "url": "https://www.pkhotelsandresorts.com/investors/news-and-events/press-releases/2025/11-24-2025-113016228",
        "label": "Hilton SF Union Square + Parc 55 (receiver sale) — pkhotelsandresorts.com",
        "secondary": false
      },
      {
        "url": "https://finance.yahoo.com/news/two-f-biggest-hotels-sell-000315544.html",
        "label": "Hilton SF Union Square + Parc 55 (receiver sale) — finance.yahoo.com",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-san-francisco-bay-debt-cmbs-balance-sheet-loans",
    "marketSlug": "san-francisco-bay",
    "kind": "debt",
    "title": "SF Bay Area debt & deals: CMBS / balance-sheet loans",
    "body": "SF Bay Area — debt & deals: CMBS / balance-sheet loans. Stanford Court Hotel (Nob Hill, 400 rooms, leasehold): $105M Deutsche Bank loan (2018) · Defaults in 2022 and 2024. DB sued in Jan 2025; receiver (CHMWarnick) appointed; foreclosure sought; trial set for 2026-07-13. Leasehold re-marketed by Eastdil (59 years left) · 2026-03-03 | Hilton SF Union Square / Parc 55: $725M SASB · Defaulted (2023). Resolved by the receiver sale above · 2025-11-24 | The Barnes SF: $68M · Default; sold to EOS · 2026-03-26 | Inn at Market (1400–1422 Market St): ~$9M · Loan default; foreclosure possible · 2026-08-05 | Named 2026–27 SF hotel CMBS maturities beyond the above: no public read (Trepp's free PDFs name no SF hotel loan) · checked 2026-10-11 (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "The Real Deal · pkhotelsandresorts.com · Business Journals (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://therealdeal.com/san-francisco/2026/03/03/nob-hill-hotel-hits-market-again-as-foreclosure-looms/",
        "label": "Stanford Court Hotel (Nob Hill, 400 rooms, leasehold)",
        "secondary": false
      },
      {
        "url": "https://www.pkhotelsandresorts.com/investors/news-and-events/press-releases/2025/11-24-2025-113016228",
        "label": "Hilton SF Union Square / Parc 55",
        "secondary": false
      },
      {
        "url": "https://therealdeal.com/san-francisco/2026/03/26/another-distressed-hotel-sale-hits-san-francisco/",
        "label": "The Barnes SF",
        "secondary": false
      },
      {
        "url": "https://www.bizjournals.com/sanfrancisco/news/2026/08/05/new-central-hotel-mid-market-default-patel.html",
        "label": "Inn at Market (1400–1422 Market St)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-san-francisco-bay-debt-market-level-reads",
    "marketSlug": "san-francisco-bay",
    "kind": "debt",
    "title": "SF Bay Area debt & deals: Market-level reads",
    "body": "SF Bay Area — debt & deals: Market-level reads. Host SF/San Jose comparable RevPAR: +8.0% YoY · Q3-2025 | SF hotel tax, all funds: $283.5M (FY23) → $287.5M (FY24) → $289.3M (FY25); projected $305.8M FY26 · FY2023–26 | June 2026 RevPAR (Cup + events): +31.2% to $212.87 · Jun 2026 | HVS/CBRE SF cap read, lodging DQ cut: no public read (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Host Hotels & Resorts · sfgov.legistar.com · CoStar (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.hosthotels.com/Press-Releases/2025/PressRelease_27676",
        "label": "Host SF/San Jose comparable RevPAR",
        "secondary": false
      },
      {
        "url": "https://sfgov.legistar.com/View.ashx?GUID=075BE0E5-0D55-4892-AFCB-DE03F998ECC7&ID=15190255&M=F",
        "label": "SF hotel tax, all funds",
        "secondary": false
      },
      {
        "url": "https://www.costar.com/products/str-benchmark/resources/press-releases/us-hotel-performance-june-2026",
        "label": "June 2026 RevPAR (Cup + events)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-san-francisco-bay-tax-lodging-tax-stack",
    "marketSlug": "san-francisco-bay",
    "kind": "tax",
    "title": "SF Bay Area tax & CVB: Lodging tax stack (City & County of San Francisco)",
    "body": "SF Bay Area — tax & CVB: Lodging tax stack (City & County of San Francisco). State sales tax on lodging: 0% (CA does not tax transient lodging) (source: state citation: no public read this pass) | Transient occupancy (hotel room) tax: 14% (1.5 points to arts under 2018 Prop E, ~10.7% of revenue) · General Fund + arts · FY2026 | Tourism Improvement District (TID): Zone 1: 2.25% / Zone 2: 2.00% (temporary +1% from 2024-11-01, extended through 2026-10-31). Base: 1.25% / 1.00% · SF Travel + Moscone incentives · FY2025 audited FS | Moscone Expansion District (MED): Zone 1: 1.25% / Zone 2: 0.3125% · Moscone expansion debt service, capital, incentives · eff. 2024-01-01 | Total, Zone 1 (downtown): 17.5% through 2026-10-31; 16.5% if the +1% lapses (arithmetic) · 2026. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "sfgov.legistar.com · sftid.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://sfgov.legistar.com/View.ashx?GUID=075BE0E5-0D55-4892-AFCB-DE03F998ECC7&ID=15190255&M=F",
        "label": "Transient occupancy (hotel room) tax",
        "secondary": false
      },
      {
        "url": "https://sftid.com/documents/FY202425_SFTIDMC_Audited_Financial_Statements.pdf",
        "label": "Tourism Improvement District (TID)",
        "secondary": false
      },
      {
        "url": "https://sftid.com/documents/TIDMC_Annual_report_2024-25.pdf",
        "label": "Moscone Expansion District (MED)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-san-francisco-bay-tax-collections-and-dmo-budget",
    "marketSlug": "san-francisco-bay",
    "kind": "tax",
    "title": "SF Bay Area tax & CVB: Collections and DMO budget",
    "body": "SF Bay Area — tax & CVB: Collections and DMO budget. Hotel tax, all funds: $289.3M actual; projected $305.8M · FY2025; FY2026 | General Fund hotel room tax: $255.3M; $265.2M budget; $272.0M projected · FY2025; FY2026 | SFTIDMC budget: $55.07M (TID $34.07M + MED $21.00M) · FY2026 (Jul 2025–Jun 2026) | SF Travel funding from TID: $28.69M marketing & operations (+ $0.21M MED) · FY2026 budget | MED debt service & stabilization: $17.12M · FY2026 budget | Moscone incentive fund: $6.47M (TID $4.81M + MED $1.66M) · FY2026 budget | SFTIDMC actual income: $51.71M · FY2025. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "7 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "sfgov.legistar.com · sftid.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://sfgov.legistar.com/View.ashx?GUID=075BE0E5-0D55-4892-AFCB-DE03F998ECC7&ID=15190255&M=F",
        "label": "Hotel tax, all funds",
        "secondary": false
      },
      {
        "url": "https://sftid.com/documents/TIDMC_Annual_report_2024-25.pdf",
        "label": "SFTIDMC budget",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-seattle-debt-named-hotel-transactions-2025-2026",
    "marketSlug": "seattle",
    "kind": "debt",
    "title": "Seattle debt & deals: Named hotel transactions 2025–2026",
    "body": "Seattle — debt & deals: Named hotel transactions 2025–2026. Marriott Seattle Waterfront: closed 2025-08-07/11 · Sixth Street Partners + Riller Capital / Braemar (BHR) · $145.0M · 369 · $393K · 8.1% cap on T12 NOI to 2025-05-31, incl. $7M anticipated capex. BHR repaid $88.4M of debt (CoStar) | Hilton Seattle Airport & Conference Center (SeaTac): Apr 2026 (Park Q1 release 2026-04-30) · Paramount Hotels affiliate (Bellevue) / Park Hotels & Resorts · ~$18.0M · 396 · ~$45.5K · cap not disclosed. Park framed its 2026 YTD sales (this + Hilton Checkers LA, ~$31M combined) at 16.3x 2025 EBITDA incl. avoided capex (secondary recap) | Belltown Inn (court-receiver sale): closed Oct 2025 · n/a / Resource Transition Consultants (court-appointed receiver; partnership dispute) · $29.0M · 165 · ~$176K (arithmetic) · cap not disclosed | Inn at Langley (Whidbey; outside core, context): Feb 2026 · n/a · $13.2M · 28 · $471K · cap not disclosed | La Quinta Inn & Suites Tacoma (context): Jul 2026 · n/a · $14.5M · 155 · $93.5K · cap not disclosed. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "PR Newswire · CoStar · theregistryps.com · Kidder Mathews · cre360signal.com · swansonking.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.prnewswire.com/news-releases/braemar-hotels--resorts-announces-sale-of-marriott-seattle-waterfront-302526388.html",
        "label": "Marriott Seattle Waterfront — prnewswire.com",
        "secondary": false
      },
      {
        "url": "https://www.costar.com/article/322288436/a-look-at-the-priciest-us-hotel-deals-in-the-third-quarter",
        "label": "Marriott Seattle Waterfront — costar.com",
        "secondary": false
      },
      {
        "url": "https://news.theregistryps.com/park-hotels-resorts-sells-396-room-hilton-seattle-airport-conference-center-for-18mm/",
        "label": "Hilton Seattle Airport & Conference Center (SeaTac) — news.theregistryps.com",
        "secondary": true
      },
      {
        "url": "https://kidder.com/wp-content/uploads/market_report/hotel-market-research-seattle-2026-2q.pdf",
        "label": "Hilton Seattle Airport & Conference Center (SeaTac) — kidder.com",
        "secondary": true
      },
      {
        "url": "https://www.cre360signal.com/p/park-hotels-just-set-the-floor",
        "label": "Hilton Seattle Airport & Conference Center (SeaTac) — cre360signal.com",
        "secondary": true
      },
      {
        "url": "https://swansonking.com/results/165-key-seattle-hotel-receivership/",
        "label": "Belltown Inn (court-receiver sale)",
        "secondary": true
      }
    ]
  },
  {
    "id": "w1c-seattle-debt-cmbs-balance-sheet-loans",
    "marketSlug": "seattle",
    "kind": "debt",
    "title": "Seattle debt & deals: CMBS / balance-sheet loans",
    "body": "Seattle — debt & deals: CMBS / balance-sheet loans. Park Hotels 2026 mortgage maturities (portfolio-wide, not Seattle-specific): $1.598B maturing in 2026 · Disclosed alongside the Hilton Seattle Airport sale · 2026-04-30 | Hyatt House Seattle/Downtown: $30.8M refinancing (JLL-arranged) · New debt · 2026-10-08 | Named Seattle hotel CMBS loan in SS/DQ/foreclosure, 2026: no public read. Trepp's Jul-2026 DQ names a Seattle office portfolio only. Hotel 1000 \"near-foreclosure\" change of hands exists only as a blog comment and is not used · checked 2026-10-11 (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "3 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "cre360signal.com · Hotel Business (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.cre360signal.com/p/park-hotels-just-set-the-floor",
        "label": "Park Hotels 2026 mortgage maturities (portfolio-wide, not Seattle-spec",
        "secondary": true
      },
      {
        "url": "https://hotelbusiness.com/jll-arranges-30-8m-refinancing-for-hyatt-house-seattle-downtown/",
        "label": "Hyatt House Seattle/Downtown",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-seattle-debt-market-level-reads",
    "marketSlug": "seattle",
    "kind": "debt",
    "title": "Seattle debt & deals: Market-level reads",
    "body": "Seattle — debt & deals: Market-level reads. Host Seattle comparable RevPAR: flat YoY · Q3-2025 | Seattle CBD OCC / ADR / RevPAR: 70.7% / $239 / $169 · 2Q26 (Kidder Mathews) | Market TTM OCC: 68.6% vs 69.7% LY · Q2-2026 | HVS/CBRE Seattle cap read, lodging DQ cut: no public read (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Host Hotels & Resorts · Kidder Mathews (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.hosthotels.com/Press-Releases/2025/PressRelease_27676",
        "label": "Host Seattle comparable RevPAR",
        "secondary": false
      },
      {
        "url": "https://kidder.com/wp-content/uploads/market_report/hotel-market-research-seattle-2026-2q.pdf",
        "label": "Seattle CBD OCC / ADR / RevPAR, 2Q26",
        "secondary": true
      }
    ]
  },
  {
    "id": "w1c-seattle-tax-lodging-tax-stack",
    "marketSlug": "seattle",
    "kind": "tax",
    "title": "Seattle tax & CVB: Lodging tax stack (City of Seattle)",
    "body": "Seattle — tax & CVB: Lodging tax stack (City of Seattle). State + local sales tax on lodging (WA DOR lodging component): 8.7% (arithmetic: 15.70% total − 7% convention center tax) · State / local · eff. Apr–Jun 2026 | Special hotel-motel tax (Seattle): N/A (not imposed) · Q2-2026 | Convention center tax (King County, inside Seattle): 7.0% · WSCC Public Facilities District (Summit/Arch debt + ops) · Q2-2026 | DOR total lodging tax (Seattle, all sizes): 15.70% · Q2-2026 | Seattle Tourism Improvement Area (STIA): 2.3% of room rate (60+ rooms inside the STIA; 71 hotels) · Visit Seattle · ordinance eff. 2024-01-01 | Total (STIA hotel): 18.0% (arithmetic) · 2026. Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "6 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "dor.wa.gov · City of Seattle (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://dor.wa.gov/sites/default/files/2026-02/Q226_Lodging_flyer.pdf",
        "label": "State + local sales tax on lodging (WA DOR lodging component)",
        "secondary": false
      },
      {
        "url": "https://clerk.seattle.gov/~archives/Ordinances/Ord_126912.pdf",
        "label": "Seattle Tourism Improvement Area (STIA) — clerk.seattle.gov",
        "secondary": false
      },
      {
        "url": "https://harrell.seattle.gov/2023/10/04/mayor-harrell-signs-new-seattle-tourism-improvement-area-legislation-to-draw-more-visitors-and-expand-economic-benefits-for-the-region/",
        "label": "Seattle Tourism Improvement Area (STIA) — harrell.seattle.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-seattle-tax-collections-and-dmo-budget",
    "marketSlug": "seattle",
    "kind": "tax",
    "title": "Seattle tax & CVB: Collections and DMO budget",
    "body": "Seattle — tax & CVB: Collections and DMO budget. WSCC PFD regular lodging tax (Seattle 7%): $95.3M (+2%) · FY2025 | WSCC PFD extended lodging tax (King County 2.8%): $3.1M (−51%) · FY2025 | Prior year (regular / extended): $93.5M / $6.4M · FY2024 | PFD outside marketing payment (Visit Seattle contract): $10.6M · FY2024 | STIA assessments (Visit Seattle): ~$15M estimated (base year) · 2024 | Visit Seattle total budget: no public read (the 2026 Business Plan cites \"budget stabilization\" and \"rebuild reserves\") · 2026 | PFD Summit debt-service profile: ~$85M/yr through 2029, then ~$156M/yr balloon 2030–34 (secondary reconstruction of Note 6). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "7 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "Seattle Convention Center · seattle.legistar.com · almanac.conventioncityseattle.com (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://seattlecc.com/governance/financial-reports/",
        "label": "WSCC PFD regular lodging tax (Seattle 7%)",
        "secondary": false
      },
      {
        "url": "https://seattlecc.com/wp-content/uploads/2025/10/WSCC-Public-Facilities-District-2024-Audit-FS-Final.pdf",
        "label": "Prior year (regular / extended)",
        "secondary": false
      },
      {
        "url": "https://seattle.legistar.com/gateway.aspx?ID=ab747ea6-90a5-4a21-a3e5-1c36ff433766.pdf&M=F",
        "label": "STIA assessments (Visit Seattle)",
        "secondary": false
      },
      {
        "url": "https://almanac.conventioncityseattle.com/cities/seattle/finance/",
        "label": "PFD Summit debt-service profile",
        "secondary": true
      }
    ]
  },
  {
    "id": "w1c-washington-dc-debt-named-hotel-transactions-2025-2026",
    "marketSlug": "washington-dc",
    "kind": "debt",
    "title": "Washington DC debt & deals: Named hotel transactions 2025–2026",
    "body": "Washington DC — debt & deals: Named hotel transactions 2025–2026. Westin Washington, D.C. City Center: closed 2025-02-19 · n/a / DiamondRock (DRH) · $92.0M · 410 · ~$224K · 7.5% cap on 2024 NOI (5.6% incl. projected capex); 11.2x 2024 EBITDA. Adjusted: 7.0% / 5.2%, 11.9x | Washington Marriott at Metro Center: Q3 2025 (Aug–Sep) · T2 Hospitality / Host (HST) · $177M · 454 (WBJ) · ~$390K (arithmetic) · cap not disclosed. Host provided $114M seller financing (~64% of price, arithmetic) | Capitol Hill Hotel: 2025-10-16 · Friedman Capital affiliate / TPG Real Estate Partners · $60.0M · 153 · ~$392K · cap not disclosed | Waldorf Astoria DC (Old Post Office), fee interest from the US government: reported 2026-06-11 · BDT & MSD Partners (leaseholder) / GSA · $80M (land + building only) · 263 (brand-published count; not in the deal source) · n/a (fee only) · cap not disclosed. Leasehold sold for $375M in 2022 to CGI, which defaulted. BDT & MSD took it at the 2024 foreclosure auction for ~$100M credit bid. Fielding offers near $400M (WSJ via CRE Daily) | Hotel Harrington (shuttered Dec 2023): Jul 2026 · KHP Capital Partners / n/a · $14.4M · 308 · ~$47K · n/a (closed asset; repositioning). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "PR Newswire · Host Hotels & Resorts · Business Journals · Commercial Observer · Commercial Real Estate Direct · CRE Daily · Bisnow · hotelrealtor.biz · traded.co (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.prnewswire.com/news-releases/diamondrock-hospitality-company-completes-sale-of-the-westin-washington-dc-city-center-302380800.html",
        "label": "Westin Washington, D.C. City Center",
        "secondary": false
      },
      {
        "url": "https://www.hosthotels.com/Press-Releases/2025/PressRelease_27676",
        "label": "Washington Marriott at Metro Center — hosthotels.com",
        "secondary": false
      },
      {
        "url": "https://www.bizjournals.com/washington/news/2025/09/03/marriott-metro-center-hotel.html",
        "label": "Washington Marriott at Metro Center — bizjournals.com",
        "secondary": false
      },
      {
        "url": "https://commercialobserver.com/2025/10/friedman-capital-hotel-dc/",
        "label": "Capitol Hill Hotel — commercialobserver.com",
        "secondary": false
      },
      {
        "url": "https://crenews.com/2025/10/17/153-room-hotel-in-washington-d-c-sells-for-60mln/",
        "label": "Capitol Hill Hotel — crenews.com",
        "secondary": false
      },
      {
        "url": "https://www.credaily.com/briefs/dc-s-waldorf-astoria-sells-for-80m-spurs-buyer-interest/",
        "label": "Waldorf Astoria DC (Old Post Office), fee interest from the US governm — credaily.com",
        "secondary": false
      },
      {
        "url": "https://www.bisnow.com/news/washington-dc/hotel/waldorf-astoria-foreclosure-auction-125380",
        "label": "Waldorf Astoria DC (Old Post Office), fee interest from the US governm — bisnow.com",
        "secondary": false
      },
      {
        "url": "https://www.bizjournals.com/washington/news/2026/07/10/hotel-harrington-khp-capital-sale.html",
        "label": "Hotel Harrington (shuttered Dec 2023) — bizjournals.com",
        "secondary": true
      },
      {
        "url": "https://hotelrealtor.biz/khp-acquires-hotel-harrington-washington-dc/",
        "label": "Hotel Harrington (shuttered Dec 2023) — hotelrealtor.biz",
        "secondary": true
      },
      {
        "url": "https://traded.co/deals/dc/hotel/sale/436-11th-street-northwest/",
        "label": "Hotel Harrington (shuttered Dec 2023) — traded.co",
        "secondary": true
      }
    ]
  },
  {
    "id": "w1c-washington-dc-debt-cmbs-balance-sheet-loans",
    "marketSlug": "washington-dc",
    "kind": "debt",
    "title": "Washington DC debt & deals: CMBS / balance-sheet loans",
    "body": "Washington DC — debt & deals: CMBS / balance-sheet loans. Capital Hilton (Braemar 75% JV): $110.6M (Aareal, SOFR+3.75%) · Initial maturity Dec 2026, with two 1-yr extensions subject to conditions. Braemar's Oct 2026 update cites \"other planned refinancings\" · refi 2024-02. Watch Dec 2026 | Washington Marriott Metro Center seller note: $114M at 6.5% (per HST 10-Q R-page summary; initial maturity 2027-08-28 with two 6-mo extensions) · Performing seller financing · 2025 | Waldorf Astoria DC leasehold: ~$253M debt (CGI) · Foreclosed Aug 2024. Lender group took it at a ~$100M auction · 2024 (pre-window, context) | The Line DC (220 keys): $86M Acore loan (2019) · Foreclosure auction scheduled 2025-01-23 · Dec 2024 / Jan 2025 | Named DC hotel CMBS loan in SS/DQ in 2026: no public read (Trepp's free Jan–Sep 2026 PDFs name only DC office loans) · checked 2026-10-11 (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "SEC EDGAR · Host Hotels & Resorts · Bisnow (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sec.gov/Archives/edgar/data/1574085/000157408524000008/bhr2024loanupdatepr.htm",
        "label": "Capital Hilton (Braemar 75% JV) — sec.gov",
        "secondary": false
      },
      {
        "url": "https://www.sec.gov/Archives/edgar/data/1574085/000157408526000151/ex991portfolioupdatepressr.htm",
        "label": "Capital Hilton (Braemar 75% JV) — sec.gov",
        "secondary": false
      },
      {
        "url": "https://www.hosthotels.com/Press-Releases/2025/PressRelease_27676",
        "label": "Washington Marriott Metro Center seller note — hosthotels.com",
        "secondary": false
      },
      {
        "url": "https://www.sec.gov/Archives/edgar/data/1061937/000107075025000168/R20.htm",
        "label": "Washington Marriott Metro Center seller note — sec.gov",
        "secondary": false
      },
      {
        "url": "https://www.bisnow.com/news/washington-dc/hotel/waldorf-astoria-foreclosure-auction-125380",
        "label": "Waldorf Astoria DC leasehold",
        "secondary": false
      },
      {
        "url": "https://www.bisnow.com/news/washington-dc/hotel/dcs-line-hotel-scheduled-for-auction-by-lender-127170",
        "label": "The Line DC (220 keys)",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-washington-dc-tax-lodging-tax-stack",
    "marketSlug": "washington-dc",
    "kind": "tax",
    "title": "Washington DC tax & CVB: Lodging tax stack (District of Columbia)",
    "body": "Washington DC — tax & CVB: Lodging tax stack (District of Columbia). DC sales tax on transient accommodations (all-in): 15.95% through 2027-09-30 (Hotel Surtax Amendment Act of 2025), then reverts to 14.95% · 10.2% Local Fund · 4.45% Convention Center Fund (Events DC) · 1.3% Destination DC (falls to 0.3% on reversion) · 2025-10-01 | 1% surtax redirect: from FY2026, most of the 1% surtax goes to DMPED's Economic Development Special Account, with part reserved for Local Funds, instead of Destination DC · FY2026 | Proposed per-night fee: $0.80 per occupied room night (Public Services Hotel Occupancy Fee Amendment Act of 2025), est. $6.9M in FY2026. Enactment not confirmed in the OTR Oct-2025 notice · special-purpose fund · FY2026 | Total: 15.95% (+ $0.80/night if enacted) · 2026-10-11 (checked). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "4 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "DC government (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://otr.cfo.dc.gov/node/1800521",
        "label": "DC sales tax on transient accommodations (all-in) — otr.cfo.dc.gov",
        "secondary": false
      },
      {
        "url": "https://ora-cfo.dc.gov/sites/default/files/dc/sites/ora-cfo/publication/attachments/FY%202026%20Revenue%20Chapter.pdf",
        "label": "DC sales tax on transient accommodations (all-in) — ora-cfo.dc.gov",
        "secondary": false
      }
    ]
  },
  {
    "id": "w1c-washington-dc-tax-collections-and-dmo-budget",
    "marketSlug": "washington-dc",
    "kind": "tax",
    "title": "Washington DC tax & CVB: Collections and DMO budget",
    "body": "Washington DC — tax & CVB: Collections and DMO budget. Transfer to Convention Center Fund (hotel 4.45% + 1% restaurants + rental cars): $167.1M actual / $170.2M est. / $170.6M est. · FY2024 / FY2025 / FY2026 · FY2026 | Transfer to Convention Center Fund for Destination DC (hotel tax): $32.2M / $33.3M / $33.4M → $19.2M (FY27) → $7.8M (FY28) · FY2024–FY2028 · FY2024–FY2028 (period) | Total FY2024 transfer to Events DC + Destination DC: $199.3M · FY2024 · FY2024 (period) | Destination DC budget: ~$35M for 2026, down almost 37% (\"1% less in hotel taxes\") · 2026 · 2025-10-09 | Hotel-only total collections: no public read isolating the hotel base · 2026-10-11 (checked) (source: no public read). Decision support; labor underwritten at the new floors with no staff cuts.",
    "magnitude": "5 rows",
    "asOf": "2026-10-11",
    "sourceLabel": "DC government · Events DC (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://ora-cfo.dc.gov/sites/default/files/dc/sites/ora-cfo/publication/attachments/FY%202026%20Revenue%20Chapter.pdf",
        "label": "Transfer to Convention Center Fund (hotel 4.45% + 1% restaurants + ren",
        "secondary": false
      },
      {
        "url": "https://eventsdc.com/sites/default/files/2025-12/Board_Summary_Meeting_Minutes_-_October_9_2025__%28corrected%29_%28002%29.pdf",
        "label": "Destination DC budget",
        "secondary": false
      }
    ]
  }
];
