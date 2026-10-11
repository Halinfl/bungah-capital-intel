import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { answerChat } from "@/lib/chat-llm";
import { prisma } from "@/lib/prisma";

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

    const answer = await answerChat(question, { marketSlug });
    const modelUsed = toModelUsed(answer.mode);
    const citations = answer.citations ?? [];

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

    return NextResponse.json({
      content: answer.content,
      citations,
      threadId: thread.id,
      intent: answer.intent,
      marketSlug: answer.marketSlug ?? marketSlug,
      mode: answer.mode,
      modelUsed,
      isPrivate,
      trainEligible,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Chat error" },
      { status: 500 }
    );
  }
}
