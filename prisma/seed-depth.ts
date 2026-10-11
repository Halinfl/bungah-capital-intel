/** Auto-maintained destination depth for every seeded market (illustrative tier). */
export const ILLUSTRATIVE = "Illustrative seed — replace with licensed STR/Tourism Economics";

export type DepthSignal = {
  kind: string;
  title: string;
  body: string;
  magnitude?: string;
  asOf?: string;
};

export type DepthAsset = {
  name: string;
  assetClass: string;
  keys?: number;
  submarket?: string;
  notes?: string;
};

export type MarketDepth = {
  nuanceNote: string;
  signals: DepthSignal[];
  asset?: DepthAsset;
};

export const MARKET_DEPTH: Record<string, MarketDepth> = {
  "new-york-city": {
    nuanceNote: "Which NYC: Midtown group / luxury ADR is not outer-borough or Jersey inventory. International recovery and Broadway calendar support the tape — but borough and product-class spreads dominate. Ask which competitive set, not “NYC is scarce.” NYC Finance HTX = tax / room-revenue liability proxy — NOT RevPAR/OCC/ADR. Market OCC/ADR remain illustrative until licensed STR/CVB.",
    signals: [
          {
                "kind": "demand",
                "title": "International + group calendar recovery",
                "body": "Gateway leisure and corporate/group demand remain the MSA spine. Midtown and Manhattan luxury print ADR far above outer boroughs — do not underwrite the MSA from Midtown comps alone.",
                "magnitude": "Manhattan ADR premium (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Constrained Manhattan vs outer borough pipeline",
                "body": "Illustrative: Manhattan ground-up remains hard; conversions and outer-borough/NJ additions can still dilute metro RevPAR if absorption lags. Pair pipeline with submarket absorption.",
                "magnitude": "pipeline watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "High-touch staffing greenlight gate",
                "body": "Illustrative: full-service and luxury product needs deep labor markets. CapEx and refinance greenlights should clear talent + GC/MEP capacity — not demand headlines alone.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Midtown Manhattan full-service class (illustrative)",
          "assetClass": "full-service / group",
          "submarket": "Midtown Manhattan",
          "notes": "Proxy for Midtown group/luxury ADR power vs outer-borough select-service. Not a single asset — underwrite which NYC."
    },
  },
  "miami": {
    nuanceNote: "Which Miami: South Beach luxury ADR is not inland select-service or Broward spillover. International gateway + leisure/group hybrid; hurricane and insurance overlays matter. Impact headlines ≠ corridor scarcity. GMCVB lodging color is Miami-Dade–scoped.",
    signals: [
          {
                "kind": "demand",
                "title": "International gateway + leisure/group hybrid",
                "body": "Illustrative: South Beach and Brickell leisure/corporate demand can print ADR well above inland corridors. Do not underwrite the MSA from beach comps alone.",
                "magnitude": "beach ADR premium (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Coastal vs inland supply watch",
                "body": "Illustrative: beach and Brickell pipeline vs inland limited-service absorption. Storm rebuild cycles can add keys unevenly — pair with insurance cost trajectory.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Hospitality + storm-rebuild crew gate",
                "body": "Illustrative: high-touch beach/resort product and post-storm GC/MEP capacity gate CapEx. Talent depth is a refinance greenlight input.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "South Beach luxury / lifestyle class (illustrative)",
          "assetClass": "luxury / lifestyle",
          "submarket": "South Beach",
          "notes": "Proxy for beach luxury ADR vs inland select-service. Underwrite which Miami — not MSA averages."
    },
  },
  "los-angeles": {
    nuanceNote: "Which LA: LAX transient, Hollywood entertainment, Downtown group, and beach leisure underwrite as separate theses. Diverse demand stack ≠ uniform scarcity. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Leisure + entertainment + international stack",
                "body": "Illustrative: entertainment production, leisure, and international demand support the MSA — but LAX, Hollywood, DTLA, and beach corridors print different RevPAR. Ask which LA.",
                "magnitude": "corridor spreads (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Multi-corridor pipeline watch",
                "body": "Illustrative: supply additions concentrate unevenly (LAX, Hollywood, Downtown). Absorption must be underwritten by corridor, not MSA averages.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Entertainment + hospitality staffing gate",
                "body": "Illustrative: full-service and lifestyle product compete with entertainment crews for talent. CapEx greenlights need staffing + GC capacity clearance.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "LAX / airport corridor select-service class (illustrative)",
          "assetClass": "select-service",
          "submarket": "LAX corridor",
          "notes": "Proxy for airport transient vs beach/Hollywood product. Not MSA-representative — underwrite which LA."
    },
  },
  "chicago": {
    nuanceNote: "Which Chicago: Loop/River North group and summer leisure are not suburban O’Hare corridors. Convention + corporate spine supports weekday; submarket selection drives outcomes. Choose Chicago lodging PDF is CBD-scoped — not full MSA.",
    signals: [
          {
                "kind": "demand",
                "title": "Convention + corporate weekday spine",
                "body": "Illustrative: McCormick-adjacent and River North group demand support weekday OCC; summer leisure fills weekends. Loop comps are not O’Hare comps.",
                "magnitude": "group weekday (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Loop vs suburban pipeline watch",
                "body": "Illustrative: downtown and suburban O’Hare corridors absorb differently. New keys into soft corridors dilute RevPAR if calendar misses.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Union / full-service staffing gate",
                "body": "Illustrative: unionized full-service and large-box group hotels need staffing depth. CapEx and refinance greenlights should clear talent capacity.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "River North / Loop full-service class (illustrative)",
          "assetClass": "full-service / group",
          "submarket": "Loop / River North",
          "notes": "Proxy for downtown group spine vs suburban O’Hare. Underwrite which Chicago."
    },
  },
  "san-francisco-bay": {
    nuanceNote: "Which Bay: Union Square leisure/group recovery is not Peninsula tech midweek or East Bay limited-service. Post-pandemic OCC recovery remains uneven by submarket. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Tech corporate + international leisure (uneven)",
                "body": "Illustrative: Peninsula midweek tech and Union Square leisure/international recover on different tapes. Do not underwrite SF from Peninsula comps or vice versa.",
                "magnitude": "submarket split (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Union Square vs Peninsula supply watch",
                "body": "Illustrative: conversions and selective new supply into soft Union Square can lag absorption. Pair pipeline with corporate return-to-office reality.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "High-cost labor market greenlight",
                "body": "Illustrative: Bay Area wage and staffing pressure gates CapEx for full-service product. Talent clearance before refinance greenlight.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Union Square full-service class (illustrative)",
          "assetClass": "full-service",
          "submarket": "Union Square / Downtown SF",
          "notes": "Proxy for downtown SF recovery vs Peninsula. Underwrite which Bay corridor."
    },
  },
  "seattle": {
    nuanceNote: "Which Seattle: Downtown leisure/cruise and Bellevue tech midweek are not airport corridors. Tech + cruise + Alaska airlift support demand — submarket selection still dominates. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Tech midweek + cruise/leisure weekends",
                "body": "Illustrative: Bellevue/corporate midweek and downtown cruise/leisure weekends can diverge. Ask which Seattle before CapEx.",
                "magnitude": "tech + cruise (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Downtown vs Bellevue pipeline watch",
                "body": "Illustrative: new keys into downtown or Bellevue need absorption against tech cycle and cruise calendar. Supply watch market.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Tech-competing hospitality staffing gate",
                "body": "Illustrative: hospitality competes with tech for labor. CapEx greenlights need staffing + GC/MEP capacity.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Downtown Seattle / waterfront class (illustrative)",
          "assetClass": "full-service",
          "submarket": "Downtown / waterfront",
          "notes": "Proxy for downtown leisure/cruise vs Bellevue corporate. Underwrite which Seattle."
    },
  },
  "boston": {
    nuanceNote: "Which Boston: Back Bay / Seaport group and biotech midweek are not airport or Cambridge limited-service. Constrained supply supports ADR — seasonality and group calendar still matter. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Education, healthcare, biotech + leisure",
                "body": "Illustrative: biotech/healthcare midweek and leisure/education weekends support ADR. Back Bay/Seaport comps are not airport comps.",
                "magnitude": "constrained ADR (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Constrained urban supply watch",
                "body": "Illustrative: limited urban ground-up supports ADR, but selective additions and conversions still need absorption against group calendar.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Healthcare-competing labor greenlight",
                "body": "Illustrative: hospitality competes with healthcare/education for talent. CapEx greenlights clear staffing depth first.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Back Bay / Seaport full-service class (illustrative)",
          "assetClass": "full-service / group",
          "submarket": "Back Bay / Seaport",
          "notes": "Proxy for urban group/biotech ADR power. Underwrite which Boston."
    },
  },
  "washington-dc": {
    nuanceNote: "Which DC: Downtown associations/government weekday is not Arlington or National Harbor leisure. Weekday group strength; weekend leisure fill varies sharply by submarket. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Government + associations weekday spine",
                "body": "Illustrative: weekday group/government demand supports downtown; weekend leisure strategies differ by corridor (Capitol Riverfront, Arlington, National Harbor).",
                "magnitude": "weekday group (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "District vs Virginia/Maryland pipeline",
                "body": "Illustrative: supply in DC proper vs Arlington/National Harbor absorbs differently. Pair pipeline with association calendar.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Association/group staffing greenlight",
                "body": "Illustrative: large-box group hotels need banquet and staffing depth. CapEx greenlights gate on talent + GC capacity.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Downtown DC / Penn Quarter group class (illustrative)",
          "assetClass": "full-service / group",
          "submarket": "Downtown DC",
          "notes": "Proxy for association/government weekday spine vs suburban corridors. Underwrite which DC."
    },
  },
  "atlanta": {
    nuanceNote: "Which Atlanta: Buckhead corporate, Downtown group, and airport corridors underwrite as separate theses. Hartsfield hub demand ≠ uniform MSA scarcity. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Hartsfield hub + corporate/group",
                "body": "Illustrative: airport transient, Buckhead corporate, and Downtown group print different RevPAR. Do not underwrite Atlanta from one corridor.",
                "magnitude": "corridor spreads (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Elevated historical supply / absorption watch",
                "body": "Illustrative: Atlanta has seen elevated supply cycles. New keys need clear absorption thesis by Buckhead, Downtown, or airport.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Hub-market staffing greenlight",
                "body": "Illustrative: large inventory competes for hospitality talent. CapEx and refinance greenlights clear staffing + GC/MEP capacity.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Buckhead corporate full-service class (illustrative)",
          "assetClass": "full-service",
          "submarket": "Buckhead",
          "notes": "Proxy for Buckhead corporate vs Downtown group vs airport. Underwrite which Atlanta."
    },
  },
  "dallas": {
    nuanceNote: "Which DFW: Uptown/Downtown Dallas corporate, Fort Worth leisure/group, and airport corridors are separate theses. Large diversified MSA with historically elevated supply — underwrite absorption carefully. City of Dallas HOT = municipal tax / room-revenue proxy (city ≠ MSA) — NOT RevPAR/OCC/ADR. Market OCC/ADR remain illustrative.",
    signals: [
          {
                "kind": "demand",
                "title": "Corporate + leisure diversified stack",
                "body": "Illustrative: Dallas Uptown corporate and Fort Worth leisure/group demand support the MSA — corridor selection still drives outcomes.",
                "magnitude": "diversified demand (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Elevated supply growth / absorption watch",
                "body": "Illustrative: DFW historically adds keys aggressively. CapEx needs absorption and competitive-set clarity, not MSA headlines.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Sunbelt growth staffing gate",
                "body": "Illustrative: fast inventory growth competes for talent and trades. CapEx greenlights clear staffing + GC capacity.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Uptown Dallas / Dallas CBD class (illustrative)",
          "assetClass": "full-service / select-service",
          "submarket": "Uptown / Downtown Dallas",
          "notes": "Proxy for Dallas corporate spine vs Fort Worth or airport. Underwrite which DFW."
    },
  },
  "houston": {
    nuanceNote: "Which Houston: Medical Center, Downtown energy/corporate, and Energy Corridor underwrite differently. Energy cycle + medical demand; hurricane/insurance overlays. City of Houston HOT = municipal tax / room-revenue proxy (city ≠ MSA) — NOT RevPAR/OCC/ADR. Market OCC/ADR remain illustrative.",
    signals: [
          {
                "kind": "demand",
                "title": "Energy + medical + international",
                "body": "Illustrative: Medical Center midweek and energy/corporate demand support corridors unevenly. Do not underwrite Houston from one spine.",
                "magnitude": "medical + energy (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Corridor pipeline + storm rebuild watch",
                "body": "Illustrative: supply and storm-rebuild keys can concentrate unevenly. Pair pipeline with energy cycle and insurance costs.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Medical/energy competing labor gate",
                "body": "Illustrative: hospitality competes with medical and energy for talent. CapEx greenlights need staffing clearance.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Texas Medical Center corridor class (illustrative)",
          "assetClass": "select-service / full-service",
          "submarket": "Medical Center",
          "notes": "Proxy for medical midweek demand vs Energy Corridor or Downtown. Underwrite which Houston."
    },
  },
  "denver": {
    nuanceNote: "Which Denver: Downtown corporate/leisure, airport, and foothills/resort-feeder product differ. Mountain gateway demand ≠ downtown scarcity. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Mountain gateway + corporate",
                "body": "Illustrative: ski-feeder weekends and downtown corporate midweek support demand. Airport and foothills print different RevPAR.",
                "magnitude": "gateway + corporate (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Downtown vs airport pipeline watch",
                "body": "Illustrative: new keys into downtown or airport need absorption against ski calendar and corporate cycle.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Mountain-season staffing gate",
                "body": "Illustrative: seasonal mountain and urban hospitality compete for talent. CapEx greenlights clear staffing + GC capacity.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Downtown Denver / LoDo class (illustrative)",
          "assetClass": "full-service / lifestyle",
          "submarket": "Downtown / LoDo",
          "notes": "Proxy for downtown vs airport vs foothills. Underwrite which Denver."
    },
  },
  "phoenix": {
    nuanceNote: "Which Phoenix: Scottsdale resort/golf luxury is not metro select-service or airport. Seasonal snowbird demand; summer softness is the underwriting tell. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Sunbelt leisure + golf/resort + corporate",
                "body": "Illustrative: Scottsdale luxury and golf/resort seasonality print ADR far above metro select-service. Ask which Phoenix.",
                "magnitude": "Scottsdale premium (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Scottsdale vs metro supply watch",
                "body": "Illustrative: resort corridor vs metro limited-service absorb differently. Seasonal demand makes oversupply costly in summer.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Seasonal resort staffing gate",
                "body": "Illustrative: snowbird-season staffing peaks gate high-touch resort CapEx. Talent clearance before greenlight.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Scottsdale resort / golf class (illustrative)",
          "assetClass": "resort / luxury",
          "submarket": "Scottsdale",
          "notes": "Proxy for Scottsdale luxury vs metro Phoenix select-service. Underwrite which Phoenix."
    },
  },
  "san-diego": {
    nuanceNote: "Which San Diego: Waterfront / Mission Bay resort and biotech midweek are not inland limited-service. Leisure, military, biotech, and convention stack — submarket still dominates. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Leisure + military + biotech + convention",
                "body": "Illustrative: waterfront resort and biotech midweek support ADR; inland corridors print differently. Ask which San Diego.",
                "magnitude": "waterfront premium (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Waterfront vs inland pipeline watch",
                "body": "Illustrative: constrained waterfront supply supports ADR; inland additions need clear absorption.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Biotech-competing hospitality gate",
                "body": "Illustrative: biotech and military-adjacent labor markets compete with hospitality. CapEx greenlights clear staffing depth.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Mission Bay / waterfront resort class (illustrative)",
          "assetClass": "resort / full-service",
          "submarket": "Mission Bay / waterfront",
          "notes": "Proxy for waterfront resort vs inland limited-service. Underwrite which San Diego."
    },
  },
  "honolulu": {
    nuanceNote: "Which Oahu: Waikiki concentration is not neighbor-island resort product. High ADR and international mix; airlift and yen/won sensitivity. Constrained Keys-like inventory logic in Waikiki — still ask which product class. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "International resort + airlift sensitivity",
                "body": "Illustrative: Waikiki ADR power depends on international mix and airlift. Currency (yen/won) and flight capacity are demand tells.",
                "magnitude": "Waikiki ADR (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Waikiki concentration / limited new keys",
                "body": "Illustrative: inventory concentrated in Waikiki; new keys rare but renovations and conversions still matter for competitive set.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Island labor market greenlight",
                "body": "Illustrative: constrained island labor gates high-touch resort CapEx. Talent + housing for staff are refinance inputs.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Waikiki resort / full-service class (illustrative)",
          "assetClass": "resort",
          "submarket": "Waikiki",
          "notes": "Proxy for Waikiki concentration vs neighbor islands. Underwrite which Hawaii product."
    },
  },
  "new-orleans": {
    nuanceNote: "Which NOLA: French Quarter / CBD leisure and group are not suburban limited-service. Cultural events and leisure spine; hurricane and insurance overlays. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Leisure + group + cultural events",
                "body": "Illustrative: French Quarter and CBD event/leisure demand print ADR above suburban corridors. Ask which New Orleans.",
                "magnitude": "Quarter premium (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Quarter/CBD vs suburban pipeline",
                "body": "Illustrative: historic-district constraints vs suburban supply. Storm rebuild can add keys unevenly.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Hospitality + storm-rebuild crew gate",
                "body": "Illustrative: F&B-heavy leisure product and post-storm GC capacity gate CapEx. Talent is a greenlight input.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "French Quarter / CBD leisure class (illustrative)",
          "assetClass": "full-service / lifestyle",
          "submarket": "French Quarter / CBD",
          "notes": "Proxy for Quarter leisure ADR vs suburban. Underwrite which NOLA."
    },
  },
  "austin": {
    nuanceNote: "Which Austin: Downtown SXSW/ACL event spikes and Domain/tech midweek are not airport corridors. Event compression ≠ year-round scarcity. City of Austin HOT = municipal tax / room-revenue proxy (city ≠ MSA; hotel+STR remitters) — NOT RevPAR/OCC/ADR. Market OCC/ADR remain illustrative.",
    signals: [
          {
                "kind": "demand",
                "title": "Tech midweek + SXSW/ACL event spikes",
                "body": "Illustrative: event weeks print outsized ADR; shoulder and midweek tech demand differ. Do not annualize event RevPAR.",
                "magnitude": "event spikes (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Downtown vs Domain pipeline watch",
                "body": "Illustrative: Austin has seen aggressive supply. Absorption against tech cycle and event calendar is the tell.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Tech-competing hospitality staffing gate",
                "body": "Illustrative: hospitality competes with tech for labor. CapEx greenlights clear staffing + GC capacity.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Downtown Austin / Rainey / 2nd St class (illustrative)",
          "assetClass": "full-service / lifestyle",
          "submarket": "Downtown Austin",
          "notes": "Proxy for downtown event/leisure ADR vs Domain or airport. Underwrite which Austin."
    },
  },
  "san-antonio": {
    nuanceNote: "Which San Antonio: River Walk leisure and theme-park corridors are not medical or suburban select-service. Stable leisure spine; ADR below coastal peers. City of San Antonio HOT = municipal tax / room-revenue proxy (city ≠ MSA) — NOT RevPAR/OCC/ADR. Market OCC/ADR remain illustrative.",
    signals: [
          {
                "kind": "demand",
                "title": "River Walk leisure + military + group",
                "body": "Illustrative: River Walk and theme-park leisure support weekends; military and group fill midweek unevenly. Ask which San Antonio.",
                "magnitude": "River Walk leisure (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "River Walk vs suburban supply watch",
                "body": "Illustrative: leisure-corridor additions vs suburban limited-service. Absorption against leisure seasonality matters.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Leisure F&B staffing greenlight",
                "body": "Illustrative: River Walk F&B-heavy product needs staffing depth. CapEx greenlights clear talent capacity.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "River Walk leisure class (illustrative)",
          "assetClass": "full-service / select-service",
          "submarket": "River Walk / Downtown",
          "notes": "Proxy for River Walk leisure vs suburban or medical corridors. Underwrite which San Antonio."
    },
  },
  "tampa": {
    nuanceNote: "Which Tampa Bay: Clearwater/St. Pete beach leisure is not downtown Tampa corporate. Gulf leisure + cruise + corporate; insurance and storm overlays. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Gulf leisure + corporate + cruise",
                "body": "Illustrative: beach leisure ADR and downtown Tampa corporate print different tapes. Ask which Tampa Bay corridor.",
                "magnitude": "beach vs downtown (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Beach vs downtown pipeline watch",
                "body": "Illustrative: beach inventory and downtown additions absorb differently. Storm and insurance costs overlay CapEx.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Beach resort staffing + storm crew gate",
                "body": "Illustrative: seasonal beach staffing and storm-rebuild GC capacity gate CapEx greenlights.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Clearwater / St. Pete beach class (illustrative)",
          "assetClass": "resort / select-service",
          "submarket": "Clearwater / St. Pete Beach",
          "notes": "Proxy for beach leisure vs downtown Tampa corporate. Underwrite which Tampa Bay."
    },
  },
  "jacksonville": {
    nuanceNote: "Which Jacksonville: Beaches leisure is not downtown or logistics corridors. Lower ADR than South Florida; coastal vs inland spreads still matter. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Coastal leisure + logistics/corporate",
                "body": "Illustrative: Jacksonville Beach leisure weekends and downtown/logistics midweek diverge. Ask which Jacksonville.",
                "magnitude": "beaches premium (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Beaches vs downtown pipeline watch",
                "body": "Illustrative: beach and inland supply absorb on different tapes. Pair with insurance cost trajectory.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Coastal leisure staffing gate",
                "body": "Illustrative: seasonal beach staffing gates CapEx for leisure product. Talent clearance before greenlight.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Jacksonville Beaches leisure class (illustrative)",
          "assetClass": "select-service / resort",
          "submarket": "Jacksonville Beaches",
          "notes": "Proxy for beaches leisure vs downtown. Underwrite which Jacksonville."
    },
  },
  "charlotte": {
    nuanceNote: "Which Charlotte: Uptown banking/corporate is not South End lifestyle or airport. Growing leisure; banking hub weekday spine. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Banking/corporate hub + growing leisure",
                "body": "Illustrative: Uptown weekday corporate and South End/leisure weekends print differently. Ask which Charlotte.",
                "magnitude": "Uptown corporate (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Uptown vs South End / airport pipeline",
                "body": "Illustrative: supply into Uptown, South End, or airport needs corridor-level absorption.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Banking-hub hospitality staffing gate",
                "body": "Illustrative: corporate hospitality competes for talent in a growth market. CapEx greenlights clear staffing depth.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Uptown Charlotte full-service class (illustrative)",
          "assetClass": "full-service",
          "submarket": "Uptown",
          "notes": "Proxy for Uptown banking spine vs South End or airport. Underwrite which Charlotte."
    },
  },
  "raleigh": {
    nuanceNote: "Which Triangle: Raleigh corporate/university, Durham, and Cary/RTP midweek are related but not identical. Stable weekday; leisure weekends growing. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Research Triangle corporate + university",
                "body": "Illustrative: RTP/corporate midweek and university calendars support demand. Raleigh vs Durham vs Cary still differ.",
                "magnitude": "RTP midweek (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Triangle multi-node pipeline watch",
                "body": "Illustrative: supply across Raleigh, Durham, and Cary needs node-level absorption — not a single MSA average.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "University/tech competing labor gate",
                "body": "Illustrative: hospitality competes with university and tech for talent. CapEx greenlights clear staffing capacity.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Raleigh / RTP corridor class (illustrative)",
          "assetClass": "select-service / full-service",
          "submarket": "Raleigh / RTP",
          "notes": "Proxy for Triangle corporate midweek. Underwrite which Triangle node."
    },
  },
  "philadelphia": {
    nuanceNote: "Which Philly: Center City historic leisure and medical/university midweek are not airport or King of Prussia. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Historic leisure + corporate + medical/university",
                "body": "Illustrative: Center City leisure/group and medical midweek support ADR; airport and KOP print differently.",
                "magnitude": "Center City (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Center City vs airport / KOP pipeline",
                "body": "Illustrative: urban constrained supply vs suburban additions. Absorption by corridor.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Medical/university competing labor gate",
                "body": "Illustrative: hospitality competes with medical and university employers. CapEx greenlights clear talent.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Center City Philadelphia class (illustrative)",
          "assetClass": "full-service",
          "submarket": "Center City",
          "notes": "Proxy for Center City vs airport/KOP. Underwrite which Philly."
    },
  },
  "detroit": {
    nuanceNote: "Which Detroit: Downtown revitalization and casino leisure are not suburban auto corridors. ADR discount to coastal MSAs; submarket selection still matters. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Auto/corporate + casino leisure",
                "body": "Illustrative: downtown leisure/casino and suburban corporate print different RevPAR. Ask which Detroit.",
                "magnitude": "downtown revitalization (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Downtown vs suburban pipeline watch",
                "body": "Illustrative: selective downtown additions vs suburban corridors. Absorption against auto cycle.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Auto-region hospitality staffing gate",
                "body": "Illustrative: hospitality competes with auto and casino employers for talent. CapEx greenlights clear staffing.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Downtown Detroit / casino district class (illustrative)",
          "assetClass": "full-service / casino-adjacent",
          "submarket": "Downtown Detroit",
          "notes": "Proxy for downtown revitalization vs suburban corridors. Underwrite which Detroit."
    },
  },
  "minneapolis": {
    nuanceNote: "Which Twin Cities: Downtown corporate/medical midweek is not Bloomington/airport or St. Paul. Strong weekday; winter leisure strategies matter. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Corporate + medical + leisure gateway",
                "body": "Illustrative: downtown medical/corporate midweek and leisure weekends support demand. Airport corridor differs.",
                "magnitude": "weekday medical/corporate (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Downtown vs Bloomington pipeline watch",
                "body": "Illustrative: downtown and Mall of America / airport corridors absorb differently.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Medical-competing hospitality gate",
                "body": "Illustrative: medical employers compete for talent. CapEx greenlights clear staffing + winter ops capacity.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Downtown Minneapolis / skyway class (illustrative)",
          "assetClass": "full-service",
          "submarket": "Downtown Minneapolis",
          "notes": "Proxy for downtown vs Bloomington/airport. Underwrite which Twin Cities."
    },
  },
  "portland-or": {
    nuanceNote: "Which Portland: Downtown leisure/tech is not airport or suburban. Outdoor tourism feeder; downtown vs airport spreads. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Leisure + tech/corporate + outdoor feeder",
                "body": "Illustrative: downtown leisure and outdoor tourism weekends support demand; airport corridor differs.",
                "magnitude": "downtown leisure (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Downtown vs airport pipeline watch",
                "body": "Illustrative: selective downtown supply vs airport limited-service. Absorption against leisure calendar.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "PNW hospitality staffing gate",
                "body": "Illustrative: labor market tightness gates full-service CapEx. Talent clearance before greenlight.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Downtown Portland class (illustrative)",
          "assetClass": "full-service / lifestyle",
          "submarket": "Downtown Portland",
          "notes": "Proxy for downtown vs airport/suburban. Underwrite which Portland."
    },
  },
  "salt-lake-city": {
    nuanceNote: "Which SLC: Downtown corporate and ski-gateway product differ from airport. Winter peak; summer national-park flywheel. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Ski gateway + corporate + outdoor leisure",
                "body": "Illustrative: winter ski peaks and summer park flywheel support demand. Downtown vs canyon-gateway product differs.",
                "magnitude": "ski gateway (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Downtown vs canyon-gateway pipeline",
                "body": "Illustrative: urban and mountain-adjacent supply absorb on seasonal tapes. Pair with ski calendar.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Seasonal mountain staffing gate",
                "body": "Illustrative: winter staffing peaks gate resort-adjacent CapEx. Talent is a greenlight input.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Downtown SLC / ski-gateway class (illustrative)",
          "assetClass": "full-service / select-service",
          "submarket": "Downtown / ski gateway",
          "notes": "Proxy for urban vs canyon-gateway. Underwrite which SLC."
    },
  },
  "kansas-city": {
    nuanceNote: "Which KC: Downtown entertainment district growth is not suburban corporate corridors. Sports/leisure + corporate; ADR mid-market. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Corporate + sports/leisure entertainment",
                "body": "Illustrative: downtown entertainment and sports calendars support weekends; suburban corporate midweek differs.",
                "magnitude": "entertainment district (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Downtown entertainment vs suburban pipeline",
                "body": "Illustrative: entertainment-district additions need absorption against sports/leisure calendar.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Entertainment F&B staffing gate",
                "body": "Illustrative: F&B-heavy entertainment product needs staffing depth. CapEx greenlights clear talent.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Downtown KC / Power & Light class (illustrative)",
          "assetClass": "full-service / lifestyle",
          "submarket": "Downtown / entertainment district",
          "notes": "Proxy for downtown entertainment vs suburban. Underwrite which KC."
    },
  },
  "st-louis": {
    nuanceNote: "Which St. Louis: Downtown attractions/leisure is not Clayton corporate or airport. Stable mid-market lodging; submarket selection still matters. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Corporate + leisure/attractions",
                "body": "Illustrative: downtown leisure/attractions and Clayton corporate print different RevPAR.",
                "magnitude": "downtown vs Clayton (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Downtown vs Clayton / airport pipeline",
                "body": "Illustrative: corridors absorb differently — underwrite competitive set, not MSA averages.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Mid-market staffing greenlight",
                "body": "Illustrative: mid-market full-service still needs staffing depth for CapEx greenlights.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Downtown St. Louis / Arch corridor class (illustrative)",
          "assetClass": "full-service / select-service",
          "submarket": "Downtown St. Louis",
          "notes": "Proxy for downtown attractions vs Clayton or airport. Underwrite which St. Louis."
    },
  },
  "indianapolis": {
    nuanceNote: "Which Indy: Downtown Circle group/sports is not airport corridors. Convention + sports calendar sensitive — event compression ≠ year-round scarcity. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Convention + sports + corporate",
                "body": "Illustrative: downtown Circle hotels print event/sports spikes; airport is a different tape. Do not annualize event RevPAR.",
                "magnitude": "event/sports spikes (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Downtown Circle vs airport pipeline",
                "body": "Illustrative: downtown group box and airport limited-service absorb differently against the sports calendar.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Group/banquet staffing greenlight",
                "body": "Illustrative: large-box group hotels need banquet and staffing depth for CapEx greenlights.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Downtown Circle / convention class (illustrative)",
          "assetClass": "full-service / group",
          "submarket": "Downtown Circle",
          "notes": "Proxy for downtown group/sports vs airport. Underwrite which Indy."
    },
  },
  "columbus-oh": {
    nuanceNote: "Which Columbus: Downtown/Short North leisure and university demand are not airport or suburban. State capital + university + corporate. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "State capital + university + corporate",
                "body": "Illustrative: university calendars and downtown leisure support demand; suburban corridors differ.",
                "magnitude": "university + capital (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Downtown vs suburban pipeline watch",
                "body": "Illustrative: Short North/downtown additions vs suburban limited-service. Absorption by corridor.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "University-competing labor gate",
                "body": "Illustrative: university and state employers compete for talent. CapEx greenlights clear staffing.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Downtown / Short North Columbus class (illustrative)",
          "assetClass": "lifestyle / select-service",
          "submarket": "Downtown / Short North",
          "notes": "Proxy for downtown leisure vs suburban. Underwrite which Columbus."
    },
  },
  "cleveland": {
    nuanceNote: "Which Cleveland: Downtown medical/leisure revitalization is not suburban corridors. ADR discount to coastal; submarket still matters. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Medical/corporate + leisure revitalization",
                "body": "Illustrative: downtown medical and leisure revitalization support selective ADR; suburbs print differently.",
                "magnitude": "downtown revitalization (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Downtown vs suburban pipeline watch",
                "body": "Illustrative: selective downtown supply vs suburban. Absorption against medical calendar.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Medical-competing hospitality gate",
                "body": "Illustrative: medical employers compete for talent. CapEx greenlights clear staffing depth.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Downtown Cleveland / Playhouse Square class (illustrative)",
          "assetClass": "full-service / select-service",
          "submarket": "Downtown Cleveland",
          "notes": "Proxy for downtown revitalization vs suburbs. Underwrite which Cleveland."
    },
  },
  "pittsburgh": {
    nuanceNote: "Which Pittsburgh: Downtown / North Shore event demand is not suburban medical/education corridors. Healthcare and education spine. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Healthcare + education + North Shore events",
                "body": "Illustrative: North Shore sports/events and medical midweek support demand. Ask which Pittsburgh corridor.",
                "magnitude": "North Shore events (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Downtown / North Shore vs suburban pipeline",
                "body": "Illustrative: event-adjacent supply needs absorption against sports calendar.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Healthcare-competing labor gate",
                "body": "Illustrative: healthcare employers compete for talent. CapEx greenlights clear staffing.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "North Shore / Downtown Pittsburgh class (illustrative)",
          "assetClass": "full-service",
          "submarket": "North Shore / Downtown",
          "notes": "Proxy for event demand vs suburban medical. Underwrite which Pittsburgh."
    },
  },
  "cincinnati": {
    nuanceNote: "Which Cincinnati: CBD / riverfront leisure is not Northern Kentucky or suburban corridors. Corporate + leisure riverfront. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Corporate + riverfront leisure",
                "body": "Illustrative: CBD/riverfront leisure and corporate midweek support demand; NKY and suburbs differ.",
                "magnitude": "riverfront leisure (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "CBD vs Northern Kentucky pipeline",
                "body": "Illustrative: riverfront and NKY supply absorb on different tapes.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Riverfront hospitality staffing gate",
                "body": "Illustrative: F&B-heavy riverfront product needs staffing depth for CapEx greenlights.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "CBD / riverfront Cincinnati class (illustrative)",
          "assetClass": "full-service / lifestyle",
          "submarket": "CBD / riverfront",
          "notes": "Proxy for riverfront vs NKY/suburban. Underwrite which Cincinnati."
    },
  },
  "baltimore": {
    nuanceNote: "Which Baltimore: Inner Harbor leisure is not Columbia/Towson or BWI corridors. DC spillover on some weekends; waterfront product mix. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Inner Harbor leisure + medical/corporate",
                "body": "Illustrative: Inner Harbor leisure and medical midweek support demand; BWI corridor differs. Occasional DC spillover.",
                "magnitude": "Inner Harbor (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Harbor vs BWI / suburban pipeline",
                "body": "Illustrative: waterfront vs airport supply absorb differently.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Harbor leisure staffing gate",
                "body": "Illustrative: waterfront leisure F&B needs staffing depth. CapEx greenlights clear talent.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Inner Harbor Baltimore class (illustrative)",
          "assetClass": "full-service / select-service",
          "submarket": "Inner Harbor",
          "notes": "Proxy for harbor leisure vs BWI/suburban. Underwrite which Baltimore."
    },
  },
  "virginia-beach-norfolk": {
    nuanceNote: "Which Hampton Roads: Virginia Beach oceanfront resort is not Norfolk ports/military or Newport News. Highly seasonal oceanfront; inland differs. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Beach leisure + military + ports",
                "body": "Illustrative: oceanfront summer peaks and military/ports midweek diverge sharply. Ask which Hampton Roads.",
                "magnitude": "oceanfront seasonal (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Oceanfront vs inland pipeline watch",
                "body": "Illustrative: oceanfront resort inventory vs inland limited-service. Seasonality makes oversupply costly off-peak.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Seasonal beach staffing gate",
                "body": "Illustrative: summer staffing peaks gate oceanfront CapEx. Talent clearance before greenlight.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Virginia Beach oceanfront class (illustrative)",
          "assetClass": "resort / select-service",
          "submarket": "Virginia Beach oceanfront",
          "notes": "Proxy for oceanfront vs Norfolk/Newport News. Underwrite which Hampton Roads."
    },
  },
  "charleston-sc": {
    nuanceNote: "Which Charleston: Historic peninsula scarcity supports ADR — that is not North Charleston or airport limited-service. Culinary/leisure destination; hurricane overlay. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Historic leisure + culinary destination",
                "body": "Illustrative: peninsula leisure ADR prints far above North Charleston. Weekend leisure vs midweek group differ.",
                "magnitude": "peninsula ADR (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Constrained peninsula vs North Charleston supply",
                "body": "Illustrative: peninsula constraints support ADR; North Charleston additions are a different competitive set.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "High-touch culinary/leisure staffing gate",
                "body": "Illustrative: culinary and high-touch leisure product needs deep staffing. CapEx greenlights clear talent + storm GC capacity.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Historic Charleston peninsula class (illustrative)",
          "assetClass": "boutique / full-service",
          "submarket": "Historic peninsula",
          "notes": "Proxy for peninsula scarcity vs North Charleston. Underwrite which Charleston."
    },
  },
  "savannah": {
    nuanceNote: "Which Savannah: Historic district scarcity supports weekend ADR — that is not suburban supply. Historic leisure destination. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Historic leisure weekend ADR power",
                "body": "Illustrative: historic district weekend leisure prints ADR above suburban corridors. Ask which Savannah.",
                "magnitude": "historic district (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Historic district vs suburban pipeline",
                "body": "Illustrative: constrained historic inventory vs suburban additions. Absorption on leisure calendar.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Historic leisure staffing gate",
                "body": "Illustrative: boutique and leisure product needs staffing depth for CapEx greenlights.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Historic Savannah district class (illustrative)",
          "assetClass": "boutique / full-service",
          "submarket": "Historic district",
          "notes": "Proxy for historic scarcity vs suburban. Underwrite which Savannah."
    },
  },
  "myrtle-beach": {
    nuanceNote: "Which Myrtle: Oceanfront resort is not highway corridor limited-service. Highly seasonal drive-to beach; off-peak is the underwriting tell. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Drive-to leisure beach seasonality",
                "body": "Illustrative: summer oceanfront peaks; shoulder and winter soft. Do not annualize peak RevPAR.",
                "magnitude": "extreme seasonality (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Oceanfront vs highway corridor supply",
                "body": "Illustrative: large beach inventory; highway corridors add limited-service easily. Oversupply hurts off-peak hardest.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Seasonal beach staffing gate",
                "body": "Illustrative: summer staffing peaks and winter cuts gate CapEx. Talent model must clear greenlight.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Myrtle Beach oceanfront class (illustrative)",
          "assetClass": "resort / select-service",
          "submarket": "Oceanfront",
          "notes": "Proxy for oceanfront vs highway corridors. Underwrite which Myrtle."
    },
  },
  "florida-keys": {
    nuanceNote: "Which Keys: Key West high-ADR leisure is not Upper Keys midscale. Constrained inventory; airlift + drive demand; elevated storm risk. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "High-ADR leisure + airlift/drive mix",
                "body": "Illustrative: Key West ADR premium vs Upper Keys midscale. Airlift and storm disruptions are demand tells.",
                "magnitude": "Key West ADR (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Constrained Keys inventory watch",
                "body": "Illustrative: limited new keys; renovations and storm rebuild dominate supply narrative. Still underwrite competitive set.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Island / Keys labor greenlight",
                "body": "Illustrative: constrained Keys labor and housing for staff gate CapEx. Talent is a refinance input.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Key West leisure / resort class (illustrative)",
          "assetClass": "resort / boutique",
          "submarket": "Key West",
          "notes": "Proxy for Key West ADR vs Upper Keys. Underwrite which Keys."
    },
  },
  "palm-beach": {
    nuanceNote: "Which Palm Beach: Oceanfront luxury and seasonal snowbird are not inland or value corridors. Affluent leisure; insurance and storm overlays. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Affluent leisure + seasonal snowbird",
                "body": "Illustrative: winter luxury ADR peaks; summer softens. Oceanfront comps are not inland comps.",
                "magnitude": "snowbird luxury (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Oceanfront luxury vs inland pipeline",
                "body": "Illustrative: constrained luxury oceanfront vs inland additions. Insurance cost overlays CapEx.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Luxury resort staffing gate",
                "body": "Illustrative: high-touch luxury needs deep seasonal staffing. CapEx greenlights clear talent + storm GC capacity.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Palm Beach oceanfront luxury class (illustrative)",
          "assetClass": "luxury resort",
          "submarket": "Palm Beach / oceanfront",
          "notes": "Proxy for oceanfront luxury vs inland. Underwrite which Palm Beach."
    },
  },
  "fort-lauderdale": {
    nuanceNote: "Which Fort Lauderdale: Beach / Las Olas leisure and cruise are not airport corridors. Part of broader South Florida thesis — still ask which Broward product. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Beach leisure + cruise + corporate",
                "body": "Illustrative: beach/Las Olas leisure and cruise embarkation support demand; airport corridor differs.",
                "magnitude": "beach + cruise (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Beach / Las Olas vs airport pipeline",
                "body": "Illustrative: beach inventory vs airport limited-service. Storm/insurance overlays.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Beach + cruise hospitality staffing gate",
                "body": "Illustrative: leisure and cruise-driven product needs staffing depth for CapEx greenlights.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Fort Lauderdale beach / Las Olas class (illustrative)",
          "assetClass": "full-service / lifestyle",
          "submarket": "Beach / Las Olas",
          "notes": "Proxy for beach leisure vs airport. Underwrite which Broward."
    },
  },
  "anaheim-orange-county": {
    nuanceNote: "Which OC: Anaheim resort/convention (Disney flywheel) is not coastal OC leisure. Theme-park leisure + convention — product class still dominates. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Theme-park leisure + convention flywheel",
                "body": "Illustrative: Anaheim resort district ADR tied to Disney/convention calendar; coastal OC is a different thesis.",
                "magnitude": "Disney corridor (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Anaheim resort district pipeline watch",
                "body": "Illustrative: resort-district additions need absorption against park and convention calendars.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Theme-park competing labor gate",
                "body": "Illustrative: hospitality competes with parks for talent. CapEx greenlights clear staffing depth.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Anaheim resort district class (illustrative)",
          "assetClass": "full-service / select-service",
          "submarket": "Anaheim resort district",
          "notes": "Proxy for Disney corridor vs coastal OC. Underwrite which Orange County."
    },
  },
  "palm-springs": {
    nuanceNote: "Which Coachella Valley: Palm Springs resort midweek/weekend and event spikes (Coachella/Stagecoach) are not interchangeable with shoulder season. Extreme event compression ≠ year-round scarcity. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Resort leisure + Coachella/Stagecoach spikes",
                "body": "Illustrative: festival weeks print outsized ADR; shoulder desert demand softens. Do not annualize festival RevPAR.",
                "magnitude": "event spikes (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Desert resort pipeline watch",
                "body": "Illustrative: resort inventory additions hurt most in shoulder season. Pair pipeline with event calendar.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Event-week + seasonal staffing gate",
                "body": "Illustrative: festival staffing peaks and shoulder cuts gate CapEx. Talent model must clear greenlight.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Palm Springs resort class (illustrative)",
          "assetClass": "resort / lifestyle",
          "submarket": "Palm Springs / Coachella Valley",
          "notes": "Proxy for resort leisure vs event-week compression. Underwrite which Coachella Valley."
    },
  },
  "reno-tahoe": {
    nuanceNote: "Which Reno-Tahoe: Reno midweek gaming is not Tahoe resort seasonality. Gaming + mountain leisure corridor — product and side-of-lake differ. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Gaming midweek + mountain leisure weekends",
                "body": "Illustrative: Reno gaming and Tahoe ski/summer leisure print different tapes. Ask which node.",
                "magnitude": "gaming vs mountain (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Reno vs Tahoe pipeline watch",
                "body": "Illustrative: Reno midscale additions vs constrained Tahoe resort keys. Absorption by node.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Mountain + gaming staffing gate",
                "body": "Illustrative: seasonal mountain and gaming hospitality compete for talent. CapEx greenlights clear staffing.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "South Lake Tahoe resort class (illustrative)",
          "assetClass": "resort",
          "submarket": "South Lake Tahoe",
          "notes": "Proxy for Tahoe resort vs Reno gaming. Underwrite which Reno-Tahoe."
    },
  },
  "aspen-vail": {
    nuanceNote: "Which mountain: Aspen and Vail-class ultra-high ADR are not Front Range or secondary ski towns. Extreme seasonality; Denver airlift feeder; limited keys. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Ultra-high ADR ski/resort seasonality",
                "body": "Illustrative: peak winter ADR is not shoulder. Airlift and snowfall are demand tells. Do not annualize peak.",
                "magnitude": "peak ski ADR (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Severely constrained mountain keys",
                "body": "Illustrative: limited new keys; renovations dominate. Still underwrite competitive set and bed-base.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Mountain resort staffing + housing gate",
                "body": "Illustrative: employee housing and seasonal staffing gate CapEx more than demand headlines. Talent is the greenlight.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Vail / Aspen-class resort (illustrative)",
          "assetClass": "luxury resort",
          "submarket": "Aspen / Vail-class",
          "notes": "Proxy for ultra-high ADR mountain resorts. Underwrite which mountain and which season."
    },
  },
  "gatlinburg-pigeon-forge": {
    nuanceNote: "Which Smokies: Parkway / Pigeon Forge attraction corridors are not cabin/STR-dominated ridges. Drive-to leisure; cabin/STR competition is the supply tell. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Drive-to leisure mountain + attractions",
                "body": "Illustrative: holiday and leaf-season peaks; shoulder soft. Attraction corridor vs cabin inventory differ.",
                "magnitude": "seasonal leisure (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Cabin/STR vs hotel corridor watch",
                "body": "Illustrative: STR/cabin bed-base competes with hotels. New hotel keys need clear competitive-set thesis.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Seasonal mountain leisure staffing gate",
                "body": "Illustrative: peak-season staffing and shoulder cuts gate CapEx. Talent model must clear greenlight.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Pigeon Forge Parkway class (illustrative)",
          "assetClass": "select-service / attraction-adjacent",
          "submarket": "Pigeon Forge Parkway",
          "notes": "Proxy for attraction corridor vs cabin/STR ridges. Underwrite which Smokies."
    },
  },
  "branson": {
    nuanceNote: "Which Branson: Theater/attraction corridor leisure is highly seasonal — peak is not year-round scarcity. Drive-to entertainment destination. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Drive-to theater/attraction leisure",
                "body": "Illustrative: show and holiday peaks; deep off-season softness. Do not annualize peak RevPAR.",
                "magnitude": "extreme seasonality (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Attraction corridor supply watch",
                "body": "Illustrative: large leisure inventory relative to off-season demand. New keys need clear absorption.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Seasonal entertainment staffing gate",
                "body": "Illustrative: show-season staffing peaks gate CapEx. Talent clearance before greenlight.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Branson entertainment corridor class (illustrative)",
          "assetClass": "select-service / leisure",
          "submarket": "Entertainment corridor",
          "notes": "Proxy for theater/attraction lodging. Underwrite seasonality explicitly."
    },
  },
  "williamsburg-va": {
    nuanceNote: "Which Historic Triangle: Colonial Williamsburg / Busch Gardens leisure is seasonal school-calendar driven — not year-round corporate. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Historic leisure + family attractions",
                "body": "Illustrative: school-calendar and holiday peaks; midweek shoulder soft. Ask which Historic Triangle product.",
                "magnitude": "school-calendar seasonality (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Historic / attraction corridor pipeline",
                "body": "Illustrative: leisure inventory vs limited corporate midweek. Absorption against school calendar.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Seasonal leisure staffing gate",
                "body": "Illustrative: peak family-season staffing gates CapEx. Talent model must clear greenlight.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Williamsburg historic / attractions class (illustrative)",
          "assetClass": "full-service / select-service",
          "submarket": "Historic Triangle",
          "notes": "Proxy for historic/attractions leisure. Underwrite school-calendar seasonality."
    },
  },
  "outer-banks": {
    nuanceNote: "Which OBX: Cottage/STR inventory dominates vs hotels — hotel RevPAR is not the bed-base story. Extreme seasonality on barrier islands. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Drive-to barrier-island leisure",
                "body": "Illustrative: summer peaks; shoulder and winter very soft. Cottage/STR is the primary bed-base.",
                "magnitude": "extreme seasonality (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "STR/cottage vs hotel inventory watch",
                "body": "Illustrative: hotel keys are a minority of bed-base. Underwrite against STR competition, not hotel inventory alone.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Seasonal island staffing gate",
                "body": "Illustrative: summer staffing and island housing for staff gate CapEx. Talent is a greenlight input.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Outer Banks oceanfront hotel class (illustrative)",
          "assetClass": "select-service / resort",
          "submarket": "Dare County oceanfront",
          "notes": "Proxy for hotel slice of a STR-dominated market. Underwrite bed-base correctly."
    },
  },
  "napa-sonoma": {
    nuanceNote: "Which Wine Country: Napa valley inns/resorts are not Sonoma Coast or freeway limited-service. Constrained inn/resort inventory; weekend leisure vs midweek group. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "High-ADR wine leisure + midweek group",
                "body": "Illustrative: weekend leisure ADR premium; midweek group/wine trade differs. Ask which valley node.",
                "magnitude": "weekend ADR premium (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Constrained inn/resort inventory",
                "body": "Illustrative: limited new keys; tasting-room and inn renovations dominate. Still underwrite competitive set.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "High-touch wine hospitality staffing gate",
                "body": "Illustrative: inn/resort and F&B product needs deep talent. CapEx greenlights clear staffing.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Napa Valley inn / resort class (illustrative)",
          "assetClass": "resort / inn",
          "submarket": "Napa Valley",
          "notes": "Proxy for Napa inn/resort vs Sonoma or freeway product. Underwrite which Wine Country."
    },
  },
  "sedona-grand-canyon": {
    nuanceNote: "Which Arizona scenic: Sedona resort ADR premium is not Grand Canyon gateway midscale. Scenic leisure drive + fly market. Illustrative seed.",
    signals: [
          {
                "kind": "demand",
                "title": "Scenic leisure — Sedona premium vs Canyon gateway",
                "body": "Illustrative: Sedona resort ADR prints above Grand Canyon gateway midscale. Ask which node.",
                "magnitude": "Sedona premium (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Sedona resort vs Canyon gateway supply",
                "body": "Illustrative: constrained Sedona resort keys vs gateway midscale additions. Absorption by node.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Resort + gateway staffing gate",
                "body": "Illustrative: Sedona high-touch resort staffing differs from gateway midscale. CapEx greenlights clear talent by product.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Sedona resort class (illustrative)",
          "assetClass": "resort / boutique",
          "submarket": "Sedona",
          "notes": "Proxy for Sedona ADR premium vs Grand Canyon gateway. Underwrite which corridor."
    },
  },
  "nashville": {
    nuanceNote: "Which Nashville: Broadway / downtown entertainment ADR is not the MSA average. Music leisure + healthcare/corporate demand support the tape, but supply pipeline and talent/GC capacity gate CapEx and refinance. Illustrative seed — replace with licensed STR / Visit Music City before underwriting.",
    signals: [
          {
                "kind": "demand",
                "title": "Music leisure + downtown ADR power",
                "body": "Illustrative: music/leisure spine plus healthcare and corporate/group demand. Downtown Broadway entertainment district can print ADR well above MSA averages — do not underwrite the MSA from Broadway comps alone.",
                "magnitude": "downtown ADR premium (illustrative)",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "supply",
                "title": "Elevated supply / pipeline watch",
                "body": "Illustrative: Nashville remains a supply-watch market. New keys and conversions into downtown and tourist corridors can dilute RevPAR if demand absorption lags. Pair pipeline with absorption and staffing capacity.",
                "magnitude": "supply watch",
                "asOf": "2026-09 seed"
          },
          {
                "kind": "talent",
                "title": "Human-touch / staffing greenlight gate",
                "body": "Illustrative: high-touch music/leisure and F&B-heavy product needs staffing depth. CapEx and refinance greenlights should clear talent + GC/MEP capacity — not demand headlines alone.",
                "magnitude": "greenlight gate",
                "asOf": "2026-09 seed"
          }
    ],
    asset: {
          "name": "Downtown Broadway / Lower Broadway class (illustrative)",
          "assetClass": "full-service / lifestyle entertainment",
          "submarket": "Downtown / Broadway entertainment district",
          "notes": "Proxy for downtown entertainment-district ADR power vs suburban select-service. Not a single asset — underwrite which Nashville."
    },
  },
};
