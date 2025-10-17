"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePaywall } from "@milkie/react";

export default function SuccessPage() {
  const { checkSubscription } = usePaywall();

  useEffect(() => {
    // Re-check subscription status after successful checkout
    checkSubscription();
  }, [checkSubscription]);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Premium!
          </h1>
          <p className="text-gray-600 mb-8">
            Your subscription is now active. You have full access to all premium content.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/premium"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View Premium Content
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
