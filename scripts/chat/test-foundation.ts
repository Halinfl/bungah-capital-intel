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

  section("F9 no spend / zero-retention unchanged");
  {
    const diff = (p: string) => execSync(`git diff ${BASE} -- ${p}`, { cwd: ROOT }).toString();
    ok(diff("src/lib/chat-llm.ts") === "", "src/lib/chat-llm.ts unchanged (LLM gate, Groq zero-retention settings)");
    ok(diff(".env.example") === "", ".env.example unchanged");
    const pkgNow = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
    const pkgBase = JSON.parse(execSync(`git show ${BASE}:package.json`, { cwd: ROOT }).toString());
    ok(JSON.stringify(pkgNow.dependencies) === JSON.stringify(pkgBase.dependencies), "no new runtime dependency");
    ok(JSON.stringify(pkgNow.devDependencies) === JSON.stringify(pkgBase.devDependencies), "no new dev dependency");
    ok(!fs.existsSync(path.join(ROOT, "vercel.json")), "no vercel.json (no cron or config change shipped)");
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
    // Apply the foundation migration as-is: additive, no backfill.
    const before = await old.chatThread.count();
    const mig = path.join(ROOT, "prisma/migrations/20261114000000_chat_foundation/migration.sql");
    const x = new URL(prodlikeUrl);
    execSync(`psql "${x.toString()}" -v ON_ERROR_STOP=1 -q -f ${mig}`, { stdio: "pipe" });
    S.resetFoundationCache();
    ok(await S.foundationReady(old, { fresh: true }), "after the migration SQL: foundationReady true");
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
