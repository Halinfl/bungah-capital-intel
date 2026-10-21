import type { SourceUrl } from "./linked-signal";

// Verified source links for previously unlinked cited signals (2026-10-11, 21:xx ET).
// URLs come from the research library or an original public document; each was fetched (HTTP 200) and checked
// to contain the cited figure/event before attaching. Matched by fixed id, falling back to exact title.
// Figures unchanged. Rows that could not be verified stay unlinked.
export const SOURCE_URLS_VERIFIED_2026_10_11: { id: string; title: string; sourceUrls: SourceUrl[] }[] = [
  {
    "id": "cmulbe0zb0032a025kukijrsa",
    "title": "Orlando record visitors 2025",
    "sourceUrls": [
      {
        "url": "https://www.visitorlando.org/about/resources/data-trends/",
        "label": "Visit Orlando Data & Trends",
        "secondary": false
      },
      {
        "url": "https://www.prnewswire.com/news-releases/orlando-welcomed-record-76-7-million-visitors-in-2025--remaining-no-1-most-visited-destination-in-the-us-302766198.html",
        "label": "Visit Orlando via PR Newswire",
        "secondary": false
      }
    ]
  },
  {
    "id": "cmulbe0zb0033a0258xermcyk",
    "title": "Orlando MSA room inventory",
    "sourceUrls": [
      {
        "url": "https://www.visitorlando.org/about/resources/data-trends/",
        "label": "Visit Orlando Data & Trends",
        "secondary": false
      }
    ]
  },
  {
    "id": "cmulbe0zb0034a025osc21w4b",
    "title": "Which Orlando — impact ≠ scarcity",
    "sourceUrls": [
      {
        "url": "https://www.visitorlando.org/about/resources/data-trends/",
        "label": "Visit Orlando Data & Trends",
        "secondary": false
      }
    ]
  },
  {
    "id": "cmulbe0zb0036a025vmc4u8wc",
    "title": "Las Vegas visitation softness 2025",
    "sourceUrls": [
      {
        "url": "https://www.lvcva.com/research/faqs/",
        "label": "LVCVA FAQ",
        "secondary": false
      },
      {
        "url": "https://news3lv.com/newsletter-daily/las-vegas-tourism-falls-75-percent-2025-december-visitation-lvcva-convention-visitors-economy-policy-hotels-casinos-gaming",
        "label": "News3LV",
        "secondary": false
      }
    ]
  },
  {
    "id": "cmulbe0zb0037a025ojps3y9d",
    "title": "Vegas OCC split — weekend vs midweek",
    "sourceUrls": [
      {
        "url": "https://www.lvcva.com/research/faqs/",
        "label": "LVCVA FAQ",
        "secondary": false
      }
    ]
  },
  {
    "id": "cmulbe0zb0038a025948usbrc",
    "title": "Hard Rock supply-return watch (2027)",
    "sourceUrls": [
      {
        "url": "https://www.reviewjournal.com/business/casinos-gaming/guitar-tower-exterior-nearing-completion-hard-rock-pacing-toward-27-opening-3867603/",
        "label": "Las Vegas Review-Journal",
        "secondary": false
      }
    ]
  },
  {
    "id": "cmulbe0zb003aa025zcovfquq",
    "title": "Vegas July 2026 monthly pulse (LVCVA)",
    "sourceUrls": [
      {
        "url": "https://www.fox5vegas.com/2026/08/28/las-vegas-visitor-volume-rises-july-convention-attendance-falls/",
        "label": "FOX5 Vegas",
        "secondary": false
      }
    ]
  },
  {
    "id": "cmulbe0zb003ba025o2z2tfth",
    "title": "Orlando Q3 2025 Metro lodging (Visit Orlando / STR)",
    "sourceUrls": [
      {
        "url": "https://assets.simpleviewinc.com/simpleview/image/upload/v1/clients/orlandofl/Q3_2025_Organization_Highlights_2a642762-84a5-4e10-8304-01dd176ddb14.pdf",
        "label": "Visit Orlando Q3 2025 Organization Highlights",
        "secondary": false
      }
    ]
  },
  {
    "id": "cmulbe10t003ca025yz7r0blh",
    "title": "Chicago CBD 2025 hotel performance (Choose Chicago)",
    "sourceUrls": [
      {
        "url": "https://cdn.choosechicago.com/uploads/2026/01/Hotel-Performance-2025.pdf",
        "label": "Choose Chicago Hotel Performance 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "cmulbe10t003da025i7nvz2zw",
    "title": "Chicago CBD leisure vs group mix 2025",
    "sourceUrls": [
      {
        "url": "https://cdn.choosechicago.com/uploads/2026/01/Hotel-Performance-2025.pdf",
        "label": "Choose Chicago Hotel Performance 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "cmulbe10t003ea0259yzsv9rv",
    "title": "Which Chicago — CBD metrics ≠ MSA",
    "sourceUrls": [
      {
        "url": "https://cdn.choosechicago.com/uploads/2026/01/Hotel-Performance-2025.pdf",
        "label": "Choose Chicago Hotel Performance 2025",
        "secondary": false
      }
    ]
  },
  {
    "id": "cmulbe10t003fa025nhwyql25",
    "title": "Miami-Dade hotel YTD through Oct 2025 (GMCVB)",
    "sourceUrls": [
      {
        "url": "https://www.miamiandbeaches.com/getmedia/b4f3673d-c9b4-4f06-bd2f-7321e223b822/2025_dec_Miami-Dade_Industry_Updates.pdf",
        "label": "GMCVB Miami-Dade Industry Updates (Dec 2025)",
        "secondary": false
      }
    ]
  },
  {
    "id": "cmulbe10t003ga025va63mxkz",
    "title": "Miami-Dade Jan–May 2026 hotel pulse (GMCVB)",
    "sourceUrls": [
      {
        "url": "https://www.miamiandbeaches.com/getmedia/ceffb920-27b1-4415-b925-f7149e3d865a/2026_May_Miami-Dade_Industry_Updates.pdf",
        "label": "GMCVB Miami-Dade Industry Updates (Jun 2026)",
        "secondary": false
      }
    ]
  },
  {
    "id": "cmulbe10t003ha025j6iwapkp",
    "title": "Which Miami — county CVB ≠ MSA average",
    "sourceUrls": [
      {
        "url": "https://www.miamiandbeaches.com/getmedia/b4f3673d-c9b4-4f06-bd2f-7321e223b822/2025_dec_Miami-Dade_Industry_Updates.pdf",
        "label": "GMCVB Miami-Dade Industry Updates (Dec 2025)",
        "secondary": false
      }
    ]
  },
  {
    "id": "cmulbe12a003ka025h6ujkv4y",
    "title": "Austin local HOT FY2025 (tax / room-revenue proxy — NOT RevPAR)",
    "sourceUrls": [
      {
        "url": "https://data.texas.gov/resource/er34-v24h.json?type=city&name=Austin",
        "label": "Texas Comptroller Local HOT 2025 (data.texas.gov, Austin rows)",
        "secondary": false
      },
      {
        "url": "https://data.texas.gov/dataset/Local-Hotel-Occupancy-Tax-Reporting-2025/er34-v24h",
        "label": "Local HOT Reporting 2025 dataset (data.texas.gov)",
        "secondary": false
      }
    ]
  },
  {
    "id": "cmulbe12a003la02506zvpkkg",
    "title": "Dallas local HOT FY2025 (tax / room-revenue proxy — NOT RevPAR)",
    "sourceUrls": [
      {
        "url": "https://data.texas.gov/resource/er34-v24h.json?type=city&name=Dallas",
        "label": "Texas Comptroller Local HOT 2025 (data.texas.gov, Dallas rows)",
        "secondary": false
      },
      {
        "url": "https://data.texas.gov/dataset/Local-Hotel-Occupancy-Tax-Reporting-2025/er34-v24h",
        "label": "Local HOT Reporting 2025 dataset (data.texas.gov)",
        "secondary": false
      }
    ]
  },
  {
    "id": "cmulbe12a003ma025zbf13w4o",
    "title": "Houston local HOT FY2025 (tax / room-revenue proxy — NOT RevPAR)",
    "sourceUrls": [
      {
        "url": "https://data.texas.gov/resource/er34-v24h.json?type=city&name=Houston",
        "label": "Texas Comptroller Local HOT 2025 (data.texas.gov, Houston rows)",
        "secondary": false
      },
      {
        "url": "https://data.texas.gov/dataset/Local-Hotel-Occupancy-Tax-Reporting-2025/er34-v24h",
        "label": "Local HOT Reporting 2025 dataset (data.texas.gov)",
        "secondary": false
      }
    ]
  },
  {
    "id": "cmulbe12b003na025cmxsfw0b",
    "title": "San Antonio local HOT FY2025 (tax / room-revenue proxy — NOT RevPAR)",
    "sourceUrls": [
      {
        "url": "https://data.texas.gov/resource/er34-v24h.json?type=city&name=San%20Antonio",
        "label": "Texas Comptroller Local HOT 2025 (data.texas.gov, San Antonio rows)",
        "secondary": false
      },
      {
        "url": "https://data.texas.gov/dataset/Local-Hotel-Occupancy-Tax-Reporting-2025/er34-v24h",
        "label": "Local HOT Reporting 2025 dataset (data.texas.gov)",
        "secondary": false
      }
    ]
  },
  {
    "id": "cmulbe12b003pa0250gg09lkk",
    "title": "Texas HOT ≠ RevPAR — municipal tax scope",
    "sourceUrls": [
      {
        "url": "https://comptroller.texas.gov/transparency/local/hotel-receipts/",
        "label": "Texas Comptroller — local hotel occupancy tax",
        "secondary": false
      }
    ]
  },
  {
    "id": "cmulbe12b003qa0254lo2x922",
    "title": "NYC HTX ≠ RevPAR — tax liability vs STR metrics",
    "sourceUrls": [
      {
        "url": "https://www.nyc.gov/site/finance/business/hotel-room-reports-statistical-profiles.page",
        "label": "NYC Dept. of Finance — Hotel Room Occupancy Tax reports",
        "secondary": false
      }
    ]
  },
  {
    "id": "sweep-20261011-las-skift-wk-oct3",
    "title": "Las Vegas only top-25 market down in week ending Oct 3 (RevPAR −18%)",
    "sourceUrls": [
      {
        "url": "https://dlr.skift.com/2026/10/07/accor-opens-first-emblems-collection-hotel-in-north-america/",
        "label": "Skift Daily Lodging Report (Oct 7 2026)",
        "secondary": false
      }
    ]
  },
  {
    "id": "sweep-20261011-mia-arlo-wynwood",
    "title": "Arlo Wynwood trade — about $65M, no cap disclosed",
    "sourceUrls": [
      {
        "url": "https://commercialobserver.com/2026/09/arlo-wynwood-miami-dauntless-capital-partners-quadrum-global/",
        "label": "Commercial Observer",
        "secondary": false
      }
    ]
  }
];
