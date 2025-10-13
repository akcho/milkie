# Quick Start - Test Milkie in 10 Minutes

Want to see it working? Here's the fastest path:

## Prerequisites
- Node.js 18+ installed
- A Stripe account (free to sign up)
- Homebrew (for Stripe CLI)

## Step 1: Get Stripe Keys (2 min)

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

## Step 4: Configure Environment (1 min)

Edit `demo/.env.local` and paste your keys:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PRICE_ID=price_YOUR_PRICE_ID_HERE
NEXT_PUBLIC_APP_URL=http://localhost:3000
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
2. Click **"Premium Content"**
3. Enter any email (e.g., test@example.com)
4. Click **"Subscribe Now"**
5. Use test card: `4242 4242 4242 4242`
6. Any future expiry date, any CVC
7. Complete checkout
8. You're redirected back with access!

## What's Happening Behind the Scenes

1. You click subscribe → Creates a Stripe checkout session
2. You enter payment → Stripe processes it
3. Webhook fires → Updates your local database
4. You're redirected → App checks subscription status
5. You have access! → Content is unlocked

## Troubleshooting

### "Webhook signature verification failed"
- Make sure you copied the webhook secret from Terminal 2
- Make sure you added it to `.env.local`
- Make sure you restarted the dev server

### "Failed to create checkout session"
- Check your Stripe secret key is correct
- Check the price ID is correct
- Look at Terminal 1 for error messages

### "Subscription status check failed"
- Make sure the webhook secret is set up
- Check that Terminal 2 (stripe listen) is running
- Look at Terminal 2 to see if webhooks are being received

## Next Steps

Once it's working:
1. Try accessing `/premium` again - you should still have access (persisted in localStorage)
2. Clear localStorage and try again - you'll need to subscribe again
3. Look at the code in `demo/lib/milkie/` - that's the SDK
4. Look at `demo/app/premium/page.tsx` - see how simple the integration is

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
- [GETTING_STARTED.md](GETTING_STARTED.md) - Roadmap
- [SUMMARY.md](SUMMARY.md) - What we built
