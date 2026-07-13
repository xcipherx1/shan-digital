import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

// Edge-safe NextAuth instance (JWT cookie only, no DB) for route gating.
// Next 16 renamed the `middleware` convention to `proxy`.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const path = nextUrl.pathname;

  const isApi =
    path.startsWith("/api/dialer") || path === "/api/twilio/token";
  const isProtectedPage =
    path.startsWith("/dialer") && path !== "/dialer/login";

  if ((isApi || isProtectedPage) && !isLoggedIn) {
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/dialer/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

// Note: Twilio webhooks (/api/twilio/voice|status|recording) are
// deliberately excluded — they authenticate via signature validation,
// not a session, because Twilio cannot log in.
export const config = {
  matcher: ["/dialer/:path*", "/api/dialer/:path*", "/api/twilio/token"],
};
