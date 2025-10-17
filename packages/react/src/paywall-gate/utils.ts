/**
 * Handles the checkout process for a subscription.
 *
 * This function orchestrates the Stripe checkout flow by either using a custom
 * checkout handler (if provided) or making a POST request to the default
 * `/api/checkout` endpoint. The default implementation automatically includes
 * the current URL as a callback to return users to their original location
 * after completing checkout.
 *
 * Default Behavior:
 * - POSTs to `/api/checkout` with user email and callback URL
 * - Includes current pathname and search params for post-checkout redirect
 * - Throws error if the API request fails
 *
 * Custom Behavior:
 * - Calls the provided `onCheckout` function with the user's email
 * - Expects the custom handler to return an object with a `url` property
 *
 * @param {string} email - The authenticated user's email address
 * @param {(email: string) => Promise<{ url: string }>} [onCheckout] - Optional custom checkout handler
 * @returns {Promise<{ url: string }>} Promise resolving to an object containing the Stripe checkout URL
 * @throws {Error} When the checkout API request fails or returns a non-OK status
 *
 * @example
 * // Using default checkout endpoint
 * const { url } = await handleCheckoutProcess('user@example.com');
 * // POSTs to /api/checkout with email and callback URL
 *
 * @example
 * // Using custom checkout handler
 * const { url } = await handleCheckoutProcess(
 *   'user@example.com',
 *   async (email) => {
 *     const response = await createCustomCheckout(email);
 *     return { url: response.checkoutUrl };
 *   }
 * );
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
 * Redirects the browser to a Stripe checkout URL.
 *
 * This is a simple wrapper around `window.location.href` assignment that
 * navigates the user to the Stripe-hosted checkout page. This function
 * triggers a full page navigation, leaving the current app.
 *
 * Note: After successful checkout, Stripe will redirect users back to the
 * callback URL that was provided during checkout session creation.
 *
 * @param {string} url - The Stripe checkout URL to redirect to
 * @returns {void}
 *
 * @example
 * const { url } = await handleCheckoutProcess(email);
 * redirectToCheckout(url);
 * // User is now navigating to Stripe's checkout page
 */
export function redirectToCheckout(url: string): void {
  window.location.href = url;
}
