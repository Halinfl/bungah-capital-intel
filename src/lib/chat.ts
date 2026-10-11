import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { classifyIntent, type ChatIntent } from "./chat-intent";
import { getMsaRegistryEntry } from "@/data/msa-registry";

export type ChatAnswer = {
  content: string;
  citations: string[];
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
  return [...new Set(labels.filter(Boolean) as string[])];
}

/** Extra search aliases beyond slug/name tokens. */
const MARKET_ALIASES: Record<string, string[]> = {
  nashville: ["nashville", "music city", "davidson", "murfreesboro"],
  orlando: ["orlando", "kissimmee", "sanford", "grande lakes", "gaylord", "i-drive"],
  "las-vegas": ["vegas", "las vegas", "lvcva", "hard rock", "strip"],
  miami: ["miami", "south beach"],
  "new-york-city": ["nyc", "new york", "manhattan", "midtown"],
  austin: ["austin", "sxsw"],
  "new-orleans": ["nola", "new orleans", "french quarter"],
  honolulu: ["honolulu", "waikiki", "oahu", "hawaii"],
  "san-francisco-bay": ["san francisco", "sf bay", "bay area"],
  "los-angeles": ["los angeles", "la ", " lax"],
  chicago: ["chicago", "ohare"],
  atlanta: ["atlanta", "hartsfield"],
  denver: ["denver"],
  phoenix: ["phoenix", "scottsdale"],
  seattle: ["seattle"],
  boston: ["boston"],
  "washington-dc": ["washington dc", "dc ", "d.c."],
  dallas: ["dallas", "dfw", "fort worth"],
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

function isIllustrativeSource(label: string | null | undefined): boolean {
  if (!label) return true;
  return /illustrative/i.test(label);
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
    ...list.map(
      (s) =>
        `- **${s.title}** (${s.magnitude ?? "—"}${s.asOf ? `, ${s.asOf}` : ""}) — ${s.body}`
    ),
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
      `_CVB / source map:_ **${reg.cvb_name}** · quality **${reg.source_quality}** · lodging **${reg.lodging_report_kind}** · [research](${reg.cvb_research_url})${reg.lodging_report_url ? ` · [lodging report](${reg.lodging_report_url})` : ""} (registry verified ${reg.last_verified_at}).`
    );
  }
  if (isIllustrativeSource(market.sourceLabel)) {
    lines.push(
      `_Thin / illustrative seed:_ source labeled **${market.sourceLabel}**. Numbers are graph placeholders for IC-memo drafting — do not treat as licensed STR/Tourism Economics. Ask for richer seed or licensed feeds before underwriting.`
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

/**
 * Intent-branched market memo — same intents work for ANY matched market.
 * Used as deterministic fallback when LLM keys are absent.
 */
export function formatMarketMemo(
  market: MarketRow,
  intent: ChatIntent = "general_thesis"
): ChatAnswer {
  const supplyFilter = (s: MarketRow["signals"][number]) =>
    s.kind === "supply" ||
    /supply|pipeline|new keys|construction|absorption/i.test(`${s.kind} ${s.title}`);
  const demandFilter = (s: MarketRow["signals"][number]) =>
    s.kind === "demand" ||
    s.kind === "visitation" ||
    /demand|visit|leisure|tourism|attendance/i.test(`${s.kind} ${s.title}`);
  const talentFilter = (s: MarketRow["signals"][number]) =>
    s.kind === "talent" ||
    /talent|staffing|greenlight|human-touch|human touch|\bcrew\b|\blabor\b/i.test(
      `${s.kind} ${s.title}`
    );

  let body: string[];

  switch (intent) {
    case "supply_pipeline": {
      const supply = market.signals.filter(supplyFilter);
      body = [
        `**${market.name} — supply / pipeline**`,
        "",
        supply.length > 0
          ? supply
              .map(
                (s) =>
                  `- **${s.title}** (${s.magnitude ?? "—"}${s.asOf ? `, ${s.asOf}` : ""}) — ${s.body}`
              )
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
      const talent = market.signals.filter(talentFilter);
      body = [
        `**${market.name} — talent / staffing greenlight**`,
        "",
        talent.length > 0
          ? talent
              .map(
                (s) =>
                  `- **${s.title}** (${s.magnitude ?? "—"}${s.asOf ? `, ${s.asOf}` : ""}) — ${s.body}`
              )
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
          "_No nuanceNote seeded — do not underwrite MSA averages as a single asset thesis._",
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
              .map(
                (s) =>
                  `- **${s.title}** (${s.magnitude ?? "—"}${s.asOf ? `, ${s.asOf}` : ""}) — ${s.body}`
              )
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
      market.sourceLabel,
      ...market.signals.map((s) => s.sourceLabel),
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
    include: { assets: true, signals: true },
    orderBy: { name: "asc" },
  });
  const nationalSignals = await prisma.signal.findMany({
    where: { marketId: null },
  });
  const radars = await prisma.radar.findMany({
    include: { findings: { orderBy: { createdAt: "desc" }, take: 3 } },
  });

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
    citationSet.add(m.sourceLabel);
    const revpar = derivedRevpar(m.occupancy, m.adr);
    chunks.push(
      [
        `### ${label}: ${m.name} (slug: ${m.slug})`,
        `Region: ${m.region}`,
        `Summary: ${m.summary}`,
        m.nuanceNote ? `Nuance: ${m.nuanceNote}` : "",
        `Metrics: visitorsM=${m.visitorsM ?? "null"}, roomsK=${m.roomsK ?? "null"}, OCC%=${m.occupancy ?? "null"}, ADR=${m.adr ?? "null"}, RevPAR_derived=${revpar != null ? revpar.toFixed(2) : "null"}, midweekOcc=${m.midweekOcc ?? "null"}, weekendOcc=${m.weekendOcc ?? "null"}`,
        `Source: ${m.sourceLabel}${isIllustrativeSource(m.sourceLabel) ? " [ILLUSTRATIVE — say so]" : ""}`,
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

  return { pack: chunks.join("\n\n"), citations: [...citationSet] };
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
        "Ask the Bungah Capital Intel about the investment landscape in hotels. Name any seeded market (or open a market page → Ask about this market), or ask about the national debt wall, talent / staffing greenlight, or radars. Answers are deterministic from the Capital Graph — decision support, every number cited.",
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
      return {
        content: [
          `**${a.name} vs ${b.name} (seed snapshot)**`,
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
    return {
      content: [
        "**National lodging debt-wall / DY stress (stub)**",
        "",
        debt?.body ?? "No debt signal seeded.",
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
        ...radars.flatMap((r) => r.findings.map((f) => f.sourceLabel))
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
    return {
      content: [
        "**Talent / staffing greenlight**",
        "",
        body,
        "",
        "Implication: pair demand thesis with staffing + GC/MEP capacity before CapEx or refinance greenlight.",
        "",
        footer(),
      ].join("\n"),
      citations: cites(talent?.sourceLabel),
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
