"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface PaywallContextType {
  hasAccess: boolean;
  status: string | null;
  loading: boolean;
  email: string | null;
  setEmail: (email: string) => void;
  checkSubscription: () => Promise<void>;
}

const PaywallContext = createContext<PaywallContextType | undefined>(undefined);

export function MilkieProvider({ children }: { children: React.ReactNode }) {
  const [hasAccess, setHasAccess] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

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

  useEffect(() => {
    // Load email from localStorage on mount
    const savedEmail = localStorage.getItem("milkie_user_email");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (email) {
      localStorage.setItem("milkie_user_email", email);
      checkSubscription();
    }
  }, [email, checkSubscription]);

  return (
    <PaywallContext.Provider
      value={{
        hasAccess,
        status,
        loading,
        email,
        setEmail,
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
