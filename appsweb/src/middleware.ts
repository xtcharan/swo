import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  // If no session and trying to access admin area, redirect to login
  if (!session && req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Smart routing for authenticated users
  if (session) {
    // Check if user is already on secure account page
    const isOnSecurePage = req.nextUrl.pathname === '/admin/secure-account';

    // For dashboard access
    if (req.nextUrl.pathname.startsWith('/admin/dashboard')) {
      // Check user metadata for authentication method info
      const userMetadata = session.user?.user_metadata || {};
      const appMetadata = session.user?.app_metadata || {};

      // Check if user recently logged in with OTP (within last session)
      // This is a simplified check - you might need to track this differently
      const needsPassword = appMetadata?.provider !== 'email';

      if (needsPassword && !isOnSecurePage) {
        // User might need to set password first
        return NextResponse.redirect(new URL('/admin/secure-account', req.url));
      }
    }
  }

  return res;
}

// This config specifies which routes the middleware should run on.
export const config = {
  matcher: ['/admin/:path*'], // Protect all routes under /admin/
};
