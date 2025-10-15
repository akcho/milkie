"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { MilkieIcon } from "./milkie-icon";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left side - Logo (always links to home) */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-semibold hover:opacity-80 transition-opacity">
          <MilkieIcon className="w-8 h-8" />
          milkie
        </Link>

        {/* Right side - Session status */}
        {status === "loading" ? (
          <div className="text-muted-foreground text-sm">Loading...</div>
        ) : session ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {session.user?.email}
            </span>
          </div>
        ) : (
          <Button asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
