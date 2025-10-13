"use client";

import { usePaywall } from "@/lib/milkie";

export default function DashboardPage() {
  const { email, status } = usePaywall();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-700 mt-2">
          Welcome back! This entire section is protected.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1 font-medium">Account Status</div>
          <div className="text-2xl font-bold text-green-600">{status}</div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1 font-medium">Email</div>
          <div className="text-lg font-medium text-gray-900">{email}</div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1 font-medium">Subscription</div>
          <div className="text-lg font-medium text-gray-900">Premium</div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Your Protected Content</h2>
        <p className="text-gray-700 mb-4">
          This is where your actual app would live. All of these routes are
          automatically protected because they&apos;re wrapped in the{" "}
          <code className="bg-gray-100 px-2 py-1 rounded text-gray-900">PaywallGate</code> at
          the layout level.
        </p>
        <p className="text-gray-700">
          Only users with active subscriptions can see this. No per-page checks
          needed!
        </p>
      </div>
    </div>
  );
}
