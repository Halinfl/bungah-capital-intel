import Link from "next/link";

const TABS = [
  { href: "/deals", label: "Recent Deals", key: "index" },
  { href: "/deals/methodology", label: "Methodology", key: "methodology" },
] as const;

export function DealsSubnav({ active }: { active: "index" | "methodology" | "entry" }) {
  return (
    <nav aria-label="Recent Deals" className="flex gap-1 border-b border-white/10 text-sm">
      {TABS.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          aria-current={active === t.key ? "page" : undefined}
          className={`-mb-px border-b-2 px-3 py-2 ${active === t.key ? "border-slate-200 text-white" : "border-transparent text-slate-300 hover:text-white"}`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
