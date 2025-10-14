# Quick Start

Get Milkie running in under 15 minutes - locally or on Vercel.

## 🚀 Try the Live Demo (30 seconds)

**[milkie-demo.vercel.app](https://milkie-demo.vercel.app)** *(coming soon)*

1. Sign in with Google
2. Try accessing premium content - see the paywall
3. Click "Subscribe now"
4. Use test card: `4242 4242 4242 4242` (any expiry/CVC)
5. Access unlocked!

**Zero setup required - see it working in 30 seconds.**

---

## 💻 Run Locally (15 min)

### Prerequisites
- Node.js 18+
- Google account (for OAuth setup)
- Stripe account (free test mode)
- Stripe CLI

## Step 1: Set Up Google OAuth (3 min)

1. Go to https://console.cloud.google.com/apis/credentials
2. Create a new project or select existing
3. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
4. Configure consent screen if prompted (External, add your email)
5. Application type: **Web application**
6. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Click **"Create"** and copy the **Client ID** and **Client Secret**

## Step 2: Set Up Stripe (5 min)

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

## Step 3: Set Up the Project (3 min)

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

## Step 4: Configure Environment (2 min)

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

## Step 5: Run It (2 min)

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

Restart Terminal 1 (Ctrl+C then `npm run dev` again)

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
   - `demo/lib/milkie/` - The SDK (what becomes the npm package)
   - `demo/app/mixed/page.tsx` - Component gating example
   - `demo/app/dashboard/layout.tsx` - Layout gating example

3. **Verify persistence:**
   - Your subscription persists in the local database
   - Sign out and back in - you still have access
   - Refresh the page - no re-authentication needed

4. **Read the docs:**
   - [PAYWALL_PATTERNS.md](docs/PAYWALL_PATTERNS.md) - Implementation patterns
   - [AUTH_INTEGRATION.md](docs/AUTH_INTEGRATION.md) - Works with any auth

---

## What You've Validated

If you made it this far, you've proven:
- ✅ Stripe integration works
- ✅ Webhooks work in real-time
- ✅ The SDK is simple to use
- ✅ Auth-agnostic approach works
- ✅ The developer experience is smooth

Ready to integrate into your own app? The SDK in `demo/lib/milkie/` is all you need.

---

**Need help?** Check the docs:
- [README.md](README.md) - Project overview and vision
- [docs/PAYWALL_PATTERNS.md](docs/PAYWALL_PATTERNS.md) - Implementation patterns
- [docs/AUTH_INTEGRATION.md](docs/AUTH_INTEGRATION.md) - Works with any auth
