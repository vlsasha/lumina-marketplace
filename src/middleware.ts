import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory store for rate limiting
const ipRateLimit = new Map<string, { count: number; timestamp: number }>();

// Different limits for different routes
const RATE_LIMIT_CONFIG = {
  default: { windowMs: 60 * 1000, maxRequests: 30 },      // 30 req/min general API
  strict: { windowMs: 60 * 1000, maxRequests: 10 },       // 10 req/min for POST/Auth/Download
};

// Clean up old entries to prevent memory leaks during DDoS
function cleanupRateLimits() {
  const now = Date.now();
  for (const [ip, data] of ipRateLimit.entries()) {
    if (now - data.timestamp > Math.max(RATE_LIMIT_CONFIG.default.windowMs, RATE_LIMIT_CONFIG.strict.windowMs)) {
      ipRateLimit.delete(ip);
    }
  }
}

// Run cleanup periodically (e.g. randomly 1 in 100 requests)
function maybeCleanup() {
  if (Math.random() < 0.01) cleanupRateLimits();
}

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  const response = NextResponse.next({
    request: {
      headers,
    },
  });

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (request.nextUrl.pathname.startsWith('/api/')) {
    maybeCleanup(); // Garbage collection for DDoS protection

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    if (ip !== 'unknown') {
      const now = Date.now();
      const userLimit = ipRateLimit.get(ip);
      
      // Determine if strict limit applies
      const isStrictRoute = 
        request.method !== 'GET' || 
        request.nextUrl.pathname.startsWith('/api/auth') || 
        request.nextUrl.pathname.startsWith('/api/download');
        
      const limitConfig = isStrictRoute ? RATE_LIMIT_CONFIG.strict : RATE_LIMIT_CONFIG.default;

      if (!userLimit || (now - userLimit.timestamp > limitConfig.windowMs)) {
        ipRateLimit.set(ip, { count: 1, timestamp: now });
      } else {
        userLimit.count++;
        if (userLimit.count > limitConfig.maxRequests) {
          // If the map is getting extremely large during an attack, force empty to save server memory
          if (ipRateLimit.size > 10000) ipRateLimit.clear();

          return new NextResponse(
            JSON.stringify({ 
              error: 'Rate limit exceeded. Too many requests. Please slow down.' 
            }),
            { 
              status: 429, 
              headers: { 
                'Content-Type': 'application/json',
                'Retry-After': Math.ceil(limitConfig.windowMs / 1000).toString()
              } 
            }
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
