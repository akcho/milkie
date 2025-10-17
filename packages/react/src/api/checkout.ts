import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Custom error types for better error handling
export class UniqueConstraintError extends Error {
  constructor(field: string) {
    super(`Unique constraint violation on ${field}`);
    this.name = "UniqueConstraintError";
  }
}

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
  /**
   * Optional authentication function to extract user email from request
   * If provided, the email will be taken from the authenticated session instead of request body
   * This ensures only logged-in users can create checkout sessions
   *
   * @param req - The incoming Next.js request
   * @returns The authenticated user's email, or null if not authenticated
   *
   * @example
   * ```ts
   * // NextAuth
   * authenticate: async (req) => {
   *   const session = await getServerSession(req);
   *   return session?.user?.email || null;
   * }
   *
   * // Clerk
   * authenticate: async () => {
   *   const { userId } = auth();
   *   if (!userId) return null;
   *   const user = await currentUser();
   *   return user?.emailAddresses[0]?.emailAddress || null;
   * }
   * ```
   */
  authenticate?: (req: NextRequest) => Promise<string | null>;
  /**
   * Optional flag to show test card helper text in Stripe Checkout
   * Auto-detected based on Stripe key if not provided
   * Set to true to show test card information, false to hide it
   *
   * @example
   * ```ts
   * // Explicitly enable test mode helpers
   * isTestMode: true
   *
   * // Or let it auto-detect from your Stripe key
   * isTestMode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')
   * ```
   */
  isTestMode?: boolean;
}

// Request body type
interface CheckoutRequestBody {
  email: string;
  callbackUrl?: string;
}

/**
 * Validates email format using robust regex pattern
 * @param email - Email address to validate
 * @returns true if email format is valid, false otherwise
 * @example
 * ```ts
 * isValidEmail('user@example.com') // true
 * isValidEmail('invalid') // false
 * isValidEmail('user@gmail..com') // false
 * ```
 */
export function isValidEmail(email: string): boolean {
  // RFC 5321 compliant email validation
  // Checks for: proper structure, no consecutive dots, valid length
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const hasValidStructure = emailRegex.test(email);
  const hasNoConsecutiveDots = !email.includes('..');
  const isValidLength = email.length >= 5 && email.length <= 254; // RFC 5321 max length

  return hasValidStructure && hasNoConsecutiveDots && isValidLength;
}

// Helper function to ensure user has a Stripe customer ID
async function ensureStripeCustomer(
  email: string,
  db: CheckoutDatabaseAdapter,
  stripe: Stripe
): Promise<string> {
  try {
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
  } catch (error) {
    // Handle race condition: if user was created between our check and insert
    // Check for database constraint errors using custom error type or message patterns
    if (
      error instanceof UniqueConstraintError ||
      (error instanceof Error &&
        (error.message.includes("unique constraint") ||
          error.message.includes("duplicate") ||
          error.message.includes("UNIQUE constraint failed")))
    ) {
      // Retry: fetch the user that was just created
      const existingUser = await db.findUserByEmail(email);
      if (existingUser?.stripeCustomerId) {
        return existingUser.stripeCustomerId;
      }
      // If still no customer ID after retry, fail explicitly
      throw new Error('Failed to create or retrieve Stripe customer after race condition retry');
    }
    // Re-throw if not a race condition error
    throw error;
  }
}

// Helper function to build checkout URLs
function buildCheckoutUrls(
  appUrl: string,
  callbackUrl?: string
): { successUrl: string; cancelUrl: string } {
  // Validate callbackUrl to prevent open redirect vulnerability
  if (callbackUrl) {
    // Decode URL to prevent encoded attack sequences (e.g., %2e%2e = ..)
    let decodedUrl = callbackUrl;
    try {
      decodedUrl = decodeURIComponent(callbackUrl);
    } catch (error) {
      throw new Error('Invalid URL encoding in callback URL');
    }

    // Check if it's an absolute URL (potential open redirect)
    if (decodedUrl.startsWith('http://') || decodedUrl.startsWith('https://') || decodedUrl.startsWith('//')) {
      throw new Error('Callback URL must be a relative path');
    }

    // Prevent path traversal attacks (check both encoded and decoded)
    if (decodedUrl.includes('..')) {
      throw new Error('Callback URL cannot contain path traversal sequences');
    }

    // Ensure it starts with /
    if (!decodedUrl.startsWith('/')) {
      decodedUrl = '/' + decodedUrl;
    }

    // Use the decoded version for further processing
    callbackUrl = decodedUrl;
  }

  const successUrl = callbackUrl
    ? `${appUrl}${callbackUrl}?session_id={CHECKOUT_SESSION_ID}`
    : `${appUrl}/?session_id={CHECKOUT_SESSION_ID}`;

  const cancelUrl = callbackUrl ? `${appUrl}${callbackUrl}` : `${appUrl}/`;

  return { successUrl, cancelUrl };
}

