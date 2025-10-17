"use client";

import { usePaywall, AuthGate } from "@milkie/react";
import { ActiveSubscriptionCard } from "@/components/billing/active-subscription-card";
import { NoSubscriptionCard } from "@/components/billing/no-subscription-card";
import { ImplementationTip } from "@/components/implementation-tip";
import { useCheckout } from "@/hooks/use-checkout";
import { useCancelSubscription } from "@/hooks/use-cancel-subscription";

export default function BillingPage() {
  const { status, email, hasAccess, checkSubscription } = usePaywall();
  const { startCheckout, isCheckingOut } = useCheckout();
  const { cancelSubscription, isCanceling } = useCancelSubscription();

  const handleSubscribe = () => {
    if (!email) return;
    startCheckout(email);
  };

  const handleCancel = () => {
    if (!email) return;
    cancelSubscription(email, checkSubscription);
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
          <ActiveSubscriptionCard
            status={status}
            email={email}
            onCancel={handleCancel}
            isCanceling={isCanceling}
          />
        ) : (
          <NoSubscriptionCard
            status={status}
            email={email}
            onSubscribe={handleSubscribe}
            isCheckingOut={isCheckingOut}
          />
        )}

        <ImplementationTip>
          <p>
            This page uses <code>AuthGate</code> to require sign-in but not an active subscription.
            This is critical for billing pages - users must be able to manage their subscriptions
            even when they&apos;re not active.
          </p>
        </ImplementationTip>
      </div>
    </AuthGate>
  );
}
