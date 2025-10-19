# Best Practices

Tips, gotchas, and recommendations for implementing paywalls with Milkie.

## Routing & Access Control

### 1. Public Routes First

Always keep your landing page and marketing content public:

```tsx
// ✅ Good structure
/                    → Public landing page
/features           → Public features
/pricing            → Public pricing
/blog               → Public blog
/dashboard/*        → Protected with PaywallGate
```

**Why:** Users need to understand your product before subscribing.

### 2. Use Page-Level Gating for Flexibility

Protect individual pages instead of entire layouts:

```tsx
// ✅ Good - Page-level gating allows mixing access requirements
// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <PaywallGate>
      <DashboardContent />
    </PaywallGate>
  );
}

// app/dashboard/settings/page.tsx
export default function SettingsPage() {
  return (
    <AuthGate>
      {" "}
      {/* Sign-in only, no subscription */}
      <SettingsContent />
    </AuthGate>
  );
}

// ❌ Avoid - Layout-level gating prevents accessing billing when subscription inactive
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return <PaywallGate>{children}</PaywallGate>; // Blocks billing page!
}
```

**Why page-level is better:**

- Users need access to billing/settings even without active subscription
- Navigation and header remain visible (better UX)
- Paywall overlay centered in content area instead of covering entire viewport
- Flexible mixing of PaywallGate and AuthGate per page

### 3. When to Use AuthGate vs PaywallGate

| Use Case         | Component     | Reason                                      |
| ---------------- | ------------- | ------------------------------------------- |
| Premium features | `PaywallGate` | Requires active subscription                |
| Billing page     | `AuthGate`    | User needs access even without subscription |
| Settings page    | `AuthGate`    | User needs access even without subscription |
| Dashboard home   | `PaywallGate` | Core premium feature                        |
| Profile page     | `AuthGate`    | Personal data, not premium feature          |

## Component Usage

### 1. Provide Custom UI with Context

Show value in your `customUi` content:

```tsx
// ✅ Good - Shows specific value
<PaywallGate
  customUi={
    <div>
      <h2>Premium Analytics</h2>
      <ul>
        <li>Advanced metrics and insights</li>
        <li>Custom reporting</li>
        <li>Export to CSV/PDF</li>
      </ul>
    </div>
  }
>
  <AdvancedAnalytics />
</PaywallGate>

// ❌ Avoid - Vague, doesn't show value
<PaywallGate
  customUi={<div>Upgrade to see this</div>}
>
  <AdvancedAnalytics />
</PaywallGate>
```

### 2. Customize for Your Brand and Use Case

Use the customization props to match your app:

```tsx
<PaywallGate
  title="Unlock Advanced Features"
  subtitle="Get full access to all premium tools"
  subscribeButtonText="Upgrade to Pro"
  signInButtonText="Sign in to continue"
  signInUrl="/signin"
>
  <PremiumContent />
</PaywallGate>
```

### 3. Always Handle Loading States

```tsx
const { hasAccess, loading } = usePaywall();

// ✅ Good - Prevents flash of wrong content
if (loading) return <LoadingState />;
if (!hasAccess) return <UpgradePrompt />;
return <PremiumContent />;

// ❌ Bad - Content flashes before paywall appears
if (!hasAccess) return <UpgradePrompt />;
return <PremiumContent />;
```

### 4. Manual Subscription Refresh

Use `checkSubscription()` to manually refresh subscription status after checkout:

```tsx
import { usePaywall } from "milkie";
import { useEffect } from "react";

export default function DashboardPage() {
  const { hasAccess, checkSubscription } = usePaywall();

  useEffect(() => {
    // Check if user just completed checkout
    const params = new URLSearchParams(window.location.search);
    if (params.get("session_id")) {
      // Refresh subscription status after successful checkout
      checkSubscription();
    }
  }, [checkSubscription]);

  // ... rest of component
}
```

## Error Handling

### 1. Provide Toast Notifications

Always provide the `onToast` callback for better UX:

```tsx
import { toast } from "sonner";

// ✅ Good - User sees both inline error and toast
<PaywallGate onToast={(msg, type) => toast[type](msg)}>
  <PremiumContent />
</PaywallGate>

// ❌ OK but less friendly - Only inline error
<PaywallGate>
  <PremiumContent />
</PaywallGate>
```

### 2. Clear Errors and Retry

Provide retry functionality:

```tsx
const { error, clearError, checkSubscription } = usePaywall();

if (error) {
  return (
    <div>
      <p>Error: {error}</p>
      <button
        onClick={() => {
          clearError();
          checkSubscription();
        }}
      >
        Try Again
      </button>
    </div>
  );
}
```

### 3. User-Friendly Error Messages

Never expose technical errors to users:

```tsx
// ✅ Good
"Unable to start checkout. Please try again.";

// ❌ Bad
"STRIPE_API_KEY is not defined";
"Database connection failed: ECONNREFUSED";
```

## Server-Side Rendering (SSR)

### Works with Next.js App Router

MilkieProvider works seamlessly with SSR:

```tsx
// app/layout.tsx (server component)
import { auth } from "@/auth";
import { MilkieProvider } from "milkie";

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html>
      <body>
        <MilkieProvider email={session?.user?.email}>{children}</MilkieProvider>
      </body>
    </html>
  );
}
```

