import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  experimental: {
    serverActions: {
      // Multiple 5MB images get base64-encoded (~+33%) in one submit;
      // headroom for MAX_IMAGES_PER_CAR (10) images plus form overhead.
      bodySizeLimit: "75mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
