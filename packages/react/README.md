# @milkie/react

[![npm version](https://img.shields.io/npm/v/@milkie/react.svg)](https://www.npmjs.com/package/@milkie/react)
[![npm downloads](https://img.shields.io/npm/dm/@milkie/react.svg)](https://www.npmjs.com/package/@milkie/react)
[![license](https://img.shields.io/npm/l/@milkie/react.svg)](https://github.com/akcho/milkie/blob/main/LICENSE)

> Stripe-powered paywall SDK for Next.js apps

Add Stripe subscriptions to your app in minutes. Works with NextAuth, Clerk, Lucia, Supabase - any auth solution that provides an email.

```tsx
<MilkieProvider email={session.user.email}>
  <PaywallGate>
    <PremiumContent />
  </PaywallGate>
</MilkieProvider>
```

That's it. Your content is now behind a paywall.

---

## 🚀 Live Demo

**[milkie.dev](https://milkie.dev)**

See it in action with multiple gating patterns, metered paywalls, and more.

---

## Installation

```bash
npm install @milkie/react
```

## Requirements

**Runtime:**

- React 18+ or 19+
- Next.js 13+ (App Router)
- Tailwind CSS (components use Tailwind classes)

**Services:**

- Stripe account for payment processing
- Database (PostgreSQL, MySQL, SQLite, etc.) for subscription storage
- Auth provider (NextAuth, Clerk, Lucia, Supabase, etc.)

---

## Quick Start

### 1. Wrap your app with MilkieProvider

```tsx
// app/layout.tsx
import { MilkieProvider } from "@milkie/react";
import { auth } from "./auth"; // Your auth solution

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html>
      <body>
        <MilkieProvider email={session?.user?.email}>{children}</MilkieProvider>
      </body>
    </html>
  );
}
```

### 2. Protect content with PaywallGate

```tsx
// app/premium/page.tsx
import { PaywallGate } from "@milkie/react";

export default function PremiumPage() {
  return (
    <PaywallGate>
      <h1>Premium Content</h1>
      <p>Only visible to subscribers!</p>
    </PaywallGate>
  );
}
```

### 3. Or use the hook for custom logic

```tsx
"use client";
import { usePaywall } from "@milkie/react";

export function MyComponent() {
  const { hasAccess, loading, email } = usePaywall();

  if (loading) return <div>Loading...</div>;

  return hasAccess ? <PremiumContent /> : <UpgradePrompt />;
}
```

---

## API Reference

### `<MilkieProvider>`

Wrap your app to provide subscription context.

**Props:**

- `email?: string | null` - User's email from your auth provider
- `children: ReactNode` - Your app content

```tsx
<MilkieProvider email={session?.user?.email}>{children}</MilkieProvider>
```

---

### `<PaywallGate>`

Gate content behind a subscription paywall with built-in checkout flow.

**Props:**

- `children: ReactNode` - Premium content to protect
- `customUi?: ReactNode` - Custom paywall UI (optional)
- `signInUrl?: string` - Where to redirect for sign-in (default: `/signin`)
- `title?: string` - Paywall card title
- `subtitle?: string` - Paywall card subtitle
- `signInButtonText?: string` - Sign-in button text
- `subscribeButtonText?: string` - Subscribe button text
- `showBranding?: boolean` - Show "Powered by milkie" (default: true)
- `onSignIn?: () => void` - Custom sign-in handler

**Basic usage:**

```tsx
<PaywallGate>
  <PremiumContent />
</PaywallGate>
```

**Custom paywall UI:**

```tsx
<PaywallGate
  title="Unlock Premium Features"
  subtitle="Subscribe to access advanced analytics"
  subscribeButtonText="Get Premium Access"
>
  <PremiumContent />
</PaywallGate>
```

**Full custom UI:**

```tsx
<PaywallGate customUi={<CustomPaywallUI />}>
  <PremiumContent />
</PaywallGate>
```

---

### `<AuthGate>`

Gate content that requires sign-in but NOT an active subscription.

**Props:**

- `children: ReactNode` - Content requiring authentication
- `signInUrl?: string` - Where to redirect for sign-in (default: `/signin`)

**Usage:**

```tsx
<AuthGate>
  <UserSettings />
</AuthGate>
```

Perfect for billing pages, account settings, etc. where users need to be logged in but don't need an active subscription.

---

### `usePaywall()`

Hook to access subscription state in client components.

**Returns:**

```tsx
{
  email: string | null; // User's email from provider
  hasAccess: boolean; // True if user has active subscription
  loading: boolean; // True while checking subscription status
}
```

**Usage:**

```tsx
"use client";
import { usePaywall } from "@milkie/react";

export function PremiumFeature() {
  const { hasAccess, loading } = usePaywall();

  if (loading) return <Spinner />;
  if (!hasAccess) return <UpgradePrompt />;

  return <AdvancedAnalytics />;
}
```

---

## Backend Setup

Milkie provides **factory functions** to generate your API routes. You just need to provide database adapters.

### Quick Setup (3 routes)

**1. Checkout Route** (`app/api/checkout/route.ts`)

```ts
import { createCheckoutRoute } from "@milkie/react/api";
import { stripe } from "@/lib/stripe";
import { checkoutAdapter } from "@/lib/milkie-adapter";

export const POST = createCheckoutRoute({
  stripe,
  db: checkoutAdapter,
  priceId: process.env.STRIPE_PRICE_ID!,
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
});
```

**2. Subscription Status Route** (`app/api/subscription/status/route.ts`)

```ts
import { createSubscriptionStatusRoute } from "@milkie/react/api";
import { subscriptionAdapter } from "@/lib/milkie-adapter";

export const GET = createSubscriptionStatusRoute({
  db: subscriptionAdapter,
  // Optional: customize which subscription statuses grant access
  // allowedStatuses: ["active", "trialing"], // default
});
```

**Configuration Options:**

- `db` (required): Database adapter implementing `SubscriptionDatabaseAdapter`
- `allowedStatuses` (optional): Array of subscription statuses that grant access. Default: `["active", "trialing"]`

**Response Types:**

```ts
// Success response
{
  hasAccess: boolean;
  status: string;
  currentPeriodEnd?: Date | null;
}

// Error response
{
  error: string;
  code: "EMAIL_REQUIRED" | "INVALID_EMAIL" | "NO_SUBSCRIPTION" | "DATABASE_ERROR";
}
```

**3. Webhook Route** (`app/api/webhooks/stripe/route.ts`)

```ts
import { createWebhookRoute } from "@milkie/react/api";
import { stripe } from "@/lib/stripe";
import { webhookAdapter } from "@/lib/milkie-adapter";

export const POST = createWebhookRoute({
  stripe,
  db: webhookAdapter,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
});
```

### Database Adapters

Implement simple adapters for your database (Drizzle, Prisma, etc.):

```ts
// lib/milkie-adapter.ts
import type {
  CheckoutDatabaseAdapter,
  SubscriptionDatabaseAdapter,
} from "@milkie/react/api";

export const checkoutAdapter: CheckoutDatabaseAdapter = {
  async findUserByEmail(email: string) {
    // Your DB query
  },
  async createUser(data) {
    // Your DB insert
  },
  async updateUser(userId: string, data) {
    // Your DB update
  },
};

export const subscriptionAdapter: SubscriptionDatabaseAdapter = {
  async findUserByEmail(email: string) {
    // Return user with id, or null if not found
    return await db.user.findUnique({ where: { email } });
  },
  async findSubscription(userId: string) {
    // Return subscription or null
    return await db.subscription.findUnique({ where: { userId } });
  },
  async findUserWithSubscription(email: string) {
    // Optimized: fetch user + subscription in one query
    return await db.user.findUnique({
      where: { email },
      include: { subscription: true },
    });
  },
};

// Implement webhookAdapter similarly
```

**📚 Complete Guide:** [Backend Setup Documentation](https://github.com/akcho/milkie/blob/main/docs/BACKEND_SETUP.md)

Includes:

- Database schema (SQL + Drizzle example)
- Complete adapter implementations
- Stripe webhook configuration
- Environment variables setup
- Testing guide

---

## Features

- ✅ **Auth-agnostic** - Works with any auth provider that gives you an email
- ✅ **Component & layout gating** - Flexible implementation patterns
- ✅ **Built-in checkout flow** - No custom UI needed (but fully customizable)
- ✅ **Blurred content previews** - Show users what they're missing
- ✅ **TypeScript** - Full type safety
- ✅ **Smart redirects** - Callback URLs after sign-in/checkout
- ✅ **Error handling** - Network errors, retry mechanisms
- ✅ **Production ready** - Used in real apps

---

## Auth Integration Examples

### NextAuth.js

```tsx
import { auth } from "@/auth";

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <MilkieProvider email={session?.user?.email}>{children}</MilkieProvider>
  );
}
```

### Clerk

```tsx
import { currentUser } from "@clerk/nextjs/server";

export default async function RootLayout({ children }) {
  const user = await currentUser();

  return (
    <MilkieProvider email={user?.emailAddresses[0]?.emailAddress}>
      {children}
    </MilkieProvider>
  );
}
```

### Supabase

```tsx
import { createClient } from "@/lib/supabase/server";

export default async function RootLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <MilkieProvider email={user?.email}>{children}</MilkieProvider>;
}
```

---

## Gating Patterns

### Component-Level Gating

Mix free and premium content on the same page:

```tsx
export default function MixedPage() {
  return (
    <div>
      <PublicContent />

      <PaywallGate>
        <PremiumContent />
      </PaywallGate>
    </div>
  );
}
```

### Layout-Level Gating

Protect entire sections:

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <PaywallGate>
      <DashboardNav />
      {children}
    </PaywallGate>
  );
}
```

### Metered Paywall (NYT/Medium style)

```tsx
"use client";
import { usePaywall } from "@milkie/react";

export default function ArticlePage() {
  const { hasAccess } = usePaywall();
  const viewCount = getArticleViewCount(); // Your logic
  const canView = hasAccess || viewCount < 3;

  return canView ? (
    <FullArticle />
  ) : (
    <PaywallGate>
      <ArticlePreview />
    </PaywallGate>
  );
}
```

---

## Styling

Milkie uses **Tailwind CSS** for styling. You must have Tailwind configured in your Next.js app.

The components use CSS variables for theming (compatible with shadcn/ui):

```css
/* Required CSS variables in your global.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --border: 214.3 31.8% 91.4%;
    --destructive: 0 84.2% 60.2%;
    --radius: 0.5rem;
  }
}
```

**If you're using shadcn/ui**, you already have these variables and Milkie will match your theme automatically.

**If not**, you can either:

1. Add these CSS variables to your `globals.css`
2. Provide a fully custom `customUi` component for complete control

---

## Documentation

- **[GitHub Repository](https://github.com/akcho/milkie)** - Full source code
- **[Live Demo](https://milkie.dev)** - Interactive examples
- **[Backend Setup](https://github.com/akcho/milkie/blob/main/docs/BACKEND_SETUP.md)** - Database & API routes
- **[Auth Integration](https://github.com/akcho/milkie/blob/main/docs/AUTH_INTEGRATION.md)** - Works with any auth
- **[Implementation Patterns](https://github.com/akcho/milkie/blob/main/docs/PAYWALL_PATTERNS.md)** - Advanced usage

---

## Support

- **Issues:** [github.com/akcho/milkie/issues](https://github.com/akcho/milkie/issues)
- **Discussions:** [github.com/akcho/milkie/discussions](https://github.com/akcho/milkie/discussions)

---

## License

MIT - see [LICENSE](https://github.com/akcho/milkie/blob/main/LICENSE)
