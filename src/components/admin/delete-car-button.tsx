"use client";

import { useRef, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCarAction } from "@/app/admin/(dashboard)/cars/actions";

export function DeleteCarButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();
  const submittingRef = useRef(false);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      disabled={isPending}
      className="text-unavailable hover:bg-unavailable/10 hover:text-unavailable"
      onClick={() => {
        if (submittingRef.current) return;

        if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
          submittingRef.current = true;
          startTransition(async () => {
            try {
              await deleteCarAction(id);
            } finally {
              submittingRef.current = false;
            }
          });
        }
      }}
    >
      <Trash2 className="size-4" />
      <span className="sr-only">Delete {name}</span>
    </Button>
  );
}
