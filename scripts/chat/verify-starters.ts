/**
 * Build-time starter check ("Ask about this"). For every market, REIT and graded sale page, and for plain
 * /chat, runs each candidate starter through the real deterministic chat (answerChat, no model) and keeps it
 * only if it routes to the expected intent, returns a summary card with at least 1 key read for that item,
 * and the headline or a key read is on the starter's topic (a `lead` topic must be in the headline itself), it is not a "no dated, cited … on file" card, every key read is on topic where the candidate says so, and it does not open the same card (same headline or same key reads) as a starter already kept for that item. Failures are DROPPED and listed. Writes src/data/chat-starters.json, which the chat page reads.
 *
 * Read-only: graph reads only (no thread / question-log writes). Modes:
 *   BUNGAH_GRAPH_FIXTURE=<nightly dump dir>  read the graph from a dump (box: no Postgres egress)
 *   (default)                                 read the graph from DATABASE_URL (Vercel build)
 * If the graph can't be read: locally keep the committed file (warn); on Vercel fail the build unless
 * the committed file was verified (verifiedAt set) — never ship unverified starters.
 * Exit 1 if any item ends up with zero starters while candidates exist and STARTERS_STRICT=1.
 */
process.env.BUNGAH_NO_NEXT_CACHE = "1";
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "src/data/chat-starters.json");

