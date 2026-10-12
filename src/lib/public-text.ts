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

function scrubPlain(s: string): string {
  let t = s;
  for (const [re, rep] of RULES) t = t.replace(re, rep);
  t = t.replace(/\uE000+(\w+)/g, (_, w: string) => TEAM_LANE[w.toLowerCase()] ?? w);
  return t.replace(/ {2,}/g, " ").replace(/\(\s*\)/g, "").replace(/ +([.,;:])/g, "$1");
}

/** Strip internal team / agent labels from any public text. URLs are left untouched. */
export function scrubInternal(text: string | null | undefined): string {
  if (!text) return text ?? "";
  return text
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
};

/** Real publisher name for a URL (falls back to the registrable domain). */
export function publisherName(url: string): string {
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
  if (!INTERNAL_SEG.test(raw)) return raw;
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
