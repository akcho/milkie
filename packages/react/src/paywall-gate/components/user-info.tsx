/**
 * Props for the UserInfo component.
 *
 * @property {string} email - The authenticated user's email address to display
 */
interface UserInfoProps {
  email: string;
}

/**
 * UserInfo - A component that displays the authenticated user's email in a styled info box.
 *
 * This component provides a visual confirmation to users about which account they're
 * about to subscribe with. It helps prevent accidental subscriptions with the wrong
 * account and increases user confidence during the checkout process.
 *
 * Features:
 * - Muted background for subtle visual distinction
 * - Clear "Logged in as" label for context
 * - Email displayed in medium weight font for emphasis
 * - Responsive padding and spacing
 * - Rounded corners for modern appearance
 *
 * Visual Hierarchy:
 * 1. Small, muted "Logged in as" label (context)
 * 2. Larger, bold email address (primary information)
 *
 * Use Cases:
 * - Shown in PaywallCard when user is authenticated
 * - Displayed before the subscribe button
 * - Provides transparency in the checkout flow
 *
 * @param {UserInfoProps} props - Component props
 * @returns {JSX.Element} The rendered user info display
 *
 * @example
 * <UserInfo email="john.doe@example.com" />
 * // Renders a muted box with "Logged in as" label and the email
 *
 * @example
 * // Typical usage in PaywallCard
 * {email && (
 *   <>
 *     <UserInfo email={email} />
 *     <Button onClick={handleSubscribe}>Subscribe</Button>
 *   </>
 * )}
 */
export function UserInfo({ email }: UserInfoProps) {
  return (
    <div className="bg-muted rounded-lg p-4 space-y-1">
      <p className="text-xs text-muted-foreground">Logged in as</p>
      <p className="text-sm font-medium">{email}</p>
    </div>
  );
}
