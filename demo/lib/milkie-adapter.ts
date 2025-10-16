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
    return await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
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
    return await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
  },

  async findActiveSubscription(userId: string) {
    return await db.query.subscriptions.findFirst({
      where: eq(schema.subscriptions.userId, userId),
    });
  },
};

// Drizzle adapter for webhook routes
export const webhookAdapter: WebhookDatabaseAdapter = {
  async findUserByCustomerId(customerId: string) {
    return await db.query.users.findFirst({
      where: eq(schema.users.stripeCustomerId, customerId),
    });
  },

  async findSubscription(subscriptionId: string) {
    return await db.query.subscriptions.findFirst({
      where: eq(schema.subscriptions.id, subscriptionId),
    });
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
