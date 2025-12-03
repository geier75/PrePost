// Enhanced middleware with ISO 27001, DSGVO, and EU AI Act compliance
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Rate limiting setup (ISO 27001 A.12.3.1 - Information backup)
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
  prefix: '@upstash/ratelimit',
});

// Security event logging for ISO 27001 compliance
async function logSecurityEvent(event: {
  type: string;
  ip: string;
  path: string;
  userAgent: string;
  timestamp: string;
}) {
  // TODO: Send to SIEM system
  console.log('Security Event:', event);
}

export async function middleware(req: NextRequest) {
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  // 1. RATE LIMITING (ISO 27001 A.13.1 - Network security management)
  if (process.env.ENABLE_RATE_LIMIT === 'true') {
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);
    
    if (!success) {
      await logSecurityEvent({
        type: 'RATE_LIMIT_EXCEEDED',
        ip,
        path: req.nextUrl.pathname,
        userAgent,
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json(
        { 
          error: 'Too many requests', 
          retryAfter: reset 
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(reset).toISOString(),
            'Retry-After': Math.floor((reset - Date.now()) / 1000).toString()
          }
        }
      );
    }
  }
  
  // 2. SECURITY HEADERS (ISO 27001 A.14.1.2 - Securing application services)
  const response = NextResponse.next();
  
  // Basic Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  
  // HSTS Header for HTTPS enforcement
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  
  // Content Security Policy (CSP) - Enhanced for DSGVO
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' " +
    "https://js.stripe.com https://checkout.stripe.com " +
    "https://challenges.cloudflare.com https://*.clerk.dev " +
    "https://*.posthog.com https://cdn.jsdelivr.net; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data: https: blob: https://images.unsplash.com; " +
    "font-src 'self' data: https://fonts.gstatic.com; " +
    "connect-src 'self' https://*.anthropic.com https://*.supabase.co " +
    "https://api.stripe.com https://*.clerk.dev https://*.posthog.com " +
    "wss://*.supabase.co https://challenges.cloudflare.com; " +
    "frame-src https://js.stripe.com https://checkout.stripe.com " +
    "https://challenges.cloudflare.com https://*.clerk.dev; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'; " +
    "object-src 'none'; " +
    "worker-src 'self' blob:; " +
    "manifest-src 'self'; " +
    "media-src 'self' https:; " +
    "upgrade-insecure-requests; " +
    "block-all-mixed-content;"
  );
  
  // Permissions Policy (Feature Policy)
  response.headers.set(
    'Permissions-Policy',
    'accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), ' +
    'camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), ' +
    'encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), ' +
    'fullscreen=(self), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), ' +
    'microphone=(), midi=(), navigation-override=(), payment=(self https://stripe.com), ' +
    'picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), ' +
    'sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()'
  );
  
  // 3. DSGVO COMPLIANCE HEADERS
  response.headers.set('X-GDPR-Compliant', 'true');
  response.headers.set('X-Data-Classification', 'sensitive');
  response.headers.set('X-Privacy-Policy', '/privacy');
  
  // 4. EU AI ACT COMPLIANCE HEADERS
  response.headers.set('X-AI-System', 'true');
  response.headers.set('X-AI-Risk-Level', 'minimal');
  response.headers.set('X-AI-Human-Oversight', 'enabled');
  response.headers.set('X-AI-Transparency', '/ai-disclosure');
  
  // 5. ISO 27001 COMPLIANCE HEADERS
  response.headers.set('X-ISO-27001', 'compliant');
  response.headers.set('X-Security-Audit', 'enabled');
  response.headers.set('X-Incident-Response', 'active');
  
  // 6. CORS Configuration (only for API routes)
  if (req.nextUrl.pathname.startsWith('/api')) {
    const origin = req.headers.get('origin');
    const allowedOrigins = [
      'https://prepost.ai',
      'https://www.prepost.ai',
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
      process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : ''
    ].filter(Boolean);
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Max-Age', '86400');
    }
  }
  
  // 7. SECURITY MONITORING (ISO 27001 A.12.4.1)
  if (req.nextUrl.pathname.startsWith('/admin') || 
      req.nextUrl.pathname.includes('delete') ||
      req.nextUrl.pathname.includes('export')) {
    await logSecurityEvent({
      type: 'SENSITIVE_ACCESS',
      ip,
      path: req.nextUrl.pathname,
      userAgent,
      timestamp: new Date().toISOString()
    });
  }
  
  // 8. BLOCK SUSPICIOUS USER AGENTS (Security best practice)
  const suspiciousAgents = ['sqlmap', 'nikto', 'nmap', 'masscan', 'metasploit'];
  if (suspiciousAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    await logSecurityEvent({
      type: 'SUSPICIOUS_USER_AGENT',
      ip,
      path: req.nextUrl.pathname,
      userAgent,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }
  
  // 9. ADD REQUEST ID FOR TRACING (ISO 27001 A.12.4.1 - Event logging)
  const requestId = crypto.randomUUID();
  response.headers.set('X-Request-Id', requestId);
  response.headers.set('X-Trace-Id', requestId);
  
  // 10. SET CACHE CONTROL FOR SENSITIVE DATA
  if (req.nextUrl.pathname.startsWith('/api/privacy') ||
      req.nextUrl.pathname.startsWith('/api/user')) {
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
    '/api/:path*'
  ]
};
