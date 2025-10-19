# Backend Setup Guide

This guide walks you through setting up the required backend infrastructure for Milkie. You'll need three API routes and a database to store subscription data.

## Overview

Milkie requires three API endpoints:

1. **`POST /api/checkout`** - Creates Stripe checkout sessions
2. **`GET /api/subscription/status`** - Checks user subscription status
3. **`POST /api/webhooks/stripe`** - Handles Stripe webhook events

Milkie provides **factory functions** that generate these routes for you. You just need to provide database adapters and configuration.

### Key Features

- **Database Agnostic** - Works with PostgreSQL, MySQL, SQLite, or any other database
- **ORM Flexible** - Compatible with Drizzle, Prisma, or raw SQL
- **Type-Safe** - Full TypeScript support with comprehensive interfaces
- **Security Built-In** - Email validation, callback URL sanitization, webhook signature verification
- **Race Condition Handling** - Gracefully handles concurrent requests
- **Production Ready** - Used in production with comprehensive error handling

---

## Prerequisites

- Stripe account with API keys
- Database (PostgreSQL, MySQL, SQLite, etc.)
- ORM of your choice (Drizzle, Prisma, etc.)
- Next.js 13+ (App Router) or your preferred framework

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
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
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
    await db.update(schema.users).set(data).where(eq(schema.users.id, userId));
  },
};
```

### 2. Subscription Status Adapter

```ts
import type { SubscriptionDatabaseAdapter } from "@milkie/react/api";

