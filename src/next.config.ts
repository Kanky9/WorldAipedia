
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // output: 'export', // Comentado para permitir funcionalidades del lado del servidor
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Mantener esto si se usan placehold.co o si no se quiere optimización en dev/build
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: [
      "https://6000-firebase-studio-1749697659574.cluster-duylic2g3fbzerqpzxxbw6helm.cloudworkstations.dev",
      "http://localhost:9002",
    ],
  },
};

export default nextConfig;
