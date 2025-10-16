"use client";

import { usePaywall, AuthGate } from "@milkie/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, CheckCircle, XCircle, CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function BillingPage() {
  const { status, email, hasAccess, checkSubscription } = usePaywall();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const handleSubscribe = async () => {
    if (!email) return;

    try {
      setIsCheckingOut(true);
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
        throw new Error("Checkout failed");
      }

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

  const handleCancel = async () => {
    if (!email) return;

    if (!confirm("Are you sure you want to cancel your subscription? (Dev mode: this will reset your subscription for testing)")) {
      return;
    }

    try {
      setIsCanceling(true);
      const response = await fetch(`/api/subscription/reset?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }

      // Refresh subscription status
      await checkSubscription();

      toast.success("Subscription canceled successfully!");
    } catch (error) {
      console.error("Cancel failed:", error);
      toast.error("Failed to cancel subscription. Please try again.");
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <AuthGate>
      <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {hasAccess ? (
        // User has active subscription
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              Your active subscription details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm font-medium">Plan</span>
                <Badge>Premium</Badge>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm font-medium">Status</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium capitalize text-green-600">{status}</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm font-medium">Email</span>
                <span className="text-sm">{email}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium">Price</span>
                <span className="text-sm font-semibold">$10/month</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancel}
                disabled={isCanceling}
              >
                {isCanceling ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Canceling...
                  </>
                ) : (
                  "Cancel Subscription"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        // User is signed in but no active subscription
        <Card>
          <CardHeader>
            <CardTitle>No Active Subscription</CardTitle>
            <CardDescription>
              Subscribe to unlock premium features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm font-medium">Status</span>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {status || "No subscription"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm font-medium">Email</span>
                <span className="text-sm">{email}</span>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Premium Plan</h3>
                  <p className="text-sm text-muted-foreground">$10/month</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Access to premium dashboard features</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Advanced analytics and insights</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Cancel anytime</span>
                </li>
              </ul>
              <Button
                onClick={handleSubscribe}
                disabled={isCheckingOut}
                className="w-full bg-zinc-800 hover:bg-zinc-900"
                size="lg"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Subscribe Now"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Implementation Tip</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            This page uses{" "}
            <code className="text-xs bg-background px-1.5 py-0.5 rounded">AuthGate</code>{" "}
            to require sign-in but not an active subscription. This is critical for billing pages -
            users must be able to manage their subscriptions even when they&apos;re not active.
          </p>
          <p className="text-sm text-muted-foreground">
            In production, integrate Stripe&apos;s Customer Portal for self-service subscription
            management. Milkie can generate secure Customer Portal links for you automatically.
          </p>
        </CardContent>
      </Card>
    </div>
    </AuthGate>
  );
}
