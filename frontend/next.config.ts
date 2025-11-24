import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: '/api/monsters/:path*',
        destination: 'http://localhost:8080/monsters/:path*',
};


export default nextConfig;
