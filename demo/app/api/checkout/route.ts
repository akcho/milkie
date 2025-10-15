import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { email, callbackUrl } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find or create user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    let customerId = user?.stripeCustomerId;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
      });
      customerId = customer.id;

      // Save or update user
      if (user) {
        await db
          .update(users)
          .set({ stripeCustomerId: customerId })
          .where(eq(users.id, user.id));
      } else {
        await db.insert(users).values({
          id: crypto.randomUUID(),
          email,
          stripeCustomerId: customerId,
        });
      }
    }

    // Use callbackUrl if provided, otherwise default to homepage
    const successUrl = callbackUrl
      ? `${process.env.NEXT_PUBLIC_APP_URL}${callbackUrl}?session_id={CHECKOUT_SESSION_ID}`
      : `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`;

    const cancelUrl = callbackUrl
      ? `${process.env.NEXT_PUBLIC_APP_URL}${callbackUrl}`
      : `${process.env.NEXT_PUBLIC_APP_URL}/`;

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
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
}
