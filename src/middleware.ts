import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ipRateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  const response = NextResponse.next({
    request: {
      headers,
    },
  });

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    if (ip !== 'unknown') {
      const now = Date.now();
      const userLimit = ipRateLimit.get(ip);

      if (!userLimit || (now - userLimit.timestamp > RATE_LIMIT_WINDOW)) {
        ipRateLimit.set(ip, { count: 1, timestamp: now });
      } else {
        userLimit.count++;
        if (userLimit.count > MAX_REQUESTS_PER_WINDOW) {
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
