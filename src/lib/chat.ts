import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { classifyIntent, type ChatIntent } from "./chat-intent";
import { getMsaRegistryEntry } from "@/data/msa-registry";
import {
  citedOnly,
  citedFindings,
  publicRadarDescription,
  coverageInProgressLine,
  isSeedMarket,
  scrubSeedCitations,
} from "./format";
import { parseSourceUrls } from "./source-links";
import { scrubInternal } from "./public-text";
import { splitTaxSeries } from "./tax-series";

export type ChatAnswer = {
  content: string;
  citations: string[];
  /** Clickable original-article links for the signals shown in this answer. */
  sources?: { url: string; label: string; secondary?: boolean; signal: string }[];
  intent?: ChatIntent;
  marketSlug?: string | null;
  mode?: "llm" | "deterministic";
};

export type MarketRow = Prisma.MarketGetPayload<{
  include: { assets: true; signals: true };
}>;

type NationalSignal = Awaited<ReturnType<typeof prisma.signal.findMany>>[number];
type RadarWithFindings = Prisma.RadarGetPayload<{
  include: { findings: true };
}>;

export type GraphContext = {
  question: string;
  intent: ChatIntent;
  preferredMarketSlug: string | null;
  markets: MarketRow[];
  matched: MarketRow | null;
  secondary: MarketRow[];
  nationalSignals: NationalSignal[];
  radars: RadarWithFindings[];
};

function cites(...labels: (string | null | undefined)[]): string[] {
  // Seed / illustrative source labels never reach users.
  return scrubSeedCitations([...new Set(labels.filter(Boolean) as string[])]);
}

/** Extra search aliases beyond slug/name tokens. */
const MARKET_ALIASES: Record<string, string[]> = {
  nashville: ["nashville", "music city", "davidson", "murfreesboro"],
  orlando: ["orlando", "kissimmee", "sanford", "grande lakes", "gaylord", "i-drive", "mco"],
  "las-vegas": ["vegas", "las vegas", "lvcva", "hard rock", "strip", "harry reid"],
  miami: ["miami", "south beach", "wynwood"],
  "new-york-city": ["nyc", "new york", "manhattan", "midtown", "jersey city"],
  austin: ["austin", "sxsw"],
  "new-orleans": ["nola", "new orleans", "french quarter"],
  honolulu: ["honolulu", "waikiki", "oahu", "hawaii"],
  "san-francisco-bay": ["san francisco", "sf bay", "bay area"],
  "los-angeles": ["los angeles", "la ", " lax", "santa monica"],
  chicago: ["chicago", "ohare", "palmer house"],
  atlanta: ["atlanta", "hartsfield"],
  denver: ["denver"],
  phoenix: ["phoenix", "scottsdale"],
  seattle: ["seattle"],
  boston: ["boston"],
  "washington-dc": ["washington dc", "dc ", "d.c."],
  dallas: ["dallas", "dfw", "fort worth", "roanoke"],
  houston: ["houston"],
  "san-diego": ["san diego"],
  tampa: ["tampa"],
  charlotte: ["charlotte"],
  "charleston-sc": ["charleston", "charleston sc"],
  savannah: ["savannah"],
  "myrtle-beach": ["myrtle beach", "myrtle"],
  "florida-keys": ["key west", "florida keys"],
  "palm-beach": ["palm beach", "west palm"],
  "fort-lauderdale": ["fort lauderdale"],
  "anaheim-orange-county": ["anaheim", "disney", "orange county", "disneyland"],
  "palm-springs": ["palm springs", "coachella"],
  "reno-tahoe": ["reno", "tahoe"],
  "aspen-vail": ["aspen", "vail", "ski"],
  "napa-sonoma": ["napa", "sonoma", "wine country"],
  "sedona-grand-canyon": ["sedona", "grand canyon"],
};

function marketSearchTokens(m: { slug: string; name: string }): string[] {
  const fromSlug = m.slug.split("-").filter((t) => t.length > 2);
  const fromName = m.name
    .toLowerCase()
    .split(/[\s–—,/()]+/)
    .filter((t) => t.length > 3 && !["msa", "class", "county", "urban"].includes(t));
  const aliases = MARKET_ALIASES[m.slug] ?? [];
  return [...new Set([...aliases, ...fromSlug, ...fromName, m.slug.replace(/-/g, " ")])];
}

function scoreMarketMatch(q: string, m: { slug: string; name: string }): number {
  let score = 0;
  for (const token of marketSearchTokens(m)) {
    if (token.length < 3) continue;
    if (q.includes(token)) {
      score += token.length >= 8 ? 4 : token.includes(" ") ? 5 : 2;
    }
  }
  if (q.includes(m.slug)) score += 6;
  return score;
}

/** Prefer generic lodging-labor wording when national talent seed names only Orlando/Vegas. */
function scrubNationalTalentBody(body: string): string {
  const b = body.trim();
  if (/\b(orlando|vegas|las vegas|epic-adjacent)\b/i.test(b)) {
    // Rewrite Orlando/Vegas-centric national copy to generic greenlight.
    return "CapEx and refinance greenlights increasingly gated by staffing and GC/MEP capacity — not just demand and rates. Treat human-touch / lodging labor capacity as a first-class gate across US lodging markets before underwriting.";
  }
  return b;
}

