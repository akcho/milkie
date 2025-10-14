"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lock, CreditCard, CheckCircle, Layers, Layout, Component } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Milkie</h2>
          {status === "loading" ? (
            <div className="text-muted-foreground text-sm">Loading...</div>
          ) : session ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {session.user?.email}
              </span>
            </div>
          ) : (
            <Button asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <Badge variant="secondary" className="mb-4">
            Drop-in Paywall Infrastructure
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight">
            Milkie Demo
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, flexible paywall infrastructure with NextAuth and Stripe.
            {!session && " Sign in to try the premium content!"}
          </p>
        </div>

        {/* Demo Examples Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center mb-2">
                <Layout className="h-5 w-5" />
              </div>
              <CardTitle>Free Content</CardTitle>
              <CardDescription>
                No restrictions or authentication required
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/free">
                  View Example <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Component className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Component Gating</CardTitle>
              <CardDescription>
                Mix free and premium content on the same page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/mixed">
                  View Example <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Layout Gating</CardTitle>
              <CardDescription>
                Protect entire sections at the layout level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/dashboard">
                  View Example <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Wrap Components</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Use <code className="text-xs bg-muted px-1 py-0.5 rounded">PaywallGate</code> to protect pages, sections, or individual components
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Stripe Checkout</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Users are securely redirected to Stripe&apos;s hosted checkout page
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Instant Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Webhooks update subscription status in real-time for immediate access
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Use Cases Section */}
        <Card>
          <CardHeader>
            <CardTitle>Flexible Gating Patterns</CardTitle>
            <CardDescription>
              Choose the right pattern for your use case
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 border rounded-lg">
                <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center shrink-0">
                  <Component className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Component-Level Gating</h3>
                  <p className="text-sm text-muted-foreground">
                    Perfect for content sites, blogs, or freemium apps. Show previews and teasers, then gate the full content.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 border rounded-lg">
                <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center shrink-0">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Layout-Level Gating</h3>
                  <p className="text-sm text-muted-foreground">
                    Ideal for SaaS applications. Wrap your dashboard layout once to protect all routes and features.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
