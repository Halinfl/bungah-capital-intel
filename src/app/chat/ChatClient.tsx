"use client";

import { useState } from "react";
import { MarkdownLite } from "@/components/MarkdownLite";
import { SourceChip } from "@/components/SourceChip";

type Msg = {
  role: "user" | "assistant";
  content: string;
  citations?: string[];
};

const SUGGESTIONS = [
  "Which Orlando is scarce?",
  "Vegas visitation softness",
  "Compare Orlando and Vegas",
  "National debt wall",
  "Talent greenlight",
  "What are the radars watching?",
];

export function ChatClient() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Ask the **Bungah Capital Intel** graph about Orlando, Las Vegas, debt wall, talent, or radars. Answers are rule-based retrieval over seed data with citations.",
      citations: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

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
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 hover:border-emerald-500/40 hover:text-white"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="min-h-[320px] space-y-4 rounded-xl border border-white/10 bg-black/20 p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-lg p-3 ${
              m.role === "user" ? "ml-8 bg-emerald-500/10 border border-emerald-500/20" : "mr-4 bg-white/[0.04] border border-white/10"
            }`}
          >
            <div className="mb-1 text-[10px] uppercase tracking-wider text-slate-500">
              {m.role === "user" ? "You" : "Bungah Capital Intel"}
            </div>
            {m.role === "assistant" ? (
              <MarkdownLite text={m.content} />
            ) : (
              <p className="text-sm text-slate-200">{m.content}</p>
            )}
            {m.citations && m.citations.length > 0 ? (
              <div className="mt-3 flex flex-col gap-1.5">
                {m.citations.map((c, j) => (
                  <SourceChip key={j} label={c} />
                ))}
              </div>
            ) : null}
          </div>
        ))}
        {busy ? <p className="text-xs text-slate-500">Retrieving from graph…</p> : null}
      </div>

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
          placeholder="Ask about Orlando scarcity, Vegas softness, debt wall…"
          className="flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
