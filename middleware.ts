import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if we are trying to access the admin area
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // If we are at the login page, let it pass
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check for our custom auth cookie
    const adminToken = request.cookies.get('admin_token')?.value;

    if (!adminToken) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
