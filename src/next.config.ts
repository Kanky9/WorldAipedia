
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
  // The 'experimental' block containing 'allowedDevOrigins' has been removed
  // as 'allowedDevOrigins' was reported as an unrecognized key within 'experimental'
  // for this Next.js version/setup.
};

export default nextConfig;
