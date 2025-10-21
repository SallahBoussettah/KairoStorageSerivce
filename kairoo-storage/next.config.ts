import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Increase body size limit to 200MB for server actions
    serverActions: {
      bodySizeLimit: "200mb",
    },
  },
};

export default nextConfig;
