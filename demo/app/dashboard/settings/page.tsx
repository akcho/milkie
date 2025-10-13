export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-700 mt-2">
          This page is automatically protected too!
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Account Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Display Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Notifications
            </label>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="email-notif" />
              <label htmlFor="email-notif" className="text-sm text-gray-700">
                Email notifications
              </label>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold mb-2 text-gray-900">💡 Developer Tip</h3>
        <p className="text-sm text-gray-800">
          Notice how you didn&apos;t need to add{" "}
          <code className="bg-white px-2 py-1 rounded text-gray-900">PaywallGate</code> to
          this page? It&apos;s inherited from the layout. Every page under{" "}
          <code className="bg-white px-2 py-1 rounded text-gray-900">/dashboard/*</code> is
          automatically protected.
        </p>
      </div>
    </div>
  );
}
