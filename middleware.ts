import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { type CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // Skip middleware for callback route to prevent redirect loops
  if (request.nextUrl.pathname.includes('/auth/callback')) {
    return NextResponse.next();
  }
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  
  // Create a Supabase client using the new ssr package
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          });
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession();

  // Get the pathname from the URL
  const path = request.nextUrl.pathname;

  // If there's no session and the user is trying to access a protected route
  if (!session && isProtectedRoute(path)) {
    console.log(`Middleware: No session, redirecting from ${path} to /auth`);
    const redirectUrl = new URL('/auth', request.url);
    redirectUrl.searchParams.set('redirectedFrom', path);
    return NextResponse.redirect(redirectUrl);
  }

  // If there's a session and the user is trying to access auth pages
  if (session && isAuthRoute(path)) {
    console.log(`Middleware: Session exists, redirecting from ${path} to /dashboard`);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = ['/dashboard', '/create', '/profile', '/settings'];
  return protectedRoutes.some(route => pathname.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
  return pathname === '/auth' || pathname.startsWith('/auth');
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/auth/:path*', 
    '/create/:path*', 
    '/profile/:path*', 
    '/settings/:path*'
  ],
};
