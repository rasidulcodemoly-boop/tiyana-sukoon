import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during production build so warning/unused vars don't block release
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Typecheck is active
    ignoreBuildErrors: false,
  },
  images: {
    // unoptimized: true serves artwork directly from Vercel Edge CDN & Supabase Storage CDN.
    // This eliminates Vercel serverless image optimization cold start timeouts (504s),
    // concurrency bottlenecks, and rate limits that caused images to appear broken.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
      },
    ],
  },
};

export default nextConfig;
