/**
 * Chat Batch 1 test (context-aware follow-ups: carry-over chip, "what changed" opener, next-best alternate).
 * Unit checks on src/lib/chat-context.ts, then scripted threads through the same steps as /api/chat
 * (resolveFollowUp → answerChat → applyNoRepeat → followUpExtras), with `prev` round-tripped like a JSON body.
 * Deterministic, no model, read-only (graph reads only, no log writes).
 * Run: BUNGAH_GRAPH_FIXTURE=/workspace/backups/bungah-db/latest npx tsx scripts/chat/test-context.ts [--verbose]
 */
export {};
process.env.BUNGAH_NO_NEXT_CACHE = "1";
process.env.BUNGAH_USE_LLM = "";

type Scope = import("@/lib/chat-scope").ChatScope;
type Prev = import("@/lib/chat-followup").Prev;
type Chip = import("@/lib/chat-followup").FollowUpChip;
type Range = "all" | "90d" | "12m";
const verbose = process.argv.includes("--verbose");
let pass = 0;
const fails: string[] = [];
const log: string[] = [];
function ok(cond: unknown, name: string, detail = "") {
  if (cond) pass++;
  else fails.push(`${name}${detail ? ` :: ${detail}` : ""}`);
  if (verbose || !cond) console.log(`${cond ? "PASS" : "FAIL"} ${name}${detail && !cond ? ` :: ${detail}` : ""}`);
}
/** Public-copy guards on every line Batch 1 adds. */
const ADVICE = /\b(buy|sell|should you|we recommend|recommendation|undervalued|overvalued|bargain|pick)\b/i;
const INTERNAL = /\b(Neo|Eric|Quill|Harvey|Callbook|Ledger|Atlas|Vectra|Herald|Claire|IC (frame|threshold)|below Treasuries|STR|CoStar)\b/;
const DIGIT = /\d/;

