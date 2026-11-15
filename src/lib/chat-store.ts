/**
 * Chat ownership + retention foundation (Batch 2 "F", 2026-11-14; Hal decisions A–D).
 *
 * - One conversation = one ChatThread. The server mints the thread id with the first answer and accepts it
 *   back on a follow-up only from the same owner (Clerk userId, or the signed bci_anon cookie when signed out).
 * - A: private (signed-in) content lives only in the owner's thread. Its ChatQuestionLog row keeps no
 *   question/answer/citation text and has threadId = null; the owner's ChatMessage rows point to the log row
 *   (questionLogId), never the other way round.
 * - B: signed-out threads with nothing saved are purged 90 days after their last activity (purgeAnonThreads).
 *   Signed-in threads stay until the owner deletes the conversation (deleteThread) or the account
 *   (deleteUserData, Clerk user.deleted webhook).
 * - Legacy unowned threads (userId and anonOwnerId both null, written before the foundation) are never shown
 *   to anyone and never deleted by this code.
 * - Schema gate: every new read/write runs only when the database has the foundation columns
 *   (foundationReady). Without them the chat keeps its old write path (legacyPersist), except that a private
 *   log row no longer links to its thread (A).
 */
import { randomUUID } from "node:crypto";
import type { Prisma, PrismaClient } from "@prisma/client";

type Db = PrismaClient;

export const PURGE_DAYS = 90;
/** A signed-out thread may be claimed by its signed-in owner once, from the same browser, within this window. */
export const CLAIM_WINDOW_MS = 24 * 60 * 60 * 1000;
/** Upper bound on threads deleted per purge run (keeps one cron invocation short). */
export const PURGE_BATCH = 500;

/* ------------------------------------------------------------------ schema gate */

const REQUIRED_COLUMNS: [table: string, column: string][] = [
  ["ChatThread", "userId"],
  ["ChatThread", "anonOwnerId"],
  ["ChatThread", "claimedAt"],
  ["ChatMessage", "questionLogId"],
  ["SavedItem", "id"],
  ["SavedItem", "threadId"],
  ["SavedItem", "messageId"],
  ["ChatUserPref", "trainOptIn"],
];
const READY_TTL_MS = 60_000;
let readyCache: { at: number; value: boolean } | null = null;

/**
 * True only when every foundation column/table exists (positive result cached for the process, negative for
 * 60 s). BUNGAH_CHAT_FOUNDATION=off forces the legacy path. Any error → false (legacy path).
 */
export async function foundationReady(db: Db, opts: { fresh?: boolean } = {}): Promise<boolean> {
  if (process.env.BUNGAH_CHAT_FOUNDATION?.trim().toLowerCase() === "off") return false;
  if (!opts.fresh && readyCache && (readyCache.value || Date.now() - readyCache.at < READY_TTL_MS)) return readyCache.value;
  let value = false;
  try {
    const rows = await db.$queryRaw<{ table_name: string; column_name: string }[]>`
      SELECT table_name, column_name FROM information_schema.columns
      WHERE table_schema = current_schema() AND table_name IN ('ChatThread', 'ChatMessage', 'SavedItem', 'ChatUserPref')`;
    const have = new Set(rows.map((r) => `${r.table_name}.${r.column_name}`));
    value = REQUIRED_COLUMNS.every(([t, c]) => have.has(`${t}.${c}`));
  } catch {
    value = false;
  }
  readyCache = { at: Date.now(), value };
  return value;
}
export function resetFoundationCache(): void {
  readyCache = null;
}

/* ------------------------------------------------------------------ owners */

/** Who is asking. Signed in → userId (the anon id is kept only to claim a thread from before sign-in). */
export type Owner = { userId: string | null; anonId: string | null };

type ThreadOwnerRow = { id: string; userId: string | null; anonOwnerId: string | null; createdAt: Date; claimedAt: Date | null };

/** Owned by this caller? Legacy unowned threads (both null) never match anyone. */
export function ownsThread(t: Pick<ThreadOwnerRow, "userId" | "anonOwnerId">, o: Owner): boolean {
  if (t.userId) return Boolean(o.userId) && t.userId === o.userId;
  if (t.anonOwnerId) return !o.userId && Boolean(o.anonId) && t.anonOwnerId === o.anonId;
  return false;
}

