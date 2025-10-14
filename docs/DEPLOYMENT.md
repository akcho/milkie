# Deploying the Milkie Demo to Vercel

This guide shows how to deploy the Milkie demo to Vercel so others can try it without local setup.

## Prerequisites

- Vercel account (free)
- Google Cloud account (for OAuth)
- Stripe account (test mode is free)

---

## Step 1: Set Up Google OAuth (5 min)

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project (or select existing)
3. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
4. Configure consent screen if prompted:
   - User Type: External
   - App name: "Milkie Demo"
   - User support email: your email
   - Developer contact: your email
5. Application type: **Web application**
6. Name: "Milkie Demo"
7. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for local testing)
   - `https://your-app.vercel.app/api/auth/callback/google` (update after deployment)
8. Click **Create**
9. Copy the **Client ID** and **Client Secret**

---

## Step 2: Set Up Stripe (5 min)

### Create Product

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/products)
2. Click **"Add product"**
3. Fill in:
   - Name: "Premium Subscription"
   - Description: "Access to premium features"
   - Pricing: $10.00 USD
   - Billing period: Monthly (recurring)
4. Click **"Save product"**
5. Copy the **Price ID** (starts with `price_...`)

### Get API Keys

1. Go to [API Keys](https://dashboard.stripe.com/test/apikeys)
2. Copy:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`) - Click "Reveal test key"

### Webhook Secret (We'll add this after deployment)

---

## Step 3: Deploy to Vercel (2 min)

### Option A: Deploy via GitHub (Recommended)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: **demo**
   - Build Command: `npm run build`
   - Install Command: `npm install`
6. Click **"Deploy"** (will fail first time - that's okay, we need to add env vars)

### Option B: Deploy via Vercel CLI

```bash
cd demo
npx vercel
# Follow prompts, select demo directory as root
```

---

## Step 4: Add Environment Variables (3 min)

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add these variables (for Production, Preview, and Development):

```
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_from_step_1
GOOGLE_CLIENT_SECRET=your_client_secret_from_step_1

# NextAuth Secret (generate with: openssl rand -base64 32)
AUTH_SECRET=generate_random_32_char_string

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...

# App URL (use your Vercel URL)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

3. Click **"Save"**
4. Go to **Deployments** → Click **"..."** on latest deployment → **"Redeploy"**

---

## Step 5: Update Google OAuth Redirect (1 min)

1. Go back to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client ID
3. Add to **Authorized redirect URIs**:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
4. Click **"Save"**

---

## Step 6: Set Up Stripe Webhooks (3 min)

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click **"Add endpoint"**
3. Endpoint URL: `https://your-app.vercel.app/api/webhooks/stripe`
4. Description: "Milkie Demo Webhooks"
5. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
6. Click **"Add endpoint"**
7. Click on your new webhook → **"Reveal"** under **Signing secret**
8. Copy the signing secret (starts with `whsec_...`)
9. Go back to Vercel → **Environment Variables**
10. Add:
    ```
    STRIPE_WEBHOOK_SECRET=whsec_...
    ```
11. **Redeploy** again

---

## Step 7: Test It! (1 min)

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Click **"Sign In"** → Sign in with Google
3. Navigate to **"Single Premium Page"** or **"Full App (Paywalled)"**
4. See the paywall
5. Click **"Subscribe Now"**
6. Use Stripe test card: `4242 4242 4242 4242` (any future expiry, any CVC)
7. Complete checkout
8. You should be redirected back and see the premium content!

---

## Troubleshooting

### "Configuration mismatch" from Google
- Make sure your Vercel URL is added to authorized redirect URIs
- Check for trailing slashes (shouldn't have them)

### Stripe checkout doesn't redirect back
- Check `NEXT_PUBLIC_APP_URL` is set to your Vercel URL (no trailing slash)
- Make sure you redeployed after adding env vars

### Webhooks not working
- Check webhook signing secret is correct
- Test webhook in Stripe dashboard → "Send test webhook"
- Check Vercel logs for errors

### Database not persisting
- Vercel functions are stateless - the SQLite database resets on each deployment
- For production, you'd need to use Postgres/MySQL (see below)

---

## Production Considerations

### Database

The demo uses SQLite which doesn't persist on Vercel. For production:

1. Use **Vercel Postgres** (easiest):
   ```bash
   vercel postgres create
   ```

2. Or use **Neon**, **Supabase**, **PlanetScale**, etc.

3. Update `demo/lib/db/index.ts` to use Postgres instead of SQLite

### Custom Domain

1. In Vercel → **Settings** → **Domains**
2. Add your custom domain
3. Update `NEXT_PUBLIC_APP_URL` env var
4. Update Google OAuth redirect URIs
5. Update Stripe webhook URL

---

## Cost Breakdown

All free for the demo:

- **Vercel**: Free tier (100GB bandwidth/month)
- **Google OAuth**: Free
- **Stripe**: Free in test mode
- **Database**: SQLite (local) or Vercel Postgres free tier

---

## Share Your Demo!

Once deployed, you can share:

- Live demo URL
- "Try it in 30 seconds"
- No setup required
- Works on mobile

Perfect for HN, Reddit, Twitter, etc.
