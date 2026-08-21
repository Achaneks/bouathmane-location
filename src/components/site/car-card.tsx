import Image from "next/image";
import Link from "next/link";
import { CarStatusBadge } from "@/components/site/car-status-badge";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { PLACEHOLDER_CAR_IMAGE } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { CarStatus } from "@/generated/prisma/enums";

export type CarCardData = {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  images: string[];
  status: CarStatus;
};

export function CarCard({ car, phone }: { car: CarCardData; phone: string }) {
  const name = `${car.make} ${car.model}`;
  const available = car.status === CarStatus.AVAILABLE;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface-elevated transition-colors duration-300 hover:border-gold">
      {/* Full-card link as a sibling overlay, not an ancestor: WhatsAppButton
          renders an <a>, and nesting <a> in <a> is invalid HTML that breaks
          click handling. The WhatsApp wrapper below sits above this overlay
          (z-20 vs z-10) so it still intercepts its own clicks. */}
      <Link href={`/cars/${car.slug}`} className="absolute inset-0 z-10" aria-label={name} />

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

        <div className="relative z-20 mt-auto">
          <WhatsAppButton car={{ name, available }} phone={phone} />
        </div>
      </div>
    </div>
  );
}
