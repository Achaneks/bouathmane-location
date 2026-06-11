import { cn } from "@/lib/utils";

export function AvailabilityBadge({ available }: { available: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-md",
        available
          ? "border-available/30 bg-available/15 text-available"
          : "border-unavailable/30 bg-unavailable/15 text-unavailable",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          available ? "bg-available" : "bg-unavailable",
        )}
      />
      {available ? "Available" : "Unavailable"}
    </span>
  );
}
