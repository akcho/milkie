import { NextRequest, NextResponse } from "next/server";

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
 */
export interface SubscriptionDatabaseAdapter {
  /**
   * Finds a user by their email address
   * @param email - User's email address
   * @returns User object with id, or null if not found
   */
  findUserByEmail(email: string): Promise<{ id: string } | null>;

  /**
   * Finds a subscription by user ID
   * @param userId - The user's unique identifier
   * @returns Subscription object or null if not found
   */
  findSubscription(userId: string): Promise<Subscription | null>;

  /**
   * Optimized method to fetch user and subscription in a single query
   * @param email - User's email address
   * @returns User object with subscription, or null if user not found
   */
  findUserWithSubscription(email: string): Promise<{ id: string; subscription: Subscription | null } | null>;
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
 * Validates email format
 * @param email - Email string to validate
 * @returns true if email format is valid
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== "string") {
    return false;
  }

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
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
          code: SubscriptionErrorCode.EMAIL_REQUIRED
        } satisfies SubscriptionErrorResponse,
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        {
          error: "Invalid email format",
          code: SubscriptionErrorCode.INVALID_EMAIL
        } satisfies SubscriptionErrorResponse,
        { status: 400 }
      );
    }

    try {
      // Use optimized single-query method to fetch user + subscription together
      const result = await db.findUserWithSubscription(email);

      if (!result || !result.subscription) {
        return NextResponse.json({
          hasAccess: false,
          status: "no_subscription",
          code: SubscriptionErrorCode.NO_SUBSCRIPTION,
        });
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
          code: SubscriptionErrorCode.DATABASE_ERROR
        } satisfies SubscriptionErrorResponse,
        { status: 500 }
      );
    }
  };
}
