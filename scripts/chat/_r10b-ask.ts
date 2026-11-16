import { installGraphFixture } from "./graph-fixture";
async function main() {
  installGraphFixture();
  const { answerChat } = await import("@/lib/chat-llm");
  const { parseScope } = await import("@/lib/chat-scope");
  const [q, scope] = [process.argv[2], process.argv[3] ?? null];
  const a: any = await answerChat(q, { scope: parseScope(scope), range: "all", noLlm: true } as any);
  const b = a.brief || {};
  console.log(a.mode, a.intent, "\nA:", b.answer || a.content?.slice(0, 300));
  for (const l of b.leadSources || []) console.log(" L:", l.text, "|", l.url, "|", l.period);
  for (const r of b.reads || []) console.log(" R:", r.text, "|", r.source?.url);
}
main();
