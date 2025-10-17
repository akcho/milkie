import { CheckCircle, CreditCard } from "lucide-react";
import { LoadingButton } from "./loading-button";

const PREMIUM_FEATURES = [
  "Access to premium dashboard features",
  "Advanced analytics and insights",
  "Priority support",
  "Cancel anytime",
];

const PREMIUM_PRICE = "$10/month";

interface PremiumPlanCardProps {
  onSubscribe: () => void;
  isLoading: boolean;
}

export function PremiumPlanCard({ onSubscribe, isLoading }: PremiumPlanCardProps) {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Premium Plan</h3>
          <p className="text-sm text-muted-foreground">{PREMIUM_PRICE}</p>
        </div>
      </div>
      <ul className="space-y-2 text-sm">
        {PREMIUM_FEATURES.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <LoadingButton
        onClick={onSubscribe}
        isLoading={isLoading}
        className="w-full"
        size="lg"
      >
        Subscribe now
      </LoadingButton>
    </div>
  );
}

export { PREMIUM_PRICE };
