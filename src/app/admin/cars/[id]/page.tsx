import { notFound } from "next/navigation";
import { CarForm } from "@/components/admin/car-form";
import { updateCarAction } from "@/app/admin/cars/actions";
import { getCarById } from "@/lib/data/cars";

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = await getCarById(id);

  if (!car) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-2xl italic text-text-primary">Edit Car</h2>
        <p className="text-sm text-text-secondary">
          Update details for {car.name}.
        </p>
      </div>
      <CarForm
        car={car}
        action={updateCarAction.bind(null, id)}
        submitLabel="Save Changes"
      />
    </div>
  );
}
