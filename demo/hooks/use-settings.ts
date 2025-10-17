import { useState } from "react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export function useSettings() {
  const pathname = usePathname();
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ callbackUrl: pathname });
  };

  return {
    isSaving,
    isSigningOut,
    handleSave,
    handleSignOut,
  };
}
