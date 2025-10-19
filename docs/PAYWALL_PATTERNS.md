# Paywall Patterns with Milkie

Complete guide to implementing paywalls in your Next.js app - from component-level gating to sophisticated metered access patterns.

## Pattern 1: Component-Level Gating

**Perfect for:**

- Content sites (blogs, tutorials, articles)
- Freemium apps with mixed free/premium content
- Feature previews with locked sections

Mix free and premium content on the same page by wrapping specific components:

```tsx
// app/mixed/page.tsx
import { PaywallGate } from "@milkie/react";

export default function ArticlePage() {
  return (
    <div>
      {/* Free preview - everyone sees this */}
      <section>
        <h1>Article Title</h1>
        <p>Free introduction and preview...</p>
      </section>

      {/* Premium content - only subscribers */}
      <PaywallGate customUi={<UpgradePrompt />}>
        <section>
          <h2>Premium Section</h2>
          <p>Full article content here...</p>
        </section>
      </PaywallGate>
    </div>
  );
}
```

**Key features:**

- Use the `customUi` prop to show a custom teaser for non-subscribers
- Blur the premium content in the background for visual effect
- Multiple `PaywallGate` components can be used on the same page

**Example in demo**: [/mixed](http://localhost:3000/mixed)

## Pattern 2: Layout-Level Gating

**Perfect for:**

- SaaS applications
- Tools/platforms where core features require payment
- B2B products
- Dashboard-style applications

Protect entire route sections at the page level for flexible access control:

```tsx
// app/dashboard/page.tsx (main dashboard)
import { PaywallGate } from "@milkie/react";

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

**For authentication-only pages** (billing, settings), use `AuthGate`:

```tsx
// app/dashboard/billing/page.tsx
import { AuthGate } from "@milkie/react";

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

**Key benefits:**

- Page-level control allows mixing free and premium sections
- Navigation always visible (better UX)
- AuthGate separates authentication from subscription requirements
- Users can manage billing/settings even when subscription inactive
- Paywall card centered in content area, not covering entire viewport

**Real-world pattern:**

- `/dashboard` → PaywallGate (requires active subscription)
- `/dashboard/settings` → AuthGate (requires sign-in only)
- `/dashboard/billing` → AuthGate (users must access billing anytime)

**Example in demo**: [/dashboard](http://localhost:3000/dashboard)

## Pattern 3: Hybrid (Public + Protected Routes)

**Perfect for:**

- Most SaaS apps (marketing site + product)
- Apps with free tier and premium features
- Products with public documentation + private tools

Combine public and protected sections in one app:

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

This structure gives you:

- `/` - Public ✅
- `/free` - Public ✅
- `/pricing` - Public ✅
- `/dashboard/*` - Protected 🔒

**Example in demo**: The demo implements this exact pattern!

## Pattern 4: Metered Paywall

**Perfect for:**

- Content sites (blogs, news, magazines)
- Freemium content strategies
- Building engagement before conversion
- Gradual onboarding to paid features

Provide limited free access per time period, then show paywall:

```tsx
"use client";

import { PaywallGate, usePaywall } from "@milkie/react";
import {
  hasReachedLimit,
  recordArticleView,
  hasViewedArticle,
} from "@/lib/metered-access";

export default function MeteredContentPage() {
  const { hasAccess: isPremium } = usePaywall();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const handleArticleClick = (articleId: string) => {
    const alreadyViewed = hasViewedArticle(articleId);
    const reachedLimit = hasReachedLimit();

    // Only record view if user hasn't viewed this article and hasn't hit limit
    if (!isPremium && !alreadyViewed && !reachedLimit) {
      recordArticleView(articleId);
    }

    setSelectedArticle(articles.find((a) => a.id === articleId));
  };

  // For locked articles, show preview + PaywallGate
  if (selectedArticle) {
    const canView = isPremium || hasViewedArticle(selectedArticle.id);

    if (!canView) {
      return (
        <div className="prose">
          {/* Show preview content */}
          <h1>{selectedArticle.title}</h1>
          <p className="lead">{selectedArticle.excerpt}</p>
          <p>{selectedArticle.content.slice(0, 200)}...</p>

          {/* PaywallGate with blurred background */}
          <PaywallGate
            title="You've reached your free article limit"
            subtitle="Subscribe for unlimited access to all premium content"
            subscribeButtonText="Get unlimited access"
          >
            <div className="blur-sm">{selectedArticle.content}</div>
          </PaywallGate>
        </div>
      );
    }

    // User has access - show full article
    return <ArticleView article={selectedArticle} />;
  }

  // Article list with usage counter
  return (
    <div>
      <ArticleListHeader viewCount={getArticleViewCount()} />
      <ArticleGrid articles={articles} onArticleClick={handleArticleClick} />
    </div>
  );
}
```

**Metered access utilities** (`lib/metered-access.ts`):

```tsx
const MONTHLY_LIMIT = 3;

export function getArticleViewCount(): number {
  const data = getViewData();
  return data.viewedArticles.length;
}

export function hasReachedLimit(): boolean {
  return getArticleViewCount() >= MONTHLY_LIMIT;
}

export function hasViewedArticle(articleId: string): boolean {
  const data = getViewData();
  return data.viewedArticles.includes(articleId);
}

export function recordArticleView(articleId: string) {
  const data = getViewData();
  if (!data.viewedArticles.includes(articleId)) {
    data.viewedArticles.push(articleId);
    saveViewData(data);
  }
}

// Helper functions for localStorage with monthly reset
function getViewData() {
  const currentMonth = new Date().toISOString().slice(0, 7); // "2025-10"
  const stored = localStorage.getItem("article_views");
  const data = stored
    ? JSON.parse(stored)
    : { month: null, viewedArticles: [] };

  // Reset if new month
  if (data.month !== currentMonth) {
    return { month: currentMonth, viewedArticles: [] };
  }

  return data;
}
```

**Key features:**

- Track unique articles viewed (not repeat views)
- Automatic monthly reset
- Preview locked content with blurred background
- Compelling CTA with PaywallGate overlay
- Premium users bypass metering entirely

**UX benefits:**

- Users see value before hitting paywall (builds desire)
- Less restrictive than hard blocks (invitation, not barrier)
- Industry-proven pattern (Medium, NYT)
- Preview creates context for subscription decision

**Example in demo**: [/metered](http://localhost:3000/metered)

---

## Pattern 5: Hook-Based Conditional Access

**Perfect for:**

- Custom UI flows
- Complex access logic
- Programmatic access checks
- Custom paywall experiences

Use the `usePaywall` hook for fine-grained control:

```tsx
"use client";

import { usePaywall } from "@milkie/react";

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

**Available hook values:**

- `hasAccess`: boolean - Whether user has an active subscription
- `loading`: boolean - Whether subscription check is in progress
- `email`: string | null - User's email from MilkieProvider
- `status`: string | null - Subscription status from Stripe
- `checkSubscription`: () => Promise<void> - Manual refresh function

---

## Visual Design & UX

Milkie's paywall components include modern visual features for professional, polished experiences:

### Blurred Background Previews

PaywallGate and AuthGate render protected content behind the overlay with a blur effect:

- Content preview builds desire and provides context
- Glassmorphism overlay (`bg-background/80 backdrop-blur-sm`) for modern aesthetic
- Content remains readable enough to understand what's locked
- Non-interactive (`pointer-events-none select-none`) to prevent interaction

### Error Handling

Built-in error recovery without jarring browser alerts:

- Inline error banners with AlertCircle icon
- "Try again" button for immediate retry
- Toast notifications (via Sonner) for non-blocking feedback
- No page refresh needed

### Loading States

Automatic loading states during subscription checks:

- Spinner animation while checking access
- Prevents layout shift
- Maintains user context

### Dark Mode Support

All components fully theme-aware:

- Automatic adaptation to light/dark themes
- Uses next-themes and shadcn/ui's theming system
- Proper contrast in both modes
- No configuration needed

### Smart Redirects

Callback URL handling preserves user context:

- Users return to original page after sign-in
- Works across PaywallGate and AuthGate
- Automatically includes current path in sign-in redirect

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

### 2. Use Page-Level Gating for Flexibility

Protect individual pages instead of entire layouts for better control:

```tsx
// ✅ Good - Page-level gating allows mixing access requirements
// app/dashboard/page.tsx
<PaywallGate>{children}</PaywallGate>

// app/dashboard/settings/page.tsx
<AuthGate>{children}</AuthGate>  // Sign-in only, no subscription

// ❌ Avoid - Layout-level gating prevents accessing billing when subscription inactive
// app/dashboard/layout.tsx
<PaywallGate>{children}</PaywallGate>  // Blocks billing page!
```

**Why page-level is better:**

- Users need access to billing/settings even without active subscription
- Navigation and header remain visible (better UX)
- Paywall overlay centered in content area instead of covering entire viewport
- Flexible mixing of PaywallGate and AuthGate per page

### 3. Custom custom UIs for Better UX

Show value in your customUi content:

```tsx
<PaywallGate
  customUi={
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

Use the customization props to match your app and use case:

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

**All customization props:**

- `title` - Main paywall heading
- `subtitle` - Supporting text below title
- `subscribeButtonText` - CTA button for authenticated users
- `signInButtonText` - CTA button for unauthenticated users
- `signInUrl` - Custom sign-in page URL (default: "/signin")
- `onSignIn` - Alternative to URL, custom sign-in handler function
- `customUi` - Complete custom UI replacement
- `showBranding` - Hide "Powered by milkie" footer (default: true)

### 5. Handle Loading States

Always account for the subscription check:

```tsx
const { hasAccess, loading } = usePaywall();

if (loading) return <LoadingState />;
if (!hasAccess) return <UpgradePrompt />;

return <PremiumContent />;
```

---

## FAQ

**Q: Can I have multiple PaywallGates in one app?**
Yes! All `PaywallGate` components share the same subscription status from `MilkieProvider`.

**Q: Can I mix free and paid content on the same page?**
Absolutely! See Pattern 1 (Component-Level Gating) above.

**Q: What's the difference between PaywallGate and AuthGate?**

- `PaywallGate` requires an active subscription (and authentication)
- `AuthGate` only requires authentication, no subscription needed
- Use AuthGate for billing/settings pages where users need access regardless of subscription status

**Q: Does the paywall work on mobile?**
Yes, fully responsive. The Stripe checkout is also mobile-optimized.

**Q: Can I customize the paywall UI?**
Yes! Use customization props (`title`, `subtitle`, `subscribeButtonText`, etc.) or the `customUi` prop for complete custom UI.

**Q: How does the blurred background preview work?**
PaywallGate renders your protected content in the background with `blur-sm` effect, then overlays the paywall card. This creates a preview that builds desire while maintaining context.

**Q: How do I handle the redirect after sign-in?**
PaywallGate and AuthGate automatically include `callbackUrl` in the sign-in redirect, so users return to the page they were trying to access.

**Q: Can I implement metered paywalls like Medium/NYT?**
Yes! See Pattern 4 (Metered Paywall) for a complete implementation using localStorage for view tracking and monthly reset logic.

**Q: What happens if checkout fails?**
PaywallGate displays inline error messages with a "Try again" button. No page refresh needed - users can retry immediately.

**Q: How do I hide the "Powered by milkie" branding?**
Pass `showBranding={false}` to PaywallGate. The branding is small and unobtrusive by default.

---

## Live Examples

Try these patterns in the live demo at [milkie.dev](https://milkie.dev):

- **[Component Gating (/mixed)](https://milkie.dev/mixed)** - Mix free and premium content on same page with blurred previews
- **[Layout Gating (/dashboard)](https://milkie.dev/dashboard)** - Page-level protection with AuthGate for billing/settings
- **[Metered Paywall (/metered)](https://milkie.dev/metered)** - 3 free articles per month with preview + soft-sell CTA
- **[Homepage](https://milkie.dev)** - Hybrid public/protected structure

**Visual features in action:**

- ✨ Blurred background content previews
- 🎯 Centered overlay cards with glassmorphism
- 🔄 Smart sign-in redirects (callback URLs)
- ⚡ Inline error handling with retry
- 📱 Fully responsive on mobile
- 🌙 Dark mode support throughout

---

**Next Steps:**

- Read [AUTH_INTEGRATION.md](AUTH_INTEGRATION.md) to integrate with your auth provider
- Read [BACKEND_SETUP.md](BACKEND_SETUP.md) for complete API route setup
- Read [QUICKSTART.md](../QUICKSTART.md) to run the demo locally
