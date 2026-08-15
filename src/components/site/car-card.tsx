import Image from "next/image";
import { CarStatusBadge } from "@/components/site/car-status-badge";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { PLACEHOLDER_CAR_IMAGE } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { CarStatus } from "@/generated/prisma/enums";

export type CarCardData = {
  id: string;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  images: string[];
  status: CarStatus;
};

export function CarCard({ car }: { car: CarCardData }) {
  const name = `${car.make} ${car.model}`;
  const available = car.status === CarStatus.AVAILABLE;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface-elevated transition-colors duration-300 hover:border-gold">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={car.images[0] ?? PLACEHOLDER_CAR_IMAGE}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute top-3 right-3">
          <CarStatusBadge status={car.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="font-heading text-[22px] text-text-primary">
            {name} <span className="text-text-secondary">· {car.year}</span>
          </h3>
          <p className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-gold">
              {formatPrice(car.pricePerDay)}
            </span>
            <span className="text-sm text-text-muted">/ day</span>
          </p>
        </div>

        <div className="mt-auto">
          <WhatsAppButton car={{ name, available }} />
        </div>
      </div>
    </div>
  );
}
