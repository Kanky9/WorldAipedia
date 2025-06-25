
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
};

export default nextConfig;
