import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found · Bungah Capital Intel", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl space-y-4 py-16 text-center" data-testid="not-found">
      <h1 className="t-h1">Page not found</h1>
      <p className="t-lead">That page doesn&apos;t exist or has moved.</p>
      <div className="flex flex-wrap justify-center gap-3 text-sm">
        <Link href="/" className="underline underline-offset-2">Home</Link>
        <Link href="/markets" className="underline underline-offset-2">Markets</Link>
        <Link href="/reits" className="underline underline-offset-2">REITs</Link>
        <Link href="/deals" className="underline underline-offset-2">Recent deals</Link>
      </div>
    </div>
  );
}
