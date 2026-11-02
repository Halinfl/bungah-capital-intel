/**
 * Public-text guard (Hal, 2026-10-11): internal team / agent labels never reach public surfaces.
 * Used (a) once to clean DB rows + .data.ts sources, and (b) at display time as a safety net.
 * Never changes figures — only strips/rewrites internal provenance wording.
 */

const URL_SPLIT = /(https?:\/\/[^\s)<>|;,"']+[^\s)<>|;,."'])/g;

const TEAM_LANE: Record<string, string> = {
  atlas: "supply",
  ledger: "capital",
  herald: "talent",
  vectra: "demand",
  callbook: "research",
  quill: "editorial",
  neo: "editorial",
};

/** Ordered, specific rewrites first; generic fallbacks last. Applied to non-URL text only. */
const RULES: [RegExp, string][] = [
  // House-rule tag appended to labor rows: an internal note, not reader copy (the rule itself is stated in prose).
  [/\s*\(human touch first\)/gi, ""],
  // The same house rule written as a sentence in labor prose ("Human touch first: underwrite … at the new floor; …").
  [/\s*Human touch first:[^.]*\./g, ""],
  // Row provenance prefixes / suffixes
  [/^(?:Herald|Atlas|Vectra) depth wave 1 \([\d-]+\), /, ""],
  [/^Ledger capital depth wave 1 \([\d-]+\), /, ""],
  [/\s*[—,-]\s*(?:demand, )?(?:Herald|Atlas|Ledger|Vectra) wave 1\b/g, ""],
  [/ \((?:Herald|Atlas|Ledger|Vectra) wave 1\)/g, ""],
  [/, Wave 1 \((?:Vectra|Atlas|Herald|Ledger), ([\d-]+)\)/g, " ($1)"],
  [/ \(Vectra hold applied\)/g, ""],
  [/ \((?:matrix )?D\d+\)(?= *[:;)]|$)/g, (" ") as string],
  // File-path provenance
  [/\s*\((?:cross-check(?:ed vs)? )?(?:Atlas |Vectra |Herald |Ledger )?[^()]*depth-w1[^()]*\)/g, ""],
  [/\s*[—-]\s*(?:markets|pipeline|demand|capital|deepen\/talent)\/(?:depth-w1-)?[\w-]+\.md/g, ""],
  [/ per (?:markets|pipeline|demand|capital)\/_?[\w-]+\.md/g, ""],
  [/\s*\(source: (?:Herald|Atlas|Ledger|Vectra) file\)/g, ""],
  [/ per (?:Vectra|Atlas|Ledger|Herald) (?:demand|markets|pipeline|capital)\/[\w./-]+\.md/g, ""],
  [/see (\w+) depth-w1 note/g, "see $1 note"],
  // Pipeline cross-references
  [/no Atlas (?:[A-Z][\w ]*? )?pipeline file(?: yet)?/g, "no pipeline review yet"],
  [/Atlas pipeline needed/g, "pipeline review needed"],
  [/\(Atlas: ([^)]*)\)/g, "(earlier pipeline read: $1)"],
  [/flag to Atlas/g, "flag for pipeline update"],
  [/flag Atlas \(has ([^)]*)\)/g, "pipeline list still shows $1"],
  [/Atlas lists /g, "pipeline lists "],
  [/\(Atlas; /g, "("],
  [/ \((?:Atlas|Vectra|Herald|Ledger)\)/g, ""],
  [/\(via Atlas [^)]*\)/g, ""],
  [/,? (?:Atlas|Callbook) derivation/g, ", derived"],
  [/ by Callbook arithmetic/g, " (derived)"],
  // Lane ownership asides
  [/\s*\((?:Ledger|Herald|Atlas|Vectra) (?:owns|lane)[^)]*\)/g, ""],
  [/Ledger owns \$\/key; public anchors only\./g, "Public anchors only."],
  [/Herald owns ops floors/g, "ops floors in the talent read"],
  [/\((?:Herald|Atlas|Ledger|Vectra): /g, "("],
  [/ (?:per|via) (?:Herald|Vectra|Atlas|Ledger)\b/g, ""],
  // Research / editorial attributions
  [/\(Callbook Tier 1\)/g, "(Tier 1)"],
  [/\(Callbook: /g, "("],
  [/\(Callbook; /g, "("],
  [/Callbook defines/g, "defined here"],
  [/Callbook read:/g, "Read:"],
  [/Callbook inference/g, "Inference"],
  [/Vectra flag:/g, "Flag:"],
  [/; hand off to Atlas \(pipeline\) and Ledger \(midscale debt\)/g, "; watch pipeline and midscale debt"],
  [/Underwriting \((?:Ledger|Herald|Atlas|Vectra)\):/g, "Underwriting:"],
  [/\b(?:Ledger|Herald|Atlas|Vectra): /g, "Underwriting: "],
  [/\((?:Ledger|Herald|Atlas|Vectra) proposed rule, pending [^)]*\)/g, "(proposed rule, pending review)"],
  [/Decision-support rule \((?:Herald|Ledger|Atlas|Vectra)\):/g, "Decision-support rule:"],
  [/Vectra keeps none/g, "none kept"],
  [/\(Vectra proposal ([\d-]+), Ledger concurs; Atlas sign-off pending\)/g, "(proposal $1; sign-off pending)"],
  [/the Wave 1 West Coast markets/g, "the tracked West Coast markets"],
  [/A\*\/Atlas signals/g, "A* / supply signals"],
  [/Hal\/Neo[- ]authored/gi, "editor-authored"],
  [/\bnot Neo STR\b/g, "not licensed STR"],
  [/\bNeo stack\b/g, "stack"],
  [/propose-only/gi, "decision support"],
  [/\btax ≠ refinance capacity\b/g, "tax receipts are not refinance capacity"],
  [/\bSS\/DQ\b/g, "special servicing or delinquency"],
  // Plain-language rewrites of underwriting shorthand (Hal, 2026-10-20). Figures come from the text itself.
  [/\bWhich Orlando\s*[—–-]\s*impact\s*≠\s*scarcity/gi, "Orlando's hotel areas differ: record visitors don't mean rooms are scarce"],
  [/\bWhich Orlando:\s*/g, "Orlando's hotel areas differ: "],
  [/\bAsk which Orlando:\s*/g, "Orlando covers several distinct hotel areas; ask about a specific one: "],
  [/\s*[—–-]\s*ask which Orlando\.?/gi, ". Orlando covers several distinct hotel areas; ask about a specific one."],
  [/\b([Aa])sk which Orlando\b/g, "$1sk about a specific part of Orlando"],
  [/\bTexas HOT\s*≠\s*RevPAR\b/g, "Texas hotel-tax receipts are not the same as RevPAR"],
  [/\bNYC HTX\s*≠\s*RevPAR\b/g, "NYC hotel-tax liability is not the same as RevPAR"],
  [/\bTax\s*≠\s*RevPAR\/OCC\/ADR\b/g, "Tax receipts are not the same as RevPAR, occupancy or ADR"],
  [/\b([Tt])ax\s*≠\s*RevPAR\b/g, "$1ax receipts are not the same as RevPAR"],
  [/\bMSA OCC (\d+(?:\.\d+)?)%\s*[—–-]\s*impact\s*≠\s*scarcity/g, "Record visitors don't mean rooms are scarce: metro occupancy is $1%"],
  [/\b([A-Z][\w ]*?) OCC (\d+(?:\.\d+)?)%\s*[—–-]\s*still impact\s*≠\s*scarcity/g, "$1 occupancy is $2%: record visitors still don't mean rooms are scarce"],
  [/\s*[—–-]\s*still impact\s*≠\s*scarcity/gi, ": record visitors still don't mean rooms are scarce"],
  [/\s*[—–-]\s*impact\s*≠\s*scarcity/gi, ": record visitors don't mean rooms are scarce"],
  [/\bImpact\s*≠\s*scarcity at MSA averages\.?/g, "Record visitors don't mean rooms are scarce at metro-wide averages."],
  [/\bImpact\s*≠\s*scarcity\b/g, "Record visitors don't mean rooms are scarce"],
  [/\bimpact\s*≠\s*scarcity\b/gi, "record visitors don't mean rooms are scarce"],
  [/\bscarcity vs impact\b/gi, "visitors vs. scarce rooms"],
  [/\bwhich-Orlando nuance\b/gi, "which part of Orlando is meant"],
  [/\bDY\s*≤\s*(\d+(?:\.\d+)?)%\s+names\b/g, "hotels with a debt yield of $1% or less"],
  [/\bDY\s*≥\s*(\d+(?:\.\d+)?)%/g, "a debt yield of at least $1%"],
  [/\bDY\s*≤\s*(\d+(?:\.\d+)?)%/g, "a debt yield of $1% or less"],
  [/\bDY\b/g, "debt yield"],
  [/(rooms are scarce): rule\b/g, "$1"],
  [/\bthe\s*≥\s*(\d+(?:\.\d+)?(?:[–-]\d+(?:\.\d+)?)?%)\+?\s+takeout\b/g, "a takeout rate of $1 or higher"],
  [/\bthe\s*≤\s*(\d+(?:\.\d+)?%)\s+flag\b/g, "the flag for a debt yield of $1 or less"],
  [/\bat\s*≥\s*(\d+(?:\.\d+)?(?:[–-]\d+(?:\.\d+)?)?%)\+?/g, "at $1 or higher"],
  [/≥\s*(\d+(?:\.\d+)?(?:[–-]\d+(?:\.\d+)?)?%)\+?/g, "at least $1"],
  [/≤\s*(\d+(?:\.\d+)?%)/g, "$1 or less"],
  [/\s*≠\s*/g, " is not the same as "],
  [/\*\*(Atlas|Ledger|Herald|Vectra) (?:handoff|action):\*\*/g, "**\uE000$1 note:**"],
  [/\b(?:Vectra) \(demand\)/g, "demand"],
  [/\*\*Handoff:\*\*/g, "**Lane:**"],
  // Internal workspace paths / library file references
  [/ \(summary — detail in [\w-]+\.md\)/g, " (summary)"],
  [/\bcontent\/earnings\/[\w-]+\/(\d{4})-(Q\d)-digest\.md/g, "company $2 $1 earnings release (editor digest)"],
  [/\b(?:notes|markets|pipeline|demand|capital|deepen|people|product|orgs|stacks)\/[\w./-]+\.md\s*/g, ""],
  [/`?(?:\/workspace\/)?neo-capital-intel\/?([\w./-]*)`?/gi, "$1"],
  // Generic fallbacks
  [/\bdepth-w1-?/gi, ""],
  [/\b[Ww]ave[- ]1\b/g, "current"],
  [/\bw1\b/gi, ""],
  [/\b(Callbook|Quill|Vectra|Herald)\b/gi, "\uE000$1"],
  [/\bLedger\b/gi, "\uE000ledger"],
  [/\bNeo\b/gi, "\uE000neo"],
  [/\bAtlas\b(?! (?:Hotel|Brief|Hospitality|Holdings))(?<!The Atlas)/gi, "\uE000atlas"],
];

/**
 * Leak guard (Eric QA r4 → r5): no filesystem path, code file, dataset ID used as a label, query-string fragment or
 * internal matrix code ("(D3)") reaches a public answer, citation or page. Known internal source references are
 * first rewritten to their public citation (display layer; the DB rows are unchanged).
 */
const TX_HOT_DATASETS: Record<string, { fy: string; url: string }> = {
  "er34-v24h": { fy: "FY2025", url: "https://data.texas.gov/dataset/Local-Hotel-Occupancy-Tax-Reporting-2025/er34-v24h" },
  "ifh4-9tpn": { fy: "FY2024", url: "https://data.texas.gov/dataset/Local-Hotel-Occupancy-Tax-Reporting-2024/ifh4-9tpn" },
};
const txHot = (id: string) => TX_HOT_DATASETS[id];
const SOURCE_REWRITES: [RegExp, (...m: string[]) => string][] = [
  // "source: /workspace/…/msa-registry.ts (Texas HOT SODA er34-v24h)" → the Comptroller dataset, its period and URL.
  [/(?:[\w~./-]*\/)?msa-registry\.ts\s*\(\s*Texas HOT SODA ([a-z0-9]{4}-[a-z0-9]{4})\s*\)/g, (_m, id) =>
    txHot(id) ? `Texas Comptroller hotel occupancy tax data (Local HOT Reporting, ${txHot(id).fy}) → ${txHot(id).url}` : "Texas Comptroller hotel occupancy tax data"],
  // Source label "Texas Comptroller Local HOT Reporting 2025 SODA er34-v24h (data.texas.gov); city=Dallas type=city".
  [/Texas Comptroller Local HOT Reporting (20\d\d) SODA [a-z0-9]{4}-[a-z0-9]{4} \(data\.texas\.gov\)(?:;?\s*\b[a-z]+=[\w%-]+(?: [A-Z][\w-]*)*)*/g, (_m, y) =>
    `Texas Comptroller of Public Accounts (data.texas.gov) — Local Hotel Occupancy Tax Reporting, FY${y}`],
  // "source: msa-registry.ts / https://…" → "source: https://…"
  [/(?:[\w~./-]*\/)?[\w-]+\.(?:tsx?|mjs|cjs|py|md|jsonl?|csv|sql|prisma)\s*\/\s*(?=https?:\/\/)/g, () => ""],
  // Eric QA r5: a self-referential "(source: no public read)" after "no public read" says nothing.
  [/\s*\(source: no public read\)/gi, () => ""],
  // Internal working rules inside a data row (rule rows themselves are dropped by kind, src/lib/rule-rows.ts):
  // "(separate — do not fold into Ch.351 implied room rev)", "(rule, 2026-09)", "Do not overwrite seed lodging metrics…".
  [/\s*[—–-]\s*do not (?:add|fold) into (?:[^)|;.\n]|\.(?=\S))*/gi, () => ""],
  [/\s*\(rule\b[^)]*\)/gi, () => ""],
  [/[^.|\n]*\b(?:Do not (?:overwrite|invent|underwrite)|Pair with licensed STR|Never underwrite)\b[^.|\n]*\.?/g, () => ""],
  // Data caveat wording: "NOT licensed STR RevPAR/OCC/ADR" → "not RevPAR/OCC/ADR"; any other mention → "licensed data".
  [/\b(?:NOT|not) licensed STR (?=RevPAR|OCC|ADR)/g, () => "not "],
  [/\blicensed STR\b/g, () => "licensed data"],
];
/** A Socrata-style dataset ID ("er34-v24h", "vmy5-jctb"): one half mixes letters and digits ("1000-room" is not one). */
const isDatasetId = (m: string) => m.split("-").some((h) => /[a-z]/.test(h) && /\d/.test(h));
const LEAK_PATTERNS: Record<string, RegExp> = {
  path: /(?:^|(?<=[\s(:"'`]))(?:\/workspace|\/home|\/tmp|\/Users|\/root|\/var|~)\/[^\s)|;,"'`]*/g,
  codePath: /\b(?:src|scripts|node_modules)\/[\w./-]+|\b(?:content|app|lib|data)\/[\w.-]+\/[\w./-]+/g,
  codeFile: /\b[\w-]+\.(?:tsx?|mjs|cjs|py|md|jsonl?|csv|sql|prisma)\b/g,
  internalCode: /\s*\((?:matrix )?D\d{1,2}\)/g,
  registryTag: /\s*\(registry\)/g,
  datasetId: /\b[a-z0-9]{4}-[a-z0-9]{4}\b/g,
  queryParam: /(?:;\s*)?\b(?:city|type|name|id|slug|market)=[\w%-]+(?: [A-Z][\w-]*)*/g,
  soda: /\bSODA\b/g,
  // Detection only (findLeaks / the leak test): internal working rules and our own site as a source. Rule rows are
  // dropped by kind at load (rule-rows.ts) and the SOURCE_REWRITES above remove rule wording inside a data row.
  ruleText: /\(rule\b|\bDo not (?:overwrite|invent|underwrite)\b|\bseed lodging metrics\b|\blicensed STR\b|\bNever underwrite\b|\bDecision-support rule\b|\bdo not (?:add|fold) into\b/gi,
  ownSource: /\bBungah Capital Intel(?: Baseline)? (?:\(|talent synthesis)/g,
};

/** Non-URL text with every leak pattern removed (known internal sources first rewritten to their public citation). */
function stripLeaksPlain(s: string): string {
  let t = s;
  for (const [re, rep] of SOURCE_REWRITES) t = t.replace(re, rep as (...a: string[]) => string);
  // A rewrite can introduce a URL: guard only the text around it.
  return t
    .split(URL_SPLIT)
    .map((part, i) => {
      if (i % 2 === 1) return part;
      let x = part;
      x = x.replace(/\bSODA\s+[a-z0-9]{4}-[a-z0-9]{4}\b/g, "dataset").replace(LEAK_PATTERNS.soda, "dataset");
      for (const k of ["path", "codePath", "codeFile", "internalCode", "registryTag", "queryParam"]) x = x.replace(LEAK_PATTERNS[k], "");
      x = x.replace(LEAK_PATTERNS.datasetId, (m) => (isDatasetId(m) ? "" : m));
      if (x === part) return part;
      // Tidy what a removal leaves behind: "source:  ()", "source: /", doubled spaces, stray separators.
      return x
        .replace(/\(\s*\)/g, "")
        .replace(/;\s*source:\s*[/;,]?\s*(?=\))/g, "")
        .replace(/\(\s*source:\s*[/;,]?\s*\)/g, "")
        .replace(/\bsource:\s*\/\s*/g, "source: ")
        .replace(/(\S) {2,}/g, "$1 ")
        .replace(/(\S) +([.,;:)])/g, "$1$2");
    })
    .join("");
}

/** Public-text leak guard for any string (URLs untouched). */
export function stripLeaks(text: string | null | undefined): string {
  if (!text) return text ?? "";
  return stripLeaksPlain(text);
}

/** Which leak patterns a public string still contains (URLs excluded); empty when clean. For tests and scans. */
export function findLeaks(text: string | null | undefined): string[] {
  if (!text) return [];
  const plain = text.split(URL_SPLIT).filter((_, i) => i % 2 === 0).join(" ");
  const out: string[] = [];
  for (const [k, re] of Object.entries(LEAK_PATTERNS))
    for (const m of plain.matchAll(new RegExp(re.source, "g"))) if (k !== "datasetId" || isDatasetId(m[0])) out.push(`${k}: ${m[0].trim()}`);
  return out;
}

/** Deep render-time guard: every string in an answer / brief / citation object, except URLs and wire keys. */
const GUARD_SKIP = new Set(["url", "href", "id", "answerHash", "threadId", "marketSlug", "intent", "mode", "kind", "key", "slug"]);
export function guardPublic<T>(value: T): T {
  const walk = (v: unknown, key = ""): unknown => {
    if (typeof v === "string") return GUARD_SKIP.has(key) || /^https?:\/\/\S+$/.test(v) ? v : stripLeaks(v);
    if (Array.isArray(v)) return v.map((x) => walk(x, key));
    if (v && typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype) {
      const o: Record<string, unknown> = {};
      for (const [k, x] of Object.entries(v)) o[k] = walk(x, k);
      return o;
    }
    return v;
  };
  return walk(value) as T;
}

function scrubPlain(s: string): string {
  let t = s;
  for (const [re, rep] of RULES) t = t.replace(re, rep);
  t = t.replace(/\uE000+(\w+)/g, (_, w: string) => TEAM_LANE[w.toLowerCase()] ?? w);
  return t.replace(/ {2,}/g, " ").replace(/\(\s*\)/g, "").replace(/ +([.,;:])/g, "$1");
}

/** Strip internal team / agent labels from any public text. URLs are left untouched. */
export function scrubInternal(text: string | null | undefined): string {
  if (!text) return text ?? "";
  return stripLeaks(text)
    .split(URL_SPLIT)
    .map((part, i) => (i % 2 === 1 ? part : scrubPlain(part)))
    .join("")
    .trim();
}

const PUBLISHERS: Record<string, string> = {
  "sec.gov": "SEC EDGAR",
  "costar.com": "CoStar",
  "costar-na-prod.acquia.dshrp.com": "CoStar",
  "stockanalysis.com": "StockAnalysis (third-party transcript)",
  "tourismeconomics.com": "Tourism Economics",
  "bls.gov": "U.S. BLS",
  "cushmanwakefield.com": "Cushman & Wakefield",
  "agc.org": "AGC of America",
  "houstonfirst.com": "Houston First",
  "hotel-online.com": "Hotel Online",
  "therealdeal.com": "The Real Deal",
  "lodgingeconometrics.com": "Lodging Econometrics",
  "newsroom.aaa.com": "AAA Newsroom",
  "bisnow.com": "Bisnow",
  "hoteldive.com": "Hotel Dive",
  "prnewswire.com": "PR Newswire",
  "hotelsmag.com": "HOTELS Magazine",
  "marcusmillichap.com": "Marcus & Millichap",
  "sandiego.gov": "City of San Diego",
  "washington.org": "Destination DC",
  "miamiandbeaches.com": "Greater Miami CVB",
  "nashville.gov": "Metro Nashville",
  "hosthotels.com": "Host Hotels & Resorts",
  "osc.ny.gov": "NY State Comptroller",
  "kidder.com": "Kidder Mathews",
  "moscone.com": "Moscone Center",
  "miamibeachconvention.com": "Miami Beach Convention Center",
  "crenews.com": "Commercial Real Estate Direct",
  "choosechicago.com": "Choose Chicago",
  "visitorlando.org": "Visit Orlando",
  "lvcva.com": "LVCVA",
  "news3lv.com": "News 3 Las Vegas",
  "fox5vegas.com": "FOX5 Las Vegas",
  "simpleviewinc.com": "Simpleview",
  "bizjournals.com": "Business Journals",
  "commercialobserver.com": "Commercial Observer",
  "hvs.com": "HVS",
  "hta.hawaii.gov": "Hawaii Tourism Authority",
  "hotelmanagement.net": "Hotel Management",
  "ncaa.com": "NCAA",
  "cornovuscapital.com": "Cornovus Capital",
  "gwcca.org": "Georgia World Congress Center",
  "hoodline.com": "Hoodline",
  "dallascityhall.com": "City of Dallas",
  "hawaii.gov": "State of Hawaii",
  "miamidade.gov": "Miami-Dade County",
  "unitehere11.org": "UNITE HERE Local 11",
  "matthews.com": "Matthews",
  "morningstar.com": "Morningstar DBRS",
  "bankerandtradesman.com": "Banker & Tradesman",
  "suntimes.com": "Chicago Sun-Times",
  "linkedin.com": "LinkedIn",
  "discoverlosangeles.com": "Discover Los Angeles",
  "hotelinvestmenttoday.com": "Hotel Investment Today",
  "hotelbusiness.com": "Hotel Business",
  "lodgingdevelopment.com": "Lodging Development",
  "visitphoenix.com": "Visit Phoenix",
  "sandiego.org": "San Diego Tourism Authority",
  "bostonglobe.com": "Boston Globe",
  "newhotels.io": "NewHotels",
  "labusinessjournal.com": "LA Business Journal",
  "unitehere5.org": "UNITE HERE Local 5",
  "businesswire.com": "Business Wire",
  "miamibusiness.com": "Miami Business",
  "nyc.gov": "NYC government",
  "sftravel.com": "SF Travel",
  "wronkaltd.com": "Wronka Ltd",
  "theregistrysf.com": "The Registry SF",
  "dol.gov": "U.S. Dept. of Labor",
  "unitehere.org": "UNITE HERE",
  "nlrb.gov": "NLRB",
  "jll.com": "JLL",
  "meetboston.com": "Meet Boston",
  "credaily.com": "CRE Daily",
  "chicago.gov": "City of Chicago",
  "trepp.com": "Trepp",
  "houstonchronicle.com": "Houston Chronicle",
  "lacity.org": "City of Los Angeles",
  "lacity.gov": "City of Los Angeles",
  "phoenix.gov": "City of Phoenix",
  "sandiegouniontribune.com": "San Diego Union-Tribune",
  "seattlecc.com": "Seattle Convention Center",
  "eventsdc.com": "Events DC",
  "laconventioncenter.com": "LA Convention Center",
  "artbasel.com": "Art Basel",
  "designmiami.com": "Design Miami",
  "lodgingmagazine.com": "Lodging Magazine",
  "skift.com": "Skift",
  "nytimes.com": "New York Times",
  "latimes.com": "Los Angeles Times",
  "apnews.com": "AP News",
  "ajc.com": "Atlanta Journal-Constitution",
  "azcentral.com": "Arizona Republic",
  "goodmoat.com": "Goodmoat (third-party transcript)",
  "labornotes.org": "Labor Notes",
  "nwlaborpress.org": "NW Labor Press",
  "fifa.com": "FIFA",
  "oregonlive.com": "OregonLive",
  "wlrn.org": "WLRN",
  "rsna.org": "RSNA",
  "mpea.com": "MPEA",
  "hospitalitynet.org": "Hospitality Net",
  "globenewswire.com": "GlobeNewswire",
  "kpbs.org": "KPBS",
  "cbsnews.com": "CBS News",
  "seattle.gov": "City of Seattle",
  "sf.gov": "City of San Francisco",
  "dc.gov": "DC government",
  "boston.gov": "City of Boston",
  "mass.gov": "Commonwealth of Massachusetts",
  "piccardfinancial.com": "Piccard Financial",
  "quilts.com": "International Quilt Festival",
  "collectaconusa.com": "Collect-A-Con",
  "occompt.com": "Orange County Comptroller",
  "flymco.com": "Orlando International Airport",
  "reviewjournal.com": "Las Vegas Review-Journal",
  "yahoo.com": "Yahoo Finance",
  "growthspotter.com": "GrowthSpotter",
  "disneyparksblog.com": "Disney Parks Blog",
  "theapopkavoice.com": "The Apopka Voice",
  "natlawreview.com": "National Law Review",
  "uniteherelocal737.org": "UNITE HERE Local 737",
  "orlandoweekly.com": "Orlando Weekly",
  "enr.com": "ENR",
  "mortenson.com": "Mortenson",
  "hotelrealtor.biz": "Hotel Realtor",
  "theiacpconference.org": "IACP",
  "money2020.com": "Money20/20",
  "supplysideglobal.com": "SupplySide Global",
  "sema.org": "SEMA",
  "hlth.com": "HLTH",
  "re-plus.events": "RE+",
  "issashow.com": "ISSA",
  "f1lasvegasgp.com": "Las Vegas Grand Prix",
  "awsevents.com": "AWS re:Invent",
  "mjbizconference.com": "MJBizCon",
  "nacsshow.com": "NACS",
};

/** Hosts that serve many publishers: name them by path (Contentful space / Simpleview client). */
const PATH_PUBLISHERS: [RegExp, string][] = [
  [/^https?:\/\/assets\.ctfassets\.net\/qiecpoxp4bka\//, "Orlando International Airport (GOAA)"],
  [/^https?:\/\/assets\.ctfassets\.net\/2pnrhs9eukyp\//, "Harry Reid International Airport"],
  [/^https?:\/\/assets\.ctfassets\.net\/m2p70vmwc019\//, "DFW Airport"],
  [/^https?:\/\/assets\.simpleviewcms\.com\/simpleview\/image\/upload\/v1\/clients\/lasvegas\//, "LVCVA"],
];

/** Real publisher name for a URL (falls back to the registrable domain). */
const LINKEDIN_AUTHORS: Record<string, string> = { costar: "CoStar", "costar-group": "CoStar", str: "STR", cbre: "CBRE", jll: "JLL", hvs: "HVS" };

export function publisherName(url: string): string {
  for (const [re, name] of PATH_PUBLISHERS) if (re.test(url)) return name;
  // A LinkedIn post is published by its author, not by LinkedIn.
  const li = url.match(/^https?:\/\/(?:[a-z]+\.)?linkedin\.com\/(?:posts\/([a-z0-9-]+?)_|company\/([a-z0-9-]+))/i);
  if (li) {
    const slug = (li[1] ?? li[2] ?? "").toLowerCase();
    const who = LINKEDIN_AUTHORS[slug];
    if (who) return `${who}, via LinkedIn`;
  }
  let host = "";
  try {
    host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return url;
  }
  const parts = host.split(".");
  for (let i = 0; i < parts.length - 1; i++) {
    const h = parts.slice(i).join(".");
    if (PUBLISHERS[h]) return PUBLISHERS[h];
  }
  return parts.length > 2 && /^(cdn|assets|files|news|cms|hvi|investors?|events|content|static)$/.test(parts[0])
    ? parts.slice(1).join(".")
    : host;
}

const INTERNAL_SEG =
  /\b(?:Ledger|Atlas|Vectra|Herald|Quill|Callbook|Neo)\b|depth-w1|\.md\b|linked sources?\b|\bmatrix D\d|weekly scan|_index\//i;

/**
 * Publisher-style source label. Internal provenance segments are dropped; bare URLs become
 * publisher names; if nothing public remains, publisher names come from the row's links.
 */
export function cleanSourceLabel(
  label: string | null | undefined,
  urls: { url: string }[] = [],
  body?: string | null
): string {
  const raw = (label ?? "").trim();
  if (!raw) return raw;
  if (!INTERNAL_SEG.test(raw)) return stripLeaks(raw).trim();
  const date = raw.match(/\b(20\d\d-\d\d-\d\d)\b/)?.[1];
  const segs = raw.split(/;\s+/);
  const kept: string[] = [];
  for (const seg0 of segs) {
    let seg = seg0.trim();
    const citing = seg.match(/\bciting (.+?)(?:\s+—\s+no direct URL in note)?$/i);
    if (citing) seg = citing[1];
    else if (INTERNAL_SEG.test(seg)) {
      // keep a public citation that merely carries an internal suffix, e.g. "X https://…; Herald notes"
      const url = seg.match(URL_SPLIT)?.[0];
      if (!url) continue;
      seg = url;
    }
    if (/^https?:\/\/\S+$/.test(seg)) seg = `${publisherName(seg)} ${seg}`;
    kept.push(scrubInternal(seg));
  }
  let out = kept.filter(Boolean).join("; ");
  if (!out) {
    const all = urls.length ? urls.map((u) => u.url) : [...(body ?? "").matchAll(URL_SPLIT)].map((m) => m[0]);
    const pubs = [...new Set(all.map((u) => publisherName(u)))];
    if (pubs.length) out = pubs.join(" · ");
    else return date ? `No linked public source (reviewed ${date})` : "No linked public source";
  }
  if (date && !out.includes(date)) out += ` (accessed ${date})`;
  return out;
}

const BOILERPLATE = /^(?:Rolling 90-day compression calendar|Cited rows only|Decision support\.?$|Labor underwritten at the new floors)/i;

/** One brief line for compact signal cards: skips the restated heading, ~140 chars, clean break. */
export function briefLine(title: string, body: string, max = 140): string {
  let b = scrubInternal(body).replace(/\s+/g, " ").trim();
  // Drop a leading "Market — section." restatement of the title.
  const t = title.toLowerCase();
  for (let k = 0; k < 3; k++) {
    const stop = b.search(/[.:]\s/);
    if (stop <= 0 || stop >= 120) break;
    const head = b.slice(0, stop).toLowerCase();
    const words = head.split(/[^a-z0-9]+/).filter((w) => w.length > 2);
    if (!words.length || !words.every((w) => t.includes(w))) break;
    b = b.slice(stop + 2).trim();
  }
  b = b
    .replace(/\s*\((?:[^()]*;\s*)?source:[^)]*\)/gi, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/ \(D\d+\)/g, "")
    .replace(/\s*—\s*(?=[·:|]|$)/g, " ")
    .replace(/\s{2,}/g, " ");
  // Sentences / table rows, skipping boilerplate, until the line has some substance.
  const pieces = b.split(/(?<=[.!?])\s+(?=[A-Z0-9"$~])| \| /).map((x) => x.trim()).filter(Boolean);
  let line = "";
  for (const p of pieces) {
    if (BOILERPLATE.test(p)) continue;
    line = line ? `${line} ${p}` : p;
    if (line.length >= 60) break;
  }
  line = (line || b).replace(/\s+([.,;:])/g, "$1").trim();
  if (line.length <= max) return line;
  const cut = line.slice(0, max);
  const sp = cut.lastIndexOf(" ");
  return `${cut.slice(0, sp > 80 ? sp : max).replace(/[\s,;:·—(-]+$/, "")}…`;
}
