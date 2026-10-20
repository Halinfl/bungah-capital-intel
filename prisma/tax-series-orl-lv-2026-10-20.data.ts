import type { LinkedSignal } from "./linked-signal";

// Orlando + Las Vegas hotel-tax collection series, checked 2026-10-20 (every figure re-read from its
// official PDF). Same shape and fixed-id scheme as the Tier 1 series: tax-<slug>-<yyyymm>-<series>.
// Orlando: Orange County Comptroller monthly TDT releases. Las Vegas: LVCVA's own room-tax share only.
// Excluded: LVCVA Jul–Aug 2026 estimates; county budget figures (budgets are not collections). Decision support.
export const TAX_SERIES_ORL_LV_2026_10_20: LinkedSignal[] = [
  {
    "id": "tax-orlando-202509-m",
    "marketSlug": "orlando",
    "kind": "tax",
    "title": "Orlando (Orange County) Tourist Development Tax, monthly collections — Sep 2025",
    "body": "Orlando (Orange County) Tourist Development Tax, monthly collections, Sep 2025: Collections: $26,025,300 · Prior-year month: $25,751,900 · YoY (published): +1.1%. Basis: collections received by Orange County for the collection month; county FY Oct–Sep. Collection month ≠ stay month. Orange County Tourist Development Tax 6% on transient rentals (state and county sales tax not included). Orlando was not a 2026 World Cup host. Decision support.",
    "magnitude": "$26.03M (+1.1% YoY) · collections received",
    "asOf": "Sep 2025",
    "sourceLabel": "Orange County Comptroller — Tourist Development Tax collections, September 2025 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://www.occompt.com/DocumentCenter/View/57858/2025-09-September-TDT-Collection-PDF",
        "label": "Orange County Comptroller — Tourist Development Tax collections, September 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-orlando-202510-m",
    "marketSlug": "orlando",
    "kind": "tax",
    "title": "Orlando (Orange County) Tourist Development Tax, monthly collections — Oct 2025",
    "body": "Orlando (Orange County) Tourist Development Tax, monthly collections, Oct 2025: Collections: $33,928,000 · Prior-year month: $29,468,200 · YoY (published): +15.1%. Basis: collections received by Orange County for the collection month; county FY Oct–Sep. Collection month ≠ stay month. Orange County Tourist Development Tax 6% on transient rentals (state and county sales tax not included). Orlando was not a 2026 World Cup host. Decision support.",
    "magnitude": "$33.93M (+15.1% YoY) · collections received",
    "asOf": "Oct 2025",
    "sourceLabel": "Orange County Comptroller — Tourist Development Tax collections, October 2025 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://www.occompt.com/DocumentCenter/View/58897/2025-10-October-TDT-Collection-PDF",
        "label": "Orange County Comptroller — Tourist Development Tax collections, October 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-orlando-202511-m",
    "marketSlug": "orlando",
    "kind": "tax",
    "title": "Orlando (Orange County) Tourist Development Tax, monthly collections — Nov 2025",
    "body": "Orlando (Orange County) Tourist Development Tax, monthly collections, Nov 2025: Collections: $34,563,900 · Prior-year month: $31,788,300 · YoY (published): +8.7%. Basis: collections received by Orange County for the collection month; county FY Oct–Sep. Collection month ≠ stay month. Orange County Tourist Development Tax 6% on transient rentals (state and county sales tax not included). Orlando was not a 2026 World Cup host. Decision support.",
    "magnitude": "$34.56M (+8.7% YoY) · collections received",
    "asOf": "Nov 2025",
    "sourceLabel": "Orange County Comptroller — Tourist Development Tax collections, November 2025 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://www.occompt.com/DocumentCenter/View/58936/2025-11-November-TDT-Collection-PDF",
        "label": "Orange County Comptroller — Tourist Development Tax collections, November 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-orlando-202512-m",
    "marketSlug": "orlando",
    "kind": "tax",
    "title": "Orlando (Orange County) Tourist Development Tax, monthly collections — Dec 2025",
    "body": "Orlando (Orange County) Tourist Development Tax, monthly collections, Dec 2025: Collections: $34,329,900 · Prior-year month: $31,761,400 · YoY (published): +8.1%. Basis: collections received by Orange County for the collection month; county FY Oct–Sep. Collection month ≠ stay month. Orange County Tourist Development Tax 6% on transient rentals (state and county sales tax not included). Orlando was not a 2026 World Cup host. Decision support.",
    "magnitude": "$34.33M (+8.1% YoY) · collections received",
    "asOf": "Dec 2025",
    "sourceLabel": "Orange County Comptroller — Tourist Development Tax collections, December 2025 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://www.occompt.com/DocumentCenter/View/58960/2025-12-December-TDT-Collection-PDF",
        "label": "Orange County Comptroller — Tourist Development Tax collections, December 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-orlando-202601-m",
    "marketSlug": "orlando",
    "kind": "tax",
    "title": "Orlando (Orange County) Tourist Development Tax, monthly collections — Jan 2026",
    "body": "Orlando (Orange County) Tourist Development Tax, monthly collections, Jan 2026: Collections: $35,363,600 · Prior-year month: $33,384,900 · YoY (published): +5.9%. Basis: collections received by Orange County for the collection month; county FY Oct–Sep. Collection month ≠ stay month. Orange County Tourist Development Tax 6% on transient rentals (state and county sales tax not included). Orlando was not a 2026 World Cup host. Decision support.",
    "magnitude": "$35.36M (+5.9% YoY) · collections received",
    "asOf": "Jan 2026",
    "sourceLabel": "Orange County Comptroller — Tourist Development Tax collections, January 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://www.occompt.com/DocumentCenter/View/60320/2026-01-January-TDT-Collection-PDF",
        "label": "Orange County Comptroller — Tourist Development Tax collections, January 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-orlando-202602-m",
    "marketSlug": "orlando",
    "kind": "tax",
    "title": "Orlando (Orange County) Tourist Development Tax, monthly collections — Feb 2026",
    "body": "Orlando (Orange County) Tourist Development Tax, monthly collections, Feb 2026: Collections: $38,169,700 · Prior-year month: $35,483,300 · YoY (published): +7.6%. Basis: collections received by Orange County for the collection month; county FY Oct–Sep. Collection month ≠ stay month. Orange County Tourist Development Tax 6% on transient rentals (state and county sales tax not included). Orlando was not a 2026 World Cup host. Decision support.",
    "magnitude": "$38.17M (+7.6% YoY) · collections received",
    "asOf": "Feb 2026",
    "sourceLabel": "Orange County Comptroller — Tourist Development Tax collections, February 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://www.occompt.com/DocumentCenter/View/60369/2026-02-February-TDT-Collection-PDF",
        "label": "Orange County Comptroller — Tourist Development Tax collections, February 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-orlando-202603-m",
    "marketSlug": "orlando",
    "kind": "tax",
    "title": "Orlando (Orange County) Tourist Development Tax, monthly collections — Mar 2026",
    "body": "Orlando (Orange County) Tourist Development Tax, monthly collections, Mar 2026: Collections: $42,917,000 · Prior-year month: $40,177,100 · YoY (published): +6.8%. Basis: collections received by Orange County for the collection month; county FY Oct–Sep. Collection month ≠ stay month. Orange County Tourist Development Tax 6% on transient rentals (state and county sales tax not included). Orlando was not a 2026 World Cup host. Decision support.",
    "magnitude": "$42.92M (+6.8% YoY) · collections received",
    "asOf": "Mar 2026",
    "sourceLabel": "Orange County Comptroller — Tourist Development Tax collections, March 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://www.occompt.com/DocumentCenter/View/60405/2026-03-March-TDT-Collection-PDF",
        "label": "Orange County Comptroller — Tourist Development Tax collections, March 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-orlando-202604-m",
    "marketSlug": "orlando",
    "kind": "tax",
    "title": "Orlando (Orange County) Tourist Development Tax, monthly collections — Apr 2026",
    "body": "Orlando (Orange County) Tourist Development Tax, monthly collections, Apr 2026: Collections: $37,724,000 · Prior-year month: $33,124,300 · YoY (published): +13.9%. Basis: collections received by Orange County for the collection month; county FY Oct–Sep. Collection month ≠ stay month. Orange County Tourist Development Tax 6% on transient rentals (state and county sales tax not included). Orlando was not a 2026 World Cup host. Decision support.",
    "magnitude": "$37.72M (+13.9% YoY) · collections received",
    "asOf": "Apr 2026",
    "sourceLabel": "Orange County Comptroller — Tourist Development Tax collections, April 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://www.occompt.com/DocumentCenter/View/60434/2026-04-April-TDT-Collection-PDF",
        "label": "Orange County Comptroller — Tourist Development Tax collections, April 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-orlando-202605-m",
    "marketSlug": "orlando",
    "kind": "tax",
    "title": "Orlando (Orange County) Tourist Development Tax, monthly collections — May 2026",
    "body": "Orlando (Orange County) Tourist Development Tax, monthly collections, May 2026: Collections: $32,788,200 · Prior-year month: $29,993,100 · YoY (published): +9.3%. Basis: collections received by Orange County for the collection month; county FY Oct–Sep. Collection month ≠ stay month. Orange County Tourist Development Tax 6% on transient rentals (state and county sales tax not included). Orlando was not a 2026 World Cup host. Decision support.",
    "magnitude": "$32.79M (+9.3% YoY) · collections received",
    "asOf": "May 2026",
    "sourceLabel": "Orange County Comptroller — Tourist Development Tax collections, May 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://www.occompt.com/DocumentCenter/View/60501/2026-05-May-TDT-Collection-PDF",
        "label": "Orange County Comptroller — Tourist Development Tax collections, May 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-orlando-202606-m",
    "marketSlug": "orlando",
    "kind": "tax",
    "title": "Orlando (Orange County) Tourist Development Tax, monthly collections — Jun 2026",
    "body": "Orlando (Orange County) Tourist Development Tax, monthly collections, Jun 2026: Collections: $33,557,300 · Prior-year month: $33,698,100 · YoY (published): −0.4%. Basis: collections received by Orange County for the collection month; county FY Oct–Sep. Collection month ≠ stay month. Orange County Tourist Development Tax 6% on transient rentals (state and county sales tax not included). Orlando was not a 2026 World Cup host. Decision support.",
    "magnitude": "$33.56M (−0.4% YoY) · collections received",
    "asOf": "Jun 2026",
    "sourceLabel": "Orange County Comptroller — Tourist Development Tax collections, June 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://www.occompt.com/DocumentCenter/View/60536/2026-06-June-TDT-Collection-PDF",
        "label": "Orange County Comptroller — Tourist Development Tax collections, June 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-orlando-202607-m",
    "marketSlug": "orlando",
    "kind": "tax",
    "title": "Orlando (Orange County) Tourist Development Tax, monthly collections — Jul 2026",
    "body": "Orlando (Orange County) Tourist Development Tax, monthly collections, Jul 2026: Collections: $31,474,700 · Prior-year month: $29,571,100 · YoY (published): +6.4%. Basis: collections received by Orange County for the collection month; county FY Oct–Sep. Collection month ≠ stay month. Orange County Tourist Development Tax 6% on transient rentals (state and county sales tax not included). Orlando was not a 2026 World Cup host. Decision support.",
    "magnitude": "$31.47M (+6.4% YoY) · collections received",
    "asOf": "Jul 2026",
    "sourceLabel": "Orange County Comptroller — Tourist Development Tax collections, July 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://www.occompt.com/DocumentCenter/View/60573/2026-07-July-TDT-Collection-PDF",
        "label": "Orange County Comptroller — Tourist Development Tax collections, July 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-orlando-202608-m",
    "marketSlug": "orlando",
    "kind": "tax",
    "title": "Orlando (Orange County) Tourist Development Tax, monthly collections — Aug 2026",
    "body": "Orlando (Orange County) Tourist Development Tax, monthly collections, Aug 2026: Collections: $24,826,100 · Prior-year month: $25,649,100 · YoY (published): −3.2%. Basis: collections received by Orange County for the collection month; county FY Oct–Sep. Collection month ≠ stay month. Orange County Tourist Development Tax 6% on transient rentals (state and county sales tax not included). Orlando was not a 2026 World Cup host. Decision support.",
    "magnitude": "$24.83M (−3.2% YoY) · collections received",
    "asOf": "Aug 2026",
    "sourceLabel": "Orange County Comptroller — Tourist Development Tax collections, August 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://www.occompt.com/DocumentCenter/View/60606/2026-08-August-TDT-Collection-PDF",
        "label": "Orange County Comptroller — Tourist Development Tax collections, August 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-orlando-202608-ytd",
    "marketSlug": "orlando",
    "kind": "tax",
    "title": "Orlando (Orange County) Tourist Development Tax, fiscal year to date — FY2026 (Oct 2025–Aug 2026)",
    "body": "Orlando (Orange County) Tourist Development Tax, fiscal year to date, FY2026 (Oct 2025–Aug 2026): Collections: $381,689,000 · Prior-year period: $354,098,900 · YoY (published): +7.8%. Basis: collections received by Orange County for the collection month; county FY Oct–Sep. Collection month ≠ stay month. Orange County Tourist Development Tax 6% on transient rentals (state and county sales tax not included). Orlando was not a 2026 World Cup host. Decision support.",
    "magnitude": "$381.7M (+7.8% YoY) · collections received, FY2026 to date",
    "asOf": "FY2026 YTD (Oct 2025–Aug 2026)",
    "sourceLabel": "Orange County Comptroller — Tourist Development Tax collections, August 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://www.occompt.com/DocumentCenter/View/60606/2026-08-August-TDT-Collection-PDF",
        "label": "Orange County Comptroller — Tourist Development Tax collections, August 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-orlando-202509-fy",
    "marketSlug": "orlando",
    "kind": "tax",
    "title": "Orlando (Orange County) Tourist Development Tax, fiscal-year collections — FY2025 (Oct 2024–Sep 2025)",
    "body": "Orlando (Orange County) Tourist Development Tax, fiscal-year collections, FY2025 (Oct 2024–Sep 2025): Collections: $384,587,100 (includes $4,462,900 of audit and timing adjustments not in the monthly figures) · Prior year: $359,464,600 · YoY (published): +7.0%. Basis: collections received by Orange County for the collection month; county FY Oct–Sep. Collection month ≠ stay month. Orange County Tourist Development Tax 6% on transient rentals (state and county sales tax not included). Orlando was not a 2026 World Cup host. Decision support.",
    "magnitude": "$384.6M (+7.0% YoY) · collections received, incl. $4.46M adjustments",
    "asOf": "FY2025 (Oct 2024–Sep 2025)",
    "sourceLabel": "Orange County Comptroller — Tourist Development Tax collections, September 2025 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://www.occompt.com/DocumentCenter/View/57858/2025-09-September-TDT-Collection-PDF",
        "label": "Orange County Comptroller — Tourist Development Tax collections, September 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-orlando-000000-gaps",
    "marketSlug": "orlando",
    "kind": "tax",
    "title": "Orlando hotel-tax series — gaps",
    "body": "Orlando hotel-tax series gaps (as of 2026-10-20): September 2026 collection month: not yet published (the Comptroller says early November). Osceola County (Kissimmee) tourist tax: no public read in this series. Decision support.",
    "magnitude": "no public read",
    "asOf": "2026-10-20",
    "sourceLabel": "Official publishers (gap note; no public read)",
    "sourceUrls": null
  },
  {
    "id": "tax-las-vegas-202506-m",
    "marketSlug": "las-vegas",
    "kind": "tax",
    "title": "Las Vegas LVCVA room tax, by hotel-activity month — Jun 2025",
    "body": "Las Vegas LVCVA room tax, by hotel-activity month, Jun 2025: LVCVA room tax: $24,603,391 · Prior-year month: $28,999,138 · YoY (computed): −15.2%. Basis: LVCVA's own room-tax revenue by month of hotel activity (received about two months later); LVCVA FY Jul–Jun. This is LVCVA's share only, not the full 12%–13.38% Clark County area room tax. Earlier months may be revised in later prints. Las Vegas was not a 2026 World Cup host. Decision support.",
    "magnitude": "$24.60M (−15.2% YoY, computed) · LVCVA share, activity month",
    "asOf": "Jun 2025",
    "sourceLabel": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/August_2026_for_Internet_f46502ca-232c-4031-8b3a-09b8bb9a3d63.pdf",
        "label": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026",
        "secondary": false
      },
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/Quarterly_Budget_and_Statistical_report_Dec_31_2025_81cc93e8-8a79-4d3a-af5a-1ee4c92ccf08.pdf",
        "label": "Las Vegas Convention and Visitors Authority — Quarterly Budget and Statistical Report, Dec 31 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-las-vegas-202507-m",
    "marketSlug": "las-vegas",
    "kind": "tax",
    "title": "Las Vegas LVCVA room tax, by hotel-activity month — Jul 2025",
    "body": "Las Vegas LVCVA room tax, by hotel-activity month, Jul 2025: LVCVA room tax: $23,348,699 · Prior-year month: $28,225,045 · YoY (computed): −17.3%. Basis: LVCVA's own room-tax revenue by month of hotel activity (received about two months later); LVCVA FY Jul–Jun. This is LVCVA's share only, not the full 12%–13.38% Clark County area room tax. Earlier months may be revised in later prints. Las Vegas was not a 2026 World Cup host. Decision support.",
    "magnitude": "$23.35M (−17.3% YoY, computed) · LVCVA share, activity month",
    "asOf": "Jul 2025",
    "sourceLabel": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/August_2026_for_Internet_f46502ca-232c-4031-8b3a-09b8bb9a3d63.pdf",
        "label": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026",
        "secondary": false
      },
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/Quarterly_Budget_and_Statistical_report_Dec_31_2025_81cc93e8-8a79-4d3a-af5a-1ee4c92ccf08.pdf",
        "label": "Las Vegas Convention and Visitors Authority — Quarterly Budget and Statistical Report, Dec 31 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-las-vegas-202508-m",
    "marketSlug": "las-vegas",
    "kind": "tax",
    "title": "Las Vegas LVCVA room tax, by hotel-activity month — Aug 2025",
    "body": "Las Vegas LVCVA room tax, by hotel-activity month, Aug 2025: LVCVA room tax: $25,575,712 · Prior-year month: $28,654,284 · YoY (computed): −10.7%. Basis: LVCVA's own room-tax revenue by month of hotel activity (received about two months later); LVCVA FY Jul–Jun. This is LVCVA's share only, not the full 12%–13.38% Clark County area room tax. Earlier months may be revised in later prints. Las Vegas was not a 2026 World Cup host. Decision support.",
    "magnitude": "$25.58M (−10.7% YoY, computed) · LVCVA share, activity month",
    "asOf": "Aug 2025",
    "sourceLabel": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/August_2026_for_Internet_f46502ca-232c-4031-8b3a-09b8bb9a3d63.pdf",
        "label": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026",
        "secondary": false
      },
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/Quarterly_Budget_and_Statistical_report_Dec_31_2025_81cc93e8-8a79-4d3a-af5a-1ee4c92ccf08.pdf",
        "label": "Las Vegas Convention and Visitors Authority — Quarterly Budget and Statistical Report, Dec 31 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-las-vegas-202509-m",
    "marketSlug": "las-vegas",
    "kind": "tax",
    "title": "Las Vegas LVCVA room tax, by hotel-activity month — Sep 2025",
    "body": "Las Vegas LVCVA room tax, by hotel-activity month, Sep 2025: LVCVA room tax: $28,804,726 · Prior-year month: $32,378,520 · YoY (computed): −11.0%. Basis: LVCVA's own room-tax revenue by month of hotel activity (received about two months later); LVCVA FY Jul–Jun. This is LVCVA's share only, not the full 12%–13.38% Clark County area room tax. Earlier months may be revised in later prints. Las Vegas was not a 2026 World Cup host. Decision support.",
    "magnitude": "$28.80M (−11.0% YoY, computed) · LVCVA share, activity month",
    "asOf": "Sep 2025",
    "sourceLabel": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/August_2026_for_Internet_f46502ca-232c-4031-8b3a-09b8bb9a3d63.pdf",
        "label": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026",
        "secondary": false
      },
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/Quarterly_Budget_and_Statistical_report_Dec_31_2025_81cc93e8-8a79-4d3a-af5a-1ee4c92ccf08.pdf",
        "label": "Las Vegas Convention and Visitors Authority — Quarterly Budget and Statistical Report, Dec 31 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-las-vegas-202510-m",
    "marketSlug": "las-vegas",
    "kind": "tax",
    "title": "Las Vegas LVCVA room tax, by hotel-activity month — Oct 2025",
    "body": "Las Vegas LVCVA room tax, by hotel-activity month, Oct 2025: LVCVA room tax: $34,630,032 · Prior-year month: $36,664,287 · YoY (computed): −5.5%. Basis: LVCVA's own room-tax revenue by month of hotel activity (received about two months later); LVCVA FY Jul–Jun. This is LVCVA's share only, not the full 12%–13.38% Clark County area room tax. Earlier months may be revised in later prints. Las Vegas was not a 2026 World Cup host. Decision support.",
    "magnitude": "$34.63M (−5.5% YoY, computed) · LVCVA share, activity month",
    "asOf": "Oct 2025",
    "sourceLabel": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/August_2026_for_Internet_f46502ca-232c-4031-8b3a-09b8bb9a3d63.pdf",
        "label": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026",
        "secondary": false
      },
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/Quarterly_Budget_and_Statistical_report_Dec_31_2025_81cc93e8-8a79-4d3a-af5a-1ee4c92ccf08.pdf",
        "label": "Las Vegas Convention and Visitors Authority — Quarterly Budget and Statistical Report, Dec 31 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-las-vegas-202511-m",
    "marketSlug": "las-vegas",
    "kind": "tax",
    "title": "Las Vegas LVCVA room tax, by hotel-activity month — Nov 2025",
    "body": "Las Vegas LVCVA room tax, by hotel-activity month, Nov 2025: LVCVA room tax: $28,651,086 · Prior-year month: $30,094,356 · YoY (computed): −4.8%. Basis: LVCVA's own room-tax revenue by month of hotel activity (received about two months later); LVCVA FY Jul–Jun. This is LVCVA's share only, not the full 12%–13.38% Clark County area room tax. Earlier months may be revised in later prints. Las Vegas was not a 2026 World Cup host. Decision support.",
    "magnitude": "$28.65M (−4.8% YoY, computed) · LVCVA share, activity month",
    "asOf": "Nov 2025",
    "sourceLabel": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/August_2026_for_Internet_f46502ca-232c-4031-8b3a-09b8bb9a3d63.pdf",
        "label": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026",
        "secondary": false
      },
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/Quarterly_Budget_and_Statistical_report_Dec_31_2025_81cc93e8-8a79-4d3a-af5a-1ee4c92ccf08.pdf",
        "label": "Las Vegas Convention and Visitors Authority — Quarterly Budget and Statistical Report, Dec 31 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-las-vegas-202512-m",
    "marketSlug": "las-vegas",
    "kind": "tax",
    "title": "Las Vegas LVCVA room tax, by hotel-activity month — Dec 2025",
    "body": "Las Vegas LVCVA room tax, by hotel-activity month, Dec 2025: LVCVA room tax: $26,577,539 · Prior-year month: $29,684,756 · YoY (computed): −10.5%. Basis: LVCVA's own room-tax revenue by month of hotel activity (received about two months later); LVCVA FY Jul–Jun. This is LVCVA's share only, not the full 12%–13.38% Clark County area room tax. Earlier months may be revised in later prints. Las Vegas was not a 2026 World Cup host. Decision support.",
    "magnitude": "$26.58M (−10.5% YoY, computed) · LVCVA share, activity month",
    "asOf": "Dec 2025",
    "sourceLabel": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/August_2026_for_Internet_f46502ca-232c-4031-8b3a-09b8bb9a3d63.pdf",
        "label": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026",
        "secondary": false
      },
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/Quarterly_Budget_and_Statistical_report_Dec_31_2025_81cc93e8-8a79-4d3a-af5a-1ee4c92ccf08.pdf",
        "label": "Las Vegas Convention and Visitors Authority — Quarterly Budget and Statistical Report, Dec 31 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-las-vegas-202601-m",
    "marketSlug": "las-vegas",
    "kind": "tax",
    "title": "Las Vegas LVCVA room tax, by hotel-activity month — Jan 2026",
    "body": "Las Vegas LVCVA room tax, by hotel-activity month, Jan 2026: LVCVA room tax: $33,269,086 · Prior-year month: $33,622,194 · YoY (computed): −1.1%. Basis: LVCVA's own room-tax revenue by month of hotel activity (received about two months later); LVCVA FY Jul–Jun. This is LVCVA's share only, not the full 12%–13.38% Clark County area room tax. Earlier months may be revised in later prints. Las Vegas was not a 2026 World Cup host. Decision support.",
    "magnitude": "$33.27M (−1.1% YoY, computed) · LVCVA share, activity month",
    "asOf": "Jan 2026",
    "sourceLabel": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/August_2026_for_Internet_f46502ca-232c-4031-8b3a-09b8bb9a3d63.pdf",
        "label": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026",
        "secondary": false
      },
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/Quarterly_Budget_and_Statistical_report_Dec_31_2025_81cc93e8-8a79-4d3a-af5a-1ee4c92ccf08.pdf",
        "label": "Las Vegas Convention and Visitors Authority — Quarterly Budget and Statistical Report, Dec 31 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-las-vegas-202602-m",
    "marketSlug": "las-vegas",
    "kind": "tax",
    "title": "Las Vegas LVCVA room tax, by hotel-activity month — Feb 2026",
    "body": "Las Vegas LVCVA room tax, by hotel-activity month, Feb 2026: LVCVA room tax: $28,768,834 · Prior-year month: $27,566,508 · YoY (computed): +4.4%. Basis: LVCVA's own room-tax revenue by month of hotel activity (received about two months later); LVCVA FY Jul–Jun. This is LVCVA's share only, not the full 12%–13.38% Clark County area room tax. Earlier months may be revised in later prints. Las Vegas was not a 2026 World Cup host. Decision support.",
    "magnitude": "$28.77M (+4.4% YoY, computed) · LVCVA share, activity month",
    "asOf": "Feb 2026",
    "sourceLabel": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/August_2026_for_Internet_f46502ca-232c-4031-8b3a-09b8bb9a3d63.pdf",
        "label": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026",
        "secondary": false
      },
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/Quarterly_Budget_and_Statistical_report_Dec_31_2025_81cc93e8-8a79-4d3a-af5a-1ee4c92ccf08.pdf",
        "label": "Las Vegas Convention and Visitors Authority — Quarterly Budget and Statistical Report, Dec 31 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-las-vegas-202603-m",
    "marketSlug": "las-vegas",
    "kind": "tax",
    "title": "Las Vegas LVCVA room tax, by hotel-activity month — Mar 2026",
    "body": "Las Vegas LVCVA room tax, by hotel-activity month, Mar 2026: LVCVA room tax: $35,805,726 · Prior-year month: $31,368,968 · YoY (computed): +14.1%. Basis: LVCVA's own room-tax revenue by month of hotel activity (received about two months later); LVCVA FY Jul–Jun. This is LVCVA's share only, not the full 12%–13.38% Clark County area room tax. Earlier months may be revised in later prints. Las Vegas was not a 2026 World Cup host. Decision support.",
    "magnitude": "$35.81M (+14.1% YoY, computed) · LVCVA share, activity month",
    "asOf": "Mar 2026",
    "sourceLabel": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/August_2026_for_Internet_f46502ca-232c-4031-8b3a-09b8bb9a3d63.pdf",
        "label": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026",
        "secondary": false
      },
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/Quarterly_Budget_and_Statistical_report_Dec_31_2025_81cc93e8-8a79-4d3a-af5a-1ee4c92ccf08.pdf",
        "label": "Las Vegas Convention and Visitors Authority — Quarterly Budget and Statistical Report, Dec 31 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-las-vegas-202604-m",
    "marketSlug": "las-vegas",
    "kind": "tax",
    "title": "Las Vegas LVCVA room tax, by hotel-activity month — Apr 2026",
    "body": "Las Vegas LVCVA room tax, by hotel-activity month, Apr 2026: LVCVA room tax: $30,987,301 · Prior-year month: $32,629,320 · YoY (computed): −5.0%. Basis: LVCVA's own room-tax revenue by month of hotel activity (received about two months later); LVCVA FY Jul–Jun. This is LVCVA's share only, not the full 12%–13.38% Clark County area room tax. Earlier months may be revised in later prints. Las Vegas was not a 2026 World Cup host. Decision support.",
    "magnitude": "$30.99M (−5.0% YoY, computed) · LVCVA share, activity month",
    "asOf": "Apr 2026",
    "sourceLabel": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/August_2026_for_Internet_f46502ca-232c-4031-8b3a-09b8bb9a3d63.pdf",
        "label": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026",
        "secondary": false
      },
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/Quarterly_Budget_and_Statistical_report_Dec_31_2025_81cc93e8-8a79-4d3a-af5a-1ee4c92ccf08.pdf",
        "label": "Las Vegas Convention and Visitors Authority — Quarterly Budget and Statistical Report, Dec 31 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-las-vegas-202605-m",
    "marketSlug": "las-vegas",
    "kind": "tax",
    "title": "Las Vegas LVCVA room tax, by hotel-activity month — May 2026",
    "body": "Las Vegas LVCVA room tax, by hotel-activity month, May 2026: LVCVA room tax: $35,803,783 · Prior-year month: $33,452,788 · YoY (computed): +7.0%. Basis: LVCVA's own room-tax revenue by month of hotel activity (received about two months later); LVCVA FY Jul–Jun. This is LVCVA's share only, not the full 12%–13.38% Clark County area room tax. Earlier months may be revised in later prints. Las Vegas was not a 2026 World Cup host. Decision support.",
    "magnitude": "$35.80M (+7.0% YoY, computed) · LVCVA share, activity month",
    "asOf": "May 2026",
    "sourceLabel": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/August_2026_for_Internet_f46502ca-232c-4031-8b3a-09b8bb9a3d63.pdf",
        "label": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026",
        "secondary": false
      },
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/Quarterly_Budget_and_Statistical_report_Dec_31_2025_81cc93e8-8a79-4d3a-af5a-1ee4c92ccf08.pdf",
        "label": "Las Vegas Convention and Visitors Authority — Quarterly Budget and Statistical Report, Dec 31 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-las-vegas-202606-m",
    "marketSlug": "las-vegas",
    "kind": "tax",
    "title": "Las Vegas LVCVA room tax, by hotel-activity month — Jun 2026",
    "body": "Las Vegas LVCVA room tax, by hotel-activity month, Jun 2026: LVCVA room tax: $24,330,018 · Prior-year month: $24,603,391 · YoY (published): −1.11%. Basis: LVCVA's own room-tax revenue by month of hotel activity (received about two months later); LVCVA FY Jul–Jun. This is LVCVA's share only, not the full 12%–13.38% Clark County area room tax. Earlier months may be revised in later prints. Las Vegas was not a 2026 World Cup host. Decision support.",
    "magnitude": "$24.33M (−1.11% YoY, published) · LVCVA share, activity month",
    "asOf": "Jun 2026",
    "sourceLabel": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/August_2026_for_Internet_f46502ca-232c-4031-8b3a-09b8bb9a3d63.pdf",
        "label": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-las-vegas-202605-fy",
    "marketSlug": "las-vegas",
    "kind": "tax",
    "title": "Las Vegas LVCVA room tax, fiscal year — FY2026 (activity Jun 2025–May 2026)",
    "body": "Las Vegas LVCVA room tax, fiscal year, FY2026 (activity Jun 2025–May 2026): LVCVA room tax: $356,825,915 · Prior year: $373,340,164 · YoY (computed): −4.4%. Basis: LVCVA's own room-tax revenue by month of hotel activity (received about two months later); LVCVA FY Jul–Jun. This is LVCVA's share only, not the full 12%–13.38% Clark County area room tax. Earlier months may be revised in later prints. Las Vegas was not a 2026 World Cup host. Decision support.",
    "magnitude": "$356.8M (−4.4% YoY, computed) · LVCVA share",
    "asOf": "FY2026 (activity Jun 2025–May 2026)",
    "sourceLabel": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/August_2026_for_Internet_f46502ca-232c-4031-8b3a-09b8bb9a3d63.pdf",
        "label": "Las Vegas Convention and Visitors Authority — CEO Monthly Room Tax Update, August 2026",
        "secondary": false
      },
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/Quarterly_Budget_and_Statistical_report_Dec_31_2025_81cc93e8-8a79-4d3a-af5a-1ee4c92ccf08.pdf",
        "label": "Las Vegas Convention and Visitors Authority — Quarterly Budget and Statistical Report, Dec 31 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-las-vegas-202505-fy",
    "marketSlug": "las-vegas",
    "kind": "tax",
    "title": "Las Vegas LVCVA room tax, fiscal year — FY2025 (activity Jun 2024–May 2025)",
    "body": "Las Vegas LVCVA room tax, fiscal year, FY2025 (activity Jun 2024–May 2025): LVCVA room tax: $373,340,164. Basis: LVCVA's own room-tax revenue by month of hotel activity (received about two months later); LVCVA FY Jul–Jun. This is LVCVA's share only, not the full 12%–13.38% Clark County area room tax. Earlier months may be revised in later prints. Las Vegas was not a 2026 World Cup host. Decision support.",
    "magnitude": "$373.3M · LVCVA share",
    "asOf": "FY2025 (activity Jun 2024–May 2025)",
    "sourceLabel": "Las Vegas Convention and Visitors Authority — Quarterly Budget and Statistical Report, Dec 31 2025 (accessed 2026-10-20)",
    "sourceUrls": [
      {
        "url": "https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/lasvegas/Quarterly_Budget_and_Statistical_report_Dec_31_2025_81cc93e8-8a79-4d3a-af5a-1ee4c92ccf08.pdf",
        "label": "Las Vegas Convention and Visitors Authority — Quarterly Budget and Statistical Report, Dec 31 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-las-vegas-000000-gaps",
    "marketSlug": "las-vegas",
    "kind": "tax",
    "title": "Las Vegas hotel-tax series — gaps",
    "body": "Las Vegas hotel-tax series gaps (as of 2026-10-20): July–August 2026 activity: LVCVA shows estimates only, so no actuals are loaded (no public read). Full 12%–13.38% countywide room tax by month: no public read (LVCVA publishes its own share). Decision support.",
    "magnitude": "no public read",
    "asOf": "2026-10-20",
    "sourceLabel": "Official publishers (gap note; no public read)",
    "sourceUrls": null
  }
];
