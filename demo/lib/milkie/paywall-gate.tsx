"use client";

import { usePaywall } from "./provider";
import { useState } from "react";

interface PaywallGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PaywallGate({ children, fallback }: PaywallGateProps) {
  const { hasAccess, loading, setEmail } = usePaywall();
  const [inputEmail, setInputEmail] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const handleCheckout = async () => {
    if (!inputEmail) return;

    try {
      setIsCheckingOut(true);
      setEmail(inputEmail);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: inputEmail }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Upgrade to Continue
          </h2>
          <p className="mt-2 text-gray-600">
            Subscribe to access this premium content
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isCheckingOut}
            />
          </div>

          <button
            onClick={handleCheckout}
            disabled={!inputEmail || isCheckingOut}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isCheckingOut ? "Loading..." : "Subscribe Now"}
          </button>

          <p className="text-xs text-center text-gray-500">
            You&apos;ll be redirected to Stripe to complete your payment
          </p>
        </div>
      </div>
    </div>
  );
}
