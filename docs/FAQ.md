# Frequently Asked Questions

Common questions and troubleshooting for Milkie.

## General

### Q: Can I have multiple PaywallGates in one app?

Yes! All `PaywallGate` components share the same subscription status from `MilkieProvider`. The subscription check happens once and is shared across all components.

```tsx
// app/feature-a/page.tsx
<PaywallGate><FeatureA /></PaywallGate>

// app/feature-b/page.tsx
<PaywallGate><FeatureB /></PaywallGate>

// Both gates use the same subscription status
```

### Q: Can I mix free and paid content on the same page?

Absolutely! See [Component-Level Gating](paywall-patterns/component-gating.md) for examples:

```tsx
<div>
  <FreeContent /> {/* Everyone sees this */}
  <PaywallGate>
    <PremiumContent /> {/* Only subscribers */}
  </PaywallGate>
</div>
```

### Q: What's the difference between PaywallGate and AuthGate?

- **`PaywallGate`** requires an active subscription (and authentication)
- **`AuthGate`** only requires authentication, no subscription needed

Use `AuthGate` for billing/settings pages where users need access regardless of subscription status.

| Component     | Requires Sign-In | Requires Subscription | Use Case                            |
| ------------- | ---------------- | --------------------- | ----------------------------------- |
| `PaywallGate` | Yes ✓            | Yes ✓                 | Premium features, paid content      |
| `AuthGate`    | Yes ✓            | No ✗                  | Billing, settings, user preferences |

### Q: Does the paywall work on mobile?

Yes, fully responsive. The Stripe checkout is also mobile-optimized.

### Q: Can I customize the paywall UI?

Yes! Use customization props (`title`, `subtitle`, `subscribeButtonText`, etc.) or the `customUi` prop for complete custom UI.

See [Customization Guide](reference/customization.md) for details.

## Visual Design

### Q: How does the blurred background preview work?

PaywallGate renders your protected content in the background with a `blur-sm` effect, then overlays the paywall card. This creates a preview that builds desire while maintaining context.

```tsx
<PaywallGate>
  <PremiumContent /> {/* Shown blurred in background */}
</PaywallGate>
```

### Q: Can I disable the blur effect?

Yes! Use `applyBlur={false}`:

```tsx
<PaywallGate applyBlur={false}>
  <PremiumContent /> {/* Paywall card shown inline without blur */}
</PaywallGate>
```

### Q: How do I add padding above the paywall overlay?

Use the `overlayClassName` prop:

```tsx
<PaywallGate overlayClassName="pt-8">
  <PremiumContent />
</PaywallGate>
```

### Q: How do I hide the "Powered by milkie" branding?

Pass `showBranding={false}` to PaywallGate:

```tsx
<PaywallGate showBranding={false}>
  <PremiumContent />
</PaywallGate>
```

### Q: Can I use a custom icon in the paywall card?

Yes! Pass any React node to the `icon` prop:

```tsx
import { Sparkles } from "lucide-react";

<PaywallGate icon={<Sparkles className="w-12 h-12 text-yellow-500" />}>
  <PremiumContent />
</PaywallGate>;
```

## Authentication & Redirects

### Q: How do I handle the redirect after sign-in?

PaywallGate and AuthGate automatically include `callbackUrl` in the sign-in redirect, so users return to the page they were trying to access.

```tsx
// User at /dashboard/analytics
<PaywallGate signInUrl="/signin">
  <Content />
</PaywallGate>

// Redirects to: /signin?callbackUrl=/dashboard/analytics
// After sign-in, user returns to /dashboard/analytics
```

### Q: Can I use a custom sign-in handler?

Yes! Use the `onSignIn` prop instead of `signInUrl`:

```tsx
<PaywallGate onSignIn={() => router.push("/custom-signin")}>
  <Content />
</PaywallGate>
```

## Metered Paywalls

### Q: Can I implement metered paywalls like Medium/NYT?

Yes! See [Metered Paywall](paywall-patterns/metered-paywall.md) for a complete implementation using server-side view tracking.

**Note:** The demo uses localStorage for simplicity, but production apps should use server-side tracking for security.

### Q: How do I track article views?

Use server-side tracking with your database:

```typescript
// Track views in a database table
CREATE TABLE article_views (
  id UUID PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  article_id VARCHAR(255) NOT NULL,
  viewed_at TIMESTAMP DEFAULT NOW(),
  view_month VARCHAR(7) NOT NULL,
  UNIQUE(user_id, article_id, view_month)
);
```

See the [Metered Paywall pattern](paywall-patterns/metered-paywall.md) for complete implementation.

## Error Handling

### Q: What happens if checkout fails?

PaywallGate displays inline error messages with a "Try again" button. No page refresh needed - users can retry immediately.

```tsx
<PaywallGate onToast={(msg, type) => toast[type](msg)}>
  <Content />
</PaywallGate>
```

### Q: How do I handle network errors?

Use the `onToast` callback for user-friendly error notifications:

```tsx
import { toast } from "sonner";

<PaywallGate onToast={(message, type) => toast[type](message)}>
  <Content />
</PaywallGate>;
```

See [Error Recovery](paywall-patterns/error-recovery.md) for more details.

### Q: How do I refresh subscription status after checkout?

