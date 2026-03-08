/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  transpilePackages: ['react-markdown', 'remark-gfm'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  }
}

export default nextConfig
