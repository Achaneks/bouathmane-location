"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { CarStatus } from "@/generated/prisma/client";
import { PLACEHOLDER_CAR_IMAGE } from "@/lib/constants";
import { deleteCarImage, MAX_IMAGES_PER_CAR, saveCarImage } from "@/lib/car-images";

interface CarInput {
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  description: string;
  status: CarStatus;
}

function parseCarFields(formData: FormData): CarInput {
  const status = String(formData.get("status") ?? "");

  return {
    make: String(formData.get("make") ?? "").trim(),
    model: String(formData.get("model") ?? "").trim(),
    year: Number(formData.get("year") ?? new Date().getFullYear()),
    pricePerDay: Number(formData.get("pricePerDay") ?? 0),
    description: String(formData.get("description") ?? "").trim(),
    status: (Object.values(CarStatus) as string[]).includes(status)
      ? (status as CarStatus)
      : CarStatus.AVAILABLE,
  };
}

/**
 * Resolves the final images[] for a car from form data against the car's
 * current images in the DB (`serverImages`, [] for a new car). Any
 * "existingImages" value that isn't actually in `serverImages` is ignored,
 * so a tampered form can't be used to attribute another car's files to
 * this one. Anything in `serverImages` that isn't re-submitted is treated
 * as removed by the admin and deleted from disk.
 */
async function resolveImages(formData: FormData, serverImages: string[]) {
  const keptImages = formData
    .getAll("existingImages")
    .map(String)
    .filter((url) => serverImages.includes(url));

  const removedImages = serverImages.filter((url) => !keptImages.includes(url));

  const newImageInputs = formData.getAll("newImages").map(String);
  if (keptImages.length + newImageInputs.length > MAX_IMAGES_PER_CAR) {
    throw new Error(`A car can have at most ${MAX_IMAGES_PER_CAR} images`);
  }

  const newImages = await Promise.all(newImageInputs.map(saveCarImage));
  await Promise.all(removedImages.map(deleteCarImage));

  const images = [...keptImages, ...newImages];
  return images.length > 0 ? images : [PLACEHOLDER_CAR_IMAGE];
}

function slugify(make: string, model: string, year: number) {
  return `${make}-${model}-${year}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(base: string, excludeId?: string) {
  let slug = base;
  let suffix = 2;

  while (
    await db.car.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
      select: { id: true },
    })
  ) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

function refreshCarPaths() {
  revalidatePath("/admin/cars");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createCarAction(formData: FormData) {
  const input = parseCarFields(formData);
  const images = await resolveImages(formData, []);
  const slug = await uniqueSlug(slugify(input.make, input.model, input.year));

  await db.car.create({ data: { ...input, images, slug } });

  refreshCarPaths();
}

export async function updateCarAction(id: string, formData: FormData) {
  const car = await db.car.findUnique({ where: { id }, select: { images: true } });
  if (!car) throw new Error("Car not found");

  const input = parseCarFields(formData);
  const images = await resolveImages(formData, car.images);
  const slug = await uniqueSlug(slugify(input.make, input.model, input.year), id);

  await db.car.update({ where: { id }, data: { ...input, images, slug } });

  refreshCarPaths();
}

export async function deleteCarAction(id: string) {
  const car = await db.car.findUnique({ where: { id }, select: { images: true } });
  await db.car.delete({ where: { id } });
  if (car) await Promise.all(car.images.map(deleteCarImage));
  refreshCarPaths();
}

export async function updateCarStatusAction(id: string, status: CarStatus) {
  await db.car.update({ where: { id }, data: { status } });
  refreshCarPaths();
}
