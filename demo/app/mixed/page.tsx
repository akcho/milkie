"use client";

import Link from "next/link";
import { PaywallGate } from "@/lib/milkie";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lock, Sparkles } from "lucide-react";

export default function MixedContentPage() {
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
          <Badge variant="secondary" className="mb-4">
            Component-Level Gating
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            Mixed Content Example
          </h1>
          <p className="text-lg text-muted-foreground">
            This page demonstrates how you can mix free and premium content on the same page.
            Free content is visible to everyone, while premium sections are gated.
          </p>
        </div>

        <div className="space-y-6">
          {/* Free Content Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Free Preview Content</CardTitle>
                <Badge variant="outline">Free</Badge>
              </div>
              <CardDescription>
                Everyone can see this section
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                This is a free preview section that everyone can access. You might use this to:
              </p>
              <ul>
                <li>Show a teaser of your content</li>
                <li>Explain the value proposition</li>
                <li>Display the first few paragraphs of an article</li>
                <li>Show thumbnails or previews of premium features</li>
              </ul>
              <p>
                Below, you&apos;ll see premium content sections that are only visible to subscribers.
              </p>
            </CardContent>
          </Card>

          {/* Premium Content Section 1 */}
          <PaywallGate
            fallback={
              <Card className="border-primary/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" />
                      Premium Tutorial
                    </CardTitle>
                    <Badge>Premium</Badge>
                  </div>
                  <CardDescription>
                    Unlock this section with a subscription
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-6 text-center space-y-4">
                    <p className="text-muted-foreground">
                      This premium content includes:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
                      <li>• Step-by-step implementation guide</li>
                      <li>• Code examples and best practices</li>
                      <li>• Common pitfalls and how to avoid them</li>
                      <li>• Performance optimization tips</li>
                    </ul>
                    <p className="text-sm text-muted-foreground pt-2">
                      Subscribe to unlock this content and more.
                    </p>
                  </div>
                </CardContent>
              </Card>
            }
          >
            <Card className="border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Premium Tutorial
                  </CardTitle>
                  <Badge>Premium</Badge>
                </div>
                <CardDescription>
                  Advanced implementation guide
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <h3>Step-by-Step Implementation</h3>
                <p>
                  Congratulations! You have access to this premium content. Here&apos;s the detailed
                  tutorial you unlocked:
                </p>
                <ol>
                  <li>
                    <strong>Setup:</strong> First, import the necessary components and configure
                    your environment variables.
                  </li>
                  <li>
                    <strong>Implementation:</strong> Wrap the components you want to protect with
                    the PaywallGate component.
                  </li>
                  <li>
                    <strong>Customization:</strong> Use the fallback prop to create custom teaser
                    content for non-subscribers.
                  </li>
                  <li>
                    <strong>Testing:</strong> Test both the free and premium experiences to ensure
                    smooth transitions.
                  </li>
                </ol>
                <p>
                  This approach gives you maximum flexibility - you can gate specific sections while
                  keeping other content freely accessible.
                </p>
              </CardContent>
            </Card>
          </PaywallGate>

          {/* Another Free Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>More Free Content</CardTitle>
                <Badge variant="outline">Free</Badge>
              </div>
              <CardDescription>
                Additional free information for everyone
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Notice how you can intersperse free and premium content throughout the same page.
                This is perfect for:
              </p>
              <ul>
                <li>Blog posts with premium sections</li>
                <li>Tutorial series with advanced topics locked</li>
                <li>Feature showcases with some features gated</li>
                <li>Documentation with pro tips for subscribers</li>
              </ul>
            </CardContent>
          </Card>

          {/* Premium Content Section 2 */}
          <PaywallGate
            fallback={
              <Card className="border-primary/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" />
                      Advanced Features
                    </CardTitle>
                    <Badge>Premium</Badge>
                  </div>
                  <CardDescription>
                    Unlock advanced techniques and examples
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-6 text-center">
                    <p className="text-muted-foreground">
                      Subscribe to access advanced code examples, performance tips, and production
                      deployment strategies.
                    </p>
                  </div>
                </CardContent>
              </Card>
            }
          >
            <Card className="border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Advanced Features
                  </CardTitle>
                  <Badge>Premium</Badge>
                </div>
                <CardDescription>
                  Production-ready examples
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <h3>Advanced Techniques</h3>
                <p>
                  You&apos;ve unlocked the advanced section! Here are some pro tips:
                </p>
                <ul>
                  <li>
                    <strong>Performance:</strong> Use React.memo on PaywallGate children to prevent
                    unnecessary re-renders
                  </li>
                  <li>
                    <strong>SEO:</strong> Place free content at the top for better search engine
                    visibility
                  </li>
                  <li>
                    <strong>Analytics:</strong> Track which gated sections users interact with to
                    optimize conversion
                  </li>
                  <li>
                    <strong>UX:</strong> Make fallback content compelling to encourage subscriptions
                  </li>
                </ul>
              </CardContent>
            </Card>
          </PaywallGate>

          {/* Code Example */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">How This Page Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="text-xs overflow-x-auto p-4 bg-background rounded-lg border max-w-full"><code className="language-tsx">{`// Mix free and premium content on the same page
<Card>
  <CardTitle>Free Content</CardTitle>
  <CardContent>Everyone can see this</CardContent>
</Card>

<PaywallGate
  fallback={<LockedPreview />}
>
  <Card>
    <CardTitle>Premium Content</CardTitle>
    <CardContent>Only subscribers see this</CardContent>
  </Card>
</PaywallGate>

<Card>
  <CardTitle>More Free Content</CardTitle>
  <CardContent>Back to free content</CardContent>
</Card>`}</code></pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
