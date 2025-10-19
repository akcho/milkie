import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function FreePreviewCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Free Preview Content</CardTitle>
          <Badge variant="outline">Free</Badge>
        </div>
        <CardDescription>Everyone can see this section</CardDescription>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none">
        <p>
          This is a free preview section that everyone can access. You might use
          this to:
        </p>
        <ul>
          <li>Show a teaser of your content</li>
          <li>Explain the value proposition</li>
          <li>Display the first few paragraphs of an article</li>
          <li>Show thumbnails or previews of premium features</li>
        </ul>
        <p>
          Below, you&apos;ll see premium content sections that are only visible
          to subscribers.
        </p>
      </CardContent>
    </Card>
  );
}