**Note:** The subscription check happens client-side via `useEffect`, so there's no SSR hydration mismatch.

## Security

### 1. Never Rely on Client-Side Checks Alone

Always verify subscription status server-side for critical operations:

```tsx
// ✅ Good - Client-side gate for UX, server-side check for security
// app/api/premium-data/route.ts
export async function GET(request: Request) {
  const session = await auth();
  const user = await db.findUserWithSubscription(session.user.email);

  if (!user?.subscription?.status === "active") {
    return Response.json({ error: "Premium required" }, { status: 403 });
  }

  return Response.json({ data: premiumData });
}
```

### 2. Validate Callback URLs

Callback URLs are validated automatically to prevent open redirect vulnerabilities:

- Blocks path traversal (`../`)
- Blocks dangerous schemes (`javascript:`, `data:`)
- Only allows relative paths or same-origin URLs

### 3. Secure Environment Variables

Never commit secrets to version control:

```env
# ✅ Good - In .env.local (gitignored)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
POSTGRES_URL=postgresql://...

# ❌ Bad - Never commit these
```

## Responsive Design

### Handling Long Content on Mobile

For long scrolling content, the default centered paywall card can appear off-screen on mobile devices. Consider these optimizations:

**1. Disable blur on mobile for inline display:**

```tsx
"use client";
import { useIsMobile } from "@/hooks/use-is-mobile";

export default function ArticlePage() {
  const isMobile = useIsMobile();

  return (
    <PaywallGate position="top" showBlurredChildren={!isMobile}>
      <LongNewsArticle />
    </PaywallGate>
  );
}
```

**Why this approach:**

- On mobile, long blurred content creates excessive height, pushing the centered card off-screen
- Disabling blur shows the paywall card inline at the top (no scrolling needed)
- Desktop keeps the blurred preview effect for better visual context
- Prevents users from having to scroll to find the subscribe button

**2. Use top positioning for article-style content:**

```tsx
<PaywallGate position="top">
  <ArticleContent />
</PaywallGate>
```

**When to use top positioning:**

- Long articles or blog posts
- Content that naturally scrolls
- Mobile-first designs
- When preview content is shown above the paywall

## Performance

### 1. Database Indexes

Add indexes on frequently queried fields:

```sql
-- Users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);

-- Subscriptions table
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
```

### 2. Avoid Over-Checking Subscriptions

```tsx
// ✅ Good - Check once on mount
useEffect(() => {
  checkSubscription();
}, []);

// ❌ Bad - Excessive API calls
useEffect(() => {
  const interval = setInterval(checkSubscription, 1000);
  return () => clearInterval(interval);
}, []);
```

## Production Checklist

Before going live:

- [ ] Test in both light and dark modes
- [ ] Test on mobile devices
- [ ] Set up Stripe webhooks with proper endpoint
- [ ] Use HTTPS for webhook endpoint
- [ ] Add error logging (Sentry, etc.)
- [ ] Test error recovery flows
- [ ] Verify callback URLs work correctly
- [ ] Test subscription status updates via webhooks
- [ ] Add database indexes
- [ ] Set up rate limiting on checkout API
- [ ] Test with real Stripe keys (not test mode)

## Common Gotchas

### 1. Subscription Status Not Updating

If subscription status doesn't update after checkout:

```tsx
// Solution: Manually refresh after checkout
const { checkSubscription } = usePaywall();

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("session_id")) {
    checkSubscription();
  }
}, [checkSubscription]);
```

### 2. Paywall Covering Entire Screen

If paywall covers your navigation:

```tsx
// ✅ Solution: Use page-level gating, not layout-level
// app/dashboard/page.tsx
<PaywallGate><Content /></PaywallGate>

// ❌ Problem: Layout-level gating
// app/dashboard/layout.tsx
<PaywallGate>{children}</PaywallGate>
```

### 3. Users Can't Access Billing When Subscription Expired

```tsx
// ✅ Solution: Use AuthGate for billing
// app/billing/page.tsx
<AuthGate><BillingPage /></AuthGate>

// ❌ Problem: PaywallGate blocks billing
<PaywallGate><BillingPage /></PaywallGate>
```

### 4. Webhook Events Not Processing

Common issues:

- Wrong webhook secret
- Endpoint not accessible (local development)
- Missing database user for Stripe customer ID

```tsx
// Debug webhook issues
console.log("Received event:", event.type);
console.log("Customer ID:", customerId);
const user = await db.findUserByCustomerId(customerId);
console.log("Found user:", user);
```

## Testing

### Test Subscription Flows

1. **New user checkout**: Sign up → Checkout → Verify access granted
2. **Existing user**: Sign in → Verify access based on subscription
3. **Expired subscription**: Cancel subscription → Verify access revoked
4. **Webhook processing**: Trigger webhook → Verify database updated

### Test Error States

1. **Network errors**: Throttle network → Try checkout → Verify error UI
2. **Invalid email**: Use invalid email → Verify validation
3. **Stripe errors**: Use Stripe test cards → Verify error handling

## Related

- [Implementation Guide](../IMPLEMENTATION_GUIDE.md) - 7 paywall patterns (component gating, metered access, custom checkout, etc.)
- [API Reference](api-reference.md) - Technical details
- [Customization](customization.md) - UI customization options
