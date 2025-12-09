/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: '192.168.1.187',
      port: '5000',
      pathname: '/static/images/**',
    },
  ],
},
};

module.exports = nextConfig;
