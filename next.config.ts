import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
    dirs: ['src'],
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig;
