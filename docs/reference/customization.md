# Customization Guide

Complete reference for customizing Milkie's visual design and UX.

## PaywallGate Customization Props

All available props for customizing the paywall experience:

```tsx
<PaywallGate
  // Content customization
  title="Unlock Premium Features"
  subtitle="Get full access to all premium tools"
  subscribeButtonText="Upgrade to Pro"
  signInButtonText="Sign in to continue"
  icon={<CustomIcon />}
  customUi={<YourCustomComponent />}
  // Behavior customization
  signInUrl="/signin"
  onSignIn={() => router.push("/signin")}
  onCheckout={async (email) => ({ url: checkoutUrl })}
  onToast={(message, type) => toast[type](message)}
  // Visual customization
  showBranding={false}
  disableBlur={true}
  overlayClassName="pt-8"
>
  <PremiumContent />
</PaywallGate>
```

### Content Props

| Prop                  | Type        | Default                            | Description                          |
| --------------------- | ----------- | ---------------------------------- | ------------------------------------ |
| `title`               | `string`    | "Upgrade to access this feature"   | Main heading in paywall card         |
| `subtitle`            | `string`    | "Sign in or subscribe to continue" | Supporting text below title          |
| `subscribeButtonText` | `string`    | "Subscribe"                        | CTA button for authenticated users   |
| `signInButtonText`    | `string`    | "Sign in"                          | CTA button for unauthenticated users |
| `icon`                | `ReactNode` | Lock icon                          | Custom icon at top of card           |
| `customUi`            | `ReactNode` | null                               | Complete custom UI replacement       |

### Behavior Props

| Prop         | Type                                                    | Default         | Description                                 |
| ------------ | ------------------------------------------------------- | --------------- | ------------------------------------------- |
| `signInUrl`  | `string`                                                | "/signin"       | URL to redirect for sign-in                 |
| `onSignIn`   | `() => void`                                            | undefined       | Custom sign-in handler (alternative to URL) |
| `onCheckout` | `(email: string) => Promise<{url: string}>`             | Default handler | Custom checkout handler                     |
| `onToast`    | `(message: string, type: "success" \| "error") => void` | undefined       | Toast notification callback                 |

### Visual Props

| Prop               | Type      | Default | Description                          |
| ------------------ | --------- | ------- | ------------------------------------ |
| `showBranding`     | `boolean` | true    | Show "Powered by milkie" footer      |
| `disableBlur`      | `boolean` | false   | Disable blurred content preview      |
| `overlayClassName` | `string`  | ""      | Custom className for overlay element |

## Visual Design Features

### Blurred Background Previews

PaywallGate renders protected content behind the overlay with a blur effect:

```tsx
<PaywallGate>
  <PremiumContent /> {/* Shown blurred in background */}
</PaywallGate>
```

**How it works:**

- Content preview builds desire and provides context
- Uses Tailwind `blur-sm` class with `opacity-50` for darkened effect
- Content visible enough to understand what's locked
- Non-interactive (`pointer-events-none select-none`)

**Disable blur:**

```tsx
<PaywallGate disableBlur={true}>
  <PremiumContent /> {/* Paywall card shown inline without blur */}
</PaywallGate>
```

### Overlay Architecture

The paywall uses a CSS Grid-based overlay system:

**Technical details:**

- **CSS Grid Stacking**: Both overlay and content use `col-start-1 row-start-1` to occupy same grid cell
- **Z-Index Layering**: Overlay has `z-10` to appear above blurred content
- **Flexbox Centering**: Overlay uses `flex items-center justify-center` for perfect centering
- **Dynamic Height**: Uses `w-full` instead of fixed min-height for responsive sizing

**Add padding:**

```tsx
<PaywallGate overlayClassName="pt-8">
  <PremiumContent />
</PaywallGate>
```

### Dark Mode Support

All components are fully theme-aware:

- Automatic adaptation to light/dark themes
- Uses next-themes and shadcn/ui's theming system
- Proper contrast in both modes
- No configuration needed

```tsx
// Works automatically with your app's theme
<MilkieProvider email={email}>
  <PaywallGate /> {/* Adapts to light/dark mode */}
</MilkieProvider>
```

### Loading States

Automatic loading states during subscription checks:

```tsx
// Shown automatically while checking subscription
<PaywallGate>
  <PremiumContent />
</PaywallGate>;

// Or use the hook for custom loading UI
const { loading } = usePaywall();
if (loading) return <CustomSpinner />;
```

### Error States

Built-in error recovery without jarring alerts:

- Inline error banners with AlertCircle icon
- "Try again" button for immediate retry
- Toast notifications via `onToast` callback
- No page refresh needed

