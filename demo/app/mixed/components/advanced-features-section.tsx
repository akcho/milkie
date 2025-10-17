import { PaywallGate } from "@milkie/react";
import { AdvancedFeaturesLocked } from "./advanced-features-locked";
import { AdvancedFeaturesUnlocked } from "./advanced-features-unlocked";

export function AdvancedFeaturesSection() {
  return (
    <PaywallGate fallback={<AdvancedFeaturesLocked />}>
      <AdvancedFeaturesUnlocked />
    </PaywallGate>
  );
}
