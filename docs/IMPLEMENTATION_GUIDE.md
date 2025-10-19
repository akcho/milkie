# Milkie Implementation Guide

Complete guide to implementing paywalls in your Next.js app - from simple component gating to sophisticated metered access patterns.

## Quick Navigation

- [Paywall Patterns](#paywall-patterns) - 7 proven patterns for different use cases
- [Customization](reference/customization.md) - Visual design, props, and theming
- [API Reference](reference/api-reference.md) - Routes, database schema, security
- [Best Practices](reference/best-practices.md) - Tips, gotchas, and recommendations
- [FAQ](FAQ.md) - Common questions and troubleshooting

## Paywall Patterns

Choose the pattern that fits your app's monetization strategy:

### Pattern 1: [Component-Level Gating](paywall-patterns/component-gating.md)

**Perfect for:** Content sites (blogs, tutorials), freemium apps with mixed content

Mix free and premium content on the same page by wrapping specific components. Show previews with blurred backgrounds and custom upgrade prompts.

```tsx
<PaywallGate customUi={<UpgradePrompt />}>
  <PremiumContent />
</PaywallGate>
```

[View full pattern →](paywall-patterns/component-gating.md) | [Live demo](https://milkie.dev/mixed)

---

### Pattern 2: [Layout-Level Gating](paywall-patterns/layout-gating.md)

**Perfect for:** SaaS applications, dashboards, B2B products

Protect entire route sections at the page level. Use `PaywallGate` for subscription-required pages and `AuthGate` for authentication-only pages (like billing and settings).

```tsx
// Requires active subscription
<PaywallGate>
  <DashboardContent />
</PaywallGate>

// Requires sign-in only
<AuthGate>
  <BillingPage />
</AuthGate>
```

[View full pattern →](paywall-patterns/layout-gating.md) | [Live demo](https://milkie.dev/dashboard)

---

### Pattern 3: [Hybrid (Public + Protected Routes)](paywall-patterns/hybrid-routes.md)

**Perfect for:** Most SaaS apps (marketing site + product), apps with free tier

Combine public landing pages with protected app sections in one codebase. Leverage Next.js App Router layouts for clean separation.

```tsx
/                    → Public ✅
/pricing            → Public ✅
/dashboard/*        → Protected 🔒
```

[View full pattern →](paywall-patterns/hybrid-routes.md)

---

### Pattern 4: [Metered Paywall](paywall-patterns/metered-paywall.md)

**Perfect for:** Content sites, blogs, news, magazines

Provide limited free access (e.g., 3 articles/month), then show paywall with blurred content preview. Automatic monthly reset, tracks unique views.

```tsx
const { hasAccess: isPremium } = usePaywall();
const canView = isPremium || hasViewedArticle(articleId);

if (!canView) {
  return (
    <PaywallGate title="You've reached your free article limit">
      <div className="blur-sm">{articleContent}</div>
    </PaywallGate>
  );
}
```

[View full pattern →](paywall-patterns/metered-paywall.md) | [Live demo](https://milkie.dev/metered)

---

### Pattern 5: [Hook-Based Conditional Access](paywall-patterns/hook-based-access.md)

**Perfect for:** Custom UI flows, complex access logic, programmatic checks

Use the `usePaywall` hook for fine-grained control and custom experiences.

```tsx
const { hasAccess, loading, email, status } = usePaywall();

if (!hasAccess) {
  return <CustomUpgradePrompt />;
}
```

[View full pattern →](paywall-patterns/hook-based-access.md)

---

### Pattern 6: [Error Recovery with Retry](paywall-patterns/error-recovery.md)

**Perfect for:** Production apps, graceful error handling

Handle checkout errors without disrupting UX. Inline error display with retry button, toast notifications.

```tsx
<PaywallGate onToast={(message, type) => toast[type](message)}>
  <PremiumContent />
</PaywallGate>
```

[View full pattern →](paywall-patterns/error-recovery.md)

---

### Pattern 7: [Custom Checkout Handler](paywall-patterns/custom-checkout.md)

**Perfect for:** Custom pricing logic, third-party processors, special flows

Override default checkout to add custom metadata, UTM tracking, or alternative payment providers.

```tsx
<PaywallGate
  onCheckout={async (email) => {
    const res = await fetch("/api/custom-checkout", {
      method: "POST",
      body: JSON.stringify({ email, utmSource: "landing" }),
    });
    const data = await res.json();
    return { url: data.checkoutUrl };
  }}
>
  <PremiumContent />
</PaywallGate>
```

[View full pattern →](paywall-patterns/custom-checkout.md)

---

## Next Steps

1. **Choose your pattern** - Pick the pattern that matches your use case above
2. **Review customization options** - See [customization.md](reference/customization.md) for props, styling, and theming
3. **Check best practices** - Read [best-practices.md](reference/best-practices.md) for tips and gotchas
4. **Set up your backend** - Follow [BACKEND_SETUP.md](BACKEND_SETUP.md) for API routes and database setup
5. **Integrate authentication** - See [AUTH_INTEGRATION.md](AUTH_INTEGRATION.md) for auth provider setup

## Live Examples

Try these patterns in action at [milkie.dev](https://milkie.dev):

- **[/mixed](https://milkie.dev/mixed)** - Component-level gating with blurred previews
- **[/dashboard](https://milkie.dev/dashboard)** - Layout-level protection with AuthGate
- **[/metered](https://milkie.dev/metered)** - Metered paywall (3 free articles/month)
- **[/](https://milkie.dev)** - Hybrid public/protected structure

## Support

- **Questions?** Check the [FAQ](FAQ.md)
- **Need help?** Open an issue on GitHub
- **Found a bug?** Please report it with reproduction steps
