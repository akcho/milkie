"use client";

import { usePaywall } from "../provider";
import { LoadingState } from "../components/loading-state";
import { AuthOverlay } from "./components/auth-overlay";
import { BlurredContent } from "../components/blurred-content";
import { handleSignInRedirect } from "../utils";

interface AuthGateProps {
  children: React.ReactNode;
  customUi?: React.ReactNode;
  signInUrl?: string;
  onSignIn?: () => void;
  title?: string;
  subtitle?: string;
  signInButtonText?: string;
}

export function AuthGate({
  children,
  customUi,
  signInUrl = "/signin",
  onSignIn,
  title = "Sign in required",
  subtitle = "Please sign in to access this content.",
  signInButtonText = "Sign in",
}: AuthGateProps) {
  const { loading, email } = usePaywall();

  if (loading) {
    return <LoadingState />;
  }

  if (email) {
    return <>{children}</>;
  }

  if (customUi) {
    return <>{customUi}</>;
  }

  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn();
    } else {
      handleSignInRedirect(signInUrl);
    }
  };

  return (
    <div className="relative w-full">
      <BlurredContent>{children}</BlurredContent>
      <AuthOverlay
        title={title}
        subtitle={subtitle}
        signInButtonText={signInButtonText}
        onSignIn={handleSignIn}
      />
    </div>
  );
}
