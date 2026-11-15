import { auth } from "@clerk/nextjs/server";
import { NextResponse, after } from "next/server";
import { answerChat, isLlmEnabled } from "@/lib/chat-llm";
import { prisma } from "@/lib/prisma";
import { scrubSeedCitations } from "@/lib/format";
import { sourcesForAnswer } from "@/lib/chat";
import { scrubInternal, cleanSourceLabel, guardPublic } from "@/lib/public-text";
import { parseRange, type ChatBrief, type Citation } from "@/lib/chat-brief";
import { parseScope } from "@/lib/chat-scope";
import { answerKey, cachedAnswer, dataVersion, type CacheStatus } from "@/lib/chat-cache";
import { checkRateLimit, clientIp, LIMIT, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";
import { answerHash, applyNoRepeat, clearedMarketFallback, followUpExtras, parsePrev, resolveFollowUp, shownHashes, type FollowUpChip } from "@/lib/chat-followup";
import type { ChatIntent } from "@/lib/chat-intent";
import { createOwnedThread, foundationReady, legacyPersist, persistLogOnly, persistOwnedTurn, recentOwnedMessages, recordAnonLink, resolveThread, validRequestId, type Owner, type ResolvedThread, type TurnInput } from "@/lib/chat-store";
import { ANON_COOKIE, anonCookieOptions, anonFromRequest, mintAnon } from "@/lib/chat-anon";
import { maybeSaveSignedOutIdea } from "@/lib/chat-ideas";

/** r4 (S2): questions longer than this get a 400 that says so (never a silent cut). Same cap in the client. */
const MAX_QUESTION = 1000;
const NO_STORE = { "Cache-Control": "no-store" } as const;
/**
 * ChatQuestionLog.source values; "tt-swipe": asked from a Tuesday Trends swipe card (Chat opened with ?via=tt-swipe);
 * "chip": an "other angle" chip under a no-repeat reply (src/lib/chat-followup.ts).
 */
const SOURCES = new Set(["starter", "typed", "reask", "link", "tt-swipe", "chip"]);

/**
 * Preview deployments share the production database: they answer but never write threads
 * or question logs. BUNGAH_CHAT_PERSIST=false turns writes off anywhere else too.
 * Chat foundation: BUNGAH_CHAT_PERSIST_PREVIEW=true turns preview writes on, and only for the owned (foundation)
 * path. Set it only where the Preview DATABASE_URL is a separate preview database; the production database has
 * no foundation columns, so a mis-set flag still writes nothing there (previewWrites below).
 */
function shouldPersist(): boolean {
  if (process.env.VERCEL_ENV === "preview") return process.env.BUNGAH_CHAT_PERSIST_PREVIEW?.trim().toLowerCase() === "true";
  return process.env.BUNGAH_CHAT_PERSIST?.trim().toLowerCase() !== "false";
}
/** On a preview, only the foundation write path may run (never the legacy one-thread-per-answer path). */
const PREVIEW = process.env.VERCEL_ENV === "preview";

/** Test toggles (headers) are honoured only off production. */
const TEST_TOGGLES = process.env.VERCEL_ENV !== "production";

function toModelUsed(mode: string | undefined): "llm" | "memo" {
  return mode === "llm" ? "llm" : "memo";
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
  /** Chips that come with the answer itself (the "which two markets?" prompt). */
  followUps?: FollowUpChip[];
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
  /** Thread resolved before the response (null: resolution failed → log row only, no thread). */
  thread: ResolvedThread | null;
  owner: Owner;
  /** r4 (S4): the client's per-question id; a repeat of the same request is written once. */
  requestId: string | null;
};

/**
 * Thread + question-log write. Awaited before the response so a follow-up GET or reload sees the turn
 * (no early `existing` with a missing second answer). Never throws. Foundation schema: one owned thread
 * per conversation (src/lib/chat-store.ts). A private log row never carries text or a threadId (Decision A).
 * Older schema: the legacy write (one thread per answer).
 */
async function persist(x: LogInput): Promise<void> {
  const t0 = Date.now();
  try {
    if (x.forceFail) throw new Error("forced log-write failure (preview test toggle)");
    if (!shouldPersist()) {
      console.log(`[chat-log] dry-run (writes off on this deployment) source=${x.source} intent=${x.answer.intent ?? "unknown"} item=${x.scope ?? x.marketSlug ?? "-"}`);
      return;
    }
    const turn: TurnInput = {
      question: x.question,
      answerText: x.answer.content,
      citations: x.answer.citations,
      marketSlug: x.answer.marketSlug ?? x.marketSlug,
      intent: x.answer.intent ?? "unknown",
      answeredWell: x.answer.answeredWell,
      modelUsed: toModelUsed(x.answer.mode),
      isPrivate: x.isPrivate,
      userId: x.userId,
      source: x.source,
    };
    const r = x.thread;
    if (r?.mode === "owned") {
      const w = await persistOwnedTurn(prisma, r, x.owner, turn, { requestId: x.requestId });
      if (w.skipped) console.log(`[chat-log] owned write skipped: ${w.skipped}`);
    } else if (r?.mode === "gone") return;
    else if (r?.mode === "legacy") {
      if (PREVIEW) {
        console.log("[chat-log] preview without the foundation schema: nothing written");
        return;
      }
      await legacyPersist(prisma, turn);
    } else if (await foundationReady(prisma)) await persistLogOnly(prisma, turn);
    else if (!PREVIEW) await legacyPersist(prisma, turn);
  } catch (persistErr) {
    // A failed write is logged; the answer is still returned.
    console.error(`[chat-log] write failed (${Date.now() - t0}ms):`, persistErr instanceof Error ? persistErr.message : persistErr);
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
    let body: Record<string, unknown>;
    try {
      const parsed = await req.json();
      body = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : {};
    } catch {
      return NextResponse.json({ error: "Type a question first.", code: "bad-request" }, { status: 400, headers: NO_STORE });
    }
    // r4 (S1, S2): no question → 400; over the cap → 400 that says so. Neither writes anything.
    const rawQuestion = typeof body.question === "string" ? body.question : "";
    if (!rawQuestion.trim()) return NextResponse.json({ error: "Type a question first.", code: "empty-question" }, { status: 400, headers: NO_STORE });
    if (rawQuestion.length > MAX_QUESTION) {
      return NextResponse.json(
        { error: `Questions can be up to ${MAX_QUESTION.toLocaleString("en-US")} characters; this one is ${rawQuestion.length.toLocaleString("en-US")}. Shorten it and send again.`, code: "too-long", maxLength: MAX_QUESTION, length: rawQuestion.length },
        { status: 400, headers: NO_STORE }
      );
    }
    const requestId = validRequestId(body.requestId);

    const { userId } = await auth();
    const isPrivate = Boolean(userId);
    const trainEligible = !isPrivate;
    // Signed-out owner id (signed cookie); minted below for a signed-out question that has none.
    let anonId = anonFromRequest(req);
    let mintedCookie: string | null = null;

    // `detail: true` = the lazy "show the sections" fetch for an answer already on screen (same question,
    // scope and window). It is not a new question: not logged, and limited on its own, wider bucket.
    const detail = body.detail === true;

    // Signed-out visitors: per-IP limit (src/lib/rate-limit.ts). The only message is "Sign in to keep asking"
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

    const question = rawQuestion;
    const historyOwner: Owner = { userId: userId ?? null, anonId };
    const history = body.threadId
      ? await recentOwnedMessages(prisma, body.threadId, historyOwner).catch(() => [])
      : [];
    const scope = parseScope(body.scope);
    const askedMarket =
      scope?.kind === "market"
        ? scope.id
        : typeof body.marketSlug === "string" && body.marketSlug.trim()
          ? body.marketSlug.trim().toLowerCase().slice(0, 81)
          : null;
    // The answer on screen (src/lib/chat-followup.ts): validated and capped; anything malformed is dropped.
    const prev = parsePrev(body.prev);
    // A follow-up that names no market (and has no item chip) keeps the previous answer's market; a time
    // comparison ("how does that compare to last year?") keeps its topic instead of asking for two markets.
    const route = await resolveFollowUp({ question, scope, marketSlug: askedMarket, prev });
    const marketSlug = route.marketSlug;
    const source = typeof body.source === "string" && SOURCES.has(body.source) ? body.source : "typed";
    // Date window for the re-ask chip (Last 90 days / Last 12 months / All); anything else is All.
    const range = parseRange(body.range);

    // answerChat returns the one final answer: seed wording and internal labels are already
    // scrubbed there, so the text stored, logged and rendered is identical (no later rewrite).
    const build = (q: string, rng: typeof range, rt: { marketSlug: string | null; intent: typeof route.intent }) => async (): Promise<Built> => {
      const answer = await answerChat(q, { marketSlug: rt.marketSlug, range: rng, scope, intent: rt.intent, isPrivate, llmSubject: userId || clientIp(req), history });
      const citations = scrubSeedCitations(answer.citations ?? []).map((c) => cleanSourceLabel(c));
      const sources = (answer.sources ?? (await sourcesForAnswer(answer.content))).map((l) => ({ ...l, label: scrubInternal(l.label) }));
      // Final leak guard on everything the card carries (idempotent; answerChat already ran it).
      return guardPublic({
        content: answer.content,
        brief: answer.brief ?? null,
        citations,
        sources,
        intent: answer.intent,
        marketSlug: answer.marketSlug ?? rt.marketSlug,
        mode: answer.mode,
        answeredWell: answer.answeredWell,
        ...(answer.followUps?.length ? { followUps: answer.followUps } : {}),
      });
    };

    // Deterministic answers are shared (src/lib/chat-cache.ts). Model answers (spend-locked off) never are.
    // The key is the question, item, routed market and intent, and window only: the thread's answer
    // fingerprints (prev.answerHash / prev.seen) never enter it; the repeat check runs after the lookup.
    const useCache = !isLlmEnabled() && !(TEST_TOGGLES && req.headers.get("x-bungah-test") === "no-cache");
    const version = useCache ? await dataVersion() : "";
    const cardFor = async (q: string, rng: typeof range, rt: { marketSlug: string | null; intent: typeof route.intent }): Promise<{ value: Built; status: CacheStatus }> => {
      if (!useCache) return { value: await build(q, rng, rt)(), status: "bypass" };
      const key = answerKey({ version, question: q, scope, marketSlug: rt.marketSlug, range: rng, intent: rt.intent });
      return cachedAnswer(key, build(q, rng, rt));
    };
    const r0 = await cardFor(question, range, route);
    let answer: Built = r0.value;
    const cache: CacheStatus = r0.status;

    if (detail) {
      // Everything the card left off: the full sections plus every cited source behind the answer.
      const b = answer.brief as (ChatBrief & { cited?: Citation[] }) | null;
      return NextResponse.json(
        { sections: b?.sections ?? [], cited: wireCited(b?.cited), citations: answer.citations, sources: answer.sources },
        { headers: { "Cache-Control": "no-store", "x-chat-cache": cache, "x-chat-log": "none (detail)" } }
      );
    }

    // Never the same answer twice in a thread: a card matching any answer already shown (prev.answerHash or
    // prev.seen) gets one line and chips for other angles, and a chip whose card was already shown is dropped.
    // A chip's card is built the way the chip's own request will be (same scope, routed with this answer as prev).
    const chipPrev = { question: question.slice(0, 300), intent: (answer.intent ?? null) as ChatIntent | null, marketSlug: answer.marketSlug, answerHash: null, seen: [] };
    const hashOf = async (c: FollowUpChip) => {
      const rt = await resolveFollowUp({ question: c.question, scope, marketSlug: askedMarket, prev: chipPrev });
      return answerHash((await cardFor(c.question, c.range ?? "all", rt)).value);
    };
    // Batch 1 (Eric QA c): × on the market, then a vague question → the national read when one is on file,
    // else "which market?" with chips (each dropped if its card was already shown). Never a ranking.
    let fallbackChips: FollowUpChip[] | undefined;
    const fb = await clearedMarketFallback({
      answer,
      prev,
      question,
      scope,
      askedMarket,
      build: async (q) => (await cardFor(q, range, await resolveFollowUp({ question: q, scope, marketSlug: null, prev: null }))).value,
    });
    if (fb) {
      answer = fb.answer;
      if (fb.followUps?.length) {
        const taken = shownHashes(prev);
        fallbackChips = [];
        for (const c of fb.followUps) {
          const h = await hashOf(c).catch(() => null);
          if (h && !taken.has(h)) {
            taken.add(h);
            fallbackChips.push(c);
          }
        }
        answer = { ...answer, ...(fallbackChips.length ? { followUps: fallbackChips } : {}) };
      }
    }
    const nr = await applyNoRepeat(answer, { prev, question, range, hashOf });
    answer = nr.answer;
    const { hash, repeat, followUps } = nr;

    // Batch 1 (src/lib/chat-context.ts): the carry-over chip's parts, the "what changed" opener and one
    // next-best alternate. Computed after the cache and the repeat check, so neither the cache key nor the
    // fingerprint sees them, and the logged answer is unchanged (no context is stored; schema deferred).
    const brief = answer.brief as (ChatBrief & { span?: { to: string | null } }) | null;
    const { context, opener, alternate, repeatLine } = await followUpExtras({ answer, prev, question, range, scope, repeat, hash, hashOf });
    // Only the bare repeat note is replaced; a decline or premise line on a repeat is kept as it is.
    if (repeatLine && /^That's the same answer/.test(answer.content)) answer = { ...answer, content: repeatLine };

    const forceFailEarly = TEST_TOGGLES && req.headers.get("x-bungah-test") === "fail-log";
    // One conversation = one owned thread: accept the client's threadId only from its owner (else a new
    // thread). Read-only except a same-browser claim after sign-in. Skipped when this deployment writes nothing.
    if (!userId && !anonId && shouldPersist()) {
      const minted = mintAnon();
      if (minted) {
        anonId = minted.id;
        mintedCookie = minted.cookie;
      }
    }
    const owner: Owner = { userId: userId ?? null, anonId };
    let thread: ResolvedThread | null = null;
    if (shouldPersist()) {
      try {
        thread = await resolveThread(prisma, body.threadId, owner, new Date(), { requestId });
      } catch (e) {
        console.error("[chat-log] thread resolve failed (log row only):", e instanceof Error ? e.message : e);
        thread = null;
      }
    }
    // r4 (S3): the conversation was deleted (e.g. a Delete racing this request): 404, nothing written or minted.
    if (thread?.mode === "gone") {
      return NextResponse.json(
        { error: "This conversation was deleted. Ask again to start a new one.", code: "thread-gone" },
        { status: 404, headers: { ...NO_STORE, ...(TEST_TOGGLES ? { "x-chat-thread": "gone" } : {}) } }
      );
    }
    // A new conversation's thread is created now (one small insert), so an immediate follow-up finds it.
    const threadStatus = thread ? (thread.mode === "owned" ? `${thread.status}${thread.rejected ? `; rejected:${thread.rejected}` : ""}${thread.replay ? "; replay" : ""}` : thread.mode) : "none";
    if (thread?.mode === "owned" && thread.status === "new" && !forceFailEarly) {
      try {
        thread = await createOwnedThread(prisma, thread, owner, question);
      } catch (e) {
        console.error("[chat-log] thread create failed (log row only):", e instanceof Error ? e.message : e);
        thread = null;
      }
    }
    const threadId = thread?.mode === "owned" ? thread.threadId : null;

    // Persist the turn before responding so a follow-up or reload cannot race an empty `after()` write.
    const forceFail = TEST_TOGGLES && req.headers.get("x-bungah-test") === "fail-log";
    const logged = answer;
    await persist({ question, answer: logged, marketSlug, isPrivate, userId: userId ?? null, source, scope: scope ? `${scope.kind}:${scope.id}` : null, forceFail, thread, owner, requestId });
    if (!userId) after(() => { void maybeSaveSignedOutIdea(prisma, question, threadId); });
    // S6: a signed-in request carrying this browser's signed-out id links the two (for account deletion).
    if (userId && anonId && shouldPersist()) after(() => recordAnonLink(prisma, owner).catch((e) => console.error("[chat-log] anon link failed:", e instanceof Error ? e.message : e)));

    const modelUsed = toModelUsed(answer.mode);
    const res = NextResponse.json(
      {
        // With a summary card the client renders only `brief`: `content` is the same sections again as one
        // markdown block (every URL in it is also in brief.sections), so it is not sent at all; citations and
        // sources come with the lazy detail fetch. Without a brief, `content` + sources are the answer.
        ...(answer.brief ? {} : { content: answer.content, citations: answer.citations, sources: answer.sources }),
        brief: wireBrief(answer.brief),
        // The owned conversation's id (foundation schema), sent back on follow-ups; null on the legacy path.
        threadId,
        intent: answer.intent,
        marketSlug: answer.marketSlug,
        // The card's fingerprint (the repeated card's on a no-repeat reply), sent back as prev.answerHash.
        answerHash: hash,
        // Batch 1: carry-over chip parts, the opener line and the next-best alternate (absent when none).
        context,
        ...(opener ? { opener } : {}),
        ...(alternate ? { alternate } : {}),
        range,
        ...(brief?.span?.to ? { dataTo: brief.span.to } : {}),
        ...(followUps?.length ? { followUps } : answer.followUps?.length ? { followUps: answer.followUps } : {}),
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
          ...(TEST_TOGGLES
            ? { "x-chat-thread": threadStatus, "x-chat-log-source": source, "x-chat-followup": [prev ? "prev" : "no-prev", route.inherited ? "inherited-market" : "", route.intent ? `intent:${route.intent}` : "", repeat ? "repeat-blocked" : "", opener ? `opener:${opener.kind}` : "", alternate ? "alternate" : "", prev?.cleared?.length ? `cleared:${prev.cleared.join(",")}` : "", fb ? (fb.national ? "cleared-market:national" : "cleared-market:which-market") : ""].filter(Boolean).join("; ") }
            : {}),
        },
      }
    );
    // The cookie is set only when it owns a thread (never on the legacy path or a no-write deployment).
    if (mintedCookie && thread?.mode === "owned") res.cookies.set(ANON_COOKIE, mintedCookie, anonCookieOptions());
    return res;
  } catch (e) {
    console.error(e);
    // Never echo raw DB/driver errors (they can carry hostnames); give a friendly, retryable answer.
    const dbDown = e instanceof Error && (e.message === "CAPITAL_GRAPH_UNAVAILABLE" || /prisma|database|P10\d\d/i.test(e.message + e.name));
    return NextResponse.json(
      { error: dbDown ? "Chat is temporarily unavailable while market data reconnects. Please try again in a few minutes." : "Couldn't get an answer just now. Try again in a moment." },
      { status: dbDown ? 503 : 500 }
    );
  }
}
