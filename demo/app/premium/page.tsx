"use client";

import Link from "next/link";
import { PaywallGate } from "@/lib/milkie";

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-8 inline-block"
        >
          ← Back to home
        </Link>

        <PaywallGate>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✨</span>
              <h1 className="text-4xl font-bold text-gray-900">
                Premium Content
              </h1>
            </div>
            <p className="text-gray-700 mb-6">
              Congratulations! You have access to this premium content.
            </p>

            <div className="prose max-w-none space-y-4">
              <p className="text-gray-800">
                This content is protected by the <code className="bg-gray-100 px-2 py-1 rounded text-gray-900">PaywallGate</code> component.
                Only subscribers can see this page.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-lg mb-2 text-gray-900">How this works:</h3>
                <ol className="space-y-2 text-sm text-gray-800">
                  <li>1. The entire page content is wrapped in <code className="bg-white px-2 py-1 rounded text-gray-900">PaywallGate</code></li>
                  <li>2. When a non-subscriber visits, they see a checkout form</li>
                  <li>3. After subscribing via Stripe, webhooks update the database</li>
                  <li>4. The user now has access to all premium content</li>
                </ol>
              </div>

              <p className="text-gray-800">
                This is where you&apos;d put your actual premium content - exclusive
                tutorials, tools, features, or whatever value you&apos;re providing
                to subscribers.
              </p>
            </div>
          </div>
        </PaywallGate>
      </div>
    </div>
  );
}
