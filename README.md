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

## 🚀 Try the Live Demo

**[milkie.dev](https://milkie.dev)**

1. Sign in with Google
2. Try the gated examples (Component Gating or Layout Gating)
3. See the paywall with built-in checkout flow
4. Subscribe with test card: `4242 4242 4242 4242`
5. Content unlocked!

---

## Current Status

**Working Demo** ✅

Fully functional:

- ✅ Stripe checkout & subscription management
- ✅ Real-time webhook handling
- ✅ Auth-agnostic design (works with any auth provider)
- ✅ Component-level and layout-level gating patterns
- ✅ Smart sign-in redirects with callback URLs
- ✅ Customizable paywall UI
- ✅ Built-in blurred content previews
- ✅ Toast notifications for errors

On the roadmap:

- 🏢 Multi-tenancy support
- 📊 Developer dashboard
- 🔄 Webhook relay service for local development
- 🎚️ Multiple subscription tiers

## 📦 Installation

```bash
npm install @milkie/react
```

Or explore the demo locally:

```bash
cd demo
npm install
cp .env.example .env.local
# Edit .env.local with your keys
npm run dev
```

## 📚 Documentation

- **[@milkie/react README](packages/react/README.md)** - Full package documentation
- **[Backend Setup Guide](docs/BACKEND_SETUP.md)** - API routes and database setup
- **[Auth Integration](docs/AUTH_INTEGRATION.md)** - Works with any auth solution
- **[Paywall Patterns](docs/PAYWALL_PATTERNS.md)** - Implementation patterns and examples
- **[QUICKSTART.md](QUICKSTART.md)** - Run the demo locally

---

## How It Works

### The SDK

```tsx
// 1. Wrap your app with MilkieProvider
import { MilkieProvider } from "@milkie/react";

<MilkieProvider email={session.user.email}>
  <YourApp />
</MilkieProvider>;

// 2. Protect content with PaywallGate
import { PaywallGate } from "@milkie/react";

<PaywallGate>
  <PremiumContent />
</PaywallGate>;

// 3. Or use the hook for custom logic
import { usePaywall } from "@milkie/react";

const { hasAccess, loading } = usePaywall();
```

**Three components. That's the entire SDK.**

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
│   └── react/                  # @milkie/react npm package
│       ├── src/                # Source code
│       │   ├── components/    # MilkieProvider, PaywallGate, etc.
│       │   └── api/           # Factory functions for routes
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
    │   ├── milkie-adapter.ts # Database adapters for @milkie/react
    │   ├── db/               # Database schema & client
    │   └── stripe.ts         # Stripe configuration
    └── auth.ts               # NextAuth configuration
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
