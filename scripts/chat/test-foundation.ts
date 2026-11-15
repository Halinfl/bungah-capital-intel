/**
 * Chat foundation (Batch 2 "F") test: F1–F9 from bungah-audit/chat-roadmap-plan/2026-11-14-ownership-retention-batch-plan.md §4,
 * plus: private log rows have threadId null, the Clerk webhook rejects bad signatures, the purge skips legacy
 * unowned and signed-in threads, the training export respects opt-in, and the legacy (pre-migration) path.
 *
 * LOCAL THROWAWAY POSTGRES ONLY. Refuses any DATABASE_URL whose host is not 127.0.0.1/localhost. It wipes the
 * chat tables of that database and recreates a second "prod-like" database (old schema) next to it.
 * Run: DATABASE_URL=postgresql://postgres@127.0.0.1:55432/bci_foundation_test npx tsx scripts/chat/test-foundation.ts [--verbose]
 */
import { execSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const verbose = process.argv.includes("--verbose");
const DB_URL = process.env.DATABASE_URL ?? "";
const u = (() => {
  try {
    return new URL(DB_URL);
  } catch {
    return null;
  }
})();
if (!u || !["127.0.0.1", "localhost"].includes(u.hostname)) {
  console.error("test-foundation: refusing to run; DATABASE_URL must point at a local throwaway Postgres (127.0.0.1/localhost).");
  process.exit(2);
}
const PRODLIKE_DB = "bci_prodlike_test";
const prodlikeUrl = (() => {
  const x = new URL(DB_URL);
  x.pathname = `/${PRODLIKE_DB}`;
  return x.toString();
})();

// Test-only secrets, random per run (never real ones).
process.env.BUNGAH_ANON_SECRET = randomBytes(32).toString("hex");
const WH_SECRET = `whsec_${randomBytes(24).toString("base64")}`;
process.env.CLERK_WEBHOOK_SECRET = WH_SECRET;
process.env.CRON_SECRET = randomBytes(24).toString("hex");
delete process.env.BUNGAH_USE_LLM;
delete process.env.BUNGAH_CHAT_FOUNDATION;
delete process.env.BUNGAH_PURGE_DRY_RUN;

let pass = 0;
const fails: string[] = [];
const sections: Record<string, { pass: number; fail: number }> = {};
let cur = "setup";
function section(name: string) {
  cur = name;
  sections[name] ??= { pass: 0, fail: 0 };
  console.log(`\n== ${name}`);
}
function ok(cond: unknown, name: string, detail = "") {
  sections[cur] ??= { pass: 0, fail: 0 };
  if (cond) {
    pass++;
    sections[cur].pass++;
  } else {
    fails.push(`[${cur}] ${name}${detail ? ` :: ${detail}` : ""}`);
    sections[cur].fail++;
  }
  if (verbose || !cond) console.log(`${cond ? "PASS" : "FAIL"} ${name}${detail && !cond ? ` :: ${detail}` : ""}`);
}

const ROOT = process.cwd();
const BASE = "6be786a";

async function main() {
  const S = await import("@/lib/chat-store");
  const A = await import("@/lib/chat-anon");
  const { verifySvix, svixSign } = await import("@/lib/svix-verify");
  const { prisma } = await import("@/lib/prisma");
  const db = prisma;

  // Fresh chat tables (local test DB only).
  await db.$executeRawUnsafe(`TRUNCATE "SavedItem", "ChatMessage", "ChatThread", "ChatQuestionLog", "ChatUserPref" CASCADE`);
  S.resetFoundationCache();

  let n = 0;
  const mk = (q: string, x: Partial<import("@/lib/chat-store").TurnInput> = {}): import("@/lib/chat-store").TurnInput => ({
    question: q,
    answerText: `Answer to "${q}" with enough cited text to pass the corpus length rule (${++n}).`,
    citations: [`src-${n}`],
    marketSlug: "nashville",
    intent: "revpar",
    answeredWell: true,
    modelUsed: "memo",
    isPrivate: false,
    userId: null,
    source: "typed",
    ...x,
  });
  /** One /api/chat turn as the route runs it: resolve (owner check / claim) → owned write. */
  async function turn(owner: import("@/lib/chat-store").Owner, threadId: string | null, q: string) {
    const r = await S.resolveThread(db, threadId, owner);
    if (r.mode !== "owned") throw new Error(`expected owned, got ${r.mode}`);
    const isPrivate = Boolean(owner.userId);
    const w = await S.createOwnedThread(db, r, owner, q); // before the response, as the route does
    await S.persistOwnedTurn(db, w, owner, mk(q, { isPrivate, userId: owner.userId })); // after the response
    return r;
  }
  const anon = () => A.verifyAnon(A.mintAnon()!.cookie)!;

  section("schema gate");
  ok(await S.foundationReady(db, { fresh: true }), "foundationReady true on the migrated local DB");
  process.env.BUNGAH_CHAT_FOUNDATION = "off";
  ok(!(await S.foundationReady(db, { fresh: true })), "BUNGAH_CHAT_FOUNDATION=off forces the legacy path");
  delete process.env.BUNGAH_CHAT_FOUNDATION;
  S.resetFoundationCache();
  ok(await S.foundationReady(db, { fresh: true }), "foundationReady back on");

  section("anon cookie");
  const m1 = A.mintAnon();
  ok(m1 && A.verifyAnon(m1.cookie) === m1.id, "minted cookie verifies to its id");
  ok(m1 && A.verifyAnon(m1.cookie.slice(0, -2) + "xx") === null, "tampered signature rejected");
  ok(m1 && A.verifyAnon(`a_${"0".repeat(32)}.${m1.cookie.split(".")[1]}`) === null, "swapped id rejected");
  ok(A.verifyAnon("garbage") === null && A.verifyAnon(null) === null, "malformed / missing rejected");
  ok(m1 && A.readCookie(`x=1; ${A.ANON_COOKIE}=${encodeURIComponent(m1.cookie)}; y=2`, A.ANON_COOKIE) === m1.cookie, "cookie header parsed");
  {
    const keep = process.env.BUNGAH_ANON_SECRET;
    process.env.BUNGAH_ANON_SECRET = "short";
    ok(A.mintAnon() === null && m1 && A.verifyAnon(m1.cookie) === null, "no (or short) secret → no anon id issued or accepted");
    process.env.BUNGAH_ANON_SECRET = keep;
  }
  ok((await S.resolveThread(db, null, { userId: null, anonId: null })).mode === "log-only", "signed out without an anon id → log row only (no unowned thread)");

  section("inline links (on-site paths only)");
  {
    const { parseInlineLinks, isOnSitePath } = await import("@/lib/inline-links");
    const p1 = parseInlineLinks("Markets: Nashville. Or [browse the markets we cover](/markets).");
    ok(p1.length === 3 && typeof p1[1] === "object" && p1[1].href === "/markets" && p1[1].label === "browse the markets we cover" && p1[0] === "Markets: Nashville. Or " && p1[2] === ".", "single-slash on-site path → link", JSON.stringify(p1));
    ok(isOnSitePath("/markets/nashville") && isOnSitePath("/chat?market=orlando") && isOnSitePath("/"), "on-site paths accepted");
    for (const bad of ["//evil.example/x", "/\\evil.example", "https://evil.example", "http://x", "javascript:alert(1)", "JaVaScRiPt:alert(1)", "data:text/html,x", "mailto:a@b.c", "markets", "./markets", " /markets"]) {
      const parts = parseInlineLinks(`See [here](${bad}) now`);
      ok(parts.every((x) => typeof x === "string") && parts.join("") === `See [here](${bad}) now`, `rejected, left as text: ${bad}`);
    }
    const p2 = parseInlineLinks("[a](//x.com) and [b](/deals)");
    ok(p2.length === 2 && p2[0] === "[a](//x.com) and " && typeof p2[1] === "object" && p2[1].href === "/deals", "a rejected link before a good one stays text", JSON.stringify(p2));
  }

  section("MarkdownLite links (same rule as inline links)");
  {
    const { inline } = await import("@/components/MarkdownLite");
    const good = inline("See [Nashville](/markets/nashville) and [chat](/chat?market=orlando&x=1).");
    ok(good.includes("<a href='/markets/nashville'") && good.includes(">Nashville</a>"), "on-site path → link", good);
    ok(good.includes("href='/chat?market=orlando&amp;x=1'"), "query string kept (escaped)", good);
    ok(good.includes("focus-visible:outline-2"), "link has the 2px focus ring");
    for (const bad of ["//evil.example/x", "/\\evil.example", "https://evil.example", "http://x.com/a", "javascript:alert(1)", "data:text/html,x", "mailto:a@b.c", "markets"]) {
      const h = inline(`Read [here](${bad}) now`);
      ok(!h.includes("<a ") && h.includes("[here]("), `rejected, left as text: ${bad}`, h);
    }
    const q = inline("[x](/a'onmouseover=alert(1)) [y](/b\"z)");
    ok(!/\sonmouseover=/i.test(q) && !q.includes("'onmouseover") && !q.includes('"z') && q.includes("&#39;onmouseover") && q.includes("&quot;z"), "quotes in a path stay escaped inside the href (no new attribute)", q);
    ok(inline("<b>hi</b> **bold**") === "&lt;b&gt;hi&lt;/b&gt; <strong class='text-white font-semibold'>bold</strong>", "HTML escaped, bold kept");
  }

  section("after sign-in path");
  {
    const { afterSignInPath } = await import("@/lib/after-sign-in");
    ok(afterSignInPath("/chat") === "/chat", "redirect_url=/chat → back to Chat");
    for (const v of [undefined, "", "/workspace", "/chat/x", "//evil.example", "https://evil.example/chat", "/chat?x=1", ["/chat", "/chat"]] as (string | string[] | undefined)[])
      ok(afterSignInPath(v) === "/workspace", `anything else → /workspace: ${JSON.stringify(v)}`);
  }

  section("F1 one thread per conversation");
  {
    const o = { userId: null, anonId: anon() };
    const r1 = await turn(o, null, "F1 anon q1");
    const r2 = await turn(o, r1.threadId, "F1 anon follow-up 1");
    const r3 = await turn(o, r2.threadId, "F1 anon follow-up 2");
    ok(r1.status === "new" && r2.status === "existing" && r3.status === "existing", "statuses new → existing → existing");
    ok(r1.threadId === r2.threadId && r2.threadId === r3.threadId, "same threadId on every turn");
    ok((await db.chatThread.count({ where: { anonOwnerId: o.anonId } })) === 1, "signed out: 1 ChatThread");
    ok((await db.chatMessage.count({ where: { threadId: r1.threadId } })) === 6, "signed out: 6 messages");
    const roles = (await db.chatMessage.findMany({ where: { threadId: r1.threadId }, orderBy: [{ createdAt: "asc" }, { id: "asc" }], select: { role: true } })).map((m) => m.role).join(",");
    ok(roles === "user,assistant,user,assistant,user,assistant", "messages in turn order", roles);
    const s = { userId: "user_F1", anonId: null };
    const a = await turn(s, null, "F1 signed-in q1");
    await turn(s, a.threadId, "F1 signed-in follow-up 1");
    await turn(s, a.threadId, "F1 signed-in follow-up 2");
    ok((await db.chatThread.count({ where: { userId: "user_F1" } })) === 1, "signed in: 1 ChatThread");
    ok((await db.chatMessage.count({ where: { threadId: a.threadId } })) === 6, "signed in: 6 messages");
    const t = await db.chatThread.findUnique({ where: { id: a.threadId } });
    ok(t?.userId === "user_F1" && t?.anonOwnerId === null, "signed-in thread owned by userId only");
    ok((await db.chatQuestionLog.count({ where: { userId: "user_F1" } })) === 3, "one log row per turn (3)");
    // A follow-up that arrives before the first answer's after-response write still lands in the same thread.
    const fast = { userId: null, anonId: anon() };
    const f1 = await S.resolveThread(db, null, fast);
    if (f1.mode !== "owned") throw new Error("owned expected");
    const f1w = await S.createOwnedThread(db, f1, fast, "F1 fast q1");
    const f2 = await S.resolveThread(db, f1.threadId, fast);
    ok(f2.mode === "owned" && f2.status === "existing" && f2.threadId === f1.threadId, "immediate follow-up (first write still pending) → same thread");
    await S.persistOwnedTurn(db, f1w, fast, mk("F1 fast q1"));
    if (f2.mode === "owned") await S.persistOwnedTurn(db, f2, fast, mk("F1 fast q2"));
    ok((await db.chatThread.count({ where: { anonOwnerId: fast.anonId } })) === 1 && (await db.chatMessage.count({ where: { threadId: f1.threadId } })) === 4, "fast pair: 1 thread, 4 messages");
    let threw = false;
    try {
      await S.createOwnedThread(db, { mode: "owned", threadId: S.newThreadId(), status: "new" }, { userId: null, anonId: null }, "x");
    } catch {
      threw = true;
    }
    ok(threw, "an ownerless thread is never created");
  }

  section("F2 someone else's threadId");
  {
    const A1 = { userId: "user_A", anonId: null };
    const a = await turn(A1, null, "F2 SECRET-A question");
    const before = await db.chatMessage.count({ where: { threadId: a.threadId } });
    const B = { userId: "user_B", anonId: null };
    const rb = await S.resolveThread(db, a.threadId, B);
    ok(rb.mode === "owned" && rb.status === "new" && rb.threadId !== a.threadId && rb.rejected === "not-owner", "user B with A's id → new thread", JSON.stringify(rb));
    await turn(B, a.threadId, "F2 B question");
    ok((await db.chatMessage.count({ where: { threadId: a.threadId } })) === before, "A's thread not appended to");
    const bThreads = await db.chatThread.findMany({ where: { userId: "user_B" }, include: { messages: true } });
    ok(bThreads.length === 1 && !bThreads[0].messages.some((m) => m.content.includes("SECRET-A")), "B's new thread has none of A's content");
    const so = { userId: null, anonId: anon() };
    const rs = await S.resolveThread(db, a.threadId, so);
    ok(rs.mode === "owned" && rs.status === "new" && rs.threadId !== a.threadId, "signed-out with A's id → new thread");
    const sNoCookie = await S.resolveThread(db, a.threadId, { userId: null, anonId: null });
    ok(sNoCookie.mode === "log-only", "signed-out without cookie with A's id → log row only");
    ok((await S.getOwnedThread(db, a.threadId, B)) === null, "B cannot read A's thread (404)");
    ok((await S.getOwnedThread(db, a.threadId, so)) === null, "signed-out cannot read A's thread (404)");
    ok((await S.getOwnedThread(db, a.threadId, A1))?.messages.length === 2, "A reads own thread");
    ok(!(await S.deleteThread(db, a.threadId, B)).ok && (await db.chatThread.count({ where: { id: a.threadId } })) === 1, "B cannot delete A's thread");
    // Anon thread vs another browser.
    const x = { userId: null, anonId: anon() };
    const ax = await turn(x, null, "F2 anon X");
    const y = { userId: null, anonId: anon() };
    const ry = await S.resolveThread(db, ax.threadId, y);
    ok(ry.mode === "owned" && ry.threadId !== ax.threadId, "another browser with an anon thread id → new thread");
    ok((await S.getOwnedThread(db, ax.threadId, y)) === null, "another browser cannot read the anon thread");
    ok((await S.resolveThread(db, "../../etc", A1)).mode === "owned", "malformed id → new thread, no lookup");
    // Legacy unowned thread (pre-foundation row): never shown, never appended to.
    const legacy = await db.chatThread.create({ data: { title: "legacy", messages: { create: [{ role: "user", content: "LEGACY-PRIVATE" }] } }, select: { id: true } });
    for (const o of [A1, so, { userId: null, anonId: null }]) ok((await S.getOwnedThread(db, legacy.id, o)) === null, `legacy unowned thread hidden from ${o.userId ?? (o.anonId ? "anon" : "no-owner")}`);
    const rl = await S.resolveThread(db, legacy.id, A1);
    ok(rl.mode === "owned" && rl.threadId !== legacy.id, "legacy id → new thread");
    ok(!(await S.deleteThread(db, legacy.id, { userId: null, anonId: null })).ok, "legacy thread cannot be deleted through the app");
  }

  section("F3 + private log rows (Decision A)");
  {
    const MARK = `PRIVMARK-${randomBytes(6).toString("hex")}`;
    const o = { userId: "user_F3", anonId: null };
    const r = await turn(o, null, `What is my ${MARK} pipeline?`);
    await S.persistOwnedTurn(db, { mode: "owned", threadId: r.threadId, status: "existing" }, o, { ...mk(`follow ${MARK}`, { isPrivate: true, userId: o.userId }), answerText: `Private answer ${MARK} long enough for corpus`, citations: [`cite ${MARK}`] });
    const logs = await db.chatQuestionLog.findMany({ where: { userId: "user_F3" } });
    ok(logs.length === 2, "two private log rows");
    ok(logs.every((l) => l.question === "[private]" && l.answerText === null && l.answerSnippet === null && l.citationsJson === null), "log rows carry no question/answer/citation text");
    ok(logs.every((l) => l.threadId === null), "private log rows have threadId null");
    ok(logs.every((l) => l.isPrivate && !l.trainEligible), "isPrivate true, trainEligible false");
    const hitsLog = await db.$queryRawUnsafe<{ n: bigint }[]>(`SELECT count(*) n FROM "ChatQuestionLog" WHERE concat_ws(' ', question, "answerText", "answerSnippet", "citationsJson", "threadId") LIKE $1`, `%${MARK}%`);
    ok(Number(hitsLog[0].n) === 0, "marker appears 0 times in ChatQuestionLog");
    const hitsMsg = await db.chatMessage.findMany({ where: { OR: [{ content: { contains: MARK } }, { citations: { contains: MARK } }] }, select: { threadId: true } });
    ok(hitsMsg.length >= 2 && hitsMsg.every((m) => m.threadId === r.threadId), "the owner's thread is the only copy of the content");
    const msgs = await db.chatMessage.findMany({ where: { threadId: r.threadId } });
    ok(msgs.every((m) => m.questionLogId && logs.some((l) => l.id === m.questionLogId)), "owner's messages point to their log rows (thread → log only)");
    // Public rows keep their link and text.
    const p = { userId: null, anonId: anon() };
    const pr = await turn(p, null, "F3 public question");
    const pl = await db.chatQuestionLog.findFirst({ where: { question: "F3 public question" } });
    ok(pl?.threadId === pr.threadId && pl?.trainEligible && !pl?.isPrivate && pl?.answerText, "public log row keeps text + threadId");
    ok(S.logRowData(mk("x", { isPrivate: true, userId: "u" }), "ct_x").threadId === null, "logRowData drops threadId for private rows");
  }

  section("F4 + training export respects opt-in");
  {
    const out = path.join(os.tmpdir(), `bci-foundation-export-${process.pid}.jsonl`);
    const runExport = () => {
      execSync("npx tsx scripts/export-train-corpus.ts", { cwd: ROOT, env: { ...process.env, TRAIN_EXPORT_OUT: out }, stdio: "pipe" });
      return fs.readFileSync(out, "utf8");
    };
    const PRIV = `F4PRIV-${randomBytes(6).toString("hex")}`;
    const PUB = `F4PUB-${randomBytes(6).toString("hex")}`;
    const PRE = `F4PRE-${randomBytes(6).toString("hex")}`;
    const POST = `F4POST-${randomBytes(6).toString("hex")}`;
    const OTHER = `F4OTHER-${randomBytes(6).toString("hex")}`;
    await turn({ userId: "user_F4", anonId: null }, null, `Private ${PRIV} question`);
    await turn({ userId: null, anonId: anon() }, null, `Public ${PUB} question`);
    let text = runExport();
    ok(!text.includes(PRIV), "F4: private marker 0 hits in the export (default: no opt-in)");
    ok(text.includes(PUB), "public signed-out Q&A is exported");
    ok(!text.includes("[private]"), "no [private] placeholder rows exported");
    ok((await S.getTrainOptIn(db, "user_OPT")) === false, "opt-in defaults to off");
    const opt = { userId: "user_OPT", anonId: null };
    const ot = await turn(opt, null, `Before opt-in ${PRE} question`);
    await db.$executeRawUnsafe(`UPDATE "ChatMessage" SET "createdAt" = now() - interval '1 hour' WHERE "threadId" = $1`, ot.threadId);
    await S.setTrainOptIn(db, "user_OPT", true);
    ok((await S.getTrainOptIn(db, "user_OPT")) === true, "opt-in saved");
    await turn(opt, ot.threadId, `After opt-in ${POST} question`);
    await turn({ userId: "user_OTHER", anonId: null }, null, `Other ${OTHER} question`);
    text = runExport();
    ok(text.includes(POST), "opted-in person's content (after opt-in) is exported");
    ok(!text.includes(PRE), "content from before the opt-in is not exported");
    ok(!text.includes(OTHER) && !text.includes(PRIV), "people who did not opt in stay out");
    ok(text.split("\n").filter((l) => l.includes(POST)).every((l) => JSON.parse(l).meta.origin === "opt-in"), "opt-in records tagged meta.origin=opt-in");
    const optRecs = text.split("\n").filter((l) => l.includes(POST)).map((l) => JSON.parse(l).meta);
    ok(optRecs.length > 0 && optRecs.every((m) => m.isPrivate === true && m.source === "signed-in-opt-in"), "opt-in records labelled isPrivate:true, source:signed-in-opt-in", JSON.stringify(optRecs[0]));
    ok(optRecs.every((m) => m.modelUsed === "memo"), "opt-in record modelUsed = the stored path (memo)", JSON.stringify(optRecs.map((m) => m.modelUsed)));
    // A turn whose stored answer path was the model: the record says llm (not a hardcoded memo).
    const LLM = `F4LLM-${randomBytes(6).toString("hex")}`;
    {
      const r = await S.resolveThread(db, ot.threadId, opt);
      if (r.mode !== "owned") throw new Error("expected owned");
      await S.persistOwnedTurn(db, r, opt, mk(`Model path ${LLM} question`, { isPrivate: true, userId: opt.userId, modelUsed: "llm" }));
    }
    const llmRecs = runExport().split("\n").filter((l) => l.includes(LLM)).map((l) => JSON.parse(l).meta);
    ok(llmRecs.length === 1 && llmRecs[0].modelUsed === "llm" && llmRecs[0].source === "signed-in-opt-in" && llmRecs[0].isPrivate === true, "opt-in record modelUsed derived from the stored path (llm)", JSON.stringify(llmRecs[0]));
    text = runExport();
    const pubRecs = text.split("\n").filter((l) => l.includes(PUB)).map((l) => JSON.parse(l).meta);
    ok(pubRecs.length > 0 && pubRecs.every((m) => m.isPrivate === false && m.origin === "public" && m.source !== "signed-in-opt-in"), "public records stay isPrivate:false, origin:public", JSON.stringify(pubRecs[0]));
    await S.setTrainOptIn(db, "user_OPT", false);
    text = runExport();
    ok(!text.includes(POST), "opting out removes them from the next export");
    fs.rmSync(out, { force: true });
  }

  section("F5 Delete conversation");
  {
    const o = { userId: "user_F5", anonId: null };
    const r = await turn(o, null, "F5 q1");
    await turn(o, r.threadId, "F5 q2");
    const keep = await turn(o, null, "F5 other conversation");
    const msg = await db.chatMessage.findFirst({ where: { threadId: r.threadId, role: "assistant" } });
    await db.savedItem.create({ data: { userId: "user_F5", kind: "answer", threadId: r.threadId, messageId: msg!.id } });
    await db.savedItem.create({ data: { userId: "user_F5", kind: "answer", threadId: r.threadId } });
    const logIds = (await db.chatMessage.findMany({ where: { threadId: r.threadId }, select: { questionLogId: true } })).map((m) => m.questionLogId!);
    const out = await S.deleteThread(db, r.threadId, o);
    ok(out.ok, "owner delete ok");
    ok((await db.chatThread.count({ where: { id: r.threadId } })) === 0, "thread gone");
    ok((await db.chatMessage.count({ where: { threadId: r.threadId } })) === 0, "messages gone");
    ok((await db.savedItem.count({ where: { threadId: r.threadId } })) === 0, "saved items gone");
    ok((await db.chatQuestionLog.count({ where: { id: { in: logIds } } })) === 0, "its private log rows gone");
    ok((await S.getOwnedThread(db, r.threadId, o)) === null, "reload → 404");
    ok((await db.chatMessage.count({ where: { threadId: keep.threadId } })) === 2 && (await db.chatQuestionLog.count({ where: { userId: "user_F5" } })) === 1, "the person's other conversation untouched");
    ok(!(await S.deleteThread(db, r.threadId, o)).ok, "second delete → 404");
    // Signed-out owner deletes: public log rows stay in the corpus, unlinked.
    const so = { userId: null, anonId: anon() };
    const sr = await turn(so, null, "F5 public conversation");
    ok((await S.deleteThread(db, sr.threadId, so)).ok, "signed-out owner can delete own conversation");
    const pl = await db.chatQuestionLog.findFirst({ where: { question: "F5 public conversation" } });
    ok(pl && pl.threadId === null && pl.answerText, "its public log row stays (unlinked)");
  }

  section("F6 Clerk user.deleted webhook");
  {
    const { POST } = await import("@/app/api/webhooks/clerk/route");
    const U = { userId: "user_F6", anonId: null };
    const t1 = await turn(U, null, "F6 q1");
    await turn(U, t1.threadId, "F6 q2");
    const t2 = await turn(U, null, "F6 other");
    await db.savedItem.create({ data: { userId: "user_F6", kind: "deal", dealSlug: "some-deal" } });
    await db.savedItem.create({ data: { userId: "user_F6", kind: "answer", threadId: t2.threadId } });
    await S.setTrainOptIn(db, "user_F6", true);
    // A thread claimed from signed-out: its earlier public row must survive.
    const br = { userId: null, anonId: anon() };
    const ct = await turn(br, null, "F6 asked signed out");
    await turn({ userId: "user_F6", anonId: br.anonId }, ct.threadId, "F6 after sign-in");
    const V = { userId: "user_F6_other", anonId: null };
    const vt = await turn(V, null, "F6 bystander");
    const pubBefore = await db.chatQuestionLog.count({ where: { isPrivate: false } });
    const body = JSON.stringify({ type: "user.deleted", object: "event", data: { id: "user_F6", deleted: true, object: "user" } });
    const sign = (b: string, secret = WH_SECRET, ts = Math.floor(Date.now() / 1000)) => {
      const id = `msg_${randomBytes(8).toString("hex")}`;
      return new Headers({ "svix-id": id, "svix-timestamp": String(ts), "svix-signature": `v1,${svixSign(secret, id, String(ts), b)}`, "content-type": "application/json" });
    };
    const call = (b: string, h: Headers) => POST(new Request("http://local/api/webhooks/clerk", { method: "POST", body: b, headers: h }));
    // Bad signatures first: nothing may be deleted.
    const wrong = await call(body, sign(body, `whsec_${randomBytes(24).toString("base64")}`));
    ok(wrong.status === 401, "wrong secret → 401", String(wrong.status));
    const h = sign(body);
    const tampered = await call(body.replace("user_F6", "user_F6_other"), h);
    ok(tampered.status === 401, "tampered body → 401");
    const old = await call(body, sign(body, WH_SECRET, Math.floor(Date.now() / 1000) - 3600));
    ok(old.status === 401, "1h-old timestamp → 401");
    const nohdr = await call(body, new Headers({ "content-type": "application/json" }));
    ok(nohdr.status === 401, "missing svix headers → 401");
    const garbled = new Headers(h);
    garbled.set("svix-signature", "v1,AAAA v2,xyz");
    ok((await call(body, garbled)).status === 401, "garbage signature list → 401");
    process.env.CLERK_WEBHOOK_SECRET = "";
    ok((await call(body, sign(body))).status === 503, "no CLERK_WEBHOOK_SECRET → 503 (nothing processed)");
    process.env.CLERK_WEBHOOK_SECRET = WH_SECRET;
    ok((await db.chatThread.count({ where: { userId: "user_F6" } })) === 3, "after rejected calls the user's data is intact");
    // Cross-check: a standard-webhooks (svix-compatible) signature verifies.
    {
      const { Webhook } = await import("standardwebhooks");
      const id = "msg_crosscheck";
      const now = new Date();
      const sig = new Webhook(WH_SECRET.slice(6)).sign(id, now, body);
      const hh = new Headers({ "svix-id": id, "svix-timestamp": String(Math.floor(now.getTime() / 1000)), "svix-signature": `v1,AAAA ${sig}` });
      ok(verifySvix(WH_SECRET, hh, body).ok, "standardwebhooks-signed payload verifies (multi-signature header)");
    }
    const other = JSON.stringify({ type: "user.updated", data: { id: "user_F6" } });
    const ign = await call(other, sign(other));
    ok(ign.status === 200 && (await db.chatThread.count({ where: { userId: "user_F6" } })) === 3, "other event types ignored");
    const res = await call(body, sign(body));
    const j = (await res.json()) as { ok: boolean; deleted: Record<string, number> };
    ok(res.status === 200 && j.ok, "signed user.deleted → 200", JSON.stringify(j));
    ok((await db.chatThread.count({ where: { userId: "user_F6" } })) === 0, "all the user's threads gone (incl. the claimed one)");
    ok((await db.chatMessage.count({ where: { threadId: { in: [t1.threadId, t2.threadId, ct.threadId] } } })) === 0, "their messages gone");
    ok((await db.savedItem.count({ where: { userId: "user_F6" } })) === 0, "their saved items gone");
    ok((await db.chatQuestionLog.count({ where: { userId: "user_F6" } })) === 0, "their private log rows gone");
    ok((await db.chatUserPref.count({ where: { userId: "user_F6" } })) === 0, "their settings gone");
    ok((await db.chatQuestionLog.count({ where: { isPrivate: false } })) === pubBefore, "public rows untouched (count same)");
    const kept = await db.chatQuestionLog.findFirst({ where: { question: "F6 asked signed out" } });
    ok(kept && kept.threadId === null && kept.answerText, "the claimed thread's signed-out public row kept, unlinked");
    ok((await db.chatMessage.count({ where: { threadId: vt.threadId } })) === 2, "another user's thread untouched");
    const replay = await call(body, sign(body));
    ok(replay.status === 200, "replayed delete is a no-op 200 (idempotent)");
  }

  section("F7 90-day purge");
  {
    const { GET } = await import("@/app/api/cron/chat-purge/route");
    const back = (id: string, days: number) => db.$executeRawUnsafe(`UPDATE "ChatThread" SET "updatedAt" = now() - ($2 || ' days')::interval, "createdAt" = now() - ($2 || ' days')::interval WHERE id = $1`, id, String(days));
    const oldAnon = await turn({ userId: null, anonId: anon() }, null, "F7 old anon, nothing saved");
    const oldAnonSaved = await turn({ userId: null, anonId: anon() }, null, "F7 old anon, saved");
    const oldAnonMsgSaved = await turn({ userId: null, anonId: anon() }, null, "F7 old anon, message saved");
    const recentAnon = await turn({ userId: null, anonId: anon() }, null, "F7 recent anon");
    const oldSigned = await turn({ userId: "user_F7", anonId: null }, null, "F7 old signed-in");
    const legacy = await db.chatThread.create({ data: { title: "F7 legacy", messages: { create: [{ role: "user", content: "legacy" }] } }, select: { id: true } });
    await db.savedItem.create({ data: { anonOwnerId: "a_x", kind: "answer", threadId: oldAnonSaved.threadId } });
    const m = await db.chatMessage.findFirst({ where: { threadId: oldAnonMsgSaved.threadId, role: "assistant" } });
    await db.savedItem.create({ data: { userId: "user_F7", kind: "answer", messageId: m!.id } });
    for (const id of [oldAnon.threadId, oldAnonSaved.threadId, oldAnonMsgSaved.threadId, oldSigned.threadId, legacy.id]) await back(id, 120);
    await back(recentAnon.threadId, 89);
    const url = "http://local/api/cron/chat-purge";
    ok((await GET(new Request(url))).status === 401, "no Authorization → 401");
    ok((await GET(new Request(url, { headers: { authorization: "Bearer nope" } }))).status === 401, "wrong CRON_SECRET → 401");
    const keepSecret = process.env.CRON_SECRET;
    process.env.CRON_SECRET = "";
    ok((await GET(new Request(url, { headers: { authorization: "Bearer " } }))).status === 503, "no CRON_SECRET → 503");
    process.env.CRON_SECRET = keepSecret;
    const auth = { authorization: `Bearer ${keepSecret}` };
    const dry = (await (await GET(new Request(`${url}?dryRun=1`, { headers: auth }))).json()) as { candidates: number; deleted: number; dryRun: boolean };
    ok(dry.dryRun && dry.candidates === 1 && dry.deleted === 0, "dry run: 1 candidate, 0 deleted", JSON.stringify(dry));
    ok((await db.chatThread.count({ where: { id: oldAnon.threadId } })) === 1, "dry run deletes nothing");
    process.env.BUNGAH_PURGE_DRY_RUN = "true";
    const envDry = (await (await GET(new Request(url, { headers: auth }))).json()) as { dryRun: boolean; deleted: number };
    ok(envDry.dryRun && envDry.deleted === 0, "BUNGAH_PURGE_DRY_RUN=true forces dry run");
    delete process.env.BUNGAH_PURGE_DRY_RUN;
    const real = (await (await GET(new Request(url, { headers: auth }))).json()) as { deleted: number };
    ok(real.deleted === 1, "real run deletes 1", JSON.stringify(real));
    ok((await db.chatThread.count({ where: { id: oldAnon.threadId } })) === 0, "old signed-out thread with no saves: purged");
    ok((await db.chatMessage.count({ where: { threadId: oldAnon.threadId } })) === 0, "its messages purged");
    const pl = await db.chatQuestionLog.findFirst({ where: { question: "F7 old anon, nothing saved" } });
    ok(pl && pl.threadId === null && pl.trainEligible, "its public log row stays in the corpus, unlinked");
    ok((await db.chatThread.count({ where: { id: oldAnonSaved.threadId } })) === 1, "old signed-out thread with a saved item: kept");
    ok((await db.chatThread.count({ where: { id: oldAnonMsgSaved.threadId } })) === 1, "old signed-out thread with a saved message: kept");
    ok((await db.chatThread.count({ where: { id: recentAnon.threadId } })) === 1, "89-day-old signed-out thread: kept");
    ok((await db.chatThread.count({ where: { id: oldSigned.threadId } })) === 1, "old signed-in thread: kept");
    ok((await db.chatThread.count({ where: { id: legacy.id } })) === 1, "old legacy unowned thread: kept (not touched)");
    const again = await S.purgeAnonThreads(db, {});
    ok(again.deleted === 0, "second run deletes nothing");
  }

  section("F8 claim after sign-in");
  {
    const X = anon();
    const t = await turn({ userId: null, anonId: X }, null, "F8 asked signed out");
    await db.savedItem.create({ data: { anonOwnerId: X, kind: "answer", threadId: t.threadId } });
    const signedX = { userId: "user_F8", anonId: X };
    const preLog = await db.chatQuestionLog.findFirst({ where: { question: "F8 asked signed out" } });
    ok(preLog?.threadId === t.threadId && !preLog?.isPrivate, "before sign-in: the public log row points at the signed-out thread");
    const r = await S.resolveThread(db, t.threadId, signedX);
    ok(r.mode === "owned" && r.status === "claimed" && r.threadId === t.threadId, "same browser, signed in → claimed", JSON.stringify(r));
    await S.persistOwnedTurn(db, r as Extract<typeof r, { mode: "owned" }>, signedX, mk("F8 after sign-in", { isPrivate: true, userId: "user_F8" }));
    const th = await db.chatThread.findUnique({ where: { id: t.threadId } });
    ok(th?.userId === "user_F8" && th?.anonOwnerId === null && th?.claimedAt, "thread now belongs to the user (anon id cleared)");
    ok((await db.chatMessage.count({ where: { threadId: t.threadId } })) === 4, "the follow-up appended to the claimed thread");
    ok((await db.savedItem.count({ where: { threadId: t.threadId, userId: "user_F8", anonOwnerId: null } })) === 1, "the pre-sign-in save moved to the user");
    const postLog = await db.chatQuestionLog.findUnique({ where: { id: preLog!.id } });
    ok(postLog?.threadId === null && postLog?.question === "F8 asked signed out" && postLog?.trainEligible, "claim (via /api/chat) unlinks the pre-sign-in public log row; its public text stays");
    ok((await db.chatQuestionLog.count({ where: { threadId: t.threadId } })) === 0, "no log row points at the claimed (signed-in) thread");
    ok((await db.chatMessage.count({ where: { threadId: t.threadId, questionLogId: preLog!.id } })) === 2, "the thread's question + answer messages still point one way at that log row");
    ok((await S.getOwnedThread(db, t.threadId, { userId: null, anonId: X })) === null, "the signed-out browser no longer reads it");
    ok((await S.getOwnedThread(db, t.threadId, { userId: "user_F8", anonId: null }))?.messages.length === 4, "the user reads it from any browser");
    const Y = anon();
    ok(!(await S.claimThread(db, t.threadId, { userId: "user_F8_evil", anonId: Y })).ok, "second claim from another browser fails");
    ok(!(await S.claimThread(db, t.threadId, { userId: "user_F8_evil", anonId: X })).ok, "second claim by another account, same browser, fails");
    const ry = await S.resolveThread(db, t.threadId, { userId: "user_F8_evil", anonId: Y });
    ok(ry.mode === "owned" && ry.threadId !== t.threadId, "other browser via /api/chat → new thread");
    // A fresh anon thread can't be claimed from another browser even by a signed-in user.
    const t2 = await turn({ userId: null, anonId: X }, null, "F8 second anon thread");
    ok(!(await S.claimThread(db, t2.threadId, { userId: "user_F8", anonId: Y })).ok, "claim from a different browser (anon id) fails");
    ok((await db.chatThread.findUnique({ where: { id: t2.threadId } }))?.anonOwnerId === X, "unclaimed thread unchanged");
    // Explicit claim (POST /api/chat/threads/[id]/claim) unlinks the same way.
    const t4 = await turn({ userId: null, anonId: X }, null, "F8 explicit claim thread");
    await turn({ userId: null, anonId: X }, t4.threadId, "F8 explicit claim follow-up");
    ok((await db.chatQuestionLog.count({ where: { threadId: t4.threadId } })) === 2, "explicit claim: 2 public rows linked before");
    ok((await S.claimThread(db, t4.threadId, signedX)).ok, "explicit claim, same browser → ok");
    ok((await db.chatQuestionLog.count({ where: { threadId: t4.threadId } })) === 0, "explicit claim: both pre-sign-in public rows unlinked");
    ok((await db.chatQuestionLog.count({ where: { question: { in: ["F8 explicit claim thread", "F8 explicit claim follow-up"] }, threadId: null, isPrivate: false } })) === 2, "explicit claim: the rows themselves stay (public)");
    // One transaction: if the public-row unlink fails, the claim itself rolls back.
    const t5 = await turn({ userId: null, anonId: X }, null, "F8 atomic claim thread");
    const failing = new Proxy(db, {
      get(target, prop, recv) {
        if (prop !== "$transaction") return Reflect.get(target, prop, recv);
        return (fn: (tx: unknown) => Promise<unknown>) =>
          target.$transaction(async (tx) =>
            fn(new Proxy(tx, { get: (t, k, r) => (k === "chatQuestionLog" ? { updateMany: async () => { throw new Error("injected unlink failure"); } } : Reflect.get(t, k, r)) }))
          );
      },
    }) as typeof db;
    let threw = false;
    try {
      await S.claimThread(failing, t5.threadId, signedX);
    } catch {
      threw = true;
    }
    const t5row = await db.chatThread.findUnique({ where: { id: t5.threadId } });
    ok(threw && t5row?.userId === null && t5row?.anonOwnerId === X && t5row?.claimedAt === null, "unlink failure rolls the claim back (same transaction)");
    ok((await db.chatQuestionLog.count({ where: { threadId: t5.threadId } })) === 1, "rolled back: the public row is still linked to the still-signed-out thread");
    ok((await S.claimThread(db, t5.threadId, signedX)).ok && (await db.chatQuestionLog.count({ where: { threadId: t5.threadId } })) === 0, "retry claims and unlinks together");
    // Outside 24h.
    const t3 = await turn({ userId: null, anonId: X }, null, "F8 stale anon thread");
    await db.$executeRawUnsafe(`UPDATE "ChatThread" SET "createdAt" = now() - interval '25 hours' WHERE id = $1`, t3.threadId);
    const r3 = await S.resolveThread(db, t3.threadId, signedX);
    ok(r3.mode === "owned" && r3.threadId !== t3.threadId && r3.rejected === "claim-expired", "claim after 24h fails → new thread");
  }

  section("restore after reload (r4)");
  {
    const R = await import("@/lib/chat-restore");
    const now = Date.now();
    // Client plan: which marker leads to which request.
    ok(R.planRestore(null, true, { now }).kind === "current" && R.planRestore(null, false, { now }).kind === "current", "no marker (general chat) → the caller's current conversation");
    ok(R.planRestore(null, true, { now, general: false }).kind === "none", "no marker on a scoped chat → nothing");
    ok(R.planRestore({ id: "ct_restore_1", signedIn: true, at: now }, true, { now }).kind === "get", "signed-in marker, signed in → owner GET of that id");
    ok(R.planRestore({ id: "ct_restore_1", signedIn: false, at: now }, false, { now }).kind === "get", "signed-out marker, signed out → owner GET of that id");
    ok(R.planRestore({ id: "ct_restore_1", signedIn: true, at: now }, false, { now }).kind === "none", "signed-in conversation never comes back after sign-out");
    const c = R.planRestore({ id: "ct_restore_1", signedIn: false, at: now - 60_000 }, true, { now });
    ok(c.kind === "claim" && c.id === "ct_restore_1", "signed out → signed in, same browser, <24h → claim, then show");
    ok(R.planRestore({ id: "ct_restore_1", signedIn: false, at: now - 25 * 3600_000 }, true, { now }).kind === "none", "signed out → signed in after 24h → no claim");
    ok(R.planRestore({ id: null, signedIn: true, at: now }, true, { now }).kind === "none" && R.planRestore({ id: null, signedIn: false, at: now }, false, { now }).kind === "none", "after New chat / Delete (id null) → nothing to restore, even with older threads on the server");
    ok(R.planRestore({ id: "ct_restore_1", signedIn: true, at: now }, true, { now, canRestore: false }).kind === "none", "a ?q= / ?market= link starts fresh");
    ok(R.parseMarker(R.serializeMarker("ct_restore_1", true, now))?.id === "ct_restore_1", "marker round-trips");
    ok(R.parseMarker("{bad") === null && R.parseMarker(JSON.stringify({ id: "../x", signedIn: true, at: 1 })) === null && R.parseMarker(JSON.stringify({ id: "ct_restore_1" })) === null, "malformed / unsafe markers ignored");
    ok(!R.serializeMarker("ct_restore_1", false, now).match(/question|content|answer/i), "marker holds an id only, no conversation text");
    const restored = R.messagesFromThread([
      { role: "user", content: "Q1" },
      { role: "assistant", content: "A1", citations: JSON.stringify(["s1", 2, "s2"]) },
      { role: "assistant", content: "A2", citations: "not json" },
    ]);
    ok(restored.length === 3 && restored[1].question === "Q1" && JSON.stringify(restored[1].citations) === '["s1","s2"]' && restored[2].citations?.length === 0, "stored messages → chat messages", JSON.stringify(restored));

    // Server: GET /api/chat/threads/current (getCurrentThread) and the owner GET.
    const U = { userId: "user_RST", anonId: null };
    const older = await turn(U, null, "RST signed-in older");
    const newer = await turn(U, null, "RST signed-in newer");
    await turn(U, newer.threadId, "RST signed-in newer follow-up");
    await db.chatThread.update({ where: { id: older.threadId }, data: { title: "touch" } }); // bump: older is now most recent
    let cur = await S.getCurrentThread(db, U);
    ok(cur?.id === older.threadId, "signed in: the most recently updated owned thread", cur?.id);
    await turn(U, newer.threadId, "RST newer again");
    cur = await S.getCurrentThread(db, U);
    ok(cur?.id === newer.threadId && cur.messages.length === 6 && cur.messages[0].content === "RST signed-in newer", "signed in: newest after a follow-up, all messages in order");
    ok(!("userId" in (cur ?? {})) && !("anonOwnerId" in (cur ?? {})), "no owner ids in the response");
    ok((await S.getOwnedThread(db, newer.threadId, U))?.messages.length === 6, "owner GET of the marked id → 200");
    const V = { userId: "user_RST_other", anonId: null };
    ok((await S.getCurrentThread(db, V)) === null, "another user: nothing (404), none of U's content");
    ok((await S.getOwnedThread(db, newer.threadId, V)) === null, "another user with U's id: owner GET 404");
    const Xa = anon();
    const anonT = await turn({ userId: null, anonId: Xa }, null, "RST signed-out q");
    await turn({ userId: null, anonId: Xa }, anonT.threadId, "RST signed-out follow-up");
    const ac = await S.getCurrentThread(db, { userId: null, anonId: Xa });
    ok(ac?.id === anonT.threadId && ac.messages.length === 4, "signed out: this browser's own thread comes back");
    ok((await S.getCurrentThread(db, { userId: null, anonId: anon() })) === null, "another browser (other anon cookie): nothing");
    ok((await S.getCurrentThread(db, { userId: null, anonId: null })) === null, "no cookie: nothing");
    ok((await S.getOwnedThread(db, anonT.threadId, { userId: null, anonId: anon() })) === null, "another browser with the id: owner GET 404");
    ok((await S.getCurrentThread(db, { userId: "user_RST_other", anonId: Xa })) === null, "someone signing in on that browser doesn't see it before a claim");
    ok((await S.getOwnedThread(db, anonT.threadId, { userId: "user_RST", anonId: Xa })) === null, "a signed-in user can't read the browser's unclaimed thread directly");
    // Claim on sign-in, then it's the user's current conversation.
    const W = { userId: "user_RST_claim", anonId: Xa };
    ok((await S.claimThread(db, anonT.threadId, W)).ok, "same browser signs in → claim ok");
    const wc = await S.getCurrentThread(db, W);
    ok(wc?.id === anonT.threadId && wc.messages.length === 4, "after claim: shown as the signed-in user's conversation");
    ok((await S.getCurrentThread(db, { userId: null, anonId: Xa })) === null, "after claim: the signed-out browser no longer gets it");
    ok(!(await S.claimThread(db, anonT.threadId, W)).ok, "claim only once");
    // Purged signed-out thread → nothing.
    const Xp = anon();
    const pt = await turn({ userId: null, anonId: Xp }, null, "RST purge me");
    await db.$executeRawUnsafe(`UPDATE "ChatThread" SET "updatedAt" = now() - interval '120 days', "createdAt" = now() - interval '120 days' WHERE id = $1`, pt.threadId);
    ok((await S.getCurrentThread(db, { userId: null, anonId: Xp }))?.id === pt.threadId, "old signed-out thread still there before the purge");
    await S.purgeAnonThreads(db, {});
    ok((await S.getCurrentThread(db, { userId: null, anonId: Xp })) === null && (await S.getOwnedThread(db, pt.threadId, { userId: null, anonId: Xp })) === null, "after the purge: nothing to restore");
    // Delete → the deleted thread can't come back (owner GET 404); with no other thread, current is empty too.
    const D = { userId: "user_RST_del", anonId: null };
    const dt = await turn(D, null, "RST delete me");
    ok((await S.deleteThread(db, dt.threadId, D)).ok, "delete ok");
    ok((await S.getOwnedThread(db, dt.threadId, D)) === null && (await S.getCurrentThread(db, D)) === null, "after Delete: owner GET 404, nothing current");
    // New chat: a fresh question after restore starts a new thread and becomes current.
    const nc = await turn(U, null, "RST new chat");
    ok(nc.status === "new" && nc.threadId !== newer.threadId && (await S.getCurrentThread(db, U))?.id === nc.threadId, "New chat → new thread, which is now current");
    process.env.BUNGAH_CHAT_FOUNDATION = "off";
    ok((await S.getCurrentThread(db, U)) === null, "legacy schema: nothing to restore");
    delete process.env.BUNGAH_CHAT_FOUNDATION;
    S.resetFoundationCache();
    const routeSrc = fs.readFileSync(path.join(ROOT, "src/app/api/chat/threads/current/route.ts"), "utf8");
    ok(routeSrc.includes("ownerFromRequest(req)") && !/searchParams|params/.test(routeSrc), "current route reads the owner from the session/cookie only (no id or user parameter)");
  }

  section("r4 robustness (S1–S7, replay guard)");
  {
    const { POST: chatPOST } = await import("@/app/api/chat/route");
    const post = (body: unknown) => chatPOST(new Request("http://local/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: typeof body === "string" ? body : JSON.stringify(body) }));
    // S1: empty / whitespace / missing / non-string / bad JSON → 400, nothing written.
    const before = { t: await db.chatThread.count(), l: await db.chatQuestionLog.count(), m: await db.chatMessage.count() };
    for (const [name, b] of [["empty", { question: "" }], ["whitespace", { question: "   \n\t " }], ["missing", {}], ["number", { question: 42 }], ["null body", "null"], ["bad JSON", "{nope"]] as [string, unknown][]) {
      const r = await post(b);
      const j = (await r.json()) as { error?: string; code?: string };
      ok(r.status === 400 && typeof j.error === "string" && j.error.length > 0, `S1 ${name} question → 400 with a message`, `${r.status} ${JSON.stringify(j)}`);
    }
    // S2: over 1000 characters → 400 that says so (no silent cut); exactly 1000 is not refused for length.
    const long = await post({ question: "x".repeat(1001) });
    const lj = (await long.json()) as { error?: string; code?: string; maxLength?: number; length?: number };
    ok(long.status === 400 && lj.code === "too-long" && lj.maxLength === 1000 && lj.length === 1001 && /1,000 characters/.test(lj.error ?? "") && /1,001/.test(lj.error ?? ""), "S2 1,001 chars → 400 naming the cap and the length", JSON.stringify(lj));
    const huge = await post({ question: "y".repeat(5000) });
    ok(huge.status === 400, "S2 5,000 chars → 400");
    ok((await db.chatThread.count()) === before.t && (await db.chatQuestionLog.count()) === before.l && (await db.chatMessage.count()) === before.m, "S1/S2 refusals wrote no thread, message or log row");
    const routeSrc = fs.readFileSync(path.join(ROOT, "src/app/api/chat/route.ts"), "utf8");
    ok(!/\.slice\(0, MAX_QUESTION\)/.test(routeSrc), "S2 the route no longer slices the question");
    const client = fs.readFileSync(path.join(ROOT, "src/app/chat/ChatClient.tsx"), "utf8");
    ok(/const MAX_QUESTION = 1000/.test(client) && /data-chat-count/.test(client) && /input\.trim\(\)\.length > MAX_QUESTION/.test(client), "S2 client: visible counter and Send disabled over the cap");

    // S3: a Delete racing an in-flight turn never leaves an orphan.
    const O = { userId: "user_S3", anonId: null };
    const t = await turn(O, null, "S3 first");
    const pending = await S.resolveThread(db, t.threadId, O); // the follow-up resolved before the Delete…
    ok((await S.deleteThread(db, t.threadId, O)).ok, "S3 delete ok");
    const late = pending.mode === "owned" ? await S.persistOwnedTurn(db, pending, O, mk("S3 late follow-up", { isPrivate: true, userId: O.userId })) : null;
    ok(late?.skipped === "gone", "S3 …its after-response write finds the thread gone and writes nothing", JSON.stringify(late));
    ok((await db.chatThread.count({ where: { userId: "user_S3" } })) === 0 && (await db.chatMessage.count({ where: { threadId: t.threadId } })) === 0 && (await db.chatQuestionLog.count({ where: { userId: "user_S3" } })) === 0, "S3 no thread, message or log row left for that user");
    const r404 = await S.resolveThread(db, t.threadId, O);
    ok(r404.mode === "gone", "S3 a follow-up arriving after the Delete → gone (route: 404 thread-gone), no new thread", JSON.stringify(r404));
    ok((await db.chatThread.count({ where: { userId: "user_S3" } })) === 0, "S3 nothing minted");
    // Real race, both orders, signed in and signed out: never an orphan.
    for (let k = 0; k < 8; k++) {
      const who = k % 2 ? { userId: null, anonId: anon() } : { userId: `user_S3r${k}`, anonId: null };
      const rt = await turn(who, null, `S3 race ${k}`);
      const pr = await S.resolveThread(db, rt.threadId, who);
      if (pr.mode !== "owned") throw new Error("owned expected");
      const isPriv = Boolean(who.userId);
      await Promise.all([
        S.persistOwnedTurn(db, pr, who, mk(`S3 race ${k} follow-up`, { isPrivate: isPriv, userId: who.userId })),
        S.deleteThread(db, rt.threadId, who),
      ]);
      const msgs = await db.chatMessage.count({ where: { threadId: rt.threadId } });
      const th = await db.chatThread.count({ where: { id: rt.threadId } });
      const privLeft = isPriv ? await db.chatQuestionLog.count({ where: { userId: who.userId } }) : 0;
      const pubLinked = await db.chatQuestionLog.count({ where: { threadId: rt.threadId } });
      ok(th === 0 && msgs === 0 && privLeft === 0 && pubLinked === 0, `S3 race ${k} (${isPriv ? "signed in" : "signed out"}): no thread, messages, private rows or linked public rows left`, JSON.stringify({ th, msgs, privLeft, pubLinked }));
    }
    const wrongOwner = await S.persistOwnedTurn(db, { mode: "owned", threadId: (await turn({ userId: "user_S3own", anonId: null }, null, "S3 owned")).threadId, status: "existing" }, { userId: "user_S3thief", anonId: null }, mk("S3 thief", { isPrivate: true, userId: "user_S3thief" }));
    ok(wrongOwner.skipped === "gone" && (await db.chatQuestionLog.count({ where: { userId: "user_S3thief" } })) === 0, "S3 the write re-checks ownership inside the transaction");

    // S4: retry with the same request id → one thread, one turn.
    const R4 = { userId: null, anonId: anon() };
    const rid = "req_" + randomBytes(8).toString("hex");
    const first = await S.resolveThread(db, null, R4, new Date(), { requestId: rid });
    ok(first.mode === "owned" && first.status === "new" && first.threadId === S.threadIdForRequest(R4, rid), "S4 first question with a request id → its derived thread id");
    if (first.mode !== "owned") throw new Error("owned expected");
    const w1 = await S.createOwnedThread(db, first, R4, "S4 q");
    // The client never got the answer (aborted) and retries with the same id before the late write lands.
    const again = await S.resolveThread(db, null, R4, new Date(), { requestId: rid });
    ok(again.mode === "owned" && again.status === "existing" && again.replay === true && again.threadId === first.threadId, "S4 retry of a first question → same thread (replay), not a second one", JSON.stringify(again));
    const a1 = await S.persistOwnedTurn(db, w1, R4, mk("S4 q"), { requestId: rid }); // late after() of the first try
    const a2 = again.mode === "owned" ? await S.persistOwnedTurn(db, again, R4, mk("S4 q"), { requestId: rid }) : null; // the retry's write
    ok(a1.logId && a2?.skipped === "duplicate", "S4 late write + retry write → written once", JSON.stringify({ a1, a2 }));
    ok((await db.chatThread.count({ where: { anonOwnerId: R4.anonId } })) === 1 && (await db.chatMessage.count({ where: { threadId: first.threadId } })) === 2 && (await db.chatQuestionLog.count({ where: { question: "S4 q" } })) === 1, "S4 one thread, 2 messages, 1 log row");
    // Concurrent duplicate writes of a follow-up with one id.
    const rid2 = "req_" + randomBytes(8).toString("hex");
    const fu = await S.resolveThread(db, first.threadId, R4);
    if (fu.mode !== "owned") throw new Error("owned expected");
    const both = await Promise.all([S.persistOwnedTurn(db, fu, R4, mk("S4 follow-up"), { requestId: rid2 }), S.persistOwnedTurn(db, fu, R4, mk("S4 follow-up"), { requestId: rid2 })]);
    ok(both.filter((b) => b.skipped === "duplicate").length === 1 && (await db.chatMessage.count({ where: { threadId: first.threadId } })) === 4, "S4 two concurrent copies of one follow-up → one turn", JSON.stringify(both));
    ok(S.threadIdForRequest({ userId: null, anonId: anon() }, rid) !== first.threadId, "S4 the same request id from another owner → a different thread id");
    ok((await S.resolveThread(db, null, R4, new Date(), { requestId: "bad id!" })).mode === "owned", "S4 a malformed request id is ignored (random thread)");
    const R = await import("@/lib/chat-restore");
    const ui = [
      { role: "user", question: "Q", content: "Q" },
      { role: "assistant", question: "Q", content: "A" },
      { role: "user", question: "Q2", content: "Q2", requestId: "r2" },
      { role: "assistant", question: "Q2", content: "fail", failed: true, requestId: "r2" },
    ];
    const kept = R.withoutFailedTurn(ui, 3);
    ok(kept.length === 2 && kept.every((m) => m.content !== "fail" && m.content !== "Q2"), "S4 Try again removes the failed bubble and its question (the resend adds the question once)", JSON.stringify(kept));
    ok(R.withoutFailedTurn(ui, 1).length === 4, "S4 a non-failed message is never removed");
    ok(/requestId,/.test(client) && /retry\(i\)/.test(client) && /withoutFailedTurn\(m, i\)/.test(client), "S4 client sends the request id and Try again replaces the failed turn");

    // S5: a second tab shares the marker (localStorage) and the cookie → it continues the latest thread.
    const T1 = { userId: null, anonId: anon() };
    const tab1 = await turn(T1, null, "S5 tab 1 question");
    const marker = R.parseMarker(R.serializeMarker(tab1.threadId, false));
    const plan2 = R.planRestore(marker, false);
    ok(plan2.kind === "get" && plan2.id === tab1.threadId, "S5 tab 2 reads tab 1's marker → owner GET of the same thread");
    ok((await S.getOwnedThread(db, tab1.threadId, T1))?.messages.length === 2, "S5 tab 2 (same cookie) gets the conversation");
    const tab2 = await S.resolveThread(db, tab1.threadId, T1);
    ok(tab2.mode === "owned" && tab2.status === "existing" && tab2.threadId === tab1.threadId, "S5 tab 2's next question continues it (no second thread)");
    ok(R.planRestore(null, false).kind === "current" && (await S.getCurrentThread(db, T1))?.id === tab1.threadId, "S5 without a marker, the cookie owner's latest thread comes back");

    // S6: account deletion also removes the unclaimed signed-out threads of the browsers the user signed in on.
    const browser1 = anon();
    const browser2 = anon();
    const otherBrowser = anon();
    const u6 = "user_S6";
    const anonT1 = await turn({ userId: null, anonId: browser1 }, null, "S6 signed out on browser 1");
    const anonT1b = await turn({ userId: null, anonId: browser1 }, null, "S6 second signed-out thread, browser 1");
    await db.savedItem.create({ data: { anonOwnerId: browser1, kind: "answer", threadId: anonT1b.threadId } });
    const anonT2 = await turn({ userId: null, anonId: browser2 }, null, "S6 signed out on browser 2");
    const claimedT = await turn({ userId: null, anonId: browser2 }, null, "S6 claimed later");
    const keepT = await turn({ userId: null, anonId: otherBrowser }, null, "S6 someone else's browser");
    const signedT = await turn({ userId: u6, anonId: null }, null, "S6 signed in");
    await S.recordAnonLink(db, { userId: u6, anonId: browser1 });
    await S.recordAnonLink(db, { userId: u6, anonId: browser1 }); // idempotent
    await S.recordAnonLink(db, { userId: u6, anonId: browser2 });
    ok(await S.claimThread(db, claimedT.threadId, { userId: u6, anonId: browser2 }).then((x) => x.ok), "S6 one browser-2 thread claimed");
    // Another user signed in on browser 2 too: their claimed thread stays theirs.
    const otherUserClaim = await turn({ userId: null, anonId: browser2 }, null, "S6 browser 2, claimed by another user");
    await S.claimThread(db, otherUserClaim.threadId, { userId: "user_S6_other", anonId: browser2 });
    ok((await db.chatAnonLink.count({ where: { userId: u6 } })) === 2, "S6 links recorded once per browser");
    ok((await S.recordAnonLink(db, { userId: null, anonId: browser1 })) === undefined && (await db.chatAnonLink.count({ where: { anonId: browser1 } })) === 1, "S6 no link without a signed-in user");
    const pubBefore = await db.chatQuestionLog.count({ where: { isPrivate: false } });
    const out = await S.deleteUserData(db, u6);
    ok(out.ok && "anonThreads" in out && out.anonThreads === 3, "S6 user.deleted: 3 unclaimed signed-out threads from the user's browsers deleted", JSON.stringify(out));
    for (const [id, name] of [[anonT1.threadId, "browser 1 thread"], [anonT1b.threadId, "browser 1 thread with a save"], [anonT2.threadId, "browser 2 thread"], [claimedT.threadId, "claimed thread"], [signedT.threadId, "signed-in thread"]] as [string, string][])
      ok((await db.chatThread.count({ where: { id } })) === 0 && (await db.chatMessage.count({ where: { threadId: id } })) === 0, `S6 gone: ${name}`);
    ok((await db.savedItem.count({ where: { anonOwnerId: browser1 } })) === 0, "S6 the browser's signed-out saves go too");
    ok((await db.chatThread.count({ where: { id: keepT.threadId } })) === 1, "S6 another browser's signed-out thread is untouched");
    ok((await db.chatThread.count({ where: { id: otherUserClaim.threadId, userId: "user_S6_other" } })) === 1, "S6 a thread another user claimed from the same browser is untouched");
    ok((await db.chatQuestionLog.count({ where: { isPrivate: false } })) === pubBefore, "S6 public log rows stay (unlinked), same as the purge");
    ok((await db.chatQuestionLog.count({ where: { threadId: { in: [anonT1.threadId, anonT2.threadId] } } })) === 0, "S6 …and no longer point at the deleted threads");
    ok((await db.chatAnonLink.count({ where: { userId: u6 } })) === 0, "S6 the links go with the account");
    const routes = ["src/app/api/chat/route.ts", "src/app/api/chat/threads/[id]/claim/route.ts", "src/app/api/chat/threads/current/route.ts"].map((f) => fs.readFileSync(path.join(ROOT, f), "utf8"));
    ok(routes.every((r) => r.includes("recordAnonLink(")), "S6 chat, claim and current routes record the link when signed in with the browser cookie");

    // S7: composer pinned on landscape phones; keyboard inset.
    const css = fs.readFileSync(path.join(ROOT, "src/app/globals.css"), "utf8");
    ok(/@custom-variant desk \(@media \(min-width: 640px\) and \(min-height: 500px\)\)/.test(css), "S7 desktop composer needs width ≥640 AND height ≥500");
    ok(/@media \(max-width: 639\.98px\), \(max-height: 499\.98px\)/.test(css), "S7 body padding rule mirrors it (844×390, 740×360 keep the padding)");
    const composer = /data-composer className="([^"]+)"/.exec(client)?.[1] ?? "";
    ok(composer.includes("fixed") && composer.includes("desk:static") && !/\bsm:/.test(composer), "S7 composer: fixed unless desk (no width-only sm:)", composer);
    ok(composer.includes("bottom-[var(--chat-kb-inset,0px)]") && /visualViewport/.test(client) && /--chat-kb-inset/.test(client), "S7 visualViewport inset lifts the composer above the keyboard");

    // Replay guard: the same svix-id is processed once.
    const { POST: whPOST } = await import("@/app/api/webhooks/clerk/route");
    const u7 = "user_S7_replay";
    await turn({ userId: u7, anonId: null }, null, "replay q");
    const b7 = JSON.stringify({ type: "user.deleted", data: { id: u7, deleted: true } });
    const id7 = `msg_${randomBytes(8).toString("hex")}`;
    const ts7 = String(Math.floor(Date.now() / 1000));
    const h7 = () => new Headers({ "svix-id": id7, "svix-timestamp": ts7, "svix-signature": `v1,${svixSign(WH_SECRET, id7, ts7, b7)}`, "content-type": "application/json" });
    const first7 = (await (await whPOST(new Request("http://local/api/webhooks/clerk", { method: "POST", body: b7, headers: h7() }))).json()) as { deleted?: { threads?: number }; duplicate?: boolean };
    const second7 = (await (await whPOST(new Request("http://local/api/webhooks/clerk", { method: "POST", body: b7, headers: h7() }))).json()) as { duplicate?: boolean };
    ok(first7.deleted?.threads === 1 && !first7.duplicate && second7.duplicate === true, "replay guard: first delivery runs, the same svix-id again is acknowledged as a duplicate", JSON.stringify({ first7, second7 }));
    const badSig = await whPOST(new Request("http://local/api/webhooks/clerk", { method: "POST", body: b7, headers: new Headers({ "svix-id": id7, "svix-timestamp": ts7, "svix-signature": "v1,AAAA" }) }));
    ok(badSig.status === 401, "replay guard never skips the signature check (bad signature with a seen id → 401)");
  }

  section("F9 no spend / zero-retention unchanged");
  {
    const diff = (p: string) => execSync(`git diff ${BASE} -- ${p}`, { cwd: ROOT }).toString();
    ok(diff("src/lib/chat-llm.ts") === "", "src/lib/chat-llm.ts unchanged (LLM gate, Groq zero-retention settings)");
    ok(diff(".env.example") === "", ".env.example unchanged");
    const pkgNow = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
    const pkgBase = JSON.parse(execSync(`git show ${BASE}:package.json`, { cwd: ROOT }).toString());
    ok(JSON.stringify(pkgNow.dependencies) === JSON.stringify(pkgBase.dependencies), "no new runtime dependency");
    ok(JSON.stringify(pkgNow.devDependencies) === JSON.stringify(pkgBase.devDependencies), "no new dev dependency");
    const vjPath = path.join(ROOT, "vercel.json");
    ok(fs.existsSync(vjPath), "vercel.json declares the Production chat-purge cron");
    const vj = JSON.parse(fs.readFileSync(vjPath, "utf8")) as { crons?: { path?: string; schedule?: string }[] };
    ok(Array.isArray(vj.crons) && vj.crons.some((c) => c.path === "/api/cron/chat-purge" && Boolean(c.schedule)), "chat-purge cron is scheduled in vercel.json");
    const changed = execSync(`git diff --name-only ${BASE}`, { cwd: ROOT }).toString().split("\n").filter((f) => /\.(ts|tsx|mjs)$/.test(f) && fs.existsSync(path.join(ROOT, f)) && f !== "scripts/chat/test-foundation.ts");
    const bad = changed.filter((f) => /BUNGAH_USE_LLM|GROQ_API_KEY|AI_GATEWAY_API_KEY|OPENAI_API_KEY|BUNGAH_CHAT_MODEL|https?:\/\/(?!local\b)/.test(fs.readFileSync(path.join(ROOT, f), "utf8").replace(/^\s*(\/\/|\/?\*).*$/gm, "")));
    ok(bad.length === 0, "changed files add no model keys, LLM flag or external URL", bad.join(","));
    const { isLlmEnabled } = await import("@/lib/chat-llm");
    ok(isLlmEnabled() === false, "isLlmEnabled() false with BUNGAH_USE_LLM unset");
  }

  section("legacy schema (production today) + additive migration");
  {
    // A database on the pre-foundation schema (what production has today), then the foundation migration.
    const psql = (sql: string, dbname = "postgres") => {
      const x = new URL(DB_URL);
      x.pathname = `/${dbname}`;
      execSync(`psql "${x.toString()}" -v ON_ERROR_STOP=1 -q -c ${JSON.stringify(sql)}`, { stdio: "pipe" });
    };
    psql(`DROP DATABASE IF EXISTS ${PRODLIKE_DB}`);
    psql(`CREATE DATABASE ${PRODLIKE_DB}`);
    const oldSchema = path.join(os.tmpdir(), `schema-${BASE}.prisma`);
    fs.writeFileSync(oldSchema, execSync(`git show ${BASE}:prisma/schema.prisma`, { cwd: ROOT }));
    execSync(`npx prisma db push --schema ${oldSchema} --skip-generate --accept-data-loss`, { cwd: ROOT, env: { ...process.env, DATABASE_URL: prodlikeUrl }, stdio: "pipe" });
    const old = new PrismaClient({ datasourceUrl: prodlikeUrl });
    S.resetFoundationCache();
    ok((await S.foundationReady(old, { fresh: true })) === false, "foundationReady false on the old schema");
    ok((await S.resolveThread(old, "ct_whatever", { userId: "user_L", anonId: null })).mode === "legacy", "resolveThread → legacy (no new reads)");
    const lp = await S.legacyPersist(old, mk("Legacy private Q", { isPrivate: true, userId: "user_L" }));
    const lpub = await S.legacyPersist(old, mk("Legacy public Q"));
    ok(Boolean(lp.threadId) && Boolean(lpub.threadId), "legacy write works against the old schema (new client, no new columns referenced)");
    const lrows = await old.chatQuestionLog.findMany({ select: { question: true, threadId: true, isPrivate: true } });
    ok(lrows.find((r) => r.isPrivate)?.threadId === null, "legacy path: private log row has threadId null (A)");
    ok(lrows.find((r) => !r.isPrivate)?.threadId === lpub.threadId, "legacy path: public log row keeps its threadId");
    ok((await S.getOwnedThread(old, lp.threadId, { userId: "user_L", anonId: null })) === null, "legacy: no thread is readable");
    ok(!(await S.deleteThread(old, lp.threadId, { userId: "user_L", anonId: null })).ok, "legacy: delete conversation is a 404");
    const pr = await S.purgeAnonThreads(old, {});
    ok("skipped" in pr && pr.skipped === "schema" && pr.deleted === 0, "legacy: purge skipped (schema)");
    const du = await S.deleteUserData(old, "user_L");
    ok(du.ok && du.privateLogs === 1 && (await old.chatThread.count()) === 2, "legacy: account delete removes the user's log rows only, threads untouched");
    ok((await old.chatQuestionLog.count({ where: { isPrivate: false } })) === 1, "legacy: public row untouched");
    const { buildCorpus } = await import("@/lib/train-export");
    ok((await buildCorpus(old)).stats.optInWritten === 0, "legacy: export runs, public only");
    // Apply the foundation migrations as-is (r4 adds ChatAnonLink): additive, no backfill.
    const before = await old.chatThread.count();
    const x = new URL(prodlikeUrl);
    execSync(`psql "${x.toString()}" -v ON_ERROR_STOP=1 -q -f ${path.join(ROOT, "prisma/migrations/20261114000000_chat_foundation/migration.sql")}`, { stdio: "pipe" });
    S.resetFoundationCache();
    ok(!(await S.foundationReady(old, { fresh: true })), "first migration only: still the legacy path (ChatAnonLink missing)");
    execSync(`psql "${x.toString()}" -v ON_ERROR_STOP=1 -q -f ${path.join(ROOT, "prisma/migrations/20261115000000_chat_anon_link/migration.sql")}`, { stdio: "pipe" });
    S.resetFoundationCache();
    ok(await S.foundationReady(old, { fresh: true }), "after both migration SQL files: foundationReady true");
    const rows = await old.$queryRawUnsafe<{ n: bigint; owned: bigint }[]>(`SELECT count(*) n, count("userId") + count("anonOwnerId") owned FROM "ChatThread"`);
    ok(Number(rows[0].n) === before && Number(rows[0].owned) === 0, "existing threads kept, none backfilled (all unowned)");
    const drift = (() => {
      try {
        execSync(`npx prisma migrate diff --from-url "${prodlikeUrl}" --to-schema-datamodel prisma/schema.prisma --exit-code`, { cwd: ROOT, stdio: "pipe" });
        return 0;
      } catch (e) {
        return (e as { status?: number }).status ?? 1;
      }
    })();
    ok(drift === 0, "old schema + migration SQL == new schema.prisma (no drift)");
    const pu = await S.purgeAnonThreads(old, { now: new Date(Date.now() + 365 * 864e5) });
    ok(pu.deleted === 0 && (await old.chatThread.count()) === before, "purge a year later still never touches pre-existing unowned threads");
    await old.$disconnect();
    S.resetFoundationCache();
  }

  await db.$disconnect();
  console.log("\n== summary");
  for (const [k, v] of Object.entries(sections)) console.log(`${v.fail ? "FAIL" : "ok  "} ${k}: ${v.pass}/${v.pass + v.fail}`);
  if (fails.length) {
    console.log(`\nFAILURES (${fails.length}):`);
    for (const f of fails) console.log(" - " + f);
  }
  console.log(`\nfoundation test: ${pass}/${pass + fails.length} checks pass`);
  process.exitCode = fails.length ? 1 : 0;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
