# Milkie

> The NextAuth of payments — drop-in paywall infrastructure for developers.

Add a paywall to your weekend project in 5 minutes. Free until you're making $1k/mo.

## What is this?

Milkie is a plug-and-play paywall SDK for indie hackers and vibe coders. Wrap your content in `<PaywallGate>` and you're done. No Stripe integration, no webhook debugging, no subscription state management.

```tsx
<MilkieProvider>
  <PaywallGate>
    <YourPremiumContent />
  </PaywallGate>
</MilkieProvider>
```

That's it. Seriously.

## Current Status

**Working prototype** ✅

We have:
- ✅ Working SDK components
- ✅ Stripe checkout integration
- ✅ Webhook handling
- ✅ Database for subscriptions
- ✅ Demo application

We don't have yet:
- ❌ Multi-tenancy (it's a single demo)
- ❌ Dashboard for developers
- ❌ Published npm package
- ❌ Webhook relay service
- ❌ Production deployment

## Quick Start

Want to try it? Takes 10 minutes:

```bash
cd demo
npm install
# Follow setup in demo/README.md
```

**Read this first**: [QUICKSTART.md](QUICKSTART.md) - Get it running in 10 minutes

## Documentation

- [QUICKSTART.md](QUICKSTART.md) - Test the demo in 10 minutes
- [docs/SUMMARY.md](docs/SUMMARY.md) - What we built and why
- [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) - Roadmap and next steps
- [docs/PAYWALL_PATTERNS.md](docs/PAYWALL_PATTERNS.md) - How to paywall your app
- [docs/PAYWALL_UX.md](docs/PAYWALL_UX.md) - User experience guide
- [docs/TODO.md](docs/TODO.md) - Development roadmap
- [demo/README.md](demo/README.md) - Detailed setup instructions

## The Vision

### For Developers Using Milkie
```tsx
// That's the entire integration
import { MilkieProvider, PaywallGate } from 'milkie'

<MilkieProvider apiKey={process.env.MILKIE_API_KEY}>
  <App>
    <PaywallGate>
      <PremiumFeature />
    </PaywallGate>
  </App>
</MilkieProvider>
```

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
│   ├── GETTING_STARTED.md # Roadmap
│   ├── PAYWALL_PATTERNS.md # Usage patterns
│   ├── PAYWALL_UX.md      # User experience
│   └── TODO.md            # Task list
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
3. **Build it** → Follow [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)
4. **Ship it** → Get feedback, iterate, launch

## Contributing

This is a very early prototype. Not accepting contributions yet, but feedback is welcome!

Open an issue if you:
- Find bugs
- Have feature ideas
- Want to discuss the approach
- Would use this for your projects

## License

TBD (probably MIT once we figure out the business model)
