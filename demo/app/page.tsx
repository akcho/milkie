"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-bold text-gray-900">
            Milkie Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A simple demonstration of drop-in paywall infrastructure.
            Try accessing the premium content below!
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-8">
            <Link
              href="/free"
              className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Free Content
            </Link>
            <Link
              href="/premium"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Single Premium Page
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Full App (Paywalled)
            </Link>
          </div>

          <div className="pt-16 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Two Patterns Demo
            </h2>
            <div className="grid md:grid-cols-2 gap-6 pt-8">
              <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="text-3xl mb-4">📄</div>
                <h3 className="font-bold text-lg mb-2">Single Page Paywall</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Protect individual pages or features. Good for content sites
                  or freemium apps.
                </p>
                <Link
                  href="/premium"
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  See example →
                </Link>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg border-2 border-purple-200">
                <div className="text-3xl mb-4">🏢</div>
                <h3 className="font-bold text-lg mb-2">Full App Paywall</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Protect your entire app at the layout level. One wrap, all
                  routes protected.
                </p>
                <Link
                  href="/dashboard"
                  className="text-purple-600 hover:underline text-sm font-medium"
                >
                  See example →
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-16 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              How it works
            </h2>
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-3xl mb-4">🔒</div>
                <h3 className="font-bold text-lg mb-2">Wrap with PaywallGate</h3>
                <p className="text-gray-600 text-sm">
                  Wrap any component with PaywallGate to restrict access
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-3xl mb-4">💳</div>
                <h3 className="font-bold text-lg mb-2">Stripe Checkout</h3>
                <p className="text-gray-600 text-sm">
                  Users are redirected to Stripe&apos;s secure checkout
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-3xl mb-4">✅</div>
                <h3 className="font-bold text-lg mb-2">Instant Access</h3>
                <p className="text-gray-600 text-sm">
                  Webhooks update subscription status in real-time
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
