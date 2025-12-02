import { NextRequest, NextResponse } from 'next/server';
import { analyzeContentWithClaude } from '@/lib/ai-service-enhanced';
import { rateLimit } from '@/lib/rate-limit';
import { analyzeRequestSchema, formatZodErrors } from '@/lib/validation';

// Mock AI Analysis - DEPRECATED: Use analyzeContentWithClaude instead
async function analyzeContentWithAI_DEPRECATED(content: string, platform: string) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simple keyword-based risk detection (replace with real AI)
  const riskKeywords = {
    high: ['dumm', 'hass', 'töten', 'gewalt', 'rassist', 'nazi'],
    medium: ['politik', 'regierung', 'kritik', 'kontrovers'],
    low: ['meinung', 'denke', 'glaube']
  };
  
  const contentLower = content.toLowerCase();
  let riskLevel = 'none';
  let score = 5;
  const detectedRisks: string[] = [];
  
  // Check for high-risk keywords
  for (const keyword of riskKeywords.high) {
    if (contentLower.includes(keyword)) {
      riskLevel = 'high';
      score = 85 + Math.floor(Math.random() * 15);
      detectedRisks.push(`Potenziell gefährlicher Begriff: "${keyword}"`);
    }
  }
  
  // Check for medium-risk keywords
  if (riskLevel === 'none') {
    for (const keyword of riskKeywords.medium) {
      if (contentLower.includes(keyword)) {
        riskLevel = 'medium';
        score = 45 + Math.floor(Math.random() * 20);
        detectedRisks.push(`Möglicherweise kontroverses Thema: "${keyword}"`);
      }
    }
  }
  
  // Check content length
  if (content.length > 500) {
    score += 5;
    detectedRisks.push('Langer Text könnte missverstanden werden');
  }
  
  const safe = score < 30;
  
  return {
    score,
    risk: riskLevel,
    safe,
    platform,
    categories: [
      {
        name: 'Toxizität',
        score: riskLevel === 'high' ? score : Math.floor(Math.random() * 30),
        severity: riskLevel === 'high' ? 'high' : 'low'
      },
      {
        name: 'Professionalität', 
        score: Math.floor(Math.random() * 50),
        severity: 'low'
      },
      {
        name: 'Rechtliches Risiko',
        score: riskLevel === 'high' ? 70 : Math.floor(Math.random() * 20),
        severity: riskLevel === 'high' ? 'medium' : 'low'
      }
    ],
    suggestions: detectedRisks.length > 0 ? detectedRisks : [
      'Content erscheint sicher',
      'Keine erkennbaren Risiken gefunden'
    ],
    timestamp: new Date().toISOString()
  };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Rate Limiting
    const ip = request.ip ?? request.headers.get('x-forwarded-for')?.split(',')[0] ?? '127.0.0.1';
    const limiter = rateLimit({ interval: 60000, limit: 10 });
    
    try {
      await limiter.check(request, 10, ip);
    } catch (error) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const body = await request.json().catch(() => ({}));
    
    // Validate input with Zod
    const validationResult = analyzeRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: formatZodErrors(validationResult.error) },
        { status: 400 }
      );
    }
    
    const { content, platform } = validationResult.data;
    
    // Validation
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }
    
    if (content.length < 1) {
      return NextResponse.json(
        { error: 'Content cannot be empty' },
        { status: 400 }
      );
    }
    
    if (content.length > 5000) {
      return NextResponse.json(
        { error: 'Content too long (max 5000 characters)' },
        { status: 400 }
      );
    }
    
    // Perform analysis with enhanced AI service
    const analysis = await analyzeContentWithClaude(content, platform);
    
    // TODO: Save to database (Supabase)
    // await supabase.from('analyses').insert({
    //   user_id: session?.user?.id,
    //   content,
    //   platform,
    //   result: analysis,
    //   created_at: new Date().toISOString()
    // });
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      analysis: {
        overallRisk: analysis.overall_risk,
        riskScore: analysis.risk_score,
        recommendation: analysis.recommendation,
        categories: analysis.categories,
        suggestions: analysis.suggestions,
        improvedVersion: analysis.improved_version,
        confidence: analysis.confidence,
        reasoning: analysis.reasoning,
      }
    }, {
      headers: {
        'X-Response-Time': `${responseTime}ms`,
        'X-GDPR-Compliant': 'true',
      }
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error during analysis' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'POST to this endpoint with { content, platform } to analyze content',
      version: '1.0.0',
      status: 'active'
    },
    { status: 200 }
  );
}
