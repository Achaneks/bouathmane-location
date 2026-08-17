"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { CarStatus } from "@/generated/prisma/client";
import { PLACEHOLDER_CAR_IMAGE } from "@/lib/constants";

interface CarInput {
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  description: string;
  status: CarStatus;
  images: string[];
}

function parseCarForm(formData: FormData): CarInput {
  const image = String(formData.get("image") ?? "").trim();
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
    images: [image || PLACEHOLDER_CAR_IMAGE],
  };
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
  const input = parseCarForm(formData);
  const slug = await uniqueSlug(slugify(input.make, input.model, input.year));

  await db.car.create({ data: { ...input, slug } });

  refreshCarPaths();
}

export async function updateCarAction(id: string, formData: FormData) {
  const input = parseCarForm(formData);
  const slug = await uniqueSlug(slugify(input.make, input.model, input.year), id);

  await db.car.update({ where: { id }, data: { ...input, slug } });

  refreshCarPaths();
}

export async function deleteCarAction(id: string) {
  await db.car.delete({ where: { id } });
  refreshCarPaths();
}

export async function updateCarStatusAction(id: string, status: CarStatus) {
  await db.car.update({ where: { id }, data: { status } });
  refreshCarPaths();
}
