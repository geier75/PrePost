/**
 * Enhanced Analyze API v2
 * High-performance, country-aware content analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeContent } from '@/lib/ai-analyzer';
import { rateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';
import { z } from 'zod';

// Validation schema
const analyzeSchema = z.object({
  content: z.string().min(1).max(5000),
  platform: z.enum(['linkedin', 'twitter', 'facebook', 'instagram', 'general']),
  countryCode: z.string().length(2).optional(),
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please wait before analyzing again.',
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          }
        }
      );
    }

    // Parse and validate request
    const body = await request.json();
    const validation = analyzeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { content, platform, countryCode } = validation.data;

    // Detect country from request if not provided
    const detectedCountry = countryCode || detectCountryFromRequest(request);

    logger.apiRequest('POST', '/api/analyze-v2', {
      platform,
      country: detectedCountry,
      contentLength: content.length,
    });

    // Perform AI analysis
    const result = await analyzeContent(content, platform, detectedCountry);

    const duration = Date.now() - startTime;

    logger.apiResponse('POST', '/api/analyze-v2', 200, duration);

    return NextResponse.json(
      {
        success: true,
        data: {
          ...result,
          country: detectedCountry,
          analysisTime: duration,
        },
      },
      {
        headers: {
          'X-Response-Time': `${duration}ms`,
          'Cache-Control': 'no-store, must-revalidate',
        },
      }
    );

  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.apiError('POST', '/api/analyze-v2', error as Error);

    return NextResponse.json(
      {
        success: false,
        error: 'Analysis failed. Please try again.',
        message: process.env.NODE_ENV === 'development' 
          ? (error as Error).message 
          : undefined,
      },
      { 
        status: 500,
        headers: {
          'X-Response-Time': `${duration}ms`,
        }
      }
    );
  }
}

/**
 * Detect country from request headers
 */
function detectCountryFromRequest(request: NextRequest): string {
  // Try CloudFlare header
  const cfCountry = request.headers.get('cf-ipcountry');
  if (cfCountry && cfCountry !== 'XX') {
    return cfCountry;
  }

  // Try other common headers
  const xCountry = request.headers.get('x-country');
  if (xCountry) {
    return xCountry;
  }

  // Default to US
  return 'US';
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
