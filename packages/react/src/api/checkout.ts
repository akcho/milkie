import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Database-agnostic types
export interface User {
  id: string;
  email: string;
  stripeCustomerId?: string | null;
}

export interface CreateUserData {
  id: string;
  email: string;
  stripeCustomerId: string;
}

// Database adapter interface - users implement this for their DB
export interface DatabaseAdapter {
  findUserByEmail(email: string): Promise<User | null>;
  createUser(data: CreateUserData): Promise<User>;
  updateUser(userId: string, data: Partial<User>): Promise<void>;
}

export interface CheckoutRouteConfig {
  stripe: Stripe;
  db: DatabaseAdapter;
  priceId: string;
  appUrl: string;
}

export function createCheckoutRoute(config: CheckoutRouteConfig) {
  const { stripe, db, priceId, appUrl } = config;

  // Validate required configuration at initialization time
  if (!stripe) {
    throw new Error("Stripe instance is required");
  }
  if (!db) {
    throw new Error("Database instance is required");
  }
  if (!priceId) {
    throw new Error("Stripe price ID is required");
  }
  if (!appUrl) {
    throw new Error("App URL is required");
  }

  return async function POST(req: NextRequest) {
    try {
      const { email, callbackUrl } = await req.json();

      if (!email) {
        return NextResponse.json(
          { error: "Email is required" },
          { status: 400 }
        );
      }

      // Find or create user
      const user = await db.findUserByEmail(email);

      let customerId = user?.stripeCustomerId;

      // Create Stripe customer if doesn't exist
      if (!customerId) {
        const customer = await stripe.customers.create({
          email,
        });
        customerId = customer.id;

        // Save or update user
        if (user) {
          await db.updateUser(user.id, { stripeCustomerId: customerId });
        } else {
          await db.createUser({
            id: crypto.randomUUID(),
            email,
            stripeCustomerId: customerId,
          });
        }
      }

      // Use callbackUrl if provided, otherwise default to homepage
      const successUrl = callbackUrl
        ? `${appUrl}${callbackUrl}?session_id={CHECKOUT_SESSION_ID}`
        : `${appUrl}/?session_id={CHECKOUT_SESSION_ID}`;

      const cancelUrl = callbackUrl ? `${appUrl}${callbackUrl}` : `${appUrl}/`;

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          email,
        },
      });

      return NextResponse.json({ url: session.url });
    } catch (error) {
      console.error("Checkout error:", error);
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }
  };
}
