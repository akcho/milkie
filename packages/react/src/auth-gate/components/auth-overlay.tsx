import { Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

/**
 * Props for the AuthOverlay component.
 *
 * @property {string} title - Heading text displayed on the authentication card
 * @property {string} subtitle - Subtitle text displayed below the title
 * @property {string} signInButtonText - Label for the sign-in button
 * @property {() => void} onSignIn - Handler function called when sign-in button is clicked
 */
interface AuthOverlayProps {
  title: string;
  subtitle: string;
  signInButtonText: string;
  onSignIn: () => void;
}

/**
 * AuthOverlay - A centered authentication prompt card displayed over blurred content.
 *
 * This component renders a card with a lock icon, customizable title/subtitle text,
 * and a sign-in button. It's designed to be overlaid on top of protected content
 * (typically with a blur effect) to prompt unauthenticated users to sign in.
 *
 * The component uses shadcn/ui Card and Button components with Tailwind CSS styling.
 *
 * @param {AuthOverlayProps} props - Configuration for the authentication overlay
 * @returns {JSX.Element} The authentication overlay card component
 *
 * @internal This component is used internally by AuthGate and typically not imported directly.
 *
 * @example
 * // Used internally by AuthGate
 * <AuthOverlay
 *   title="Sign in required"
 *   subtitle="Please sign in to access this content."
 *   signInButtonText="Sign in"
 *   onSignIn={handleSignIn}
 * />
 */
export function AuthOverlay({
  title,
  subtitle,
  signInButtonText,
  onSignIn,
}: AuthOverlayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-8">
      <Card className="max-w-md w-full shadow-none">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </CardHeader>

        <CardContent>
          <Button onClick={onSignIn} className="w-full" size="lg">
            {signInButtonText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
