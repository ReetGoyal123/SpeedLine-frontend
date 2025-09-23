/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disabled to prevent duplicate API calls during development
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig