# PaywallGate Component

A comprehensive, customizable paywall component that protects premium content behind a subscription gate with built-in Stripe checkout integration.

## Overview

The `PaywallGate` component is the primary building block for implementing subscription paywalls in your Next.js application. It handles authentication state, subscription verification, checkout flow, and error handling while providing a polished, customizable UI.

## Features

- **Automatic Access Control**: Integrates with `MilkieProvider` to check subscription status
- **Built-in Checkout Flow**: Stripe checkout integration out of the box
- **Flexible Display Modes**:
  - Blurred content preview (default)
  - Inline paywall card (with `applyBlur={false}`)
  - Fully custom UI (with `customUi` prop)
- **Smart Error Handling**: Network errors, checkout failures, with retry capability
- **Loading States**: Skeleton loaders while checking subscription status
- **Customizable Messaging**: All text labels and icons can be customized
- **Toast Integration**: Optional callback for displaying toast notifications
- **Custom Checkout Handlers**: Override default checkout behavior

## Basic Usage

```tsx
import { PaywallGate } from "@milkie/react";

export default function PremiumPage() {
  return (
    <PaywallGate>
      <h1>Premium Content</h1>
      <p>Only visible to subscribers!</p>
    </PaywallGate>
  );
}
```

## Component Flow

1. **Loading State**: Shows loading component while checking subscription
2. **Access Check**: If user has access, renders children immediately
3. **No Access**: Shows paywall UI (custom or default)
4. **Checkout Flow**: Handles Stripe checkout process on subscribe click

## Props

All props are optional except `children`. Key props:

- `children` - Premium content to protect (required)
- `title`, `subtitle` - Customize paywall messaging
- `customUi` - Replace default UI entirely
- `applyBlur` - Show blurred content preview (default: true)
- `onCheckout` - Custom checkout handler
- `onToast` - Toast notification callback
- `showBranding` - Toggle "Powered by milkie" footer
- `overlayClassName` - Custom Tailwind classes for card positioning
- `position` - Vertical card position: `"center"` (default) or `"top"`

See [index.tsx](./index.tsx) for complete TypeScript documentation.

## Usage Examples

### 1. Basic Paywall

Protect entire page with default settings:

```tsx
export default function PremiumDashboard() {
  return (
    <PaywallGate>
      <Dashboard />
    </PaywallGate>
  );
}
```

### 2. Custom Messaging

Customize the paywall card text:

```tsx
<PaywallGate
  title="Unlock Advanced Analytics"
  subtitle="Get real-time insights and unlimited exports"
  subscribeButtonText="Upgrade to Pro"
>
  <AnalyticsDashboard />
</PaywallGate>
```

### 3. Mixed Free/Premium Content

Combine public and gated content on same page:

```tsx
export default function ArticlePage() {
  return (
    <div>
      {/* Free content - visible to all */}
      <ArticlePreview />

      {/* Premium content - subscribers only */}
      <PaywallGate
        title="Read the full article"
        subtitle="Subscribe for unlimited access"
      >
        <FullArticleContent />
      </PaywallGate>
    </div>
  );
}
```

### 4. Custom Icon & Sign-In Handler

```tsx
import { Crown } from "lucide-react";
import { signIn } from "next-auth/react";

<PaywallGate
  icon={<Crown className="h-12 w-12 text-yellow-500" />}
  title="Premium Members Only"
  onSignIn={() => signIn()}
  applyBlur={false} // No blur effect
>
  <PremiumContent />
</PaywallGate>;
```

### 5. Custom Checkout & Toast Integration

```tsx
import { toast } from "sonner";

<PaywallGate
  onCheckout={async (email) => {
    const session = await createCustomCheckoutSession(email, {
      priceId: "price_custom_plan",
      trialDays: 14,
    });
    return { url: session.url };
  }}
  onToast={(message, type) => toast[type](message)}
>
  <PremiumContent />
</PaywallGate>;
```

### 6. Fully Custom UI

```tsx
<PaywallGate customUi={<YourCustomPaywall />}>
  <PremiumContent />
</PaywallGate>
```

### 7. Layout-Level Gating

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <PaywallGate title="Premium Dashboard">
      <DashboardNav />
      {children}
    </PaywallGate>
  );
}
```

### 8. Metered Paywall (NYT/Medium Style)

Implement article view limits:

```tsx
"use client";
import { usePaywall } from "@milkie/react";
import { getArticleViewCount } from "@/lib/analytics";

export default function ArticlePage() {
  const { hasAccess } = usePaywall();
  const viewCount = getArticleViewCount();
  const canView = hasAccess || viewCount < 3;

  if (canView) {
    return <FullArticle />;
  }

  return (
    <PaywallGate
      title="You've reached your free article limit"
      subtitle="Subscribe for unlimited access"
    >
      <ArticlePreview />
    </PaywallGate>
  );
}
```

### 9. Top-Positioned Card

For long scrolling content, position the card at the top to keep it visible:

```tsx
<PaywallGate position="top">
  <LongNewsArticle />
</PaywallGate>
```

## Styling

PaywallGate uses Tailwind CSS with CSS variables (compatible with shadcn/ui themes).

If not using shadcn/ui, either add the required CSS variables to `globals.css` or use the `customUi` prop for custom styling. See the [package README](../../README.md#styling) for details.

## API Integration

The PaywallGate expects a checkout API endpoint at `/api/checkout`:

```ts
// app/api/checkout/route.ts
import { createCheckoutRoute } from "@milkie/react/api";
import { stripe } from "@/lib/stripe";
import { checkoutAdapter } from "@/lib/milkie-adapter";

export const POST = createCheckoutRoute({
  stripe,
  db: checkoutAdapter,
  priceId: process.env.STRIPE_PRICE_ID!,
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
});
```

For custom checkout endpoints, use the `onCheckout` prop.

## Features

**Error Handling:** Network errors, checkout failures, and invalid states are handled with user-friendly messages and retry capability.

**State Management:** Manages checkout state internally; subscription state comes from `usePaywall()` hook.

**Accessibility:** ARIA attributes, semantic HTML, and loading states for screen readers.

**Performance:** Client-side checkout, cached subscription status, minimal re-renders.

## Best Practices

- Always wrap your app with `<MilkieProvider>` first
- Use consistent messaging across your app
- Implement `onToast` for better error UX
- Use `onCheckout` for complex pricing models
- Place PaywallGate as close to protected content as possible
- Use blur effect (default: true) to show users what they're missing

## Troubleshooting

### Paywall always shows even for subscribers

- Verify `MilkieProvider` is wrapping your app
- Check `/api/subscription/status` returns correct data
- Ensure user email is being passed to `MilkieProvider`

### Checkout button doesn't work

- Verify `/api/checkout` endpoint is configured
- Check browser console for network errors
- Ensure Stripe keys are properly set in environment variables

### Custom UI not showing

- Verify `customUi` prop contains valid React component
- Check that component is client-compatible (no server-only code)

## Related

- [`MilkieProvider`](../provider.tsx) - Required context provider
- [`AuthGate`](../auth-gate/index.tsx) - For authentication-only gating
- [`usePaywall`](../provider.tsx) - Hook for custom logic
- [Live Demo](https://milkie.dev) - Interactive examples
