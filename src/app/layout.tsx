import type { Metadata } from "next";
import Link from "next/link";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/Nav";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { SITE_URL } from "@/lib/seo";
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
  // Each indexable page sets its own title, description and alternates.canonical; og:title and
  // og:description are filled from them by Next.
  metadataBase: new URL(SITE_URL),
  openGraph: { siteName: "Bungah Capital Intel", type: "website", locale: "en_US" },
  title: "Bungah Capital Intel",
  description:
    "Cited hotel capital intelligence for owners, investors, asset managers and developers: Capital Graph, Chat, Radars, Sound Assets and Sound Asset Lodging.",
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
              <div className="font-medium text-slate-100">Bungah Capital Intel</div>
              <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
                {[
                  ["/markets", "Markets"],
                  ["/reits", "REITs"],
                  ["/chat", "Chat"],
                  ["/radars", "Radars"],
                  ["/hard-assets", "Sound Assets"],
                  ["/podcast", "Podcast"],
                  ["/tuesday-trends", "Tuesday Trends"],
                  ["/trust", "Trust Contract"],
                  ["/errata", "Errata"],
                  ["/sponsorship-policy", "Sponsorship policy"],
                ].map(([href, label]) => (
                  <Link key={href} href={href} className="text-slate-200 hover:text-white">
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </footer>
        </ClerkProvider>
      </body>
    </html>
  );
}
