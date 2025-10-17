import { AlertCircle } from "lucide-react";

interface CheckoutErrorProps {
  error: string;
}

export function CheckoutError({ error }: CheckoutErrorProps) {
  return (
    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
      <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
      <div className="text-sm text-destructive">
        <p className="font-medium">Checkout failed</p>
        <p className="text-xs mt-1 opacity-90">
          {error.includes("status")
            ? "Unable to connect to checkout service. Please try again."
            : error}
        </p>
      </div>
    </div>
  );
}
