"use client";

import { usePaywall } from "../provider";
import { useState } from "react";
import { LoadingState } from "../components/loading-state";
import { BlurredContent } from "../components/blurred-content";
import { OverlayGrid } from "../components/overlay-grid";
import { PaywallCard } from "./components/paywall-card";
import { handleSignInRedirect } from "../utils";
import { handleCheckoutProcess, redirectToCheckout } from "./utils";

/**
 * Props for the PaywallGate component.
 *
 * @property {React.ReactNode} children - The premium content to protect behind the paywall
 * @property {React.ReactNode} [customUi] - Optional custom paywall UI component to replace the default card
 * @property {string} [signInUrl="/signin"] - URL to redirect unauthenticated users for sign-in
 * @property {() => void} [onSignIn] - Custom handler for sign-in action, overrides default redirect
 * @property {string} [title="Unlock this content"] - Heading text displayed on the paywall card
 * @property {string} [subtitle="We promise it's worth it."] - Subtitle text displayed on the paywall card
 * @property {string} [signInButtonText="Sign in to subscribe"] - Label for the sign-in button (shown when user is not authenticated)
 * @property {string} [subscribeButtonText="Subscribe now"] - Label for the subscribe button (shown when user is authenticated)
 * @property {React.ReactNode} [icon] - Custom icon to display at the top of the paywall card
 * @property {(email: string) => Promise<{ url: string }>} [onCheckout] - Custom checkout handler that returns a Stripe checkout URL
 * @property {(message: string, type: "success" | "error") => void} [onToast] - Callback to display toast notifications for checkout errors
 * @property {boolean} [showBranding=true] - Whether to show "Powered by milkie" footer in the paywall card
 * @property {boolean} [showBlurredChildren=true] - When true, shows blurred content preview behind paywall card
 * @property {string} [overlayClassName] - Optional className to apply to the overlay element (e.g., "pt-8" to add top padding)
 * @property {"center" | "top"} [position="center"] - Vertical position of the paywall card: "center" for middle, "top" for top alignment
 *
 * @example
 * // Basic usage - protect premium content
 * <PaywallGate>
 *   <PremiumArticle />
 * </PaywallGate>
 *
 * @example
 * // Customized paywall messaging
 * <PaywallGate
 *   title="Unlock Premium Features"
 *   subtitle="Get access to advanced analytics and unlimited exports"
 *   subscribeButtonText="Upgrade to Pro"
 * >
 *   <AnalyticsDashboard />
 * </PaywallGate>
 *
 * @example
 * // Without blur effect
 * <PaywallGate showBlurredChildren={false}>
 *   <PremiumContent />
 * </PaywallGate>
 *
 * @example
 * // With custom checkout handler and toast notifications
 * <PaywallGate
 *   onCheckout={async (email) => {
 *     const response = await createCustomCheckout(email);
 *     return { url: response.checkoutUrl };
 *   }}
 *   onToast={(message, type) => {
 *     toast[type](message);
 *   }}
 * >
 *   <PremiumContent />
 * </PaywallGate>
 */
interface PaywallGateProps {
  children: React.ReactNode;
  customUi?: React.ReactNode;
  signInUrl?: string;
  onSignIn?: () => void;
  title?: string;
  subtitle?: string;
  signInButtonText?: string;
  subscribeButtonText?: string;
  icon?: React.ReactNode;
  onCheckout?: (email: string) => Promise<{ url: string }>;
  onToast?: (message: string, type: "success" | "error") => void;
  showBranding?: boolean;
  showBlurredChildren?: boolean;
  overlayClassName?: string;
  position?: "center" | "top";
}

/**
 * PaywallGate - A component that protects premium content behind a subscription paywall.
 *
 * This component acts as a gatekeeper for premium content, handling three states:
 * 1. Loading: Shows a loading indicator while checking subscription status
 * 2. Has Access: Renders the protected children content for subscribed users
 * 3. No Access: Shows a paywall card with sign-in/subscribe options
 *
 * The component integrates with the MilkieProvider context to check subscription status
 * and provides a built-in checkout flow using Stripe. It can display content with a
 * blur effect preview or show the paywall card inline.
 *
 * Features:
 * - Automatic subscription status checking via usePaywall hook
 * - Built-in Stripe checkout integration
 * - Blurred content preview (can be disabled)
 * - Customizable messaging and styling
 * - Error handling with retry capability
 * - Support for custom checkout handlers
 * - Toast notification integration
 *
 * @param {PaywallGateProps} props - Configuration options for the paywall
 * @returns {JSX.Element} The paywall gate component
 *
 * @example
 * // Basic usage - protect an entire page
 * export default function PremiumPage() {
 *   return (
 *     <PaywallGate>
 *       <h1>Premium Content</h1>
 *       <AdvancedDashboard />
 *     </PaywallGate>
 *   );
 * }
 *
 * @example
 * // Mix free and premium content on the same page
 * export default function MixedContentPage() {
 *   return (
 *     <div>
 *       <PublicArticlePreview />
 *       <PaywallGate
 *         title="Read the full article"
 *         subtitle="Subscribe for unlimited access to all articles"
 *       >
 *         <FullArticleContent />
 *       </PaywallGate>
 *     </div>
 *   );
 * }
 *
 * @example
 * // Completely custom paywall UI
 * <PaywallGate customUi={<MyCustomPaywallCard />}>
 *   <PremiumFeatures />
 * </PaywallGate>
 */
export function PaywallGate({
  children,
  customUi,
  signInUrl = "/signin",
  onSignIn,
  title = "Unlock this content",
  subtitle = "We promise it's worth it.",
  signInButtonText = "Sign in to subscribe",
  subscribeButtonText = "Subscribe now",
  icon,
  onCheckout,
  onToast,
  showBranding = true,
  showBlurredChildren = true,
  overlayClassName,
  position = "center",
}: PaywallGateProps) {
  const { hasAccess, loading, email } = usePaywall();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  if (loading) {
    return <LoadingState />;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (customUi) {
    return <>{customUi}</>;
  }

  const handleCheckout = async () => {
    if (!email) return;

    try {
      setIsCheckingOut(true);
      setCheckoutError(null);

      const data = await handleCheckoutProcess(email, onCheckout);

      if (data.url) {
        redirectToCheckout(data.url);
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to start checkout";
      setCheckoutError(errorMessage);

      if (onToast) {
        onToast("Failed to start checkout. Please try again.", "error");
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn();
    } else {
      handleSignInRedirect(signInUrl);
    }
  };

  const paywallCard = (
    <PaywallCard
      email={email}
      title={title}
      subtitle={subtitle}
      signInButtonText={signInButtonText}
      subscribeButtonText={subscribeButtonText}
      icon={icon}
      isCheckingOut={isCheckingOut}
      checkoutError={checkoutError}
      showBranding={showBranding}
      onSignIn={handleSignIn}
      onCheckout={handleCheckout}
    />
  );

  // When blur is disabled, just show the paywall card inline
  if (!showBlurredChildren) {
    return <div className="py-8">{paywallCard}</div>;
  }

  // Default: show with blur effect
  return (
    <OverlayGrid overlay={paywallCard} overlayClassName={overlayClassName} position={position}>
      <BlurredContent>{children}</BlurredContent>
    </OverlayGrid>
  );
}
