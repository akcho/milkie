# Milkie

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

**[milkie-demo.vercel.app](https://milkie-demo.vercel.app)**

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
- 📦 Published npm package
- 🏢 Multi-tenancy support
- 📊 Developer dashboard
- 🔄 Webhook relay service for local development
- 🎚️ Multiple subscription tiers

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get running locally in 15 minutes
- **[docs/PAYWALL_PATTERNS.md](docs/PAYWALL_PATTERNS.md)** - Implementation patterns and examples
- **[docs/AUTH_INTEGRATION.md](docs/AUTH_INTEGRATION.md)** - Works with any auth solution

## 💻 Quick Local Setup

```bash
cd demo
npm install
cp .env.example .env.local
# Edit .env.local with your keys
npm run dev
```

Full instructions in [QUICKSTART.md](QUICKSTART.md).

---

## How It Works

### The SDK (Current)

```tsx
// 1. Wrap your app with MilkieProvider
import { MilkieProvider } from '@/lib/milkie'

<MilkieProvider email={session.user.email}>
  <YourApp />
</MilkieProvider>

// 2. Protect content with PaywallGate
import { PaywallGate } from '@/lib/milkie'

<PaywallGate>
  <PremiumContent />
</PaywallGate>

// 3. Or use the hook for custom logic
import { usePaywall } from '@/lib/milkie'

const { hasAccess, loading } = usePaywall()
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

**SDK:** (`demo/lib/milkie/`)
- React Context for state management
- TypeScript for type safety
- ~200 lines of code total

---

## Project Structure

```
milkie/
├── README.md                   # You are here
├── QUICKSTART.md               # Get running in 15 min
├── docs/
│   ├── AUTH_INTEGRATION.md    # Works with any auth
│   └── PAYWALL_PATTERNS.md    # Implementation patterns
└── demo/                       # Working prototype
    ├── app/                    # Example pages
    │   ├── page.tsx           # Public homepage
    │   ├── free/              # Public content
    │   ├── mixed/             # Component-level gating
    │   └── dashboard/         # Layout-level gating
    ├── lib/milkie/            # 🚀 THE SDK
    │   ├── provider.tsx       # MilkieProvider + usePaywall
    │   ├── paywall-gate.tsx   # PaywallGate component
    │   └── index.ts           # Public exports
    └── lib/
        ├── db/                # Database schema
        └── stripe.ts          # Stripe configuration
```

---

## Get Started

1. **[Try the demo](https://milkie-demo.vercel.app)** *(coming soon)*
2. **[Run locally](QUICKSTART.md)** - 15 minutes
3. **[Learn the patterns](docs/PAYWALL_PATTERNS.md)** - Component vs layout gating
4. **[Integrate with your auth](docs/AUTH_INTEGRATION.md)** - Works with any provider

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

TBD - Likely MIT once business model is finalized
