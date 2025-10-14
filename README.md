# Milkie

> Drop-in paywall for Next.js apps with authentication

Add Stripe subscriptions to your app without the integration headache. Works with NextAuth, Clerk, Lucia, Supabase, and any auth solution.

```tsx
<MilkieProvider email={session.user.email}>
  <PaywallGate>
    <YourPremiumContent />
  </PaywallGate>
</MilkieProvider>
```

That's it.

---

## 🚀 Try the Live Demo

**[milkie-demo.vercel.app](https://milkie-demo.vercel.app)** *(coming soon)*

1. Sign in with Google
2. Navigate to premium content
3. See the paywall in action
4. Test checkout with card: `4242 4242 4242 4242`

**No setup required.** See it working in 30 seconds.

---

## Current Status

**Working prototype** ✅

What works:
- ✅ Stripe checkout integration
- ✅ Webhook handling
- ✅ Auth-agnostic (works with any auth solution)
- ✅ Subscription status checking
- ✅ Working demo with NextAuth

What's next:
- ⏳ Multi-tenancy
- ⏳ Developer dashboard
- ⏳ npm package
- ⏳ Webhook relay service

## 📚 Documentation

- **[docs/AUTH_INTEGRATION.md](docs/AUTH_INTEGRATION.md)** - Works with NextAuth, Clerk, Lucia, Supabase, etc.
- [docs/PAYWALL_PATTERNS.md](docs/PAYWALL_PATTERNS.md) - How to use paywalls in your app
- [docs/SUMMARY.md](docs/SUMMARY.md) - What we built and why
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - How to deploy your own demo *(coming soon)*

## 💻 Run Locally (Optional)

Want to customize or integrate into your own app?

```bash
git clone https://github.com/yourusername/milkie
cd milkie/demo
npm install
cp .env.example .env.local
# Edit .env.local with your keys
npm run dev
```

See [demo/README.md](demo/README.md) for detailed setup instructions.

## The Vision

### For Developers Using Milkie
```tsx
// Works with ANY auth solution - NextAuth, Clerk, Lucia, Supabase, etc.
import { MilkieProvider, PaywallGate } from 'milkie'

<MilkieProvider email={session.user.email}> {/* from your auth */}
  <App>
    <PaywallGate>
      <PremiumFeature />
    </PaywallGate>
  </App>
</MilkieProvider>
```

See [AUTH_INTEGRATION.md](docs/AUTH_INTEGRATION.md) for examples with different auth providers.

### The Architecture (Eventually)
- **SDK** - Client libraries for React, Node.js, and more
- **API** - Entitlement engine and webhook relay
- **Dashboard** - Manage projects, view logs, connect Stripe
- **Templates** - Pre-built components and starter kits

## Why This Exists

Adding payments to a side project is too hard:
- Stripe's API is complex
- Webhooks are a pain to debug
- Managing subscription state is tedious
- It takes days to set up properly

Milkie solves this by handling all the hard parts. You just wrap your content and it works.

## The Pitch

**Target**: Indie hackers who want to monetize weekend projects
**Problem**: Stripe integration takes 2+ days and kills momentum
**Solution**: Drop-in paywall that works in 5 minutes
**Pricing**: Free until $1k MRR, then 2% of revenue

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: SQLite (demo) → PostgreSQL (production)
- **Payments**: Stripe Checkout & Webhooks

## Project Structure

```
milkie/
├── README.md              # This file
├── QUICKSTART.md          # Try it in 10 minutes
├── docs/                  # Documentation
│   ├── SUMMARY.md         # What we built
│   ├── PAYWALL_PATTERNS.md # Usage patterns
│   └── PAYWALL_UX.md      # User experience
└── demo/                  # Working prototype
    ├── app/               # Next.js app
    ├── lib/
    │   ├── milkie/       # 🚀 THE SDK (what becomes npm package)
    │   ├── db/           # Database
    │   └── stripe.ts     # Stripe config
    └── README.md         # Setup instructions
```

## Next Steps

1. **Try it** → Follow [QUICKSTART.md](QUICKSTART.md)
2. **Understand it** → Read [docs/SUMMARY.md](docs/SUMMARY.md)
3. **Learn patterns** → Check out [docs/PAYWALL_PATTERNS.md](docs/PAYWALL_PATTERNS.md)

## Contributing

This is a very early prototype. Not accepting contributions yet, but feedback is welcome!

Open an issue if you:
- Find bugs
- Have feature ideas
- Want to discuss the approach
- Would use this for your projects

## License

TBD (probably MIT once we figure out the business model)
