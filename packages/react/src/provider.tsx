"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

/**
 * The shape of the Paywall context that's provided to all child components.
 *
 * @property {boolean} hasAccess - Whether the current user has an active subscription
 * @property {string | null} status - The subscription status (e.g., "active", "canceled", "past_due")
 * @property {boolean} loading - Whether the provider is currently checking subscription status
 * @property {string | null} email - The authenticated user's email address
 * @property {string | null} error - Error message if subscription check failed
 * @property {() => Promise<void>} checkSubscription - Function to manually re-check subscription status
 * @property {() => void} clearError - Function to clear the current error state
 */
export interface PaywallContextType {
  hasAccess: boolean;
  status: string | null;
  loading: boolean;
  email: string | null;
  error: string | null;
  checkSubscription: () => Promise<void>;
  clearError: () => void;
}

const PaywallContext = createContext<PaywallContextType | undefined>(undefined);

/**
 * Props for the MilkieProvider component.
 *
 * @property {React.ReactNode} children - Child components that will have access to the paywall context
 * @property {string | null} [email] - The authenticated user's email address from your auth solution
 * @property {string} [apiEndpoint="/api/subscription/status"] - Custom API endpoint for checking subscription status
 */
interface MilkieProviderProps {
  children: React.ReactNode;
  email?: string | null;
  apiEndpoint?: string;
}

/**
 * MilkieProvider - Context provider that manages subscription state for the paywall system.
 *
 * This provider wraps your application (or specific pages) and provides subscription status
 * to all child components via the `usePaywall` hook. It automatically checks subscription
 * status when the user's email changes and provides methods to manually refresh or clear errors.
 *
 * Features:
 * - Automatic subscription status checking when email changes
 * - Manual refresh capability via `checkSubscription()`
 * - Error state management with `clearError()`
 * - Configurable API endpoint
 * - Loading states during subscription checks
 *
 * @param {MilkieProviderProps} props - Configuration options for the provider
 * @returns {JSX.Element} The provider component that wraps your application
 *
 * @example
 * // Basic usage - wrap your entire app
 * import { MilkieProvider } from '@milkie/react';
 *
 * export default function RootLayout({ children }) {
 *   const session = useSession(); // Your auth solution
 *
 *   return (
 *     <MilkieProvider email={session?.user?.email}>
 *       {children}
 *     </MilkieProvider>
 *   );
 * }
 *
 * @example
 * // With custom API endpoint
 * <MilkieProvider
 *   email={user?.email}
 *   apiEndpoint="/api/custom/subscription"
 * >
 *   {children}
 * </MilkieProvider>
 *
 * @example
 * // Wrap only specific routes that need paywall functionality
 * export default function PremiumLayout({ children }) {
 *   const { user } = useAuth();
 *
 *   return (
 *     <MilkieProvider email={user?.email}>
 *       {children}
 *     </MilkieProvider>
 *   );
 * }
 */
export function MilkieProvider({
  children,
  email,
  apiEndpoint = "/api/subscription/status",
}: MilkieProviderProps) {
  const [hasAccess, setHasAccess] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const checkSubscription = useCallback(async () => {
    if (!email) {
      setHasAccess(false);
      setStatus(null);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${apiEndpoint}?email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setHasAccess(data.hasAccess);
      setStatus(data.status);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to check subscription";
      console.error("Failed to check subscription:", err);
      setError(errorMessage);
      setHasAccess(false);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, [email, apiEndpoint]);

  // Check subscription when email changes
  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  return (
    <PaywallContext.Provider
      value={{
        hasAccess,
        status,
        loading,
        email: email || null,
        error,
        checkSubscription,
        clearError,
      }}
    >
      {children}
    </PaywallContext.Provider>
  );
}

/**
 * usePaywall - Hook to access paywall subscription state and controls.
 *
 * This hook provides access to the current user's subscription status and methods
 * to interact with the paywall system. Must be used within a MilkieProvider.
 *
 * @returns {PaywallContextType} The paywall context containing subscription state and controls
 * @throws {Error} If used outside of a MilkieProvider
 *
 * @example
 * // Check subscription status
 * function PremiumFeature() {
 *   const { hasAccess, loading, error } = usePaywall();
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *   if (!hasAccess) return <UpgradePrompt />;
 *
 *   return <PremiumContent />;
 * }
 *
 * @example
 * // Manual subscription refresh
 * function AccountPage() {
 *   const { status, checkSubscription } = usePaywall();
 *
 *   return (
 *     <div>
 *       <p>Subscription: {status || 'None'}</p>
 *       <button onClick={checkSubscription}>Refresh</button>
 *     </div>
 *   );
 * }
 */
export function usePaywall() {
  const context = useContext(PaywallContext);
  if (!context) {
    throw new Error("usePaywall must be used within MilkieProvider");
  }
  return context;
}
