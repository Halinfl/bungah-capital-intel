"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { MarkdownLite } from "@/components/MarkdownLite";
import { SourceChip } from "@/components/SourceChip";
import { SourceLinks } from "@/components/SourceLinks";
import { ChatBriefView, type BriefSection, type ChatBrief, type DateRange } from "@/components/ChatBriefView";
import { useRouter } from "next/navigation";
import Link from "next/link";

/** The item this chat is about ("Ask about this"), resolved on the server. */
export type ChatScopeProp = { kind: "market" | "reit" | "deal"; id: string; label: string } | null;
export type StarterProp = { q: string; range?: DateRange };
type AskSource = "typed" | "starter" | "reask" | "link";
const RATE_LIMIT_MESSAGE = "Sign in to keep asking.";

type Msg = {
  role: "user" | "assistant";
  content: string;
  citations?: string[];
  sources?: { url: string; label: string; secondary?: boolean; signal: string }[];
  brief?: ChatBrief | null;
  /** The question this message asks / answers, and its date window (re-ask chip). */
  question?: string;
  range?: DateRange;
};

const RANGE_TAG: Record<DateRange, string> = { "90d": "Last 90 days", "12m": "Last 12 months", all: "All dates" };


function marketLabel(slug: string): string {
  return slug.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ChatClient({ scope = null, starters = [] }: { scope?: ChatScopeProp; starters?: StarterProp[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const searchParams = useSearchParams();
  const legacyMarket = searchParams.get("market")?.trim() ?? "";
  // A market chip (from "Ask about this") scopes the chat the same way the older ?market= links do.
  const marketSlug = scope?.kind === "market" ? scope.id : legacyMarket;
  const queryQuestion = searchParams.get("q")?.trim() ?? "";
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
  const autoSubmittedKey = useRef<string | null>(null);

  const isEmpty = messages.length === 0;
  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (messages.length) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  // Fresh thread whenever marketSlug / initialQuestionKey changes so a prior
  // auto-ask does not burn Q2 of another market CTA.
  useEffect(() => {
    if (threadKeyRef.current === initialQuestionKey) return;
    threadKeyRef.current = initialQuestionKey;
    requestSeq.current += 1;
    inFlight.current?.abort();
    inFlight.current = null;
    setMessages([]);
    setInput(initialQuestion || "");
    setBusy(false);
    autoSubmittedKey.current = null;
  }, [initialQuestionKey, initialQuestion]);

  // Section bodies for an answer already on screen (same question, item and window); not a new question.
  const loadSections = useCallback(
    async (q: string, range: DateRange): Promise<BriefSection[]> => {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          marketSlug: marketSlug || undefined,
          ...(scope ? { scope: { kind: scope.kind, id: scope.id } } : {}),
          ...(range !== "all" ? { range } : {}),
          detail: true,
        }),
      });
      if (!res.ok) throw new Error("detail failed");
      const data = await res.json();
      return (data.sections ?? []) as BriefSection[];
    },
    [marketSlug, scope]
  );

  const send = useCallback(
    async (text: string, range: DateRange = "all", source: AskSource = "typed") => {
      const q = text.trim();
      if (!q || busy) return;
      setBusy(true);
      // A re-ask from the date chip keeps whatever is being typed.
      if (range === "all") setInput("");

      setMessages((m) => [...m, { role: "user", content: q, question: q, range }]);

      const seq = ++requestSeq.current;
      inFlight.current?.abort();
      const controller = new AbortController();
      inFlight.current = controller;
      let reply: Msg;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: q,
            marketSlug: marketSlug || undefined,
            ...(scope ? { scope: { kind: scope.kind, id: scope.id } } : {}),
            ...(range !== "all" ? { range } : {}),
            source,
          }),
          signal: controller.signal,
        });
        const data = await res.json();
        // Rate limit: the reply is only "Sign in to keep asking."
        if (res.status === 429) throw new Error(RATE_LIMIT_MESSAGE);
        if (!res.ok) throw new Error(data.error || "Chat failed");
        reply = { role: "assistant", content: data.content ?? "", citations: data.citations ?? [], sources: data.sources ?? [], brief: data.brief ?? null, question: q, range };
      } catch (e) {
        reply = { role: "assistant", content: e instanceof Error ? e.message : "Error", citations: [] };
      }
      // Stale (reset or superseded) → drop it; the thread on screen keeps its single answer.
      if (seq !== requestSeq.current) return;
      inFlight.current = null;
      // The final answer is appended once and never rewritten.
      setMessages((m) => [...m, reply]);
      setBusy(false);
    },
    [busy, marketSlug, scope]
  );

  useEffect(() => {
    if (!initialQuestion || !marketSlug) return;
    if (autoSubmittedKey.current === initialQuestionKey) return;
    autoSubmittedKey.current = initialQuestionKey;
    void send(initialQuestion, "all", "link");
  }, [initialQuestion, initialQuestionKey, marketSlug, send]);

  /** Remove the item chip: the chat goes back to general (fresh thread, general starters). */
  const clearScope = useCallback(() => {
    router.replace("/chat");
  }, [router]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-300">
        <span>Private · Cited · Decision support</span>
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
              {m.role === "assistant" ? (
                m.brief ? (
                  <ChatBriefView
                    brief={m.brief}
                    onReask={m.question ? (r) => void send(m.question!, r, "reask") : undefined}
                    loadSections={m.question ? () => loadSections(m.question!, m.range ?? "all") : undefined}
                  />
                ) : m.content === RATE_LIMIT_MESSAGE ? (
                  <p className="text-sm text-slate-100">
                    <Link href="/login?redirect_url=/chat" className="underline decoration-white/40 underline-offset-2 hover:text-white">
                      {RATE_LIMIT_MESSAGE}
                    </Link>
                  </p>
                ) : (
                  <MarkdownLite text={m.content} />
                )
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
          {busy ? <p className="text-sm text-slate-300">Retrieving from the graph…</p> : null}
          <div ref={endRef} />
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 space-y-2 border-t border-white/[0.1] bg-[#2f333c]/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:static sm:z-auto sm:border-0 sm:bg-transparent sm:p-0">
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
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input, "all", "typed");
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={scope ? `Ask about ${scope.label}…` : "Capital question…"}
            aria-label={scope ? `Question about ${scope.label}` : "Capital question"}
            className="min-h-11 min-w-0 flex-1 rounded-lg border border-white/20 bg-[#262a32] px-3 py-2.5 text-base text-white sm:text-sm placeholder:text-slate-400 focus:border-slate-400/40 focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="min-h-11 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-slate-900"
          >
            Send
          </button>
        </form>
      </div>
      <div aria-hidden className={`${scope ? "h-32" : "h-16"} sm:hidden`} />

    </div>
  );
}
