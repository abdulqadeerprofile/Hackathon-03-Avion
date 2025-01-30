import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['cdn.sanity.io'], // Add the Sanity image domain here
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
