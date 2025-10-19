# Pattern 3: Hybrid (Public + Protected Routes)

Combine public and protected sections in one app.

## Perfect for:

- Most SaaS apps (marketing site + product)
- Apps with free tier and premium features
- Products with public documentation + private tools

## Implementation

Use Next.js App Router layouts to cleanly separate public and protected routes:

```tsx
// app/layout.tsx (root layout)
import { MilkieProvider } from "@milkie/react";
import { SessionProvider } from "next-auth/react";

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
  );
}

// app/page.tsx - Public landing page
export default function Home() {
  return (
    <div>
      <h1>Welcome to MyApp</h1>
      <a href="/dashboard">Get Started →</a>
    </div>
  );
}

// app/free/page.tsx - Public content
export default function FreePage() {
  return <div>Free content accessible to everyone</div>;
}

// app/dashboard/layout.tsx - Protected app section
import { PaywallGate } from "@milkie/react";

export default function DashboardLayout({ children }) {
  return <PaywallGate>{children}</PaywallGate>;
}
```

## Resulting Route Structure

This gives you clean separation:

```
/                 → Public ✅
/free            → Public ✅
/pricing         → Public ✅
/docs            → Public ✅
/dashboard       → Protected 🔒
/dashboard/*     → Protected 🔒
```

## Best Practices

### 1. Keep Marketing Public

Always keep your landing page and marketing content public:

```tsx
✅ Good structure:
/                    → Public landing page
/features           → Public features
/pricing            → Public pricing
/blog               → Public blog
/dashboard/*        → Protected with PaywallGate
```

### 2. Use Nested Layouts

Leverage Next.js nested layouts for clean separation:

```
app/
├── layout.tsx              # Root: MilkieProvider
├── page.tsx               # Public: Landing
├── pricing/
│   └── page.tsx           # Public: Pricing
└── dashboard/
    ├── layout.tsx         # Protected: PaywallGate wrapper
    ├── page.tsx          # Protected: Dashboard home
    └── analytics/
        └── page.tsx       # Protected: Analytics page
```

### 3. Share Navigation

Use conditional rendering in shared navigation:

```tsx
// components/nav.tsx
import { usePaywall } from "@milkie/react";

export function Nav() {
  const { hasAccess } = usePaywall();

  return (
    <nav>
      <a href="/">Home</a>
      <a href="/pricing">Pricing</a>
      {hasAccess ? (
        <a href="/dashboard">Dashboard</a>
      ) : (
        <a href="/signin">Sign In</a>
      )}
    </nav>
  );
}
```

## Example: SaaS App Structure

```tsx
// Root layout: MilkieProvider
app/layout.tsx

// Public routes
app/page.tsx              → Landing page
app/features/page.tsx     → Features
app/pricing/page.tsx      → Pricing
app/docs/page.tsx         → Documentation

// Protected routes
app/dashboard/layout.tsx  → PaywallGate wrapper
app/dashboard/page.tsx    → Dashboard home
app/dashboard/settings/page.tsx  → Settings (AuthGate)
app/dashboard/billing/page.tsx   → Billing (AuthGate)
```

## Live Demo

The demo at [milkie.dev](https://milkie.dev) implements this exact pattern!

## Related Patterns

- [Layout-Level Gating](layout-gating.md) - How to protect dashboard routes
- [Component-Level Gating](component-gating.md) - Mix free/premium on same page

## Next Steps

- Set up your [authentication integration](../AUTH_INTEGRATION.md)
- Review [best practices](../reference/best-practices.md) for routing
