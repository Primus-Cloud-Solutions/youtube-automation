// This file completely disables TypeScript checking
// Place this in the project root as next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // !! WARN !!
    // Completely disables TypeScript checks during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Also disable ESLint during build
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
