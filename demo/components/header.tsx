"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { MilkieIcon } from "@milkie/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Github } from "lucide-react";

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left side - Logo (always links to home) */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-semibold hover:opacity-80 transition-opacity">
          <MilkieIcon className="w-8 h-8" />
          milkie
        </Link>

        {/* Right side - Session status and dark mode toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Button asChild size="sm" variant="ghost">
            <Link href="https://github.com/akcho/milkie" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
            </Link>
          </Button>

          {status === "loading" ? (
            <div className="text-muted-foreground text-sm">Loading...</div>
          ) : session ? (
            <Button onClick={() => signOut({ callbackUrl: pathname })} size="sm" variant="outline">
              Sign Out
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link href={`/signin?callbackUrl=${encodeURIComponent(pathname)}`}>Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
