"use client";

import { useAuth } from "@clerk/nextjs";
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

const FREE_MARKETS_KEY = "bungah_chat_free_markets";

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

function readUsedMarkets(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = sessionStorage.getItem(FREE_MARKETS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function markMarketUsed(slug: string) {
  if (typeof window === "undefined" || !slug) return;
  const used = readUsedMarkets();
  used.add(slug);
  sessionStorage.setItem(FREE_MARKETS_KEY, JSON.stringify([...used]));
}

export function ChatClient() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
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
  const autoSubmittedKey = useRef<string | null>(null);
  const prompts = useMemo(() => capitalPrompts(marketSlug), [marketSlug]);

  const isEmpty = messages.length === 0;

  // Fresh thread whenever marketSlug / initialQuestionKey changes so a prior
  // auto-ask does not burn Q2 of another market CTA.
  useEffect(() => {
    if (threadKeyRef.current === initialQuestionKey) return;
    threadKeyRef.current = initialQuestionKey;
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

      const allowanceKey = marketSlug || "__general__";

      // Unsigned: one free answered question per marketSlug (or general) per
      // browser session. Follow-up in the same market → signup CTA. A different
      // market CTA gets its own free answer. Signed-in: unlimited.
      if (authLoaded && !isSignedIn) {
        const used = readUsedMarkets();
        if (used.has(allowanceKey)) {
          setMessages((m) => [
            ...m,
            { role: "user", content: q },
            {
              role: "assistant",
              content:
                "You've used the free answer for this market in this browser session. Create an account to keep working with the Capital Graph: [Create an account](/signup)\n\n_Decision support:_ your judgment stays in control; no capital action is taken here.",
              citations: [],
            },
          ]);
          setBusy(false);
          return;
        }
      }

      setMessages((m) => [...m, { role: "user", content: q }]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: q,
            marketSlug: marketSlug || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Chat failed");
        if (authLoaded && !isSignedIn) {
          markMarketUsed(allowanceKey);
        }
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.content, citations: data.citations ?? [], sources: data.sources ?? [] },
        ]);
      } catch (e) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: e instanceof Error ? e.message : "Error",
            citations: [],
          },
        ]);
      } finally {
        setBusy(false);
      }
    },
    [authLoaded, busy, isSignedIn, marketSlug]
  );

  useEffect(() => {
    if (!initialQuestion || !marketSlug) return;
    if (autoSubmittedKey.current === initialQuestionKey) return;
    // Wait for auth so free-allowance check is accurate before auto-ask.
    if (!authLoaded) return;
    autoSubmittedKey.current = initialQuestionKey;
    void send(initialQuestion);
  }, [authLoaded, initialQuestion, initialQuestionKey, marketSlug, send]);

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
        <div className="min-h-[280px] space-y-4 rounded-xl border border-white/[0.08] bg-[#0a0e13] p-4 sm:p-5">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-lg border p-3.5 ${
                m.role === "user"
                  ? "ml-6 border-white/10 bg-white/[0.04]"
                  : "mr-2 border-white/[0.06] bg-transparent"
              }`}
            >
              <div className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
                {m.role === "user" ? "You" : "Memo · Bungah Capital Intel"}
              </div>
              {m.role === "assistant" ? (
                <MarkdownLite text={m.content} />
              ) : (
                <p className="text-sm text-slate-200">{m.content}</p>
              )}
              {m.sources && m.sources.length > 0 ? (
                <div className="mt-3 space-y-1.5 border-t border-white/[0.06] pt-3">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">Sources (open original)</div>
                  <SourceLinks links={m.sources} />
                </div>
              ) : null}
              {m.citations && m.citations.length > 0 ? (
                <div className="mt-3 flex flex-col gap-1.5 border-t border-white/[0.06] pt-3">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">Citations</div>
                  {m.citations.map((c, j) => (
                    <SourceChip key={j} label={c} />
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          {busy ? <p className="text-xs text-slate-500">Retrieving from graph…</p> : null}
        </div>
      )}

      <form
        className="sticky bottom-0 z-10 -mx-4 flex gap-2 border-t border-white/[0.08] bg-[#2f333c]/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Capital question…"
          className="flex-1 rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-slate-400/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white disabled:opacity-50"
        >
          Send
        </button>
      </form>

    </div>
  );
}
