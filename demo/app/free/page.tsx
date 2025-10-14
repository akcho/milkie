"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Globe, ArrowRight } from "lucide-react";

export default function FreePage() {
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
        <div className="mb-8">
          <Badge variant="outline" className="mb-4">
            <Globe className="mr-1 h-3 w-3" />
            Publicly Accessible
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            Free Content
          </h1>
          <p className="text-lg text-muted-foreground">
            This page is accessible to everyone. No subscription or authentication required!
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What is Free Content?</CardTitle>
              <CardDescription>
                Content that is accessible to all visitors
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                This is an example of free content in your app. Anyone can access this page
                without any restrictions, authentication, or subscriptions.
              </p>
              <p>
                Free content is perfect for:
              </p>
              <ul>
                <li>Landing pages and marketing content</li>
                <li>Blog posts and public documentation</li>
                <li>Demos and product showcases</li>
                <li>Public resources and community content</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>
                No PaywallGate component needed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Free pages don&apos;t require any special setup. Simply create a page component
                and it&apos;s accessible to everyone by default.
              </p>
              <div className="relative">
                <pre className="text-xs overflow-x-auto p-4 bg-muted rounded-lg border max-w-full"><code className="language-tsx">{`// app/free/page.tsx
export default function FreePage() {
  return (
    <div>
      <h1>Free Content</h1>
      <p>Everyone can see this!</p>
    </div>
  );
}`}</code></pre>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle>Want to See the Paywall in Action?</CardTitle>
              <CardDescription>
                Check out how gated content works
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Try accessing different types of gated content:
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1">
                  <Link href="/mixed">
                    Component Gating
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/dashboard">
                    Layout Gating
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
