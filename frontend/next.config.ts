import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Lokale backend (ontwikkeling)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/uploads/**',
      },
      // Productie backend
      {
        protocol: 'https',
        hostname: 'api.zorgwerkwijzer.nl',
        pathname: '/uploads/**',
      },
      // Supabase Storage (logo's en headers)
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async redirects() {
    return [
      // Backward compatibility: oude vacaturedetail-URLs doorsturen naar nieuwe /vacature/ route
      // Uitzondering: bekende SEO-landingspagina's worden NIET geredirect
      {
        source: '/vacatures/:slug((?!verpleegkundige$|helpende-plus$|verzorgende-ig$).*)',
        destination: '/vacature/:slug',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
