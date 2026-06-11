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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { FUEL_TYPES, TRANSMISSIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Car } from "@/lib/types";

export function CarForm({
  car,
  action,
  submitLabel = "Save Car",
}: {
  car?: Car;
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
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="name">Car name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Mercedes-Benz C-Class"
                defaultValue={car?.name}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                name="brand"
                placeholder="e.g. Mercedes-Benz"
                defaultValue={car?.brand}
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
                placeholder="e.g. 1200"
                defaultValue={car?.pricePerDay}
                required
              />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="A short description shown on the car details."
                defaultValue={car?.description}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="font-heading text-lg italic text-text-primary">Specifications</CardTitle>
            <CardDescription>Help renters know what to expect.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="fuelType">Fuel type</Label>
              <Select name="fuelType" defaultValue={car?.fuelType ?? FUEL_TYPES[0]}>
                <SelectTrigger id="fuelType" className="w-full">
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  {FUEL_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="transmission">Transmission</Label>
              <Select
                name="transmission"
                defaultValue={car?.transmission ?? TRANSMISSIONS[0]}
              >
                <SelectTrigger id="transmission" className="w-full">
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSMISSIONS.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="seats">Seats</Label>
              <Input
                id="seats"
                name="seats"
                type="number"
                min={1}
                max={9}
                step={1}
                defaultValue={car?.seats ?? 5}
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
              Connect a storage provider (e.g. S3, Cloudinary) when wiring up
              the backend.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="font-heading text-lg italic text-text-primary">Availability</CardTitle>
            <CardDescription>
              Toggle whether this car can be booked right now.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <Label htmlFor="available" className="cursor-pointer">
                Available for rent
              </Label>
              <Switch
                id="available"
                name="available"
                defaultChecked={car?.available ?? true}
              />
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
