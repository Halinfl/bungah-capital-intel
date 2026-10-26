/**
 * Coverage guard for Chat: detect a place we don't cover (Boise, London…) and answer
 * deterministically that it isn't covered yet, naming the closest covered markets.
 *
 * - US places: the 2–3 nearest covered markets by straight-line distance (coordinates
 *   below are reference points for proximity only; no distance figure is ever shown).
 * - International places: Capital Graph coverage is US-only.
 * - No figures, no REIT earnings summaries, nothing estimated.
 */

type LatLon = readonly [number, number];

/** Reference point per covered market slug (principal city). Proximity only. */
export const COVERED_MARKET_COORDS: Record<string, LatLon> = {
  "anaheim-orange-county": [33.84, -117.91],
  "aspen-vail": [39.4, -106.6],
  atlanta: [33.75, -84.39],
  austin: [30.27, -97.74],
  baltimore: [39.29, -76.61],
  boston: [42.36, -71.06],
  branson: [36.64, -93.22],
  "charleston-sc": [32.78, -79.93],
  charlotte: [35.23, -80.84],
  chicago: [41.88, -87.63],
  cincinnati: [39.1, -84.51],
  cleveland: [41.5, -81.69],
  "columbus-oh": [39.96, -83.0],
  dallas: [32.78, -96.8],
  denver: [39.74, -104.99],
  detroit: [42.33, -83.05],
  "florida-keys": [24.56, -81.78],
  "fort-lauderdale": [26.12, -80.14],
  "gatlinburg-pigeon-forge": [35.75, -83.53],
  honolulu: [21.31, -157.86],
  houston: [29.76, -95.37],
  indianapolis: [39.77, -86.16],
  jacksonville: [30.33, -81.66],
  "kansas-city": [39.1, -94.58],
  "las-vegas": [36.17, -115.14],
  "los-angeles": [34.05, -118.24],
  miami: [25.76, -80.19],
  minneapolis: [44.98, -93.27],
  "myrtle-beach": [33.69, -78.89],
  "napa-sonoma": [38.3, -122.29],
  nashville: [36.16, -86.78],
  "new-orleans": [29.95, -90.07],
  "new-york-city": [40.71, -74.01],
  orlando: [28.54, -81.38],
  "outer-banks": [35.9, -75.6],
  "palm-beach": [26.71, -80.05],
  "palm-springs": [33.83, -116.55],
  philadelphia: [39.95, -75.17],
  phoenix: [33.45, -112.07],
  pittsburgh: [40.44, -80.0],
  "portland-or": [45.52, -122.68],
  raleigh: [35.78, -78.64],
  "reno-tahoe": [39.53, -119.81],
  "salt-lake-city": [40.76, -111.89],
  "san-antonio": [29.42, -98.49],
  "san-diego": [32.72, -117.16],
  "san-francisco-bay": [37.77, -122.42],
  savannah: [32.08, -81.09],
  seattle: [47.61, -122.33],
  "sedona-grand-canyon": [34.87, -111.76],
  "st-louis": [38.63, -90.2],
  tampa: [27.95, -82.46],
  "virginia-beach-norfolk": [36.85, -76.29],
  "washington-dc": [38.91, -77.04],
  "williamsburg-va": [37.27, -76.71],
};

type UsPlace = { name: string; label: string; at: LatLon; caseSensitive?: boolean };

