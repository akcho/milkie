# Pattern 1: Component-Level Gating

Mix free and premium content on the same page by wrapping specific components.

## Perfect for:

- Content sites (blogs, tutorials, articles)
- Freemium apps with mixed free/premium content
- Feature previews with locked sections

## Implementation

Wrap premium components with `PaywallGate` to create a seamless freemium experience:

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

## Key Features

- **Custom UI**: Use the `customUi` prop to show a custom teaser for non-subscribers
- **Blurred previews**: Premium content appears blurred in the background for visual effect
- **Multiple gates**: Use multiple `PaywallGate` components on the same page
- **Flexible layouts**: Mix and match free/premium sections however you like

## Example Custom UI

Create a compelling upgrade prompt that shows value:

```tsx
function UpgradePrompt() {
  return (
    <div className="text-center p-8 bg-gradient-to-b from-background to-muted rounded-lg">
      <h2 className="text-2xl font-bold mb-4">
        Unlock the full article
      </h2>
      <ul className="text-left max-w-md mx-auto mb-6">
        <li>✓ Complete tutorial with code examples</li>
        <li>✓ Downloadable source files</li>
        <li>✓ Video walkthrough</li>
      </ul>
    </div>
  );
}

<PaywallGate customUi={<UpgradePrompt />}>
  <PremiumContent />
</PaywallGate>
```

## Live Demo

Try this pattern at [milkie.dev/mixed](https://milkie.dev/mixed)

## Related Patterns

- [Metered Paywall](metered-paywall.md) - Combine with metered access for soft paywalls
- [Hook-Based Access](hook-based-access.md) - Programmatic control for complex logic

## Next Steps

- Review [customization options](../reference/customization.md) for styling the paywall card
- See [best practices](../reference/best-practices.md) for UX tips
