"use client";

import { SessionProvider } from "next-auth/react";
import { MilkieProvider } from "@milkie/react";
import { Session } from "next-auth";

interface SessionProvidersProps {
  children: React.ReactNode;
  session: Session | null;
}

export function SessionProviders({ children, session }: SessionProvidersProps) {
  return (
    <SessionProvider session={session}>
      <MilkieProvider email={session?.user?.email}>
        {children}
      </MilkieProvider>
    </SessionProvider>
  );
}
