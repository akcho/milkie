"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lock, CreditCard, CheckCircle, Layers, Component, Newspaper, Github } from "lucide-react";
import { Header } from "@/components/header";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background">
      <Header />

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
          <Card className="hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader className="flex-grow">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Newspaper className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Metered Paywall</CardTitle>
              <CardDescription>
                Give users a taste with limited free access per month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/metered">
                  View Example <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader className="flex-grow">
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

          <Card className="hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader className="flex-grow">
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

        {/* CTA Section */}
        <Card className="text-center">
          <CardContent className="pt-12 pb-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Add Paywalls to Your App?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Milkie is open source and MIT licensed. Get started in minutes with our documentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg">
                <Link href="https://github.com/akcho/milkie#readme" target="_blank" rel="noopener noreferrer">
                  Get Started
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="https://github.com/akcho/milkie" target="_blank" rel="noopener noreferrer">
                  Star GitHub <Github className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
