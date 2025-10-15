import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Development-only endpoint to reset subscription status for testing
 * DELETE /api/subscription/reset?email=user@example.com
 */
export async function DELETE(req: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is only available in development" },
      { status: 403 }
    );
  }

  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    // Find user
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete all subscriptions for this user
    await db.delete(subscriptions).where(eq(subscriptions.userId, user.id));

    return NextResponse.json({
      success: true,
      message: `All subscriptions deleted for ${email}`,
    });
  } catch (error) {
    console.error("Reset subscription error:", error);
    return NextResponse.json(
      { error: "Failed to reset subscription" },
      { status: 500 }
    );
  }
}
