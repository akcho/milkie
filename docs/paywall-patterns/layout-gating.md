# Pattern 2: Layout-Level Gating

Protect entire route sections at the page level for flexible access control.

## Perfect for:

- SaaS applications
- Tools/platforms where core features require payment
- B2B products
- Dashboard-style applications

## Implementation

### PaywallGate for Subscription-Required Pages

```tsx
// app/dashboard/page.tsx (main dashboard)
import { PaywallGate } from "milkie";

export default function DashboardPage() {
  return (
    <PaywallGate>
      <div>
        <h1>Dashboard Analytics</h1>
        <p>Premium analytics and insights...</p>
      </div>
    </PaywallGate>
  );
}
```

### AuthGate for Authentication-Only Pages

For pages that require sign-in but **not** an active subscription (like billing and settings):

```tsx
// app/dashboard/billing/page.tsx
import { AuthGate } from "milkie";

export default function BillingPage() {
  return (
    <AuthGate>
      <div>
        <h1>Billing</h1>
        {/* Users need access to billing even without active subscription */}
      </div>
    </AuthGate>
  );
}
```

## Key Benefits

- **Page-level control** - Mix free and premium pages in the same section
- **Navigation always visible** - Better UX than full-screen overlays
- **Separation of concerns** - AuthGate separates authentication from subscription
- **User-friendly** - Users can manage billing/settings even when subscription inactive
- **Centered overlay** - Paywall card appears in content area, not covering entire viewport

## Real-World Routing Pattern

```tsx
/dashboard              → PaywallGate (requires active subscription)
/dashboard/analytics    → PaywallGate (requires active subscription)
/dashboard/settings     → AuthGate (requires sign-in only)
/dashboard/billing      → AuthGate (users must access billing anytime)
```

## Why Page-Level > Layout-Level

**❌ Avoid layout-level gating:**

```tsx
// app/dashboard/layout.tsx - DON'T DO THIS
export default function DashboardLayout({ children }) {
  return <PaywallGate>{children}</PaywallGate>; // Blocks billing page!
}
```

**✅ Use page-level gating:**

```tsx
// app/dashboard/page.tsx
<PaywallGate><Analytics /></PaywallGate>

// app/dashboard/billing/page.tsx
<AuthGate><Billing /></AuthGate>  // Accessible even without subscription
```

**Why it's better:**

- Users can manage billing when subscription is inactive
- Navigation/header remain visible
- Flexible mixing of access requirements
- Paywall overlay is centered, not full-viewport

## PaywallGate vs AuthGate

| Component     | Requires Sign-In | Requires Subscription | Use Case                            |
| ------------- | ---------------- | --------------------- | ----------------------------------- |
| `PaywallGate` | Yes ✓            | Yes ✓                 | Premium features, paid content      |
| `AuthGate`    | Yes ✓            | No ✗                  | Billing, settings, user preferences |

## Live Demo

Try this pattern at [milkie.dev/dashboard](https://milkie.dev/dashboard)

## Related Patterns

- [Hybrid Routes](hybrid-routes.md) - Combine with public routes
- [Hook-Based Access](hook-based-access.md) - Programmatic control

## Next Steps

- See [customization options](../reference/customization.md) for styling
- Review [best practices](../reference/best-practices.md) for routing tips
