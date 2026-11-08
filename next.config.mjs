// Content Security Policy (security review F-01). Outside scripts, frames and connections are
// limited to the services the site actually uses. 'unsafe-inline' stays in script-src because
// Next.js's own inline bootstrap scripts can only carry per-request nonces when every page is
// rendered on demand, which would end static generation/ISR for the whole site; the host
// allowlist still blocks scripts from any other domain, and object-src/base-uri/form-action/
// frame-ancestors close the other common injection paths. 'unsafe-eval' is development-only
// (React's dev tooling needs it).
const supabaseOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "").origin
  } catch {
    return "https://*.supabase.co"
  }
})()
const isDev = process.env.NODE_ENV !== "production"
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://connect.facebook.net https://f.convertkit.com https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${supabaseOrigin} ${supabaseOrigin.replace(/^https:/, "wss:")} https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.facebook.com https://connect.facebook.net https://app.convertkit.com https://app.kit.com https://f.convertkit.com https://formspree.io https://vitals.vercel-insights.com`,
  "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com https://open.spotify.com https://www.facebook.com",
  "media-src 'self' blob: https:",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://formspree.io https://app.convertkit.com https://app.kit.com",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ")

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't advertise the framework in an X-Powered-By header (security review H-04).
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // YouTube video thumbnails — used by webinar/podcast archives (data/webinars.ts,
      // data/podcasts.ts) and the click-to-load media facades (components/lite-embed.tsx).
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|gif|ico|js|css)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // The legacy X-XSS-Protection header was removed (security review H-04): modern browsers
          // ignore it and the CSP below replaces it.
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          // Same 2-year lifetime Vercel already sends, plus includeSubDomains (review H-03). Sent
          // from www, so it covers *.www.drinterested.org; apex-wide coverage is a DNS/hosting
          // decision (see docs/security/README.md).
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/db/apply",
        destination: "/members/apply",
        permanent: true,
      },
      {
        source: "/db/members",
        destination: "/members",
        permanent: true,
      },
      {
        source: "/join",
        destination: "/members/apply",
        permanent: true,
      },
      {
        source: "/medexplore-2026",
        destination: "/medx-2026",
        permanent: true,
      },
    ];
  },

  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
};

export default nextConfig;
