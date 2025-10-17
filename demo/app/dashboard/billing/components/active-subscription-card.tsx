import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BillingInfoRow } from "./billing-info-row";
import { LoadingButton } from "@/components/loading-button";
import { SubscriptionStatus } from "./subscription-status";
import { PREMIUM_PRICE } from "./premium-plan-card";

interface ActiveSubscriptionCardProps {
  status: string | null;
  email: string | null;
  onCancel: () => void;
  isCanceling: boolean;
}

export function ActiveSubscriptionCard({
  status,
  email,
  onCancel,
  isCanceling,
}: ActiveSubscriptionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Plan</CardTitle>
        <CardDescription>Your active subscription details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <BillingInfoRow label="Plan" value={<Badge>Premium</Badge>} />
          <BillingInfoRow
            label="Status"
            value={<SubscriptionStatus status={status} isActive={true} />}
          />
          <BillingInfoRow label="Email" value={email} />
          <BillingInfoRow
            label="Price"
            value={<span className="font-semibold">{PREMIUM_PRICE}</span>}
            showBorder={false}
          />
        </div>

        <div className="pt-4 border-t">
          <LoadingButton
            variant="destructive"
            size="sm"
            onClick={onCancel}
            isLoading={isCanceling}
            loadingText="Canceling..."
          >
            Cancel subscription
          </LoadingButton>
        </div>
      </CardContent>
    </Card>
  );
}