function nationalTalentOneLiner(body: string): string {
  const scrubbed = scrubNationalTalentBody(body);
  // Keep secondary overlay short.
  const first = scrubbed.split(/(?<=\.)\s+/)[0] ?? scrubbed;
  return first.length > 220 ? first.slice(0, 217) + "…" : first;
}

/**
 * Dated national sweep signals (rates, CMBS, cap rates, performance, group pace…).
 * Legacy national stubs keep kinds "debt" / "talent"; sweep rows use other kinds.
 */
const NATIONAL_KIND_TRIGGERS: Record<string, RegExp> = {
  rates: /\b10[- ]?y(ear)?\b|\btreasur|\byields?\b|\bfomc\b|\binterest rates?\b|\brates\b/,
  cmbs: /\bcmbs\b|\bdelinquen|\bdq\b|\bspecial servic|\bdistress/,
  cap_rate: /\bcap(italization)? rates?\b|\bcaps\b|\bper key\b|\btransactions?\b|\bpricing\b/,
  performance: /\boccupanc|\badr\b|\brevpar\b|\bperformance\b|\bnational\b|\bu\.?s\.? hotels?\b|\bnationwide\b/,
  group_pace: /\bgroup\b|\bpace\b|\bconvention|\bmeetings?\b|\bunsold\b/,
  drive: /\bgas\b|\bfuel\b|\bdrive\b/,
  franchise_climate: /\bowners?\b|\bfranchis|\bconfidence\b|\bihg\b/,
  brand_dev: /\baccor\b|\brandall\b|\bdevelopment exec|\bcdo\b/,
  leadership: /\bchoice\b|\bceo\b|\bdragisich\b/,
  earnings_calendar: /\bearnings\b|\bq3\b|\bcalendar\b|\breport dates?\b/,
  capital_markets: /\brevolver\b|\bliquidity\b/,
  supply_economics: /\bbuild(ing)? costs?\b|\bconstruction costs?\b|\bnew[- ]build\b|\bhyatt place\b/,
  labor_stress_test: /\baihg\b|\bsloan\b|\bai[- ]native\b|\bjobs\b/,
  world_cup: /\bworld cup\b|\bfifa\b/,
  budget_baseline: /\bbudget|\bbaseline\b|\b2027\b/,
  labor_rule: /\bfte\b|\bheadcount\b|\bsoft june\b|\blayoffs?\b/,
};

function isSweepNational(s: NationalSignal): boolean {
  return s.kind !== "debt" && s.kind !== "talent";
}

function selectNationalSweep(q: string, signals: NationalSignal[]): NationalSignal[] {
  return signals.filter((s) => isSweepNational(s) && NATIONAL_KIND_TRIGGERS[s.kind]?.test(q));
}

function nationalSignalLine(s: NationalSignal): string {
  return `- **${s.title}** (${s.magnitude ?? "—"}${s.asOf ? `, ${s.asOf}` : ""}) — ${s.body} _Source: ${s.sourceLabel}_`;
}

function derivedRevpar(
  occupancy: number | null | undefined,
  adr: number | null | undefined
): number | null {
  if (occupancy == null || adr == null) return null;
  return (occupancy / 100) * adr;
}

function metricTable(market: MarketRow): string[] {
  const revpar = derivedRevpar(market.occupancy, market.adr);
  const rows: string[] = [
    `| Metric | Value |`,
    `| --- | --- |`,
    `| Visitors | ${market.visitorsM != null ? `${market.visitorsM.toFixed(1)}M` : "—"} |`,
    `| Rooms | ${market.roomsK != null ? `${market.roomsK.toFixed(1)}k` : "—"} |`,
    `| OCC | ${market.occupancy != null ? `${market.occupancy.toFixed(1)}%` : "—"} |`,
    `| ADR | ${market.adr != null ? `$${market.adr.toFixed(2)}` : "—"} |`,
  ];
  if (revpar != null) {
    rows.push(`| RevPAR (OCC×ADR, derived) | $${revpar.toFixed(2)} |`);
  }
  if (market.midweekOcc != null) {
    rows.push(`| Midweek OCC | ${market.midweekOcc.toFixed(1)}% |`);
  }
  if (market.weekendOcc != null) {
    rows.push(`| Weekend OCC | ${market.weekendOcc.toFixed(1)}% |`);
  }
  return rows;
}

type SignalRow = MarketRow["signals"][number];

/** One signal bullet (seed rows are filtered out before formatting). */
function signalLine(s: SignalRow): string {
  return `- **${s.title}** (${s.magnitude ?? "—"}${s.asOf ? `, ${s.asOf}` : ""}) — ${s.body}`;
}

/**
 * Seed-snapshot market: answer only from cited rows, plus one plain coverage line.
 * Summary, OCC/ADR/visitors and nuance on these markets are placeholders and are never shown.
 */
