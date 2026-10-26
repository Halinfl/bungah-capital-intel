import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { citedOnly, hasPublicCoverage } from "@/lib/format";

export const dynamic = "force-dynamic";

const BASE = "https://bungah.io";
const CORE = ["/", "/markets", "/tuesday-trends", "/tuesday-trends/methodology", "/chat", "/radars", "/sound-money-lodging", "/hard-assets", "/hard-assets/scorecard", "/hard-assets/evidence", "/hard-assets/methodology", "/markets/ledger", "/errata", "/sponsorship-policy", "/podcast", "/pricing", "/trust", "/login", "/signup"];

// Core public pages plus only the markets with public coverage (same rule as /markets).
// Hidden markets are left out here and carry noindex on the page itself.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const markets = await prisma.market.findMany({
    orderBy: { name: "asc" },
    select: {
      slug: true,
      sourceLabel: true,
      updatedAt: true,
      signals: { select: { sourceLabel: true, title: true, body: true, magnitude: true, asOf: true } },
    },
  });
  const covered = markets.filter((m) => hasPublicCoverage(m, citedOnly(m.signals).length));
  return [
    ...CORE.map((p) => ({ url: `${BASE}${p === "/" ? "" : p}`, changeFrequency: "weekly" as const })),
    ...covered.map((m) => ({ url: `${BASE}/markets/${m.slug}`, lastModified: m.updatedAt, changeFrequency: "weekly" as const })),
  ];
}
