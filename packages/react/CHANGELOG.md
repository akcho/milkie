# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-10-19

### Changed

- Enhanced `AuthGate` documentation in package README with complete props list including `showBlurredChildren`, `onSignIn`, and `signInButtonText`
- Added inline card example to AuthGate component README

---

## [0.2.0] - 2025-10-19

### Breaking Changes

- **BREAKING:** Renamed `applyBlur` prop to `showBlurredChildren` in both `PaywallGate` and `AuthGate` components for better semantic clarity
  - Migration: Replace all instances of `applyBlur={value}` with `showBlurredChildren={value}` in your code
  - The prop controls whether blurred content is shown behind the gate overlay (default: true)
  - This change affects both `PaywallGate` and `AuthGate` components

### Changed

- Updated all documentation and examples to use `showBlurredChildren` prop
- Updated TypeScript definitions to reflect the new prop name

---

## [0.1.0] - 2025-10-19

Initial release of Milkie - Stripe-powered paywall SDK for Next.js apps.

### Components

#### PaywallGate

- Subscription-based content protection with Stripe checkout integration
- Blurred content preview for non-subscribers
- Customizable messaging (title, subtitle, button text)
- Custom icon support
- Error handling with retry capability
- Loading states with skeleton loaders
- Optional toast notification integration
- `showBlurredChildren` prop to control blur effect (enabled by default)
- `position` prop for vertical card positioning ("center" or "top")
- Full TypeScript support with comprehensive JSDoc documentation

#### AuthGate

- Authentication-based content gating (email/session verification)
- Blurred content preview for unauthenticated users
- Customizable sign-in messaging and button text
- Flexible sign-in handling (URL redirect or custom handler)
- Custom UI replacement via `customUi` prop
- `position` prop for vertical card positioning ("center" or "top")
- Loading states with skeleton loaders
- Full TypeScript support with comprehensive JSDoc documentation

#### MilkieProvider

- Context provider for managing authentication and subscription state
- Automatic subscription status checking via API integration
- State management for `email`, `hasAccess`, and `loading`
- Works with any auth solution (NextAuth, Clerk, Lucia, Supabase, etc.)
- `usePaywall()` hook for accessing state in custom components

### API Routes

#### Subscription Status Route (`createSubscriptionStatusRoute`)

- Email validation with `validateEmail()` utility function
- Configurable `allowedStatuses` option (defaults to `["active", "trialing"]`)
- Structured error codes via `SubscriptionErrorCode` enum
- Type-safe response types (`SubscriptionStatusResponse`, `SubscriptionErrorResponse`)
- Database adapter interface for flexible database integration

#### Checkout Route (`createCheckoutRoute`)

- Stripe Checkout session creation
- Email validation and verification
- Configurable pricing and success/cancel URLs
- Database adapter interface for customer management
- Type-safe response handling

### UI Components

- **BlurredContent** - Blur effect for protected content previews
- **LoadingState** - Skeleton loader for loading states
- **OverlayGrid** - CSS Grid-based layout for overlay positioning
- **PaywallCard** - Card UI for paywall display with checkout flow
- **AuthCard** - Card UI for authentication prompts
- **CheckoutError** - Error display with retry functionality
- **UserInfo** - User email display component

### Styling & Theming

- Tailwind CSS integration with CSS variable theming
- shadcn/ui component compatibility
- Customizable via `overlayClassName` prop
- Support for custom UI replacement

### TypeScript Support

- Full type definitions for all components and API routes
- Exported types for props interfaces
- Database adapter interfaces for type-safe implementations
- JSDoc documentation for all public APIs

### Documentation

- Comprehensive README with installation and setup guide
- Component-specific READMEs with 10+ usage examples each
- API route documentation with code examples
- Troubleshooting guides
- Live demo application at [milkie.dev](https://milkie.dev)

---

## Future Releases

For upcoming features and breaking changes, see [GitHub Issues](https://github.com/akcho/milkie/issues).
