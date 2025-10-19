"use client";

import { usePaywall, PaywallGate } from "milkie";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Mail, CreditCard } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "./components/stat-card";
import { ProtectedContentCard } from "./components/protected-content-card";
import { ImplementationTip } from "@/components/implementation-tip";
import { CodeBlock } from "@/components/code-block";
import { useIsMobile } from "@/hooks/use-is-mobile";

// Code example displayed in the implementation tip section
const IMPLEMENTATION_CODE = `// app/dashboard/page.tsx
import { PaywallGate } from "milkie";

export default function DashboardPage() {
  return (
    <PaywallGate>
      <div>
        {/* Your premium content here */}
      </div>
    </PaywallGate>
  );
}

// Only this page is protected - Settings and Billing remain accessible!`;

export default function DashboardPage() {
  const { email, status } = usePaywall();
  const isMobile = useIsMobile();

  return (
    <PaywallGate showBlurredChildren={!isMobile}>
      <div className="space-y-8 max-w-5xl mx-auto">
        <PageHeader
          title="Dashboard"
          description="Welcome back! This page is protected with page-level gating."
        />

        <div className="grid md:grid-cols-3 gap-6">
          <StatCard
            title="Status"
            value={<span className="capitalize">{status}</span>}
            icon={CheckCircle}
            subtitle={<Badge variant="secondary">Active</Badge>}
          />
          <StatCard
            title="Email"
            value={<div className="text-lg font-medium truncate">{email}</div>}
            icon={Mail}
            subtitle="Account email"
          />
          <StatCard
            title="Plan"
            value="Premium"
            icon={CreditCard}
            subtitle="$10/month"
          />
        </div>

        <ProtectedContentCard />

        <ImplementationTip title="Implementation">
          <CodeBlock code={IMPLEMENTATION_CODE} />
        </ImplementationTip>
      </div>
    </PaywallGate>
  );
}
