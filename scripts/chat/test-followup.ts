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
  const { answerHash, applyNoRepeat, parsePrev, parseSeen, resolveFollowUp, NO_REPEAT_LINE, NO_REPEAT_EARLIER_LINE, CARD_ABOVE_LINE, PREV_MAX_QUESTION, SEEN_MAX } = await import("@/lib/chat-followup");
  // A repeat is the bare note, or (when the repeated card carried a decline or premise line) that line + CARD_ABOVE_LINE.
  const EXTRA_NOTE = /^(We don't give buy or sell recommendations\b[^]*|Mixed: [^]*|(?:Occupancy|RevPAR|ADR) is [^]*) The full cited card is above\.$/;
  const isNote = (c: string) => c === NO_REPEAT_LINE || c === NO_REPEAT_EARLIER_LINE || EXTRA_NOTE.test(c);
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
    // r4: a repeat whose card carries a decline or premise line keeps that line, then "The full cited card is above."
    check(b.content === want || (EXTRA_NOTE.test(b.content) && b.content.endsWith(` ${CARD_ABOVE_LINE}`)), `${label}: no-repeat reply ${JSON.stringify(b.content.slice(0, 60))} (want ${JSON.stringify(want.slice(0, 60))} or a decline/premise line + ${JSON.stringify(CARD_ABOVE_LINE)})`);
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
  const chicagoScope: Scope = { kind: "market", id: "chicago" };
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
  const TODAY = 20261101;
  const signs = (re: RegExp, t: string) => [...t.matchAll(new RegExp(re.source, "gi"))].map((g) => g[1] === "+");

  // r3-1. Premise check: "actually" only when every cited figure agrees and contradicts the question; "Mixed:" otherwise.
  {
    const up1 = fact("C&W Q2 2026: OCC 70.0% (+1.0%)", 20260630, "Cushman & Wakefield");
    const up2 = fact("County YTD through Sep 12 2026: OCC 69.4% (+3.2%)", 20260912, "roadgenius.com");
    const dn1 = fact("C&W Q2 2026 (STR/CoStar): OCC 71.7% (−0.2%)", 20260630, "Cushman & Wakefield");
    const allUp = premiseCheck([up1, up2], "Why is occupancy down?", [], TODAY);
    check(Boolean(allUp && /^Occupancy is actually up /.test(allUp.line)), `r3-1 all-agree contradicted: ${allUp?.line}`);
    const agree = premiseCheck([up1, up2], "Why is occupancy up?", [], TODAY);
    check(Boolean(agree && /^Occupancy is up /.test(agree.line) && !/actually/.test(agree.line)), `r3-1 all-agree agreeing: ${agree?.line}`);
    const mixed = premiseCheck([dn1, up2], "Why is occupancy down?", [], TODAY);
    check(mixed?.line === "Mixed: occupancy is down 0.2% in Q2 2026 (Cushman & Wakefield) but up 3.2% year to date through Sep 12 2026 (county data, roadgenius.com).", `r3-1 mixed line: ${mixed?.line}`);
    // A figure only on the card on screen (a single week, not a current trend print) still counts.
    const wk = { ...fact("CoStar wk ending 2026-08-08: OCC 60.1% (−4.0%)", 20260808, "CoStar"), period: { start: 20260802, end: 20260808, label: "w/e Aug 8 2026" } } as F;
    const onScreen = premiseCheck([up2, wk], "Why is occupancy down?", [wk], TODAY);
    // r4: a single week is set aside when a longer print exists, but if it points the question's way (here: on screen,
    // down) the line drops "actually".
    // r5: ... and names that week with its figure.
    check(onScreen?.line === "Occupancy is up 3.2% year to date through Sep 12 2026 (county data, roadgenius.com), though the week ending Aug 8 was down 4.0% (CoStar).", `r3-1/r4 on-screen week: ${onScreen?.line}`);
    check(premiseCheck([up1], "How is occupancy?", [], TODAY) === null, "r3-1 a question with no direction got a premise line");

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
      // r4: only figures the premise weighs: latest 12 months (nothing dated 2025 or earlier alone) and not single weeks.
      const perfText = [...(pb?.answer ?? "").split(/(?<=\.)\s|;\s/), ...(pb?.reads ?? []).map((r) => String(r.text ?? ""))]
        .filter((t) => !/\b(wk|week)\b/i.test(t) && !(/\b(?:19|20)[0-2]\d\b|\b2025\b/.test(t) && !/\b2026\b/.test(t)))
        .join(" ; ");
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
    // r4: the advice repeat keeps its decline line, then "The full cited card is above." (never the bare note).
    check(v.repeat && v.content === `We don't give buy or sell recommendations. ${CARD_ABOVE_LINE}`, `r3-2/r4 ${label}: "${buy}" after the premise answer: ${JSON.stringify(v.content.slice(0, 120))}`);
    check((v.followUps ?? []).length === 3, `r4 ${label}: advice repeat chips ${(v.followUps ?? []).length} (want 3)`);
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
    // r4: only the latest 12 months are weighed, so FY2025 ADR −1.3% no longer makes this "Mixed".
    check(nr.head.startsWith("ADR is up 1.2% in Q2 2026 (Cushman & Wakefield)."), `r3-a/r4 Nashville ADR premise: ${nr.head.slice(0, 160)}`);
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

  // "Is it worth building/buying…" → the decline line plus the same data as "should I buy?". (r4: the Dallas card is
  // headed "Dallas" again; see the r4 Dallas block for the area tags.)
  {
    for (const q of ["Is it worth building a hotel in Nashville?", "Is it worth buying a hotel in Nashville?", "Is Nashville worth developing a hotel in?"]) check(classifyAdviceRequest(q) === "buy_sell", `r3 worth: ${JSON.stringify(q)} not declined`);
    for (const q of ["What is a hotel worth per key?", "How much is Nashville's pipeline worth?"]) check(classifyAdviceRequest(q) === null, `r3 worth: ${JSON.stringify(q)} declined`);
    const wb = await ask("Is it worth building a hotel in Nashville?", null, null);
    const sb = await ask("Should I buy a hotel in Nashville?", null, null);
    const wbb = wb.brief as (Brief & { decline?: string }) | null;
    const sbb = sb.brief as (Brief & { decline?: string }) | null;
    check(wb.intent === "advice_declined" && Boolean(wbb?.decline) && wbb?.decline === sbb?.decline, `r3 worth: decline ${JSON.stringify(wbb?.decline)?.slice(0, 80)}`);
    check(wb.head === sb.head && JSON.stringify(wbb?.reads?.map((r) => r.text)) === JSON.stringify(sbb?.reads?.map((r) => r.text)), `r3 worth: data differs from "should I buy?" (${wb.head.slice(0, 60)} vs ${sb.head.slice(0, 60)})`);
    console.log(`  r3 worth building: ${wbb?.decline?.slice(0, 50)} + ${wb.head.slice(0, 50)}`);
  }


  // ---- QA r3 → r4 (Eric, Nov 1 2026) ----
  console.log("QA r3 → r4:");
  {
    // r4-1. A repeat keeps its new line: premise first, then "The full cited card is above." + 3 chips.
    const th = new Thread(null);
    const rev = await th.ask("What's the RevPAR and occupancy read for Nashville?");
    const rr = await th.ask("Why are rates up in Nashville?");
    show("r4-1 rates repeat", rr);
    const rawRates = await card("Why are rates up in Nashville?", null, rev.prevOut, "all");
    const pl = (rawRates.brief as (Brief & { premise?: string }) | null)?.premise ?? "";
    check(/^ADR is up 1\.2% in Q2 2026 \(Cushman & Wakefield\)\.$/.test(pl), `r4-1 the rates card's premise: ${pl}`);
    if (rr.repeat) {
      check(rr.content === `${pl} ${CARD_ABOVE_LINE}`, `r4-1 rates repeat after the RevPAR card: ${JSON.stringify(rr.content)}`);
      check((rr.followUps ?? []).length === 3, `r4-1 rates repeat chips: ${(rr.followUps ?? []).length}`);
      await checkNote("r4-1 rates repeat", th, "nashville");
    } else check(rr.head.startsWith(pl), `r4-1 rates card does not lead with the ADR line: ${rr.head.slice(0, 120)}`);
    console.log(`  r4-1 "Why are rates up in Nashville?" after the RevPAR card: ${rr.repeat ? rr.content : rr.head.slice(0, 120)}`);
    // The bare note only when the repeated card has no new line.
    const t2 = new Thread(nash);
    await t2.ask("How has RevPAR moved here over the last 12 months?", "12m");
    const same = await t2.ask("What is the 12-month RevPAR trend?");
    check(same.content === NO_REPEAT_LINE, `r4-1 a plain repeat is the bare note: ${JSON.stringify(same.content)}`);
    // Advice repeat (scoped, no premise on screen): the decline line, then the card note.
    const t3 = new Thread(nash);
    await t3.ask("Should I buy?");
    const again = await t3.ask("Should I buy?");
    check(again.repeat && again.content === `We don't give buy or sell recommendations. ${CARD_ABOVE_LINE}`, `r4-1 advice repeat: ${JSON.stringify(again.content)}`);
    check((again.followUps ?? []).length === 3, `r4-1 advice repeat chips: ${(again.followUps ?? []).length}`);
  }
  {
    // r4-2/3. Premise figures: each clause names a period and a source; only the latest 12 months are weighed;
    // month-or-longer prints before single weeks; forecasts never count.
    const q2up = { ...fact("C&W Q2 2026: ADR $260 (+1.2%)", 20260630, "Cushman & Wakefield"), period: { start: 20260401, end: 20260630, label: "Q2 2026" } } as F;
    const fy25 = { ...fact("2025 full year: ADR $255 (−1.3%)", 20251231, "Nashville CVC"), period: { start: 20250101, end: 20251231, label: "2025" } } as F;
    const r = premiseCheck([q2up, fy25], "Why are rates up?", [], TODAY);
    check(r?.line === "ADR is up 1.2% in Q2 2026 (Cushman & Wakefield).", `r4-3 FY2025 −1.3% outside 12 months still weighed: ${r?.line}`);
    const rDown = premiseCheck([q2up, fy25], "Why are rates down?", [], TODAY);
    check(rDown?.line === "ADR is actually up 1.2% in Q2 2026 (Cushman & Wakefield).", `r4-3 "down" vs Q2 only: ${rDown?.line}`);
    const old = premiseCheck([fy25], "Why are rates up?", [], TODAY);
    check(old === null, `r4-3 only an older-than-12-months figure still produced a line: ${old?.line}`);
    const wk = { ...fact("CoStar wk ending Aug 8 2026: ADR $210 (−4.0%)", 20260808, "CoStar"), period: { start: 20260802, end: 20260808, label: "w/e Aug 8 2026" } } as F;
    const longFirst = premiseCheck([q2up, wk], "Why are rates up?", [], TODAY);
    check(longFirst?.line === "ADR is up 1.2% in Q2 2026 (Cushman & Wakefield).", `r4-3 a single off-screen week outweighed a quarter: ${longFirst?.line}`);
    const fc = { ...fact("2026 forecast: ADR (−2.0%)", 20261231, "Some forecaster"), period: { start: 20260101, end: 20261231, label: "2026" } } as F;
    check(premiseCheck([q2up, fc], "Why are rates up?", [], TODAY)?.line === "ADR is up 1.2% in Q2 2026 (Cushman & Wakefield).", "r4-2 a forecast counted as a figure");
    // Live: every premise clause, every market × metric × direction, carries "in/year to date … (source)".
    const CLAUSE = /(?:is|but) (?:actually )?(?:up|down) \d+(?:\.\d+)? ?(?:%|points?) (in [^()]+|year to date [^()]+) \(([^()]+)\)/g;
    let clauses = 0;
    const bad: string[] = [];
    for (const m of markets) for (const name of ["occupancy", "RevPAR", "ADR"]) for (const dir of ["down", "up"]) {
      const a = await card(`Why is ${name} ${dir} in ${shortName(m)}?`, null, null, "all");
      const pl = (a.brief as (Brief & { premise?: string }) | null)?.premise;
      if (!pl) continue;
      const parts = pl.replace(/^Mixed: /, "").split(/ but /);
      const got = [...pl.matchAll(CLAUSE)];
      clauses += got.length;
      if (got.length !== parts.length || got.some((g) => /\b20\d\d-\d\d-\d\d\b/.test(g[0]))) bad.push(pl);
    }
    check(bad.length === 0, `r4-2 premise clauses without a period or source (or with ISO dates): ${bad.slice(0, 4).join(" || ")}`);
    console.log(`  r4-2 premise clauses with period + source: ${clauses}`);
    // Fresh "Why is occupancy down?" (no card above): Mixed is fine; both figures cited.
    const fresh = await ask("Why is occupancy down?", nash, null);
    check(/^Mixed: occupancy is down 0\.2% in Q2 2026 \(Cushman & Wakefield\) but up 3\.2% year to date through Sep 12 2026 \(county data, roadgenius\.com\)\./.test(fresh.head), `r4-2 fresh occupancy-down: ${fresh.head.slice(0, 200)}`);
  }
  {
    // r4-4. Compare answers in the user's order (unscoped and scoped).
    const { inMentionOrder } = await import("@/lib/chat");
    for (const [q, scope] of [["Compare Nashville vs Charlotte", null], ["Compare Nashville vs Charlotte", { kind: "market", id: "charlotte" } as Scope], ["Charlotte vs Nashville", null], ["Nashville vs Charlotte", { kind: "market", id: "charlotte" } as Scope]] as const) {
      const t = await ask(q, scope, null);
      const first = /^Charlotte/.test(q) ? "Charlotte" : "Nashville";
      const second = first === "Nashville" ? "Charlotte" : "Nashville";
      const i1 = t.content.indexOf(first), i2 = t.content.indexOf(second);
      check(t.intent === "compare_markets" && t.head.startsWith(first) && i1 >= 0 && i2 > i1, `r4-4 ${JSON.stringify(q)}${scope ? " (scoped " + scope.id + ")" : ""}: leads with ${t.head.slice(0, 60)}`);
    }
    const ord = inMentionOrder("Austin, Atlanta and Charlotte", markets.filter((m) => ["charlotte", "atlanta", "austin"].includes(m.slug))).map((m) => m.slug);
    check(ord.join() === "austin,atlanta,charlotte", `r4-4 inMentionOrder: ${ord.join()}`);
  }
  {
    // r4 Dallas: card headed "Dallas"; each figure's area in its citation; no doubled name.
    const dl = await ask("How is Dallas doing?", null, null);
    check(dl.head.startsWith("Dallas:") && !/Dallas–Fort Worth/.test(dl.head), `r4 Dallas heading: ${dl.head.slice(0, 80)}`);
    const fw = await ask("How is Fort Worth doing?", null, null);
    check(fw.marketSlug === "dallas" && fw.head.startsWith("Dallas:"), `r4 Fort Worth → Dallas: ${fw.head.slice(0, 60)}`);
    check(/\(Cushman & Wakefield, Dallas market\)/.test(dl.head), `r4 Dallas lead figure area tag: ${dl.head.slice(0, 200)}`);
    const sup = await ask("What's the supply pipeline in Dallas?", null, null);
    check(sup.head.startsWith("Dallas supply: supply-pressure score") && !/Dallas–Fort Worth supply|supply: Dallas supply/.test(sup.head) && /Lodging Econometrics, Dallas market\)/.test(sup.head), `r4 Dallas supply headline: ${sup.head.slice(0, 160)}`);
    const all = new Map<string, string>();
    for (const q of ["How is Dallas doing?", "What's the supply pipeline in Dallas?", "What are the hotel tax collections in Dallas?", "How many visitors does Dallas get?", "Dallas debt and deals", "Dallas airport traffic", "What's the RevPAR and occupancy read for Dallas?"]) {
      const a = await card(q, null, null, "all");
      // Every figure citation on the card (headline + reads + sections; the "sources consulted" list is per signal, not per figure).
      const walk = (o: unknown): void => {
        if (!o || typeof o !== "object") return;
        if (Array.isArray(o)) return o.forEach(walk);
        const src = o as { label?: unknown; url?: unknown; area?: unknown };
        if (typeof src.url === "string" && typeof src.label === "string" && !all.get(src.url)) all.set(src.url, typeof src.area === "string" ? src.area : "");
        for (const [k, v] of Object.entries(o)) if (k !== "cited") walk(v);
      };
      walk(a.brief);
      if (/hotel tax/.test(q)) check(/City of Dallas — hotel-tax collections/.test(a.content) && !/Dallas–Fort Worth–Arlington MSA — hotel-tax/.test(a.content), `r4 Dallas tax memo heading: ${a.content.slice(0, 80)}`);
    }
    const want: [RegExp, string][] = [[/cushmanwakefield|costar|lodgingeconometrics/i, "Dallas market"], [/data\.texas\.gov|dallascityhall|visitdallas/i, "City of Dallas"], [/dfwairport|crosstimbersgazette|matthews/i, "DFW metro"]];
    for (const [url, area] of all) for (const [re, a] of want) if (re.test(url)) check(area === a, `r4 Dallas source ${url} tagged ${JSON.stringify(area)} (want ${a})`);
    console.log(`  r4 Dallas: ${dl.head.slice(0, 120)} · tagged sources ${[...all.values()].filter(Boolean).length}/${all.size}`);
  }
  {
    // r4 Chicago: no LinkedIn-sourced figure (CoStar's YTD-Aug +11.6% was only public as a LinkedIn post).
    for (const q of ["What's RevPAR in Chicago?", "How is Chicago doing?", "Chicago debt and deals", "What's the RevPAR and occupancy read for Chicago?", "Chicago visitation"]) {
      const j = JSON.stringify(await card(q, null, null, "all"));
      check(!/linkedin/i.test(j) && !j.includes("11.6%"), `r4 Chicago ${JSON.stringify(q)}: LinkedIn source or 11.6% figure`);
    }
    const t = new Thread(chicagoScope);
    const c = await t.ask("How has RevPAR moved here over the last 12 months?", "12m");
    check(!/linkedin/i.test(JSON.stringify(c)), "r4 Chicago scoped RevPAR card cites LinkedIn");
  }


  // ---- QA r4 → r5 (Eric, Nov 1 2026) ----
  console.log("QA r4 → r5:");
  {
    // r5-1. A set-aside week that backs the user is named in the line (real cited figures).
    const wkDown = await card("Why are rates down in Nashville?", null, null, "all");
    const pl = (wkDown.brief as (Brief & { premise?: string }) | null)?.premise ?? "";
    check(pl === "ADR is up 1.2% in Q2 2026 (Cushman & Wakefield), though the week ending Aug 8 was down 4.1% (CoStar).", `r5-1 though-line: ${pl}`);
    const rd = ((wkDown.brief as Brief | null)?.reads ?? []).map((r) => String(r.text ?? ""));
    check(rd.some((t) => /ADR −4\.1%/.test(t)) && rd.some((t) => /ADR \$186 \(\+1\.2%\)/.test(t)), `r5-1 both figures are cited reads: ${rd.join(" | ").slice(0, 200)}`);
    const q2 = { ...fact("C&W Q2 2026: ADR $186 (+1.2%)", 20260630, "Cushman & Wakefield"), period: { start: 20260401, end: 20260630, label: "Q2 2026" } } as F;
    const wk = { ...fact("CoStar wk ending Aug 8 2026: ADR $158 (−4.1%)", 20260808, "CoStar"), period: { start: 20260802, end: 20260808, label: "w/e Aug 8 2026" } } as F;
    // A single week only counts when it is on the card on screen (shown), as in r3-1.
    check(premiseCheck([q2, wk], "Why are rates down?", [wk], TODAY)?.line === "ADR is up 1.2% in Q2 2026 (Cushman & Wakefield), though the week ending Aug 8 was down 4.1% (CoStar).", `r5-1 unit: ${premiseCheck([q2, wk], "Why are rates down?", [wk], TODAY)?.line}`);
    check(premiseCheck([q2, wk], "Why are rates up?", [wk], TODAY)?.line === "ADR is up 1.2% in Q2 2026 (Cushman & Wakefield).", "r5-1 a week against the user is not mentioned");
    // Across markets: every "though" line names a week, its change and its source; never with "actually".
    let though = 0;
    for (const m of markets) for (const name of ["occupancy", "RevPAR", "ADR"]) for (const dir of ["down", "up"]) {
      const a = await card(`Why is ${name} ${dir} in ${shortName(m)}?`, null, null, "all");
      const p = (a.brief as (Brief & { premise?: string }) | null)?.premise ?? "";
      if (!/, though /.test(p)) continue;
      though++;
      check(/, though (the week ending [A-Z][a-z]{2} \d{1,2}(?:, 20\d\d)?|[A-Z][^,()]{2,40}) was (up|down) \d+(\.\d+)?(%| points) \([^()]+\)\.$/.test(p) && !/actually/.test(p) && new RegExp(`was ${dir} `).test(p), `r5-1 malformed though-line (or the week does not back the user): ${p}`);
    }
    console.log(`  r5-1 "Why are rates down in Nashville?": ${pl} (${though} though-lines across markets)`);
  }
  {
    // r5-2. Compare: Nashville's cited C&W Q2 2026 snapshot (OCC 71.7%, ADR $186: C&W MarketBeat U.S. Hospitality Q2 2026,
    // checked against the PDF); a peer with none says so for itself; "for each below" only when both have reads.
    const nc = await ask("Compare Nashville vs Charlotte", null, null);
    check(nc.head === "Nashville: OCC 71.7% (−0.2%), ADR $186 (+1.2%), RevPAR $133 (+1.0%) (Q2 2026, Cushman & Wakefield) · Charlotte: no cited occupancy/ADR snapshot on file.", `r5-2 Nashville vs Charlotte: ${nc.head}`);
    check(!/for either|for each below/.test(nc.content), "r5-2 'for either' / 'for each below' still shown");
    check(((nc.brief as Brief | null)?.reads ?? []).some((r) => /OCC 71\.7% \(−0\.2%\), ADR \$186/.test(String(r.text ?? ""))), "r5-2 Nashville snapshot is not a cited read");
    const cn = await ask("Charlotte vs Nashville", null, null);
    check(cn.head.startsWith("Charlotte: no cited occupancy/ADR snapshot on file · Nashville: OCC 71.7%"), `r5-2 order kept: ${cn.head.slice(0, 120)}`);
    const na = await ask("Compare Nashville vs Atlanta", null, null);
    check(/^Nashville: OCC 71\.7% .* · Atlanta: OCC 65\.9% \(\+0\.5%\), ADR \$133 \(\+5\.0%\), RevPAR \$88 \(\+5\.5%\) \(Q2 2026, Cushman & Wakefield\)\.$/.test(na.head), `r5-2 Nashville vs Atlanta: ${na.head}`);
    const ac = await ask("Austin vs Charlotte", null, null);
    const acReads = ((ac.brief as Brief | null)?.reads ?? []).map((r) => String(r.text ?? ""));
    const both = acReads.some((t) => t.startsWith("Austin:")) && acReads.some((t) => t.startsWith("Charlotte:"));
    check(/^Austin vs Charlotte: no cited occupancy\/ADR snapshot on file for either\./.test(ac.head) && /Cited reads for each below/.test(ac.head) === both, `r5-2 neither: ${ac.head} (reads for both: ${both})`);
    for (const m of markets.slice(0, 55)) {
      const t = await card(`Compare ${shortName(m)} vs Nashville`, null, null, "all");
      const h = (t.brief as Brief | null)?.answer ?? "";
      check(!/no cited OCC\/ADR snapshot/.test(h) && !(/for each below/i.test(h) && !(t.brief as Brief | null)?.reads?.length), `r5-2 ${m.slug} vs Nashville: ${h.slice(0, 120)}`);
    }
    console.log(`  r5-2 ${nc.head}`);
  }
  {
    // r5-3/4. Dallas tax memo: citations grouped by area; the Arlington row tagged; the caveat said once.
    const t = await card("What are the hotel tax collections in Dallas?", null, null, "all");
    const cites = (t as { citations?: string[] }).citations ?? [];
    check(cites.length > 0 && cites.every((c) => /^(City of Dallas|City of Arlington|Dallas market|DFW metro|Other sources): /.test(c)), `r5-3 citations not grouped by area: ${JSON.stringify(cites)}`);
    const cod = cites.find((c) => c.startsWith("City of Dallas: ")) ?? "";
    check(!/fortworthreport|Real Deal|tradersunion/.test(cod), `r5-3 outside sources under City of Dallas: ${cod}`);
    // r6b (Eric r6 QA): each publisher in one group; fortworthreport.org covers more than one area → Other sources.
    check(cites.filter((c) => /fortworthreport\.org/.test(c)).length === 1 && cites.some((c) => c.startsWith("Other sources: ") && /fortworthreport\.org/.test(c)), `r5-3/r6b fortworthreport.org group: ${JSON.stringify(cites)}`);
    check(/Arlington June 2026 HOT: \$31M \(\+39%, all-time record\) · Jun 2026 \(City of Arlington\)/.test(t.content), "r5-3 Arlington $31M row not tagged City of Arlington");
    check(((t.content.match(/_Basis & caveats:_[^]*?(?=_Gaps:_|\n|$)/)?.[0] ?? "").match(/self-reported/gi) ?? []).length === 1, `r5-4 'self-reported' repeated in the caveat: ${t.content.match(/_Basis & caveats:_[^\n]*/)?.[0]}`);
    check(/_Basis & caveats:_ Self-reported\. The reporting year is set by the filer and may follow the city FY \(Oct–Sep\)\./.test(t.content), `r5-4 caveat: ${t.content.match(/_Basis & caveats:_[^\n]*/)?.[0]?.slice(0, 160)}`);
    check(/\(2026-09-28; source: Texas Comptroller hotel occupancy tax data \(Local HOT Reporting, FY2025\) → https:\/\/data\.texas\.gov\/dataset\/Local-Hotel-Occupancy-Tax-Reporting-2025\/er34-v24h\)/.test(t.content) && !/\/workspace|msa-registry|\(D3\)|SODA/.test(t.content), "r5 must-fix: Dallas registry row not replaced by the public Comptroller citation");
    const { dedupeClauses } = await import("@/lib/chat");
    check(dedupeClauses("self-reported; reporting year set by filer. Self-reported; the reporting year is set by the filer and may follow the city FY (Oct–Sep). State 6% not included.") === "Self-reported. The reporting year is set by the filer and may follow the city FY (Oct–Sep). State 6% not included.", "r5-4 dedupeClauses unit");
    check(dedupeClauses("OCC 70%; ADR $150. RevPAR $105.") === "OCC 70%; ADR $150. RevPAR $105.", "r5-4 dedupeClauses keeps distinct clauses");
  }
  {
    // r5-5. One date on the rates card.
    const so = await ask("Why is SOFR up?", null, null);
    check(so.head === "SOFR 3.88% (Oct 16, 2026, FRED).", `r5-5 SOFR: ${so.head}`);
    const ty = await ask("Where is the 10-year Treasury?", null, null);
    check(/^US 10-year Treasury \d+\.\d+% \(Oct 16, 2026 close, U\.S\. Treasury par yield curve\)\.$/.test(ty.head), `r5-5 10-year: ${ty.head}`);
    // r5-6. Lodging Econometrics rows keep their own titles (no two reads titled "Total pipeline").
    const sp = await card("What's the supply pipeline in Dallas?", null, null, "all");
    const titles = ((sp.brief as Brief | null)?.reads ?? []).map((r) => (r as { source?: { title?: string; url?: string } }).source).filter((x) => x?.url && /lodgingeconometrics/.test(x.url)).map((x) => x!.title);
    check(titles.length >= 2 && new Set(titles).size === titles.length && !titles.includes("Total pipeline"), `r5-6 LE read titles: ${JSON.stringify(titles)}`);
    console.log(`  r5-5 ${so.head} · ${ty.head} · r5-6 LE titles ${JSON.stringify(titles)}`);
  }

  // ---- r6 (Hal, Nov 2 2026) + QA r5 → r6 (Eric) ----
  console.log("r6:");
  {
    // r6-1. Fed policy questions lead with the target range and the latest FOMC decision (data layer: src/data/fed-policy.json,
    // checked against FRED DFEDTARU/DFEDTARL and the Oct 28 2026 FOMC statement); the 10-year is a labeled market-rate bullet; no forecast.
    const { isFedPolicyQuestion } = await import("@/lib/fed-policy");
    for (const q of ["Is the Fed cutting rates?", "Will the Fed hike?", "What did the FOMC do?", "Where is the fed funds rate?", "Are rate cuts coming?", "What's the Federal Reserve policy rate?"]) check(isFedPolicyQuestion(q), `r6-1 not a Fed question: ${q}`);
    for (const q of ["Why is SOFR up?", "Where is the 10-year Treasury?", "Why are room rates up?", "What are mortgage rates?", "What's the hotel tax rate in Dallas?", "Are cap rates falling?"]) check(!isFedPolicyQuestion(q), `r6-1 wrongly a Fed question: ${q}`);
    const FED_HEAD = "Fed funds target range: 3.75–4.00% (as of Nov 1, 2026, FRED). Latest FOMC decision, Oct 28, 2026: held the range; the last change was a 0.25-point increase on Sep 16, 2026 (Federal Reserve).";
    const FORECAST = /\b(will (?:cut|hike|raise|lower)|expected to|likely|forecast|odds|probabilit|futures|next meeting|we expect|should cut)\b/i;
    for (const [q, scope] of [["Is the Fed cutting rates?", null], ["Will the Fed cut rates?", null], ["Is the Fed cutting rates?", { kind: "market", id: "nashville" }]] as [string, Scope | null][]) {
      const f = await ask(q, scope, null);
      check(f.head === FED_HEAD, `r6-1 Fed head (${q}, ${scope?.id ?? "unscoped"}): ${f.head}`);
      const reads = (f.brief?.reads ?? []).map((r) => String(r.text ?? ""));
      // r6b: the FRED range bullet (linked to the series page) first, then the latest decision, then the 10-year with one date.
      check(reads[0] === "FRED DFEDTARU / DFEDTARL: fed funds target range 3.75–4.00% (upper 4.00%, lower 3.75%)", `r6b FRED bullet: ${reads[0]}`);
      check((f.brief as { reads?: { source?: { url?: string } }[] } | null)?.reads?.[0]?.source?.url === "https://fred.stlouisfed.org/series/DFEDTARU", "r6b FRED bullet links the DFEDTARU series page");
      check(/^FOMC Oct 28, 2026: held the target range at 3\.75–4\.00% \(vote 10–2\)/.test(reads[1] ?? ""), `r6-1 decision read: ${reads[1]}`);
      check(/^Market rate, not Fed policy: US 10-year Treasury \d+\.\d+% \(Oct 16, 2026 close\)$/.test(reads[2] ?? ""), `r6b 10-year one date: ${reads[2]}`);
      check(!/Debt & deals/.test(f.content) && ((f.brief as { sections?: { title: string }[] } | null)?.sections ?? []).every((x) => x.title === "Sources"), "r6b Fed card carries no Debt & deals section");
      check(!/We don't forecast/.test(f.content) || /^Will/.test(q), `r6b no-forecast line only on forecast questions (${q})`);
      const said = f.content.replace(/\bno forecast\b|We don't forecast Fed decisions\. The next FOMC meeting is [^.]*\./gi, "");
      check(!FORECAST.test(said), `r6-1 forecast wording: ${said.match(new RegExp(`.{0,60}(?:${FORECAST.source}).{0,40}`, "i"))?.[0]}`);
      check(/no forecast/.test(f.content), "r6-1 coverage note says no forecast");
      const fc = await card(q, scope, null, "all");
      const cites = (fc as { citations?: string[] }).citations ?? [];
      check(cites.includes("Federal Reserve") && cites.some((c) => /^FRED/.test(c)) && !cites.some((c) => /Bungah/.test(c)), `r6-1 citations: ${JSON.stringify(cites)}`);
      const urls = JSON.stringify(fc);
      check(/federalreserve\.gov\/newsevents\/pressreleases\/monetary20261028a\.htm/.test(urls) && /fred\.stlouisfed\.org\/series\/DFEDTAR[UL]/.test(urls), "r6-1 FOMC / FRED links missing");
    }
    const so = await ask("Why is SOFR up?", null, null);
    check(so.head === "SOFR 3.88% (Oct 16, 2026, FRED).", `r6-1 SOFR unchanged: ${so.head}`);
    // r6b-6. Fed forecast questions: no forecast, the next scheduled meeting (federalreserve.gov calendar: "December 8-9*",
    // checked Nov 2 2026), then the card.
    const { isFedForecastQuestion, fedForecastLine, nextFomcMeeting } = await import("@/lib/fed-policy");
    const LINE = "We don't forecast Fed decisions. The next FOMC meeting is Dec 8–9, 2026 (Federal Reserve FOMC calendar).";
    for (const q of ["Will the Fed cut in December?", "Will the Fed cut rates?", "What are the odds of a Fed rate cut?", "Is the FOMC likely to hike at the next meeting?", "Will the Fed cut in 2027?"]) {
      check(isFedForecastQuestion(q), `r6b-6 not a forecast question: ${q}`);
      const t = await ask(q, null, null);
      check(t.content.startsWith(`${LINE}\n\n${FED_HEAD}`), `r6b-6 forecast opening (${q}): ${t.content.slice(0, 200)}`);
      check((t.brief?.reads ?? []).length === 3, `r6b-6 full card after the line (${q}): ${(t.brief?.reads ?? []).length} reads`);
      const said = t.content.replace(/\bno forecast\b|We don't forecast/gi, "");
      check(!FORECAST.test(said), `r6b-6 forecast wording (${q})`);
      const tc = await card(q, null, null, "all");
      check(((tc as { citations?: string[] }).citations ?? []).includes("Federal Reserve, FOMC meeting calendar") && /fomccalendars\.htm/.test(JSON.stringify(tc)), `r6b-6 calendar cited (${q})`);
    }
    for (const q of ["Is the Fed cutting rates?", "What did the FOMC do?", "Where is the fed funds rate?"]) check(!isFedForecastQuestion(q), `r6b-6 wrongly a forecast question: ${q}`);
    check(fedForecastLine("2026-11-02") === LINE && fedForecastLine("2026-12-09") === LINE && fedForecastLine("2026-12-10") === "We don't forecast Fed decisions." && nextFomcMeeting("2026-12-10") === null, "r6b-6 next meeting by date");
    console.log(`  r6-1 ${FED_HEAD}`);
  }
  {
    // r6-2. Visitor headlines lead with the latest full period (annual / 12 months); a single event week is a labeled bullet.
    const dv = await ask("How many visitors does Dallas get?", null, null);
    check(dv.head === "Dallas: visitors 2024: 27.7M (record); $10.9B economic impact; $649M state/local tax (dallasexaminer.com, City of Dallas).", `r6-2 Dallas head: ${dv.head}`);
    const dr = (dv.brief?.reads ?? []).map((r) => String(r.text ?? ""));
    check(dr.some((t) => /^Event week: CoStar week ending 2026-07-18 \(WC semifinal\)/.test(t)), `r6-2 Dallas event-week bullet: ${dr.join(" | ").slice(0, 300)}`);
    check(!/semifinal|week ending/i.test(dv.head), "r6-2 Dallas head still an event week");
    const { marketFacts, visitorHead, isEventPrint } = await import("@/lib/chat-brief-build");
    const heads: string[] = [];
    for (const m of markets) {
      const vh = visitorHead(marketFacts(m as never));
      if (vh) check(!isEventPrint(vh), `r6-2 ${m.slug} visitor head is an event print: ${vh.text.slice(0, 100)}`);
      const a = await ask(`How many visitors does ${shortName(m)} get?`, null, null);
      check(!/\bweek ending\b|\bw\/e\b|semifinal|room nights/i.test(a.head), `r6-2 ${m.slug} visitor headline leads with an event: ${a.head.slice(0, 140)}`);
      if (vh) heads.push(`${m.slug}: ${a.head.slice(0, 70)}`);
    }
    console.log(`  r6-2 ${dv.head} · ${heads.length} markets with a full-period visitor head`);
    // r6b-1. A state figure never leads a market's visitor answer: Atlanta leads with its own (ACVB) count; Georgia statewide is a "Statewide:" bullet.
    const { isStateFigure, marketBrief } = await import("@/lib/chat-brief-build");
    const at = await ask("How many visitors does Atlanta get?", null, null);
    check(/^Atlanta: visitors 2024 \(latest ACVB\): ~51M/.test(at.head) && !isStateFigure({ text: at.head.replace(/^Atlanta: /, "") }), `r6b-1 Atlanta head: ${at.head}`);
    check((at.brief?.reads ?? []).some((r) => /^Statewide: Georgia statewide visitors 2025: 175\.6M/.test(String(r.text ?? ""))), `r6b-1 Statewide bullet: ${(at.brief?.reads ?? []).map((r) => r.text).join(" | ").slice(0, 300)}`);
    const atd = await ask("What's demand doing in Atlanta?", null, null);
    check(!/statewide/i.test(atd.head), `r6b-1 Atlanta demand head: ${atd.head}`);
    // With no city or metro count on file, the answer says so and the state figure is the Statewide bullet.
    const atl = markets.find((m) => m.slug === "atlanta")!;
    // The same graph minus the ACVB city clause (the row's other clauses, incl. Georgia statewide, stay).
    const noCity = { ...atl, signals: atl.signals.map((x) => ({ ...x, body: x.body.replace(/Atlanta visitors 2024 \(latest ACVB\)[^|]*\|\s*/, "") })) };
    const nb = marketBrief(noCity as never, "demand_drivers" as never, { question: "How many visitors does Atlanta get?" });
    check(nb.answer === "Atlanta: no cited city or metro visitor count on file." && /^Statewide: Georgia statewide visitors 2025: 175\.6M/.test(nb.reads[0]?.text ?? ""), `r6b-1 no-city answer: ${nb.answer} | ${nb.reads[0]?.text}`);
    for (const m of markets) {
      const vh = visitorHead(marketFacts(m as never));
      if (vh) check(!isStateFigure(vh), `r6b-1 ${m.slug} visitor head is a state figure: ${vh.text.slice(0, 100)}`);
    }
  }
  {
    // QA r5 must-fix: rule / methodology rows never render as answer rows or citations; our own site is never a source.
    const RULE = /\(rule\b|Do not (?:overwrite|invent|underwrite)|seed lodging metrics|licensed STR|Never underwrite|Decision-support rule|do not (?:add|fold) into/i;
    for (const slug of ["austin", "houston", "san-antonio", "dallas", "orlando", "chicago", "miami", "new-york-city", "washington-dc", "nashville", "phoenix", "san-diego", "las-vegas"]) {
      for (const q of ["What are the hotel tax collections in {m}?", "How is {m} doing?", "Is there a staffing greenlight in {m}?"]) {
        const m = markets.find((x) => x.slug === slug)!;
        const a = await card(q.replace("{m}", shortName(m)), null, null, "all");
        const all = JSON.stringify(a);
        check(!RULE.test(all), `r6 must-fix ${slug} rule text (${q}): ${all.match(new RegExp(`.{0,60}(?:${RULE.source}).{0,60}`, "i"))?.[0]}`);
        check(!/Bungah Capital Intel/.test(JSON.stringify((a as { citations?: string[] }).citations ?? [])) && !/"label":"Bungah/.test(all), `r6 must-fix ${slug} own site cited (${q})`);
      }
    }
    const au = await card("What are the hotel tax collections in Austin?", null, null, "all");
    check(/Texas Comptroller/.test(JSON.stringify((au as { citations?: string[] }).citations ?? [])), `r6 must-fix Austin cites the Comptroller: ${JSON.stringify((au as { citations?: string[] }).citations)}`);
    check(/\(separate base\)/.test(au.content), "r6 must-fix Austin Ch.334 row keeps '(separate base)'");
  }
  {
    // QA r5 should-fixes.
    const { TAX_AREA } = await import("@/lib/chat");
    // 5/6. Tax answers headed by the taxing area (city vs MSA), heading on its own line, one row per line, newest first.
    let headed = 0;
    for (const m of markets) {
      const t = await card(`What are the hotel tax collections in ${shortName(m)}?`, null, null, "all");
      const blocks = t.content.split(/\n{2,}/);
      const first = blocks[0] ?? "";
      if (!/hotel-tax/.test(first)) continue;
      headed++;
      const own = TAX_AREA[m.slug];
      if (own) check(first.startsWith(`**${own} — `), `r6-s5 ${m.slug} heading: ${first}`);
      check(!/\bMSA\b|Metropolitan|–[A-Z][a-z]+, [A-Z]{2}/.test(first) || !own, `r6-s5 ${m.slug} MSA heading: ${first}`);
      check(!first.includes("\n"), `r6-s6 ${m.slug} heading not on its own line`);
      const list = blocks.find((b) => b.startsWith("- "));
      if (list) {
        const rows = list.split("\n");
        check(rows.every((r) => r.startsWith("- ")), `r6-s6 ${m.slug} a row is not on its own line`);
        // The period's end year (the latest year in the row title: "FY2026 (Jul 2025–Jun 2026)" → 2026).
        const years = rows.map((r) => Math.max(0, ...[...(r.match(/^- \*\*([^*]*)\*\*/)?.[1] ?? "").matchAll(/\b(20\d\d)\b/g)].map((x) => Number(x[1])))).filter(Boolean);
        check(years.every((y, i) => i === 0 || y <= years[i - 1]), `r6-s6 ${m.slug} rows not newest first: ${years.join(",")}`);
      }
      const rel = blocks.findIndex((b) => b === "Related tax / CVB signals:");
      if (rel >= 0) check((blocks[rel + 1] ?? "").split("\n").every((r) => r.startsWith("- ")), `r6-s6 ${m.slug} related rows not one per line`);
    }
    check(headed >= 15, `r6-s5 only ${headed} tax memos`);
    const dt = await card("What are the hotel tax collections in Dallas?", null, null, "all");
    // 2. World Cup HVS row covers Dallas/Arlington/Fort Worth.
    check(/no Cup oversupply \(DFW metro\)\./.test(dt.content) && !/Cup oversupply \(City of Arlington\)/.test(dt.content), "r6-s2 World Cup row not tagged DFW metro");
    // 3. No self-referential source; the tag stays inside the sentence.
    check(!/source: no public read/.test(dt.content) && /lodging DQ cut: no public read \(Dallas market\)\./.test(dt.content), "r6-s3 dangling 'no public read' source");
    // r6b-3. Every tax market: 'self-reported' at most once (Houston said it on every row).
    for (const m of markets) {
      const tx = await card(`What are the hotel tax collections in ${shortName(m)}?`, null, null, "all");
      check((tx.content.match(/self-reported/gi) ?? []).length <= 1, `r6b-3 ${m.slug} self-reported ×${(tx.content.match(/self-reported/gi) ?? []).length}`);
    }
    const hx = await card("What are the hotel tax collections in Houston?", null, null, "all");
    check(!/·\s*self-reported/.test(hx.content) && /_Basis & caveats:_ Self-reported by the city/.test(hx.content), "r6b-3 Houston: once, in Basis & caveats");
    // 7. 'Self-reported' only in the caveat.
    check((dt.content.match(/self-reported/gi) ?? []).length === 1 && /_Basis & caveats:_ Self-reported\./.test(dt.content), `r6-s7 self-reported count: ${(dt.content.match(/self-reported/gi) ?? []).length}`);
    // 1. Detail-view citations grouped by area (the card's citations, as the detail view shows them).
    const dd = await card("How is Dallas doing?", null, null, "all");
    const dc = (dd as { citations?: string[] }).citations ?? [];
    check(dc.length > 0 && dc.every((c) => /^(City of Dallas|City of Arlington|Dallas market|DFW metro|Other sources): /.test(c)), `r6-s1 Dallas detail citations: ${JSON.stringify(dc)}`);
    // r6b-2. No "No linked public source" citation; each publisher in one group only (every market, both cards).
    for (const m of markets)
      for (const q of [`How is ${shortName(m)} doing?`, `What are the hotel tax collections in ${shortName(m)}?`]) {
        const c = ((await card(q, null, null, "all")) as { citations?: string[] }).citations ?? [];
        check(!c.some((x) => /No linked public source/i.test(x)), `r6b-2 ${m.slug} 'No linked public source' cited (${q})`);
        const grouped = c.filter((x) => /^[^:]{1,60}: /.test(x) && !/https?:/.test(x));
        if (grouped.length === c.length && c.length > 1) {
          const seen = new Map<string, string>();
          for (const g of grouped) {
            const [area, pubs] = [g.slice(0, g.indexOf(": ")), g.slice(g.indexOf(": ") + 2)];
            for (const p of pubs.split(" · ")) {
              check(!seen.has(p) || seen.get(p) === area, `r6b-2 ${m.slug} ${p} in two groups (${seen.get(p)}, ${area})`);
              seen.set(p, area);
            }
          }
        }
      }
    // 4. The hidden list key no longer carries the label ("(registry)").
    const sl = (await import("node:fs")).readFileSync(new URL("../../src/components/SourceLinks.tsx", import.meta.url), "utf8");
    check(!/key=\{[^}]*\.label/.test(sl) && /key=\{`\$\{l\.url\}\|\$\{i\}`\}/.test(sl), "r6-s4 SourceLinks key still uses the label");
    console.log(`  r6-s ${headed} tax memos; Dallas detail citations ${JSON.stringify(dc).slice(0, 160)}`);
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
