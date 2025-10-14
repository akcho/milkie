"use client";

import { usePaywall } from "@/lib/milkie";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Mail, CreditCard, Shield } from "lucide-react";

export default function DashboardPage() {
  const { email, status } = usePaywall();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! This entire section is protected by layout-level gating.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{status}</div>
            <Badge variant="secondary" className="mt-2">
              Active
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium truncate">{email}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Account email
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Premium</div>
            <p className="text-xs text-muted-foreground mt-2">
              $10/month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Protected Application</CardTitle>
          </div>
          <CardDescription>
            Layout-level protection in action
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            This is where your actual application would live. All routes under{" "}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/dashboard/*</code>{" "}
            are automatically protected because the{" "}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">PaywallGate</code>{" "}
            is wrapped at the layout level.
          </p>
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">Benefits of Layout-Level Gating:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Protect all child routes with one wrapper</li>
              <li>• No need to add PaywallGate to every page</li>
              <li>• Perfect for SaaS applications</li>
              <li>• Shared navigation stays protected</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Implementation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="text-xs overflow-x-auto p-4 bg-muted rounded-lg border max-w-full"><code className="language-tsx">{`// app/dashboard/layout.tsx
import { PaywallGate } from "@/lib/milkie";

export default function DashboardLayout({ children }) {
  return (
    <PaywallGate>
      <nav>Dashboard Navigation</nav>
      <main>{children}</main>
    </PaywallGate>
  );
}

// All pages under /dashboard/* are now protected!`}</code></pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
