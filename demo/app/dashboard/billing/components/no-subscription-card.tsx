import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BillingInfoRow } from "./billing-info-row";
import { PremiumPlanCard } from "./premium-plan-card";
import { SubscriptionStatus } from "./subscription-status";

interface NoSubscriptionCardProps {
  status: string | null;
  email: string | null;
  onSubscribe: () => void;
  isCheckingOut: boolean;
}

export function NoSubscriptionCard({
  status,
  email,
  onSubscribe,
  isCheckingOut,
}: NoSubscriptionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No Active Subscription</CardTitle>
        <CardDescription>Subscribe to unlock premium features</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <BillingInfoRow
            label="Status"
            value={<SubscriptionStatus status={status} isActive={false} />}
          />
          <BillingInfoRow label="Email" value={email} showBorder={false} />
        </div>

        <PremiumPlanCard onSubscribe={onSubscribe} isLoading={isCheckingOut} />
      </CardContent>
    </Card>
  );
}
