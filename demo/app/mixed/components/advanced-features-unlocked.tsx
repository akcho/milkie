import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export function AdvancedFeaturesUnlocked() {
  return (
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
  );
}
