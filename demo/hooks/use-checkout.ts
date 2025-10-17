import { useState } from "react";
import { toast } from "sonner";

export function useCheckout() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const startCheckout = async (email: string, callbackUrl?: string) => {
    try {
      setIsCheckingOut(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          callbackUrl: callbackUrl || window.location.pathname + window.location.search,
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

  return { startCheckout, isCheckingOut };
}
