import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export interface SubscriptionData {
  id: string;
  userId: string;
  stripeCustomerId: string;
  status: string;
  priceId: string;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  updatedAt: Date;
  createdAt?: Date;
}

export interface WebhookDatabaseAdapter {
  findUserByCustomerId(customerId: string): Promise<{ id: string } | null>;
  findSubscription(subscriptionId: string): Promise<{ id: string } | null>;
  upsertSubscription(data: SubscriptionData): Promise<void>;
  updateSubscriptionStatus(subscriptionId: string, status: string): Promise<void>;
}

export interface WebhookRouteConfig {
  stripe: Stripe;
  db: WebhookDatabaseAdapter;
  webhookSecret: string;
}

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
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;

          if (session.mode === "subscription" && session.subscription) {
            const subscription = await stripe.subscriptions.retrieve(
              session.subscription as string
            );

            await handleSubscriptionUpdate(subscription, db);
          }
          break;
        }

        case "customer.subscription.updated":
        case "customer.subscription.created": {
          const subscription = event.data.object as Stripe.Subscription;
          await handleSubscriptionUpdate(subscription, db);
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          await handleSubscriptionDeleted(subscription, db);
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

async function handleSubscriptionUpdate(
  subscription: Stripe.Subscription,
  db: WebhookDatabaseAdapter
) {
  const customerId = subscription.customer as string;

  // Find user by Stripe customer ID
  const user = await db.findUserByCustomerId(customerId);

  if (!user) {
    console.error(`User not found for customer ${customerId}`);
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sub = subscription as any;

  // Get current_period_end from subscription items if not at top level
  const currentPeriodEnd =
    sub.current_period_end ||
    subscription.items.data[0]?.current_period_end;

  const subscriptionData: SubscriptionData = {
    id: subscription.id,
    userId: user.id,
    stripeCustomerId: customerId,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
    currentPeriodEnd: currentPeriodEnd
      ? new Date(currentPeriodEnd * 1000)
      : null,
    cancelAtPeriodEnd: sub.cancel_at_period_end || false,
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  await db.upsertSubscription(subscriptionData);
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  db: WebhookDatabaseAdapter
) {
  await db.updateSubscriptionStatus(subscription.id, "canceled");
}
