import { createSubscriptionStatusRoute } from "milkie/api";
import { subscriptionAdapter } from "@/lib/milkie-adapter";

export const GET = createSubscriptionStatusRoute({
  db: subscriptionAdapter,
});
