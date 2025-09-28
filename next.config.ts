import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://webapp.et:5201/4447673/run/:path*',
      },
    ];
  },
  // For development, you might need to add this to bypass SSL verification
  // Only use this in development
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // For development only - disable HTTPS requirement for API routes
  // Remove this in production
  webpack: (config, { isServer, dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        // @ts-ignore
        ignored: ['**/node_modules', '**/.next'],
        poll: 1000,
        aggregateTimeout: 200,
      };
    }
    return config;
  },
};

const pwaConfig = withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
});

export default pwaConfig(nextConfig);
