/**
 * Follow-up test (Eric, Nov 1, 2026): a follow-up must never return the card already on screen.
 *
 * Runs scripted turns through the same steps as /api/chat (resolveFollowUp → answerChat → applyNoRepeat), sending
 * `prev` exactly as ChatClient does. Deterministic, no model, read-only (graph reads only, no log writes).
 *   pairs:  a scoped starter, then a reworded follow-up; a starter, then "how does that compare to last year?"
 *           (scoped and unscoped), for Nashville and every market whose RevPAR starter is on offer
 *   rules:  the follow-up is never the starter's card verbatim; "compare to last year" keeps the market and is
 *           never "name two markets"; a no-repeat reply has 2–3 chips and every chip runs a real, different card;
 *           a follow-up naming another market (or an uncovered place) does not inherit; prev is validated.
 * Run: BUNGAH_GRAPH_FIXTURE=/workspace/backups/bungah-db/latest npx tsx scripts/chat/test-followup.ts [--verbose]
 *      (without the fixture it reads the graph from DATABASE_URL, read-only)
 */
export {};
process.env.BUNGAH_NO_NEXT_CACHE = "1";
process.env.BUNGAH_USE_LLM = "";

type Scope = import("@/lib/chat-scope").ChatScope;
type Prev = import("@/lib/chat-followup").Prev;
type Turn = { q: string; content: string; head: string; intent: string | null; marketSlug: string | null; hash: string; repeat: boolean; followUps?: import("@/lib/chat-followup").FollowUpChip[]; prevOut: Prev };

const verbose = process.argv.includes("--verbose");

