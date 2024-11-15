import type { NextConfig } from "next";

const nextConfig = {
  images: {
    domains: ['img.spoonacular.com'],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // rewrites: async () => {
  //   return [
  //     { 
  //     "source": "/api/auth/(.*)", 
  //     "destination": "/api/auth/$1" 
  //     },
  //     {
  //       "source": "/recipes",
  //       "destination": "/api/recipes"
  //     },
  //   ]
  // },
}

module.exports = nextConfig
export default nextConfig;
