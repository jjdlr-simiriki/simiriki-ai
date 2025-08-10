// next.config.mjs
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    generateStaticParams: false
  }
};

export default nextConfig;

