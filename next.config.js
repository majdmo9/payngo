/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_ACCESS_TOKEN: process.env.NEXT_PUBLIC_ACESS_TOKEN,
  },
  images: {
    remotePatterns: [
      {
        hostname: "cdn.shopify.com",
      },
    ],
  },
};

module.exports = nextConfig;
