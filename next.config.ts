
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // output: 'export', // ✅ This line is THE KEY for static export builds
  // output: 'export', // Temporarily commented to enable server-side features for Genkit

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Add this line to disable image optimization for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: [
    "https://6000-firebase-studio-1749697659574.cluster-duylic2g3fbzerqpzxxbw6helm.cloudworkstations.dev",
    "http://localhost:9002",
  ],
};

export default nextConfig;
