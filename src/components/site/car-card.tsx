import Image from "next/image";
import { Cog, Fuel, Users } from "lucide-react";
import { AvailabilityBadge } from "@/components/site/availability-badge";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { formatPrice } from "@/lib/utils";
import type { Car } from "@/lib/types";

function Spec({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[13px] text-text-secondary">
      <Icon className="size-3.5 text-gold" />
      <span className="truncate">{label}</span>
    </div>
  );
}

export function CarCard({ car }: { car: Car }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface-elevated transition-colors duration-300 hover:border-gold">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={car.image}
          alt={car.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute top-3 right-3">
          <AvailabilityBadge available={car.available} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="font-heading text-[22px] text-text-primary">
            {car.name}
          </h3>
          <p className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-gold">
              {formatPrice(car.pricePerDay, car.currency)}
            </span>
            <span className="text-sm text-text-muted">/ day</span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 border-y border-border py-3">
          <Spec icon={Fuel} label={car.fuelType} />
          <Spec icon={Cog} label={car.transmission} />
          <Spec icon={Users} label={`${car.seats} Seats`} />
        </div>

        <div className="mt-auto">
          <WhatsAppButton car={car} />
        </div>
      </div>
    </div>
  );
}
