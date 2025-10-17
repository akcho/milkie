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
export interface CheckoutDatabaseAdapter {
  findUserByEmail(email: string): Promise<User | null>;
  createUser(data: CreateUserData): Promise<User>;
  updateUser(userId: string, data: Partial<User>): Promise<void>;
}

export interface CheckoutRouteConfig {
  stripe: Stripe;
  db: CheckoutDatabaseAdapter;
  priceId: string;
  appUrl: string;
}

// Request body type
interface CheckoutRequestBody {
  email: string;
  callbackUrl?: string;
}

// Helper function to ensure user has a Stripe customer ID
async function ensureStripeCustomer(
  email: string,
  db: CheckoutDatabaseAdapter,
  stripe: Stripe
): Promise<string> {
  const user = await db.findUserByEmail(email);

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({ email });

  // Update existing user or create new one
  if (user) {
    await db.updateUser(user.id, { stripeCustomerId: customer.id });
  } else {
    await db.createUser({
      id: crypto.randomUUID(),
      email,
      stripeCustomerId: customer.id,
    });
  }

  return customer.id;
}

// Helper function to build checkout URLs
function buildCheckoutUrls(
  appUrl: string,
  callbackUrl?: string
): { successUrl: string; cancelUrl: string } {
  const successUrl = callbackUrl
    ? `${appUrl}${callbackUrl}?session_id={CHECKOUT_SESSION_ID}`
    : `${appUrl}/?session_id={CHECKOUT_SESSION_ID}`;

  const cancelUrl = callbackUrl ? `${appUrl}${callbackUrl}` : `${appUrl}/`;

  return { successUrl, cancelUrl };
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
      const { email, callbackUrl }: CheckoutRequestBody = await req.json();

      if (!email) {
        return NextResponse.json(
          { error: "Email is required" },
          { status: 400 }
        );
      }

      // Ensure user has a Stripe customer
      const customerId = await ensureStripeCustomer(email, db, stripe);

      // Build checkout URLs
      const { successUrl, cancelUrl } = buildCheckoutUrls(appUrl, callbackUrl);

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
        // Show test card info in test mode
        ...(priceId.startsWith("price_") && !priceId.includes("live_")
          ? {
              custom_text: {
                submit: {
                  message:
                    "Demo: Use card 4242 4242 4242 4242. All other details (expiry, CVC, ZIP, phone, etc.) can be fake.",
                },
              },
            }
          : {}),
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
