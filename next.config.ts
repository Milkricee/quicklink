import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/old-note/:noteId',
        destination: '/note/:noteId', // Umleitung auf die dynamische Route
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
