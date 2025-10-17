import { Loader2 } from "lucide-react";

/**
 * Displays a centered loading spinner used by gate components during async verification.
 * Uses min-h-[400px] to prevent layout shift when content loads.
 *
 * @see AuthGate
 * @see PaywallGate
 */
export function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </div>
    </div>
  );
}
