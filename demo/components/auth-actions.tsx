"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LogOut } from "lucide-react";

interface SignOutButtonProps {
  callbackUrl: string;
}

function SignOutButton({ callbackUrl }: SignOutButtonProps) {
  const handleSignOut = () => signOut({ callbackUrl });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleSignOut} size="sm" variant="ghost">
            <LogOut className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sign Out</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface SignInButtonProps {
  callbackUrl: string;
}

function SignInButton({ callbackUrl }: SignInButtonProps) {
  return (
    <Button asChild size="xs">
      <Link href={`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
        Sign in
      </Link>
    </Button>
  );
}

interface AuthActionsProps {
  status: "loading" | "authenticated" | "unauthenticated";
  callbackUrl: string;
}

export function AuthActions({ status, callbackUrl }: AuthActionsProps) {
  if (status === "loading") {
    return <div className="text-muted-foreground text-sm">Loading...</div>;
  }

  if (status === "authenticated") {
    return <SignOutButton callbackUrl={callbackUrl} />;
  }

  return <SignInButton callbackUrl={callbackUrl} />;
}