/** US places we don't cover as a market (cities / resort areas). `name` is matched as a whole phrase. */
const US_PLACES: UsPlace[] = [
  ["boise", "Boise, Idaho", 43.62, -116.2],
  ["coeur d'alene", "Coeur d'Alene, Idaho", 47.68, -116.78],
  ["sun valley", "Sun Valley, Idaho", 43.7, -114.35],
  ["spokane", "Spokane", 47.66, -117.43],
  ["albuquerque", "Albuquerque", 35.08, -106.65],
  ["santa fe", "Santa Fe", 35.69, -105.94],
  ["tucson", "Tucson", 32.22, -110.97],
  ["flagstaff", "Flagstaff", 35.2, -111.65],
  ["el paso", "El Paso", 31.76, -106.49],
  ["oklahoma city", "Oklahoma City", 35.47, -97.52],
  ["tulsa", "Tulsa", 36.15, -95.99],
  ["omaha", "Omaha", 41.26, -95.93],
  ["des moines", "Des Moines", 41.59, -93.62],
  ["wichita", "Wichita", 37.69, -97.34],
  ["milwaukee", "Milwaukee", 43.04, -87.91],
  ["green bay", "Green Bay", 44.51, -88.01],
  ["louisville", "Louisville", 38.25, -85.76],
  ["memphis", "Memphis", 35.15, -90.05],
  ["knoxville", "Knoxville", 35.96, -83.92],
  ["chattanooga", "Chattanooga", 35.05, -85.31],
  ["huntsville", "Huntsville", 34.73, -86.59],
  ["gulf shores", "Gulf Shores", 30.25, -87.7],
  ["biloxi", "Biloxi", 30.4, -88.89],
  ["little rock", "Little Rock", 34.75, -92.29],
  ["bentonville", "Bentonville", 36.37, -94.21],
  ["baton rouge", "Baton Rouge", 30.45, -91.15],
  ["corpus christi", "Corpus Christi", 27.8, -97.4],
  ["galveston", "Galveston", 29.3, -94.8],
  ["south padre", "South Padre Island", 26.11, -97.17],
  ["lubbock", "Lubbock", 33.58, -101.86],
  ["albany", "Albany", 42.65, -73.75],
  ["rochester", "Rochester", 43.16, -77.61],
  ["syracuse", "Syracuse", 43.05, -76.15],
  ["Buffalo", "Buffalo", 42.89, -78.88, true],
  ["niagara falls", "Niagara Falls", 43.09, -79.06],
  ["lake placid", "Lake Placid", 44.28, -73.98],
  ["the hamptons", "the Hamptons", 40.96, -72.3],
  ["hartford", "Hartford", 41.76, -72.67],
  ["providence", "Providence", 41.82, -71.41],
  ["cape cod", "Cape Cod", 41.67, -70.3],
  ["nantucket", "Nantucket", 41.28, -70.1],
  ["martha's vineyard", "Martha's Vineyard", 41.39, -70.61],
  ["portland, maine", "Portland, Maine", 43.66, -70.26],
  ["portland maine", "Portland, Maine", 43.66, -70.26],
  ["bar harbor", "Bar Harbor", 44.39, -68.2],
  ["burlington, vermont", "Burlington, Vermont", 44.48, -73.21],
  ["stowe", "Stowe", 44.47, -72.69],
  ["atlantic city", "Atlantic City", 39.36, -74.42],
  ["richmond", "Richmond", 37.54, -77.44],
  ["greenville", "Greenville", 34.85, -82.4],
  ["hilton head", "Hilton Head", 32.22, -80.75],
  ["asheville", "Asheville", 35.6, -82.55],
  ["fort myers", "Fort Myers", 26.64, -81.87],
  ["sarasota", "Sarasota", 27.34, -82.53],
  ["daytona beach", "Daytona Beach", 29.21, -81.02],
  ["daytona", "Daytona Beach", 29.21, -81.02],
  ["st. augustine", "St. Augustine", 29.9, -81.31],
  ["st augustine", "St. Augustine", 29.9, -81.31],
  ["pensacola", "Pensacola", 30.42, -87.22],
  ["destin", "Destin", 30.39, -86.5],
  ["panama city beach", "Panama City Beach", 30.18, -85.8],
  ["tallahassee", "Tallahassee", 30.44, -84.28],
  ["sacramento", "Sacramento", 38.58, -121.49],
  ["fresno", "Fresno", 36.74, -119.79],
  ["monterey", "Monterey", 36.6, -121.89],
  ["santa barbara", "Santa Barbara", 34.42, -119.7],
  ["mammoth lakes", "Mammoth Lakes", 37.65, -118.97],
  ["anchorage", "Anchorage", 61.22, -149.9],
  ["maui", "Maui", 20.8, -156.33],
  ["kauai", "Kauai", 22.07, -159.5],
  ["kona", "Kona", 19.64, -155.99],
  ["jackson hole", "Jackson Hole", 43.48, -110.76],
  ["park city", "Park City", 40.65, -111.5],
  ["moab", "Moab", 38.57, -109.55],
  ["bozeman", "Bozeman", 45.68, -111.04],
  ["big sky", "Big Sky", 45.28, -111.4],
  ["missoula", "Missoula", 46.87, -113.99],
  ["billings", "Billings", 45.78, -108.5],
  ["fargo", "Fargo", 46.88, -96.79],
  ["sioux falls", "Sioux Falls", 43.55, -96.73],
  ["rapid city", "Rapid City", 44.08, -103.23],
  ["colorado springs", "Colorado Springs", 38.83, -104.82],
  ["breckenridge", "Breckenridge", 39.48, -106.04],
  ["telluride", "Telluride", 37.94, -107.81],
  ["steamboat springs", "Steamboat Springs", 40.48, -106.83],
  ["grand rapids", "Grand Rapids", 42.96, -85.67],
  ["traverse city", "Traverse City", 44.76, -85.62],
  ["ann arbor", "Ann Arbor", 42.28, -83.74],
  ["dayton", "Dayton", 39.76, -84.19],
  ["puerto rico", "Puerto Rico", 18.47, -66.11],
  ["san juan", "San Juan, Puerto Rico", 18.47, -66.11],
].map(([name, label, lat, lon, cs]) => ({
  name: name as string,
  label: label as string,
  at: [lat as number, lon as number] as const,
  caseSensitive: Boolean(cs),
}));