export function newThreadId(): string {
  return `ct_${randomUUID().replace(/-/g, "")}`;
}

export type ResolvedThread =
  | { mode: "legacy" }
  /** Foundation schema, but no owner to give the thread (signed out without an anon cookie secret): log row only. */
  | { mode: "log-only" }
  /** `existing`: append to this thread. `new`: create it with the answer. `claimed`: signed-out thread just claimed. */
  | { mode: "owned"; threadId: string; status: "existing" | "new" | "claimed"; rejected?: "not-owner" | "not-found" | "claim-expired" };

const THREAD_ID_RE = /^[A-Za-z0-9_-]{8,64}$/;

/**
 * Resolve the thread a turn belongs to (read-only except for a claim). A threadId from anyone but its owner,
 * an unknown id or a legacy unowned id starts a new thread (F2); nothing from the other thread is read back.
 * A signed-out thread is claimed when the same browser (same anon cookie) sends it signed in within 24h,
 * once (F8): the claim moves ownership to the userId and clears anonOwnerId, so no other browser can claim it.
 */
export async function resolveThread(db: Db, requestedId: unknown, owner: Owner, now = new Date()): Promise<ResolvedThread> {
  if (!(await foundationReady(db))) return { mode: "legacy" };
  if (!owner.userId && !owner.anonId) return { mode: "log-only" };
  const id = typeof requestedId === "string" && THREAD_ID_RE.test(requestedId) ? requestedId : null;
  if (!id) return { mode: "owned", threadId: newThreadId(), status: "new" };
  const t = await db.chatThread.findUnique({ where: { id }, select: { id: true, userId: true, anonOwnerId: true, createdAt: true, claimedAt: true } });
  if (!t) return { mode: "owned", threadId: newThreadId(), status: "new", rejected: "not-found" };
  if (ownsThread(t, owner)) return { mode: "owned", threadId: t.id, status: "existing" };
  // Claim: a signed-in caller sending the signed-out thread its own browser started.
  if (owner.userId && owner.anonId && !t.userId && t.anonOwnerId === owner.anonId) {
    const claimed = await claimThread(db, t.id, owner, now);
    if (claimed.ok) return { mode: "owned", threadId: t.id, status: "claimed" };
    return { mode: "owned", threadId: newThreadId(), status: "new", rejected: "claim-expired" };
  }
  return { mode: "owned", threadId: newThreadId(), status: "new", rejected: "not-owner" };
}

/**
 * One-time claim of a signed-out thread by its signed-in owner (same browser, within 24h of its creation).
 * Atomic: a conditional update, so a second claim (another browser, another account, or a replay) changes
 * nothing. Saved items made before sign-in move to the user with it; the public log rows written before
 * sign-in are unlinked from the thread (threadId → null). All in one transaction.
 */
export async function claimThread(db: Db, threadId: string, owner: Owner, now = new Date()): Promise<{ ok: boolean; reason?: string }> {
  if (!(await foundationReady(db))) return { ok: false, reason: "schema" };
  if (!owner.userId || !owner.anonId) return { ok: false, reason: "needs-sign-in-and-browser" };
  const since = new Date(now.getTime() - CLAIM_WINDOW_MS);
  // One transaction: the ownership change, the saves moving with it and the public-row unlink (Decision A)
  // land together or not at all, so no committed state has a signed-in thread with linked public log rows.
  return db.$transaction(async (tx) => {
    const res = await tx.chatThread.updateMany({
      where: { id: threadId, userId: null, claimedAt: null, anonOwnerId: owner.anonId, createdAt: { gte: since } },
      data: { userId: owner.userId, anonOwnerId: null, claimedAt: now },
    });
    if (res.count !== 1) return { ok: false, reason: "not-claimable" };
    await tx.savedItem.updateMany({ where: { threadId, anonOwnerId: owner.anonId }, data: { userId: owner.userId, anonOwnerId: null } });
    // The public rows written before sign-in keep their (signed-out) text but lose the link; the thread's
    // messages still point at them one way (questionLogId).
    await tx.chatQuestionLog.updateMany({ where: { threadId, isPrivate: false }, data: { threadId: null } });
    return { ok: true };
  });
}

/* ------------------------------------------------------------------ writes */

