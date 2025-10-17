"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "./logo";
import { GitHubLink } from "./github-link";
import { AuthButton } from "./auth-button";

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Logo />

        <nav className="flex items-center gap-3">
          <ThemeToggle />
          <GitHubLink />
          <AuthButton
            status={session ? "authenticated" : status}
            callbackUrl={pathname}
          />
        </nav>
      </div>
    </header>
  );
}
