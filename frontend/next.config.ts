import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
async rewrites() {
  return [
    {
      source: '/api/monsters',
      destination: 'http://localhost:8080/monsters',
    },
    {
      source: '/api/monsters/:path*',
      destination: 'http://localhost:8080/monsters/:path*',
    },
  ];
},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '5e.tools',
        pathname: '/img/bestiary/tokens/**',
      },
    ],
  },
};

export default nextConfig;
