interface BlurredContentProps {
  children: React.ReactNode;
}

/**
 * Renders blurred, non-interactive content as a preview for paywall/auth gates.
 * Hidden from screen readers (aria-hidden) since the content isn't accessible.
 * Disables pointer events and text selection to prevent interaction.
 *
 * @see PaywallGate
 * @see AuthGate
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
