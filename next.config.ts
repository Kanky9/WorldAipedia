
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // Ensures build output goes to the 'out' directory for Firebase Hosting
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
  // allowedDevOrigins should be at the root level if used,
  // but removing it for now as it was causing build warnings
  // and is primarily for 'next dev'
  // allowedDevOrigins: [
  //   "https://6000-firebase-studio-1749697659574.cluster-duylic2g3fbzerqpzxxbw6helm.cloudworkstations.dev",
  //   "http://localhost:9002",
  // ],
};

export default nextConfig;
