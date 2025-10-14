"use client";

import { usePaywall } from "@/lib/milkie";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, CheckCircle } from "lucide-react";

export default function BillingPage() {
  const { status, email } = usePaywall();

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            Your active subscription details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-sm font-medium">Plan</span>
              <Badge>Premium</Badge>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-sm font-medium">Status</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium capitalize text-green-600">{status}</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-sm font-medium">Email</span>
              <span className="text-sm">{email}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm font-medium">Price</span>
              <span className="text-sm font-semibold">$10/month</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button variant="destructive" size="sm">
              Cancel Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Production Tip</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            In production, you&apos;d use Stripe&apos;s Customer Portal for managing
            subscriptions, updating payment methods, and viewing invoices.
          </p>
          <p className="text-sm text-muted-foreground">
            Milkie can generate secure Customer Portal links for you automatically, providing
            a complete self-service billing experience.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
