/**
 * Health Check Endpoint - Standalone Version
 * Provides system health status for monitoring (no external services)
 */

import { NextResponse } from 'next/server';
import { existsSync, statSync } from 'fs';
import { join } from 'path';

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  mode: string;
  checks: {
    database: HealthStatus;
    ai: HealthStatus;
    filesystem: HealthStatus;
  };
  metrics?: {
    memoryUsage: NodeJS.MemoryUsage;
    cpuUsage: NodeJS.CpuUsage;
  };
}

interface HealthStatus {
  status: 'ok' | 'warning' | 'error';
  message: string;
  details?: any;
}

function checkDatabase(): HealthStatus {
  try {
    const dataDir = join(process.cwd(), 'data');
    
    if (!existsSync(dataDir)) {
      return {
        status: 'warning',
        message: 'Data directory does not exist (will be created on first use)',
      };
    }

    const stats = statSync(dataDir);
    if (!stats.isDirectory()) {
      return {
        status: 'error',
        message: 'Data path exists but is not a directory',
      };
    }

    // Check if we can write to the directory
    const testFile = join(dataDir, '.health-check');
    try {
      require('fs').writeFileSync(testFile, 'test');
      require('fs').unlinkSync(testFile);
    } catch (err) {
      return {
        status: 'error',
        message: 'Data directory is not writable',
      };
    }

    return {
      status: 'ok',
      message: 'Local database accessible and writable',
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function checkAI(): HealthStatus {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    return {
      status: 'warning',
      message: 'ANTHROPIC_API_KEY not configured (will use mock fallback)',
    };
  }

  if (!apiKey.startsWith('sk-ant-')) {
    return {
      status: 'error',
      message: 'ANTHROPIC_API_KEY has invalid format',
    };
  }

  return {
    status: 'ok',
    message: 'AI service configured (Anthropic Claude)',
  };
}

function checkFilesystem(): HealthStatus {
  try {
    const cwd = process.cwd();
    const stats = statSync(cwd);
    
    if (!stats.isDirectory()) {
      return {
        status: 'error',
        message: 'Working directory is not accessible',
      };
    }

    return {
      status: 'ok',
      message: 'Filesystem accessible',
      details: {
        cwd,
      },
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function GET() {
  const startTime = Date.now();

  const checks = {
    database: checkDatabase(),
    ai: checkAI(),
    filesystem: checkFilesystem(),
  };

  // Determine overall status
  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  
  const hasError = Object.values(checks).some((check) => check.status === 'error');
  const hasWarning = Object.values(checks).some((check) => check.status === 'warning');

  if (hasError) {
    status = 'unhealthy';
  } else if (hasWarning) {
    status = 'degraded';
  }

  const health: HealthCheck = {
    status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '2.0.0-standalone',
    mode: 'standalone',
    checks,
    metrics: {
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
    },
  };

  const responseTime = Date.now() - startTime;

  // Return appropriate status code
  const httpStatus = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503;

  return NextResponse.json(health, {
    status: httpStatus,
    headers: {
      'Cache-Control': 'no-store, must-revalidate',
      'X-Response-Time': `${responseTime}ms`,
      'X-Health-Status': status,
    },
  });
}
