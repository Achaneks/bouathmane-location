import { notFound } from "next/navigation";
import { CarForm } from "@/components/admin/car-form";
import { updateCarAction } from "@/app/admin/(dashboard)/cars/actions";
import { db } from "@/lib/db";

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = await db.car.findUnique({ where: { id } });

  if (!car) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-2xl italic text-text-primary">Edit Car</h2>
        <p className="text-sm text-text-secondary">
          Update details for {car.make} {car.model}.
        </p>
      </div>
      <CarForm
        car={{
          make: car.make,
          model: car.model,
          year: car.year,
          pricePerDay: Number(car.pricePerDay),
          description: car.description,
          status: car.status,
          image: car.images[0] ?? "",
        }}
        action={updateCarAction.bind(null, id)}
        submitLabel="Save Changes"
        pendingLabel="Saving..."
      />
    </div>
  );
}
