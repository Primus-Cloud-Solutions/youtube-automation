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
    serverActions: true,
    esmExternals: 'loose'
  },
  transpilePackages: ['googleapis', 'google-auth-library', 'gcp-metadata', 'google-logging-utils'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs', 'net', 'child_process' modules on the client
      config.resolve.fallback = {
        fs: false,
        net: false,
        child_process: false,
        tls: false,
        events: false,
        process: false,
        util: false,
        stream: false,
        buffer: false,
        path: false,
        url: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        zlib: false,
        querystring: false,
        crypto: false
      };
    }
    
    // Add rule to handle node: protocol imports
    config.module.rules.push({
      test: /node:/,
      loader: 'ignore-loader'
    });
    
    return config;
  },
  // Explicitly set the app directory to avoid duplicate pages
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Disable the pages directory to prevent duplicate routes
  useFileSystemPublicRoutes: true
};

module.exports = nextConfig;
