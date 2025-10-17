import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/icons/github-icon";

export function GitHubLink() {
  return (
    <Button asChild size="sm" variant="ghost">
      <Link
        href="https://github.com/akcho/milkie"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHubIcon className="h-4 w-4" />
      </Link>
    </Button>
  );
}
