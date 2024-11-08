import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['img.spoonacular.com'],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
