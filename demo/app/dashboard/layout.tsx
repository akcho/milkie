"use client";

import { PaywallGate } from "@/lib/milkie";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PaywallGate>
      <div className="min-h-screen bg-gray-50">
        {/* This nav would be visible to all subscribers */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">My App Dashboard</h1>
              <div className="flex gap-4">
                <a href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </a>
                <a href="/dashboard/settings" className="text-gray-600 hover:text-gray-900">
                  Settings
                </a>
                <a href="/dashboard/billing" className="text-gray-600 hover:text-gray-900">
                  Billing
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* All children routes are automatically protected */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </PaywallGate>
  );
}
