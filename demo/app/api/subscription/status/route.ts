import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        subscriptions: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        hasAccess: false,
        status: "no_subscription",
      });
    }

    // Check if user has an active subscription
    const activeSubscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, user.id),
    });

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
}
