import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/artifacts", destination: "/briefs", permanent: true },
      { source: "/artifacts/:path*", destination: "/briefs", permanent: true },
    ];
  },
};

export default nextConfig;
