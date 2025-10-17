import { Layers, Component, Newspaper } from "lucide-react";
import { DemoCard } from "./demo-card";

export function DemoExamplesGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-16">
      <DemoCard
        icon={Layers}
        title="Layout Gating"
        description="Protect entire sections at the layout level"
        href="/dashboard"
      />
      <DemoCard
        icon={Component}
        title="Component Gating"
        description="Mix free and premium content on the same page"
        href="/mixed"
      />
      <DemoCard
        icon={Newspaper}
        title="Metered Paywall"
        description="Give users a taste with limited free access per month"
        href="/metered"
      />
    </div>
  );
}
