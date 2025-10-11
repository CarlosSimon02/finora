import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/overview",
        permanent: true,
      },
    ];
  },
  experimental: {
    useCache: true,
  },
  // Note: Test files (*.test.*, *.spec.*, __tests__/) and Storybook files
  // (*.stories.*, .storybook/) are automatically excluded via tsconfig.json
  // and .vercelignore configurations
};

export default nextConfig;
