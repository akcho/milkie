import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { MilkieIcon } from "../../components/milkie-icon";
import { UserInfo } from "./user-info";
import { CheckoutError } from "./checkout-error";

/**
 * Props for the PaywallCard component.
 *
 * @property {string | null} email - The user's email address (null if not authenticated)
 * @property {string} title - Main heading text displayed on the card
 * @property {string} subtitle - Descriptive subtitle text below the title
 * @property {string} signInButtonText - Label for the sign-in button (shown when email is null)
 * @property {string} subscribeButtonText - Label for the subscribe button (shown when email exists)
 * @property {React.ReactNode} [icon] - Optional custom icon to display at the top of the card
 * @property {boolean} isCheckingOut - Whether the checkout process is currently in progress
 * @property {string | null} checkoutError - Error message from failed checkout attempt (null if no error)
 * @property {boolean} showBranding - Whether to display "Powered by milkie" footer
 * @property {() => void} onSignIn - Callback function to handle sign-in button click
 * @property {() => void} onCheckout - Callback function to handle checkout button click
 */
interface PaywallCardProps {
  email: string | null;
  title: string;
  subtitle: string;
  signInButtonText: string;
  subscribeButtonText: string;
  icon?: React.ReactNode;
  isCheckingOut: boolean;
  checkoutError: string | null;
  showBranding: boolean;
  onSignIn: () => void;
  onCheckout: () => void;
}

/**
 * PaywallCard - A customizable card UI component for displaying paywall prompts.
 *
 * This component presents users with a visually appealing card that prompts them
 * to either sign in or subscribe to access premium content. It handles two distinct
 * user states:
 *
 * 1. **Unauthenticated** (email is null):
 *    - Shows a sign-in button
 *    - Prompts user to authenticate before subscribing
 *
 * 2. **Authenticated** (email exists):
 *    - Displays user's email in a UserInfo component
 *    - Shows subscribe button to initiate checkout
 *    - Handles checkout loading state with spinner
 *    - Displays checkout errors with retry capability
 *
 * Visual Features:
 * - Centered icon (custom or default Milkie icon)
 * - Customizable title and subtitle
 * - User email display for authenticated users
 * - Loading state with animated spinner
 * - Error state with retry prompt
 * - Optional "Powered by milkie" branding footer
 * - Responsive design with max-width constraint
 *
 * @param {PaywallCardProps} props - Configuration for the paywall card
 * @returns {JSX.Element} The rendered paywall card
 *
 * @example
 * // Basic usage with authenticated user
 * <PaywallCard
 *   email="user@example.com"
 *   title="Unlock Premium"
 *   subtitle="Subscribe for unlimited access"
 *   signInButtonText="Sign in"
 *   subscribeButtonText="Subscribe now"
 *   isCheckingOut={false}
 *   checkoutError={null}
 *   showBranding={true}
 *   onSignIn={() => router.push('/signin')}
 *   onCheckout={handleCheckout}
 * />
 *
 * @example
 * // Unauthenticated user state
 * <PaywallCard
 *   email={null}
 *   title="Premium Content"
 *   subtitle="Sign in to access"
 *   signInButtonText="Sign in to continue"
 *   subscribeButtonText="Subscribe"
 *   isCheckingOut={false}
 *   checkoutError={null}
 *   showBranding={true}
 *   onSignIn={handleSignIn}
 *   onCheckout={handleCheckout}
 * />
 */
export function PaywallCard({
  email,
  title,
  subtitle,
  signInButtonText,
  subscribeButtonText,
  icon,
  isCheckingOut,
  checkoutError,
  showBranding,
  onSignIn,
  onCheckout,
}: PaywallCardProps) {
  return (
    <Card className="max-w-md w-full shadow-none">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          {icon || <MilkieIcon className="h-12 w-12" />}
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {!email ? (
          <Button onClick={onSignIn} className="w-full" size="lg">
            {signInButtonText}
          </Button>
        ) : (
          <>
            <UserInfo email={email} />

            {checkoutError && <CheckoutError error={checkoutError} />}

            <Button
              onClick={onCheckout}
              disabled={isCheckingOut}
              className="w-full"
              size="lg"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : checkoutError ? (
                "Try again"
              ) : (
                subscribeButtonText
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              You&apos;ll be redirected to Stripe to complete your payment
            </p>
          </>
        )}

        {showBranding && (
          <p
            className="text-center text-muted-foreground/50 mt-6"
            style={{ fontSize: "10px" }}
          >
            Powered by{" "}
            <a
              href="https://github.com/akcho/milkie"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-muted-foreground/70 hover:text-muted-foreground transition-colors"
            >
              milkie
            </a>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
