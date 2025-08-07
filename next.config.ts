import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Standard Next.js for Vercel
  experimental: {
    serverComponentsExternalPackages: ['@aws-sdk/client-s3', '@prisma/client'],
  },
}

export default nextConfig;
