import Link from "next/link";

export default function FreePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-8 inline-block"
        >
          ← Back to home
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Free Content
          </h1>
          <p className="text-gray-600 mb-6">
            This page is accessible to everyone. No subscription required!
          </p>

          <div className="prose max-w-none">
            <p>
              This is an example of free content in your app. Anyone can access
              this page without any restrictions.
            </p>
            <p>
              Want to see how the paywall works?{" "}
              <Link href="/premium" className="text-blue-600 hover:underline">
                Try accessing premium content
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
