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
};

export default nextConfig;
