"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ArtifactStudio({
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
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <label className="flex flex-col gap-1 text-xs text-slate-400">
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
        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400 disabled:opacity-50"
      >
        {busy ? "Generating…" : "Generate IC one-pager"}
      </button>
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </div>
  );
}
