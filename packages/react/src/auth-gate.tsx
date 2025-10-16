"use client";

import { usePaywall } from "./provider";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Loader2, Lock } from "lucide-react";

interface AuthGateProps {
  children: React.ReactNode;
  signInUrl?: string;
  onSignIn?: () => void;
  title?: string;
  subtitle?: string;
  signInButtonText?: string;
}

export function AuthGate({
  children,
  signInUrl = "/signin",
  onSignIn,
  title = "Sign in required",
  subtitle = "Please sign in to access this content.",
  signInButtonText = "Sign in",
}: AuthGateProps) {
  const { loading, email } = usePaywall();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (email) {
    return <>{children}</>;
  }

  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn();
    } else {
      // Preserve current URL to redirect back after sign-in
      const callbackUrl = encodeURIComponent(
        window.location.pathname + window.location.search
      );
      window.location.href = `${signInUrl}?callbackUrl=${callbackUrl}`;
    }
  };

  return (
    <div className="relative min-h-[400px]">
      {/* Blurred content in background */}
      <div
        className="blur-sm pointer-events-none select-none pt-4"
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Auth overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-8 bg-background/80 backdrop-blur-sm">
        <Card className="max-w-md w-full shadow-none">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Lock className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl">{title}</CardTitle>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
          </CardHeader>

          <CardContent>
            <Button
              onClick={handleSignIn}
              className="w-full"
              size="lg"
            >
              {signInButtonText}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
