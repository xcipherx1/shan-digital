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

/**
 * CSP for the /landing funnel: allows the optional Meta Pixel script
 * and an embedded Cal.com/Calendly booking iframe — nothing else.
 */
const landingCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://connect.facebook.net`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.facebook.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.facebook.com https://connect.facebook.net",
  "frame-src https://cal.com https://*.cal.com https://calendly.com https://*.calendly.com",
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
      // Admin leads dashboard shares the strict dialer policy.
      {
        source: "/dashboard/:path*",
        headers: [
          ...baseSecurityHeaders,
          { key: "Content-Security-Policy", value: dialerCsp },
        ],
      },
      // Funnel page: pixel + booking embed allowed, everything else locked.
      {
        source: "/landing",
        headers: [
          ...baseSecurityHeaders,
          { key: "Content-Security-Policy", value: landingCsp },
        ],
      },
    ];
  },
};

export default nextConfig;
