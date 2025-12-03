// src/app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { supabaseAdmin } from '@/lib/supabase/client';
import { z } from 'zod';

// Validation schema for profile updates
const profileUpdateSchema = z.object({
  full_name: z.string().min(1).max(255).optional(),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  profession: z.string().max(100).optional(),
  industry: z.string().max(100).optional(),
  country: z.string().length(2).optional(),
  language: z.string().length(2).optional(),
  settings: z.object({
    notifications: z.boolean().optional(),
    emailAlerts: z.boolean().optional(),
    darkMode: z.boolean().optional(),
    autoSave: z.boolean().optional(),
  }).optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const { userId: clerkUserId } = auth();
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await supabaseAdmin.getUserByClerkId(clerkUserId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get subscription info
    const subscription = await supabaseAdmin.getUserSubscription(user.id);

    // Get usage stats
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const monthlyStats = await supabaseAdmin.getUsageStats(
      user.id,
      startOfMonth,
      endOfMonth
    );

    // Get risk statistics
    const riskStats = await supabaseAdmin.getRiskStatistics(user.id, 'weekly');

    // Calculate risk score (average of last 7 days)
    const riskScore = riskStats.length > 0
      ? Math.round(
          riskStats
            .slice(0, 7)
            .reduce((acc, stat) => acc + (100 - stat.average_risk_score), 0) / 
          Math.min(riskStats.length, 7)
        )
      : 100;

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        profession: user.profession,
        industry: user.industry,
        country: user.country,
        language: user.language,
        role: user.role,
        settings: user.settings,
        created_at: user.created_at,
        onboarding_completed: user.onboarding_completed,
      },
      subscription: {
        tier: subscription?.tier || 'free',
        status: subscription?.status || 'inactive',
        current_period_end: subscription?.current_period_end,
        cancel_at_period_end: subscription?.cancel_at_period_end,
      },
      stats: {
        monthly_analyses: monthlyStats.total_analyses || 0,
        monthly_limit: getMonthlyLimit(subscription?.tier || 'free'),
        risk_score: riskScore,
        total_analyses: monthlyStats.total_all_time || 0,
        risks_avoided: monthlyStats.dangerous_posts_avoided || 0,
      },
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Authenticate user
    const { userId: clerkUserId } = auth();
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = profileUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const updates = validationResult.data;

    // Get user from database
    const user = await supabaseAdmin.getUserByClerkId(clerkUserId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if username is already taken
    if (updates.username) {
      const existingUser = await supabaseAdmin.getUserByUsername(updates.username);
      if (existingUser && existingUser.id !== user.id) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 409 }
        );
      }
    }

    // Merge settings if provided
    if (updates.settings) {
      updates.settings = {
        ...user.settings,
        ...updates.settings,
      };
    }

    // Update user profile
    const updatedUser = await supabaseAdmin.updateUser(user.id, updates);

    // Log audit event
    await supabaseAdmin.logAuditEvent({
      user_id: user.id,
      action: 'profile_updated',
      resource_type: 'user',
      resource_id: user.id,
      details: { fields_updated: Object.keys(updates) },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        full_name: updatedUser.full_name,
        avatar_url: updatedUser.avatar_url,
        profession: updatedUser.profession,
        industry: updatedUser.industry,
        country: updatedUser.country,
        language: updatedUser.language,
        settings: updatedUser.settings,
      },
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const { userId: clerkUserId } = auth();
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await supabaseAdmin.getUserByClerkId(clerkUserId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Cancel any active subscriptions
    const subscription = await supabaseAdmin.getUserSubscription(user.id);
    if (subscription && subscription.stripe_subscription_id) {
      // Cancel Stripe subscription
      // TODO: Implement Stripe cancellation
    }

    // Anonymize user data (soft delete for compliance)
    await supabaseAdmin.updateUser(user.id, {
      email: `deleted_${user.id}@example.com`,
      username: null,
      full_name: 'Deleted User',
      avatar_url: null,
      profession: null,
      industry: null,
      settings: {},
    });

    // Log audit event
    await supabaseAdmin.logAuditEvent({
      user_id: user.id,
      action: 'account_deleted',
      resource_type: 'user',
      resource_id: user.id,
      details: { deletion_type: 'soft' },
    });

    // Delete from Clerk
    // TODO: Implement Clerk deletion

    return NextResponse.json({
      success: true,
      message: 'Account successfully deleted',
    });

  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}

function getMonthlyLimit(tier: string): number {
  const limits: Record<string, number> = {
    free: 10,
    pro: 999999,
    premium: 999999,
    enterprise: 999999,
  };
  
  return limits[tier] || 10;
}