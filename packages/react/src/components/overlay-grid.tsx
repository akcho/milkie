/**
 * Props for the OverlayGrid component.
 *
 * @property {React.ReactNode} children - The base content to display (will be blurred in typical usage)
 * @property {React.ReactNode} overlay - The overlay content to display on top (typically a card or modal)
 * @property {string} [overlayClassName] - Optional className to apply to the overlay element (e.g., "pt-8" to add top padding to a paywall card)
 */
interface OverlayGridProps {
  children: React.ReactNode;
  overlay: React.ReactNode;
  overlayClassName?: string;
}

/**
 * OverlayGrid - A layout component that overlays content using CSS Grid.
 *
 * This component uses CSS Grid to stack two elements in the same cell, ensuring both
 * contribute to the parent height. Whichever child is taller determines the container
 * size, and the overlay stays centered both horizontally and vertically.
 *
 * The overlay is given z-10 to ensure it appears above the base content. This is
 * necessary because if the base content has effects that create a stacking context
 * (like blur filters), it would otherwise render on top despite DOM order.
 *
 * Use Cases:
 * - Overlaying authentication prompts on blurred content
 * - Overlaying paywall cards on preview content
 * - Any scenario where you need centered overlay with dynamic heights
 *
 * @param {OverlayGridProps} props - The base content and overlay to render
 * @returns {React.ReactElement} A grid container with overlaid content
 *
 * @example
 * <OverlayGrid
 *   overlay={<PaywallCard />}
 * >
 *   <BlurredContent>
 *     <PremiumContent />
 *   </BlurredContent>
 * </OverlayGrid>
 */
export function OverlayGrid({
  children,
  overlay,
  overlayClassName,
}: OverlayGridProps): React.ReactElement {
  return (
    <div className="w-full grid grid-cols-1 grid-rows-1 items-center justify-items-center">
      <div className="col-start-1 row-start-1 w-full">{children}</div>
      <div
        className={`col-start-1 row-start-1 w-full z-10 ${
          overlayClassName || ""
        }`}
      >
        {overlay}
      </div>
    </div>
  );
}
