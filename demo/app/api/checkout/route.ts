import { createCheckoutRoute } from "@milkie/react/api";
import { stripe } from "@/lib/stripe";
import { checkoutAdapter } from "@/lib/milkie-adapter";

if (!process.env.STRIPE_PRICE_ID) {
  throw new Error("STRIPE_PRICE_ID environment variable is required");
}

if (!process.env.NEXT_PUBLIC_APP_URL) {
  throw new Error("NEXT_PUBLIC_APP_URL environment variable is required");
}

export const POST = createCheckoutRoute({
  stripe,
  db: checkoutAdapter,
  priceId: process.env.STRIPE_PRICE_ID,
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
});
