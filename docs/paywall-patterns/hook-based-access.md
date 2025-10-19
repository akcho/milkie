# Pattern 5: Hook-Based Conditional Access

Use the `usePaywall` hook for fine-grained control and custom experiences.

## Perfect for:

- Custom UI flows
- Complex access logic
- Programmatic access checks
- Custom paywall experiences

## Implementation

```tsx
"use client";

import { usePaywall } from "milkie";

export default function FeaturePage() {
  const { hasAccess, loading, email, status } = usePaywall();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!hasAccess) {
    return <CustomUpgradePrompt />;
  }

  return (
    <div>
      <h1>Premium Feature</h1>
      <p>Welcome, {email}!</p>
      {/* Your premium feature */}
    </div>
  );
}
```

## Hook API Reference

The `usePaywall` hook provides complete access to subscription state:

```typescript
const {
  hasAccess, // boolean - Whether user has an active subscription
  loading, // boolean - Whether subscription check is in progress
  email, // string | null - User's email from MilkieProvider
  status, // string | null - Subscription status
  error, // string | null - Error message if check failed
  checkSubscription, // () => Promise<void> - Manual refresh function
  clearError, // () => void - Clear the current error state
} = usePaywall();
```

### Subscription Status Values

- `"active"` - Subscription is active and valid
- `"trialing"` - User is in trial period
- `"canceled"` - Subscription was canceled
- `"past_due"` - Payment failed, grace period
- `"unpaid"` - Payment failed, subscription ended
- `null` - No subscription found

## Use Cases

### 1. Custom Loading State

```tsx
const { hasAccess, loading } = usePaywall();

if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
      <p>Checking subscription...</p>
    </div>
  );
}
```

### 2. Conditional Feature Rendering

```tsx
const { hasAccess } = usePaywall();

return (
  <div>
    <BasicFeatures />
    {hasAccess && <PremiumFeatures />}
    {!hasAccess && <UpgradeBanner />}
  </div>
);
```

### 3. Status-Based Messaging

```tsx
const { status, hasAccess } = usePaywall();

if (status === "trialing") {
  return <TrialBanner daysRemaining={7} />;
}

if (status === "past_due") {
  return <PaymentFailedAlert />;
}

if (!hasAccess) {
  return <UpgradePrompt />;
}
```

### 4. Manual Subscription Refresh

Useful after checkout or webhook updates:

```tsx
import { useEffect } from "react";
import { usePaywall } from "milkie";

export function DashboardPage() {
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

### 5. Error Handling

```tsx
const { error, clearError, checkSubscription } = usePaywall();

if (error) {
  return (
    <div className="p-4 bg-red-50 rounded-lg">
      <p className="text-red-800">Error: {error}</p>
      <button
        onClick={() => {
          clearError();
          checkSubscription();
        }}
        className="mt-2 text-sm text-red-600 underline"
      >
        Try Again
      </button>
    </div>
  );
}
```

### 6. Complex Access Logic

```tsx
const { hasAccess, status, loading } = usePaywall();

// Show content during trial OR active subscription
const canAccessContent = hasAccess || status === "trialing";

// Different UI for trial vs paid
const isPaidUser = hasAccess && status === "active";

return (
  <div>
    {canAccessContent ? (
      <>
        <Content />
        {!isPaidUser && <TrialWarning />}
      </>
    ) : (
      <PaywallGate />
    )}
  </div>
);
```

## Combining with Components

The hook works seamlessly with PaywallGate:

```tsx
const { hasAccess, status } = usePaywall();

// Use hook for logic, component for UI
if (status === "canceled") {
  return (
    <PaywallGate
      title="Your subscription has ended"
      subtitle="Reactivate to continue using premium features"
      subscribeButtonText="Reactivate subscription"
    >
      <Content />
    </PaywallGate>
  );
}

if (!hasAccess) {
  return (
    <PaywallGate>
      <Content />
    </PaywallGate>
  );
}

return <Content />;
```

## Best Practices

### 1. Always Handle Loading State

```tsx
// ✅ Good
if (loading) return <Spinner />;
if (!hasAccess) return <Paywall />;
return <Content />;

// ❌ Bad - content flashes before paywall appears
if (!hasAccess) return <Paywall />;
return <Content />;
```

### 2. Use Type Guards

```tsx
const { status } = usePaywall();

// TypeScript-safe status checks
if (status === "active" || status === "trialing") {
  // User has access
}
```

### 3. Avoid Over-Checking

```tsx
// ✅ Good - check once on mount
useEffect(() => {
  checkSubscription();
}, []);

// ❌ Bad - excessive API calls
useEffect(() => {
  const interval = setInterval(checkSubscription, 1000);
  return () => clearInterval(interval);
}, []);
```

## Related Patterns

- [Component-Level Gating](component-gating.md) - Use hook for logic, components for UI
- [Error Recovery](error-recovery.md) - Error handling patterns

## Next Steps

- Review [customization options](../reference/customization.md) for custom UIs
- See [best practices](../reference/best-practices.md) for loading state tips