/** Talent answers lead with wage floors / ordinances / contract terms; gap tables go last. */
function talentRank(s: SignalRow): number {
  const t = `${s.title} ${s.body}`;
  if (/gaps?\b.*no public read|\bgaps\b/i.test(s.title)) return 9;
  if (/wage floor|ordinance|\bOrd\.|minimum wage|contract|UNITE HERE|Local \d+/i.test(s.title)) return 0;
  if (/\bOrd\. \d|\$\d+(\.\d+)?\/hr|Local \d+ .*\$/i.test(t)) return 1;
  if (/operator bench|build talent|OEWS/i.test(s.title)) return 3;
  return 2;
}
export function orderTalent<T extends SignalRow>(list: T[]): T[] {
  return list
    .map((s, i) => ({ s, i, r: talentRank(s) }))
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .map((x) => x.s);
}

function citedOnlyMemo(
  market: MarketRow,
  heading: string,
  focus?: (s: SignalRow) => boolean
): string[] {
  const focusedRaw = focus ? market.signals.filter(focus) : [];
  const focused = heading.includes("talent / staffing greenlight") ? orderTalent(focusedRaw) : focusedRaw;
  const list = focused.length ? focused : market.signals;
  return [
    heading,
    "",
    ...(list.length ? list.map(signalLine) : []),
    ...(list.length ? [""] : []),
    coverageInProgressLine(market.name),
    ...dataNote(market),
    "",
    footer(),
  ];
}

function signalLines(
  market: MarketRow,
  filter?: (s: MarketRow["signals"][number]) => boolean
): string[] {
  const list = filter ? market.signals.filter(filter) : market.signals;
  if (list.length === 0) {
    return [
      "Key signals:",
      "- _None matching this intent yet — metrics / nuance above are the Capital Graph snapshot._",
    ];
  }
  return [
    "Key signals:",
    ...list.map(signalLine),
  ];
}

function assetLines(market: MarketRow): string[] {
  if (market.assets.length === 0) return [];
  return [
    "",
    "Seed assets:",
    ...market.assets.map(
      (a) =>
        `- **${a.name}** (${a.keys ?? "?"} keys${a.submarket ? `, ${a.submarket}` : ""}) — ${a.notes ?? a.assetClass}`
    ),
  ];
}

function dataNote(market: MarketRow): string[] {
  const reg = getMsaRegistryEntry(market.slug);
  const lines: string[] = [];
  if (reg) {
    lines.push(
      `_CVB / source map:_ **${reg.cvb_name}**${reg.source_quality === "illustrative" ? "" : ` · quality **${reg.source_quality}**`} · lodging **${reg.lodging_report_kind}** · [research](${reg.cvb_research_url})${reg.lodging_report_url ? ` · [lodging report](${reg.lodging_report_url})` : ""} (registry verified ${reg.last_verified_at}).`
    );
  }
  return lines.length ? ["", ...lines] : [];
}

function footer(): string {
  return "_Decision support:_ Bungah Capital Intel surfaces cited Capital Graph facts for human decision — no auto capital actions, no private CSP claimed.";
}

function dedupeBlank(lines: string[]): string {
  return lines
    .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
    .join("\n");
}


/** Primary original link for a signal (first sourceUrls entry). */
function primaryLink(s: SignalRow): { url: string; label: string } | null {
  const l = parseSourceUrls(s.sourceUrls)[0];
  return l ? { url: l.url, label: l.label } : null;
}

/** One tax-series bullet: title, magnitude (basis label), period, linked publisher. */
function taxLine(s: SignalRow): string {
  const link = primaryLink(s);
  const pub = (link?.label ?? s.sourceLabel).split(" — ")[0];
  const tail = link ? ` — [${pub} ↗](${link.url})` : /no public read/i.test(s.magnitude ?? "") ? "" : " — _no public read_";
  return `- **${s.title}** — ${s.magnitude ?? "—"}${tail}`;
}

const TAX_TEXT = /\b(hotel|occupancy|lodging|tourist development|transient|accommodations?|bed|room)[- ]+(occupancy |development )?tax|\b(TDT|TOT|TAT|HOT|CDT)\b|hotel-motel tax/i;

