// QA-cleared 2026-10-19 capital load: Hyatt Regency Waikiki loan-watch row + national rate / lodging special-servicing rows. Fixed ids.
export const CAPITAL_2026_10_19 = [
  {
    "id": "w1c-honolulu-debt-hyatt-regency-waikiki-ss",
    "marketSlug": "honolulu",
    "kind": "debt",
    "title": "Hyatt Regency Waikiki — $302.2M CMBS loan in special servicing (watch)",
    "body": "Honolulu — debt & deals: CMBS / SASB loans. Hyatt Regency Waikiki Beach Resort & Spa (1,230 keys), HONO 2021-LULU: $302.2M · Watch. Special servicing since Oct 2026, after missing its extended final maturity · 2026-10-16. No debt yield is shown until the loan's cash-flow figures reconcile. Decision support.",
    "magnitude": "$302.2M · watch",
    "asOf": "2026-10-16",
    "sourceLabel": "Commercial Observer (accessed 2026-10-19)",
    "sourceUrls": [
      {
        "url": "https://commercialobserver.com/2026/10/cmbs-loan-hyatt-regency-waikiki-beach-resort-special-servicing/",
        "label": "Hyatt Regency Waikiki Beach Resort & Spa, HONO 2021-LULU — Commercial Observer",
        "secondary": false
      }
    ]
  },
  {
    "id": "cap-20261019-us-10y",
    "marketSlug": null,
    "kind": "rates",
    "title": "US 10-year Treasury 5.09% (Oct 16 close)",
    "body": "10-year Treasury 5.09% at the Oct 16 close (Treasury par yield curve); 5.10% on Oct 15 (FRED DGS10). National rate read for the refinance test. Decision support.",
    "magnitude": "5.09%",
    "asOf": "2026-10-16",
    "sourceLabel": "U.S. Treasury · FRED (accessed 2026-10-19)",
    "sourceUrls": [
      {
        "url": "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?field_tdr_date_value=2026&type=daily_treasury_yield_curve",
        "label": "10-year 5.09%, Oct 16 — U.S. Treasury par yield curve",
        "secondary": false
      },
      {
        "url": "https://fred.stlouisfed.org/series/DGS10",
        "label": "10-year 5.10%, Oct 15 — FRED DGS10",
        "secondary": false
      }
    ]
  },
  {
    "id": "cap-20261019-us-sofr",
    "marketSlug": null,
    "kind": "rates",
    "title": "SOFR 3.88% (Oct 16)",
    "body": "SOFR 3.88% on Oct 16 (range 3.87–3.90% since Oct 1). National rate read for the refinance test. Decision support.",
    "magnitude": "3.88%",
    "asOf": "2026-10-16",
    "sourceLabel": "FRED (accessed 2026-10-19)",
    "sourceUrls": [
      {
        "url": "https://fred.stlouisfed.org/series/SOFR",
        "label": "SOFR 3.88%, Oct 16 — FRED",
        "secondary": false
      }
    ]
  },
  {
    "id": "cap-20261019-us-fed-funds",
    "marketSlug": null,
    "kind": "rates",
    "title": "Fed funds target 3.75–4.00%",
    "body": "Fed funds target range 3.75–4.00%, set by the Sep 16, 2026 FOMC (+25 bp) and unchanged since. National rate read for the refinance test. Decision support.",
    "magnitude": "3.75–4.00%",
    "asOf": "2026-10-19",
    "sourceLabel": "Federal Reserve (accessed 2026-10-19)",
    "sourceUrls": [
      {
        "url": "https://www.federalreserve.gov/newsevents/pressreleases/monetary20260916a.htm",
        "label": "FOMC statement, Sep 16 2026 — Federal Reserve",
        "secondary": false
      }
    ]
  },
  {
    "id": "cap-20261019-us-lodging-ss",
    "marketSlug": null,
    "kind": "cmbs",
    "title": "US lodging CMBS special servicing 8.95% (Sep 2026)",
    "body": "Lodging CMBS special-servicing rate 8.95% in September, up from 8.74% in August; year-ago 9.91%. National read, not a market read. Decision support.",
    "magnitude": "8.95%",
    "asOf": "2026-10-13",
    "sourceLabel": "TreppTalk (accessed 2026-10-19)",
    "sourceUrls": [
      {
        "url": "https://www.trepp.com/trepptalk/cmbs-special-servicing-rate-september-2026",
        "label": "Lodging special servicing 8.95%, Sep 2026 — TreppTalk (Oct 13)",
        "secondary": false
      }
    ]
  }
];
