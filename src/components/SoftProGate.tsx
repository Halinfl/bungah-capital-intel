"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "bungah_pro_gate_dismissed";

/** Soft Pro upsell — dismissible after auth (Eric QA). */
export function SoftProGate() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && !window.localStorage.getItem(KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
      <p>Go Pro for downloadable Sound Asset Lodging memos and higher chat limits — billing Phase 1b.</p>
      <div className="flex shrink-0 items-center gap-3">
        <Link
          href="/account/plan"
          className="text-slate-300 underline-offset-2 hover:text-white hover:underline"
        >
          See plans
        </Link>
        <button
          type="button"
          onClick={dismiss}
          className="text-slate-500 hover:text-slate-300"
          aria-label="Dismiss Pro upsell"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
