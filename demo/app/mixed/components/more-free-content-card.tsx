import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function MoreFreeContentCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>More Free Content</CardTitle>
          <Badge variant="outline">Free</Badge>
        </div>
        <CardDescription>
          Additional free information for everyone
        </CardDescription>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none">
        <p>
          Notice how you can intersperse free and premium content throughout the
          same page. This is perfect for:
        </p>
        <ul>
          <li>Blog posts with premium sections</li>
          <li>Tutorial series with advanced topics locked</li>
          <li>Feature showcases with some features gated</li>
          <li>Documentation with pro tips for subscribers</li>
        </ul>
      </CardContent>
    </Card>
  );
}
