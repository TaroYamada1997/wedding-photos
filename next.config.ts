import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Exclude server-side code
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@aws-sdk/**/*',
        'node_modules/@prisma/**/*',
        'node_modules/@supabase/**/*',
        'node_modules/prisma/**/*',
      ],
    },
  },
}

export default nextConfig;
