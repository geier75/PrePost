/**
 * PREPOST Supabase Database Service
 * DSGVO & ISO 27001 konform
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Public client (for browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Service client (for server-side operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company?: string;
  tier: 'free' | 'pro' | 'premium' | 'politician' | 'enterprise';
  stripe_customer_id?: string;
  subscription_status?: 'active' | 'cancelled' | 'past_due';
  created_at: string;
  updated_at: string;
  gdpr_consent: boolean;
  gdpr_consent_date: string;
  newsletter_consent: boolean;
  deleted_at?: string;
}

export interface Analysis {
  id: string;
  user_id: string;
  content_hash: string; // GDPR: Hashed for privacy
  platform: string;
  risk_score: number;
  risks: any[];
  suggestions: string[];
  safe_version?: string;
  created_at: string;
  processing_time_ms: number;
  ai_model: string;
  gdpr_compliant: boolean;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource: string;
  ip_hash: string; // GDPR: Hashed IP
  user_agent_hash: string;
  metadata: any;
  created_at: string;
  retention_until: string; // ISO 27001 retention policy
}

export interface ConsentLog {
  id: string;
  user_id: string;
  consent_type: string;
  consent_given: boolean;
  consent_version: string;
  ip_hash: string;
  created_at: string;
}

/**
 * User Management (DSGVO konform)
 */
export const userService = {
  // Create user with GDPR consent
  async createUser(userData: Partial<User>): Promise<User | null> {
    try {
      if (!userData.gdpr_consent) {
        throw new Error('GDPR consent is required');
      }

      const { data, error } = await supabaseAdmin
        .from('users')
        .insert({
          ...userData,
          gdpr_consent_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Log consent for audit
      await consentService.logConsent({
        user_id: data.id,
        consent_type: 'registration',
        consent_given: true,
        consent_version: '1.0',
      });

      return data;
    } catch (error) {
      console.error('User creation failed:', error);
      return null;
    }
  },

  // Get user (with privacy protection)
  async getUser(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .is('deleted_at', null)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('User fetch failed:', error);
      return null;
    }
  },

  // Update user
  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      // Audit log
      await auditService.log({
        user_id: userId,
        action: 'USER_UPDATE',
        resource: 'users',
        metadata: { fields: Object.keys(updates) },
      });

      return data;
    } catch (error) {
      console.error('User update failed:', error);
      return null;
    }
  },

  // Delete user (GDPR Art. 17 - Right to Erasure)
  async deleteUser(userId: string, hardDelete = false): Promise<boolean> {
    try {
      if (hardDelete) {
        // Complete data erasure
        await Promise.all([
          supabaseAdmin.from('analyses').delete().eq('user_id', userId),
          supabaseAdmin.from('consent_logs').delete().eq('user_id', userId),
          supabaseAdmin.from('audit_logs').delete().eq('user_id', userId),
        ]);

        const { error } = await supabaseAdmin
          .from('users')
          .delete()
          .eq('id', userId);

        if (error) throw error;
      } else {
        // Soft delete (mark as deleted)
        const { error } = await supabaseAdmin
          .from('users')
          .update({
            deleted_at: new Date().toISOString(),
            email: `deleted_${userId}@prepost.ai`,
            first_name: 'Deleted',
            last_name: 'User',
          })
          .eq('id', userId);

        if (error) throw error;
      }

      // Audit log
      await auditService.log({
        user_id: userId,
        action: hardDelete ? 'USER_HARD_DELETE' : 'USER_SOFT_DELETE',
        resource: 'users',
        metadata: { gdpr_request: true },
      });

      return true;
    } catch (error) {
      console.error('User deletion failed:', error);
      return false;
    }
  },

  // Export user data (GDPR Art. 20 - Data Portability)
  async exportUserData(userId: string): Promise<any> {
    try {
      const [user, analyses, consents] = await Promise.all([
        supabase.from('users').select('*').eq('id', userId).single(),
        supabase.from('analyses').select('*').eq('user_id', userId),
        supabase.from('consent_logs').select('*').eq('user_id', userId),
      ]);

      const exportData = {
        user: user.data,
        analyses: analyses.data,
        consent_history: consents.data,
        export_date: new Date().toISOString(),
        gdpr_compliant: true,
      };

      // Audit log
      await auditService.log({
        user_id: userId,
        action: 'USER_DATA_EXPORT',
        resource: 'users',
        metadata: { gdpr_request: true },
      });

      return exportData;
    } catch (error) {
      console.error('Data export failed:', error);
      return null;
    }
  },
};

/**
 * Analysis Service
 */
export const analysisService = {
  // Save analysis (privacy-preserving)
  async saveAnalysis(analysis: Partial<Analysis>): Promise<Analysis | null> {
    try {
      // Hash content for privacy
      const contentHash = createHash('sha256')
        .update(analysis.content_hash || '')
        .digest('hex')
        .substring(0, 16);

      const { data, error } = await supabase
        .from('analyses')
        .insert({
          ...analysis,
          content_hash: contentHash,
          created_at: new Date().toISOString(),
          gdpr_compliant: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Analysis save failed:', error);
      return null;
    }
  },

  // Get user analyses
  async getUserAnalyses(
    userId: string,
    limit = 50,
    offset = 0
  ): Promise<Analysis[]> {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Analyses fetch failed:', error);
      return [];
    }
  },

  // Get analysis statistics
  async getStats(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('risk_score, platform, created_at')
        .eq('user_id', userId);

      if (error) throw error;

      const stats = {
        total_analyses: data?.length || 0,
        average_risk: data?.reduce((acc, a) => acc + a.risk_score, 0) / (data?.length || 1),
        platforms: Array.from(new Set(data?.map(a => a.platform))),
        last_analysis: data?.[0]?.created_at,
      };

      return stats;
    } catch (error) {
      console.error('Stats fetch failed:', error);
      return null;
    }
  },

  // Delete old analyses (GDPR retention policy)
  async deleteOldAnalyses(retentionDays = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const { data, error } = await supabaseAdmin
        .from('analyses')
        .delete()
        .lt('created_at', cutoffDate.toISOString())
        .select();

      if (error) throw error;

      console.log(`Deleted ${data?.length || 0} old analyses`);
      return data?.length || 0;
    } catch (error) {
      console.error('Old analyses deletion failed:', error);
      return 0;
    }
  },
};

