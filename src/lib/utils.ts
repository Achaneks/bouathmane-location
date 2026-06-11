import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { WHATSAPP_NUMBER } from "@/lib/constants"
import type { Car } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency = "MAD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getWhatsAppLink(car: Pick<Car, "name">) {
  const message = `Hello, I'm interested in renting the ${car.name}. Is it available?`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
