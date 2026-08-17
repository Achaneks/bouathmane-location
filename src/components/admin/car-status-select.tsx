"use client";

import { useOptimistic, useRef, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateCarStatusAction } from "@/app/admin/(dashboard)/cars/actions";
import { CarStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<CarStatus, string> = {
  AVAILABLE: "Available",
  RENTED: "Rented",
  MAINTENANCE: "Maintenance",
};

const STATUS_DOT_STYLES: Record<CarStatus, string> = {
  AVAILABLE: "bg-available",
  RENTED: "bg-unavailable",
  MAINTENANCE: "bg-text-secondary",
};

export function CarStatusSelect({
  carId,
  status,
}: {
  carId: string;
  status: CarStatus;
}) {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(status);
  const [isPending, startTransition] = useTransition();
  const submittingRef = useRef(false);

  function handleChange(nextStatus: CarStatus | null) {
    if (!nextStatus) return;
    // Guards against the same status being re-submitted and against
    // duplicate onValueChange firing (e.g. touch + synthetic click on mobile).
    if (nextStatus === optimisticStatus || submittingRef.current) return;
    submittingRef.current = true;

    startTransition(async () => {
      setOptimisticStatus(nextStatus);
      try {
        await updateCarStatusAction(carId, nextStatus);
      } finally {
        submittingRef.current = false;
      }
    });
  }

  return (
    <Select value={optimisticStatus} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="w-[140px]" aria-label="Car status">
        <span className="flex items-center gap-2">
          <span
            className={cn("size-1.5 shrink-0 rounded-full", STATUS_DOT_STYLES[optimisticStatus])}
          />
          <SelectValue>{STATUS_LABELS[optimisticStatus]}</SelectValue>
        </span>
      </SelectTrigger>
      <SelectContent>
        {Object.values(CarStatus).map((value) => (
          <SelectItem key={value} value={value}>
            {STATUS_LABELS[value]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
