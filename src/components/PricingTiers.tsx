import Link from "next/link";

/**
 * Pricing — Free · Pro $10/mo · Company $100/mo (20 seats).
 * CTAs → /signup.
 */

const tiers = [
  {
    id: "free",
    label: "Free",
    price: "$0",
    period: "",
    forWhom: "Try the public Capital Graph",
    includes: [
      "Capital Graph: market search, every figure cited",
      "Chat: cited answers (rate-limited)",
      "Radars: public market monitors",
      "Sound Asset Lodging: guide and calculators",
    ],
    notIncluded: "Private workspace graph · shared org seats · downloadable Sound Asset Lodging memos",
    cta: "Start free",
    href: "/signup",
    highlight: false,
  },
  {
    id: "pro",
    label: "Pro",
    price: "$10",
    period: "/ month",
    forWhom: "Owner, asset manager, or brand lead working alone",
    includes: [
      "Everything in Free",
      "Private Capital Graph workspace",
      "Full Chat IC whiteboard (Deploy / Hold / Flag) with higher limits",
      "Forwardable Sound Asset Lodging memos (download / share)",
    ],
    notIncluded: null,
    cta: "Go Pro",
    href: "/signup",
    highlight: true,
  },
  {
    id: "company",
    label: "Company",
    price: "$100",
    period: "/ month · up to 20 seats",
    forWhom: "Brand, owner, and asset-management teams who need one shared picture",
    includes: [
      "Everything in Pro",
      "Shared org Capital Graph",
      "Seat invites (up to 20)",
      "Shared Sound Asset Lodging memos",
    ],
    notIncluded: null,
    cta: "Start Company",
    href: "/signup",
    highlight: false,
  },
] as const;

type PricingTiersProps = {
  /** When true, omit outer section heading (dedicated /pricing page supplies its own). */
  compactHeading?: boolean;
};

export function PricingTiers({ compactHeading = false }: PricingTiersProps) {
  return (
    <section id="pricing" className="scroll-mt-20 space-y-5">
      {!compactHeading ? (
        <div className="space-y-1">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
            Pricing
          </h2>
          <p className="text-sm text-slate-400">
            Start free. Upgrade when you need a private workspace or shared seats.
          </p>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            id={tier.id}
            className={`flex flex-col rounded-xl bg-white/[0.02] p-5 ${
              tier.highlight
                ? "border border-slate-400/35 ring-1 ring-slate-400/15"
                : "border border-white/[0.08]"
            }`}
          >
            <h3 className="text-base font-medium text-white">{tier.label}</h3>
            <p className="mt-2">
              <span className="text-2xl font-semibold tracking-tight text-white tabular-nums">
                {tier.price}
              </span>
              {tier.period ? (
                <span className="ml-1 text-sm text-slate-500">{tier.period}</span>
              ) : (
                <span className="ml-1 text-sm text-slate-500">forever</span>
              )}
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
            {tier.notIncluded ? (
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                Not included: {tier.notIncluded}
              </p>
            ) : null}
            <Link
              href={tier.href}
              className={`mt-5 block rounded-lg px-4 py-2.5 text-center text-sm font-medium transition ${
                tier.highlight
                  ? "bg-slate-100 text-slate-900 hover:bg-white"
                  : "border border-white/10 text-slate-300 hover:border-white/20 hover:text-white"
              }`}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>

      <p className="text-sm leading-relaxed text-slate-300">
        Billing opens soon; you won&apos;t be charged until it does.
      </p>
    </section>
  );
}
