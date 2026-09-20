import { prisma } from "./prisma";

export type ChatAnswer = {
  content: string;
  citations: string[];
};

function cites(...labels: (string | null | undefined)[]): string[] {
  return [...new Set(labels.filter(Boolean) as string[])];
}

export async function answerFromGraph(question: string): Promise<ChatAnswer> {
  const q = question.toLowerCase().trim();
  const markets = await prisma.market.findMany({
    include: { assets: true, signals: true },
    orderBy: { name: "asc" },
  });
  const orlando = markets.find((m) => m.slug === "orlando");
  const vegas = markets.find((m) => m.slug === "las-vegas");
  const nationalSignals = await prisma.signal.findMany({
    where: { marketId: null },
  });
  const radars = await prisma.radar.findMany({
    include: { findings: { orderBy: { createdAt: "desc" }, take: 3 } },
  });

  if (!q) {
    return {
      content:
        "Ask about Orlando, Las Vegas, scarcity vs impact, debt wall, talent greenlight, or radars. Answers are deterministic from the Capital Graph — propose-only, every number cited.",
      citations: [],
    };
  }

  if (
    q.includes("which orlando") ||
    (q.includes("orlando") && (q.includes("scarce") || q.includes("scarcity"))) ||
    q.includes("impact") && q.includes("scarci")
  ) {
    return {
      content: [
        "**Which Orlando — impact ≠ scarcity.**",
        "",
        orlando
          ? `MSA snapshot: **${orlando.visitorsM?.toFixed(1)}M** visitors, **${orlando.roomsK?.toFixed(1)}k** rooms, OCC **${orlando.occupancy?.toFixed(1)}%**, ADR **$${orlando.adr?.toFixed(2)}**.`
          : "",
        "",
        orlando?.nuanceNote ?? "",
        "",
        "Assets on the scarcity layer (seed):",
        ...(orlando?.assets
          .filter((a) => a.submarket?.toLowerCase().includes("grande") || a.name.toLowerCase().includes("gaylord"))
          .map((a) => `- **${a.name}** (${a.keys ?? "?"} keys, ${a.submarket}) — ${a.notes}`) ?? []),
        "",
        "_Propose-only:_ never underwrite “Orlando is scarce” from MSA averages alone.",
      ]
        .filter(Boolean)
        .join("\n"),
      citations: cites(
        orlando?.sourceLabel,
        orlando?.assets[0]?.sourceLabel,
        orlando?.signals.find((s) => s.kind === "nuance")?.sourceLabel
      ),
    };
  }

  if (q.includes("orlando") || q.includes("grande lakes") || q.includes("gaylord")) {
    return {
      content: [
        `**${orlando?.name ?? "Orlando"}**`,
        "",
        orlando?.summary ?? "",
        "",
        `| Metric | Value |`,
        `| --- | --- |`,
        `| Visitors | ${orlando?.visitorsM?.toFixed(1)}M |`,
        `| Rooms | ${orlando?.roomsK?.toFixed(1)}k |`,
        `| OCC | ${orlando?.occupancy?.toFixed(1)}% |`,
        `| ADR | $${orlando?.adr?.toFixed(2)} |`,
        "",
        orlando?.nuanceNote ?? "",
        "",
        "Key signals:",
        ...(orlando?.signals.map((s) => `- **${s.title}** (${s.magnitude ?? "—"}) — ${s.body}`) ?? []),
      ].join("\n"),
      citations: cites(
        orlando?.sourceLabel,
        ...(orlando?.signals.map((s) => s.sourceLabel) ?? [])
      ),
    };
  }

  if (q.includes("vegas") || q.includes("las vegas") || q.includes("lvcva") || q.includes("hard rock")) {
    return {
      content: [
        `**${vegas?.name ?? "Las Vegas"}**`,
        "",
        vegas?.summary ?? "",
        "",
        `| Metric | Value |`,
        `| --- | --- |`,
        `| Visitors | ${vegas?.visitorsM?.toFixed(1)}M (soft) |`,
        `| Rooms | ${vegas?.roomsK?.toFixed(1)}k |`,
        `| OCC | ${vegas?.occupancy?.toFixed(1)}% |`,
        `| Midweek OCC | ${vegas?.midweekOcc?.toFixed(1)}% |`,
        `| Weekend OCC | ${vegas?.weekendOcc?.toFixed(1)}% |`,
        `| ADR | $${vegas?.adr?.toFixed(2)} |`,
        "",
        vegas?.nuanceNote ?? "",
        "",
        "Key signals:",
        ...(vegas?.signals.map((s) => `- **${s.title}** (${s.magnitude ?? "—"}) — ${s.body}`) ?? []),
      ].join("\n"),
      citations: cites(
        vegas?.sourceLabel,
        ...(vegas?.signals.map((s) => s.sourceLabel) ?? [])
      ),
    };
  }

  if (q.includes("debt") || q.includes("cmbs") || q.includes("maturity") || q.includes("refinance") || q.includes("dy")) {
    const debt = nationalSignals.find((s) => s.kind === "debt");
    return {
      content: [
        "**National lodging debt-wall / DY stress (stub)**",
        "",
        debt?.body ?? "No debt signal seeded.",
        "",
        "_Propose-only:_ Bungah Capital Intel surfaces refinance and DY stress for human decision — no auto capital actions.",
        "",
        radars
          .filter((r) => r.slug.includes("debt"))
          .flatMap((r) => r.findings.map((f) => `- Finding: **${f.title}** — ${f.summary}`))
          .join("\n"),
      ].join("\n"),
      citations: cites(debt?.sourceLabel, ...radars.flatMap((r) => r.findings.map((f) => f.sourceLabel))),
    };
  }

  if (q.includes("talent") || q.includes("staff") || q.includes("greenlight") || q.includes("crew")) {
    const talent = nationalSignals.find((s) => s.kind === "talent");
    return {
      content: [
        "**Talent / staffing greenlight**",
        "",
        talent?.body ?? "No talent signal seeded.",
        "",
        "Implication: pair demand thesis with staffing + GC/MEP capacity before CapEx or refinance greenlight.",
      ].join("\n"),
      citations: cites(talent?.sourceLabel),
    };
  }

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
            top ? `Latest finding (${top.severity}): **${top.title}** — ${top.summary}` : "_No findings yet — run `npm run radars:run`._",
          ].join("\n");
        }),
      ].join("\n\n"),
      citations: cites(...radars.flatMap((r) => r.findings.map((f) => f.sourceLabel))),
    };
  }

  if (q.includes("compare") || (q.includes("orlando") && q.includes("vegas")) || q.includes("both market")) {
    return {
      content: [
        "**Orlando vs Las Vegas (seed snapshot)**",
        "",
        `| | Orlando | Las Vegas |`,
        `| --- | --- | --- |`,
        `| Visitors | ${orlando?.visitorsM?.toFixed(1)}M | ${vegas?.visitorsM?.toFixed(1)}M soft |`,
        `| Rooms | ${orlando?.roomsK?.toFixed(1)}k | ${vegas?.roomsK?.toFixed(1)}k |`,
        `| OCC | ${orlando?.occupancy?.toFixed(1)}% | ${vegas?.occupancy?.toFixed(1)}% (midweek ${vegas?.midweekOcc?.toFixed(1)}%) |`,
        `| ADR | $${orlando?.adr?.toFixed(2)} | $${vegas?.adr?.toFixed(2)} |`,
        "",
        "**Read:** Orlando = impact≠scarcity / which-Orlando. Vegas = visitation softness + midweek lag + 2027 Hard Rock supply return.",
      ].join("\n"),
      citations: cites(orlando?.sourceLabel, vegas?.sourceLabel),
    };
  }

  // Default: list graph
  return {
    content: [
      "I answer from the **Bungah Capital Intel** Capital Graph (deterministic, cited, propose-only).",
      "",
      "Try asking:",
      "- Orlando occupancy / which Orlando / scarcity",
      "- Vegas visitation softness / midweek OCC",
      "- National debt wall / CMBS / DY ≤8%",
      "- Talent greenlight",
      "- What are the radars watching?",
      "",
      `Markets in graph: ${markets.map((m) => m.name).join("; ") || "none — run db:seed"}.`,
    ].join("\n"),
    citations: cites(...markets.map((m) => m.sourceLabel)),
  };
}