export type TurnInput = {
  question: string;
  answerText: string;
  citations: string[];
  marketSlug: string | null;
  intent: string;
  answeredWell: boolean;
  modelUsed: "llm" | "memo";
  isPrivate: boolean;
  userId: string | null;
  source: string;
};

function snippet(text: string, max = 240): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).trimEnd() + "…";
}

/** The log row. Private rows carry no question/answer/citation text and never a threadId (Decision A). */
export function logRowData(x: TurnInput, threadId: string | null): Prisma.ChatQuestionLogCreateInput {
  return {
    question: x.isPrivate ? "[private]" : x.question,
    marketSlug: x.marketSlug,
    intent: x.intent,
    answerText: x.isPrivate ? null : x.answerText,
    answerSnippet: x.isPrivate ? null : snippet(x.answerText),
    citationsJson: x.isPrivate ? null : JSON.stringify(x.citations),
    answeredWell: x.answeredWell,
    modelUsed: x.modelUsed,
    trainEligible: !x.isPrivate,
    isPrivate: x.isPrivate,
    userId: x.userId,
    threadId: x.isPrivate ? null : threadId,
    source: x.source,
  };
}

/**
 * Create a new owned thread now (before the response goes out), so a follow-up sent the moment the answer
 * lands finds it. Returns the same resolution marked "existing" for the after-response write.
 */
export async function createOwnedThread(db: Db, r: Extract<ResolvedThread, { mode: "owned" }>, owner: Owner, title: string): Promise<Extract<ResolvedThread, { mode: "owned" }>> {
  if (r.status !== "new") return r;
  if (!owner.userId && !owner.anonId) throw new Error("createOwnedThread: no owner");
  await db.chatThread.create({
    data: { id: r.threadId, title: title.slice(0, 80) || "Chat", userId: owner.userId, anonOwnerId: owner.userId ? null : owner.anonId },
    select: { id: true },
  });
  return { ...r, status: "existing" };
}

/**
 * Owned write (foundation schema): create the thread on its first turn, then the log row, then the two
 * messages pointing at the log row. Follow-ups append to the same thread (F1).
 */
export async function persistOwnedTurn(db: Db, r: Extract<ResolvedThread, { mode: "owned" }>, owner: Owner, x: TurnInput): Promise<{ threadId: string; logId: string }> {
  const threadId = r.threadId;
  // Never create an unowned thread: the caller must have a userId or an anon id.
  if (!owner.userId && !owner.anonId) throw new Error("persistOwnedTurn: no owner");
  if (r.status === "new") {
    await db.chatThread.create({
      data: { id: threadId, title: x.question.slice(0, 80) || "Chat", userId: owner.userId, anonOwnerId: owner.userId ? null : owner.anonId },
      select: { id: true },
    });
  }
  const log = await db.chatQuestionLog.create({ data: logRowData(x, threadId), select: { id: true } });
  const t0 = Date.now();
  await db.chatMessage.createMany({
    data: [
      { threadId, role: "user", content: x.question, questionLogId: log.id, createdAt: new Date(t0) },
      { threadId, role: "assistant", content: x.answerText, citations: JSON.stringify(x.citations), questionLogId: log.id, createdAt: new Date(t0 + 1) },
    ],
  });
  await db.chatThread.update({ where: { id: threadId }, data: { updatedAt: new Date() }, select: { id: true } });
  return { threadId, logId: log.id };
}

/**
 * Pre-foundation write path (database without the new columns): one thread per answer as before, selecting
 * only `id` so no new column is ever referenced. The one change: a private log row has threadId null (A).
 */
export async function legacyPersist(db: Db, x: TurnInput): Promise<{ threadId: string; logId: string }> {
  const thread = await db.chatThread.create({
    data: {
      title: x.question.slice(0, 80) || "Chat",
      messages: {
        create: [
          { role: "user", content: x.question },
          { role: "assistant", content: x.answerText, citations: JSON.stringify(x.citations) },
        ],
      },
    },
    select: { id: true },
  });
  const log = await db.chatQuestionLog.create({ data: logRowData(x, thread.id), select: { id: true } });
  return { threadId: thread.id, logId: log.id };
}

