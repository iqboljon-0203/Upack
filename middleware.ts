import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Define hostnames that point to the admin subdomain
  const isAdminSubdomain = hostname.startsWith('admin.');

  // Don't rewrite internal Next.js requests, API routes, or static files
  const isInternalOrStatic = 
    url.pathname.startsWith('/_next') || 
    url.pathname.startsWith('/api') || 
    url.pathname.includes('.') ||
    url.pathname.startsWith('/static');

  if (isAdminSubdomain && !isInternalOrStatic) {
    // If the path doesn't start with /admin, rewrite internally
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname}`;
    }

    // Authenticated check
    if (url.pathname === '/admin/login') {
      return NextResponse.rewrite(url);
    }

    const adminToken = request.cookies.get('admin_token')?.value;

    if (!adminToken) {
      // Redirect to /login on the admin subdomain
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.rewrite(url);
  }

  // If a non-admin subdomain requests /admin, redirect to admin.upackb2b.uz
  if (!isAdminSubdomain && url.pathname.startsWith('/admin')) {
    const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1');
    const adminDomain = isLocal ? `admin.localhost:3000` : `admin.upackb2b.uz`;
    const protocol = isLocal ? 'http' : 'https';
    
    const newPath = url.pathname.replace(/^\/admin/, '') || '/';
    return NextResponse.redirect(`${protocol}://${adminDomain}${newPath}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except those starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
