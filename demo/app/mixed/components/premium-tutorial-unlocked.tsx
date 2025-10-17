import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export function PremiumTutorialUnlocked() {
  return (
    <Card className="border-primary">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Premium Tutorial
          </CardTitle>
          <Badge>Premium</Badge>
        </div>
        <CardDescription>Advanced implementation guide</CardDescription>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none">
        <h3>Step-by-Step Implementation</h3>
        <p>
          Congratulations! You have access to this premium content. Here&apos;s
          the detailed tutorial you unlocked:
        </p>
        <ol>
          <li>
            <strong>Setup:</strong> First, import the necessary components and
            configure your environment variables.
          </li>
          <li>
            <strong>Implementation:</strong> Wrap the components you want to
            protect with the PaywallGate component.
          </li>
          <li>
            <strong>Customization:</strong> Use the customUi prop to create
            custom teaser content for non-subscribers.
          </li>
          <li>
            <strong>Testing:</strong> Test both the free and premium experiences
            to ensure smooth transitions.
          </li>
        </ol>
        <p>
          This approach gives you maximum flexibility - you can gate specific
          sections while keeping other content freely accessible.
        </p>
      </CardContent>
    </Card>
  );
}
