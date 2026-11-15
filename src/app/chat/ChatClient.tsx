"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { MarkdownLite } from "@/components/MarkdownLite";
import { SourceChip } from "@/components/SourceChip";
import { SourceLinks } from "@/components/SourceLinks";
import { ChatBriefView, type BriefSection, type ChatBrief, type DateRange } from "@/components/ChatBriefView";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { chatSourceFor } from "@/lib/tuesday-trends-swipe";
import { chatLabel } from "@/lib/chat-label";
import { parseInlineLinks } from "@/lib/inline-links";
import { CHAT_AI_DISCLOSURE, CHAT_AI_LABEL, CHAT_PRIVACY_HREF, CHAT_PRIVACY_LINK_LABEL } from "@/lib/chat-llm-disclosure";
import { messagesFromThread, parseMarker, planRestore, restoreKey, serializeMarker, withoutFailedTurn } from "@/lib/chat-restore";
import type { Alternate, ChatContext, ContextPart, Opener } from "@/lib/chat-context";

/** The item this chat is about ("Ask about this"), resolved on the server. */
export type ChatScopeProp = { kind: "market" | "reit" | "deal"; id: string; label: string } | null;
export type StarterProp = { q: string; range?: DateRange };
type AskSource = "typed" | "starter" | "reask" | "link" | "tt-swipe" | "chip";
/**
 * The answer on screen, sent with the next question so a follow-up keeps its market and never gets the same card.
 * `seen`: fingerprints of the answers already shown in this thread (newest first, at most SEEN_MAX), so a card
 * shown earlier (not just directly above) is never shown again.
 */
type PrevAnswer = {
  question: string;
  intent: string | null;
  marketSlug: string | null;
  answerHash: string;
  seen?: string[];
  /** Batch 1: the answer's date window and newest cited month (the opener's data-change check). */
  range?: DateRange;
  dataTo?: string;
  /** Batch 1: carry-over chip parts removed with × since that answer. */
  cleared?: ContextPart[];
};
const SEEN_MAX = 10;
/** "Other angle" chips under a no-repeat reply: each runs a real question. */
type FollowUpChip = { label: string; question: string; range?: DateRange };
const RATE_LIMIT_MESSAGE = "Sign in to keep asking";
/** One plain line for every failure we can't describe better (5xx, edge error page, network drop, timeout). */
const FAIL_MESSAGE = "Couldn't get an answer just now. Try again in a moment.";
const SLOW_MESSAGE = "Still working, this one is taking longer than usual.";
const SLOW_AFTER_MS = 8_000;
/** The slow line stays up to here; only then the failure line and "Try again" (load test p99 at 200 askers was ~46 s). */
const TIMEOUT_MS = 60_000;
/** "Try again" ignores repeat taps inside this window, so one tap sends one request. */
const RETRY_DEBOUNCE_MS = 2_000;
const WORKING_MESSAGE = "Getting an answer…";
/** r4 (S2): the server's cap; longer questions are refused with a clear message, never cut. */
const MAX_QUESTION = 1000;
/** The counter shows from here (and always once over the cap). */
const COUNT_FROM = 800;
const GONE_MESSAGE = "This conversation was deleted. Ask again to start a new one.";
/** r4 (S4): one id per question, reused by "Try again", so a request that did reach the server is written once. */
function newRequestId(): string {
  const c = typeof crypto !== "undefined" ? crypto : undefined;
  if (c && typeof c.randomUUID === "function") return c.randomUUID().replace(/-/g, "");
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}
const DELETE_FAIL_MESSAGE = "Couldn't delete this conversation. Try again in a moment.";
/** The 2px slate focus ring every chat control uses (keyboard focus only). */
const RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200";

/**
 * Read a /api/chat response without trusting its body: a Vercel timeout or edge error page is HTML or plain
 * text, not JSON. Returns the parsed object, or null when the body is not JSON (never a raw parse error).
 */
