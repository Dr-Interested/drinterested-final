import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Combined middleware rules for Dr. Interested.
 * Serves as both the router redirect tool (for /team routes) and the server-side
 * admin session gatekeeper (gatekeeping /dashboard routes).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Team redirects: redirect plural /teams to singular /team
  if (pathname === "/teams" || pathname === "/teams/") {
    const url = request.nextUrl.clone();
    url.pathname = "/members";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/teams/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/teams\//, "/team/");
    return NextResponse.redirect(url);
  }

  // 2. Server-side portal route protection (defense-in-depth)
  if (pathname.startsWith("/dashboard")) {
    const portalSession = request.cookies.get("portal-session")?.value;
    const isLoginFlow = request.nextUrl.searchParams.get("login") === "true";

    if (!portalSession || portalSession !== "authenticated") {
      // Allow access to /dashboard if explicitly entering the login flow
      if (isLoginFlow && pathname === "/dashboard") {
        return NextResponse.next();
      }

      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("auth", "required");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/teams", "/teams/:path*", "/dashboard/:path*"],
};
