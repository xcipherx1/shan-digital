import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * CSP scoped to the dialer pages so the Twilio Voice SDK can open its
 * signalling WebSockets, without imposing a policy on (and risking a
 * regression to) the existing marketing site. Dev adds 'unsafe-eval'
 * for React Refresh / HMR only.
 */
const dialerCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.twilio.com wss://*.twilio.com https://eventgw.twilio.com",
  "media-src 'self' blob: https://*.twilio.com",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const baseSecurityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      // Global hardening (safe for the marketing site too).
      {
        source: "/:path*",
        headers: baseSecurityHeaders,
      },
      // Full policy + CSP for the dialer surface.
      {
        source: "/dialer/:path*",
        headers: [
          ...baseSecurityHeaders,
          { key: "Content-Security-Policy", value: dialerCsp },
        ],
      },
    ];
  },
};

export default nextConfig;
