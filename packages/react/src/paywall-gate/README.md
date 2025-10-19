# PaywallGate Component

A comprehensive, customizable paywall component that protects premium content behind a subscription gate with built-in Stripe checkout integration.

## Overview

The `PaywallGate` component is the primary building block for implementing subscription paywalls in your Next.js application. It handles authentication state, subscription verification, checkout flow, and error handling while providing a polished, customizable UI.

## Features

- **Automatic Access Control**: Integrates with `MilkieProvider` to check subscription status
- **Built-in Checkout Flow**: Stripe checkout integration out of the box
- **Flexible Display Modes**:
  - Blurred content preview (default)
  - Inline paywall card (with `disableBlur`)
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

## Component Architecture

### File Structure

```
paywall-gate/
├── index.tsx                 # Main PaywallGate component
├── utils.ts                  # Checkout utilities
├── components/
│   ├── paywall-card.tsx      # Paywall UI card
│   ├── user-info.tsx         # User email display
│   └── checkout-error.tsx    # Error message display
└── README.md                 # This file
```

### Component Flow

1. **Loading State**: Shows `LoadingState` component while checking subscription
2. **Access Check**: If user has access, renders children immediately
3. **No Access**: Shows paywall UI (custom or default)
4. **Checkout Flow**: Handles Stripe checkout process on subscribe click

## Props

All props are optional except `children`. See the TypeScript interface in [index.tsx](./index.tsx) for complete prop documentation with JSDoc comments.

Key props:
- `children` - Premium content to protect (required)
- `title`, `subtitle` - Customize paywall messaging
- `customUi` - Replace default UI entirely
- `disableBlur` - Show card inline without blur effect
- `onCheckout` - Custom checkout handler
- `onToast` - Toast notification callback
- `showBranding` - Toggle "Powered by milkie" footer
- `overlayClassName` - Custom Tailwind classes for positioning the card (e.g., `"py-8"` for vertical padding)

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

### 4. No Blur Effect

Show paywall card inline without content preview:

```tsx
<PaywallGate disableBlur>
  <PremiumFeatures />
</PaywallGate>
```

### 5. Custom Icon

Use your own icon/logo:

```tsx
import { Crown } from "lucide-react";

<PaywallGate
  icon={<Crown className="h-12 w-12 text-yellow-500" />}
  title="Premium Members Only"
>
  <PremiumContent />
</PaywallGate>
```

### 6. Custom Sign-In Handler

Override default sign-in redirect:

```tsx
import { signIn } from "next-auth/react";

<PaywallGate
  onSignIn={() => signIn()}
  signInButtonText="Sign in with GitHub"
>
  <PremiumContent />
</PaywallGate>
```

### 7. Custom Checkout Handler

Implement custom checkout logic:

```tsx
<PaywallGate
  onCheckout={async (email) => {
    // Your custom checkout logic
    const session = await createCustomCheckoutSession(email, {
      priceId: "price_custom_plan",
      trialDays: 14,
    });

    return { url: session.url };
  }}
>
  <PremiumContent />
</PaywallGate>
```

### 8. With Toast Notifications

Integrate with your toast system:

```tsx
import { toast } from "sonner";

<PaywallGate
  onToast={(message, type) => {
    toast[type](message);
  }}
>
  <PremiumContent />
</PaywallGate>
```

### 9. Fully Custom UI

Replace the entire paywall UI:

```tsx
<PaywallGate
  customUi={
    <div className="custom-paywall">
      <h2>Custom Paywall Design</h2>
      <button onClick={handleCustomCheckout}>
        Subscribe Now
      </button>
    </div>
  }
>
  <PremiumContent />
</PaywallGate>
```

### 10. Layout-Level Gating

Protect entire sections of your app:

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PaywallGate
      title="Premium Dashboard"
      subtitle="Subscribe to access advanced features"
    >
      <DashboardNav />
      <div className="dashboard-content">
        {children}
      </div>
    </PaywallGate>
  );
}
```

### 11. Metered Paywall (NYT/Medium Style)

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

## Styling

The PaywallGate uses Tailwind CSS with CSS variables for theming. It's compatible with shadcn/ui themes.

### Required CSS Variables

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --border: 214.3 31.8% 91.4%;
    --destructive: 0 84.2% 60.2%;
    --radius: 0.5rem;
  }
}
```

### Custom Styling

If you're not using shadcn/ui, you can either:

1. Add the CSS variables above to your `globals.css`
2. Use the `customUi` prop to provide fully custom styled components

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

## Error Handling

The component handles several error scenarios:

1. **Network Errors**: When the checkout API is unreachable
2. **Checkout Failures**: When Stripe checkout session creation fails
3. **Invalid States**: When user email is missing

All errors display a user-friendly message with retry capability. Use `onToast` to display errors in your app's toast system.

## State Management

Internal state managed by PaywallGate:

- `isCheckingOut`: Boolean indicating checkout process in progress
- `checkoutError`: String containing error message (null if no error)

External state from `usePaywall()` hook:

- `hasAccess`: Boolean indicating subscription status
- `loading`: Boolean indicating status check in progress
- `email`: User's email from MilkieProvider

## Accessibility

The component includes basic accessibility features:

- Blurred content is marked with `aria-hidden="true"` to hide from screen readers
- Semantic HTML structure with proper button elements
- Loading text for screen reader context during async operations

## Performance Considerations

- Checkout process uses client-side fetch for minimal latency
- Loading states prevent layout shift
- Subscription status cached in MilkieProvider context
- No unnecessary re-renders when access is granted

## Best Practices

1. **Use with MilkieProvider**: Always wrap your app with `<MilkieProvider>` first
2. **Consistent Messaging**: Use similar titles/subtitles across your app
3. **Error Handling**: Implement `onToast` for better UX
4. **Custom Checkout**: Use `onCheckout` for complex pricing models
5. **Performance**: Place PaywallGate as close to protected content as possible
6. **Content Preview**: Use blur effect (default) to show users what they're missing

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

## Related Components

- [`MilkieProvider`](../provider.tsx) - Required context provider
- [`AuthGate`](../auth-gate/index.tsx) - For authentication-only gating
- [`usePaywall`](../provider.tsx) - Hook for custom paywall logic

## TypeScript Support

All components are fully typed with TypeScript. Import types from the package:

```tsx
import type { PaywallGateProps } from "@milkie/react";
```

## Examples in Demo App

See the [live demo](https://milkie-demo.vercel.app) for interactive examples:

- Basic paywall
- Metered paywall
- Custom styling
- Layout-level gating
- Mixed content pages

## License

MIT - see [LICENSE](https://github.com/akcho/milkie/blob/main/LICENSE)
