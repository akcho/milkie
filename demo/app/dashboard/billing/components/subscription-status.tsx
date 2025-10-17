import { CheckCircle, XCircle } from "lucide-react";

interface SubscriptionStatusProps {
  status: string | null;
  isActive: boolean;
}

export function SubscriptionStatus({ status, isActive }: SubscriptionStatusProps) {
  if (isActive) {
    return (
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <span className="font-medium capitalize text-green-600">{status}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <XCircle className="h-4 w-4 text-muted-foreground" />
      <span className="font-medium text-muted-foreground">
        {status || "No subscription"}
      </span>
    </div>
  );
}
