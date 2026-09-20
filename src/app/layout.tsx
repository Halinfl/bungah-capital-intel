import type { Metadata } from "next";
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
    "Silvia-style hospitality capital intelligence — Capital Graph, Radars, Chat, Artifacts. Propose-only. Build in public.",
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
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.12),_transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(56,189,248,0.08),_transparent_40%)]" />
        <Nav />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-6xl border-t border-white/10 px-4 py-8 text-xs text-slate-500">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>Bungah Capital Intel · propose-only · citations required</span>
            <span>Not booking. Not meeting sourcing. Build in public.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
