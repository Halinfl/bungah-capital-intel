import Link from "next/link";

/** Two-tab sub-nav shared by the markets index and the Tuesday Trends board. */
export function MarketsTabs({ active }: { active: "markets" | "tuesday-trends" }) {
  const tabs = [
    { key: "markets", href: "/markets", label: "Markets" },
    { key: "tuesday-trends", href: "/tuesday-trends", label: "Tuesday Trends" },
  ] as const;
  return (
    <nav aria-label="Markets sections" className="border-b border-white/10">
      <ul className="-mb-px flex gap-6 text-sm">
        {tabs.map((t) => {
          const on = t.key === active;
          return (
            <li key={t.key}>
              <Link
                href={t.href}
                aria-current={on ? "page" : undefined}
                className={`inline-block border-b-2 pb-2.5 pt-1 font-medium transition-colors ${
                  on ? "border-white text-white" : "border-transparent text-slate-300 hover:border-white/30 hover:text-white"
                }`}
              >
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
