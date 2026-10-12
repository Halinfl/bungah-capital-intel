/**
 * Idempotent loader for the 2026-10-11 Vectra wave-1 demand + Atlas San Diego/Dallas batch.
 *
 *   npx tsx prisma/seed-demand-w1-2026-10-11.ts
 *
 * - Upserts Signal rows by stable id (`w1d-*`, `w1x-*`, `w1-*`). Safe to re-run.
 * - Never deletes or rewrites any other row (unlike prisma/seed.ts, which wipes).
 * - Illustrative seed rows are not touched; chat ranks cited rows first (src/lib/chat.ts).
 * - Resolves markets by slug at run time; aborts before writing if a slug is missing.
 */
import { PrismaClient } from "@prisma/client";
import { DEMAND_W1_2026_10_11 } from "./demand-w1-2026-10-11.data";
import { getMsaRegistryEntry } from "../src/data/msa-registry";

const prisma = new PrismaClient();

async function main() {
  const slugs = [...new Set(DEMAND_W1_2026_10_11.map((s) => s.marketSlug).filter(Boolean))] as string[];
  for (const s of slugs) {
    if (!getMsaRegistryEntry(s)) throw new Error(`Slug not in MSA registry: ${s}`);
  }
  const markets = await prisma.market.findMany({
    where: { slug: { in: slugs } },
    select: { id: true, slug: true },
  });
  const bySlug = new Map(markets.map((m) => [m.slug, m.id]));
  const missing = slugs.filter((s) => !bySlug.has(s));
  if (missing.length) throw new Error(`Markets missing in DB: ${missing.join(", ")}`);

  const counts: Record<string, number> = {};
  for (const s of DEMAND_W1_2026_10_11) {
    const data = {
      marketId: s.marketSlug ? bySlug.get(s.marketSlug)! : null,
      kind: s.kind,
      title: s.title,
      body: s.body,
      magnitude: s.magnitude,
      asOf: s.asOf,
      sourceLabel: s.sourceLabel,
    };
    await prisma.signal.upsert({ where: { id: s.id }, create: { id: s.id, ...data }, update: data });
    const k = s.marketSlug ?? "national";
    counts[k] = (counts[k] ?? 0) + 1;
  }
  console.log(`Upserted ${DEMAND_W1_2026_10_11.length} demand wave-1 / Atlas signals (2026-10-11):`, counts);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
