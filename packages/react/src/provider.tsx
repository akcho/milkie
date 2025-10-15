"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface PaywallContextType {
  hasAccess: boolean;
  status: string | null;
  loading: boolean;
  email: string | null;
  checkSubscription: () => Promise<void>;
}

const PaywallContext = createContext<PaywallContextType | undefined>(undefined);

interface MilkieProviderProps {
  children: React.ReactNode;
  email?: string | null; // Optional: pass authenticated email from your auth solution
}

export function MilkieProvider({ children, email }: MilkieProviderProps) {
  const [hasAccess, setHasAccess] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSubscription = useCallback(async () => {
    if (!email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/api/subscription/status?email=${encodeURIComponent(email)}`
      );
      const data = await response.json();

      setHasAccess(data.hasAccess);
      setStatus(data.status);
    } catch (error) {
      console.error("Failed to check subscription:", error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  }, [email]);

  // Check subscription when email changes
  useEffect(() => {
    if (email) {
      checkSubscription();
    } else {
      setLoading(false);
    }
  }, [email, checkSubscription]);

  return (
    <PaywallContext.Provider
      value={{
        hasAccess,
        status,
        loading,
        email: email || null,
        checkSubscription,
      }}
    >
      {children}
    </PaywallContext.Provider>
  );
}

export function usePaywall() {
  const context = useContext(PaywallContext);
  if (!context) {
    throw new Error("usePaywall must be used within MilkieProvider");
  }
  return context;
}
