/**
 * Standalone Dashboard API for Manus
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getUserAnalyses, getUserStatistics } from '@/lib/local-db';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await getCurrentUser(token);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Get user statistics
    const stats = await getUserStatistics(user.id);

    // Get recent analyses
    const { data: recentAnalyses } = await getUserAnalyses(user.id, {
      limit: 10,
      offset: 0,
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
        },
        statistics: stats,
        recentAnalyses,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load dashboard' },
      { status: 500 }
    );
  }
}
