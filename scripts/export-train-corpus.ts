/**
 * Export ChatQuestionLog rows → JSONL training/eval corpus.
 *
 * HARD RULE: only trainEligible=true (signed-out public chat).
 * Private / Clerk-signed-in rows (trainEligible=false) are never written.
 * See data/train/README.md. Does NOT run fine-tune.
 *
 * Usage: npm run train:export
 * Out:   data/train/bungah-chat-corpus.jsonl
 */
import "dotenv/config";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Same cite-only / propose-only rules as chat-llm SYSTEM_PROMPT (frozen for train). */
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

type TrainRecord = {
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
    createdAt?: string;
    id?: string;
  };
};

function parseCitations(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((x): x is string => typeof x === "string");
    }
  } catch {
    /* ignore */
  }
  return [];
}

function isEmptyOrErrorRow(row: {
  question: string;
  answerText: string | null;
}): boolean {
  const q = (row.question ?? "").trim();
  const a = (row.answerText ?? "").trim();
  if (!q || !a) return true;
  if (q === "[private]") return true;
  if (a.length < 20) return true;
  if (/^chat error/i.test(a)) return true;
  if (/^error:/i.test(a)) return true;
  return false;
}

async function main() {
  const outDir = path.join(process.cwd(), "data", "train");
  const outFile = path.join(outDir, "bungah-chat-corpus.jsonl");
  await mkdir(outDir, { recursive: true });

  // Only public, train-eligible rows. Never export private workspace bodies.
  const rows = await prisma.chatQuestionLog.findMany({
    where: {
      trainEligible: true,
      isPrivate: false,
    },
    orderBy: { createdAt: "asc" },
  });

  const privateSkipped = await prisma.chatQuestionLog.count({
    where: {
      OR: [{ trainEligible: false }, { isPrivate: true }],
    },
  });

  let written = 0;
  let skipped = 0;
  const lines: string[] = [];

  for (const row of rows) {
    if (isEmptyOrErrorRow(row)) {
      skipped += 1;
      continue;
    }
    const citations = parseCitations(row.citationsJson);
    const source =
      row.modelUsed === "llm"
        ? "llm"
        : row.modelUsed === "memo"
          ? "memo"
          : row.modelUsed ?? "memo";

    const record: TrainRecord = {
      messages: [
        { role: "system", content: TRAIN_SYSTEM_PROMPT },
        { role: "user", content: row.question.trim() },
        { role: "assistant", content: (row.answerText ?? "").trim() },
      ],
      meta: {
        intent: row.intent,
        marketSlug: row.marketSlug,
        citations,
        source,
        modelUsed: row.modelUsed,
        answeredWell: row.answeredWell,
        trainEligible: true,
        isPrivate: false,
        createdAt: row.createdAt.toISOString(),
        id: row.id,
      },
    };
    lines.push(JSON.stringify(record));
    written += 1;
  }

  await writeFile(outFile, lines.length ? lines.join("\n") + "\n" : "", "utf8");

  console.log(
    JSON.stringify(
      {
        ok: true,
        outFile: path.relative(process.cwd(), outFile),
        written,
        skippedEmptyOrError: skipped,
        skippedPrivateOrIneligible: privateSkipped,
        publicEligibleFetched: rows.length,
      },
      null,
      2
    )
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
