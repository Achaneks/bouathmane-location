import path from "node:path";
import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

dotenv.config({ path: path.resolve(__dirname, ".env.local") });

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
