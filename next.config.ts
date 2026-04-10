import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kawniuxdmfabuumufczj.supabase.co",
      },
       {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // ✅ Google avatar
      },
      {
        protocol: "https",
        hostname: "*.supabase.co", // ✅ Supabase images
      },
    ],
  },
};

export default nextConfig;