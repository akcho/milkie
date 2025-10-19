# API Reference

Technical reference for Milkie's database schema, API routes, and security features.

## Database Schema

Milkie uses a simple two-table schema for users and subscriptions.

### Users Table

```typescript
{
  id: string; // Primary key (auto-generated UUID or user ID from auth)
  email: string; // Unique, required
  stripeCustomerId: string | null; // Stripe customer ID (set on first checkout)
  createdAt: Date; // Auto-generated timestamp
}
```

**Indexes:**

```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);
```

### Subscriptions Table

```typescript
{
  id: string; // Primary key (Stripe subscription ID)
  userId: string; // Foreign key → users.id
  stripeCustomerId: string; // Stripe customer ID
  status: string; // "active" | "canceled" | "past_due" | "trialing" | etc.
  priceId: string; // Stripe price ID
  currentPeriodEnd: Date | null; // Subscription period end date
  cancelAtPeriodEnd: boolean; // Whether subscription cancels at period end
  createdAt: Date; // Auto-generated timestamp
  updatedAt: Date; // Auto-updated timestamp
}
```

**Indexes:**

```sql
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
```

## Database Adapters

Milkie expects you to provide database adapters that implement these methods.

See [BACKEND_SETUP.md](../BACKEND_SETUP.md) for implementation examples using Drizzle ORM and Prisma.

### Checkout Route Adapter

```typescript
interface CheckoutDatabaseAdapter {
  findUserByEmail(email: string): Promise<User | null>;
  createUser(email: string): Promise<User>;
  updateUser(userId: string, data: { stripeCustomerId: string }): Promise<User>;
}
```

### Subscription Status Route Adapter

```typescript
interface SubscriptionDatabaseAdapter {
  findUserWithSubscription(email: string): Promise<UserWithSubscription | null>;
}

type UserWithSubscription = {
  id: string;
  email: string;
  subscription: {
    status: string;
    currentPeriodEnd: Date | null;
  } | null;
};
```

### Webhook Route Adapter

```typescript
interface WebhookDatabaseAdapter {
  findUserByCustomerId(customerId: string): Promise<User | null>;
  upsertSubscription(data: SubscriptionData): Promise<Subscription>;
  updateSubscriptionStatus(
    subscriptionId: string,
    status: string
  ): Promise<void>;
}

type SubscriptionData = {
  id: string;
  userId: string;
  stripeCustomerId: string;
  status: string;
  priceId: string;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
};
```

## API Routes

### Subscription Status Route

**Endpoint:** `GET /api/subscription/status?email={email}`

**Query Parameters:**

- `email` (required): User's email address

**Response:**

```typescript
{
  hasAccess: boolean;        // Whether user has active subscription
  status: string | null;     // Subscription status from Stripe
  currentPeriodEnd?: Date;   // Optional: when subscription renews/ends
}
```

**Implementation:**

```typescript
// app/api/subscription/status/route.ts
import { createSubscriptionStatusRoute } from "@milkie/react/api";
import { db } from "@/lib/db";

const handler = createSubscriptionStatusRoute({
  findUserWithSubscription: async (email) => {
    return await db.findUserWithSubscription(email);
  },
  allowedStatuses: ["active", "trialing"], // Optional: default is ["active", "trialing"]
});

export { handler as GET };
```

**Error Responses:**

- `400` - Missing email parameter
- `500` - Server error

### Checkout Route

**Endpoint:** `POST /api/checkout`

**Request Body:**

```typescript
{
  email: string;
  callbackUrl?: string;  // Optional: where to redirect after successful payment
}
```

**Response:**

```typescript
{
  url: string; // Stripe checkout session URL
}
```

**Implementation:**

```typescript
// app/api/checkout/route.ts
import { createCheckoutRoute } from "@milkie/react/api";
import { db } from "@/lib/db";
import { auth } from "@/auth";

const handler = createCheckoutRoute({
  findUserByEmail: async (email) => await db.findUserByEmail(email),
  createUser: async (email) => await db.createUser(email),
  updateUser: async (userId, data) => await db.updateUser(userId, data),
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    priceId: process.env.STRIPE_PRICE_ID!,
    successUrl:
      process.env.NEXT_PUBLIC_APP_URL +
      "/dashboard?session_id={CHECKOUT_SESSION_ID}",
    cancelUrl: process.env.NEXT_PUBLIC_APP_URL + "/pricing",
  },
  auth: async () => {
    const session = await auth();
    return session?.user?.email || null;
  }, // Optional: custom auth check
});

export { handler as POST };
```

**Error Responses:**

- `400` - Invalid email or missing required fields
- `500` - Server error

### Webhook Route

**Endpoint:** `POST /api/webhooks/stripe`

**Headers Required:**

