# Paywall User Experience

What users see when they encounter a Milkie paywall.

## The Default Paywall Screen

When a user tries to access protected content, they see a centered modal with:

```
┌─────────────────────────────────────┐
│                                     │
│        Upgrade to Continue          │
│   Subscribe to access this          │
│        premium content              │
│                                     │
│   ┌───────────────────────────┐   │
│   │ Email address             │   │
│   │ you@example.com           │   │
│   └───────────────────────────┘   │
│                                     │
│   ┌───────────────────────────┐   │
│   │     Subscribe Now         │   │
│   └───────────────────────────┘   │
│                                     │
│   You'll be redirected to Stripe   │
│   to complete your payment          │
│                                     │
└─────────────────────────────────────┘
```

### The Visual Design

- **Clean, centered card** with white background
- **Shadow and border** for depth
- **Large heading** "Upgrade to Continue"
- **Email input field** for user identification
- **Big blue button** "Subscribe Now"
- **Small disclaimer** about Stripe redirect

## The User Flow

### Step 1: User Hits Paywall
```
User navigates to /premium
    ↓
PaywallGate checks subscription
    ↓
No active subscription found
    ↓
Show paywall UI (default or custom)
```

### Step 2: User Enters Email
```
User types: user@example.com
    ↓
"Subscribe Now" button becomes enabled
    ↓
User clicks button
```

### Step 3: Redirect to Stripe
```
Creates checkout session via API
    ↓
Redirects to Stripe Checkout
    ↓
User enters payment info:
- Card: 4242 4242 4242 4242 (test)
- Expiry: Any future date
- CVC: Any 3 digits
    ↓
User completes payment
```

### Step 4: Back to App
```
Stripe redirects back to /success
    ↓
Webhook updates database
    ↓
User now has access
    ↓
Can access all premium content
```

## Customizing the Paywall UI

You have several options to customize what users see:

### Option 1: Use the Default (What We Built)
```tsx
<PaywallGate>
  <PremiumContent />
</PaywallGate>
```

Users see the default Milkie paywall UI.

### Option 2: Custom Fallback Component
```tsx
<PaywallGate fallback={<YourCustomPaywall />}>
  <PremiumContent />
</PaywallGate>
```

Show your own custom UI when users don't have access.

### Option 3: Use the Hook for Full Control
```tsx
'use client'

import { usePaywall } from 'milkie'

export default function Page() {
  const { hasAccess, loading } = usePaywall()

  if (loading) {
    return <YourLoadingSpinner />
  }

  if (!hasAccess) {
    return <YourFullyCustomPaywall />
  }

  return <PremiumContent />
}
```

Complete control over the UI and logic.

## Example: Custom Paywall UI

Here's an example of a custom paywall you might build:

```tsx
function CustomPaywall() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-12 max-w-lg shadow-2xl">
        <h1 className="text-4xl font-bold mb-4">🚀 Go Premium!</h1>
        <p className="text-gray-600 mb-8">
          Unlock all features and supercharge your workflow
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <span>Unlimited projects</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <span>Advanced analytics</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <span>Priority support</span>
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 border rounded-lg"
          />
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:opacity-90">
            Start Free Trial
          </button>
          <p className="text-xs text-center text-gray-500">
            $10/month • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  )
}
```

Then use it:

```tsx
<PaywallGate fallback={<CustomPaywall />}>
  <PremiumContent />
</PaywallGate>
```

## Loading States

### While Checking Subscription

When the app is checking if the user has access, they see:

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│           Loading...                │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

This prevents flickering between paywall and content.

### During Checkout

When the user clicks "Subscribe Now":

```
┌─────────────────────────────────────┐
│                                     │
│        Upgrade to Continue          │
│                                     │
│   ┌───────────────────────────┐   │
│   │ user@example.com          │   │
│   └───────────────────────────┘   │
│                                     │
│   ┌───────────────────────────┐   │
│   │       Loading...          │   │  ← Button disabled
│   └───────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

Then redirects to Stripe Checkout.

## Mobile Experience

The paywall is fully responsive:

**Desktop** (>768px):
- Centered card, max-width 28rem
- Large text and buttons
- Comfortable padding

**Mobile** (<768px):
- Full-width card with margins
- Adjusted font sizes
- Touch-friendly button sizes
- Same functionality

## Stripe Checkout UI

After clicking "Subscribe Now", users see Stripe's checkout:

1. **Professional Stripe-hosted page**
   - Your app name at the top
   - Price and billing details
   - Card input fields
   - Apple Pay / Google Pay (if available)

2. **Secure and trusted**
   - Stripe branding
   - SSL secure
   - PCI compliant

3. **Mobile-optimized**
   - Works on all devices
   - Supports mobile wallets

## After Payment Success

Users are redirected to `/success` page:

```
┌─────────────────────────────────────┐
│              🎉                     │
│                                     │
│     Welcome to Premium!             │
│                                     │
│  Your subscription is now active.   │
│  You have full access to all        │
│  premium content.                   │
│                                     │
│  [View Premium Content]  [Home]     │
│                                     │
└─────────────────────────────────────┘
```

## Seeing It In Action

Want to see the actual UI? Run the demo:

```bash
cd demo
npm run dev
```

Then visit:

1. **http://localhost:3000/premium** - See the default paywall
2. **http://localhost:3000/dashboard** - See it for a full app
3. Enter any email → See the flow
4. Complete checkout → See success page

## Customization Checklist

Things you can customize:

- [ ] Heading text
- [ ] Description text
- [ ] Button text and color
- [ ] Card background and borders
- [ ] Input field styling
- [ ] Logo or branding
- [ ] Benefits list
- [ ] Pricing information
- [ ] Footer text
- [ ] Loading spinner
- [ ] Success page

## Code Location

The default paywall UI is defined in:
- [demo/lib/milkie/paywall-gate.tsx](demo/lib/milkie/paywall-gate.tsx) (lines 60-105)

The success page is at:
- [demo/app/success/page.tsx](demo/app/success/page.tsx)

You can edit these files to customize the experience.

## Best Practices

### ✅ Do's

- **Show value before paywall** - Let users see what they're paying for
- **Clear pricing** - Be transparent about cost
- **Easy to understand** - Simple copy, clear CTA
- **Mobile-friendly** - Test on all devices
- **Fast loading** - Don't make users wait

### ❌ Don'ts

- **Don't be aggressive** - Give users a chance to explore first
- **Don't hide information** - Be upfront about what's included
- **Don't make it confusing** - One clear path to subscribe
- **Don't skip loading states** - Always show feedback
- **Don't forget success state** - Celebrate the conversion!

---

**Try it yourself**: Run the demo and see the full user experience from paywall → checkout → success → premium access.
