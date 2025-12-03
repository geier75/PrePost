// src/services/stripe/payment-service.ts
import Stripe from 'stripe';
import { getSupabaseClient } from '@/lib/supabase/client';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

export interface PriceConfig {
  free: { price: number; stripePriceId: null };
  pro: { price: number; stripePriceId: string };
  premium: { price: number; stripePriceId: string };
  enterprise: { price: number; stripePriceId: string | null };
}

export const PRICE_CONFIG: PriceConfig = {
  free: { price: 0, stripePriceId: null },
  pro: { price: 999, stripePriceId: process.env.STRIPE_PRICE_ID_PRO || 'price_pro' },
  premium: { price: 2999, stripePriceId: process.env.STRIPE_PRICE_ID_PREMIUM || 'price_premium' },
  enterprise: { price: 49900, stripePriceId: null }, // Custom pricing
};

export class StripeService {
  /**
   * Create a new Stripe customer
   */
  async createCustomer(email: string, name?: string, userId?: string): Promise<Stripe.Customer> {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId: userId || '',
      },
    });

    return customer;
  }

  /**
   * Create a checkout session for subscription
   */
  async createCheckoutSession(
    customerId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string,
    userId: string,
    tier: 'pro' | 'premium'
  ): Promise<Stripe.Checkout.Session> {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        tier,
      },
      subscription_data: {
        trial_period_days: tier === 'pro' ? 7 : 14, // 7 days for Pro, 14 for Premium
        metadata: {
          userId,
          tier,
        },
      },
    });

    return session;
  }

  /**
   * Create a billing portal session
   */
  async createBillingPortalSession(
    customerId: string,
    returnUrl: string
  ): Promise<Stripe.BillingPortal.Session> {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session;
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(
    subscriptionId: string,
    cancelAtPeriodEnd: boolean = true
  ): Promise<Stripe.Subscription | null> {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: cancelAtPeriodEnd,
      });
      return subscription;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return null;
    }
  }

  /**
   * Resume a canceled subscription
   */
  async resumeSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });
      return subscription;
    } catch (error) {
      console.error('Error resuming subscription:', error);
      return null;
    }
  }

  /**
   * Update subscription (upgrade/downgrade)
   */
  async updateSubscription(
    subscriptionId: string,
    newPriceId: string
  ): Promise<Stripe.Subscription | null> {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [
          {
            id: subscription.items.data[0].id,
            price: newPriceId,
          },
        ],
        proration_behavior: 'always_invoice', // Create prorated invoice immediately
      });

      return updatedSubscription;
    } catch (error) {
      console.error('Error updating subscription:', error);
      return null;
    }
  }

  /**
   * Handle webhook events
   */
  async handleWebhookEvent(rawBody: string, signature: string): Promise<void> {
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      throw new Error('Invalid webhook signature');
    }

    const supabase = getSupabaseClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'subscription') {
          const userId = session.metadata?.userId;
          const tier = session.metadata?.tier as 'pro' | 'premium';
          
          if (userId && tier && session.subscription) {
            // Update user's subscription in database
            await supabase
              .from('subscriptions')
              .upsert({
                user_id: userId,
                tier,
                status: 'active',
                stripe_customer_id: session.customer as string,
                stripe_subscription_id: session.subscription as string,
                current_period_start: new Date().toISOString(),
                current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              });
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        const tier = subscription.metadata?.tier as 'pro' | 'premium' | 'enterprise';
        
        if (userId) {
          await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              tier: tier || 'free',
              status: this.mapStripeStatus(subscription.status),
              stripe_customer_id: subscription.customer as string,
              stripe_subscription_id: subscription.id,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
            });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        
        if (userId) {
          await supabase
            .from('subscriptions')
            .update({
              status: 'canceled',
              cancel_at_period_end: true,
            })
            .eq('stripe_subscription_id', subscription.id);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        // Log successful payment
        console.log('Payment succeeded for invoice:', invoice.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        
        if (subscriptionId) {
          await supabase
            .from('subscriptions')
            .update({
              status: 'past_due',
            })
            .eq('stripe_subscription_id', subscriptionId);
        }
        
        // TODO: Send email notification to user
        console.error('Payment failed for invoice:', invoice.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  /**
   * Map Stripe subscription status to our database enum
   */
  private mapStripeStatus(stripeStatus: Stripe.Subscription.Status): 'active' | 'canceled' | 'past_due' | 'trialing' {
    const statusMap: Record<Stripe.Subscription.Status, 'active' | 'canceled' | 'past_due' | 'trialing'> = {
      active: 'active',
      canceled: 'canceled',
      incomplete: 'past_due',
      incomplete_expired: 'canceled',
      past_due: 'past_due',
      trialing: 'trialing',
      unpaid: 'past_due',
      paused: 'canceled',
    };

    return statusMap[stripeStatus] || 'canceled';
  }

  /**
   * Get customer's invoices
   */
  async getInvoices(customerId: string, limit: number = 10): Promise<Stripe.Invoice[]> {
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit,
    });

    return invoices.data;
  }

  /**
   * Get usage records for metered billing
   */
  async createUsageRecord(
    subscriptionItemId: string,
    quantity: number,
    timestamp?: number
  ): Promise<Stripe.UsageRecord> {
    const usageRecord = await stripe.subscriptionItems.createUsageRecord(
      subscriptionItemId,
      {
        quantity,
        timestamp: timestamp || Math.floor(Date.now() / 1000),
        action: 'increment',
      }
    );

    return usageRecord;
  }
}

// Export singleton instance
export const stripeService = new StripeService();