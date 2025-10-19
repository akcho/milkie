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
import { AuthGate } from "@milkie/react";

export default function ProtectedPage() {
  return (
    <AuthGate>
      <h1>Members Area</h1>
      <p>Only visible to authenticated users!</p>
    </AuthGate>
  );
}
```

## Component Architecture

### File Structure

```
auth-gate/
├── index.tsx                 # Main AuthGate component
├── components/
│   └── auth-card.tsx         # Sign-in card UI
└── README.md                 # This file
```

### Component Flow

1. **Loading State**: Shows `LoadingState` component while checking authentication
2. **Authenticated**: If user has email/session, renders children immediately
3. **Not Authenticated**: Shows sign-in overlay with blurred content preview
4. **Sign-In Action**: Handles redirect or custom sign-in logic

## Props

All props are optional except `children`. See the TypeScript interface in [index.tsx](./index.tsx) for complete prop documentation with JSDoc comments.

Key props:
- `children` - Content to protect (required)
- `title`, `subtitle` - Customize sign-in overlay messaging
- `customUi` - Replace default overlay entirely
- `signInUrl` - URL to redirect for sign-in (default: `/signin`)
- `onSignIn` - Custom sign-in handler
- `signInButtonText` - Customize button label
- `overlayClassName` - Custom Tailwind classes for positioning the card (e.g., `"py-8"` for vertical padding)

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

### 4. Custom Sign-In URL

Redirect to a custom authentication page:

```tsx
<AuthGate signInUrl="/auth/login">
  <ProtectedContent />
</AuthGate>
```

### 5. Custom Sign-In Handler

Override default redirect with custom logic:

```tsx
import { signIn } from "next-auth/react";

<AuthGate
  onSignIn={() => signIn("google", { callbackUrl: window.location.href })}
  signInButtonText="Sign in with Google"
>
  <ProtectedContent />
</AuthGate>
```

### 6. Multiple Authentication Providers

Show different sign-in options:

```tsx
import { signIn } from "next-auth/react";

<AuthGate
  customUi={
    <div className="flex flex-col gap-4 p-8">
      <h2 className="text-2xl font-bold">Choose sign-in method</h2>
      <button onClick={() => signIn("google")}>
        Sign in with Google
      </button>
      <button onClick={() => signIn("github")}>
        Sign in with GitHub
      </button>
      <button onClick={() => signIn("email")}>
        Sign in with Email
      </button>
    </div>
  }
>
  <ProtectedContent />
</AuthGate>
```

### 7. Layout-Level Gating

Protect entire sections of your app:

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate
      title="Dashboard Access"
      subtitle="Please sign in to access your dashboard"
    >
      <DashboardNav />
      <div className="dashboard-content">
        {children}
      </div>
    </AuthGate>
  );
}
```

### 8. Free Content with Optional Sign-In

Gate optional features while keeping main content public:

```tsx
export default function ArticlePage() {
  return (
    <div>
      <Article />

      <AuthGate
        title="Sign in to join the discussion"
        subtitle="Share your thoughts in the comments"
      >
        <CommentSection />
      </AuthGate>
    </div>
  );
}
```

### 9. User Profile Pages

Protect user-specific content:

```tsx
export default function ProfilePage() {
  return (
    <AuthGate
      title="View your profile"
      subtitle="Sign in to manage your account settings"
    >
      <UserProfile />
      <AccountSettings />
    </AuthGate>
  );
}
```

### 10. Conditional Gating

Combine with other conditions:

```tsx
"use client";
import { usePaywall } from "@milkie/react";

export default function ConditionalPage() {
  const { email } = usePaywall();
  const needsAuth = !email;

  if (needsAuth) {
    return (
      <AuthGate>
        <ProtectedContent />
      </AuthGate>
    );
  }

  return <ProtectedContent />;
}
```

## Styling

The AuthGate uses Tailwind CSS with CSS variables for theming. It's compatible with shadcn/ui themes.

### Required CSS Variables

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --border: 214.3 31.8% 91.4%;
    --radius: 0.5rem;
  }
}
```

### Custom Styling

If you're not using shadcn/ui, you can either:

1. Add the CSS variables above to your `globals.css`
2. Use the `customUi` prop to provide fully custom styled components

## State Management

Internal state from `usePaywall()` hook:

- `loading`: Boolean indicating authentication check in progress
- `email`: User's email from MilkieProvider (null if not authenticated)

Unlike `PaywallGate`, `AuthGate` doesn't manage checkout state - it only cares about authentication.

## Accessibility

The component includes basic accessibility features:

- Blurred content is marked with `aria-hidden="true"` to hide from screen readers
- Semantic HTML structure with proper button elements
- Loading text for screen reader context during async operations
- Keyboard navigation support

## Performance Considerations

- Authentication status cached in MilkieProvider context
- No unnecessary re-renders when authenticated
- Loading states prevent layout shift
- Minimal client-side JavaScript

## Best Practices

1. **Use with MilkieProvider**: Always wrap your app with `<MilkieProvider>` first
2. **Consistent Messaging**: Use similar titles/subtitles across your app
3. **Clear CTAs**: Make sign-in button text action-oriented
4. **Strategic Placement**: Place AuthGate as close to protected content as possible
5. **Content Preview**: Default blur effect shows users what they're missing
6. **Combine with PaywallGate**: Use AuthGate for authentication, PaywallGate for subscriptions

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

## Related Components

- [`MilkieProvider`](../provider.tsx) - Required context provider
- [`PaywallGate`](../paywall-gate/index.tsx) - For subscription-based gating
- [`usePaywall`](../provider.tsx) - Hook for custom authentication logic

## TypeScript Support

All components are fully typed with TypeScript. Import types from the package:

```tsx
import type { AuthGateProps } from "@milkie/react";
```

## Examples in Demo App

See the [live demo](https://milkie.dev) for interactive examples:

- Basic authentication gate
- Custom sign-in handlers
- Mixed content pages
- Layout-level gating

## License

MIT - see [LICENSE](https://github.com/akcho/milkie/blob/main/LICENSE)