/** Foundation schema, no owner: the log row only (public, threadId null). Nothing unowned is written. */
export async function persistLogOnly(db: Db, x: TurnInput): Promise<{ threadId: null; logId: string }> {
  const log = await db.chatQuestionLog.create({ data: logRowData(x, null), select: { id: true } });
  return { threadId: null, logId: log.id };
}

/* ------------------------------------------------------------------ reads */

export async function getOwnedThread(db: Db, threadId: string, owner: Owner) {
  if (!(await foundationReady(db))) return null;
  if (!THREAD_ID_RE.test(threadId)) return null;
  const t = await db.chatThread.findUnique({
    where: { id: threadId },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      anonOwnerId: true,
      messages: { orderBy: [{ createdAt: "asc" }, { id: "asc" }], select: { id: true, role: true, content: true, citations: true, createdAt: true } },
    },
  });
  if (!t || !ownsThread(t, owner)) return null;
  const { userId: _u, anonOwnerId: _a, ...rest } = t;
  void _u;
  void _a;
  return rest;
}

/**
 * The caller's current conversation (r4, restore after reload): signed in → their most recently updated
 * thread; signed out → this browser's (anon cookie's) most recent thread, if the purge hasn't removed it.
 * Nobody else's thread can come back: the lookup is by the caller's own owner id only.
 */
export async function getCurrentThread(db: Db, owner: Owner) {
  if (!(await foundationReady(db))) return null;
  const where: Prisma.ChatThreadWhereInput | null = owner.userId
    ? { userId: owner.userId }
    : owner.anonId
      ? { anonOwnerId: owner.anonId, userId: null }
      : null;
  if (!where) return null;
  const t = await db.chatThread.findFirst({ where, orderBy: [{ updatedAt: "desc" }, { id: "desc" }], select: { id: true } });
  return t ? getOwnedThread(db, t.id, owner) : null;
}

/* ------------------------------------------------------------------ deletes */

/** Delete the thread's log rows: private ones (found through its messages) go; public ones stay, unlinked. */
async function dropThreadLogs(tx: Prisma.TransactionClient, threadIds: string[]): Promise<{ privateLogs: number; publicUnlinked: number }> {
  if (!threadIds.length) return { privateLogs: 0, publicUnlinked: 0 };
  const msgs = await tx.chatMessage.findMany({ where: { threadId: { in: threadIds }, questionLogId: { not: null } }, select: { questionLogId: true } });
  const logIds = [...new Set(msgs.map((m) => m.questionLogId!).filter(Boolean))];
  const priv = logIds.length ? await tx.chatQuestionLog.deleteMany({ where: { id: { in: logIds }, isPrivate: true } }) : { count: 0 };
  const pub = await tx.chatQuestionLog.updateMany({ where: { threadId: { in: threadIds } }, data: { threadId: null } });
  return { privateLogs: priv.count, publicUnlinked: pub.count };
}

/**
 * "Delete conversation" (F5): thread, messages, saved items and its private log rows. Only the owner can;
 * anything else (not found, someone else's, legacy unowned) is indistinguishable: { ok: false } → 404.
 */
export async function deleteThread(db: Db, threadId: string, owner: Owner) {
  if (!(await foundationReady(db))) return { ok: false as const };
  if (!THREAD_ID_RE.test(threadId)) return { ok: false as const };
  const t = await db.chatThread.findUnique({ where: { id: threadId }, select: { id: true, userId: true, anonOwnerId: true } });
  if (!t || !ownsThread(t, owner)) return { ok: false as const };
  return db.$transaction(async (tx) => {
    const logs = await dropThreadLogs(tx, [threadId]);
    const saved = await tx.savedItem.deleteMany({ where: { threadId } });
    const messages = await tx.chatMessage.deleteMany({ where: { threadId } });
    await tx.chatThread.delete({ where: { id: threadId } });
    return { ok: true as const, threads: 1, messages: messages.count, saved: saved.count, ...logs };
  });
}

/**
 * Account deletion (Clerk user.deleted, F6): every thread, message, saved item, private log row and setting
 * for this userId. Public rows (signed-out, userId null) are untouched; any that pointed at a deleted
 * (claimed) thread are only unlinked. Without the foundation schema only the log rows can exist for a user.
 */
