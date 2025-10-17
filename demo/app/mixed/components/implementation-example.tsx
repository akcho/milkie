import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";

const EXAMPLE_CODE = `// Mix free and premium content on the same page
<Card>
  <CardTitle>Free Content</CardTitle>
  <CardContent>Everyone can see this</CardContent>
</Card>

<PaywallGate
  customUi={<LockedPreview />}
>
  <Card>
    <CardTitle>Premium Content</CardTitle>
    <CardContent>Only subscribers see this</CardContent>
  </Card>
</PaywallGate>

<Card>
  <CardTitle>More Free Content</CardTitle>
  <CardContent>Back to free content</CardContent>
</Card>`;

export function ImplementationExample() {
  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle className="text-lg">How This Page Works</CardTitle>
      </CardHeader>
      <CardContent>
        <CodeBlock code={EXAMPLE_CODE} />
      </CardContent>
    </Card>
  );
}