export const subscriptionAdapter: SubscriptionDatabaseAdapter = {
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

  async upsertSubscription(data: SubscriptionData) {
    // Check if subscription exists
    const existing = await db.query.subscriptions.findFirst({
      where: eq(schema.subscriptions.id, data.id),
    });

    if (existing) {
      // Update existing subscription
      await db
        .update(schema.subscriptions)
        .set(data)
        .where(eq(schema.subscriptions.id, data.id));
    } else {
      // Create new subscription
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

#### Basic Setup (Email in Request Body)

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

**Request Body:**

```json
{
  "email": "user@example.com",
  "callbackUrl": "/dashboard" // Optional: redirect after checkout
}
```

#### Recommended: With Authentication

For production apps, we **strongly recommend** requiring authentication before checkout:

```ts
import { auth } from "@/auth"; // NextAuth example

export const POST = createCheckoutRoute({
  stripe,
  db: checkoutAdapter,
  priceId: process.env.STRIPE_PRICE_ID,
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
  // Recommended: Require authentication
  authenticate: async (request) => {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("You must be logged in to subscribe");
    }
    return session.user.email; // Email from authenticated session
  },
});
```

With `authenticate`, the email is extracted from the authenticated session instead of the request body. This prevents users from subscribing with arbitrary email addresses.

**Request Body (with authenticate):**

```json
{
  "callbackUrl": "/dashboard" // Optional: redirect after checkout
}
```

**Response:**

```json
{
  "url": "https://checkout.stripe.com/..."
}
```

**Security Features:**

- ✅ Email validation (RFC 5321 compliant)
- ✅ Callback URL sanitization (prevents open redirects, XSS, path traversal)
- ✅ Race condition handling for concurrent requests
- ✅ Idempotency keys prevent duplicate checkout sessions
- ✅ PII sanitization in error logs

### 2. Subscription Status Route

**`app/api/subscription/status/route.ts`**

```ts
import { createSubscriptionStatusRoute } from "@milkie/react/api";
import { subscriptionAdapter } from "@/lib/milkie-adapter";

export const GET = createSubscriptionStatusRoute({
  db: subscriptionAdapter,
});
```

**Query Parameters:**

```
GET /api/subscription/status?email=user@example.com
```

**Response:**

```json
{
  "hasAccess": true,
  "status": "active",
  "currentPeriodEnd": "2025-11-18T00:00:00.000Z"
}
```

**Subscription Statuses:**

- `active` - Subscription is active (grants access)
- `trialing` - In trial period (grants access by default)
- `past_due` - Payment failed, grace period (no access by default)
- `canceled` - Subscription canceled (no access)
- `unpaid` - Payment failed, no grace period (no access)
- `incomplete` - Initial payment failed (no access)
- `incomplete_expired` - Payment never completed (no access)
- `no_subscription` - User has no subscription (no access)

By default, only `active` and `trialing` statuses grant access. You can customize this behavior:

```ts
export const GET = createSubscriptionStatusRoute({
  db: subscriptionAdapter,
  // Optional: Customize which statuses grant access
  allowedStatuses: ["active", "trialing", "past_due"], // Allow grace period
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

**Handled Webhook Events:**

The webhook route automatically handles these Stripe events:

- `checkout.session.completed` - Triggered when a customer completes checkout

  - Creates or updates subscription in your database
  - Links subscription to user via Stripe customer ID

- `customer.subscription.created` - Triggered when a subscription is created

  - Stores subscription details (status, price, billing period)

- `customer.subscription.updated` - Triggered when subscription changes

  - Updates status, billing period, cancellation status
  - Handles plan changes, renewals, and updates

- `customer.subscription.deleted` - Triggered when subscription ends
  - Updates status to "canceled"
  - Revokes access

**Security:**

- ✅ Webhook signature verification using `STRIPE_WEBHOOK_SECRET`
- ✅ Prevents replay attacks and unauthorized requests
- ✅ Validates subscription data integrity

**Response:**

```json
{
  "received": true
}
```

**Important:** Your webhook endpoint must be publicly accessible for Stripe to send events. See [Webhook Configuration](#webhook-configuration) below for setup instructions.

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
  apiVersion: "2025-09-30.clover",
  typescript: true,
});
```

---

## Environment Variables

Add these to your `.env.local`:

```bash
# Database
POSTGRES_URL=postgresql://user:pass@host:port/db?sslmode=require

# Stripe Configuration (Required)
STRIPE_SECRET_KEY=sk_test_... # or sk_live_... for production
STRIPE_PRICE_ID=price_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Application (Required)
NEXT_PUBLIC_APP_URL=http://localhost:3000 # production: https://yourdomain.com

# Authentication (Optional - only if using NextAuth)
AUTH_SECRET=<generate with: openssl rand -base64 32>
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
```

### Getting Your Keys

1. **STRIPE_SECRET_KEY**: [Stripe Dashboard → Developers → API Keys](https://dashboard.stripe.com/apikeys)
   - Use `sk_test_...` for development
   - Use `sk_live_...` for production
   - ⚠️ Keep this secret - never expose in client-side code
2. **STRIPE_PRICE_ID**: [Stripe Dashboard → Products](https://dashboard.stripe.com/products) → Create a product → Copy the price ID
3. **STRIPE_WEBHOOK_SECRET**: [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks) → Add endpoint → Copy the signing secret
   - Different secrets for local development (from Stripe CLI) and production

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

## Error Handling

Milkie's factory functions return proper HTTP status codes and error messages:

### Common Errors

**400 Bad Request:**

- Missing required fields (email, etc.)
- Invalid email format
- Invalid callback URL
- Email too long (max 254 characters)

**404 Not Found:**

- User not found for subscription check
- Customer not found in database

**500 Internal Server Error:**

- Database errors
- Stripe API errors
- Unexpected errors

**Error Response Format:**

```json
{
  "error": "Description of what went wrong",
  "code": "ERROR_CODE" // Optional
}
```

### PII Protection

Error messages automatically sanitize sensitive information:

```ts
// Email addresses are redacted in logs
"user@example.com" → "use***@example.com"
```

---

## Troubleshooting

### Webhook signature verification fails

**Symptoms:** Webhook endpoint returns 400 error, "No stripe-signature header" or "Invalid signature"

**Solutions:**

- Ensure `STRIPE_WEBHOOK_SECRET` is set correctly in your `.env.local`
- For **local development**: Use the secret from `stripe listen` output (starts with `whsec_`)
- For **production**: Use the secret from Stripe Dashboard → Webhooks
- Verify you're using the correct secret for your environment (test vs live mode)
- Check that your webhook route is accessible at the URL you configured in Stripe

### Subscription status not updating

**Symptoms:** User completes checkout but `hasAccess` remains false

**Solutions:**

- Check webhook events are being received in Stripe Dashboard → Webhooks → Events
- Verify your webhook adapter's `upsertSubscription` function is working correctly
- Check database for subscription records: `SELECT * FROM subscriptions WHERE user_id = '...'`
- Ensure webhook secret matches between your `.env.local` and Stripe CLI / Dashboard
- Check Next.js server logs for webhook processing errors

### User not found errors

**Symptoms:** 404 errors when checking subscription status or processing webhooks

**Solutions:**

- Ensure users are created during checkout (check `createUser` in checkout adapter)
- Verify `stripeCustomerId` is being saved correctly in the database
- Check that email addresses match exactly (including case sensitivity)
- Verify database foreign key relationships are set up correctly
- Use `findUserByEmail` to confirm user exists: `SELECT * FROM users WHERE email = '...'`

### Race conditions during checkout

**Symptoms:** "Unique constraint violation" or duplicate user errors

**Solutions:**

- Milkie handles this automatically - check your database adapter handles unique constraints
- Ensure your `users` table has a UNIQUE constraint on the email column
- The checkout adapter should catch duplicate key errors and retry the operation
- Check server logs for "duplicate key" or "unique constraint" messages

### Checkout session creation fails

**Symptoms:** "Invalid price ID" or "Price not found" errors

**Solutions:**

- Verify `STRIPE_PRICE_ID` in your `.env.local` matches a price in your Stripe Dashboard
- Ensure the price is for a recurring product (subscription), not a one-time payment
- Check that you're using the correct Stripe account (test mode vs live mode)
- Verify `STRIPE_SECRET_KEY` matches the mode of your price ID (`sk_test_` with test prices)

### Database connection errors

**Symptoms:** "Failed to connect to database" or timeout errors

**Solutions:**

- Verify `POSTGRES_URL` (or your database URL) is correct in `.env.local`
- Check that your database server is running and accessible
- Ensure your database has the correct schema (run migrations: `npx drizzle-kit push`)
- Verify firewall rules allow connections from your app server
- For Neon/Vercel Postgres: Ensure SSL mode is enabled (`?sslmode=require`)

### "Email is required" with authenticate function

**Symptoms:** Checkout fails even though user is logged in

**Solutions:**

- Verify your `authenticate` function is returning the user's email
- Check that the session contains an email field: `session.user.email`
- Ensure your auth provider is configured correctly (NextAuth, Clerk, etc.)
- Test the session manually: `const session = await auth(); console.log(session);`

### Callback URL not working

**Symptoms:** After checkout, user is redirected to wrong page or default URL

**Solutions:**

- Verify `callbackUrl` in request body is a relative path (e.g., `/dashboard`)
- Do NOT use absolute URLs (security restriction)
- Check that `NEXT_PUBLIC_APP_URL` is set correctly
- Milkie sanitizes callback URLs to prevent open redirects - check server logs for validation errors

---

## Advanced Configuration

### Custom Test Mode Detection

By default, Milkie auto-detects test mode from your Stripe secret key. You can override this:

```ts
export const POST = createCheckoutRoute({
  stripe,
  db: checkoutAdapter,
  priceId: process.env.STRIPE_PRICE_ID,
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
  isTestMode: true, // Force test mode
});
```

This shows test card helper text in Stripe Checkout, even if using a live key (useful for staging environments).

### Custom Allowed Subscription Statuses

Control which subscription statuses grant access:

```ts
export const GET = createSubscriptionStatusRoute({
  db: subscriptionAdapter,
  // Default: ['active', 'trialing']
  allowedStatuses: ["active", "trialing", "past_due"], // Include grace period
});
```

### Using with Other Frameworks

While our examples use Next.js, Milkie's factory functions work with any framework that supports Web APIs:

#### Express.js Example

```ts
import express from "express";
import { createCheckoutRoute } from "@milkie/react/api";

const app = express();

const checkoutHandler = createCheckoutRoute({
  stripe,
  db: checkoutAdapter,
  priceId: process.env.STRIPE_PRICE_ID,
  appUrl: process.env.APP_URL,
});

app.post("/api/checkout", async (req, res) => {
  const request = new Request("http://localhost/api/checkout", {
    method: "POST",
    body: JSON.stringify(req.body),
    headers: { "Content-Type": "application/json" },
  });

  const response = await checkoutHandler(request);
  const data = await response.json();

  res.status(response.status).json(data);
});
```

---

## Best Practices

### 1. Environment Variables

- ✅ **DO** use different Stripe keys for development and production
- ✅ **DO** keep webhook secrets separate for each environment
- ✅ **DO** use `.env.local` (gitignored) for local secrets
- ✅ **DO** use platform environment variables (Vercel, Railway, etc.) for production
- ❌ **DON'T** commit secrets to version control
- ❌ **DON'T** share webhook secrets between environments

### 2. Database

- ✅ **DO** add indexes on frequently queried columns:
  ```sql
  CREATE INDEX idx_users_email ON users(email);
  CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);
  CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
  CREATE INDEX idx_subscriptions_status ON subscriptions(status);
  ```
- ✅ **DO** use database migrations for schema changes
- ✅ **DO** back up your database regularly
- ❌ **DON'T** delete subscription records (soft delete with status instead)

### 3. Security

- ✅ **DO** require authentication for checkout (use `authenticate` function)
- ✅ **DO** validate webhook signatures
- ✅ **DO** use HTTPS in production
- ✅ **DO** rate-limit your API endpoints
- ❌ **DON'T** expose database errors to clients
- ❌ **DON'T** trust client-side subscription checks alone (always verify server-side)

### 4. Testing

- ✅ **DO** test the complete checkout flow locally with Stripe CLI
- ✅ **DO** use Stripe test cards: `4242 4242 4242 4242`
- ✅ **DO** test webhook event handling for all scenarios:
  - Successful subscription creation
  - Subscription updates
  - Payment failures
  - Subscription cancellations
- ✅ **DO** verify database updates after each webhook event
- ❌ **DON'T** use real credit cards in test mode

### 5. Error Handling

- ✅ **DO** log errors with context (but redact PII)
- ✅ **DO** monitor webhook delivery in Stripe Dashboard
- ✅ **DO** set up alerts for failed webhook events
- ✅ **DO** handle race conditions gracefully
- ❌ **DON'T** expose internal error details to users
- ❌ **DON'T** log full email addresses or payment details

### 6. Performance

- ✅ **DO** use database connection pooling
- ✅ **DO** optimize database queries (use joins instead of multiple queries)
- ✅ **DO** cache subscription status when appropriate
- ❌ **DON'T** make Stripe API calls on every page load (use webhooks to sync data)

---

## Production Deployment Checklist

### Before Deploying

- [ ] Test complete checkout flow locally with Stripe CLI
- [ ] Verify all webhook events are handled correctly in local environment
- [ ] Set up production Stripe account and get live API keys
- [ ] Create production database and run migrations
- [ ] Add all required environment variables to production platform
- [ ] Document your setup for team members

### During Deployment

- [ ] Deploy application to production
- [ ] Verify HTTPS is enabled on your domain
- [ ] Configure production webhook endpoint in Stripe Dashboard
- [ ] Set up database backups
- [ ] Configure error monitoring (Sentry, LogRocket, etc.)
- [ ] Add rate limiting to API routes

### After Deployment

- [ ] Test complete checkout flow in production with Stripe test mode
- [ ] Verify webhook events are being received and processed (check Stripe Dashboard)
- [ ] Test subscription status check endpoint
- [ ] Verify database records are created correctly
- [ ] Set up alerts for failed payments and webhook deliveries
- [ ] Test subscription cancellation flow
- [ ] Monitor error logs for the first few hours
- [ ] Switch to Stripe live mode and process a real test transaction (then refund)

---

## Next Steps

- **[Auth Integration Guide](./AUTH_INTEGRATION.md)** - Connect with NextAuth, Clerk, etc.
- **[Paywall Patterns](./PAYWALL_PATTERNS.md)** - Implementation examples
- **[Live Demo](https://milkie.dev)** - See it in action
