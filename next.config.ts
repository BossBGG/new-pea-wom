import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NEXT_PUBLIC_SERVER_MODE === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,

  // Add env for next-runtime-env
  env: {
    NEXT_PUBLIC_KEY_CLOAK_CLIENT_ID:
      process.env.NEXT_PUBLIC_KEY_CLOAK_CLIENT_ID,
    NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI:
      process.env.NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI,
    NEXT_PUBLIC_APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL,
    NEXT_PUBLIC_APP_API_BASE_URL: process.env.NEXT_PUBLIC_APP_API_BASE_URL,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    NEXT_PUBLIC_SERVER_MODE: process.env.NEXT_PUBLIC_SERVER_MODE,
    NEXT_PUBLIC_WORK_D_DEV: process.env.NEXT_PUBLIC_WORK_D_DEV,
    NEXT_PUBLIC_WORK_D_PROD: process.env.NEXT_PUBLIC_WORK_D_PROD,
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // destination: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/v1/:path*`, // for deployment
        destination: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/:path*`, // for local development
      },
    ];
  },
};

export default withPWA(nextConfig);
