/**
 * Offline CPU estimate per deterministic chat answer (no network, no DB: nightly-dump fixture).
 * Run: BUNGAH_GRAPH_FIXTURE=/workspace/backups/bungah-db/latest BUNGAH_NO_NEXT_CACHE=1 npx tsx scripts/chat/cpu-per-answer.ts
 * Measures process.cpuUsage() around answerChat. First call per process includes graph load/parse
 * (the cold path); later calls reuse the in-process memo (the warm-instance path). Box CPU != Vercel vCPU,
 * so treat as an order-of-magnitude input to the cost math, not a billing figure.
 */
async function main() {
  const { installGraphFixture } = await import("./graph-fixture");
  installGraphFixture();
  const { answerChat } = await import("@/lib/chat-llm");
  const qs: [string, any][] = [
    ["What's the RevPAR and occupancy read for Orlando?", {}],
    ["How much new supply is coming in Nashville?", {}],
    ["What's the national hotel debt and refinancing picture?", {}],
    ["How has RevPAR moved here over the last 12 months?", { scope: { kind: "market", id: "chicago" }, range: "12m" }],
    ["Is labor a risk to the thesis here?", { scope: { kind: "market", id: "chicago" } }],
    ["What did they guide on the last call?", { scope: { kind: "reit", id: "HST" } }],
    ["Where are they putting capital?", { scope: { kind: "reit", id: "APLE" } }],
    ["What did the buyer pay per key, and how does that compare?", { scope: { kind: "deal", id: "grande-lakes-orlando" } }],
    ["What's demand doing in Miami?", {}],
    ["How is Chicago CBD doing?", {}],
  ];
  const cpu = (a: NodeJS.CpuUsage) => (a.user + a.system) / 1000;
  const rows: { q: string; cpuMs: number; wallMs: number }[] = [];
  for (let round = 0; round < 3; round++) {
    for (const [q, o] of qs) {
      const c0 = process.cpuUsage(); const t0 = performance.now();
      await answerChat(q, o);
      rows.push({ q: `${round}|${q}`, cpuMs: Math.round(cpu(process.cpuUsage(c0))), wallMs: Math.round(performance.now() - t0) });
    }
  }
  const warm = rows.slice(1).map((r) => r.cpuMs).sort((a, b) => a - b);
  const pct = (p: number) => warm[Math.min(warm.length - 1, Math.floor((p / 100) * warm.length))];
  console.log(JSON.stringify({ cold_first_call: rows[0], warm_n: warm.length, warm_cpu_ms_p50: pct(50), warm_cpu_ms_p95: pct(95), warm_cpu_ms_max: warm[warm.length - 1], rows }, null, 1));
}
main().then(() => process.exit(0));
