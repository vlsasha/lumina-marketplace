/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['app.vana.org', 'account.vana.org'],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'DataBridge',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
};

module.exports = nextConfig;
