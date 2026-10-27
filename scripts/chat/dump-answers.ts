// QA helper (not shipped): every kept starter through the real deterministic chat, full brief, as JSON on stdout.
process.env.BUNGAH_NO_NEXT_CACHE = "1";
import fs from "node:fs";
(async () => {
  const { installGraphFixture } = await import("./graph-fixture");
  installGraphFixture();
  const { answerChat } = await import("@/lib/chat-llm");
  const S = JSON.parse(fs.readFileSync("src/data/chat-starters.json", "utf8"));
  const plan: { scope: { kind: string; id: string } | null; q: string; range?: string }[] = S.general.map((x: { q: string; range?: string }) => ({ scope: null, ...x }));
  for (const kind of ["market", "reit", "deal"]) for (const [id, list] of Object.entries(S[kind] as Record<string, { q: string; range?: string }[]>)) for (const x of list) plan.push({ scope: { kind, id }, ...x });
  const out = [];
  for (const p of plan) {
    const a = await answerChat(p.q, { scope: p.scope as never, range: (p.range ?? "all") as never });
    const b = a.brief;
    out.push({ scope: p.scope ? `${p.scope.kind}:${p.scope.id}` : "/chat", q: p.q, range: p.range ?? null, status: 200, intent: a.intent, card: { answer: b?.answer, reads: b?.reads, basedOn: b?.basedOn }, detail: { sections: b?.sections ?? [], cited: b?.cited ?? [] } });
  }
  process.stdout.write(JSON.stringify(out));
  process.exit(0);
})();
