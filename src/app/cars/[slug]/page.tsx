import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ArrowLeft } from "lucide-react";
import { CarGallery } from "@/components/site/car-gallery";
import { CarStatusBadge } from "@/components/site/car-status-badge";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { formatPrice } from "@/lib/utils";
import { CarStatus } from "@/generated/prisma/enums";

// Deduped per-request so generateMetadata and the page body share one query.
const getCarBySlug = cache((slug: string) => db.car.findUnique({ where: { slug } }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) return {};

  const name = `${car.make} ${car.model}`;
  return {
    title: `${name} (${car.year})`,
    description: car.description,
  };
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [car, settings] = await Promise.all([getCarBySlug(slug), getSettings()]);

  if (!car) notFound();

  const name = `${car.make} ${car.model}`;
  const phone = settings?.phone ?? "";
  const available = car.status === CarStatus.AVAILABLE;
  const message = `Bonjour, je voudrais louer la ${car.make} ${car.model} ${car.year}`;

  return (
    <main className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-5xl px-4 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <Link
          href="/#fleet"
          className="mb-8 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-gold"
        >
          <ArrowLeft className="size-4" />
          Back to Fleet
        </Link>

        <CarGallery images={car.images} name={name} />

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-border px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-text-secondary">
                {car.year}
              </span>
              <CarStatusBadge status={car.status} />
            </div>

            <h1 className="font-heading text-4xl italic text-text-primary sm:text-5xl">
              {name}
            </h1>

            <p className="max-w-2xl whitespace-pre-line text-text-secondary">
              {car.description}
            </p>
          </div>

          <div className="flex w-full flex-col gap-4 rounded-xl border border-border bg-surface-elevated p-6 lg:w-80 lg:shrink-0">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                Price per day
              </p>
              <p className="mt-1 text-3xl font-bold text-gold">
                {formatPrice(Number(car.pricePerDay))}
              </p>
            </div>

            <WhatsAppButton
              car={{ name, available }}
              phone={phone}
              label="Book this car on WhatsApp"
              message={message}
              className="h-12 text-base"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
