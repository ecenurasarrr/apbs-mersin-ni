import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Use v2 as the project root
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};

export default nextConfig;
