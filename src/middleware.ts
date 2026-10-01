import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory rate limiting map for basic protection
// In production with multiple edges, you'd use Upstash Redis, but this is a good start.
const ipRateLimit = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // Max 30 requests per minute per IP

export function middleware(request: NextRequest) {
  // Add security headers
  const headers = new Headers(request.headers);
  const response = NextResponse.next({
    request: {
      headers,
    },
  });

  // Protection against clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  // Enforce HTTPS
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Rate Limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    
    if (ip !== 'unknown') {
      const now = Date.now();
      const userLimit = ipRateLimit.get(ip);

      if (!userLimit || (now - userLimit.timestamp > RATE_LIMIT_WINDOW)) {
        // Reset window
        ipRateLimit.set(ip, { count: 1, timestamp: now });
      } else {
        userLimit.count++;
        if (userLimit.count > MAX_REQUESTS_PER_WINDOW) {
          // Block IP
          return new NextResponse(
            JSON.stringify({ error: 'Too many requests. Please try again later.' }),
            { status: 429, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
    }
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
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
