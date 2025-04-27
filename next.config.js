/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  output: 'standalone',
  distDir: '.next',
  experimental: {
    serverActions: true
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs', 'net', 'child_process' modules on the client
      config.resolve.fallback = {
        fs: false,
        net: false,
        child_process: false,
        tls: false
      };
    }
    
    return config;
  },
  // Add this to resolve the duplicate pages issue
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].filter(extension => {
    // During build, only include .tsx and .jsx files to avoid duplicates
    return process.env.NODE_ENV === 'production' 
      ? ['tsx', 'jsx'].includes(extension) 
      : true;
  })
}

module.exports = nextConfig
