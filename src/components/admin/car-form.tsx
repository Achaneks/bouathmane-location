"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, ImagePlus, Loader2, X } from "lucide-react";
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

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGES = 10;

export interface CarFormValues {
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  description: string;
  status: CarStatus;
  images: string[];
}

interface NewImage {
  id: string;
  preview: string;
}

type FormStatus = "idle" | "pending" | "success";

export function CarForm({
  car,
  action,
  submitLabel = "Save Car",
  pendingLabel = "Saving...",
  successLabel = "Saved successfully",
}: {
  car?: CarFormValues;
  action: (formData: FormData) => void | Promise<void>;
  submitLabel?: string;
  pendingLabel?: string;
  successLabel?: string;
}) {
  const router = useRouter();
  const [existingImages, setExistingImages] = useState<string[]>(car?.images ?? []);
  const [newImages, setNewImages] = useState<NewImage[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [status, setStatus] = useState<FormStatus>("idle");
  // Guards against mobile's touch+click double-fire triggering two submits
  // before React re-renders the disabled button.
  const submittingRef = useRef(false);

  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => {
      router.push("/admin/cars");
    }, 2000);
    return () => clearTimeout(timer);
  }, [status, router]);

  function readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    const errors: string[] = [];
    const accepted: File[] = [];
    const totalCount = existingImages.length + newImages.length;

    for (const file of files) {
      if (totalCount + accepted.length >= MAX_IMAGES) {
        errors.push(`Only up to ${MAX_IMAGES} images are allowed per car`);
        break;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        errors.push(`'${file.name}' is too large (max 5MB per image)`);
        continue;
      }
      accepted.push(file);
    }

    setImageError(errors.length > 0 ? errors.join(" · ") : null);
    if (accepted.length === 0) return;

    const previews = await Promise.all(accepted.map(readFileAsDataUrl));
    setNewImages((prev) => [
      ...prev,
      ...previews.map((preview) => ({ id: crypto.randomUUID(), preview })),
    ]);
  }

  function removeExistingImage(url: string) {
    setExistingImages((prev) => prev.filter((image) => image !== url));
  }

  function removeNewImage(id: string) {
    setNewImages((prev) => prev.filter((image) => image.id !== id));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;

    const formData = new FormData(event.currentTarget);
    setStatus("pending");

    startTransition(async () => {
      try {
        await action(formData);
        setStatus("success");
      } catch (error) {
        setStatus("idle");
        throw error;
      } finally {
        submittingRef.current = false;
      }
    });
  }

  const isBusy = status !== "idle";

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      {existingImages.map((url) => (
        <input key={url} type="hidden" name="existingImages" value={url} />
      ))}
      {newImages.map((image) => (
        <input key={image.id} type="hidden" name="newImages" value={image.preview} />
      ))}

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
              <Label htmlFor="pricePerDay">Price Per Day (MAD)</Label>
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
            <CardTitle className="font-heading text-lg italic text-text-primary">Photos</CardTitle>
            <CardDescription>Upload high-quality images of the car. The first image is used as the main photo.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Label
              htmlFor="imageUpload"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full cursor-pointer justify-center gap-2",
              )}
            >
              <ImagePlus className="size-4" />
              Upload images
            </Label>
            <input
              id="imageUpload"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleFilesSelected}
            />
            {imageError && (
              <p role="alert" className="text-xs text-unavailable">
                {imageError}
              </p>
            )}
            <p className="text-xs text-text-muted">
              Click to upload images (max 5MB each, JPG/PNG/WebP)
            </p>

            {(existingImages.length > 0 || newImages.length > 0) && (
              <div className="grid grid-cols-3 gap-2">
                {existingImages.map((url) => (
                  <div
                    key={url}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-surface"
                  >
                    <Image src={url} alt="Car photo" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      aria-label="Remove image"
                      className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-unavailable"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
                {newImages.map((image) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-surface"
                  >
                    <Image
                      src={image.preview}
                      alt="Car photo preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(image.id)}
                      aria-label="Remove image"
                      className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-unavailable"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="font-heading text-lg italic text-text-primary">Status</CardTitle>
            <CardDescription>Set whether this car can be booked right now.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={car?.status ?? CarStatus.AVAILABLE}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CarStatus).map((statusOption) => (
                    <SelectItem key={statusOption} value={statusOption}>
                      {STATUS_LABELS[statusOption]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                className={cn(
                  "w-full gap-2",
                  status === "success" && "bg-available text-background hover:bg-available",
                )}
                disabled={isBusy}
              >
                {status === "pending" && (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {pendingLabel}
                  </>
                )}
                {status === "success" && (
                  <>
                    <CheckCircle2 className="size-4" />
                    {successLabel}
                  </>
                )}
                {status === "idle" && submitLabel}
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
