interface BlurredContentProps {
  children: React.ReactNode;
}

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
