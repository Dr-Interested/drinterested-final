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
    // The password-reset page is self-securing: Supabase itself refuses to update a
    // password without a valid recovery session, so it doesn't need the portal-session
    // cookie — which the visitor can't have yet anyway (they're here because they can't
    // log in). Always let it through.
    if (pathname === "/dashboard/reset-password") {
      return NextResponse.next();
    }

    const portalSession = request.cookies.get("portal-session")?.value;
    // Set on both password sign-in and SSO/OAuth callbacks (see the auth-state-change
    // listener in app/dashboard/page.tsx) — "login=true" additionally covers the moment
    // an OAuth provider redirects back before that client-side listener has run yet.
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
