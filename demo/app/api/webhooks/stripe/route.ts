import { createWebhookRoute } from "@milkie/react/api";
import { stripe } from "@/lib/stripe";
import { webhookAdapter } from "@/lib/milkie-adapter";

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET environment variable is required");
}

export const POST = createWebhookRoute({
  stripe,
  db: webhookAdapter,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
});