/** Hotel-tax answer for one market: the published series newest first, each row linked to its source. */
export function formatTaxMemo(market: MarketRow): ChatAnswer {
  const { other, tax } = splitTaxSeries(market.signals);
  const figures = tax.filter((s) => !/gaps$/.test(s.id));
  const gaps = tax.filter((s) => /gaps$/.test(s.id));
  const related = other.filter((s) => s.kind === "tax" || TAX_TEXT.test(`${s.title} ${s.body}`));
  const latest = figures.find((s) => primaryLink(s));
  const at = latest ? latest.body.indexOf("Basis:") : -1;
  const caveat = latest && at >= 0 ? latest.body.slice(at + 7).replace(/\s*Decision support\.?$/, "") : "";
  const lines: string[] = figures.length
    ? [
        `**${market.name} — hotel-tax collections (newest first)**`,
        "",
        ...figures.map(taxLine),
        ...(caveat ? ["", `_Basis & caveats:_ ${caveat}`] : []),
        ...gaps.map((g) => `\n_Gaps:_ ${g.body.replace(/^[^:]*:\s*/, "").replace(/\s*Decision support\.?$/, "")}`),
        ...(related.length ? ["", "Related tax / CVB signals:", ...related.map(signalLine)] : []),
      ]
    : [
        `**${market.name} — hotel-tax signals (newest first)**`,
        "",
        ...(related.length
          ? related.map(signalLine)
          : ["_No published hotel-tax collection series loaded for this market yet._"]),
      ];
  return {
    content: dedupeBlank([...lines, "", footer()]),
    citations: cites(...figures.map((s) => s.sourceLabel), ...related.map((s) => s.sourceLabel)),
    intent: "tax_collections",
    marketSlug: market.slug,
    mode: "deterministic",
  };
}

/**
 * Intent-branched market memo — same intents work for ANY matched market.
 * Used as deterministic fallback when LLM keys are absent.
 */
export function formatMarketMemo(
  marketIn: MarketRow,
  intent: ChatIntent = "general_thesis"
): ChatAnswer {
  if (intent === "tax_collections") return formatTaxMemo(marketIn);
  // Other intents carry only the latest hotel-tax print (full series answers tax questions).
  const split = splitTaxSeries(marketIn.signals);
  const market: MarketRow = {
    ...marketIn,
    signals: [...split.other, ...split.tax.filter((s) => !/gaps$/.test(s.id) && parseSourceUrls(s.sourceUrls).length).slice(0, 1)],
  };
  const supplyFilter = (s: MarketRow["signals"][number]) =>
    s.kind === "supply" ||
    /supply|pipeline|new keys|construction|absorption/i.test(`${s.kind} ${s.title}`);
  const demandFilter = (s: MarketRow["signals"][number]) =>
    s.kind === "demand" ||
    s.kind === "visitation" ||
    s.kind === "airlift" ||
    s.kind === "citywide_calendar" ||
    s.kind === "drive" ||
    /demand|visit|leisure|tourism|attendance/i.test(`${s.kind} ${s.title}`);
  const talentFilter = (s: MarketRow["signals"][number]) =>
    s.kind === "talent" ||
    /talent|staffing|greenlight|human-touch|human touch|\bcrew\b|\blabor\b/i.test(
      `${s.kind} ${s.title}`
    );

  const debtFilter = (s: MarketRow["signals"][number]) =>
    ["debt", "deal", "transaction", "cmbs", "cap_rate", "rates", "tax"].includes(s.kind) ||
    /debt|cmbs|loan|refinanc|transaction|deal comps|cap rate|tax|cvb funding/i.test(`${s.kind} ${s.title}`);

  let body: string[];

  if (isSeedMarket(market)) {
    const focus =
      intent === "supply_pipeline"
        ? supplyFilter
        : intent === "demand_visitation"
          ? demandFilter
          : intent === "talent_greenlight"
            ? talentFilter
            : intent === "debt_overlay"
              ? debtFilter
              : undefined;
    const heading =
      intent === "supply_pipeline"
        ? `**${market.name} — supply / pipeline**`
        : intent === "demand_visitation"
          ? `**${market.name} — demand / visitation**`
          : intent === "talent_greenlight"
            ? `**${market.name} — talent / staffing greenlight**`
            : intent === "debt_overlay"
              ? `**${market.name} — debt / deals / tax overlay**`
              : `**${market.name}**`;
    return {
      content: dedupeBlank(citedOnlyMemo(market, heading, focus)),
      citations: cites(...market.signals.map((s) => s.sourceLabel)),
      intent,
      marketSlug: market.slug,
      mode: "deterministic",
    };
  }

  switch (intent) {
    case "supply_pipeline": {
      const supply = market.signals.filter(supplyFilter);
      body = [
        `**${market.name} — supply / pipeline**`,
        "",
        supply.length > 0
          ? supply
              .map(signalLine)
              .join("\n")
          : "_No dedicated supply signal seeded — watch rooms stock and pipeline narratives below._",
        "",
        `Rooms stock (graph): **${market.roomsK != null ? `${market.roomsK.toFixed(1)}k` : "—"}** · OCC **${market.occupancy != null ? `${market.occupancy.toFixed(1)}%` : "—"}** · ADR **${market.adr != null ? `$${market.adr.toFixed(2)}` : "—"}**`,
        "",
        market.summary,
        "",
        ...metricTable(market),
        "",
        market.nuanceNote ?? "",
        ...assetLines(market),
        ...dataNote(market),
        "",
        footer(),
      ];
      break;
    }
    case "talent_greenlight": {
      const talent = orderTalent(market.signals.filter(talentFilter));
      body = [
        `**${market.name} — talent / staffing greenlight**`,
        "",
        talent.length > 0
          ? talent
              .map(signalLine)
              .join("\n")
          : "_No market talent signal seeded — apply national human-touch greenlight gate before CapEx / refinance._",
        "",
        "Implication: pair demand thesis with staffing + GC/MEP capacity before CapEx or refinance greenlight.",
        "",
        market.nuanceNote ?? market.summary,
        "",
        ...metricTable(market),
        ...signalLines(market),
        ...assetLines(market),
        ...dataNote(market),
        "",
        footer(),
      ];
      break;
    }
    case "revpar_metrics": {
      body = [
        `**${market.name} — OCC / ADR / RevPAR**`,
        "",
        ...metricTable(market),
        "",
        market.summary,
        "",
        market.nuanceNote ?? "",
        "",
        ...signalLines(market),
        ...assetLines(market),
        ...dataNote(market),
        "",
        footer(),
      ];
      break;
    }
    case "which_submarket": {
      body = [
        `**${market.name} — which submarket / nuance**`,
        "",
        market.nuanceNote ??
          "_No nuance note yet — underwrite by submarket and product class, not MSA averages._",
        "",
        market.summary,
        "",
        ...metricTable(market),
        "",
        ...signalLines(market),
        ...assetLines(market),
        ...dataNote(market),
        "",
        footer(),
      ];
      break;
    }
    case "demand_visitation": {
      const demand = market.signals.filter(demandFilter);
      body = [
        `**${market.name} — demand / visitation**`,
        "",
        `Visitors (graph): **${market.visitorsM != null ? `${market.visitorsM.toFixed(1)}M` : "—"}**`,
        "",
        demand.length > 0
          ? demand
              .map(signalLine)
              .join("\n")
          : "_No dedicated demand signal — see summary and metrics._",
        "",
        market.summary,
        "",
        ...metricTable(market),
        "",
        market.nuanceNote ?? "",
        ...assetLines(market),
        ...dataNote(market),
        "",
        footer(),
      ];
      break;
    }
    case "debt_overlay": {
      body = [
        `**${market.name} — debt / refinance overlay**`,
        "",
        "Pair this market snapshot with the national lodging debt-wall / DY stress signal before CapEx or refinance greenlight.",
        "",
        ...signalLines(market, market.signals.some(debtFilter) ? debtFilter : undefined),
        "",
        market.summary,
        "",
        ...metricTable(market),
        "",
        market.nuanceNote ?? "",
        ...assetLines(market),
        ...dataNote(market),
        "",
        footer(),
      ];
      break;
    }
    default: {
      // general_thesis, compare_markets (single market), unknown
      body = [
        `**${market.name}**`,
        "",
        market.summary,
        "",
        ...metricTable(market),
        "",
        market.nuanceNote ?? "",
        "",
        ...signalLines(market),
        ...assetLines(market),
        ...dataNote(market),
        "",
        footer(),
      ];
    }
  }

  return {
    content: dedupeBlank(body),
    citations: cites(
      ...market.signals.map((s) => s.sourceLabel),
      market.sourceLabel,
      ...market.assets.map((a) => a.sourceLabel)
    ),
    intent,
    marketSlug: market.slug,
    mode: "deterministic",
  };
}

