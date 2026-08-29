import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeScript must stay clean — never ignore build errors.
  images: { unoptimized: true }, // static mock assets served from /public
};

export default nextConfig;
