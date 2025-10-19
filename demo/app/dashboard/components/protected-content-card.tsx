import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield } from "lucide-react";

export function ProtectedContentCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Protected Content</CardTitle>
        </div>
        <CardDescription>Page-level protection in action</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">
          This page is protected with{" "}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
            PaywallGate
          </code>{" "}
          while other pages like Settings and Billing remain accessible to all
          logged-in users.
        </p>
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium">Benefits of Page-Level Gating:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Granular control over which pages require subscription</li>
            <li>• Settings and billing pages stay accessible</li>
            <li>• Users can manage their subscription even when inactive</li>
            <li>• Perfect for SaaS with free account features</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
