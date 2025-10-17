import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | ReactNode;
  icon: LucideIcon;
  subtitle?: string | ReactNode;
}

export function StatCard({ title, value, icon: Icon, subtitle }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <div className="mt-2">
            {typeof subtitle === "string" ? (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            ) : (
              subtitle
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
