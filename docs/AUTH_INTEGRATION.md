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

### With NextAuth / Auth.js v5

For Next.js App Router with NextAuth v5 (Auth.js):

```tsx
// app/layout.tsx
import { auth } from "@/auth";
import { SessionProviders } from "@/components/providers";

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html>
      <body>
        <SessionProviders session={session}>{children}</SessionProviders>
      </body>
    </html>
  );
}

// components/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { MilkieProvider } from "@milkie/react";

export function SessionProviders({ children, session }) {
  return (
    <SessionProvider session={session}>
      <MilkieProvider email={session?.user?.email}>{children}</MilkieProvider>
    </SessionProvider>
  );
}
```

For Next.js Pages Router:

```tsx
import { useSession } from "next-auth/react";
import { MilkieProvider } from "@milkie/react";

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
import { useUser } from "@clerk/nextjs";
import { MilkieProvider } from "@milkie/react";

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
import { useAuth } from "@/lib/auth";
import { MilkieProvider } from "@milkie/react";

export default function App({ children }) {
  const { user } = useAuth();

  return <MilkieProvider email={user?.email}>{children}</MilkieProvider>;
}
```

### With Supabase Auth

```tsx
import { useSupabaseUser } from "@/lib/supabase";
import { MilkieProvider } from "@milkie/react";

export default function App({ children }) {
  const user = useSupabaseUser();

  return <MilkieProvider email={user?.email}>{children}</MilkieProvider>;
}
```

### With Better Auth

```tsx
import { useSession } from "better-auth/react";
import { MilkieProvider } from "@milkie/react";

export default function App({ children }) {
  const { data: session } = useSession();

  return (
    <MilkieProvider email={session?.user?.email}>{children}</MilkieProvider>
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

1. **Authentication Check**: Milkie tracks the authenticated user's email
2. **Subscription Check**: Milkie checks if the email has an active Stripe subscription
3. **Access Control**: The `PaywallGate` and `AuthGate` components use this status to show/hide content
4. **Checkout Flow**: When a non-subscriber tries to access gated content:
   - If authenticated (email provided): Shows subscription button
   - If not authenticated: Shows "Sign in to subscribe" button with redirect back to current page
5. **After Payment**: Stripe webhooks update the subscription status in real-time

## Components

Milkie provides two gating components:

### `PaywallGate` - Subscription-based access control

Requires users to have an active subscription. Shows a paywall with subscription button for authenticated non-subscribers, or sign-in prompt for unauthenticated users.

```tsx
import { PaywallGate } from "@milkie/react";

<PaywallGate>
  <PremiumContent />
</PaywallGate>
```

### `AuthGate` - Authentication-based access control

Only requires users to be signed in (no subscription needed). Useful for member-only content that doesn't require payment.

```tsx
import { AuthGate } from "@milkie/react";

<AuthGate>
  <MembersOnlyContent />
</AuthGate>
```

## Sign-In Redirect Flow

Both `PaywallGate` and `AuthGate` components include smart redirect handling:

```tsx
<PaywallGate
  signInUrl="/signin" // Default: "/signin"
  onSignIn={() => {}} // Optional: custom handler
>
  <PremiumContent />
</PaywallGate>
```

When a non-authenticated user clicks "Sign in to subscribe" (or "Sign in" for `AuthGate`):

- They're redirected to your sign-in page with a `callbackUrl` parameter
- After signing in, they return to the exact page they were trying to access
- For `PaywallGate`: Shows the subscription button with their email
- For `AuthGate`: Immediately shows the protected content

This ensures a smooth user experience with no lost context.

## Customization Options

Both components support extensive customization:

**PaywallGate**:

```tsx
<PaywallGate
  title="Unlock this content"
  subtitle="We promise it's worth it."
  signInButtonText="Sign in to subscribe"
  subscribeButtonText="Subscribe now"
  signInUrl="/signin"
  showBranding={true} // Show "Powered by milkie" footer
  disableBlur={false} // Show without blur effect
  overlayClassName="pt-8" // Custom overlay positioning
  onSignIn={() => {
    // Custom sign-in logic
  }}
  onCheckout={async (email) => {
    // Custom checkout handler
    return { url: checkoutUrl };
  }}
  onToast={(message, type) => {
    // Toast notification integration
  }}
>
  <PremiumContent />
</PaywallGate>
```

**AuthGate**:

```tsx
<AuthGate
  title="Sign in required"
  subtitle="Please sign in to access this content."
  signInButtonText="Sign in"
  signInUrl="/signin"
  overlayClassName="pt-8" // Custom overlay positioning
  onSignIn={() => {
    // Custom sign-in logic
  }}
>
  <MembersContent />
</AuthGate>
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
A: No. Milkie only handles subscription/payment gating and content protection. You need your own authentication for user identity and sessions.

**Q: What's the difference between `PaywallGate` and `AuthGate`?**
A: `AuthGate` only checks if a user is signed in (has an email). `PaywallGate` checks if a user has an active subscription. Use `AuthGate` for free member-only content and `PaywallGate` for premium paid content.

**Q: What if my auth doesn't use email?**
A: Currently Milkie requires an email to link to Stripe customers. Support for other identifiers may come later.

**Q: Can I customize the gate UI?**
A: Yes! Both components support the `customUi` prop to provide your own UI, or use the customization props like `title`, `subtitle`, etc.

**Q: Does the email need to be verified?**
A: Yes, for production use. Milkie doesn't verify emails - your auth solution should handle that. Milkie trusts that emails from your auth system are verified.

**Q: Can I use Milkie with server components?**
A: The `MilkieProvider`, `PaywallGate`, and `AuthGate` are client components. Wrap them in your client-side layout or use them in client components only.
