"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RunRadarsButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/radars/run", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMsg(`Wrote ${data.count} findings`);
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      {msg ? <span className="text-xs text-slate-400">{msg}</span> : null}
      <button
        type="button"
        onClick={run}
        disabled={busy}
        className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 disabled:opacity-50"
      >
        {busy ? "Running…" : "Run radars"}
      </button>
    </div>
  );
}
