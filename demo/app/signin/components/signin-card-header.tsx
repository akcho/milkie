import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MilkieIcon } from "@milkie/react";

export function SigninCardHeader() {
  return (
    <CardHeader className="text-center space-y-4">
      <div className="flex justify-center">
        <MilkieIcon className="h-16 w-16" />
      </div>
      <div className="space-y-2">
        <CardTitle className="text-2xl">Welcome to Milkie</CardTitle>
        <CardDescription>Sign in to get started</CardDescription>
      </div>
    </CardHeader>
  );
}
