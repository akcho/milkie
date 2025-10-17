import { PaywallGate } from "@milkie/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Sparkles } from "lucide-react";

export function AdvancedFeaturesSection() {
  return (
    <PaywallGate
      fallback={
        <Card className="border-primary/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Advanced Features
              </CardTitle>
              <Badge>Premium</Badge>
            </div>
            <CardDescription>
              Unlock advanced techniques and examples
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-6 text-center">
              <p className="text-muted-foreground">
                Subscribe to access advanced code examples, performance tips, and production
                deployment strategies.
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
              Advanced Features
            </CardTitle>
            <Badge>Premium</Badge>
          </div>
          <CardDescription>
            Production-ready examples
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <h3>Advanced Techniques</h3>
          <p>
            You&apos;ve unlocked the advanced section! Here are some pro tips:
          </p>
          <ul>
            <li>
              <strong>Performance:</strong> Use React.memo on PaywallGate children to prevent
              unnecessary re-renders
            </li>
            <li>
              <strong>SEO:</strong> Place free content at the top for better search engine
              visibility
            </li>
            <li>
              <strong>Analytics:</strong> Track which gated sections users interact with to
              optimize conversion
            </li>
            <li>
              <strong>UX:</strong> Make fallback content compelling to encourage subscriptions
            </li>
          </ul>
        </CardContent>
      </Card>
    </PaywallGate>
  );
}
