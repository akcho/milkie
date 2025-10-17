/**
 * Builds a callback URL from the current browser location
 * @returns Encoded callback URL containing pathname and search params
 */
export function buildCallbackUrl(): string {
  return encodeURIComponent(
    window.location.pathname + window.location.search
  );
}

/**
 * Handles sign-in redirect with optional callback URL
 * @param signInUrl - The URL to redirect to for sign-in
 */
export function handleSignInRedirect(signInUrl: string): void {
  const callbackUrl = buildCallbackUrl();
  window.location.href = `${signInUrl}?callbackUrl=${callbackUrl}`;
}

/**
 * Handles the checkout process for a subscription
 * @param email - User's email address
 * @param onCheckout - Optional custom checkout handler
 * @returns Promise with checkout URL
 */
export async function handleCheckoutProcess(
  email: string,
  onCheckout?: (email: string) => Promise<{ url: string }>
): Promise<{ url: string }> {
  if (onCheckout) {
    // Use custom checkout handler if provided
    return await onCheckout(email);
  }

  // Default to /api/checkout endpoint
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      callbackUrl: window.location.pathname + window.location.search,
    }),
  });

  if (!response.ok) {
    throw new Error(`Checkout failed with status ${response.status}`);
  }

  return await response.json();
}

/**
 * Redirects to a checkout URL
 * @param url - The checkout URL to redirect to
 */
export function redirectToCheckout(url: string): void {
  window.location.href = url;
}
