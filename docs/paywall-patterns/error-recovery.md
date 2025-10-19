# Pattern 6: Error Recovery with Retry

Handle checkout errors gracefully without disrupting the user experience.

## Perfect for:

- Handling network failures gracefully
- Providing users with self-service recovery
- Avoiding jarring browser alerts
- Production-ready error handling

## Implementation

```tsx
"use client";

import { PaywallGate } from "milkie";
import { toast } from "sonner";

export default function RobustPaywallPage() {
  const handleToast = (message: string, type: "success" | "error") => {
    if (type === "error") {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  return (
    <PaywallGate
      onToast={handleToast}
      title="Unlock Premium Features"
      subtitle="Subscribe for unlimited access"
    >
      <PremiumContent />
    </PaywallGate>
  );
}
```

## Built-in Error Handling

PaywallGate includes automatic error recovery features:

### 1. Inline Error Display

Errors appear directly in the paywall card with an AlertCircle icon:

```
⚠️ Unable to start checkout. Please try again.
[Try Again] button appears automatically
```

### 2. Toast Notifications

Use the `onToast` callback for non-blocking error messages:

```tsx
<PaywallGate
  onToast={(message, type) => {
    if (type === "error") {
      toast.error(message);
    } else {
      toast.success(message);
    }
  }}
/>
```

Compatible with:

- [Sonner](https://sonner.emilkowal.ski/)
- [React Hot Toast](https://react-hot-toast.com/)
- Any toast library with a similar API

### 3. Automatic Retry

- "Try again" button appears automatically on error
- No page refresh needed
- Error state clears automatically on retry
- Loading state shown during retry

## Error States Handled

PaywallGate automatically handles:

| Error Type           | User Message                                  | Recovery     |
| -------------------- | --------------------------------------------- | ------------ |
| Network failure      | "Unable to connect to checkout service"       | Retry button |
| API error (4xx/5xx)  | "Unable to start checkout. Please try again." | Retry button |
| Missing checkout URL | "Unable to start checkout. Please try again." | Retry button |
| JavaScript errors    | Generic error message                         | Retry button |

## Custom Error Handling

For advanced use cases, use the `usePaywall` hook:

```tsx
"use client";

import { usePaywall } from "milkie";
import { AlertTriangle } from "lucide-react";

export function CustomErrorHandling() {
  const { error, clearError, checkSubscription } = usePaywall();

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900">
              Subscription Check Failed
            </h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={async () => {
                clearError();
                await checkSubscription();
              }}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <PremiumContent />;
}
```

## Testing Error Handling

### Network Errors

Use browser DevTools to simulate network failures:

1. Open DevTools → Network tab
2. Set throttling to "Offline"
3. Click subscribe button
4. Observe error message and retry flow

### API Errors

Temporarily modify your checkout API to return errors:

```tsx
// app/api/checkout/route.ts (for testing only)
export async function POST() {
  return Response.json({ error: "Test error" }, { status: 500 });
}
```

## Best Practices

### 1. Always Provide `onToast`

Toast notifications provide better UX than inline errors alone:

```tsx
// ✅ Good - User sees both inline error and toast
<PaywallGate onToast={toast.error} />

// ❌ OK but less friendly - Only inline error
<PaywallGate />
```

### 2. Log Errors Server-Side

Track checkout errors for debugging:

```tsx
// app/api/checkout/route.ts
try {
  // ... checkout logic
} catch (error) {
  console.error("Checkout failed:", error);
  // Log to error tracking service (Sentry, etc.)
  return Response.json({ error: "Checkout failed" }, { status: 500 });
}
```

### 3. User-Friendly Messages

Never expose technical errors to users:

```tsx
// ✅ Good
"Unable to start checkout. Please try again.";

// ❌ Bad
"STRIPE_API_KEY is not defined";
"Database connection failed: ECONNREFUSED";
```

### 4. Provide Context in Errors

Help users understand what went wrong:

```tsx
if (!process.env.STRIPE_SECRET_KEY) {
  // Development: Show detailed error
  if (process.env.NODE_ENV === "development") {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  // Production: Generic message
  return Response.json(
    { error: "Payment system is not configured" },
    { status: 500 }
  );
}
```

## Example: Complete Error Handling

```tsx
"use client";

import { PaywallGate } from "milkie";
import { toast } from "sonner";
import * as Sentry from "@sentry/nextjs";

export default function ProductionPaywall() {
  const handleToast = (message: string, type: "success" | "error") => {
    if (type === "error") {
      toast.error(message);
      // Track error for analytics
      Sentry.captureMessage(`Checkout error: ${message}`);
    } else {
      toast.success(message);
    }
  };

  return (
    <PaywallGate
      onToast={handleToast}
      title="Unlock Premium Features"
      subtitle="Get unlimited access to all features"
    >
      <PremiumContent />
    </PaywallGate>
  );
}
```

## Live Demo

Try the demo with network throttling at [milkie.dev/dashboard](https://milkie.dev/dashboard) to see error recovery in action.

## Related Patterns

- [Hook-Based Access](hook-based-access.md) - Custom error handling with usePaywall
- [Custom Checkout](custom-checkout.md) - Handle errors in custom checkout flow

## Next Steps

- Set up error tracking with [Sentry](https://sentry.io) or similar
- Review [best practices](../reference/best-practices.md) for production readiness
