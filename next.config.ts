import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kawniuxdmfabuumufczj.supabase.co",
      },
    ],
  },
};

export default nextConfig;