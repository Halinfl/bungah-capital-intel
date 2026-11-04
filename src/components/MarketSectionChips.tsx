type Chip = { href: string; label: string } | null;

/** Sticky in-page jump row under the site header; only chips whose sections exist. 44px tap targets. */
export function MarketSectionChips({ items }: { items: Chip[] }) {
  const chips = items.filter((c): c is { href: string; label: string } => !!c);
  if (chips.length < 2) return null;
  return (
    <nav aria-label="On this page" className="sticky top-[69px] z-30 -mx-4 border-b border-white/[0.08] bg-[#2f333c]/95 px-4 backdrop-blur-md sm:-mx-6 sm:px-6">
      <ul className="flex gap-2 overflow-x-auto py-1">
        {chips.map((c) => (
          <li key={c.href} className="shrink-0">
            <a
              href={c.href}
              className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-4 text-sm text-slate-200 hover:border-white/40 hover:text-white"
            >
              {c.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
