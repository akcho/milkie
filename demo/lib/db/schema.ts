import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(), // Stripe subscription ID
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  status: text("status").notNull(), // active, canceled, past_due, etc.
  priceId: text("price_id").notNull(),
  currentPeriodEnd: timestamp("current_period_end", { mode: "date" }),
  cancelAtPeriodEnd: boolean("cancel_at_period_end"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));
