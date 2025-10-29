import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SessionProviders } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Milkie - Easy paywalls for Next.js",
  description:
    "Beautiful, customizable paywall components for Next.js applications. Add paywalls to your app in minutes.",
  openGraph: {
    title: "Milkie - Easy paywalls for Next.js",
    description:
      "Beautiful, customizable paywall components for Next.js applications. Add paywalls to your app in minutes.",
    url: "https://milkie.dev",
    siteName: "Milkie",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Milkie - Easy paywalls for Next.js",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Milkie - Easy paywalls for Next.js",
    description:
      "Beautiful, customizable paywall components for Next.js applications. Add paywalls to your app in minutes.",
    images: ["/og-image.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SessionProviders session={session}>{children}</SessionProviders>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
