import { CarForm } from "@/components/admin/car-form";
import { createCarAction } from "@/app/admin/(dashboard)/cars/actions";

export default function NewCarPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-2xl italic text-text-primary">Add Car</h2>
        <p className="text-sm text-text-secondary">
          Add a new vehicle to your rental fleet.
        </p>
      </div>
      <CarForm action={createCarAction} submitLabel="Add Car" />
    </div>
  );
}
