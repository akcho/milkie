import { PaywallGate } from "@milkie/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Sparkles } from "lucide-react";

export function PremiumTutorialSection() {
  return (
    <PaywallGate
      fallback={
        <Card className="border-primary/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Premium Tutorial
              </CardTitle>
              <Badge>Premium</Badge>
            </div>
            <CardDescription>
              Unlock this section with a subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-6 text-center space-y-4">
              <p className="text-muted-foreground">
                This premium content includes:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
                <li>• Step-by-step implementation guide</li>
                <li>• Code examples and best practices</li>
                <li>• Common pitfalls and how to avoid them</li>
                <li>• Performance optimization tips</li>
              </ul>
              <p className="text-sm text-muted-foreground pt-2">
                Subscribe to unlock this content and more.
              </p>
            </div>
          </CardContent>
        </Card>
      }
    >
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Premium Tutorial
            </CardTitle>
            <Badge>Premium</Badge>
          </div>
          <CardDescription>
            Advanced implementation guide
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <h3>Step-by-Step Implementation</h3>
          <p>
            Congratulations! You have access to this premium content. Here&apos;s the detailed
            tutorial you unlocked:
          </p>
          <ol>
            <li>
              <strong>Setup:</strong> First, import the necessary components and configure
              your environment variables.
            </li>
            <li>
              <strong>Implementation:</strong> Wrap the components you want to protect with
              the PaywallGate component.
            </li>
            <li>
              <strong>Customization:</strong> Use the fallback prop to create custom teaser
              content for non-subscribers.
            </li>
            <li>
              <strong>Testing:</strong> Test both the free and premium experiences to ensure
              smooth transitions.
            </li>
          </ol>
          <p>
            This approach gives you maximum flexibility - you can gate specific sections while
            keeping other content freely accessible.
          </p>
        </CardContent>
      </Card>
    </PaywallGate>
  );
}
