import { eq } from "drizzle-orm";
import type {
  CheckoutDatabaseAdapter,
  SubscriptionDatabaseAdapter,
  WebhookDatabaseAdapter,
  CreateUserData,
  SubscriptionData,
} from "@milkie/react/api";
import { db } from "./db";
import * as schema from "./db/schema";

// Drizzle adapter for checkout routes
export const checkoutAdapter: CheckoutDatabaseAdapter = {
  async findUserByEmail(email: string) {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
    return user || null;
  },

  async createUser(data: CreateUserData) {
    const [user] = await db.insert(schema.users).values(data).returning();
    return user;
  },

  async updateUser(userId: string, data) {
    await db
      .update(schema.users)
      .set(data)
      .where(eq(schema.users.id, userId));
  },
};

// Drizzle adapter for subscription status routes
export const subscriptionAdapter: SubscriptionDatabaseAdapter = {
  async findUserByEmail(email: string) {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
    return user || null;
  },

  async findActiveSubscription(userId: string) {
    const subscription = await db.query.subscriptions.findFirst({
      where: eq(schema.subscriptions.userId, userId),
    });
    return subscription || null;
  },

  async findUserWithSubscription(email: string) {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
      with: {
        subscriptions: true,
      },
    });

    if (!user) {
      return null;
    }

    // Return the first subscription (if any)
    // Most users should only have one active subscription
    const subscription = user.subscriptions?.[0] || null;

    return {
      id: user.id,
      subscription,
    };
  },
};

// Drizzle adapter for webhook routes
export const webhookAdapter: WebhookDatabaseAdapter = {
  async findUserByCustomerId(customerId: string) {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.stripeCustomerId, customerId),
    });
    return user || null;
  },

  async findSubscription(subscriptionId: string) {
    const subscription = await db.query.subscriptions.findFirst({
      where: eq(schema.subscriptions.id, subscriptionId),
    });
    return subscription || null;
  },

  async upsertSubscription(data: SubscriptionData) {
    const existing = await this.findSubscription(data.id);

    if (existing) {
      await db
        .update(schema.subscriptions)
        .set(data)
        .where(eq(schema.subscriptions.id, data.id));
    } else {
      await db.insert(schema.subscriptions).values(data);
    }
  },

  async updateSubscriptionStatus(subscriptionId: string, status: string) {
    await db
      .update(schema.subscriptions)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(schema.subscriptions.id, subscriptionId));
  },
};
