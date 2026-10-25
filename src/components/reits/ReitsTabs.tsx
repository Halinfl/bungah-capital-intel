import Link from "next/link";

/** Sub-nav inside the REITs section. Tabs only appear for sections that have content. */
export function ReitsTabs({ active, tabs }: { active: string; tabs: { key: string; href: string; label: string }[] }) {
  return (
    <nav aria-label="REITs sections" className="border-b border-white/10">
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
