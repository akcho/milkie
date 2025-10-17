"use client";

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

export function SignOutButton({ callbackUrl }: SignOutButtonProps) {
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
          <p>Sign out</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
