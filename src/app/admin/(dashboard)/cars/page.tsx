import Image from "next/image";
import Link from "next/link";
import { Pencil, PlusCircle } from "lucide-react";
import { AvailabilitySwitch } from "@/components/admin/availability-switch";
import { DeleteCarButton } from "@/components/admin/delete-car-button";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { CarStatus } from "@/generated/prisma/client";
import { PLACEHOLDER_CAR_IMAGE } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";

// Always reflects live inventory — must never be frozen as a build-time
// static snapshot (and static generation would fail anyway: there's no
// reachable database during a Docker image build).
export const dynamic = "force-dynamic";

export default async function AdminCarsPage() {
  const cars = await db.car.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-heading text-2xl italic text-text-primary">Cars</h2>
          <p className="text-sm text-text-secondary">
            Manage your fleet, pricing and availability.
          </p>
        </div>
        <Link href="/admin/cars/new" className={cn(buttonVariants(), "gap-2")}>
          <PlusCircle className="size-4" />
          Add Car
        </Link>
      </div>

      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="font-heading text-lg italic text-text-primary">
            All Cars ({cars.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 sm:px-(--card-spacing)">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price / day</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cars.map((car) => {
                const name = `${car.make} ${car.model}`;

                return (
                  <TableRow key={car.id} className="border-border even:bg-surface">
                    <TableCell>
                      <div className="relative size-12 overflow-hidden rounded-lg bg-surface">
                        <Image
                          src={car.images[0] ?? PLACEHOLDER_CAR_IMAGE}
                          alt={name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-text-primary">{name}</p>
                      <p className="text-xs text-text-secondary">{car.year}</p>
                    </TableCell>
                    <TableCell className="font-medium text-gold">
                      {formatPrice(Number(car.pricePerDay))}
                    </TableCell>
                    <TableCell>
                      <AvailabilitySwitch
                        carId={car.id}
                        defaultChecked={car.status === CarStatus.AVAILABLE}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/cars/${car.id}`}
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "icon-sm" }),
                            "text-text-secondary hover:text-gold",
                          )}
                        >
                          <Pencil className="size-4" />
                          <span className="sr-only">Edit {name}</span>
                        </Link>
                        <DeleteCarButton id={car.id} name={name} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {cars.length === 0 && (
                <TableRow className="border-border">
                  <TableCell colSpan={5} className="py-10 text-center text-text-secondary">
                    No cars yet.{" "}
                    <Link href="/admin/cars/new" className="text-gold underline">
                      Add your first car
                    </Link>
                    .
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
