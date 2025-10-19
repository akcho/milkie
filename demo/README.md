# Milkie Demo

This demo showcases the `milkie` package in action.

## Running Locally

**Important:** This demo uses the local workspace version of the package for development.

### Quick Start

```bash
# From the demo directory
cd demo
npm install
npm run dev
```

### For Development (Using Local Package)

If you're developing the package and want to test changes before publishing:

1. Build the package:

   ```bash
   cd packages/react
   npm run build
   ```

2. Update demo to use workspace:

   ```bash
   cd demo
   # Edit package.json: "milkie": "workspace:*"
   npm install
   ```

3. Update globals.css:

   ```css
   @source "../../packages/react/dist";
   ```

4. Run the demo:
   ```bash
   npm run dev
   ```

## Environment Setup

Copy `.env.example` to `.env.local` and configure:

- `AUTH_SECRET` - NextAuth secret
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_PRICE_ID` - Your Stripe price ID
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_APP_URL` - Your app URL

## Features Demonstrated

- **Dashboard** - Full page paywall protection
- **Mixed Content** - Component-level gating
- **Metered Paywall** - NYT/Medium-style article gates
- **Billing** - Subscription management with AuthGate

Visit [milkie.dev](https://milkie.dev) to see it live!
