
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // ✅ Esta línea es la clave

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
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
