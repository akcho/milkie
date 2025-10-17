import { Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

interface AuthOverlayProps {
  title: string;
  subtitle: string;
  signInButtonText: string;
  onSignIn: () => void;
}

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
