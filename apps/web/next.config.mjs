// Ensure NODE_ENV is production during build
if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
  process.env.NODE_ENV = 'production';
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
