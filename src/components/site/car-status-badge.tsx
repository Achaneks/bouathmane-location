import { CarStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<CarStatus, string> = {
  AVAILABLE: "Available",
  RENTED: "Rented",
  MAINTENANCE: "Maintenance",
};

const STATUS_STYLES: Record<CarStatus, string> = {
  AVAILABLE: "border-available/30 bg-available/15 text-available",
  RENTED: "border-unavailable/30 bg-unavailable/15 text-unavailable",
  MAINTENANCE: "border-border bg-surface text-text-secondary",
};

const STATUS_DOT_STYLES: Record<CarStatus, string> = {
  AVAILABLE: "bg-available",
  RENTED: "bg-unavailable",
  MAINTENANCE: "bg-text-secondary",
};

export function CarStatusBadge({ status }: { status: CarStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-md",
        STATUS_STYLES[status],
      )}
    >
      <span className={cn("size-1.5 rounded-full", STATUS_DOT_STYLES[status])} />
      {STATUS_LABELS[status]}
    </span>
  );
}
