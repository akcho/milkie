import { PaywallGate } from "milkie";
import { PremiumTutorialLocked } from "./premium-tutorial-locked";
import { PremiumTutorialUnlocked } from "./premium-tutorial-unlocked";

export function PremiumTutorialSection() {
  return (
    <PaywallGate customUi={<PremiumTutorialLocked />}>
      <PremiumTutorialUnlocked />
    </PaywallGate>
  );
}
