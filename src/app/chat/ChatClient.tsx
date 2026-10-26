"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MarkdownLite } from "@/components/MarkdownLite";
import { SourceChip } from "@/components/SourceChip";
import { SourceLinks } from "@/components/SourceLinks";

type Msg = {
  role: "user" | "assistant";
  content: string;
  citations?: string[];
  sources?: { url: string; label: string; secondary?: boolean; signal: string }[];
};


function marketLabel(slug: string): string {
  return slug.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function capitalPrompts(marketSlug: string) {
  if (marketSlug) {
    const name = marketLabel(marketSlug);
    return [
      {
        key: "deploy",
        title: "Deploy?",
        prompt: `Should we put capital into ${name} this cycle — and which submarket / product layer?`,
      },
      {
        key: "hold",
        title: "Hold?",
        prompt: `What would have to change in ${name} before we add CapEx or refinance stress on full-service hotels?`,
      },
      {
        key: "flag",
        title: "Flag?",
        prompt: `Flag the demand, supply, debt, or labor risk most likely to break ${name}'s thesis.`,
      },
    ] as const;
  }
  return [
    {
      key: "deploy",
      title: "Deploy?",
      prompt:
        "Should we put capital into a lodging market this cycle — and which submarket / product layer?",
    },
    {
      key: "hold",
      title: "Hold?",
      prompt:
        "What would have to change before we add CapEx or refinance stress on full-service hotels?",
    },
    {
      key: "flag",
      title: "Flag?",
      prompt:
        "Flag the demand, supply, debt, or labor risk most likely to break a market thesis — name the market.",
    },
  ] as const;
}

export function ChatClient() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const searchParams = useSearchParams();
  const marketSlug = searchParams.get("market")?.trim() ?? "";
  const queryQuestion = searchParams.get("q")?.trim() ?? "";
  const initialQuestion =
    queryQuestion ||
    (marketSlug
      ? `Capital thesis for ${marketSlug.replaceAll("-", " ")}: RevPAR, occupancy, supply, labor?`
      : "");
  const initialQuestionKey = `${marketSlug}\u0000${queryQuestion}`;
  const threadKeyRef = useRef<string | null>(null);
  // One answer per question: each send gets a sequence number; a response is rendered only if
  // it is still the latest request for the current thread. A reset aborts the request in
  // flight, so a late reply can never replace or append to an answer already on screen.
  const requestSeq = useRef(0);
  const inFlight = useRef<AbortController | null>(null);
  const autoSubmittedKey = useRef<string | null>(null);
  const prompts = useMemo(() => capitalPrompts(marketSlug), [marketSlug]);

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

  const send = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || busy) return;
      setBusy(true);
      setInput("");

      setMessages((m) => [...m, { role: "user", content: q }]);

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
          }),
          signal: controller.signal,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Chat failed");
        reply = { role: "assistant", content: data.content, citations: data.citations ?? [], sources: data.sources ?? [] };
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
    [busy, marketSlug]
  );

  useEffect(() => {
    if (!initialQuestion || !marketSlug) return;
    if (autoSubmittedKey.current === initialQuestionKey) return;
    autoSubmittedKey.current = initialQuestionKey;
    void send(initialQuestion);
  }, [initialQuestion, initialQuestionKey, marketSlug, send]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-300">
        <span>Private · Cited · Decision support</span>
        {marketSlug ? (
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
              Start with the decision in front of you.
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300">
              Pick one to fill the question box, then edit it. Every number is cited or marked as an
              estimate; you make the call.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {prompts.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => {
                  setInput(c.prompt);
                }}
                className="rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-left transition hover:border-white/20 hover:bg-white/[0.05] sm:p-4"
              >
                <div className="text-sm font-medium text-white">{c.title}</div>
                <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-slate-300 sm:line-clamp-none">{c.prompt}</p>
              </button>
            ))}
          </div>

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
                <MarkdownLite text={m.content} />
              ) : (
                <p className="text-sm text-slate-200">{m.content}</p>
              )}
              {m.sources && m.sources.length > 0 ? (
                <div className="mt-3 space-y-1.5 border-t border-white/[0.06] pt-3">
                  <div className="text-xs uppercase tracking-wider text-slate-300">Sources (open original)</div>
                  <SourceLinks links={m.sources} />
                </div>
              ) : null}
              {m.citations && m.citations.length > 0 ? (
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

      <form
        className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-white/[0.1] bg-[#2f333c]/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:static sm:z-auto sm:border-0 sm:bg-transparent sm:p-0"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Capital question…"
          className="min-w-0 flex-1 rounded-lg border border-white/20 bg-[#262a32] px-3 py-2.5 text-base text-white sm:text-sm placeholder:text-slate-400 focus:border-slate-400/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-slate-900"
        >
          Send
        </button>
      </form>
      <div aria-hidden className="h-16 sm:hidden" />

    </div>
  );
}
