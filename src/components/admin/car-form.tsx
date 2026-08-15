"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ChangeEvent } from "react";
import { ImagePlus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CarStatus } from "@/generated/prisma/enums";

const STATUS_LABELS: Record<CarStatus, string> = {
  AVAILABLE: "Available",
  RENTED: "Rented",
  MAINTENANCE: "Maintenance",
};

export interface CarFormValues {
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  description: string;
  status: CarStatus;
  image: string;
}

export function CarForm({
  car,
  action,
  submitLabel = "Save Car",
}: {
  car?: CarFormValues;
  action: (formData: FormData) => void | Promise<void>;
  submitLabel?: string;
}) {
  const [imagePreview, setImagePreview] = useState(car?.image ?? "");

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-3">
      <input type="hidden" name="image" value={imagePreview} />

      <div className="flex flex-col gap-6 lg:col-span-2">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="font-heading text-lg italic text-text-primary">Car Details</CardTitle>
            <CardDescription>Basic information shown to customers.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                name="make"
                placeholder="e.g. Mercedes-Benz"
                defaultValue={car?.make}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                name="model"
                placeholder="e.g. S-Class"
                defaultValue={car?.model}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                type="number"
                min={1990}
                max={2100}
                step={1}
                placeholder="e.g. 2024"
                defaultValue={car?.year}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="pricePerDay">Price per day (MAD)</Label>
              <Input
                id="pricePerDay"
                name="pricePerDay"
                type="number"
                min={0}
                step={1}
                placeholder="e.g. 2500"
                defaultValue={car?.pricePerDay}
                required
              />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="A short description shown on the car details."
                defaultValue={car?.description}
                rows={3}
                required
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="font-heading text-lg italic text-text-primary">Photo</CardTitle>
            <CardDescription>Upload a high-quality image of the car.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-surface">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Car preview"
                  fill
                  className="object-cover"
                  unoptimized={imagePreview.startsWith("data:")}
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-text-secondary">
                  <ImagePlus className="size-8" />
                  <span className="text-sm">No image selected</span>
                </div>
              )}
            </div>

            <Label
              htmlFor="imageUpload"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full cursor-pointer justify-center gap-2",
              )}
            >
              <ImagePlus className="size-4" />
              {imagePreview ? "Change image" : "Upload image"}
            </Label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageChange}
            />
            <p className="text-xs text-text-muted">
              For this MVP, images are stored locally in the browser session.
              Connect VPS filesystem storage when wiring up uploads.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="font-heading text-lg italic text-text-primary">Status</CardTitle>
            <CardDescription>Set whether this car can be booked right now.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Availability status</Label>
              <Select name="status" defaultValue={car?.status ?? CarStatus.AVAILABLE}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CarStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full">
                {submitLabel}
              </Button>
              <Link
                href="/admin/cars"
                className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
              >
                Cancel
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
