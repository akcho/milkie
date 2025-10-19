"use client";

import { usePaywall } from "../provider";
import { LoadingState } from "../components/loading-state";
import { AuthCard } from "./components/auth-card";
import { BlurredContent } from "../components/blurred-content";
import { OverlayGrid } from "../components/overlay-grid";
import { handleSignInRedirect } from "../utils";

/**
 * Props for the AuthGate component.
 *
 * @property {React.ReactNode} children - The content to protect behind authentication
 * @property {React.ReactNode} [customUi] - Optional custom sign-in UI component to replace the default overlay
 * @property {string} [signInUrl="/signin"] - URL to redirect unauthenticated users for sign-in
 * @property {() => void} [onSignIn] - Custom handler for sign-in action, overrides default redirect
 * @property {string} [title="Sign in required"] - Heading text displayed on the authentication overlay
 * @property {string} [subtitle="Please sign in to access this content."] - Subtitle text displayed on the authentication overlay
 * @property {string} [signInButtonText="Sign in"] - Label for the sign-in button
 * @property {boolean} [showBlurredChildren=true] - When true, shows blurred content preview behind auth card; when false, shows auth card inline
 * @property {string} [overlayClassName] - Optional className to apply to the overlay element (e.g., "pt-8" to add top padding)
 * @property {"center" | "top"} [position="center"] - Vertical position of the auth card: "center" for middle, "top" for top alignment
 *
 * @example
 * // Basic usage - protect content
 * <AuthGate>
 *   <MembersOnlyContent />
 * </AuthGate>
 *
 * @example
 * // Customized messaging
 * <AuthGate
 *   title="Members Only"
 *   subtitle="Create a free account to access this content"
 *   signInButtonText="Create Account"
 * >
 *   <ProtectedContent />
 * </AuthGate>
 *
 * @example
 * // With custom sign-in handler
 * <AuthGate
 *   onSignIn={() => signIn("google")}
 *   signInButtonText="Sign in with Google"
 * >
 *   <ProtectedContent />
 * </AuthGate>
 */
interface AuthGateProps {
  children: React.ReactNode;
  customUi?: React.ReactNode;
  signInUrl?: string;
  onSignIn?: () => void;
  title?: string;
  subtitle?: string;
  signInButtonText?: string;
  showBlurredChildren?: boolean;
  overlayClassName?: string;
  position?: "center" | "top";
}

/**
 * AuthGate - A component that protects content from unauthenticated users.
 *
 * This component acts as a gatekeeper for member-only content, handling three states:
 * 1. Loading: Shows a loading indicator while checking authentication status
 * 2. Authenticated: Renders the protected children content for signed-in users
 * 3. Not Authenticated: Shows a sign-in overlay with blurred content preview
 *
 * The component integrates with the MilkieProvider context to check authentication status.
 * Unlike PaywallGate, it does not check subscription status - it only verifies that a user
 * is signed in (has an email/session).
 *
 * Features:
 * - Automatic authentication status checking via usePaywall hook
 * - Blurred content preview for unauthenticated users
 * - Customizable messaging and styling
 * - Flexible sign-in handling (redirect or custom handler)
 * - Support for fully custom UI
 *
 * @param {AuthGateProps} props - Configuration options for the authentication gate
 * @returns {JSX.Element} The authentication gate component
 *
 * @example
 * // Basic usage - protect an entire page
 * export default function MembersPage() {
 *   return (
 *     <AuthGate>
 *       <h1>Members Only</h1>
 *       <MembersDashboard />
 *     </AuthGate>
 *   );
 * }
 *
 * @example
 * // Mix public and members-only content
 * export default function BlogPost() {
 *   return (
 *     <div>
 *       <BlogPreview />
 *       <AuthGate
 *         title="Sign in to continue reading"
 *         subtitle="It's free and takes 30 seconds"
 *       >
 *         <BlogFullContent />
 *       </AuthGate>
 *     </div>
 *   );
 * }
 *
 * @example
 * // Completely custom sign-in UI
 * <AuthGate customUi={<MyCustomSignInCard />}>
 *   <ProtectedFeatures />
 * </AuthGate>
 */
export function AuthGate({
  children,
  customUi,
  signInUrl = "/signin",
  onSignIn,
  title = "Sign in required",
  subtitle = "Please sign in to access this content.",
  signInButtonText = "Sign in",
  showBlurredChildren = true,
  overlayClassName,
  position = "center",
}: AuthGateProps) {
  const { loading, email } = usePaywall();

  if (loading) {
    return <LoadingState />;
  }

  if (email) {
    return <>{children}</>;
  }

  if (customUi) {
    return <>{customUi}</>;
  }

  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn();
    } else {
      handleSignInRedirect(signInUrl);
    }
  };

  const authCard = (
    <AuthCard
      title={title}
      subtitle={subtitle}
      signInButtonText={signInButtonText}
      onSignIn={handleSignIn}
    />
  );

  // When blur is disabled, just show the auth card inline
  if (!showBlurredChildren) {
    return <div className="py-8">{authCard}</div>;
  }

  // Default: show with blur effect
  return (
    <OverlayGrid
      overlay={authCard}
      overlayClassName={overlayClassName}
      position={position}
    >
      <BlurredContent>{children}</BlurredContent>
    </OverlayGrid>
  );
}
