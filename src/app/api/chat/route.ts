import { NextResponse } from "next/server";
import { answerFromGraph } from "@/lib/chat";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = String(body.question ?? "");
    const answer = await answerFromGraph(question);

    const thread = await prisma.chatThread.create({
      data: {
        title: question.slice(0, 80) || "Chat",
        messages: {
          create: [
            { role: "user", content: question },
            {
              role: "assistant",
              content: answer.content,
              citations: JSON.stringify(answer.citations),
            },
          ],
        },
      },
    });

    return NextResponse.json({
      ...answer,
      threadId: thread.id,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Chat error" },
      { status: 500 }
    );
  }
}
