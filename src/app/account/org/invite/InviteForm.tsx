"use client";

import { useState } from "react";

export function InviteForm({
  remaining,
  seatsMax,
}: {
  remaining: number;
  seatsMax: number;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"Member" | "Admin">("Member");
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [left, setLeft] = useState(remaining);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setLink(null);
    try {
      const res = await fetch("/api/auth/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invite failed");
      const full =
        typeof window !== "undefined" ? `${window.location.origin}${data.invitePath}` : data.invitePath;
      setLink(full);
      setNote(data.note || null);
      setLeft(data.remaining ?? left - 1);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invite failed");
    } finally {
      setBusy(false);
    }
  }

  async function copyLink() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setNote("Invite link copied.");
    } catch {
      setNote("Copy failed — select the link manually.");
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-300">
        Remaining seats: {left} of {seatsMax}
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-xs text-slate-400">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-white/25"
            placeholder="colleague@firm.com"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs text-slate-400">Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "Member" | "Admin")}
            className="w-full rounded-lg border border-white/10 bg-[#262a32] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-white/25"
          >
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
        </label>
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={busy || left <= 0}
            className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-white disabled:opacity-60"
          >
            {busy ? "Sending…" : "Send invite"}
          </button>
          {link ? (
            <button
              type="button"
              onClick={copyLink}
              className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:border-white/20 hover:text-white"
            >
              Copy invite link
            </button>
          ) : null}
        </div>
      </form>
      {note ? <p className="text-sm text-slate-300">{note}</p> : null}
      {link ? (
        <p className="break-all rounded-lg border border-dashed border-white/[0.1] bg-white/[0.02] px-3 py-2 text-xs text-slate-300">
          {link}
        </p>
      ) : null}
    </div>
  );
}
