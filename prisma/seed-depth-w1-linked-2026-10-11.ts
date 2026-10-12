/**
 * Idempotent loader: wave-1 depth rows with clickable sources (2026-10-11).
 *
 *   npx tsx prisma/seed-depth-w1-linked-2026-10-11.ts
 *
 * - Upserts by stable id: Vectra demand (w1d/w1x/w1-), Herald talent (w1t), Atlas supply/pipeline (w1s/w1p),
 *   Ledger capital (w1c), incl. `sourceUrls`. Safe to re-run; never wipes (unlike prisma/seed.ts).
 * - Backfills `sourceUrls` on already-loaded cited rows by fixed id (no other column touched).
 * - Applies verified links (SOURCE_URLS_VERIFIED_2026_10_11) to previously unlinked cited rows.
 * - Deletes only the explicitly retired Atlas summary rows superseded by full-file rows (RETIRED_2026_10_11).
 * - Illustrative seed rows are never touched.
 */
import { PrismaClient, Prisma } from "@prisma/client";
import { DEMAND_W1_2026_10_11 } from "./demand-w1-2026-10-11.data";
import { DEPTH_W1_TSP_2026_10_11 } from "./depth-w1-tsp-2026-10-11.data";
import { CAPITAL_W1_2026_10_11 } from "./capital-w1-2026-10-11.data";
import { SOURCE_URLS_BACKFILL_2026_10_11 } from "./source-urls-backfill-2026-10-11.data";
import { SOURCE_URLS_VERIFIED_2026_10_11 } from "./source-urls-verified-2026-10-11.data";
import { RETIRED_2026_10_11 } from "./retired-2026-10-11.data";
import { WORLD_CUP_ATLAS_2026_10_11 } from "./world-cup-atlas-2026-10-11.data";

const prisma = new PrismaClient();

async function main() {
  const rows = [
    ...DEMAND_W1_2026_10_11,
    ...DEPTH_W1_TSP_2026_10_11,
    ...CAPITAL_W1_2026_10_11,
    ...WORLD_CUP_ATLAS_2026_10_11.filter((r) => r.id === "wc2026-new-york-city"),
  ];
  const slugs = [...new Set(rows.map((s) => s.marketSlug).filter(Boolean))] as string[];
  const markets = await prisma.market.findMany({ where: { slug: { in: slugs } }, select: { id: true, slug: true } });
  const bySlug = new Map(markets.map((m) => [m.slug, m.id]));
  const missing = slugs.filter((s) => !bySlug.has(s));
  if (missing.length) throw new Error(`Markets missing in DB: ${missing.join(", ")}`);
  for (const s of rows) {
    const urls = "sourceUrls" in s && s.sourceUrls ? (s.sourceUrls as Prisma.InputJsonValue) : Prisma.DbNull;
    const data = {
      marketId: s.marketSlug ? bySlug.get(s.marketSlug)! : null,
      kind: s.kind,
      title: s.title,
      body: s.body,
      magnitude: s.magnitude,
      asOf: s.asOf,
      sourceLabel: s.sourceLabel,
      sourceUrls: urls,
    };
    await prisma.signal.upsert({ where: { id: s.id }, create: { id: s.id, ...data }, update: data });
  }
  let backfilled = 0;
  for (const b of SOURCE_URLS_BACKFILL_2026_10_11) {
    const r = await prisma.signal.updateMany({
      where: { id: b.id, NOT: { sourceLabel: { contains: "illustrative", mode: "insensitive" } } },
      data: { sourceUrls: b.sourceUrls as Prisma.InputJsonValue },
    });
    backfilled += r.count;
  }
  // Verified links for previously unlinked cited rows: fixed id first, exact title as fallback (baseline rows).
  let verified = 0;
  for (const v of SOURCE_URLS_VERIFIED_2026_10_11) {
    const notSeed = { NOT: { sourceLabel: { contains: "illustrative", mode: "insensitive" as const } } };
    let r = await prisma.signal.updateMany({ where: { id: v.id, ...notSeed }, data: { sourceUrls: v.sourceUrls as Prisma.InputJsonValue } });
    if (!r.count) r = await prisma.signal.updateMany({ where: { title: v.title, ...notSeed }, data: { sourceUrls: v.sourceUrls as Prisma.InputJsonValue } });
    verified += r.count;
  }
  const del = await prisma.signal.deleteMany({ where: { id: { in: Object.keys(RETIRED_2026_10_11) } } });
  console.log(`Upserted ${rows.length}; backfilled sourceUrls on ${backfilled}; verified links on ${verified}; retired ${del.count}.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
