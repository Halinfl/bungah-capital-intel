import type { NextConfig } from "next";
import publishStatus from "./src/data/sound-assets/publish-status.json";

/**
 * Production gate for the Sound Assets section. Vercel sets VERCEL_ENV=production only for production
 * builds; previews and local builds pass. A production build refuses to start while the bitcoin holdings
 * disclosure is still the placeholder or any page still carries DRAFT markers.
 */
const isProdBuild = process.env.VERCEL_ENV === "production" || process.env.BUNGAH_RELEASE === "production";
if (isProdBuild) {
  const problems: string[] = [];
  if (!publishStatus.holdings_disclosure) problems.push("holdings disclosure is still the placeholder");
  if (publishStatus.drafts) problems.push("DRAFT markers are still on (drafts: true)");
  if (problems.length) {
    throw new Error(
      `Production build blocked by src/data/sound-assets/publish-status.json: ${problems.join("; ")}. ` +
        "Clear these (Hal approves the final preview, then set drafts to false) before production.",
    );
  }
}

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/briefs", destination: "/sound-money-lodging", permanent: true },
      { source: "/briefs/:path*", destination: "/sound-money-lodging", permanent: true },
      { source: "/artifacts", destination: "/sound-money-lodging", permanent: true },
      { source: "/artifacts/:path*", destination: "/sound-money-lodging", permanent: true },
      { source: "/stack", destination: "/sound-money-lodging", permanent: true },
    ];
  },
  // content/ also copied into src/generated/allowed-corpus.json at build (corpus:embed).
  // Keep tracing as belt-and-suspenders for any direct fs reads.
  outputFileTracingIncludes: {
    "/api/chat": ["./content/**/*"],
  },
};

export default nextConfig;