/**
 * Consent Service (DSGVO Art. 7)
 */
export const consentService = {
  // Log consent
  async logConsent(consent: {
    user_id: string;
    consent_type: string;
    consent_given: boolean;
    consent_version: string;
  }): Promise<boolean> {
    try {
      const ipHash = createHash('sha256')
        .update('127.0.0.1') // In production, get real IP
        .digest('hex')
        .substring(0, 16);

      const { error } = await supabaseAdmin
        .from('consent_logs')
        .insert({
          ...consent,
          ip_hash: ipHash,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Consent logging failed:', error);
      return false;
    }
  },

  // Get consent history
  async getConsentHistory(userId: string): Promise<ConsentLog[]> {
    try {
      const { data, error } = await supabase
        .from('consent_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Consent history fetch failed:', error);
      return [];
    }
  },

  // Withdraw consent (DSGVO Art. 7.3)
  async withdrawConsent(
    userId: string,
    consentType: string
  ): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from('consent_logs')
        .insert({
          user_id: userId,
          consent_type: consentType,
          consent_given: false,
          consent_version: '1.0',
          ip_hash: createHash('sha256').update('127.0.0.1').digest('hex').substring(0, 16),
          created_at: new Date().toISOString(),
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Consent withdrawal failed:', error);
      return false;
    }
  },
};

/**
 * Audit Service (ISO 27001)
 */
export const auditService = {
  // Log audit entry
  async log(entry: {
    user_id?: string;
    action: string;
    resource: string;
    metadata?: any;
  }): Promise<boolean> {
    try {
      const ipHash = createHash('sha256')
        .update('127.0.0.1')
        .digest('hex')
        .substring(0, 16);

      const userAgentHash = createHash('sha256')
        .update('Mozilla/5.0')
        .digest('hex')
        .substring(0, 16);

      // Calculate retention based on action type
      const retentionDays = entry.action.includes('DELETE') ? 365 : 90;
      const retentionDate = new Date();
      retentionDate.setDate(retentionDate.getDate() + retentionDays);

      const { error } = await supabaseAdmin
        .from('audit_logs')
        .insert({
          ...entry,
          ip_hash: ipHash,
          user_agent_hash: userAgentHash,
          created_at: new Date().toISOString(),
          retention_until: retentionDate.toISOString(),
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Audit logging failed:', error);
      return false;
    }
  },

  // Get audit logs
  async getAuditLogs(
    filters: {
      user_id?: string;
      action?: string;
      resource?: string;
      start_date?: string;
      end_date?: string;
    },
    limit = 100
  ): Promise<AuditLog[]> {
    try {
      let query = supabaseAdmin
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (filters.user_id) query = query.eq('user_id', filters.user_id);
      if (filters.action) query = query.eq('action', filters.action);
      if (filters.resource) query = query.eq('resource', filters.resource);
      if (filters.start_date) query = query.gte('created_at', filters.start_date);
      if (filters.end_date) query = query.lte('created_at', filters.end_date);

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Audit logs fetch failed:', error);
      return [];
    }
  },

  // Clean old audit logs
  async cleanOldLogs(): Promise<number> {
    try {
      const { data, error } = await supabaseAdmin
        .from('audit_logs')
        .delete()
        .lt('retention_until', new Date().toISOString())
        .select();

      if (error) throw error;

      console.log(`Cleaned ${data?.length || 0} expired audit logs`);
      return data?.length || 0;
    } catch (error) {
      console.error('Audit log cleanup failed:', error);
      return 0;
    }
  },
};

/**
 * Subscription Service
 */
export const subscriptionService = {
  // Update subscription
  async updateSubscription(
    userId: string,
    tier: User['tier'],
    stripeSubscriptionId?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from('users')
        .update({
          tier,
          subscription_status: 'active',
          stripe_subscription_id: stripeSubscriptionId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      // Audit log
      await auditService.log({
        user_id: userId,
        action: 'SUBSCRIPTION_UPDATE',
        resource: 'users',
        metadata: { tier, stripeSubscriptionId },
      });

      return true;
    } catch (error) {
      console.error('Subscription update failed:', error);
      return false;
    }
  },

  // Cancel subscription
  async cancelSubscription(userId: string): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from('users')
        .update({
          subscription_status: 'cancelled',
          tier: 'free',
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      // Audit log
      await auditService.log({
        user_id: userId,
        action: 'SUBSCRIPTION_CANCEL',
        resource: 'users',
        metadata: {},
      });

      return true;
    } catch (error) {
      console.error('Subscription cancellation failed:', error);
      return false;
    }
  },
};

/**
 * Export services
 */
export default {
  supabase,
  supabaseAdmin,
  userService,
  analysisService,
  consentService,
  auditService,
  subscriptionService,
};
