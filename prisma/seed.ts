import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { PrismaClient } from "../src/generated/prisma/client";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const ADMIN_EMAIL = "admin@bouathmanelocation.com";
const ADMIN_PASSWORD = "admin123";
const BCRYPT_COST = 12;

const cars = [
  {
    slug: "mercedes-s-class-2024",
    make: "Mercedes-Benz",
    model: "S-Class",
    year: 2024,
    description:
      "The pinnacle of German luxury sedans, offering unmatched comfort, cutting-edge technology, and a serene ride.",
    pricePerDay: 2500,
  },
  {
    slug: "bmw-7-series-2024",
    make: "BMW",
    model: "7 Series",
    year: 2024,
    description:
      "A flagship sedan blending dynamic performance with first-class rear-seat luxury.",
    pricePerDay: 2200,
  },
  {
    slug: "porsche-cayenne-2023",
    make: "Porsche",
    model: "Cayenne",
    year: 2023,
    description:
      "A high-performance luxury SUV that delivers sports-car handling with everyday practicality.",
    pricePerDay: 2000,
  },
  {
    slug: "range-rover-sport-2024",
    make: "Land Rover",
    model: "Range Rover Sport",
    year: 2024,
    description:
      "Bold and athletic, this SUV pairs commanding presence with refined off-road capability.",
    pricePerDay: 2300,
  },
  {
    slug: "bentley-bentayga-2023",
    make: "Bentley",
    model: "Bentayga",
    year: 2023,
    description:
      "Hand-crafted British luxury SUV combining opulent materials with formidable power.",
    pricePerDay: 3500,
  },
  {
    slug: "rolls-royce-ghost-2024",
    make: "Rolls-Royce",
    model: "Ghost",
    year: 2024,
    description:
      "The ultimate in effortless, whisper-quiet luxury motoring for those who expect the best.",
    pricePerDay: 5000,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, BCRYPT_COST);

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash },
    create: {
      email: ADMIN_EMAIL,
      passwordHash,
      name: "Admin",
    },
  });

  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      phone: "+212 6 00 00 00 00",
      email: "contact@bouathmanelocation.com",
      tagline: "Luxury car rentals, redefined.",
      socialUrls: {},
    },
  });

  for (const car of cars) {
    await prisma.car.upsert({
      where: { slug: car.slug },
      update: {
        make: car.make,
        model: car.model,
        year: car.year,
        description: car.description,
        pricePerDay: car.pricePerDay,
      },
      create: {
        slug: car.slug,
        make: car.make,
        model: car.model,
        year: car.year,
        description: car.description,
        pricePerDay: car.pricePerDay,
        images: [],
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
