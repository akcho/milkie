import { NextRequest, NextResponse } from "next/server";

export interface Subscription {
  id: string;
  userId: string;
  status: string;
  currentPeriodEnd?: Date | null;
}

export interface SubscriptionDatabaseAdapter {
  findUserByEmail(email: string): Promise<{ id: string } | null>;
  findActiveSubscription(userId: string): Promise<Subscription | null>;
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
      const user = await db.findUserByEmail(email);

      if (!user) {
        return NextResponse.json({
          hasAccess: false,
          status: "no_subscription",
        });
      }

      // Check if user has an active subscription
      const activeSubscription = await db.findActiveSubscription(user.id);

      if (!activeSubscription) {
        return NextResponse.json({
          hasAccess: false,
          status: "no_subscription",
        });
      }

      const hasAccess =
        activeSubscription.status === "active" ||
        activeSubscription.status === "trialing";

      return NextResponse.json({
        hasAccess,
        status: activeSubscription.status,
        currentPeriodEnd: activeSubscription.currentPeriodEnd,
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
