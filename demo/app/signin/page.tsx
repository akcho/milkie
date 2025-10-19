import { Card, CardContent } from "@/components/ui/card";
import { SigninCardHeader } from "./components/signin-card-header";
import { SigninForm } from "./components/signin-form";
import { SigninDemoNotice } from "./components/signin-demo-notice";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = params.callbackUrl || "/";

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="max-w-md w-full">
        <SigninCardHeader />
        <CardContent className="space-y-6">
          <SigninForm redirectTo={redirectTo} />
          <SigninDemoNotice />
        </CardContent>
      </Card>
    </div>
  );
}
