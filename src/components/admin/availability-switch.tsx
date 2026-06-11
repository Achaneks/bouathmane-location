"use client";

import { useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { toggleAvailabilityAction } from "@/app/admin/cars/actions";

export function AvailabilitySwitch({
  carId,
  defaultChecked,
}: {
  carId: string;
  defaultChecked: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Switch
      defaultChecked={defaultChecked}
      disabled={isPending}
      onCheckedChange={() => {
        startTransition(async () => {
          await toggleAvailabilityAction(carId);
        });
      }}
      aria-label="Toggle availability"
    />
  );
}
