import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // For local development uploads
    unoptimized: true, 
  },
  // Fix for bcrypt in server components if needed, though usually handled by environment
  serverExternalPackages: ["bcryptjs"],
};

export default nextConfig;
