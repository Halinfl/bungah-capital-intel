"use client";

import Link from "next/link";
import { useEffect } from "react";

/** Route-level error boundary: friendly page instead of a bare 500 (header/nav from the root layout stay up). */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[route-error]", error.digest ?? "", error.message);
  }, [error]);
  return (
    <div className="mx-auto max-w-xl space-y-4 py-16 text-center" data-testid="route-error">
      <h1 className="t-h1">This page hit a snag</h1>
      <p className="t-lead">
        Something went wrong loading this page. It is usually temporary, often while market data reconnects.
      </p>
      <div className="flex justify-center gap-3">
        <button
          onClick={() => reset()}
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white"
        >
          Try again
        </button>
        <Link href="/" className="rounded-lg border border-white/25 px-4 py-2 text-sm text-slate-100 hover:bg-white/5">
          Home
        </Link>
      </div>
      {error.digest ? <p className="text-xs text-slate-400">Reference: {error.digest}</p> : null}
    </div>
  );
}
