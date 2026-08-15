"use client";

import { useEffect, useState, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { toggleAvailabilityAction } from "@/app/admin/(dashboard)/cars/actions";

export function AvailabilitySwitch({
  carId,
  defaultChecked,
}: {
  carId: string;
  defaultChecked: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setChecked(defaultChecked);
  }, [defaultChecked]);

  return (
    <Switch
      checked={checked}
      disabled={isPending}
      onCheckedChange={(value) => {
        setChecked(value);
        startTransition(async () => {
          await toggleAvailabilityAction(carId);
        });
      }}
      aria-label="Toggle availability"
    />
  );
}
