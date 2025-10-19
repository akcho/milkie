# AuthGate Component

A simple authentication gate component that protects content from unauthenticated users with a clean sign-in overlay.

## Overview

The `AuthGate` component is a lightweight building block for implementing authentication-based access control in your Next.js application. Unlike `PaywallGate` which checks subscriptions, `AuthGate` simply verifies that a user is signed in before showing content.

## Features

- **Authentication Check**: Integrates with `MilkieProvider` to verify user email/session
- **Clean Overlay UI**: Blurred content preview with centered sign-in card
- **Customizable Sign-In**: Flexible redirect URLs or custom sign-in handlers
- **Loading States**: Skeleton loaders while checking authentication status
- **Customizable Messaging**: All text labels and icons can be customized
- **Fully Custom UI**: Replace default overlay with your own component
- **Zero Subscription Logic**: Pure authentication gating without subscription checks

## Basic Usage

```tsx
import { AuthGate } from "milkie";

export default function ProtectedPage() {
  return (
    <AuthGate>
      <h1>Members Area</h1>
      <p>Only visible to authenticated users!</p>
    </AuthGate>
  );
}
```

## Component Flow

1. **Loading State**: Shows loading component while checking authentication
2. **Authenticated**: If user has email/session, renders children immediately
3. **Not Authenticated**: Shows sign-in overlay with blurred content preview
4. **Sign-In Action**: Handles redirect or custom sign-in logic

## Props

All props are optional except `children`. Key props:

- `children` - Content to protect (required)
- `title`, `subtitle` - Customize sign-in overlay messaging
- `customUi` - Replace default overlay entirely
- `signInUrl` - URL to redirect for sign-in (default: `/signin`)
- `onSignIn` - Custom sign-in handler
- `signInButtonText` - Customize button label
- `showBlurredChildren` - Show blurred content preview (default: true)
- `overlayClassName` - Custom Tailwind classes for card positioning
- `position` - Vertical card position: `"center"` (default) or `"top"`

See [index.tsx](./index.tsx) for complete TypeScript documentation.

## Usage Examples

### 1. Basic Authentication Gate

Protect entire page with default settings:

```tsx
export default function MembersPage() {
  return (
    <AuthGate>
      <MembersDashboard />
    </AuthGate>
  );
}
```

### 2. Custom Messaging

Customize the sign-in overlay text:

```tsx
<AuthGate
  title="Members Only"
  subtitle="Create a free account to access this content"
  signInButtonText="Create Account"
>
  <MembersContent />
</AuthGate>
```

### 3. Mixed Public/Private Content

Combine public and gated content on same page:

```tsx
export default function BlogPost() {
  return (
    <div>
      {/* Public content - visible to all */}
      <BlogHeader />
      <BlogIntro />

      {/* Members-only content */}
      <AuthGate
        title="Sign in to continue reading"
        subtitle="It's free and takes 30 seconds"
      >
        <BlogFullContent />
        <BlogComments />
      </AuthGate>
    </div>
  );
}
```

### 4. Custom Sign-In Handler

```tsx
import { signIn } from "next-auth/react";

<AuthGate
  onSignIn={() => signIn("google", { callbackUrl: window.location.href })}
  signInButtonText="Sign in with Google"
>
  <ProtectedContent />
</AuthGate>;
```

### 5. Multiple Authentication Providers

Show different sign-in options:

```tsx
import { signIn } from "next-auth/react";

<AuthGate
  customUi={
    <div className="flex flex-col gap-4 p-8">
      <h2 className="text-2xl font-bold">Choose sign-in method</h2>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
      <button onClick={() => signIn("github")}>Sign in with GitHub</button>
      <button onClick={() => signIn("email")}>Sign in with Email</button>
    </div>
  }
>
  <ProtectedContent />
</AuthGate>;
```

### 6. Inline Card (No Blur)

Show the auth card inline without blurred content:

```tsx
<AuthGate showBlurredChildren={false}>
  <ProtectedContent /> {/* Auth card shown inline without blur */}
</AuthGate>
```

### 7. Layout-Level Gating

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <AuthGate title="Dashboard Access">
      <DashboardNav />
      {children}
    </AuthGate>
  );
}
```

### 8. Mixed Public/Gated Content

```tsx
export default function ArticlePage() {
  return (
    <div>
      <Article />
      <AuthGate title="Sign in to join the discussion">
        <CommentSection />
      </AuthGate>
    </div>
  );
}
```

### 9. Top-Positioned Card

For long content where top alignment works better:

```tsx
<AuthGate position="top">
  <LongNewsArticle />
</AuthGate>
```

## Styling

AuthGate uses Tailwind CSS with CSS variables (compatible with shadcn/ui themes).

If not using shadcn/ui, either add the required CSS variables to `globals.css` or use the `customUi` prop for custom styling. See the [package README](../../README.md#styling) for details.

## Features

**State Management:** Authentication state from `usePaywall()` hook (no checkout state - authentication only).

**Accessibility:** ARIA attributes, semantic HTML, and loading states for screen readers.

**Performance:** Cached authentication status, minimal re-renders, layout shift prevention.

## Best Practices

- Always wrap your app with `<MilkieProvider>` first
- Use consistent messaging across your app
- Make sign-in button text action-oriented
- Place AuthGate as close to protected content as possible
- Use blur effect (default) to show users what they're missing
- Combine with PaywallGate: AuthGate for authentication, PaywallGate for subscriptions

## AuthGate vs PaywallGate

**Use AuthGate when:**

- Free member-only content
- Comments sections
- User profiles
- Community features
- Download areas for registered users

**Use PaywallGate when:**

- Premium paid content
- Subscription features
- Metered paywalls
- Trial experiences

**Key difference:** AuthGate only checks if a user is signed in. PaywallGate checks if a signed-in user has an active subscription.

## Troubleshooting

### Gate always shows even when signed in

- Verify `MilkieProvider` is wrapping your app
- Check that user email is being passed to `MilkieProvider`
- Ensure authentication state is properly set

### Sign-in button doesn't work

- Verify `signInUrl` points to a valid route
- If using `onSignIn`, check for JavaScript errors in console
- Ensure authentication library (NextAuth, etc.) is configured

### Custom UI not showing

- Verify `customUi` prop contains valid React component
- Check that component is client-compatible (no server-only code)

## Combining with PaywallGate

You can nest gates for multi-tier access:

```tsx
// Require authentication first, then check subscription
<AuthGate>
  <PublicMemberContent />

  <PaywallGate>
    <PremiumSubscriberContent />
  </PaywallGate>
</AuthGate>
```

Or use them independently:

```tsx
// Different content at same level
<div className="grid grid-cols-2 gap-4">
  <AuthGate>
    <FreeMemberFeatures />
  </AuthGate>

  <PaywallGate>
    <PremiumFeatures />
  </PaywallGate>
</div>
```

## Related

- [`MilkieProvider`](../provider.tsx) - Required context provider
- [`PaywallGate`](../paywall-gate/index.tsx) - For subscription-based gating
- [`usePaywall`](../provider.tsx) - Hook for custom logic
- [Live Demo](https://milkie.dev) - Interactive examples
