import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MilkieProvider } from "@/lib/milkie";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Milkie Demo",
  description: "Demo app showing Milkie paywall integration with NextAuth",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <MilkieProvider email={session?.user?.email}>
            {children}
          </MilkieProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
