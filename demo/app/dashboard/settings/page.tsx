"use client";

import { AuthGate } from "@milkie/react";
import { ImplementationTip } from "@/components/implementation-tip";
import { PageHeader } from "@/components/page-header";
import { AccountSettingsCard } from "./components/account-settings-card";
import { useSettings } from "@/hooks/use-settings";
import { useIsMobile } from "@/hooks/use-is-mobile";

export default function SettingsPage() {
  const { isSaving, isSigningOut, handleSave, handleSignOut } = useSettings();
  const isMobile = useIsMobile();

  return (
    <AuthGate showBlurredChildren={!isMobile}>
      <div className="space-y-8 max-w-3xl mx-auto">
        <PageHeader
          title="Settings"
          description="Manage your account preferences and settings."
        />

        <AccountSettingsCard
          onSave={handleSave}
          onSignOut={handleSignOut}
          isSaving={isSaving}
          isSigningOut={isSigningOut}
        />

        <ImplementationTip title="Developer Tip">
          <p>
            This page uses <code>AuthGate</code> to require authentication but
            not subscription. All signed-in users can access their settings,
            regardless of subscription status.
          </p>
          <p>
            The main dashboard uses <code>PaywallGate</code> for
            subscription-gated content, while settings and billing use{" "}
            <code>AuthGate</code> for auth-only protection.
          </p>
        </ImplementationTip>
      </div>
    </AuthGate>
  );
}
