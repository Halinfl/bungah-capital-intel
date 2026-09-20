import type { Metadata } from "next";
import Link from "next/link";
import { PricingTiers } from "@/components/PricingTiers";

export const metadata: Metadata = {
  title: "Pricing · Bungah Capital Intel",
  description:
    "Free, Pro $10/mo, Company $100/mo for 20 seats. Propose-only hospitality capital intelligence.",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
          Plans
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Pricing</h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-slate-400">
          Free to try the public Capital Graph. Pro for private workspace and Briefs. Company for
          shared org seats — up to 20. No SOC2 theater; Trust Contract first.
        </p>
        <p className="text-sm text-slate-500">
          <Link href="/trust" className="text-slate-300 underline-offset-2 hover:underline">
            Trust Contract
          </Link>
          {" · "}
          chrome mock — auth Phase 1, Stripe later
        </p>
      </div>

      <PricingTiers compactHeading />
    </div>
  );
}
