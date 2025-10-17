import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * Subscription data structure for database operations
 */
export interface SubscriptionData {
  id: string;
  userId: string;
  stripeCustomerId: string;
  status: string;
  priceId: string;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  updatedAt: Date;
  /**
   * Timestamp from Stripe indicating when the subscription was originally created.
   * This value is sourced from Stripe's subscription.created field and remains constant.
   */
  createdAt: Date;
}

/**
 * Database adapter interface for webhook operations.
 * Implement this interface to connect the webhook route to your database.
 */
export interface WebhookDatabaseAdapter {
  findUserByCustomerId(customerId: string): Promise<{ id: string } | null>;
  upsertSubscription(data: SubscriptionData): Promise<void>;
  updateSubscriptionStatus(
    subscriptionId: string,
    status: string
  ): Promise<void>;
}

/**
 * Configuration options for the webhook route
 */
export interface WebhookRouteConfig {
  /** Initialized Stripe instance */
  stripe: Stripe;
  /** Database adapter implementation */
  db: WebhookDatabaseAdapter;
  /** Stripe webhook signing secret */
  webhookSecret: string;
}

/**
 * Creates a Stripe webhook handler for Next.js applications.
 * Handles subscription lifecycle events from Stripe.
 *
 * @param config - Configuration object for the webhook route
 * @returns Next.js route handler function (POST)
 *
 * @throws {Error} If any required configuration is missing
 *
 * @example
 * ```ts
 * // In your Next.js app/api/webhooks/stripe/route.ts
 * import { createWebhookRoute } from '@milkie/react/api/webhooks';
 * import Stripe from 'stripe';
 * import { db } from '@/lib/db';
 *
 * const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
 *
 * export const POST = createWebhookRoute({
 *   stripe,
 *   db,
 *   webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
 * });
 * ```
 */
export function createWebhookRoute(config: WebhookRouteConfig) {
  const { stripe, db, webhookSecret } = config;

  // Validate required configuration at initialization time
  if (!stripe) {
    throw new Error("Stripe instance is required");
  }
  if (!db) {
    throw new Error("Database instance is required");
  }
  if (!webhookSecret) {
    throw new Error("Webhook secret is required");
  }

  return async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      console.error("Webhook signature verification failed:", error);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;

          if (session.mode === "subscription" && session.subscription) {
            const subscriptionId = getSubscriptionId(session.subscription);
            const subscription = await stripe.subscriptions.retrieve(
              subscriptionId
            );

            await handleSubscriptionUpdate(subscription, db);
          }
          break;
        }

        case "customer.subscription.updated":
        case "customer.subscription.created": {
          const subscription = event.data.object;
          await handleSubscriptionUpdate(subscription, db);
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object;
          await db.updateSubscriptionStatus(subscription.id, "canceled");
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return NextResponse.json({ received: true });
    } catch (error) {
      console.error("Webhook handler error:", error);
      return NextResponse.json(
        { error: "Webhook handler failed" },
        { status: 500 }
      );
    }
  };
}

/**
 * Helper function to extract customer ID from a customer reference
 */
function getCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer
): string {
  return typeof customer === "string" ? customer : customer.id;
}

/**
 * Helper function to extract subscription ID from a subscription reference
 */
function getSubscriptionId(subscription: string | Stripe.Subscription): string {
  return typeof subscription === "string" ? subscription : subscription.id;
}

/**
 * Helper function to handle subscription creation and updates
 */
async function handleSubscriptionUpdate(
  subscription: Stripe.Subscription,
  db: WebhookDatabaseAdapter
) {
  const customerId = getCustomerId(subscription.customer);

  const user = await db.findUserByCustomerId(customerId);

  if (!user) {
    throw new Error(`User not found for customer ${customerId}`);
  }

  const firstItem = subscription.items.data[0];

  const subscriptionData: SubscriptionData = {
    id: subscription.id,
    userId: user.id,
    stripeCustomerId: customerId,
    status: subscription.status,
    priceId: firstItem.price.id,
    // Note: current_period_end exists on SubscriptionItem, not on Subscription itself
    currentPeriodEnd: firstItem.current_period_end
      ? new Date(firstItem.current_period_end * 1000)
      : null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    updatedAt: new Date(),
    // Use Stripe's creation timestamp - this will be the same value on updates
    createdAt: new Date(subscription.created * 1000),
  };

  await db.upsertSubscription(subscriptionData);
}
