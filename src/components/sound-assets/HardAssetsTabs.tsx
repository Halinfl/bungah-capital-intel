import Link from "next/link";

const TABS = [
  { key: "thesis", href: "/hard-assets", label: "Thesis" },
  { key: "scorecard", href: "/hard-assets/scorecard", label: "Scorecard" },
  { key: "evidence", href: "/hard-assets/evidence", label: "Evidence" },
  { key: "methodology", href: "/hard-assets/methodology", label: "Methodology" },
] as const;

/** Section header + sub-nav for /hard-assets. Tabs appear only for sections that have content. */
export function HardAssetsTabs({ active }: { active: (typeof TABS)[number]["key"] }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wider text-slate-300">Sound Assets</div>
      <nav aria-label="Sound Assets sections" className="mt-2 overflow-x-auto border-b border-white/10">
        <ul className="-mb-px flex gap-6 text-sm">
          {TABS.map((t) => {
            const on = t.key === active;
            return (
              <li key={t.key} className="shrink-0">
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
    </div>
  );
}
