/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@react-pdf/renderer'],
  outputFileTracingIncludes: {
    '/api/exams/*/upload': [
      './public/assets/*.png',
      // PDFKit carrega as fontes por require dinâmico; o tracing não as detecta.
      './node_modules/pdfkit/package.json',
      './node_modules/pdfkit/js/standard-fonts/**/*',
      './node_modules/pdfkit/js/data/**/*',
    ],
  },
};

module.exports = nextConfig;
