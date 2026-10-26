import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { MobileMenu } from "./MobileMenu";

/** Primary nav. The footer mirrors these links and adds Tuesday Trends and the Trust Contract. */
const links = [
  { href: "/markets", label: "Markets" },
  { href: "/reits", label: "REITs" },
  { href: "/deals", label: "Deals" },
  { href: "/chat", label: "Chat" },
  { href: "/radars", label: "Radars" },
  { href: "/hard-assets", label: "Sound Assets" },
  { href: "/podcast", label: "Podcast" },
];

const linkCls =
  "rounded-md px-2.5 py-1.5 text-slate-200 transition hover:bg-white/[0.05] hover:text-white";

export async function Nav() {
  const { userId } = await auth();
  const mobileItems = userId
    ? [...links, { href: "/workspace", label: "Workspace" }, { href: "/account/org", label: "Account" }]
    : [...links, { href: "/login", label: "Sign in" }];

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#2f333c]/95 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href={userId ? "/workspace" : "/"} className="group flex shrink-0 items-center gap-2.5">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.08] text-xs font-semibold tracking-tight text-white ring-1 ring-white/15">
            B
          </span>
          <span className="whitespace-nowrap text-[15px] font-medium tracking-tight text-white">
            Bungah<span className="hidden lg:inline"> Capital Intel</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 text-sm md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkCls}>
              {l.label}
            </Link>
          ))}
          {userId ? (
            <>
              <Link href="/workspace" className={linkCls}>
                Workspace
              </Link>
              <Link href="/account/org" className={linkCls}>
                Account
              </Link>
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          {userId ? (
            <span className="inline-flex items-center">
              <UserButton appearance={clerkAppearance} userProfileMode="navigation" userProfileUrl="/account/org" />
            </span>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden whitespace-nowrap px-2 py-1.5 text-sm text-slate-300 hover:text-white md:inline"
              >
                Sign in
              </Link>
              <Link
                href="/chat"
                className="whitespace-nowrap rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-white"
              >
                Ask a capital question
              </Link>
            </>
          )}
          <MobileMenu items={mobileItems} />
        </div>
      </div>
    </header>
  );
}
