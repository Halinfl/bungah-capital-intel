import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { answerChat } from "@/lib/chat-llm";
import { prisma } from "@/lib/prisma";
import { scrubSeedCitations } from "@/lib/format";
import { sourcesForAnswer } from "@/lib/chat";
import { scrubInternal, cleanSourceLabel } from "@/lib/public-text";

/**
 * Preview deployments share the production database: they answer but never write threads
 * or question logs. BUNGAH_CHAT_PERSIST=false turns writes off anywhere else too.
 */
function shouldPersist(): boolean {
  if (process.env.VERCEL_ENV === "preview") return false;
  return process.env.BUNGAH_CHAT_PERSIST?.trim().toLowerCase() !== "false";
}

function toModelUsed(mode: string | undefined): "llm" | "memo" {
  return mode === "llm" ? "llm" : "memo";
}

function snippet(text: string, max = 240): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).trimEnd() + "…";
}

export async function POST(req: Request) {
  try {
    // Clerk: signed-in = encrypted private workspace → never train-export bodies.
    // Signed-out public chat → trainEligible for internal LLM corpus.
    const { userId } = await auth();
    const isPrivate = Boolean(userId);
    const trainEligible = !isPrivate;

    const body = await req.json();
    const question = String(body.question ?? "");
    const marketSlug =
      typeof body.marketSlug === "string" && body.marketSlug.trim()
        ? body.marketSlug.trim().toLowerCase()
        : null;

    // answerChat returns the one final answer: seed wording and internal labels are already
    // scrubbed there, so the text stored, logged and rendered is identical (no later rewrite).
    const answer = await answerChat(question, { marketSlug });
    const modelUsed = toModelUsed(answer.mode);
    const citations = scrubSeedCitations(answer.citations ?? []).map((c) => cleanSourceLabel(c));
    const sources = (answer.sources ?? (await sourcesForAnswer(answer.content))).map((l) => ({ ...l, label: scrubInternal(l.label) }));

    let threadId: string | null = null;
    if (shouldPersist()) try {
      // Product thread always stores full Q&A (including private workspace).
      const thread = await prisma.chatThread.create({
        data: {
          title: question.slice(0, 80) || "Chat",
          messages: {
            create: [
              { role: "user", content: question },
              {
                role: "assistant",
                content: answer.content,
                citations: JSON.stringify(citations),
              },
            ],
          },
        },
      });

      // Memory-loop log: public rows keep bodies for corpus; private rows omit
      // answer/citation bodies so train export cannot leak them even if mis-filtered.
      await prisma.chatQuestionLog.create({
        data: {
          question: isPrivate ? "[private]" : question,
          marketSlug: answer.marketSlug ?? marketSlug,
          intent: answer.intent ?? "unknown",
          answerText: isPrivate ? null : answer.content,
          answerSnippet: isPrivate ? null : snippet(answer.content),
          citationsJson: isPrivate ? null : JSON.stringify(citations),
          answeredWell: answer.answeredWell,
          modelUsed,
          trainEligible,
          isPrivate,
          userId: userId ?? null,
          threadId: thread.id,
        },
      });
      threadId = thread.id;
    } catch (persistErr) {
      // A DB write failure must not lose the answer: return it unsaved.
      console.error("[chat] persist failed; answering without saving", persistErr instanceof Error ? persistErr.message : persistErr);
    }

    return NextResponse.json({
      content: answer.content,
      brief: answer.brief ?? null,
      citations,
      sources,
      threadId,
      intent: answer.intent,
      marketSlug: answer.marketSlug ?? marketSlug,
      mode: answer.mode,
      modelUsed,
      isPrivate,
      trainEligible,
    });
  } catch (e) {
    console.error(e);
    // Never echo raw DB/driver errors (they can carry hostnames); give a friendly, retryable answer.
    const dbDown = e instanceof Error && (e.message === "CAPITAL_GRAPH_UNAVAILABLE" || /prisma|database|P10\d\d/i.test(e.message + e.name));
    return NextResponse.json(
      { error: dbDown ? "Chat is temporarily unavailable while market data reconnects. Please try again in a few minutes." : "Chat error" },
      { status: dbDown ? 503 : 500 }
    );
  }
}
