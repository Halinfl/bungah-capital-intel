import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { cachedQuery } from "@/lib/db-safe";
import { citedOnly, isIndexableMarket, isNoReadSignal } from "@/lib/format";
import { isPrivatePath } from "@/lib/seo";
import { reits } from "@/lib/reits";
import { TT_CAPTURE_DATE } from "@/lib/tuesday-trends";
import reitSnapshot from "@/data/reits/snapshot.json";

export const dynamic = "force-dynamic";

const BASE = "https://bungah.io";
const CORE = ["/", "/markets", "/tuesday-trends", "/tuesday-trends/methodology", "/chat", "/radars", "/sound-money-lodging", "/hard-assets", "/hard-assets/scorecard", "/hard-assets/evidence", "/hard-assets/methodology", "/markets/ledger", "/errata", "/sponsorship-policy", "/podcast", "/trust", "/login", "/signup"];

// Core public pages plus only the indexable markets (same rule as the market page robots tag).
// Hidden markets are left out here and carry noindex on the page itself.
// Sign-in / account paths in CORE are dropped by isPrivatePath (see src/lib/seo.ts).
const REIT_PAGES = ["/reits", "/reits/board", "/reits/methodology"];

/** Real content dates from the static data the pages render; pages without one get no lastmod. */
// The REIT snapshot "built" stamp has no zone, so only its date is used.
const REITS_BUILT = reitSnapshot.built.slice(0, 10);
const LASTMOD: Record<string, string> = {
  "/tuesday-trends": TT_CAPTURE_DATE,
  "/reits": REITS_BUILT,
  "/reits/board": REITS_BUILT,
};

/** Latest of the market row update and the newest signal the page shows. */
type SitemapSignal = { sourceLabel: string | null; title: string; body: string; magnitude: string | null; asOf: string | null; createdAt: Date };
function marketLastmod(m: { updatedAt: Date; signals: SitemapSignal[] }): Date {
  const shown = citedOnly(m.signals).filter((s) => !isNoReadSignal(s));
  return shown.reduce((d, s) => (s.createdAt > d ? s.createdAt : d), m.updatedAt);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // DB outage: still serve the static pages (markets list from cache, or omitted).
  const { data: markets } = await cachedQuery(["sitemap-markets"], () =>
    prisma.market.findMany({
      orderBy: { name: "asc" },
      select: {
        slug: true,
        sourceLabel: true,
        updatedAt: true,
        signals: { select: { sourceLabel: true, title: true, body: true, magnitude: true, asOf: true, createdAt: true } },
      },
    }), []);
  const indexable = markets.filter(isIndexableMarket);
  const pages = [...CORE, ...REIT_PAGES].filter((p) => !isPrivatePath(p));
  return [
    ...pages.map((p) => ({
      url: `${BASE}${p === "/" ? "" : p}`,
      ...(LASTMOD[p] ? { lastModified: LASTMOD[p] } : {}),
      changeFrequency: "weekly" as const,
    })),
    ...indexable.map((m) => ({ url: `${BASE}/markets/${m.slug}`, lastModified: marketLastmod(m), changeFrequency: "weekly" as const })),
    ...reits().map((r) => ({
      url: `${BASE}/reits/${r.ticker.toLowerCase()}`,
      lastModified: REITS_BUILT,
      changeFrequency: "weekly" as const,
    })),
  ];
}
