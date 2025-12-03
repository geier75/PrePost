// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get user by email
        const user = await supabaseAdmin.getUserByEmail(session.customer_email!);
        if (!user) {
          throw new Error('User not found');
        }

        // Create or update subscription
        await supabaseAdmin.upsertSubscription({
          user_id: user.id,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: 'active',
          tier: getPlanFromPriceId(session.metadata?.priceId),
          current_period_start: new Date(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

        // Log event
        await supabaseAdmin.logAuditEvent({
          user_id: user.id,
          action: 'subscription_created',
          resource_type: 'subscription',
          details: {
            session_id: session.id,
            amount: session.amount_total,
            currency: session.currency,
          },
        });
        
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update subscription in database
        await supabaseAdmin.updateSubscriptionByStripeId(
          subscription.id,
          {
            status: subscription.status as any,
            current_period_start: new Date(subscription.current_period_start * 1000),
            current_period_end: new Date(subscription.current_period_end * 1000),
            cancel_at_period_end: subscription.cancel_at_period_end,
          }
        );
        
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Mark subscription as canceled
        await supabaseAdmin.updateSubscriptionByStripeId(
          subscription.id,
          {
            status: 'canceled',
            tier: 'free',
          }
        );
        
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Update subscription status
        if (invoice.subscription) {
          await supabaseAdmin.updateSubscriptionByStripeId(
            invoice.subscription as string,
            {
              status: 'active',
            }
          );
        }
        
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Update subscription status
        if (invoice.subscription) {
          await supabaseAdmin.updateSubscriptionByStripeId(
            invoice.subscription as string,
            {
              status: 'past_due',
            }
          );

          // Send email notification
          // TODO: Implement email notification
        }
        
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

function getPlanFromPriceId(priceId?: string): 'free' | 'pro' | 'premium' | 'enterprise' {
  if (!priceId) return 'free';
  
  const priceMap: Record<string, 'pro' | 'premium' | 'enterprise'> = {
    [process.env.STRIPE_PRICE_ID_PRO!]: 'pro',
    [process.env.STRIPE_PRICE_ID_PREMIUM!]: 'premium',
    [process.env.STRIPE_PRICE_ID_ENTERPRISE!]: 'enterprise',
  };
  
  return priceMap[priceId] || 'free';
}