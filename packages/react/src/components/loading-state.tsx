import { Loader2 } from "lucide-react";

/**
 * LoadingState Component
 *
 * Displays a centered loading spinner with a "Loading..." message. This component is used
 * by gate components to indicate that authentication or subscription status is being verified.
 *
 * ## Purpose
 * Provides consistent loading UI for async operations, particularly when checking user
 * authentication status or subscription data before rendering gated content.
 *
 * ## Design Decisions
 * - `min-h-[400px]`: Provides sufficient vertical space to center the loading indicator,
 *   preventing layout shift when content loads. This height works well for most content
 *   areas while avoiding excessive whitespace.
 * - `text-muted-foreground`: Uses a subdued color to indicate the transient nature of the
 *   loading state.
 * - Animated spinner from Lucide React for visual feedback that verification is in progress.
 *
 * ## Accessibility
 * The component includes both a visual spinner and text label for better accessibility.
 * Screen readers will announce "Loading..." to inform users of the current state.
 *
 * @example
 * ```tsx
 * function CustomGate() {
 *   const { isLoading, isAuthenticated } = useAuth();
 *
 *   if (isLoading) {
 *     return <LoadingState />;
 *   }
 *
 *   return isAuthenticated ? <Content /> : <SignInPrompt />;
 * }
 * ```
 *
 * @see {@link AuthGate} - Uses LoadingState while checking authentication
 * @see {@link PaywallGate} - Uses LoadingState while checking subscription status
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
