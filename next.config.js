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
  // Explicitly set the page extensions to avoid duplicate page detection
  pageExtensions: ['tsx', 'ts'],
  // Disable SWC minify to avoid memory issues
  swcMinify: false,
  // Disable source maps in production to reduce bundle size
  productionBrowserSourceMaps: false,
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