export function findBestMarket(q: string, markets: MarketRow[]): MarketRow | null {
  let best: MarketRow | null = null;
  let bestScore = 0;
  for (const m of markets) {
    const s = scoreMarketMatch(q, m);
    if (s > bestScore) {
      bestScore = s;
      best = m;
    }
  }
  if (!best || bestScore < 2) return null;
  return best;
}

function findMarketsByScore(q: string, markets: MarketRow[], minScore = 2): MarketRow[] {
  return markets
    .map((m) => ({ m, s: scoreMarketMatch(q, m) }))
    .filter((x) => x.s >= minScore)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.m);
}

export async function retrieveGraphContext(
  question: string,
  preferredMarketSlug?: string | null
): Promise<GraphContext> {
  const intent = classifyIntent(question);
  const q = question.toLowerCase().trim();
  const slug = preferredMarketSlug?.trim().toLowerCase() || null;

  const markets = await prisma.market.findMany({
    // Newest signals first so dated sweeps lead over older seed baselines.
    include: { assets: true, signals: { orderBy: { createdAt: "desc" } } },
    orderBy: { name: "asc" },
  });
  // Seed / illustrative rows stay in the DB but never reach an answer.
  for (const m of markets) {
    m.signals = citedOnly(m.signals);
    m.assets = citedOnly(m.assets);
  }
  const nationalSignals = citedOnly(
    await prisma.signal.findMany({
      where: { marketId: null },
      orderBy: { createdAt: "desc" },
    })
  );
  const radars = (
    await prisma.radar.findMany({
      include: { findings: { orderBy: { createdAt: "desc" }, take: 10 } },
    })
  ).map((r) => ({ ...r, description: scrubInternal(publicRadarDescription(r.description)), findings: citedFindings(r.findings).slice(0, 3) }));

  let matched: MarketRow | null = null;
  if (slug) {
    matched = markets.find((m) => m.slug === slug) ?? null;
  }
  if (!matched) {
    matched = findBestMarket(q, markets);
  }

  const scored = findMarketsByScore(q, markets);
  const secondary = scored.filter((m) => m.id !== matched?.id).slice(0, 3);

  return {
    question,
    intent,
    preferredMarketSlug: slug,
    markets,
    matched,
    secondary,
    nationalSignals,
    radars,
  };
}

