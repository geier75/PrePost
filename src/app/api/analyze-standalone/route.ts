/**
 * Standalone Analyze API for Manus Deployment
 * No external dependencies - uses local DB and environment AI key
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeContentWithClaude } from '@/lib/ai-service-enhanced';
import { createAnalysis } from '@/lib/local-db';
import { getCurrentUser } from '@/lib/auth';
import { analyzeRequestSchema, formatZodErrors } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';

const RATE_LIMIT_REQUESTS = 20; // More generous for standalone
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

/**
 * POST /api/analyze-standalone
 * Analyze social media content - Standalone version for Manus
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Get client identifier
    const ip = request.ip ?? 
               request.headers.get('x-forwarded-for')?.split(',')[0] ?? 
               '127.0.0.1';

    // Rate Limiting
    const limiter = rateLimit({
      interval: RATE_LIMIT_WINDOW,
      limit: RATE_LIMIT_REQUESTS,
    });

    try {
      await limiter.check(request, RATE_LIMIT_REQUESTS, ip);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests',
          message: 'Please wait before making another request',
          retryAfter: 60,
        },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': RATE_LIMIT_REQUESTS.toString(),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json().catch(() => ({}));
    
    const validationResult = analyzeRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          details: formatZodErrors(validationResult.error),
        },
        { 
          status: 400,
          headers: {
            'X-Response-Time': `${Date.now() - startTime}ms`,
          },
        }
      );
    }

    const { content, platform, metadata } = validationResult.data;

    // Check for authentication (optional - can work without login)
    const token = request.cookies.get('auth_token')?.value || null;
    const user = token ? await getCurrentUser(token) : null;

    // Perform AI Analysis using Manus environment variable
    const analysis = await analyzeContentWithClaude(content, platform);

    // Save to local database if user is logged in
    if (user) {
      try {
        await createAnalysis({
          user_id: user.id,
          content,
          platform,
          overall_risk: analysis.overall_risk,
          risk_score: analysis.risk_score,
          recommendation: analysis.recommendation,
          categories: analysis.categories,
          suggestions: analysis.suggestions,
          improved_version: analysis.improved_version,
          confidence: analysis.confidence,
          reasoning: analysis.reasoning,
        });
      } catch (dbError) {
        console.error('Failed to save analysis:', dbError);
        // Continue anyway - analysis still works
      }
    }

    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Log request (anonymized)
    console.info('[API] Analysis completed', {
      platform,
      contentLength: content.length,
      riskScore: analysis.risk_score,
      responseTime,
      authenticated: !!user,
    });

    // Return successful response
    return NextResponse.json(
      {
        success: true,
        data: {
          analysis: {
            overallRisk: analysis.overall_risk,
            riskScore: analysis.risk_score,
            recommendation: analysis.recommendation,
            categories: analysis.categories,
            suggestions: analysis.suggestions,
            improvedVersion: analysis.improved_version,
            confidence: analysis.confidence,
            reasoning: analysis.reasoning,
          },
          metadata: {
            platform,
            contentLength: content.length,
            analyzedAt: new Date().toISOString(),
            authenticated: !!user,
          },
        },
      },
      {
        status: 200,
        headers: {
          'X-Response-Time': `${responseTime}ms`,
          'X-Standalone-Mode': 'true',
          'X-Manus-Deployment': 'true',
          'Cache-Control': 'no-store, must-revalidate',
        },
      }
    );

  } catch (error) {
    // Log error
    console.error('[API Error] /api/analyze-standalone', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Return generic error
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while analyzing your content',
        message: 'Please try again later',
      },
      { 
        status: 500,
        headers: {
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      }
    );
  }
}

/**
 * GET /api/analyze-standalone
 * Health check and API information
 */
export async function GET() {
  // Check if AI is configured
  const aiConfigured = !!process.env.ANTHROPIC_API_KEY;

  return NextResponse.json(
    {
      status: 'healthy',
      version: '2.0.0-standalone',
      mode: 'manus-deployment',
      endpoint: '/api/analyze-standalone',
      methods: ['POST'],
      description: 'Standalone AI-powered social media content analysis',
      features: {
        authentication: 'optional',
        database: 'local-file-based',
        ai: aiConfigured ? 'anthropic-claude' : 'mock-fallback',
      },
      rateLimit: {
        requests: RATE_LIMIT_REQUESTS,
        window: `${RATE_LIMIT_WINDOW / 1000}s`,
      },
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300',
        'X-Standalone-Mode': 'true',
      },
    }
  );
}

/**
 * OPTIONS /api/analyze-standalone
 * CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
