import { SignInButton } from "./signin-button";
import { SignOutButton } from "./signout-button";

interface AuthButtonProps {
  status: "loading" | "authenticated" | "unauthenticated";
  callbackUrl: string;
}

export function AuthButton({ status, callbackUrl }: AuthButtonProps) {
  if (status === "loading") {
    return <div className="text-muted-foreground text-sm">Loading...</div>;
  }

  if (status === "authenticated") {
    return <SignOutButton callbackUrl={callbackUrl} />;
  }

  return <SignInButton callbackUrl={callbackUrl} />;
}