/** Serialize graph pack for LLM system/user context — cite-only facts. */
export function serializeGraphPack(ctx: GraphContext): {
  pack: string;
  citations: string[];
} {
  const citationSet = new Set<string>();
  const chunks: string[] = [];

  const pushMarket = (m: MarketRow, label: string) => {
    if (isSeedMarket(m)) {
      // Seed snapshot: pass only cited rows; no placeholder summary/metrics.
      chunks.push(
        [
          `### ${label}: ${m.name} (slug: ${m.slug})`,
          `Region: ${m.region}`,
          "Signals:",
          ...(m.signals.length
            ? m.signals.map((s) => {
                citationSet.add(s.sourceLabel);
                return `- [${s.kind}] ${s.title} | ${s.magnitude ?? "—"} | ${s.asOf ?? "—"} | ${s.body} (source: ${s.sourceLabel})`;
              })
            : ["- (none)"]),
          `Coverage: ${coverageInProgressLine(m.name)}`,
        ].join("\n")
      );
      return;
    }
    citationSet.add(m.sourceLabel);
    const revpar = derivedRevpar(m.occupancy, m.adr);
    chunks.push(
      [
        `### ${label}: ${m.name} (slug: ${m.slug})`,
        `Region: ${m.region}`,
        `Summary: ${m.summary}`,
        m.nuanceNote ? `Nuance: ${m.nuanceNote}` : "",
        `Metrics: visitorsM=${m.visitorsM ?? "null"}, roomsK=${m.roomsK ?? "null"}, OCC%=${m.occupancy ?? "null"}, ADR=${m.adr ?? "null"}, RevPAR_derived=${revpar != null ? revpar.toFixed(2) : "null"}, midweekOcc=${m.midweekOcc ?? "null"}, weekendOcc=${m.weekendOcc ?? "null"}`,
        `Source: ${m.sourceLabel}`,
        "Signals:",
        ...(m.signals.length
          ? m.signals.map((s) => {
              citationSet.add(s.sourceLabel);
              return `- [${s.kind}] ${s.title} | ${s.magnitude ?? "—"} | ${s.asOf ?? "—"} | ${s.body} (source: ${s.sourceLabel})`;
            })
          : ["- (none)"]),
        "Assets:",
        ...(m.assets.length
          ? m.assets.map((a) => {
              citationSet.add(a.sourceLabel);
              return `- ${a.name} | ${a.assetClass} | keys=${a.keys ?? "?"} | submarket=${a.submarket ?? "—"} | ${a.notes ?? ""} (source: ${a.sourceLabel})`;
            })
          : ["- (none)"]),
      ]
        .filter(Boolean)
        .join("\n")
    );
  };

  chunks.push(`Intent classified: ${ctx.intent}`);
  if (ctx.matched) pushMarket(ctx.matched, "Primary market");
  for (const m of ctx.secondary) pushMarket(m, "Related market");

  // Always include national debt + talent for hospitality-capital framing
  if (ctx.nationalSignals.length) {
    chunks.push("### National / unscoped signals");
    for (const s of ctx.nationalSignals) {
      citationSet.add(s.sourceLabel);
      const body =
        s.kind === "talent" ? scrubNationalTalentBody(s.body) : s.body;
      chunks.push(
        `- [${s.kind}] ${s.title} | ${s.magnitude ?? "—"} | ${body} (source: ${s.sourceLabel})`
      );
    }
  }

  if (ctx.radars.length) {
    chunks.push("### Active radars (latest findings)");
    for (const r of ctx.radars) {
      chunks.push(`Radar: ${r.name} — ${r.description}`);
      for (const f of r.findings) {
        citationSet.add(f.sourceLabel);
        chunks.push(
          `  Finding (${f.severity}): ${f.title} — ${f.summary} (source: ${f.sourceLabel})`
        );
      }
    }
  }

  return { pack: chunks.join("\n\n"), citations: scrubSeedCitations([...citationSet]) };
}

/**
 * Deterministic Capital Graph answers (LLM-free fallback).
 * Intent + market deep-link drive memo style for any matched market.
 */
