/**
 * Batch 1 data-change probe: builds first-turn cards for a list of questions on ONE graph dump and prints
 * {question, range, marketSlug, intent, hash, dataTo} as JSON, so two dumps can be compared for a real
 * same market / topic / window case whose cited span ends later. Read-only.
 * Run: BUNGAH_GRAPH_FIXTURE=<dump> npx tsx scripts/chat/span-probe.ts > out.json
 * PROBE_QS='["q1","q2"]' limits the questions. PROBE_HOLDBACK_IDS=id1,id2 builds the cards as if those signal rows
 * were not on file yet (the graph before they were added); used by test-newer-data.ts to construct the
 * "Newer cited data" case from real rows. Never writes anything.
 */
export {};
process.env.BUNGAH_NO_NEXT_CACHE = "1";
process.env.BUNGAH_USE_LLM = "";
async function main() {
  const { installGraphFixture } = await import("./graph-fixture");
  installGraphFixture();
  const hold = new Set((process.env.PROBE_HOLDBACK_IDS ?? "").split(",").filter(Boolean));
  if (hold.size) {
    const { prisma } = await import("@/lib/prisma");
    const p = prisma as unknown as Record<string, Record<string, (...a: unknown[]) => Promise<unknown>>>;
    const orig = p.market.findMany;
    p.market.findMany = async (...a: unknown[]) =>
      ((await orig(...a)) as { signals: { id: string }[] }[]).map((m) => ({ ...m, signals: m.signals.filter((s) => !hold.has(s.id)) }));
  }
  const { answerChat } = await import("@/lib/chat-llm");
  const { resolveFollowUp, answerHash } = await import("@/lib/chat-followup");
  const { retrieveGraphContext } = await import("@/lib/chat");
  const { shortName } = await import("@/lib/chat-brief-build");
  const markets = (await retrieveGraphContext("markets")).markets;
  const qs: string[] = ["What's the national hotel debt and refinancing picture?", "What's the national RevPAR and occupancy picture?", "What's the national hotel labor and staffing picture?"];
  for (const m of markets) {
    const n = shortName(m);
    qs.push(`What's the RevPAR and occupancy read for ${n}?`, `What's the hotel supply pipeline in ${n}?`, `What's driving hotel demand in ${n}?`, `What's the hotel debt and refinancing picture in ${n}?`);
  }
  const only = process.env.PROBE_QS ? (JSON.parse(process.env.PROBE_QS) as string[]) : null;
  const out = [];
  for (const q of only ?? qs) for (const range of ["all", "12m"] as const) {
    const rt = await resolveFollowUp({ question: q, scope: null, marketSlug: null, prev: null });
    const a = await answerChat(q, { marketSlug: rt.marketSlug, range, scope: null, intent: rt.intent });
    const b = a.brief as { span?: { to?: string | null } } | null | undefined;
    out.push({ q, range, marketSlug: a.marketSlug ?? rt.marketSlug, intent: a.intent ?? null, hash: answerHash({ ...a, marketSlug: a.marketSlug ?? rt.marketSlug }), dataTo: b?.span?.to ?? null });
  }
  process.stdout.write(JSON.stringify(out));
}
main().catch((e) => { console.error(e); process.exit(1); });
