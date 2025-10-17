import { Lock, CreditCard, CheckCircle } from "lucide-react";
import { FeatureCard } from "./feature-card";

export function HowItWorksSection() {
  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <FeatureCard
          icon={Lock}
          title="Wrap Components"
          description={
            <p className="text-sm text-muted-foreground">
              Use <code className="!text-foreground">PaywallGate</code> to protect pages, sections,
              or individual components
            </p>
          }
        />
        <FeatureCard
          icon={CreditCard}
          title="Stripe Checkout"
          description="Users are securely redirected to Stripe's hosted checkout page"
        />
        <FeatureCard
          icon={CheckCircle}
          title="Instant Access"
          description="Webhooks update subscription status in real-time for immediate access"
        />
      </div>
    </div>
  );
}
