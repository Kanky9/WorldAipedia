
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
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
  experimental: {
    allowedDevOrigins: [
      // Add the origin from the warning message
      "https://6000-firebase-studio-1749697659574.cluster-duylic2g3fbzerqpzxxbw6helm.cloudworkstations.dev",
      // It's good practice to also allow the standard localhost for local development outside of Studio
      "http://localhost:9002",
    ],
  },
};

export default nextConfig;
