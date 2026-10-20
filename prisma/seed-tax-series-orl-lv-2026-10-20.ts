/**
 * Idempotent loader: Orlando + Las Vegas hotel-tax collection series (2026-10-20).
 *
 *   npx tsx prisma/seed-tax-series-orl-lv-2026-10-20.ts
 *
 * Upserts by fixed id (tax-<slug>-<yyyymm>-<series>); safe to re-run; never wipes (unlike prisma/seed.ts).
 */
import { PrismaClient, Prisma } from "@prisma/client";
import { TAX_SERIES_ORL_LV_2026_10_20 } from "./tax-series-orl-lv-2026-10-20.data";

const prisma = new PrismaClient();

async function main() {
  const rows = TAX_SERIES_ORL_LV_2026_10_20;
  const slugs = [...new Set(rows.map((s) => s.marketSlug).filter(Boolean))] as string[];
  const markets = await prisma.market.findMany({ where: { slug: { in: slugs } }, select: { id: true, slug: true } });
  const bySlug = new Map(markets.map((m) => [m.slug, m.id]));
  const missing = slugs.filter((s) => !bySlug.has(s));
  if (missing.length) throw new Error(`Markets missing in DB: ${missing.join(", ")}`);
  for (const s of rows) {
    const data = {
      marketId: s.marketSlug ? bySlug.get(s.marketSlug)! : null,
      kind: s.kind,
      title: s.title,
      body: s.body,
      magnitude: s.magnitude,
      asOf: s.asOf,
      sourceLabel: s.sourceLabel,
      sourceUrls: s.sourceUrls ? (s.sourceUrls as Prisma.InputJsonValue) : Prisma.DbNull,
    };
    await prisma.signal.upsert({ where: { id: s.id }, create: { id: s.id, ...data }, update: data });
  }
  console.log(`Upserted ${rows.length} hotel-tax series rows.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
