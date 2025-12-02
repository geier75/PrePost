/**
 * Stripe Checkout API
 * DSGVO & PCI-DSS compliant
 */

import { NextRequest, NextResponse } from 'next/server';
import stripeService from '@/lib/stripe-service';
import dbService from '@/lib/supabase-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      planId,
      billingPeriod,
      userId,
      email,
      gdprConsent,
      timestamp,
    } = body;

    // Validate GDPR consent
    if (!gdprConsent) {
      return NextResponse.json(
        { error: 'GDPR consent is required for payment processing' },
        { status: 400 }
      );
    }

    // Validate plan
    const validPlans = ['pro', 'premium', 'politician', 'enterprise'];
    if (!validPlans.includes(planId)) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Get price ID based on plan and billing period
    let priceId: string | null = null;
    
    if (planId === 'pro') {
      priceId = billingPeriod === 'yearly' 
        ? stripeService.PRODUCTS.PRO.priceYearly
        : stripeService.PRODUCTS.PRO.priceMonthly;
    } else if (planId === 'premium') {
      priceId = billingPeriod === 'yearly'
        ? stripeService.PRODUCTS.PREMIUM.priceYearly
        : stripeService.PRODUCTS.PREMIUM.priceMonthly;
    } else if (planId === 'politician') {
      priceId = stripeService.PRODUCTS.POLITICIAN.priceMonthly;
    }

    if (!priceId || priceId === 'custom') {
      return NextResponse.json(
        { 
          error: 'Please contact sales for enterprise pricing',
          contactEmail: 'sales@prepost.ai'
        },
        { status: 400 }
      );
    }

    // Log consent for GDPR
    await dbService.consentService.logConsent({
      user_id: userId,
      consent_type: 'payment_processing',
      consent_given: true,
      consent_version: '1.0',
    });

    // Create checkout session
    const sessionUrl = await stripeService.createCheckoutSession({
      userId,
      email,
      priceId,
      successUrl: `${process.env.APP_URL}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.APP_URL}/pricing?payment=cancelled`,
      metadata: {
        planId,
        billingPeriod,
        gdprConsentTimestamp: timestamp,
      },
      gdprConsent: true,
    });

    if (!sessionUrl) {
      throw new Error('Failed to create checkout session');
    }

    // Audit log for compliance
    await dbService.auditService.log({
      user_id: userId,
      action: 'CHECKOUT_SESSION_CREATED',
      resource: 'stripe_checkout',
      metadata: {
        planId,
        billingPeriod,
        priceId,
      },
    });

    return NextResponse.json({
      success: true,
      url: sessionUrl,
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Handle Stripe webhooks
export async function PUT(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      );
    }

    // Process webhook
    await stripeService.handleWebhook(body, signature);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}