Use the `checkSubscription()` function from the `usePaywall` hook:

```tsx
import { usePaywall } from "@milkie/react";
import { useEffect } from "react";

const { checkSubscription } = usePaywall();

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("session_id")) {
    // Refresh subscription status after successful checkout
    checkSubscription();
  }
}, [checkSubscription]);
```

## Stripe Integration

### Q: Do I need a Stripe account?

Yes, Milkie uses Stripe for payment processing. You'll need:

- Stripe account
- Stripe API keys (secret key and webhook secret)
- Stripe product/price created

See [Backend Setup](BACKEND_SETUP.md) for details.

### Q: Can I use multiple pricing tiers?

Milkie currently supports single-tier subscriptions. Multi-tier support (basic/pro/enterprise) is on the roadmap but hasn't been tested.

If you need tiers now, you can experiment with custom checkout handlers to pass different `priceId` values, but this is unverified.

### Q: How do webhooks work?

Stripe webhooks notify your app when subscription events occur (created, updated, canceled, etc.). Milkie's webhook route handles these automatically.

**Setup:**

1. Add webhook endpoint in Stripe Dashboard: `https://yourdomain.com/api/webhooks/stripe`
2. Get webhook secret from Stripe
3. Add to environment variables: `STRIPE_WEBHOOK_SECRET=whsec_...`

See [API Reference](reference/api-reference.md#webhook-route) for implementation details.

### Q: What subscription statuses are considered "active"?

By default, Milkie considers these statuses as having access:

- `"active"` - Subscription is active and paid
- `"trialing"` - User is in trial period

You can customize this in the subscription status route:

```typescript
createSubscriptionStatusRoute({
  findUserWithSubscription: async (email) => {
    /* ... */
  },
  allowedStatuses: ["active", "trialing"], // Customize here
});
```

## Troubleshooting

### Q: Subscription status not updating after checkout

**Solution:** Manually refresh after checkout:

```tsx
const { checkSubscription } = usePaywall();

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("session_id")) {
    checkSubscription();
  }
}, [checkSubscription]);
```

### Q: Paywall covering entire screen including navigation

**Solution:** Use page-level gating instead of layout-level:

```tsx
// ✅ Good - Page-level
// app/dashboard/page.tsx
<PaywallGate><Content /></PaywallGate>

// ❌ Avoid - Layout-level
// app/dashboard/layout.tsx
<PaywallGate>{children}</PaywallGate>
```

See [Best Practices](reference/best-practices.md) for more details.

### Q: Users can't access billing when subscription expired

**Solution:** Use `AuthGate` for billing pages instead of `PaywallGate`:

```tsx
// app/billing/page.tsx
<AuthGate>
  {" "}
  {/* Requires sign-in only, not subscription */}
  <BillingPage />
</AuthGate>
```

### Q: Webhook events not being received

**Common issues:**

- Wrong webhook secret in environment variables
- Endpoint not accessible (check production URL)
- HTTPS required for production webhooks

**Debug steps:**

1. Check Stripe Dashboard → Webhooks → View events
2. Verify webhook endpoint URL is correct
3. Check server logs for webhook processing errors
4. Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### Q: "No subscription found" but user just subscribed

**Possible causes:**

1. Webhook hasn't fired yet (wait a few seconds)
2. Webhook failed to process (check server logs)
3. Database not updated (check webhook route implementation)

**Solution:** Manually trigger `checkSubscription()` or check Stripe Dashboard to verify webhook delivery.

## Advanced

### Q: Can I use third-party payment processors?

Yes! Use the `onCheckout` prop to integrate with Paddle, Lemon Squeezy, or other providers:

```tsx
<PaywallGate
  onCheckout={async (email) => {
    // Create checkout with your provider
    const response = await fetch("/api/paddle/checkout", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    return { url: data.checkoutUrl };
  }}
>
  <Content />
</PaywallGate>
```

See [Custom Checkout](paywall-patterns/custom-checkout.md) for details.

### Q: How do I add UTM tracking to checkout?

Use a custom checkout handler:

```tsx
const handleCheckout = async (email: string) => {
  const searchParams = new URLSearchParams(window.location.search);

  const response = await fetch("/api/checkout", {
    method: "POST",
    body: JSON.stringify({
      email,
      metadata: {
        utm_source: searchParams.get("utm_source"),
        utm_campaign: searchParams.get("utm_campaign"),
      },
    }),
  });

  const data = await response.json();
  return { url: data.checkoutUrl };
};
```

See [Custom Checkout](paywall-patterns/custom-checkout.md) for more examples.

### Q: Can I implement server-side paywalls?

Yes! While Milkie provides client-side components for UX, always verify subscription status server-side for critical operations:

```typescript
// app/api/premium-data/route.ts
export async function GET(request: Request) {
  const session = await auth();
  const user = await db.findUserWithSubscription(session.user.email);

  if (user?.subscription?.status !== "active") {
    return Response.json({ error: "Premium required" }, { status: 403 });
  }

  return Response.json({ data: premiumData });
}
```

## Still Have Questions?

- Check the [Implementation Guide](IMPLEMENTATION_GUIDE.md)
- Review [Best Practices](reference/best-practices.md)
- Open an issue on GitHub
