import { useEffect } from "react";

/**
 * Custom hook to block page scrolling.
 * Useful for article paywalls where you want to prevent users from scrolling
 * to see blurred content below.
 *
 * @param shouldBlock - Whether scrolling should be blocked
 *
 * @example
 * // Block scrolling when paywall is active
 * const { hasAccess } = usePaywall();
 * useScrollBlock(!hasAccess);
 */
export function useScrollBlock(shouldBlock: boolean) {
  useEffect(() => {
    if (shouldBlock) {
      // Save original overflow value
      const originalOverflow = document.body.style.overflow;
      // Save scrollbar width to prevent layout shift
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Block scrolling
      document.body.style.overflow = "hidden";
      // Prevent layout shift by adding padding to compensate for hidden scrollbar
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      // Cleanup: restore original styles when shouldBlock changes or component unmounts
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = "";
      };
    }
  }, [shouldBlock]);
}
