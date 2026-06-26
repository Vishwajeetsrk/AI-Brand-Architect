import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@nexora/shared"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
