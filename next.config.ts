import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
    dirs: ['src'],
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  experimental: {
    // Reduce bundle size for Edge Runtime
    serverComponentsExternalPackages: ['@aws-sdk/client-s3', '@supabase/supabase-js'],
  },
  // Ensure webpack can handle AWS SDK and Supabase
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle these server-only packages on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}

export default nextConfig;
