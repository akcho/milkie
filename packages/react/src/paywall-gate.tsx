"use client";

import { usePaywall } from "./provider";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { MilkieIcon } from "./components/milkie-icon";
import { Loader2, AlertCircle } from "lucide-react";

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
  onToast?: (message: string, type: 'success' | 'error') => void;
  showBranding?: boolean;
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
}: PaywallGateProps) {
  const { hasAccess, loading, email } = usePaywall();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
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

      let data;
      if (onCheckout) {
        // Use custom checkout handler if provided
        data = await onCheckout(email);
      } else {
        // Default to /api/checkout endpoint
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            callbackUrl: window.location.pathname + window.location.search,
          }),
        });

        if (!response.ok) {
          throw new Error(`Checkout failed with status ${response.status}`);
        }

        data = await response.json();
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to start checkout";
      setCheckoutError(errorMessage);

      if (onToast) {
        onToast("Failed to start checkout. Please try again.", 'error');
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn();
    } else {
      // Preserve current URL to redirect back after sign-in
      const callbackUrl = encodeURIComponent(
        window.location.pathname + window.location.search
      );
      window.location.href = `${signInUrl}?callbackUrl=${callbackUrl}`;
    }
  };

  return (
    <div className="relative min-h-[400px]">
      {/* Blurred content in background */}
      <div
        className="blur-sm pointer-events-none select-none pt-4"
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Paywall overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-8 bg-background/80 backdrop-blur-sm">
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
              <Button
                onClick={handleSignIn}
                className="w-full bg-zinc-800 hover:bg-zinc-900"
                size="lg"
              >
                {signInButtonText}
              </Button>
            ) : (
              <>
                {/* Signed in - show subscribe button */}
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">
                    Logged in as
                  </p>
                  <Badge variant="secondary" className="font-normal">
                    {email}
                  </Badge>
                </div>

                {checkoutError && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-destructive">
                      <p className="font-medium">Checkout failed</p>
                      <p className="text-xs mt-1 opacity-90">
                        {checkoutError.includes("status")
                          ? "Unable to connect to checkout service. Please try again."
                          : checkoutError}
                      </p>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-zinc-800 hover:bg-zinc-900"
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
              <p className="text-center text-muted-foreground/50 mt-6" style={{ fontSize: '10px' }}>
                Powered by{" "}
                <a
                  href="https://github.com/akcho/milkie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:text-muted-foreground transition-colors"
                >
                  milkie
                </a>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
