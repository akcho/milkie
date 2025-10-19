import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket } from "lucide-react";
import { ReactNode } from "react";

interface ImplementationTipProps {
  title?: string;
  children: ReactNode;
}

export function ImplementationTip({
  title = "Implementation Tip",
  children,
}: ImplementationTipProps) {
  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm text-muted-foreground">{children}</div>
      </CardContent>
    </Card>
  );
}
