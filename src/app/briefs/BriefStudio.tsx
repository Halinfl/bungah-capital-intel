"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function BriefStudio({
  markets,
  initialSlug,
}: {
  markets: { slug: string; name: string }[];
  initialSlug: string;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState(initialSlug || markets[0]?.slug || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!slug) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/artifacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketSlug: slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
      <label className="flex flex-col gap-1 text-xs text-slate-500">
        Market
        <select
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="rounded-lg border border-white/15 bg-[#0b0f14] px-3 py-2 text-sm text-white"
        >
          {markets.map((m) => (
            <option key={m.slug} value={m.slug}>
              {m.name}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={generate}
        disabled={busy || !slug}
        className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white disabled:opacity-50"
      >
        {busy ? "Generating…" : "Generate IC one-pager"}
      </button>
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </div>
  );
}
