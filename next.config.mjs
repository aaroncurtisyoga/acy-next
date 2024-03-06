// @ts-check
import withPlaiceholder from "@plaiceholder/next";

/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default withPlaiceholder(nextConfig);
