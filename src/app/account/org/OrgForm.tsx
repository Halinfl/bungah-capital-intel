"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const ROLES = ["Owner", "Brand", "AM", "Developer", "CVB"] as const;

export function OrgForm() {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [orgRole, setOrgRole] = useState<(typeof ROLES)[number]>("Owner");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgName, orgRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      router.push(data.next || "/workspace");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-xs text-slate-500">Org name</span>
        <input
          type="text"
          required
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-white/25"
          placeholder="Acme Hospitality"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-xs text-slate-500">Your role</span>
        <select
          value={orgRole}
          onChange={(e) => setOrgRole(e.target.value as (typeof ROLES)[number])}
          className="w-full rounded-lg border border-white/10 bg-[#0a0e13] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-white/25"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
      <p className="text-sm text-slate-500">1 of 20 seats used</p>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-white disabled:opacity-60"
      >
        {busy ? "Creating…" : "Create org workspace"}
      </button>
      <p className="text-xs text-slate-500">
        Seats don’t unlock booking writes or spam outreach. Billing Phase 1b — chrome preview only.
      </p>
    </form>
  );
}
