import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tcoqhpyxmulrmshqjhte.supabase.co",
      },
    ],
  },
};

export default nextConfig;
