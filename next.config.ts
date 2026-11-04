import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // Proxy the Express API through this domain so the HTTPOnly JWT cookie is
  // first-party (works in Incognito and Safari). /api/auth and /api/token stay
  // with Next.js.
  async rewrites() {
    const api = process.env.NEXT_PUBLIC_API_URL;
    return [
      { source: "/api/studios/:path*", destination: `${api}/api/studios/:path*` },
      { source: "/api/bookings/:path*", destination: `${api}/api/bookings/:path*` },
      { source: "/api/jwt", destination: `${api}/api/jwt` },
      { source: "/api/logout", destination: `${api}/api/logout` },
    ];
  },
};

export default nextConfig;
