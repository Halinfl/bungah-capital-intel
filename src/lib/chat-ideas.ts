/**
 * Visitor ideas and feedback, saved so Chat can get better (Hal, 15 Nov 2026).
 * Signed-out ideas may be detected from the message or submitted via "Share an idea".
 * Signed-in ideas are saved only when the person explicitly shares them (private threads stay private).
 */
import type { PrismaClient } from "@prisma/client";

type Db = PrismaClient;

export const IDEA_SOURCE = { signedOut: "signed-out", signedIn: "signed-in" } as const;

const IDEA_HINT =
  /\b((i |I'd |i would )?(suggest|recommend you add|have an idea|share an idea)|feedback|feature request|you should (add|consider|allow|let)|it would be (nice|better|useful) if|please add|consider adding|idea:|suggestion:)\b/i;

export function looksLikeIdea(text: string): boolean {
  const t = text.trim();
  if (t.length < 12 || t.length > 4000) return false;
  return IDEA_HINT.test(t);
}


let ensured = false;
async function ensureChatIdeaTable(db: Db) {
  if (ensured) return;
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ChatIdea" (
      "id" TEXT NOT NULL,
      "text" TEXT NOT NULL,
      "threadId" TEXT,
      "source" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "ChatIdea_pkey" PRIMARY KEY ("id")
    )`);
  await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "ChatIdea_createdAt_idx" ON "ChatIdea"("createdAt")`);
  await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "ChatIdea_source_idx" ON "ChatIdea"("source")`);
  ensured = true;
}

export async function saveChatIdea(
  db: Db,
  opts: { text: string; threadId?: string | null; source: "signed-out" | "signed-in" }
): Promise<{ ok: true; id: string } | { ok: false; reason: string }> {
  const text = opts.text.trim().slice(0, 4000);
  if (text.length < 8) return { ok: false, reason: "too-short" };
  try {
    await ensureChatIdeaTable(db);
    const row = await db.chatIdea.create({
      data: { text, threadId: opts.threadId || null, source: opts.source },
    });
    return { ok: true, id: row.id };
  } catch (e) {
    console.error("[chat-ideas] save failed", e instanceof Error ? e.message : e);
    return { ok: false, reason: "save-failed" };
  }
}

export async function listChatIdeas(db: Db, opts: { take?: number } = {}) {
  await ensureChatIdeaTable(db);
  return db.chatIdea.findMany({
    orderBy: { createdAt: "desc" },
    take: Math.min(opts.take ?? 200, 500),
    select: { id: true, text: true, threadId: true, source: true, createdAt: true },
  });
}

export async function maybeSaveSignedOutIdea(db: Db, question: string, threadId: string | null) {
  if (!looksLikeIdea(question)) return;
  await saveChatIdea(db, { text: question, threadId, source: "signed-out" });
}

/** 12-month retention for signed-out ideas (same window as signed-out question logs). */
export async function purgeSignedOutIdeas(db: Db, opts: { now?: Date; days?: number; dryRun?: boolean } = {}) {
  const now = opts.now ?? new Date();
  const days = opts.days ?? 365;
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  await ensureChatIdeaTable(db);
  const where = { source: "signed-out", createdAt: { lt: cutoff } };
  if (opts.dryRun) {
    const candidates = await db.chatIdea.count({ where });
    return { ok: true as const, dryRun: true, cutoff: cutoff.toISOString(), candidates, deleted: 0 };
  }
  const del = await db.chatIdea.deleteMany({ where });
  return { ok: true as const, dryRun: false, cutoff: cutoff.toISOString(), candidates: del.count, deleted: del.count };
}
