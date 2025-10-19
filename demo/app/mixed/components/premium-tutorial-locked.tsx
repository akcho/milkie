import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";

export function PremiumTutorialLocked() {
  return (
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
        <div className="bg-muted/50 rounded-lg p-8 space-y-6">
          <p className="text-muted-foreground">
            This premium content includes:
          </p>
          <ul className="text-sm text-muted-foreground space-y-3 pl-6">
            <li>• Step-by-step implementation guide</li>
            <li>• Code examples and best practices</li>
            <li>• Common pitfalls and how to avoid them</li>
            <li>• Performance optimization tips</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Subscribe to unlock this content and more.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
