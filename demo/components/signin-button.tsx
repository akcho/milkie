import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SignInButtonProps {
  callbackUrl: string;
}

export function SignInButton({ callbackUrl }: SignInButtonProps) {
  return (
    <Button asChild size="xs">
      <Link href={`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
        Sign in
      </Link>
    </Button>
  );
}
