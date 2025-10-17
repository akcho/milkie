import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { MilkieIcon } from "../../components/milkie-icon";
import { UserInfo } from "./user-info";
import { CheckoutError } from "./checkout-error";

interface PaywallCardProps {
  email: string | null;
  title: string;
  subtitle: string;
  signInButtonText: string;
  subscribeButtonText: string;
  icon?: React.ReactNode;
  isCheckingOut: boolean;
  checkoutError: string | null;
  showBranding: boolean;
  onSignIn: () => void;
  onCheckout: () => void;
}

export function PaywallCard({
  email,
  title,
  subtitle,
  signInButtonText,
  subscribeButtonText,
  icon,
  isCheckingOut,
  checkoutError,
  showBranding,
  onSignIn,
  onCheckout,
}: PaywallCardProps) {
  return (
    <Card className="max-w-md w-full shadow-none">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          {icon || <MilkieIcon className="h-12 w-12" />}
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {!email ? (
          <Button onClick={onSignIn} className="w-full" size="lg">
            {signInButtonText}
          </Button>
        ) : (
          <>
            <UserInfo email={email} />

            {checkoutError && <CheckoutError error={checkoutError} />}

            <Button
              onClick={onCheckout}
              disabled={isCheckingOut}
              className="w-full"
              size="lg"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : checkoutError ? (
                "Try again"
              ) : (
                subscribeButtonText
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              You&apos;ll be redirected to Stripe to complete your payment
            </p>
          </>
        )}

        {showBranding && (
          <p
            className="text-center text-muted-foreground/50 mt-6"
            style={{ fontSize: "10px" }}
          >
            Powered by{" "}
            <a
              href="https://github.com/akcho/milkie"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-muted-foreground/70 hover:text-muted-foreground transition-colors"
            >
              milkie
            </a>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
