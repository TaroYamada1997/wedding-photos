import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
    dirs: ['src'],
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  // Enable static export for Amplify
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
}

export default nextConfig;
