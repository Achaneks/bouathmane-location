import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { cn } from "@/lib/utils";
import { getWhatsAppLink } from "@/lib/utils";
import type { Car } from "@/lib/types";

export function WhatsAppButton({
  car,
  className,
}: {
  car: Pick<Car, "name" | "available">;
  className?: string;
}) {
  if (!car.available) {
    return (
      <span
        aria-disabled="true"
        className={cn(
          "flex h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-[#25D366] text-sm font-semibold text-white opacity-50",
          className,
        )}
      >
        <WhatsAppIcon className="size-4" />
        Contact on WhatsApp
      </span>
    );
  }

  return (
    <a
      href={getWhatsAppLink(car)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#2EE673]",
        className,
      )}
    >
      <WhatsAppIcon className="size-4" />
      Contact on WhatsApp
    </a>
  );
}
