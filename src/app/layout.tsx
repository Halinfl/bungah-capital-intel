import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/Nav";
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
    "Hospitality capital intelligence — Capital Graph, Radars, Briefs, Chat. Propose-only. Citations required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#070a0e] font-sans text-slate-100 antialiased`}
      >
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(148,163,184,0.06),_transparent_55%)]" />
        <Nav />
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <footer className="mx-auto max-w-6xl border-t border-white/[0.06] px-4 py-8 text-xs text-slate-500">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <div className="text-slate-400">Bungah Capital Intel</div>
              <div>Propose-only · citations required · not booking · not meeting-sourcing</div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/trust" className="text-slate-400 hover:text-slate-200">
                Trust Contract
              </Link>
              <Link href="/podcast" className="text-slate-400 hover:text-slate-200">
                Podcast
              </Link>
              <Link href="/briefs" className="text-slate-400 hover:text-slate-200">
                Briefs
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
