import { createSubscriptionStatusRoute } from "@milkie/react/api";
import { subscriptionAdapter } from "@/lib/milkie-adapter";

export const GET = createSubscriptionStatusRoute({
  db: subscriptionAdapter,
});
