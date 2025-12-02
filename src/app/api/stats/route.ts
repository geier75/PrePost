import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }
    
    const session = JSON.parse(sessionCookie.value);
    
    // TODO: Get real stats from Supabase
    // const supabase = createRouteHandlerClient({ cookies });
    // const { data: analyses } = await supabase
    //   .from('analyses')
    //   .select('*')
    //   .eq('user_id', session.user.id)
    //   .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
    
    // MOCK: Generate realistic stats
    const weeklyAnalyses = Math.floor(Math.random() * 20) + 5;
    const risksAvoided = Math.floor(weeklyAnalyses * 0.3);
    const riskScore = 95 - Math.floor(Math.random() * 10);
    
    return NextResponse.json({
      success: true,
      stats: {
        weeklyAnalyses,
        risksAvoided,
        riskScore,
        totalAnalyses: weeklyAnalyses * 4, // Simulate total over time
        platformBreakdown: {
          twitter: Math.floor(weeklyAnalyses * 0.4),
          linkedin: Math.floor(weeklyAnalyses * 0.3),
          facebook: Math.floor(weeklyAnalyses * 0.2),
          instagram: Math.floor(weeklyAnalyses * 0.1)
        },
        recentTrend: riskScore > 90 ? 'improving' : 'stable',
        lastAnalysis: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
      },
      user: session.user
    });
    
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Statistiken' },
      { status: 500 }
    );
  }
}
