import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
    proxyClientMaxBodySize: "100mb",
  },
  serverExternalPackages: ["@supabase/supabase-js"],
  devIndicators: false,
  images: {
    remotePatterns: [
      new URL("https://scqontrgxdlzzkfobsob.supabase.co/storage/v1/object/public/**"),
      new URL("https://*.supabase.co/storage/v1/object/public/**"),
    ],
  },
};

export default nextConfig;
