import { PaywallGate } from "@milkie/react";
import { PremiumTutorialLocked } from "./premium-tutorial-locked";
import { PremiumTutorialUnlocked } from "./premium-tutorial-unlocked";

export function PremiumTutorialSection() {
  return (
    <PaywallGate fallback={<PremiumTutorialLocked />}>
      <PremiumTutorialUnlocked />
    </PaywallGate>
  );
}
