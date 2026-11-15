/**
 * Training corpus builder (used by scripts/export-train-corpus.ts and the foundation tests).
 *
 * HARD RULES:
 * - Public: ChatQuestionLog rows with trainEligible=true AND isPrivate=false only (signed-out chat).
 * - Signed-in (Decision C, 2026-11-14): only for a person with ChatUserPref.trainOptIn=true (off by default),
 *   read from that person's own threads, and only messages written at or after they opted in. Turning the
 *   setting off removes them from the next export. Private log rows never carry text, so they are never read.
 * - Ids in data/train/excluded-question-ids.txt never enter.
 */
import type { PrismaClient } from "@prisma/client";
import { foundationReady } from "./chat-store";

export const TRAIN_SYSTEM_PROMPT = `You are Bungah Capital Intel — a hotel / hospitality-capital IC analyst chat.

Rules (non-negotiable):
1. Answer ONLY from the Capital Graph facts and the allowed authored corpus (earnings digests / ideology notes) provided in the user message. Never invent STR, visitation, ADR, OCC, RevPAR, pipeline, or debt numbers.
2. If a source is labeled illustrative / thin seed, say so plainly — do not present it as licensed STR or Tourism Economics.
3. Propose-only: surface cited facts and so-whats for human decision. Never recommend auto-executing capital, never claim private CSP, never book or source meetings.
4. Human-touch / talent / staffing / GC-MEP capacity is a first-class greenlight gate alongside demand, supply, and debt.
5. When intent emphasizes a lens (supply, talent, RevPAR, which-submarket, debt, demand), lead with that lens — then support with the rest of the pack.
6. Use concise IC-memo markdown. Cite sources by repeating sourceLabel strings from the graph pack AND digest file paths (e.g. content/earnings/hilton/2026-Q2-digest.md).
7. Digests are Hal/Neo authored summaries of public IR — prefer them over inventing call color. Do not claim you read a paywalled transcript unless the digest cites it.
8. If the pack lacks enough to answer, say what is missing and invite a richer private workspace — do not hallucinate coverage.
9. Product name: Bungah Capital Intel (never Neo).`;

export type TrainRecord = {
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  meta: {
    intent: string | null;
    marketSlug: string | null;
    citations: string[];
    source: "llm" | "memo" | string;
    modelUsed?: string | null;
    answeredWell?: boolean;
    trainEligible: true;
    isPrivate: false;
    /** "public" (signed-out log row) or "opt-in" (signed-in thread of a person who opted in). */
    origin: "public" | "opt-in";
    createdAt?: string;
    id?: string;
  };
};

export function parseCitations(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    /* ignore */
  }
  return [];
}

export function isEmptyOrErrorRow(row: { question: string; answerText: string | null }): boolean {
  const q = (row.question ?? "").trim();
  const a = (row.answerText ?? "").trim();
  if (!q || !a) return true;
  if (q === "[private]") return true;
  if (a.length < 20) return true;
  if (/^chat error/i.test(a)) return true;
  if (/^error:/i.test(a)) return true;
  return false;
}

export type CorpusStats = {
  written: number;
  publicWritten: number;
  optInWritten: number;
  optInUsers: number;
  skippedEmptyOrError: number;
  skippedExcludedIds: number;
  skippedPrivateOrIneligible: number;
  publicEligibleFetched: number;
};

export async function buildCorpus(db: PrismaClient, opts: { excludedIds?: Set<string> } = {}): Promise<{ lines: string[]; stats: CorpusStats }> {
  const excludedIds = opts.excludedIds ?? new Set<string>();
  const rows = await db.chatQuestionLog.findMany({ where: { trainEligible: true, isPrivate: false }, orderBy: { createdAt: "asc" } });
  const privateSkipped = await db.chatQuestionLog.count({ where: { OR: [{ trainEligible: false }, { isPrivate: true }] } });
  let skipped = 0;
  let excluded = 0;
  let publicWritten = 0;
  const lines: string[] = [];
  for (const row of rows) {
    if (excludedIds.has(row.id)) {
      excluded += 1;
      continue;
    }
    if (isEmptyOrErrorRow(row)) {
      skipped += 1;
      continue;
    }
    const source = row.modelUsed === "llm" ? "llm" : row.modelUsed === "memo" ? "memo" : (row.modelUsed ?? "memo");
    const record: TrainRecord = {
      messages: [
        { role: "system", content: TRAIN_SYSTEM_PROMPT },
        { role: "user", content: row.question.trim() },
        { role: "assistant", content: (row.answerText ?? "").trim() },
      ],
      meta: {
        intent: row.intent,
        marketSlug: row.marketSlug,
        citations: parseCitations(row.citationsJson),
        source,
        modelUsed: row.modelUsed,
        answeredWell: row.answeredWell,
        trainEligible: true,
        isPrivate: false,
        origin: "public",
        createdAt: row.createdAt.toISOString(),
        id: row.id,
      },
    };
    lines.push(JSON.stringify(record));
    publicWritten += 1;
  }

  // Signed-in content: opted-in people only, their own threads, messages since the opt-in.
  let optInWritten = 0;
  let optInUsers = 0;
  if (await foundationReady(db)) {
    const prefs = await db.chatUserPref.findMany({ where: { trainOptIn: true, trainOptInAt: { not: null } }, select: { userId: true, trainOptInAt: true } });
    optInUsers = prefs.length;
    for (const p of prefs) {
      const threads = await db.chatThread.findMany({
        where: { userId: p.userId },
        orderBy: { createdAt: "asc" },
        select: { id: true, messages: { where: { createdAt: { gte: p.trainOptInAt! } }, orderBy: [{ createdAt: "asc" }, { id: "asc" }], select: { id: true, role: true, content: true, citations: true, createdAt: true, questionLogId: true } } },
      });
      for (const t of threads) {
        const m = t.messages;
        for (let i = 0; i + 1 < m.length; i++) {
          const u = m[i];
          const a = m[i + 1];
          if (u.role !== "user" || a.role !== "assistant") continue;
          if ((u.questionLogId && excludedIds.has(u.questionLogId)) || isEmptyOrErrorRow({ question: u.content, answerText: a.content })) {
            skipped += 1;
            continue;
          }
          const record: TrainRecord = {
            messages: [
              { role: "system", content: TRAIN_SYSTEM_PROMPT },
              { role: "user", content: u.content.trim() },
              { role: "assistant", content: a.content.trim() },
            ],
            meta: { intent: null, marketSlug: null, citations: parseCitations(a.citations), source: "memo", trainEligible: true, isPrivate: false, origin: "opt-in", createdAt: a.createdAt.toISOString(), id: a.id },
          };
          lines.push(JSON.stringify(record));
          optInWritten += 1;
          i += 1;
        }
      }
    }
  }
  return {
    lines,
    stats: {
      written: publicWritten + optInWritten,
      publicWritten,
      optInWritten,
      optInUsers,
      skippedEmptyOrError: skipped,
      skippedExcludedIds: excluded,
      skippedPrivateOrIneligible: privateSkipped,
      publicEligibleFetched: rows.length,
    },
  };
}