/** US states with no covered market inside them (state-level fallback when no city is named). */
const UNCOVERED_STATES: UsPlace[] = [
  ["idaho", "Idaho", 44.07, -114.74],
  ["montana", "Montana", 46.88, -110.36],
  ["wyoming", "Wyoming", 43.08, -107.29],
  ["north dakota", "North Dakota", 47.55, -101.0],
  ["south dakota", "South Dakota", 43.97, -99.9],
  ["nebraska", "Nebraska", 41.49, -99.9],
  ["iowa", "Iowa", 41.88, -93.1],
  ["wisconsin", "Wisconsin", 43.78, -88.79],
  ["kentucky", "Kentucky", 37.84, -84.27],
  ["alabama", "Alabama", 32.32, -86.9],
  ["mississippi", "Mississippi", 32.35, -89.4],
  ["arkansas", "Arkansas", 35.2, -91.83],
  ["oklahoma", "Oklahoma", 35.47, -97.52],
  ["new mexico", "New Mexico", 34.52, -105.87],
  ["alaska", "Alaska", 61.37, -152.4],
  ["maine", "Maine", 45.25, -69.45],
  ["new hampshire", "New Hampshire", 43.19, -71.57],
  ["vermont", "Vermont", 44.56, -72.58],
  ["connecticut", "Connecticut", 41.6, -72.7],
  ["rhode island", "Rhode Island", 41.58, -71.48],
  ["west virginia", "West Virginia", 38.6, -80.45],
].map(([name, label, lat, lon]) => ({
  name: name as string,
  label: label as string,
  at: [lat as number, lon as number] as const,
}));

/** International places (Capital Graph coverage is US-only). */
const INTERNATIONAL: { name: string; label: string; caseSensitive?: boolean }[] = [
  ...[
    "London", "Paris", "Rome", "Milan", "Venice", "Florence", "Barcelona", "Madrid", "Lisbon", "Porto",
    "Berlin", "Munich", "Frankfurt", "Amsterdam", "Dublin", "Edinburgh", "Manchester", "Zurich", "Geneva",
    "Vienna", "Prague", "Budapest", "Athens", "Istanbul", "Copenhagen", "Stockholm", "Oslo", "Brussels",
    "Dubai", "Abu Dhabi", "Doha", "Riyadh", "Tel Aviv", "Cairo", "Marrakech", "Cape Town", "Johannesburg",
    "Tokyo", "Osaka", "Kyoto", "Seoul", "Beijing", "Shanghai", "Hong Kong", "Singapore", "Bangkok", "Phuket",
    "Bali", "Kuala Lumpur", "Manila", "Mumbai", "Delhi", "Maldives", "Sydney", "Melbourne", "Auckland",
    "Toronto", "Vancouver", "Montreal", "Calgary", "Banff", "Whistler", "Mexico City", "Cancun", "Cancún",
    "Los Cabos", "Cabo", "Tulum", "Puerto Vallarta", "Bahamas", "Nassau", "Jamaica", "Aruba", "Punta Cana",
    "Costa Rica", "Rio de Janeiro", "São Paulo", "Sao Paulo", "Buenos Aires", "Bogotá", "Bogota", "Lima",
    "United Kingdom", "England", "Scotland", "Ireland", "France", "Italy", "Spain", "Portugal", "Germany",
    "Netherlands", "Switzerland", "Austria", "Greece", "Japan", "China", "India", "Thailand", "Vietnam",
    "Indonesia", "Australia", "New Zealand", "Canada", "Brazil", "Argentina", "Europe", "European", "Asia",
    "Caribbean", "Middle East", "Saudi Arabia", "UAE",
  ].map((label) => ({ name: label.toLowerCase(), label })),
  { name: "UK", label: "the UK", caseSensitive: true },
  { name: "Mexico", label: "Mexico", caseSensitive: true },
  { name: "Turkey", label: "Turkey", caseSensitive: true },
];

