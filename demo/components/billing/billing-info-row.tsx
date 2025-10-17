import { ReactNode } from "react";

interface BillingInfoRowProps {
  label: string;
  value: ReactNode;
  showBorder?: boolean;
}

export function BillingInfoRow({ label, value, showBorder = true }: BillingInfoRowProps) {
  return (
    <div className={`flex items-center justify-between py-3 ${showBorder ? 'border-b' : ''}`}>
      <span className="text-sm font-medium">{label}</span>
      <div className="text-sm">{value}</div>
    </div>
  );
}
