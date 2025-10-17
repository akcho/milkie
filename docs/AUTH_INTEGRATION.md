# Authentication Integration

Milkie is **auth-agnostic** - it works with any authentication solution that provides a user email. Pass the authenticated email to the `MilkieProvider` and you're done.

## Quick Start

```tsx
import { MilkieProvider } from '@milkie/react'

export default function App() {
  const email = // ... get from your auth solution

  return (
    <MilkieProvider email={email}>
      <YourApp />
    </MilkieProvider>
  )
}
```

The `email` prop is optional. If not provided, the paywall will prompt users to sign in before accessing premium content.

---

## Integration Examples

### With NextAuth

```tsx
import { useSession } from 'next-auth/react';
import { MilkieProvider } from '@milkie/react';

export default function App({ Component, pageProps }) {
  const { data: session } = useSession();

  return (
    <MilkieProvider email={session?.user?.email}>
      <Component {...pageProps} />
    </MilkieProvider>
  );
}
```

### With Clerk

```tsx
import { useUser } from '@clerk/nextjs';
import { MilkieProvider } from '@milkie/react';

export default function App({ children }) {
  const { user } = useUser();

  return (
    <MilkieProvider email={user?.primaryEmailAddress?.emailAddress}>
      {children}
    </MilkieProvider>
  );
}
```

### With Lucia Auth

```tsx
import { useAuth } from '@/lib/auth';
import { MilkieProvider } from '@milkie/react';

export default function App({ children }) {
  const { user } = useAuth();

  return (
    <MilkieProvider email={user?.email}>
      {children}
    </MilkieProvider>
  );
}
```

### With Supabase Auth

```tsx
import { useSupabaseUser } from '@/lib/supabase';
import { MilkieProvider } from '@milkie/react';

export default function App({ children }) {
  const user = useSupabaseUser();

  return (
    <MilkieProvider email={user?.email}>
      {children}
    </MilkieProvider>
  );
}
```

### With Better Auth

```tsx
import { useSession } from 'better-auth/react';
import { MilkieProvider } from '@milkie/react';

export default function App({ children }) {
  const { data: session } = useSession();

  return (
    <MilkieProvider email={session?.user?.email}>
      {children}
    </MilkieProvider>
  );
}
```

### With Custom Auth

As long as you can get the user's authenticated email, it works:

```tsx
<MilkieProvider email={yourAuthSolution.getUserEmail()}>
  <App />
</MilkieProvider>
```

---

## How It Works

When you provide an email to `MilkieProvider`:

1. **Subscription Check**: Milkie checks if the email has an active Stripe subscription
2. **Access Control**: The `PaywallGate` component uses this status to show/hide content
3. **Checkout Flow**: When a non-subscriber tries to access gated content:
   - If authenticated (email provided): Shows subscription button
   - If not authenticated: Shows "Sign in to subscribe" button with redirect back to current page
4. **After Payment**: Stripe webhooks update the subscription status in real-time

## Sign-In Redirect Flow

The `PaywallGate` component includes smart redirect handling:

```tsx
<PaywallGate
  signInUrl="/signin"  // Default: "/signin"
  onSignIn={() => {}}  // Optional: custom handler
>
  <PremiumContent />
</PaywallGate>
```

When a non-authenticated user clicks "Sign in to subscribe":
- They're redirected to your sign-in page with a `callbackUrl` parameter
- After signing in, they return to the exact page they were trying to access
- The paywall then shows the subscription button with their email

This ensures a smooth user experience with no lost context.

## Customization Options

The `PaywallGate` component supports customization:

```tsx
<PaywallGate
  title="Unlock this content"
  subtitle="We promise it's worth it."
  signInButtonText="Sign in to subscribe"
  subscribeButtonText="Subscribe now"
  signInUrl="/signin"
  onSignIn={() => {
    // Custom sign-in logic
  }}
>
  <PremiumContent />
</PaywallGate>
```

## Security Considerations

**Authentication is required for production use.** Milkie expects emails from your auth system to be verified and authenticated. The security model relies on:

1. Your auth solution verifying email ownership
2. Your auth solution maintaining session security
3. Milkie linking subscriptions to verified emails

This approach keeps security concerns separate:
- **Your auth**: Handles identity and verification
- **Milkie**: Handles subscription and payment gating

---

## FAQ

**Q: Does Milkie replace my auth solution?**
A: No. Milkie only handles subscription/payment gating. You need your own authentication for user identity and sessions.

**Q: What if my auth doesn't use email?**
A: Currently Milkie requires an email to link to Stripe customers. Support for other identifiers may come later.

**Q: Can I customize the paywall UI?**
A: Yes! Use the `fallback` prop to provide your own upgrade prompt, or use the customization props like `title`, `subtitle`, etc.

**Q: Does the email need to be verified?**
A: Yes, for production use. Milkie doesn't verify emails - your auth solution should handle that. Milkie trusts that emails from your auth system are verified.

**Q: Can I use Milkie with server components?**
A: The `MilkieProvider` and `PaywallGate` are client components. Wrap them in your client-side layout or use them in client components only.
