"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createCar,
  deleteCar,
  toggleCarAvailability,
  updateCar,
} from "@/lib/data/cars";
import { PLACEHOLDER_CAR_IMAGE } from "@/lib/constants";
import type { CarInput, FuelType, Transmission } from "@/lib/types";

function parseCarForm(formData: FormData): CarInput {
  return {
    name: String(formData.get("name") ?? "").trim(),
    brand: String(formData.get("brand") ?? "").trim(),
    pricePerDay: Number(formData.get("pricePerDay") ?? 0),
    currency: "MAD",
    image: String(formData.get("image") ?? "").trim() || PLACEHOLDER_CAR_IMAGE,
    available: formData.get("available") === "on",
    fuelType: String(formData.get("fuelType")) as FuelType,
    transmission: String(formData.get("transmission")) as Transmission,
    seats: Number(formData.get("seats") ?? 0),
    description: String(formData.get("description") ?? "").trim() || undefined,
  };
}

function refreshCarPaths() {
  revalidatePath("/admin/cars");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createCarAction(formData: FormData) {
  const input = parseCarForm(formData);
  await createCar(input);
  refreshCarPaths();
  redirect("/admin/cars");
}

export async function updateCarAction(id: string, formData: FormData) {
  const input = parseCarForm(formData);
  await updateCar(id, input);
  refreshCarPaths();
  redirect("/admin/cars");
}

export async function deleteCarAction(id: string) {
  await deleteCar(id);
  refreshCarPaths();
}

export async function toggleAvailabilityAction(id: string) {
  await toggleCarAvailability(id);
  refreshCarPaths();
}
