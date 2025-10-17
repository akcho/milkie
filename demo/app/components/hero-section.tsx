import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <div className="text-center space-y-6 mb-16">
      <Badge variant="secondary" className="mb-4">
        Drop-in Paywall SDK
      </Badge>
      <h1 className="text-5xl font-bold tracking-tight">
        Monetize Your Next.js App
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Explore live examples of paywalls you can add to your app in minutes
      </p>
    </div>
  );
}
