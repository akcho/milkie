# Paywall Patterns with Milkie

How to paywall different parts of your app - from a single page to your entire application.

## Pattern 1: Single Page Paywall

Perfect for:
- Content sites (blog posts, tutorials)
- Freemium apps (some features free, some paid)
- Hybrid models (public landing + premium features)

### Implementation

```tsx
// app/premium-article/page.tsx
import { PaywallGate } from 'milkie'

export default function PremiumArticle() {
  return (
    <PaywallGate>
      <article>
        <h1>Premium Content</h1>
        <p>This article is only visible to subscribers.</p>
      </article>
    </PaywallGate>
  )
}
```

**Example in demo**: [/premium](http://localhost:3000/premium)

## Pattern 2: Entire App Paywall

Perfect for:
- SaaS applications
- Tools/platforms where everything requires payment
- B2B products
- Apps with no free tier

### Implementation

```tsx
// app/dashboard/layout.tsx
import { PaywallGate } from 'milkie'

export default function DashboardLayout({ children }) {
  return (
    <PaywallGate>
      <nav>
        {/* Your nav - visible to all subscribers */}
      </nav>
      {children}  {/* All routes under /dashboard/* are protected */}
    </PaywallGate>
  )
}
```

Now every route under `/dashboard/*` is automatically protected:
- `/dashboard` ✅ Protected
- `/dashboard/settings` ✅ Protected
- `/dashboard/billing` ✅ Protected
- `/dashboard/whatever` ✅ Protected

**Example in demo**: [/dashboard](http://localhost:3000/dashboard)

## Pattern 3: Hybrid (Public + Protected)

Perfect for:
- Most SaaS apps
- Apps with marketing site + actual product
- Freemium models with clear separation

### Implementation

```tsx
// app/layout.tsx (root layout)
import { MilkieProvider } from 'milkie'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MilkieProvider>
          {children}  {/* Don't wrap here - let each route decide */}
        </MilkieProvider>
      </body>
    </html>
  )
}

// app/page.tsx - Public landing page
export default function Home() {
  return (
    <div>
      <h1>Welcome to MyApp</h1>
      <a href="/app">Get Started →</a>
    </div>
  )
}

// app/pricing/page.tsx - Public pricing page
export default function Pricing() {
  return (
    <div>
      <h1>Pricing</h1>
      {/* ... */}
    </div>
  )
}

// app/app/layout.tsx - Protected app section
import { PaywallGate } from 'milkie'

export default function AppLayout({ children }) {
  return (
    <PaywallGate>
      {children}  {/* Everything under /app/* is protected */}
    </PaywallGate>
  )
}
```

This gives you:
- `/` - Public ✅
- `/pricing` - Public ✅
- `/blog` - Public ✅
- `/app/*` - Protected 🔒
- `/app/dashboard` - Protected 🔒
- `/app/settings` - Protected 🔒

**Example in demo**: The demo uses this pattern!

## Pattern 4: Conditional Paywalls (Advanced)

Perfect for:
- Freemium apps with usage limits
- Apps with multiple tiers
- Progressive paywalls

### Implementation

```tsx
'use client'

import { usePaywall } from 'milkie'

export default function FeaturePage() {
  const { hasAccess } = usePaywall()

  if (!hasAccess) {
    return (
      <div>
        <h1>Premium Feature</h1>
        <p>Upgrade to access this feature!</p>
        <button>Upgrade Now</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Premium Feature</h1>
      {/* Your premium feature */}
    </div>
  )
}
```

Or use the fallback prop:

```tsx
<PaywallGate fallback={<UpgradePrompt />}>
  <PremiumFeature />
</PaywallGate>
```

## Pattern 5: Component-Level Paywalls

Perfect for:
- Freemium dashboards (some widgets free, some paid)
- Feature-level paywalls
- A/B testing premium features

### Implementation

```tsx
export default function Dashboard() {
  return (
    <div>
      {/* Free widgets - always visible */}
      <BasicStats />
      <RecentActivity />

      {/* Premium widgets - only for subscribers */}
      <PaywallGate fallback={<UpgradeBanner />}>
        <AdvancedAnalytics />
        <CustomReports />
        <TeamCollaboration />
      </PaywallGate>
    </div>
  )
}
```

## Best Practices

### 1. Keep Public Roots Accessible
```tsx
// ✅ Good - Public homepage
app/page.tsx

// 🔒 Protected - Actual app
app/app/layout.tsx → <PaywallGate>
```

### 2. Use Layouts for Route Groups
```tsx
// Protect an entire section at once
app/dashboard/layout.tsx → <PaywallGate>
  app/dashboard/page.tsx
  app/dashboard/settings/page.tsx
  app/dashboard/billing/page.tsx
  // All automatically protected!
```

### 3. Show Clear Value Before the Paywall
```tsx
// ❌ Bad - Paywall immediately
<PaywallGate>
  <App />
</PaywallGate>

// ✅ Good - Show value first
<div>
  <LandingPage />
  <Features />
  <Pricing />
  <Link to="/app">Try it free →</Link>
</div>

// Then in /app:
<PaywallGate>
  <ActualApp />
</PaywallGate>
```

### 4. Use the Hook for Conditional Logic
```tsx
const { hasAccess, loading } = usePaywall()

if (loading) return <Spinner />

return (
  <div>
    {hasAccess ? (
      <PremiumFeature />
    ) : (
      <UpgradePrompt />
    )}
  </div>
)
```

## Common Questions

### Q: Can I have multiple paywalls in one app?
**A:** Yes! You can wrap different sections with different `<PaywallGate>` components. They all check the same subscription status.

### Q: What if I want different tiers?
**A:** Right now Milkie supports one paid tier. Multiple tiers are on the roadmap! For now, you could:
- Use different price IDs
- Check subscription metadata
- Build custom logic with `usePaywall()`

### Q: Can I mix free and paid content on the same page?
**A:** Absolutely! Use multiple `<PaywallGate>` components or the `usePaywall()` hook for granular control.

### Q: Does the paywall work on mobile?
**A:** Yes! The paywall is responsive and works on all devices. The Stripe checkout is mobile-optimized too.

### Q: Can I customize the paywall UI?
**A:** Yes! Pass a custom `fallback` component:
```tsx
<PaywallGate fallback={<YourCustomPaywall />}>
  <Content />
</PaywallGate>
```

## Examples in the Demo

1. **Single Page** → [/premium](http://localhost:3000/premium)
   - Individual page protection
   - Default paywall UI
   - Checkout flow

2. **Full App** → [/dashboard](http://localhost:3000/dashboard)
   - Layout-level protection
   - Multiple routes protected
   - Navigation for subscribers

Try both patterns in the demo to see how they work!

---

**Next**: Read [QUICKSTART.md](QUICKSTART.md) to test these patterns locally.
