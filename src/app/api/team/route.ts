/**
 * Team Management API
 * For Premium & Enterprise users
 */

import { NextRequest, NextResponse } from 'next/server';
import dbService from '@/lib/supabase-service';
import crypto from 'crypto';

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  addedAt: string;
  lastActive: string;
  analysisCount: number;
}

interface Team {
  id: string;
  name: string;
  owner_id: string;
  members: TeamMember[];
  plan: 'premium' | 'enterprise';
  created_at: string;
  settings: {
    allowMemberInvites: boolean;
    requireApproval: boolean;
    shareAnalyses: boolean;
    centralBilling: boolean;
  };
}

// Get team information
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = 'user_' + crypto.createHash('sha256')
      .update(sessionCookie.value)
      .digest('hex')
      .substring(0, 10);
    
    // Mock team data for now
    const team: Team = {
      id: `team_${crypto.randomUUID()}`,
      name: 'PREPOST Team',
      owner_id: userId,
      plan: 'premium',
      created_at: new Date().toISOString(),
      members: [
        {
          id: userId,
          email: 'owner@company.com',
          name: 'Team Owner',
          role: 'owner',
          addedAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          analysisCount: 42,
        },
        {
          id: `user_${crypto.randomUUID()}`,
          email: 'admin@company.com',
          name: 'Admin User',
          role: 'admin',
          addedAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          analysisCount: 28,
        },
        {
          id: `user_${crypto.randomUUID()}`,
          email: 'member@company.com',
          name: 'Team Member',
          role: 'member',
          addedAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          analysisCount: 15,
        },
      ],
      settings: {
        allowMemberInvites: true,
        requireApproval: true,
        shareAnalyses: true,
        centralBilling: true,
      },
    };
    
    // Audit log
    await dbService.auditService.log({
      user_id: userId,
      action: 'TEAM_VIEW',
      resource: 'team_api',
      metadata: { teamId: team.id },
    });
    
    return NextResponse.json({
      success: true,
      team,
      usage: {
        totalAnalyses: team.members.reduce((sum, m) => sum + m.analysisCount, 0),
        monthlyLimit: team.plan === 'enterprise' ? 99999 : 10000,
        seatsUsed: team.members.length,
        seatsAvailable: team.plan === 'enterprise' ? 100 : 10,
      },
    });
  } catch (error) {
    console.error('Team API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team data' },
      { status: 500 }
    );
  }
}

// Add team member
export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = 'user_' + crypto.createHash('sha256')
      .update(sessionCookie.value)
      .digest('hex')
      .substring(0, 10);
    
    const body = await request.json();
    const { email, role = 'member', sendInvite = true } = body;
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    // Validate role
    const validRoles = ['admin', 'member', 'viewer'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }
    
    // Generate invite token
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const inviteExpiry = new Date();
    inviteExpiry.setDate(inviteExpiry.getDate() + 7); // 7 days validity
    
    // Mock sending invite email
    if (sendInvite) {
      console.log(`Sending invite to ${email} with token ${inviteToken}`);
      // TODO: Send actual email via Resend
    }
    
    // Audit log
    await dbService.auditService.log({
      user_id: userId,
      action: 'TEAM_MEMBER_INVITED',
      resource: 'team_api',
      metadata: { 
        invitedEmail: crypto.createHash('sha256').update(email).digest('hex').substring(0, 10),
        role,
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Invitation sent successfully',
      invite: {
        email,
        role,
        expiresAt: inviteExpiry.toISOString(),
        inviteUrl: `${process.env.APP_URL}/team/join?token=${inviteToken}`,
      },
    });
  } catch (error) {
    console.error('Team invite error:', error);
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    );
  }
}

// Remove team member
export async function DELETE(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = 'user_' + crypto.createHash('sha256')
      .update(sessionCookie.value)
      .digest('hex')
      .substring(0, 10);
    
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');
    
    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID required' },
        { status: 400 }
      );
    }
    
    // Mock removal
    console.log(`Removing member ${memberId} from team`);
    
    // Audit log
    await dbService.auditService.log({
      user_id: userId,
      action: 'TEAM_MEMBER_REMOVED',
      resource: 'team_api',
      metadata: { removedMemberId: memberId },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Team member removed successfully',
    });
  } catch (error) {
    console.error('Team removal error:', error);
    return NextResponse.json(
      { error: 'Failed to remove team member' },
      { status: 500 }
    );
  }
}

// Update team settings
export async function PUT(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = 'user_' + crypto.createHash('sha256')
      .update(sessionCookie.value)
      .digest('hex')
      .substring(0, 10);
    
    const body = await request.json();
    const { settings } = body;
    
    // Validate settings
    const validSettings = [
      'allowMemberInvites',
      'requireApproval',
      'shareAnalyses',
      'centralBilling',
    ];
    
    for (const key of Object.keys(settings)) {
      if (!validSettings.includes(key)) {
        return NextResponse.json(
          { error: `Invalid setting: ${key}` },
          { status: 400 }
        );
      }
    }
    
    // Mock update
    console.log('Updating team settings:', settings);
    
    // Audit log
    await dbService.auditService.log({
      user_id: userId,
      action: 'TEAM_SETTINGS_UPDATED',
      resource: 'team_api',
      metadata: { settings },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Team settings updated successfully',
      settings,
    });
  } catch (error) {
    console.error('Team settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update team settings' },
      { status: 500 }
    );
  }
}
