"use client";

import { PaywallGate } from "@milkie/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, Settings, CreditCard, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
    { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation header */}
      <header className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4 gap-4">
            <div className="flex items-center gap-3 md:gap-6 min-w-0">
              <Button variant="ghost" size="sm" asChild className="shrink-0">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Home</span>
                </Link>
              </Button>
              <div className="hidden md:block h-6 w-px bg-border shrink-0" />
              <h1 className="text-base md:text-lg font-semibold truncate">Dashboard</h1>
            </div>
            <nav className="flex gap-1 shrink-0 items-center">
              <ThemeToggle />
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Button
                    key={item.href}
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    asChild
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2",
                        isActive && "font-medium"
                      )}
                      title={item.label}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden lg:inline">{item.label}</span>
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Child routes can choose their own protection level */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