```
stripe-signature: <webhook signature>
```

**Implementation:**

```typescript
// app/api/webhooks/stripe/route.ts
import { createWebhookRoute } from "@milkie/react/api";
import { db } from "@/lib/db";

const handler = createWebhookRoute({
  findUserByCustomerId: async (customerId) =>
    await db.findUserByCustomerId(customerId),
  upsertSubscription: async (data) => await db.upsertSubscription(data),
  updateSubscriptionStatus: async (id, status) =>
    await db.updateSubscriptionStatus(id, status),
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },
});

export { handler as POST };
```

**Webhook Events Handled:**

| Event                           | Action                                      |
| ------------------------------- | ------------------------------------------- |
| `checkout.session.completed`    | Creates subscription when checkout succeeds |
| `customer.subscription.created` | Creates subscription record                 |
| `customer.subscription.updated` | Updates subscription status/metadata        |
| `customer.subscription.deleted` | Marks subscription as canceled              |

**Error Responses:**

- `400` - Invalid signature or missing required data
- `500` - Server error

## Security Features

### Email Validation

All email inputs are validated and normalized:

- **Format validation**: RFC-compliant email format checking
- **Length limits**: Maximum 254 characters
- **Normalization**: Emails are trimmed and converted to lowercase
- **SQL injection protection**: Parameterized queries via ORM

### Callback URL Security

Callback URLs are validated to prevent open redirect vulnerabilities:

- **Path traversal prevention**: Blocks `../` patterns
- **Dangerous schemes**: Blocks `javascript:`, `data:`, `vbscript:` URLs
- **Host validation**: Only allows relative paths or same-origin URLs
- **Encoding**: Properly encodes callback URLs in query params

**Validation logic:**

```typescript
function isValidCallbackUrl(url: string, origin: string): boolean {
  // Block dangerous schemes
  if (url.match(/^(javascript|data|vbscript):/i)) {
    return false;
  }

  // Block path traversal
  if (url.includes("../")) {
    return false;
  }

  // Allow relative paths
  if (url.startsWith("/")) {
    return true;
  }

  // Allow same-origin URLs
  try {
    const parsed = new URL(url);
    return parsed.origin === origin;
  } catch {
    return false;
  }
}
```

### Stripe Integration Security

- **Webhook signature verification**: All webhook requests must have valid Stripe signatures
- **Idempotency keys**: Checkout sessions use idempotency keys to prevent duplicate charges
- **Race condition handling**: Concurrent user creation is handled gracefully
- **Test mode detection**: Automatically detects test vs. production keys

### Environment Variables

**Required for production:**

```env
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database
POSTGRES_URL=postgresql://...

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Security best practices:**

1. Never commit secrets to version control
2. Use `.env.local` for local development (gitignored)
3. Use environment variables in production (Vercel, AWS, etc.)
4. Rotate secrets periodically
5. Use different Stripe keys for development and production

### Rate Limiting

Consider adding rate limiting to prevent abuse:

```typescript
// Example using upstash/ratelimit
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 requests per minute
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  // Proceed with checkout
}
```

## Error Handling

### Client-Side Errors

PaywallGate automatically handles common errors:

| Error                | Display                                       | Recovery     |
| -------------------- | --------------------------------------------- | ------------ |
| Network failure      | "Unable to connect to checkout service"       | Retry button |
| API error (4xx/5xx)  | "Unable to start checkout. Please try again." | Retry button |
| Missing checkout URL | "Unable to start checkout. Please try again." | Retry button |

### Server-Side Errors

Log errors server-side but show user-friendly messages client-side:

```typescript
try {
  // Checkout logic
} catch (error) {
  console.error("Checkout failed:", error);

  // Don't expose technical details to users
  return Response.json(
    { error: "Unable to create checkout session" },
    { status: 500 }
  );
}
```

### Webhook Error Handling

Webhooks should return appropriate status codes:

```typescript
try {
  await processWebhook(event);
  return Response.json({ received: true });
} catch (error) {
  console.error("Webhook processing failed:", error);

  // Stripe will retry on 500 errors
  return Response.json({ error: "Webhook processing failed" }, { status: 500 });
}
```

## HTTPS Requirements

**Production checklist:**

- [ ] Use HTTPS for webhook endpoint (Stripe requires it)
- [ ] Use HTTPS for app URLs (checkout redirect URLs)
- [ ] Configure SSL certificate
- [ ] Test webhook delivery in production

## Related

- [Backend Setup](../BACKEND_SETUP.md) - Complete setup guide with database examples
- [Best Practices](best-practices.md) - Security and performance tips
- [Implementation Guide](../IMPLEMENTATION_GUIDE.md) - 7 paywall patterns (component gating, metered access, custom checkout, etc.)
