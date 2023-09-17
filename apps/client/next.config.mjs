/** @type {import("next").NextConfig} */
import './env.mjs';
import BundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer({
  reactStrictMode: true,
  transpilePackages:['@viaprize/ui'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dweb.link',
        port: '',
        pathname: '/**',
      },
    ],
  },
});
