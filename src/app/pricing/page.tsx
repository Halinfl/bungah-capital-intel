import type { Metadata } from "next";
import Link from "next/link";
import { PricingTiers } from "@/components/PricingTiers";

export const metadata: Metadata = {
  title: "Pricing · Bungah Capital Intel",
  description:
    "Free, Pro $10/mo, Company $100/mo for up to 20 seats. Cited hotel capital intelligence.",
};

export default function PricingPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-400">
          Plans
        </p>
        <h1 className="t-h1">Pricing</h1>
        <p className="max-w-2xl t-lead">
          Free to try the public Capital Graph. Pro for a private workspace. Company for shared
          seats, up to 20.
        </p>
        <p className="text-sm text-slate-400">
          <Link href="/trust" className="text-slate-300 underline-offset-2 hover:underline">
            Trust Contract
          </Link>
          {" · "}
          <Link href="/signup" className="text-slate-300 underline-offset-2 hover:underline">
            Start free
          </Link>
        </p>
      </div>

      <PricingTiers compactHeading />
    </div>
  );
}
