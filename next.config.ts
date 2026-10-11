import type { NextConfig } from "next";

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
