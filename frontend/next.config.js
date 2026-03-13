/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // In Docker, frontend talks to the backend service over the compose network
        destination: 'http://backend:8080/api/:path*',
      },
    ];
  },
};
module.exports = nextConfig
