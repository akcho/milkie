import { Badge } from "@/components/ui/badge";

export function MixedPageHeader() {
  return (
    <div className="mb-8">
      <Badge variant="secondary" className="mb-4">
        Component-Level Gating
      </Badge>
      <h1 className="text-4xl font-bold mb-4">
        Mixed Content Example
      </h1>
      <p className="text-lg text-muted-foreground">
        This page demonstrates how you can mix free and premium content on the same page.
        Free content is visible to everyone, while premium sections are gated.
      </p>
    </div>
  );
}
