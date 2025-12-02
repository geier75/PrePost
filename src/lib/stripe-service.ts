/**
 * PREPOST Stripe Payment Service
 * DSGVO & PCI-DSS konform
 */

import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

// Product & Price IDs
export const PRODUCTS = {
  FREE: {
    name: 'Free',
    priceMonthly: null,
    priceYearly: null,
    features: ['10 Analysen/Tag', 'Basis-Schutz', 'Standard Support'],
  },
  PRO: {
    name: 'Pro',
    priceMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly',
    priceYearly: process.env.STRIPE_PRICE_PRO_YEARLY || 'price_pro_yearly',
    features: ['Unbegrenzte Analysen', 'Erweiterte KI', 'Priority Support', 'Export'],
  },
  PREMIUM: {
    name: 'Premium',
    priceMonthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || 'price_premium_monthly',
    priceYearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY || 'price_premium_yearly',
    features: ['Alles aus Pro', 'Team-Features', 'API-Zugang', 'Dedizierter Support'],
  },
  POLITICIAN: {
    name: 'Politician Shield',
    priceMonthly: process.env.STRIPE_PRICE_POLITICIAN || 'price_politician',
    priceYearly: null,
    features: ['24/7 Hotline', 'Krisen-Management', 'Lösch-Garantie', 'Anwalt-Support'],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    priceMonthly: 'custom',
    priceYearly: 'custom',
    features: ['Custom Solutions', 'On-Premise', 'SLA 99.99%', 'Dedicated Team'],
  },
};

/**
 * Create Checkout Session (DSGVO-konform)
 */
export async function createCheckoutSession({
  userId,
  email,
  priceId,
  successUrl,
  cancelUrl,
  metadata = {},
  gdprConsent = false,
}: {
  userId: string;
  email: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
  gdprConsent: boolean;
}): Promise<string> {
  if (!gdprConsent) {
    throw new Error('GDPR consent is required for payment processing');
  }

  try {
    // Create or get customer
    const customer = await getOrCreateCustomer(userId, email);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card', 'sepa_debit', 'giropay', 'sofort'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      tax_id_collection: {
        enabled: true,
      },
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
      metadata: {
        userId,
        gdprConsent: 'true',
        gdprTimestamp: new Date().toISOString(),
        ...metadata,
      },
      subscription_data: {
        metadata: {
          userId,
          gdprConsent: 'true',
        },
        trial_period_days: 14,
      },
      consent_collection: {
        terms_of_service: 'required',
      },
      locale: 'de',
    });

    // Log for audit (DSGVO requirement)
    await logPaymentAudit({
      action: 'CHECKOUT_CREATED',
      userId,
      sessionId: session.id,
      priceId,
      timestamp: new Date().toISOString(),
    });

    return session.url || '';
  } catch (error) {
    console.error('Checkout session creation failed:', error);
    throw error;
  }
}

/**
 * Create Customer Portal Session
 */
export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string> {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
      locale: 'de',
    });

    return session.url;
  } catch (error) {
    console.error('Portal session creation failed:', error);
    throw error;
  }
}

/**
 * Cancel Subscription (DSGVO Art. 7 - Widerruf)
 */
export async function cancelSubscription(
  subscriptionId: string,
  immediately = false,
  reason?: string
): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: !immediately,
      cancellation_details: {
        comment: reason || 'User requested cancellation',
      },
    });

    if (immediately) {
      await stripe.subscriptions.cancel(subscriptionId);
    }

    // Log for DSGVO compliance
    await logPaymentAudit({
      action: 'SUBSCRIPTION_CANCELLED',
      subscriptionId,
      immediately,
      reason,
      timestamp: new Date().toISOString(),
    });

    return subscription;
  } catch (error) {
    console.error('Subscription cancellation failed:', error);
    throw error;
  }
}

/**
 * Get or Create Customer
 */
async function getOrCreateCustomer(
  userId: string,
  email: string
): Promise<Stripe.Customer> {
  try {
    // Check if customer exists
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      return customers.data[0];
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email,
      metadata: {
        userId,
        gdprConsent: 'true',
        consentDate: new Date().toISOString(),
      },
      preferred_locales: ['de'],
      tax_exempt: 'none',
    });

    return customer;
  } catch (error) {
    console.error('Customer creation failed:', error);
    throw error;
  }
}

