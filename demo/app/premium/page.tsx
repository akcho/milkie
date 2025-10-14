"use client";

import Link from "next/link";
import { PaywallGate } from "@/lib/milkie";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, Shield, Code } from "lucide-react";

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <PaywallGate>
          <div className="mb-8">
            <Badge className="mb-4">
              <Sparkles className="mr-1 h-3 w-3" />
              Premium Content
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              Premium Content
            </h1>
            <p className="text-lg text-muted-foreground">
              Congratulations! You have access to this premium content.
            </p>
          </div>

          <div className="space-y-6">
            <Card className="border-primary">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Protected Content</CardTitle>
                </div>
                <CardDescription>
                  This entire page is wrapped in PaywallGate
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  This content is protected by the <code className="text-xs bg-muted px-1.5 py-0.5 rounded">PaywallGate</code> component.
                  Only subscribers can see this page. When a non-subscriber visits, they&apos;ll
                  see the checkout flow instead.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How This Works</CardTitle>
                <CardDescription>
                  Full page protection pattern
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      1
                    </span>
                    <span className="pt-0.5">
                      The entire page content is wrapped in <code className="text-xs bg-muted px-1.5 py-0.5 rounded">PaywallGate</code>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      2
                    </span>
                    <span className="pt-0.5">
                      When a non-subscriber visits, they see a checkout form with their email
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      3
                    </span>
                    <span className="pt-0.5">
                      After subscribing via Stripe, webhooks update the database in real-time
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      4
                    </span>
                    <span className="pt-0.5">
                      The user is redirected back and now has immediate access to all premium content
                    </span>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  <CardTitle>Implementation</CardTitle>
                </div>
                <CardDescription>
                  Simple wrapper pattern
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="text-xs overflow-x-auto p-4 bg-muted rounded-lg border max-w-full"><code className="language-tsx">{`// app/premium/page.tsx
import { PaywallGate } from "@/lib/milkie";

export default function PremiumPage() {
  return (
    <PaywallGate>
      <div>
        <h1>Premium Content</h1>
        <p>Only subscribers can see this!</p>
      </div>
    </PaywallGate>
  );
}`}</code></pre>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>Your Premium Content Goes Here</CardTitle>
                <CardDescription>
                  What you provide to your subscribers
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  This is where you&apos;d put your actual premium content:
                </p>
                <ul>
                  <li>Exclusive tutorials and guides</li>
                  <li>Advanced features and tools</li>
                  <li>Premium templates and resources</li>
                  <li>Community access and support</li>
                  <li>Early access to new features</li>
                </ul>
                <p>
                  The value you provide here is what convinces users to subscribe!
                </p>
              </CardContent>
            </Card>
          </div>
        </PaywallGate>
      </div>
    </div>
  );
}
