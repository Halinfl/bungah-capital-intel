import type { Metadata } from "next";
import Link from "next/link";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/Nav";
import { clerkAppearance } from "@/lib/clerk-appearance";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bungah Capital Intel",
  description:
    "Cited hotel capital intelligence for owners, investors, asset managers and developers: Capital Graph, Chat, Radars and Sound Asset Lodging.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#2f333c] font-sans text-slate-100 antialiased`}
      >
        <ClerkProvider appearance={clerkAppearance} afterSignOutUrl="/">
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(148,163,184,0.12),_transparent_60%)]" />
          <Nav />
          <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>
          <footer className="mx-auto max-w-6xl border-t border-white/[0.08] px-4 py-8 text-sm text-slate-300 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <div className="font-medium text-slate-100">Bungah Capital Intel</div>
                <div className="text-slate-300">Decision support for hotel capital. Every number cited; you make the call.</div>
              </div>
              <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
                <Link href="/tuesday-trends" className="text-slate-200 hover:text-white">
                  Tuesday Trends
                </Link>
                <Link href="/trust" className="text-slate-200 hover:text-white">
                  Trust Contract
                </Link>
                <Link href="/pricing" className="text-slate-200 hover:text-white">
                  Pricing
                </Link>
                <Link href="/podcast" className="text-slate-200 hover:text-white">
                  Podcast
                </Link>
                <Link href="/sound-money-lodging" className="text-slate-200 hover:text-white">
                  Sound Asset
                </Link>
              </nav>
            </div>
          </footer>
        </ClerkProvider>
      </body>
    </html>
  );
}
