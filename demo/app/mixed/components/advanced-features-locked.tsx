import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";

export function AdvancedFeaturesLocked() {
  return (
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
  );
}
