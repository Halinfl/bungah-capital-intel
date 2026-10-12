import type { LinkedSignal } from "./linked-signal";

// Tier 1 hotel-tax collection series (15 markets), QA-cleared 2026-10-11. One signal per published period,
// kind "tax", fixed ids tax-<slug>-<yyyymm period end>-<series> (newest-first sort key; 000000 = gap note).
// Only figure rows with an official URL are loaded; "no public read" rows kept as written, no link.
// Excluded: Houston reporting-year 2023 as-filed value (form-field maximum) and MPEA FY2025 annual table
// (hotel / auto-rental lines transposed); non-figures (Atlanta FY2022 non-filing, Chicago City Jan 2026 none posted).
// Basis + fiscal convention carried on each signal (magnitude + body). No figure changes. Decision support.
export const TAX_SERIES_2026_10_11: LinkedSignal[] = [
  {
    "id": "tax-new-york-city-202403-q",
    "marketSlug": "new-york-city",
    "kind": "tax",
    "title": "New York City hotel occupancy tax, quarterly cash receipts — Jan–Mar 2024 (FY2024 Q3)",
    "body": "New York City hotel occupancy tax, quarterly cash receipts, Jan–Mar 2024 (FY2024 Q3): Receipts: $151M · Prior-year quarter: $140M · YoY (published): +7.9%. Basis: cash collected; FY Jul–Jun. Cash basis, gross of refunds — differs from OSC/OMB figures (OSC FY2025 $770M vs $801M here); don't mix the two. Receipts are cash received in the quarter, not stays. NYC hotel room occupancy tax 5.875% + $2.00/room-night (state/MCTD sales tax and NYS unit fee not included). Decision support.",
    "magnitude": "$151M (+7.9% YoY) · cash collected",
    "asOf": "Jan–Mar 2024 (FY2024 Q3)",
    "sourceLabel": "NYC Comptroller (Quarterly Cash Report) — Quarterly Cash Report QCR_3Q24 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://comptroller.nyc.gov/wp-content/uploads/documents/QCR_3Q24.pdf",
        "label": "NYC Comptroller (Quarterly Cash Report) — Quarterly Cash Report QCR_3Q24",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-new-york-city-202406-q",
    "marketSlug": "new-york-city",
    "kind": "tax",
    "title": "New York City hotel occupancy tax, quarterly cash receipts — Apr–Jun 2024 (FY2024 Q4)",
    "body": "New York City hotel occupancy tax, quarterly cash receipts, Apr–Jun 2024 (FY2024 Q4): Receipts: $192M · Prior-year quarter: $178M · YoY (published): +7.9%. Basis: cash collected; FY Jul–Jun. Cash basis, gross of refunds — differs from OSC/OMB figures (OSC FY2025 $770M vs $801M here); don't mix the two. Receipts are cash received in the quarter, not stays. NYC hotel room occupancy tax 5.875% + $2.00/room-night (state/MCTD sales tax and NYS unit fee not included). Decision support.",
    "magnitude": "$192M (+7.9% YoY) · cash collected",
    "asOf": "Apr–Jun 2024 (FY2024 Q4)",
    "sourceLabel": "NYC Comptroller (Quarterly Cash Report) — Quarterly Cash Report QCR-4Q24 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://comptroller.nyc.gov/wp-content/uploads/documents/QCR-4Q24.pdf",
        "label": "NYC Comptroller (Quarterly Cash Report) — Quarterly Cash Report QCR-4Q24",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-new-york-city-202409-q",
    "marketSlug": "new-york-city",
    "kind": "tax",
    "title": "New York City hotel occupancy tax, quarterly cash receipts — Jul–Sep 2024 (FY2025 Q1)",
    "body": "New York City hotel occupancy tax, quarterly cash receipts, Jul–Sep 2024 (FY2025 Q1): Receipts: $188M · Prior-year quarter: $169M · YoY (published): +11.2%. Basis: cash collected; FY Jul–Jun. Cash basis, gross of refunds — differs from OSC/OMB figures (OSC FY2025 $770M vs $801M here); don't mix the two. Receipts are cash received in the quarter, not stays. NYC hotel room occupancy tax 5.875% + $2.00/room-night (state/MCTD sales tax and NYS unit fee not included). Decision support.",
    "magnitude": "$188M (+11.2% YoY) · cash collected",
    "asOf": "Jul–Sep 2024 (FY2025 Q1)",
    "sourceLabel": "NYC Comptroller (Quarterly Cash Report) — Quarterly Cash Report QCR-1Q25-Final (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://comptroller.nyc.gov/wp-content/uploads/documents/QCR-1Q25-Final.pdf",
        "label": "NYC Comptroller (Quarterly Cash Report) — Quarterly Cash Report QCR-1Q25-Final",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-new-york-city-202412-q",
    "marketSlug": "new-york-city",
    "kind": "tax",
    "title": "New York City hotel occupancy tax, quarterly cash receipts — Oct–Dec 2024 (FY2025 Q2)",
    "body": "New York City hotel occupancy tax, quarterly cash receipts, Oct–Dec 2024 (FY2025 Q2): Receipts: $238M · Prior-year quarter: $220M · YoY (published): +8.2%. Basis: cash collected; FY Jul–Jun. Cash basis, gross of refunds — differs from OSC/OMB figures (OSC FY2025 $770M vs $801M here); don't mix the two. Receipts are cash received in the quarter, not stays. NYC hotel room occupancy tax 5.875% + $2.00/room-night (state/MCTD sales tax and NYS unit fee not included). Decision support.",
    "magnitude": "$238M (+8.2% YoY) · cash collected",
    "asOf": "Oct–Dec 2024 (FY2025 Q2)",
    "sourceLabel": "NYC Comptroller (Quarterly Cash Report) — Quarterly Cash Report QCR-2Q25-Final (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://comptroller.nyc.gov/wp-content/uploads/documents/QCR-2Q25-Final.pdf",
        "label": "NYC Comptroller (Quarterly Cash Report) — Quarterly Cash Report QCR-2Q25-Final",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-new-york-city-202503-q",
    "marketSlug": "new-york-city",
    "kind": "tax",
    "title": "New York City hotel occupancy tax, quarterly cash receipts — Jan–Mar 2025 (FY2025 Q3)",
    "body": "New York City hotel occupancy tax, quarterly cash receipts, Jan–Mar 2025 (FY2025 Q3): Receipts: $181M · Prior-year quarter: $151M · YoY (published): +19.9%. Basis: cash collected; FY Jul–Jun. Cash basis, gross of refunds — differs from OSC/OMB figures (OSC FY2025 $770M vs $801M here); don't mix the two. Receipts are cash received in the quarter, not stays. NYC hotel room occupancy tax 5.875% + $2.00/room-night (state/MCTD sales tax and NYS unit fee not included). Decision support.",
    "magnitude": "$181M (+19.9% YoY) · cash collected",
    "asOf": "Jan–Mar 2025 (FY2025 Q3)",
    "sourceLabel": "NYC Comptroller (Quarterly Cash Report) — Quarterly Cash Report QCR-3Q25-Final (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://comptroller.nyc.gov/wp-content/uploads/documents/QCR-3Q25-Final.pdf",
        "label": "NYC Comptroller (Quarterly Cash Report) — Quarterly Cash Report QCR-3Q25-Final",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-new-york-city-202506-q",
    "marketSlug": "new-york-city",
    "kind": "tax",
    "title": "New York City hotel occupancy tax, quarterly cash receipts — Apr–Jun 2025 (FY2025 Q4)",
    "body": "New York City hotel occupancy tax, quarterly cash receipts, Apr–Jun 2025 (FY2025 Q4): Receipts: $194M · Prior-year quarter: $192M · YoY (published): +1.0%. Basis: cash collected; FY Jul–Jun. Cash basis, gross of refunds — differs from OSC/OMB figures (OSC FY2025 $770M vs $801M here); don't mix the two. Receipts are cash received in the quarter, not stays. NYC hotel room occupancy tax 5.875% + $2.00/room-night (state/MCTD sales tax and NYS unit fee not included). Decision support.",
    "magnitude": "$194M (+1.0% YoY) · cash collected",
    "asOf": "Apr–Jun 2025 (FY2025 Q4)",
    "sourceLabel": "NYC Comptroller (Quarterly Cash Report) — Quarterly Cash Report QCR-4Q25-Final (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://comptroller.nyc.gov/wp-content/uploads/documents/QCR-4Q25-Final.pdf",
        "label": "NYC Comptroller (Quarterly Cash Report) — Quarterly Cash Report QCR-4Q25-Final",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-new-york-city-202509-q",
    "marketSlug": "new-york-city",
    "kind": "tax",
    "title": "New York City hotel occupancy tax, quarterly cash receipts — Jul–Sep 2025 (FY2026 Q1)",
    "body": "New York City hotel occupancy tax, quarterly cash receipts, Jul–Sep 2025 (FY2026 Q1): Receipts: $197M · Prior-year quarter: $188M · YoY (published): +4.8%. Basis: cash collected; FY Jul–Jun. Cash basis, gross of refunds — differs from OSC/OMB figures (OSC FY2025 $770M vs $801M here); don't mix the two. Receipts are cash received in the quarter, not stays. NYC hotel room occupancy tax 5.875% + $2.00/room-night (state/MCTD sales tax and NYS unit fee not included). Decision support.",
    "magnitude": "$197M (+4.8% YoY) · cash collected",
    "asOf": "Jul–Sep 2025 (FY2026 Q1)",
    "sourceLabel": "NYC Comptroller (Quarterly Cash Report) — Quarterly Cash Report QCR-1Q26-Final (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://comptroller.nyc.gov/wp-content/uploads/documents/QCR-1Q26-Final.pdf",
        "label": "NYC Comptroller (Quarterly Cash Report) — Quarterly Cash Report QCR-1Q26-Final",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-new-york-city-202512-q",
    "marketSlug": "new-york-city",
    "kind": "tax",
    "title": "New York City hotel occupancy tax, quarterly cash receipts — Oct–Dec 2025 (FY2026 Q2)",
    "body": "New York City hotel occupancy tax, quarterly cash receipts, Oct–Dec 2025 (FY2026 Q2): Receipts: $249M · Prior-year quarter: $238M · YoY (published): +4.6%. Basis: cash collected; FY Jul–Jun. Cash basis, gross of refunds — differs from OSC/OMB figures (OSC FY2025 $770M vs $801M here); don't mix the two. Receipts are cash received in the quarter, not stays. NYC hotel room occupancy tax 5.875% + $2.00/room-night (state/MCTD sales tax and NYS unit fee not included). Decision support.",
    "magnitude": "$249M (+4.6% YoY) · cash collected",
    "asOf": "Oct–Dec 2025 (FY2026 Q2)",
    "sourceLabel": "NYC Comptroller (Quarterly Cash Report) — Quarterly Cash Report QCR-2Q26-Final-1 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://comptroller.nyc.gov/wp-content/uploads/documents/QCR-2Q26-Final-1.pdf",
        "label": "NYC Comptroller (Quarterly Cash Report) — Quarterly Cash Report QCR-2Q26-Final-1",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-new-york-city-202603-q",
    "marketSlug": "new-york-city",
    "kind": "tax",
    "title": "New York City hotel occupancy tax, quarterly cash receipts — Jan–Mar 2026 (FY2026 Q3)",
    "body": "New York City hotel occupancy tax, quarterly cash receipts, Jan–Mar 2026 (FY2026 Q3): Receipts: $194M · Prior-year quarter: $181M · YoY (published): +7.2%. Basis: cash collected; FY Jul–Jun. Cash basis, gross of refunds — differs from OSC/OMB figures (OSC FY2025 $770M vs $801M here); don't mix the two. Receipts are cash received in the quarter, not stays. NYC hotel room occupancy tax 5.875% + $2.00/room-night (state/MCTD sales tax and NYS unit fee not included). Decision support.",
    "magnitude": "$194M (+7.2% YoY) · cash collected",
    "asOf": "Jan–Mar 2026 (FY2026 Q3)",
    "sourceLabel": "NYC Comptroller (Quarterly Cash Report) — Quarterly Cash Report QCR-3Q26-Final (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://comptroller.nyc.gov/wp-content/uploads/documents/QCR-3Q26-Final.pdf",
        "label": "NYC Comptroller (Quarterly Cash Report) — Quarterly Cash Report QCR-3Q26-Final",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-new-york-city-202606-q",
    "marketSlug": "new-york-city",
    "kind": "tax",
    "title": "New York City hotel occupancy tax, quarterly cash receipts — Apr–Jun 2026 (FY2026 Q4)",
    "body": "New York City hotel occupancy tax, quarterly cash receipts, Apr–Jun 2026 (FY2026 Q4): Receipts: $207M · Prior-year quarter: $194M · YoY (published): +6.7%. Basis: cash collected; FY Jul–Jun. Cash basis, gross of refunds — differs from OSC/OMB figures (OSC FY2025 $770M vs $801M here); don't mix the two. Receipts are cash received in the quarter, not stays. NYC hotel room occupancy tax 5.875% + $2.00/room-night (state/MCTD sales tax and NYS unit fee not included). Decision support.",
    "magnitude": "$207M (+6.7% YoY) · cash collected",
    "asOf": "Apr–Jun 2026 (FY2026 Q4)",
    "sourceLabel": "NYC Comptroller (Quarterly Cash Report) — Quarterly Cash Report QCR-4Q26-Final (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://comptroller.nyc.gov/wp-content/uploads/documents/QCR-4Q26-Final.pdf",
        "label": "NYC Comptroller (Quarterly Cash Report) — Quarterly Cash Report QCR-4Q26-Final",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-new-york-city-202306-fy",
    "marketSlug": "new-york-city",
    "kind": "tax",
    "title": "New York City hotel occupancy tax, fiscal-year cash receipts — FY2023 (Jul 2022–Jun 2023)",
    "body": "New York City hotel occupancy tax, fiscal-year cash receipts, FY2023 (Jul 2022–Jun 2023): Receipts: $670M · YoY: n/a. Basis: cash collected; FY Jul–Jun. Cash basis, gross of refunds — differs from OSC/OMB figures (OSC FY2025 $770M vs $801M here); don't mix the two. Receipts are cash received in the quarter, not stays. NYC hotel room occupancy tax 5.875% + $2.00/room-night (state/MCTD sales tax and NYS unit fee not included). Decision support.",
    "magnitude": "$670M · cash collected",
    "asOf": "FY2023 (Jul 2022–Jun 2023)",
    "sourceLabel": "NYC Comptroller — Quarterly Cash Report, Apr–Jun 2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://comptroller.nyc.gov/wp-content/uploads/documents/QCR-4Q24.pdf",
        "label": "NYC Comptroller — Quarterly Cash Report, Apr–Jun 2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-new-york-city-202406-fy",
    "marketSlug": "new-york-city",
    "kind": "tax",
    "title": "New York City hotel occupancy tax, fiscal-year cash receipts — FY2024 (Jul 2023–Jun 2024)",
    "body": "New York City hotel occupancy tax, fiscal-year cash receipts, FY2024 (Jul 2023–Jun 2024): Receipts: $732M · YoY: +9.3% (published). Basis: cash collected; FY Jul–Jun. Cash basis, gross of refunds — differs from OSC/OMB figures (OSC FY2025 $770M vs $801M here); don't mix the two. Receipts are cash received in the quarter, not stays. NYC hotel room occupancy tax 5.875% + $2.00/room-night (state/MCTD sales tax and NYS unit fee not included). Decision support.",
    "magnitude": "$732M (+9.3% YoY) · cash collected",
    "asOf": "FY2024 (Jul 2023–Jun 2024)",
    "sourceLabel": "NYC Comptroller — Quarterly Cash Report, Apr–Jun 2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://comptroller.nyc.gov/wp-content/uploads/documents/QCR-4Q24.pdf",
        "label": "NYC Comptroller — Quarterly Cash Report, Apr–Jun 2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-new-york-city-202506-fy",
    "marketSlug": "new-york-city",
    "kind": "tax",
    "title": "New York City hotel occupancy tax, fiscal-year cash receipts — FY2025 (Jul 2024–Jun 2025)",
    "body": "New York City hotel occupancy tax, fiscal-year cash receipts, FY2025 (Jul 2024–Jun 2025): Receipts: $801M · YoY: +9.4% (published). Basis: cash collected; FY Jul–Jun. Cash basis, gross of refunds — differs from OSC/OMB figures (OSC FY2025 $770M vs $801M here); don't mix the two. Receipts are cash received in the quarter, not stays. NYC hotel room occupancy tax 5.875% + $2.00/room-night (state/MCTD sales tax and NYS unit fee not included). Decision support.",
    "magnitude": "$801M (+9.4% YoY) · cash collected",
    "asOf": "FY2025 (Jul 2024–Jun 2025)",
    "sourceLabel": "NYC Comptroller — Quarterly Cash Report, Apr–Jun 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://comptroller.nyc.gov/wp-content/uploads/documents/QCR-4Q25-Final.pdf",
        "label": "NYC Comptroller — Quarterly Cash Report, Apr–Jun 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-new-york-city-202606-fy",
    "marketSlug": "new-york-city",
    "kind": "tax",
    "title": "New York City hotel occupancy tax, fiscal-year cash receipts — FY2026 (Jul 2025–Jun 2026)",
    "body": "New York City hotel occupancy tax, fiscal-year cash receipts, FY2026 (Jul 2025–Jun 2026): Receipts: $847M · YoY: +5.7% (published). Basis: cash collected; FY Jul–Jun. Cash basis, gross of refunds — differs from OSC/OMB figures (OSC FY2025 $770M vs $801M here); don't mix the two. Receipts are cash received in the quarter, not stays. NYC hotel room occupancy tax 5.875% + $2.00/room-night (state/MCTD sales tax and NYS unit fee not included). Decision support.",
    "magnitude": "$847M (+5.7% YoY) · cash collected",
    "asOf": "FY2026 (Jul 2025–Jun 2026)",
    "sourceLabel": "NYC Comptroller — Quarterly Cash Report, Apr–Jun 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://comptroller.nyc.gov/wp-content/uploads/documents/QCR-4Q26-Final.pdf",
        "label": "NYC Comptroller — Quarterly Cash Report, Apr–Jun 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-new-york-city-000000-gaps",
    "marketSlug": "new-york-city",
    "kind": "tax",
    "title": "New York City hotel-tax series — gaps",
    "body": "New York City hotel-tax series gaps (as of 2026-10-11): Monthly NYC hotel tax: no public read in a monthly official series this pass (Comptroller publishes quarterly). | FY2027 Q1 (Jul–Sep 2026): not yet published as of 2026-10-11. Decision support.",
    "magnitude": "no public read",
    "asOf": "2026-10-11",
    "sourceLabel": "Official publishers (gap note; no public read)",
    "sourceUrls": null
  },
  {
    "id": "tax-los-angeles-202407-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — Jul 2024",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, Jul 2024: Hotel TOT (3112): $26,246,372 · STR TOT (3114): $3,342,998 · Total: $29,589,370 · YoY: +1.4%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$29.59M (+1.4% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "Jul 2024",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202408-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — Aug 2024",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, Aug 2024: Hotel TOT (3112): $28,688,942 · STR TOT (3114): $3,114,613 · Total: $31,803,555 · YoY: +13.3%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$31.80M (+13.3% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "Aug 2024",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202409-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — Sep 2024",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, Sep 2024: Hotel TOT (3112): $22,987,074 · STR TOT (3114): $321,133 · Total: $23,308,208 · YoY: -11.2%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$23.31M (-11.2% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "Sep 2024",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202410-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — Oct 2024",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, Oct 2024: Hotel TOT (3112): $26,855,151 · STR TOT (3114): $5,214,637 · Total: $32,069,787 · YoY: +29.5%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$32.07M (+29.5% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "Oct 2024",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202411-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — Nov 2024",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, Nov 2024: Hotel TOT (3112): $15,281,911 · STR TOT (3114): $96,008 · Total: $15,377,919 · YoY: -36.0%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$15.38M (-36.0% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "Nov 2024",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202412-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — Dec 2024",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, Dec 2024: Hotel TOT (3112): $29,283,277 · STR TOT (3114): $433,164 · Total: $29,716,441 · YoY: +95.8%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$29.72M (+95.8% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "Dec 2024",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202501-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — Jan 2025",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, Jan 2025: Hotel TOT (3112): $29,885,956 · STR TOT (3114): $4,513,754 · Total: $34,399,709 · YoY: n/a (prior-year month absent from dataset). Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$34.40M · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "Jan 2025",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202502-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — Feb 2025",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, Feb 2025: Hotel TOT (3112): $12,719,598 · STR TOT (3114): $188,080 · Total: $12,907,678 · YoY: -76.5%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$12.91M (-76.5% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "Feb 2025",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202503-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — Mar 2025",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, Mar 2025: Hotel TOT (3112): $29,180,544 · STR TOT (3114): $4,741,322 · Total: $33,921,866 · YoY: +25.7%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$33.92M (+25.7% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "Mar 2025",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202504-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — Apr 2025",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, Apr 2025: Hotel TOT (3112): $15,404,158 · STR TOT (3114): $176,072 · Total: $15,580,230 · YoY: -71.7%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$15.58M (-71.7% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "Apr 2025",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202505-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — May 2025",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, May 2025: Hotel TOT (3112): $32,213,392 · STR TOT (3114): $5,669,323 · Total: $37,882,716 · YoY: +51.7%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$37.88M (+51.7% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "May 2025",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202506-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — Jun 2025",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, Jun 2025: Hotel TOT (3112): $27,220,510 · STR TOT (3114): $5,535,587 · Total: $32,756,097 · YoY: +26.4%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$32.76M (+26.4% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "Jun 2025",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202507-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — Jul 2025",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, Jul 2025: Hotel TOT (3112): $20,916,315 · STR TOT (3114): $2,696,661 · Total: $23,612,977 · YoY: -20.2%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$23.61M (-20.2% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "Jul 2025",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202508-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — Aug 2025",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, Aug 2025: Hotel TOT (3112): $26,078,079 · STR TOT (3114): $369,155 · Total: $26,447,234 · YoY: -16.8%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$26.45M (-16.8% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "Aug 2025",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202509-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — Sep 2025",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, Sep 2025: Hotel TOT (3112): $28,638,194 · STR TOT (3114): $4,911,495 · Total: $33,549,689 · YoY: +43.9%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$33.55M (+43.9% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "Sep 2025",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202510-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — Oct 2025",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, Oct 2025: Hotel TOT (3112): $20,140,783 · STR TOT (3114): $2,337,418 · Total: $22,478,202 · YoY: -29.9%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$22.48M (-29.9% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "Oct 2025",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202511-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — Nov 2025",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, Nov 2025: Hotel TOT (3112): $12,378,341 · STR TOT (3114): $2,415,422 · Total: $14,793,763 · YoY: -3.8%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$14.79M (-3.8% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "Nov 2025",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202512-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — Dec 2025",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, Dec 2025: Hotel TOT (3112): $37,007,425 · STR TOT (3114): $2,677,243 · Total: $39,684,668 · YoY: +33.5%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$39.68M (+33.5% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "Dec 2025",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202601-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — Jan 2026",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, Jan 2026: Hotel TOT (3112): $24,513,666 · STR TOT (3114): $2,507,237 · Total: $27,020,903 · YoY: -21.5%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$27.02M (-21.5% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "Jan 2026",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202602-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — Feb 2026",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, Feb 2026: Hotel TOT (3112): $21,997,978 · STR TOT (3114): $3,134,386 · Total: $25,132,364 · YoY: +94.7%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$25.13M (+94.7% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "Feb 2026",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202603-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — Mar 2026",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, Mar 2026: Hotel TOT (3112): $27,387,239 · STR TOT (3114): $3,122,699 · Total: $30,509,938 · YoY: -10.1%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$30.51M (-10.1% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "Mar 2026",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202604-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — Apr 2026",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, Apr 2026: Hotel TOT (3112): $17,974,046 · STR TOT (3114): $346,158 · Total: $18,320,204 · YoY: +17.6%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$18.32M (+17.6% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "Apr 2026",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202605-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — May 2026",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, May 2026: Hotel TOT (3112): $34,110,961 · STR TOT (3114): $6,913,839 · Total: $41,024,800 · YoY: +8.3%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$41.02M (+8.3% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "May 2026",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202606-m",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT (hotel + STR), monthly cash postings — Jun 2026",
    "body": "Los Angeles city TOT (hotel + STR), monthly cash postings, Jun 2026: Hotel TOT (3112): $27,187,929 · STR TOT (3114): $3,836,164 · Total: $31,024,093 · YoY: -5.3%. Basis: cash collected; monthly postings lumpy — read FY totals; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$31.02M (-5.3% YoY) · cash collected; monthly postings lumpy — read FY totals",
    "asOf": "Jun 2026",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month (rev. sources 3112, 3114)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202506-fy",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT, fiscal-year total (sum of monthly postings) — FY2025 (Jul 2024–Jun 2025)",
    "body": "Los Angeles city TOT, fiscal-year total (sum of monthly postings), FY2025 (Jul 2024–Jun 2025): Hotel TOT: $295,966,884 · STR TOT: $33,346,691 · Total: $329,313,575 · YoY: n/a (FY2024 incomplete in dataset: Jan 2024 absent). Basis: cash collected; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$329.31M · cash collected",
    "asOf": "FY2025 (Jul 2024–Jun 2025)",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202606-fy",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT, fiscal-year total (sum of monthly postings) — FY2026 (Jul 2025–Jun 2026)",
    "body": "Los Angeles city TOT, fiscal-year total (sum of monthly postings), FY2026 (Jul 2025–Jun 2026): Hotel TOT: $298,330,957 · STR TOT: $35,267,878 · Total: $333,598,835 · YoY: +1.3%. Basis: cash collected; FY Jul–Jun. Cash postings are lumpy — months alternate large/small, so single-month YoY is posting-timing noise; read the fiscal-year totals. Posting month ≠ stay month. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$333.60M (+1.3% YoY) · cash collected",
    "asOf": "FY2026 (Jul 2025–Jun 2026)",
    "sourceLabel": "LA City Controller — Controller open data: City Revenue by Month (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://controllerdata.lacity.org/Revenue/City-Revenue-by-Month/s234-w655",
        "label": "LA City Controller — Controller open data: City Revenue by Month",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202306-sco",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT, annual (State Controller) — FY2023 (Jul 2022–Jun 2023)",
    "body": "Los Angeles city TOT, annual (State Controller), FY2023 (Jul 2022–Jun 2023): Amount: $333,178,574 · YoY: n/a. Basis: city-reported to State Controller; FY Jul–Jun. Annual cross-check as reported by the city to the State Controller; different definition from the Controller postings. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$333.18M · city-reported to State Controller",
    "asOf": "FY2023 (Jul 2022–Jun 2023)",
    "sourceLabel": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://bythenumbers.sco.ca.gov/Cities/City-Transient-Occupancy-Tax-TOT-for-Fiscal-Years-/w8wj-pebu",
        "label": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-202406-sco",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles city TOT, annual (State Controller) — FY2024 (Jul 2023–Jun 2024)",
    "body": "Los Angeles city TOT, annual (State Controller), FY2024 (Jul 2023–Jun 2024): Amount: $335,753,753 · YoY: +0.8%. Basis: city-reported to State Controller; FY Jul–Jun. Annual cross-check as reported by the city to the State Controller; different definition from the Controller postings. City TOT 14% (LA Tourism Marketing District 2% not included). Decision support.",
    "magnitude": "$335.75M (+0.8% YoY) · city-reported to State Controller",
    "asOf": "FY2024 (Jul 2023–Jun 2024)",
    "sourceLabel": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://bythenumbers.sco.ca.gov/Cities/City-Transient-Occupancy-Tax-TOT-for-Fiscal-Years-/w8wj-pebu",
        "label": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-los-angeles-000000-gaps",
    "marketSlug": "los-angeles",
    "kind": "tax",
    "title": "Los Angeles hotel-tax series — gaps",
    "body": "Los Angeles hotel-tax series gaps (as of 2026-10-11): Jul 2026 onward: not yet published. | LA Tourism Marketing District (2%) monthly assessments: no public read this pass. Decision support.",
    "magnitude": "no public read",
    "asOf": "2026-10-11",
    "sourceLabel": "Official publishers (gap note; no public read)",
    "sourceUrls": null
  },
  {
    "id": "tax-phoenix-202507-m",
    "marketSlug": "phoenix",
    "kind": "tax",
    "title": "Phoenix hotel/motel lodging tax, monthly collections ($000) — Jul 2025",
    "body": "Phoenix hotel/motel lodging tax, monthly collections ($000), Jul 2025: Convention Center fund: $1,443K · YoY (published): −6.5% · General Fund: $894K · YoY (published): −5.8%. Basis: cash collected; FY Jul–Jun. Collection month ≈ prior-month stays. General Fund YoY from Aug 2025 is inflated by the city TPT step 2.3%→2.8% (rate-driven, not demand); the Convention Center fund line shows no step-up and is the better demand read. City TPT 2.8% (raised from 2.3% in 2025) + city transient lodging tax 3.0%; state and county TPT not in this series. Decision support.",
    "magnitude": "Conv. Center $1,443K (−6.5%) · General Fund $894K (−5.8%) · cash collected",
    "asOf": "Jul 2025",
    "sourceLabel": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.phoenix.gov/content/dam/phoenix/budgetsite/documents/2025-26-revenue-report-Month11.pdf",
        "label": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-phoenix-202508-m",
    "marketSlug": "phoenix",
    "kind": "tax",
    "title": "Phoenix hotel/motel lodging tax, monthly collections ($000) — Aug 2025",
    "body": "Phoenix hotel/motel lodging tax, monthly collections ($000), Aug 2025: Convention Center fund: $1,279K · YoY (published): −6.0% · General Fund: $956K · YoY (published): +13.8%. Basis: cash collected; FY Jul–Jun. Collection month ≈ prior-month stays. General Fund YoY from Aug 2025 is inflated by the city TPT step 2.3%→2.8% (rate-driven, not demand); the Convention Center fund line shows no step-up and is the better demand read. City TPT 2.8% (raised from 2.3% in 2025) + city transient lodging tax 3.0%; state and county TPT not in this series. Decision support.",
    "magnitude": "Conv. Center $1,279K (−6.0%) · General Fund $956K (+13.8%, rate-driven, not demand) · cash collected",
    "asOf": "Aug 2025",
    "sourceLabel": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.phoenix.gov/content/dam/phoenix/budgetsite/documents/2025-26-revenue-report-Month11.pdf",
        "label": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-phoenix-202509-m",
    "marketSlug": "phoenix",
    "kind": "tax",
    "title": "Phoenix hotel/motel lodging tax, monthly collections ($000) — Sep 2025",
    "body": "Phoenix hotel/motel lodging tax, monthly collections ($000), Sep 2025: Convention Center fund: $1,258K · YoY (published): −7.7% · General Fund: $945K · YoY (published): +12.9%. Basis: cash collected; FY Jul–Jun. Collection month ≈ prior-month stays. General Fund YoY from Aug 2025 is inflated by the city TPT step 2.3%→2.8% (rate-driven, not demand); the Convention Center fund line shows no step-up and is the better demand read. City TPT 2.8% (raised from 2.3% in 2025) + city transient lodging tax 3.0%; state and county TPT not in this series. Decision support.",
    "magnitude": "Conv. Center $1,258K (−7.7%) · General Fund $945K (+12.9%, rate-driven, not demand) · cash collected",
    "asOf": "Sep 2025",
    "sourceLabel": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.phoenix.gov/content/dam/phoenix/budgetsite/documents/2025-26-revenue-report-Month11.pdf",
        "label": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-phoenix-202510-m",
    "marketSlug": "phoenix",
    "kind": "tax",
    "title": "Phoenix hotel/motel lodging tax, monthly collections ($000) — Oct 2025",
    "body": "Phoenix hotel/motel lodging tax, monthly collections ($000), Oct 2025: Convention Center fund: $1,687K · YoY (published): −7.4% · General Fund: $1,252K · YoY (published): +12.2%. Basis: cash collected; FY Jul–Jun. Collection month ≈ prior-month stays. General Fund YoY from Aug 2025 is inflated by the city TPT step 2.3%→2.8% (rate-driven, not demand); the Convention Center fund line shows no step-up and is the better demand read. City TPT 2.8% (raised from 2.3% in 2025) + city transient lodging tax 3.0%; state and county TPT not in this series. Decision support.",
    "magnitude": "Conv. Center $1,687K (−7.4%) · General Fund $1,252K (+12.2%, rate-driven, not demand) · cash collected",
    "asOf": "Oct 2025",
    "sourceLabel": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.phoenix.gov/content/dam/phoenix/budgetsite/documents/2025-26-revenue-report-Month11.pdf",
        "label": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-phoenix-202511-m",
    "marketSlug": "phoenix",
    "kind": "tax",
    "title": "Phoenix hotel/motel lodging tax, monthly collections ($000) — Nov 2025",
    "body": "Phoenix hotel/motel lodging tax, monthly collections ($000), Nov 2025: Convention Center fund: $2,626K · YoY (published): +1.5% · General Fund: $1,949K · YoY (published): +23.6%. Basis: cash collected; FY Jul–Jun. Collection month ≈ prior-month stays. General Fund YoY from Aug 2025 is inflated by the city TPT step 2.3%→2.8% (rate-driven, not demand); the Convention Center fund line shows no step-up and is the better demand read. City TPT 2.8% (raised from 2.3% in 2025) + city transient lodging tax 3.0%; state and county TPT not in this series. Decision support.",
    "magnitude": "Conv. Center $2,626K (+1.5%) · General Fund $1,949K (+23.6%, rate-driven, not demand) · cash collected",
    "asOf": "Nov 2025",
    "sourceLabel": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.phoenix.gov/content/dam/phoenix/budgetsite/documents/2025-26-revenue-report-Month11.pdf",
        "label": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-phoenix-202512-m",
    "marketSlug": "phoenix",
    "kind": "tax",
    "title": "Phoenix hotel/motel lodging tax, monthly collections ($000) — Dec 2025",
    "body": "Phoenix hotel/motel lodging tax, monthly collections ($000), Dec 2025: Convention Center fund: $2,482K · YoY (published): +6.9% · General Fund: $1,830K · YoY (published): +29.0%. Basis: cash collected; FY Jul–Jun. Collection month ≈ prior-month stays. General Fund YoY from Aug 2025 is inflated by the city TPT step 2.3%→2.8% (rate-driven, not demand); the Convention Center fund line shows no step-up and is the better demand read. City TPT 2.8% (raised from 2.3% in 2025) + city transient lodging tax 3.0%; state and county TPT not in this series. Decision support.",
    "magnitude": "Conv. Center $2,482K (+6.9%) · General Fund $1,830K (+29.0%, rate-driven, not demand) · cash collected",
    "asOf": "Dec 2025",
    "sourceLabel": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.phoenix.gov/content/dam/phoenix/budgetsite/documents/2025-26-revenue-report-Month11.pdf",
        "label": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-phoenix-202601-m",
    "marketSlug": "phoenix",
    "kind": "tax",
    "title": "Phoenix hotel/motel lodging tax, monthly collections ($000) — Jan 2026",
    "body": "Phoenix hotel/motel lodging tax, monthly collections ($000), Jan 2026: Convention Center fund: $2,128K · YoY (published): +13.4% · General Fund: $1,581K · YoY (published): +37.0%. Basis: cash collected; FY Jul–Jun. Collection month ≈ prior-month stays. General Fund YoY from Aug 2025 is inflated by the city TPT step 2.3%→2.8% (rate-driven, not demand); the Convention Center fund line shows no step-up and is the better demand read. City TPT 2.8% (raised from 2.3% in 2025) + city transient lodging tax 3.0%; state and county TPT not in this series. Decision support.",
    "magnitude": "Conv. Center $2,128K (+13.4%) · General Fund $1,581K (+37.0%, rate-driven, not demand) · cash collected",
    "asOf": "Jan 2026",
    "sourceLabel": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.phoenix.gov/content/dam/phoenix/budgetsite/documents/2025-26-revenue-report-Month11.pdf",
        "label": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-phoenix-202602-m",
    "marketSlug": "phoenix",
    "kind": "tax",
    "title": "Phoenix hotel/motel lodging tax, monthly collections ($000) — Feb 2026",
    "body": "Phoenix hotel/motel lodging tax, monthly collections ($000), Feb 2026: Convention Center fund: $2,741K · YoY (published): +14.9% · General Fund: $2,027K · YoY (published): +39.1%. Basis: cash collected; FY Jul–Jun. Collection month ≈ prior-month stays. General Fund YoY from Aug 2025 is inflated by the city TPT step 2.3%→2.8% (rate-driven, not demand); the Convention Center fund line shows no step-up and is the better demand read. City TPT 2.8% (raised from 2.3% in 2025) + city transient lodging tax 3.0%; state and county TPT not in this series. Decision support.",
    "magnitude": "Conv. Center $2,741K (+14.9%) · General Fund $2,027K (+39.1%, rate-driven, not demand) · cash collected",
    "asOf": "Feb 2026",
    "sourceLabel": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.phoenix.gov/content/dam/phoenix/budgetsite/documents/2025-26-revenue-report-Month11.pdf",
        "label": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-phoenix-202603-m",
    "marketSlug": "phoenix",
    "kind": "tax",
    "title": "Phoenix hotel/motel lodging tax, monthly collections ($000) — Mar 2026",
    "body": "Phoenix hotel/motel lodging tax, monthly collections ($000), Mar 2026: Convention Center fund: $3,556K · YoY (published): +7.8% · General Fund: $2,652K · YoY (published): +32.1%. Basis: cash collected; FY Jul–Jun. Collection month ≈ prior-month stays. General Fund YoY from Aug 2025 is inflated by the city TPT step 2.3%→2.8% (rate-driven, not demand); the Convention Center fund line shows no step-up and is the better demand read. City TPT 2.8% (raised from 2.3% in 2025) + city transient lodging tax 3.0%; state and county TPT not in this series. Decision support.",
    "magnitude": "Conv. Center $3,556K (+7.8%) · General Fund $2,652K (+32.1%, rate-driven, not demand) · cash collected",
    "asOf": "Mar 2026",
    "sourceLabel": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.phoenix.gov/content/dam/phoenix/budgetsite/documents/2025-26-revenue-report-Month11.pdf",
        "label": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-phoenix-202604-m",
    "marketSlug": "phoenix",
    "kind": "tax",
    "title": "Phoenix hotel/motel lodging tax, monthly collections ($000) — Apr 2026",
    "body": "Phoenix hotel/motel lodging tax, monthly collections ($000), Apr 2026: Convention Center fund: $4,054K · YoY (published): +10.6% · General Fund: $3,002K · YoY (published): +33.3%. Basis: cash collected; FY Jul–Jun. Collection month ≈ prior-month stays. General Fund YoY from Aug 2025 is inflated by the city TPT step 2.3%→2.8% (rate-driven, not demand); the Convention Center fund line shows no step-up and is the better demand read. City TPT 2.8% (raised from 2.3% in 2025) + city transient lodging tax 3.0%; state and county TPT not in this series. Decision support.",
    "magnitude": "Conv. Center $4,054K (+10.6%) · General Fund $3,002K (+33.3%, rate-driven, not demand) · cash collected",
    "asOf": "Apr 2026",
    "sourceLabel": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.phoenix.gov/content/dam/phoenix/budgetsite/documents/2025-26-revenue-report-Month11.pdf",
        "label": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-phoenix-202605-m",
    "marketSlug": "phoenix",
    "kind": "tax",
    "title": "Phoenix hotel/motel lodging tax, monthly collections ($000) — May 2026",
    "body": "Phoenix hotel/motel lodging tax, monthly collections ($000), May 2026: Convention Center fund: $2,818K · YoY (published): +8.1% · General Fund: $2,105K · YoY (published): +31.8%. Basis: cash collected; FY Jul–Jun. Collection month ≈ prior-month stays. General Fund YoY from Aug 2025 is inflated by the city TPT step 2.3%→2.8% (rate-driven, not demand); the Convention Center fund line shows no step-up and is the better demand read. City TPT 2.8% (raised from 2.3% in 2025) + city transient lodging tax 3.0%; state and county TPT not in this series. Decision support.",
    "magnitude": "Conv. Center $2,818K (+8.1%) · General Fund $2,105K (+31.8%, rate-driven, not demand) · cash collected",
    "asOf": "May 2026",
    "sourceLabel": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.phoenix.gov/content/dam/phoenix/budgetsite/documents/2025-26-revenue-report-Month11.pdf",
        "label": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-phoenix-202605-fy",
    "marketSlug": "phoenix",
    "kind": "tax",
    "title": "Phoenix hotel/motel lodging tax, fiscal-year view — FY2026 YTD Jul 2025–May 2026, Convention Center fund",
    "body": "Phoenix hotel/motel lodging tax, fiscal-year view, FY2026 YTD Jul 2025–May 2026, Convention Center fund: Amount: $26,072K · YoY: n/a (prior-year YTD for this line not stated). Basis: cash collected; sum of monthly figures (arithmetic); FY Jul–Jun. Collection month ≈ prior-month stays. General Fund YoY from Aug 2025 is inflated by the city TPT step 2.3%→2.8% (rate-driven, not demand); the Convention Center fund line shows no step-up and is the better demand read. City TPT 2.8% (raised from 2.3% in 2025) + city transient lodging tax 3.0%; state and county TPT not in this series. Decision support.",
    "magnitude": "$26,072K · cash collected; sum of monthly figures (arithmetic)",
    "asOf": "FY2026 YTD Jul 2025–May 2026, Convention Center fund",
    "sourceLabel": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.phoenix.gov/content/dam/phoenix/budgetsite/documents/2025-26-revenue-report-Month11.pdf",
        "label": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-phoenix-202605-fy2",
    "marketSlug": "phoenix",
    "kind": "tax",
    "title": "Phoenix hotel/motel lodging tax, fiscal-year view — FY2026 YTD Jul 2025–May 2026, General Fund",
    "body": "Phoenix hotel/motel lodging tax, fiscal-year view, FY2026 YTD Jul 2025–May 2026, General Fund: Amount: $19,193K · YoY: n/a. Basis: cash collected; sum of monthly figures (arithmetic); FY Jul–Jun. Collection month ≈ prior-month stays. General Fund YoY from Aug 2025 is inflated by the city TPT step 2.3%→2.8% (rate-driven, not demand); the Convention Center fund line shows no step-up and is the better demand read. City TPT 2.8% (raised from 2.3% in 2025) + city transient lodging tax 3.0%; state and county TPT not in this series. Decision support.",
    "magnitude": "$19,193K · cash collected; sum of monthly figures (arithmetic)",
    "asOf": "FY2026 YTD Jul 2025–May 2026, General Fund",
    "sourceLabel": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.phoenix.gov/content/dam/phoenix/budgetsite/documents/2025-26-revenue-report-Month11.pdf",
        "label": "City of Phoenix Budget & Research — FY2025-26 Revenue Report, Month 11",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-phoenix-000000-gaps",
    "marketSlug": "phoenix",
    "kind": "tax",
    "title": "Phoenix hotel-tax series — gaps",
    "body": "Phoenix hotel-tax series gaps (as of 2026-10-11): June 2026 (Month 12): image-only PDF, not transcribed — no public read in machine-readable form this pass. | FY2027 (Jul 2026+): not pulled / not yet published. | Scottsdale / Tempe / Maricopa County lodging tax series: not covered. Decision support.",
    "magnitude": "no public read",
    "asOf": "2026-10-11",
    "sourceLabel": "Official publishers (gap note; no public read)",
    "sourceUrls": null
  },
  {
    "id": "tax-honolulu-202406-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — Jun 2024",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, Jun 2024: Oʻahu TAT liability: $33,951,723 · YoY: +5.1% · Oʻahu TA tax base: $319,576,141 · Base YoY: +5.2%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$33.95M (+5.1% YoY; base +5.2%) · tax owed (liability)",
    "asOf": "Jun 2024",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Jun 2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/archive/202406liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Jun 2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202407-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — Jul 2024",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, Jul 2024: Oʻahu TAT liability: $34,594,393 · YoY: +8.5% · Oʻahu TA tax base: $325,447,790 · Base YoY: +8.7%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$34.59M (+8.5% YoY; base +8.7%) · tax owed (liability)",
    "asOf": "Jul 2024",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Jul 2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/archive/202407liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Jul 2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202408-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — Aug 2024",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, Aug 2024: Oʻahu TAT liability: $31,339,782 · YoY: +1.8% · Oʻahu TA tax base: $294,157,557 · Base YoY: +1.8%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$31.34M (+1.8% YoY; base +1.8%) · tax owed (liability)",
    "asOf": "Aug 2024",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Aug 2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/archive/202408liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Aug 2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202409-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — Sep 2024",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, Sep 2024: Oʻahu TAT liability: $26,297,902 · YoY: -6.7% · Oʻahu TA tax base: $244,428,286 · Base YoY: -7.7%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$26.30M (-6.7% YoY; base -7.7%) · tax owed (liability)",
    "asOf": "Sep 2024",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Sep 2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/archive/202409liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Sep 2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202410-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — Oct 2024",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, Oct 2024: Oʻahu TAT liability: $25,599,680 · YoY: -3.5% · Oʻahu TA tax base: $238,030,777 · Base YoY: -4.2%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$25.60M (-3.5% YoY; base -4.2%) · tax owed (liability)",
    "asOf": "Oct 2024",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Oct 2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/archive/202410liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Oct 2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202411-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — Nov 2024",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, Nov 2024: Oʻahu TAT liability: $24,422,501 · YoY: -4.4% · Oʻahu TA tax base: $226,166,941 · Base YoY: -5.1%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$24.42M (-4.4% YoY; base -5.1%) · tax owed (liability)",
    "asOf": "Nov 2024",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Nov 2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/archive/202411liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Nov 2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202412-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — Dec 2024",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, Dec 2024: Oʻahu TAT liability: $35,191,535 · YoY: +6.1% · Oʻahu TA tax base: $331,722,764 · Base YoY: +6.0%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$35.19M (+6.1% YoY; base +6.0%) · tax owed (liability)",
    "asOf": "Dec 2024",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Dec 2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/archive/202412liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Dec 2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202501-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — Jan 2025",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, Jan 2025: Oʻahu TAT liability: $29,404,463 · YoY: +2.4% · Oʻahu TA tax base: $274,838,767 · Base YoY: +2.2%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$29.40M (+2.4% YoY; base +2.2%) · tax owed (liability)",
    "asOf": "Jan 2025",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Jan 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/archive/202501liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Jan 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202502-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — Feb 2025",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, Feb 2025: Oʻahu TAT liability: $26,741,407 · YoY: -8.3% · Oʻahu TA tax base: $250,510,820 · Base YoY: -8.4%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$26.74M (-8.3% YoY; base -8.4%) · tax owed (liability)",
    "asOf": "Feb 2025",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Feb 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/archive/202502liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Feb 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202503-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — Mar 2025",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, Mar 2025: Oʻahu TAT liability: $30,207,641 · YoY: -4.7% · Oʻahu TA tax base: $281,906,976 · Base YoY: -5.1%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$30.21M (-4.7% YoY; base -5.1%) · tax owed (liability)",
    "asOf": "Mar 2025",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Mar 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/archive/202503liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Mar 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202504-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — Apr 2025",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, Apr 2025: Oʻahu TAT liability: $27,671,807 · YoY: +5.5% · Oʻahu TA tax base: $258,064,819 · Base YoY: +5.2%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$27.67M (+5.5% YoY; base +5.2%) · tax owed (liability)",
    "asOf": "Apr 2025",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Apr 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/archive/202504liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Apr 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202505-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — May 2025",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, May 2025: Oʻahu TAT liability: $26,534,833 · YoY: -1.2% · Oʻahu TA tax base: $247,193,759 · Base YoY: -1.5%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$26.53M (-1.2% YoY; base -1.5%) · tax owed (liability)",
    "asOf": "May 2025",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, May 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/archive/202505liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, May 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202506-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — Jun 2025",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, Jun 2025: Oʻahu TAT liability: $32,874,870 · YoY: -3.2% · Oʻahu TA tax base: $308,379,200 · Base YoY: -3.5%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$32.87M (-3.2% YoY; base -3.5%) · tax owed (liability)",
    "asOf": "Jun 2025",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Jun 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/archive/202506liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Jun 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202507-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — Jul 2025",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, Jul 2025: Oʻahu TAT liability: $33,150,196 · YoY: -4.2% · Oʻahu TA tax base: $310,776,029 · Base YoY: -4.5%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$33.15M (-4.2% YoY; base -4.5%) · tax owed (liability)",
    "asOf": "Jul 2025",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Jul 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/202507liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Jul 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202508-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — Aug 2025",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, Aug 2025: Oʻahu TAT liability: $30,517,056 · YoY: -2.6% · Oʻahu TA tax base: $285,579,535 · Base YoY: -2.9%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$30.52M (-2.6% YoY; base -2.9%) · tax owed (liability)",
    "asOf": "Aug 2025",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Aug 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/202508liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Aug 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202509-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — Sep 2025",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, Sep 2025: Oʻahu TAT liability: $26,241,408 · YoY: -0.2% · Oʻahu TA tax base: $243,327,527 · Base YoY: -0.5%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$26.24M (-0.2% YoY; base -0.5%) · tax owed (liability)",
    "asOf": "Sep 2025",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Sep 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/202509liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Sep 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202510-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — Oct 2025",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, Oct 2025: Oʻahu TAT liability: $26,369,605 · YoY: +3.0% · Oʻahu TA tax base: $245,000,052 · Base YoY: +2.9%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$26.37M (+3.0% YoY; base +2.9%) · tax owed (liability)",
    "asOf": "Oct 2025",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Oct 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/202510liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Oct 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202511-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — Nov 2025",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, Nov 2025: Oʻahu TAT liability: $25,384,804 · YoY: +3.9% · Oʻahu TA tax base: $235,315,910 · Base YoY: +4.0%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$25.38M (+3.9% YoY; base +4.0%) · tax owed (liability)",
    "asOf": "Nov 2025",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Nov 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/202511liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Nov 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202512-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — Dec 2025",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, Dec 2025: Oʻahu TAT liability: $36,972,715 · YoY: +5.1% · Oʻahu TA tax base: $348,804,529 · Base YoY: +5.1%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$36.97M (+5.1% YoY; base +5.1%) · tax owed (liability)",
    "asOf": "Dec 2025",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Dec 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/202512liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Dec 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202601-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — Jan 2026",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, Jan 2026: Oʻahu TAT liability: $31,701,981 · YoY: +7.8% · Oʻahu TA tax base: $275,493,322 · Base YoY: +0.2%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$31.70M (+7.8% YoY, rate-driven 10.25%→11%, not demand; base +0.2%) · tax owed (liability)",
    "asOf": "Jan 2026",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Jan 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/202601liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Jan 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202602-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — Feb 2026",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, Feb 2026: Oʻahu TAT liability: $28,195,992 · YoY: +5.4% · Oʻahu TA tax base: $244,293,503 · Base YoY: -2.5%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$28.20M (+5.4% YoY, rate-driven 10.25%→11%, not demand; base -2.5%) · tax owed (liability)",
    "asOf": "Feb 2026",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Feb 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/202602liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Feb 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202603-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — Mar 2026",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, Mar 2026: Oʻahu TAT liability: $31,553,661 · YoY: +4.5% · Oʻahu TA tax base: $273,403,379 · Base YoY: -3.0%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$31.55M (+4.5% YoY, rate-driven 10.25%→11%, not demand; base -3.0%) · tax owed (liability)",
    "asOf": "Mar 2026",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Mar 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/202603liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Mar 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202604-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — Apr 2026",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, Apr 2026: Oʻahu TAT liability: $28,770,531 · YoY: +4.0% · Oʻahu TA tax base: $249,071,074 · Base YoY: -3.5%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$28.77M (+4.0% YoY, rate-driven 10.25%→11%, not demand; base -3.5%) · tax owed (liability)",
    "asOf": "Apr 2026",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Apr 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/202604liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, Apr 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202605-m",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu Oʻahu TAT liability (tax owed), monthly — May 2026",
    "body": "Honolulu Oʻahu TAT liability (tax owed), monthly, May 2026: Oʻahu TAT liability: $28,856,798 · YoY: +8.8% · Oʻahu TA tax base: $249,266,104 · Base YoY: +0.8%. Basis: tax owed (liability); filing period ≈ activity month. Liability is tax owed on reported activity (Form TA-1), not cash received. Jan 2026+ liability YoY is mostly the 10.25%→11% rate step (+7.3% mechanical) — rate-driven, not demand; use the rate-neutral tax-base YoY for demand. State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$28.86M (+8.8% YoY, rate-driven 10.25%→11%, not demand; base +0.8%) · tax owed (liability)",
    "asOf": "May 2026",
    "sourceLabel": "HI Dept. of Taxation — DOTAX TAT liabilities by district, May 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/stats/monthly/202605liab-by-d_tat.pdf",
        "label": "HI Dept. of Taxation — DOTAX TAT liabilities by district, May 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202507-sw",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu statewide TAT cash collections, monthly — Jul 2025",
    "body": "Honolulu statewide TAT cash collections, monthly, Jul 2025: FY2026: $74M · FY2025 same month: $74M · YoY: +0.40% (published). Basis: cash collected, statewide; FY Jul–Jun. Statewide cash collections, all islands — no island split and no rate-neutral figure; Jan–Jun 2026 YoY includes the 10.25%→11% rate step (rate-driven, not demand). State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$74M (+0.40% YoY) · cash collected, statewide",
    "asOf": "Jul 2025",
    "sourceLabel": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/useful/cor/2026-09-03-COR-GF-Presentation-DOTAX.pdf",
        "label": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202508-sw",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu statewide TAT cash collections, monthly — Aug 2025",
    "body": "Honolulu statewide TAT cash collections, monthly, Aug 2025: FY2026: $75M · FY2025 same month: $75M · YoY: +0.54% (published). Basis: cash collected, statewide; FY Jul–Jun. Statewide cash collections, all islands — no island split and no rate-neutral figure; Jan–Jun 2026 YoY includes the 10.25%→11% rate step (rate-driven, not demand). State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$75M (+0.54% YoY) · cash collected, statewide",
    "asOf": "Aug 2025",
    "sourceLabel": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/useful/cor/2026-09-03-COR-GF-Presentation-DOTAX.pdf",
        "label": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202509-sw",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu statewide TAT cash collections, monthly — Sep 2025",
    "body": "Honolulu statewide TAT cash collections, monthly, Sep 2025: FY2026: $67M · FY2025 same month: $65M · YoY: +2.90% (published). Basis: cash collected, statewide; FY Jul–Jun. Statewide cash collections, all islands — no island split and no rate-neutral figure; Jan–Jun 2026 YoY includes the 10.25%→11% rate step (rate-driven, not demand). State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$67M (+2.90% YoY) · cash collected, statewide",
    "asOf": "Sep 2025",
    "sourceLabel": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/useful/cor/2026-09-03-COR-GF-Presentation-DOTAX.pdf",
        "label": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202510-sw",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu statewide TAT cash collections, monthly — Oct 2025",
    "body": "Honolulu statewide TAT cash collections, monthly, Oct 2025: FY2026: $57M · FY2025 same month: $57M · YoY: +0.66% (published). Basis: cash collected, statewide; FY Jul–Jun. Statewide cash collections, all islands — no island split and no rate-neutral figure; Jan–Jun 2026 YoY includes the 10.25%→11% rate step (rate-driven, not demand). State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$57M (+0.66% YoY) · cash collected, statewide",
    "asOf": "Oct 2025",
    "sourceLabel": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/useful/cor/2026-09-03-COR-GF-Presentation-DOTAX.pdf",
        "label": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202511-sw",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu statewide TAT cash collections, monthly — Nov 2025",
    "body": "Honolulu statewide TAT cash collections, monthly, Nov 2025: FY2026: $60M · FY2025 same month: $57M · YoY: +5.19% (published). Basis: cash collected, statewide; FY Jul–Jun. Statewide cash collections, all islands — no island split and no rate-neutral figure; Jan–Jun 2026 YoY includes the 10.25%→11% rate step (rate-driven, not demand). State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$60M (+5.19% YoY) · cash collected, statewide",
    "asOf": "Nov 2025",
    "sourceLabel": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/useful/cor/2026-09-03-COR-GF-Presentation-DOTAX.pdf",
        "label": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202512-sw",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu statewide TAT cash collections, monthly — Dec 2025",
    "body": "Honolulu statewide TAT cash collections, monthly, Dec 2025: FY2026: $61M · FY2025 same month: $59M · YoY: +2.92% (published). Basis: cash collected, statewide; FY Jul–Jun. Statewide cash collections, all islands — no island split and no rate-neutral figure; Jan–Jun 2026 YoY includes the 10.25%→11% rate step (rate-driven, not demand). State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$61M (+2.92% YoY) · cash collected, statewide",
    "asOf": "Dec 2025",
    "sourceLabel": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/useful/cor/2026-09-03-COR-GF-Presentation-DOTAX.pdf",
        "label": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202601-sw",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu statewide TAT cash collections, monthly — Jan 2026",
    "body": "Honolulu statewide TAT cash collections, monthly, Jan 2026: FY2026: $90M · FY2025 same month: $83M · YoY: +8.65% (published). Basis: cash collected, statewide; FY Jul–Jun. Statewide cash collections, all islands — no island split and no rate-neutral figure; Jan–Jun 2026 YoY includes the 10.25%→11% rate step (rate-driven, not demand). State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$90M (+8.65% YoY, includes 10.25%→11% rate step) · cash collected, statewide",
    "asOf": "Jan 2026",
    "sourceLabel": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/useful/cor/2026-09-03-COR-GF-Presentation-DOTAX.pdf",
        "label": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202602-sw",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu statewide TAT cash collections, monthly — Feb 2026",
    "body": "Honolulu statewide TAT cash collections, monthly, Feb 2026: FY2026: $82M · FY2025 same month: $74M · YoY: +10.38% (published). Basis: cash collected, statewide; FY Jul–Jun. Statewide cash collections, all islands — no island split and no rate-neutral figure; Jan–Jun 2026 YoY includes the 10.25%→11% rate step (rate-driven, not demand). State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$82M (+10.38% YoY, includes 10.25%→11% rate step) · cash collected, statewide",
    "asOf": "Feb 2026",
    "sourceLabel": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/useful/cor/2026-09-03-COR-GF-Presentation-DOTAX.pdf",
        "label": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202603-sw",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu statewide TAT cash collections, monthly — Mar 2026",
    "body": "Honolulu statewide TAT cash collections, monthly, Mar 2026: FY2026: $77M · FY2025 same month: $69M · YoY: +10.64% (published). Basis: cash collected, statewide; FY Jul–Jun. Statewide cash collections, all islands — no island split and no rate-neutral figure; Jan–Jun 2026 YoY includes the 10.25%→11% rate step (rate-driven, not demand). State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$77M (+10.64% YoY, includes 10.25%→11% rate step) · cash collected, statewide",
    "asOf": "Mar 2026",
    "sourceLabel": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/useful/cor/2026-09-03-COR-GF-Presentation-DOTAX.pdf",
        "label": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202604-sw",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu statewide TAT cash collections, monthly — Apr 2026",
    "body": "Honolulu statewide TAT cash collections, monthly, Apr 2026: FY2026: $84M · FY2025 same month: $78M · YoY: +6.73% (published). Basis: cash collected, statewide; FY Jul–Jun. Statewide cash collections, all islands — no island split and no rate-neutral figure; Jan–Jun 2026 YoY includes the 10.25%→11% rate step (rate-driven, not demand). State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$84M (+6.73% YoY, includes 10.25%→11% rate step) · cash collected, statewide",
    "asOf": "Apr 2026",
    "sourceLabel": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/useful/cor/2026-09-03-COR-GF-Presentation-DOTAX.pdf",
        "label": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202605-sw",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu statewide TAT cash collections, monthly — May 2026",
    "body": "Honolulu statewide TAT cash collections, monthly, May 2026: FY2026: $72M · FY2025 same month: $68M · YoY: +7.13% (published). Basis: cash collected, statewide; FY Jul–Jun. Statewide cash collections, all islands — no island split and no rate-neutral figure; Jan–Jun 2026 YoY includes the 10.25%→11% rate step (rate-driven, not demand). State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$72M (+7.13% YoY, includes 10.25%→11% rate step) · cash collected, statewide",
    "asOf": "May 2026",
    "sourceLabel": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/useful/cor/2026-09-03-COR-GF-Presentation-DOTAX.pdf",
        "label": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202606-sw",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu statewide TAT cash collections, monthly — Jun 2026",
    "body": "Honolulu statewide TAT cash collections, monthly, Jun 2026: FY2026: $69M · FY2025 same month: $57M · YoY: +20.28% (published). Basis: cash collected, statewide; FY Jul–Jun. Statewide cash collections, all islands — no island split and no rate-neutral figure; Jan–Jun 2026 YoY includes the 10.25%→11% rate step (rate-driven, not demand). State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$69M (+20.28% YoY, includes 10.25%→11% rate step) · cash collected, statewide",
    "asOf": "Jun 2026",
    "sourceLabel": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/useful/cor/2026-09-03-COR-GF-Presentation-DOTAX.pdf",
        "label": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202606-swfy",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu statewide TAT cash collections, fiscal year — FY2026 (Jul 2025–Jun 2026)",
    "body": "Honolulu statewide TAT cash collections, fiscal year, FY2026 (Jul 2025–Jun 2026): Amount: $868M · YoY: +6.32% (published). Basis: cash collected, statewide; FY Jul–Jun. Statewide cash collections, all islands; FY2026 includes six months at the higher 11% rate (rate-driven, not demand). State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$868M (+6.32% YoY, includes 10.25%→11% rate step) · cash collected, statewide",
    "asOf": "FY2026 (Jul 2025–Jun 2026)",
    "sourceLabel": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/useful/cor/2026-09-03-COR-GF-Presentation-DOTAX.pdf",
        "label": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-202506-swfy",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu statewide TAT cash collections, fiscal year — FY2025 (Jul 2024–Jun 2025)",
    "body": "Honolulu statewide TAT cash collections, fiscal year, FY2025 (Jul 2024–Jun 2025): Amount: $816M · YoY: −1.47% (published). Basis: cash collected, statewide; FY Jul–Jun. Statewide cash collections, all islands; FY2026 includes six months at the higher 11% rate (rate-driven, not demand). State TAT 10.25% → 11.00% from 2026-01-01; Oʻahu county TAT (3%) not included. Decision support.",
    "magnitude": "$816M (−1.47% YoY) · cash collected, statewide",
    "asOf": "FY2025 (Jul 2024–Jun 2025)",
    "sourceLabel": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://files.hawaii.gov/tax/useful/cor/2026-09-03-COR-GF-Presentation-DOTAX.pdf",
        "label": "HI Dept. of Taxation — DOTAX General Fund forecast deck, 2026-09-03",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-honolulu-000000-gaps",
    "marketSlug": "honolulu",
    "kind": "tax",
    "title": "Honolulu hotel-tax series — gaps",
    "body": "Honolulu hotel-tax series gaps (as of 2026-10-11): June 2026 onward: not yet published by DOTAX (as of 2026-10-11). | Oʻahu county TAT (3%) monthly collections: no public read this pass. Decision support.",
    "magnitude": "no public read",
    "asOf": "2026-10-11",
    "sourceLabel": "Official publishers (gap note; no public read)",
    "sourceUrls": null
  },
  {
    "id": "tax-chicago-202507-m",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago MPEA hotel tax, monthly collections — Jul 2025",
    "body": "Chicago MPEA hotel tax, monthly collections, Jul 2025: Collections: $6,287,778 · Prior-year month: $5,083,415 · YoY: +23.7%. Basis: cash collected (state-remitted); FY Jul–Jun. Collection month ≠ stay month (state remittance lag). Jul–Aug 2026 collections likely carry World Cup displacement — treat as non-recurring when comping 2027. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$6.29M (+23.7% YoY) · cash collected (state-remitted)",
    "asOf": "Jul 2025",
    "sourceLabel": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, July 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.mpea.com/wp-content/uploads/2025/09/MPEA-Tax-Collections-July-2025.pdf",
        "label": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, July 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202508-m",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago MPEA hotel tax, monthly collections — Aug 2025",
    "body": "Chicago MPEA hotel tax, monthly collections, Aug 2025: Collections: $8,877,467 · Prior-year month: $7,993,011 · YoY: +11.1%. Basis: cash collected (state-remitted); FY Jul–Jun. Collection month ≠ stay month (state remittance lag). Jul–Aug 2026 collections likely carry World Cup displacement — treat as non-recurring when comping 2027. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$8.88M (+11.1% YoY) · cash collected (state-remitted)",
    "asOf": "Aug 2025",
    "sourceLabel": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, August 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.mpea.com/wp-content/uploads/2025/09/MPEA-Tax-Collections-August-2025.pdf",
        "label": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, August 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202509-m",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago MPEA hotel tax, monthly collections — Sep 2025",
    "body": "Chicago MPEA hotel tax, monthly collections, Sep 2025: Collections: $9,105,219 · Prior-year month: $8,092,255 · YoY: +12.5%. Basis: cash collected (state-remitted); FY Jul–Jun. Collection month ≠ stay month (state remittance lag). Jul–Aug 2026 collections likely carry World Cup displacement — treat as non-recurring when comping 2027. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$9.11M (+12.5% YoY) · cash collected (state-remitted)",
    "asOf": "Sep 2025",
    "sourceLabel": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, September 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.mpea.com/wp-content/uploads/2025/10/MPEA-Tax-Collections-September-2025.pdf",
        "label": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, September 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202510-m",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago MPEA hotel tax, monthly collections — Oct 2025",
    "body": "Chicago MPEA hotel tax, monthly collections, Oct 2025: Collections: $8,763,746 · Prior-year month: $7,966,877 · YoY: +10.0%. Basis: cash collected (state-remitted); FY Jul–Jun. Collection month ≠ stay month (state remittance lag). Jul–Aug 2026 collections likely carry World Cup displacement — treat as non-recurring when comping 2027. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$8.76M (+10.0% YoY) · cash collected (state-remitted)",
    "asOf": "Oct 2025",
    "sourceLabel": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, October 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.mpea.com/wp-content/uploads/2025/11/MPEA-Tax-Collections-October-2025.pdf",
        "label": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, October 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202511-m",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago MPEA hotel tax, monthly collections — Nov 2025",
    "body": "Chicago MPEA hotel tax, monthly collections, Nov 2025: Collections: $8,133,041 · Prior-year month: $8,381,700 · YoY: -3.0%. Derived, not published as a line: YTD Dec $49,655,294 − Dec $8,488,042 − YTD Oct $33,034,211 (prior year $45,610,628 − $8,093,369 − $29,135,559). Basis: cash collected (state-remitted); derived from published YTDs; FY Jul–Jun. Collection month ≠ stay month (state remittance lag). Jul–Aug 2026 collections likely carry World Cup displacement — treat as non-recurring when comping 2027. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$8.13M (-3.0% YoY) · cash collected (state-remitted); derived from published YTDs",
    "asOf": "Nov 2025",
    "sourceLabel": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, December 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.mpea.com/wp-content/uploads/2026/01/MPEA-Tax-Collections-December-2025.pdf",
        "label": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, December 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202512-m",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago MPEA hotel tax, monthly collections — Dec 2025",
    "body": "Chicago MPEA hotel tax, monthly collections, Dec 2025: Collections: $8,488,042 · Prior-year month: $8,093,369 · YoY: +4.9%. Basis: cash collected (state-remitted); FY Jul–Jun. Collection month ≠ stay month (state remittance lag). Jul–Aug 2026 collections likely carry World Cup displacement — treat as non-recurring when comping 2027. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$8.49M (+4.9% YoY) · cash collected (state-remitted)",
    "asOf": "Dec 2025",
    "sourceLabel": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, December 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.mpea.com/wp-content/uploads/2026/01/MPEA-Tax-Collections-December-2025.pdf",
        "label": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, December 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202601-m",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago MPEA hotel tax, monthly collections — Jan 2026",
    "body": "Chicago MPEA hotel tax, monthly collections, Jan 2026: Collections: $9,139,356 · Prior-year month: $8,626,243 · YoY: +5.9%. Basis: cash collected (state-remitted); FY Jul–Jun. Collection month ≠ stay month (state remittance lag). Jul–Aug 2026 collections likely carry World Cup displacement — treat as non-recurring when comping 2027. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$9.14M (+5.9% YoY) · cash collected (state-remitted)",
    "asOf": "Jan 2026",
    "sourceLabel": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, January 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.mpea.com/wp-content/uploads/2026/02/MPEA-Tax-Collections-January-2026.pdf",
        "label": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, January 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202602-m",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago MPEA hotel tax, monthly collections — Feb 2026",
    "body": "Chicago MPEA hotel tax, monthly collections, Feb 2026: Collections: $5,670,159 · Prior-year month: $6,602,320 · YoY: -14.1%. Basis: cash collected (state-remitted); FY Jul–Jun. Collection month ≠ stay month (state remittance lag). Jul–Aug 2026 collections likely carry World Cup displacement — treat as non-recurring when comping 2027. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$5.67M (-14.1% YoY) · cash collected (state-remitted)",
    "asOf": "Feb 2026",
    "sourceLabel": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, February 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.mpea.com/wp-content/uploads/2026/03/MPEA-Tax-Collections-February-2026.pdf",
        "label": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, February 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202603-m",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago MPEA hotel tax, monthly collections — Mar 2026",
    "body": "Chicago MPEA hotel tax, monthly collections, Mar 2026: Collections: $4,171,161 · Prior-year month: $4,809,828 · YoY: -13.3%. Basis: cash collected (state-remitted); FY Jul–Jun. Collection month ≠ stay month (state remittance lag). Jul–Aug 2026 collections likely carry World Cup displacement — treat as non-recurring when comping 2027. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$4.17M (-13.3% YoY) · cash collected (state-remitted)",
    "asOf": "Mar 2026",
    "sourceLabel": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, March 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.mpea.com/wp-content/uploads/2026/04/MPEA-Tax-Collections-March-2026.pdf",
        "label": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, March 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202604-m",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago MPEA hotel tax, monthly collections — Apr 2026",
    "body": "Chicago MPEA hotel tax, monthly collections, Apr 2026: Collections: $2,805,359 · Prior-year month: $2,729,517 · YoY: +2.8%. Basis: cash collected (state-remitted); FY Jul–Jun. Collection month ≠ stay month (state remittance lag). Jul–Aug 2026 collections likely carry World Cup displacement — treat as non-recurring when comping 2027. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$2.81M (+2.8% YoY) · cash collected (state-remitted)",
    "asOf": "Apr 2026",
    "sourceLabel": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, April 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.mpea.com/wp-content/uploads/2026/06/MPEA-Tax-Collections-April-2026.pdf",
        "label": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, April 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202605-m",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago MPEA hotel tax, monthly collections — May 2026",
    "body": "Chicago MPEA hotel tax, monthly collections, May 2026: Collections: $3,402,566 · Prior-year month: $3,353,221 · YoY: +1.5%. Basis: cash collected (state-remitted); FY Jul–Jun. Collection month ≠ stay month (state remittance lag). Jul–Aug 2026 collections likely carry World Cup displacement — treat as non-recurring when comping 2027. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$3.40M (+1.5% YoY) · cash collected (state-remitted)",
    "asOf": "May 2026",
    "sourceLabel": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, May 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.mpea.com/wp-content/uploads/2026/06/MPEA-Tax-Collections-May-2026.pdf",
        "label": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, May 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202606-m",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago MPEA hotel tax, monthly collections — Jun 2026",
    "body": "Chicago MPEA hotel tax, monthly collections, Jun 2026: no public read (report not retrievable this pass). Gap note kept as written; no figure loaded.",
    "magnitude": "no public read",
    "asOf": "Jun 2026",
    "sourceLabel": "Metropolitan Pier and Exposition Authority (no public read)",
    "sourceUrls": null
  },
  {
    "id": "tax-chicago-202607-m",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago MPEA hotel tax, monthly collections — Jul 2026",
    "body": "Chicago MPEA hotel tax, monthly collections, Jul 2026: Collections: $6,738,224 · Prior-year month: $6,287,778 · YoY: +7.2%. Basis: cash collected (state-remitted); FY Jul–Jun. Collection month ≠ stay month (state remittance lag). Jul–Aug 2026 collections likely carry World Cup displacement — treat as non-recurring when comping 2027. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$6.74M (+7.2% YoY) · cash collected (state-remitted)",
    "asOf": "Jul 2026",
    "sourceLabel": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, July 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.mpea.com/wp-content/uploads/2026/09/MPEA-Tax-Collections-July-2026.pdf",
        "label": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, July 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202608-m",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago MPEA hotel tax, monthly collections — Aug 2026",
    "body": "Chicago MPEA hotel tax, monthly collections, Aug 2026: Collections: $9,865,320 · Prior-year month: $8,877,467 · YoY: +11.1%. Basis: cash collected (state-remitted); FY Jul–Jun. Collection month ≠ stay month (state remittance lag). Jul–Aug 2026 collections likely carry World Cup displacement — treat as non-recurring when comping 2027. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$9.87M (+11.1% YoY) · cash collected (state-remitted)",
    "asOf": "Aug 2026",
    "sourceLabel": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, August 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.mpea.com/wp-content/uploads/2026/09/MPEA-Tax-Collections-August-2026.pdf",
        "label": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, August 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202605-fy",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago MPEA hotel tax, fiscal-year / YTD — FY2026 YTD Jul 2025–May 2026",
    "body": "Chicago MPEA hotel tax, fiscal-year / YTD, FY2026 YTD Jul 2025–May 2026: Collections: $74,843,896 · Prior year: $71,731,757 · YoY: +4.3%. Basis: cash collected (state-remitted); FY Jul–Jun. Collection month ≠ stay month (state remittance lag). Jul–Aug 2026 collections likely carry World Cup displacement — treat as non-recurring when comping 2027. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$74.84M (+4.3% YoY) · cash collected (state-remitted)",
    "asOf": "FY2026 YTD Jul 2025–May 2026",
    "sourceLabel": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, May 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.mpea.com/wp-content/uploads/2026/06/MPEA-Tax-Collections-May-2026.pdf",
        "label": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, May 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202306-fy",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago MPEA hotel tax, fiscal-year / YTD — FY2023 (Jul 2022–Jun 2023), annual",
    "body": "Chicago MPEA hotel tax, fiscal-year / YTD, FY2023 (Jul 2022–Jun 2023), annual: Collections: $63,705,499 · YoY: n/a. Basis: cash collected (state-remitted); FY Jul–Jun. Collection month ≠ stay month (state remittance lag). Jul–Aug 2026 collections likely carry World Cup displacement — treat as non-recurring when comping 2027. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$63.71M · cash collected (state-remitted)",
    "asOf": "FY2023 (Jul 2022–Jun 2023), annual",
    "sourceLabel": "Metropolitan Pier and Exposition Authority — MPEA Authority Tax Collections FY2023–FY2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.mpea.com/wp-content/uploads/2026/01/MPEA-Tax-Collections-FY2023-FY2025.pdf",
        "label": "Metropolitan Pier and Exposition Authority — MPEA Authority Tax Collections FY2023–FY2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202406-fy",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago MPEA hotel tax, fiscal-year / YTD — FY2024 (Jul 2023–Jun 2024), annual",
    "body": "Chicago MPEA hotel tax, fiscal-year / YTD, FY2024 (Jul 2023–Jun 2024), annual: Collections: $67,531,181 · Prior year: $63,705,499 · YoY: +6.0% (computed). Basis: cash collected (state-remitted); FY Jul–Jun. Collection month ≠ stay month (state remittance lag). Jul–Aug 2026 collections likely carry World Cup displacement — treat as non-recurring when comping 2027. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$67.53M (+6.0% YoY) · cash collected (state-remitted)",
    "asOf": "FY2024 (Jul 2023–Jun 2024), annual",
    "sourceLabel": "Metropolitan Pier and Exposition Authority — MPEA Authority Tax Collections FY2023–FY2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.mpea.com/wp-content/uploads/2026/01/MPEA-Tax-Collections-FY2023-FY2025.pdf",
        "label": "Metropolitan Pier and Exposition Authority — MPEA Authority Tax Collections FY2023–FY2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202608-fy",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago MPEA hotel tax, fiscal-year / YTD — FY2027 YTD Jul–Aug 2026",
    "body": "Chicago MPEA hotel tax, fiscal-year / YTD, FY2027 YTD Jul–Aug 2026: Collections: $16,603,544 · Prior year: $15,165,245 · YoY: +9.5%. Basis: cash collected (state-remitted); FY Jul–Jun. Collection month ≠ stay month (state remittance lag). Jul–Aug 2026 collections likely carry World Cup displacement — treat as non-recurring when comping 2027. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$16.60M (+9.5% YoY) · cash collected (state-remitted)",
    "asOf": "FY2027 YTD Jul–Aug 2026",
    "sourceLabel": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, August 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.mpea.com/wp-content/uploads/2026/09/MPEA-Tax-Collections-August-2026.pdf",
        "label": "Metropolitan Pier and Exposition Authority — MPEA Monthly Authority Tax Collections, August 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202602-city",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago City hotel accommodations tax, 2026 monthly — Feb 2026",
    "body": "Chicago City hotel accommodations tax, 2026 monthly, Feb 2026: Collections: $5,194,000 · YoY: n/a (no 2025 monthly hotel line published). Basis: point-in-time, revised; no YoY published; City FY = calendar year. City HAT monthly figures are point-in-time and revised between reports (Jul 2026 $20,713K → $20,752K); no 2025 monthly line, so no YoY. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$5.19M · point-in-time, revised; no YoY published",
    "asOf": "Feb 2026",
    "sourceLabel": "City of Chicago OBM — OBM Monthly Revenue Report, August 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.chicago.gov/content/dam/city/depts/obm/2027_Operations/Monthly_Revenue_Report/Monthly_Revenue_Report_August_2026.pdf",
        "label": "City of Chicago OBM — OBM Monthly Revenue Report, August 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202603-city",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago City hotel accommodations tax, 2026 monthly — Mar 2026",
    "body": "Chicago City hotel accommodations tax, 2026 monthly, Mar 2026: Collections: $6,418,000 · YoY: n/a (no 2025 monthly hotel line published). Basis: point-in-time, revised; no YoY published; City FY = calendar year. City HAT monthly figures are point-in-time and revised between reports (Jul 2026 $20,713K → $20,752K); no 2025 monthly line, so no YoY. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$6.42M · point-in-time, revised; no YoY published",
    "asOf": "Mar 2026",
    "sourceLabel": "City of Chicago OBM — OBM Monthly Revenue Report, August 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.chicago.gov/content/dam/city/depts/obm/2027_Operations/Monthly_Revenue_Report/Monthly_Revenue_Report_August_2026.pdf",
        "label": "City of Chicago OBM — OBM Monthly Revenue Report, August 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202604-city",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago City hotel accommodations tax, 2026 monthly — Apr 2026",
    "body": "Chicago City hotel accommodations tax, 2026 monthly, Apr 2026: Collections: $9,990,000 · YoY: n/a (no 2025 monthly hotel line published). Basis: point-in-time, revised; no YoY published; City FY = calendar year. City HAT monthly figures are point-in-time and revised between reports (Jul 2026 $20,713K → $20,752K); no 2025 monthly line, so no YoY. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$9.99M · point-in-time, revised; no YoY published",
    "asOf": "Apr 2026",
    "sourceLabel": "City of Chicago OBM — OBM Monthly Revenue Report, August 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.chicago.gov/content/dam/city/depts/obm/2027_Operations/Monthly_Revenue_Report/Monthly_Revenue_Report_August_2026.pdf",
        "label": "City of Chicago OBM — OBM Monthly Revenue Report, August 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202605-city",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago City hotel accommodations tax, 2026 monthly — May 2026",
    "body": "Chicago City hotel accommodations tax, 2026 monthly, May 2026: Collections: $12,318,000 · YoY: n/a (no 2025 monthly hotel line published). Basis: point-in-time, revised; no YoY published; City FY = calendar year. City HAT monthly figures are point-in-time and revised between reports (Jul 2026 $20,713K → $20,752K); no 2025 monthly line, so no YoY. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$12.32M · point-in-time, revised; no YoY published",
    "asOf": "May 2026",
    "sourceLabel": "City of Chicago OBM — OBM Monthly Revenue Report, August 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.chicago.gov/content/dam/city/depts/obm/2027_Operations/Monthly_Revenue_Report/Monthly_Revenue_Report_August_2026.pdf",
        "label": "City of Chicago OBM — OBM Monthly Revenue Report, August 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202606-city",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago City hotel accommodations tax, 2026 monthly — Jun 2026",
    "body": "Chicago City hotel accommodations tax, 2026 monthly, Jun 2026: Collections: $18,491,000 · YoY: n/a (no 2025 monthly hotel line published). Basis: point-in-time, revised; no YoY published; City FY = calendar year. City HAT monthly figures are point-in-time and revised between reports (Jul 2026 $20,713K → $20,752K); no 2025 monthly line, so no YoY. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$18.49M · point-in-time, revised; no YoY published",
    "asOf": "Jun 2026",
    "sourceLabel": "City of Chicago OBM — OBM Monthly Revenue Report, August 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.chicago.gov/content/dam/city/depts/obm/2027_Operations/Monthly_Revenue_Report/Monthly_Revenue_Report_August_2026.pdf",
        "label": "City of Chicago OBM — OBM Monthly Revenue Report, August 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202607-city",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago City hotel accommodations tax, 2026 monthly — Jul 2026",
    "body": "Chicago City hotel accommodations tax, 2026 monthly, Jul 2026: Collections: $20,752,000 · YoY: n/a (no 2025 monthly hotel line published). Basis: point-in-time, revised; no YoY published; City FY = calendar year. City HAT monthly figures are point-in-time and revised between reports (Jul 2026 $20,713K → $20,752K); no 2025 monthly line, so no YoY. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$20.75M · point-in-time, revised; no YoY published",
    "asOf": "Jul 2026",
    "sourceLabel": "City of Chicago OBM — OBM Monthly Revenue Report, August 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.chicago.gov/content/dam/city/depts/obm/2027_Operations/Monthly_Revenue_Report/Monthly_Revenue_Report_August_2026.pdf",
        "label": "City of Chicago OBM — OBM Monthly Revenue Report, August 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202608-city",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago City hotel accommodations tax, 2026 monthly — Aug 2026",
    "body": "Chicago City hotel accommodations tax, 2026 monthly, Aug 2026: Collections: $18,751,000 · YoY: n/a (no 2025 monthly hotel line published). Basis: point-in-time, revised; no YoY published; City FY = calendar year. City HAT monthly figures are point-in-time and revised between reports (Jul 2026 $20,713K → $20,752K); no 2025 monthly line, so no YoY. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$18.75M · point-in-time, revised; no YoY published",
    "asOf": "Aug 2026",
    "sourceLabel": "City of Chicago OBM — OBM Monthly Revenue Report, August 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.chicago.gov/content/dam/city/depts/obm/2027_Operations/Monthly_Revenue_Report/Monthly_Revenue_Report_August_2026.pdf",
        "label": "City of Chicago OBM — OBM Monthly Revenue Report, August 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-202608-city2",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago City hotel accommodations tax, 2026 monthly — 2026 YTD through Aug",
    "body": "Chicago City hotel accommodations tax, 2026 monthly, 2026 YTD through Aug: Collections: $91,914,000 · YoY: n/a. Basis: point-in-time, revised; no YoY published; City FY = calendar year. City HAT monthly figures are point-in-time and revised between reports (Jul 2026 $20,713K → $20,752K); no 2025 monthly line, so no YoY. MPEA hotel tax 2.5% (state-collected, remitted to MPEA); City Hotel Accommodations Tax 4.5%. Decision support.",
    "magnitude": "$91.91M · point-in-time, revised; no YoY published",
    "asOf": "2026 YTD through Aug",
    "sourceLabel": "City of Chicago OBM — OBM Monthly Revenue Report, August 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.chicago.gov/content/dam/city/depts/obm/2027_Operations/Monthly_Revenue_Report/Monthly_Revenue_Report_August_2026.pdf",
        "label": "City of Chicago OBM — OBM Monthly Revenue Report, August 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-chicago-000000-gaps",
    "marketSlug": "chicago",
    "kind": "tax",
    "title": "Chicago hotel-tax series — gaps",
    "body": "Chicago hotel-tax series gaps (as of 2026-10-11): MPEA Jun 2026: the report URL hit a bot check repeatedly — no public read this pass. | Sep 2026 MPEA report: not yet posted. | City HAT 2025 monthly: no public read (not in the 2025 OBM reports). | Illinois state HOOT (6%) Chicago-only monthly: no public read this pass. Decision support.",
    "magnitude": "no public read",
    "asOf": "2026-10-11",
    "sourceLabel": "Official publishers (gap note; no public read)",
    "sourceUrls": null
  },
  {
    "id": "tax-san-diego-202509-ytd",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego General Fund TOT, fiscal YTD (base 10.5%) — FY2026 YTD through Sep 2025",
    "body": "San Diego General Fund TOT, fiscal YTD (base 10.5%), FY2026 YTD through Sep 2025: GF TOT YTD: $32,294,483 · Prior-yr YTD: $34,786,125 · GF YoY (published): −7.2% · TOT Fund YTD: $28,264,472 · Prior-yr YTD: $30,867,459 · TOT Fund YoY (computed): -8.4%. Basis: fiscal-YTD financial report; rate-neutral; FY Jul–Jun. Base-TOT series exclude the Measure C increment, so their YoY is rate-neutral. YTD figures are financial-report figures and may be restated; single months are differences of published YTDs. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "GF YTD $32.29M (−7.2%) · TOT Fund YTD $28.26M (-8.4%) · fiscal-YTD financial report; rate-neutral",
    "asOf": "FY2026 YTD through Sep 2025",
    "sourceLabel": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Sep 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiego.gov/sites/default/files/2025-11/charter-39-report-period-ending-september-2025.pdf",
        "label": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Sep 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202510-ytd",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego General Fund TOT, fiscal YTD (base 10.5%) — FY2026 YTD through Oct 2025",
    "body": "San Diego General Fund TOT, fiscal YTD (base 10.5%), FY2026 YTD through Oct 2025: GF TOT YTD: $45,659,303 · Prior-yr YTD: $49,271,953 · GF YoY (published): −7.3% · TOT Fund YTD: $40,490,114 · Prior-yr YTD: $43,824,844 · TOT Fund YoY (computed): -7.6%. Basis: fiscal-YTD financial report; rate-neutral; FY Jul–Jun. Base-TOT series exclude the Measure C increment, so their YoY is rate-neutral. YTD figures are financial-report figures and may be restated; single months are differences of published YTDs. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "GF YTD $45.66M (−7.3%) · TOT Fund YTD $40.49M (-7.6%) · fiscal-YTD financial report; rate-neutral",
    "asOf": "FY2026 YTD through Oct 2025",
    "sourceLabel": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Oct 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiego.gov/sites/default/files/2025-11/charter-39-report-period-ending-october-2025.pdf",
        "label": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Oct 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202511-ytd",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego General Fund TOT, fiscal YTD (base 10.5%) — FY2026 YTD through Nov 2025",
    "body": "San Diego General Fund TOT, fiscal YTD (base 10.5%), FY2026 YTD through Nov 2025: GF TOT YTD: $58,332,593 · Prior-yr YTD: $62,823,016 · GF YoY (published): −7.1% · TOT Fund YTD: $52,102,146 · Prior-yr YTD: $56,516,802 · TOT Fund YoY (computed): -7.8%. Basis: fiscal-YTD financial report; rate-neutral; FY Jul–Jun. Base-TOT series exclude the Measure C increment, so their YoY is rate-neutral. YTD figures are financial-report figures and may be restated; single months are differences of published YTDs. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "GF YTD $58.33M (−7.1%) · TOT Fund YTD $52.10M (-7.8%) · fiscal-YTD financial report; rate-neutral",
    "asOf": "FY2026 YTD through Nov 2025",
    "sourceLabel": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Nov 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiego.gov/sites/default/files/2026-01/charter-39-report-period-ending-november-2025.pdf",
        "label": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Nov 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202512-ytd",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego General Fund TOT, fiscal YTD (base 10.5%) — FY2026 YTD through Dec 2025",
    "body": "San Diego General Fund TOT, fiscal YTD (base 10.5%), FY2026 YTD through Dec 2025: GF TOT YTD: $69,005,169 · Prior-yr YTD: $74,263,688 · GF YoY (published): −7.1% · TOT Fund YTD: $61,556,291 · Prior-yr YTD: $66,872,713 · TOT Fund YoY (computed): -8.0%. Basis: fiscal-YTD financial report; rate-neutral; FY Jul–Jun. Base-TOT series exclude the Measure C increment, so their YoY is rate-neutral. YTD figures are financial-report figures and may be restated; single months are differences of published YTDs. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "GF YTD $69.01M (−7.1%) · TOT Fund YTD $61.56M (-8.0%) · fiscal-YTD financial report; rate-neutral",
    "asOf": "FY2026 YTD through Dec 2025",
    "sourceLabel": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Dec 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiego.gov/sites/default/files/2026-01/charter-39-report-period-ending-december-2025.pdf",
        "label": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Dec 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202601-ytd",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego General Fund TOT, fiscal YTD (base 10.5%) — FY2026 YTD through Jan 2026",
    "body": "San Diego General Fund TOT, fiscal YTD (base 10.5%), FY2026 YTD through Jan 2026: GF TOT YTD: $78,431,465 · Prior-yr YTD: $84,386,239 · GF YoY (published): −7.1% · TOT Fund YTD: $70,129,052 · Prior-yr YTD: $76,022,711 · TOT Fund YoY (computed): -7.8%. Basis: fiscal-YTD financial report; rate-neutral; FY Jul–Jun. Base-TOT series exclude the Measure C increment, so their YoY is rate-neutral. YTD figures are financial-report figures and may be restated; single months are differences of published YTDs. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "GF YTD $78.43M (−7.1%) · TOT Fund YTD $70.13M (-7.8%) · fiscal-YTD financial report; rate-neutral",
    "asOf": "FY2026 YTD through Jan 2026",
    "sourceLabel": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Jan 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiego.gov/sites/default/files/2026-02/charter-39-report-period-ending-january-2026.pdf",
        "label": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Jan 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202602-ytd",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego General Fund TOT, fiscal YTD (base 10.5%) — FY2026 YTD through Feb 2026",
    "body": "San Diego General Fund TOT, fiscal YTD (base 10.5%), FY2026 YTD through Feb 2026: GF TOT YTD: $89,442,167 · Prior-yr YTD: $95,376,309 · GF YoY (published): −6.2% · TOT Fund YTD: $80,101,780 · Prior-yr YTD: $86,050,594 · TOT Fund YoY (computed): -6.9%. Basis: fiscal-YTD financial report; rate-neutral; FY Jul–Jun. Base-TOT series exclude the Measure C increment, so their YoY is rate-neutral. YTD figures are financial-report figures and may be restated; single months are differences of published YTDs. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "GF YTD $89.44M (−6.2%) · TOT Fund YTD $80.10M (-6.9%) · fiscal-YTD financial report; rate-neutral",
    "asOf": "FY2026 YTD through Feb 2026",
    "sourceLabel": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Feb 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiego.gov/sites/default/files/2026-03/charter-39-report-period-ending-february-2026.pdf",
        "label": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Feb 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202603-ytd",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego General Fund TOT, fiscal YTD (base 10.5%) — FY2026 YTD through Mar 2026",
    "body": "San Diego General Fund TOT, fiscal YTD (base 10.5%), FY2026 YTD through Mar 2026: GF TOT YTD: $102,664,368 · Prior-yr YTD: $106,942,949 · GF YoY (published): −4.0% · TOT Fund YTD: $92,046,460 · Prior-yr YTD: $96,565,148 · TOT Fund YoY (computed): -4.7%. Basis: fiscal-YTD financial report; rate-neutral; FY Jul–Jun. Base-TOT series exclude the Measure C increment, so their YoY is rate-neutral. YTD figures are financial-report figures and may be restated; single months are differences of published YTDs. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "GF YTD $102.66M (−4.0%) · TOT Fund YTD $92.05M (-4.7%) · fiscal-YTD financial report; rate-neutral",
    "asOf": "FY2026 YTD through Mar 2026",
    "sourceLabel": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Mar 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiego.gov/sites/default/files/2026-05/charter-39-report-period-ending-march-2026.pdf",
        "label": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Mar 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202604-ytd",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego General Fund TOT, fiscal YTD (base 10.5%) — FY2026 YTD through Apr 2026",
    "body": "San Diego General Fund TOT, fiscal YTD (base 10.5%), FY2026 YTD through Apr 2026: GF TOT YTD: $118,423,616 · Prior-yr YTD: $120,101,640 · GF YoY (published): −1.4% · TOT Fund YTD: $106,436,095 · Prior-yr YTD: $108,432,250 · TOT Fund YoY (computed): -1.8%. Basis: fiscal-YTD financial report; rate-neutral; FY Jul–Jun. Base-TOT series exclude the Measure C increment, so their YoY is rate-neutral. YTD figures are financial-report figures and may be restated; single months are differences of published YTDs. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "GF YTD $118.42M (−1.4%) · TOT Fund YTD $106.44M (-1.8%) · fiscal-YTD financial report; rate-neutral",
    "asOf": "FY2026 YTD through Apr 2026",
    "sourceLabel": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Apr 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiego.gov/sites/default/files/2026-05/charter-39-report-period-ending-april-2026.pdf",
        "label": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Apr 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202605-ytd",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego General Fund TOT, fiscal YTD (base 10.5%) — FY2026 YTD through May 2026",
    "body": "San Diego General Fund TOT, fiscal YTD (base 10.5%), FY2026 YTD through May 2026: GF TOT YTD: $133,070,649 · Prior-yr YTD: $133,144,769 · GF YoY (published): −0.1% · TOT Fund YTD: $119,698,309 · Prior-yr YTD: $120,437,216 · TOT Fund YoY (computed): -0.6%. Basis: fiscal-YTD financial report; rate-neutral; FY Jul–Jun. Base-TOT series exclude the Measure C increment, so their YoY is rate-neutral. YTD figures are financial-report figures and may be restated; single months are differences of published YTDs. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "GF YTD $133.07M (−0.1%) · TOT Fund YTD $119.70M (-0.6%) · fiscal-YTD financial report; rate-neutral",
    "asOf": "FY2026 YTD through May 2026",
    "sourceLabel": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending May 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiego.gov/sites/default/files/2026-06/charter-39-report-period-ending-may-2026.pdf",
        "label": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending May 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202510-m",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego General Fund TOT, single month (derived) — Oct 2025",
    "body": "San Diego General Fund TOT, single month (derived), Oct 2025: GF TOT (month): $13,364,820 · Prior-yr month: $14,485,828 · YoY: -7.7%. Basis: derived month (arithmetic); rate-neutral; FY Jul–Jun. Base-TOT series exclude the Measure C increment, so their YoY is rate-neutral. YTD figures are financial-report figures and may be restated; single months are differences of published YTDs. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "$13.36M (-7.7% YoY) · derived month (arithmetic); rate-neutral",
    "asOf": "Oct 2025",
    "sourceLabel": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Oct 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiego.gov/sites/default/files/2025-11/charter-39-report-period-ending-october-2025.pdf",
        "label": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Oct 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202511-m",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego General Fund TOT, single month (derived) — Nov 2025",
    "body": "San Diego General Fund TOT, single month (derived), Nov 2025: GF TOT (month): $12,673,290 · Prior-yr month: $13,551,063 · YoY: -6.5%. Basis: derived month (arithmetic); rate-neutral; FY Jul–Jun. Base-TOT series exclude the Measure C increment, so their YoY is rate-neutral. YTD figures are financial-report figures and may be restated; single months are differences of published YTDs. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "$12.67M (-6.5% YoY) · derived month (arithmetic); rate-neutral",
    "asOf": "Nov 2025",
    "sourceLabel": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Nov 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiego.gov/sites/default/files/2026-01/charter-39-report-period-ending-november-2025.pdf",
        "label": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Nov 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202512-m",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego General Fund TOT, single month (derived) — Dec 2025",
    "body": "San Diego General Fund TOT, single month (derived), Dec 2025: GF TOT (month): $10,672,576 · Prior-yr month: $11,440,672 · YoY: -6.7%. Basis: derived month (arithmetic); rate-neutral; FY Jul–Jun. Base-TOT series exclude the Measure C increment, so their YoY is rate-neutral. YTD figures are financial-report figures and may be restated; single months are differences of published YTDs. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "$10.67M (-6.7% YoY) · derived month (arithmetic); rate-neutral",
    "asOf": "Dec 2025",
    "sourceLabel": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Dec 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiego.gov/sites/default/files/2026-01/charter-39-report-period-ending-december-2025.pdf",
        "label": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Dec 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202601-m",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego General Fund TOT, single month (derived) — Jan 2026",
    "body": "San Diego General Fund TOT, single month (derived), Jan 2026: GF TOT (month): $9,426,296 · Prior-yr month: $10,122,551 · YoY: -6.9%. Basis: derived month (arithmetic); rate-neutral; FY Jul–Jun. Base-TOT series exclude the Measure C increment, so their YoY is rate-neutral. YTD figures are financial-report figures and may be restated; single months are differences of published YTDs. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "$9.43M (-6.9% YoY) · derived month (arithmetic); rate-neutral",
    "asOf": "Jan 2026",
    "sourceLabel": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Jan 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiego.gov/sites/default/files/2026-02/charter-39-report-period-ending-january-2026.pdf",
        "label": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Jan 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202602-m",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego General Fund TOT, single month (derived) — Feb 2026",
    "body": "San Diego General Fund TOT, single month (derived), Feb 2026: GF TOT (month): $11,010,702 · Prior-yr month: $10,990,070 · YoY: +0.2%. Basis: derived month (arithmetic); rate-neutral; FY Jul–Jun. Base-TOT series exclude the Measure C increment, so their YoY is rate-neutral. YTD figures are financial-report figures and may be restated; single months are differences of published YTDs. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "$11.01M (+0.2% YoY) · derived month (arithmetic); rate-neutral",
    "asOf": "Feb 2026",
    "sourceLabel": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Feb 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiego.gov/sites/default/files/2026-03/charter-39-report-period-ending-february-2026.pdf",
        "label": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Feb 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202603-m",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego General Fund TOT, single month (derived) — Mar 2026",
    "body": "San Diego General Fund TOT, single month (derived), Mar 2026: GF TOT (month): $13,222,201 · Prior-yr month: $11,566,640 · YoY: +14.3%. Basis: derived month (arithmetic); rate-neutral; FY Jul–Jun. Base-TOT series exclude the Measure C increment, so their YoY is rate-neutral. YTD figures are financial-report figures and may be restated; single months are differences of published YTDs. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "$13.22M (+14.3% YoY) · derived month (arithmetic); rate-neutral",
    "asOf": "Mar 2026",
    "sourceLabel": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Mar 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiego.gov/sites/default/files/2026-05/charter-39-report-period-ending-march-2026.pdf",
        "label": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Mar 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202604-m",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego General Fund TOT, single month (derived) — Apr 2026",
    "body": "San Diego General Fund TOT, single month (derived), Apr 2026: GF TOT (month): $15,759,248 · Prior-yr month: $13,158,691 · YoY: +19.8%. Basis: derived month (arithmetic); rate-neutral; FY Jul–Jun. Base-TOT series exclude the Measure C increment, so their YoY is rate-neutral. YTD figures are financial-report figures and may be restated; single months are differences of published YTDs. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "$15.76M (+19.8% YoY) · derived month (arithmetic); rate-neutral",
    "asOf": "Apr 2026",
    "sourceLabel": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Apr 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiego.gov/sites/default/files/2026-05/charter-39-report-period-ending-april-2026.pdf",
        "label": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending Apr 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202605-m",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego General Fund TOT, single month (derived) — May 2026",
    "body": "San Diego General Fund TOT, single month (derived), May 2026: GF TOT (month): $14,647,033 · Prior-yr month: $13,043,129 · YoY: +12.3%. Basis: derived month (arithmetic); rate-neutral; FY Jul–Jun. Base-TOT series exclude the Measure C increment, so their YoY is rate-neutral. YTD figures are financial-report figures and may be restated; single months are differences of published YTDs. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "$14.65M (+12.3% YoY) · derived month (arithmetic); rate-neutral",
    "asOf": "May 2026",
    "sourceLabel": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending May 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiego.gov/sites/default/files/2026-06/charter-39-report-period-ending-may-2026.pdf",
        "label": "City of San Diego (Dept. of Finance, Charter Sec. 39 report) — Charter 39 report, period ending May 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202605-mc",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego Measure C TOT increment, fiscal YTD — TOT – Convention Center, YTD May 2026",
    "body": "San Diego Measure C TOT increment, fiscal YTD, TOT – Convention Center, YTD May 2026: Amount: $37,131,070 · YoY: n/a (new tax; prior-year YTD ≈ $0). Basis: Measure C increment (new tax); FY Jul–Jun. Measure C increment funds (from 2025-05-01) — a new tax, so no meaningful YoY; rate-driven, not demand. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "$37.13M · Measure C increment (new tax)",
    "asOf": "TOT – Convention Center, YTD May 2026",
    "sourceLabel": "City of San Diego — Charter 39 report, period ending May 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiego.gov/sites/default/files/2026-06/charter-39-report-period-ending-may-2026.pdf",
        "label": "City of San Diego — Charter 39 report, period ending May 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202605-mc2",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego Measure C TOT increment, fiscal YTD — TOT – Homelessness, YTD May 2026",
    "body": "San Diego Measure C TOT increment, fiscal YTD, TOT – Homelessness, YTD May 2026: Amount: $25,692,677 · YoY: n/a (new tax). Basis: Measure C increment (new tax); FY Jul–Jun. Measure C increment funds (from 2025-05-01) — a new tax, so no meaningful YoY; rate-driven, not demand. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "$25.69M · Measure C increment (new tax)",
    "asOf": "TOT – Homelessness, YTD May 2026",
    "sourceLabel": "City of San Diego — Charter 39 report, period ending May 2026 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.sandiego.gov/sites/default/files/2026-06/charter-39-report-period-ending-may-2026.pdf",
        "label": "City of San Diego — Charter 39 report, period ending May 2026",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-201706-sco",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego city TOT, annual (State Controller) — FY2017 (Jul 2016–Jun 2017)",
    "body": "San Diego city TOT, annual (State Controller), FY2017 (Jul 2016–Jun 2017): Amount: $222,228,402 · YoY (computed): n/a. Basis: city-reported to State Controller; FY Jul–Jun. Annual, all funds, as reported by the city to the State Controller; differs in definition from the Charter 39 reports. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "$222.23M · city-reported to State Controller",
    "asOf": "FY2017 (Jul 2016–Jun 2017)",
    "sourceLabel": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://bythenumbers.sco.ca.gov/Cities/City-Transient-Occupancy-Tax-TOT-for-Fiscal-Years-/w8wj-pebu",
        "label": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-201806-sco",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego city TOT, annual (State Controller) — FY2018 (Jul 2017–Jun 2018)",
    "body": "San Diego city TOT, annual (State Controller), FY2018 (Jul 2017–Jun 2018): Amount: $231,862,793 · YoY (computed): +4.3%. Basis: city-reported to State Controller; FY Jul–Jun. Annual, all funds, as reported by the city to the State Controller; differs in definition from the Charter 39 reports. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "$231.86M (+4.3% YoY) · city-reported to State Controller",
    "asOf": "FY2018 (Jul 2017–Jun 2018)",
    "sourceLabel": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://bythenumbers.sco.ca.gov/Cities/City-Transient-Occupancy-Tax-TOT-for-Fiscal-Years-/w8wj-pebu",
        "label": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-201906-sco",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego city TOT, annual (State Controller) — FY2019 (Jul 2018–Jun 2019)",
    "body": "San Diego city TOT, annual (State Controller), FY2019 (Jul 2018–Jun 2019): Amount: $250,883,489 · YoY (computed): +8.2%. Basis: city-reported to State Controller; FY Jul–Jun. Annual, all funds, as reported by the city to the State Controller; differs in definition from the Charter 39 reports. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "$250.88M (+8.2% YoY) · city-reported to State Controller",
    "asOf": "FY2019 (Jul 2018–Jun 2019)",
    "sourceLabel": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://bythenumbers.sco.ca.gov/Cities/City-Transient-Occupancy-Tax-TOT-for-Fiscal-Years-/w8wj-pebu",
        "label": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202006-sco",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego city TOT, annual (State Controller) — FY2020 (Jul 2019–Jun 2020)",
    "body": "San Diego city TOT, annual (State Controller), FY2020 (Jul 2019–Jun 2020): Amount: $181,180,553 · YoY (computed): -27.8%. Basis: city-reported to State Controller; FY Jul–Jun. Annual, all funds, as reported by the city to the State Controller; differs in definition from the Charter 39 reports. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "$181.18M (-27.8% YoY) · city-reported to State Controller",
    "asOf": "FY2020 (Jul 2019–Jun 2020)",
    "sourceLabel": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://bythenumbers.sco.ca.gov/Cities/City-Transient-Occupancy-Tax-TOT-for-Fiscal-Years-/w8wj-pebu",
        "label": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202106-sco",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego city TOT, annual (State Controller) — FY2021 (Jul 2020–Jun 2021)",
    "body": "San Diego city TOT, annual (State Controller), FY2021 (Jul 2020–Jun 2021): Amount: $128,309,913 · YoY (computed): -29.2%. Basis: city-reported to State Controller; FY Jul–Jun. Annual, all funds, as reported by the city to the State Controller; differs in definition from the Charter 39 reports. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "$128.31M (-29.2% YoY) · city-reported to State Controller",
    "asOf": "FY2021 (Jul 2020–Jun 2021)",
    "sourceLabel": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://bythenumbers.sco.ca.gov/Cities/City-Transient-Occupancy-Tax-TOT-for-Fiscal-Years-/w8wj-pebu",
        "label": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202206-sco",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego city TOT, annual (State Controller) — FY2022 (Jul 2021–Jun 2022)",
    "body": "San Diego city TOT, annual (State Controller), FY2022 (Jul 2021–Jun 2022): Amount: $259,109,645 · YoY (computed): +101.9%. Basis: city-reported to State Controller; FY Jul–Jun. Annual, all funds, as reported by the city to the State Controller; differs in definition from the Charter 39 reports. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "$259.11M (+101.9% YoY) · city-reported to State Controller",
    "asOf": "FY2022 (Jul 2021–Jun 2022)",
    "sourceLabel": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://bythenumbers.sco.ca.gov/Cities/City-Transient-Occupancy-Tax-TOT-for-Fiscal-Years-/w8wj-pebu",
        "label": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202306-sco",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego city TOT, annual (State Controller) — FY2023 (Jul 2022–Jun 2023)",
    "body": "San Diego city TOT, annual (State Controller), FY2023 (Jul 2022–Jun 2023): Amount: $308,074,645 · YoY (computed): +18.9%. Basis: city-reported to State Controller; FY Jul–Jun. Annual, all funds, as reported by the city to the State Controller; differs in definition from the Charter 39 reports. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "$308.07M (+18.9% YoY) · city-reported to State Controller",
    "asOf": "FY2023 (Jul 2022–Jun 2023)",
    "sourceLabel": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://bythenumbers.sco.ca.gov/Cities/City-Transient-Occupancy-Tax-TOT-for-Fiscal-Years-/w8wj-pebu",
        "label": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-202406-sco",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego city TOT, annual (State Controller) — FY2024 (Jul 2023–Jun 2024)",
    "body": "San Diego city TOT, annual (State Controller), FY2024 (Jul 2023–Jun 2024): Amount: $310,930,107 · YoY (computed): +0.9%. Basis: city-reported to State Controller; FY Jul–Jun. Annual, all funds, as reported by the city to the State Controller; differs in definition from the Charter 39 reports. City TOT 10.5% base; Measure C (from 2025-05-01) adds 1.25–3.25 pts booked in separate funds; TMD 2% not included. Decision support.",
    "magnitude": "$310.93M (+0.9% YoY) · city-reported to State Controller",
    "asOf": "FY2024 (Jul 2023–Jun 2024)",
    "sourceLabel": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://bythenumbers.sco.ca.gov/Cities/City-Transient-Occupancy-Tax-TOT-for-Fiscal-Years-/w8wj-pebu",
        "label": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-diego-000000-gaps",
    "marketSlug": "san-diego",
    "kind": "tax",
    "title": "San Diego hotel-tax series — gaps",
    "body": "San Diego hotel-tax series gaps (as of 2026-10-11): Jul–Aug 2025 period reports and Jun 2026 year-end: not pulled / not posted — no public read this pass. | FY2025 and FY2026 State Controller annual: not yet in the SCO dataset (ends FY2024). | TMD (2%) assessment collections: no public read this pass. Decision support.",
    "magnitude": "no public read",
    "asOf": "2026-10-11",
    "sourceLabel": "Official publishers (gap note; no public read)",
    "sourceUrls": null
  },
  {
    "id": "tax-san-francisco-bay-201906-fy",
    "marketSlug": "san-francisco-bay",
    "kind": "tax",
    "title": "SF Bay Area SF hotel tax, all funds (Controller) — FY2018-19 (Jul 2018–Jun 2019)",
    "body": "SF Bay Area SF hotel tax, all funds (Controller), FY2018-19 (Jul 2018–Jun 2019): Amount: $414.3M · YoY: n/a. Basis: budgetary actual (Controller); FY Jul–Jun. Controller all-funds and State Controller city-reported figures differ in definition and timing — don't mix them for YoY. SF TOT 14%; Tourism Improvement District and Moscone Expansion District assessments not included (TID temporary +1% expires 2026-10-31). Decision support.",
    "magnitude": "$414.3M · budgetary actual (Controller)",
    "asOf": "FY2018-19 (Jul 2018–Jun 2019)",
    "sourceLabel": "SF Controller's Office — Five-Year Financial Plan Update (Controller) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://sfgov.legistar.com/View.ashx?GUID=075BE0E5-0D55-4892-AFCB-DE03F998ECC7&ID=15190255&M=F",
        "label": "SF Controller's Office — Five-Year Financial Plan Update (Controller)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-francisco-bay-202006-fy",
    "marketSlug": "san-francisco-bay",
    "kind": "tax",
    "title": "SF Bay Area SF hotel tax, all funds (Controller) — FY2019-20 (Jul 2019–Jun 2020)",
    "body": "SF Bay Area SF hotel tax, all funds (Controller), FY2019-20 (Jul 2019–Jun 2020): Amount: $281.6M · YoY: -32.0% (computed). Basis: budgetary actual (Controller); FY Jul–Jun. Controller all-funds and State Controller city-reported figures differ in definition and timing — don't mix them for YoY. SF TOT 14%; Tourism Improvement District and Moscone Expansion District assessments not included (TID temporary +1% expires 2026-10-31). Decision support.",
    "magnitude": "$281.6M (-32.0% YoY) · budgetary actual (Controller)",
    "asOf": "FY2019-20 (Jul 2019–Jun 2020)",
    "sourceLabel": "SF Controller's Office — Five-Year Financial Plan Update (Controller) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://sfgov.legistar.com/View.ashx?GUID=075BE0E5-0D55-4892-AFCB-DE03F998ECC7&ID=15190255&M=F",
        "label": "SF Controller's Office — Five-Year Financial Plan Update (Controller)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-francisco-bay-202106-fy",
    "marketSlug": "san-francisco-bay",
    "kind": "tax",
    "title": "SF Bay Area SF hotel tax, all funds (Controller) — FY2020-21 (Jul 2020–Jun 2021)",
    "body": "SF Bay Area SF hotel tax, all funds (Controller), FY2020-21 (Jul 2020–Jun 2021): Amount: $42.2M · YoY: -85.0% (computed). Basis: budgetary actual (Controller); FY Jul–Jun. Controller all-funds and State Controller city-reported figures differ in definition and timing — don't mix them for YoY. SF TOT 14%; Tourism Improvement District and Moscone Expansion District assessments not included (TID temporary +1% expires 2026-10-31). Decision support.",
    "magnitude": "$42.2M (-85.0% YoY) · budgetary actual (Controller)",
    "asOf": "FY2020-21 (Jul 2020–Jun 2021)",
    "sourceLabel": "SF Controller's Office — Five-Year Financial Plan Update (Controller) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://sfgov.legistar.com/View.ashx?GUID=075BE0E5-0D55-4892-AFCB-DE03F998ECC7&ID=15190255&M=F",
        "label": "SF Controller's Office — Five-Year Financial Plan Update (Controller)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-francisco-bay-202206-fy",
    "marketSlug": "san-francisco-bay",
    "kind": "tax",
    "title": "SF Bay Area SF hotel tax, all funds (Controller) — FY2021-22 (Jul 2021–Jun 2022)",
    "body": "SF Bay Area SF hotel tax, all funds (Controller), FY2021-22 (Jul 2021–Jun 2022): Amount: $179.1M · YoY: +324.4% (computed). Basis: budgetary actual (Controller); FY Jul–Jun. Controller all-funds and State Controller city-reported figures differ in definition and timing — don't mix them for YoY. SF TOT 14%; Tourism Improvement District and Moscone Expansion District assessments not included (TID temporary +1% expires 2026-10-31). Decision support.",
    "magnitude": "$179.1M (+324.4% YoY) · budgetary actual (Controller)",
    "asOf": "FY2021-22 (Jul 2021–Jun 2022)",
    "sourceLabel": "SF Controller's Office — Five-Year Financial Plan Update (Controller) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://sfgov.legistar.com/View.ashx?GUID=075BE0E5-0D55-4892-AFCB-DE03F998ECC7&ID=15190255&M=F",
        "label": "SF Controller's Office — Five-Year Financial Plan Update (Controller)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-francisco-bay-202306-fy",
    "marketSlug": "san-francisco-bay",
    "kind": "tax",
    "title": "SF Bay Area SF hotel tax, all funds (Controller) — FY2022-23 (Jul 2022–Jun 2023)",
    "body": "SF Bay Area SF hotel tax, all funds (Controller), FY2022-23 (Jul 2022–Jun 2023): Amount: $283.5M · YoY: +58.3% (computed). Basis: budgetary actual (Controller); FY Jul–Jun. Controller all-funds and State Controller city-reported figures differ in definition and timing — don't mix them for YoY. SF TOT 14%; Tourism Improvement District and Moscone Expansion District assessments not included (TID temporary +1% expires 2026-10-31). Decision support.",
    "magnitude": "$283.5M (+58.3% YoY) · budgetary actual (Controller)",
    "asOf": "FY2022-23 (Jul 2022–Jun 2023)",
    "sourceLabel": "SF Controller's Office — Five-Year Financial Plan Update (Controller) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://sfgov.legistar.com/View.ashx?GUID=075BE0E5-0D55-4892-AFCB-DE03F998ECC7&ID=15190255&M=F",
        "label": "SF Controller's Office — Five-Year Financial Plan Update (Controller)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-francisco-bay-202406-fy",
    "marketSlug": "san-francisco-bay",
    "kind": "tax",
    "title": "SF Bay Area SF hotel tax, all funds (Controller) — FY2023-24 (Jul 2023–Jun 2024)",
    "body": "SF Bay Area SF hotel tax, all funds (Controller), FY2023-24 (Jul 2023–Jun 2024): Amount: $287.5M · YoY: +1.4% (computed). Basis: budgetary actual (Controller); FY Jul–Jun. Controller all-funds and State Controller city-reported figures differ in definition and timing — don't mix them for YoY. SF TOT 14%; Tourism Improvement District and Moscone Expansion District assessments not included (TID temporary +1% expires 2026-10-31). Decision support.",
    "magnitude": "$287.5M (+1.4% YoY) · budgetary actual (Controller)",
    "asOf": "FY2023-24 (Jul 2023–Jun 2024)",
    "sourceLabel": "SF Controller's Office — Five-Year Financial Plan Update (Controller) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://sfgov.legistar.com/View.ashx?GUID=075BE0E5-0D55-4892-AFCB-DE03F998ECC7&ID=15190255&M=F",
        "label": "SF Controller's Office — Five-Year Financial Plan Update (Controller)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-francisco-bay-202506-fy",
    "marketSlug": "san-francisco-bay",
    "kind": "tax",
    "title": "SF Bay Area SF hotel tax, all funds (Controller) — FY2024-25 (Jul 2024–Jun 2025)",
    "body": "SF Bay Area SF hotel tax, all funds (Controller), FY2024-25 (Jul 2024–Jun 2025): Amount: $289.3M · YoY: +0.6% (computed). Basis: budgetary actual (Controller); FY Jul–Jun. Controller all-funds and State Controller city-reported figures differ in definition and timing — don't mix them for YoY. SF TOT 14%; Tourism Improvement District and Moscone Expansion District assessments not included (TID temporary +1% expires 2026-10-31). Decision support.",
    "magnitude": "$289.3M (+0.6% YoY) · budgetary actual (Controller)",
    "asOf": "FY2024-25 (Jul 2024–Jun 2025)",
    "sourceLabel": "SF Controller's Office — Five-Year Financial Plan Update (Controller) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://sfgov.legistar.com/View.ashx?GUID=075BE0E5-0D55-4892-AFCB-DE03F998ECC7&ID=15190255&M=F",
        "label": "SF Controller's Office — Five-Year Financial Plan Update (Controller)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-francisco-bay-201706-sco",
    "marketSlug": "san-francisco-bay",
    "kind": "tax",
    "title": "SF Bay Area SF TOT, annual (State Controller) — FY2017 (Jul 2016–Jun 2017)",
    "body": "SF Bay Area SF TOT, annual (State Controller), FY2017 (Jul 2016–Jun 2017): Amount: $370,344,455 · YoY (computed): n/a. Basis: city-reported to State Controller; FY Jul–Jun. Controller all-funds and State Controller city-reported figures differ in definition and timing — don't mix them for YoY. SF TOT 14%; Tourism Improvement District and Moscone Expansion District assessments not included (TID temporary +1% expires 2026-10-31). Decision support.",
    "magnitude": "$370.34M · city-reported to State Controller",
    "asOf": "FY2017 (Jul 2016–Jun 2017)",
    "sourceLabel": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://bythenumbers.sco.ca.gov/Cities/City-Transient-Occupancy-Tax-TOT-for-Fiscal-Years-/w8wj-pebu",
        "label": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-francisco-bay-201806-sco",
    "marketSlug": "san-francisco-bay",
    "kind": "tax",
    "title": "SF Bay Area SF TOT, annual (State Controller) — FY2018 (Jul 2017–Jun 2018)",
    "body": "SF Bay Area SF TOT, annual (State Controller), FY2018 (Jul 2017–Jun 2018): Amount: $382,175,695 · YoY (computed): +3.2%. Basis: city-reported to State Controller; FY Jul–Jun. Controller all-funds and State Controller city-reported figures differ in definition and timing — don't mix them for YoY. SF TOT 14%; Tourism Improvement District and Moscone Expansion District assessments not included (TID temporary +1% expires 2026-10-31). Decision support.",
    "magnitude": "$382.18M (+3.2% YoY) · city-reported to State Controller",
    "asOf": "FY2018 (Jul 2017–Jun 2018)",
    "sourceLabel": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://bythenumbers.sco.ca.gov/Cities/City-Transient-Occupancy-Tax-TOT-for-Fiscal-Years-/w8wj-pebu",
        "label": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-francisco-bay-201906-sco",
    "marketSlug": "san-francisco-bay",
    "kind": "tax",
    "title": "SF Bay Area SF TOT, annual (State Controller) — FY2019 (Jul 2018–Jun 2019)",
    "body": "SF Bay Area SF TOT, annual (State Controller), FY2019 (Jul 2018–Jun 2019): Amount: $408,348,112 · YoY (computed): +6.8%. Basis: city-reported to State Controller; FY Jul–Jun. Controller all-funds and State Controller city-reported figures differ in definition and timing — don't mix them for YoY. SF TOT 14%; Tourism Improvement District and Moscone Expansion District assessments not included (TID temporary +1% expires 2026-10-31). Decision support.",
    "magnitude": "$408.35M (+6.8% YoY) · city-reported to State Controller",
    "asOf": "FY2019 (Jul 2018–Jun 2019)",
    "sourceLabel": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://bythenumbers.sco.ca.gov/Cities/City-Transient-Occupancy-Tax-TOT-for-Fiscal-Years-/w8wj-pebu",
        "label": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-francisco-bay-202006-sco",
    "marketSlug": "san-francisco-bay",
    "kind": "tax",
    "title": "SF Bay Area SF TOT, annual (State Controller) — FY2020 (Jul 2019–Jun 2020)",
    "body": "SF Bay Area SF TOT, annual (State Controller), FY2020 (Jul 2019–Jun 2020): Amount: $280,969,933 · YoY (computed): -31.2%. Basis: city-reported to State Controller; FY Jul–Jun. Controller all-funds and State Controller city-reported figures differ in definition and timing — don't mix them for YoY. SF TOT 14%; Tourism Improvement District and Moscone Expansion District assessments not included (TID temporary +1% expires 2026-10-31). Decision support.",
    "magnitude": "$280.97M (-31.2% YoY) · city-reported to State Controller",
    "asOf": "FY2020 (Jul 2019–Jun 2020)",
    "sourceLabel": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://bythenumbers.sco.ca.gov/Cities/City-Transient-Occupancy-Tax-TOT-for-Fiscal-Years-/w8wj-pebu",
        "label": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-francisco-bay-202106-sco",
    "marketSlug": "san-francisco-bay",
    "kind": "tax",
    "title": "SF Bay Area SF TOT, annual (State Controller) — FY2021 (Jul 2020–Jun 2021)",
    "body": "SF Bay Area SF TOT, annual (State Controller), FY2021 (Jul 2020–Jun 2021): Amount: $37,698,007 · YoY (computed): -86.6%. Basis: city-reported to State Controller; FY Jul–Jun. Controller all-funds and State Controller city-reported figures differ in definition and timing — don't mix them for YoY. SF TOT 14%; Tourism Improvement District and Moscone Expansion District assessments not included (TID temporary +1% expires 2026-10-31). Decision support.",
    "magnitude": "$37.70M (-86.6% YoY) · city-reported to State Controller",
    "asOf": "FY2021 (Jul 2020–Jun 2021)",
    "sourceLabel": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://bythenumbers.sco.ca.gov/Cities/City-Transient-Occupancy-Tax-TOT-for-Fiscal-Years-/w8wj-pebu",
        "label": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-francisco-bay-202206-sco",
    "marketSlug": "san-francisco-bay",
    "kind": "tax",
    "title": "SF Bay Area SF TOT, annual (State Controller) — FY2022 (Jul 2021–Jun 2022)",
    "body": "SF Bay Area SF TOT, annual (State Controller), FY2022 (Jul 2021–Jun 2022): Amount: $174,609,059 · YoY (computed): +363.2%. Basis: city-reported to State Controller; FY Jul–Jun. Controller all-funds and State Controller city-reported figures differ in definition and timing — don't mix them for YoY. SF TOT 14%; Tourism Improvement District and Moscone Expansion District assessments not included (TID temporary +1% expires 2026-10-31). Decision support.",
    "magnitude": "$174.61M (+363.2% YoY) · city-reported to State Controller",
    "asOf": "FY2022 (Jul 2021–Jun 2022)",
    "sourceLabel": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://bythenumbers.sco.ca.gov/Cities/City-Transient-Occupancy-Tax-TOT-for-Fiscal-Years-/w8wj-pebu",
        "label": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-francisco-bay-202306-sco",
    "marketSlug": "san-francisco-bay",
    "kind": "tax",
    "title": "SF Bay Area SF TOT, annual (State Controller) — FY2023 (Jul 2022–Jun 2023)",
    "body": "SF Bay Area SF TOT, annual (State Controller), FY2023 (Jul 2022–Jun 2023): Amount: $278,961,142 · YoY (computed): +59.8%. Basis: city-reported to State Controller; FY Jul–Jun. Controller all-funds and State Controller city-reported figures differ in definition and timing — don't mix them for YoY. SF TOT 14%; Tourism Improvement District and Moscone Expansion District assessments not included (TID temporary +1% expires 2026-10-31). Decision support.",
    "magnitude": "$278.96M (+59.8% YoY) · city-reported to State Controller",
    "asOf": "FY2023 (Jul 2022–Jun 2023)",
    "sourceLabel": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://bythenumbers.sco.ca.gov/Cities/City-Transient-Occupancy-Tax-TOT-for-Fiscal-Years-/w8wj-pebu",
        "label": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-francisco-bay-202406-sco",
    "marketSlug": "san-francisco-bay",
    "kind": "tax",
    "title": "SF Bay Area SF TOT, annual (State Controller) — FY2024 (Jul 2023–Jun 2024)",
    "body": "SF Bay Area SF TOT, annual (State Controller), FY2024 (Jul 2023–Jun 2024): Amount: $283,019,739 · YoY (computed): +1.5%. Basis: city-reported to State Controller; FY Jul–Jun. Controller all-funds and State Controller city-reported figures differ in definition and timing — don't mix them for YoY. SF TOT 14%; Tourism Improvement District and Moscone Expansion District assessments not included (TID temporary +1% expires 2026-10-31). Decision support.",
    "magnitude": "$283.02M (+1.5% YoY) · city-reported to State Controller",
    "asOf": "FY2024 (Jul 2023–Jun 2024)",
    "sourceLabel": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://bythenumbers.sco.ca.gov/Cities/City-Transient-Occupancy-Tax-TOT-for-Fiscal-Years-/w8wj-pebu",
        "label": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-francisco-bay-202406-oth",
    "marketSlug": "san-francisco-bay",
    "kind": "tax",
    "title": "SF Bay Area Bay Area city TOT, annual (State Controller) — Oakland TOT, FY2024 (Jul 2023–Jun 2024)",
    "body": "SF Bay Area Bay Area city TOT, annual (State Controller), Oakland TOT, FY2024 (Jul 2023–Jun 2024): Amount: $24,093,750 · YoY: n/a. Basis: city-reported to State Controller; FY Jul–Jun. Controller all-funds and State Controller city-reported figures differ in definition and timing — don't mix them for YoY. SF TOT 14%; Tourism Improvement District and Moscone Expansion District assessments not included (TID temporary +1% expires 2026-10-31). Decision support.",
    "magnitude": "$24.09M · city-reported to State Controller",
    "asOf": "Oakland TOT, FY2024 (Jul 2023–Jun 2024)",
    "sourceLabel": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://bythenumbers.sco.ca.gov/Cities/City-Transient-Occupancy-Tax-TOT-for-Fiscal-Years-/w8wj-pebu",
        "label": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-francisco-bay-202406-oth2",
    "marketSlug": "san-francisco-bay",
    "kind": "tax",
    "title": "SF Bay Area Bay Area city TOT, annual (State Controller) — San José TOT, FY2024 (Jul 2023–Jun 2024)",
    "body": "SF Bay Area Bay Area city TOT, annual (State Controller), San José TOT, FY2024 (Jul 2023–Jun 2024): Amount: $39,778,835 · YoY: n/a. Basis: city-reported to State Controller; FY Jul–Jun. Controller all-funds and State Controller city-reported figures differ in definition and timing — don't mix them for YoY. SF TOT 14%; Tourism Improvement District and Moscone Expansion District assessments not included (TID temporary +1% expires 2026-10-31). Decision support.",
    "magnitude": "$39.78M · city-reported to State Controller",
    "asOf": "San José TOT, FY2024 (Jul 2023–Jun 2024)",
    "sourceLabel": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://bythenumbers.sco.ca.gov/Cities/City-Transient-Occupancy-Tax-TOT-for-Fiscal-Years-/w8wj-pebu",
        "label": "CA State Controller — SCO ByTheNumbers: City TOT FY2017–2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-san-francisco-bay-000000-gaps",
    "marketSlug": "san-francisco-bay",
    "kind": "tax",
    "title": "SF Bay Area hotel-tax series — gaps",
    "body": "SF Bay Area hotel-tax series gaps (as of 2026-10-11): Monthly / quarterly SF TOT: no public read this pass (the Controller publishes quarterly budget-status reports, which were not pulled). | FY2025-26 actual: not yet published. | Santa Clara (city) TOT: not pulled. Decision support.",
    "magnitude": "no public read",
    "asOf": "2026-10-11",
    "sourceLabel": "Official publishers (gap note; no public read)",
    "sourceUrls": null
  },
  {
    "id": "tax-seattle-202312-cy",
    "marketSlug": "seattle",
    "kind": "tax",
    "title": "Seattle convention-center lodging tax, annual — CY2023",
    "body": "Seattle convention-center lodging tax, annual, CY2023: Regular (Seattle): $83,365,806 · YoY: n/a (CY2022 not pulled) · Extended (King County): $5,649,629 · YoY: n/a. Basis: audited; calendar year. Audited GAAP accrual basis. The extended (King County) line fell ~51% in 2025 with no stated reason — use the regular Seattle line for demand. Convention center tax 7.0% in Seattle (dedicated to the WSCC PFD); total lodging tax in Seattle 15.70%. Decision support.",
    "magnitude": "Seattle $83.37M · King Co. $5.65M · audited",
    "asOf": "CY2023",
    "sourceLabel": "Washington State Convention Center PFD — WSCC PFD 2024 audited FS (prior-year column) (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://seattlecc.com/wp-content/uploads/2025/10/WSCC-Public-Facilities-District-2024-Audit-FS-Final.pdf",
        "label": "Washington State Convention Center PFD — WSCC PFD 2024 audited FS (prior-year column)",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-seattle-202412-cy",
    "marketSlug": "seattle",
    "kind": "tax",
    "title": "Seattle convention-center lodging tax, annual — CY2024",
    "body": "Seattle convention-center lodging tax, annual, CY2024: Regular (Seattle): $93,491,443 · YoY: +12.1% (computed) · Extended (King County): $6,393,572 · YoY: +13.2% (computed). Basis: audited; calendar year. Audited GAAP accrual basis. The extended (King County) line fell ~51% in 2025 with no stated reason — use the regular Seattle line for demand. Convention center tax 7.0% in Seattle (dedicated to the WSCC PFD); total lodging tax in Seattle 15.70%. Decision support.",
    "magnitude": "Seattle $93.49M (+12.1%) · King Co. $6.39M (+13.2%) · audited",
    "asOf": "CY2024",
    "sourceLabel": "Washington State Convention Center PFD — WSCC PFD 2024 audited FS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://seattlecc.com/wp-content/uploads/2025/10/WSCC-Public-Facilities-District-2024-Audit-FS-Final.pdf",
        "label": "Washington State Convention Center PFD — WSCC PFD 2024 audited FS",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-seattle-202512-cy",
    "marketSlug": "seattle",
    "kind": "tax",
    "title": "Seattle convention-center lodging tax, annual — CY2025",
    "body": "Seattle convention-center lodging tax, annual, CY2025: Regular (Seattle): $95,297,884 · YoY: +1.9% (computed) · Extended (King County): $3,142,961 · YoY: −50.8% (computed). Basis: audited; calendar year. Audited GAAP accrual basis. The extended (King County) line fell ~51% in 2025 with no stated reason — use the regular Seattle line for demand. Convention center tax 7.0% in Seattle (dedicated to the WSCC PFD); total lodging tax in Seattle 15.70%. Decision support.",
    "magnitude": "Seattle $95.30M (+1.9%) · King Co. $3.14M (−50.8%) · audited",
    "asOf": "CY2025",
    "sourceLabel": "Washington State Convention Center PFD — WSCC PFD 2025 audited FS (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://seattlecc.com/wp-content/uploads/2026/08/Washington-State-Convention-Center-2025-Audit-FS-GAAS-Only-Final.pdf",
        "label": "Washington State Convention Center PFD — WSCC PFD 2025 audited FS",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-seattle-000000-gaps",
    "marketSlug": "seattle",
    "kind": "tax",
    "title": "Seattle hotel-tax series — gaps",
    "body": "Seattle hotel-tax series gaps (as of 2026-10-11): Monthly / quarterly: no public read found from WA DOR, the City, or the PFD this pass. | CY2026 YTD: no public read. Decision support.",
    "magnitude": "no public read",
    "asOf": "2026-10-11",
    "sourceLabel": "Official publishers (gap note; no public read)",
    "sourceUrls": null
  },
  {
    "id": "tax-houston-202212-tx",
    "marketSlug": "houston",
    "kind": "tax",
    "title": "Houston city HOT, annual (Texas Comptroller) — 2022 (reporting year)",
    "body": "Houston city HOT, annual (Texas Comptroller), 2022 (reporting year): Amount: $82,504,869.98 · YoY: n/a. Basis: self-reported; reporting year set by filer. Self-reported by the city; the reporting year is set by the filer and may follow the city FY (Jul–Jun). City only, not the MSA. City of Houston HOT 7%; state 6%, Harris County 2% and Sports Authority 2% not included. Decision support.",
    "magnitude": "$82.50M · self-reported",
    "asOf": "2022 (reporting year)",
    "sourceLabel": "Texas Comptroller of Public Accounts (data.texas.gov) — Local HOT Reporting 2022 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://data.texas.gov/dataset/Local-Hotel-Occupancy-Tax-Reporting-2022/9xry-ncut",
        "label": "Texas Comptroller of Public Accounts (data.texas.gov) — Local HOT Reporting 2022",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-houston-202412-tx",
    "marketSlug": "houston",
    "kind": "tax",
    "title": "Houston city HOT, annual (Texas Comptroller) — 2024 (reporting year)",
    "body": "Houston city HOT, annual (Texas Comptroller), 2024 (reporting year): Amount: $106,334,352.00 · YoY: n/a (2023 unreliable). Basis: self-reported; reporting year set by filer. Self-reported by the city; the reporting year is set by the filer and may follow the city FY (Jul–Jun). City only, not the MSA. City of Houston HOT 7%; state 6%, Harris County 2% and Sports Authority 2% not included. Decision support.",
    "magnitude": "$106.33M · self-reported",
    "asOf": "2024 (reporting year)",
    "sourceLabel": "Texas Comptroller of Public Accounts (data.texas.gov) — Local HOT Reporting 2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://data.texas.gov/dataset/Local-Hotel-Occupancy-Tax-Reporting-2024/ifh4-9tpn",
        "label": "Texas Comptroller of Public Accounts (data.texas.gov) — Local HOT Reporting 2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-houston-202512-tx",
    "marketSlug": "houston",
    "kind": "tax",
    "title": "Houston city HOT, annual (Texas Comptroller) — 2025 (reporting year)",
    "body": "Houston city HOT, annual (Texas Comptroller), 2025 (reporting year): Amount: $111,191,705.50 · YoY: +4.6% (computed). Basis: self-reported; reporting year set by filer. Self-reported by the city; the reporting year is set by the filer and may follow the city FY (Jul–Jun). City only, not the MSA. City of Houston HOT 7%; state 6%, Harris County 2% and Sports Authority 2% not included. Decision support.",
    "magnitude": "$111.19M (+4.6% YoY) · self-reported",
    "asOf": "2025 (reporting year)",
    "sourceLabel": "Texas Comptroller of Public Accounts (data.texas.gov) — Local HOT Reporting 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://data.texas.gov/dataset/Local-Hotel-Occupancy-Tax-Reporting-2025/er34-v24h",
        "label": "Texas Comptroller of Public Accounts (data.texas.gov) — Local HOT Reporting 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-houston-202412-hf",
    "marketSlug": "houston",
    "kind": "tax",
    "title": "Houston city HOT received by Houston First — CY2024 actual (current + delinquent)",
    "body": "Houston city HOT received by Houston First, CY2024 actual (current + delinquent): Amount: $112.0M · YoY: n/a. Basis: Houston First actual (current + delinquent); calendar year. Houston First budget-document actual (current + delinquent), calendar year; CY2025 forecast and CY2026 budget excluded. City only, not the MSA. City of Houston HOT 7%; state 6%, Harris County 2% and Sports Authority 2% not included. Decision support.",
    "magnitude": "$112.0M · Houston First actual (current + delinquent)",
    "asOf": "CY2024 actual (current + delinquent)",
    "sourceLabel": "Houston First Corporation — Houston First 2026 Strategic Summary & Budget, p.48 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.houstonfirst.com/media/uploads/strategicsummary2026_sm.pdf",
        "label": "Houston First Corporation — Houston First 2026 Strategic Summary & Budget, p.48",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-houston-000000-gaps",
    "marketSlug": "houston",
    "kind": "tax",
    "title": "Houston hotel-tax series — gaps",
    "body": "Houston hotel-tax series gaps (as of 2026-10-11): Monthly / quarterly: no public read. Hotels file the city HOT with Houston First, which publishes no monthly collections. The state 6% HOT city allocation is not published monthly by city on a free page found this pass. Decision support.",
    "magnitude": "no public read",
    "asOf": "2026-10-11",
    "sourceLabel": "Official publishers (gap note; no public read)",
    "sourceUrls": null
  },
  {
    "id": "tax-dallas-202412-tx",
    "marketSlug": "dallas",
    "kind": "tax",
    "title": "Dallas city HOT, annual (Texas Comptroller) — 2024 (reporting year)",
    "body": "Dallas city HOT, annual (Texas Comptroller), 2024 (reporting year): Ch. 351 (7%): $80,641,384.89 · YoY: n/a · Ch. 334 (2%): $24,247,916.23 · YoY: n/a. Basis: self-reported; reporting year set by filer. Self-reported; the reporting year is set by the filer and may follow the city FY (Oct–Sep). City of Dallas HOT 7% (Ch. 351) + 2% venue HOT (Ch. 334); state 6% and TPID 2% not included. Decision support.",
    "magnitude": "Ch. 351 $80.64M · Ch. 334 $24.25M · self-reported",
    "asOf": "2024 (reporting year)",
    "sourceLabel": "Texas Comptroller of Public Accounts (data.texas.gov) — Local HOT Reporting 2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://data.texas.gov/dataset/Local-Hotel-Occupancy-Tax-Reporting-2024/ifh4-9tpn",
        "label": "Texas Comptroller of Public Accounts (data.texas.gov) — Local HOT Reporting 2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-dallas-202512-tx",
    "marketSlug": "dallas",
    "kind": "tax",
    "title": "Dallas city HOT, annual (Texas Comptroller) — 2025 (reporting year)",
    "body": "Dallas city HOT, annual (Texas Comptroller), 2025 (reporting year): Ch. 351 (7%): $79,306,924.38 · YoY: −1.7% (computed) · Ch. 334 (2%): $23,873,983.58 · YoY: −1.5% (computed). Basis: self-reported; reporting year set by filer. Self-reported; the reporting year is set by the filer and may follow the city FY (Oct–Sep). City of Dallas HOT 7% (Ch. 351) + 2% venue HOT (Ch. 334); state 6% and TPID 2% not included. Decision support.",
    "magnitude": "Ch. 351 $79.31M (−1.7%) · Ch. 334 $23.87M (−1.5%) · self-reported",
    "asOf": "2025 (reporting year)",
    "sourceLabel": "Texas Comptroller of Public Accounts (data.texas.gov) — Local HOT Reporting 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://data.texas.gov/dataset/Local-Hotel-Occupancy-Tax-Reporting-2025/er34-v24h",
        "label": "Texas Comptroller of Public Accounts (data.texas.gov) — Local HOT Reporting 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-dallas-000000-gaps",
    "marketSlug": "dallas",
    "kind": "tax",
    "title": "Dallas hotel-tax series — gaps",
    "body": "Dallas hotel-tax series gaps (as of 2026-10-11): Monthly / quarterly: no public read. The City's monthly Budget Accountability Reports show HOT budget/forecast, not monthly collections. | 2022 / 2023: no Dallas rows in the Comptroller datasets. Decision support.",
    "magnitude": "no public read",
    "asOf": "2026-10-11",
    "sourceLabel": "Official publishers (gap note; no public read)",
    "sourceUrls": null
  },
  {
    "id": "tax-atlanta-202306-fy",
    "marketSlug": "atlanta",
    "kind": "tax",
    "title": "Atlanta city hotel-motel tax, annual (Georgia DCA) — FY2023 (Jul 2022–Jun 2023)",
    "body": "Atlanta city hotel-motel tax, annual (Georgia DCA), FY2023 (Jul 2022–Jun 2023): Amount: $95,569,135 · YoY: n/a. Basis: self-reported; FY Jul–Jun. Self-reported by the city to Georgia DCA; City FY Jul–Jun. City of Atlanta hotel-motel tax 8%; Georgia $5/room-night fee and sales tax not included. Decision support.",
    "magnitude": "$95.57M · self-reported",
    "asOf": "FY2023 (Jul 2022–Jun 2023)",
    "sourceLabel": "Georgia Dept. of Community Affairs — DCA Hotel/Motel Tax Revenue Report (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://dca.georgia.gov/document/document/hotel-motel-tax-revenue-report/download",
        "label": "Georgia Dept. of Community Affairs — DCA Hotel/Motel Tax Revenue Report",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-atlanta-202406-fy",
    "marketSlug": "atlanta",
    "kind": "tax",
    "title": "Atlanta city hotel-motel tax, annual (Georgia DCA) — FY2024 (Jul 2023–Jun 2024)",
    "body": "Atlanta city hotel-motel tax, annual (Georgia DCA), FY2024 (Jul 2023–Jun 2024): Amount: $101,561,266 · YoY: +6.3% (computed). Basis: self-reported; FY Jul–Jun. Self-reported by the city to Georgia DCA; City FY Jul–Jun. City of Atlanta hotel-motel tax 8%; Georgia $5/room-night fee and sales tax not included. Decision support.",
    "magnitude": "$101.56M (+6.3% YoY) · self-reported",
    "asOf": "FY2024 (Jul 2023–Jun 2024)",
    "sourceLabel": "Georgia Dept. of Community Affairs — DCA Hotel/Motel Tax Revenue Report (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://dca.georgia.gov/document/document/hotel-motel-tax-revenue-report/download",
        "label": "Georgia Dept. of Community Affairs — DCA Hotel/Motel Tax Revenue Report",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-atlanta-000000-gaps",
    "marketSlug": "atlanta",
    "kind": "tax",
    "title": "Atlanta hotel-tax series — gaps",
    "body": "Atlanta hotel-tax series gaps (as of 2026-10-11): Monthly / quarterly: no public read from an official source. | FY2025 annual: not yet in the DCA report. Decision support.",
    "magnitude": "no public read",
    "asOf": "2026-10-11",
    "sourceLabel": "Official publishers (gap note; no public read)",
    "sourceUrls": null
  },
  {
    "id": "tax-boston-202306-fy",
    "marketSlug": "boston",
    "kind": "tax",
    "title": "Boston local room occupancy excise, annual — FY2023 (Jul 2022–Jun 2023)",
    "body": "Boston local room occupancy excise, annual, FY2023 (Jul 2022–Jun 2023): Amount: $129,271,291 · YoY: n/a. Basis: budgetary actual; FY Jul–Jun. City budgetary-basis actuals; budgets for FY2026–FY2027 excluded. Boston local room occupancy excise 6.5% (state 5.7% and 2.75% convention center fee not included; total 14.95%). Decision support.",
    "magnitude": "$129.27M · budgetary actual",
    "asOf": "FY2023 (Jul 2022–Jun 2023)",
    "sourceLabel": "City of Boston Budget Office — FY25 Local Revenue (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.boston.gov/departments/budget/fy25-local-revenue",
        "label": "City of Boston Budget Office — FY25 Local Revenue",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-boston-202406-fy",
    "marketSlug": "boston",
    "kind": "tax",
    "title": "Boston local room occupancy excise, annual — FY2024 (Jul 2023–Jun 2024)",
    "body": "Boston local room occupancy excise, annual, FY2024 (Jul 2023–Jun 2024): Amount: $144,629,614 · YoY: +11.9% (computed). Basis: budgetary actual; FY Jul–Jun. City budgetary-basis actuals; budgets for FY2026–FY2027 excluded. Boston local room occupancy excise 6.5% (state 5.7% and 2.75% convention center fee not included; total 14.95%). Decision support.",
    "magnitude": "$144.63M (+11.9% YoY) · budgetary actual",
    "asOf": "FY2024 (Jul 2023–Jun 2024)",
    "sourceLabel": "City of Boston Budget Office — FY26 Local Revenue (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.boston.gov/departments/budget/fy26-local-revenue",
        "label": "City of Boston Budget Office — FY26 Local Revenue",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-boston-202506-fy",
    "marketSlug": "boston",
    "kind": "tax",
    "title": "Boston local room occupancy excise, annual — FY2025 (Jul 2024–Jun 2025)",
    "body": "Boston local room occupancy excise, annual, FY2025 (Jul 2024–Jun 2025): Amount: $147,088,220 · YoY: +1.7% (computed). Basis: budgetary actual; FY Jul–Jun. City budgetary-basis actuals; budgets for FY2026–FY2027 excluded. Boston local room occupancy excise 6.5% (state 5.7% and 2.75% convention center fee not included; total 14.95%). Decision support.",
    "magnitude": "$147.09M (+1.7% YoY) · budgetary actual",
    "asOf": "FY2025 (Jul 2024–Jun 2025)",
    "sourceLabel": "City of Boston Budget Office — FY27 Local Revenue (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.boston.gov/departments/budget/fy27-local-revenue",
        "label": "City of Boston Budget Office — FY27 Local Revenue",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-boston-000000-gaps",
    "marketSlug": "boston",
    "kind": "tax",
    "title": "Boston hotel-tax series — gaps",
    "body": "Boston hotel-tax series gaps (as of 2026-10-11): Monthly: the MA DLS \"Rooms and Meals Tax Liabilities by Month\" report (DLS Gateway report, Boston = municipality 035) exists. Scripted retrieval this pass returned only FY2019–FY2022; FY2023 onward was not retrievable, so there is no public read this pass for recent months. Next step: pull the report interactively in a browser. | FY2026 actual: not yet published on the City budget pages. Decision support.",
    "magnitude": "no public read",
    "asOf": "2026-10-11",
    "sourceLabel": "Official publishers (gap note; no public read)",
    "sourceUrls": null
  },
  {
    "id": "tax-miami-201609-cdt",
    "marketSlug": "miami",
    "kind": "tax",
    "title": "Miami 3% Convention Development Tax, annual — FY2016 (Oct 2015–Sep 2016)",
    "body": "Miami 3% Convention Development Tax, annual, FY2016 (Oct 2015–Sep 2016): Gross CDT: $80,299,248 · Net CDT: $78,694,663 · Growth: +4.2% (published, taxable revenue) · Taxable revenue: $2,676,641,600. Basis: gross collections (bondholder disclosure); FY Oct–Sep. County bondholder-disclosure collections; FY2022's +54.9% is the post-COVID rebound and not comparable. Miami Beach resort taxes not included. Convention Development Tax 3% countywide (excl. Bal Harbour, Surfside); Tourist Development Tax 2% (excl. Miami Beach, Bal Harbour, Surfside). Decision support.",
    "magnitude": "Gross $80.30M (+4.2% taxable revenue) · gross collections (bondholder disclosure)",
    "asOf": "FY2016 (Oct 2015–Sep 2016)",
    "sourceLabel": "Miami-Dade County — Convention Development Tax bondholder report 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.miamidade.gov/resources/management/documents/bondprogram/2025/convention-development-tax.pdf",
        "label": "Miami-Dade County — Convention Development Tax bondholder report 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-miami-201709-cdt",
    "marketSlug": "miami",
    "kind": "tax",
    "title": "Miami 3% Convention Development Tax, annual — FY2017 (Oct 2016–Sep 2017)",
    "body": "Miami 3% Convention Development Tax, annual, FY2017 (Oct 2016–Sep 2017): Gross CDT: $79,783,961 · Net CDT: $78,188,282 · Growth: −0.6% (published, taxable revenue) · Taxable revenue: $2,659,465,395. Basis: gross collections (bondholder disclosure); FY Oct–Sep. County bondholder-disclosure collections; FY2022's +54.9% is the post-COVID rebound and not comparable. Miami Beach resort taxes not included. Convention Development Tax 3% countywide (excl. Bal Harbour, Surfside); Tourist Development Tax 2% (excl. Miami Beach, Bal Harbour, Surfside). Decision support.",
    "magnitude": "Gross $79.78M (−0.6% taxable revenue) · gross collections (bondholder disclosure)",
    "asOf": "FY2017 (Oct 2016–Sep 2017)",
    "sourceLabel": "Miami-Dade County — Convention Development Tax bondholder report 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.miamidade.gov/resources/management/documents/bondprogram/2025/convention-development-tax.pdf",
        "label": "Miami-Dade County — Convention Development Tax bondholder report 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-miami-201809-cdt",
    "marketSlug": "miami",
    "kind": "tax",
    "title": "Miami 3% Convention Development Tax, annual — FY2018 (Oct 2017–Sep 2018)",
    "body": "Miami 3% Convention Development Tax, annual, FY2018 (Oct 2017–Sep 2018): Gross CDT: $90,319,992 · Net CDT: $88,513,592 · Growth: +13.2% (published, taxable revenue) · Taxable revenue: $3,010,666,391. Basis: gross collections (bondholder disclosure); FY Oct–Sep. County bondholder-disclosure collections; FY2022's +54.9% is the post-COVID rebound and not comparable. Miami Beach resort taxes not included. Convention Development Tax 3% countywide (excl. Bal Harbour, Surfside); Tourist Development Tax 2% (excl. Miami Beach, Bal Harbour, Surfside). Decision support.",
    "magnitude": "Gross $90.32M (+13.2% taxable revenue) · gross collections (bondholder disclosure)",
    "asOf": "FY2018 (Oct 2017–Sep 2018)",
    "sourceLabel": "Miami-Dade County — Convention Development Tax bondholder report 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.miamidade.gov/resources/management/documents/bondprogram/2025/convention-development-tax.pdf",
        "label": "Miami-Dade County — Convention Development Tax bondholder report 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-miami-201909-cdt",
    "marketSlug": "miami",
    "kind": "tax",
    "title": "Miami 3% Convention Development Tax, annual — FY2019 (Oct 2018–Sep 2019)",
    "body": "Miami 3% Convention Development Tax, annual, FY2019 (Oct 2018–Sep 2019): Gross CDT: $92,827,072 · Net CDT: $90,970,531 · Growth: +2.8% (published, taxable revenue) · Taxable revenue: $3,094,235,738. Basis: gross collections (bondholder disclosure); FY Oct–Sep. County bondholder-disclosure collections; FY2022's +54.9% is the post-COVID rebound and not comparable. Miami Beach resort taxes not included. Convention Development Tax 3% countywide (excl. Bal Harbour, Surfside); Tourist Development Tax 2% (excl. Miami Beach, Bal Harbour, Surfside). Decision support.",
    "magnitude": "Gross $92.83M (+2.8% taxable revenue) · gross collections (bondholder disclosure)",
    "asOf": "FY2019 (Oct 2018–Sep 2019)",
    "sourceLabel": "Miami-Dade County — Convention Development Tax bondholder report 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.miamidade.gov/resources/management/documents/bondprogram/2025/convention-development-tax.pdf",
        "label": "Miami-Dade County — Convention Development Tax bondholder report 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-miami-202009-cdt",
    "marketSlug": "miami",
    "kind": "tax",
    "title": "Miami 3% Convention Development Tax, annual — FY2020 (Oct 2019–Sep 2020)",
    "body": "Miami 3% Convention Development Tax, annual, FY2020 (Oct 2019–Sep 2020): Gross CDT: $63,249,281 · Net CDT: $61,984,295 · Growth: −31.9% (published, taxable revenue) · Taxable revenue: $2,108,309,365. Basis: gross collections (bondholder disclosure); FY Oct–Sep. County bondholder-disclosure collections; FY2022's +54.9% is the post-COVID rebound and not comparable. Miami Beach resort taxes not included. Convention Development Tax 3% countywide (excl. Bal Harbour, Surfside); Tourist Development Tax 2% (excl. Miami Beach, Bal Harbour, Surfside). Decision support.",
    "magnitude": "Gross $63.25M (−31.9% taxable revenue) · gross collections (bondholder disclosure)",
    "asOf": "FY2020 (Oct 2019–Sep 2020)",
    "sourceLabel": "Miami-Dade County — Convention Development Tax bondholder report 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.miamidade.gov/resources/management/documents/bondprogram/2025/convention-development-tax.pdf",
        "label": "Miami-Dade County — Convention Development Tax bondholder report 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-miami-202109-cdt",
    "marketSlug": "miami",
    "kind": "tax",
    "title": "Miami 3% Convention Development Tax, annual — FY2021 (Oct 2020–Sep 2021)",
    "body": "Miami 3% Convention Development Tax, annual, FY2021 (Oct 2020–Sep 2021): Gross CDT: $81,732,070 · Net CDT: $80,097,429 · Growth: +29.2% (published, taxable revenue) · Taxable revenue: $2,724,402,333. Basis: gross collections (bondholder disclosure); FY Oct–Sep. County bondholder-disclosure collections; FY2022's +54.9% is the post-COVID rebound and not comparable. Miami Beach resort taxes not included. Convention Development Tax 3% countywide (excl. Bal Harbour, Surfside); Tourist Development Tax 2% (excl. Miami Beach, Bal Harbour, Surfside). Decision support.",
    "magnitude": "Gross $81.73M (+29.2% taxable revenue) · gross collections (bondholder disclosure)",
    "asOf": "FY2021 (Oct 2020–Sep 2021)",
    "sourceLabel": "Miami-Dade County — Convention Development Tax bondholder report 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.miamidade.gov/resources/management/documents/bondprogram/2025/convention-development-tax.pdf",
        "label": "Miami-Dade County — Convention Development Tax bondholder report 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-miami-202209-cdt",
    "marketSlug": "miami",
    "kind": "tax",
    "title": "Miami 3% Convention Development Tax, annual — FY2022 (Oct 2021–Sep 2022)",
    "body": "Miami 3% Convention Development Tax, annual, FY2022 (Oct 2021–Sep 2022): Gross CDT: $126,564,599 · Net CDT: $124,033,307 · Growth: +54.9% (published, taxable revenue) · Taxable revenue: $4,218,819,970. Basis: gross collections (bondholder disclosure); FY Oct–Sep. County bondholder-disclosure collections; FY2022's +54.9% is the post-COVID rebound and not comparable. Miami Beach resort taxes not included. Convention Development Tax 3% countywide (excl. Bal Harbour, Surfside); Tourist Development Tax 2% (excl. Miami Beach, Bal Harbour, Surfside). Decision support.",
    "magnitude": "Gross $126.56M (+54.9% taxable revenue) · gross collections (bondholder disclosure)",
    "asOf": "FY2022 (Oct 2021–Sep 2022)",
    "sourceLabel": "Miami-Dade County — Convention Development Tax bondholder report 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.miamidade.gov/resources/management/documents/bondprogram/2025/convention-development-tax.pdf",
        "label": "Miami-Dade County — Convention Development Tax bondholder report 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-miami-202309-cdt",
    "marketSlug": "miami",
    "kind": "tax",
    "title": "Miami 3% Convention Development Tax, annual — FY2023 (Oct 2022–Sep 2023)",
    "body": "Miami 3% Convention Development Tax, annual, FY2023 (Oct 2022–Sep 2023): Gross CDT: $129,200,307 · Net CDT: $126,616,301 · Growth: +2.1% (published, taxable revenue) · Taxable revenue: $4,306,676,914. Basis: gross collections (bondholder disclosure); FY Oct–Sep. County bondholder-disclosure collections; FY2022's +54.9% is the post-COVID rebound and not comparable. Miami Beach resort taxes not included. Convention Development Tax 3% countywide (excl. Bal Harbour, Surfside); Tourist Development Tax 2% (excl. Miami Beach, Bal Harbour, Surfside). Decision support.",
    "magnitude": "Gross $129.20M (+2.1% taxable revenue) · gross collections (bondholder disclosure)",
    "asOf": "FY2023 (Oct 2022–Sep 2023)",
    "sourceLabel": "Miami-Dade County — Convention Development Tax bondholder report 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.miamidade.gov/resources/management/documents/bondprogram/2025/convention-development-tax.pdf",
        "label": "Miami-Dade County — Convention Development Tax bondholder report 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-miami-202409-cdt",
    "marketSlug": "miami",
    "kind": "tax",
    "title": "Miami 3% Convention Development Tax, annual — FY2024 (Oct 2023–Sep 2024)",
    "body": "Miami 3% Convention Development Tax, annual, FY2024 (Oct 2023–Sep 2024): Gross CDT: $128,753,159 · Net CDT: $126,178,096 · Growth: −0.3% (published, taxable revenue) · Taxable revenue: $4,291,771,970. Basis: gross collections (bondholder disclosure); FY Oct–Sep. County bondholder-disclosure collections; FY2022's +54.9% is the post-COVID rebound and not comparable. Miami Beach resort taxes not included. Convention Development Tax 3% countywide (excl. Bal Harbour, Surfside); Tourist Development Tax 2% (excl. Miami Beach, Bal Harbour, Surfside). Decision support.",
    "magnitude": "Gross $128.75M (−0.3% taxable revenue) · gross collections (bondholder disclosure)",
    "asOf": "FY2024 (Oct 2023–Sep 2024)",
    "sourceLabel": "Miami-Dade County — Convention Development Tax bondholder report 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.miamidade.gov/resources/management/documents/bondprogram/2025/convention-development-tax.pdf",
        "label": "Miami-Dade County — Convention Development Tax bondholder report 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-miami-202509-cdt",
    "marketSlug": "miami",
    "kind": "tax",
    "title": "Miami 3% Convention Development Tax, annual — FY2025 (Oct 2024–Sep 2025)",
    "body": "Miami 3% Convention Development Tax, annual, FY2025 (Oct 2024–Sep 2025): Gross CDT: $130,158,586 · Net CDT: $127,555,415 · Growth: +1.1% (published, taxable revenue) · Taxable revenue: $4,338,619,542. Basis: gross collections (bondholder disclosure); FY Oct–Sep. County bondholder-disclosure collections; FY2022's +54.9% is the post-COVID rebound and not comparable. Miami Beach resort taxes not included. Convention Development Tax 3% countywide (excl. Bal Harbour, Surfside); Tourist Development Tax 2% (excl. Miami Beach, Bal Harbour, Surfside). Decision support.",
    "magnitude": "Gross $130.16M (+1.1% taxable revenue) · gross collections (bondholder disclosure)",
    "asOf": "FY2025 (Oct 2024–Sep 2025)",
    "sourceLabel": "Miami-Dade County — Convention Development Tax bondholder report 2025 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.miamidade.gov/resources/management/documents/bondprogram/2025/convention-development-tax.pdf",
        "label": "Miami-Dade County — Convention Development Tax bondholder report 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-miami-202409-tdt",
    "marketSlug": "miami",
    "kind": "tax",
    "title": "Miami 2% Tourist Development Tax, annual — FY2024 actual (Oct 2023–Sep 2024)",
    "body": "Miami 2% Tourist Development Tax, annual, FY2024 actual (Oct 2023–Sep 2024): Amount: $47,945K · YoY: n/a. Basis: actual, net of collection fees; FY Oct–Sep. County OMB budget-appendix actuals, net of collection fees; FY2026 projection excluded. Convention Development Tax 3% countywide (excl. Bal Harbour, Surfside); Tourist Development Tax 2% (excl. Miami Beach, Bal Harbour, Surfside). Decision support.",
    "magnitude": "$47,945K · actual, net of collection fees",
    "asOf": "FY2024 actual (Oct 2023–Sep 2024)",
    "sourceLabel": "Miami-Dade County (OMB budget appendix) — FY2025-26 Adopted Budget, Appendix N (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.miamidade.gov/resources/budget/adopted/fy2025-26/appendix-n.pdf",
        "label": "Miami-Dade County (OMB budget appendix) — FY2025-26 Adopted Budget, Appendix N",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-miami-202509-tdt",
    "marketSlug": "miami",
    "kind": "tax",
    "title": "Miami 2% Tourist Development Tax, annual — FY2025 actual (Oct 2024–Sep 2025)",
    "body": "Miami 2% Tourist Development Tax, annual, FY2025 actual (Oct 2024–Sep 2025): Amount: $48,601K · YoY: +1.4% (computed). Basis: actual, net of collection fees; FY Oct–Sep. County OMB budget-appendix actuals, net of collection fees; FY2026 projection excluded. Convention Development Tax 3% countywide (excl. Bal Harbour, Surfside); Tourist Development Tax 2% (excl. Miami Beach, Bal Harbour, Surfside). Decision support.",
    "magnitude": "$48,601K (+1.4% YoY) · actual, net of collection fees",
    "asOf": "FY2025 actual (Oct 2024–Sep 2025)",
    "sourceLabel": "Miami-Dade County (OMB budget appendix) — FY2026-27 Proposed Budget, Appendix M (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://wwwx.miamidade.gov/resources/budget/fy-26-27/proposed/appendix-m.pdf",
        "label": "Miami-Dade County (OMB budget appendix) — FY2026-27 Proposed Budget, Appendix M",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-miami-000000-gaps",
    "marketSlug": "miami",
    "kind": "tax",
    "title": "Miami hotel-tax series — gaps",
    "body": "Miami hotel-tax series gaps (as of 2026-10-11): Monthly / quarterly: no public read. The County self-administers CDT/TDT and publishes no monthly collections. | FY2026 actual: not yet published. | Miami Beach resort-tax monthly: not pulled this pass. Decision support.",
    "magnitude": "no public read",
    "asOf": "2026-10-11",
    "sourceLabel": "Official publishers (gap note; no public read)",
    "sourceUrls": null
  },
  {
    "id": "tax-nashville-202406-fy",
    "marketSlug": "nashville",
    "kind": "tax",
    "title": "Nashville hotel occupancy tax — FY2024, object 403207 Hotel Occupancy Tax (actual) (Jul 2023–Jun 2024)",
    "body": "Nashville hotel occupancy tax, FY2024, object 403207 Hotel Occupancy Tax (actual) (Jul 2023–Jun 2024): Amount: $127,472,149 · YoY: n/a. Basis: budgetary actual; FY Jul–Jun. Definitions differ across sources (Revenue Manual object vs stadium 1% vs commission totals), so no cross-source YoY. Metro hotel occupancy tax 7% (incl. 1% stadium, from 2023-07-01) + $2.50/room-night. Decision support.",
    "magnitude": "$127.47M · budgetary actual",
    "asOf": "FY2024, object 403207 Hotel Occupancy Tax (actual) (Jul 2023–Jun 2024)",
    "sourceLabel": "Metro Nashville Finance (Revenue Manual) — Metro FY2025 Revenue Manual (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.nashville.gov/sites/default/files/2026-05/FY25_RevenueManual_final.pdf",
        "label": "Metro Nashville Finance (Revenue Manual) — Metro FY2025 Revenue Manual",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-nashville-202406-fy2",
    "marketSlug": "nashville",
    "kind": "tax",
    "title": "Nashville hotel occupancy tax — FY2024, 1% stadium hotel occupancy tax (Jul 2023–Jun 2024)",
    "body": "Nashville hotel occupancy tax, FY2024, 1% stadium hotel occupancy tax (Jul 2023–Jun 2024): Amount: $22,069,511.93 · YoY: n/a. Basis: budgetary actual; FY Jul–Jun. Definitions differ across sources (Revenue Manual object vs stadium 1% vs commission totals), so no cross-source YoY. Metro hotel occupancy tax 7% (incl. 1% stadium, from 2023-07-01) + $2.50/room-night. Decision support.",
    "magnitude": "$22.07M · budgetary actual",
    "asOf": "FY2024, 1% stadium hotel occupancy tax (Jul 2023–Jun 2024)",
    "sourceLabel": "Metro Nashville Finance — Hotel Occupancy Tax Revenue Report FY2024 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.nashville.gov/sites/default/files/2025-03/Hotel-Occupancy-Tax-Revenue-Report-FY2024.pdf",
        "label": "Metro Nashville Finance — Hotel Occupancy Tax Revenue Report FY2024",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-nashville-202506-fy",
    "marketSlug": "nashville",
    "kind": "tax",
    "title": "Nashville hotel occupancy tax — FY2025, total hotel-tax collections (Jul 2024–Jun 2025)",
    "body": "Nashville hotel occupancy tax, FY2025, total hotel-tax collections (Jul 2024–Jun 2025): Amount: \"approximately $152 million\" · YoY: n/a (different definition from FY2024 rows). Basis: narrative, rounded (commission minutes); FY Jul–Jun. Definitions differ across sources (Revenue Manual object vs stadium 1% vs commission totals), so no cross-source YoY. Metro hotel occupancy tax 7% (incl. 1% stadium, from 2023-07-01) + $2.50/room-night. Decision support.",
    "magnitude": "\"approximately $152 million\" · narrative, rounded (commission minutes)",
    "asOf": "FY2025, total hotel-tax collections (Jul 2024–Jun 2025)",
    "sourceLabel": "Metro Tourism & Convention Commission — MTCC minutes, 2025-09-11 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.nashville.gov/sites/default/files/2025-11/Metro-Tourism-and-Convention-Commission-Meeting-Minutes---09112025.pdf",
        "label": "Metro Tourism & Convention Commission — MTCC minutes, 2025-09-11",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-nashville-202506-fy2",
    "marketSlug": "nashville",
    "kind": "tax",
    "title": "Nashville hotel occupancy tax — FY2025, tourism-promotion share (Jul 2024–Jun 2025)",
    "body": "Nashville hotel occupancy tax, FY2025, tourism-promotion share (Jul 2024–Jun 2025): Amount: $44,080,000 · YoY: n/a. Basis: narrative, rounded (commission minutes); FY Jul–Jun. Definitions differ across sources (Revenue Manual object vs stadium 1% vs commission totals), so no cross-source YoY. Metro hotel occupancy tax 7% (incl. 1% stadium, from 2023-07-01) + $2.50/room-night. Decision support.",
    "magnitude": "$44.08M · narrative, rounded (commission minutes)",
    "asOf": "FY2025, tourism-promotion share (Jul 2024–Jun 2025)",
    "sourceLabel": "Metro Tourism & Convention Commission — MTCC minutes, 2025-09-11 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.nashville.gov/sites/default/files/2025-11/Metro-Tourism-and-Convention-Commission-Meeting-Minutes---09112025.pdf",
        "label": "Metro Tourism & Convention Commission — MTCC minutes, 2025-09-11",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-nashville-202602-fy",
    "marketSlug": "nashville",
    "kind": "tax",
    "title": "Nashville hotel occupancy tax — FY2026 YTD Jul 2025–Feb 2026, total",
    "body": "Nashville hotel occupancy tax, FY2026 YTD Jul 2025–Feb 2026, total: Amount: \"just over $97.8 million\" · YoY: n/a. Basis: narrative, rounded (commission minutes); FY Jul–Jun. Definitions differ across sources (Revenue Manual object vs stadium 1% vs commission totals), so no cross-source YoY. Metro hotel occupancy tax 7% (incl. 1% stadium, from 2023-07-01) + $2.50/room-night. Decision support.",
    "magnitude": "\"just over $97.8 million\" · narrative, rounded (commission minutes)",
    "asOf": "FY2026 YTD Jul 2025–Feb 2026, total",
    "sourceLabel": "Metro Tourism & Convention Commission — MTCC minutes, 2026-05-12 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.nashville.gov/sites/default/files/2026-09/Tourism_and_Convention_Commission_Minutes_May-12-2026.pdf",
        "label": "Metro Tourism & Convention Commission — MTCC minutes, 2026-05-12",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-nashville-202602-fy2",
    "marketSlug": "nashville",
    "kind": "tax",
    "title": "Nashville hotel occupancy tax — FY2026 YTD Jul 2025–Feb 2026, tourism-promotion share",
    "body": "Nashville hotel occupancy tax, FY2026 YTD Jul 2025–Feb 2026, tourism-promotion share: Amount: $28.3M · YoY: \"almost 3%\" ahead of prior year (published, as worded). Basis: narrative, rounded (commission minutes); FY Jul–Jun. Definitions differ across sources (Revenue Manual object vs stadium 1% vs commission totals), so no cross-source YoY. Metro hotel occupancy tax 7% (incl. 1% stadium, from 2023-07-01) + $2.50/room-night. Decision support.",
    "magnitude": "$28.3M · narrative, rounded (commission minutes)",
    "asOf": "FY2026 YTD Jul 2025–Feb 2026, tourism-promotion share",
    "sourceLabel": "Metro Tourism & Convention Commission — MTCC minutes, 2026-05-12 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://www.nashville.gov/sites/default/files/2026-09/Tourism_and_Convention_Commission_Minutes_May-12-2026.pdf",
        "label": "Metro Tourism & Convention Commission — MTCC minutes, 2026-05-12",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-nashville-000000-gaps",
    "marketSlug": "nashville",
    "kind": "tax",
    "title": "Nashville hotel-tax series — gaps",
    "body": "Nashville hotel-tax series gaps (as of 2026-10-11): Monthly: no public read. No monthly Metro hotel-tax collections release was found this pass. | FY2025 Revenue Manual actual for object 403207 and FY2026 full year: not yet found / not yet published. Decision support.",
    "magnitude": "no public read",
    "asOf": "2026-10-11",
    "sourceLabel": "Official publishers (gap note; no public read)",
    "sourceUrls": null
  },
  {
    "id": "tax-washington-dc-201909-fy",
    "marketSlug": "washington-dc",
    "kind": "tax",
    "title": "Washington DC hotel & lodging sales tax, annual — FY2019 (pre-COVID reference) (Oct 2018–Sep 2019)",
    "body": "Washington DC hotel & lodging sales tax, annual, FY2019 (pre-COVID reference) (Oct 2018–Sep 2019): Amount: $319.2M · YoY: n/a. Basis: gross collections; FY Oct–Sep. Gross collections, FY Oct–Sep. The 2023-04-01 rate step inflates FY2023–FY2024 YoY. DC sales tax on hotel rooms 15.95% (14.95% before 2023-04-01); figures gross, before dedications. Decision support.",
    "magnitude": "$319.2M · gross collections",
    "asOf": "FY2019 (pre-COVID reference) (Oct 2018–Sep 2019)",
    "sourceLabel": "DC OCFO, Office of Revenue Analysis — ORA blog (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://ora-cfo.dc.gov/blog/dc-restaurant-sector-lags-hotel-and-other-retail-post-pandemic-recovery",
        "label": "DC OCFO, Office of Revenue Analysis — ORA blog",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-washington-dc-202409-fy",
    "marketSlug": "washington-dc",
    "kind": "tax",
    "title": "Washington DC hotel & lodging sales tax, annual — FY2024 (Oct 2023–Sep 2024)",
    "body": "Washington DC hotel & lodging sales tax, annual, FY2024 (Oct 2023–Sep 2024): Amount: $396.078M (taxable sales $2.483B) · YoY: n/a (FY2023 not pulled). Basis: gross collections; FY Oct–Sep. Gross collections, FY Oct–Sep. The 2023-04-01 rate step inflates FY2023–FY2024 YoY. DC sales tax on hotel rooms 15.95% (14.95% before 2023-04-01); figures gross, before dedications. Decision support.",
    "magnitude": "$396.078M (taxable sales $2.483B) · gross collections",
    "asOf": "FY2024 (Oct 2023–Sep 2024)",
    "sourceLabel": "DC OCFO, Office of Revenue Analysis — FY2026 Revenue Chapter, Table 3-6 (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://ora-cfo.dc.gov/sites/default/files/dc/sites/ora-cfo/publication/attachments/FY%202026%20Revenue%20Chapter.pdf",
        "label": "DC OCFO, Office of Revenue Analysis — FY2026 Revenue Chapter, Table 3-6",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-washington-dc-202509-fy",
    "marketSlug": "washington-dc",
    "kind": "tax",
    "title": "Washington DC hotel & lodging sales tax, annual — FY2025 (Oct 2024–Sep 2025)",
    "body": "Washington DC hotel & lodging sales tax, annual, FY2025 (Oct 2024–Sep 2025): Amount: $408.046M · YoY: +3.0% (published FY2025 actual growth). Basis: gross collections; FY Oct–Sep. Gross collections, FY Oct–Sep. The 2023-04-01 rate step inflates FY2023–FY2024 YoY. DC sales tax on hotel rooms 15.95% (14.95% before 2023-04-01); figures gross, before dedications. Decision support.",
    "magnitude": "$408.046M (+3.0% YoY) · gross collections",
    "asOf": "FY2025 (Oct 2024–Sep 2025)",
    "sourceLabel": "DC OCFO, Office of Revenue Analysis — ORA blog (accessed 2026-10-11)",
    "sourceUrls": [
      {
        "url": "https://ora-cfo.dc.gov/blog/dc-restaurant-sector-lags-hotel-and-other-retail-post-pandemic-recovery",
        "label": "DC OCFO, Office of Revenue Analysis — ORA blog",
        "secondary": false
      }
    ]
  },
  {
    "id": "tax-washington-dc-000000-gaps",
    "marketSlug": "washington-dc",
    "kind": "tax",
    "title": "Washington DC hotel-tax series — gaps",
    "body": "Washington DC hotel-tax series gaps (as of 2026-10-11): Monthly: OCFO publishes monthly cash reports, but the listing page is JS-rendered and the hotel-tax line could not be retrieved this pass — no public read. | FY2020–FY2023 annual figures not pulled this pass. Decision support.",
    "magnitude": "no public read",
    "asOf": "2026-10-11",
    "sourceLabel": "Official publishers (gap note; no public read)",
    "sourceUrls": null
  }
];
