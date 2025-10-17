# Paywall Patterns with Milkie

How to implement paywalls in your app - from component-level gating to full application protection.

## Pattern 1: Component-Level Gating

**Perfect for:**
- Content sites (blogs, tutorials, articles)
- Freemium apps with mixed free/premium content
- Feature previews with locked sections

Mix free and premium content on the same page by wrapping specific components:

```tsx
// app/mixed/page.tsx
import { PaywallGate } from '@milkie/react'

export default function ArticlePage() {
  return (
    <div>
      {/* Free preview - everyone sees this */}
      <section>
        <h1>Article Title</h1>
        <p>Free introduction and preview...</p>
      </section>

      {/* Premium content - only subscribers */}
      <PaywallGate
        fallback={<UpgradePrompt />}
      >
        <section>
          <h2>Premium Section</h2>
          <p>Full article content here...</p>
        </section>
      </PaywallGate>
    </div>
  )
}
```

**Key features:**
- Use the `fallback` prop to show a custom teaser for non-subscribers
- Blur the premium content in the background for visual effect
- Multiple `PaywallGate` components can be used on the same page

**Example in demo**: [/mixed](http://localhost:3000/mixed)

## Pattern 2: Layout-Level Gating

**Perfect for:**
- SaaS applications
- Tools/platforms where everything requires payment
- B2B products
- Apps with no free tier

Protect entire route sections by wrapping a layout component:

```tsx
// app/dashboard/layout.tsx
import { PaywallGate } from '@milkie/react'

export default function DashboardLayout({ children }) {
  return (
    <PaywallGate>
      <div>
        <nav>
          {/* Navigation - visible to all subscribers */}
        </nav>
        <main>
          {children}  {/* All child routes protected */}
        </main>
      </div>
    </PaywallGate>
  )
}
```

Now every route under `/dashboard/*` is automatically protected:
- `/dashboard` ✅ Protected
- `/dashboard/settings` ✅ Protected
- `/dashboard/billing` ✅ Protected

**Key benefits:**
- Write `PaywallGate` once, protect all child routes
- Shared navigation and layouts stay protected
- Clean separation between public and protected sections

**Example in demo**: [/dashboard](http://localhost:3000/dashboard)

## Pattern 3: Hybrid (Public + Protected Routes)

**Perfect for:**
- Most SaaS apps (marketing site + product)
- Apps with free tier and premium features
- Products with public documentation + private tools

Combine public and protected sections in one app:

```tsx
// app/layout.tsx (root layout)
import { MilkieProvider } from '@milkie/react'
import { SessionProvider } from 'next-auth/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>
          <MilkieProvider email={session?.user?.email}>
            {children}
          </MilkieProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

// app/page.tsx - Public landing page
export default function Home() {
  return (
    <div>
      <h1>Welcome to MyApp</h1>
      <a href="/dashboard">Get Started →</a>
    </div>
  )
}

// app/free/page.tsx - Public content
export default function FreePage() {
  return <div>Free content accessible to everyone</div>
}

// app/dashboard/layout.tsx - Protected app section
import { PaywallGate } from '@milkie/react'

export default function DashboardLayout({ children }) {
  return (
    <PaywallGate>
      {children}
    </PaywallGate>
  )
}
```

This structure gives you:
- `/` - Public ✅
- `/free` - Public ✅
- `/pricing` - Public ✅
- `/dashboard/*` - Protected 🔒

**Example in demo**: The demo implements this exact pattern!

## Pattern 4: Hook-Based Conditional Access

**Perfect for:**
- Custom UI flows
- Complex access logic
- Programmatic access checks

Use the `usePaywall` hook for fine-grained control:

```tsx
'use client'

import { usePaywall } from '@milkie/react'

export default function FeaturePage() {
  const { hasAccess, loading, email, status } = usePaywall()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!hasAccess) {
    return <CustomUpgradePrompt />
  }

  return (
    <div>
      <h1>Premium Feature</h1>
      <p>Welcome, {email}!</p>
      {/* Your premium feature */}
    </div>
  )
}
```

**Available hook values:**
- `hasAccess`: boolean - Whether user has an active subscription
- `loading`: boolean - Whether subscription check is in progress
- `email`: string | null - User's email from MilkieProvider
- `status`: string | null - Subscription status from Stripe
- `checkSubscription`: () => Promise<void> - Manual refresh function

---

## Best Practices

### 1. Public Routes First
Always keep your landing page and marketing content public:

```tsx
// ✅ Good structure
/                    → Public landing page
/free               → Public content
/pricing            → Public pricing
/dashboard/*        → Protected with PaywallGate
```

### 2. Use Layouts for Route Protection
Protect route groups at the layout level instead of individual pages:

```tsx
// ✅ Good - One PaywallGate protects all routes
// app/dashboard/layout.tsx
<PaywallGate>{children}</PaywallGate>

// ❌ Avoid - Repeating PaywallGate in every page
// app/dashboard/page.tsx, settings/page.tsx, etc.
```

### 3. Custom Fallbacks for Better UX
Show value in your fallback content:

```tsx
<PaywallGate
  fallback={
    <div>
      <h2>Premium Analytics</h2>
      <ul>
        <li>Advanced metrics and insights</li>
        <li>Custom reporting</li>
        <li>Export to CSV/PDF</li>
      </ul>
      <button>Unlock Now</button>
    </div>
  }
>
  <AdvancedAnalytics />
</PaywallGate>
```

### 4. Customize for Your Brand
Use the customization props to match your app:

```tsx
<PaywallGate
  title="Unlock Advanced Features"
  subtitle="Get full access to all premium tools"
  subscribeButtonText="Upgrade to Pro"
>
  <PremiumContent />
</PaywallGate>
```

### 5. Handle Loading States
Always account for the subscription check:

```tsx
const { hasAccess, loading } = usePaywall()

if (loading) return <LoadingState />
if (!hasAccess) return <UpgradePrompt />

return <PremiumContent />
```

---

## FAQ

**Q: Can I have multiple PaywallGates in one app?**
Yes! All `PaywallGate` components share the same subscription status from `MilkieProvider`.

**Q: Can I mix free and paid content on the same page?**
Absolutely! See Pattern 1 (Component-Level Gating) above.

**Q: Does the paywall work on mobile?**
Yes, fully responsive. The Stripe checkout is also mobile-optimized.

**Q: Can I customize the paywall UI?**
Yes, either use the `fallback` prop for complete custom UI, or the customization props like `title`, `subtitle`, etc.

**Q: What about multiple subscription tiers?**
Currently Milkie supports one subscription tier. Multi-tier support is on the roadmap.

**Q: How do I handle the redirect after sign-in?**
The `PaywallGate` automatically includes `callbackUrl` in the sign-in redirect, so users return to the page they were trying to access.

---

## Live Examples

Try these patterns in the demo:

- **[/free](http://localhost:3000/free)** - Public content (no paywall)
- **[/mixed](http://localhost:3000/mixed)** - Component-level gating with fallbacks
- **[/dashboard](http://localhost:3000/dashboard)** - Layout-level gating
- **[Homepage](http://localhost:3000)** - Hybrid public/protected structure

---

**Next Steps:**
- Read [AUTH_INTEGRATION.md](AUTH_INTEGRATION.md) to integrate with your auth provider
- Read [QUICKSTART.md](../QUICKSTART.md) to run the demo locally