export type UncoveredPlace =
  | { kind: "us"; label: string; at: LatLon; span: string }
  | { kind: "international"; label: string; span: string };

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function phraseRe(name: string, caseSensitive?: boolean): RegExp {
  return new RegExp(`(^|[^\\p{L}])${escapeRe(name)}(?=$|[^\\p{L}])`, caseSensitive ? "u" : "iu");
}

/**
 * Find places named in the question that we don't cover. Longest phrases win, so
 * "New Mexico" is a US state, not Mexico, and "Oklahoma City" is a city, not a state.
 * `isCovered(phrase)` lets the caller veto a phrase that matches a covered market alias.
 */
export function detectUncoveredPlaces(
  question: string,
  isCovered: (phrase: string) => boolean
): UncoveredPlace[] {
  let text = question;
  const found: UncoveredPlace[] = [];
  const consume = (name: string, caseSensitive?: boolean): string | null => {
    const re = phraseRe(name, caseSensitive);
    const m = re.exec(text);
    if (!m) return null;
    const span = m[0].slice(m[1].length);
    text = text.replace(re, (_all, pre: string) => `${pre}${" ".repeat(span.length)}`);
    return span;
  };
  const candidates: ({ src: "us" | "state"; p: UsPlace } | { src: "intl"; p: (typeof INTERNATIONAL)[number] })[] = [
    ...US_PLACES.map((p) => ({ src: "us" as const, p })),
    ...UNCOVERED_STATES.map((p) => ({ src: "state" as const, p })),
    ...INTERNATIONAL.map((p) => ({ src: "intl" as const, p })),
  ].sort((a, b) => b.p.name.length - a.p.name.length);

  for (const c of candidates) {
    if (isCovered(c.p.name)) continue;
    const span = consume(c.p.name, c.p.caseSensitive);
    if (!span) continue;
    if (c.src === "intl") found.push({ kind: "international", label: c.p.label, span });
    else found.push({ kind: "us", label: c.p.label, at: (c.p as UsPlace).at, span });
  }
  // A named city is more specific than a state ("Boise, Idaho"): keep the city only.
  const hasCity = found.some((f) => f.kind === "us" && US_PLACES.some((p) => p.label === f.label));
  return hasCity
    ? found.filter((f) => !(f.kind === "us" && UNCOVERED_STATES.some((s) => s.label === f.label)))
    : found;
}

/** Question with every uncovered-place phrase blanked (to re-check for covered markets). */
export function withoutPlaces(question: string, places: UncoveredPlace[]): string {
  let out = question;
  for (const p of places) {
    out = out.replace(new RegExp(escapeRe(p.span), "i"), " ");
  }
  return out;
}

function haversineKm(a: LatLon, b: LatLon): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

/** The `n` covered markets nearest to a point (only slugs present in `markets`). */
export function nearestCoveredMarkets<T extends { slug: string; name: string }>(
  at: LatLon,
  markets: T[],
  n = 3
): T[] {
  return markets
    .filter((m) => COVERED_MARKET_COORDS[m.slug])
    .map((m) => ({ m, d: haversineKm(at, COVERED_MARKET_COORDS[m.slug]!) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, n)
    .map((x) => x.m);
}

/** Deterministic "not covered yet" block (no figures). */
export function uncoveredMarketLines<T extends { slug: string; name: string }>(
  places: UncoveredPlace[],
  markets: T[]
): string[] {
  const lines: string[] = [];
  for (const p of places) {
    if (p.kind === "international") {
      lines.push(
        `**${p.label} isn't covered.** Bungah Capital Intel covers US hotel markets only, so there are no cited figures for ${p.label} and none are estimated here.`
      );
    } else {
      const near = nearestCoveredMarkets(p.at, markets, 3);
      lines.push(
        `**${p.label} isn't covered yet.** There's no ${p.label} market in the Capital Graph, so there are no cited figures for it and none are estimated here.`
      );
      if (near.length) {
        lines.push(
          "",
          "Closest markets we do cover, by geography:",
          ...near.map((m) => `- [${m.name}](/markets/${m.slug})`)
        );
      }
    }
    lines.push("");
  }
  lines.push("[Browse every market we cover](/markets).");
  return lines;
}
