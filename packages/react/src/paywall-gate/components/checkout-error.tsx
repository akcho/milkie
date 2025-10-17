import { AlertCircle } from "lucide-react";

/**
 * Props for the CheckoutError component.
 *
 * @property {string} error - The error message to display to the user
 */
interface CheckoutErrorProps {
  error: string;
}

/**
 * CheckoutError - A component that displays checkout error messages in a styled alert.
 *
 * This component provides user-friendly error messaging when checkout processes fail.
 * It includes intelligent error message handling that converts technical error messages
 * into more user-friendly language.
 *
 * Features:
 * - Styled alert box with destructive color scheme
 * - Alert icon for visual emphasis
 * - Automatic error message simplification for status code errors
 * - Responsive layout that works on all screen sizes
 *
 * Error Message Handling:
 * - If error contains "status": Shows generic "Unable to connect" message
 * - Otherwise: Displays the original error message
 *
 * Visual Design:
 * - Red/destructive color theme to indicate error state
 * - AlertCircle icon for quick visual identification
 * - Two-tier message: "Checkout failed" heading + specific error details
 * - Rounded corners and subtle border for modern appearance
 *
 * @param {CheckoutErrorProps} props - Component props
 * @returns {JSX.Element} The rendered error alert component
 *
 * @example
 * // Display a network error
 * <CheckoutError error="Checkout failed with status 500" />
 * // Renders: "Unable to connect to checkout service. Please try again."
 *
 * @example
 * // Display a custom error message
 * <CheckoutError error="Payment method declined" />
 * // Renders: "Payment method declined"
 */
export function CheckoutError({ error }: CheckoutErrorProps) {
  return (
    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
      <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
      <div className="text-sm text-destructive">
        <p className="font-medium">Checkout failed</p>
        <p className="text-xs mt-1 opacity-90">
          {error.includes("status")
            ? "Unable to connect to checkout service. Please try again."
            : error}
        </p>
      </div>
    </div>
  );
}
