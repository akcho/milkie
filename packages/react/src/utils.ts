/**
 * Builds a callback URL from the current browser location
 * @returns Encoded callback URL containing pathname and search params
 */
export function buildCallbackUrl(): string {
  return encodeURIComponent(window.location.pathname + window.location.search);
}

/**
 * Handles sign-in redirect with optional callback URL
 * @param signInUrl - The URL to redirect to for sign-in
 */
export function handleSignInRedirect(signInUrl: string): void {
  const callbackUrl = buildCallbackUrl();
  window.location.href = `${signInUrl}?callbackUrl=${callbackUrl}`;
}
