import { NextRequest, NextResponse } from "next/server";
import { isValidEmail } from "./utils";

/**
 * Represents a user's subscription in the system
 */
export interface Subscription {
  /** Unique subscription identifier */
  id: string;
  /** User ID associated with this subscription */
  userId: string;
  /** Current subscription status (e.g., 'active', 'trialing', 'canceled') */
  status: string;
  /** End date of the current billing period */
  currentPeriodEnd?: Date | null;
}

/**
 * Database adapter interface for subscription operations.
 * Implement this interface to connect the subscription route to your database.
 *
 * Note: This interface uses a single optimized query method for performance.
 * If you need more granular database operations, you can implement them
 * in your adapter class and use them elsewhere in your application.
 */
export interface SubscriptionDatabaseAdapter {
  /**
   * Optimized method to fetch user and subscription in a single query
   * @param email - User's email address
   * @returns User object with subscription, or null if user not found
   */
  findUserWithSubscription(
    email: string
  ): Promise<{ id: string; subscription: Subscription | null } | null>;
}

/**
 * Configuration options for the subscription status route
 */
export interface SubscriptionStatusRouteConfig {
  /** Database adapter implementation */
  db: SubscriptionDatabaseAdapter;
  /**
   * Array of subscription statuses that grant access
   * @default ['active', 'trialing']
   */
  allowedStatuses?: string[];
}

/**
 * Error codes for subscription status checks
 */
export enum SubscriptionErrorCode {
  EMAIL_REQUIRED = "EMAIL_REQUIRED",
  INVALID_EMAIL = "INVALID_EMAIL",
  NO_SUBSCRIPTION = "NO_SUBSCRIPTION",
  DATABASE_ERROR = "DATABASE_ERROR",
}

/**
 * Response types for subscription status endpoint
 */
export interface SubscriptionStatusResponse {
  hasAccess: boolean;
  status: string;
  currentPeriodEnd?: Date | null;
}

export interface SubscriptionErrorResponse {
  error: string;
  code: SubscriptionErrorCode;
}

/**
 * Creates a subscription status route handler for Next.js applications.
 * This route checks if a user has an active subscription based on their email.
 *
 * @param config - Configuration object with database adapter and optional settings
 * @returns Next.js route handler function (GET)
 *
 * @example
 * ```typescript
 * // In your Next.js app/api/subscription/status/route.ts
 * import { createSubscriptionStatusRoute } from '@milkie/react';
 * import { db } from '@/lib/db';
 *
 * export const GET = createSubscriptionStatusRoute({
 *   db: {
 *     findUserWithSubscription: async (email) => {
 *       // Your database query implementation
 *       return await db.user.findUnique({
 *         where: { email },
 *         include: { subscription: true }
 *       });
 *     }
 *   }
 * });
 * ```
 */
export function createSubscriptionStatusRoute(
  config: SubscriptionStatusRouteConfig
) {
  const { db, allowedStatuses = ["active", "trialing"] } = config;

  // Validate required configuration at initialization time
  if (!db) {
    throw new Error("Database instance is required");
  }

  return async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        {
          error: "Email is required",
          code: SubscriptionErrorCode.EMAIL_REQUIRED,
        } satisfies SubscriptionErrorResponse,
        { status: 400 }
      );
    }

    // Normalize email: trim whitespace and convert to lowercase
    const normalizedEmail = email.trim().toLowerCase();

    // Validate email format
    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        {
          error: "Invalid email format",
          code: SubscriptionErrorCode.INVALID_EMAIL,
        } satisfies SubscriptionErrorResponse,
        { status: 400 }
      );
    }

    // Additional security check: validate maximum length
    if (normalizedEmail.length > 254) {
      return NextResponse.json(
        {
          error: "Email address too long",
          code: SubscriptionErrorCode.INVALID_EMAIL,
        } satisfies SubscriptionErrorResponse,
        { status: 400 }
      );
    }

    try {
      // Use optimized single-query method to fetch user + subscription together
      const result = await db.findUserWithSubscription(normalizedEmail);

      if (!result || !result.subscription) {
        return NextResponse.json({
          hasAccess: false,
          status: "no_subscription",
        } satisfies SubscriptionStatusResponse);
      }

      const hasAccess = allowedStatuses.includes(result.subscription.status);

      return NextResponse.json({
        hasAccess,
        status: result.subscription.status,
        currentPeriodEnd: result.subscription.currentPeriodEnd,
      } satisfies SubscriptionStatusResponse);
    } catch (error) {
      console.error("Subscription status check error:", error);
      return NextResponse.json(
        {
          error: "Failed to check subscription status",
          code: SubscriptionErrorCode.DATABASE_ERROR,
        } satisfies SubscriptionErrorResponse,
        { status: 500 }
      );
    }
  };
}