async function main() {
  const { installGraphFixture } = await import("./graph-fixture");
  const fixture = installGraphFixture();
  const { answerChat } = await import("@/lib/chat-llm");
  const { sameFigures } = await import("@/lib/chat-brief");
  const { ITEM_CANDIDATES, GENERAL_CANDIDATES } = await import("@/lib/chat-starters");
  const { retrieveGraphContext } = await import("@/lib/chat");
  const { reits } = await import("@/lib/reits");
  const { sales } = await import("@/lib/deals");
  type Scope = import("@/lib/chat-scope").ChatScope;
  type Cand = import("@/lib/chat-starters").StarterCandidate;

  let marketSlugs: string[];
  const labels: Record<string, string> = {};
  try {
    const ctx = await retrieveGraphContext("markets");
    marketSlugs = ctx.markets.map((m) => m.slug);
    const { shortName } = await import("@/lib/chat-brief-build");
    for (const m of ctx.markets) labels[m.slug] = shortName(m);
    if (!marketSlugs.length) throw new Error("no markets");
  } catch (e) {
    const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : null;
    const msg = `[verify-starters] graph unavailable (${e instanceof Error ? e.message : e})`;
    if (prev?.verifiedAt) {
      console.warn(`${msg}; keeping committed starters verified ${prev.verifiedAt} (${prev.basis}).`);
      process.exit(0);
    }
    console.error(`${msg}; no verified starters on file. Failing.`);
    process.exit(1);
  }

  const dropped: { scope: string; q: string; reason: string }[] = [];
  /** A kept starter's card, for the duplicate check: its headline and the set of its key reads. */
  type Card = { q: string; head: string; reads: Set<string>; points: string[] };
  // The headline minus its "<Market> debt: " / "<Market>: " prefix: the topic is checked on what it says.
  const body = (head: string) => head.replace(/^[^:]{1,60}?(\s(supply|debt|labor))?:\s+/, "");
  const NO_FIGURE = /no dated, cited .* on file|^Limited recent data/i;
  async function check(c: Cand, scope: Scope | null, kept: Card[] = []): Promise<boolean> {
    const where = scope ? `${scope.kind}:${scope.id}` : "general";
    try {
      const a = await answerChat(c.q, { scope, range: c.range ?? "all" });
      const reads = a.brief?.reads ?? [];
      const head = a.brief?.answer ?? "";
      const readTexts = reads.map((r) => r.text);
      const readKeys = new Set(reads.map((r) => `${r.text}\u0000${r.source.url ?? r.source.label}`));
      // Topic: the headline's own words AND at least one key read (a topic word in a "no figure" line is not content).
      const headOn = c.topic.test(body(head));
      const readOn = readTexts.some((t) => (c.readTopic ?? c.topic).test(t));
      const offRead = c.everyRead ? readTexts.find((t) => !c.everyRead!.test(t)) : undefined;
      const leads = (!c.lead || c.lead.test(head)) && !(c.leadNot && c.leadNot.test(head));
      // Same card: same headline, or the same key reads (2+ shared, or identical sets), whatever the order.
      // Market cards also by content: 2+ of this card's points (headline + reads) restate points of a kept card (same text or the same figures).
      const shared = (k: Card) => [...readKeys].filter((x) => k.reads.has(x)).length;
      const points = [body(head), ...readTexts];
      const restate = (x: string, y: string) => x === y || sameFigures({ text: x } as never, { text: y } as never);
      const overlap = (k: Card) => points.filter((x) => k.points.some((y) => restate(x, y))).length;
      const dup = kept.find((k) => k.head === head || shared(k) >= 2 || (shared(k) === readKeys.size && readKeys.size === k.reads.size) || (scope?.kind === "market" && overlap(k) >= 2));
      const reason = !a.brief
        ? "no summary card"
        : !reads.length
          ? "0 key reads"
          : NO_FIGURE.test(head)
            ? `no-figure card ("${head.slice(0, 70)}")`
            : !c.expect.includes(a.intent as never)
              ? `intent ${a.intent}`
              : !headOn || !readOn
                ? `off-topic card ("${head.slice(0, 70)}"${headOn ? "; no key read on topic" : ""})`
                : offRead
                  ? `off-topic key read ("${offRead.slice(0, 70)}")`
                  : !leads
                    ? `does not lead with the topic ("${head.slice(0, 70)}")`
                    : dup
                      ? `same card as "${dup.q}"`
                      : null;
      if (reason) dropped.push({ scope: where, q: c.q, reason });
      else kept.push({ q: c.q, head, reads: readKeys, points });
      return !reason;
    } catch (e) {
      dropped.push({ scope: where, q: c.q, reason: `error ${e instanceof Error ? e.message : e}` });
      return false;
    }
  }
  const topicDrops = () => dropped.filter((d) => /^(off-topic|does not lead|same card|no-figure)/.test(d.reason)).length;
  const strip = (c: Cand) => (c.range ? { q: c.q, range: c.range } : { q: c.q });
  const table = async (kind: Scope["kind"], ids: string[]) => {
    const out: Record<string, { q: string; range?: string }[]> = {};
    for (const id of ids) {
      const keep: { q: string; range?: string }[] = [];
      const cards: Card[] = []; // two starters must not open the same card
      for (const c of ITEM_CANDIDATES[kind]) {
        if (keep.length >= 4) break;
        const alts = c.altOf ? [c.altOf].flat() : [];
        if (alts.some((q) => keep.some((k) => k.q === q))) continue;
        if (await check(c, { kind, id }, cards)) keep.push(strip(c));
      }
      out[id] = keep.slice(0, 4);
    }
    return out;
  };
  const t0 = Date.now();
  const market = await table("market", marketSlugs);
  const reit = await table("reit", reits().map((r) => r.ticker.toUpperCase()));
  const deal = await table("deal", sales().map((s) => s.slug));
  const general = [];
  for (const g of GENERAL_CANDIDATES) {
    for (const c of g.options) if (await check(c, null)) { general.push(strip(c)); break; }
  }
  const result = {
    verifiedAt: new Date().toISOString(),
    basis: fixture ? `graph dump ${path.basename(fs.realpathSync(process.env.BUNGAH_GRAPH_FIXTURE!))}` : "live graph (DATABASE_URL, read-only)",
    marketLabels: labels,
    general,
    market,
    reit,
    deal,
    dropped,
  };
  fs.writeFileSync(OUT, JSON.stringify(result, null, 1) + "\n");
  const count = (t: Record<string, unknown[]>) => Object.values(t).reduce((n, v) => n + v.length, 0);
  const empty = [...Object.entries(market), ...Object.entries(reit), ...Object.entries(deal)].filter(([, v]) => !v.length).map(([k]) => k);
  console.log(
    `[verify-starters] ${((Date.now() - t0) / 1000).toFixed(1)}s · general ${general.length}/4 · market ${count(market)} across ${marketSlugs.length} · reit ${count(reit)} across ${Object.keys(reit).length} · deal ${count(deal)} across ${Object.keys(deal).length} · dropped ${dropped.length} (${topicDrops()} by the topic/lead/duplicate/no-figure check) · items with no starters: ${empty.length ? empty.join(", ") : "none"}`
  );
  if (process.env.STARTERS_STRICT === "1" && (general.length < 4 || empty.length)) process.exit(1);
  process.exit(0);
}
main().catch((e) => {
  console.error("[verify-starters] failed", e);
  process.exit(1);
});
