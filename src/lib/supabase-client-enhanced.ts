/**
 * Enhanced Supabase Client with Error Handling
 * SOTA Best Practice: Proper client initialization and helper functions
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Type definitions for database schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          clerk_id: string;
          email: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          role: 'user' | 'admin' | 'moderator';
          profession: string | null;
          industry: string | null;
          country: string;
          language: string;
          onboarding_completed: boolean;
          risk_profile: any;
          settings: any;
          created_at: string;
          updated_at: string;
          last_login_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      analyses: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          content_type: 'post' | 'comment' | 'story' | 'dm' | 'tweet';
          platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'reddit' | 'other' | null;
          overall_risk: 'none' | 'low' | 'medium' | 'high';
          risk_score: number;
          recommendation: 'safe' | 'revise' | 'danger';
          categories: any;
          suggestions: string[];
          improved_version: string | null;
          confidence: number;
          metadata: any;
          is_archived: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['analyses']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['analyses']['Insert']>;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          tier: 'free' | 'pro' | 'premium' | 'enterprise';
          status: 'active' | 'canceled' | 'past_due' | 'trialing';
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          trial_end: string | null;
          metadata: any;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>;
      };
      usage_tracking: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          analyses_count: number;
          tier: 'free' | 'pro' | 'premium' | 'enterprise';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['usage_tracking']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['usage_tracking']['Insert']>;
      };
    };
  };
}

// Initialize Supabase client
let supabaseClient: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase credentials not configured');
    throw new Error('Supabase not configured');
  }

  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return supabaseClient;
}

// Server-side client with service role key
export function getSupabaseAdmin(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase admin credentials not configured');
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Helper Functions

/**
 * Get user by Clerk ID
 */
export async function getUserByClerkId(clerkId: string) {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

/**
 * Create or update user
 */
export async function upsertUser(userData: Database['public']['Tables']['users']['Insert']) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('users')
      .upsert(userData, {
        onConflict: 'clerk_id',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error upserting user:', error);
    return null;
  }
}

/**
 * Create analysis record
 */
export async function createAnalysis(
  analysisData: Database['public']['Tables']['analyses']['Insert']
) {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('analyses')
      .insert(analysisData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating analysis:', error);
    return null;
  }
}

/**
 * Get user's analyses
 */
export async function getUserAnalyses(
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    orderBy?: 'created_at' | 'risk_score';
    ascending?: boolean;
  } = {}
) {
  try {
    const supabase = getSupabaseClient();
    const {
      limit = 10,
      offset = 0,
      orderBy = 'created_at',
      ascending = false,
    } = options;

    const { data, error, count } = await supabase
      .from('analyses')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order(orderBy, { ascending })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count };
  } catch (error) {
    console.error('Error fetching analyses:', error);
    return { data: null, count: 0 };
  }
}

/**
 * Get user's subscription
 */
export async function getUserSubscription(userId: string) {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

/**
 * Check usage limit
 */
export async function checkUsageLimit(userId: string): Promise<{
  allowed: boolean;
  used: number;
  limit: number | null;
}> {
  try {
    const supabase = getSupabaseClient();
    
    // Get subscription
    const subscription = await getUserSubscription(userId);
    const tier = subscription?.tier || 'free';
    
    // Get today's usage
    const today = new Date().toISOString().split('T')[0];
    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('analyses_count')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    const used = usage?.analyses_count || 0;
    
    // Determine limit based on tier
    const limits: Record<string, number | null> = {
      free: 10,
      pro: null, // unlimited
      premium: null,
      enterprise: null,
    };
    
    const limit = limits[tier];
    const allowed = limit === null || used < limit;

    return { allowed, used, limit };
  } catch (error) {
    console.error('Error checking usage limit:', error);
    return { allowed: true, used: 0, limit: 10 }; // Default to free tier
  }
}

/**
 * Increment usage count
 */
export async function incrementUsageCount(userId: string) {
  try {
    const supabase = getSupabaseClient();
    const subscription = await getUserSubscription(userId);
    const tier = subscription?.tier || 'free';
    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase.rpc('increment_usage_count', {
      p_user_id: userId,
    });

    if (error) {
      // Fallback: manual increment
      const { data: existing } = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (existing) {
        await supabase
          .from('usage_tracking')
          .update({ analyses_count: existing.analyses_count + 1 })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('usage_tracking')
          .insert({
            user_id: userId,
            date: today,
            analyses_count: 1,
            tier,
          });
      }
    }

    return true;
  } catch (error) {
    console.error('Error incrementing usage:', error);
    return false;
  }
}

/**
 * Get user statistics
 */
export async function getUserStatistics(userId: string) {
  try {
    const supabase = getSupabaseClient();
    
    // Get total analyses
    const { count: totalAnalyses } = await supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get risk distribution
    const { data: analyses } = await supabase
      .from('analyses')
      .select('overall_risk, risk_score')
      .eq('user_id', userId);

    const riskDistribution = {
      none: 0,
      low: 0,
      medium: 0,
      high: 0,
    };

    let totalRiskScore = 0;

    analyses?.forEach(analysis => {
      riskDistribution[analysis.overall_risk]++;
      totalRiskScore += analysis.risk_score;
    });

    const averageRiskScore = analyses?.length 
      ? Math.round(totalRiskScore / analyses.length) 
      : 0;

    return {
      totalAnalyses: totalAnalyses || 0,
      riskDistribution,
      averageRiskScore,
    };
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return {
      totalAnalyses: 0,
      riskDistribution: { none: 0, low: 0, medium: 0, high: 0 },
      averageRiskScore: 0,
    };
  }
}

/**
 * Archive analysis
 */
export async function archiveAnalysis(analysisId: string, userId: string) {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('analyses')
      .update({ is_archived: true })
      .eq('id', analysisId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error archiving analysis:', error);
    return false;
  }
}

/**
 * Delete user data (GDPR)
 */
export async function deleteUserData(userId: string) {
  try {
    const supabase = getSupabaseAdmin();
    
    // Delete in order (foreign key constraints)
    await supabase.from('usage_tracking').delete().eq('user_id', userId);
    await supabase.from('analyses').delete().eq('user_id', userId);
    await supabase.from('subscriptions').delete().eq('user_id', userId);
    await supabase.from('users').delete().eq('id', userId);

    return true;
  } catch (error) {
    console.error('Error deleting user data:', error);
    return false;
  }
}
