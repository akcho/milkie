"use client";

import { usePaywall } from "@/lib/milkie";

export default function BillingPage() {
  const { status, email } = usePaywall();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-600 mt-2">Manage your subscription</p>
      </div>

      <div className="bg-white p-8 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Current Plan</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-gray-600">Plan</span>
            <span className="font-medium">Premium</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-gray-600">Status</span>
            <span className="font-medium text-green-600">{status}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-gray-600">Email</span>
            <span className="font-medium">{email}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-gray-600">Price</span>
            <span className="font-medium">$10/month</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <button className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50">
            Cancel Subscription
          </button>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="font-bold mb-2">🚀 Pro Tip</h3>
        <p className="text-sm text-gray-700">
          In production, you&apos;d use Stripe&apos;s Customer Portal for
          managing subscriptions. Milkie can generate those links for you
          automatically.
        </p>
      </div>
    </div>
  );
}
