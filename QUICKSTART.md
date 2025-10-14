# Quick Start

## 🚀 Try the Hosted Demo (30 seconds)

**[milkie-demo.vercel.app](https://milkie-demo.vercel.app)** *(deploy your own - see below)*

1. Click "Sign In" → Use your Google account
2. Navigate to "Single Premium Page" or "Full App (Paywalled)"
3. See the paywall
4. Click "Subscribe Now"
5. Use Stripe test card: `4242 4242 4242 4242` (any expiry/CVC)
6. Done! You now have access

**No setup. No installation. See it working in 30 seconds.**

---

## 🚢 Deploy Your Own (20 min)

Want to host your own demo? See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full instructions.

Quick version:
1. Deploy to Vercel
2. Add environment variables (Google OAuth + Stripe)
3. Configure webhooks
4. Done!

---

## 💻 Run Locally (15 min)

Want to test locally or integrate into your own app?

### Prerequisites
- Node.js 18+ installed
- Google Cloud account (for OAuth)
- Stripe account (test mode is free)
- Stripe CLI (for webhook testing)

## Step 1: Set Up Google OAuth (3 min)

1. Go to https://console.cloud.google.com/apis/credentials
2. Create a new project or select existing
3. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
4. Configure consent screen if prompted (External, add your email)
5. Application type: **Web application**
6. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Click **"Create"** and copy the **Client ID** and **Client Secret**

## Step 2: Get Stripe Keys (2 min)

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy these two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

## Step 2: Create a Product (2 min)

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

1. Open http://localhost:3000
2. Click **"Sign In"** → Sign in with your Google account
3. Click **"Single Premium Page"** or **"Full App (Paywalled)"**
4. You'll see the paywall showing your email
5. Click **"Subscribe Now"**
6. Use test card: `4242 4242 4242 4242`
7. Any future expiry date, any CVC
8. Complete checkout
9. You're redirected back with access!

## What's Happening Behind the Scenes

1. You click subscribe → Creates a Stripe checkout session
2. You enter payment → Stripe processes it
3. Webhook fires → Updates your local database
4. You're redirected → App checks subscription status
5. You have access! → Content is unlocked

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

## Next Steps

Once it's working:
1. Try accessing the premium content again - you should still have access (persisted in database)
2. Sign out and sign back in - you'll still have access (subscription is tied to your email)
3. Look at the code in `demo/lib/milkie/` - that's the SDK
4. Look at `demo/app/premium/page.tsx` - see how simple the integration is
5. Try integrating into your own app - works with NextAuth, Clerk, Lucia, Supabase, etc.

## Understanding the Code

**The SDK** (`demo/lib/milkie/`):
- This is what would be published to npm
- Developers would `npm install milkie` and import these components
- It's currently ~200 lines of code

**The demo app**:
- Shows how a developer would use the SDK
- In production, each developer would run their own version
- The API routes would eventually be hosted by you (Milkie platform)

## What This Proves

If this works, you've validated:
- ✅ Stripe integration works
- ✅ Webhooks work
- ✅ The SDK works
- ✅ The developer experience is simple
- ✅ The concept makes sense

Now you can show this to other developers and get their feedback!

---

**Questions?** Read the full docs:
- [README.md](README.md) - Project overview
- [demo/README.md](demo/README.md) - Detailed setup
- [docs/SUMMARY.md](docs/SUMMARY.md) - What we built
- [docs/PAYWALL_PATTERNS.md](docs/PAYWALL_PATTERNS.md) - How to implement paywalls
