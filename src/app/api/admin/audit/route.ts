/**
 * Admin Audit Logs API
 * ISO 27001 Compliance
 */

import { NextRequest, NextResponse } from 'next/server';
import dbService from '@/lib/supabase-service';

// Check if user is admin
async function isAdmin(request: NextRequest): Promise<boolean> {
  const sessionCookie = request.cookies.get('session');
  if (!sessionCookie) return false;
  
  // In production, check actual admin status
  // For now, mock admin check
  return true; // Mock: all authenticated users are admins
}

export async function GET(request: NextRequest) {
  try {
    // Check admin permission
    if (!await isAdmin(request)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const filters = {
      user_id: searchParams.get('user_id') || undefined,
      action: searchParams.get('action') || undefined,
      resource: searchParams.get('resource') || undefined,
      start_date: searchParams.get('start_date') || undefined,
      end_date: searchParams.get('end_date') || undefined,
    };
    
    const limit = parseInt(searchParams.get('limit') || '100');
    
    // Get audit logs
    const logs = await dbService.auditService.getAuditLogs(filters, limit);
    
    // Calculate statistics
    const stats = {
      totalLogs: logs.length,
      uniqueUsers: new Set(logs.map(l => l.user_id)).size,
      actions: logs.reduce((acc: any, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      }, {}),
      recentActivity: logs.slice(0, 10),
    };
    
    return NextResponse.json({
      success: true,
      logs,
      stats,
      filters,
    });
  } catch (error) {
    console.error('Audit logs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

// Clean old audit logs
export async function DELETE(request: NextRequest) {
  try {
    if (!await isAdmin(request)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    
    const cleaned = await dbService.auditService.cleanOldLogs();
    
    return NextResponse.json({
      success: true,
      message: `Cleaned ${cleaned} expired audit logs`,
      cleaned,
    });
  } catch (error) {
    console.error('Audit cleanup error:', error);
    return NextResponse.json(
      { error: 'Failed to clean audit logs' },
      { status: 500 }
    );
  }
}