/**
 * Handle Webhook Events (ISO 27001 compliant)
 */
export async function handleWebhook(
  body: string,
  signature: string
): Promise<void> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  
  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    // Log all events for audit
    await logPaymentAudit({
      action: 'WEBHOOK_RECEIVED',
      eventType: event.type,
      eventId: event.id,
      timestamp: new Date().toISOString(),
    });

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Webhook processing failed:', error);
    throw error;
  }
}

/**
 * Get Usage Records for Metered Billing
 */
export async function reportUsage(
  subscriptionItemId: string,
  quantity: number,
  timestamp?: number
): Promise<Stripe.UsageRecord> {
  try {
    const usageRecord = await stripe.subscriptionItems.createUsageRecord(
      subscriptionItemId,
      {
        quantity,
        timestamp: timestamp || Math.floor(Date.now() / 1000),
        action: 'set',
      }
    );

    return usageRecord;
  } catch (error) {
    console.error('Usage reporting failed:', error);
    throw error;
  }
}

/**
 * Create Invoice for Enterprise Customers
 */
export async function createInvoice({
  customerId,
  items,
  dueDate,
  metadata = {},
}: {
  customerId: string;
  items: Array<{ price: string; quantity: number }>;
  dueDate: Date;
  metadata?: Record<string, string>;
}): Promise<Stripe.Invoice> {
  try {
    const invoice = await stripe.invoices.create({
      customer: customerId,
      collection_method: 'send_invoice',
      days_until_due: Math.floor((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      metadata,
      custom_fields: [
        {
          name: 'Leistungszeitraum',
          value: new Date().toLocaleDateString('de-DE'),
        },
        {
          name: 'Steuernummer',
          value: process.env.COMPANY_TAX_ID || '',
        },
      ],
      footer: 'Vielen Dank für Ihr Vertrauen in PREPOST.',
    });

    // Add line items
    for (const item of items) {
      await stripe.invoiceItems.create({
        customer: customerId,
        invoice: invoice.id,
        price: item.price,
        quantity: item.quantity,
      });
    }

    // Finalize and send
    await stripe.invoices.finalizeInvoice(invoice.id);
    await stripe.invoices.sendInvoice(invoice.id);

    return invoice;
  } catch (error) {
    console.error('Invoice creation failed:', error);
    throw error;
  }
}

/**
 * Issue Refund (DSGVO compliant)
 */
export async function issueRefund(
  paymentIntentId: string,
  amount?: number,
  reason?: string
): Promise<Stripe.Refund> {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount,
      reason: 'requested_by_customer',
      metadata: {
        gdprCompliant: 'true',
        userReason: reason || 'No reason provided',
        refundDate: new Date().toISOString(),
      },
    });

    await logPaymentAudit({
      action: 'REFUND_ISSUED',
      paymentIntentId,
      refundId: refund.id,
      amount: refund.amount,
      reason,
      timestamp: new Date().toISOString(),
    });

    return refund;
  } catch (error) {
    console.error('Refund processing failed:', error);
    throw error;
  }
}

/**
 * Event Handlers
 */
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) return;

  // Update user subscription in database
  console.log(`Checkout completed for user ${userId}`);
  
  // TODO: Update Supabase
  // await updateUserSubscription(userId, session.subscription);
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log(`Subscription created: ${subscription.id}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log(`Subscription updated: ${subscription.id}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log(`Subscription deleted: ${subscription.id}`);
}

async function handlePaymentSuccess(invoice: Stripe.Invoice) {
  console.log(`Payment successful: ${invoice.id}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log(`Payment failed: ${invoice.id}`);
  
  // Send payment retry email
  // TODO: Implement email notification
}

/**
 * Audit Logging for ISO 27001
 */
async function logPaymentAudit(data: any): Promise<void> {
  console.log('[PAYMENT AUDIT]', data);
  
  // TODO: Write to Supabase audit_logs table
  // await supabase.from('payment_audit_logs').insert(data);
}

/**
 * Export service functions
 */
export default {
  createCheckoutSession,
  createPortalSession,
  cancelSubscription,
  handleWebhook,
  reportUsage,
  createInvoice,
  issueRefund,
  PRODUCTS,
};
