"use client";

import { usePaywall } from "./provider";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface PaywallGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PaywallGate({ children, fallback }: PaywallGateProps) {
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
    if (!email) {
      alert("Please sign in first");
      return;
    }

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
      alert("Failed to start checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Upgrade to Continue</CardTitle>
          <CardDescription>
            Subscribe to access this premium content
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Show logged in email */}
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Logged in as</p>
            <Badge variant="secondary" className="font-normal">
              {email}
            </Badge>
          </div>

          <Button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full"
            size="lg"
          >
            {isCheckingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Subscribe Now"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            You&apos;ll be redirected to Stripe to complete your payment
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
