import "server-only";

import type { Car, CarInput } from "@/lib/types";
import { mockCars } from "@/lib/data/mock-cars";

/**
 * In-memory data store standing in for a database table.
 *
 * Every function below is `async` and returns plain data, mirroring the
 * shape a future Prisma repository (e.g. `prisma.car.findMany()`) would
 * have. Swapping the implementation for real Prisma/PostgreSQL calls later
 * should not require changes to any calling code.
 */
const globalForCars = globalThis as unknown as { __carStore?: Car[] };

const store: Car[] =
  globalForCars.__carStore ??
  (globalForCars.__carStore = mockCars.map((car) => ({ ...car })));

function nextId(): string {
  const max = store.reduce((acc, car) => Math.max(acc, Number(car.id) || 0), 0);
  return String(max + 1);
}

export async function getCars(): Promise<Car[]> {
  return [...store];
}

export async function getAvailableCars(): Promise<Car[]> {
  return store.filter((car) => car.available);
}

export async function getCarById(id: string): Promise<Car | undefined> {
  return store.find((car) => car.id === id);
}

export async function createCar(input: CarInput): Promise<Car> {
  const car: Car = { ...input, id: nextId() };
  store.push(car);
  return car;
}

export async function updateCar(
  id: string,
  input: Partial<CarInput>,
): Promise<Car | undefined> {
  const car = store.find((c) => c.id === id);
  if (!car) return undefined;
  Object.assign(car, input);
  return car;
}

export async function deleteCar(id: string): Promise<boolean> {
  const index = store.findIndex((c) => c.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
}

export async function toggleCarAvailability(id: string): Promise<Car | undefined> {
  const car = store.find((c) => c.id === id);
  if (!car) return undefined;
  car.available = !car.available;
  return car;
}

export async function getDashboardStats() {
  const cars = await getCars();
  const available = cars.filter((c) => c.available);
  const totalValue = cars.reduce((sum, c) => sum + c.pricePerDay, 0);
  return {
    totalCars: cars.length,
    availableCars: available.length,
    unavailableCars: cars.length - available.length,
    averagePricePerDay: cars.length ? Math.round(totalValue / cars.length) : 0,
  };
}
