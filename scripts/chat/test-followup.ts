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
  const { answerHash, applyNoRepeat, parsePrev, parseSeen, resolveFollowUp, NO_REPEAT_LINE, NO_REPEAT_EARLIER_LINE, PREV_MAX_QUESTION, SEEN_MAX } = await import("@/lib/chat-followup");
  const isNote = (c: string) => c === NO_REPEAT_LINE || c === NO_REPEAT_EARLIER_LINE;
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
    // "as above" only when the match is the answer directly above; else "earlier in this chat".
    const above = th.turns[th.turns.length - 2];
    const want = above && above.hash === b.hash ? NO_REPEAT_LINE : NO_REPEAT_EARLIER_LINE;
    check(b.content === want, `${label}: no-repeat reply ${JSON.stringify(b.content.slice(0, 60))} (want ${JSON.stringify(want.slice(0, 60))})`);
    const chips = b.followUps ?? [];
    chipCounts[chips.length] = (chipCounts[chips.length] ?? 0) + 1;
    check(chips.length >= 2 && chips.length <= 3, `${label}: ${chips.length} chips (want 2–3)`);
    check(!chips.some((c) => /\b(neo|grok|openai|anthropic|vercel|neon|costar|str\b|smith travel)\b/i.test(`${c.label} ${c.question}`)), `${label}: a chip names an internal or vendor name`);
    const shownBefore = new Set(th.seen);
    for (const c of chips) {
      const t = await ask(c.question, th.scope, th.prev, c.range ?? "all");
      show(`${label} chip "${c.label}"`, t);
      check(!t.repeat && !shownBefore.has(t.hash) && !isNote(t.content), `${label}: chip "${c.label}" returned an answer already shown`);
      check(!th.turns.some((x) => x.content === t.content), `${label}: chip "${c.label}" returned a card verbatim from earlier in the thread`);
      // A market's own angles stay on the market; the national backfill chips (labelled as such) have none.
      const national = /^(National |Heaviest supply)/.test(c.label);
      if (/^Compare with /.test(c.label)) check(t.intent === "compare_markets" && Boolean(t.brief), `${label}: compare chip "${c.label}" → ${t.intent}`);
      if (wantMarket && !/^Compare with /.test(c.label)) check(national ? !t.marketSlug : t.marketSlug === wantMarket, `${label}: chip "${c.label}" market ${t.marketSlug} (want ${national ? "none" : wantMarket})`);
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
  check(NO_REPEAT_EARLIER_LINE === "That's the same answer as earlier in this chat. Nothing more specific is on file for that.", `repro4: earlier note copy is ${JSON.stringify(NO_REPEAT_EARLIER_LINE)}`);

  // 5. "Why" / "driving" go to the drivers card; a contradicted premise is said plainly, with the cited figure.
  {
    const th = new Thread(nash);
    const w = await th.ask("Why is occupancy down?");
    show("repro5", w);
    check(w.intent === "demand_visitation", `repro5: "Why is occupancy down?" intent ${w.intent} (want demand_visitation)`);
    // Nashville's cited occupancy figures disagree (C&W Q2 −0.2%, county YTD +3.2%): "Mixed:", never "actually".
    const m5 = w.head.match(/^(Mixed: occupancy is (up|down) (\d+(?:\.\d+)?)(%| points)|Occupancy is (actually )?(up|down) (\d+(?:\.\d+)?)(%| points))/);
    check(Boolean(m5), `repro5: headline does not open with the occupancy figure: ${w.head.slice(0, 120)}`);
    if (m5) {
      const n5 = m5[3] ?? m5[7];
      const read0 = String(w.brief?.reads?.[0]?.text ?? "");
      check(new RegExp(`[+\\-−]\\s?${n5.replace(".", "\\.")}\\s?(%|pts?|points?)`).test(read0), `repro5: figure ${n5} is not the first cited read (${read0.slice(0, 100)})`);
    }
    console.log(`  5 "Why is occupancy down?" (Nashville): ${w.head.slice(0, 140)}`);
    const t2 = new Thread(null);
    await t2.ask("What's the RevPAR and occupancy read for Nashville?");
    const drv = await t2.ask("What is driving that occupancy number?");
    show("repro5 driving", drv);
    check(drv.intent === "demand_visitation" && drv.marketSlug === "nashville", `repro5: "What is driving that occupancy number?" → ${drv.intent} · ${drv.marketSlug}`);
    check(!drv.repeat, "repro5: the driving follow-up hit the note instead of the drivers card");
    const up = await ask("Why is occupancy up in Nashville?", null, null);
    check(/^(Occupancy is up |Mixed: occupancy is up )/.test(up.head), `repro5: agreeing premise not stated plainly: ${up.head.slice(0, 80)}`);
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
    check(one.content === COMPARE_PROMPT && (one.followUps ?? []).length === 3 && (one.followUps ?? []).every((c) => c.label.startsWith("Nashville vs ")), `repro6: one-market compare chips ${JSON.stringify(one.followUps)}`);
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

  // ---- QA r2 → r3 (Eric, Nov 1 2026) ----
  console.log("QA r2 must-fix / routing (r3):");
  const { premiseCheck } = await import("@/lib/chat-brief-build");
  const { comparePeers, supplyTier } = await import("@/lib/chat");
  const { RATES_PROMPT, RATES_CHIPS } = await import("@/lib/chat-llm");
  const { classifyAdviceRequest } = await import("@/lib/chat-advice");
  const { isBareRates } = await import("@/lib/chat-intent");
  type F = Parameters<typeof premiseCheck>[0][number];
  const fact = (text: string, key: number, label = "Test source"): F => ({ text, asOf: null, key, source: { label } as F["source"], kind: "metric", title: text, readable: true, period: null });
  const signs = (re: RegExp, t: string) => [...t.matchAll(new RegExp(re.source, "gi"))].map((g) => g[1] === "+");

  // r3-1. Premise check: "actually" only when every cited figure agrees and contradicts the question; "Mixed:" otherwise.
  {
    const up1 = fact("C&W Q2 2026: OCC 70.0% (+1.0%)", 20260630, "Cushman & Wakefield");
    const up2 = fact("County YTD through Sep 12 2026: OCC 69.4% (+3.2%)", 20260912, "roadgenius.com");
    const dn1 = fact("C&W Q2 2026 (STR/CoStar): OCC 71.7% (−0.2%)", 20260630, "Cushman & Wakefield");
    const allUp = premiseCheck([up1, up2], "Why is occupancy down?");
    check(Boolean(allUp && /^Occupancy is actually up /.test(allUp.line)), `r3-1 all-agree contradicted: ${allUp?.line}`);
    const agree = premiseCheck([up1, up2], "Why is occupancy up?");
    check(Boolean(agree && /^Occupancy is up /.test(agree.line) && !/actually/.test(agree.line)), `r3-1 all-agree agreeing: ${agree?.line}`);
    const mixed = premiseCheck([dn1, up2], "Why is occupancy down?");
    check(mixed?.line === "Mixed: occupancy is down 0.2% in Q2 2026 (Cushman & Wakefield) but up 3.2% year to date through Sep 12 2026 (county data, roadgenius.com).", `r3-1 mixed line: ${mixed?.line}`);
    // A figure only on the card on screen (a single week, not a current trend print) still counts.
    const wk = { ...fact("CoStar wk ending 2026-08-08: OCC 60.1% (−4.0%)", 20260808, "CoStar"), period: { start: 20260802, end: 20260808, label: "w/e Aug 8 2026" } } as F;
    const onScreen = premiseCheck([up2, wk], "Why is occupancy down?", [wk]);
    check(Boolean(onScreen && onScreen.line.startsWith("Mixed: occupancy is down 4.0%") && !/actually/.test(onScreen.line)), `r3-1 on-screen figure ignored: ${onScreen?.line}`);
    check(premiseCheck([up1], "How is occupancy?") === null, "r3-1 a question with no direction got a premise line");

    // Eric's repro: the RevPAR card (C&W Q2 OCC −0.2%) is on screen, then "Why is occupancy down?".
    const th = new Thread(nash);
    const rev = await th.ask("How has RevPAR moved here over the last 12 months?", "12m");
    const why = await th.ask("Why is occupancy down?");
    show("r3-1 revpar", rev);
    show("r3-1 why", why);
    check(!/\bactually\b/i.test(why.content), `r3-1 Nashville: "actually" despite conflicting figures: ${why.head.slice(0, 160)}`);
    check(why.head.startsWith("Mixed: occupancy is down 0.2% in Q2 2026 (Cushman & Wakefield) but up 3.2% year to date through Sep 12 2026 (county data, roadgenius.com)."), `r3-1 Nashville mixed line: ${why.head.slice(0, 200)}`);
    check(/OCC 71\.7% \(−0\.2%\)/.test(rev.head), `r3-1 the RevPAR card no longer shows C&W OCC −0.2%: ${rev.head.slice(0, 120)}`);
    const readTexts = (why.brief?.reads ?? []).map((r) => String(r.text ?? ""));
    check(readTexts.some((t) => /OCC[^;]{0,25}−0\.2%/.test(t)) && readTexts.some((t) => /OCC[^;]{0,25}\+3\.2%/.test(t)), `r3-1 both premise figures are not cited reads: ${readTexts.join(" | ").slice(0, 200)}`);
    console.log(`  r3-1 "Why is occupancy down?" after the RevPAR card: ${why.head.slice(0, 200)}`);

    // Every market × metric × direction: "actually" only if no figure on the market's performance card (or the
    // premise's own figures) points the question's way; "Mixed:" only when figures point both ways.
    const MET: [string, RegExp][] = [
      ["occupancy", /\b(?:OCC|occupancy)\b[^;|,]{0,25}?([+\-−])\s?\d+(?:\.\d+)?\s?(?:%|pts?\b|pp\b|points?\b)/],
      ["RevPAR", /\bRevPAR\b[^;|,]{0,30}?([+\-−])\s?\d+(?:\.\d+)?\s?%/],
      ["ADR", /\b(?:ADR|average daily rate)\b[^;|,]{0,30}?([+\-−])\s?\d+(?:\.\d+)?\s?%/],
    ];
    let lines = 0, actually = 0, mixedN = 0;
    for (const m of markets) {
      const perf = await card("How has RevPAR moved here over the last 12 months?", { kind: "market", id: m.slug }, null, "all");
      const pb = perf.brief as Brief;
      const perfText = [pb?.answer ?? "", ...(pb?.reads ?? []).map((r) => String(r.text ?? ""))].join(" ; ");
      for (const [name, re] of MET) {
        for (const dir of ["down", "up"] as const) {
          const q = `Why is ${name} ${dir} in ${shortName(m)}?`;
          const a = await card(q, null, null, "all");
          const b = a.brief as (Brief & { premise?: string }) | null;
          const pl = b?.premise;
          if (!pl) continue;
          lines++;
          check(Boolean(b?.answer?.startsWith(pl)), `r3-1 ${q}: premise is not the opening sentence`);
          const shown = signs(re, perfText);
          if (/\bactually\b/.test(pl)) {
            actually++;
            const qUp = dir === "up";
            check(!shown.some((u) => u === qUp), `r3-1 ${q}: "actually" while the performance card shows a figure ${dir}: ${pl}`);
            check(!/^Mixed/.test(pl), `r3-1 ${q}: Mixed + actually`);
          }
          if (/^Mixed:/.test(pl)) {
            mixedN++;
            check(/ is (up|down) .* but (up|down) /.test(pl) && !/\bactually\b/.test(pl), `r3-1 ${q}: malformed Mixed line: ${pl}`);
            const both = signs(re, (b?.reads ?? []).map((r) => String(r.text ?? "")).join(" ; "));
            check(both.includes(true) && both.includes(false), `r3-1 ${q}: Mixed figures are not both in the cited reads`);
          }
          check(!/\b(neo|grok|agent)\b/i.test(pl), `r3-1 ${q}: internal name in the premise line`);
        }
      }
    }
    console.log(`  r3-1 premise lines across markets: ${lines} (actually ${actually}, mixed ${mixedN})`);
  }

  // r3-2. The premise sentence is not part of the fingerprint: "Should I buy?" after the premise answer is the note.
  for (const [label, scope, first, why, buy] of [
    ["scoped", nash, "How has RevPAR moved here over the last 12 months?", "Why is occupancy down?", "Should I buy?"],
    ["unscoped", null, "What's the RevPAR and occupancy read for Nashville?", "Why is occupancy down in Nashville?", "Should I buy a hotel in Nashville?"],
  ] as const) {
    const th = new Thread(scope);
    await th.ask(first, scope ? "12m" : "all");
    const w = await th.ask(why);
    const raw = await card(buy, scope, w.prevOut, "all");
    const v = await th.ask(buy);
    show(`r3-2 ${label} buy`, v);
    const wb = w.brief as (Brief & { premise?: string }) | null;
    check(Boolean(wb?.premise), `r3-2 ${label}: the why answer has no premise line`);
    const rawHead = (raw.brief as Brief)?.answer ?? "";
    check(answerHash(raw) === w.hash || rawHead !== (wb?.answer ?? "").replace(`${wb?.premise} `, ""), `r3-2 ${label}: same card minus the premise hashes differently`);
    check(v.repeat && v.content === NO_REPEAT_LINE, `r3-2 ${label}: "${buy}" after the premise answer repeated the card: ${v.head.slice(0, 100)}`);
    if (v.repeat) await checkNote(`r3-2 ${label}`, th, "nashville");
    checkThread(`r3-2 ${label}`, th);
    console.log(`  r3-2 ${label} "${buy}" after "${why}": ${v.repeat ? `note "${v.content}"` : `card ${v.head.slice(0, 80)}`}`);
  }

  // r3-3. Note copy: "as above" for the last answer, "earlier in this chat" for an older one.
  {
    const th = new Thread(nash);
    await th.ask("How has RevPAR moved here over the last 12 months?", "12m");
    await th.ask("How much new supply is coming?");
    const c = await th.ask("What is the 12-month RevPAR trend?");
    check(c.content === NO_REPEAT_EARLIER_LINE, `r3-3 A-B-A: ${JSON.stringify(c.content.slice(0, 80))}`);
    const t2 = new Thread(nash);
    await t2.ask("How has RevPAR moved here over the last 12 months?", "12m");
    const d = await t2.ask("What is the 12-month RevPAR trend?");
    check(d.content === NO_REPEAT_LINE, `r3-3 A-A: ${JSON.stringify(d.content.slice(0, 80))}`);
    console.log(`  r3-3 A-B-A: "${c.content}" · A-A: "${d.content}"`);
  }

  // r3-a. Rates routing.
  {
    for (const q of ["Why are interest rates up?", "Is the Fed cutting rates?", "What's SOFR doing?", "Where is the 10-year Treasury?", "What are mortgage rates doing?", "Why are rates up, is it the Fed?", "Why are interest rates up in Nashville?"]) check(classifyIntent(q) === "rates", `r3-a ${JSON.stringify(q)} → ${classifyIntent(q)} (want rates)`);
    for (const q of ["Why are room rates up in Nashville?", "Why is ADR down in Miami?", "What's driving room rates in Austin?", "Why are hotel rates falling?", "Why are rates up in Nashville?", "Why are rates up?"]) check(classifyIntent(q) === "revpar_metrics", `r3-a ${JSON.stringify(q)} → ${classifyIntent(q)} (want revpar_metrics)`);
    for (const [q, want] of [["Why is supply rising in Nashville?", "supply_pipeline"], ["Why is hotel debt a problem?", "debt_overlay"], ["Why are wages up in Las Vegas?", "talent_greenlight"], ["Why is occupancy down?", "demand_visitation"], ["Why are cap rates up?", null]] as const) {
      if (want) check(classifyIntent(q) === want, `r3-a ${JSON.stringify(q)} → ${classifyIntent(q)} (want ${want})`);
      else check(!isBareRates(q), `r3-a ${JSON.stringify(q)} counted as bare rates`);
    }
    // Bare "rates", no market, no context: the clarifying prompt with exactly the two chips; each chip answers.
    const bare = await ask("Why are rates up?", null, null);
    show("r3-a bare", bare);
    check(bare.content === RATES_PROMPT && !bare.brief, `r3-a bare rates: ${bare.content.slice(0, 100)}`);
    check(JSON.stringify((bare.followUps ?? []).map((c) => c.label)) === JSON.stringify(["Room rates (ADR)", "Interest rates"]), `r3-a bare chips: ${JSON.stringify(bare.followUps)}`);
    check(!/National hotel capital signals|Fed funds|SOFR/.test(bare.content), "r3-a bare rates still answers interest rates");
    const roomChip = await ask(RATES_CHIPS[0].question, null, bare.prevOut);
    const rateChip = await ask(RATES_CHIPS[1].question, null, bare.prevOut);
    check(roomChip.intent === "revpar_metrics" && /ADR/.test(roomChip.content) && roomChip.content !== RATES_PROMPT, `r3-a room-rates chip → ${roomChip.intent}: ${roomChip.head.slice(0, 80)}`);
    check(rateChip.intent === "rates" && /Treasury|SOFR|Fed/.test(rateChip.content), `r3-a interest chip → ${rateChip.intent}: ${rateChip.head.slice(0, 80)}`);
    // "rates" + a market: the RevPAR / ADR card, led by an ADR print, with the ADR premise.
    const nr = await ask("Why are rates up in Nashville?", null, null);
    show("r3-a nashville", nr);
    check(nr.intent === "revpar_metrics" && nr.marketSlug === "nashville", `r3-a "Why are rates up in Nashville?" → ${nr.intent} · ${nr.marketSlug}`);
    check(/\bADR\b/.test(nr.head) && !/\bpax\b/.test(nr.head), `r3-a Nashville rates headline: ${nr.head.slice(0, 160)}`);
    check(/^(Mixed: ADR|ADR is)/.test(nr.head) && !/actually/.test(nr.head.split(".")[0] ?? "") || /^ADR is actually/.test(nr.head), `r3-a Nashville ADR premise: ${nr.head.slice(0, 160)}`);
    // Bare "rates" with context: a market on screen → room rates there; an interest-rate card on screen → interest rates.
    const t1 = new Thread(null);
    await t1.ask("What's the supply pipeline in Nashville?");
    const r1x = await t1.ask("Why are rates up?");
    check(r1x.intent === "revpar_metrics" && r1x.marketSlug === "nashville", `r3-a bare rates after Nashville → ${r1x.intent} · ${r1x.marketSlug}`);
    const t2 = new Thread(null);
    await t2.ask("Where is the 10-year Treasury?");
    const r2x = await t2.ask("Why are rates up?");
    check(r2x.intent === "rates" || r2x.repeat, `r3-a bare rates after the rates card → ${r2x.intent}`);
    console.log(`  r3-a "Why are rates up?": ${bare.content} [${(bare.followUps ?? []).map((c) => c.label).join(" | ")}]; Nashville: ${nr.head.slice(0, 140)}`);
  }

  // r3-b. One-market compare: three peers from the same supply tier, nearest region, one tap each; never by data depth.
  {
    const one = await ask("Compare Nashville", null, null);
    const labels = (one.followUps ?? []).map((c) => c.label);
    check(JSON.stringify(labels) === JSON.stringify(["Nashville vs Charlotte", "Nashville vs Atlanta", "Nashville vs Austin"]), `r3-b Compare Nashville chips: ${labels.join(" | ")}`);
    for (const c of one.followUps ?? []) {
      const t = await ask(c.question, null, one.prevOut);
      const ctx = await retrieveGraphContext(c.question, null);
      check(t.intent === "compare_markets" && ctx.secondary.length >= 1 && t.content !== COMPARE_PROMPT && Boolean(t.brief), `r3-b chip "${c.label}" did not compare two markets`);
    }
    for (const m of markets) {
      const peers = comparePeers(markets, m);
      if (supplyTier(m) == null) continue;
      check(peers.length === 3 || markets.filter((x) => x.id !== m.id && supplyTier(x) === supplyTier(m)).length < 3, `r3-b ${m.slug}: ${peers.length} peers`);
      check(peers.every((p) => supplyTier(p) === supplyTier(m) && p.id !== m.id), `r3-b ${m.slug}: a peer outside its supply tier`);
    }
    console.log(`  r3-b "Compare Nashville": ${labels.join(" | ")}`);
  }

  // r3-c. At least 2 chips on a national note (debt thread backfills with national RevPAR / labor).
  {
    const th = new Thread(null);
    await th.ask("What's the national hotel debt and refinancing picture?");
    const n2 = await th.ask("What about national hotel refinancing?");
    show("r3-c national", n2);
    check(n2.repeat, "r3-c national refinancing follow-up was not the note");
    if (n2.repeat) await checkNote("r3-c national", th, null);
    check((n2.followUps ?? []).length >= 2, `r3-c national note chips: ${(n2.followUps ?? []).map((c) => c.label).join(" | ")}`);
    console.log(`  r3-c national note chips: ${(n2.followUps ?? []).map((c) => c.label).join(" | ")}`);
  }

  // Fort Worth → "Dallas–Fort Worth"; "Is it worth building/buying…" → the decline line plus the same data as "should I buy?".
  {
    const fw = await ask("How is Fort Worth doing?", null, null);
    check(fw.marketSlug === "dallas" && fw.head.startsWith("Dallas–Fort Worth"), `r3 Fort Worth label: ${fw.head.slice(0, 60)}`);
    const dl = await ask("How is Dallas doing?", null, null);
    check(dl.head.startsWith("Dallas–Fort Worth"), `r3 Dallas label: ${dl.head.slice(0, 60)}`);
    for (const q of ["Is it worth building a hotel in Nashville?", "Is it worth buying a hotel in Nashville?", "Is Nashville worth developing a hotel in?"]) check(classifyAdviceRequest(q) === "buy_sell", `r3 worth: ${JSON.stringify(q)} not declined`);
    for (const q of ["What is a hotel worth per key?", "How much is Nashville's pipeline worth?"]) check(classifyAdviceRequest(q) === null, `r3 worth: ${JSON.stringify(q)} declined`);
    const wb = await ask("Is it worth building a hotel in Nashville?", null, null);
    const sb = await ask("Should I buy a hotel in Nashville?", null, null);
    const wbb = wb.brief as (Brief & { decline?: string }) | null;
    const sbb = sb.brief as (Brief & { decline?: string }) | null;
    check(wb.intent === "advice_declined" && Boolean(wbb?.decline) && wbb?.decline === sbb?.decline, `r3 worth: decline ${JSON.stringify(wbb?.decline)?.slice(0, 80)}`);
    check(wb.head === sb.head && JSON.stringify(wbb?.reads?.map((r) => r.text)) === JSON.stringify(sbb?.reads?.map((r) => r.text)), `r3 worth: data differs from "should I buy?" (${wb.head.slice(0, 60)} vs ${sb.head.slice(0, 60)})`);
    console.log(`  r3 Fort Worth: ${fw.head.slice(0, 50)} · worth building: ${wbb?.decline?.slice(0, 50)} + ${wb.head.slice(0, 50)}`);
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
