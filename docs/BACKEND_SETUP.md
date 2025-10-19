# Backend Setup Guide

This guide walks you through setting up the required backend infrastructure for Milkie. You'll need three API routes and a database to store subscription data.

## Overview

Milkie requires three API endpoints:

1. **`/api/checkout`** - Creates Stripe checkout sessions
2. **`/api/subscription/status`** - Checks user subscription status
3. **`/api/webhooks/stripe`** - Handles Stripe webhook events

Milkie provides **factory functions** that generate these routes for you. You just need to provide database adapters and configuration.

---

## Prerequisites

- Stripe account with API keys
- Database (PostgreSQL, MySQL, SQLite, etc.)
- ORM of your choice (Drizzle, Prisma, etc.)

---

## Database Schema

You'll need two tables: `users` and `subscriptions`.

### Required Tables

**Users Table:**
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Subscriptions Table:**
```sql
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,              -- Stripe subscription ID
  user_id TEXT NOT NULL REFERENCES users(id),
  stripe_customer_id TEXT NOT NULL,
  status TEXT NOT NULL,             -- active, canceled, past_due, etc.
  price_id TEXT NOT NULL,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Drizzle ORM Example

```ts
// lib/db/schema.ts
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
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  status: text("status").notNull(),
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
```

---

## Database Adapters

Milkie is database-agnostic. You implement simple adapters that connect your database to Milkie's factory functions.

### 1. Checkout Adapter

```ts
// lib/milkie-adapter.ts
import { eq } from "drizzle-orm";
import type {
  CheckoutDatabaseAdapter,
  CreateUserData,
} from "@milkie/react/api";
import { db } from "./db";
import * as schema from "./db/schema";

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
```

### 2. Subscription Status Adapter

```ts
import type { SubscriptionDatabaseAdapter } from "@milkie/react/api";

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

    if (!user) return null;

    return {
      id: user.id,
      subscription: user.subscriptions?.[0] || null,
    };
  },
};
```

### 3. Webhook Adapter

```ts
import type {
  WebhookDatabaseAdapter,
  SubscriptionData,
} from "@milkie/react/api";

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
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.subscriptions.id, subscriptionId));
  },
};
```

---

## API Routes Setup

### 1. Checkout Route

**`app/api/checkout/route.ts`**

```ts
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
```

### 2. Subscription Status Route

**`app/api/subscription/status/route.ts`**

```ts
import { createSubscriptionStatusRoute } from "@milkie/react/api";
import { subscriptionAdapter } from "@/lib/milkie-adapter";

export const GET = createSubscriptionStatusRoute({
  db: subscriptionAdapter,
});
```

### 3. Webhook Route

**`app/api/webhooks/stripe/route.ts`**

```ts
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
```

---

## Stripe Configuration

### Initialize Stripe

**`lib/stripe.ts`**

```ts
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is required");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
});
```

---

## Environment Variables

Add these to your `.env.local`:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://...
```

### Getting Your Keys

1. **STRIPE_SECRET_KEY**: [Stripe Dashboard → Developers → API Keys](https://dashboard.stripe.com/apikeys)
2. **STRIPE_PRICE_ID**: [Stripe Dashboard → Products](https://dashboard.stripe.com/products) → Create a product → Copy the price ID
3. **STRIPE_WEBHOOK_SECRET**: [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks) → Add endpoint → Copy the signing secret

---

## Webhook Configuration

### 1. Local Development (Stripe CLI)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This command outputs your webhook secret. Copy it to `STRIPE_WEBHOOK_SECRET`.

### 2. Production

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/webhooks/stripe`
4. Events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

---

## Testing

### Test the Checkout Flow

1. Start your dev server: `npm run dev`
2. Start Stripe webhook forwarding: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. Sign in to your app
4. Trigger a checkout session
5. Use Stripe test card: `4242 4242 4242 4242`
6. Verify webhook events are received

### Verify Database Updates

After a successful checkout, check your database:

```sql
-- Should see a new user
SELECT * FROM users WHERE email = 'your-test-email@example.com';

-- Should see a subscription
SELECT * FROM subscriptions WHERE user_id = 'user-id-from-above';
```

---

## Adapter Types Reference

Milkie exports TypeScript types for all adapters:

```ts
import type {
  CheckoutDatabaseAdapter,
  SubscriptionDatabaseAdapter,
  WebhookDatabaseAdapter,
  CreateUserData,
  SubscriptionData,
} from "@milkie/react/api";
```

These ensure your adapters implement the correct interface.

---

## Troubleshooting

### Webhook signature verification fails

- Ensure `STRIPE_WEBHOOK_SECRET` is set correctly
- For local dev, use the secret from `stripe listen` output
- For production, use the secret from Stripe dashboard

### Subscription status not updating

- Check webhook events are being received
- Verify database adapter is correctly updating subscriptions
- Check Stripe dashboard for webhook delivery attempts

### User not found errors

- Ensure users are created during checkout
- Verify `stripeCustomerId` is being saved correctly
- Check database queries in your adapters

---

## Next Steps

- **[Auth Integration Guide](./AUTH_INTEGRATION.md)** - Connect with NextAuth, Clerk, etc.
- **[Paywall Patterns](./PAYWALL_PATTERNS.md)** - Implementation examples
- **[Live Demo](https://milkie.dev)** - See it in action
