# Milkie Demo App

This is a working prototype of Milkie - a drop-in paywall infrastructure for developers.

## What This Demonstrates

This demo shows the complete flow of a paywall system:
1. Free content anyone can access
2. Premium content protected by `<PaywallGate>`
3. Stripe checkout integration
4. Webhook handling for subscription updates
5. Real-time entitlement checks

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Stripe

1. Create a Stripe account at https://stripe.com
2. Go to https://dashboard.stripe.com/test/apikeys
3. Copy your **Publishable key** and **Secret key**

### 3. Create a Product in Stripe

1. Go to https://dashboard.stripe.com/test/products
2. Click "Add product"
3. Name: "Premium Subscription" (or whatever you want)
4. Price: $10/month (or whatever you want)
5. Set to recurring monthly billing
6. Click "Save product"
7. Copy the **Price ID** (starts with `price_...`)

### 4. Configure Environment Variables

Edit `.env.local` and add your Stripe keys:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PRICE_ID=price_your_price_id_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Set Up Stripe CLI (for webhooks)

Install the Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe
```

Login to Stripe:
```bash
stripe login
```

### 6. Run the App

In one terminal, start the Next.js dev server:
```bash
npm run dev
```

In another terminal, forward Stripe webhooks to your local server:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret (starts with `whsec_...`) and add it to `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

Restart the dev server.

## Testing the Flow

1. Visit http://localhost:3000
2. Click "Premium Content"
3. You'll see the paywall
4. Enter an email address
5. Click "Subscribe Now"
6. Use Stripe test card: `4242 4242 4242 4242`
7. Any future date and CVC
8. Complete checkout
9. You'll be redirected back and now have access!

## How It Works

### The SDK Components

**`<MilkieProvider>`** - Wraps your app and manages subscription state
```tsx
<MilkieProvider>
  {children}
</MilkieProvider>
```

**`<PaywallGate>`** - Protects content behind a paywall
```tsx
<PaywallGate>
  <YourPremiumContent />
</PaywallGate>
```

**`usePaywall()`** - Hook to access subscription state
```tsx
const { hasAccess, status, loading } = usePaywall();
```

### The API Routes

- `/api/checkout` - Creates a Stripe checkout session
- `/api/webhooks/stripe` - Receives Stripe webhook events
- `/api/subscription/status` - Checks if user has active subscription

### The Database

Simple SQLite database with two tables:
- `users` - Stores user email and Stripe customer ID
- `subscriptions` - Stores subscription status and metadata

## What's Next?

This is a working prototype. To turn this into a real product, you'd need to:

1. **Extract the SDK** - Move the `lib/milkie` folder into a separate npm package
2. **Add authentication** - Right now we're just using email, add proper auth
3. **Build a dashboard** - Let developers manage their projects and view analytics
4. **Add webhook relay** - Forward Stripe webhooks to customer apps
5. **Multi-tenancy** - Support multiple developers using the platform
6. **More features** - Usage tracking, quota limits, custom pricing, etc.

## Project Structure

```
demo/
├── app/
│   ├── api/
│   │   ├── checkout/          # Create Stripe checkout session
│   │   ├── subscription/      # Check subscription status
│   │   └── webhooks/stripe/   # Handle Stripe webhooks
│   ├── free/                  # Free content page
│   ├── premium/               # Premium content (protected)
│   ├── success/               # Post-checkout success page
│   └── page.tsx               # Home page
├── lib/
│   ├── db/                    # Database schema and config
│   ├── milkie/                # 🎯 THE SDK (this is what devs would install)
│   │   ├── provider.tsx       # Context provider and usePaywall hook
│   │   ├── paywall-gate.tsx   # Paywall component
│   │   └── index.ts           # Exports
│   └── stripe.ts              # Stripe client config
└── .env.local                 # Environment variables
```

The `lib/milkie` folder is the actual SDK that would be published to npm!
