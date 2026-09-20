import Link from "next/link";

/** Primary nav — Silvia lock. Trust lives in footer only. Deals/Talent off until Hal ships. */
const links = [
  { href: "/markets", label: "Markets" },
  { href: "/chat", label: "Chat" },
  { href: "/radars", label: "Radars" },
  { href: "/briefs", label: "Briefs" },
  { href: "/podcast", label: "Podcast" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#070a0e]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.06] text-xs font-semibold tracking-tight text-slate-200 ring-1 ring-white/10">
            B
          </span>
          <div className="leading-tight">
            <div className="text-sm font-medium tracking-tight text-slate-100 group-hover:text-white">
              Bungah Capital Intel
            </div>
            <div className="text-[11px] text-slate-500">Hospitality capital intelligence</div>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-0.5 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-2.5 py-1.5 text-slate-400 transition hover:bg-white/[0.04] hover:text-slate-100"
            >
              {l.label}
            </Link>
          ))}
          <span className="ml-2 hidden rounded-full border border-white/[0.08] px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-500 sm:inline">
            propose-only
          </span>
        </nav>
      </div>
    </header>
  );
}
