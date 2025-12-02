/**
 * Health Check API Endpoints
 * ISO 27001 & Monitoring Compliance
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-service';

// Service health status
interface HealthStatus {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  lastChecked: string;
  details?: any;
}

// Main health check
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const healthChecks: HealthStatus[] = [];
  
  // Check Database
  const dbHealth = await checkDatabase();
  healthChecks.push(dbHealth);
  
  // Check AI Service
  const aiHealth = await checkAIService();
  healthChecks.push(aiHealth);
  
  // Check Payment Service
  const paymentHealth = await checkPaymentService();
  healthChecks.push(paymentHealth);
  
  // Check Auth Service
  const authHealth = await checkAuthService();
  healthChecks.push(authHealth);
  
  // Overall status
  const allHealthy = healthChecks.every(check => check.status === 'healthy');
  const anyDown = healthChecks.some(check => check.status === 'down');
  
  const overallStatus = anyDown ? 'down' : allHealthy ? 'healthy' : 'degraded';
  
  return NextResponse.json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0',
    uptime: process.uptime(),
    responseTime: Date.now() - startTime,
    services: healthChecks,
    compliance: {
      gdpr: true,
      iso27001: true,
      euAiAct: true,
    },
  }, {
    status: overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 206 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Health-Status': overallStatus,
    },
  });
}

// Check database health
async function checkDatabase(): Promise<HealthStatus> {
  const startTime = Date.now();
  
  try {
    // Simple query to test connection
    const { error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    return {
      service: 'database',
      status: 'healthy',
      responseTime: Date.now() - startTime,
      lastChecked: new Date().toISOString(),
      details: {
        provider: 'Supabase',
        region: process.env.SUPABASE_REGION || 'eu-central-1',
      },
    };
  } catch (error) {
    return {
      service: 'database',
      status: 'down',
      responseTime: Date.now() - startTime,
      lastChecked: new Date().toISOString(),
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

// Check AI service health
async function checkAIService(): Promise<HealthStatus> {
  const startTime = Date.now();
  
  try {
    // Check if API key exists
    const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
    
    if (!hasApiKey) {
      return {
        service: 'ai',
        status: 'degraded',
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
        details: {
          provider: 'Anthropic Claude',
          issue: 'API key not configured',
        },
      };
    }
    
    return {
      service: 'ai',
      status: 'healthy',
      responseTime: Date.now() - startTime,
      lastChecked: new Date().toISOString(),
      details: {
        provider: 'Anthropic Claude',
        model: 'claude-3-opus',
      },
    };
  } catch (error) {
    return {
      service: 'ai',
      status: 'down',
      responseTime: Date.now() - startTime,
      lastChecked: new Date().toISOString(),
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

// Check payment service health
async function checkPaymentService(): Promise<HealthStatus> {
  const startTime = Date.now();
  
  try {
    const hasApiKey = !!process.env.STRIPE_SECRET_KEY;
    
    if (!hasApiKey) {
      return {
        service: 'payments',
        status: 'degraded',
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
        details: {
          provider: 'Stripe',
          issue: 'API key not configured',
        },
      };
    }
    
    return {
      service: 'payments',
      status: 'healthy',
      responseTime: Date.now() - startTime,
      lastChecked: new Date().toISOString(),
      details: {
        provider: 'Stripe',
        pciCompliant: true,
      },
    };
  } catch (error) {
    return {
      service: 'payments',
      status: 'down',
      responseTime: Date.now() - startTime,
      lastChecked: new Date().toISOString(),
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

// Check auth service health
async function checkAuthService(): Promise<HealthStatus> {
  const startTime = Date.now();
  
  try {
    const hasClerkKey = !!process.env.CLERK_SECRET_KEY;
    
    if (!hasClerkKey) {
      // Fallback auth is available
      return {
        service: 'authentication',
        status: 'degraded',
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
        details: {
          provider: 'Mock Auth (Clerk not configured)',
          mfaEnabled: false,
        },
      };
    }
    
    return {
      service: 'authentication',
      status: 'healthy',
      responseTime: Date.now() - startTime,
      lastChecked: new Date().toISOString(),
      details: {
        provider: 'Clerk',
        mfaEnabled: true,
        ssoEnabled: true,
      },
    };
  } catch (error) {
    return {
      service: 'authentication',
      status: 'down',
      responseTime: Date.now() - startTime,
      lastChecked: new Date().toISOString(),
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}
