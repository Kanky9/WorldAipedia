
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
  webpack: (config, { isServer }) => {
    if (isServer) {
      // This is a workaround for a Genkit dependency issue with Next.js.
      // It prevents webpack from trying to bundle a specific file from the 'handlebars' package.
      config.externals.push('handlebars/lib/index.js');
    }
    return config;
  },
};

export default nextConfig;
