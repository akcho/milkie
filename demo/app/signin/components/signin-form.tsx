import { signIn } from "@/auth";
import { GoogleSigninButton } from "./google-signin-button";

interface SigninFormProps {
  redirectTo: string;
}

export function SigninForm({ redirectTo }: SigninFormProps) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo });
      }}
    >
      <GoogleSigninButton />
    </form>
  );
}
