/**
 * Follow-up test (Eric, Nov 1, 2026): a follow-up must never return an answer already shown in the thread.
 *
 * Runs scripted turns through the same steps as /api/chat (resolveFollowUp → answerChat → applyNoRepeat), sending
 * `prev` exactly as ChatClient does. Deterministic, no model, read-only (graph reads only, no log writes).
 *   pairs:  a scoped starter, then a reworded follow-up; a starter, then "how does that compare to last year?"
 *           (scoped and unscoped), for Nashville and every market whose RevPAR starter is on offer
 *   repros: A-B-A (RevPAR, supply, RevPAR) over the whole thread; the county card's "Last 90 days" read; the
 *           buy/sell decline not in the fingerprint; the note copy; "why"/"driving" → drivers card with the premise
 *           checked; the first-turn compare prompt and its chips; "worth" ≠ Dallas; "visitors" → demand; seen validation
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
type Chip = import("@/lib/chat-followup").FollowUpChip;
type Brief = { answer?: string; reads?: { text?: string }[] } | null | undefined;
type Turn = { q: string; content: string; head: string; brief: Brief; intent: string | null; marketSlug: string | null; hash: string; repeat: boolean; followUps?: Chip[]; prevOut: Prev };

const verbose = process.argv.includes("--verbose");

async function main() {
  const { installGraphFixture } = await import("./graph-fixture");
  installGraphFixture();
  const { answerChat } = await import("@/lib/chat-llm");
  const { answerHash, applyNoRepeat, parsePrev, parseSeen, resolveFollowUp, NO_REPEAT_LINE, PREV_MAX_QUESTION, SEEN_MAX } = await import("@/lib/chat-followup");
  const { retrieveGraphContext, COMPARE_PROMPT } = await import("@/lib/chat");
  const { classifyIntent } = await import("@/lib/chat-intent");
  const { answerKey } = await import("@/lib/chat-cache");
  const { shortName } = await import("@/lib/chat-brief-build");
  const starters = (await import("@/data/chat-starters.json")).default as unknown as { market: Record<string, { q: string; range?: "all" | "90d" | "12m" }[]> };
  type Range = "all" | "90d" | "12m";

  /** The card the route would build (resolveFollowUp → answerChat), before the no-repeat check. */
  async function card(q: string, scope: Scope | null, p: Prev | null, range: Range) {
    const route = await resolveFollowUp({ question: q, scope, marketSlug: scope?.kind === "market" ? scope.id : null, prev: p });
    const built = await answerChat(q, { marketSlug: route.marketSlug, range, scope, intent: route.intent });
    return { ...built, marketSlug: built.marketSlug ?? route.marketSlug };
  }

  /** One /api/chat turn, as the route runs it (prev round-trips through parsePrev like a JSON body; chips are hashed). */
  async function ask(q: string, scope: Scope | null, prev: Prev | null, range: Range = "all"): Promise<Turn> {
    const p = parsePrev(prev ? JSON.parse(JSON.stringify(prev)) : undefined);
    const a = await card(q, scope, p, range);
    const chipPrev: Prev = { question: q, intent: (a.intent as Prev["intent"]) ?? null, marketSlug: a.marketSlug, answerHash: null, seen: [] };
    const hashOf = async (c: Chip) => answerHash(await card(c.question, scope, chipPrev, c.range ?? "all"));
    const nr = await applyNoRepeat(a, { prev: p, question: q, range, hashOf });
    const brief = (nr.answer as { brief?: Brief }).brief;
    return {
      q,
      content: nr.answer.content,
      head: brief?.answer ?? nr.answer.content.split("\n")[0],
      brief,
      intent: nr.answer.intent ?? null,
      marketSlug: nr.answer.marketSlug,
      hash: nr.hash,
      repeat: nr.repeat,
      followUps: nr.followUps ?? (nr.answer as { followUps?: Chip[] }).followUps,
      prevOut: { question: q, intent: (nr.answer.intent as Prev["intent"]) ?? null, marketSlug: nr.answer.marketSlug, answerHash: nr.hash },
    };
  }

  /** A chat thread as ChatClient keeps it: prev = the last answer, plus `seen` (newest first, ≤ SEEN_MAX). */
  class Thread {
    last: Prev | null = null;
    seen: string[] = [];
    turns: Turn[] = [];
    constructor(public scope: Scope | null) {}
    get prev(): Prev | null {
      return this.last ? { ...this.last, seen: this.seen.slice(0, SEEN_MAX) } : null;
    }
    async ask(q: string, range: Range = "all"): Promise<Turn> {
      const t = await ask(q, this.scope, this.prev, range);
      this.last = t.prevOut;
      this.seen = [t.hash, ...this.seen.filter((h) => h !== t.hash)].slice(0, SEEN_MAX);
      this.turns.push(t);
      return t;
    }
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
  const TWO_MARKETS = /name two (covered |seeded )?markets|two markets/i;
  const chipCounts: Record<number, number> = {};

  /**
   * A no-repeat reply in `th` (its last turn): the one line, 1–3 chips, no vendor names, and every chip (tapped in a
   * copy of the thread) runs a real card that is not any answer already shown in the thread.
   */
  async function checkNote(label: string, th: Thread, wantMarket: string | null) {
    const b = th.turns[th.turns.length - 1];
    check(b.content === NO_REPEAT_LINE, `${label}: no-repeat reply is not the one line`);
    const chips = b.followUps ?? [];
    chipCounts[chips.length] = (chipCounts[chips.length] ?? 0) + 1;
    check(chips.length >= 1 && chips.length <= 3, `${label}: ${chips.length} chips (want 1–3)`);
    check(!chips.some((c) => /\b(neo|grok|openai|anthropic|vercel|neon|costar|str\b|smith travel)\b/i.test(`${c.label} ${c.question}`)), `${label}: a chip names an internal or vendor name`);
    const shownBefore = new Set(th.seen);
    for (const c of chips) {
      const t = await ask(c.question, th.scope, th.prev, c.range ?? "all");
      show(`${label} chip "${c.label}"`, t);
      check(!t.repeat && !shownBefore.has(t.hash) && t.content !== NO_REPEAT_LINE, `${label}: chip "${c.label}" returned an answer already shown`);
      check(!th.turns.some((x) => x.content === t.content), `${label}: chip "${c.label}" returned a card verbatim from earlier in the thread`);
      if (wantMarket) check(t.marketSlug === wantMarket, `${label}: chip "${c.label}" market ${t.marketSlug} (want ${wantMarket})`);
      check(!TWO_MARKETS.test(t.content), `${label}: chip "${c.label}" asked for two markets`);
    }
  }

  /** Whole-thread rule: no turn shows a card (by content or fingerprint) that an earlier turn showed. */
  function checkThread(label: string, th: Thread) {
    th.turns.forEach((t, i) => {
      if (t.repeat) return;
      const earlier = th.turns.slice(0, i).filter((x) => !x.repeat);
      check(!earlier.some((x) => x.content === t.content), `${label}: turn ${i + 1} ${JSON.stringify(t.q)} repeats an earlier card verbatim`);
      check(!earlier.some((x) => x.hash === t.hash), `${label}: turn ${i + 1} ${JSON.stringify(t.q)} repeats an earlier answer (same headline, market and window)`);
    });
  }

  /** A follow-up after `first`: never the same card; a no-repeat reply carries working chips. */
  async function pair(label: string, scope: Scope | null, first: string, follow: string, wantMarket: string, firstRange: Range = "all") {
    const th = new Thread(scope);
    const a = await th.ask(first, firstRange);
    const b = await th.ask(follow);
    show(`${label} starter`, a);
    show(`${label} follow-up`, b);
    check(b.content !== a.content, `${label}: follow-up ${JSON.stringify(follow)} returned the starter's card verbatim`);
    check(b.repeat || b.hash !== a.hash, `${label}: follow-up returned the same answer again`);
    check(b.marketSlug === wantMarket, `${label}: follow-up market ${b.marketSlug} (want ${wantMarket})`);
    check(!TWO_MARKETS.test(b.content), `${label}: follow-up asked for two markets`);
    if (b.repeat) await checkNote(label, th, wantMarket);
    else check(!b.followUps, `${label}: chips on a new card`);
    // A third turn that repeats again is still caught.
    const c = await th.ask(follow);
    check(c.repeat || (c.content !== a.content && c.hash !== a.hash && c.hash !== b.hash), `${label}: asking again returned a card already on screen`);
    checkThread(label, th);
    return { a, b };
  }

  /** A, B, then A again (Hal's repro: RevPAR, supply, RevPAR): the third turn is the note, never card A again. */
  async function aba(label: string, scope: Scope | null, qa: string, qb: string, qa2: string, wantMarket: string, ra: Range = "all") {
    const th = new Thread(scope);
    const a = await th.ask(qa, ra);
    const b = await th.ask(qb);
    const c = await th.ask(qa2);
    show(`${label} A`, a);
    show(`${label} B`, b);
    show(`${label} A again`, c);
    check(b.hash !== a.hash, `${label}: B is the same answer as A`);
    check(c.content !== a.content, `${label}: A-B-A returned card A verbatim`);
    check(c.repeat || (c.hash !== a.hash && c.hash !== b.hash), `${label}: A-B-A returned an answer already shown`);
    if (c.repeat) await checkNote(label, th, wantMarket);
    checkThread(label, th);
    return { a, b, c };
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

  // ---- Repros (Hal / Eric QA, Nov 1 2026) ----
  console.log("Repros:");
  // 1. A-B-A over the whole thread: RevPAR, then supply, then RevPAR.
  const r1 = await aba("repro1 scoped", nash, "How has RevPAR moved here over the last 12 months?", "How much new supply is coming?", "What is the 12-month RevPAR trend?", "nashville", "12m");
  console.log(`  1 A-B-A scoped: third turn ${r1.c.repeat ? `note + chips: ${(r1.c.followUps ?? []).map((c) => c.label).join(" | ")}` : r1.c.head.slice(0, 90)}`);
  const r1b = await aba("repro1 unscoped", null, "What's the RevPAR and occupancy read for Nashville?", "What's the hotel supply pipeline in Nashville?", "What's the RevPAR and occupancy read for Nashville?", "nashville");
  console.log(`  1 A-B-A unscoped: third turn ${r1b.c.repeat ? "note" : "card"}`);
  // A long thread: every turn either a new answer or the note; nothing shown twice; seen stays capped.
  {
    const th = new Thread(nash);
    for (const q of ["How has RevPAR moved here over the last 12 months?", "How much new supply is coming?", "What's demand doing here?", "What's the debt picture here?", "Is labor a risk here?", "What is the 12-month RevPAR trend?", "How does that compare to last year?", "What's the RevPAR and occupancy read for Nashville?", "What's the hotel supply pipeline in Nashville?", "What's driving hotel demand in Nashville?", "Tell me more about that", "How has RevPAR moved here over the last 12 months?"]) {
      const t = await th.ask(q);
      show("long thread", t);
      check(th.seen.length <= SEEN_MAX, "long thread: seen grew past the cap");
      if (t.repeat) await checkNote(`long thread ${JSON.stringify(q)}`, th, "nashville");
    }
    checkThread("long thread", th);
  }
  // Every market with a RevPAR starter: A-B-A.
  for (const m of markets) {
    const st = (starters.market?.[m.slug] ?? []).find((x) => /revpar/i.test(x.q));
    if (!st) continue;
    await aba(`${m.slug} A-B-A`, { kind: "market", id: m.slug }, st.q, "How much new supply is coming?", "What is the 12-month RevPAR trend?", m.slug, st.range ?? "all");
  }
  // The cache key: question, item, routed market and intent, window. No prev / seen in it.
  {
    const base = { version: "v", question: "What is the 12-month RevPAR trend?", scope: nash, marketSlug: "nashville", range: "all" as const, intent: null };
    const k1 = answerKey(base);
    const k2 = answerKey({ ...base, prev: { marketSlug: "nashville", answerHash: "0123456789abcdef", seen: ["fedcba9876543210"] } } as Parameters<typeof answerKey>[0]);
    check(k1 === k2 && !/prev|seen|0123456789abcdef|fedcba9876543210/.test(k2), `cache key changes with prev/seen: ${k2}`);
    const routeSrc = (await import("node:fs")).readFileSync(new URL("../../src/app/api/chat/route.ts", import.meta.url), "utf8");
    const call = routeSrc.match(/answerKey\(\{[^}]*\}\)/g) ?? [];
    check(call.length === 1 && !/prev|seen/.test(call[0]), `route passes prev/seen to answerKey: ${call.join(" ")}`);
  }

  // 2. Fingerprint = headline + market + window: the "Last 90 days" read of the county card is the same answer.
  {
    const th = new Thread(null);
    await th.ask("What's the RevPAR and occupancy read for Nashville?");
    const county = await th.ask("How does that compare to last year?");
    show("repro2 county", county);
    const c90 = await card("What's the RevPAR and occupancy read for Nashville?", null, null, "90d");
    const head90 = (c90.brief as Brief)?.answer ?? "";
    console.log(`  2 county card ${county.hash} "${county.head.slice(0, 70)}…"; 90-day card ${answerHash(c90)} "${head90.slice(0, 70)}…"`);
    if (county.head === head90) check(answerHash(c90) === county.hash, "repro2: same headline under Last 90 days hashes differently");
    const again = await th.ask("What's the RevPAR and occupancy read for Nashville?", "90d");
    show("repro2 90d", again);
    check(county.head !== head90 || again.repeat, "repro2: the 90-day chip question returned the county headline again");
    if (again.repeat) await checkNote("repro2", th, "nashville");
    check(!(again.followUps ?? []).some((c) => c.label === "Last 90 days" && c.range === "90d" && c.question === "What's the RevPAR and occupancy read for Nashville?"), "repro2: the note still offers the Last 90 days chip that returns the county card");
    // Eric's exact sequence: county card (scoped "Why…" now goes to drivers, so the compare question), then a note: no "Last 90 days" chip back to it.
    const th2 = new Thread(nash);
    await th2.ask("How has RevPAR moved here over the last 12 months?", "12m");
    const cty = await th2.ask("How does that compare to last year?");
    const note = await th2.ask("What about ADR in Nashville?");
    show("repro2 scoped note", note);
    if (note.repeat) await checkNote("repro2 scoped", th2, "nashville");
    checkThread("repro2 scoped", th2);
    console.log(`  2 scoped: county ${cty.repeat ? "note" : "card"}, ADR follow-up ${note.repeat ? `note + chips: ${(note.followUps ?? []).map((c) => `${c.label}${c.range ? ` (${c.range})` : ""}`).join(" | ")}` : note.head.slice(0, 80)}`);
  }

  // 3. The buy/sell decline line is not part of the fingerprint.
  {
    const th = new Thread(null);
    const d = await th.ask("What's driving hotel demand in Nashville?");
    const v = await th.ask("Should I buy a hotel in Nashville?");
    show("repro3 demand", d);
    show("repro3 advice", v);
    const raw = await card("Should I buy a hotel in Nashville?", null, null, "all");
    const rawHead = (raw.brief as Brief)?.answer ?? "";
    check(rawHead !== d.head || answerHash(raw) === d.hash, "repro3: the same card plus the decline line hashes differently");
    check(rawHead !== d.head || v.repeat, "repro3: 'should I buy?' repeated the demand card with only the decline added");
    console.log(`  3 advice after the demand card: ${v.repeat ? "note" : `card "${v.head.slice(0, 70)}"`} (raw advice headline ${rawHead === d.head ? "=" : "≠"} demand headline)`);
  }

  // 4. Note copy.
  check(NO_REPEAT_LINE === "That's the same answer as above. Nothing more specific is on file for that.", `repro4: note copy is ${JSON.stringify(NO_REPEAT_LINE)}`);

  // 5. "Why" / "driving" go to the drivers card; a contradicted premise is said plainly, with the cited figure.
  {
    const th = new Thread(nash);
    const w = await th.ask("Why is occupancy down?");
    show("repro5", w);
    check(w.intent === "demand_visitation", `repro5: "Why is occupancy down?" intent ${w.intent} (want demand_visitation)`);
    const m5 = w.head.match(/^Occupancy is (actually )?(up|down) (\d+(?:\.\d+)?)(%| points)/);
    check(Boolean(m5), `repro5: headline does not open with the occupancy figure: ${w.head.slice(0, 120)}`);
    if (m5) {
      const n5 = m5[3];
      const read0 = String(w.brief?.reads?.[0]?.text ?? "");
      check(new RegExp(`[+\\-−]\\s?${n5.replace(".", "\\.")}\\s?(%|pts?|points?)`).test(read0), `repro5: figure ${n5} is not the first cited read (${read0.slice(0, 100)})`);
      check(m5[2] === "up" ? m5[1] === "actually " : !m5[1], `repro5: "actually" used wrongly: ${w.head.slice(0, 80)}`);
    }
    console.log(`  5 "Why is occupancy down?" (Nashville): ${w.head.slice(0, 140)}`);
    const t2 = new Thread(null);
    await t2.ask("What's the RevPAR and occupancy read for Nashville?");
    const drv = await t2.ask("What is driving that occupancy number?");
    show("repro5 driving", drv);
    check(drv.intent === "demand_visitation" && drv.marketSlug === "nashville", `repro5: "What is driving that occupancy number?" → ${drv.intent} · ${drv.marketSlug}`);
    check(!drv.repeat, "repro5: the driving follow-up hit the note instead of the drivers card");
    const up = await ask("Why is occupancy up in Nashville?", null, null);
    check(/^Occupancy is up /.test(up.head), `repro5: agreeing premise not stated plainly: ${up.head.slice(0, 80)}`);
    for (const q of ["Why is demand strong in Nashville?", "What's driving RevPAR in Miami?", "Why is Nashville so busy?"]) check(classifyIntent(q) === "demand_visitation", `repro5: ${JSON.stringify(q)} → ${classifyIntent(q)}`);
  }

  // 6. First-turn compare: the question plus market chips (no "seeded", no Orlando/Las Vegas line).
  {
    const x2 = await ask("How does that compare to last year?", null, null);
    show("repro6", x2);
    check(x2.content === COMPARE_PROMPT && COMPARE_PROMPT === "Which two markets should I compare?", `repro6: compare copy ${JSON.stringify(x2.content.slice(0, 120))}`);
    check(!/seeded|Orlando vs Las Vegas|default/i.test(x2.content), "repro6: old compare copy still shown");
    const chips = x2.followUps ?? [];
    check(chips.length >= 2 && chips.length <= 3, `repro6: ${chips.length} market chips (want 2–3)`);
    for (const c of chips) {
      const t = await ask(c.question, null, x2.prevOut, c.range ?? "all");
      const ctx = await retrieveGraphContext(c.question, null);
      check(t.intent === "compare_markets" && ctx.secondary.length >= 1 && t.content !== COMPARE_PROMPT && Boolean(t.brief), `repro6: chip "${c.label}" did not compare two markets (${t.intent}, ${t.head.slice(0, 60)})`);
    }
    console.log(`  6 compare prompt: ${JSON.stringify(x2.content)} chips: ${chips.map((c) => c.label).join(" | ")}`);
    const one = await ask("Compare Nashville", null, null);
    check(one.content === COMPARE_PROMPT && (one.followUps ?? []).length >= 2 && (one.followUps ?? []).every((c) => c.label.startsWith("Nashville vs ")), `repro6: one-market compare chips ${JSON.stringify(one.followUps)}`);
    console.log(`  6 "Compare Nashville": chips ${(one.followUps ?? []).map((c) => c.label).join(" | ")}`);
  }

  // 7. "worth" alone is not Dallas–Fort Worth.
  for (const q of ["Is it worth it?", "Is a hotel worth buying right now?", "What is a hotel worth per key?"]) {
    const t = await ask(q, null, null);
    const ctx = await retrieveGraphContext(q, null);
    check(!ctx.matched && t.marketSlug !== "dallas", `repro7: ${JSON.stringify(q)} matched ${ctx.matched?.slug ?? t.marketSlug}`);
  }
  for (const q of ["How is Fort Worth doing?", "DFW hotel supply?"]) check((await retrieveGraphContext(q, null)).matched?.slug === "dallas", `repro7: ${JSON.stringify(q)} lost Dallas`);
  {
    // A "worth" follow-up with no market inherits the thread's market, not Dallas.
    const th = new Thread(null);
    await th.ask("What's the RevPAR and occupancy read for Nashville?");
    const w = await th.ask("Is it worth it?");
    check(w.marketSlug === "nashville", `repro7: "Is it worth it?" after Nashville answered for ${w.marketSlug}`);
  }

  // 8. "visitors" / "visitor" are demand questions.
  for (const q of ["How many visitors does Nashville get?", "Nashville visitor numbers", "visitor spending in Miami", "Are visitors coming back to San Francisco?"]) check(classifyIntent(q) === "demand_visitation", `repro8: ${JSON.stringify(q)} → ${classifyIntent(q)}`);
  {
    const v = await ask("How many visitors does Nashville get?", null, null);
    check(v.intent === "demand_visitation" && v.marketSlug === "nashville", `repro8: visitors question → ${v.intent} · ${v.marketSlug}`);
  }

  // seen validation (untrusted input): an array of ≤ SEEN_MAX 16-hex strings; anything else is ignored whole.
  const h = (i: number) => i.toString(16).padStart(16, "0");
  check(parseSeen([h(1), h(2)]).join() === [h(1), h(2)].join(), "parseSeen dropped valid entries");
  check(parseSeen([h(1), h(1)]).length === 1, "parseSeen kept a duplicate");
  for (const v of [null, "x", 5, {}, [h(1), "zz"], [h(1), 7], Array.from({ length: SEEN_MAX + 1 }, (_, i) => h(i)), ["A".repeat(16)], [h(1) + "0"]]) check(parseSeen(v).length === 0, `parseSeen accepted ${JSON.stringify(v)?.slice(0, 80)}`);
  check(parsePrev({ answerHash: h(3), seen: "junk" })?.seen?.length === 0 && parsePrev({ answerHash: h(3), seen: "junk" })?.answerHash === h(3), "a malformed seen dropped the rest of prev");
  check(parsePrev({ seen: [h(4)] })?.seen?.[0] === h(4), "prev with only seen was dropped");

  // prev validation (untrusted input).
  const bad: unknown[] = [null, "x", 5, [], { question: 7 }, { marketSlug: "../../etc", answerHash: "zz" }, { intent: "drop table" }, { answerHash: "a".repeat(64) }];
  for (const v of bad) check(parsePrev(v) === null, `parsePrev accepted ${JSON.stringify(v)}`);
  const long = parsePrev({ question: "q".repeat(5000), intent: "revpar_metrics", marketSlug: "Nashville", answerHash: "0123456789abcdef" });
  check(long?.question?.length === PREV_MAX_QUESTION && long.intent === "revpar_metrics" && long.marketSlug === "nashville" && long.answerHash === "0123456789abcdef", `parsePrev caps: ${JSON.stringify(long)?.slice(0, 120)}`);
  check(parsePrev({ marketSlug: "x".repeat(200) }) === null, "parsePrev accepted a 200-char slug");
  check(parsePrev({ intent: "revpar_metrics", extra: { deep: [1, 2, 3] } })?.intent === "revpar_metrics", "parsePrev dropped a valid intent next to junk");

  console.log(`no-repeat replies by chip count: ${JSON.stringify(chipCounts)}`);
  console.log(`follow-up test: ${checks - fails.length}/${checks} checks pass`);
  for (const f of fails) console.log("FAIL", f);
  process.exit(fails.length ? 1 : 0);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
