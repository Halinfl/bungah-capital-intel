import Link from "next/link";

const links = [
  { href: "/markets", label: "Markets" },
  { href: "/radars", label: "Radars" },
  { href: "/chat", label: "Chat" },
  { href: "/artifacts", label: "Artifacts" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0f14]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="group flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/15 text-sm font-bold text-emerald-300 ring-1 ring-emerald-400/30">
            B
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight text-white group-hover:text-emerald-200">
              Bungah Capital Intel
            </div>
            <div className="text-[11px] text-slate-400">Hospitality capital · build in public</div>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-slate-300 hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
          <span className="ml-2 hidden rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-slate-400 sm:inline">
            propose-only
          </span>
        </nav>
      </div>
    </header>
  );
}
