"use client";

import { usePaywall } from "../provider";
import { useState } from "react";
import { LoadingState } from "./components/loading-state";
import { BlurredContent } from "./components/blurred-content";
import { PaywallCard } from "./components/paywall-card";
import {
  handleSignInRedirect,
  handleCheckoutProcess,
  redirectToCheckout,
} from "./utils";

interface PaywallGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
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
  disableBlur?: boolean;
}

export function PaywallGate({
  children,
  fallback,
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
  disableBlur = false,
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

  if (fallback) {
    return <>{fallback}</>;
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
  if (disableBlur) {
    return (
      <div className="flex items-center justify-center py-8">
        {paywallCard}
      </div>
    );
  }

  // Default: show with blur effect
  return (
    <div className="relative w-full">
      <BlurredContent>{children}</BlurredContent>
      <div className="absolute inset-0 flex items-center justify-center px-8">
        {paywallCard}
      </div>
    </div>
  );
}
