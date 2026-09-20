"use client";

import Link from "next/link";
import { useState } from "react";
import { MarkdownLite } from "@/components/MarkdownLite";
import { SourceChip } from "@/components/SourceChip";

type Msg = {
  role: "user" | "assistant";
  content: string;
  citations?: string[];
};

const CAPITAL_PROMPTS = [
  {
    key: "deploy",
    title: "Deploy?",
    prompt:
      "Should we put capital into Orlando this cycle — and which Orlando/Vegas-class layer?",
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
      "Flag the demand, supply, debt, or talent gate most likely to break Las Vegas’s thesis.",
  },
] as const;

export function ChatClient() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const isEmpty = messages.length === 0;

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setBusy(true);
    setInput("");
    setMessages((m) => [...m, { role: "user", content: q }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Chat failed");
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.content, citations: data.citations ?? [] },
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
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Quiet status row — always, before thread */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
        <span>Private graph</span>
        <span className="text-slate-700">·</span>
        <span>Cited answers</span>
        <span className="text-slate-700">·</span>
        <span>Propose-only</span>
        <span className="text-slate-700">·</span>
        <Link href="/trust" className="text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline">
          Trust Contract
        </Link>
      </div>

      {isEmpty ? (
        <div className="space-y-5 rounded-xl border border-white/[0.08] bg-[#0a0e13] p-5 sm:p-6">
          <div className="space-y-2">
            <h2 className="text-lg font-medium tracking-tight text-white">
              Ideate on capital here — we don’t execute.
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-slate-400">
              Private to your workspace. Numbers cited or marked estimate. You ship judgment.
            </p>
          </div>

          {/* Three equal capital cards — not chip rail */}
          <div className="grid gap-3 sm:grid-cols-3">
            {CAPITAL_PROMPTS.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => {
                  setInput(c.prompt);
                }}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-left transition hover:border-white/15 hover:bg-white/[0.04]"
              >
                <div className="text-sm font-medium text-white">{c.title}</div>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{c.prompt}</p>
              </button>
            ))}
          </div>

          <p className="text-xs leading-relaxed text-slate-500">
            Propose-only · citations required · not booking · not meeting-sourcing.{" "}
            <Link href="/trust" className="text-slate-400 underline-offset-2 hover:underline">
              Trust Contract
            </Link>
          </p>
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
        className="flex gap-2"
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

      <div className="sticky bottom-3 rounded-lg border border-white/[0.08] bg-[#0c1016]/95 px-4 py-3 text-xs leading-relaxed text-slate-400 backdrop-blur">
        <span className="font-medium text-slate-300">Propose-only.</span> Number / so-what →
        citations → human Approve / Edit / Dismiss. No auto-executing capital.
      </div>
    </div>
  );
}
