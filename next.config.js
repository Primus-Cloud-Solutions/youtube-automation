// Next.js Configuration
// This file sets a custom webpack configuration to use your Next.js app
// with Netlify's serverless functions.

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: false,
  images: {
    domains: ['i.ytimg.com'],
    unoptimized: true,
  },
  pageExtensions: ['tsx', 'ts'],
  swcMinify: false,
  productionBrowserSourceMaps: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    // Reduce memory usage during build
    config.optimization = {
      ...config.optimization,
      minimize: false
    };
    
    return config;
  }
}

module.exports = nextConfig
