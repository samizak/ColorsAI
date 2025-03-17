import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "./utils/superbase/middleware";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const { pathname, searchParams } = request.nextUrl;

  const authCookie = request.cookies.get("sb-auth-token");
  const isAuthenticated = !!authCookie;

  const isStripeRedirect =
    pathname === "/protected/billing/success" && searchParams.has("session_id");
  if (isStripeRedirect) {
    return response;
  }

  const protectedRoutes = ["/protected"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("returnTo", pathname + request.nextUrl.search);
    return NextResponse.redirect(redirectUrl);
  }

  if (
    (pathname === "/auth/login" || pathname === "/auth/signup") &&
    isAuthenticated
  ) {
    const redirectUrl = new URL("/", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
