"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCarAction } from "@/app/admin/(dashboard)/cars/actions";

export function DeleteCarButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      disabled={isPending}
      className="text-unavailable hover:bg-unavailable/10 hover:text-unavailable"
      onClick={() => {
        if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
          startTransition(async () => {
            await deleteCarAction(id);
          });
        }
      }}
    >
      <Trash2 className="size-4" />
      <span className="sr-only">Delete {name}</span>
    </Button>
  );
}
