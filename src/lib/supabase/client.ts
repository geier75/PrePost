// src/lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Client-side Supabase client for React components
export const createBrowserClient = () => {
  return createClientComponentClient<Database>();
};

// Server-side Supabase client
export const createServerClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};

// Singleton pattern for client-side
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export const getSupabaseClient = () => {
  if (!browserClient) {
    browserClient = createBrowserClient();
  }
  return browserClient;
};

// Types for our database tables
export interface User {
  id: string;
  clerk_id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  role: 'user' | 'admin' | 'moderator';
  profession?: string;
  industry?: string;
  country: string;
  language: string;
  onboarding_completed: boolean;
  risk_profile: Record<string, any>;
  settings: {
    notifications: boolean;
    emailAlerts: boolean;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  tier: 'free' | 'pro' | 'premium' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  trial_end?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Analysis {
  id: string;
  user_id: string;
  content: string;
  content_type: 'post' | 'comment' | 'story' | 'dm' | 'tweet';
  platform?: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'reddit' | 'other';
  overall_risk: 'none' | 'low' | 'medium' | 'high';
  risk_score: number;
  recommendation: 'safe' | 'revise' | 'danger';
  categories: {
    hateSpeech: RiskCategory;
    careerRisk: RiskCategory;
    legalIssues: RiskCategory;
    reputationDamage: RiskCategory;
    personalSafety: RiskCategory;
    misinformation: RiskCategory;
  };
  suggestions: string[];
  improved_version?: string;
  confidence: number;
  metadata: Record<string, any>;
  is_archived: boolean;
  created_at: string;
}

export interface RiskCategory {
  name: string;
  level: 'none' | 'low' | 'medium' | 'high';
  score: number;
  explanation: string;
  examples?: string[];
}

export interface UsageTracking {
  id: string;
  user_id: string;
  date: string;
  analyses_count: number;
  tier: 'free' | 'pro' | 'premium' | 'enterprise';
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  owner_id: string;
  subscription_id?: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  invited_by?: string;
  joined_at: string;
}

// Helper functions for common database operations
export const dbHelpers = {
  async getUserByClerkId(clerkId: string): Promise<User | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    
    return data;
  },

  async createUser(userData: Partial<User>): Promise<User | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      return null;
    }
    
    return data;
  },

  async getUserSubscription(userId: string): Promise<Subscription | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    
    if (error && error.code !== 'PGRST116') { // Ignore "no rows" error
      console.error('Error fetching subscription:', error);
    }
    
    return data || null;
  },

  async getUserAnalyses(
    userId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<Analysis[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Error fetching analyses:', error);
      return [];
    }
    
    return data || [];
  },

  async createAnalysis(analysisData: Partial<Analysis>): Promise<Analysis | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('analyses')
      .insert([analysisData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating analysis:', error);
      return null;
    }
    
    // Increment usage count
    if (data && analysisData.user_id) {
      await this.incrementUsageCount(analysisData.user_id);
    }
    
    return data;
  },

  async incrementUsageCount(userId: string): Promise<void> {
    const supabase = getSupabaseClient();
    const today = new Date().toISOString().split('T')[0];
    
    // Get current subscription tier
    const subscription = await this.getUserSubscription(userId);
    const tier = subscription?.tier || 'free';
    
    // Upsert usage tracking
    const { error } = await supabase
      .from('usage_tracking')
      .upsert({
        user_id: userId,
        date: today,
        tier,
        analyses_count: 1
      }, {
        onConflict: 'user_id,date',
        count: 'exact'
      });
    
    if (error) {
      console.error('Error updating usage count:', error);
    }
  },

  async checkUsageLimit(userId: string): Promise<{ allowed: boolean; used: number; limit: number | null }> {
    const supabase = getSupabaseClient();
    const today = new Date().toISOString().split('T')[0];
    
    // Get user's subscription
    const subscription = await this.getUserSubscription(userId);
    const tier = subscription?.tier || 'free';
    
    // Get today's usage
    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('analyses_count')
      .eq('user_id', userId)
      .eq('date', today)
      .single();
    
    const used = usage?.analyses_count || 0;
    
    // Check limits based on tier
    const limits = {
      free: 10,
      pro: null, // unlimited
      premium: null, // unlimited
      enterprise: null // unlimited
    };
    
    const limit = limits[tier];
    
    return {
      allowed: limit === null || used < limit,
      used,
      limit
    };
  },

  async getRiskStatistics(userId: string, period: 'daily' | 'weekly' | 'monthly' = 'weekly') {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('risk_statistics')
      .select('*')
      .eq('user_id', userId)
      .eq('period', period)
      .order('period_start', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error fetching risk statistics:', error);
      return [];
    }
    
    return data || [];
  }
};