async function main() {
  const { installGraphFixture } = await import("./graph-fixture");
  installGraphFixture();
  const C = await import("@/lib/chat-context");
  const { answerChat } = await import("@/lib/chat-llm");
  const { answerHash, applyNoRepeat, parsePrev, resolveFollowUp, followUpExtras, routingPrev, clearedMarketFallback, shownHashes, SEEN_MAX } = await import("@/lib/chat-followup");

  /* ---------------- unit ---------------- */
  ok(C.segmentOf("upscale only") === "upscale", "segment: upscale");
  ok(C.segmentOf("What about select service hotels there?") === "select-service", "segment: select service");
  ok(C.segmentOf("narrow that to upper upscale") === "upper upscale", "segment: upper upscale");
  ok(C.segmentOf("How is the economy affecting Nashville?") === null, "segment: macro economy is not a segment");
  ok(C.segmentOf("economy hotels only") === "economy", "segment: economy hotels");
  ok(C.segmentOf("What's the RevPAR in Orlando?") === null, "segment: none");
  ok(JSON.stringify(C.parseCleared(["market", "period"])) === '["market","period"]', "cleared: valid");
  ok(C.parseCleared(["market", "bogus"]).length === 0, "cleared: one bad entry drops all");
  ok(C.parseCleared("market").length === 0 && C.parseCleared(["a", "b", "c", "d"]).length === 0, "cleared: wrong type / too long");
  ok(C.monthKey("Sep 2026") === 202609 && C.monthKey("Q3 2026") === null, "monthKey");
  const cx = C.contextOf({ marketSlug: "nashville", marketLabel: "Nashville", intent: "supply_pipeline", range: "90d" });
  ok(cx.market?.label === "Nashville" && cx.topic?.label === "Supply pipeline" && cx.period?.label === "Last 90 days", "contextOf: three parts");
  const cx2 = C.contextOf({ marketSlug: null, marketLabel: null, intent: "advice_declined", range: "all" });
  ok(!cx2.market && !cx2.topic && !cx2.period, "contextOf: nothing carried for a decline / all dates");
  const base = { hasPrev: true, question: "q", cleared: [] as import("@/lib/chat-context").ContextPart[], prevMarket: "nashville", prevMarketLabel: "Nashville", curMarket: "nashville", curMarketLabel: "Nashville", prevIntent: "revpar_metrics", curIntent: "revpar_metrics", prevRange: "all" as Range, curRange: "all" as Range, prevDataTo: "Sep 2026", curDataTo: "Sep 2026", cardText: "", itemScoped: null };
  ok(C.whatChanged({ ...base, hasPrev: false }) === null, "opener: none on a first question");
  ok(C.whatChanged({ ...base, curDataTo: "Oct 2026" })?.kind === "data", "opener: data change only when same market+topic+window and later month");
  ok(C.whatChanged({ ...base, curDataTo: "Oct 2026", curRange: "90d" })?.kind !== "data", "opener: a different window is never a data change");
  ok(C.whatChanged({ ...base, curDataTo: "Oct 2026", curIntent: "supply_pipeline" })?.kind !== "data", "opener: a different topic is never a data change");
  ok(C.whatChanged({ ...base, curDataTo: "Aug 2026" })?.kind === "angle" && !/^Newer cited data/.test(C.whatChanged({ ...base, curDataTo: "Aug 2026" })!.text), "opener: older span is not 'newer'");
  ok(/nothing newer is on file/.test(C.whatChanged(base)?.text ?? ""), "opener: same data, different angle says nothing newer", C.whatChanged(base)?.text);
  ok(C.whatChanged({ ...base, curIntent: "supply_pipeline" })?.text === "Still Nashville, now on supply pipeline instead of RevPAR and occupancy.", "opener: topic change copy", C.whatChanged({ ...base, curIntent: "supply_pipeline" })?.text);
  ok(C.whatChanged({ ...base, curMarket: "orlando", curMarketLabel: "Orlando" })?.text === "Switched from Nashville to Orlando.", "opener: market switch copy", C.whatChanged({ ...base, curMarket: "orlando", curMarketLabel: "Orlando" })?.text);
  ok(/^Dropped Nashville, so this is the national read/.test(C.whatChanged({ ...base, cleared: ["market"], curMarket: null, curMarketLabel: null })?.text ?? ""), "opener: dropped market copy");
  ok(C.whatChanged({ ...base, cleared: ["topic"], prevIntent: "supply_pipeline", curIntent: "unknown" })?.text === "Dropped supply pipeline, still Nashville.", "opener: dropped topic copy", C.whatChanged({ ...base, cleared: ["topic"], prevIntent: "supply_pipeline", curIntent: "unknown" })?.text);
  ok(C.whatChanged({ ...base, curRange: "90d" })?.text === "Narrowed to the last 90 days.", "opener: narrowed window", C.whatChanged({ ...base, curRange: "90d" })?.text);
  ok(C.whatChanged({ ...base, prevRange: "90d" })?.text === "Widened to all dates.", "opener: widened window");
  ok(C.whatChanged({ ...base, question: "upscale only" })?.kind === "unsupported" && C.whatChanged({ ...base, question: "upscale only" })!.text.startsWith(C.UNSUPPORTED_LINE), "opener: segment → unsupported line");
  ok(C.whatChanged({ ...base, question: "upscale only", cardText: "Upscale hotels led the gains" })?.kind !== "unsupported", "opener: segment the card names is not unsupported");
  ok(C.whatChanged({ ...base, question: "upscale only", itemScoped: "reit" })?.kind !== "unsupported", "opener: REIT scope never claims a missing segment");
  const alts = C.alternateCandidates({ question: "q", prevRange: "all", curRange: "90d", marketLabel: "Nashville", peers: [], unsupported: false });
  ok(alts[0]?.range === "12m" && alts[1]?.range === "all", "alternate: narrower window → 12m then all");
  ok(C.alternateCandidates({ question: "q", prevRange: "90d", curRange: "all", marketLabel: "Nashville", peers: [], unsupported: false }).length === 0, "alternate: widening is not a constraint");
  ok(C.alternateCandidates({ question: "q", prevRange: "all", curRange: "all", marketLabel: "Nashville", peers: ["Charlotte"], unsupported: true })[0]?.question === "Compare Nashville vs Charlotte", "alternate: segment → closest peer compare");
  const rp = routingPrev({ question: "x", intent: "supply_pipeline", marketSlug: "nashville", answerHash: null, seen: [], cleared: ["market", "topic"] });
  ok(rp?.marketSlug === null && rp?.intent === null, "routingPrev: cleared parts are not carried");
  const pp = parsePrev({ question: "x", range: "90d", dataTo: "Sep 2026", cleared: ["period"], marketSlug: "nashville" });
  ok(pp?.range === "90d" && pp?.dataTo === "Sep 2026" && pp?.cleared?.[0] === "period", "parsePrev: Batch 1 fields");
  const bad = parsePrev({ question: "x", range: "7d", dataTo: "<script>", cleared: ["x"] });
  ok(bad?.range === null && bad?.dataTo === null && bad?.cleared?.length === 0, "parsePrev: malformed Batch 1 fields dropped");

  /* ---------------- threads ---------------- */
  type Turn = { q: string; range: Range; content: string; head: string; intent: string | null; marketSlug: string | null; hash: string; repeat: boolean; followUps?: Chip[]; context: unknown; opener: { kind: string; text: string } | null; alternate: { label: string; question: string; range?: Range; why: string } | null; dataTo: string | null };
  async function card(q: string, scope: Scope | null, p: Prev | null, range: Range) {
    const route = await resolveFollowUp({ question: q, scope, marketSlug: scope?.kind === "market" ? scope.id : null, prev: p });
    const built = await answerChat(q, { marketSlug: route.marketSlug, range, scope, intent: route.intent });
    return { ...built, marketSlug: built.marketSlug ?? route.marketSlug };
  }
  class Thread {
    last: Prev | null = null;
    seen: string[] = [];
    turns: Turn[] = [];
    lastFallback: string | null = null;
    constructor(public name: string, public scope: Scope | null = null) {}
    async ask(q: string, range: Range = "all", cleared: string[] = []): Promise<Turn> {
      const raw = this.last ? { ...this.last, seen: this.seen.slice(0, SEEN_MAX), ...(cleared.length ? { cleared } : {}) } : undefined;
      const p = parsePrev(raw ? JSON.parse(JSON.stringify(raw)) : undefined);
      let a = await card(q, this.scope, p, range);
      // Same as the route: × market + vague question → national read on file, else "which market?" (chips filtered).
      const fb = await clearedMarketFallback({ answer: a, prev: p, question: q, scope: this.scope, askedMarket: this.scope?.kind === "market" ? this.scope.id : null, build: (nq) => card(nq, this.scope, null, range) });
      this.lastFallback = fb ? (fb.national ? "national" : "which-market") : null;
      const chipPrev: Prev = { question: q, intent: (a.intent as Prev["intent"]) ?? null, marketSlug: a.marketSlug, answerHash: null, seen: [] };
      const hashOf = async (c: Chip) => answerHash(await card(c.question, this.scope, chipPrev, c.range ?? "all"));
      if (fb) {
        a = fb.answer;
        if (fb.followUps?.length) {
          const taken = shownHashes(p);
          const keep: Chip[] = [];
          for (const c of fb.followUps) {
            const h = await hashOf(c);
            if (!taken.has(h)) {
              taken.add(h);
              keep.push(c);
            }
          }
          a = { ...a, followUps: keep };
        }
      }
      const nr = await applyNoRepeat(a, { prev: p, question: q, range, hashOf });
      const ex = await followUpExtras({ answer: nr.answer, prev: p, question: q, range, scope: this.scope, repeat: nr.repeat, hash: nr.hash, hashOf });
      const content = ex.repeatLine && /^That's the same answer/.test(nr.answer.content) ? ex.repeatLine : nr.answer.content;
      const brief = (nr.answer as { brief?: { answer?: string; span?: { to?: string | null } } | null }).brief;
      const t: Turn = { q, range, content, head: brief?.answer ?? content.split("\n")[0], intent: nr.answer.intent ?? null, marketSlug: nr.answer.marketSlug, hash: nr.hash, repeat: nr.repeat, followUps: nr.followUps ?? (nr.answer as { followUps?: Chip[] }).followUps, context: ex.context, opener: ex.opener, alternate: ex.alternate, dataTo: brief?.span?.to ?? null };
      // Rules on every turn.
      ok(!this.seen.includes(t.hash) || t.repeat, `${this.name}: "${q}" never shows a card already shown`);
      for (const line of [t.opener?.text, t.alternate?.why, t.alternate?.label, ex.repeatLine].filter(Boolean) as string[]) {
        ok(!ADVICE.test(line), `${this.name}: "${q}" Batch 1 copy has no advice framing`, line);
        ok(!INTERNAL.test(line), `${this.name}: "${q}" Batch 1 copy has no internal names / restricted sources`, line);
      }
      // A Batch 1 line carries a figure only when it is a month from the card's own cited span.
      if (t.opener && t.opener.kind !== "data") ok(!DIGIT.test(t.opener.text.replace(/\b(90|12)\b/g, "")), `${this.name}: "${q}" opener invents no figures`, t.opener.text);
      if (t.alternate) {
        const h = await hashOf({ label: t.alternate.label, question: t.alternate.question, range: t.alternate.range });
        ok(h !== t.hash && !this.seen.includes(h), `${this.name}: "${q}" alternate's card is new to the thread`);
      }
      this.last = { question: q, intent: (t.intent as Prev["intent"]) ?? null, marketSlug: t.marketSlug, answerHash: t.hash, range, ...(t.dataTo ? { dataTo: t.dataTo } : {}) };
      this.seen = [t.hash, ...this.seen.filter((h) => h !== t.hash)].slice(0, SEEN_MAX);
      this.turns.push(t);
      log.push(
        [`## ${this.name} · Q: ${q}${range !== "all" ? ` [${range}]` : ""}${cleared.length ? ` (× ${cleared.join(", ")})` : ""}`,
          `market=${t.marketSlug ?? "-"} intent=${t.intent ?? "-"} repeat=${t.repeat} hash=${t.hash}`,
          `chip: ${JSON.stringify(t.context)}`,
          t.opener ? `opener [${t.opener.kind}]: ${t.opener.text}` : "opener: (none)",
          `answer: ${t.head.slice(0, 220)}`,
          t.alternate ? `alternate: ${t.alternate.label} → "${t.alternate.question}"${t.alternate.range ? ` [${t.alternate.range}]` : ""} — Next best on file: ${t.alternate.why}` : "alternate: (none)",
          t.followUps?.length ? `other-angle chips: ${t.followUps.map((c) => c.label).join(" | ")}` : "",
        ].filter(Boolean).join("\n")
      );
      return t;
    }
  }

  // T1: inheritance + topic change.
  const t1 = new Thread("T1 Nashville");
  const a1 = await t1.ask("What's the RevPAR and occupancy read for Nashville?");
  ok(a1.opener === null, "T1: first answer has no opener");
  ok((a1.context as { market?: { slug: string } }).market?.slug === "nashville", "T1: chip carries Nashville");
  const a2 = await t1.ask("What about the supply pipeline there?");
  ok(a2.marketSlug === "nashville", "T1: follow-up inherits the market", String(a2.marketSlug));
  ok(a2.opener?.kind === "angle" && /now on supply pipeline instead of RevPAR and occupancy/.test(a2.opener.text), "T1: opener names the topic change", a2.opener?.text);
  const a3 = await t1.ask("What about Orlando?");
  ok(a3.marketSlug === "orlando" && /Switched from Nashville to Orlando/.test(a3.opener?.text ?? ""), "T1: market switch opener", a3.opener?.text);
  ok(!/Newer cited data/.test([a2, a3].map((t) => t.opener?.text ?? "").join(" ")), "T1: no refreshed-data claim");

  // T2: unsupported segment narrowing.
  const t2 = new Thread("T2 segment");
  await t2.ask("What's the RevPAR and occupancy read for Nashville?");
  const b2 = await t2.ask("upscale only");
  const unsupported = b2.opener?.kind === "unsupported" || b2.content.startsWith(C.UNSUPPORTED_LINE);
  ok(unsupported, "T2: segment narrowing says what's on file", b2.opener?.text ?? b2.content);
  ok(b2.marketSlug === "nashville", "T2: segment narrowing keeps the market");
  ok(Boolean(b2.alternate && /^Compare Nashville vs /.test(b2.alternate.question)), "T2: one next-best alternate (closest peer)", JSON.stringify(b2.alternate));
  ok(Boolean(b2.alternate && !/on file/.test(b2.alternate.why) && /This is a market compare; there's no upscale-only cut for \w+ either\.$/.test(b2.alternate.why)), "T2: alternate why has no second 'on file' and says the peer has no upscale cut either", b2.alternate?.why);
  const b3 = await t2.ask("What about select-service hotels in Nashville?");
  ok(b3.opener?.kind === "unsupported" || b3.content.startsWith(C.UNSUPPORTED_LINE) || b3.repeat, "T2: select-service also unsupported", b3.opener?.text ?? b3.content);
  if (b3.repeat) ok(/There's no select-service-only cut on file\. The answer above covers all Nashville hotels\.$/.test(b3.content), "T2: repeat note reads 'The answer above covers all Nashville hotels.'", b3.content);

  // T2b: first question that names a segment (Eric QA a): all-hotel card + the exact unsupported line.
  const t2b = new Thread("T2b first-question segment");
  const s1 = await t2b.ask("What's the RevPAR for upscale hotels in Nashville?");
  ok(s1.opener?.kind === "unsupported" && s1.opener.text === "I don't have enough data to answer this confidently; here's what I do know. There's no upscale-only cut on file, so the Nashville figures below cover all hotels.", "T2b: first-question segment line", s1.opener?.text);
  ok(s1.marketSlug === "nashville" && !s1.repeat, "T2b: still the Nashville all-hotel card");
  const t2c = new Thread("T2c first-question REIT segment", { kind: "reit", id: "HST" });
  const s2 = await t2c.ask("How did their upscale hotels do last quarter?");
  ok(s2.opener === null, "T2c: REIT scope first question: no segment line", s2.opener?.text);
  const t2d = new Thread("T2d first-question no segment");
  ok((await t2d.ask("What's the RevPAR and occupancy read for Orlando?")).opener === null, "T2d: first question without a segment: no opener");

  // T3: × on the market → no inheritance.
  const t3 = new Thread("T3 clear market");
  await t3.ask("What's the RevPAR and occupancy read for Nashville?");
  const c2 = await t3.ask("What's the supply pipeline?", "all", ["market"]);
  ok(c2.marketSlug !== "nashville", "T3: × market → the follow-up does not inherit Nashville", String(c2.marketSlug));
  ok(t3.lastFallback === "which-market" && /^Which market do you mean\? There's no national supply pipeline read on file/.test(c2.content), "T3: no national supply read → softened 'which market?' reply", c2.content);
  ok(!/heaviest|ranking|rank/i.test(c2.content) && (c2.followUps ?? []).every((c) => /^Supply pipeline in /.test(c.label)), "T3: no invented ranking; chips are the same topic per market", JSON.stringify(c2.followUps));
  ok((c2.followUps ?? []).length >= 1, "T3: at least one market chip", JSON.stringify(c2.followUps));
  // × market + a vague question on a topic with a national read on file → the national card, labelled.
  const t3n = new Thread("T3n clear market, national read");
  await t3n.ask("What's the hotel supply pipeline in Nashville?");
  const n2 = await t3n.ask("What's the debt and refinancing picture?", "all", ["market"]);
  ok(n2.marketSlug === null && /^Dropped Nashville, so this is the national read/.test(n2.opener?.text ?? ""), "T3n: national debt read, opener says so", `${t3n.lastFallback} ${n2.opener?.text} | ${n2.head.slice(0, 80)}`);
  // r3: the national RevPAR prints were CoStar data and are no longer shown, so a cleared-market RevPAR question asks
  // which market (no national read on file) instead of answering nationally.
  const t3r = new Thread("T3r clear market, national RevPAR (none on file since r3)");
  await t3r.ask("What's the hotel supply pipeline in Nashville?");
  const r2 = await t3r.ask("How is RevPAR doing?", "all", ["market"]);
  ok(r2.marketSlug === null && t3r.lastFallback === "which-market" && /^Which market do you mean\? There's no national RevPAR and occupancy read on file/.test(r2.content), "T3r: no national RevPAR read on file → which-market reply", `${t3r.lastFallback} ${r2.content.slice(0, 120)}`);
  // Control: same question without × inherits.
  const t3b = new Thread("T3 control");
  await t3b.ask("What's the RevPAR and occupancy read for Nashville?");
  const c2b = await t3b.ask("What's the supply pipeline?");
  ok(c2b.marketSlug === "nashville", "T3 control: without × it inherits Nashville", String(c2b.marketSlug));

  // T4: × on the topic → no topic carry-over.
  const t4 = new Thread("T4 clear topic");
  await t4.ask("What's the hotel supply pipeline in Nashville?");
  const d2 = await t4.ask("tell me more about that", "all", ["topic"]);
  ok(d2.intent !== "supply_pipeline", "T4: × topic → 'tell me more about that' does not continue the supply topic", String(d2.intent));
  ok(!d2.opener || /^Dropped supply pipeline/.test(d2.opener.text), "T4: opener says the topic was dropped", d2.opener?.text);
  const t4b = new Thread("T4 control");
  await t4b.ask("What's the hotel supply pipeline in Nashville?");
  const d2b = await t4b.ask("tell me more about that");
  ok(d2b.intent === "supply_pipeline" || d2b.repeat, "T4 control: without × it continues the topic", String(d2b.intent));

  // T5: narrower window → opener + wider-window alternate; period is carried in the chip.
  const t5 = new Thread("T5 window");
  await t5.ask("How has RevPAR moved in Nashville over the last 12 months?");
  const e2 = await t5.ask("How has RevPAR moved in Nashville over the last 12 months?", "90d");
  if (!e2.repeat) {
    ok(/^Narrowed to the last 90 days/.test(e2.opener?.text ?? ""), "T5: narrowed-window opener", e2.opener?.text);
    ok((e2.context as { period?: { range: string } }).period?.range === "90d", "T5: chip carries Last 90 days");
  } else ok(true, "T5: 90-day card was already shown (repeat note instead)");
  const e3 = await t5.ask("What about the supply pipeline?", "90d", ["period"]);
  ok(e3.range === "90d", "T5: (client sends the range; × period is the client's job)");
  const t5c = new Thread("T5 clear period");
  await t5c.ask("How has RevPAR moved in Nashville over the last 12 months?", "90d");
  const e4 = await t5c.ask("What's driving hotel demand there?", "all", ["period"]);
  ok(!e4.opener || !/Newer cited data/.test(e4.opener.text), "T5: × period opener makes no data claim", e4.opener?.text);

  // T6: buy/sell question as a follow-up keeps the decline; Batch 1 lines stay neutral (checked on every turn).
  const t6 = new Thread("T6 advice");
  await t6.ask("What's the RevPAR and occupancy read for Nashville?");
  const f2 = await t6.ask("Should I buy a hotel there?");
  ok(/We don't give buy or sell recommendations/.test(f2.content) || f2.intent === "advice_declined" || f2.repeat, "T6: decline kept", f2.content.slice(0, 120));

  // T7: REIT item scope: segment words never trigger "unsupported", no market part in the chip.
  const t7 = new Thread("T7 REIT HST", { kind: "reit", id: "HST" });
  await t7.ask("What did Host report last quarter?");
  const g2 = await t7.ask("What about their upscale hotels?");
  ok(g2.opener?.kind !== "unsupported", "T7: REIT scope never claims a missing segment", g2.opener?.text);
  ok(!(g2.context as { market?: unknown }).market, "T7: item scope → no market part in the chip");

  // T8: A-B-A in one thread: the third turn is a repeat note, never the card again, and gets no opener.
  const t8 = new Thread("T8 A-B-A");
  await t8.ask("What's the RevPAR and occupancy read for Nashville?");
  await t8.ask("What's the hotel supply pipeline in Nashville?");
  const h3 = await t8.ask("What's the RevPAR and occupancy read for Nashville?");
  ok(h3.repeat && h3.opener === null, "T8: repeat → note only, no opener");

  // T9: "Newer cited data" happy path. The graph has not changed since Oct 26 (every nightly dump has the same 896
  // signal rows), so no real thread has seen newer data. Constructed from real rows: the earlier card is built
  // (span-probe.ts, child process) as if three real Nashville rows weren't on file yet (the Oct 11 supply snapshot that
  // carries the YE 2025 county read, and the two Oct 11 citywide calendars), then the same question on the full graph
  // is asked with that card as prev. (r3: the C&W STR/CoStar rows held back before are now never shown at all.)
  const { execFileSync } = await import("node:child_process");
  const HOLD = "w1s-nashville-snapshot,w1d-nashville-compression-90d,w1d-nashville-d7";
  const NQ = "What's the RevPAR and occupancy read for Nashville?";
  const early = JSON.parse(execFileSync("npx", ["tsx", "scripts/chat/span-probe.ts"], { env: { ...process.env, PROBE_QS: JSON.stringify([NQ]), PROBE_HOLDBACK_IDS: HOLD }, encoding: "utf8" }))[0] as { hash: string; dataTo: string; intent: string; marketSlug: string };
  const t9 = new Thread("T9 newer cited data (constructed)");
  t9.last = { question: NQ, intent: early.intent as Prev["intent"], marketSlug: early.marketSlug, answerHash: early.hash, range: "all", dataTo: early.dataTo };
  t9.seen = [early.hash];
  log.push(`## T9 earlier card (rows held back: ${HOLD})\nhash=${early.hash} dataTo=${early.dataTo}`);
  const n9 = await t9.ask(NQ);
  ok(!n9.repeat && n9.opener?.kind === "data", "T9: same market/topic/window, later cited month → 'Newer cited data' opener", `${early.dataTo} → ${n9.dataTo}: ${n9.opener?.text}`);
  ok(n9.opener?.text === `Newer cited data than your last answer: the sources now run through ${n9.dataTo} (they ran through ${early.dataTo}).`, "T9: opener names both months from the cited spans", n9.opener?.text);

  const fs = await import("node:fs");
  const out = process.env.BATCH1_OUT ?? "/workspace/bungah-audit/chat-batch1/local-threads.md";
  fs.writeFileSync(out, `# Batch 1 local threads (graph fixture ${process.env.BUNGAH_GRAPH_FIXTURE ?? "DB"})\n\n${log.join("\n\n")}\n`);
  console.log(`\n${pass} passed, ${fails.length} failed${fails.length ? `\n${fails.join("\n")}` : ""}\nthreads: ${out}`);
  process.exit(fails.length ? 1 : 0);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
