// src/app/api/v1/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { ContentAnalyzer } from '@/services/ai/content-analyzer';
import { dbHelpers, getSupabaseClient } from '@/lib/supabase/client';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

// Request validation schema
const analyzeRequestSchema = z.object({
  content: z.string().min(1).max(10000),
  platform: z.enum(['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'reddit', 'other']).optional(),
  contentType: z.enum(['post', 'comment', 'story', 'dm', 'tweet']).optional().default('post'),
  userContext: z.object({
    profession: z.string().optional(),
    industry: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

// Initialize rate limiter
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 unique tokens per interval
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId: clerkId } = auth();
    if (!clerkId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await dbHelpers.getUserByClerkId(clerkId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check rate limiting
    try {
      await limiter.check(request, 10, user.id); // 10 requests per minute
    } catch {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Check usage limits
    const { allowed, used, limit } = await dbHelpers.checkUsageLimit(user.id);
    if (!allowed) {
      return NextResponse.json(
        { 
          error: 'Usage limit exceeded',
          details: {
            used,
            limit,
            message: 'Please upgrade your plan for unlimited analyses'
          }
        },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = analyzeRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { content, platform, contentType, userContext } = validationResult.data;

    // Initialize AI analyzer
    const analyzer = new ContentAnalyzer(process.env.ANTHROPIC_API_KEY!);
    
    // Perform analysis
    const analysisResult = await analyzer.analyzeContent(
      content,
      platform,
      {
        profession: userContext?.profession || user.profession,
        industry: userContext?.industry || user.industry,
        country: userContext?.country || user.country,
      }
    );

    // Save analysis to database
    const savedAnalysis = await dbHelpers.createAnalysis({
      user_id: user.id,
      content,
      content_type: contentType,
      platform,
      overall_risk: analysisResult.overallRisk,
      risk_score: analysisResult.riskScore,
      recommendation: analysisResult.recommendation,
      categories: analysisResult.categories,
      suggestions: analysisResult.suggestions,
      improved_version: analysisResult.improvedVersion,
      confidence: analysisResult.confidence,
      metadata: {
        api_version: 'v1',
        client: request.headers.get('user-agent'),
      },
    });

    if (!savedAnalysis) {
      console.error('Failed to save analysis to database');
    }

    // Update user's risk profile (async, don't wait)
    updateUserRiskProfile(user.id, analysisResult).catch(console.error);

    // Return analysis result
    return NextResponse.json({
      success: true,
      data: {
        id: savedAnalysis?.id || analysisResult.id,
        ...analysisResult,
        usage: {
          used: used + 1,
          limit,
          remaining: limit ? limit - (used + 1) : null,
        },
      },
    });

  } catch (error) {
    console.error('Analysis API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for retrieving analysis by ID
export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = auth();
    if (!clerkId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const analysisId = searchParams.get('id');
    
    if (!analysisId) {
      return NextResponse.json(
        { error: 'Analysis ID required' },
        { status: 400 }
      );
    }

    const user = await dbHelpers.getUserByClerkId(clerkId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', analysisId)
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error('Get analysis API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to update user's risk profile
async function updateUserRiskProfile(userId: string, analysis: any) {
  const supabase = getSupabaseClient();
  
  // Get existing profile
  const { data: user } = await supabase
    .from('users')
    .select('risk_profile')
    .eq('id', userId)
    .single();

  const currentProfile = user?.risk_profile || {};
  
  // Update profile with new analysis data
  const updatedProfile = {
    ...currentProfile,
    lastAnalysisDate: new Date().toISOString(),
    totalAnalyses: (currentProfile.totalAnalyses || 0) + 1,
    averageRiskScore: calculateNewAverage(
      currentProfile.averageRiskScore || 0,
      currentProfile.totalAnalyses || 0,
      analysis.riskScore
    ),
    riskTrend: calculateRiskTrend(currentProfile.riskHistory || [], analysis.riskScore),
    riskHistory: [...(currentProfile.riskHistory || []).slice(-29), {
      date: new Date().toISOString(),
      score: analysis.riskScore,
      level: analysis.overallRisk,
    }],
  };

  // Save updated profile
  await supabase
    .from('users')
    .update({ risk_profile: updatedProfile })
    .eq('id', userId);
}

function calculateNewAverage(currentAvg: number, count: number, newValue: number): number {
  return ((currentAvg * count) + newValue) / (count + 1);
}

function calculateRiskTrend(history: any[], currentScore: number): 'improving' | 'stable' | 'worsening' {
  if (history.length < 3) return 'stable';
  
  const recentScores = history.slice(-5).map(h => h.score);
  const avgRecent = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
  
  if (currentScore < avgRecent - 10) return 'improving';
  if (currentScore > avgRecent + 10) return 'worsening';
  return 'stable';
}