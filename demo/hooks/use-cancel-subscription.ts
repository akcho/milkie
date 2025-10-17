import { useState } from "react";
import { toast } from "sonner";

export function useCancelSubscription() {
  const [isCanceling, setIsCanceling] = useState(false);

  const cancelSubscription = async (email: string, onSuccess?: () => void) => {
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

      toast.success("Subscription canceled successfully!");

      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.error("Cancel failed:", error);
      toast.error("Failed to cancel subscription. Please try again.");
    } finally {
      setIsCanceling(false);
    }
  };

  return { cancelSubscription, isCanceling };
}