async function main() {
  const { installGraphFixture } = await import("./graph-fixture");
  installGraphFixture();
  const { answerChat } = await import("@/lib/chat-llm");
  const { applyNoRepeat, parsePrev, resolveFollowUp, NO_REPEAT_LINE, PREV_MAX_QUESTION } = await import("@/lib/chat-followup");
  const { retrieveGraphContext } = await import("@/lib/chat");
  const { shortName } = await import("@/lib/chat-brief-build");
  const starters = (await import("@/data/chat-starters.json")).default as unknown as { market: Record<string, { q: string; range?: "all" | "90d" | "12m" }[]> };

  /** One /api/chat turn, as the route runs it (prev round-trips through parsePrev like a JSON body). */
  async function ask(q: string, scope: Scope | null, prev: Prev | null, range: "all" | "90d" | "12m" = "all"): Promise<Turn> {
    const p = parsePrev(prev ? JSON.parse(JSON.stringify(prev)) : undefined);
    const route = await resolveFollowUp({ question: q, scope, marketSlug: scope?.kind === "market" ? scope.id : null, prev: p });
    const built = await answerChat(q, { marketSlug: route.marketSlug, range, scope, intent: route.intent });
    const a = { ...built, marketSlug: built.marketSlug ?? route.marketSlug };
    const nr = await applyNoRepeat(a, { prev: p, question: q, range });
    const brief = (nr.answer as { brief?: { answer?: string } | null }).brief;
    return {
      q,
      content: nr.answer.content,
      head: brief?.answer ?? nr.answer.content.split("\n")[0],
      intent: nr.answer.intent ?? null,
      marketSlug: nr.answer.marketSlug,
      hash: nr.hash,
      repeat: nr.repeat,
      followUps: nr.followUps,
      prevOut: { question: q, intent: (nr.answer.intent as Prev["intent"]) ?? null, marketSlug: nr.answer.marketSlug, answerHash: nr.hash },
    };
  }

  const fails: string[] = [];
  let checks = 0;
  const check = (ok: boolean, msg: string) => {
    checks++;
    if (!ok) fails.push(msg);
  };
  const show = (label: string, t: Turn) => {
    if (verbose) console.log(`  ${label}: ${JSON.stringify(t.q)} → [${t.intent} · ${t.marketSlug ?? "-"} · ${t.hash}${t.repeat ? " · NO-REPEAT" : ""}] ${t.head.slice(0, 150)}${t.followUps ? `\n     chips: ${t.followUps.map((c) => `${c.label}${c.range ? ` (${c.range})` : ""}`).join(" | ")}` : ""}`);
  };
  const TWO_MARKETS = /name two (covered )?markets|two markets/i;

  /** A follow-up after `first`: never the same card; a no-repeat reply carries 2–3 working chips. */
  async function pair(label: string, scope: Scope | null, first: string, follow: string, wantMarket: string, firstRange: "all" | "90d" | "12m" = "all") {
    const a = await ask(first, scope, null, firstRange);
    const b = await ask(follow, scope, a.prevOut);
    show(`${label} starter`, a);
    show(`${label} follow-up`, b);
    check(b.content !== a.content, `${label}: follow-up ${JSON.stringify(follow)} returned the starter's card verbatim`);
    check(b.repeat || b.hash !== a.hash, `${label}: follow-up returned the same card (same headline figures and key reads) again`);
    check(b.marketSlug === wantMarket, `${label}: follow-up market ${b.marketSlug} (want ${wantMarket})`);
    check(!TWO_MARKETS.test(b.content), `${label}: follow-up asked for two markets`);
    if (b.repeat) {
      check(b.content === NO_REPEAT_LINE, `${label}: no-repeat reply is not the one line`);
      const chips = b.followUps ?? [];
      check(chips.length >= 2 && chips.length <= 3, `${label}: ${chips.length} chips (want 2–3)`);
      check(!chips.some((c) => /\b(neo|grok|openai|anthropic|vercel|neon|costar|str\b|smith travel)\b/i.test(`${c.label} ${c.question}`)), `${label}: a chip names an internal or vendor name`);
      for (const c of chips) {
        const t = await ask(c.question, scope, b.prevOut, c.range ?? "all");
        show(`${label} chip "${c.label}"`, t);
        check(!t.repeat && t.hash !== a.hash && t.content !== a.content && t.content !== NO_REPEAT_LINE, `${label}: chip "${c.label}" did not return a different card`);
        check(t.marketSlug === wantMarket, `${label}: chip "${c.label}" market ${t.marketSlug} (want ${wantMarket})`);
        check(!TWO_MARKETS.test(t.content), `${label}: chip "${c.label}" asked for two markets`);
      }
    } else {
      check(!b.followUps, `${label}: chips on a new card`);
    }
    // And a third turn that repeats again is still caught (prev carries the repeated card's hash).
    const c = await ask(follow, scope, b.prevOut);
    check(c.repeat || (c.content !== a.content && c.hash !== a.hash && c.hash !== b.hash), `${label}: asking again returned a card already on screen`);
    return { a, b };
  }

  const nash: Scope = { kind: "market", id: "nashville" };
  console.log("Nashville (Eric's pairs):");
  // The starter chip sends its own window (Last 12 months); a typed follow-up is All.
  const p1 = await pair("nashville scoped revpar", nash, "How has RevPAR moved here over the last 12 months?", "What is the 12-month RevPAR trend?", "nashville", "12m");
  const p2 = await pair("nashville scoped last-year", nash, "How has RevPAR moved here over the last 12 months?", "How does that compare to last year?", "nashville", "12m");
  const p3 = await pair("nashville unscoped last-year", null, "What's the RevPAR and occupancy read for Nashville?", "How does that compare to last year?", "nashville");
  const p4 = await pair("nashville unscoped reworded", null, "What's the RevPAR and occupancy read for Nashville?", "What is the 12-month RevPAR trend?", "nashville");
  for (const [n, p] of [["1", p1], ["2", p2], ["3", p3], ["4", p4]] as const) {
    console.log(`  pair ${n}: ${JSON.stringify(p.a.q)} [${p.a.hash}] → ${JSON.stringify(p.b.q)} [${p.b.hash}] ${p.b.repeat ? `no-repeat line + chips: ${p.b.followUps!.map((c) => c.label).join(" | ")}` : `new card: ${p.b.head.slice(0, 110)}`}`);
  }

  // Every market with a RevPAR starter on offer: the same two follow-ups, scoped.
  const markets = (await retrieveGraphContext("markets")).markets;
  let n = 0;
  for (const m of markets) {
    const st = (starters.market?.[m.slug] ?? []).find((s) => /revpar/i.test(s.q));
    if (!st) continue;
    n++;
    const scope: Scope = { kind: "market", id: m.slug };
    await pair(`${m.slug} reworded`, scope, st.q, "What is the 12-month RevPAR trend?", m.slug, st.range ?? "all");
    await pair(`${m.slug} last-year`, scope, st.q, "How does that compare to last year?", m.slug, st.range ?? "all");
  }
  console.log(`markets with a RevPAR starter: ${n} (2 pairs each, chips run)`);

  // Inheritance guards: a follow-up that names its own market or an uncovered place does not inherit.
  const s0 = await ask("What's the RevPAR and occupancy read for Nashville?", null, null);
  const austin = markets.find((m) => m.slug === "austin");
  if (austin) {
    const t = await ask(`What's the supply pipeline in ${shortName(austin)}?`, null, s0.prevOut);
    check(t.marketSlug === "austin", `named market: answered for ${t.marketSlug} (want austin)`);
  }
  const boise = await ask("What about Boise?", null, s0.prevOut);
  check(boise.intent === "uncovered_market", `uncovered place: intent ${boise.intent} (want uncovered_market)`);
  const cmp = await ask("Compare Nashville and Austin", null, s0.prevOut);
  check(cmp.intent === "compare_markets", `two-market compare kept: intent ${cmp.intent}`);

  // prev validation (untrusted input).
  const bad: unknown[] = [null, "x", 5, [], { question: 7 }, { marketSlug: "../../etc", answerHash: "zz" }, { intent: "drop table" }, { answerHash: "a".repeat(64) }];
  for (const v of bad) check(parsePrev(v) === null, `parsePrev accepted ${JSON.stringify(v)}`);
  const long = parsePrev({ question: "q".repeat(5000), intent: "revpar_metrics", marketSlug: "Nashville", answerHash: "0123456789abcdef" });
  check(long?.question?.length === PREV_MAX_QUESTION && long.intent === "revpar_metrics" && long.marketSlug === "nashville" && long.answerHash === "0123456789abcdef", `parsePrev caps: ${JSON.stringify(long)?.slice(0, 120)}`);
  check(parsePrev({ marketSlug: "x".repeat(200) }) === null, "parsePrev accepted a 200-char slug");
  check(parsePrev({ intent: "revpar_metrics", extra: { deep: [1, 2, 3] } })?.intent === "revpar_metrics", "parsePrev dropped a valid intent next to junk");

  console.log(`follow-up test: ${checks - fails.length}/${checks} checks pass`);
  for (const f of fails) console.log("FAIL", f);
  process.exit(fails.length ? 1 : 0);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
