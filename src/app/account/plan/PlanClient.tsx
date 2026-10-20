"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Plan } from "@/lib/workspace-profile";

const tiers: {
  id: Plan;
  label: string;
  price: string;
  period: string;
  forWhom: string;
  includes: string[];
  cta: string;
}[] = [
  {
    id: "free",
    label: "Free",
    price: "$0",
    period: "forever",
    forWhom: "Private graph (limited) · rate-limited chat · view Sound Asset Lodging",
    includes: ["Private workspace (limited)", "Chat rate-limited", "Sound Asset Lodging view"],
    cta: "Stay free",
  },
  {
    id: "pro",
    label: "Pro",
    price: "$10",
    period: "/ month",
    forWhom: "Private full graph · full IC whiteboard · download Sound Asset Lodging memos",
    includes: ["Private Capital Graph full", "Full Chat IC whiteboard", "Download / share Sound Asset Lodging memos"],
    cta: "Upgrade to Pro",
  },
  {
    id: "company",
    label: "Company",
    price: "$100",
    period: "/ month · ≤20 seats",
    forWhom: "Shared org graph · invites ≤20 · shared vault",
    includes: ["Shared org Capital Graph", "Full + shared chat", "Invites ≤20"],
    cta: "Start Company",
  },
];

export function PlanClient({ currentPlan }: { currentPlan: Plan }) {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const [busy, setBusy] = useState<Plan | null>(null);

  async function choose(plan: Plan) {
    setBusy(plan);
    setToast(null);
    try {
      if (plan === "company") {
        router.push("/account/org");
        return;
      }
      if (plan === "pro") {
        const res = await fetch("/api/auth/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: "pro", waitlist: true }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        setToast(data.message || "Billing opens soon — you're on the waitlist. No charge.");
        return;
      }
      const res = await fetch("/api/auth/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "free" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setToast(data.message || "Staying on Free.");
      router.refresh();
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="rounded-lg border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
          {toast}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        {tiers.map((tier) => {
          const active = currentPlan === tier.id;
          return (
            <div
              key={tier.id}
              className={`flex flex-col rounded-xl bg-white/[0.02] p-5 ${
                tier.id === "pro"
                  ? "border border-slate-400/35 ring-1 ring-slate-400/15"
                  : "border border-white/[0.08]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-medium text-white">{tier.label}</h3>
                {active ? (
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-emerald-300/90">
                    Current
                  </span>
                ) : null}
              </div>
              <p className="mt-2">
                <span className="text-2xl font-semibold tracking-tight text-white tabular-nums">
                  {tier.price}
                </span>
                <span className="ml-1 text-sm text-slate-500">{tier.period}</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{tier.forWhom}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-300">
                {tier.includes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={busy !== null || (active && tier.id === "free")}
                onClick={() => choose(tier.id)}
                className={`mt-5 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  tier.id === "pro"
                    ? "bg-slate-100 text-slate-900 hover:bg-white disabled:opacity-50"
                    : "border border-white/10 text-slate-300 hover:border-white/20 hover:text-white disabled:opacity-50"
                }`}
              >
                {busy === tier.id ? "…" : active && tier.id !== "pro" ? "Current plan" : tier.cta}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        Billing opens soon; you won&apos;t be charged until it does.{" "}
        <Link href="/workspace" className="text-slate-400 underline-offset-2 hover:underline">
          Back to workspace
        </Link>
      </p>
    </div>
  );
}
