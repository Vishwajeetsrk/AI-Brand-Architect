import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets that should exist
  if (pathname.startsWith('/_next/') || pathname.startsWith('/public/')) {
    return NextResponse.next();
  }

  // Redirect API calls to backend
  if (pathname.startsWith('/api/')) {
    const apiUrl = new URL(pathname.replace('/api', ''), process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
    return NextResponse.rewrite(apiUrl);
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' http://localhost:3001 ws://localhost:* wss://*; media-src 'self';");

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml|logo|public).*)',
  ],
};
