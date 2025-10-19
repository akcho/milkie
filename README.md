# Milkie

[![npm version](https://img.shields.io/npm/v/@milkie/react.svg)](https://www.npmjs.com/package/@milkie/react)
[![npm downloads](https://img.shields.io/npm/dm/@milkie/react.svg)](https://www.npmjs.com/package/@milkie/react)
[![license](https://img.shields.io/npm/l/@milkie/react.svg)](https://github.com/akcho/milkie/blob/main/LICENSE)

> Drop-in paywall infrastructure for Next.js apps

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

## ✨ Features at a Glance

- 🔒 **Subscription Gating** - `<PaywallGate>` for premium content
- 🚪 **Auth Gating** - `<AuthGate>` for authenticated-only content
- 🎨 **Fully Customizable** - Custom UIs, messaging, styling
- 🔐 **Security Built-In** - Callback validation, idempotency, PII sanitization
- 🔌 **Auth-Agnostic** - Works with NextAuth, Clerk, Lucia, Supabase, etc.
- ⚡ **3 API Routes** - That's all you need on the backend

---

## 🚀 Try the Live Demo

**[milkie.dev](https://milkie.dev)**

1. Sign in with Google
2. Try the gated examples (Component Gating or Layout Gating)
3. See the paywall with built-in checkout flow
4. Subscribe with test card: `4242 4242 4242 4242`
5. Content unlocked!

---

## Current Status

**v0.1.0 - Production Ready** ✅

Fully functional:

- ✅ Stripe checkout & subscription management
- ✅ Real-time webhook handling
- ✅ Auth-agnostic design (works with any auth provider)
- ✅ **Subscription gating** with `<PaywallGate>`
- ✅ **Authentication gating** with `<AuthGate>`
- ✅ Component-level and layout-level gating patterns
- ✅ Smart sign-in redirects with callback URLs
- ✅ **Fully customizable** UIs, messaging, and styling
- ✅ Built-in blurred content previews
- ✅ Toast notifications for errors
- ✅ **Security features** (callback validation, idempotency, PII sanitization)

On the roadmap:

- 🏢 Multi-tenancy support
- 📊 Developer dashboard
- 🔄 Webhook relay service for local development
- 🎚️ Multiple subscription tiers

## 📦 Installation

```bash
npm install @milkie/react
```

## ⚡ Quick Start (5 minutes)

### 1. Set up your backend

Create 3 API routes using Milkie's factory functions:

```tsx
// app/api/subscription/status/route.ts
import { createSubscriptionStatusRoute } from "@milkie/react/api";
import { dbAdapter } from "@/lib/milkie-adapter";

export const GET = createSubscriptionStatusRoute({ adapter: dbAdapter });
```

```tsx
// app/api/checkout/route.ts
import { createCheckoutRoute } from "@milkie/react/api";
import { dbAdapter } from "@/lib/milkie-adapter";
import { stripe } from "@/lib/stripe";

export const POST = createCheckoutRoute({
  adapter: dbAdapter,
  stripe,
  priceId: process.env.STRIPE_PRICE_ID!,
  successUrl: "/dashboard",
});
```

```tsx
// app/api/webhooks/stripe/route.ts
import { createWebhookRoute } from "@milkie/react/api";
import { dbAdapter } from "@/lib/milkie-adapter";
import { stripe } from "@/lib/stripe";

export const POST = createWebhookRoute({
  adapter: dbAdapter,
  stripe,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
});
```

See [BACKEND_SETUP.md](docs/BACKEND_SETUP.md) for database adapter implementation.

### 2. Wrap your app with MilkieProvider

```tsx
import { MilkieProvider } from "@milkie/react";

export default function RootLayout({ children }) {
  const session = await auth(); // Your auth solution

  return (
    <MilkieProvider email={session?.user?.email}>
      {children}
    </MilkieProvider>
  );
}
```

### 3. Gate your content

```tsx
import { PaywallGate } from "@milkie/react";

export default function PremiumPage() {
  return (
    <PaywallGate>
      <PremiumContent />
    </PaywallGate>
  );
}
```

**That's it!** Your content is now behind a paywall.

For the complete setup guide: **[QUICKSTART.md](QUICKSTART.md)**

---

## 📚 Documentation

- **[@milkie/react README](packages/react/README.md)** - Full package documentation
- **[Backend Setup Guide](docs/BACKEND_SETUP.md)** - API routes and database setup
- **[Auth Integration](docs/AUTH_INTEGRATION.md)** - Works with any auth solution
- **[Paywall Patterns](docs/PAYWALL_PATTERNS.md)** - Implementation patterns and examples
- **[QUICKSTART.md](QUICKSTART.md)** - Run the demo locally

---

## How It Works

### Subscription Gating

Protect premium content behind a subscription paywall:

```tsx
import { PaywallGate } from "@milkie/react";

<PaywallGate>
  <PremiumContent />
</PaywallGate>
```

**What happens:**
- Unauthenticated users see a sign-in prompt
- Authenticated users without subscription see the paywall with checkout
- Subscribers see the content

**Customization options:**

```tsx
<PaywallGate
  title="Unlock Premium Features"
  subtitle="Get access to all premium content"
  subscribeButtonLabel="Upgrade Now"
  blur={true} // Show blurred preview of content
  overlayClassName="items-start pt-20" // Custom positioning
/>
```

### Authentication Gating

Require sign-in without requiring a subscription:

```tsx
import { AuthGate } from "@milkie/react";

<AuthGate>
  <AuthenticatedContent />
</AuthGate>
```

**What happens:**
- Unauthenticated users see a sign-in prompt
- Authenticated users see the content (no subscription required)

**Customization options:**

```tsx
<AuthGate
  title="Sign in to continue"
  subtitle="Access your account"
  signInButtonLabel="Sign In"
  blur={false} // No blur, just show the overlay
/>
```

### Custom Logic with Hooks

For complete control over your paywall logic:

```tsx
import { usePaywall } from "@milkie/react";

function CustomComponent() {
  const { hasAccess, loading, status, email } = usePaywall();

  if (loading) return <LoadingSpinner />;
  if (!hasAccess) return <YourCustomPaywall />;

  return <PremiumContent />;
}
```

**Available from the hook:**
- `hasAccess` - boolean indicating subscription status
- `loading` - boolean for loading state
- `status` - Stripe subscription status string
- `email` - user email from provider
- `error` - error message if any
- `checkSubscription()` - manually refresh subscription status
- `clearError()` - clear error state

---

## 🎨 Customization

Milkie is designed to be fully customizable to match your app's design.

### Custom Messaging

Tailor the paywall messaging to your brand:

```tsx
<PaywallGate
  title="Upgrade to Pro"
  subtitle="Get unlimited access to all features"
  subscribeButtonLabel="Start Free Trial"
  signInButtonLabel="Sign in to subscribe"
/>
```

### Custom Overlay Position

Position the paywall card anywhere on the page:

```tsx
// Top of page
<PaywallGate overlayClassName="items-start pt-20" />

// Bottom of page
<PaywallGate overlayClassName="items-end pb-20" />

// Left side
<PaywallGate overlayClassName="justify-start pl-20" />
```

The `overlayClassName` accepts any Tailwind CSS classes. The overlay is placed in a CSS Grid container with `items-center justify-items-center` by default, so you can use alignment classes like `items-start`, `items-end`, `justify-items-start`, or `justify-items-end` to reposition it.

### Fully Custom UI

Replace the entire paywall card with your own component:

```tsx
import { usePaywall } from "@milkie/react";

function YourCustomPaywall() {
  const { email, loading } = usePaywall();
  // Your custom logic and UI
}

<PaywallGate customUi={<YourCustomPaywall />} />
```

With `customUi`, you have complete control over the paywall appearance and behavior.

**See all customization options:** [packages/react/README.md](packages/react/README.md)

---

## 🔐 Security Features

Milkie includes production-ready security protections:

- **Callback URL Validation** - Prevents open redirect attacks by validating redirect URLs
- **Idempotency Keys** - Prevents duplicate Stripe checkout sessions and charges
- **PII Sanitization** - Removes sensitive data from error logs
- **Webhook Signature Verification** - Validates Stripe webhook signatures
- **Email Normalization** - Consistent email handling across the system

These security features are built-in and active by default - no configuration needed.

---

## Why Milkie?

Adding subscriptions shouldn't take 2 days. Here's what Milkie handles for you:

**What you'd normally build:**

- ❌ Stripe checkout session creation
- ❌ Webhook endpoint configuration
- ❌ Subscription status tracking
- ❌ Access control logic
- ❌ Paywall UI components
- ❌ Error handling and edge cases

**With Milkie:**

- ✅ Wrap your content with `<PaywallGate>`
- ✅ That's it

**Time saved:** Days → Minutes

---

## Tech Stack

**Demo app:**

- Next.js 15 with App Router
- TypeScript
- NextAuth.js (Google OAuth)
- Stripe Checkout & Webhooks
- Drizzle ORM with PostgreSQL
- Tailwind CSS + shadcn/ui
- Sonner (toast notifications)

**Package:** (`@milkie/react`)

- Published on npm
- React Context for state management
- Factory functions for API routes
- Database-agnostic adapters
- TypeScript for type safety

---

## Project Structure

```
milkie/
├── LICENSE                     # MIT License
├── README.md                   # You are here
├── QUICKSTART.md               # Get running in 15 min
├── packages/
│   └── react/                  # @milkie/react npm package (v0.1.0)
│       ├── src/
│       │   ├── provider.tsx   # MilkieProvider & usePaywall hook
│       │   ├── paywall-gate/  # PaywallGate component
│       │   │   └── components/
│       │   │       ├── paywall-card.tsx
│       │   │       ├── user-info.tsx
│       │   │       └── checkout-error.tsx
│       │   ├── auth-gate/     # AuthGate component
│       │   │   └── components/
│       │   │       └── auth-card.tsx
│       │   ├── components/    # Shared components
│       │   │   ├── loading-state.tsx
│       │   │   ├── blurred-content.tsx
│       │   │   ├── overlay-grid.tsx
│       │   │   ├── milkie-icon.tsx
│       │   │   └── ui/        # shadcn/ui components
│       │   └── api/           # Factory functions for routes
│       │       ├── subscription.ts  # createSubscriptionStatusRoute
│       │       ├── checkout.ts      # createCheckoutRoute
│       │       └── webhooks.ts      # createWebhookRoute
│       └── README.md          # Package documentation
├── docs/
│   ├── BACKEND_SETUP.md       # Complete backend guide
│   ├── AUTH_INTEGRATION.md    # Works with any auth
│   └── PAYWALL_PATTERNS.md    # Implementation patterns
└── demo/                       # Working demo app
    ├── .env.example           # Environment variables template
    ├── app/                    # Next.js app directory
    │   ├── page.tsx           # Public homepage
    │   ├── mixed/             # Component-level gating example
    │   ├── premium/           # Full-page gating example
    │   ├── dashboard/         # Layout-level gating example
    │   └── api/               # API routes (using @milkie/react factories)
    │       ├── checkout/      # Stripe checkout session
    │       ├── subscription/  # Subscription status check
    │       └── webhooks/      # Stripe webhook handler
    ├── lib/
    │   ├── milkie-adapter.ts  # Database adapters for @milkie/react
    │   ├── db/                # Database schema & client
    │   └── stripe.ts          # Stripe configuration
    └── auth.ts                # NextAuth configuration
```

---

## Get Started

1. **[Try the demo](https://milkie.dev)** - See it in action
2. **[Install the package](packages/react/README.md)** - `npm install @milkie/react`
3. **[Set up backend](docs/BACKEND_SETUP.md)** - 3 API routes
4. **[Learn the patterns](docs/PAYWALL_PATTERNS.md)** - Component vs layout gating
5. **[Integrate with your auth](docs/AUTH_INTEGRATION.md)** - Works with any provider

---

## Feedback & Issues

This is an early-stage project. Feedback is incredibly valuable!

**Open an issue if you:**

- Find bugs or unexpected behavior
- Have feature requests or ideas
- Want to discuss the implementation approach
- Would actually use this for your projects

---

## License

MIT
