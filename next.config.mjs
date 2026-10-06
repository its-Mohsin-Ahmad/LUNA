/**
 * GitHub Pages static-export mode is opt-in so local development and
 * `next start` keep the full server build:
 *   NEXT_OUTPUT=export NEXT_BASE_PATH=/LUNA npm run build
 */
const isExport = process.env.NEXT_OUTPUT === 'export';
const basePath = process.env.NEXT_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  ...(isExport
    ? { output: 'export', trailingSlash: true, ...(basePath ? { basePath } : {}) }
    : {}),
  images: {
    // SmartImage component uses native <img> with fallback chain; keep optimizer off.
    unoptimized: true,
  },
  // Security headers only apply when served by the Next server; a static
  // export gets them from the host instead.
  ...(!isExport && {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          ],
        },
      ];
    },
  }),
};

export default nextConfig;
