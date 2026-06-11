import type { ComponentType } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  accent?: "primary" | "emerald" | "red" | "muted";
}) {
  const accentClasses: Record<string, string> = {
    primary: "bg-gold-dim text-gold",
    emerald: "bg-available/10 text-available",
    red: "bg-unavailable/10 text-unavailable",
    muted: "bg-surface text-text-secondary",
  };

  return (
    <Card className="border border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
        <CardTitle className="text-sm font-medium text-text-secondary">
          {label}
        </CardTitle>
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-lg",
            accentClasses[accent ?? "muted"],
          )}
        >
          <Icon className="size-4" />
        </span>
      </CardHeader>
      <CardContent>
        <p className="font-heading text-3xl font-bold text-text-primary">{value}</p>
      </CardContent>
    </Card>
  );
}
