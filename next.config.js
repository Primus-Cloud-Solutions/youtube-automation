// This file sets a custom webpack configuration to use your Next.js app
// with Netlify's serverless functions and edge functions.
// https://nextjs.org/docs/api-reference/next.config.js/introduction

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable strict mode to reduce potential issues
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Ensure we handle any trailing slashes in URLs
  trailingSlash: false,
  // Configure image domains if needed
  images: {
    domains: ['i.ytimg.com'],
    unoptimized: true, // Reduce memory usage during build
  },
  // Include all page extensions to avoid issues with file detection
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Disable SWC minify to avoid memory issues
  swcMinify: false,
  // Disable source maps in production to reduce bundle size
  productionBrowserSourceMaps: false,
  // Ensure static assets are properly served
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
  // Reduce memory usage during build
  experimental: {
    optimizeCss: false,
    optimizeServerReact: false
  },
  // Add support for importing SVGs as React components
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