async function readJson(res: Response): Promise<Record<string, unknown> | null> {
  const text = await res.text().catch(() => "");
  try {
    const v = JSON.parse(text);
    return v && typeof v === "object" ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

type Msg = {
  role: "user" | "assistant";
  content: string;
  citations?: string[];
  sources?: { url: string; label: string; secondary?: boolean; signal: string }[];
  brief?: ChatBrief | null;
  /** The question this message asks / answers, and its date window (re-ask chip). */
  question?: string;
  range?: DateRange;
  /** A failed answer: shows FAIL_MESSAGE (or the server's own retryable copy) with a "Try again" button. */
  failed?: boolean;
  rateLimited?: boolean;
  /** The previous answer this question was sent with (the section fetch sends the same, so it gets the same card). */
  prev?: PrevAnswer | null;
  /** No-repeat reply: other angles to try. */
  followUps?: FollowUpChip[];
  /** r4 (S4): the question's request id (the retry sends the same one). */
  requestId?: string;
  /** A refusal that retrying won't fix (too long, conversation deleted): no "Try again". */
  noRetry?: boolean;
  /** Batch 1: what changed vs the answer before it, and one next-best alternate. */
  opener?: Opener;
  alternate?: Alternate;
  /** Set when this answer came from the Groq path (label only; deterministic answers stay unlabeled). */
  mode?: "llm" | "deterministic";
};

const RANGE_TAG: Record<DateRange, string> = { "90d": "Last 90 days", "12m": "Last 12 months", all: "All dates" };


function marketLabel(slug: string): string {
  return slug.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ChatClient({ scope = null, starters = [], signedIn = false }: { scope?: ChatScopeProp; starters?: StarterProp[]; signedIn?: boolean }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [slow, setSlow] = useState(false);
  /** Screen-reader announcement (aria-live): working, slow, answer ready, or what went wrong. */
  const [announce, setAnnounce] = useState("");
  const searchParams = useSearchParams();
  const legacyMarket = searchParams.get("market")?.trim() ?? "";
  // A market chip (from "Ask about this") scopes the chat the same way the older ?market= links do.
  const marketSlug = scope?.kind === "market" ? scope.id : legacyMarket;
  const queryQuestion = searchParams.get("q")?.trim() ?? "";
  /** Opened from a Tuesday Trends swipe card: only the first new question logs "tt-swipe" (re-asks stay "reask"). */
  const fromSwipe = searchParams.get("via") === "tt-swipe";
  const swipeTagPending = useRef(fromSwipe);
  const initialQuestion =
    queryQuestion ||
    (legacyMarket && !scope
      ? `Capital thesis for ${legacyMarket.replaceAll("-", " ")}: RevPAR, occupancy, supply, labor?`
      : "");
  const scopeId = scope ? `${scope.kind}:${scope.id}` : "";
  const initialQuestionKey = `${marketSlug}\u0000${queryQuestion}\u0000${scopeId}`;
  const threadKeyRef = useRef<string | null>(null);
  // One answer per question: each send gets a sequence number; a response is rendered only if
  // it is still the latest request for the current thread. A reset aborts the request in
  // flight, so a late reply can never replace or append to an answer already on screen.
  const requestSeq = useRef(0);
  const inFlight = useRef<AbortController | null>(null);
  /** Set synchronously on send, so a double tap cannot start two requests before `busy` re-renders. */
  const sending = useRef(false);
  const lastRetry = useRef(0);
  const autoSubmittedKey = useRef<string | null>(null);
  /** Last answer on screen (its question, intent, market and card hash); null on a fresh thread. */
  const lastAnswer = useRef<PrevAnswer | null>(null);
  /** Fingerprints of every answer shown in this thread, newest first (capped at SEEN_MAX). */
  const seenHashes = useRef<string[]>([]);
  /** Batch 1: what the next question carries over (chip above the input), and the parts removed with ×. */
  const [carry, setCarry] = useState<ChatContext | null>(null);
  const [cleared, setCleared] = useState<ContextPart[]>([]);
  const clearedRef = useRef<ContextPart[]>([]);
  /** Chat foundation: the owned conversation's id (from the first answer), sent back on every follow-up. */
  const threadIdRef = useRef<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [ideaOpen, setIdeaOpen] = useState(false);
  const [ideaText, setIdeaText] = useState("");
  const [ideaStatus, setIdeaStatus] = useState<"" | "saving" | "saved" | "error">("");
  async function shareIdea() {
    const text = ideaText.trim();
    if (text.length < 8) return;
    setIdeaStatus("saving");
    try {
      const res = await fetch("/api/chat/ideas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, threadId: threadIdRef.current }),
      });
      setIdeaStatus(res.ok ? "saved" : "error");
      if (res.ok) setIdeaText("");
    } catch {
      setIdeaStatus("error");
    }
  }

  /** "Delete conversation": idle → confirming → deleting; a failure keeps the conversation and says so. */
  const [deleteStep, setDeleteStep] = useState<"idle" | "confirm" | "deleting">("idle");
  const inputRef = useRef<HTMLInputElement | null>(null);
  /** r4: remember which conversation is on screen (id only, no text) so a reload brings it back; null = nothing to restore. */
  const markerKey = restoreKey(scope ? `${scope.kind}:${scope.id}` : "");
  const writeMarker = useCallback(
    (id: string | null) => {
      try {
        window.localStorage.setItem(markerKey, serializeMarker(id, signedIn));
      } catch {
        /* storage blocked: the conversation just won't come back after a reload */
      }
    },
    [markerKey, signedIn]
  );

  const isEmpty = messages.length === 0;
  const endRef = useRef<HTMLDivElement | null>(null);
  // r4 (Eric QA): the phone composer grows when the carry chip wraps; measure it so the last memo always clears it.
  const composerRef = useRef<HTMLDivElement | null>(null);
  const [composerH, setComposerH] = useState(96);
  useEffect(() => {
    const el = composerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setComposerH(Math.ceil(el.getBoundingClientRect().height)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // The phone composer is fixed: pad the page bottom by its measured height (no in-flow spacers), so the
  // footer and the last row clear it and nothing blank is left below (r2: the ~450px strip at 390).
  useEffect(() => {
    const b = document.body;
    b.style.setProperty("--chat-composer-h", `${composerH}px`);
    b.setAttribute("data-chat-composer", "");
    return () => {
      b.style.removeProperty("--chat-composer-h");
      b.removeAttribute("data-chat-composer");
    };
  }, [composerH]);
  // r4 (S7): keep the fixed composer above the on-screen keyboard: the visual viewport shrinks (iOS/Android)
  // while the layout viewport doesn't, so lift the composer by the difference.
  useEffect(() => {
    const vv = typeof window !== "undefined" ? window.visualViewport : null;
    if (!vv) return;
    const b = document.body;
    const update = () => {
      // Pinch zoom also shrinks the visual viewport; only a keyboard (scale 1) lifts the composer.
      const inset = vv.scale > 1.01 ? 0 : Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
      b.style.setProperty("--chat-kb-inset", `${inset}px`);
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      b.style.removeProperty("--chat-kb-inset");
    };
  }, []);
  // r2 (Eric QA): the "Delete conversation" row appears once the answer is in (threadId set, not busy);
  // scroll again then, so the row (the last thing in the thread) clears the composer too.
  const showDelete = Boolean(threadId && !busy);
  const lastAutoScroll = useRef(0);
  useEffect(() => {
    if (!messages.length) return;
    lastAutoScroll.current = Date.now();
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, showDelete]);
  // The composer grows right after an answer (the "Following up on" chips appear), which raises its top
  // over the row that was just scrolled clear; scroll once more then. Not on later composer changes.
  useEffect(() => {
    if (!messages.length || Date.now() - lastAutoScroll.current > 2000) return;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [composerH, messages.length]);

  // Fresh thread whenever marketSlug / initialQuestionKey changes so a prior
  // auto-ask does not burn Q2 of another market CTA.
  useEffect(() => {
    if (threadKeyRef.current === initialQuestionKey) return;
    threadKeyRef.current = initialQuestionKey;
    requestSeq.current += 1;
    inFlight.current?.abort();
    inFlight.current = null;
    sending.current = false;
    lastAnswer.current = null;
    seenHashes.current = [];
    threadIdRef.current = null;
    setThreadId(null);
    setDeleteStep("idle");
    setCarry(null);
    setCleared([]);
    clearedRef.current = [];
    setMessages([]);
    setInput(initialQuestion || "");
    setBusy(false);
    setSlow(false);
    setAnnounce("");
    autoSubmittedKey.current = null;
  }, [initialQuestionKey, initialQuestion]);

  // r4: on load, bring back the conversation this browser had on screen (owner GET; the server returns it only
  // to its owner). Signed out → signed in in the same browser within 24h: claim it first, once (plan §2).
  const restoredKey = useRef<string | null>(null);
  useEffect(() => {
    if (restoredKey.current === initialQuestionKey) return;
    restoredKey.current = initialQuestionKey;
    let marker = null;
    try {
      marker = parseMarker(window.localStorage.getItem(markerKey));
    } catch {
      marker = null;
    }
    const plan = planRestore(marker, signedIn, { canRestore: !queryQuestion && !legacyMarket, general: !scope });
    if (plan.kind === "none") {
      // A signed-in conversation never comes back signed out; forget it.
      if (marker?.id && marker.signedIn && !signedIn) writeMarker(null);
      return;
    }
    const seq = requestSeq.current;
    void (async () => {
      let url = plan.kind === "current" ? "/api/chat/threads/current" : `/api/chat/threads/${encodeURIComponent(plan.id)}`;
      try {
        if (plan.kind === "claim") {
          writeMarker(null); // once: a failed claim is not retried on the next load
          const c = await fetch(`/api/chat/threads/${encodeURIComponent(plan.id)}/claim`, { method: "POST" });
          if (!c.ok) url = "/api/chat/threads/current";
        }
        const res = await fetch(url, { cache: "no-store" });
        const data = res.ok ? await readJson(res) : null;
        const t = data?.thread as { id?: unknown; messages?: unknown } | undefined;
        if (seq !== requestSeq.current || sending.current) return; // the visitor already started something
        if (!t || typeof t.id !== "string" || !Array.isArray(t.messages)) {
          if (plan.kind === "get") writeMarker(null);
          return;
        }
        const restored = messagesFromThread(t.messages as Parameters<typeof messagesFromThread>[0]);
        if (!restored.length) return;
        threadIdRef.current = t.id;
        setThreadId(t.id);
        writeMarker(t.id);
        setMessages(restored.map((m) => ({ ...m, range: "all" as DateRange })));
        setAnnounce(plan.kind === "claim" && url !== "/api/chat/threads/current" ? "Your conversation is saved to your account." : "Conversation restored.");
      } catch {
        /* offline or blocked: start fresh, as before */
      }
    })();
  }, [initialQuestionKey, markerKey, signedIn, queryQuestion, legacyMarket, scope, writeMarker]);

  // Section bodies for an answer already on screen (same question, item and window); not a new question.
  const loadSections = useCallback(
    async (q: string, range: DateRange, prev: PrevAnswer | null | undefined): Promise<BriefSection[]> => {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          marketSlug: marketSlug || undefined,
          ...(scope ? { scope: { kind: scope.kind, id: scope.id } } : {}),
          ...(range !== "all" ? { range } : {}),
          ...(prev ? { prev } : {}),
          detail: true,
        }),
      });
      const data = res.ok ? await readJson(res) : null;
      if (!data) throw new Error("detail failed");
      return (data.sections ?? []) as BriefSection[];
    },
    [marketSlug, scope]
  );

  const send = useCallback(
    async (text: string, range: DateRange = "all", source: AskSource = "typed", opts: { requestId?: string } = {}) => {
      const q = text.trim();
      if (!q || q.length > MAX_QUESTION || busy || sending.current) return;
      const requestId = opts.requestId ?? newRequestId();
      sending.current = true;
      setBusy(true);
      const { source: tagged, pending } = chatSourceFor<AskSource>(source, swipeTagPending.current);
      swipeTagPending.current = pending;
      // A re-ask from the date chip keeps whatever is being typed.
      if (range === "all" || source === "typed") setInput("");

      setMessages((m) => [...m, { role: "user", content: q, question: q, range, requestId }]);
      const prev = lastAnswer.current
        ? { ...lastAnswer.current, seen: seenHashes.current.slice(0, SEEN_MAX), ...(clearedRef.current.length ? { cleared: clearedRef.current } : {}) }
        : null;

      const seq = ++requestSeq.current;
      inFlight.current?.abort();
      const controller = new AbortController();
      inFlight.current = controller;
      setSlow(false);
      setAnnounce(WORKING_MESSAGE);
      // After ~8 s say it is still working; after 60 s give up with the retry line (the server keeps no state).
      const slowTimer = setTimeout(() => {
        if (seq !== requestSeq.current) return;
        setSlow(true);
        setAnnounce(SLOW_MESSAGE);
      }, SLOW_AFTER_MS);
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
      let reply: Msg;
      let nextPrev: PrevAnswer | null = null;
      let nextContext: ChatContext | null = null;
      let nextThreadId: string | null = null;
      let gone = false;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: q,
            marketSlug: marketSlug || undefined,
            ...(scope ? { scope: { kind: scope.kind, id: scope.id } } : {}),
            ...(range !== "all" ? { range } : {}),
            ...(prev ? { prev } : {}),
            ...(threadIdRef.current ? { threadId: threadIdRef.current } : {}),
            source: tagged,
            requestId,
          }),
          signal: controller.signal,
        });
        // Rate limit (this route's JSON 429 or a firewall 429 page from the edge): only "Sign in to keep asking".
        if (res.status === 429) {
          reply = { role: "assistant", content: RATE_LIMIT_MESSAGE, rateLimited: true };
        } else {
          const data = await readJson(res);
          if (res.ok && data) {
            reply = {
              role: "assistant",
              content: (data.content as string) ?? "",
              citations: (data.citations as string[]) ?? [],
              sources: (data.sources as Msg["sources"]) ?? [],
              brief: (data.brief as ChatBrief) ?? null,
              question: q,
              range,
              prev,
              followUps: Array.isArray(data.followUps) ? (data.followUps as FollowUpChip[]).slice(0, 3) : undefined,
              opener: data.opener && typeof (data.opener as Opener).text === "string" ? (data.opener as Opener) : undefined,
              alternate: data.alternate && typeof (data.alternate as Alternate).question === "string" ? (data.alternate as Alternate) : undefined,
              mode: data.mode === "llm" ? "llm" : data.mode === "deterministic" ? "deterministic" : undefined,
            };
            if (data.context && typeof data.context === "object") nextContext = data.context as ChatContext;
            if (typeof data.threadId === "string" && data.threadId) nextThreadId = data.threadId;
            if (typeof data.answerHash === "string") {
              nextPrev = {
                question: q.slice(0, 300),
                intent: typeof data.intent === "string" ? data.intent : null,
                marketSlug: typeof data.marketSlug === "string" ? data.marketSlug : null,
                answerHash: data.answerHash,
                range,
                ...(typeof data.dataTo === "string" ? { dataTo: data.dataTo } : {}),
              };
            }
          } else if (res.status === 404 && data?.code === "thread-gone") {
            // S3: the conversation was deleted meanwhile; the next question starts a new one.
            gone = true;
            reply = { role: "assistant", content: GONE_MESSAGE, failed: true, noRetry: true, question: q, range };
          } else if (res.status === 400 && typeof data?.error === "string") {
            // S1/S2: the server's own plain refusal (empty or too long); retrying the same text won't help.
            reply = { role: "assistant", content: data.error as string, failed: true, noRetry: true, question: q, range };
          } else {
            // 503 carries the route's own retryable copy; anything else (500, edge 504 page, empty body) gets one line.
            const own = res.status === 503 && typeof data?.error === "string" ? (data.error as string) : null;
            reply = { role: "assistant", content: own ?? FAIL_MESSAGE, failed: true, question: q, range, requestId };
          }
        }
      } catch {
        // Network drop, a timeout, or an abort. A reset/superseded request is dropped below.
        reply = { role: "assistant", content: FAIL_MESSAGE, failed: true, question: q, range, requestId };
      } finally {
        clearTimeout(slowTimer);
        clearTimeout(timeout);
      }
      // Stale (reset or superseded) → drop it; the thread on screen keeps its single answer.
      if (seq !== requestSeq.current) return;
      inFlight.current = null;
      sending.current = false;
      if (nextThreadId) {
        threadIdRef.current = nextThreadId;
        setThreadId(nextThreadId);
        writeMarker(nextThreadId);
      } else if (gone) {
        threadIdRef.current = null;
        setThreadId(null);
        writeMarker(null);
        lastAnswer.current = null;
        seenHashes.current = [];
      }
      // Failed or rate-limited replies leave the previous answer as the follow-up context.
      if (nextPrev) {
        lastAnswer.current = nextPrev;
        seenHashes.current = [nextPrev.answerHash, ...seenHashes.current.filter((h) => h !== nextPrev!.answerHash)].slice(0, SEEN_MAX);
        // A new answer resets the chip to its own context; earlier × choices were already applied.
        setCarry(nextContext);
        setCleared([]);
        clearedRef.current = [];
      }
      // The final answer is appended once and never rewritten.
      setMessages((m) => [...m, reply]);
      setBusy(false);
      setSlow(false);
      setAnnounce(reply.rateLimited ? RATE_LIMIT_MESSAGE : reply.failed ? reply.content : "Answer ready.");
    },
    [busy, marketSlug, scope, writeMarker]
  );

  /**
   * r4 (S4) "Try again": the failed answer and its question leave the screen and the question is sent again
   * with the same request id, so the thread shows it once and a copy that did reach the server is written once.
   */
  const retry = useCallback(
    (i: number) => {
      const failed = messages[i];
      if (!failed?.failed || !failed.question || busy || sending.current) return;
      const asked = messages[i - 1];
      setMessages((m) => withoutFailedTurn(m, i));
      void send(failed.question, failed.range ?? "all", "reask", { requestId: failed.requestId ?? asked?.requestId });
    },
    [messages, busy, send]
  );

  useEffect(() => {
    if (!initialQuestion || !marketSlug) return;
    if (autoSubmittedKey.current === initialQuestionKey) return;
    autoSubmittedKey.current = initialQuestionKey;
    void send(initialQuestion, "all", "link");
  }, [initialQuestion, initialQuestionKey, marketSlug, send]);

  /** Batch 1: remove one part of the carry-over chip; the next question stops carrying it. */
  const dropPart = useCallback((part: ContextPart) => {
    setCleared((c) => {
      const next = c.includes(part) ? c : [...c, part];
      clearedRef.current = next;
      return next;
    });
  }, []);
  /** Parts still carried: the market only when it isn't fixed by the page (item chip or ?market= link). */
  const carried: { part: ContextPart; label: string }[] = carry
    ? ([
        carry.market && !scope && !legacyMarket ? { part: "market" as const, label: carry.market.label } : null,
        carry.topic ? { part: "topic" as const, label: carry.topic.label } : null,
        carry.period ? { part: "period" as const, label: carry.period.label } : null,
      ].filter(Boolean) as { part: ContextPart; label: string }[]).filter((p) => !cleared.includes(p.part))
    : [];
  /** A typed follow-up keeps the carried date window. */
  const typedRange: DateRange = carry?.period && !cleared.includes("period") ? carry.period.range : "all";

  /** "Delete conversation" (owner only, server-checked): on success the screen starts a fresh thread. */
  const deleteConversation = useCallback(async () => {
    const id = threadIdRef.current;
    if (!id || deleteStep === "deleting") return;
    setDeleteStep("deleting");
    let ok = false;
    try {
      const res = await fetch(`/api/chat/threads/${encodeURIComponent(id)}`, { method: "DELETE" });
      // 404: already gone (or never stored); either way nothing of it is left to show.
      ok = res.ok || res.status === 404;
    } catch {
      ok = false;
    }
    if (!ok) {
      setDeleteStep("confirm");
      setAnnounce(DELETE_FAIL_MESSAGE);
      return;
    }
    requestSeq.current += 1;
    inFlight.current?.abort();
    inFlight.current = null;
    sending.current = false;
    lastAnswer.current = null;
    seenHashes.current = [];
    threadIdRef.current = null;
    setThreadId(null);
    setCarry(null);
    setCleared([]);
    clearedRef.current = [];
    setMessages([]);
    setBusy(false);
    setSlow(false);
    setDeleteStep("idle");
    writeMarker(null);
    setAnnounce("Conversation deleted.");
    // r2 (Eric QA): back to the top so the page heading and the fresh start are in view.
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [deleteStep, writeMarker]);

  /** r4 "New chat": a fresh screen; the conversation stays on the server and no longer comes back on reload. */
  const newChat = useCallback(() => {
    requestSeq.current += 1;
    inFlight.current?.abort();
    inFlight.current = null;
    sending.current = false;
    lastAnswer.current = null;
    seenHashes.current = [];
    threadIdRef.current = null;
    setThreadId(null);
    setCarry(null);
    setCleared([]);
    clearedRef.current = [];
    setMessages([]);
    setBusy(false);
    setSlow(false);
    setDeleteStep("idle");
    writeMarker(null);
    setAnnounce("New chat.");
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    inputRef.current?.focus({ preventScroll: true });
  }, [writeMarker]);

  /** Remove the item chip: the chat goes back to general (fresh thread, general starters). */
  const clearScope = useCallback(() => {
    router.replace("/chat");
  }, [router]);

  return (
    <div className="flex flex-col gap-4">
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announce}
      </p>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-300">
        <span>{chatLabel(signedIn)}</span>
        {marketSlug && !scope ? (
          <>
            <span aria-hidden>·</span>
            <span className="text-slate-100">{marketLabel(marketSlug)}</span>
          </>
        ) : null}
      </div>

      {isEmpty ? (
        <div className="space-y-4 rounded-xl border border-white/[0.08] bg-[#262a32] p-4 sm:space-y-5 sm:p-6">
          <div className="space-y-2">
            <h2 className="text-lg font-medium tracking-tight text-white">
              {scope ? `Ask about ${scope.label}` : "Start with the decision in front of you."}
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300">
              {starters.length
                ? "Tap a question to ask it, or type your own. Every number is cited; you make the call."
                : scope
                  ? `Type a question about ${scope.label}. Every number is cited; you make the call.`
                  : "Type a capital question. Every number is cited; you make the call."}
            </p>
          </div>

          {starters.length ? (
            <ul className="flex flex-wrap gap-2" aria-label="Starter questions">
              {starters.map((st) => (
                <li key={st.q}>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void send(st.q, st.range ?? "all", "starter")}
                    className="min-h-11 rounded-full border border-white/45 bg-white/[0.03] px-4 py-2.5 text-left text-sm leading-snug text-slate-100 transition hover:border-white/60 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200 disabled:opacity-60"
                  >
                    {st.q}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

        </div>
      ) : (
        <div className="min-h-[280px] space-y-4 rounded-xl border border-white/[0.08] bg-[#262a32] p-4 sm:p-5">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-lg border p-3.5 ${
                m.role === "user"
                  ? "ml-6 border-white/10 bg-white/[0.04]"
                  : "mr-2 border-white/[0.06] bg-transparent"
              }`}
            >
              <div className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-slate-300">
                {m.role === "user" ? "You" : "Memo · Bungah Capital Intel"}
              </div>
              {m.role === "assistant" && m.opener ? (
                <p className={`mb-2 text-sm leading-snug ${m.opener.kind === "unsupported" ? "text-slate-100" : "text-slate-300"}`} data-opener={m.opener.kind}>
                  {m.opener.text}
                </p>
              ) : null}
              {m.role === "assistant" ? (
                <>
                {m.mode === "llm" ? (
                  <p className="mb-1 text-[11px] uppercase tracking-wider text-slate-400" data-chat-ai-label>
                    {CHAT_AI_LABEL}
                  </p>
                ) : null}
                {m.brief ? (
                  <ChatBriefView
                    brief={m.brief}
                    onReask={m.question ? (r) => void send(m.question!, r, "reask") : undefined}
                    loadSections={m.question ? () => loadSections(m.question!, m.range ?? "all", m.prev) : undefined}
                  />
                ) : m.rateLimited ? (
                  <p className="text-sm text-slate-100">
                    <Link
                      href="/login?redirect_url=/chat"
                      className="inline-flex min-h-11 items-center underline decoration-white/40 underline-offset-2 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200"
                    >
                      {RATE_LIMIT_MESSAGE}
                    </Link>
                  </p>
                ) : m.failed ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm text-slate-100">{m.content}</p>
                    {m.question && !m.noRetry ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => {
                          const now = Date.now();
                          if (now - lastRetry.current < RETRY_DEBOUNCE_MS) return;
                          lastRetry.current = now;
                          retry(i);
                        }}
                        className="min-h-11 rounded-lg border border-white/45 px-4 py-2 text-sm text-slate-100 hover:border-white/60 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200 disabled:opacity-60"
                      >
                        Try again
                      </button>
                    ) : null}
                  </div>
                ) : m.followUps?.length ? (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-100">
                      <InlineLinks text={m.content} />
                    </p>
                    <ul className="flex flex-wrap gap-2" aria-label="Other angles to weigh">
                      {m.followUps.map((c) => (
                        <li key={`${c.label}|${c.range ?? "all"}`}>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void send(c.question, c.range ?? "all", "chip")}
                            className="min-h-11 rounded-full border border-white/45 bg-white/[0.03] px-4 py-2.5 text-left text-sm leading-snug text-slate-100 transition hover:border-white/60 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200 disabled:opacity-60"
                          >
                            {c.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <MarkdownLite text={m.content} />
                )}
                </>
              ) : (
                <p className="text-sm text-slate-200">
                  {m.content}
                  {m.range && m.range !== "all" ? (
                    <span className="ml-2 inline-flex items-center rounded-full border border-white/20 px-2 py-0.5 align-middle text-xs leading-none text-slate-300">
                      {RANGE_TAG[m.range]}
                    </span>
                  ) : null}
                </p>
              )}
              {m.role === "assistant" && m.alternate ? (
                <div className="mt-3 space-y-2 border-t border-white/[0.06] pt-3" data-alternate>
                  <p className="text-sm leading-snug text-slate-300">
                    <span className="text-slate-200">Next best on file:</span> {m.alternate.why}
                  </p>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void send(m.alternate!.question, m.alternate!.range ?? "all", "chip")}
                    className="min-h-11 rounded-full border border-white/45 bg-white/[0.03] px-4 py-2.5 text-left text-sm leading-snug text-slate-100 transition hover:border-white/60 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200 disabled:opacity-60"
                  >
                    {m.alternate.label}
                  </button>
                </div>
              ) : null}
              {/* With a brief, sources live in its own "Sources (N)" section. */}
              {!m.brief && m.sources && m.sources.length > 0 ? (
                <div className="mt-3 space-y-1.5 border-t border-white/[0.06] pt-3">
                  <div className="text-xs uppercase tracking-wider text-slate-300">Sources (open original)</div>
                  <SourceLinks links={m.sources} />
                </div>
              ) : null}
              {!m.brief && m.citations && m.citations.length > 0 ? (
                <div className="mt-3 flex flex-col gap-1.5 border-t border-white/[0.06] pt-3">
                  <div className="text-xs uppercase tracking-wider text-slate-300">Citations</div>
                  {m.citations.map((c, j) => (
                    <SourceChip key={j} label={c} />
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          {busy ? <p className="text-sm text-slate-300">{slow ? SLOW_MESSAGE : WORKING_MESSAGE}</p> : null}
          {/* On phones the composer is fixed to the bottom: scroll the newest message clear of it. */}
          {showDelete ? (
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-white/[0.06] pt-3 text-sm" data-delete-conversation>
              {deleteStep === "idle" ? (
                <>
                <button
                  type="button"
                  onClick={newChat}
                  className={`inline-flex min-h-11 items-center rounded-full border border-white/45 px-4 text-slate-100 hover:border-white/60 hover:bg-white/[0.06] ${RING}`}
                >
                  New chat
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteStep("confirm")}
                  className="inline-flex min-h-11 items-center rounded-full px-3 text-slate-300 underline decoration-white/30 underline-offset-2 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200"
                >
                  Delete conversation
                </button>
                </>
              ) : (
                <>
                  <span className="text-slate-200" id="chat-delete-confirm">
                    {announce === DELETE_FAIL_MESSAGE ? DELETE_FAIL_MESSAGE : "Delete this conversation? This can't be undone."}
                  </span>
                  <button
                    type="button"
                    disabled={deleteStep === "deleting"}
                    onClick={() => void deleteConversation()}
                    aria-describedby="chat-delete-confirm"
                    className="inline-flex min-h-11 items-center rounded-full border border-white/45 px-4 text-slate-100 hover:border-white/60 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200 disabled:opacity-60"
                  >
                    {deleteStep === "deleting" ? "Deleting…" : "Delete"}
                  </button>
                  <button
                    type="button"
                    disabled={deleteStep === "deleting"}
                    onClick={() => setDeleteStep("idle")}
                    className="inline-flex min-h-11 items-center rounded-full px-3 text-slate-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          ) : null}
          <div ref={endRef} style={{ ["--composer-h" as string]: `${composerH + 16}px` }} className="scroll-mb-[var(--composer-h)] desk:scroll-mb-0" />
        </div>
      )}

      <div ref={composerRef} data-composer className="fixed inset-x-0 bottom-[var(--chat-kb-inset,0px)] z-30 space-y-2 border-t border-white/[0.1] bg-[#2f333c]/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur desk:static desk:z-auto desk:border-0 desk:bg-transparent desk:p-0">
        {scope ? (
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <span id="chat-scope-label">Asking about</span>
            <span className="inline-flex min-h-11 items-center rounded-full border border-white/45 bg-white/[0.04] pl-3 text-slate-100" aria-describedby="chat-scope-label">
              <span className="max-w-[16rem] truncate">{scope.label}</span>
              <button
                type="button"
                onClick={clearScope}
                aria-label={`Remove ${scope.label} from this chat`}
                className="ml-1 inline-flex h-11 w-11 items-center justify-center rounded-full text-base text-slate-200 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-slate-200"
              >
                <span aria-hidden>×</span>
              </button>
            </span>
          </div>
        ) : null}
        {!isEmpty && carried.length ? (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-300" data-carry>
            <span id="chat-carry-label">Following up on</span>
            <ul className="flex flex-wrap items-center gap-1.5" aria-labelledby="chat-carry-label">
              {carried.map((p) => (
                <li key={p.part} className="inline-flex min-h-11 items-center rounded-full border border-white/30 bg-white/[0.03] pl-3 text-slate-100">
                  <span className="max-w-[12rem] truncate">{p.label}</span>
                  <button
                    type="button"
                    onClick={() => dropPart(p.part)}
                    aria-label={`Stop following up on ${p.label}`}
                    className="ml-0.5 inline-flex h-11 w-11 items-center justify-center rounded-full text-base text-slate-200 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-slate-200"
                  >
                    <span aria-hidden>×</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input, typedRange, "typed");
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={scope ? `Ask about ${scope.label}…` : "Capital question…"}
            aria-label={scope ? `Question about ${scope.label}` : "Capital question"}
            aria-describedby={input.length >= COUNT_FROM ? "chat-count" : undefined}
            className={`min-h-11 min-w-0 flex-1 rounded-lg border border-white/45 bg-[#262a32] px-3 py-2.5 text-base text-white sm:text-sm placeholder:text-slate-400 focus:border-white/70 ${RING}`}
          />
          <button
            type="submit"
            disabled={busy || !input.trim() || input.trim().length > MAX_QUESTION}
            className={`min-h-11 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-slate-900 ${RING}`}
          >
            Send
          </button>
        </form>
        {input.length >= COUNT_FROM ? (
          <p id="chat-count" className="text-xs text-slate-300" aria-live="polite" data-chat-count>
            {input.trim().length.toLocaleString("en-US")} / {MAX_QUESTION.toLocaleString("en-US")} characters
            {input.trim().length > MAX_QUESTION ? " · shorten it to send" : ""}
          </p>
        ) : null}
        <p className="text-xs leading-snug text-slate-400" data-chat-ai-disclosure>
          {CHAT_AI_DISCLOSURE}{" "}
          <Link
            href={CHAT_PRIVACY_HREF}
            className="underline decoration-white/30 underline-offset-2 hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200"
          >
            {CHAT_PRIVACY_LINK_LABEL}
          </Link>
        </p>
        <div className="text-xs text-slate-400">
          {ideaOpen ? (
            <div className="space-y-2">
              <label htmlFor="chat-idea" className="block">Share an idea to help us improve Chat.</label>
              <textarea
                id="chat-idea"
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                rows={3}
                className={`w-full rounded-lg border border-white/45 bg-[#262a32] px-3 py-2 text-sm text-white placeholder:text-slate-400 ${RING}`}
                placeholder="A feature, a better answer, something we missed…"
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => void shareIdea()}
                  disabled={ideaStatus === "saving" || ideaText.trim().length < 8}
                  className={`min-h-11 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-400 ${RING}`}
                >
                  {ideaStatus === "saving" ? "Saving…" : "Send idea"}
                </button>
                <button type="button" onClick={() => setIdeaOpen(false)} className={`min-h-11 px-2 ${RING}`}>
                  Cancel
                </button>
                {ideaStatus === "saved" ? <span>Thanks — we saved that.</span> : null}
                {ideaStatus === "error" ? <span>Couldn&apos;t save that. Try again.</span> : null}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => { setIdeaOpen(true); setIdeaStatus(""); }}
              className={`inline-flex min-h-11 items-center underline decoration-white/30 underline-offset-2 hover:decoration-white ${RING}`}
            >
              Share an idea
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

/** Plain text with on-site markdown links ("[label](/path)") as real links; anything else stays text. */
function InlineLinks({ text }: { text: string }) {
  return (
    <>
      {parseInlineLinks(text).map((part, i) =>
        typeof part === "string" ? (
          part
        ) : (
          <Link key={i} href={part.href} className="text-white underline decoration-white/50 underline-offset-2 hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200">
            {part.label}
          </Link>
        )
      )}
    </>
  );
}
