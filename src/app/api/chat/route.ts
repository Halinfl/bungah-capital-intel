import { auth } from "@clerk/nextjs/server";
import { NextResponse, after } from "next/server";
import { answerChat, isLlmEnabled } from "@/lib/chat-llm";
import { prisma } from "@/lib/prisma";
import { scrubSeedCitations } from "@/lib/format";
import { sourcesForAnswer } from "@/lib/chat";
import { scrubInternal, cleanSourceLabel } from "@/lib/public-text";
import { parseRange, type ChatBrief, type Citation } from "@/lib/chat-brief";
import { parseScope } from "@/lib/chat-scope";
import { answerKey, cachedAnswer, dataVersion, type CacheStatus } from "@/lib/chat-cache";
import { checkRateLimit, clientIp, LIMIT, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";

/** Questions longer than this are cut (bounds per-request work). */
const MAX_QUESTION = 1000;
const SOURCES = new Set(["starter", "typed", "reask", "link"]);

/**
 * Preview deployments share the production database: they answer but never write threads
 * or question logs. BUNGAH_CHAT_PERSIST=false turns writes off anywhere else too.
 */
function shouldPersist(): boolean {
  if (process.env.VERCEL_ENV === "preview") return false;
  return process.env.BUNGAH_CHAT_PERSIST?.trim().toLowerCase() !== "false";
}

/** Test toggles (headers) are honoured only off production. */
const TEST_TOGGLES = process.env.VERCEL_ENV !== "production";

function toModelUsed(mode: string | undefined): "llm" | "memo" {
  return mode === "llm" ? "llm" : "memo";
}

function snippet(text: string, max = 240): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).trimEnd() + "…";
}

type Built = {
  content: string;
  brief: unknown;
  citations: string[];
  sources: { url: string; label: string; secondary?: boolean; signal: string }[];
  intent?: string;
  marketSlug: string | null;
  mode?: string;
  answeredWell: boolean;
};

type LogInput = {
  question: string;
  answer: Built;
  marketSlug: string | null;
  isPrivate: boolean;
  userId: string | null;
  source: string;
  scope: string | null;
  forceFail: boolean;
};

/** Thread + question-log write. Runs after the response is sent (next/server `after`); never throws. */
async function persist(x: LogInput): Promise<void> {
  const t0 = Date.now();
  try {
    if (x.forceFail) throw new Error("forced log-write failure (preview test toggle)");
    if (!shouldPersist()) {
      console.log(`[chat-log] dry-run (writes off on this deployment) source=${x.source} intent=${x.answer.intent ?? "unknown"} item=${x.scope ?? x.marketSlug ?? "-"}`);
      return;
    }
    const modelUsed = toModelUsed(x.answer.mode);
    // Product thread always stores full Q&A (including private workspace).
    const thread = await prisma.chatThread.create({
      data: {
        title: x.question.slice(0, 80) || "Chat",
        messages: {
          create: [
            { role: "user", content: x.question },
            { role: "assistant", content: x.answer.content, citations: JSON.stringify(x.answer.citations) },
          ],
        },
      },
    });
    // Memory-loop log: public rows keep bodies for corpus; private rows omit
    // answer/citation bodies so train export cannot leak them even if mis-filtered.
    await prisma.chatQuestionLog.create({
      data: {
        question: x.isPrivate ? "[private]" : x.question,
        marketSlug: x.answer.marketSlug ?? x.marketSlug,
        intent: x.answer.intent ?? "unknown",
        answerText: x.isPrivate ? null : x.answer.content,
        answerSnippet: x.isPrivate ? null : snippet(x.answer.content),
        citationsJson: x.isPrivate ? null : JSON.stringify(x.answer.citations),
        answeredWell: x.answer.answeredWell,
        modelUsed,
        trainEligible: !x.isPrivate,
        isPrivate: x.isPrivate,
        userId: x.userId,
        threadId: thread.id,
        source: x.source,
      },
    });
  } catch (persistErr) {
    // A failed write never touches the answer: it was already sent.
    console.error(`[chat-log] write failed after response (answer already sent, ${Date.now() - t0}ms):`, persistErr instanceof Error ? persistErr.message : persistErr);
  }
}

/** A cited row's dedupe `key` is its URL whenever it has one; send the key only when it differs. */
function wireCited(cited: Citation[] | undefined): Citation[] {
  return (cited ?? []).map((c) => {
    if (!c.url || c.key !== c.url) return c;
    const rest: Partial<Citation> = { ...c };
    delete rest.key;
    return rest as Citation;
  });
}

/**
 * The card as sent: answer, key reads (each with its source), coverage line and section headings. The
 * section bodies, the cited-source list and the legacy citations/sources arrays (all already behind the
 * "Sources (N)" section) come from the `detail: true` fetch when a section is opened. Nothing is dropped,
 * only deferred; the cache and the question log keep the full answer.
 */
function wireBrief(brief: Built["brief"]): Built["brief"] {
  const b = brief as (ChatBrief & { cited?: Citation[] }) | null;
  if (!b) return brief;
  const { cited: _cited, ...rest } = b;
  void _cited;
  return { ...rest, sections: b.sections.map((x) => ({ id: x.id, title: x.title, count: x.count, markdown: "" })), sectionsLazy: b.sections.length > 0 };
}

