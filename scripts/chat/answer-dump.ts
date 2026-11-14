/** Prints the first-turn answer (headline, key reads, sources) for a few questions on the graph dump. Read-only. */
export {};
process.env.BUNGAH_NO_NEXT_CACHE = "1";
process.env.BUNGAH_USE_LLM = "";
async function main() {
  const { installGraphFixture } = await import("./graph-fixture");
  installGraphFixture();
  const { answerChat } = await import("@/lib/chat-llm");
  const { resolveFollowUp } = await import("@/lib/chat-followup");
  const qs = (process.env.DUMP_QS ? JSON.parse(process.env.DUMP_QS) : [
    "What's the RevPAR and occupancy read for Nashville?",
    "What's the RevPAR and occupancy read for Dallas?",
    "What's the national hotel debt and refinancing picture?",
    "What's the hotel debt and refinancing picture in Chicago?",
    "What's the national RevPAR and occupancy picture?",
  ]) as string[];
  for (const q of qs) {
    const rt = await resolveFollowUp({ question: q, scope: null, marketSlug: null, prev: null });
    const a = await answerChat(q, { marketSlug: rt.marketSlug, range: "all", scope: null, intent: rt.intent });
    const b = a.brief as { answer?: string; reads?: { text: string; source?: { label?: string } }[] } | null | undefined;
    console.log(`## ${q}\n- answer: ${b?.answer ?? a.content.slice(0, 300)}`);
    for (const r of b?.reads ?? []) console.log(`- read: ${r.text} [${r.source?.label ?? ""}]`);
    console.log(`- sources: ${(a.sources ?? []).map((s: { label?: string; title?: string }) => s.label ?? s.title).join(" | ")}\n`);
  }
}
main().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
