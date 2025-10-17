import { NextRequest, NextResponse } from "next/server";

export interface Subscription {
  id: string;
  userId: string;
  status: string;
  currentPeriodEnd?: Date | null;
}

export interface SubscriptionDatabaseAdapter {
  findUserByEmail(email: string): Promise<{ id: string } | null>;
  findSubscription(userId: string): Promise<Subscription | null>;
  findUserWithSubscription(email: string): Promise<{ id: string; subscription: Subscription | null } | null>;
}

export interface SubscriptionStatusRouteConfig {
  db: SubscriptionDatabaseAdapter;
}

export function createSubscriptionStatusRoute(
  config: SubscriptionStatusRouteConfig
) {
  const { db } = config;

  // Validate required configuration at initialization time
  if (!db) {
    throw new Error("Database instance is required");
  }

  return async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
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
        });
      }

      const hasAccess =
        result.subscription.status === "active" ||
        result.subscription.status === "trialing";

      return NextResponse.json({
        hasAccess,
        status: result.subscription.status,
        currentPeriodEnd: result.subscription.currentPeriodEnd,
      });
    } catch (error) {
      console.error("Subscription status check error:", error);
      return NextResponse.json(
        { error: "Failed to check subscription status" },
        { status: 500 }
      );
    }
  };
}
