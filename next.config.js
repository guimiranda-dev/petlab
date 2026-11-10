/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@react-pdf/renderer'],
  outputFileTracingIncludes: {
    '/api/exams/*/upload': ['./public/assets/*.png'],
  },
};

module.exports = nextConfig;
