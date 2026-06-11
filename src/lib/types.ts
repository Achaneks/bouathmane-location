export type FuelType = "Petrol" | "Diesel" | "Electric" | "Hybrid";

export type Transmission = "Automatic" | "Manual";

export interface Car {
  id: string;
  name: string;
  brand: string;
  pricePerDay: number;
  currency: string;
  image: string;
  available: boolean;
  fuelType: FuelType;
  transmission: Transmission;
  seats: number;
  description?: string;
}

export type CarInput = Omit<Car, "id">;
