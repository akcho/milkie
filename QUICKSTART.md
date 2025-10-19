# Quick Start

Get started with Milkie in minutes - either use the package in your project or run the demo locally.

---

## ⚡ Add to Your App

Add subscriptions to your existing Next.js app.

### 1. Install the package

```bash
npm install @milkie/react
```

### 2. Set up your backend

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

### 3. Wrap your app with MilkieProvider

```tsx
import { MilkieProvider } from "@milkie/react";

export default function RootLayout({ children }) {
  const session = await auth(); // Your auth solution

  return (
    <MilkieProvider email={session?.user?.email}>{children}</MilkieProvider>
  );
}
```

### 4. Gate your content

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

**Next steps:**

- [Backend Setup Guide](docs/BACKEND_SETUP.md) - Complete API routes and database setup
- [Auth Integration](docs/AUTH_INTEGRATION.md) - Works with any auth solution
- [Implementation Guide](docs/IMPLEMENTATION_GUIDE.md) - Complete guide to implementing paywalls: component gating, metered access, custom checkout, and more

---

## 🚀 Try the Live Demo (30 seconds)

**[milkie.dev](https://milkie.dev)**

1. Sign in with Google
2. Try accessing premium content - see the paywall
3. Click "Subscribe now"
4. Use test card: `4242 4242 4242 4242` (any expiry/CVC)
5. Access unlocked!

**Zero setup required.**

---

## 💻 Run the Demo Locally

Want to explore the code and see how it works under the hood?

**Note:** The demo uses the **published `@milkie/react` package from npm**, not the local workspace version. This ensures the demo always reflects what users will actually install.

### Prerequisites

- Node.js 18+
- Google account (for OAuth setup)
- Stripe account (free test mode)
- Stripe CLI

## Step 1: Set Up Google OAuth

1. Go to https://console.cloud.google.com/apis/credentials
2. Create a new project or select existing
3. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
4. Configure consent screen if prompted (External, add your email)
5. Application type: **Web application**
6. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Click **"Create"** and copy the **Client ID** and **Client Secret**

## Step 2: Set Up Stripe

### Get API Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Create a Product

1. Go to https://dashboard.stripe.com/test/products
2. Click **"Add product"**
3. Fill in:
   - Name: "Premium Subscription"
   - Description: Whatever you want
   - Price: $10.00
   - Billing period: Monthly (recurring)
4. Click **"Save product"**
5. Copy the **Price ID** (starts with `price_`)

## Step 3: Set Up the Project

```bash
# Clone and navigate to demo
cd demo

# Install dependencies
npm install

# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login
```

## Step 4: Configure Environment

Edit `demo/.env.local` and paste your keys:

```env
# Google OAuth (from Step 1)
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# NextAuth Secret (generate with: openssl rand -base64 32)
AUTH_SECRET=your_generated_secret_here

# Stripe (from Steps 2 & 3)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PRICE_ID=price_YOUR_PRICE_ID_HERE

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Generate AUTH_SECRET:**

```bash
openssl rand -base64 32
```

## Step 5: Run It

**Terminal 1 - Start the app:**

```bash
npm run dev
```

**Terminal 2 - Forward webhooks:**

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Important**: Copy the webhook secret from Terminal 2 (starts with `whsec_`)

Add it to `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
```

Restart Terminal 1 (Ctrl+C / Cmd+C then `npm run dev` again)

## Step 6: Test the Flow

1. **Open** http://localhost:3000
2. **Sign In** with Google
3. **Try the examples:**
   - Component Gating ([/mixed](http://localhost:3000/mixed)) - Mixed free/premium content
   - Layout Gating ([/dashboard](http://localhost:3000/dashboard)) - Full protected section
4. **See the paywall** - Shows your email, ready to subscribe
5. **Click "Subscribe now"**
6. **Enter test card:** `4242 4242 4242 4242` (any expiry/CVC)
7. **Complete checkout** - Redirected back with access!

### What's Happening

1. **Subscribe** → Creates Stripe checkout session
2. **Payment** → Stripe processes test payment
3. **Webhook** → Updates local database in real-time
4. **Redirect** → Returns to your page
5. **Access granted** → Content unlocked!

## Troubleshooting

### "Configuration" error or can't sign in with Google

- Make sure your Google Client ID and Client Secret are correct
- Check that the redirect URI `http://localhost:3000/api/auth/callback/google` is added in Google Cloud Console
- Make sure `AUTH_SECRET` is set in `.env.local`
- Restart the dev server after adding credentials

### "Webhook signature verification failed"

- Make sure you copied the webhook secret from Terminal 2
- Make sure you added it to `.env.local`
- Make sure you restarted the dev server

### "Failed to create checkout session"

- Check your Stripe secret key is correct
- Check the price ID is correct (starts with `price_`, not `prod_`)
- Look at Terminal 1 for error messages

### "Subscription status check failed"

- Make sure the webhook secret is set up
- Check that Terminal 2 (stripe listen) is running
- Look at Terminal 2 to see if webhooks are being received

---

## Next Steps

Once you have it running:

1. **Explore the patterns:**

   - [/free](http://localhost:3000/free) - Public content
   - [/mixed](http://localhost:3000/mixed) - Component-level gating
   - [/dashboard](http://localhost:3000/dashboard) - Layout-level gating

2. **Check the code:**

   - `demo/app/mixed/page.tsx` - Component gating example
   - `demo/app/dashboard/layout.tsx` - Layout gating example
   - `demo/lib/milkie-adapter.ts` - Database adapter implementation
   - `packages/react/` - The actual npm package source code

3. **Verify persistence:**

   - Your subscription persists in the local database
   - Sign out and back in - you still have access
   - Refresh the page - no re-authentication needed

4. **Read the docs:**
   - [IMPLEMENTATION_GUIDE.md](docs/IMPLEMENTATION_GUIDE.md) - 7 proven patterns, customization, API reference, best practices
   - [AUTH_INTEGRATION.md](docs/AUTH_INTEGRATION.md) - Works with any auth

---

## What You've Validated

If you made it this far, you've proven:

- ✅ Stripe integration works
- ✅ Webhooks work in real-time
- ✅ The SDK is simple to use
- ✅ Auth-agnostic approach works
- ✅ The developer experience is smooth

---

## 🔧 Local Development (Package Contributors)

If you're contributing to the `@milkie/react` package and want to test changes before publishing:

```bash
# 1. Build the package
cd packages/react
npm run build

# 2. Run the demo from the root (builds package, then starts demo)
cd ../..
npm run dev
```

This uses the monorepo workspace to link the local package build.

**For production testing:** The demo at [milkie.dev](https://milkie.dev) always uses the latest published version from npm.

---

**Need help?** Check the docs:

- [README.md](README.md) - Project overview and vision
- [docs/IMPLEMENTATION_GUIDE.md](docs/IMPLEMENTATION_GUIDE.md) - 7 proven patterns, customization, API reference, best practices
- [docs/AUTH_INTEGRATION.md](docs/AUTH_INTEGRATION.md) - Works with any auth
