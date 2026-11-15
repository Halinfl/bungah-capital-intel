/**
 * Export the training/eval corpus → JSONL (src/lib/train-export.ts holds the rules).
 *
 * HARD RULE: public rows = trainEligible=true AND isPrivate=false (signed-out chat). Signed-in content only
 * for people who opted in (ChatUserPref.trainOptIn, off by default), from their own threads.
 * See data/train/README.md. Does NOT run fine-tune.
 *
 * Usage: npm run train:export   (TRAIN_EXPORT_OUT=<path> overrides the output file)
 * Out:   data/train/bungah-chat-corpus.jsonl
 */
import "dotenv/config";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { loadExcludedQuestionIds } from "../src/lib/train-exclusions";
import { buildCorpus } from "../src/lib/train-export";

export { TRAIN_SYSTEM_PROMPT } from "../src/lib/train-export";

const prisma = new PrismaClient();

async function main() {
  const outFile = process.env.TRAIN_EXPORT_OUT?.trim() || path.join(process.cwd(), "data", "train", "bungah-chat-corpus.jsonl");
  await mkdir(path.dirname(outFile), { recursive: true });
  // QA / test rows listed in data/train/excluded-question-ids.txt never enter the corpus.
  const { lines, stats } = await buildCorpus(prisma, { excludedIds: loadExcludedQuestionIds() });
  await writeFile(outFile, lines.length ? lines.join("\n") + "\n" : "", "utf8");
  console.log(JSON.stringify({ ok: true, outFile: path.relative(process.cwd(), outFile), ...stats }, null, 2));
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