export async function deleteUserData(db: Db, userId: string) {
  if (!userId) return { ok: false as const, reason: "no-user" };
  if (!(await foundationReady(db))) {
    const logs = await db.chatQuestionLog.deleteMany({ where: { userId } });
    return { ok: true as const, schema: "legacy", threads: 0, messages: 0, saved: 0, privateLogs: logs.count, publicUnlinked: 0, prefs: 0 };
  }
  return db.$transaction(async (tx) => {
    const threads = await tx.chatThread.findMany({ where: { userId }, select: { id: true } });
    const ids = threads.map((t) => t.id);
    const logs = await dropThreadLogs(tx, ids);
    const userLogs = await tx.chatQuestionLog.deleteMany({ where: { userId } });
    const saved = await tx.savedItem.deleteMany({ where: { OR: [{ userId }, ...(ids.length ? [{ threadId: { in: ids } }] : [])] } });
    const messages = ids.length ? await tx.chatMessage.deleteMany({ where: { threadId: { in: ids } } }) : { count: 0 };
    const del = ids.length ? await tx.chatThread.deleteMany({ where: { id: { in: ids } } }) : { count: 0 };
    const prefs = await tx.chatUserPref.deleteMany({ where: { userId } });
    return { ok: true as const, schema: "foundation", threads: del.count, messages: messages.count, saved: saved.count, privateLogs: logs.privateLogs + userLogs.count, publicUnlinked: logs.publicUnlinked, prefs: prefs.count };
  });
}

/**
 * 90-day purge (B, F7): signed-out threads only (anonOwnerId set, userId null), no activity for `days`, with
 * nothing saved on the thread or any of its messages. Legacy unowned threads and signed-in threads are never
 * candidates. Public log rows of a purged thread stay in the corpus, unlinked. dryRun counts only.
 */
export async function purgeAnonThreads(db: Db, opts: { now?: Date; days?: number; dryRun?: boolean; limit?: number } = {}) {
  const now = opts.now ?? new Date();
  const days = opts.days ?? PURGE_DAYS;
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  if (!(await foundationReady(db))) return { ok: true as const, skipped: "schema" as const, dryRun: Boolean(opts.dryRun), cutoff: cutoff.toISOString(), candidates: 0, deleted: 0 };
  const where: Prisma.ChatThreadWhereInput = {
    anonOwnerId: { not: null },
    userId: null,
    updatedAt: { lt: cutoff },
    saved: { none: {} },
    messages: { none: { saved: { some: {} } } },
  };
  const rows = await db.chatThread.findMany({ where, select: { id: true }, orderBy: { updatedAt: "asc" }, take: opts.limit ?? PURGE_BATCH });
  const ids = rows.map((r) => r.id);
  if (opts.dryRun || !ids.length) return { ok: true as const, dryRun: Boolean(opts.dryRun), cutoff: cutoff.toISOString(), candidates: ids.length, deleted: 0 };
  const out = await db.$transaction(async (tx) => {
    // Re-check inside the transaction: a save or a sign-in claim since the read keeps the thread.
    const still = await tx.chatThread.findMany({ where: { ...where, id: { in: ids } }, select: { id: true } });
    const keep = still.map((s) => s.id);
    const logs = await dropThreadLogs(tx, keep);
    const del = keep.length ? await tx.chatThread.deleteMany({ where: { id: { in: keep } } }) : { count: 0 };
    return { deleted: del.count, ...logs };
  });
  return { ok: true as const, dryRun: false, cutoff: cutoff.toISOString(), candidates: ids.length, ...out };
}

/* ------------------------------------------------------------------ training opt-in (C) */

export async function getTrainOptIn(db: Db, userId: string): Promise<boolean> {
  if (!(await foundationReady(db))) return false;
  const p = await db.chatUserPref.findUnique({ where: { userId }, select: { trainOptIn: true } });
  return p?.trainOptIn === true;
}

export async function setTrainOptIn(db: Db, userId: string, on: boolean): Promise<boolean> {
  if (!(await foundationReady(db))) return false;
  const now = new Date();
  await db.chatUserPref.upsert({
    where: { userId },
    create: { userId, trainOptIn: on, trainOptInAt: on ? now : null },
    update: { trainOptIn: on, trainOptInAt: on ? now : null },
  });
  return on;
}
