import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { DB_TAG } from "@/lib/db-safe";
import { canRunRadars } from "@/lib/radar-access";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { citedOnly, isPlaceholderText } from "@/lib/format";
import { SUPERSEDED_RADAR_SLUGS } from "@/lib/radars-preview";

export async function POST() {
  // Writes findings: signed-in workspaces only (the public page no longer shows the run control).
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to run radars" }, { status: 401 });
  // Role check: signed in is not enough. Only Clerk user IDs listed in RADARS_RUN_USER_IDS (comma-separated,
  // server-only env) may write findings. Deny by default when unset. (Clerk orgRole is user-editable via
  // /api/auth/org, so it is deliberately not trusted here.)
  if (!canRunRadars(userId)) {
    return NextResponse.json({ error: "Your account is not allowed to run radars" }, { status: 403 });
  }
  try {
    const orlando = await prisma.market.findUnique({ where: { slug: "orlando" } });
    const vegas = await prisma.market.findUnique({ where: { slug: "las-vegas" } });
    const radars = await prisma.radar.findMany();
    let count = 0;

    for (const radar of radars) {
      // The old national debt-wall radar is superseded by the code-defined National radar; never refill it.
      if (SUPERSEDED_RADAR_SLUGS.includes(radar.slug)) continue;
      let title = "";
      let summary = "";
      let severity = "info";
      let marketId: string | null = null;
      let sourceLabel = "Bungah Capital Intel radar run";

      if (radar.slug === "orlando-msa-scarcity-watch" && orlando) {
        marketId = orlando.id;
        severity = "watch";
        title = `Radar refresh: Orlando occupancy is ${orlando.occupancy?.toFixed(1)}%: record visitors still don't mean rooms are scarce`;
        summary = `Visitors ${orlando.visitorsM?.toFixed(1)}M / rooms ${orlando.roomsK?.toFixed(1)}k / ADR $${orlando.adr?.toFixed(2)}. MSA averages remain non-scarce; Grande Lakes / Gaylord-class can be.`;
        sourceLabel = orlando.sourceLabel;
      } else if (radar.slug === "vegas-visitation-softness" && vegas) {
        marketId = vegas.id;
        severity = "alert";
        title = `Radar refresh: Vegas visitors ${vegas.visitorsM?.toFixed(1)}M soft; midweek OCC ${vegas.midweekOcc?.toFixed(1)}%`;
        summary = `Total OCC ${vegas.occupancy?.toFixed(1)}% / weekend ${vegas.weekendOcc?.toFixed(1)}%. Watch Hard Rock ~3.6k-key late-2027 return into softer demand.`;
        sourceLabel = vegas.sourceLabel;
      } else if (radar.slug === "national-lodging-debt-wall") {
        // Cited national debt / rate rows only — never placeholder or demo copy.
        const cited = citedOnly(
          await prisma.signal.findMany({
            where: { marketId: null, kind: { in: ["debt", "rates", "cmbs", "cap_rate"] } },
            orderBy: { createdAt: "desc" },
            take: 10,
          })
        );
        const top = cited[0];
        if (!top) continue;
        severity = "info";
        title = `Radar refresh: ${top.title}`;
        summary = `${top.body} Pair refinance greenlight with staffing capacity. Decision support.`;
        sourceLabel = top.sourceLabel;
      } else {
        title = `Radar refresh: ${radar.name}`;
        summary = radar.description;
      }

      if (isPlaceholderText(title, summary, sourceLabel)) continue;
      await prisma.finding.create({
        data: { radarId: radar.id, marketId, title, summary, severity, sourceLabel },
      });
      count += 1;
    }

    if (count > 0) revalidateTag(DB_TAG); // refresh cached pages (src/lib/db-safe.ts) so new findings show
    return NextResponse.json({ ok: true, count });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Radar run error" },
      { status: 500 }
    );
  }
}