export async function POST(req: Request) {
  try {
    // Clerk: signed-in = encrypted private workspace → never train-export bodies.
    // Signed-out public chat → trainEligible for internal LLM corpus.
    const { userId } = await auth();
    const isPrivate = Boolean(userId);
    const trainEligible = !isPrivate;

    const body = await req.json();
    // `detail: true` = the lazy "show the sections" fetch for an answer already on screen (same question,
    // scope and window). It is not a new question: not logged, and limited on its own, wider bucket.
    const detail = body.detail === true;

    // Signed-out visitors: per-IP limit (src/lib/rate-limit.ts). The only message is "Sign in to keep asking."
    if (!userId) {
      const testLimit = TEST_TOGGLES ? Number(req.headers.get("x-bungah-test-ratelimit") || 0) : 0;
      // Preview-only: a named test bucket, so a check starts from a clean count.
      const testBucket = TEST_TOGGLES ? req.headers.get("x-bungah-test-ratelimit-bucket")?.slice(0, 40) ?? "" : "";
      const limit = testLimit > 0 ? testLimit : LIMIT;
      const rl = checkRateLimit(`${detail ? "detail:" : ""}${clientIp(req)}${testBucket ? `#${testBucket}` : ""}`, detail ? limit * 3 : limit);
      if (!rl.ok) {
        return NextResponse.json(
          { error: RATE_LIMIT_MESSAGE, rateLimited: true },
          { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetMs / 1000)), "Cache-Control": "no-store" } }
        );
      }
    }

    const question = String(body.question ?? "").slice(0, MAX_QUESTION);
    const scope = parseScope(body.scope);
    const marketSlug =
      scope?.kind === "market"
        ? scope.id
        : typeof body.marketSlug === "string" && body.marketSlug.trim()
          ? body.marketSlug.trim().toLowerCase()
          : null;
    const source = typeof body.source === "string" && SOURCES.has(body.source) ? body.source : "typed";
    // Date window for the re-ask chip (Last 90 days / Last 12 months / All); anything else is All.
    const range = parseRange(body.range);

    // answerChat returns the one final answer: seed wording and internal labels are already
    // scrubbed there, so the text stored, logged and rendered is identical (no later rewrite).
    const build = async (): Promise<Built> => {
      const answer = await answerChat(question, { marketSlug, range, scope });
      const citations = scrubSeedCitations(answer.citations ?? []).map((c) => cleanSourceLabel(c));
      const sources = (answer.sources ?? (await sourcesForAnswer(answer.content))).map((l) => ({ ...l, label: scrubInternal(l.label) }));
      return {
        content: answer.content,
        brief: answer.brief ?? null,
        citations,
        sources,
        intent: answer.intent,
        marketSlug: answer.marketSlug ?? marketSlug,
        mode: answer.mode,
        answeredWell: answer.answeredWell,
      };
    };

    // Deterministic answers are shared (src/lib/chat-cache.ts). Model answers (spend-locked off) never are.
    let answer: Built;
    let cache: CacheStatus = "bypass";
    if (!isLlmEnabled() && !(TEST_TOGGLES && req.headers.get("x-bungah-test") === "no-cache")) {
      const key = answerKey({ version: await dataVersion(), question, scope, marketSlug, range });
      const r = await cachedAnswer(key, build);
      answer = r.value;
      cache = r.status;
    } else {
      answer = await build();
    }

    if (detail) {
      // Everything the card left off: the full sections plus every cited source behind the answer.
      const b = answer.brief as (ChatBrief & { cited?: Citation[] }) | null;
      return NextResponse.json(
        { sections: b?.sections ?? [], cited: wireCited(b?.cited), citations: answer.citations, sources: answer.sources },
        { headers: { "Cache-Control": "no-store", "x-chat-cache": cache, "x-chat-log": "none (detail)" } }
      );
    }

    // Log after the response is sent: a slow or failed write never delays or blocks the answer.
    const forceFail = TEST_TOGGLES && req.headers.get("x-bungah-test") === "fail-log";
    after(() => persist({ question, answer, marketSlug, isPrivate, userId: userId ?? null, source, scope: scope ? `${scope.kind}:${scope.id}` : null, forceFail }));

    const modelUsed = toModelUsed(answer.mode);
    return NextResponse.json(
      {
        // With a summary card the client renders only `brief`: `content` is the same sections again as one
        // markdown block (every URL in it is also in brief.sections), so it is not sent at all; citations and
        // sources come with the lazy detail fetch. Without a brief, `content` + sources are the answer.
        ...(answer.brief ? {} : { content: answer.content, citations: answer.citations, sources: answer.sources }),
        brief: wireBrief(answer.brief),
        // The thread id is no longer known when the response goes out (the write runs after it).
        threadId: null,
        intent: answer.intent,
        marketSlug: answer.marketSlug,
        mode: answer.mode,
        modelUsed,
        isPrivate,
        trainEligible,
      },
      {
        headers: {
          "Cache-Control": "no-store",
          "x-chat-cache": cache,
          "x-chat-log": forceFail ? "deferred; forced-fail" : shouldPersist() ? "deferred" : "deferred; dry-run",
          ...(TEST_TOGGLES ? { "x-chat-log-source": source } : {}),
        },
      }
    );
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
