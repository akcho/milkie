import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/icons/github-icon";

export function CtaSection() {
  return (
    <Card className="text-center">
      <CardContent className="pt-12 pb-12">
        <h2 className="text-3xl font-bold mb-4">
          Ready to add paywalls to your app?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Milkie is open source and MIT licensed. Get started in minutes with
          our documentation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg">
            <Link
              href="https://github.com/akcho/milkie#readme"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get started
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link
              href="https://github.com/akcho/milkie"
              target="_blank"
              rel="noopener noreferrer"
            >
              Star GitHub <GitHubIcon className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