```tsx
<PaywallGate onToast={(msg, type) => toast[type](msg)}>
  <PremiumContent />
</PaywallGate>
```

## Custom UI Examples

### Complete Custom UI

Replace the entire paywall card:

```tsx
function CustomPaywall() {
  return (
    <div className="max-w-lg mx-auto p-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl text-white">
      <h2 className="text-3xl font-bold mb-4">Premium Required</h2>
      <ul className="space-y-2 mb-6">
        <li>✨ Unlimited access</li>
        <li>🚀 Priority support</li>
        <li>🎯 Advanced features</li>
      </ul>
      <button className="w-full py-3 bg-white text-purple-600 rounded-lg font-semibold">
        Upgrade Now
      </button>
    </div>
  );
}

<PaywallGate customUi={<CustomPaywall />}>
  <PremiumContent />
</PaywallGate>;
```

### Custom Icon

```tsx
import { Sparkles } from "lucide-react";

<PaywallGate icon={<Sparkles className="w-12 h-12 text-yellow-500" />}>
  <PremiumContent />
</PaywallGate>;
```

### Custom Sign-In Handler

```tsx
const handleSignIn = () => {
  // Custom sign-in logic
  router.push("/signin?redirect=" + window.location.pathname);
};

<PaywallGate onSignIn={handleSignIn}>
  <PremiumContent />
</PaywallGate>;
```

## Styling with Tailwind

PaywallGate uses shadcn/ui components which can be customized via Tailwind:

### Card Styling

The paywall card uses the `Card` component from shadcn/ui. Customize in your `tailwind.config.js`:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        // ... other shadcn/ui colors
      },
    },
  },
};
```

### Button Styling

Buttons use the `Button` component. Customize button variants in `components/ui/button.tsx`:

```tsx
// Modify the button variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        // ... other variants
      },
    },
  }
);
```

## Smart Redirects

Callback URL handling preserves user context:

```tsx
// User at /dashboard/analytics tries to access premium feature
<PaywallGate signInUrl="/signin">
  <PremiumContent />
</PaywallGate>

// Sign-in URL becomes: /signin?callbackUrl=/dashboard/analytics
// After sign-in, user returns to /dashboard/analytics
```

**How it works:**

- PaywallGate automatically includes `callbackUrl` in sign-in redirect
- Works with AuthGate too
- Users return to original page after authentication

## Responsive Design

All components are mobile-optimized:

- Paywall cards adapt to screen size
- Touch-friendly button sizes
- Readable text on small screens
- Stripe checkout is also mobile-optimized

```tsx
// Works great on mobile automatically
<PaywallGate>
  <PremiumContent />
</PaywallGate>
```

## Branding

### Hide Milkie Branding

```tsx
<PaywallGate showBranding={false}>
  <PremiumContent />
</PaywallGate>
```

The branding is small and unobtrusive by default (appears in card footer).

## Best Practices

### 1. Consistent Messaging

Use the same tone across all paywalls:

```tsx
// ✅ Good - consistent, benefit-focused
<PaywallGate
  title="Unlock Advanced Analytics"
  subtitle="Get insights that drive growth"
/>

// ❌ Avoid - inconsistent, vague
<PaywallGate
  title="Pay to see this"
  subtitle="You need premium"
/>
```

### 2. Show Value

Explain what users get:

```tsx
<PaywallGate
  title="Premium Feature"
  subtitle="Advanced reporting, exports, and priority support"
  subscribeButtonText="Get unlimited access"
/>
```

### 3. Use Appropriate Icons

Match icons to your content:

```tsx
import { BarChart, FileText, Zap } from "lucide-react";

// Analytics feature
<PaywallGate icon={<BarChart />}>

// Document feature
<PaywallGate icon={<FileText />}>

// Speed/performance feature
<PaywallGate icon={<Zap />}>
```

### 4. Test Both Themes

Always test your customizations in light and dark modes:

```tsx
// Make sure your custom UI works in both themes
function CustomPaywall() {
  return (
    <div className="bg-background text-foreground">
      {" "}
      {/* Theme-aware */}
      {/* Content */}
    </div>
  );
}
```

## Examples from Demo

See these patterns in action:

- [/mixed](https://milkie.dev/mixed) - Custom UI with blurred preview
- [/dashboard](https://milkie.dev/dashboard) - Standard PaywallGate
- [/metered](https://milkie.dev/metered) - Custom title/subtitle

## Related

- [Paywall Patterns](../paywall-patterns/) - Implementation patterns
- [Best Practices](best-practices.md) - UX and design tips
