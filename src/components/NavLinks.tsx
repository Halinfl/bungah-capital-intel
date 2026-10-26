"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string };

const linkCls = "rounded-md px-2.5 py-1.5 transition hover:bg-white/[0.05] hover:text-white";

/** Desktop primary nav links with an active state (aria-current="page") for the current section. */
export function NavLinks({ items }: { items: Item[] }) {
  const pathname = usePathname() ?? "";
  return (
    <>
      {items.map((l) => {
        const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`${linkCls} ${active ? "bg-white/[0.08] text-white" : "text-slate-200"}`}
          >
            {l.label}
          </Link>
        );
      })}
    </>
  );
}
