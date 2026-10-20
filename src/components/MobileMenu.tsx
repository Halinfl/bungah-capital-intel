"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Item = { href: string; label: string };

/** Mobile-only menu button + sheet. Closes on route change and on Escape. */
export function MobileMenu({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-slate-100 hover:bg-white/[0.06]"
      >
        <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          {open ? (
            <path strokeLinecap="round" d="M5 5l10 10M15 5L5 15" />
          ) : (
            <path strokeLinecap="round" d="M3 6h14M3 10h14M3 14h14" />
          )}
        </svg>
      </button>
      {open ? (
        <nav
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-b border-white/10 bg-[#2f333c] px-4 pb-4 pt-2 shadow-lg"
        >
          <ul className="flex flex-col">
            {items.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`block rounded-md px-2 py-3 text-base ${
                    pathname === l.href ? "text-white" : "text-slate-200"
                  } hover:bg-white/[0.05]`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
