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
  },
  pageExtensions: ['tsx', 'ts'],
  swcMinify: false,
  productionBrowserSourceMaps: false
}

module.exports = nextConfig
