"use client";

import { usePaywall } from "./provider";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

interface PaywallGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  signInUrl?: string;
  onSignIn?: () => void;
  title?: string;
  subtitle?: string;
  signInButtonText?: string;
  subscribeButtonText?: string;
}

export function PaywallGate({
  children,
  fallback,
  signInUrl = "/signin",
  onSignIn,
  title = "Unlock this content",
  subtitle = "We promise it's worth it.",
  signInButtonText = "Sign in to subscribe",
  subscribeButtonText = "Subscribe now"
}: PaywallGateProps) {
  const { hasAccess, loading, email } = usePaywall();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

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
    try {
      setIsCheckingOut(true);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn();
    } else {
      window.location.href = signInUrl;
    }
  };

  return (
    <div className="relative min-h-[400px]">
      {/* Blurred content in background */}
      <div className="blur-sm pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>

      {/* Paywall overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" />
              </div>
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
                  <p className="text-sm text-muted-foreground mb-1">Logged in as</p>
                  <Badge variant="secondary" className="font-normal">
                    {email}
                  </Badge>
                </div>

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
                  ) : (
                    subscribeButtonText
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  You&apos;ll be redirected to Stripe to complete your payment
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
