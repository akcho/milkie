/**
 * Props for the BlurredContent component
 */
interface BlurredContentProps {
  /** The content to be displayed in a blurred, non-interactive state */
  children: React.ReactNode;
}

/**
 * BlurredContent Component
 *
 * Renders content in a blurred, non-interactive state. This component is typically used
 * to show a preview of premium or protected content behind a paywall or authentication gate.
 *
 * ## Purpose
 * The blurred content serves as a visual teaser, showing users what they're missing while
 * preventing actual interaction or reading of the content. This creates an incentive for
 * users to unlock the full content through payment or authentication.
 *
 * ## Accessibility Considerations
 * - `aria-hidden="true"`: Hides the blurred content from screen readers since it's not
 *   interactive or fully readable. The actual accessible content should be provided
 *   separately through the gate component's messaging.
 *
 * ## Implementation Details
 * - `blur-sm`: Applies a small blur effect to obscure the content
 * - `pointer-events-none`: Disables all mouse interactions (clicks, hovers, etc.)
 * - `select-none`: Prevents text selection to discourage workarounds
 * - `opacity-50`: Reduces opacity to further indicate unavailability
 * - `w-full`: Ensures the blurred content takes full width of its container
 *
 * @example
 * ```tsx
 * <BlurredContent>
 *   <Article>
 *     <h1>Premium Content</h1>
 *     <p>This is the content users want to read...</p>
 *   </Article>
 * </BlurredContent>
 * ```
 *
 * @see {@link PaywallGate} - Component that uses BlurredContent for premium content previews
 * @see {@link AuthGate} - Component that uses BlurredContent for protected content previews
 */
export function BlurredContent({ children }: BlurredContentProps) {
  return (
    <div
      className="blur-sm pointer-events-none select-none w-full opacity-50"
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
