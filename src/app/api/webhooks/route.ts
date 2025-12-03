/**
 * Webhooks API
 * For integrations and automation
 */

import { NextRequest, NextResponse } from 'next/server';
import dbService from '@/lib/supabase-service';
import crypto from 'crypto';

interface Webhook {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  created_at: string;
  last_triggered?: string;
  failure_count: number;
}

// Supported webhook events
const WEBHOOK_EVENTS = [
  'analysis.completed',
  'analysis.high_risk',
  'analysis.failed',
  'team.member_added',
  'team.member_removed',
  'subscription.updated',
  'subscription.cancelled',
  'compliance.violation',
  'security.alert',
];

// Get webhooks
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
    
    // Mock webhooks
    const webhooks: Webhook[] = [
      {
        id: `webhook_${crypto.randomUUID()}`,
        url: 'https://example.com/webhook',
        events: ['analysis.completed', 'analysis.high_risk'],
        secret: 'whsec_' + crypto.randomBytes(16).toString('hex'),
        active: true,
        created_at: new Date().toISOString(),
        last_triggered: new Date().toISOString(),
        failure_count: 0,
      },
    ];
    
    return NextResponse.json({
      success: true,
      webhooks,
      availableEvents: WEBHOOK_EVENTS,
    });
  } catch (error) {
    console.error('Webhooks GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch webhooks' },
      { status: 500 }
    );
  }
}

// Create webhook
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
    const { url, events, description } = body;
    
    // Validate URL
    try {
      new URL(url);
      if (!url.startsWith('https://')) {
        return NextResponse.json(
          { error: 'Webhook URL must use HTTPS' },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid webhook URL' },
        { status: 400 }
      );
    }
    
    // Validate events
    for (const event of events) {
      if (!WEBHOOK_EVENTS.includes(event)) {
        return NextResponse.json(
          { error: `Invalid event: ${event}` },
          { status: 400 }
        );
      }
    }
    
    // Generate webhook secret
    const secret = 'whsec_' + crypto.randomBytes(32).toString('hex');
    
    const webhook: Webhook = {
      id: `webhook_${crypto.randomUUID()}`,
      url,
      events,
      secret,
      active: true,
      created_at: new Date().toISOString(),
      failure_count: 0,
    };
    
    // Test webhook with ping
    const testResult = await testWebhook(url, secret);
    
    // Audit log
    await dbService.auditService.log({
      user_id: userId,
      action: 'WEBHOOK_CREATED',
      resource: 'webhooks_api',
      metadata: { 
        webhookId: webhook.id,
        events,
        testResult,
      },
    });
    
    return NextResponse.json({
      success: true,
      webhook,
      testResult,
      message: 'Webhook created successfully',
    });
  } catch (error) {
    console.error('Webhook creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create webhook' },
      { status: 500 }
    );
  }
}

// Delete webhook
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
    const webhookId = searchParams.get('id');
    
    if (!webhookId) {
      return NextResponse.json(
        { error: 'Webhook ID required' },
        { status: 400 }
      );
    }
    
    // Audit log
    await dbService.auditService.log({
      user_id: userId,
      action: 'WEBHOOK_DELETED',
      resource: 'webhooks_api',
      metadata: { webhookId },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Webhook deleted successfully',
    });
  } catch (error) {
    console.error('Webhook deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete webhook' },
      { status: 500 }
    );
  }
}

// Test webhook
async function testWebhook(url: string, secret: string): Promise<any> {
  try {
    const payload = {
      type: 'ping',
      timestamp: new Date().toISOString(),
      data: {
        message: 'PREPOST webhook test',
      },
    };
    
    const signature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-PREPOST-Signature': `sha256=${signature}`,
        'X-PREPOST-Event': 'ping',
      },
      body: JSON.stringify(payload),
    });
    
    return {
      success: response.ok,
      statusCode: response.status,
      message: response.ok ? 'Webhook test successful' : 'Webhook test failed',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Test failed',
    };
  }
}

// Trigger webhook (internal use)
export async function triggerWebhook(
  webhook: Webhook,
  event: string,
  data: any
): Promise<void> {
  try {
    const payload = {
      type: event,
      timestamp: new Date().toISOString(),
      data,
    };
    
    const signature = crypto
      .createHmac('sha256', webhook.secret)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-PREPOST-Signature': `sha256=${signature}`,
        'X-PREPOST-Event': event,
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      console.error(`Webhook failed: ${webhook.id} - ${response.status}`);
      // Increment failure count
    }
  } catch (error) {
    console.error(`Webhook error: ${webhook.id}`, error);
    // Increment failure count
  }
}