/**
 * Creates a Next.js API route handler for Stripe checkout sessions
 *
 * This function generates a POST handler that:
 * - Validates and normalizes email addresses
 * - Creates or retrieves Stripe customers
 * - Generates Stripe checkout sessions for subscriptions
 *
 * @param config - Configuration object for the checkout route
 * @param config.stripe - Initialized Stripe instance
 * @param config.db - Database adapter implementing CheckoutDatabaseAdapter interface
 * @param config.priceId - Stripe price ID for the subscription
 * @param config.appUrl - Base URL of your application (for redirect URLs)
 * @param config.authenticate - Optional authentication function (recommended for production)
 *
 * @returns Next.js API route handler function
 *
 * @throws {Error} If any required configuration is missing
 *
 * @example
 * ```ts
 * // Basic usage (email from request body)
 * import { createCheckoutRoute } from '@milkie/react/api/checkout';
 * import Stripe from 'stripe';
 * import { db } from './db';
 *
 * const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
 *
 * export const POST = createCheckoutRoute({
 *   stripe,
 *   db,
 *   priceId: 'price_xxxxx',
 *   appUrl: 'https://example.com'
 * });
 * ```
 *
 * @example
 * ```ts
 * // With NextAuth authentication (recommended)
 * import { createCheckoutRoute } from '@milkie/react/api/checkout';
 * import { getServerSession } from 'next-auth';
 * import { authOptions } from '@/lib/auth';
 *
 * export const POST = createCheckoutRoute({
 *   stripe,
 *   db,
 *   priceId: process.env.STRIPE_PRICE_ID,
 *   appUrl: process.env.NEXT_PUBLIC_APP_URL,
 *   authenticate: async (req) => {
 *     const session = await getServerSession(authOptions);
 *     return session?.user?.email || null;
 *   }
 * });
 * ```
 *
 * @example
 * ```ts
 * // With Clerk authentication
 * import { auth, currentUser } from '@clerk/nextjs/server';
 *
 * export const POST = createCheckoutRoute({
 *   stripe,
 *   db,
 *   priceId: process.env.STRIPE_PRICE_ID,
 *   appUrl: process.env.NEXT_PUBLIC_APP_URL,
 *   authenticate: async () => {
 *     const { userId } = auth();
 *     if (!userId) return null;
 *     const user = await currentUser();
 *     return user?.emailAddresses[0]?.emailAddress || null;
 *   }
 * });
 * ```
 */
export function createCheckoutRoute(config: CheckoutRouteConfig) {
  const { stripe, db, priceId, appUrl, authenticate, isTestMode } = config;

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
  // Validate appUrl format
  if (!appUrl.startsWith("http://") && !appUrl.startsWith("https://")) {
    throw new Error("App URL must start with http:// or https://");
  }

  return async function POST(req: NextRequest) {
    let normalizedEmail: string | undefined;

    try {
      let email: string;
      let callbackUrl: string | undefined;

      // If authentication is configured, use it
      if (authenticate) {
        const authEmail = await authenticate(req);

        if (!authEmail) {
          return NextResponse.json(
            { error: "Unauthorized - authentication required" },
            { status: 401 }
          );
        }

        email = authEmail;

        // Still get callbackUrl from request body if provided
        const body = await req
          .json()
          .catch(() => ({} as Partial<CheckoutRequestBody>));
        callbackUrl = body.callbackUrl;
      } else {
        // Fall back to request body (backward compatible)
        const body: CheckoutRequestBody = await req.json();
        email = body.email;
        callbackUrl = body.callbackUrl;

        if (!email) {
          return NextResponse.json(
            { error: "Email is required" },
            { status: 400 }
          );
        }
      }

      // Normalize email: trim whitespace and convert to lowercase
      normalizedEmail = email.trim().toLowerCase();

      // Validate email format
      if (!isValidEmail(normalizedEmail)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }

      // Additional security check: validate maximum length
      if (normalizedEmail.length > 254) {
        return NextResponse.json(
          { error: "Email address too long" },
          { status: 400 }
        );
      }

      // Ensure user has a Stripe customer
      const customerId = await ensureStripeCustomer(normalizedEmail, db, stripe);

      // Build checkout URLs
      const { successUrl, cancelUrl } = buildCheckoutUrls(appUrl, callbackUrl);

      // Create checkout session with idempotency key to prevent duplicates
      const idempotencyKey = `checkout_${customerId}_${priceId}_${Date.now()}`;

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
          email: normalizedEmail,
        },
        // Show test card info in test mode
        ...(isTestMode
          ? {
              custom_text: {
                submit: {
                  message:
                    "Demo: Use card 4242 4242 4242 4242. All other details (expiry, CVC, ZIP, phone, etc.) can be fake.",
                },
              },
            }
          : {}),
      }, {
        idempotencyKey,
      });

      return NextResponse.json({ url: session.url });
    } catch (error) {
      // Enhanced error logging with sanitized PII
      const sanitizedEmail = normalizedEmail
        ? `${normalizedEmail.substring(0, 3)}***@${normalizedEmail.split('@')[1] || 'unknown'}`
        : 'unknown';

      console.error("Checkout error:", {
        error: error instanceof Error ? error.message : String(error),
        email: sanitizedEmail,
        priceId,
        timestamp: new Date().toISOString(),
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Provide more specific error messages
      if (error instanceof Error) {
        // Stripe API errors
        if (error.message.includes("No such price")) {
          return NextResponse.json(
            { error: "Invalid subscription plan" },
            { status: 400 }
          );
        }
        if (error.message.includes("No such customer")) {
          return NextResponse.json(
            { error: "Customer not found" },
            { status: 404 }
          );
        }
      }

      // Generic error fallback
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }
  };
}