export async function answerFromGraph(
  question: string,
  opts?: { marketSlug?: string | null }
): Promise<ChatAnswer> {
  const ctx = await retrieveGraphContext(question, opts?.marketSlug);
  const q = question.toLowerCase().trim();
  const { matched, nationalSignals, radars, intent } = ctx;

  if (!q) {
    return {
      content:
        "Ask the Bungah Capital Intel about the investment landscape in hotels. Name any market (or open a market page → Ask about this market), or ask about the national debt wall, talent / staffing greenlight, or radars. Answers are deterministic from the Capital Graph — decision support, every number cited.",
      citations: [],
      intent: "unknown",
      mode: "deterministic",
    };
  }

  // Compare markets — require two named/matched markets; never default Orlando vs Vegas
  if (intent === "compare_markets") {
    const scored = [matched, ...ctx.secondary].filter(Boolean) as MarketRow[];
    const unique: MarketRow[] = [];
    for (const m of scored) {
      if (!unique.some((u) => u.id === m.id)) unique.push(m);
    }
    if (unique.length >= 2) {
      const a = unique[0]!;
      const b = unique[1]!;
      if (isSeedMarket(a) || isSeedMarket(b)) {
        const side = (m: MarketRow): string[] =>
          isSeedMarket(m)
            ? [
                `**${m.name}**`,
                ...m.signals.slice(0, 4).map(signalLine),
                coverageInProgressLine(m.name),
              ]
            : [
                `**${m.name}** — OCC ${m.occupancy?.toFixed(1) ?? "—"}% · ADR $${m.adr?.toFixed(2) ?? "—"} · rooms ${m.roomsK?.toFixed(1) ?? "—"}k`,
                ...m.signals.slice(0, 4).map(signalLine),
              ];
        return {
          content: [`**${a.name} vs ${b.name} (cited rows)**`, "", ...side(a), "", ...side(b), "", footer()].join("\n"),
          citations: cites(
            isSeedMarket(a) ? null : a.sourceLabel,
            isSeedMarket(b) ? null : b.sourceLabel,
            ...a.signals.slice(0, 4).map((s) => s.sourceLabel),
            ...b.signals.slice(0, 4).map((s) => s.sourceLabel)
          ),
          intent,
          marketSlug: a.slug,
          mode: "deterministic",
        };
      }
      return {
        content: [
          `**${a.name} vs ${b.name} (cited snapshot)**`,
          "",
          `| | ${a.name} | ${b.name} |`,
          `| --- | --- | --- |`,
          `| Visitors | ${a.visitorsM?.toFixed(1) ?? "—"}M | ${b.visitorsM?.toFixed(1) ?? "—"}M |`,
          `| Rooms | ${a.roomsK?.toFixed(1) ?? "—"}k | ${b.roomsK?.toFixed(1) ?? "—"}k |`,
          `| OCC | ${a.occupancy?.toFixed(1) ?? "—"}% | ${b.occupancy?.toFixed(1) ?? "—"}% |`,
          `| ADR | $${a.adr?.toFixed(2) ?? "—"} | $${b.adr?.toFixed(2) ?? "—"} |`,
          "",
          `**${a.name} nuance:** ${a.nuanceNote ?? a.summary}`,
          "",
          `**${b.name} nuance:** ${b.nuanceNote ?? b.summary}`,
          "",
          footer(),
        ].join("\n"),
        citations: cites(a.sourceLabel, b.sourceLabel),
        intent,
        marketSlug: a.slug,
        mode: "deterministic",
      };
    }
    return {
      content: [
        "**Compare markets**",
        "",
        "Name two seeded markets to compare (e.g. Nashville vs Austin, Miami vs Charleston). We do not default to Orlando vs Las Vegas.",
        "",
        footer(),
      ].join("\n"),
      citations: [],
      intent,
      mode: "deterministic",
    };
  }

  // Hotel-tax question without a market: latest published print per market, newest first, linked.
  if (intent === "tax_collections" && !matched) {
    const latest = ctx.markets
      .map((m) => ({ m, s: splitTaxSeries(m.signals).tax.find((x) => !/gaps$/.test(x.id) && parseSourceUrls(x.sourceUrls).length) }))
      .filter((x): x is { m: MarketRow; s: SignalRow } => Boolean(x.s));
    return {
      content: dedupeBlank([
        "**Hotel-tax collections — latest published print by market**",
        "",
        ...(latest.length ? latest.map((x) => taxLine(x.s)) : ["_No hotel-tax collection series loaded yet._"]),
        "",
        "Name a market (e.g. NYC, Honolulu, Chicago) for its full series, newest first. Tax ≠ RevPAR: collections move with rate changes, base changes and collection timing.",
        "",
        footer(),
      ]),
      citations: cites(...latest.map((x) => x.s.sourceLabel)),
      intent,
      mode: "deterministic",
    };
  }

  // Any matched market (incl. marketSlug deep-link) — NEVER bare national talent/orlando
  if (matched) {
    const memo = formatMarketMemo(matched, intent);
    // Talent: lead with THIS market's talent signals; national only as secondary one-liner
    if (intent === "talent_greenlight") {
      const talent = nationalSignals.find((s) => s.kind === "talent");
      if (talent) {
        return {
          ...memo,
          content: [
            memo.content,
            "",
            "_National overlay (secondary):_ " + nationalTalentOneLiner(talent.body),
          ].join("\n"),
          citations: cites(...memo.citations, talent.sourceLabel),
        };
      }
    }
    if (intent === "debt_overlay") {
      const debt = nationalSignals.find((s) => s.kind === "debt");
      if (debt) {
        return {
          ...memo,
          content: [
            memo.content,
            "",
            "_National debt overlay (secondary):_ " + debt.body.split(/(?<=\.)\s+/)[0],
          ].join("\n"),
          citations: cites(...memo.citations, debt.sourceLabel),
        };
      }
    }
    return memo;
  }


  // National debt (no market or debt-led)
  if (intent === "debt_overlay" && !matched) {
    const debt = nationalSignals.find((s) => s.kind === "debt");
    const debtSweep = nationalSignals.filter(
      (s) => s.kind === "rates" || s.kind === "cmbs" || s.kind === "cap_rate"
    );
    return {
      content: [
        "**National lodging debt / refinance overlay**",
        "",
        // Cited rows only (placeholder / demo rows are filtered on read).
        ...(debt ? [debt.body, ""] : []),
        ...(debtSweep.length
          ? ["Latest cited debt / rate signals:", ...debtSweep.map(nationalSignalLine)]
          : ["_No cited national debt signal yet — pair market-level debt & deals rows before refinance greenlight._"]),
        "",
        footer(),
        "",
        radars
          .filter((r) => r.slug.includes("debt"))
          .flatMap((r) =>
            r.findings.map((f) => `- Finding: **${f.title}** — ${f.summary}`)
          )
          .join("\n"),
      ].join("\n"),
      citations: cites(
        debt?.sourceLabel,
        ...debtSweep.map((s) => s.sourceLabel),
        ...radars
          .filter((r) => r.slug.includes("debt"))
          .flatMap((r) => r.findings.map((f) => f.sourceLabel))
      ),
      intent,
      mode: "deterministic",
    };
  }

  // National talent when no market matched (scrub Orlando/Vegas-only seed copy)
  if (intent === "talent_greenlight" && !matched) {
    const talent = nationalSignals.find((s) => s.kind === "talent");
    const body = talent?.body
      ? scrubNationalTalentBody(talent.body)
      : "No talent signal seeded.";
    const stress = nationalSignals.filter(
      (s) => s.kind === "labor_stress_test" || s.kind === "labor_rule"
    );
    return {
      content: [
        "**Talent / staffing greenlight**",
        "",
        body,
        "",
        "Implication: pair demand thesis with staffing + GC/MEP capacity before CapEx or refinance greenlight.",
        ...(stress.length ? ["", ...stress.map(nationalSignalLine)] : []),
        "",
        footer(),
      ].join("\n"),
      citations: cites(talent?.sourceLabel, ...stress.map((s) => s.sourceLabel)),
      intent,
      mode: "deterministic",
    };
  }

  // National cited sweep signals (rates, CMBS, cap rates, US performance, group pace…)
  const nationalHits = selectNationalSweep(q, nationalSignals);
  if (nationalHits.length) {
    return {
      content: [
        "**National hotel capital signals (cited)**",
        "",
        ...nationalHits.map(nationalSignalLine),
        "",
        footer(),
      ].join("\n"),
      citations: cites(...nationalHits.map((s) => s.sourceLabel)),
      intent,
      mode: "deterministic",
    };
  }

  // Radar listing
  if (q.includes("radar") || q.includes("finding") || q.includes("monitor")) {
    return {
      content: [
        "**Active radars (Capital Graph)**",
        "",
        ...radars.map((r) => {
          const top = r.findings[0];
          return [
            `### ${r.name}`,
            r.description,
            top
              ? `Latest finding (${top.severity}): **${top.title}** — ${top.summary}`
              : "_No findings yet — run `npm run radars:run`._",
          ].join("\n");
        }),
      ].join("\n\n"),
      citations: cites(...radars.flatMap((r) => r.findings.map((f) => f.sourceLabel))),
      intent,
      mode: "deterministic",
    };
  }

  return {
    content: [
      "Public Capital Graph chat can only answer from seeded market snapshots: named markets, the national debt wall, talent signals, and active radars.",
      "",
      "This question needs a private workspace with a richer graph and deeper context. [Create an account](/signup) to continue.",
      "",
      "_Decision support:_ this is a workspace invitation, not an underwriting conclusion.",
    ].join("\n"),
    citations: [],
    intent,
    mode: "deterministic",
  };
}

/**
 * Clickable sources for an answer: every cited signal whose title appears in the answer,
 * each original URL as its own link (seed rows never included).
 */
export async function sourcesForAnswer(
  content: string
): Promise<NonNullable<ChatAnswer["sources"]>> {
  const rows = citedOnly(
    await prisma.signal.findMany({
      where: { NOT: { sourceUrls: { equals: Prisma.AnyNull } } },
      select: { title: true, body: true, sourceLabel: true, sourceUrls: true },
    })
  );
  const out: NonNullable<ChatAnswer["sources"]> = [];
  const seen = new Set<string>();
  for (const r of rows) {
    if (!content.includes(`**${r.title}**`)) continue;
    for (const l of parseSourceUrls(r.sourceUrls)) {
      if (seen.has(l.url)) continue;
      seen.add(l.url);
      out.push({ ...l, signal: r.title });
    }
  }
  return out.slice(0, 60);
}
