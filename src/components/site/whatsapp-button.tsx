import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { cn, getWhatsAppLink } from "@/lib/utils";

export function WhatsAppButton({
  car,
  phone,
  className,
  label = "Contact on WhatsApp",
  message,
}: {
  car: { name: string; available: boolean };
  phone: string;
  className?: string;
  label?: string;
  message?: string;
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
        {label}
      </span>
    );
  }

  const resolvedMessage =
    message ?? `Hello, I'm interested in renting the ${car.name}. Is it available?`;

  return (
    <a
      href={getWhatsAppLink(phone, resolvedMessage)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#2EE673]",
        className,
      )}
    >
      <WhatsAppIcon className="size-4" />
      {label}
    </a>
  );
}
