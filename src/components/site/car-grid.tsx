import { CarCard } from "@/components/site/car-card";
import { CarGridItem } from "@/components/site/car-grid-item";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";

export async function CarGrid() {
  const [cars, settings] = await Promise.all([
    db.car.findMany({ orderBy: { createdAt: "desc" } }),
    getSettings(),
  ]);
  const phone = settings?.phone ?? "";

  return (
    <section id="fleet" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="font-heading text-4xl italic text-text-primary sm:text-5xl">
            Our Fleet
          </h2>
          <div className="mt-4 h-0.5 w-10 bg-gold" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car, index) => (
            <CarGridItem key={car.id} index={index}>
              <CarCard
                car={{
                  id: car.id,
                  make: car.make,
                  model: car.model,
                  year: car.year,
                  pricePerDay: Number(car.pricePerDay),
                  images: car.images,
                  status: car.status,
                }}
                phone={phone}
              />
            </CarGridItem>
          ))}
        </div>
      </div>
    </section>
  );
}
